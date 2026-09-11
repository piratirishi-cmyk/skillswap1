/**
 * Community Feed View
 * Allows sharing achievements, asking questions, posting resources, giving advice, liking and commenting
 */

import { store } from "../store/state.js";
import { toast } from "../components/toast.js";

export function renderCommunityView(onNavigate) {
  const container = document.createElement("div");
  container.className = "community-view";

  let activeCategory = "All";

  function renderView() {
    const currentUser = store.getCurrentUser();
    let posts = store.state.communityPosts || [];

    if (activeCategory !== "All") {
      posts = posts.filter(p => p.category === activeCategory);
    }

    container.innerHTML = `
      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:var(--space-6);">
        <div>
          <h1 style="font-size:26px;">Community Knowledge Exchange</h1>
          <p style="font-size:14px; color:var(--text-muted); margin-top:2px;">
            Share milestones, ask peer questions, post learning resources, and celebrate wins together.
          </p>
        </div>
      </div>

      <div class="community-layout">
        <!-- Main Feed Column -->
        <div>
          <!-- Create Post Box -->
          <div class="card" style="padding:var(--space-5); margin-bottom:var(--space-6);">
            <div class="flex items-center gap-3" style="margin-bottom:var(--space-3);">
              <div class="avatar avatar-sm">
                <img src="${currentUser.avatar}" alt="${currentUser.name}" />
              </div>
              <span style="font-weight:700; font-size:14px;">Share with the SkillSwap Community</span>
            </div>

            <div class="form-group" style="margin-bottom:var(--space-2);">
              <input type="text" class="form-input" id="post-title" placeholder="Post title / highlight..." />
            </div>

            <div class="form-group" style="margin-bottom:var(--space-3);">
              <textarea class="form-textarea" id="post-content" placeholder="What did you learn today, or what question do you have for fellow barter partners?"></textarea>
            </div>

            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:var(--space-2);">
              <div class="flex items-center gap-2">
                <span style="font-size:12px; font-weight:600; color:var(--text-muted);">Category:</span>
                <select class="form-select btn-sm" id="post-category" style="width:auto; font-size:12px;">
                  <option value="Achievement">🎉 Achievement</option>
                  <option value="Question">❓ Question</option>
                  <option value="Resource">📚 Resource</option>
                  <option value="Advice">💡 Advice</option>
                </select>
              </div>

              <button class="btn btn-primary btn-sm" id="btn-publish-post">
                Publish Post 🚀
              </button>
            </div>
          </div>

          <!-- Category Filter Bar -->
          <div style="display:flex; align-items:center; gap:var(--space-2); margin-bottom:var(--space-4); overflow-x:auto;">
            ${["All", "Achievement", "Question", "Resource", "Advice"].map(cat => `
              <button class="category-chip ${activeCategory === cat ? 'active' : ''}" data-cat-filter="${cat}">
                ${cat}
              </button>
            `).join("")}
          </div>

          <!-- Posts List -->
          <div style="display:flex; flex-direction:column; gap:var(--space-4);">
            ${posts.length === 0 ? `
              <div class="empty-state card">
                <div class="empty-state-icon">👥</div>
                <div class="empty-state-title">No posts in this category yet</div>
                <div class="empty-state-desc">Be the first to share an insight or question!</div>
              </div>
            ` : posts.map(p => renderPostCard(p, currentUser)).join("")}
          </div>
        </div>

        <!-- Right Community Sidebar -->
        <div style="display:flex; flex-direction:column; gap:var(--space-6);">
          <!-- Guidelines Card -->
          <div class="card" style="padding:var(--space-5);">
            <h4 style="font-size:15px; margin-bottom:var(--space-3); display:flex; align-items:center; gap:6px;">
              <span>🛡️</span>
              <span>Barter Community Standards</span>
            </h4>
            <div style="font-size:12px; color:var(--text-secondary); line-height:1.6;">
              • <strong>Mutual Respect:</strong> Every learner is here in good faith to grow.<br>
              • <strong>Equal Dedication:</strong> Prepare for both your teaching and learning turns.<br>
              • <strong>No Solicitation:</strong> SkillSwap is strictly non-monetary peer barter.
            </div>
          </div>

          <!-- Top Community Mentors -->
          <div class="card" style="padding:var(--space-5);">
            <h4 style="font-size:15px; margin-bottom:var(--space-3);">Top Barter Contributors</h4>
            <div style="display:flex; flex-direction:column; gap:var(--space-3);">
              ${store.getOtherUsers().slice(0, 3).map(u => `
                <div class="flex items-center gap-3">
                  <div class="avatar avatar-sm">
                    <img src="${u.avatar}" alt="${u.name}" />
                  </div>
                  <div style="flex:1; overflow:hidden;">
                    <div style="font-size:13px; font-weight:700;">${u.name}</div>
                    <div style="font-size:11px; color:var(--text-muted);">${u.skillsTeach[0]?.name || ''} · ⭐ ${u.rating}</div>
                  </div>
                  <button class="btn btn-secondary btn-sm" style="font-size:11px; padding:2px 8px;" data-nav-user="${u.id}">
                    Connect
                  </button>
                </div>
              `).join("")}
            </div>
          </div>
        </div>
      </div>
    `;

    bindEvents();
  }

  function renderPostCard(post, currentUser) {
    const author = store.getUserById(post.authorId) || currentUser;

    return `
      <div class="post-card">
        <!-- Post Header -->
        <div style="display:flex; align-items:center; justify-content:space-between;">
          <div class="flex items-center gap-3">
            <div class="avatar avatar-sm">
              <img src="${author?.avatar || ''}" alt="${author?.name || ''}" />
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span style="font-weight:700; font-size:14px;">${author?.name || 'Member'}</span>
                <span class="badge ${post.category === 'Achievement' ? 'badge-success' : (post.category === 'Question' ? 'badge-warning' : 'badge-primary')}" style="font-size:10px;">
                  ${post.category}
                </span>
              </div>
              <div style="font-size:11px; color:var(--text-muted);">${post.timeAgo}</div>
            </div>
          </div>
        </div>

        <!-- Content -->
        <h3 style="font-size:16px; margin-top:2px;">${post.title}</h3>
        <div style="font-size:13.5px; color:var(--text-secondary); line-height:1.55;">
          ${post.content}
        </div>

        <!-- Post Actions -->
        <div style="display:flex; align-items:center; gap:var(--space-4); border-top:1px solid var(--border-subtle); padding-top:var(--space-3); margin-top:var(--space-2);">
          <button class="btn btn-ghost btn-sm ${post.isLiked ? 'text-primary' : ''}" data-like-post="${post.id}" style="font-weight:700;">
            ${post.isLiked ? '❤️' : '🤍'} ${post.likes} Likes
          </button>
          <span style="font-size:12px; color:var(--text-muted);">
            💬 ${(post.comments || []).length} Comments
          </span>
        </div>

        <!-- Comments Stream -->
        <div style="display:flex; flex-direction:column; gap:var(--space-2); margin-top:var(--space-2);">
          ${(post.comments || []).map(c => `
            <div class="comment-item">
              <div class="avatar avatar-xs">
                <img src="${c.avatar || ''}" alt="${c.authorName}" />
              </div>
              <div>
                <strong>${c.authorName}:</strong> <span>${c.text}</span>
              </div>
            </div>
          `).join("")}

          <!-- Add Comment Input -->
          <div style="display:flex; gap:var(--space-2); margin-top:4px;">
            <input
              type="text"
              class="form-input"
              id="comment-input-${post.id}"
              placeholder="Write a supportive reply..."
              style="font-size:12px; padding:6px 10px;"
            />
            <button class="btn btn-secondary btn-sm" data-add-comment="${post.id}">
              Reply
            </button>
          </div>
        </div>
      </div>
    `;
  }

  function bindEvents() {
    // Filter chips
    container.querySelectorAll("[data-cat-filter]").forEach(chip => {
      chip.addEventListener("click", () => {
        activeCategory = chip.getAttribute("data-cat-filter");
        renderView();
      });
    });

    // Create post
    container.querySelector("#btn-publish-post")?.addEventListener("click", () => {
      const title = container.querySelector("#post-title")?.value;
      const content = container.querySelector("#post-content")?.value;
      const category = container.querySelector("#post-category")?.value;

      if (!title || !title.trim() || !content || !content.trim()) {
        toast.warning("Incomplete Post", "Please provide a title and content.");
        return;
      }

      store.createCommunityPost({ title, content, category });
      toast.success("Post Published", "Your post is now live on the feed.");
      renderView();
    });

    // Like post
    container.querySelectorAll("[data-like-post]").forEach(btn => {
      btn.addEventListener("click", () => {
        const pid = btn.getAttribute("data-like-post");
        store.togglePostLike(pid);
        renderView();
      });
    });

    // Add comment
    container.querySelectorAll("[data-add-comment]").forEach(btn => {
      btn.addEventListener("click", () => {
        const pid = btn.getAttribute("data-add-comment");
        const input = container.querySelector(`#comment-input-${pid}`);
        const text = input?.value;

        if (!text || !text.trim()) return;

        store.addPostComment(pid, text);
        input.value = "";
        toast.info("Comment Added", "Your reply was posted.");
        renderView();
      });
    });

    // Connect buttons on sidebar
    container.querySelectorAll("[data-nav-user]").forEach(btn => {
      btn.addEventListener("click", () => {
        onNavigate("discover");
      });
    });
  }

  renderView();
  return container;
}
