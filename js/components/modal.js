/**
 * Accessible Modal Controller
 */

class ModalController {
  constructor() {
    this.overlay = null;
    this.container = null;
    this.currentOnClose = null;
  }

  init() {
    if (!this.overlay) {
      this.overlay = document.createElement("div");
      this.overlay.className = "modal-overlay";
      this.overlay.innerHTML = `
        <div class="modal-container" role="dialog" aria-modal="true">
          <div class="modal-header">
            <h3 class="modal-title" id="modal-title-text">Modal</h3>
            <button class="modal-close-btn" id="modal-close-btn" aria-label="Close dialog">&times;</button>
          </div>
          <div class="modal-body" id="modal-body-content"></div>
          <div class="modal-footer" id="modal-footer-content"></div>
        </div>
      `;
      document.body.appendChild(this.overlay);

      this.container = this.overlay.querySelector(".modal-container");
      this.titleEl = this.overlay.querySelector("#modal-title-text");
      this.bodyEl = this.overlay.querySelector("#modal-body-content");
      this.footerEl = this.overlay.querySelector("#modal-footer-content");

      // Event listeners
      this.overlay.querySelector("#modal-close-btn").addEventListener("click", () => this.close());
      this.overlay.addEventListener("click", (e) => {
        if (e.target === this.overlay) this.close();
      });

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && this.isOpen()) {
          this.close();
        }
      });
    }
  }

  open({ title = "", contentHtml = "", footerHtml = "", size = "md", onClose = null }) {
    this.init();
    this.currentOnClose = onClose;

    this.titleEl.textContent = title;
    this.bodyEl.innerHTML = contentHtml;

    if (footerHtml) {
      this.footerEl.innerHTML = footerHtml;
      this.footerEl.classList.remove("hidden");
    } else {
      this.footerEl.innerHTML = "";
      this.footerEl.classList.add("hidden");
    }

    // Handle sizing
    this.container.classList.remove("modal-lg", "modal-xl");
    if (size === "lg") this.container.classList.add("modal-lg");
    if (size === "xl") this.container.classList.add("modal-xl");

    this.overlay.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  close() {
    if (this.overlay) {
      this.overlay.classList.remove("active");
      document.body.style.overflow = "";
      if (typeof this.currentOnClose === "function") {
        this.currentOnClose();
        this.currentOnClose = null;
      }
    }
  }

  isOpen() {
    return this.overlay && this.overlay.classList.contains("active");
  }
}

export const modal = new ModalController();
