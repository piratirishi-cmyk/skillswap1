/**
 * SkillSwap State Store
 * Reactive state container with localStorage persistence and pub-sub events
 */

import {
  INITIAL_USERS,
  INITIAL_REQUESTS,
  INITIAL_MESSAGES,
  INITIAL_SESSIONS,
  INITIAL_TRANSACTIONS,
  INITIAL_COMMUNITY_POSTS
} from "../data/mockData.js";

const STORAGE_KEY = "SKILLSWAP_STATE_V1";

class StateStore {
  constructor() {
    this.listeners = new Map();
    this.state = this.loadState();
  }

  loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn("Could not load stored state, falling back to defaults", e);
    }

    return {
      currentUserId: "user-alex",
      users: JSON.parse(JSON.stringify(INITIAL_USERS)),
      requests: JSON.parse(JSON.stringify(INITIAL_REQUESTS)),
      messages: JSON.parse(JSON.stringify(INITIAL_MESSAGES)),
      sessions: JSON.parse(JSON.stringify(INITIAL_SESSIONS)),
      transactions: JSON.parse(JSON.stringify(INITIAL_TRANSACTIONS)),
      communityPosts: JSON.parse(JSON.stringify(INITIAL_COMMUNITY_POSTS)),
      blockedUserIds: []
    };
  }

  saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.error("Failed to save state to localStorage", e);
    }
  }

  resetToDefaults() {
    localStorage.removeItem(STORAGE_KEY);
    this.state = {
      currentUserId: "user-alex",
      users: JSON.parse(JSON.stringify(INITIAL_USERS)),
      requests: JSON.parse(JSON.stringify(INITIAL_REQUESTS)),
      messages: JSON.parse(JSON.stringify(INITIAL_MESSAGES)),
      sessions: JSON.parse(JSON.stringify(INITIAL_SESSIONS)),
      transactions: JSON.parse(JSON.stringify(INITIAL_TRANSACTIONS)),
      communityPosts: JSON.parse(JSON.stringify(INITIAL_COMMUNITY_POSTS)),
      blockedUserIds: []
    };
    this.saveState();
    this.emit("state:reset", this.state);
    this.emit("state:changed", this.state);
  }

  subscribe(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
    return () => this.listeners.get(event).delete(callback);
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(cb => {
        try { cb(data); } catch (err) { console.error("Error in listener:", err); }
      });
    }
  }

  /* Getters */
  getCurrentUser() {
    return this.state.users.find(u => u.id === this.state.currentUserId) || this.state.users[0];
  }

  getUserById(id) {
    return this.state.users.find(u => u.id === id);
  }

  getOtherUsers() {
    const currentId = this.state.currentUserId;
    return this.state.users.filter(u => u.id !== currentId && !this.state.blockedUserIds.includes(u.id));
  }

  getIncomingRequests() {
    const currentId = this.state.currentUserId;
    return this.state.requests.filter(r => r.toUserId === currentId);
  }

  getOutgoingRequests() {
    const currentId = this.state.currentUserId;
    return this.state.requests.filter(r => r.fromUserId === currentId);
  }

  getPendingRequestsCount() {
    return this.getIncomingRequests().filter(r => r.status === "pending").length;
  }

  getMessagesForPartner(partnerId) {
    return this.state.messages[partnerId] || [];
  }

  getAllChatPartners() {
    const currentId = this.state.currentUserId;
    const partnersMap = new Map();

    // From active requests (accepted)
    this.state.requests.forEach(req => {
      if (req.status === "accepted") {
        const otherId = req.fromUserId === currentId ? req.toUserId : (req.toUserId === currentId ? req.fromUserId : null);
        if (otherId && !this.state.blockedUserIds.includes(otherId)) {
          const user = this.getUserById(otherId);
          if (user) partnersMap.set(otherId, user);
        }
      }
    });

    // From message threads
    Object.keys(this.state.messages).forEach(partnerId => {
      if (partnerId !== currentId && !this.state.blockedUserIds.includes(partnerId)) {
        const user = this.getUserById(partnerId);
        if (user) partnersMap.set(partnerId, user);
      }
    });

    return Array.from(partnersMap.values());
  }

  getUpcomingSessions() {
    const currentId = this.state.currentUserId;
    return this.state.sessions.filter(s => s.status === "upcoming");
  }

  getCompletedSessions() {
    return this.state.sessions.filter(s => s.status === "completed");
  }

  /* Actions & Mutations */
  switchDemoUser(userId) {
    const user = this.getUserById(userId);
    if (!user) return;
    this.state.currentUserId = userId;
    this.saveState();
    this.emit("user:switched", user);
    this.emit("state:changed", this.state);
  }

  sendExchangeRequest({ toUserId, offerSkill, requestSkill, note, proposedMode, proposedSlots }) {
    const currentUser = this.getCurrentUser();
    const newReq = {
      id: `req-${Date.now()}`,
      fromUserId: currentUser.id,
      toUserId,
      offerSkill,
      requestSkill,
      note: note || `Hi! I'd love to exchange ${offerSkill} for ${requestSkill}. Let's connect!`,
      status: "pending",
      createdAt: "Just now",
      proposedMode: proposedMode || "both",
      proposedSlots: proposedSlots || "Flexible times"
    };

    this.state.requests.unshift(newReq);
    this.saveState();
    this.emit("request:sent", newReq);
    this.emit("state:changed", this.state);
    return newReq;
  }

  acceptRequest(requestId) {
    const req = this.state.requests.find(r => r.id === requestId);
    if (!req) return;

    req.status = "accepted";

    // Initialize message thread if not present
    const otherId = req.fromUserId === this.state.currentUserId ? req.toUserId : req.fromUserId;
    if (!this.state.messages[otherId]) {
      this.state.messages[otherId] = [];
    }

    this.state.messages[otherId].push({
      id: `m-${Date.now()}`,
      senderId: this.state.currentUserId,
      text: `Exchange request accepted! Looking forward to swapping ${req.offerSkill} and ${req.requestSkill}.`,
      timestamp: "Just now"
    });

    this.saveState();
    this.emit("request:accepted", req);
    this.emit("state:changed", this.state);
  }

  declineRequest(requestId) {
    const req = this.state.requests.find(r => r.id === requestId);
    if (!req) return;

    req.status = "declined";
    this.saveState();
    this.emit("request:declined", req);
    this.emit("state:changed", this.state);
  }

  sendMessage(partnerId, text) {
    if (!this.state.messages[partnerId]) {
      this.state.messages[partnerId] = [];
    }

    const newMsg = {
      id: `m-${Date.now()}`,
      senderId: this.state.currentUserId,
      text,
      timestamp: "Just now"
    };

    this.state.messages[partnerId].push(newMsg);
    this.saveState();
    this.emit("message:sent", { partnerId, message: newMsg });
    this.emit("state:changed", this.state);

    // Realistic simulated partner reply after a brief delay
    setTimeout(() => {
      const partner = this.getUserById(partnerId);
      if (!partner) return;

      const simulatedReplies = [
        `Sounds great! I'm really excited to dive into this.`,
        `Got it! What time works best for you this weekend?`,
        `That works for me! I'll prepare some helpful starting materials for our session.`,
        `Awesome! Feel free to propose a time in the scheduler!`
      ];
      const replyText = simulatedReplies[Math.floor(Math.random() * simulatedReplies.length)];

      const replyMsg = {
        id: `m-${Date.now() + 1}`,
        senderId: partnerId,
        text: replyText,
        timestamp: "Just now"
      };

      this.state.messages[partnerId].push(replyMsg);
      this.saveState();
      this.emit("message:received", { partnerId, message: replyMsg });
      this.emit("state:changed", this.state);
    }, 1500);

    return newMsg;
  }

  scheduleSession({ partnerId, skillExchange, date, time, durationMinutes, meetingType, agenda }) {
    const newSession = {
      id: `sess-${Date.now()}`,
      partnerId,
      skillExchange,
      date,
      time,
      durationMinutes: parseInt(durationMinutes, 10) || 60,
      meetingType: meetingType || "online",
      status: "upcoming",
      agenda: agenda || `Skill exchange session for ${skillExchange}`,
      roomUrl: `https://skillswap.live/room/${partnerId}-${Date.now().toString(36)}`
    };

    this.state.sessions.unshift(newSession);
    this.saveState();
    this.emit("session:scheduled", newSession);
    this.emit("state:changed", this.state);
    return newSession;
  }

  completeSession(sessionId, ratingData = null) {
    const session = this.state.sessions.find(s => s.id === sessionId);
    if (!session) return;

    session.status = "completed";
    session.creditsAwarded = 1;

    // Award 1 Skill Credit to current user
    const currentUser = this.getCurrentUser();
    currentUser.skillCredits = (currentUser.skillCredits || 0) + 1;
    currentUser.teachingHours = (currentUser.teachingHours || 0) + 1;
    currentUser.completedExchanges = (currentUser.completedExchanges || 0) + 1;

    // Log transaction
    const partner = this.getUserById(session.partnerId);
    this.state.transactions.unshift({
      id: `tx-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      type: "teaching_earned",
      amount: 1,
      description: `Completed session: ${session.skillExchange}`,
      partner: partner ? partner.name : "Partner",
      balanceAfter: currentUser.skillCredits
    });

    if (ratingData) {
      session.rated = true;
      session.ratingData = ratingData;

      // Update partner's review metrics if present
      if (partner) {
        partner.completedExchanges = (partner.completedExchanges || 0) + 1;
        partner.ratingCount = (partner.ratingCount || 0) + 1;
      }
    }

    this.saveState();
    this.emit("session:completed", { session, credits: 1 });
    this.emit("state:changed", this.state);
  }

  earnSkillCredit({ amount = 1, description = "Completed teaching session", partnerName = "Community Partner" }) {
    const currentUser = this.getCurrentUser();
    currentUser.skillCredits = (currentUser.skillCredits || 0) + amount;
    currentUser.teachingHours = (currentUser.teachingHours || 0) + amount;

    const newTx = {
      id: `tx-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      type: "teaching_earned",
      amount,
      description,
      partner: partnerName,
      balanceAfter: currentUser.skillCredits
    };

    this.state.transactions.unshift(newTx);
    this.saveState();
    this.emit("credit:earned", { amount, newBalance: currentUser.skillCredits, transaction: newTx });
    this.emit("state:changed", this.state);
    return newTx;
  }

  spendSkillCredit({ amount = 1, description = "Booked learning session", partnerName = "Community Mentor" }) {
    const currentUser = this.getCurrentUser();
    if ((currentUser.skillCredits || 0) < amount) {
      return { success: false, reason: "insufficient_credits" };
    }

    currentUser.skillCredits -= amount;

    const newTx = {
      id: `tx-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      type: "learning_spent",
      amount,
      description,
      partner: partnerName,
      balanceAfter: currentUser.skillCredits
    };

    this.state.transactions.unshift(newTx);
    this.saveState();
    this.emit("credit:spent", { amount, newBalance: currentUser.skillCredits, transaction: newTx });
    this.emit("state:changed", this.state);
    return { success: true, transaction: newTx };
  }

  toggleMilestone(progressId, milestoneIndex) {
    const currentUser = this.getCurrentUser();
    const prog = currentUser.progress?.find(p => p.id === progressId);
    if (!prog || !prog.milestones[milestoneIndex]) return;

    prog.milestones[milestoneIndex].completed = !prog.milestones[milestoneIndex].completed;

    // Recalculate percentage
    const completedCount = prog.milestones.filter(m => m.completed).length;
    prog.progressPct = Math.round((completedCount / prog.milestones.length) * 100);

    this.saveState();
    this.emit("progress:updated", prog);
    this.emit("state:changed", this.state);
  }

  addNewMilestone(progressId, title) {
    const currentUser = this.getCurrentUser();
    const prog = currentUser.progress?.find(p => p.id === progressId);
    if (!prog || !title.trim()) return;

    prog.milestones.push({ title: title.trim(), completed: false });
    const completedCount = prog.milestones.filter(m => m.completed).length;
    prog.progressPct = Math.round((completedCount / prog.milestones.length) * 100);

    this.saveState();
    this.emit("progress:updated", prog);
    this.emit("state:changed", this.state);
  }

  togglePostLike(postId) {
    const post = this.state.communityPosts.find(p => p.id === postId);
    if (!post) return;

    post.isLiked = !post.isLiked;
    post.likes = post.isLiked ? post.likes + 1 : post.likes - 1;

    this.saveState();
    this.emit("post:liked", post);
    this.emit("state:changed", this.state);
  }

  addPostComment(postId, commentText) {
    const post = this.state.communityPosts.find(p => p.id === postId);
    if (!post || !commentText.trim()) return;

    const currentUser = this.getCurrentUser();
    const newComment = {
      id: `c-${Date.now()}`,
      authorName: currentUser.name,
      avatar: currentUser.avatar,
      text: commentText.trim()
    };

    post.comments.push(newComment);
    this.saveState();
    this.emit("post:commented", { post, comment: newComment });
    this.emit("state:changed", this.state);
  }

  createCommunityPost({ title, content, category }) {
    const currentUser = this.getCurrentUser();
    const newPost = {
      id: `post-${Date.now()}`,
      authorId: currentUser.id,
      category: category || "Achievement",
      timeAgo: "Just now",
      title: title.trim(),
      content: content.trim(),
      likes: 1,
      isLiked: true,
      comments: []
    };

    this.state.communityPosts.unshift(newPost);
    this.saveState();
    this.emit("post:created", newPost);
    this.emit("state:changed", this.state);
    return newPost;
  }

  reportUser(userId, reason, notes) {
    // In real app, sends to server. Here, logs and returns acknowledgment
    console.log(`[Safety Report] Reported user ${userId} for reason: ${reason}, notes: ${notes}`);
    this.emit("user:reported", { userId, reason });
  }

  blockUser(userId) {
    if (!this.state.blockedUserIds.includes(userId)) {
      this.state.blockedUserIds.push(userId);
      this.saveState();
      this.emit("user:blocked", userId);
      this.emit("state:changed", this.state);
    }
  }

  updateProfile(data) {
    const currentUser = this.getCurrentUser();
    Object.assign(currentUser, data);
    this.saveState();
    this.emit("profile:updated", currentUser);
    this.emit("state:changed", this.state);
  }
}

export const store = new StateStore();
