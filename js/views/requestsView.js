/**
 * Requests Management View & Proposal Modal
 * Handles incoming & outgoing skill exchange proposals with accept/reject actions
 */

import { store } from "../store/state.js";
import { modal } from "../components/modal.js";
import { toast } from "../components/toast.js";
import { openScheduleModal } from "./sessionsView.js";

export function renderRequestsView(onNavigate) {
  const container = document.createElement("div");
  container.className = "requests-view";

  let activeTab = "incoming"; // "incoming" | "outgoing"

  function renderView() {
    const incomingReqs = store.getIncomingRequests();
    const outgoingReqs = store.getOutgoingRequests();

    container.innerHTML = `
      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:var(--space-6);">
        <div>
          <h1 style="font-size:26px;">Exchange Requests</h1>
          <p style="font-size:14px; color:var(--text-muted); margin-top:2px;">
            Manage incoming proposals and track requests you've sent to other members.
          </p>
        </div>
        <button class="btn btn-primary btn-sm" id="btn-browse-partners">
          + Explore New Partners
        </button>
      </div>

      <!-- Navigation Tabs -->
      <div class="tabs">
        <button class="tab-btn ${activeTab === 'incoming' ? 'active' : ''}" id="tab-incoming">
          <span>📥 Incoming Proposals</span>
          <span class="badge ${incomingReqs.filter(r => r.status === 'pending').length > 0 ? 'badge-primary' : 'badge-neutral'}">
            ${incomingReqs.length}
          </span>
        </button>
        <button class="tab-btn ${activeTab === 'outgoing' ? 'active' : ''}" id="tab-outgoing">
          <span>📤 Sent Proposals</span>
          <span class="badge badge-neutral">${outgoingReqs.length}</span>
        </button>
      </div>

      <!-- Content Area -->
      <div style="display:flex; flex-direction:column; gap:var(--space-4);">
        ${activeTab === "incoming" ? (
          incomingReqs.length === 0 ? `
            <div class="empty-state card">
              <div class="empty-state-icon">📥</div>
              <div class="empty-state-title">No incoming exchange requests</div>
              <div class="empty-state-desc">When people discover your skills and want to barter, their proposals will appear here.</div>
            </div>
          ` : incomingReqs.map(req => renderIncomingCard(req)).join("")
        ) : (
          outgoingReqs.length === 0 ? `
            <div class="empty-state card">
              <div class="empty-state-icon">📤</div>
              <div class="empty-state-title">No sent exchange proposals</div>
              <div class="empty-state-desc">Explore compatible profiles on the Discover page to propose your first skill barter!</div>
            </div>
          ` : outgoingReqs.map(req => renderOutgoingCard(req)).join("")
        )}
      </div>
    `;

    bindEvents();
  }

  function renderIncomingCard(req) {
    const sender = store.getUserById(req.fromUserId);
    const isPending = req.status === "pending";
    const isAccepted = req.status === "accepted";

    return `
      <div class="card" style="padding:var(--space-5);">
        <div style="display:flex; align-items:flex-start; justify-content:space-between; flex-wrap:wrap; gap:var(--space-4);">
          <div class="flex items-center gap-3">
            <div class="avatar avatar-lg">
              <img src="${sender?.avatar || ''}" alt="${sender?.name || ''}" />
              <div class="avatar-status online"></div>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h3 style="font-size:16px;">${sender?.name || 'Member'}</h3>
                ${req.status === "pending" ? `<span class="badge badge-warning">Pending Decision</span>` : ""}
                ${req.status === "accepted" ? `<span class="badge badge-success">Accepted & Active</span>` : ""}
                ${req.status === "declined" ? `<span class="badge badge-neutral">Declined</span>` : ""}
              </div>
              <div style="font-size:12px; color:var(--text-muted);">${sender?.headline || ''}</div>
              <div style="font-size:11px; color:var(--text-subtle); margin-top:2px;">Received ${req.createdAt}</div>
            </div>
          </div>

          <div class="flex gap-2">
            ${isPending ? `
              <button class="btn btn-success btn-sm" data-accept="${req.id}">
                ✓ Accept & Connect
              </button>
              <button class="btn btn-secondary btn-sm" data-decline="${req.id}">
                Decline
              </button>
            ` : ""}

            ${isAccepted ? `
              <button class="btn btn-secondary btn-sm" data-chat="${sender?.id}">
                💬 Open Chat
              </button>
              <button class="btn btn-primary btn-sm" data-schedule="${sender?.id}">
                📅 Schedule Session
              </button>
            ` : ""}
          </div>
        </div>

        <!-- Exchange Proposal Details -->
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:var(--space-4); background:var(--bg-surface-subtle); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:var(--space-4); margin-top:var(--space-4);">
          <div>
            <div style="font-size:11px; font-weight:700; color:var(--success); text-transform:uppercase;">THEY OFFER TO TEACH</div>
            <div style="font-size:14px; font-weight:700; margin-top:2px;">${req.offerSkill}</div>
          </div>
          <div>
            <div style="font-size:11px; font-weight:700; color:var(--primary); text-transform:uppercase;">THEY WANT TO LEARN FROM YOU</div>
            <div style="font-size:14px; font-weight:700; margin-top:2px;">${req.requestSkill}</div>
          </div>
        </div>

        <!-- Personal Note -->
        <div style="margin-top:var(--space-3); font-size:13px; color:var(--text-secondary); background:#fff; border:1px solid var(--border-subtle); border-radius:var(--radius-sm); padding:var(--space-3);">
          <strong>Personal Note:</strong> "${req.note}"
          <div style="font-size:11px; color:var(--text-muted); margin-top:4px;">
            Preferred Slots: <strong>${req.proposedSlots || "Flexible"}</strong> · Mode: <strong>${req.proposedMode}</strong>
          </div>
        </div>
      </div>
    `;
  }

  function renderOutgoingCard(req) {
    const receiver = store.getUserById(req.toUserId);

    return `
      <div class="card" style="padding:var(--space-5);">
        <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:var(--space-4);">
          <div class="flex items-center gap-3">
            <div class="avatar avatar-md">
              <img src="${receiver?.avatar || ''}" alt="${receiver?.name || ''}" />
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h4 style="font-size:15px;">To: ${receiver?.name || 'Member'}</h4>
                ${req.status === "pending" ? `<span class="badge badge-warning">Awaiting Partner Response</span>` : ""}
                ${req.status === "accepted" ? `<span class="badge badge-success">Accepted!</span>` : ""}
                ${req.status === "declined" ? `<span class="badge badge-neutral">Declined</span>` : ""}
              </div>
              <div style="font-size:12px; color:var(--text-muted);">
                You offered <strong>${req.offerSkill}</strong> in exchange for <strong>${req.requestSkill}</strong>
              </div>
            </div>
          </div>

          <div>
            ${req.status === "accepted" ? `
              <button class="btn btn-primary btn-sm" data-chat="${receiver?.id}">
                Start Conversation 💬
              </button>
            ` : `
              <span style="font-size:12px; color:var(--text-muted);">Sent ${req.createdAt}</span>
            `}
          </div>
        </div>
      </div>
    `;
  }

  function bindEvents() {
    container.querySelector("#btn-browse-partners")?.addEventListener("click", () => onNavigate("discover"));

    container.querySelector("#tab-incoming")?.addEventListener("click", () => {
      activeTab = "incoming";
      renderView();
    });

    container.querySelector("#tab-outgoing")?.addEventListener("click", () => {
      activeTab = "outgoing";
      renderView();
    });

    container.querySelectorAll("[data-accept]").forEach(btn => {
      btn.addEventListener("click", () => {
        const rid = btn.getAttribute("data-accept");
        store.acceptRequest(rid);
        toast.success("Proposal Accepted!", "Skill exchange is now active. Message thread opened.");
        renderView();
      });
    });

    container.querySelectorAll("[data-decline]").forEach(btn => {
      btn.addEventListener("click", () => {
        const rid = btn.getAttribute("data-decline");
        store.declineRequest(rid);
        toast.info("Proposal Declined", "Exchange declined.");
        renderView();
      });
    });

    container.querySelectorAll("[data-chat]").forEach(btn => {
      btn.addEventListener("click", () => {
        const partnerId = btn.getAttribute("data-chat");
        onNavigate("messages", { partnerId });
      });
    });

    container.querySelectorAll("[data-schedule]").forEach(btn => {
      btn.addEventListener("click", () => {
        const partnerId = btn.getAttribute("data-schedule");
        openScheduleModal(partnerId);
      });
    });
  }

  renderView();
  return container;
}

/**
 * Open Modal to Send a Skill Exchange Request
 */
export function openSendRequestModal(targetUserId, initialData = {}) {
  const currentUser = store.getCurrentUser();
  const targetUser = store.getUserById(targetUserId);
  if (!targetUser) return;

  const defaultOffer = currentUser.skillsTeach?.[0]?.name || "Guitar";
  const defaultRequest = targetUser.skillsTeach?.[0]?.name || "Digital Art";

  const contentHtml = `
    <div style="display:flex; flex-direction:column; gap:var(--space-4);">
      <div class="flex items-center gap-3" style="background:var(--bg-surface-subtle); padding:var(--space-3); border-radius:var(--radius-md); border:1px solid var(--border-subtle);">
        <div class="avatar avatar-md">
          <img src="${targetUser.avatar}" alt="${targetUser.name}" />
        </div>
        <div>
          <div style="font-weight:700; font-size:14px;">Exchange with ${targetUser.name}</div>
          <div style="font-size:12px; color:var(--text-muted);">${targetUser.headline}</div>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="form-group">
          <label class="form-label">Skill You Will Teach</label>
          <select class="form-select" id="req-modal-offer">
            ${(currentUser.skillsTeach || []).map(s => `
              <option value="${s.name}">${s.name} (${s.level})</option>
            `).join("")}
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Skill You Want to Learn</label>
          <select class="form-select" id="req-modal-request">
            ${(targetUser.skillsTeach || []).map(s => `
              <option value="${s.name}" ${s.name === defaultRequest ? "selected" : ""}>${s.name} (${s.level})</option>
            `).join("")}
          </select>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Preferred Timeslot & Availability</label>
        <input type="text" class="form-input" id="req-modal-slots" value="Weekends or Evenings (CST)" placeholder="e.g. Weekends, Tuesday evenings..." />
      </div>

      <div class="form-group">
        <label class="form-label">Exchange Format</label>
        <select class="form-select" id="req-modal-mode">
          <option value="both">Both Online Video or Safe Local Meetup</option>
          <option value="online">Online Video Room Only</option>
          <option value="offline">In-Person Meetup (Library/Coffee Shop)</option>
        </select>
      </div>

      <div class="form-group">
        <label class="form-label">Personal Note / Proposal Message</label>
        <textarea class="form-textarea" id="req-modal-note" placeholder="Introduce yourself and propose how you'd like to structure the mutual exchange...">${initialData.note || `Hi ${targetUser.name.split(" ")[0]}! I'd love to exchange lessons: I can teach you ${defaultOffer} and would love to learn ${defaultRequest} from you!`}</textarea>
      </div>
    </div>
  `;

  const footerHtml = `
    <button class="btn btn-secondary" id="modal-btn-cancel">Cancel</button>
    <button class="btn btn-primary" id="modal-btn-send">
      Send Barter Proposal 🚀
    </button>
  `;

  modal.open({
    title: `Propose Skill Exchange`,
    contentHtml,
    footerHtml,
    size: "md"
  });

  document.getElementById("modal-btn-cancel")?.addEventListener("click", () => modal.close());
  document.getElementById("modal-btn-send")?.addEventListener("click", () => {
    const offerSkill = document.getElementById("req-modal-offer")?.value;
    const requestSkill = document.getElementById("req-modal-request")?.value;
    const note = document.getElementById("req-modal-note")?.value;
    const proposedSlots = document.getElementById("req-modal-slots")?.value;
    const proposedMode = document.getElementById("req-modal-mode")?.value;

    store.sendExchangeRequest({
      toUserId: targetUserId,
      offerSkill,
      requestSkill,
      note,
      proposedSlots,
      proposedMode
    });

    modal.close();
    toast.success("Request Sent!", `Your barter proposal was sent to ${targetUser.name}.`);
  });
}
