# SkillSwap ⇄

> **"Trade skills. Grow together."**

A polished, modern, hackathon-ready peer-to-peer skill barter platform where people exchange knowledge instead of money.

---

## 💡 Core Concept & Differentiation

Most online learning platforms require costly subscriptions or one-sided marketplace transactions. **SkillSwap** is built on a fundamentally different paradigm: **Reciprocal Two-Way Knowledge Barter**.

- **User A** can teach *Acoustic Guitar* but wants to learn *Digital Art*.
- **User B** can teach *Digital Art* but wants to learn *Acoustic Guitar*.
- **SkillSwap** matches them with a high compatibility score, facilitates their session agendas, and tracks their learning progress.

> 🚫 **What SkillSwap is NOT**: A job board, recruitment platform, course marketplace, or certificate mill.  
> ✅ **What SkillSwap IS**: A decentralized, two-way knowledge barter platform powered by an intelligent matching engine and a virtual skill credit economy.

---

## 🚀 Quick Start (Zero Build Dependencies)

SkillSwap is built with modern **HTML5, CSS3, and Vanilla ES6+ JavaScript**. There is no React, no Vite, and no complex build step.

### Option 1: Using the Included Local Server
```bash
# Start the built-in HTTP server
npm start
# OR: node server.js
```
Then open [http://localhost:3000](http://localhost:3000) in any modern web browser.

### Option 2: Using Python
```bash
python -m http.server 3000
```

---

## ⚡ Live Hackathon Demo Features

### 1. 🔀 Demo Account Switcher
Located directly at the bottom of the sidebar. Allows judges and evaluators to experience both sides of the reciprocal barter in real time with 1 click:
- **Alex Rivera** (Acoustic Guitarist · Wants Digital Art)
- **Maya Lin** (Senior Concept Artist · Wants Acoustic Guitar)
- **1-Click "Reset" Button**: Restores pristine seed state anytime during pitches.

---

### 2. 🧮 6-Factor Intelligent Matching Engine
Calculates true reciprocal compatibility using the exact weighted formula:
- **40% Skill Compatibility**: Evaluates mutual cross-matching ($A_{\text{teach}} \cap B_{\text{want}} \land B_{\text{teach}} \cap A_{\text{want}}$).
- **20% Experience Compatibility**: Compares teacher mastery level against the learner's target goals.
- **15% Availability Compatibility**: Matches shared days and times (Weekends, Evenings, Weekdays).
- **10% Learning Goals & Format**: Online video vs. safe in-person format synergies.
- **10% Language Compatibility**: Shared conversational and teaching languages.
- **5% Rating & Reliability**: Partner attendance track record and aggregate star rating.

Clicking **"Why You Match"** on any profile displays both the percentage bar breakdown and a verified checklist:
```
✓ They teach Digital Art
✓ You want to learn Digital Art
✓ You teach Guitar
✓ They want to learn Guitar
✓ Your weekends and evenings availability overlaps
✓ Compatible exchange format (online and in-person)
✓ High reliability rating (4.95 / 5.0 with 19 exchanges)
```

---

### 3. ✨ AI Skill Matchmaker
Type naturally in freeform English:
> *"I can teach photography and basic video editing. I want to learn guitar and public speaking."*

The AI engine:
1. Extracts skills offered and skills wanted.
2. Identifies and ranks top community candidates.
3. Automatically synthesizes a **Suggested 4-Week Skill Barter Plan**:
   - **Week 1: Foundations & Calibration** (e.g. Camera manual exposure ↔ Guitar posture & open chords).
   - **Week 2: Technique & Rhythm** (Lighting drills ↔ Fingerpicking patterns).
   - **Week 3: Creative Application Project** (Mini video project ↔ Playing full song).
   - **Week 4: Mastery Review & Next Horizon** (Peer critiques & next milestone roadmap).
4. Provides a 1-click button to send an exchange proposal using this roadmap!

---

### 4. 🪙 Virtual Skill Economy (Skill Credits)
- **Rule**: 1 completed hour of peer teaching = **+1 Skill Credit**.
- Spend credits to learn from anyone across the community, even without direct reciprocal barter.
- Features a **Credit Ledger & Activity Table** tracking earnings, redemptions, and balances.

---

### 5. 🎯 Interactive Learning Progress Roadmaps
- Visual completion rings and progress bars (e.g. *Digital Art: 65% Complete*).
- **Interactive Checklists**: Click any completed or upcoming milestone to toggle its state—the progress bar and percentage update dynamically in real time.
- **Add Custom Milestones**: Add personalized learning goals on the fly.

---

### 6. 📅 Session System & Simulated Video Room
- **Scheduler**: Set partner, skills, date, time, duration (30/60/90 mins), and custom lesson agendas.
- **Simulated Interactive Video Room**: Includes participant video streams, live countdown timer, agenda notes, camera/mic toggles, and screen-sharing simulation.
- **Complete Session Action**:
  - Automatically credits **+1 Skill Credit** to the teacher.
  - Opens the **3-Part Reputation Review Modal**:
    * Teaching Quality (1-5 stars)
    * Communication (1-5 stars)
    * Reliability & Punctuality (1-5 stars)
    * Written testimonial

---

### 7. 👥 Community Knowledge Exchange Feed
- Filter feed by: *Achievements*, *Questions*, *Resources*, and *Advice*.
- Publish new posts with category badges.
- Interactive **Likes** with live counters.
- **Comment Threads**: Post supportive replies and participate in peer discussions.

---

### 8. 🛡️ Trust, Safety & Community Guidelines
- Profile **Identity Verification** checkmarks.
- **Safe Offline Meeting Protocol** for in-person barters (public places, daylight hours, no cash exchanges).
- **Report & Block Member** tools with instant moderation confirmation.

---

## 📂 Project Architecture

```
skillswap/
├── index.html                  # Main SPA container & Google Fonts typography
├── server.js                   # Lightweight zero-dependency HTTP server (ES module)
├── package.json                # Project manifest & start script
├── css/
│   ├── variables.css           # Color tokens, typography, shadows, spacing
│   ├── base.css                # Reset, buttons, forms, badges, responsive layout
│   ├── components.css          # Modals, toasts, avatars, progress rings, stat cards
│   ├── navigation.css          # Sidebar, topbar, mobile menu, demo account switcher
│   └── views.css               # Specific styles for all 10+ application pages
├── js/
│   ├── app.js                  # Application orchestrator & hash-based view router
│   ├── store/
│   │   └── state.js            # Reactive state container with localStorage & event bus
│   ├── data/
│   │   └── mockData.js         # Realistic seed profiles, sessions, requests, posts
│   ├── services/
│   │   ├── matchingEngine.js   # 6-factor algorithmic compatibility calculator
│   │   └── aiMatchmaker.js     # Natural-language query parser & roadmap generator
│   ├── components/
│   │   ├── modal.js            # Accessible dialog system
│   │   ├── toast.js            # Animated toast notifications
│   │   └── navbar.js           # Navigation bar & dynamic badge controller
│   └── views/
│       ├── landingView.js      # Hero, two-way barter diagram, live ticker, how it works
│       ├── dashboardView.js    # Metric cards, teach/want overview, recommendations
│       ├── discoverView.js     # Multi-factor search & filter grid
│       ├── matchDetailsModal.js# Mathematical score breakdown & checklist modal
│       ├── aiMatchmakerView.js # AI prompt search & 4-week barter roadmap
│       ├── requestsView.js     # Incoming & sent barter proposal manager
│       ├── messagesView.js     # 2-way chat with simulated partner replies
│       ├── sessionsView.js     # Session scheduler & simulated video room
│       ├── progressView.js     # Interactive milestone roadmap tracker
│       ├── creditsView.js      # Skill Credits virtual economy ledger
│       ├── profileView.js      # User profile, 3-part reputation & badges
│       ├── communityView.js    # Knowledge feed with posts, likes, comments
│       ├── safetyModal.js      # Safe offline guide, user report & block
│       ├── onboardingView.js   # 4-step wizard with live match preview
│       └── authView.js         # Demo sign-in & account modal
└── README.md
```

---

## 🎨 Design Philosophy
- **Modern SaaS Polish**: Built with crisp borders, subtle layered elevations, and generous white space.
- **Accessible Contrast**: Carefully calibrated text against soft slate backgrounds.
- **Zero Dead Ends**: Every button, chip, filter, tab, and form is wired to state or opens an interactive modal.
- **Repeatable Demos**: Click the "Reset" button in the sidebar anytime to restore pristine mock data for pitching.
