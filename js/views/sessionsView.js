/**
 * Sessions Management & Simulated Video Room View
 * Handles scheduling, active video room simulations, credit award, and 3-factor reputation reviews
 */

import { store } from "../store/state.js";
import { modal } from "../components/modal.js";
import { toast } from "../components/toast.js";

export function renderSessionsView(onNavigate) {
  const container = document.createElement("div");
  container.className = "sessions-view";

  function renderView() {
    const upcoming = store.getUpcomingSessions();
    const completed = store.getCompletedSessions();

    container.innerHTML = `
      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:var(--space-6);">
        <div>
          <h1 style="font-size:26px;">Skill Exchange Sessions</h1>
          <p style="font-size:14px; color:var(--text-muted); margin-top:2px;">
            Coordinate, launch, and record completed barter sessions. 1 completed hour = 1 Skill Credit.
          </p>
        </div>
        <button class="btn btn-primary btn-sm" id="btn-schedule-new">
          + Schedule New Session
        </button>
      </div>

      <!-- Upcoming Sessions Section -->
      <div style="margin-bottom:var(--space-8);">
        <div style="display:flex; align-items:center; gap:var(--space-2); margin-bottom:var(--space-4);">
          <span style="font-size:18px;">📅</span>
          <h2 style="font-size:18px;">Upcoming Exchanges (${upcoming.length})</h2>
        </div>

        ${upcoming.length === 0 ? `
          <div class="empty-state card" style="padding:var(--space-8);">
            <div class="empty-state-icon">📅</div>
            <div class="empty-state-title">No upcoming sessions</div>
            <div class="empty-state-desc">Schedule your first exchange session with an accepted barter partner.</div>
            <button class="btn btn-secondary btn-sm" id="empty-schedule-btn">Schedule Session</button>
          </div>
        ` : `
          <div style="display:flex; flex-direction:column; gap:var(--space-4);">
            ${upcoming.map(sess => renderUpcomingSessionCard(sess)).join("")}
          </div>
        `}
      </div>

      <!-- Past Completed Sessions Section -->
      <div>
        <div style="display:flex; align-items:center; gap:var(--space-2); margin-bottom:var(--space-4);">
          <span style="font-size:18px;">✓</span>
          <h2 style="font-size:18px;">Completed Exchanges & History (${completed.length})</h2>
        </div>

        ${completed.length === 0 ? `
          <div style="color:var(--text-muted); font-size:14px;">No completed sessions yet.</div>
        ` : `
          <div style="display:flex; flex-direction:column; gap:var(--space-4);">
            ${completed.map(sess => renderCompletedSessionCard(sess)).join("")}
          </div>
        `}
      </div>
    `;

    bindEvents();
  }

  function renderUpcomingSessionCard(sess) {
    const partner = store.getUserById(sess.partnerId);

    return `
      <div class="session-card">
        <div class="flex items-center gap-4">
          <div class="avatar avatar-lg">
            <img src="${partner?.avatar || ''}" alt="${partner?.name || ''}" />
            <div class="avatar-status online"></div>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h3 style="font-size:16px;">${partner?.name || 'Partner'}</h3>
              <span class="badge badge-primary">${sess.skillExchange}</span>
              <span class="badge badge-neutral">${sess.meetingType === 'online' ? '🌐 Online Room' : '📍 In-Person'}</span>
            </div>
            <div style="font-size:13px; color:var(--text-secondary); margin-top:3px;">
              🗓️ <strong>${sess.date}</strong> at <strong>${sess.time}</strong> (${sess.durationMinutes} minutes)
            </div>
            <div style="font-size:12px; color:var(--text-muted); margin-top:2px;">
              Agenda: ${sess.agenda || 'Reciprocal practice and fundamentals review'}
            </div>
          </div>
        </div>

        <div class="flex gap-2">
          <button class="btn btn-secondary btn-sm" data-complete-now="${sess.id}">
            ✓ Mark Complete
          </button>
          <button class="btn btn-primary btn-sm" data-launch-room="${sess.id}">
            🎥 Enter Session Room
          </button>
        </div>
      </div>
    `;
  }

  function renderCompletedSessionCard(sess) {
    const partner = store.getUserById(sess.partnerId);

    return `
      <div class="session-card" style="opacity:0.95; background:var(--bg-surface-subtle);">
        <div class="flex items-center gap-4">
          <div class="avatar avatar-md">
            <img src="${partner?.avatar || ''}" alt="${partner?.name || ''}" />
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h4 style="font-size:15px;">${partner?.name || 'Partner'}</h4>
              <span class="badge badge-success">Completed</span>
              <span class="badge badge-warning">+1 Skill Credit Awarded 🪙</span>
            </div>
            <div style="font-size:12px; color:var(--text-muted); margin-top:2px;">
              ${sess.skillExchange} · ${sess.date} (${sess.durationMinutes} min)
            </div>
          </div>
        </div>

        <div>
          ${sess.rated ? `
            <div style="font-size:12px; font-weight:700; color:var(--success);">
              ⭐ Rated 5.0 (Review Submitted)
            </div>
          ` : `
            <button class="btn btn-secondary btn-sm" data-rate-sess="${sess.id}">
              ⭐ Rate Partner
            </button>
          `}
        </div>
      </div>
    `;
  }

  function bindEvents() {
    container.querySelector("#btn-schedule-new")?.addEventListener("click", () => openScheduleModal());
    container.querySelector("#empty-schedule-btn")?.addEventListener("click", () => openScheduleModal());

    container.querySelectorAll("[data-launch-room]").forEach(btn => {
      btn.addEventListener("click", () => {
        const sid = btn.getAttribute("data-launch-room");
        openSessionRoomModal(sid, onNavigate);
      });
    });

    container.querySelectorAll("[data-complete-now]").forEach(btn => {
      btn.addEventListener("click", () => {
        const sid = btn.getAttribute("data-complete-now");
        openRatingModal(sid, () => renderView());
      });
    });

    container.querySelectorAll("[data-rate-sess]").forEach(btn => {
      btn.addEventListener("click", () => {
        const sid = btn.getAttribute("data-rate-sess");
        openRatingModal(sid, () => renderView());
      });
    });
  }

  renderView();
  return container;
}

/**
 * Schedule New Session Modal
 */
export function openScheduleModal(preselectedPartnerId = null) {
  const currentUser = store.getCurrentUser();
  const partners = store.getAllChatPartners();

  // If no active partners, fallback to all users
  const candidatePartners = partners.length > 0 ? partners : store.getOtherUsers();
  const defaultPartner = preselectedPartnerId ? store.getUserById(preselectedPartnerId) : candidatePartners[0];

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDate = tomorrow.toISOString().split("T")[0];

  const contentHtml = `
    <div style="display:flex; flex-direction:column; gap:var(--space-4);">
      <div class="form-group">
        <label class="form-label">Exchange Partner</label>
        <select class="form-select" id="sched-partner">
          ${candidatePartners.map(p => `
            <option value="${p.id}" ${p.id === defaultPartner?.id ? "selected" : ""}>${p.name} (${p.headline})</option>
          `).join("")}
        </select>
      </div>

      <div class="form-group">
        <label class="form-label">Skill Being Exchanged</label>
        <input type="text" class="form-input" id="sched-skill" value="${defaultPartner ? `${currentUser.skillsTeach[0]?.name || 'Guitar'} ↔ ${defaultPartner.skillsTeach[0]?.name || 'Digital Art'}` : 'Skill Barter'}" />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="form-group">
          <label class="form-label">Date</label>
          <input type="date" class="form-input" id="sched-date" value="${defaultDate}" />
        </div>
        <div class="form-group">
          <label class="form-label">Time</label>
          <input type="time" class="form-input" id="sched-time" value="15:00" />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="form-group">
          <label class="form-label">Duration</label>
          <select class="form-select" id="sched-duration">
            <option value="60">60 Minutes (1 Skill Credit)</option>
            <option value="30">30 Minutes (Quick Check-in)</option>
            <option value="90">90 Minutes (Deep Dive Session)</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Meeting Format</label>
          <select class="form-select" id="sched-mode">
            <option value="online">Online Video Room</option>
            <option value="offline">In-Person Safe Public Spot</option>
          </select>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Session Agenda / Objectives</label>
        <textarea class="form-textarea" id="sched-agenda" placeholder="Detail the plan for both halves of the session...">Part 1: 30 mins teaching ${currentUser.skillsTeach[0]?.name || 'Guitar'} fundamentals. Part 2: 30 mins learning ${defaultPartner?.skillsTeach[0]?.name || 'Digital Art'} basics.</textarea>
      </div>
    </div>
  `;

  const footerHtml = `
    <button class="btn btn-secondary" id="modal-btn-sched-cancel">Cancel</button>
    <button class="btn btn-primary" id="modal-btn-sched-save">
      Confirm & Schedule Exchange 📅
    </button>
  `;

  modal.open({
    title: "Schedule Skill Barter Session",
    contentHtml,
    footerHtml,
    size: "md"
  });

  document.getElementById("modal-btn-sched-cancel")?.addEventListener("click", () => modal.close());
  document.getElementById("modal-btn-sched-save")?.addEventListener("click", () => {
    const partnerId = document.getElementById("sched-partner")?.value;
    const skillExchange = document.getElementById("sched-skill")?.value;
    const date = document.getElementById("sched-date")?.value;
    const time = document.getElementById("sched-time")?.value;
    const durationMinutes = document.getElementById("sched-duration")?.value;
    const meetingType = document.getElementById("sched-mode")?.value;
    const agenda = document.getElementById("sched-agenda")?.value;

    store.scheduleSession({
      partnerId,
      skillExchange,
      date,
      time,
      durationMinutes,
      meetingType,
      agenda
    });

    modal.close();
    toast.success("Session Scheduled!", `Exchange invitation sent for ${date} at ${time}.`);
  });
}

/**
 * Simulated Video Session Room Modal
 */
export function openSessionRoomModal(sessionId, onNavigate) {
  const session = store.state.sessions.find(s => s.id === sessionId) || store.state.sessions[0];
  const currentUser = store.getCurrentUser();
  const partner = store.getUserById(session.partnerId);

  const contentHtml = `
    <div class="simulated-room-container">
      <!-- Top Room Bar -->
      <div style="padding:12px 18px; background:#1e293b; display:flex; align-items:center; justify-content:space-between; border-bottom:1px solid #334155;">
        <div class="flex items-center gap-2">
          <span style="color:#ef4444; animation:pulse 1s infinite;">●</span>
          <span style="font-weight:700; font-size:14px;">Live Barter Session: ${session.skillExchange}</span>
        </div>
        <div style="display:flex; align-items:center; gap:12px;">
          <span class="badge badge-neutral" style="background:#0f172a; color:#38bdf8; border:none;">
            ⏱️ Remaining: <strong id="sim-timer">48:15</strong>
          </span>
          <span class="badge badge-success">Reciprocal Link Encrypted</span>
        </div>
      </div>

      <!-- 2-Party Video Grid -->
      <div class="video-grid">
        <!-- Partner Video Tile -->
        <div class="video-box" style="position:relative; overflow:hidden;">
          <img
            src="${partner?.avatar || ''}"
            alt="${partner?.name || ''}"
            style="width:100%; height:100%; object-fit:cover; filter:brightness(0.9);"
          />
          <div style="position:absolute; bottom:12px; left:12px; background:rgba(0,0,0,0.65); padding:4px 10px; border-radius:6px; font-size:12px; font-weight:600; backdrop-filter:blur(4px);">
            ${partner?.name} (Speaking) 🎙️
          </div>
        </div>

        <!-- Current User Video Tile -->
        <div class="video-box" style="position:relative; overflow:hidden;">
          <img
            src="${currentUser.avatar}"
            alt="${currentUser.name}"
            style="width:100%; height:100%; object-fit:cover; filter:brightness(0.9);"
          />
          <div style="position:absolute; bottom:12px; left:12px; background:rgba(0,0,0,0.65); padding:4px 10px; border-radius:6px; font-size:12px; font-weight:600; backdrop-filter:blur(4px);">
            You (${currentUser.name})
          </div>
        </div>
      </div>

      <!-- Shared Agenda & Live Notes -->
      <div style="padding:10px 18px; background:#0f172a; border-top:1px solid #1e293b; font-size:12px; color:#94a3b8; display:flex; align-items:center; justify-content:space-between;">
        <span>📝 <strong>Agenda:</strong> ${session.agenda}</span>
        <span style="color:#a7f3d0;">✓ 1 Skill Credit will be credited upon conclusion</span>
      </div>

      <!-- Zoom Meeting Link Section -->
      <div style="padding:12px 18px; background:#0f172a; border-top:1px solid #1e293b; display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
        <span style="font-size:12px; color:#94a3b8;">🎥 <strong>Join via Zoom:</strong></span>
        <a href="https://zoom.us/j/skillswap${session.id}?pwd=skillswap2024" target="_blank" class="btn btn-primary btn-sm" style="font-size:11px;">
          🔗 Zoom Meeting Link
        </a>
        <span style="font-size:11px; color:#64748b;">Meeting ID: skillswap${session.id}</span>
      </div>

      <!-- Controls Bar -->
      <div class="video-controls">
        <button class="btn btn-secondary btn-sm" id="sim-btn-mic" style="background:#334155; color:white; border:none;">
          🎤 Mute
        </button>
        <button class="btn btn-secondary btn-sm" id="sim-btn-cam" style="background:#334155; color:white; border:none;">
          📷 Camera Off
        </button>
        <button class="btn btn-secondary btn-sm" id="sim-btn-share" style="background:#334155; color:white; border:none;">
          🖥️ Share Screen
        </button>
        <button class="btn btn-secondary btn-sm" id="sim-btn-zoom" style="background:#4db8ff; color:white; border:none;">
          🎥 Open Zoom
        </button>
        <button class="btn btn-danger btn-sm" id="sim-btn-leave">
          Leave Room
        </button>
        <button class="btn btn-success btn-sm" id="sim-btn-complete" style="font-weight:700;">
          ✓ Complete & Award Credit
        </button>
      </div>
    </div>
  `;

  modal.open({
    title: "SkillSwap Interactive Video Room",
    contentHtml,
    size: "xl"
  });

  document.getElementById("sim-btn-mic")?.addEventListener("click", (e) => {
    e.target.textContent = e.target.textContent.includes("Mute") ? "🔇 Unmute" : "🎤 Mute";
  });

  document.getElementById("sim-btn-cam")?.addEventListener("click", (e) => {
    e.target.textContent = e.target.textContent.includes("Off") ? "📷 Camera On" : "📷 Camera Off";
  });

  document.getElementById("sim-btn-share")?.addEventListener("click", () => {
    toast.info("Screen Share", "Screen sharing stream active for partner.");
  });

  document.getElementById("sim-btn-zoom")?.addEventListener("click", () => {
    window.open(`https://zoom.us/j/skillswap${session.id}?pwd=skillswap2024`, '_blank');
    toast.success("Zoom Meeting", "Opening Zoom meeting in new tab...");
  });

  document.getElementById("sim-btn-leave")?.addEventListener("click", () => {
    modal.close();
  });

  document.getElementById("sim-btn-complete")?.addEventListener("click", () => {
    modal.close();
    openRatingModal(session.id, () => {
      if (onNavigate) onNavigate("credits");
    });
  });
}

/**
 * 3-Part Rating & Reputation Modal
 */
export function openRatingModal(sessionId, onComplete) {
  const session = store.state.sessions.find(s => s.id === sessionId) || store.state.sessions[0];
  const partner = store.getUserById(session?.partnerId);

  const ratings = {
    teaching: 5,
    communication: 5,
    reliability: 5
  };

  const contentHtml = `
    <div style="display:flex; flex-direction:column; gap:var(--space-4);">
      <div style="text-align:center; padding-bottom:var(--space-3); border-bottom:1px solid var(--border-subtle);">
        <div style="font-size:36px; margin-bottom:4px;">🎉</div>
        <h3 style="font-size:20px;">Session Completed!</h3>
        <p style="font-size:13px; color:var(--text-muted); margin-top:2px;">
          You earned <strong>+1 Skill Credit</strong> for teaching. Rate <strong>${partner?.name || 'Partner'}</strong> to update their peer reputation.
        </p>
      </div>

      <!-- Rating Category 1: Teaching Quality -->
      <div style="display:flex; align-items:center; justify-content:space-between;">
        <div>
          <div style="font-weight:700; font-size:14px;">Teaching Quality</div>
          <div style="font-size:12px; color:var(--text-muted);">Clarity of instruction, pacing, and helpfulness</div>
        </div>
        <div class="star-rating" data-rate-type="teaching">
          <span class="star filled" data-val="1">★</span>
          <span class="star filled" data-val="2">★</span>
          <span class="star filled" data-val="3">★</span>
          <span class="star filled" data-val="4">★</span>
          <span class="star filled" data-val="5">★</span>
        </div>
      </div>

      <!-- Rating Category 2: Communication -->
      <div style="display:flex; align-items:center; justify-content:space-between;">
        <div>
          <div style="font-weight:700; font-size:14px;">Communication</div>
          <div style="font-size:12px; color:var(--text-muted);">Responsiveness, mutual respect, active listening</div>
        </div>
        <div class="star-rating" data-rate-type="communication">
          <span class="star filled" data-val="1">★</span>
          <span class="star filled" data-val="2">★</span>
          <span class="star filled" data-val="3">★</span>
          <span class="star filled" data-val="4">★</span>
          <span class="star filled" data-val="5">★</span>
        </div>
      </div>

      <!-- Rating Category 3: Reliability -->
      <div style="display:flex; align-items:center; justify-content:space-between;">
        <div>
          <div style="font-weight:700; font-size:14px;">Reliability & Punctuality</div>
          <div style="font-size:12px; color:var(--text-muted);">On-time attendance and commitment to agenda</div>
        </div>
        <div class="star-rating" data-rate-type="reliability">
          <span class="star filled" data-val="1">★</span>
          <span class="star filled" data-val="2">★</span>
          <span class="star filled" data-val="3">★</span>
          <span class="star filled" data-val="4">★</span>
          <span class="star filled" data-val="5">★</span>
        </div>
      </div>

      <!-- Written Feedback -->
      <div class="form-group" style="margin-top:var(--space-2);">
        <label class="form-label">Review & Testimonial</label>
        <textarea class="form-textarea" id="review-text" placeholder="Share a few words about how this barter session helped you grow...">Incredible barter session! Maya gave very clear feedback on Procreate layers and color palettes, and was super attentive learning fingerstyle guitar chords.</textarea>
      </div>
    </div>
  `;

  const footerHtml = `
    <button class="btn btn-primary btn-lg w-full" id="btn-submit-review">
      Submit Review & Claim 1 Skill Credit 🪙
    </button>
  `;

  modal.open({
    title: `Reputation Review for ${partner?.name || 'Partner'}`,
    contentHtml,
    footerHtml,
    size: "md"
  });

  // Interactive stars
  document.querySelectorAll(".star-rating").forEach(ratingGroup => {
    const type = ratingGroup.getAttribute("data-rate-type");
    ratingGroup.querySelectorAll(".star").forEach(star => {
      star.addEventListener("click", () => {
        const val = parseInt(star.getAttribute("data-val"), 10);
        ratings[type] = val;
        ratingGroup.querySelectorAll(".star").forEach(s => {
          const sVal = parseInt(s.getAttribute("data-val"), 10);
          if (sVal <= val) {
            s.classList.add("filled");
          } else {
            s.classList.remove("filled");
          }
        });
      });
    });
  });

  document.getElementById("btn-submit-review")?.addEventListener("click", () => {
    const review = document.getElementById("review-text")?.value;
    store.completeSession(sessionId, {
      teaching: ratings.teaching,
      communication: ratings.communication,
      reliability: ratings.reliability,
      review
    });

    modal.close();
    toast.success("Reputation Updated!", "+1 Skill Credit deposited to your ledger.");
    if (typeof onComplete === "function") onComplete();
  });
}
