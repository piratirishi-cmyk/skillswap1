/**
 * Toast Notification Component
 */

class ToastService {
  constructor() {
    this.container = null;
  }

  init() {
    if (!this.container) {
      this.container = document.createElement("div");
      this.container.className = "toast-container";
      document.body.appendChild(this.container);
    }
  }

  show({ title, message, type = "info", duration = 4000 }) {
    this.init();

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;

    const icons = {
      success: "✓",
      error: "✕",
      warning: "⚠",
      info: "ℹ"
    };

    toast.innerHTML = `
      <div class="toast-icon">${icons[type] || "ℹ"}</div>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        <div class="toast-message">${message}</div>
      </div>
      <button class="toast-close" aria-label="Close">&times;</button>
    `;

    const closeBtn = toast.querySelector(".toast-close");
    const removeToast = () => {
      toast.classList.remove("show");
      setTimeout(() => {
        if (toast.parentElement) toast.remove();
      }, 300);
    };

    closeBtn.addEventListener("click", removeToast);

    this.container.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
      toast.classList.add("show");
    });

    if (duration > 0) {
      setTimeout(removeToast, duration);
    }
  }

  success(title, message) {
    this.show({ title, message, type: "success" });
  }

  error(title, message) {
    this.show({ title, message, type: "error" });
  }

  info(title, message) {
    this.show({ title, message, type: "info" });
  }

  warning(title, message) {
    this.show({ title, message, type: "warning" });
  }
}

export const toast = new ToastService();
