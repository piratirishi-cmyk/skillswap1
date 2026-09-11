/**
 * Auth View & Demo Switcher Modal
 */

import { store } from "../store/state.js";
import { modal } from "../components/modal.js";
import { toast } from "../components/toast.js";

export function openAuthModal(onSuccess) {
  let isSignup = false;

  function renderModal() {
    const contentHtml = `
      <div style="display:flex; flex-direction:column; gap:var(--space-4);">
        <!-- Demo Quick-Select -->
        <div style="background:var(--primary-subtle); border:1px solid var(--primary-border); padding:var(--space-4); border-radius:var(--radius-md);">
          <div style="font-size:12px; font-weight:700; color:var(--primary); text-transform:uppercase; margin-bottom:6px;">
            ⚡ Quick Demo Sign-In
          </div>
          <div style="display:flex; gap:var(--space-2);">
            <button class="btn btn-secondary btn-sm w-full" id="auth-demo-alex">
              Sign In as Alex (Guitarist)
            </button>
            <button class="btn btn-secondary btn-sm w-full" id="auth-demo-maya">
              Sign In as Maya (Artist)
            </button>
          </div>
        </div>

        <div style="text-align:center; position:relative; margin:var(--space-2) 0;">
          <hr style="border:none; border-top:1px solid var(--border-subtle);" />
          <span style="position:absolute; top:-10px; left:50%; transform:translateX(-50%); background:#fff; padding:0 8px; font-size:11px; color:var(--text-muted);">
            or ${isSignup ? "create a new account" : "sign in"}
          </span>
        </div>

        ${isSignup ? `
          <div class="form-group">
            <label class="form-label">Full Name</label>
            <input type="text" class="form-input" id="auth-name" placeholder="Alex Rivera" />
          </div>
        ` : ""}

        <div class="form-group">
          <label class="form-label">Email Address</label>
          <input type="email" class="form-input" id="auth-email" value="alex@skillswap.live" />
        </div>

        <div class="form-group">
          <label class="form-label">Password</label>
          <input type="password" class="form-input" id="auth-pass" value="••••••••" />
        </div>

        <button class="btn btn-primary w-full" id="auth-submit-btn">
          ${isSignup ? "Create Free Barter Account" : "Sign In to SkillSwap"}
        </button>

        <div style="text-align:center; font-size:12px; color:var(--text-muted); margin-top:var(--space-2);">
          ${isSignup ? `
            Already have an account? <a href="#" id="auth-toggle-mode" style="font-weight:600;">Sign in</a>
          ` : `
            New to peer barter? <a href="#" id="auth-toggle-mode" style="font-weight:600;">Create free account</a>
          `}
        </div>
      </div>
    `;

    modal.open({
      title: isSignup ? "Create SkillSwap Account" : "Sign In to SkillSwap",
      contentHtml,
      size: "sm"
    });

    document.getElementById("auth-demo-alex")?.addEventListener("click", () => {
      store.switchDemoUser("user-alex");
      modal.close();
      toast.success("Welcome Alex!", "Signed in to your dashboard.");
      if (onSuccess) onSuccess("dashboard");
    });

    document.getElementById("auth-demo-maya")?.addEventListener("click", () => {
      store.switchDemoUser("user-maya");
      modal.close();
      toast.success("Welcome Maya!", "Signed in to your dashboard.");
      if (onSuccess) onSuccess("dashboard");
    });

    document.getElementById("auth-toggle-mode")?.addEventListener("click", (e) => {
      e.preventDefault();
      isSignup = !isSignup;
      renderModal();
    });

    document.getElementById("auth-submit-btn")?.addEventListener("click", () => {
      modal.close();
      toast.success("Welcome!", "Signed in to SkillSwap.");
      if (onSuccess) onSuccess("dashboard");
    });
  }

  renderModal();
}
