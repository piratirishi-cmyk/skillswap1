/**
 * Onboarding Wizard View
 * 4-step interactive flow to set up teach/learn skills and preview instant matches
 */

import { store } from "../store/state.js";
import { calculateCompatibility } from "../services/matchingEngine.js";
import { toast } from "../components/toast.js";

export function renderOnboardingView(onNavigate) {
  const container = document.createElement("div");
  container.className = "onboarding-view container";
  container.style.maxWidth = "760px";
  container.style.paddingTop = "var(--space-8)";
  container.style.paddingBottom = "var(--space-12)";

  let currentStep = 1;
  const formData = {
    teachSkill: "Guitar",
    teachLevel: "Expert",
    teachCategory: "Music & Audio",
    teachBio: "Acoustic fingerstyle and open chords",
    wantSkill: "Digital Art",
    wantLevel: "Intermediate",
    wantCategory: "Arts & Design",
    wantGoal: "Master Procreate character and landscape illustration",
    availability: ["Weekends", "Evenings"],
    mode: "both",
    languages: ["English"]
  };

  function updateView() {
    container.innerHTML = `
      <div class="card" style="padding: var(--space-8);">
        <!-- Step Indicator Header -->
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:var(--space-6); border-bottom:1px solid var(--border-subtle); padding-bottom:var(--space-4);">
          <div>
            <span class="badge badge-primary">Step ${currentStep} of 4</span>
            <h2 style="font-size:22px; margin-top:4px;">
              ${currentStep === 1 ? "What can you teach?" : ""}
              ${currentStep === 2 ? "What do you want to learn?" : ""}
              ${currentStep === 3 ? "Set your availability & mode" : ""}
              ${currentStep === 4 ? "Your Compatible Barter Matches" : ""}
            </h2>
          </div>
          <div style="font-size:13px; font-weight:700; color:var(--text-muted);">
            SkillSwap Onboarding
          </div>
        </div>

        <!-- Step 1: Skills I Teach -->
        ${currentStep === 1 ? `
          <div class="form-group">
            <label class="form-label">Primary Skill You Can Teach</label>
            <input type="text" class="form-input" id="ob-teach-skill" value="${formData.teachSkill}" placeholder="e.g. Guitar, Python, Photography, Spanish" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="form-group">
              <label class="form-label">Category</label>
              <select class="form-select" id="ob-teach-cat">
                <option ${formData.teachCategory === "Music & Audio" ? "selected" : ""}>Music & Audio</option>
                <option ${formData.teachCategory === "Technology" ? "selected" : ""}>Technology</option>
                <option ${formData.teachCategory === "Arts & Design" ? "selected" : ""}>Arts & Design</option>
                <option ${formData.teachCategory === "Business" ? "selected" : ""}>Business</option>
                <option ${formData.teachCategory === "Languages" ? "selected" : ""}>Languages</option>
                <option ${formData.teachCategory === "Lifestyle" ? "selected" : ""}>Lifestyle</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Your Mastery Level</label>
              <select class="form-select" id="ob-teach-level">
                <option ${formData.teachLevel === "Intermediate" ? "selected" : ""}>Intermediate</option>
                <option ${formData.teachLevel === "Advanced" ? "selected" : ""}>Advanced</option>
                <option ${formData.teachLevel === "Expert" ? "selected" : ""}>Expert</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Brief Description of what you can share</label>
            <textarea class="form-textarea" id="ob-teach-desc" placeholder="e.g. Acoustic fingerstyle, reading tabs, rhythm strumming...">${formData.teachBio}</textarea>
          </div>
        ` : ""}

        <!-- Step 2: Skills I Want -->
        ${currentStep === 2 ? `
          <div class="form-group">
            <label class="form-label">Skill You Want to Learn</label>
            <input type="text" class="form-input" id="ob-want-skill" value="${formData.wantSkill}" placeholder="e.g. Digital Art, Public Speaking, UI Design" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="form-group">
              <label class="form-label">Category</label>
              <select class="form-select" id="ob-want-cat">
                <option ${formData.wantCategory === "Arts & Design" ? "selected" : ""}>Arts & Design</option>
                <option ${formData.wantCategory === "Technology" ? "selected" : ""}>Technology</option>
                <option ${formData.wantCategory === "Music & Audio" ? "selected" : ""}>Music & Audio</option>
                <option ${formData.wantCategory === "Business" ? "selected" : ""}>Business</option>
                <option ${formData.wantCategory === "Languages" ? "selected" : ""}>Languages</option>
                <option ${formData.wantCategory === "Lifestyle" ? "selected" : ""}>Lifestyle</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Target Level</label>
              <select class="form-select" id="ob-want-level">
                <option ${formData.wantLevel === "Beginner" ? "selected" : ""}>Beginner</option>
                <option ${formData.wantLevel === "Intermediate" ? "selected" : ""}>Intermediate</option>
                <option ${formData.wantLevel === "Advanced" ? "selected" : ""}>Advanced</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">What is your learning goal?</label>
            <textarea class="form-textarea" id="ob-want-goal" placeholder="e.g. Create digital concept art, learn Procreate layers and color theory...">${formData.wantGoal}</textarea>
          </div>
        ` : ""}

        <!-- Step 3: Availability & Preferences -->
        ${currentStep === 3 ? `
          <div class="form-group">
            <label class="form-label">When are you available for exchanges?</label>
            <div style="display:flex; gap:var(--space-3); flex-wrap:wrap; margin-top:4px;">
              ${["Weekends", "Evenings", "Weekdays"].map(slot => `
                <label style="display:flex; align-items:center; gap:6px; background:var(--bg-surface-subtle); border:1px solid var(--border-subtle); padding:8px 14px; border-radius:var(--radius-md); cursor:pointer;">
                  <input type="checkbox" name="avail-slot" value="${slot}" ${formData.availability.includes(slot) ? "checked" : ""}>
                  <span style="font-size:14px; font-weight:600;">${slot}</span>
                </label>
              `).join("")}
            </div>
          </div>

          <div class="form-group" style="margin-top:var(--space-4);">
            <label class="form-label">Preferred Exchange Mode</label>
            <div style="display:flex; gap:var(--space-3); margin-top:4px;">
              <label style="display:flex; align-items:center; gap:6px; background:var(--bg-surface-subtle); border:1px solid var(--border-subtle); padding:8px 14px; border-radius:var(--radius-md); cursor:pointer;">
                <input type="radio" name="mode" value="online" ${formData.mode === "online" ? "checked" : ""}>
                <span style="font-size:14px; font-weight:600;">🌐 Online Video</span>
              </label>
              <label style="display:flex; align-items:center; gap:6px; background:var(--bg-surface-subtle); border:1px solid var(--border-subtle); padding:8px 14px; border-radius:var(--radius-md); cursor:pointer;">
                <input type="radio" name="mode" value="both" ${formData.mode === "both" ? "checked" : ""}>
                <span style="font-size:14px; font-weight:600;">⚡ Both Online & In-Person</span>
              </label>
            </div>
          </div>
        ` : ""}

        <!-- Step 4: Instant Match Preview -->
        ${currentStep === 4 ? `
          <div style="margin-bottom:var(--space-5);">
            <div class="badge badge-success" style="margin-bottom:8px;">✓ Profile Configured</div>
            <p style="font-size:14px; color:var(--text-muted);">
              Based on your offer to teach <strong>${formData.teachSkill}</strong> and desire to learn <strong>${formData.wantSkill}</strong>, we found immediate reciprocal matches:
            </p>
          </div>

          <div style="display:flex; flex-direction:column; gap:var(--space-4); margin-bottom:var(--space-6);">
            ${renderOnboardingMatchesPreview(formData)}
          </div>
        ` : ""}

        <!-- Action Buttons -->
        <div style="display:flex; align-items:center; justify-content:space-between; margin-top:var(--space-8); border-top:1px solid var(--border-subtle); padding-top:var(--space-4);">
          ${currentStep > 1 ? `
            <button class="btn btn-secondary" id="ob-btn-back">← Back</button>
          ` : `<div></div>`}

          ${currentStep < 4 ? `
            <button class="btn btn-primary" id="ob-btn-next">Continue →</button>
          ` : `
            <button class="btn btn-primary btn-lg" id="ob-btn-finish">Enter My Dashboard →</button>
          `}
        </div>
      </div>
    `;

    bindStepEvents();
  }

  function bindStepEvents() {
    const nextBtn = container.querySelector("#ob-btn-next");
    const backBtn = container.querySelector("#ob-btn-back");
    const finishBtn = container.querySelector("#ob-btn-finish");

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        // Collect form data for current step
        if (currentStep === 1) {
          formData.teachSkill = container.querySelector("#ob-teach-skill")?.value || "Guitar";
          formData.teachCategory = container.querySelector("#ob-teach-cat")?.value || "Music & Audio";
          formData.teachLevel = container.querySelector("#ob-teach-level")?.value || "Expert";
          formData.teachBio = container.querySelector("#ob-teach-desc")?.value || "";
        } else if (currentStep === 2) {
          formData.wantSkill = container.querySelector("#ob-want-skill")?.value || "Digital Art";
          formData.wantCategory = container.querySelector("#ob-want-cat")?.value || "Arts & Design";
          formData.wantLevel = container.querySelector("#ob-want-level")?.value || "Intermediate";
          formData.wantGoal = container.querySelector("#ob-want-goal")?.value || "";
        } else if (currentStep === 3) {
          const checkboxes = container.querySelectorAll("input[name='avail-slot']:checked");
          formData.availability = Array.from(checkboxes).map(c => c.value);
          const checkedMode = container.querySelector("input[name='mode']:checked");
          if (checkedMode) formData.mode = checkedMode.value;
        }

        currentStep++;
        updateView();
      });
    }

    if (backBtn) {
      backBtn.addEventListener("click", () => {
        currentStep--;
        updateView();
      });
    }

    if (finishBtn) {
      finishBtn.addEventListener("click", () => {
        // Apply to current user profile in store
        const currentUser = store.getCurrentUser();
        currentUser.skillsTeach = [
          { name: formData.teachSkill, category: formData.teachCategory, level: formData.teachLevel, description: formData.teachBio }
        ];
        currentUser.skillsWant = [
          { name: formData.wantSkill, category: formData.wantCategory, targetLevel: formData.wantLevel, goal: formData.wantGoal }
        ];
        currentUser.availability = formData.availability;
        currentUser.mode = formData.mode;
        store.updateProfile(currentUser);

        toast.success("Welcome to SkillSwap!", "Your skill barter profile is now live.");
        onNavigate("dashboard");
      });
    }
  }

  updateView();
  return container;
}

function renderOnboardingMatchesPreview(formData) {
  const syntheticUser = {
    ...store.getCurrentUser(),
    skillsTeach: [{ name: formData.teachSkill, category: formData.teachCategory, level: formData.teachLevel }],
    skillsWant: [{ name: formData.wantSkill, category: formData.wantCategory, targetLevel: formData.wantLevel }],
    availability: formData.availability,
    mode: formData.mode
  };

  const matches = store.getOtherUsers().map(target => {
    return {
      user: target,
      ...calculateCompatibility(syntheticUser, target)
    };
  }).sort((a, b) => b.totalScore - a.totalScore).slice(0, 2);

  return matches.map(m => `
    <div class="card" style="padding: var(--space-4); display:flex; align-items:center; justify-content:space-between;">
      <div class="flex items-center gap-3">
        <div class="avatar avatar-md">
          <img src="${m.user.avatar}" alt="${m.user.name}" />
          <div class="avatar-status online"></div>
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h4 style="font-size:15px;">${m.user.name}</h4>
            <span class="match-score-badge high">${m.totalScore}% Match</span>
          </div>
          <div style="font-size:12px; color:var(--text-muted); margin-top:2px;">
            Teaches: <strong>${m.user.skillsTeach[0]?.name || "Skill"}</strong> · Wants: <strong>${m.user.skillsWant[0]?.name || "Skill"}</strong>
          </div>
        </div>
      </div>
      <div class="badge badge-success">Reciprocal Match</div>
    </div>
  `).join("");
}
