/**
 * ==========================================================================
 * SCROLL TO TOP WEB COMPONENT (<scroll-top-component>)
 * ==========================================================================
 * Floating, elegant scroll-to-top button with smooth scroll & glass animation.
 */

class ScrollTopComponent extends HTMLElement {
  connectedCallback() {
    this.render();
    this.initScroll();
  }

  render() {
    this.innerHTML = `
      <button type="button" class="scroll-top-btn" id="scrollTopBtn" aria-label="Cuộn lên đầu trang" title="Cuộn lên đầu trang">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
      </button>
    `;
  }

  initScroll() {
    const btn = this.querySelector('#scrollTopBtn');
    if (!btn) return;

    const toggleBtnVisibility = () => {
      if (window.scrollY > 280) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    };

    btn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });

    window.addEventListener('scroll', toggleBtnVisibility, { passive: true });
    toggleBtnVisibility();
  }
}

if (!customElements.get('scroll-top-component')) {
  customElements.define('scroll-top-component', ScrollTopComponent);
}

// Auto-inject if not already present in DOM
const injectScrollTop = () => {
  if (!document.querySelector('scroll-top-component')) {
    document.body.appendChild(document.createElement('scroll-top-component'));
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', injectScrollTop);
} else {
  injectScrollTop();
}
