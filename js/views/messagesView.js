/**
 * Messages / Chat View
 * Real-time peer messaging interface with session proposal shortcuts and simulated replies
 */

import { store } from "../store/state.js";
import { openScheduleModal } from "./sessionsView.js";
import { openMatchDetailsModal } from "./matchDetailsModal.js";

export function renderMessagesView(onNavigate, initialParams = {}) {
  const container = document.createElement("div");
  container.className = "messages-view";

  const currentUser = store.getCurrentUser();
  const partners = store.getAllChatPartners();

  // Active partner ID
  let activePartnerId = initialParams.partnerId || (partners[0] ? partners[0].id : "user-maya");

  function renderView() {
    const activePartner = store.getUserById(activePartnerId) || partners[0];
    const messages = activePartner ? store.getMessagesForPartner(activePartner.id) : [];

    container.innerHTML = `
      <div style="margin-bottom:var(--space-4);">
        <h1 style="font-size:24px;">Messages & Coordination</h1>
        <p style="font-size:13px; color:var(--text-muted);">
          Coordinate session agendas, share practice materials, and plan mutual lessons.
        </p>
      </div>

      <div class="messages-layout">
        <!-- Left Sidebar: Conversations List -->
        <div class="chat-threads-sidebar">
          <div class="chat-threads-header">
            <h3 style="font-size:15px;">Conversations (${partners.length})</h3>
          </div>
          <div class="chat-threads-list">
            ${partners.length === 0 ? `
              <div style="padding:var(--space-6); text-align:center; color:var(--text-muted); font-size:13px;">
                No active conversations yet. Accept a barter request or connect from Discover!
              </div>
            ` : partners.map(partner => {
              const partnerMsgs = store.getMessagesForPartner(partner.id);
              const lastMsg = partnerMsgs[partnerMsgs.length - 1];
              const isActive = partner.id === activePartnerId;

              return `
                <div class="chat-thread-item ${isActive ? 'active' : ''}" data-select-partner="${partner.id}">
                  <div class="avatar avatar-md">
                    <img src="${partner.avatar}" alt="${partner.name}" />
                    <div class="avatar-status ${partner.online ? 'online' : 'offline'}"></div>
                  </div>
                  <div style="flex:1; overflow:hidden;">
                    <div style="display:flex; align-items:center; justify-content:space-between;">
                      <span style="font-weight:700; font-size:14px;">${partner.name}</span>
                      <span style="font-size:10px; color:var(--text-subtle);">${lastMsg?.timestamp || ''}</span>
                    </div>
                    <div style="font-size:12px; color:var(--text-muted); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                      ${lastMsg?.text || `Skill partner`}
                    </div>
                  </div>
                </div>
              `;
            }).join("")}
          </div>
        </div>

        <!-- Right Main Chat Area -->
        <div class="chat-main-area">
          ${activePartner ? `
            <!-- Chat Header -->
            <div class="chat-header">
              <div class="flex items-center gap-3">
                <div class="avatar avatar-md">
                  <img src="${activePartner.avatar}" alt="${activePartner.name}" />
                  <div class="avatar-status ${activePartner.online ? 'online' : 'offline'}"></div>
                </div>
                <div>
                  <div class="flex items-center gap-2">
                    <h3 style="font-size:15px;">${activePartner.name}</h3>
                    <span class="badge badge-success" style="font-size:10px;">${activePartner.online ? 'Online' : 'Offline'}</span>
                  </div>
                  <div style="font-size:12px; color:var(--text-muted);">${activePartner.headline}</div>
                </div>
              </div>

              <div class="flex gap-2">
                <button class="btn btn-secondary btn-sm" id="chat-btn-profile" data-uid="${activePartner.id}">
                  Match Details
                </button>
                <button class="btn btn-primary btn-sm" id="chat-btn-schedule" data-uid="${activePartner.id}">
                  📅 Schedule Exchange
                </button>
              </div>
            </div>

            <!-- Messages Stream -->
            <div class="chat-messages-scroll" id="chat-scroll-area">
              <!-- Banner Card in thread -->
              <div style="background:var(--primary-subtle); border:1px solid var(--primary-border); border-radius:var(--radius-md); padding:var(--space-3); text-align:center; font-size:12px; color:var(--primary-hover); margin-bottom:var(--space-2);">
                ✨ <strong>Two-Way Barter Active:</strong> Exchanging 1 hr teaching = 1 Skill Credit.
              </div>

              ${messages.map(msg => {
                const isSent = msg.senderId === currentUser.id;
                return `
                  <div class="chat-bubble ${isSent ? 'sent' : 'received'}">
                    <div>${msg.text}</div>
                    <div class="chat-bubble-time">${msg.timestamp}</div>
                  </div>
                `;
              }).join("")}
            </div>

            <!-- Chat Input Bar -->
            <div class="chat-input-bar">
              <input
                type="text"
                class="form-input"
                id="chat-text-input"
                placeholder="Type a message to ${activePartner.name.split(" ")[0]}... (Press Enter to send)"
                style="border-radius:var(--radius-full);"
              />
              <button class="btn btn-primary" id="chat-send-btn">
                Send 🚀
              </button>
            </div>
          ` : `
            <div class="empty-state">
              <div class="empty-state-icon">💬</div>
              <div class="empty-state-title">Select a conversation</div>
              <div class="empty-state-desc">Choose a skill exchange partner from the left to view messages.</div>
            </div>
          `}
        </div>
      </div>
    `;

    bindEvents();
    scrollToBottom();
  }

  function scrollToBottom() {
    const scrollEl = container.querySelector("#chat-scroll-area");
    if (scrollEl) {
      scrollEl.scrollTop = scrollEl.scrollHeight;
    }
  }

  function bindEvents() {
    // Partner selection in left list
    container.querySelectorAll("[data-select-partner]").forEach(item => {
      item.addEventListener("click", () => {
        activePartnerId = item.getAttribute("data-select-partner");
        renderView();
      });
    });

    // Send message logic
    const sendBtn = container.querySelector("#chat-send-btn");
    const inputEl = container.querySelector("#chat-text-input");

    const doSend = () => {
      const text = inputEl?.value.trim();
      if (!text || !activePartnerId) return;

      store.sendMessage(activePartnerId, text);
      inputEl.value = "";
      renderView();
    };

    sendBtn?.addEventListener("click", doSend);
    inputEl?.addEventListener("keydown", (e) => {
      if (e.key === "Enter") doSend();
    });

    // Schedule button
    container.querySelector("#chat-btn-schedule")?.addEventListener("click", () => {
      openScheduleModal(activePartnerId);
    });

    // Profile button
    container.querySelector("#chat-btn-profile")?.addEventListener("click", () => {
      openMatchDetailsModal(activePartnerId, onNavigate);
    });
  }

  // Subscribe to state changes to update messages in real-time when simulated response arrives
  const unsubscribe = store.subscribe("message:received", (data) => {
    if (data.partnerId === activePartnerId) {
      renderView();
    }
  });

  renderView();
  return container;
}
