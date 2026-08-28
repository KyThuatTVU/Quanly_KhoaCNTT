/**
 * ==========================================================================
 * ALUMNI SHOWCASE WEB COMPONENT
 * ==========================================================================
 * A reusable, native web component for displaying outstanding alumni.
 * Connects to /api/alumni API, matching MySQL table 'cuu_sinh_vien_tieu_bieu'.
 * Includes dynamic SVG fallback avatars for profiles.
 */

import { AlumniService } from '../services/alumniService.js';

class AlumniShowcaseComponent extends HTMLElement {
  constructor() {
    super();
    this.alumniData = [];
    this.assetPrefix = './'; // Renamed to avoid DOM conflict with Element.prefix
  }

  connectedCallback() {
    this.resolveAssetPrefix();
    try {
      console.log('Khởi chạy <alumni-showcase-component>...');
      this.init();
    } catch (e) {
      this.innerHTML = `
        <div style="background: #ffebee; border: 2px dashed #f44336; color: #c62828; padding: 24px; text-align: center; font-family: sans-serif; border-radius: 16px; margin: 40px auto; max-width: 1000px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          <h3 style="margin: 0 0 10px; font-weight: 800; text-transform: uppercase;">Lỗi khởi chạy mục Cựu sinh viên tiêu biểu</h3>
          <p style="margin: 0; font-size: 14px; font-weight: 600;">${e.stack || e.message}</p>
        </div>
      `;
      console.error('Lỗi khởi chạy Alumni Component:', e);
    }
  }

  /**
   * Resolve relative prefix path based on the current page's location
   */
  resolveAssetPrefix() {
    const folders = ['home', 'undergraduate', 'about', 'staff', 'research', 'postgraduate'];
    const currentPath = window.location.pathname;
    this.assetPrefix = './';

    for (const folder of folders) {
      if (currentPath.includes('/' + folder)) {
        this.assetPrefix = '../';
        break;
      }
    }
  }

  /**
   * Initialize data flow
   */
  async init() {
    await this.fetchData();
  }

  /**
   * Fetch live data
   */
  async fetchData() {
    const data = await AlumniService.getAlumni();
    this.alumniData = data || [];
    this.render();
    console.log('Tải dữ liệu cựu sinh viên thành công.');
  }

  /**
   * Render HTML structure of the showcase
   */
  render() {
    if (!this.alumniData || this.alumniData.length === 0) return;

    let cardsHtml = '';

    // Modern profile avatars for SVGs placeholders
    const svgAvatars = [
      // 0: Female professional (Nguyen)
      `<div class="alumni-svg-avatar female-theme"><svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="50" cy="50" r="45" fill="rgba(15,111,255,0.02)"/><circle cx="50" cy="38" r="16"/><path d="M22 80 c0-14 12-24 28-25 s28 10 28 25"/><path d="M45 42 c0 4 10 4 10 0" stroke-width="1.8"/><path d="M30 25 c8-8 32-8 40 0" stroke-width="1.8" stroke-opacity="0.8"/></svg></div>`,
      // 1: Male professional (Phuc)
      `<div class="alumni-svg-avatar male-theme"><svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="50" cy="50" r="45" fill="rgba(247,127,0,0.02)"/><circle cx="50" cy="38" r="16"/><path d="M22 80 c0-14 12-24 28-25 s28 10 28 25"/><path d="M34 26 c10-6 22-6 32 0" stroke-width="1.8" stroke-opacity="0.8"/></svg></div>`,
      // 2: Male professional (Khang)
      `<div class="alumni-svg-avatar blue-male-theme"><svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="50" cy="50" r="45" fill="rgba(0,180,216,0.02)"/><circle cx="50" cy="38" r="16"/><path d="M22 80 c0-14 12-24 28-25 s28 10 28 25"/><path d="M34 26 c10-6 22-6 32 0" stroke-width="1.8" stroke-opacity="0.8"/></svg></div>`
    ];

    this.alumniData.filter(item => item.an_hien !== 0).forEach((item, idx) => {
      const imgPath = `${this.assetPrefix}${item.hinh_anh_avatar_url}`;
      
      // Parse the double role lines
      const roles = item.chuc_danh_cong_ty.split('\n');
      const primaryRole = roles[0] || '';
      const secondaryRole = roles[1] || '';
      const roleHtml = `
        <div class="alumni-primary-role">${primaryRole}</div>
        ${secondaryRole ? `<div class="alumni-secondary-role">${secondaryRole}</div>` : ''}
      `;

      const rawQuote = item.trich_dan_cam_nhan || '';
      const limit = 160;
      const isLong = rawQuote.length > limit;
      const displayedQuote = isLong ? rawQuote.substring(0, limit) + '...' : rawQuote;
      const quoteHtml = isLong ? `
        <blockquote class="alumni-quote">
          “<span class="quote-text">${displayedQuote}</span>”
          <a href="#" class="alumni-toggle-more" data-full="${encodeURIComponent(rawQuote)}" data-short="${encodeURIComponent(displayedQuote)}" style="color: #0f6fff; font-weight: 600; font-size: 13px; margin-left: 5px; text-decoration: none;">Xem thêm</a>
        </blockquote>
      ` : `
        <blockquote class="alumni-quote">
          “${rawQuote}”
        </blockquote>
      `;

      cardsHtml += `
        <article class="alumni-card">
          <!-- Card Header (Avatar + Info) -->
          <div class="alumni-card-header">
            <div class="alumni-avatar-wrapper">
              <img class="alumni-avatar" src="${imgPath}" alt="${item.ho_ten}" data-index="${idx}">
            </div>
            <div class="alumni-info">
              <h3 class="alumni-name">${item.ho_ten}</h3>
              ${roleHtml}
            </div>
          </div>
          
          <!-- Card Quote Body -->
          ${quoteHtml}
        </article>
      `;
    });

    this.innerHTML = `
      <section class="alumni-section">
        <div class="alumni-container">
          <h2 class="alumni-heading">Cựu Sinh Viên</h2>
          <div class="alumni-subheading">Những gương mặt cựu sinh viên tiêu biểu đã và đang đóng góp trong lĩnh vực công nghệ thông tin.</div>
          <div class="alumni-grid">
            ${cardsHtml}
          </div>
        </div>
      </section>
    `;

    // Initialize event-based avatar fallbacks to prevent quoting syntax errors
    this.initAvatarFallbacks(svgAvatars);
    // Initialize toggle events for long quotes
    this.initToggleEvents();
  }

  /**
   * Initialize "Xem thêm" / "Rút gọn" toggling for long quotes
   */
  initToggleEvents() {
    const toggles = this.querySelectorAll('.alumni-toggle-more');
    toggles.forEach(toggle => {
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        const span = toggle.parentNode.querySelector('.quote-text');
        const isExpanded = toggle.textContent === 'Rút gọn';
        if (isExpanded) {
          span.innerHTML = decodeURIComponent(toggle.getAttribute('data-short'));
          toggle.textContent = 'Xem thêm';
        } else {
          span.innerHTML = decodeURIComponent(toggle.getAttribute('data-full'));
          toggle.textContent = 'Rút gọn';
        }
      });
    });
  }

  /**
   * Attaches error event listeners to image tags dynamically.
   * Prevents syntax errors associated with inline double quotes.
   */
  initAvatarFallbacks(svgAvatars) {
    const images = this.querySelectorAll('.alumni-avatar');
    images.forEach(img => {
      const replaceWithSVG = () => {
        const idx = parseInt(img.getAttribute('data-index'));
        const placeholderHtml = svgAvatars[idx % svgAvatars.length];
        
        // Parse the SVG placeholder string into DOM node
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = placeholderHtml.trim();
        const placeholderElem = tempDiv.firstChild;
        
        // Replace image element in parent node
        if (img.parentNode) {
          img.parentNode.replaceChild(placeholderElem, img);
        }
      };

      // Listen for image load error
      img.addEventListener('error', replaceWithSVG);
      
      // Immediately run fallback if browser has already processed image load fail (cached 404)
      if (img.complete && img.naturalWidth === 0) {
        replaceWithSVG();
      }
    });
  }
}

// Define custom element
if (!customElements.get('alumni-showcase-component')) {
  customElements.define('alumni-showcase-component', AlumniShowcaseComponent);
}
