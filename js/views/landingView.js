/**
 * Landing Page View
 * High-impact marketing & concept explainer showcasing "I teach → You teach → We both grow."
 */

export function renderLandingView(onNavigate) {
  const container = document.createElement("div");
  container.className = "landing-view";

  container.innerHTML = `
    <!-- Top Marketing Header -->
    <header class="landing-nav">
      <div class="brand-logo">
        <div class="brand-icon">⇄</div>
        <span>SkillSwap</span>
      </div>
      <div class="landing-nav-links">
        <a href="#how-it-works" class="landing-nav-link" id="nav-link-how">How Barter Works</a>
        <a href="#live-matches" class="landing-nav-link" id="nav-link-demo">Live Network</a>
        <a href="#economy" class="landing-nav-link" id="nav-link-credits">Skill Economy</a>
        <button class="btn btn-primary btn-sm" id="landing-btn-enter">Enter Platform →</button>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="landing-hero container">
      <div class="hero-pill">
        <span>✨ The Reciprocal Skill Barter Network</span>
      </div>

      <h1 class="hero-title">
        Trade skills. <span class="hero-title-highlight">Grow together.</span>
      </h1>

      <!-- The Signature Core Concept Strip -->
      <div class="barter-concept-strip" style="margin-bottom: var(--space-6);">
        <span class="barter-concept-step step-teach">🎓 I teach my craft</span>
        <span class="barter-concept-arrow">➔</span>
        <span class="barter-concept-step step-learn">💡 You teach yours</span>
        <span class="barter-concept-arrow">➔</span>
        <span class="barter-concept-step step-grow">🌱 We both grow</span>
      </div>

      <p class="hero-subtitle">
        Exchange knowledge instead of money. Connect 1-on-1 with compatible barter partners in balanced, mutual learning loops. No invoices, no subscriptions—pure peer empowerment.
      </p>

      <div class="hero-cta-group">
        <button class="btn btn-primary btn-lg" id="hero-btn-start">
          <span>Start Swapping Skills</span>
          <span>→</span>
        </button>
        <button class="btn btn-secondary btn-lg" id="hero-btn-demo">
          <span>⚡ Try Live Demo as Arjun</span>
        </button>
      </div>

      <!-- Interactive Two-Way Barter Diagram -->
      <div class="barter-diagram-card">
        <div class="barter-diagram-header">
          <span class="badge badge-primary">Two-Way Peer Match Demonstration</span>
          <h3 style="margin-top:8px; font-size:20px;">Zero Money. 100% Value Exchange.</h3>
          <p style="font-size:14px; color:var(--text-muted); max-width:560px; margin:4px auto 0;">
            Unlike job portals or course marketplaces, SkillSwap connects people with complementary teaching and learning desires.
          </p>
        </div>

        <div class="barter-flow-grid">
          <!-- User A -->
          <div class="barter-user-card">
            <div class="flex items-center gap-3">
              <div class="avatar avatar-lg">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80" alt="Arjun" />
                <div class="avatar-status online"></div>
              </div>
              <div>
                <h4 style="font-size:16px;">Arjun Sharma</h4>
                <div style="font-size:12px; color:var(--text-muted);">Mumbai, India · Guitar Instructor (8 yrs)</div>
                <div style="font-size:11px; color:var(--text-subtle);">⭐ 4.9 · 14 completed swaps</div>
              </div>
            </div>

            <div style="padding-top:var(--space-2); border-top:1px solid var(--border-subtle);">
              <div style="font-size:11px; font-weight:800; color:var(--teach-dark); text-transform:uppercase; letter-spacing:0.04em;">CAN TEACH</div>
              <div class="skill-tag skill-tag-teach" style="margin-top:4px;">
                <span>🎸</span>
                <span><strong>Acoustic & Electric Guitar</strong> (Expert)</span>
              </div>
            </div>

            <div>
              <div style="font-size:11px; font-weight:800; color:var(--want-dark); text-transform:uppercase; letter-spacing:0.04em;">WANTS TO LEARN</div>
              <div class="skill-tag skill-tag-want" style="margin-top:4px;">
                <span>🎨</span>
                <span><strong>Procreate Digital Art</strong> (Goal)</span>
              </div>
            </div>
          </div>

          <!-- Connector -->
          <div class="barter-exchange-connector">
            <div class="connector-circle">⇄</div>
            <div class="connector-pill">98% Reciprocal Match</div>
            <div style="font-size:11px; color:var(--text-subtle); text-align:center; font-weight:600; line-height:1.4;">
              1 Hr Guitar Lesson<br>= 1 Hr Digital Art Lesson
            </div>
          </div>

          <!-- User B -->
          <div class="barter-user-card">
            <div class="flex items-center gap-3">
              <div class="avatar avatar-lg">
                <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80" alt="Maya" />
                <div class="avatar-status online"></div>
              </div>
              <div>
                <h4 style="font-size:16px;">Maya Lin</h4>
                <div style="font-size:12px; color:var(--text-muted);">San Francisco, CA · Illustrator</div>
                <div style="font-size:11px; color:var(--text-subtle);">⭐ 4.95 · 19 completed swaps</div>
              </div>
            </div>

            <div style="padding-top:var(--space-2); border-top:1px solid var(--border-subtle);">
              <div style="font-size:11px; font-weight:800; color:var(--teach-dark); text-transform:uppercase; letter-spacing:0.04em;">CAN TEACH</div>
              <div class="skill-tag skill-tag-teach" style="margin-top:4px;">
                <span>🎨</span>
                <span><strong>Procreate Digital Art</strong> (Expert)</span>
              </div>
            </div>

            <div>
              <div style="font-size:11px; font-weight:800; color:var(--want-dark); text-transform:uppercase; letter-spacing:0.04em;">WANTS TO LEARN</div>
              <div class="skill-tag skill-tag-want" style="margin-top:4px;">
                <span>🎸</span>
                <span><strong>Acoustic Guitar Basics</strong> (Goal)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Live Barter Ticker -->
    <div class="ticker-strip">
      <div class="ticker-content">
        <div class="ticker-item">⚡ <strong>Carlos</strong> exchanged 1 hr Python for Speech Coaching with <strong>Liam</strong></div>
        <div class="ticker-item">🎨 <strong>Maya</strong> unlocked the "10 Exchanges" milestone badge</div>
        <div class="ticker-item">🎸 <strong>Arjun</strong> scheduled a weekend session for Acoustic Guitar ↔ Digital Art</div>
        <div class="ticker-item">🥐 <strong>Emma</strong> earned 1 Skill Credit teaching Conversational French</div>
        <div class="ticker-item">📷 <strong>Sarah</strong> matched 94% with Liam on Photography ↔ Public Speaking</div>
      </div>
    </div>

    <!-- How It Works Section -->
    <section class="container" id="how-it-works" style="padding-bottom: var(--space-16);">
      <div class="text-center" style="max-width: 600px; margin: 0 auto var(--space-6);">
        <span class="badge badge-neutral">Platform Architecture</span>
        <h2 style="margin-top:8px;">How Skill Barter Works</h2>
        <p style="color:var(--text-muted); font-size:15px; margin-top:4px;">
          Four clear steps to unlock free personal mentorship in any discipline.
        </p>
      </div>

      <div class="steps-grid">
        <div class="step-card">
          <div class="step-number">1</div>
          <h4 style="font-size:16px;">List What You Teach & Want</h4>
          <p style="font-size:13px; color:var(--text-muted);">
            Create your skill profile. Specify your teaching mastery, learning targets, and preferred availability.
          </p>
        </div>

        <div class="step-card">
          <div class="step-number">2</div>
          <h4 style="font-size:16px;">Intelligent 6-Factor Matching</h4>
          <p style="font-size:13px; color:var(--text-muted);">
            Our compatibility algorithm evaluates skill reciprocity (40%), experience (20%), availability (15%), goals, language, and reliability.
          </p>
        </div>

        <div class="step-card">
          <div class="step-number">3</div>
          <h4 style="font-size:16px;">Schedule & Meet 1-on-1</h4>
          <p style="font-size:13px; color:var(--text-muted);">
            Send exchange proposals, coordinate agendas in chat, and conduct video or safe local sessions with collaborative lesson agendas.
          </p>
        </div>

        <div class="step-card">
          <div class="step-number">4</div>
          <h4 style="font-size:16px;">Earn & Spend Skill Credits</h4>
          <p style="font-size:13px; color:var(--text-muted);">
            1 hour of teaching = 1 Skill Credit. Use your credits to book sessions with anyone across the entire community!
          </p>
        </div>
      </div>

      <!-- Quick Pitch Callout Card -->
      <div class="card" style="background: linear-gradient(135deg, #ffffff 0%, #f5f7ff 100%); border-color: var(--primary-border); padding: var(--space-8); text-align: center;">
        <h3 style="font-size:22px; margin-bottom:8px;">Ready to trade skills and elevate your craft?</h3>
        <p style="color:var(--text-muted); max-width:540px; margin:0 auto var(--space-6); font-size:14px;">
          Join creators, developers, designers, and educators exchanging knowledge daily without spending a dime.
        </p>
        <button class="btn btn-primary btn-lg" id="bottom-cta-btn">
          Explore Live Platform Dashboard →
        </button>
      </div>
    </section>
  `;

  // Bind clicks
  const enterApp = () => onNavigate("dashboard");
  container.querySelector("#landing-btn-enter").addEventListener("click", enterApp);
  container.querySelector("#hero-btn-start").addEventListener("click", () => onNavigate("onboarding"));
  container.querySelector("#hero-btn-demo").addEventListener("click", enterApp);
  container.querySelector("#bottom-cta-btn").addEventListener("click", enterApp);

  return container;
}
