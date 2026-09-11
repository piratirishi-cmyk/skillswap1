/**
 * Skill Progress Tracking View
 * Interactive roadmap with checkable milestones and percentage recalculation
 */

import { store } from "../store/state.js";
import { toast } from "../components/toast.js";
import { modal } from "../components/modal.js";

export function renderProgressView(onNavigate) {
  const container = document.createElement("div");
  container.className = "progress-view";

  function renderView() {
    const currentUser = store.getCurrentUser();
    const progressList = currentUser.progress || [];

    container.innerHTML = `
      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:var(--space-6);">
        <div>
          <h1 style="font-size:26px;">Learning Progress Tracker</h1>
          <p style="font-size:14px; color:var(--text-muted); margin-top:2px;">
            Track milestones in the skills you are learning from your peer barter partners.
          </p>
        </div>
        <button class="btn btn-primary btn-sm" id="btn-add-skill-goal">
          + Add New Learning Goal
        </button>
      </div>

      ${progressList.length === 0 ? `
        <div class="empty-state card">
          <div class="empty-state-icon">🎯</div>
          <div class="empty-state-title">No active skill roadmaps</div>
          <div class="empty-state-desc">Add a skill you want to learn to begin checking off milestones!</div>
        </div>
      ` : `
        <div style="display:flex; flex-direction:column; gap:var(--space-6);">
          ${progressList.map(prog => renderProgressCard(prog)).join("")}
        </div>
      `}
    `;

    bindEvents();
  }

  function renderProgressCard(prog) {
    const completedList = prog.milestones.filter(m => m.completed);
    const nextList = prog.milestones.filter(m => !m.completed);

    return `
      <div class="card" style="padding:var(--space-6);">
        <!-- Header -->
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:var(--space-3);">
          <div>
            <div class="flex items-center gap-2">
              <h2 style="font-size:20px;">${prog.skill}</h2>
              <span class="badge badge-primary">${prog.category}</span>
              ${prog.mentor ? `<span class="badge badge-neutral">Mentor: ${prog.mentor}</span>` : ""}
            </div>
          </div>
          <div style="font-size:22px; font-weight:800; color:var(--primary);">
            ${prog.progressPct}%
          </div>
        </div>

        <!-- Progress Bar -->
        <div class="progress-container" style="height:12px; margin-bottom:var(--space-6);">
          <div class="progress-bar ${prog.progressPct >= 70 ? 'success' : ''}" style="width: ${prog.progressPct}%;"></div>
        </div>

        <!-- Milestones Columns -->
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:var(--space-6);">
          <!-- Completed Milestones -->
          <div>
            <div style="font-size:12px; font-weight:700; color:var(--success); text-transform:uppercase; margin-bottom:var(--space-3); display:flex; align-items:center; gap:6px;">
              <span>✓ Completed Milestones (${completedList.length})</span>
            </div>
            <div style="display:flex; flex-direction:column; gap:var(--space-2);">
              ${prog.milestones.map((m, idx) => {
                if (!m.completed) return "";
                return `
                  <label style="display:flex; align-items:center; gap:8px; padding:6px 10px; background:var(--bg-surface-subtle); border-radius:var(--radius-sm); cursor:pointer; font-size:13px; color:var(--text-secondary); text-decoration:line-through;">
                    <input type="checkbox" checked data-toggle-milestone="${prog.id}" data-idx="${idx}" />
                    <span>${m.title}</span>
                  </label>
                `;
              }).join("")}
            </div>
          </div>

          <!-- Next / Upcoming Milestones -->
          <div>
            <div style="font-size:12px; font-weight:700; color:var(--primary); text-transform:uppercase; margin-bottom:var(--space-3); display:flex; align-items:center; gap:6px;">
              <span>○ Next Milestones to Master (${nextList.length})</span>
            </div>
            <div style="display:flex; flex-direction:column; gap:var(--space-2);">
              ${prog.milestones.map((m, idx) => {
                if (m.completed) return "";
                return `
                  <label style="display:flex; align-items:center; gap:8px; padding:6px 10px; background:#fff; border:1px solid var(--border-subtle); border-radius:var(--radius-sm); cursor:pointer; font-size:13px; font-weight:500;">
                    <input type="checkbox" data-toggle-milestone="${prog.id}" data-idx="${idx}" />
                    <span>${m.title}</span>
                  </label>
                `;
              }).join("")}
            </div>
          </div>
        </div>

        <!-- Add Custom Milestone to this Skill -->
        <div style="margin-top:var(--space-5); padding-top:var(--space-4); border-top:1px solid var(--border-subtle); display:flex; gap:var(--space-2);">
          <input
            type="text"
            class="form-input"
            id="input-new-milestone-${prog.id}"
            placeholder="Add a new milestone (e.g. Master fingerstyle tab notation)..."
            style="font-size:13px;"
          />
          <button class="btn btn-secondary btn-sm" data-add-milestone="${prog.id}">
            + Add Milestone
          </button>
        </div>
      </div>
    `;
  }

  function bindEvents() {
    // Toggle milestone checkboxes
    container.querySelectorAll("[data-toggle-milestone]").forEach(chk => {
      chk.addEventListener("change", () => {
        const progId = chk.getAttribute("data-toggle-milestone");
        const idx = parseInt(chk.getAttribute("data-idx"), 10);
        store.toggleMilestone(progId, idx);
        toast.success("Progress Updated", "Milestone toggled.");
        renderView();
      });
    });

    // Add milestone
    container.querySelectorAll("[data-add-milestone]").forEach(btn => {
      btn.addEventListener("click", () => {
        const progId = btn.getAttribute("data-add-milestone");
        const input = container.querySelector(`#input-new-milestone-${progId}`);
        const title = input?.value.trim();
        if (!title) return;

        store.addNewMilestone(progId, title);
        input.value = "";
        toast.success("Milestone Added", `Added "${title}" to your roadmap.`);
        renderView();
      });
    });

    // Add new skill goal modal
    container.querySelector("#btn-add-skill-goal")?.addEventListener("click", () => {
      openAddGoalModal(() => renderView());
    });
  }

  renderView();
  return container;
}

function openAddGoalModal(onSaved) {
  const contentHtml = `
    <div style="display:flex; flex-direction:column; gap:var(--space-4);">
      <div class="form-group">
        <label class="form-label">Skill Name</label>
        <input type="text" class="form-input" id="new-goal-skill" placeholder="e.g. Spanish, Video Editing, Python" />
      </div>
      <div class="form-group">
        <label class="form-label">Category</label>
        <select class="form-select" id="new-goal-cat">
          <option>Languages</option>
          <option>Technology</option>
          <option>Arts & Design</option>
          <option>Music & Audio</option>
          <option>Business</option>
          <option>Lifestyle</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">First Starting Milestone</label>
        <input type="text" class="form-input" id="new-goal-m1" placeholder="e.g. Learn basic vocabulary and greetings" />
      </div>
    </div>
  `;

  const footerHtml = `
    <button class="btn btn-secondary" id="goal-btn-cancel">Cancel</button>
    <button class="btn btn-primary" id="goal-btn-save">Create Roadmap 🎯</button>
  `;

  modal.open({
    title: "Add New Skill Learning Roadmap",
    contentHtml,
    footerHtml,
    size: "md"
  });

  document.getElementById("goal-btn-cancel")?.addEventListener("click", () => modal.close());
  document.getElementById("goal-btn-save")?.addEventListener("click", () => {
    const skill = document.getElementById("new-goal-skill")?.value.trim();
    const category = document.getElementById("new-goal-cat")?.value;
    const m1 = document.getElementById("new-goal-m1")?.value.trim();

    if (!skill) return;

    const currentUser = store.getCurrentUser();
    if (!currentUser.progress) currentUser.progress = [];

    currentUser.progress.push({
      id: `prog-${Date.now()}`,
      skill,
      category,
      progressPct: 0,
      mentor: "Community Partner",
      milestones: [
        { title: m1 || "Foundations and core terminology", completed: false },
        { title: "First guided practice lesson", completed: false },
        { title: "Independent exercise application", completed: false }
      ]
    });

    store.saveState();
    modal.close();
    toast.success("Roadmap Created", `Started tracking ${skill}.`);
    if (typeof onSaved === "function") onSaved();
  });
}
