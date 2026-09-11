/**
 * Skill Credit Modals & Animations
 * Handles credit earning celebratory animations and credit spending confirmation dialogs
 */

import { store } from "../store/state.js";
import { modal } from "./modal.js";
import { toast } from "./toast.js";

/**
 * Animated Celebration Dialog when a user earns Skill Credits
 * Example: +1 Skill Credit "Completed Guitar teaching session with Aisha"
 */
export function showCreditEarningAnimation({
  amount = 1,
  description = "Completed Guitar teaching session with Aisha",
  partnerName = "Aisha Khan",
  onDone = null
}) {
  const currentUser = store.getCurrentUser();
  const prevBalance = currentUser.skillCredits || 0;

  // Deposit credit to store
  const tx = store.earnSkillCredit({
    amount,
    description,
    partnerName
  });

  const newBalance = currentUser.skillCredits;

  const contentHtml = `
    <div style="text-align:center; padding:var(--space-6) var(--space-4); display:flex; flex-direction:column; align-items:center;">
      <!-- Glowing Coin Burst Animation -->
      <div style="position:relative; width:96px; height:96px; margin:0 auto var(--space-4); display:flex; align-items:center; justify-content:center;">
        <div style="position:absolute; inset:0; background:radial-gradient(circle, rgba(245, 158, 11, 0.35) 0%, transparent 70%); border-radius:50%; animation: pulse 1.5s infinite;"></div>
        <div style="width:78px; height:78px; border-radius:50%; background:linear-gradient(135deg, #f59e0b 0%, #d97706 100%); display:flex; align-items:center; justify-content:center; font-size:42px; color:#fff; box-shadow:0 10px 25px rgba(245, 158, 11, 0.45); transform:scale(1); animation: coinDrop 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);">
          🪙
        </div>
      </div>

      <!-- Positive Delta Badge -->
      <div class="badge badge-success" style="font-size:16px; font-weight:800; padding:6px 16px; border-radius:var(--radius-full); margin-bottom:var(--space-2); box-shadow:0 2px 8px rgba(16, 185, 129, 0.2);">
        +${amount} Skill Credit
      </div>

      <h3 style="font-size:20px; font-weight:800; margin-top:6px; color:var(--text-primary);">
        Knowledge Exchanged!
      </h3>

      <div style="font-size:14px; font-weight:600; color:var(--text-secondary); margin-top:6px; max-width:380px; line-height:1.5;">
        "${description}"
      </div>

      <!-- Balance Update Strip -->
      <div style="margin-top:var(--space-5); background:linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); border:1px solid #fde68a; border-radius:var(--radius-lg); padding:var(--space-3) var(--space-6); display:flex; align-items:center; justify-content:center; gap:var(--space-4); width:100%; max-width:380px;">
        <div style="text-align:right;">
          <div style="font-size:11px; color:#92400e; font-weight:700; text-transform:uppercase;">Previous</div>
          <div style="font-size:16px; font-weight:700; color:#78350f;">${prevBalance} Cr</div>
        </div>

        <div style="font-size:20px; color:#d97706; font-weight:800;">➔</div>

        <div style="text-align:left;">
          <div style="font-size:11px; color:#92400e; font-weight:700; text-transform:uppercase;">New Balance</div>
          <div style="font-size:20px; font-weight:800; color:#b45309;">${newBalance} Credits</div>
        </div>
      </div>

      <p style="font-size:12px; color:var(--text-muted); margin-top:var(--space-4); line-height:1.5; max-width:360px;">
        Rule: 1 hour of teaching = 1 Skill Credit. Use this credit anytime to request a 1-on-1 learning session from any mentor!
      </p>
    </div>
  `;

  const footerHtml = `
    <button class="btn btn-primary btn-lg w-full" id="btn-earn-close" style="font-weight:700;">
      Got it! Continue Swapping →
    </button>
  `;

  modal.open({
    title: "Skill Credits Deposit",
    contentHtml,
    footerHtml,
    size: "md"
  });

  document.getElementById("btn-earn-close")?.addEventListener("click", () => {
    modal.close();
    toast.success("Balance Updated", `+${amount} Skill Credit deposited. Current balance: ${newBalance} Credits.`);
    if (typeof onDone === "function") onDone(newBalance);
  });
}

/**
 * Credit Spending Confirmation Dialog
 * Shows exact deduction, mentor details, and confirmation
 */
export function openSpendCreditModal({
  partnerId = null,
  skillName = "Learning Session",
  onConfirm = null
}) {
  const currentUser = store.getCurrentUser();
  const otherUsers = store.getOtherUsers();
  const defaultPartner = partnerId ? store.getUserById(partnerId) : (otherUsers[0] || null);

  const currentBalance = currentUser.skillCredits || 0;
  const cost = 1;
  const hasEnough = currentBalance >= cost;

  const contentHtml = `
    <div style="display:flex; flex-direction:column; gap:var(--space-4);">
      <!-- Summary Header -->
      <div style="text-align:center; padding-bottom:var(--space-2); border-bottom:1px solid var(--border-subtle);">
        <div style="font-size:32px; margin-bottom:4px;">🪙</div>
        <h3 style="font-size:18px;">Confirm Session Booking</h3>
        <p style="font-size:13px; color:var(--text-muted); margin-top:2px;">
          Use your earned Skill Credits to request a 1-hour personalized lesson.
        </p>
      </div>

      <!-- Partner & Skill Selector -->
      <div class="form-group">
        <label class="form-label">Select Mentor to Learn From</label>
        <select class="form-select" id="spend-mentor-select">
          ${otherUsers.map(u => `
            <option value="${u.id}" ${u.id === defaultPartner?.id ? "selected" : ""}>
              ${u.name} — Teaches ${u.skillsTeach.map(s => s.name).join(", ")}
            </option>
          `).join("")}
        </select>
      </div>

      <div class="form-group">
        <label class="form-label">Skill You Want to Learn</label>
        <input
          type="text"
          class="form-input"
          id="spend-skill-input"
          value="${skillName !== 'Learning Session' ? skillName : (defaultPartner?.skillsTeach[0]?.name || 'Skill')}"
        />
      </div>

      <!-- Credit Ledger Breakdown Card -->
      <div style="background:var(--bg-surface-subtle); border:1px solid var(--border-subtle); border-radius:var(--radius-lg); padding:var(--space-4);">
        <div style="display:flex; justify-content:space-between; align-items:center; font-size:13px; margin-bottom:8px;">
          <span style="color:var(--text-secondary);">Your Current Balance:</span>
          <span style="font-weight:700;">${currentBalance} Credits</span>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; font-size:13px; margin-bottom:8px;">
          <span style="color:var(--text-secondary);">Session Duration:</span>
          <span style="font-weight:600;">60 Minutes (1-on-1)</span>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; font-size:13.5px; padding-top:8px; border-top:1px dashed var(--border-subtle);">
          <span style="font-weight:700; color:var(--text-primary);">Credit Cost:</span>
          <span class="badge badge-warning" style="font-size:13px; font-weight:800;">-1 Skill Credit 🪙</span>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; font-size:13px; margin-top:8px; padding-top:8px; border-top:1px solid var(--border-subtle);">
          <span style="color:var(--text-muted);">Remaining Balance:</span>
          <span style="font-weight:800; color:${hasEnough ? 'var(--text-primary)' : 'var(--danger)'};">
            ${currentBalance - cost} Credits
          </span>
        </div>
      </div>

      <!-- Peer Barter Friendly Guarantee -->
      <div style="background:var(--primary-subtle); border:1px solid var(--primary-border); border-radius:var(--radius-md); padding:10px 14px; font-size:12px; color:var(--primary-hover); line-height:1.5;">
        🛡️ <strong>Zero Fiat Currency:</strong> SkillSwap is an internal virtual barter economy. You never pay with money; you spend credits earned through teaching others.
      </div>

      ${!hasEnough ? `
        <div style="background:var(--danger-subtle); border:1px solid var(--danger-border); border-radius:var(--radius-md); padding:10px 14px; font-size:12.5px; color:var(--danger); font-weight:600;">
          ⚠ You don't have enough credits right now. Teach a 1-hour session first or use the sandbox simulator below!
        </div>
      ` : ""}
    </div>
  `;

  const footerHtml = `
    <button class="btn btn-secondary" id="modal-btn-spend-cancel">Cancel</button>
    ${hasEnough ? `
      <button class="btn btn-primary" id="modal-btn-spend-confirm">
        Confirm & Spend 1 Credit (-1 🪙)
      </button>
    ` : `
      <button class="btn btn-success" id="modal-btn-simulate-earn">
        🎓 Simulate Teaching (+1 Credit)
      </button>
    `}
  `;

  modal.open({
    title: "Spend Skill Credit on Learning",
    contentHtml,
    footerHtml,
    size: "md"
  });

  document.getElementById("modal-btn-spend-cancel")?.addEventListener("click", () => modal.close());

  document.getElementById("modal-btn-spend-confirm")?.addEventListener("click", () => {
    const selectedMentorId = document.getElementById("spend-mentor-select")?.value;
    const selectedMentor = store.getUserById(selectedMentorId) || defaultPartner;
    const learningSkill = document.getElementById("spend-skill-input")?.value || "Skill";

    const result = store.spendSkillCredit({
      amount: 1,
      description: `Booked 1 hr learning session: ${learningSkill}`,
      partnerName: selectedMentor?.name || "Community Mentor"
    });

    if (result.success) {
      modal.close();
      toast.info(
        "Credit Spent",
        `-1 Skill Credit deducted. Session requested with ${selectedMentor?.name || 'Mentor'}.`
      );
      if (typeof onConfirm === "function") onConfirm(result.transaction);
    } else {
      toast.error("Error", "Could not deduct credit.");
    }
  });

  document.getElementById("modal-btn-simulate-earn")?.addEventListener("click", () => {
    modal.close();
    showCreditEarningAnimation({
      amount: 1,
      description: "Completed Guitar teaching session with Aisha",
      partnerName: "Aisha Khan",
      onDone: () => {
        // Reopen spending modal now that user has credits!
        openSpendCreditModal({ partnerId, skillName, onConfirm });
      }
    });
  });
}
