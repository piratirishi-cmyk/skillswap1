/**
 * Match Details Modal
 * Mathematical 6-factor compatibility breakdown and "Why You Match" checklist
 */

import { store } from "../store/state.js";
import { calculateCompatibility } from "../services/matchingEngine.js";
import { modal } from "../components/modal.js";
import { openSendRequestModal } from "./requestsView.js";

export function openMatchDetailsModal(targetUserId, onNavigate) {
  const currentUser = store.getCurrentUser();
  const targetUser = store.getUserById(targetUserId);
  if (!targetUser) return;

  const match = calculateCompatibility(currentUser, targetUser);
  const { totalScore, breakdown, reasons, isTwoWayMatch } = match;

  const contentHtml = `
    <div class="compatibility-breakdown">
      <!-- Target User Header -->
      <div style="display:flex; align-items:center; justify-content:space-between; padding-bottom:var(--space-4); border-bottom:1px solid var(--border-subtle); flex-wrap:wrap; gap:var(--space-3);">
        <div class="flex items-center gap-3">
          <div class="avatar avatar-xl">
            <img src="${targetUser.avatar}" alt="${targetUser.name}" />
            <div class="avatar-status online"></div>
            ${targetUser.verified ? `<div class="avatar-verified" title="Identity Verified">✓</div>` : ""}
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h3 style="font-size:18px;">${targetUser.name}</h3>
              ${targetUser.verified ? `<span class="badge badge-success" style="font-size:10px;">ID Verified</span>` : ""}
            </div>
            <div style="font-size:13px; color:var(--text-muted);">${targetUser.headline}</div>
            <div style="font-size:12px; color:var(--text-secondary); margin-top:2px;">
              📍 ${targetUser.location} · 🗣️ ${targetUser.languages.join(", ")}
            </div>
          </div>
        </div>

        <div style="text-align:right;">
          <div class="match-score-badge high" style="font-size:15px; padding:6px 14px;">
            <span>⚡ ${totalScore}% Match</span>
          </div>
          ${isTwoWayMatch ? `
            <div style="font-size:11px; font-weight:700; color:var(--teach-dark); margin-top:4px;">
              ✓ Two-Way Reciprocal Barter
            </div>
          ` : ""}
        </div>
      </div>

      <!-- Reputation & Feedback Scores -->
      <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:var(--space-2); background:#f8fafc; border:1px solid var(--border-subtle); padding:var(--space-3); border-radius:var(--radius-lg); text-align:center;">
        <div>
          <div style="font-size:10.5px; color:var(--text-muted); font-weight:700; text-transform:uppercase;">Overall</div>
          <div style="font-size:14px; font-weight:800; color:var(--text-primary); margin-top:2px;">⭐ ${targetUser.rating}</div>
        </div>
        <div>
          <div style="font-size:10.5px; color:var(--text-muted); font-weight:700; text-transform:uppercase;">Teaching</div>
          <div style="font-size:14px; font-weight:800; color:var(--teach-dark); margin-top:2px;">${targetUser.ratingsBreakdown?.teachingQuality || 4.9}★</div>
        </div>
        <div>
          <div style="font-size:10.5px; color:var(--text-muted); font-weight:700; text-transform:uppercase;">Comms</div>
          <div style="font-size:14px; font-weight:800; color:var(--primary); margin-top:2px;">${targetUser.ratingsBreakdown?.communication || 5.0}★</div>
        </div>
        <div>
          <div style="font-size:10.5px; color:var(--text-muted); font-weight:700; text-transform:uppercase;">Reliability</div>
          <div style="font-size:14px; font-weight:800; color:var(--gold); margin-top:2px;">${targetUser.ratingsBreakdown?.reliability || 4.8}★</div>
        </div>
      </div>

      <!-- "Why You Match" Verification Checklist -->
      <div>
        <h4 style="font-size:12px; font-weight:800; text-transform:uppercase; letter-spacing:0.06em; color:var(--text-muted); margin-bottom:var(--space-2);">
          Why You Match:
        </h4>
        <div class="why-match-list">
          ${reasons.map(reason => `
            <div class="why-match-item">
              <span style="font-weight:bold; font-size:15px;">✓</span>
              <span>${reason}</span>
            </div>
          `).join("")}
        </div>
      </div>

      <!-- Detailed 6-Factor Algorithmic Breakdown -->
      <div>
        <h4 style="font-size:12px; font-weight:800; text-transform:uppercase; letter-spacing:0.06em; color:var(--text-muted); margin-bottom:var(--space-3);">
          6-Factor Mathematical Compatibility:
        </h4>
        <div style="display:flex; flex-direction:column; gap:var(--space-3);">
          ${Object.values(breakdown).map(item => {
            const pct = Math.round((item.score / item.max) * 100);
            return `
              <div class="breakdown-factor-item">
                <div class="factor-header">
                  <span>${item.label} <span class="factor-weight">(${item.weight})</span></span>
                  <span style="font-weight:700;">${item.score} / ${item.max} pts</span>
                </div>
                <div class="progress-container">
                  <div class="progress-bar" style="width: ${pct}%;"></div>
                </div>
              </div>
            `;
          }).join("")}
        </div>
      </div>

      <!-- Skills Exchange Matrix -->
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:var(--space-4); margin-top:var(--space-2);">
        <div class="card" style="padding:var(--space-4); background:var(--teach-bg); border-color:var(--teach-border);">
          <div style="font-size:11px; font-weight:800; color:var(--teach-dark); text-transform:uppercase; letter-spacing:0.04em;">THEY CAN TEACH YOU</div>
          <div style="margin-top:6px; display:flex; flex-direction:column; gap:4px;">
            ${targetUser.skillsTeach.map(s => `
              <div style="font-size:13px; font-weight:700; color:var(--text-primary);">
                • ${s.name} <span class="badge badge-success" style="font-size:10px;">${s.level}</span>
                <div style="font-size:11px; color:var(--text-muted); font-weight:normal; margin-left:12px;">${s.description || ""}</div>
              </div>
            `).join("")}
          </div>
        </div>

        <div class="card" style="padding:var(--space-4); background:var(--want-bg); border-color:var(--want-border);">
          <div style="font-size:11px; font-weight:800; color:var(--want-dark); text-transform:uppercase; letter-spacing:0.04em;">YOU CAN TEACH THEM</div>
          <div style="margin-top:6px; display:flex; flex-direction:column; gap:4px;">
            ${targetUser.skillsWant.map(s => `
              <div style="font-size:13px; font-weight:700; color:var(--text-primary);">
                • ${s.name} <span class="badge badge-secondary" style="font-size:10px;">Goal: ${s.targetLevel}</span>
                <div style="font-size:11px; color:var(--text-muted); font-weight:normal; margin-left:12px;">${s.goal || ""}</div>
              </div>
            `).join("")}
          </div>
        </div>
      </div>
    </div>
  `;

  const footerHtml = `
    <button class="btn btn-secondary" id="modal-btn-close">Close</button>
    <button class="btn btn-primary" id="modal-btn-request">
      Send Skill Exchange Request →
    </button>
  `;

  modal.open({
    title: `Match Breakdown: ${currentUser.name.split(" ")[0]} ⇄ ${targetUser.name.split(" ")[0]}`,
    contentHtml,
    footerHtml,
    size: "lg"
  });

  document.getElementById("modal-btn-close")?.addEventListener("click", () => modal.close());
  document.getElementById("modal-btn-request")?.addEventListener("click", () => {
    modal.close();
    openSendRequestModal(targetUserId);
  });
}
