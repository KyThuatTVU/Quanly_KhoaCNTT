/**
 * ==========================================================================
 * FACULTY COOPERATION CALL TO ACTION BANNER COMPONENT
 * ==========================================================================
 * Renders the full-width Cooperate CTA banner.
 * Statically coded for speed and reliability, preserving TVU identity.
 * Placed at the very bottom of the page content.
 */

class CooperateCtaComponent extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
      <!-- Cooperate CTA Banner (Full Width) -->
      <div class="coop-banner">
        <div class="coop-banner-container">
          <h2 class="coop-banner-title">Hợp tác cùng chúng tôi</h2>
          <p class="coop-banner-desc">
            Khoa Công nghệ thông tin Trường Đại học Trà Vinh luôn hoan nghênh mọi sự hợp tác, hỗ trợ của các cơ quan, doanh nghiệp, đối tác trong và ngoài nước nhằm nâng cao chất lượng đào tạo, nghiên cứu và chuyển giao công nghệ.
          </p>
          <div class="coop-banner-action">
            <a href="mailto:fit@tvu.edu.vn" class="coop-btn-3d">
              <span>Liên hệ hợp tác</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="btn-arrow-icon"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </a>
          </div>
        </div>
      </div>
    `;
  }
}

// Define custom element
if (!customElements.get('cooperate-cta-component')) {
  customElements.define('cooperate-cta-component', CooperateCtaComponent);
}
