/**
 * SkillSwap Main Application Orchestrator
 * Client-side router, view mounting, and shell coordinator
 */

import { store } from "./store/state.js";
import { NavbarManager } from "./components/navbar.js";
import { LoginView } from "./views/loginView.js";
import { SignupView } from "./views/signupView.js";
import { renderLandingView } from "./views/landingView.js";
import { renderDashboardView } from "./views/dashboardView.js";
import { renderDiscoverView } from "./views/discoverView.js";
import { renderAiMatchmakerView } from "./views/aiMatchmakerView.js";
import { renderRequestsView } from "./views/requestsView.js";
import { renderMessagesView } from "./views/messagesView.js";
import { renderSessionsView } from "./views/sessionsView.js";
import { renderProgressView } from "./views/progressView.js";
import { renderCreditsView } from "./views/creditsView.js";
import { renderCommunityView } from "./views/communityView.js";
import { renderProfileView } from "./views/profileView.js";
import { renderOnboardingView } from "./views/onboardingView.js";
import { openSafetyModal } from "./views/safetyModal.js";
import { AuthService } from "./services/authService.js";

class SkillSwapApp {
  constructor() {
    this.appRoot = document.getElementById("app");
    this.currentRoute = "landing";
    this.routeParams = {};
    this.navbarManager = new NavbarManager((route, params) => this.navigate(route, params));
    this.authService = new AuthService(store);

    window.addEventListener("hashchange", () => this.handleHashChange());
  }

  init() {
    const initialHash = window.location.hash.replace("#", "");
    if (initialHash) {
      this.navigate(initialHash, {}, false);
    } else {
      this.navigate("landing", {}, false);
    }

    // Subscribe to state change for global badge updates
    store.subscribe("state:changed", () => {
      this.updateBadges();
    });
  }

  handleHashChange() {
    const hash = window.location.hash.replace("#", "") || "landing";
    if (hash !== this.currentRoute) {
      this.navigate(hash, {}, false);
    }
  }

  navigate(route, params = {}, updateHash = true) {
    if (route === "safety") {
      openSafetyModal();
      return;
    }

    this.currentRoute = route;
    this.routeParams = params || {};

    if (updateHash) {
      window.location.hash = route;
    }

    this.render();
  }

  render() {
    this.appRoot.innerHTML = "";

    // If on marketing landing page or standalone onboarding
    if (this.currentRoute === "landing") {
      const landingEl = renderLandingView((route) => this.navigate(route));
      this.appRoot.appendChild(landingEl);
      return;
    }

    if (this.currentRoute === "onboarding") {
      const onboardingEl = renderOnboardingView((route) => this.navigate(route));
      this.appRoot.appendChild(onboardingEl);
      return;
    }

    // Authentication views (no app shell)
    if (this.currentRoute === "login") {
      const loginView = new LoginView(store);
      const loginEl = document.createElement("div");
      loginEl.innerHTML = loginView.render();
      this.appRoot.appendChild(loginEl);
      loginView.attachEventListeners();
      return;
    }

    if (this.currentRoute === "signup") {
      const signupView = new SignupView(store);
      const signupEl = document.createElement("div");
      signupEl.innerHTML = signupView.render();
      this.appRoot.appendChild(signupEl);
      signupView.attachEventListeners();
      return;
    }

    // Standard App Shell with Sidebar & Topbar
    const appWrapper = document.createElement("div");
    appWrapper.className = "app-wrapper";

    // Sidebar
    const sidebarEl = document.createElement("aside");
    sidebarEl.className = "app-sidebar";
    sidebarEl.innerHTML = this.navbarManager.renderSidebar(this.currentRoute);
    appWrapper.appendChild(sidebarEl);

    // Main layout
    const mainEl = document.createElement("div");
    mainEl.className = "app-main";

    // Topbar
    const topbarEl = document.createElement("header");
    topbarEl.className = "app-topbar";
    topbarEl.innerHTML = this.navbarManager.renderTopbar(this.currentRoute);
    mainEl.appendChild(topbarEl);

    // View content container
    const viewContainer = document.createElement("main");
    viewContainer.className = "app-view-container";

    // Mount active view
    let activeViewNode = null;
    switch (this.currentRoute) {
      case "dashboard":
        activeViewNode = renderDashboardView((r, p) => this.navigate(r, p));
        break;
      case "discover":
        activeViewNode = renderDiscoverView((r, p) => this.navigate(r, p), this.routeParams);
        break;
      case "ai-matchmaker":
        activeViewNode = renderAiMatchmakerView((r, p) => this.navigate(r, p));
        break;
      case "requests":
        activeViewNode = renderRequestsView((r, p) => this.navigate(r, p));
        break;
      case "messages":
        activeViewNode = renderMessagesView((r, p) => this.navigate(r, p), this.routeParams);
        break;
      case "sessions":
        activeViewNode = renderSessionsView((r, p) => this.navigate(r, p));
        break;
      case "progress":
        activeViewNode = renderProgressView((r, p) => this.navigate(r, p));
        break;
      case "credits":
        activeViewNode = renderCreditsView((r, p) => this.navigate(r, p));
        break;
      case "community":
        activeViewNode = renderCommunityView((r, p) => this.navigate(r, p));
        break;
      case "profile":
        activeViewNode = renderProfileView((r, p) => this.navigate(r, p));
        break;
      default:
        activeViewNode = renderDashboardView((r, p) => this.navigate(r, p));
        break;
    }

    if (activeViewNode) {
      viewContainer.appendChild(activeViewNode);
    }
    mainEl.appendChild(viewContainer);
    appWrapper.appendChild(mainEl);
    this.appRoot.appendChild(appWrapper);

    // Bind shell events
    this.navbarManager.bindEvents(appWrapper);
  }

  updateBadges() {
    // If currently rendering inside app shell, refresh topbar credits & sidebar counters
    const creditsEl = document.getElementById("topbar-credits-val");
    if (creditsEl) {
      const currentUser = store.getCurrentUser();
      creditsEl.textContent = `${currentUser.skillCredits || 0} Credits`;
    }
  }
}

// Bootstrap application on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  const app = new SkillSwapApp();
  app.init();
});
