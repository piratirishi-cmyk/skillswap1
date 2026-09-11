/**
 * Discover Page View
 * Multi-factor search & filter, compatibility scores, and partner exchange discovery
 */

import { store } from "../store/state.js";
import { calculateCompatibility } from "../services/matchingEngine.js";
import { SKILL_CATEGORIES } from "../data/mockData.js";
import { openMatchDetailsModal } from "./matchDetailsModal.js";
import { openSendRequestModal } from "./requestsView.js";

export function renderDiscoverView(onNavigate, initialParams = {}) {
  const container = document.createElement("div");
  container.className = "discover-view";

  const currentUser = store.getCurrentUser();

  // Filter state
  const filters = {
    searchQuery: initialParams.query || "",
    teachSkill: "",
    wantSkill: "",
    experienceLevel: "All",
    mode: "All",
    availability: "All",
    language: "All",
    category: "All Categories"
  };

  function getFilteredMatches() {
    const otherUsers = store.getOtherUsers();

    return otherUsers.map(user => {
      const matchData = calculateCompatibility(currentUser, user);
      return { user, ...matchData };
    }).filter(({ user }) => {
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        const matchesName = user.name.toLowerCase().includes(q);
        const matchesHeadline = (user.headline || "").toLowerCase().includes(q);
        const matchesBio = (user.bio || "").toLowerCase().includes(q);
        const matchesSkills = user.skillsTeach.some(s => s.name.toLowerCase().includes(q)) ||
                              user.skillsWant.some(s => s.name.toLowerCase().includes(q));
        if (!matchesName && !matchesHeadline && !matchesBio && !matchesSkills) return false;
      }

      if (filters.teachSkill) {
        const q = filters.teachSkill.toLowerCase();
        const hasTeach = user.skillsTeach.some(s => s.name.toLowerCase().includes(q));
        if (!hasTeach) return false;
      }

      if (filters.wantSkill) {
        const q = filters.wantSkill.toLowerCase();
        const hasWant = user.skillsWant.some(s => s.name.toLowerCase().includes(q));
        if (!hasWant) return false;
      }

      if (filters.category !== "All Categories") {
        const inCategory = user.skillsTeach.some(s => s.category === filters.category) ||
                           user.skillsWant.some(s => s.category === filters.category);
        if (!inCategory) return false;
      }

      if (filters.experienceLevel !== "All") {
        const hasLevel = user.skillsTeach.some(s => s.level === filters.experienceLevel);
        if (!hasLevel) return false;
      }

      if (filters.mode !== "All") {
        if (filters.mode === "online" && user.mode === "offline") return false;
        if (filters.mode === "offline" && user.mode === "online") return false;
      }

      if (filters.availability !== "All") {
        if (!user.availability.includes(filters.availability)) return false;
      }

      if (filters.language !== "All") {
        if (!user.languages.includes(filters.language)) return false;
      }

      return true;
    }).sort((a, b) => b.totalScore - a.totalScore);
  }

  function renderView() {
    const matches = getFilteredMatches();

    container.innerHTML = `
      <!-- Top Concept Barter Ribbon -->
      <div class="barter-concept-strip" style="margin-bottom:var(--space-6);">
        <span class="barter-concept-step step-teach">🎓 I teach my craft</span>
        <span class="barter-concept-arrow">➔</span>
        <span class="barter-concept-step step-learn">💡 You teach yours</span>
        <span class="barter-concept-arrow">➔</span>
        <span class="barter-concept-step step-grow">🌱 We both grow</span>
      </div>

      <!-- Page Header -->
      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:var(--space-6); flex-wrap:wrap; gap:var(--space-3);">
        <div>
          <h1 style="font-size:24px;">Discover Skill Partners</h1>
          <p style="font-size:13.5px; color:var(--text-muted); margin-top:2px;">
            Find community members whose teaching skills match what you want to learn, and vice versa.
          </p>
        </div>
        <button class="btn btn-primary btn-sm" id="btn-smart-ai" data-nav="ai-matchmaker">
          ✨ AI Skill Matchmaker
        </button>
      </div>

      <!-- Advanced Filter Bar -->
      <div class="discover-filter-bar">
        <div class="filter-row-top">
          <!-- Keyword Search -->
          <div class="form-group" style="margin-bottom:0;">
            <input type="text" class="form-input" id="filter-search" value="${filters.searchQuery}" placeholder="Search by name, skill, or keyword..." />
          </div>

          <!-- Skill They Teach -->
          <div class="form-group" style="margin-bottom:0;">
            <input type="text" class="form-input" id="filter-teach" value="${filters.teachSkill}" placeholder="Skill they teach..." />
          </div>

          <!-- Experience Level -->
          <div class="form-group" style="margin-bottom:0;">
            <select class="form-select" id="filter-exp">
              <option value="All" ${filters.experienceLevel === "All" ? "selected" : ""}>All Experience Levels</option>
              <option value="Intermediate" ${filters.experienceLevel === "Intermediate" ? "selected" : ""}>Intermediate</option>
              <option value="Advanced" ${filters.experienceLevel === "Advanced" ? "selected" : ""}>Advanced</option>
              <option value="Expert" ${filters.experienceLevel === "Expert" ? "selected" : ""}>Expert</option>
            </select>
          </div>

          <!-- Mode -->
          <div class="form-group" style="margin-bottom:0;">
            <select class="form-select" id="filter-mode">
              <option value="All" ${filters.mode === "All" ? "selected" : ""}>All Meeting Modes</option>
              <option value="online" ${filters.mode === "online" ? "selected" : ""}>Online Video Only</option>
              <option value="offline" ${filters.mode === "offline" ? "selected" : ""}>In-Person Safe Spots</option>
            </select>
          </div>
        </div>

        <!-- Filter Row 2: Category Pills & Secondary Filters -->
        <div style="display:flex; align-items:center; justify-content:space-between; gap:var(--space-4); margin-top:var(--space-2); flex-wrap:wrap;">
          <div class="filter-row-categories">
            ${SKILL_CATEGORIES.map(cat => `
              <button class="category-chip ${filters.category === cat ? "active" : ""}" data-category="${cat}">
                ${cat}
              </button>
            `).join("")}
          </div>

          <div style="display:flex; align-items:center; gap:var(--space-2); flex-wrap:wrap;">
            <select class="form-select btn-sm" id="filter-avail" style="width:auto; font-size:12px;">
              <option value="All" ${filters.availability === "All" ? "selected" : ""}>Availability: Any</option>
              <option value="Weekends" ${filters.availability === "Weekends" ? "selected" : ""}>Weekends</option>
              <option value="Evenings" ${filters.availability === "Evenings" ? "selected" : ""}>Evenings</option>
              <option value="Weekdays" ${filters.availability === "Weekdays" ? "selected" : ""}>Weekdays</option>
            </select>

            <select class="form-select btn-sm" id="filter-lang" style="width:auto; font-size:12px;">
              <option value="All" ${filters.language === "All" ? "selected" : ""}>Language: Any</option>
              <option value="English" ${filters.language === "English" ? "selected" : ""}>English</option>
              <option value="Spanish" ${filters.language === "Spanish" ? "selected" : ""}>Spanish</option>
              <option value="French" ${filters.language === "French" ? "selected" : ""}>French</option>
              <option value="Mandarin" ${filters.language === "Mandarin" ? "selected" : ""}>Mandarin</option>
            </select>

            ${(filters.searchQuery || filters.teachSkill || filters.wantSkill || filters.category !== "All Categories" || filters.experienceLevel !== "All") ? `
              <button class="btn btn-ghost btn-sm" id="btn-clear-filters" style="font-size:12px;">Reset</button>
            ` : ""}
          </div>
        </div>
      </div>

      <!-- Results Count & Live Grid -->
      <div style="margin-bottom:var(--space-4); font-size:13px; color:var(--text-muted); font-weight:600;">
        Showing ${matches.length} compatible skill barter partner${matches.length === 1 ? '' : 's'}
      </div>

      ${matches.length === 0 ? `
        <div class="empty-state card">
          <div class="empty-state-icon">🔍</div>
          <div class="empty-state-title">No matching partners found</div>
          <div class="empty-state-desc">Try clearing filters or broadening your search keywords to discover more community members.</div>
          <button class="btn btn-secondary btn-sm" id="empty-clear-btn">Clear All Filters</button>
        </div>
      ` : `
        <div class="match-cards-grid">
          ${matches.map(m => renderDiscoverCard(m)).join("")}
        </div>
      `}
    `;

    bindFilterEvents();
  }

  function bindFilterEvents() {
    container.querySelector("#btn-smart-ai")?.addEventListener("click", () => onNavigate("ai-matchmaker"));

    const searchInput = container.querySelector("#filter-search");
    searchInput?.addEventListener("input", (e) => {
      filters.searchQuery = e.target.value;
      renderView();
    });

    const teachInput = container.querySelector("#filter-teach");
    teachInput?.addEventListener("input", (e) => {
      filters.teachSkill = e.target.value;
      renderView();
    });

    const expSelect = container.querySelector("#filter-exp");
    expSelect?.addEventListener("change", (e) => {
      filters.experienceLevel = e.target.value;
      renderView();
    });

    const modeSelect = container.querySelector("#filter-mode");
    modeSelect?.addEventListener("change", (e) => {
      filters.mode = e.target.value;
      renderView();
    });

    const availSelect = container.querySelector("#filter-avail");
    availSelect?.addEventListener("change", (e) => {
      filters.availability = e.target.value;
      renderView();
    });

    const langSelect = container.querySelector("#filter-lang");
    langSelect?.addEventListener("change", (e) => {
      filters.language = e.target.value;
      renderView();
    });

    container.querySelectorAll(".category-chip").forEach(chip => {
      chip.addEventListener("click", () => {
        filters.category = chip.getAttribute("data-category");
        renderView();
      });
    });

    const clearBtn = container.querySelector("#btn-clear-filters") || container.querySelector("#empty-clear-btn");
    clearBtn?.addEventListener("click", () => {
      filters.searchQuery = "";
      filters.teachSkill = "";
      filters.wantSkill = "";
      filters.experienceLevel = "All";
      filters.mode = "All";
      filters.availability = "All";
      filters.language = "All";
      filters.category = "All Categories";
      renderView();
    });

    container.querySelectorAll("[data-view-profile]").forEach(btn => {
      btn.addEventListener("click", () => {
        const uid = btn.getAttribute("data-view-profile");
        openMatchDetailsModal(uid, onNavigate);
      });
    });

    container.querySelectorAll("[data-request-exchange]").forEach(btn => {
      btn.addEventListener("click", () => {
        const uid = btn.getAttribute("data-request-exchange");
        openSendRequestModal(uid);
      });
    });
  }

  renderView();
  return container;
}

function renderDiscoverCard(match) {
  const { user, totalScore, isTwoWayMatch } = match;

  return `
    <div class="match-card">
      <div class="match-card-top">
        <div class="match-card-profile">
          <div class="avatar avatar-lg">
            <img src="${user.avatar}" alt="${user.name}" />
            <div class="avatar-status ${user.online ? 'online' : 'offline'}"></div>
            ${user.verified ? `<div class="avatar-verified" title="Identity Verified">✓</div>` : ""}
          </div>
          <div>
            <div class="match-card-name">
              <span>${user.name}</span>
            </div>
            <div class="match-card-headline">${user.headline}</div>
            <div style="font-size:11px; color:var(--text-subtle); margin-top:2px;">
              📍 ${user.location} · 🗣️ ${user.languages.join(", ")}
            </div>
          </div>
        </div>

        <div style="text-align:right;">
          <span class="match-score-badge ${totalScore >= 80 ? 'high' : 'medium'}">
            ⚡ ${totalScore}% Match
          </span>
          ${isTwoWayMatch ? `
            <div style="font-size:10px; font-weight:700; color:var(--teach-dark); margin-top:3px;">
              ✓ Two-Way Barter
            </div>
          ` : ''}
        </div>
      </div>

      <div class="match-card-bio">
        ${user.bio}
      </div>

      <div class="match-card-skills-section">
        <div>
          <div class="skills-subheading" style="color:var(--teach-dark);">TEACHES:</div>
          <div style="display:flex; flex-wrap:wrap; gap:4px; margin-top:4px;">
            ${user.skillsTeach.map(s => `
              <span class="skill-tag skill-tag-teach">
                <strong>${s.name}</strong> (${s.level})
              </span>
            `).join("")}
          </div>
        </div>

        <div style="margin-top:4px;">
          <div class="skills-subheading" style="color:var(--want-dark);">WANTS:</div>
          <div style="display:flex; flex-wrap:wrap; gap:4px; margin-top:4px;">
            ${user.skillsWant.map(s => `
              <span class="skill-tag skill-tag-want">
                <strong>${s.name}</strong> (${s.targetLevel})
              </span>
            `).join("")}
          </div>
        </div>
      </div>

      <div class="match-card-footer">
        <div style="font-size:12px; font-weight:600; color:var(--text-muted);">
          ⭐ ${user.rating} (${user.completedExchanges || 0} swaps)
        </div>

        <div class="flex gap-2">
          <button class="btn btn-secondary btn-sm" data-view-profile="${user.id}">
            Why You Match
          </button>
          <button class="btn btn-primary btn-sm" data-request-exchange="${user.id}">
            Exchange
          </button>
        </div>
      </div>
    </div>
  `;
}
