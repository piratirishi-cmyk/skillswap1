/**
 * AI Skill Matchmaker View
 * Dedicated natural-language interface recommending reciprocal barter partners,
 * compatibility explanations, availability overlaps, and suggested exchange arrangements.
 */

import { store } from "../store/state.js";
import { analyzeBarterPrompt } from "../services/aiMatchmaker.js";
import { openMatchDetailsModal } from "./matchDetailsModal.js";
import { openSendRequestModal } from "./requestsView.js";
import { openScheduleModal } from "./sessionsView.js";
import { toast } from "../components/toast.js";

export function renderAiMatchmakerView(onNavigate) {
  const container = document.createElement("div");
  container.className = "ai-matchmaker-view";

  const currentUser = store.getCurrentUser();
  const otherUsers = store.getOtherUsers();

  let currentAnalysis = null;
  let isAnalyzing = false;
  let activeTab = "roadmap"; // "roadmap" | "breakdown"

  // Default initial prompt matching the exact user prompt
  const defaultPrompt = "I am good at Photoshop and photography. I want to learn guitar and public speaking.";

  // Run initial analysis
  analyzeBarterPrompt(defaultPrompt, otherUsers, currentUser).then(res => {
    currentAnalysis = res;
    renderView();
  });

  function renderView() {
    container.innerHTML = `
      <!-- Top Concept Barter Ribbon -->
      <div class="barter-concept-strip" style="margin-bottom:var(--space-6);">
        <span class="barter-concept-step step-teach">🎓 I teach my craft</span>
        <span class="barter-concept-arrow">➔</span>
        <span class="barter-concept-step step-learn">💡 You teach yours</span>
        <span class="barter-concept-arrow">➔</span>
        <span class="barter-concept-step step-grow">🌱 We both grow</span>
      </div>

      <!-- AI Banner & Natural Language Input Console -->
      <div class="ai-matchmaker-banner">
        <div class="flex items-center gap-2" style="margin-bottom:8px;">
          <span class="badge" style="background:rgba(255,255,255,0.22); color:white; font-weight:700;">
            ✨ AI Reciprocal Matchmaker Engine
          </span>
          <span class="badge" style="background:rgba(16, 185, 129, 0.25); color:#a7f3d0; border:1px solid rgba(167, 243, 208, 0.4); font-size:10px;">
            ● Ready for Gemini API
          </span>
        </div>
        <h2 style="font-size:26px;">Describe Your Skills & Learning Goals</h2>
        <p>
          Type naturally. Our semantic matching engine will identify what you offer, what you want to learn, and connect you with high-reciprocity barter partners.
        </p>

        <!-- Prompt Input Field -->
        <div class="ai-input-wrapper">
          <span style="font-size:18px; margin-left:8px;">💬</span>
          <input
            type="text"
            class="ai-input-field"
            id="ai-prompt-input"
            value="${currentAnalysis?.rawPrompt || defaultPrompt}"
            placeholder="e.g. I am good at Photoshop and photography. I want to learn guitar and public speaking..."
          />
          <button class="btn btn-primary" id="ai-btn-analyze" ${isAnalyzing ? "disabled" : ""}>
            ${isAnalyzing ? "Analyzing Intent..." : "Find AI Matches ✨"}
          </button>
        </div>

        <!-- Clickable Sample Prompts -->
        <div class="ai-prompts-suggestions">
          <span style="font-size:11.5px; opacity:0.85; font-weight:600;">One-click demo prompts:</span>
          <span class="ai-prompt-pill" data-prompt="I am good at Photoshop and photography. I want to learn guitar and public speaking.">
            🎯 "I am good at Photoshop and photography. I want to learn guitar and public speaking."
          </span>
          <span class="ai-prompt-pill" data-prompt="I can teach Python and backend web dev. I want to learn public speaking and Spanish.">
            🐍 "I can teach Python & web dev. I want to learn public speaking & Spanish."
          </span>
          <span class="ai-prompt-pill" data-prompt="I can teach digital art and Procreate. I want to learn acoustic guitar fingerpicking.">
            🎨 "I can teach digital art. I want to learn acoustic guitar fingerpicking."
          </span>
          <span class="ai-prompt-pill" data-prompt="I can teach French and pastry baking. I want to learn UI/UX design and Figma.">
            🥐 "I can teach French & baking. I want to learn UI/UX & Figma."
          </span>
        </div>
      </div>

      <!-- Live Analysis State -->
      ${isAnalyzing ? `
        <div class="card" style="padding:var(--space-12); text-align:center;">
          <div class="stat-icon primary" style="margin:0 auto var(--space-4); animation: pulse 1s infinite; width:52px; height:52px; font-size:26px;">✨</div>
          <h3 style="font-size:18px;">Analyzing Natural Language Intent...</h3>
          <div style="font-size:13px; color:var(--text-muted); margin-top:8px; display:flex; flex-direction:column; gap:4px; max-width:400px; margin-left:auto; margin-right:auto;">
            <span>✓ Extracting teaching strengths and learning goals...</span>
            <span>✓ Running 6-factor reciprocal compatibility matrix...</span>
            <span>✓ Synthesizing suggested 1-on-1 barter exchange arrangements...</span>
          </div>
        </div>
      ` : (currentAnalysis && currentAnalysis.topMatch ? `
        <div style="display:flex; flex-direction:column; gap:var(--space-6);">
          <!-- Extracted Skills Summary Bar -->
          <div style="background:#ffffff; border:1px solid var(--border-subtle); border-radius:var(--radius-lg); padding:var(--space-4) var(--space-5); display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:var(--space-3); box-shadow:var(--shadow-xs);">
            <div class="flex items-center gap-4 flex-wrap">
              <div>
                <span style="font-size:11px; font-weight:800; color:var(--teach-dark); text-transform:uppercase; letter-spacing:0.04em;">You Offer to Teach:</span>
                <div style="display:flex; gap:4px; margin-top:3px;">
                  ${currentAnalysis.extractedTeaches.map(s => `
                    <span class="skill-tag skill-tag-teach">✓ ${s}</span>
                  `).join("")}
                </div>
              </div>

              <div style="color:var(--text-subtle); font-size:18px;">⇄</div>

              <div>
                <span style="font-size:11px; font-weight:800; color:var(--want-dark); text-transform:uppercase; letter-spacing:0.04em;">You Want to Learn:</span>
                <div style="display:flex; gap:4px; margin-top:3px;">
                  ${currentAnalysis.extractedWants.map(s => `
                    <span class="skill-tag skill-tag-want">★ ${s}</span>
                  `).join("")}
                </div>
              </div>
            </div>

            <div style="font-size:12px; font-weight:700; color:var(--text-muted);">
              Found ${currentAnalysis.recommendations.length} compatible community partners
            </div>
          </div>

          <!-- TOP RECOMMENDATION CARD -->
          ${renderTopRecommendationCard(currentAnalysis.topMatch, currentAnalysis, onNavigate)}

          <!-- OTHER RECOMMENDED CANDIDATES -->
          ${currentAnalysis.recommendations.length > 1 ? `
            <div>
              <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:var(--space-4);">
                <h3 style="font-size:18px;">Other Compatible Partners</h3>
                <span style="font-size:12px; color:var(--text-muted); font-weight:600;">Ranked by two-way reciprocity</span>
              </div>

              <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(340px, 1fr)); gap:var(--space-5);">
                ${currentAnalysis.recommendations.slice(1, 4).map(rec => renderCandidateCard(rec)).join("")}
              </div>
            </div>
          ` : ""}
        </div>
      ` : `
        <div class="empty-state card">
          <div class="empty-state-icon">✨</div>
          <div class="empty-state-title">No direct matches found for this prompt</div>
          <div class="empty-state-desc">Try mentioning specific skills like Photoshop, Photography, Guitar, Public Speaking, or Python.</div>
        </div>
      `)}
    `;

    bindEvents();
  }

  function renderTopRecommendationCard(rec, analysis, onNavigate) {
    const { user, matchPercentage, skillsTheyCanTeachMe, skillsICanTeachThem, compatibilityExplanation, availabilityOverlap, suggestedExchange, suggestedPlan } = rec;

    return `
      <div class="card" style="padding:var(--space-6); border:2px solid var(--primary-border); background:linear-gradient(180deg, #ffffff 0%, #fafbfc 100%); box-shadow:var(--shadow-md);">
        <!-- Header Row -->
        <div style="display:flex; align-items:flex-start; justify-content:space-between; flex-wrap:wrap; gap:var(--space-4); border-bottom:1px solid var(--border-subtle); padding-bottom:var(--space-5);">
          <div class="flex items-center gap-4">
            <div class="avatar avatar-xl" style="width:76px; height:76px;">
              <img src="${user.avatar}" alt="${user.name}" />
              <div class="avatar-status online"></div>
              <div class="avatar-verified">✓</div>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="badge badge-primary" style="font-weight:800;">🏆 Top Recommendation</span>
                <span class="match-score-badge high" style="font-size:14px; font-weight:800; padding:4px 12px;">
                  ⚡ ${matchPercentage}% MATCH
                </span>
              </div>
              <h2 style="font-size:22px; margin-top:4px;">${user.name}</h2>
              <div style="font-size:13.5px; color:var(--text-muted);">${user.headline}</div>
              <div style="font-size:12px; color:var(--text-secondary); margin-top:2px;">
                📍 ${user.location} · ⭐ ${user.rating} (${user.completedExchanges || 0} completed exchanges)
              </div>
            </div>
          </div>

          <div class="flex gap-2" style="flex-wrap:wrap;">
            <button class="btn btn-secondary btn-sm" id="btn-top-match-details" data-uid="${user.id}">
              Why You Match
            </button>
            <button class="btn btn-primary btn-sm" id="btn-top-propose" data-uid="${user.id}">
              ⚡ Propose This Exchange
            </button>
          </div>
        </div>

        <!-- Two-Way Barter Matrix (Can Teach vs Wants) -->
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:var(--space-4); margin-top:var(--space-5);">
          <!-- Left: What they can teach me -->
          <div style="background:var(--teach-bg); border:1px solid var(--teach-border); border-radius:var(--radius-lg); padding:var(--space-4);">
            <div style="font-size:11px; font-weight:800; color:var(--teach-dark); text-transform:uppercase; letter-spacing:0.04em;">
              🎓 SKILLS THEY CAN TEACH YOU:
            </div>
            <div style="display:flex; flex-wrap:wrap; gap:6px; margin-top:6px;">
              ${skillsTheyCanTeachMe.map(s => `
                <span class="skill-tag skill-tag-teach" style="font-size:13px; font-weight:700; padding:4px 10px;">
                  ✓ ${s}
                </span>
              `).join("")}
            </div>
          </div>

          <!-- Right: What I can teach them -->
          <div style="background:var(--want-bg); border:1px solid var(--want-border); border-radius:var(--radius-lg); padding:var(--space-4);">
            <div style="font-size:11px; font-weight:800; color:var(--want-dark); text-transform:uppercase; letter-spacing:0.04em;">
              💡 SKILLS THEY WANT TO LEARN FROM YOU:
            </div>
            <div style="display:flex; flex-wrap:wrap; gap:6px; margin-top:6px;">
              ${skillsICanTeachThem.map(s => `
                <span class="skill-tag skill-tag-want" style="font-size:13px; font-weight:700; padding:4px 10px;">
                  ★ ${s}
                </span>
              `).join("")}
            </div>
          </div>
        </div>

        <!-- Why this is a strong match & Availability Overlap -->
        <div style="margin-top:var(--space-5);">
          <div style="font-size:12px; font-weight:800; text-transform:uppercase; letter-spacing:0.06em; color:var(--text-muted); margin-bottom:8px;">
            Why this is a strong match:
          </div>
          <div class="why-match-list">
            ${compatibilityExplanation.map(item => `
              <div class="why-match-item">
                <span style="font-weight:bold; font-size:15px;">✓</span>
                <span>${item}</span>
              </div>
            `).join("")}
          </div>
        </div>

        <!-- Availability Overlap Banner -->
        <div style="margin-top:var(--space-4); background:#f8fafc; border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:10px 14px; display:flex; align-items:center; gap:8px; font-size:13px; color:var(--text-secondary);">
          <span style="font-size:16px;">🗓️</span>
          <span><strong>Availability Overlap:</strong> ${availabilityOverlap}</span>
        </div>

        <!-- Suggested Exchange Arrangement Highlight -->
        <div style="margin-top:var(--space-5); background:linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%); border:1.5px solid var(--teach-border); border-radius:var(--radius-xl); padding:var(--space-4) var(--space-5); display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:var(--space-3);">
          <div>
            <div style="font-size:11px; font-weight:800; color:var(--teach-dark); text-transform:uppercase; letter-spacing:0.05em;">
              🔄 SUGGESTED EXCHANGE ARRANGEMENT
            </div>
            <div style="font-size:18px; font-weight:800; color:#065f46; margin-top:2px;">
              "${suggestedExchange}"
            </div>
            <div style="font-size:12px; color:var(--text-muted); margin-top:2px;">
              Balanced 1-for-1 peer exchange. Zero money needed · 1 Credit credited per completed hour.
            </div>
          </div>

          <div class="flex gap-2">
            <button class="btn btn-primary btn-sm" id="btn-quick-accept-arrangement" data-uid="${user.id}" data-arrangement="${suggestedExchange}">
              Send Exchange Request 🚀
            </button>
          </div>
        </div>

        <!-- Suggested 4-Week Custom Syllabus Timeline -->
        <div class="ai-result-roadmap" style="margin-top:var(--space-6); background:#ffffff; border-radius:var(--radius-xl); border:1px solid var(--border-subtle); padding:var(--space-5);">
          <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:var(--space-2);">
            <div>
              <span class="badge badge-success">Tailored Reciprocal Curriculum</span>
              <h3 style="font-size:16px; margin-top:4px;">Suggested 4-Week Skill Barter Plan</h3>
              <p style="font-size:12.5px; color:var(--text-muted);">
                Equal teaching and learning progression for you and ${user.name.split(" ")[0]}.
              </p>
            </div>
            <div class="badge badge-neutral" style="font-weight:700;">1 Hr / Week (30m each)</div>
          </div>

          <div class="roadmap-timeline" style="margin-top:var(--space-4);">
            ${suggestedPlan.map(week => `
              <div class="roadmap-week-card">
                <div class="week-label">Week 0${week.week}</div>
                <h4 style="font-size:13.5px; font-weight:700;">${week.title}</h4>
                <p style="font-size:11.5px; color:var(--text-muted); line-height:1.45;">${week.description}</p>

                <div style="border-top:1px solid var(--border-subtle); padding-top:8px; margin-top:auto; font-size:11px;">
                  <div style="color:var(--teach-dark); font-weight:700; margin-bottom:3px;">
                    🎓 You Teach: ${week.youTeach}
                  </div>
                  <div style="color:var(--want-dark); font-weight:700; margin-bottom:4px;">
                    🎯 You Learn: ${week.youLearn}
                  </div>
                  <div style="color:var(--text-subtle); font-style:italic;">
                    Deliverable: ${week.targetOutput}
                  </div>
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      </div>
    `;
  }

  function renderCandidateCard(rec) {
    const { user, matchPercentage, skillsTheyCanTeachMe, skillsICanTeachThem, suggestedExchange, availabilityOverlap } = rec;

    return `
      <div class="card" style="padding:var(--space-5); display:flex; flex-direction:column; gap:var(--space-3);">
        <div style="display:flex; align-items:flex-start; justify-content:space-between;">
          <div class="flex items-center gap-3">
            <div class="avatar avatar-md">
              <img src="${user.avatar}" alt="${user.name}" />
              <div class="avatar-status ${user.online ? 'online' : 'offline'}"></div>
            </div>
            <div>
              <div class="flex items-center gap-1">
                <h4 style="font-size:15px;">${user.name}</h4>
                ${user.verified ? `<span style="color:var(--primary); font-size:12px;">✓</span>` : ""}
              </div>
              <div style="font-size:11.5px; color:var(--text-muted);">${user.headline}</div>
            </div>
          </div>

          <span class="match-score-badge medium" style="font-size:12px; font-weight:800;">
            ⚡ ${matchPercentage}%
          </span>
        </div>

        <!-- Skills Summary -->
        <div style="background:#f8fafc; border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:var(--space-3); font-size:12px;">
          <div>
            <span style="font-weight:700; color:var(--teach-dark);">CAN TEACH:</span>
            <span style="font-weight:600; color:var(--text-primary); margin-left:4px;">${skillsTheyCanTeachMe.join(", ")}</span>
          </div>
          <div style="margin-top:3px;">
            <span style="font-weight:700; color:var(--want-dark);">WANTS:</span>
            <span style="font-weight:600; color:var(--text-primary); margin-left:4px;">${skillsICanTeachThem.join(", ")}</span>
          </div>
        </div>

        <div style="font-size:11.5px; color:var(--text-muted);">
          🗓️ ${availabilityOverlap}
        </div>

        <div style="margin-top:auto; padding-top:var(--space-2); display:flex; gap:var(--space-2);">
          <button class="btn btn-secondary btn-sm w-full" data-view-alt="${user.id}">
            Why You Match
          </button>
          <button class="btn btn-primary btn-sm w-full" data-request-alt="${user.id}" data-suggested="${suggestedExchange}">
            Exchange
          </button>
        </div>
      </div>
    `;
  }

  function bindEvents() {
    const inputEl = container.querySelector("#ai-prompt-input");
    const analyzeBtn = container.querySelector("#ai-btn-analyze");

    const runAnalysis = (promptText) => {
      if (!promptText || !promptText.trim()) return;
      isAnalyzing = true;
      renderView();

      setTimeout(() => {
        analyzeBarterPrompt(promptText, otherUsers, currentUser).then(res => {
          currentAnalysis = res;
          isAnalyzing = false;
          renderView();
          toast.success("AI Matches Found!", `Top match: ${currentAnalysis?.topMatch?.user?.name} (${currentAnalysis?.topMatch?.matchPercentage}% compatibility)`);
        });
      }, 500);
    };

    analyzeBtn?.addEventListener("click", () => {
      runAnalysis(inputEl?.value);
    });

    inputEl?.addEventListener("keydown", (e) => {
      if (e.key === "Enter") runAnalysis(inputEl?.value);
    });

    // Sample prompts
    container.querySelectorAll(".ai-prompt-pill").forEach(pill => {
      pill.addEventListener("click", () => {
        const text = pill.getAttribute("data-prompt");
        if (inputEl) inputEl.value = text;
        runAnalysis(text);
      });
    });

    // Top match actions
    container.querySelector("#btn-top-match-details")?.addEventListener("click", (e) => {
      const uid = e.target.getAttribute("data-uid");
      openMatchDetailsModal(uid, onNavigate);
    });

    container.querySelector("#btn-top-propose")?.addEventListener("click", (e) => {
      const uid = e.target.getAttribute("data-uid");
      const arrangement = currentAnalysis?.topMatch?.suggestedExchange || "";
      openSendRequestModal(uid, {
        note: `Hi! I found you through the SkillSwap AI Matchmaker. I'd love to propose an exchange arrangement: "${arrangement}". Let's connect!`
      });
    });

    container.querySelector("#btn-quick-accept-arrangement")?.addEventListener("click", (e) => {
      const uid = e.target.getAttribute("data-uid");
      const arrangement = e.target.getAttribute("data-arrangement");
      openSendRequestModal(uid, {
        note: `Hi! I'd love to propose the AI recommended exchange arrangement: "${arrangement}". Looking forward to trading skills!`
      });
    });

    // Runner-up actions
    container.querySelectorAll("[data-view-alt]").forEach(btn => {
      btn.addEventListener("click", () => {
        const uid = btn.getAttribute("data-view-alt");
        openMatchDetailsModal(uid, onNavigate);
      });
    });

    container.querySelectorAll("[data-request-alt]").forEach(btn => {
      btn.addEventListener("click", () => {
        const uid = btn.getAttribute("data-request-alt");
        const suggested = btn.getAttribute("data-suggested");
        openSendRequestModal(uid, {
          note: `Hi! I discovered your profile on SkillSwap AI Matchmaker. I'd love to exchange skills: "${suggested}".`
        });
      });
    });
  }

  renderView();
  return container;
}
