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
    const folders = ['dai-hoc', 'gioi-thieu', 'nhan-su', 'nghien-cuu', 'sau-dai-hoc'];
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
    // 1. Instantly paint mock data
    this.loadMockData();
    this.render();

    // 2. Fetch live data in the background (non-blocking)
    await this.fetchDataInBackground();
  }

  /**
   * Populate mock data corresponding to 'cuu_sinh_vien_tieu_bieu' table
   */
  loadMockData() {
    this.alumniData = [
      {
        id: 1,
        ho_ten: 'Trần Hoàng Thảo Nguyên',
        chuc_danh_cong_ty: 'Data Engineer @ PTN Global\nMEng. in Human Computer Interaction @ KIT',
        trich_dan_cam_nhan: 'Những kiến thức nền tảng và kỹ năng nghiên cứu tại Khoa đã giúp tôi tự tin phát triển trong môi trường công nghệ.',
        hinh_anh_avatar_url: 'assets/alumni/alumni_nguyen.png'
      },
      {
        id: 2,
        ho_ten: 'Tạ Đặng Vĩnh Phúc',
        chuc_danh_cong_ty: 'Co-Founder @ Flux Astromesh\nDoanh nghiệp chuyển đổi số',
        trich_dan_cam_nhan: 'Chương trình học giúp tôi có nền tảng tốt về dữ liệu, lập trình và tư duy giải quyết vấn đề.',
        hinh_anh_avatar_url: 'assets/alumni/alumni_phuc.png'
      },
      {
        id: 3,
        ho_ten: 'Trần Quốc Khang',
        chuc_danh_cong_ty: 'Trợ giảng @ Khoa Khoa học máy tính\nĐại học Cần Thơ',
        trich_dan_cam_nhan: 'Môi trường học thuật tại Khoa là nền tảng quan trọng giúp tôi tiếp tục theo đuổi nghiên cứu và ứng dụng AI.',
        hinh_anh_avatar_url: 'assets/alumni/alumni_khang.png'
      }
    ];
  }

  /**
   * Fetch live data in background, updates UI if found
   */
  async fetchDataInBackground() {
    const data = await AlumniService.getAlumni();
    if (data && data.length > 0) {
      this.alumniData = data;
      this.render();
      console.log('Cập nhật dữ liệu cựu sinh viên từ API thành công.');
    }
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

    this.alumniData.forEach((item, idx) => {
      const imgPath = `${this.assetPrefix}${item.hinh_anh_avatar_url}`;
      
      // Parse the double role lines
      const roles = item.chuc_danh_cong_ty.split('\n');
      const primaryRole = roles[0] || '';
      const secondaryRole = roles[1] || '';
      const roleHtml = `
        <div class="alumni-primary-role">${primaryRole}</div>
        ${secondaryRole ? `<div class="alumni-secondary-role">${secondaryRole}</div>` : ''}
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
          <blockquote class="alumni-quote">
            “${item.trich_dan_cam_nhan}”
          </blockquote>
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
