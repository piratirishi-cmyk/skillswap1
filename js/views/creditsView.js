/**
 * Skill Credits Virtual Economy View
 * Displays current balance, credits earned/spent, rules, and transaction history ledger
 */

import { store } from "../store/state.js";
import { showCreditEarningAnimation, openSpendCreditModal } from "../components/creditModals.js";

export function renderCreditsView(onNavigate) {
  const container = document.createElement("div");
  container.className = "credits-view";

  let activeFilter = "all"; // "all" | "earned" | "spent"

  function renderView() {
    const currentUser = store.getCurrentUser();
    const allTransactions = store.state.transactions || [];

    // Calculate dynamic totals
    const earnedTotal = allTransactions
      .filter(t => t.type === "teaching_earned" || t.type === "welcome_bonus")
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    const spentTotal = allTransactions
      .filter(t => t.type === "learning_spent")
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    // Filter transactions
    const filteredTransactions = allTransactions.filter(t => {
      if (activeFilter === "earned") return t.type === "teaching_earned" || t.type === "welcome_bonus";
      if (activeFilter === "spent") return t.type === "learning_spent";
      return true;
    });

    container.innerHTML = `
      <!-- Top Concept Barter Ribbon -->
      <div class="barter-concept-strip" style="margin-bottom:var(--space-6);">
        <span class="barter-concept-step step-teach">🎓 I teach my craft (+1 Cr)</span>
        <span class="barter-concept-arrow">➔</span>
        <span class="barter-concept-step step-learn">💡 You teach yours (-1 Cr)</span>
        <span class="barter-concept-arrow">➔</span>
        <span class="barter-concept-step step-grow">🌱 Zero money exchanged</span>
      </div>

      <!-- Page Header with Demo Triggers -->
      <div style="display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:var(--space-6); flex-wrap:wrap; gap:var(--space-4);">
        <div>
          <div style="font-size:11px; font-weight:800; color:var(--gold); text-transform:uppercase; letter-spacing:0.06em;">
            Virtual Skill Economy
          </div>
          <h1 style="font-size:26px; margin-top:2px;">Skill Credits Ledger</h1>
          <p style="font-size:13.5px; color:var(--text-muted); margin-top:2px;">
            A decentralized, money-free knowledge exchange system. <strong>1 hour of teaching = 1 Skill Credit</strong>.
          </p>
        </div>

        <!-- Interactive Sandbox Demo Actions -->
        <div style="display:flex; gap:var(--space-2); flex-wrap:wrap;">
          <button class="btn btn-success btn-sm" id="btn-demo-earn">
            ✨ Test Earning (+1 Credit)
          </button>
          <button class="btn btn-primary btn-sm" id="btn-demo-spend">
            ⚡ Spend Credits on Session (-1 Cr)
          </button>
        </div>
      </div>

      <!-- Stats Row -->
      <div class="dashboard-stats-grid" style="margin-bottom:var(--space-6);">
        <!-- Current Balance -->
        <div class="stat-card" style="background: linear-gradient(135deg, #ffffff 0%, #fffbeb 100%); border: 1.5px solid #fde68a;">
          <div class="stat-header">
            <span class="stat-label" style="color:#92400e;">Available Balance</span>
            <div class="stat-icon warning">🪙</div>
          </div>
          <div class="stat-value" style="color:#b45309;">${currentUser.skillCredits || 0} <span style="font-size:14px; font-weight:700;">Credits</span></div>
          <div class="stat-footer" style="color:#92400e;">
            <span>✓ Ready to book 1-on-1 lessons</span>
          </div>
        </div>

        <!-- Credits Earned -->
        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-label">Total Credits Earned</span>
            <div class="stat-icon success">📈</div>
          </div>
          <div class="stat-value text-success">+${earnedTotal} <span style="font-size:13px; font-weight:600; color:var(--text-muted);">Credits</span></div>
          <div class="stat-footer text-muted">
            <span>From verified peer teaching</span>
          </div>
        </div>

        <!-- Credits Spent -->
        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-label">Total Credits Spent</span>
            <div class="stat-icon primary">🎓</div>
          </div>
          <div class="stat-value" style="color:var(--want-dark);">-${spentTotal} <span style="font-size:13px; font-weight:600; color:var(--text-muted);">Credits</span></div>
          <div class="stat-footer text-muted">
            <span>Invested in your learning</span>
          </div>
        </div>

        <!-- Teaching Hours -->
        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-label">Teaching Hours</span>
            <div class="stat-icon secondary">⏱️</div>
          </div>
          <div class="stat-value">${currentUser.teachingHours || 0} <span style="font-size:13px; font-weight:600; color:var(--text-muted);">Hours</span></div>
          <div class="stat-footer text-muted">
            <span>Contributed to community</span>
          </div>
        </div>
      </div>

      <!-- First-Time User Principles Card -->
      <div class="card" style="background:var(--bg-surface-subtle); border-left:4px solid var(--gold); padding:var(--space-5); margin-bottom:var(--space-6);">
        <div style="display:flex; align-items:flex-start; justify-content:space-between; flex-wrap:wrap; gap:var(--space-4);">
          <div>
            <h4 style="font-size:15px; margin-bottom:4px; display:flex; align-items:center; gap:6px;">
              <span>💡</span>
              <span>How Skill Credits Work (Zero Real Money Guarantee)</span>
            </h4>
            <div style="font-size:13px; color:var(--text-secondary); line-height:1.6; max-width:780px;">
              • <strong>Earn Credits by Teaching:</strong> Whenever you complete a 60-minute teaching session, <strong>+1 Skill Credit</strong> is credited to your account.<br>
              • <strong>Spend Credits to Learn:</strong> Use your credits to book 1-on-1 sessions with any mentor across the community, even if they don't want to learn your specific skill.<br>
              • <strong>Decentralized Internal Barter:</strong> No credit cards, no transaction fees, and no fiat money. 100% peer empowerment.
            </div>
          </div>

          <div style="text-align:right;">
            <div class="badge badge-warning" style="font-weight:700; font-size:11px;">
              Internal Virtual Economy
            </div>
          </div>
        </div>
      </div>

      <!-- Transaction Ledger Card -->
      <div class="card" style="overflow:hidden;">
        <div class="card-header" style="flex-wrap:wrap; gap:var(--space-3);">
          <div class="flex items-center gap-2">
            <h3 style="font-size:16px;">Credit Activity & Ledger</h3>
            <span class="badge badge-neutral">${filteredTransactions.length} records</span>
          </div>

          <!-- Filter Tabs -->
          <div style="display:flex; gap:var(--space-1); background:var(--bg-surface-subtle); padding:3px; border-radius:var(--radius-md); border:1px solid var(--border-subtle);">
            <button class="btn btn-sm ${activeFilter === 'all' ? 'btn-primary' : 'btn-ghost'}" id="filter-all-tx" style="padding:3px 10px; font-size:11.5px;">
              All (${allTransactions.length})
            </button>
            <button class="btn btn-sm ${activeFilter === 'earned' ? 'btn-primary' : 'btn-ghost'}" id="filter-earned-tx" style="padding:3px 10px; font-size:11.5px;">
              Earned (+)
            </button>
            <button class="btn btn-sm ${activeFilter === 'spent' ? 'btn-primary' : 'btn-ghost'}" id="filter-spent-tx" style="padding:3px 10px; font-size:11.5px;">
              Spent (-)
            </button>
          </div>
        </div>

        <div style="overflow-x:auto;">
          <table style="width:100%; border-collapse:collapse; font-size:13px; text-align:left;">
            <thead>
              <tr style="background:var(--bg-surface-muted); color:var(--text-muted); border-bottom:1px solid var(--border-subtle);">
                <th style="padding:12px 18px; font-weight:700; font-size:11.5px; text-transform:uppercase;">Date</th>
                <th style="padding:12px 18px; font-weight:700; font-size:11.5px; text-transform:uppercase;">Activity Description</th>
                <th style="padding:12px 18px; font-weight:700; font-size:11.5px; text-transform:uppercase;">Partner</th>
                <th style="padding:12px 18px; font-weight:700; font-size:11.5px; text-transform:uppercase;">Credit Delta</th>
                <th style="padding:12px 18px; font-weight:700; font-size:11.5px; text-transform:uppercase;">Balance After</th>
              </tr>
            </thead>
            <tbody>
              ${filteredTransactions.length === 0 ? `
                <tr>
                  <td colspan="5" style="padding:var(--space-8); text-align:center; color:var(--text-muted);">
                    No transactions recorded in this filter view.
                  </td>
                </tr>
              ` : filteredTransactions.map(tx => {
                const isPositive = tx.type === "teaching_earned" || tx.type === "welcome_bonus";
                return `
                  <tr style="border-bottom:1px solid var(--border-subtle); transition: background-color var(--transition-fast);" onmouseover="this.style.backgroundColor='#fafbfc'" onmouseout="this.style.backgroundColor='transparent'">
                    <td style="padding:12px 18px; color:var(--text-muted); font-family:var(--font-mono); font-size:12px;">
                      ${tx.date}
                    </td>
                    <td style="padding:12px 18px; font-weight:600; color:var(--text-primary);">
                      ${tx.description}
                    </td>
                    <td style="padding:12px 18px; color:var(--text-secondary);">
                      ${tx.partner}
                    </td>
                    <td style="padding:12px 18px;">
                      <span class="badge ${isPositive ? 'badge-success' : 'badge-neutral'}" style="font-weight:800;">
                        ${isPositive ? `+${tx.amount}` : `-${tx.amount}`} 🪙
                      </span>
                    </td>
                    <td style="padding:12px 18px; font-weight:800; color:var(--text-primary);">
                      ${tx.balanceAfter} Credits
                    </td>
                  </tr>
                `;
              }).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;

    bindEvents();
  }

  function bindEvents() {
    // Filter buttons
    container.querySelector("#filter-all-tx")?.addEventListener("click", () => {
      activeFilter = "all";
      renderView();
    });

    container.querySelector("#filter-earned-tx")?.addEventListener("click", () => {
      activeFilter = "earned";
      renderView();
    });

    container.querySelector("#filter-spent-tx")?.addEventListener("click", () => {
      activeFilter = "spent";
      renderView();
    });

    // Test Earning Animation button (Exact example from user prompt: +1 Skill Credit "Completed Guitar teaching session with Aisha")
    container.querySelector("#btn-demo-earn")?.addEventListener("click", () => {
      showCreditEarningAnimation({
        amount: 1,
        description: "Completed Guitar teaching session with Aisha",
        partnerName: "Aisha Khan",
        onDone: () => renderView()
      });
    });

    // Test Spending button (Launches Credit Spending Confirmation Modal)
    container.querySelector("#btn-demo-spend")?.addEventListener("click", () => {
      openSpendCreditModal({
        skillName: "Digital Art Basics",
        onConfirm: () => renderView()
      });
    });
  }

  renderView();
  return container;
}
