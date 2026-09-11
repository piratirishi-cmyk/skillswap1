/**
 * SkillSwap User Profile View
 * Enhanced profile with authentication, tabs, and user management
 */

import { store } from "../store/state.js";
import { modal } from "../components/modal.js";
import { toast } from "../components/toast.js";

export function renderProfileView(onNavigate) {
  const container = document.createElement("div");
  container.className = "profile-view";

  function renderView() {
    const currentUser = store.getCurrentUser();
    const badges = currentUser.badges || [];

    container.innerHTML = `
      <!-- Profile Header Banner -->
      <div class="card" style="padding:var(--space-8); margin-bottom:var(--space-6); position:relative; overflow:hidden;">
        <div style="display:flex; align-items:flex-start; justify-content:space-between; flex-wrap:wrap; gap:var(--space-4);">
          <div class="flex items-center gap-5">
            <div class="avatar avatar-xl" style="width:88px; height:88px;">
              <img src="${currentUser.avatar}" alt="${currentUser.name}" />
              <div class="avatar-status online"></div>
              ${currentUser.verified ? `<div class="avatar-verified" style="width:22px; height:22px; font-size:12px;">✓</div>` : ""}
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h1 style="font-size:24px;">${currentUser.name}</h1>
                ${currentUser.verified ? `<span class="badge badge-success">Verified Identity</span>` : ""}
                <span class="badge badge-primary">Skill Barter Pro</span>
              </div>
              <div style="font-size:14px; color:var(--text-muted); margin-top:2px;">${currentUser.headline}</div>
              <div style="font-size:13px; color:var(--text-secondary); margin-top:6px;">
                📍 ${currentUser.location} · 🗣️ ${currentUser.languages.join(", ")} · 🌐 ${currentUser.mode === 'both' ? 'Online & In-Person' : currentUser.mode}
              </div>
            </div>
          </div>

          <div class="flex gap-2">
            <button class="btn btn-secondary btn-sm" id="btn-edit-profile">
              ✏️ Edit Profile
            </button>
          </div>
        </div>

        <div style="margin-top:var(--space-6); font-size:14px; color:var(--text-secondary); line-height:1.6; max-width:820px;">
          ${currentUser.bio}
        </div>
      </div>

      <!-- Reputation & Ratings Breakdown Card -->
      <div class="card" style="padding:var(--space-6); margin-bottom:var(--space-6);">
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:var(--space-4);">
          <div>
            <h3 style="font-size:18px;">Reputation & Peer Reviews</h3>
            <p style="font-size:13px; color:var(--text-muted);">
              Calculated from post-session peer reviews after completed exchanges.
            </p>
          </div>
          <div style="text-align:right;">
            <div style="font-size:22px; font-weight:800; color:var(--text-primary);">
              ⭐ ${currentUser.rating} <span style="font-size:13px; color:var(--text-muted); font-weight:500;">/ 5.0</span>
            </div>
            <div style="font-size:12px; color:var(--text-muted);">${currentUser.completedExchanges || 0} completed barter exchanges</div>
          </div>
        </div>

        <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:var(--space-4); background:var(--bg-surface-subtle); padding:var(--space-4); border-radius:var(--radius-lg); text-align:center;">
          <div>
            <div style="font-size:12px; font-weight:600; color:var(--text-muted);">TEACHING QUALITY</div>
            <div style="font-size:20px; font-weight:800; color:var(--success); margin-top:2px;">
              ${currentUser.ratingsBreakdown?.teachingQuality || 4.9}★
            </div>
            <div style="font-size:11px; color:var(--text-subtle);">Clarity, structure, depth</div>
          </div>

          <div>
            <div style="font-size:12px; font-weight:600; color:var(--text-muted);">COMMUNICATION</div>
            <div style="font-size:20px; font-weight:800; color:var(--primary); margin-top:2px;">
              ${currentUser.ratingsBreakdown?.communication || 5.0}★
            </div>
            <div style="font-size:11px; color:var(--text-subtle);">Respectful, fast responses</div>
          </div>

          <div>
            <div style="font-size:12px; font-weight:600; color:var(--text-muted);">RELIABILITY</div>
            <div style="font-size:20px; font-weight:800; color:var(--warning-hover); margin-top:2px;">
              ${currentUser.ratingsBreakdown?.reliability || 4.8}★
            </div>
            <div style="font-size:11px; color:var(--text-subtle);">Punctuality, full 60 mins</div>
          </div>
        </div>
      </div>

      <!-- Skills Matrix (Teaches vs Wants) -->
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:var(--space-6); margin-bottom:var(--space-6);">
        <!-- Skills I Teach -->
        <div class="card" style="padding:var(--space-5);">
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:var(--space-4);">
            <h3 style="font-size:16px; color:var(--success); display:flex; align-items:center; gap:6px;">
              <span>🎓</span>
              <span>Skills I Can Teach</span>
            </h3>
            <span class="badge badge-success">${(currentUser.skillsTeach || []).length} Skills</span>
          </div>

          <div style="display:flex; flex-direction:column; gap:var(--space-3);">
            ${(currentUser.skillsTeach || []).map(s => `
              <div style="background:var(--bg-surface-subtle); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:var(--space-3);">
                <div class="flex items-center justify-between">
                  <span style="font-weight:700; font-size:14px;">${s.name}</span>
                  <span class="badge badge-success">${s.level}</span>
                </div>
                <div style="font-size:12px; color:var(--text-muted); margin-top:2px;">
                  Category: ${s.category} · ${s.description || ''}
                </div>
              </div>
            `).join("")}
          </div>
        </div>

        <!-- Skills I Want -->
        <div class="card" style="padding:var(--space-5);">
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:var(--space-4);">
            <h3 style="font-size:16px; color:var(--primary); display:flex; align-items:center; gap:6px;">
              <span>🎯</span>
              <span>Skills I Want to Learn</span>
            </h3>
            <span class="badge badge-primary">${(currentUser.skillsWant || []).length} Goals</span>
          </div>

          <div style="display:flex; flex-direction:column; gap:var(--space-3);">
            ${(currentUser.skillsWant || []).map(s => `
              <div style="background:var(--bg-surface-subtle); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:var(--space-3);">
                <div class="flex items-center justify-between">
                  <span style="font-weight:700; font-size:14px;">${s.name}</span>
                  <span class="badge badge-primary">Target: ${s.targetLevel}</span>
                </div>
                <div style="font-size:12px; color:var(--text-muted); margin-top:2px;">
                  Category: ${s.category} · ${s.goal || ''}
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      </div>

      <!-- Badges & Achievements Section -->
      <div class="card" style="padding:var(--space-6);">
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:var(--space-4);">
          <div>
            <h3 style="font-size:18px;">Badges & Milestones</h3>
            <p style="font-size:13px; color:var(--text-muted);">
              Earn recognition through consistent peer teaching, reliable barters, and learning streaks.
            </p>
          </div>
          <span class="badge badge-primary">${badges.filter(b => b.unlocked).length} of ${badges.length} Unlocked</span>
        </div>

        <div class="badges-grid">
          ${badges.map(b => `
            <div class="badge-achievement-card ${b.unlocked ? '' : 'locked'}">
              <div class="badge-icon-box">${b.icon}</div>
              <div>
                <div style="font-size:14px; font-weight:700; color:var(--text-primary);">
                  ${b.title}
                </div>
                <div style="font-size:11px; color:var(--text-muted); margin-top:2px;">
                  ${b.description}
                </div>
                <div style="margin-top:4px;">
                  ${b.unlocked ? `
                    <span class="badge badge-success" style="font-size:9px; padding:1px 6px;">✓ Unlocked</span>
                  ` : `
                    <span class="badge badge-outline" style="font-size:9px; padding:1px 6px;">In Progress</span>
                  `}
                </div>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    `;

    bindEvents();
  }

  function bindEvents() {
    container.querySelector("#btn-edit-profile")?.addEventListener("click", () => {
      openEditProfileModal(() => renderView());
    });
  }

  renderView();
  return container;
}

function openEditProfileModal(onSaved) {
  const currentUser = store.getCurrentUser();

  const contentHtml = `
    <div style="display:flex; flex-direction:column; gap:var(--space-4);">
      <div class="form-group">
        <label class="form-label">Display Name</label>
        <input type="text" class="form-input" id="edit-name" value="${currentUser.name}" />
      </div>

      <div class="form-group">
        <label class="form-label">Professional Headline / Role</label>
        <input type="text" class="form-input" id="edit-headline" value="${currentUser.headline}" />
      </div>

      <div class="form-group">
        <label class="form-label">Location & Timezone</label>
        <input type="text" class="form-input" id="edit-location" value="${currentUser.location}" />
      </div>

      <div class="form-group">
        <label class="form-label">About Me / Barter Philosophy</label>
        <textarea class="form-textarea" id="edit-bio">${currentUser.bio}</textarea>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="form-group">
          <label class="form-label">Primary Teaching Skill</label>
          <input type="text" class="form-input" id="edit-teach-skill" value="${currentUser.skillsTeach[0]?.name || ''}" />
        </div>
        <div class="form-group">
          <label class="form-label">Primary Learning Goal</label>
          <input type="text" class="form-input" id="edit-want-skill" value="${currentUser.skillsWant[0]?.name || ''}" />
        </div>
      </div>
    </div>
  `;

  const footerHtml = `
    <button class="btn btn-secondary" id="edit-btn-cancel">Cancel</button>
    <button class="btn btn-primary" id="edit-btn-save">Save Profile Changes</button>
  `;

  modal.open({
    title: "Edit Skill Profile",
    contentHtml,
    footerHtml,
    size: "md"
  });

  document.getElementById("edit-btn-cancel")?.addEventListener("click", () => modal.close());
  document.getElementById("edit-btn-save")?.addEventListener("click", () => {
    const name = document.getElementById("edit-name")?.value;
    const headline = document.getElementById("edit-headline")?.value;
    const location = document.getElementById("edit-location")?.value;
    const bio = document.getElementById("edit-bio")?.value;
    const teachSkill = document.getElementById("edit-teach-skill")?.value;
    const wantSkill = document.getElementById("edit-want-skill")?.value;

    const updatedTeach = [...currentUser.skillsTeach];
    if (updatedTeach[0] && teachSkill) updatedTeach[0].name = teachSkill;

    const updatedWant = [...currentUser.skillsWant];
    if (updatedWant[0] && wantSkill) updatedWant[0].name = wantSkill;

    store.updateProfile({
      name,
      headline,
      location,
      bio,
      skillsTeach: updatedTeach,
      skillsWant: updatedWant
    });

    modal.close();
    toast.success("Profile Updated", "Changes saved successfully.");
    if (typeof onSaved === "function") onSaved();
  });
}
