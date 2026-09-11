/**
 * SkillSwap Initial Mock Dataset
 * Rich, realistic seed data designed for seamless hackathon demonstrations
 */

export const INITIAL_USERS = [
  {
    id: "user-alex",
    name: "Arjun Sharma",
    role: "Acoustic & Electric Guitarist",
    headline: "Indie Musician & Guitar Instructor (8 yrs exp)",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
    location: "Mumbai, India (IST)",
    online: true,
    verified: true,
    bio: "Passionate guitarist who has toured with indie bands. Looking to swap guitar lessons for digital illustration to design album artwork and merch!",
    rating: 4.9,
    ratingCount: 14,
    ratingsBreakdown: {
      teachingQuality: 4.9,
      communication: 5.0,
      reliability: 4.8
    },
    completedExchanges: 14,
    teachingHours: 21,
    skillCredits: 5,
    streakDays: 7,
    exchangeScore: 98,
    mode: "both",
    availability: ["Weekends", "Evenings"],
    languages: ["English", "Hindi"],
    skillsTeach: [
      { name: "Guitar", category: "Music & Audio", level: "Expert", description: "Acoustic fingerstyle, jazz chords, improvisation & rhythm" },
      { name: "Music Theory", category: "Music & Audio", level: "Advanced", description: "Scales, chord progressions, harmonization" }
    ],
    skillsWant: [
      { name: "Digital Art", category: "Arts & Design", targetLevel: "Intermediate", goal: "Create digital concept art and vector graphics in Procreate" },
      { name: "UI/UX Design", category: "Technology", targetLevel: "Beginner", goal: "Learn Figma wireframing for personal website" }
    ],
    badges: [
      { id: "b1", title: "First Exchange", icon: "🌱", description: "Completed your first skill barter session", unlocked: true },
      { id: "b2", title: "Skill Mentor", icon: "🎓", description: "Taught 5+ hours of verified knowledge", unlocked: true },
      { id: "b3", title: "Top Teacher", icon: "⭐", description: "Maintained 4.9+ rating over 10+ reviews", unlocked: true },
      { id: "b4", title: "7-Day Streak", icon: "🔥", description: "Actively practiced learning 7 days in a row", unlocked: true },
      { id: "b5", title: "10 Exchanges", icon: "🏆", description: "Completed 10 barter exchanges", unlocked: true },
      { id: "b6", title: "Community Helper", icon: "🤝", description: "Helped 5 community members with advice", unlocked: false }
    ],
    progress: [
      {
        id: "prog-art",
        skill: "Digital Art",
        category: "Arts & Design",
        progressPct: 65,
        mentor: "Priya Desai",
        milestones: [
          { title: "Procreate brushes & canvas setup", completed: true },
          { title: "Rough line art & perspective sketching", completed: true },
          { title: "Base cell coloring & shading layers", completed: true },
          { title: "Digital lighting & ambient occlusion", completed: false },
          { title: "Final album cover composition", completed: false }
        ]
      },
      {
        id: "prog-figma",
        skill: "UI/UX Design",
        category: "Technology",
        progressPct: 30,
        mentor: "Vikram Reddy",
        milestones: [
          { title: "Figma interface & frame basics", completed: true },
          { title: "Auto-layout & responsive constraints", completed: false },
          { title: "Component variants & design systems", completed: false }
        ]
      }
    ]
  },
  {
    id: "user-maya",
    name: "Priya Desai",
    role: "Senior Illustrator & Concept Artist",
    headline: "Visual Artist & UI Illustrator · Loves indie folk",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80",
    location: "Bangalore, India (IST)",
    online: true,
    verified: true,
    bio: "Lead illustrator at an animation studio. I can guide you through Procreate, Photoshop, and digital painting fundamentals. I've always wanted to learn acoustic guitar to play songs around campfires!",
    rating: 4.95,
    ratingCount: 19,
    ratingsBreakdown: {
      teachingQuality: 5.0,
      communication: 4.9,
      reliability: 4.9
    },
    completedExchanges: 19,
    teachingHours: 28,
    skillCredits: 7,
    streakDays: 12,
    exchangeScore: 99,
    mode: "both",
    availability: ["Weekends", "Evenings"],
    languages: ["English", "Gujarati"],
    skillsTeach: [
      { name: "Digital Art", category: "Arts & Design", level: "Expert", description: "Procreate illustration, visual storytelling, lighting & color theory" },
      { name: "Character Design", category: "Arts & Design", level: "Advanced", description: "Silhouettes, anatomy, expressive poses" }
    ],
    skillsWant: [
      { name: "Guitar", category: "Music & Audio", targetLevel: "Intermediate", goal: "Play fingerstyle folk songs and master barre chords smoothly" },
      { name: "Music Theory", category: "Music & Audio", targetLevel: "Beginner", goal: "Understand musical keys and song writing" }
    ],
    badges: [
      { id: "b1", title: "First Exchange", icon: "🌱", description: "Completed your first barter session", unlocked: true },
      { id: "b2", title: "Skill Mentor", icon: "🎓", description: "Taught 5+ hours of verified knowledge", unlocked: true },
      { id: "b3", title: "Top Teacher", icon: "⭐", description: "Maintained 4.9+ rating over 10+ reviews", unlocked: true },
      { id: "b4", title: "7-Day Streak", icon: "🔥", description: "Actively practiced learning 7 days in a row", unlocked: true },
      { id: "b5", title: "10 Exchanges", icon: "🏆", description: "Completed 10 barter exchanges", unlocked: true }
    ],
    progress: [
      {
        id: "prog-guitar",
        skill: "Guitar",
        category: "Music & Audio",
        progressPct: 75,
        mentor: "Alex Rivera",
        milestones: [
          { title: "Basic open chords (C, G, D, Em, Am)", completed: true },
          { title: "Folk fingerpicking & 4/4 strumming rhythms", completed: true },
          { title: "Smooth transitions & metronome timing", completed: true },
          { title: "F Major & B minor barre chord endurance", completed: false },
          { title: "Dust in the Wind fingerstyle arrangement", completed: false }
        ]
      }
    ]
  },
  {
    id: "user-carlos",
    name: "Vikram Reddy",
    role: "Full-Stack Dev & Python Engineer",
    headline: "Software Engineer · Seeking Public Speaking & Tech Coaching",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
    location: "Delhi, India (IST)",
    online: true,
    verified: true,
    bio: "Senior backend developer building scalable web services. I teach clean Python, API design, and JavaScript. Seeking a partner to practice public speaking and tech conference presentations.",
    rating: 4.85,
    ratingCount: 11,
    ratingsBreakdown: {
      teachingQuality: 4.8,
      communication: 4.9,
      reliability: 4.9
    },
    completedExchanges: 11,
    teachingHours: 16,
    skillCredits: 4,
    streakDays: 4,
    exchangeScore: 94,
    mode: "online",
    availability: ["Weekdays", "Evenings"],
    languages: ["English", "Marathi"],
    skillsTeach: [
      { name: "Python", category: "Technology", level: "Expert", description: "Backend development, FastAPIs, data processing, automation" },
      { name: "Web Development", category: "Technology", level: "Advanced", description: "HTML5/CSS3, JavaScript architecture, REST APIs" }
    ],
    skillsWant: [
      { name: "Public Speaking", category: "Business", targetLevel: "Intermediate", goal: "Confident keynote presentations and stage presence" },
      { name: "Photography", category: "Arts & Design", targetLevel: "Beginner", goal: "Street photography and framing basics" }
    ],
    badges: [
      { id: "b1", title: "First Exchange", icon: "🌱", description: "Completed your first barter session", unlocked: true },
      { id: "b2", title: "Skill Mentor", icon: "🎓", description: "Taught 5+ hours of verified knowledge", unlocked: true }
    ],
    progress: []
  },
  {
    id: "user-sarah",
    name: "Sneha Gupta",
    role: "Photographer & Creative Director",
    headline: "Commercial Photographer · Wants Hindi & Guitar",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80",
    location: "Kolkata, India (IST)",
    online: false,
    verified: true,
    bio: "Published editorial and documentary photographer. Passionate about lighting, visual framing, and Adobe Lightroom. Looking to exchange for conversational Hindi or acoustic guitar.",
    rating: 4.92,
    ratingCount: 16,
    ratingsBreakdown: {
      teachingQuality: 4.9,
      communication: 5.0,
      reliability: 4.9
    },
    completedExchanges: 16,
    teachingHours: 24,
    skillCredits: 6,
    streakDays: 9,
    exchangeScore: 97,
    mode: "both",
    availability: ["Weekends", "Evenings"],
    languages: ["English"],
    skillsTeach: [
      { name: "Photography", category: "Arts & Design", level: "Expert", description: "Manual camera controls, portrait lighting, Lightroom post-processing" },
      { name: "Video Editing", category: "Arts & Design", level: "Intermediate", description: "Premiere Pro cuts, pacing, color grading" }
    ],
    skillsWant: [
      { name: "Guitar", category: "Music & Audio", targetLevel: "Beginner", goal: "Learn campfire chords and rhythm strumming" },
      { name: "Public Speaking", category: "Business", targetLevel: "Intermediate", goal: "Pitching photography clients with confidence" }
    ],
    badges: [
      { id: "b1", title: "First Exchange", icon: "🌱", description: "Completed your first barter session", unlocked: true },
      { id: "b2", title: "Skill Mentor", icon: "🎓", description: "Taught 5+ hours of verified knowledge", unlocked: true },
      { id: "b3", title: "Top Teacher", icon: "⭐", description: "Maintained 4.9+ rating", unlocked: true }
    ],
    progress: []
  },
  {
    id: "user-liam",
    name: "Rohan Kapoor",
    role: "TEDx Speaker & Executive Coach",
    headline: "Speech Coach · Looking for Python & Guitar",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
    location: "Hyderabad, India (IST)",
    online: true,
    verified: true,
    bio: "I coach tech leaders and startup founders on storytelling, eliminating filler words, and commanding the room. Eager to barter speech coaching for Python coding or guitar fundamentals!",
    rating: 4.98,
    ratingCount: 25,
    ratingsBreakdown: {
      teachingQuality: 5.0,
      communication: 5.0,
      reliability: 4.9
    },
    completedExchanges: 25,
    teachingHours: 35,
    skillCredits: 9,
    streakDays: 15,
    exchangeScore: 99,
    mode: "online",
    availability: ["Weekdays", "Weekends", "Evenings"],
    languages: ["English", "Telugu"],
    skillsTeach: [
      { name: "Public Speaking", category: "Business", level: "Expert", description: "Storytelling frameworks, vocal projection, stage presence, speechwriting" },
      { name: "Presentation Design", category: "Business", level: "Advanced", description: "Slide psychology, keynote structure, pitching" }
    ],
    skillsWant: [
      { name: "Python", category: "Technology", targetLevel: "Beginner", goal: "Automate spreadsheet tasks and web scraping" },
      { name: "Guitar", category: "Music & Audio", targetLevel: "Beginner", goal: "Play basic blues rhythms" }
    ],
    badges: [
      { id: "b1", title: "First Exchange", icon: "🌱", description: "Completed your first barter session", unlocked: true },
      { id: "b2", title: "Skill Mentor", icon: "🎓", description: "Taught 5+ hours of verified knowledge", unlocked: true },
      { id: "b3", title: "10 Exchanges", icon: "🏆", description: "Completed 10 barter exchanges", unlocked: true }
    ],
    progress: []
  },
  {
    id: "user-emma",
    name: "Neha Verma",
    role: "French Native & Pastry Chef",
    headline: "Bilingual Educator · Seeking Digital Art & UI/UX",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80",
    location: "Pune, India (IST)",
    online: false,
    verified: true,
    bio: "Multilingual educator with expertise in language learning. Teaching conversational Hindi with authentic idioms and pronunciation. I want to learn digital illustration to create a published recipe book!",
    rating: 4.88,
    ratingCount: 13,
    ratingsBreakdown: {
      teachingQuality: 4.9,
      communication: 4.8,
      reliability: 4.9
    },
    completedExchanges: 13,
    teachingHours: 19,
    skillCredits: 4,
    streakDays: 6,
    exchangeScore: 95,
    mode: "online",
    availability: ["Weekends", "Evenings"],
    languages: ["English", "Hindi"],
    skillsTeach: [
      { name: "French", category: "Languages", level: "Expert", description: "Conversational fluency, grammar nuances, cultural expressions" },
      { name: "Culinary Arts", category: "Lifestyle", level: "Advanced", description: "French baking, pastry techniques, sourdough" }
    ],
    skillsWant: [
      { name: "Digital Art", category: "Arts & Design", targetLevel: "Beginner", goal: "Illustrated food sketches and cookbook layout" },
      { name: "UI/UX Design", category: "Technology", targetLevel: "Beginner", goal: "Design a clean culinary blog interface" }
    ],
    badges: [
      { id: "b1", title: "First Exchange", icon: "🌱", description: "Completed your first barter session", unlocked: true },
      { id: "b2", title: "Skill Mentor", icon: "🎓", description: "Taught 5+ hours of verified knowledge", unlocked: true }
    ],
    progress: []
  },
  {
    id: "user-aisha",
    name: "Ananya Patel",
    role: "Acoustic Guitarist & Keynote Speaker",
    headline: "Fingerstyle Guitarist & Speech Coach · Wants Photoshop & Photography",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80",
    location: "Bangalore, India (IST)",
    online: true,
    verified: true,
    bio: "Semi-professional acoustic guitarist and corporate presentation coach. I help learners master guitar rhythm and speak on stage without stage anxiety. Looking to swap for Adobe Photoshop editing and portrait photography!",
    rating: 4.96,
    ratingCount: 18,
    ratingsBreakdown: {
      teachingQuality: 5.0,
      communication: 4.9,
      reliability: 5.0
    },
    completedExchanges: 18,
    teachingHours: 27,
    skillCredits: 6,
    streakDays: 11,
    exchangeScore: 98,
    mode: "both",
    availability: ["Weekends", "Evenings"],
    languages: ["English", "Marathi"],
    skillsTeach: [
      { name: "Guitar", category: "Music & Audio", level: "Expert", description: "Fingerstyle acoustic, open chords, timing, rhythm strumming" },
      { name: "Public Speaking", category: "Business", level: "Advanced", description: "Vocal projection, speech delivery, overcoming stage anxiety" }
    ],
    skillsWant: [
      { name: "Photoshop", category: "Arts & Design", targetLevel: "Intermediate", goal: "Master photo retouching, masks, and graphic assets" },
      { name: "Photography", category: "Arts & Design", targetLevel: "Beginner", goal: "Portrait lighting, composition, and manual exposure" }
    ],
    badges: [
      { id: "b1", title: "First Exchange", icon: "🌱", description: "Completed your first barter session", unlocked: true },
      { id: "b2", title: "Skill Mentor", icon: "🎓", description: "Taught 5+ hours of verified knowledge", unlocked: true },
      { id: "b3", title: "Top Teacher", icon: "⭐", description: "Maintained 4.9+ rating over 10+ reviews", unlocked: true }
    ],
    progress: []
  }
];

export const INITIAL_REQUESTS = [
  {
    id: "req-101",
    fromUserId: "user-maya",
    toUserId: "user-alex",
    offerSkill: "Digital Art",
    requestSkill: "Guitar",
    note: "Hi Arjun! Loved your acoustic demo clip. I would love to do a 1-on-1 swap: I'll teach you Procreate character & landscape painting, and you teach me fingerstyle acoustic guitar!",
    status: "pending",
    createdAt: "Today at 2:15 PM",
    proposedMode: "both",
    proposedSlots: "Saturday or Sunday afternoons"
  },
  {
    id: "req-102",
    fromUserId: "user-carlos",
    toUserId: "user-alex",
    offerSkill: "Web Development",
    requestSkill: "Music Theory",
    note: "Hey Arjun, I saw you know music theory inside out. I can build or optimize your portfolio site in exchange for help understanding chord modal scales!",
    status: "pending",
    createdAt: "Yesterday at 5:40 PM",
    proposedMode: "online",
    proposedSlots: "Weekday evenings (7 PM CST)"
  },
  {
    id: "req-103",
    fromUserId: "user-alex",
    toUserId: "user-sarah",
    offerSkill: "Guitar",
    requestSkill: "Photography",
    note: "Hey Sneha, I'd love to learn manual lighting and camera settings from you in exchange for guitar lessons!",
    status: "accepted",
    createdAt: "3 days ago",
    proposedMode: "both",
    proposedSlots: "Weekends"
  }
];

export const INITIAL_MESSAGES = {
  "user-maya": [
    { id: "m1", senderId: "user-maya", text: "Hey Arjun! So excited for our mutual skill swap.", timestamp: "Yesterday, 3:10 PM" },
    { id: "m2", senderId: "user-alex", text: "Me too Priya! I've been wanting to learn Procreate for months.", timestamp: "Yesterday, 3:14 PM" },
    { id: "m3", senderId: "user-maya", text: "Awesome! What's your current setup? Do you have an Apple Pencil ready?", timestamp: "Yesterday, 3:16 PM" },
    { id: "m4", senderId: "user-alex", text: "Yes! Got an iPad Air and Apple Pencil 2. And I have an acoustic and electric guitar ready for you!", timestamp: "Yesterday, 3:20 PM" },
    { id: "m5", senderId: "user-maya", text: "Perfect! Let's schedule our first session this weekend. We can do 30 mins digital art basics followed by 30 mins fingerstyle guitar.", timestamp: "Today, 10:05 AM" }
  ],
  "user-sarah": [
    { id: "m201", senderId: "user-alex", text: "Hi Sneha, thanks for accepting the exchange request!", timestamp: "2 days ago" },
    { id: "m202", senderId: "user-sarah", text: "Of course! Let's do a session next week after my shoot wraps.", timestamp: "2 days ago" }
  ]
};

export const INITIAL_SESSIONS = [
  {
    id: "sess-1",
    partnerId: "user-maya",
    skillExchange: "Digital Art ↔ Guitar",
    date: "2026-09-14",
    time: "15:00",
    durationMinutes: 60,
    meetingType: "online",
    status: "upcoming",
    agenda: "Session 1: Procreate brush calibration & perspective sketching / Guitar open chords and fingerpicking posture",
    roomUrl: "https://skillswap.live/room/arjun-priya-exchange"
  },
  {
    id: "sess-2",
    partnerId: "user-liam",
    skillExchange: "Guitar ↔ Public Speaking",
    date: "2026-09-08",
    time: "18:00",
    durationMinutes: 60,
    meetingType: "online",
    status: "completed",
    agenda: "Acoustic blues scale fundamentals & Eliminating verbal fillers",
    creditsAwarded: 1,
    rated: true,
    ratingData: { teaching: 5, communication: 5, reliability: 5, review: "Rohan gave the most actionable feedback on stage posture I've ever received!" }
  }
];

export const INITIAL_TRANSACTIONS = [
  {
    id: "tx-1",
    date: "2026-09-01",
    type: "welcome_bonus",
    amount: 3,
    description: "Welcome to SkillSwap initial grant",
    partner: "System",
    balanceAfter: 3
  },
  {
    id: "tx-2",
    date: "2026-09-04",
    type: "teaching_earned",
    amount: 1,
    description: "Taught 1 hr of Acoustic Guitar basics",
    partner: "Rohan Kapoor",
    balanceAfter: 4
  },
  {
    id: "tx-3",
    date: "2026-09-08",
    type: "teaching_earned",
    amount: 1,
    description: "Taught 1 hr of Music Theory & Scales",
    partner: "Rohan Kapoor",
    balanceAfter: 5
  }
];

export const INITIAL_COMMUNITY_POSTS = [
  {
    id: "post-1",
    authorId: "user-maya",
    category: "Achievement",
    timeAgo: "2 hours ago",
    title: "Nailed the F Major barre chord after 3 days of barter sessions! 🎉",
    content: "Huge thanks to @Arjun Sharma for showing me the wrist angle trick instead of pressing harder with my thumb. Zero hand strain now. Two-way skill exchange really works!",
    likes: 18,
    isLiked: false,
    comments: [
      { id: "c1", authorName: "Arjun Sharma", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80", text: "Proud of you Priya! You're going to master 'Dust in the Wind' next week." },
      { id: "c2", authorName: "Rohan Kapoor", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80", text: "That wrist pivot technique changed my playing completely too!" }
    ]
  },
  {
    id: "post-2",
    authorId: "user-carlos",
    category: "Advice",
    timeAgo: "5 hours ago",
    title: "Tips for structuring your first 60-minute skill barter session ⏱️",
    content: "Here is what works best for us: 25 mins Partner A teaches, 5 mins break & recap, 25 mins Partner B teaches, 5 mins schedule next session and assign practice tasks. Perfect balance!",
    likes: 24,
    isLiked: true,
    comments: [
      { id: "c3", authorName: "Sneha Gupta", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80", text: "The 5-minute break in between is crucial to switch mindsets from teacher to student!" }
    ]
  },
  {
    id: "post-3",
    authorId: "user-liam",
    category: "Question",
    timeAgo: "1 day ago",
    title: "Who wants to practice 5-minute impromptu lightning talks? 🎤",
    content: "Looking for 2 people who want to practice spontaneous thinking and speaking without slides. In return, I can critique your vocal variety and pacing!",
    likes: 15,
    isLiked: false,
    comments: []
  }
];

export const SKILL_CATEGORIES = [
  "All Categories",
  "Technology",
  "Arts & Design",
  "Music & Audio",
  "Business",
  "Languages",
  "Lifestyle"
];
