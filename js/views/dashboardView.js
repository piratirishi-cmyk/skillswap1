/**
 * Dashboard View
 * Core dashboard hub showing metrics, skills, recommendations, requests, and sessions
 */

import { store } from "../store/state.js";
import { calculateCompatibility } from "../services/matchingEngine.js";
import { openMatchDetailsModal } from "./matchDetailsModal.js";
import { openSendRequestModal } from "./requestsView.js";
import { openScheduleModal, openSessionRoomModal } from "./sessionsView.js";
import { toast } from "../components/toast.js";

export function renderDashboardView(onNavigate) {
  const container = document.createElement("div");
  container.className = "dashboard-view";

  const currentUser = store.getCurrentUser();
  const otherUsers = store.getOtherUsers();
  const pendingRequests = store.getIncomingRequests().filter(r => r.status === "pending");
  const upcomingSessions = store.getUpcomingSessions();

  // Calculate compatibility for all candidate matches and sort descending
  const recommendedMatches = otherUsers.map(user => {
    return {
      user,
      ...calculateCompatibility(currentUser, user)
    };
  }).sort((a, b) => b.totalScore - a.totalScore);

  container.innerHTML = `
    <!-- Top Concept Barter Ribbon -->
    <div class="barter-concept-strip" style="margin-bottom:var(--space-6);">
      <span class="barter-concept-step step-teach">🎓 I teach my craft</span>
      <span class="barter-concept-arrow">➔</span>
      <span class="barter-concept-step step-learn">💡 You teach yours</span>
      <span class="barter-concept-arrow">➔</span>
      <span class="barter-concept-step step-grow">🌱 We both grow</span>
    </div>

    <!-- Dashboard Header -->
    <div class="dashboard-header">
      <div>
        <div style="font-size:11px; font-weight:800; color:var(--primary); text-transform:uppercase; letter-spacing:0.06em;">
          Active Peer Barter Hub
        </div>
        <h1 style="font-size:24px; margin-top:2px;">
          Welcome back, ${currentUser.name.split(" ")[0]}! 👋
        </h1>
        <p style="font-size:13.5px; color:var(--text-muted); margin-top:2px;">
          Your skill exchange score is <strong>${currentUser.exchangeScore || 98}/100</strong>. Ready for your next mutual learning session?
        </p>
      </div>

      <div style="display:flex; gap:var(--space-2);">
        <button class="btn btn-secondary btn-sm" id="dash-btn-schedule">
          📅 Schedule Session
        </button>
        <button class="btn btn-primary btn-sm" id="dash-btn-discover">
          🔍 Discover Partners
        </button>
      </div>
    </div>

    <!-- Top Metric Stats Cards -->
    <div class="dashboard-stats-grid">
      <!-- 1. Skill Exchange Score -->
      <div class="stat-card">
        <div class="stat-header">
          <span class="stat-label">Exchange Score</span>
          <div class="stat-icon primary">⚡</div>
        </div>
        <div class="stat-value">${currentUser.exchangeScore || 98}<span style="font-size:14px; font-weight:600; color:var(--text-muted);">/100</span></div>
        <div class="stat-footer text-success">
          <span>✓ Verified reliability & feedback</span>
        </div>
      </div>

      <!-- 2. Skill Credits -->
      <div class="stat-card" style="cursor:pointer;" id="stat-card-credits" title="Click to view credits ledger">
        <div class="stat-header">
          <span class="stat-label">Skill Credits</span>
          <div class="stat-icon warning">🪙</div>
        </div>
        <div class="stat-value">${currentUser.skillCredits || 0} <span style="font-size:13px; font-weight:600; color:var(--text-muted);">Credits</span></div>
        <div class="stat-footer text-muted">
          <span>1 Teaching Hour = 1 Credit</span>
        </div>
      </div>

      <!-- 3. Current Streak -->
      <div class="stat-card">
        <div class="stat-header">
          <span class="stat-label">Learning Streak</span>
          <div class="stat-icon success">🔥</div>
        </div>
        <div class="stat-value">${currentUser.streakDays || 7} <span style="font-size:13px; font-weight:600; color:var(--text-muted);">Days</span></div>
        <div class="stat-footer text-primary">
          <span>Active daily exchange practice</span>
        </div>
      </div>

      <!-- 4. Completed Exchanges -->
      <div class="stat-card">
        <div class="stat-header">
          <span class="stat-label">Completed Exchanges</span>
          <div class="stat-icon secondary">🤝</div>
        </div>
        <div class="stat-value">${currentUser.completedExchanges || 0}</div>
        <div class="stat-footer text-muted">
          <span>⭐ ${currentUser.rating || 4.9} Partner Rating</span>
        </div>
      </div>
    </div>

    <!-- Skills I Teach vs Skills I Want Card -->
    <div class="skills-overview-box">
      <!-- Column A: Skills I Teach -->
      <div class="skills-column">
        <div class="skills-column-title" style="color:var(--teach-dark);">
          <span>🎓 Skills I Can Teach</span>
          <span class="badge badge-success" style="font-size:10px;">${(currentUser.skillsTeach || []).length} active</span>
        </div>
        <div class="skills-chips-wrapper">
          ${(currentUser.skillsTeach || []).map(st => `
            <div class="skill-tag skill-tag-teach" title="${st.description || ''}">
              <span>✓</span>
              <span><strong>${st.name}</strong> (${st.level})</span>
            </div>
          `).join("")}
        </div>
      </div>

      <!-- Column B: Skills I Want -->
      <div class="skills-column">
        <div class="skills-column-title" style="color:var(--want-dark);">
          <span>🎯 Skills I Want to Learn</span>
          <span class="badge badge-primary" style="font-size:10px;">${(currentUser.skillsWant || []).length} active</span>
        </div>
        <div class="skills-chips-wrapper">
          ${(currentUser.skillsWant || []).map(sw => `
            <div class="skill-tag skill-tag-want" title="${sw.goal || ''}">
              <span>★</span>
              <span><strong>${sw.name}</strong> (${sw.targetLevel})</span>
            </div>
          `).join("")}
        </div>
      </div>
    </div>

    <!-- Main Content Layout Grid -->
    <div class="dashboard-main-grid">
      <!-- Left Column: Recommended Matches & Learning Roadmap -->
      <div style="display:flex; flex-direction:column; gap:var(--space-6);">
        <!-- Recommended Matches Section -->
        <div>
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:var(--space-4);">
            <div>
              <h3 style="font-size:17px;">Top Recommended Matches</h3>
              <p style="font-size:13px; color:var(--text-muted);">
                Calculated using two-way reciprocity, experience, and availability
              </p>
            </div>
            <button class="btn btn-ghost btn-sm" id="dash-btn-see-all">
              View all (${otherUsers.length}) →
            </button>
          </div>

          <div style="display:flex; flex-direction:column; gap:var(--space-4);">
            ${recommendedMatches.slice(0, 3).map(m => renderDashboardMatchCard(m, currentUser)).join("")}
          </div>
        </div>

        <!-- Learning Progress Overview -->
        <div class="card" style="padding:var(--space-5);">
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:var(--space-4);">
            <div class="flex items-center gap-2">
              <span style="font-size:18px;">🎯</span>
              <h3 style="font-size:16px;">Active Learning Progress</h3>
            </div>
            <button class="btn btn-ghost btn-sm" id="dash-btn-view-progress">Full Roadmap →</button>
          </div>

          ${renderDashboardProgressSection(currentUser)}
        </div>
      </div>

      <!-- Right Column: Pending Requests, Upcoming Sessions, AI Quick Prompt -->
      <div style="display:flex; flex-direction:column; gap:var(--space-5);">
        <!-- AI Skill Matchmaker Prompt Card -->
        <div class="card" style="background: linear-gradient(135deg, #4338ca 0%, #312e81 100%); color:white; padding:var(--space-5); box-shadow: var(--shadow-md);">
          <span class="badge" style="background:rgba(255,255,255,0.2); color:white; margin-bottom:8px; font-weight:700;">✨ Smart Match</span>
          <h4 style="color:white; font-size:16px; margin-bottom:4px;">AI Skill Matchmaker</h4>
          <p style="font-size:12px; color:#e0e7ff; line-height:1.5; margin-bottom:var(--space-4);">
            Type what you teach and want in natural language to generate a tailored 4-week reciprocal syllabus!
          </p>
          <button class="btn btn-secondary btn-sm w-full" id="dash-btn-ai-match" style="color:var(--primary); font-weight:700;">
            Try AI Matchmaker →
          </button>
        </div>

        <!-- Pending Exchange Requests -->
        <div class="card" style="padding:var(--space-5);">
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:var(--space-3);">
            <h4 style="font-size:15px; display:flex; align-items:center; gap:6px;">
              <span>📥</span>
              <span>Pending Requests</span>
            </h4>
            <span class="badge badge-primary">${pendingRequests.length}</span>
          </div>

          ${pendingRequests.length === 0 ? `
            <div style="text-align:center; padding:var(--space-4); color:var(--text-muted); font-size:13px;">
              No pending requests. Discover new partners to start swapping!
            </div>
          ` : `
            <div style="display:flex; flex-direction:column; gap:var(--space-3);">
              ${pendingRequests.map(req => {
                const sender = store.getUserById(req.fromUserId);
                return `
                  <div style="background:var(--bg-surface-subtle); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:var(--space-3);">
                    <div class="flex items-center gap-2" style="margin-bottom:6px;">
                      <div class="avatar avatar-xs">
                        <img src="${sender?.avatar || ''}" alt="${sender?.name || ''}" />
                      </div>
                      <div style="font-size:13px; font-weight:700;">${sender?.name || 'User'}</div>
                    </div>
                    <div style="font-size:12px; color:var(--text-secondary); margin-bottom:8px;">
                      Offers: <strong style="color:var(--teach-dark);">${req.offerSkill}</strong><br>
                      Wants: <strong style="color:var(--want-dark);">${req.requestSkill}</strong>
                    </div>
                    <div class="flex gap-2">
                      <button class="btn btn-success btn-sm w-full" data-accept-req="${req.id}">Accept</button>
                      <button class="btn btn-secondary btn-sm" data-decline-req="${req.id}">Decline</button>
                    </div>
                  </div>
                `;
              }).join("")}
            </div>
          `}
        </div>

        <!-- Upcoming Sessions Card -->
        <div class="card" style="padding:var(--space-5);">
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:var(--space-3);">
            <h4 style="font-size:15px; display:flex; align-items:center; gap:6px;">
              <span>📅</span>
              <span>Upcoming Session</span>
            </h4>
            <span class="badge badge-success">${upcomingSessions.length}</span>
          </div>

          ${upcomingSessions.length === 0 ? `
            <div style="text-align:center; padding:var(--space-4); color:var(--text-muted); font-size:13px;">
              No sessions scheduled this week.
              <button class="btn btn-secondary btn-sm w-full" style="margin-top:8px;" id="dash-schedule-now">Schedule Now</button>
            </div>
          ` : `
            ${upcomingSessions.slice(0, 1).map(sess => {
              const partner = store.getUserById(sess.partnerId);
              return `
                <div style="background:var(--bg-surface-subtle); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:var(--space-4);">
                  <div class="flex items-center gap-3" style="margin-bottom:8px;">
                    <div class="avatar avatar-sm">
                      <img src="${partner?.avatar || ''}" alt="${partner?.name || ''}" />
                      <div class="avatar-status online"></div>
                    </div>
                    <div>
                      <div style="font-size:14px; font-weight:700;">${partner?.name || 'Partner'}</div>
                      <div style="font-size:12px; color:var(--text-muted);">${sess.skillExchange}</div>
                    </div>
                  </div>
                  <div style="font-size:12px; color:var(--text-secondary); margin-bottom:10px;">
                    🕒 ${sess.date} at ${sess.time} (${sess.durationMinutes} min) · Online Video Room
                  </div>
                  <button class="btn btn-primary btn-sm w-full" data-join-session="${sess.id}">
                    🎥 Enter Video Room
                  </button>
                </div>
              `;
            }).join("")}
          `}
        </div>
      </div>
    </div>
  `;

  bindDashboardEvents(container, onNavigate);
  return container;
}

function renderDashboardMatchCard(match, currentUser) {
  const { user, totalScore, reasons, isTwoWayMatch } = match;

  return `
    <div class="card" style="padding:var(--space-5);">
      <div style="display:flex; align-items:flex-start; justify-content:space-between; gap:var(--space-4); flex-wrap:wrap;">
        <div class="flex items-center gap-3">
          <div class="avatar avatar-lg">
            <img src="${user.avatar}" alt="${user.name}" />
            <div class="avatar-status online"></div>
            ${user.verified ? `<div class="avatar-verified" title="Identity Verified">✓</div>` : ""}
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h4 style="font-size:16px;">${user.name}</h4>
              <span class="match-score-badge high">⚡ ${totalScore}% Match</span>
              ${isTwoWayMatch ? `<span class="badge badge-success" style="font-size:10px;">Reciprocal Match</span>` : ""}
            </div>
            <div style="font-size:12px; color:var(--text-muted); margin-top:2px;">
              ${user.headline} · ⭐ ${user.rating} (${user.completedExchanges || 0} swaps)
            </div>
          </div>
        </div>

        <div class="flex gap-2">
          <button class="btn btn-secondary btn-sm" data-view-match="${user.id}">
            Why You Match
          </button>
          <button class="btn btn-primary btn-sm" data-request-match="${user.id}">
            Exchange Request
          </button>
        </div>
      </div>

      <!-- Skills Barter Strip -->
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:var(--space-3); background:#f8fafc; border:1px solid var(--border-subtle); padding:var(--space-3); border-radius:var(--radius-md); margin-top:var(--space-4); font-size:12px;">
        <div>
          <span style="font-weight:800; color:var(--teach-dark); font-size:10.5px; text-transform:uppercase; letter-spacing:0.04em;">THEY TEACH:</span>
          <div style="margin-top:2px; font-weight:600;">${user.skillsTeach.map(s => s.name).join(", ")}</div>
        </div>
        <div>
          <span style="font-weight:800; color:var(--want-dark); font-size:10.5px; text-transform:uppercase; letter-spacing:0.04em;">THEY WANT:</span>
          <div style="margin-top:2px; font-weight:600;">${user.skillsWant.map(s => s.name).join(", ")}</div>
        </div>
      </div>

      <!-- Reasons Checklist snippet -->
      <div style="margin-top:var(--space-3); display:flex; flex-wrap:wrap; gap:var(--space-2);">
        ${reasons.slice(0, 3).map(r => `
          <span style="font-size:11px; color:#15803d; background:#f0fdf4; border:1px solid #bbf7d0; padding:2px 8px; border-radius:var(--radius-full); font-weight:600;">
            ✓ ${r}
          </span>
        `).join("")}
      </div>
    </div>
  `;
}

function renderDashboardProgressSection(currentUser) {
  const activeProg = currentUser.progress?.[0];
  if (!activeProg) {
    return `<div style="font-size:13px; color:var(--text-muted);">No active skill milestones yet.</div>`;
  }

  return `
    <div>
      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:6px;">
        <span style="font-size:14px; font-weight:700;">${activeProg.skill}</span>
        <span style="font-size:13px; font-weight:800; color:var(--primary);">${activeProg.progressPct}%</span>
      </div>
      <div class="progress-container" style="margin-bottom:var(--space-4);">
        <div class="progress-bar" style="width: ${activeProg.progressPct}%;"></div>
      </div>

      <div style="display:flex; flex-direction:column; gap:6px;">
        ${activeProg.milestones.map((m) => `
          <div style="display:flex; align-items:center; gap:8px; font-size:13px; color:${m.completed ? 'var(--text-secondary)' : 'var(--text-primary)'};">
            <span style="color:${m.completed ? 'var(--success)' : 'var(--text-subtle)'}; font-weight:800;">
              ${m.completed ? '✓' : '○'}
            </span>
            <span style="${m.completed ? 'text-decoration:line-through; opacity:0.75;' : 'font-weight:500;'}">
              ${m.title}
            </span>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

function bindDashboardEvents(container, onNavigate) {
  container.querySelector("#dash-btn-discover")?.addEventListener("click", () => onNavigate("discover"));
  container.querySelector("#dash-btn-see-all")?.addEventListener("click", () => onNavigate("discover"));
  container.querySelector("#dash-btn-view-progress")?.addEventListener("click", () => onNavigate("progress"));
  container.querySelector("#dash-btn-ai-match")?.addEventListener("click", () => onNavigate("ai-matchmaker"));
  container.querySelector("#stat-card-credits")?.addEventListener("click", () => onNavigate("credits"));

  const scheduleBtn = container.querySelector("#dash-btn-schedule") || container.querySelector("#dash-schedule-now");
  scheduleBtn?.addEventListener("click", () => openScheduleModal());

  container.querySelectorAll("[data-view-match]").forEach(btn => {
    btn.addEventListener("click", () => {
      const targetUserId = btn.getAttribute("data-view-match");
      openMatchDetailsModal(targetUserId, onNavigate);
    });
  });

  container.querySelectorAll("[data-request-match]").forEach(btn => {
    btn.addEventListener("click", () => {
      const targetUserId = btn.getAttribute("data-request-match");
      openSendRequestModal(targetUserId);
    });
  });

  container.querySelectorAll("[data-accept-req]").forEach(btn => {
    btn.addEventListener("click", () => {
      const reqId = btn.getAttribute("data-accept-req");
      store.acceptRequest(reqId);
      toast.success("Request Accepted", "Skill exchange confirmed! Message thread opened.");
      onNavigate("dashboard");
    });
  });

  container.querySelectorAll("[data-decline-req]").forEach(btn => {
    btn.addEventListener("click", () => {
      const reqId = btn.getAttribute("data-decline-req");
      store.declineRequest(reqId);
      toast.info("Request Declined", "Proposal declined.");
      onNavigate("dashboard");
    });
  });

  container.querySelectorAll("[data-join-session]").forEach(btn => {
    btn.addEventListener("click", () => {
      const sessId = btn.getAttribute("data-join-session");
      openSessionRoomModal(sessId, onNavigate);
    });
  });
}
