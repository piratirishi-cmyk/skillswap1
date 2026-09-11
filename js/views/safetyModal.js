/**
 * Safety, Trust & Community Guidelines Modal
 * Handles safety verification, safe offline meeting advice, user reporting, and blocking
 */

import { store } from "../store/state.js";
import { modal } from "../components/modal.js";
import { toast } from "../components/toast.js";

export function openSafetyModal() {
  const otherUsers = store.getOtherUsers();

  const contentHtml = `
    <div style="display:flex; flex-direction:column; gap:var(--space-6);">
      <!-- Section 1: Safe In-Person Barter Advice -->
      <div class="card" style="background:var(--bg-surface-subtle); padding:var(--space-5); border-left:4px solid var(--success);">
        <h3 style="font-size:16px; margin-bottom:var(--space-2); display:flex; align-items:center; gap:6px;">
          <span>📍</span>
          <span>Safe Offline Meeting Best Practices</span>
        </h3>
        <p style="font-size:13px; color:var(--text-secondary); line-height:1.6;">
          When conducting in-person barter exchanges (e.g. acoustic guitar lessons or portrait photography drills):
        </p>
        <div style="display:flex; flex-direction:column; gap:6px; margin-top:8px; font-size:13px; color:var(--text-secondary);">
          <div>• <strong>Public Venues Only:</strong> Always meet in public, well-lit spaces such as community libraries, co-working spaces, or cafes.</div>
          <div>• <strong>Daylight Hours:</strong> Schedule first-time in-person sessions during daytime or regular business hours.</div>
          <div>• <strong>Zero Monetary Requests:</strong> Never pay money or accept payment. SkillSwap is strictly non-monetary skill barter.</div>
          <div>• <strong>Share Location:</strong> Let a friend or family member know where your exchange is taking place.</div>
        </div>
      </div>

      <!-- Section 2: Identity Verification Badge -->
      <div style="display:flex; align-items:center; justify-content:space-between; background:var(--primary-subtle); padding:var(--space-4); border-radius:var(--radius-md); border:1px solid var(--primary-border);">
        <div class="flex items-center gap-3">
          <div style="width:36px; height:36px; border-radius:var(--radius-full); background:var(--primary); color:white; display:flex; align-items:center; justify-content:center; font-weight:bold;">
            ✓
          </div>
          <div>
            <div style="font-weight:700; font-size:14px; color:var(--text-primary);">Verified Member Badges</div>
            <div style="font-size:12px; color:var(--text-muted);">Look for the blue checkmark indicating government ID and community verification.</div>
          </div>
        </div>
        <span class="badge badge-primary">Standard on Profiles</span>
      </div>

      <!-- Section 3: Report or Block a User -->
      <div class="card" style="padding:var(--space-5);">
        <h4 style="font-size:15px; margin-bottom:var(--space-2); color:var(--danger);">
          🛡️ Report or Block a Member
        </h4>
        <p style="font-size:13px; color:var(--text-muted); margin-bottom:var(--space-4);">
          If an exchange partner violates guidelines, requests money, or behaves inappropriately, report them immediately.
        </p>

        <div class="form-group">
          <label class="form-label">Select Member</label>
          <select class="form-select" id="safety-report-user">
            ${otherUsers.map(u => `
              <option value="${u.id}">${u.name} (${u.headline})</option>
            `).join("")}
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Reason for Report</label>
          <select class="form-select" id="safety-report-reason">
            <option value="money">Commercial Solicitation / Asked for money</option>
            <option value="noshow">Repeated No-Show to scheduled barter</option>
            <option value="inappropriate">Inappropriate or disrespectful communication</option>
            <option value="misrepresentation">Misrepresented skill or expertise level</option>
            <option value="other">Other issue</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Explanation / Notes</label>
          <textarea class="form-textarea" id="safety-report-notes" placeholder="Please describe what happened..."></textarea>
        </div>

        <div class="flex gap-3" style="margin-top:var(--space-4);">
          <button class="btn btn-secondary btn-sm" id="safety-btn-block">
            🚫 Block Member
          </button>
          <button class="btn btn-danger btn-sm" id="safety-btn-submit">
            Submit Safety Report
          </button>
        </div>
      </div>
    </div>
  `;

  const footerHtml = `
    <button class="btn btn-primary" id="modal-btn-safety-close">Done</button>
  `;

  modal.open({
    title: "Trust, Safety & Guidelines",
    contentHtml,
    footerHtml,
    size: "lg"
  });

  document.getElementById("modal-btn-safety-close")?.addEventListener("click", () => modal.close());

  document.getElementById("safety-btn-submit")?.addEventListener("click", () => {
    const uid = document.getElementById("safety-report-user")?.value;
    const reason = document.getElementById("safety-report-reason")?.value;
    const notes = document.getElementById("safety-report-notes")?.value;

    store.reportUser(uid, reason, notes);
    modal.close();
    toast.success("Report Submitted", "Our safety moderation team has received your report.");
  });

  document.getElementById("safety-btn-block")?.addEventListener("click", () => {
    const uid = document.getElementById("safety-report-user")?.value;
    const user = store.getUserById(uid);
    if (confirm(`Block ${user?.name || 'this member'}? They will no longer be able to message you or appear in your matches.`)) {
      store.blockUser(uid);
      modal.close();
      toast.info("Member Blocked", `${user?.name || 'User'} has been blocked.`);
    }
  });
}
