/**
 * Navbar & Shell Manager
 * Handles route synchronization, user switcher, credits pill, and sidebar interactions
 */

import { store } from "../store/state.js";
import { toast } from "./toast.js";

export class NavbarManager {
  constructor(onNavigate) {
    this.onNavigate = onNavigate;
    this.initListeners();
  }

  initListeners() {
    store.subscribe("state:changed", () => this.updateDynamicElements());
    store.subscribe("user:switched", (user) => {
      toast.info("Account Switched", `Now exploring as ${user.name}`);
      this.updateDynamicElements();
    });
  }

  renderSidebar(activeRoute = "dashboard") {
    const currentUser = store.getCurrentUser();
    const pendingRequestsCount = store.getPendingRequestsCount();

    const navItems = [
      { id: "dashboard", label: "Dashboard", icon: "📊" },
      { id: "discover", label: "Discover Matches", icon: "🔍" },
      { id: "ai-matchmaker", label: "AI Matchmaker", icon: "✨", badge: "Smart" },
      { id: "requests", label: "Exchange Requests", icon: "📥", count: pendingRequestsCount },
      { id: "messages", label: "Messages", icon: "💬" },
      { id: "sessions", label: "Exchange Sessions", icon: "📅" },
      { id: "progress", label: "Skill Progress", icon: "🎯" },
      { id: "credits", label: "Skill Credits", icon: "🪙", count: `${currentUser.skillCredits || 0} Cr` },
      { id: "community", label: "Community Feed", icon: "👥" },
      { id: "profile", label: "My Profile", icon: "👤" }
    ];

    return `
      <div class="sidebar-header">
        <a href="#landing" class="brand-logo" data-nav="landing">
          <div class="brand-icon">⇄</div>
          <span>SkillSwap</span>
        </a>
      </div>

      <div class="sidebar-nav">
        <div class="nav-section-title">Platform</div>
        ${navItems.map(item => `
          <div class="nav-item ${activeRoute === item.id ? "active" : ""}" data-nav="${item.id}">
            <span class="nav-icon">${item.icon}</span>
            <span>${item.label}</span>
            ${item.count ? `<span class="nav-badge">${item.count}</span>` : ""}
            ${item.badge ? `<span class="badge badge-primary" style="margin-left:auto; font-size:10px; padding:1px 6px;">${item.badge}</span>` : ""}
          </div>
        `).join("")}
      </div>

      <div class="sidebar-footer">
        <!-- Hackathon Sandbox Account Switcher -->
        <div class="demo-switcher-card">
          <div class="demo-switcher-label">
            <span>⚡ Sandbox Accounts</span>
            <button class="btn-ghost btn-sm" id="btn-reset-demo" title="Reset all state to initial seed data" style="padding:1px 6px; font-size:10px; font-weight:700;">Reset</button>
          </div>
          <div style="font-size:10.5px; color:var(--text-muted);">
            Test two-way barter as either partner:
          </div>

          <!-- Alex Rivera -->
          <button class="demo-user-btn ${currentUser.id === "user-alex" ? "active" : ""}" data-switch-user="user-alex">
            <span style="font-size:14px;">🎸</span>
            <div class="demo-user-info">
              <div class="demo-user-name">Alex Rivera</div>
              <div class="demo-user-role">Teaches Guitar · Wants Art</div>
            </div>
            ${currentUser.id === "user-alex" ? `<span style="color:var(--primary); font-weight:800; font-size:12px;">✓</span>` : ""}
          </button>

          <!-- Maya Lin -->
          <button class="demo-user-btn ${currentUser.id === "user-maya" ? "active" : ""}" data-switch-user="user-maya">
            <span style="font-size:14px;">🎨</span>
            <div class="demo-user-info">
              <div class="demo-user-name">Maya Lin</div>
              <div class="demo-user-role">Teaches Art · Wants Guitar</div>
            </div>
            ${currentUser.id === "user-maya" ? `<span style="color:var(--primary); font-weight:800; font-size:12px;">✓</span>` : ""}
          </button>
        </div>

        <!-- Safety & Guidelines button -->
        <button class="btn btn-secondary btn-sm w-full" id="btn-open-safety" style="font-size:11px; font-weight:600;">
          🛡️ Trust & Safety Guidelines
        </button>
      </div>
    `;
  }

  renderTopbar(activeRoute = "dashboard") {
    const currentUser = store.getCurrentUser();

    return `
      <div class="topbar-left">
        <button class="mobile-menu-toggle btn-icon" id="mobile-toggle" aria-label="Toggle menu">☰</button>
        <div class="topbar-search">
          <span style="font-size:13px; color:var(--text-muted);">🔍</span>
          <input type="text" id="global-search-input" placeholder="Search skills, people, topics..." />
          <span class="topbar-search-kbd">/</span>
        </div>
      </div>

      <div class="topbar-right">
        <!-- Skill Credits Pill -->
        <div class="credits-pill" data-nav="credits" title="Virtual Skill Economy (1 hr taught = 1 Credit)">
          <div class="credits-coin">⚡</div>
          <div class="credits-value" id="topbar-credits-val">${currentUser.skillCredits || 0} Credits</div>
        </div>

        <!-- AI Match Shortcut -->
        <button class="btn btn-primary btn-sm" id="btn-quick-match" data-nav="ai-matchmaker">
          ✨ AI Match
        </button>

        <!-- User Profile Dropdown / Trigger -->
        <div class="user-menu-btn" data-nav="profile" title="View Profile">
          <div class="avatar avatar-sm">
            <img src="${currentUser.avatar}" alt="${currentUser.name}" />
            <div class="avatar-status online"></div>
          </div>
          <div class="user-menu-info">
            <div class="user-menu-name">${currentUser.name}</div>
            <div class="user-menu-headline">${currentUser.role || "Member"}</div>
          </div>
        </div>
      </div>
    `;
  }

  bindEvents(container) {
    container.querySelectorAll("[data-nav]").forEach(el => {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        const route = el.getAttribute("data-nav");
        if (this.onNavigate) this.onNavigate(route);
      });
    });

    container.querySelectorAll("[data-switch-user]").forEach(el => {
      el.addEventListener("click", () => {
        const targetUserId = el.getAttribute("data-switch-user");
        store.switchDemoUser(targetUserId);
        if (this.onNavigate) this.onNavigate("dashboard");
      });
    });

    const resetBtn = container.querySelector("#btn-reset-demo");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        if (confirm("Reset SkillSwap to initial clean mock state?")) {
          store.resetToDefaults();
          toast.success("State Reset", "Demo data restored to initial state.");
          if (this.onNavigate) this.onNavigate("dashboard");
        }
      });
    }

    const safetyBtn = container.querySelector("#btn-open-safety");
    if (safetyBtn) {
      safetyBtn.addEventListener("click", () => {
        if (this.onNavigate) this.onNavigate("safety");
      });
    }

    const mobileToggle = container.querySelector("#mobile-toggle");
    const sidebar = document.querySelector(".app-sidebar");
    if (mobileToggle && sidebar) {
      mobileToggle.addEventListener("click", () => {
        sidebar.classList.toggle("open");
      });
    }

    const searchInput = container.querySelector("#global-search-input");
    if (searchInput) {
      searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && searchInput.value.trim()) {
          const q = searchInput.value.trim();
          if (this.onNavigate) this.onNavigate("discover", { query: q });
        }
      });
    }

    // Keyboard shortcut '/' to focus search
    document.addEventListener("keydown", (e) => {
      if (e.key === "/" && document.activeElement !== searchInput && document.activeElement?.tagName !== "TEXTAREA" && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault();
        searchInput?.focus();
      }
    });
  }

  updateDynamicElements() {
    const currentUser = store.getCurrentUser();
    const creditsEl = document.getElementById("topbar-credits-val");
    if (creditsEl) {
      creditsEl.textContent = `${currentUser.skillCredits || 0} Credits`;
    }
  }
}
