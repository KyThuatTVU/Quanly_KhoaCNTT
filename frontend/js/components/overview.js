/**
 * ==========================================================================
 * FACULTY OVERVIEW WEB COMPONENT
 * ==========================================================================
 * A reusable, native web component for displaying general overview.
 * Connects to /api/overview and /api/overview/highlights endpoints.
 */

import { OverviewService } from '../services/overviewService.js';

class AboutOverviewComponent extends HTMLElement {
  constructor() {
    super();
    this.overviewData = null;
    this.highlightsData = [];
    this.assetPrefix = './';
  }

  connectedCallback() {
    try {
      console.log('Khởi chạy <about-overview-component>...');
      this.resolveAssetPrefix();
      this.init();
    } catch (e) {
      this.innerHTML = `
        <div style="background: #ffebee; border: 2px dashed #f44336; color: #c62828; padding: 24px; text-align: center; font-family: sans-serif; border-radius: 16px; margin: 40px auto; max-width: 1000px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          <h3 style="margin: 0 0 10px; font-weight: 800; text-transform: uppercase;">Lỗi khởi chạy mục Giới thiệu tổng quan</h3>
          <p style="margin: 0; font-size: 14px; font-weight: 600;">${e.stack || e.message}</p>
        </div>
      `;
      console.error('Lỗi khởi chạy Overview Component:', e);
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
    const [overview, highlights] = await Promise.all([
      OverviewService.getOverview(),
      OverviewService.getHighlights()
    ]);

    this.overviewData = overview || null;
    this.highlightsData = highlights || [];
    this.render();
    console.log('Tải dữ liệu tổng quan thành công.');
  }

  /**
   * Render HTML structure of the overview, group photo, and highlight cards
   */
  render() {
    // Fallback mockup overview data if API returned null
    const overview = this.overviewData || {
      badge_text: 'GIỚI THIỆU TỔNG QUAN',
      tieu_de: 'KHOA CÔNG NGHỆ THÔNG TIN',
      mo_ta_chi_tiet: 'Khoa Công nghệ thông tin thuộc Trường Đại học Trà Vinh. Khoa được thành lập với nhiệm vụ đào tạo nguồn nhân lực chất lượng cao, nghiên cứu khoa học và chuyển giao công nghệ hàng đầu trong lĩnh vực Công nghệ thông tin, phục vụ đắc lực cho sự nghiệp công nghiệp hóa, hiện đại hóa của tỉnh Trà Vinh nói riêng và cả nước nói chung.',
      hinh_anh_tap_the_url: 'assets/images/sit_group.png',
      caption_anh: 'Tập thể giảng viên, cán bộ Khoa Công nghệ thông tin - Đại học Trà Vinh'
    };

    // Fallback mockup highlights if API returned empty array
    const highlights = this.highlightsData && this.highlightsData.length > 0 
      ? this.highlightsData 
      : [
          {
            id: 1,
            icon_class: 'graduation-cap',
            tieu_de: 'Chương trình đào tạo',
            mo_ta: 'Chương trình đào tạo tiên tiến, cung ứng nguồn nhân lực chất lượng cao cho doanh nghiệp.'
          },
          {
            id: 2,
            icon_class: 'flask',
            tieu_de: 'Nghiên cứu khoa học',
            mo_ta: 'Đẩy mạnh nghiên cứu ứng dụng, chuyển giao công nghệ và các công bố khoa học uy tín.'
          },
          {
            id: 3,
            icon_class: 'share-2',
            tieu_de: 'Chuyển giao công nghệ',
            mo_ta: 'Ứng dụng các giải pháp công nghệ số thực tiễn phục vụ sự phát triển của cộng đồng.'
          }
        ];

    let gridHtml = '';

    // Standard vector SVGs corresponding to highlights
    const icons = {
      'graduation-cap': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="overview-svg-icon"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"></path></svg>`,
      'flask': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="overview-svg-icon"><path d="M6 18h8M3 22h18 M12 6a4 4 0 0 0-4 4v5 M12 12a3 3 0 0 0-3 3M12 2v4 M9 6h6"></path></svg>`,
      'share-2': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="overview-svg-icon"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>`
    };

    highlights.forEach((item, idx) => {
      const svgIcon = icons[item.icon_class] || icons['graduation-cap'];

      gridHtml += `
        <div class="overview-card">
          <div class="overview-icon-wrapper theme-${idx + 1}">
            ${svgIcon}
          </div>
          <div class="overview-card-info">
            <h3 class="overview-card-title">${item.tieu_de}</h3>
            <p class="overview-card-desc">${item.mo_ta}</p>
          </div>
        </div>
      `;
    });

    // Handle relative path resolution for the group photo
    const photoPath = overview.hinh_anh_tap_the_url.startsWith('http')
      ? overview.hinh_anh_tap_the_url
      : `${this.assetPrefix}${overview.hinh_anh_tap_the_url}`;

    this.innerHTML = `
      <section class="overview-section">
        <div class="overview-container">
          <!-- Eyebrow Badge -->
          <div class="overview-badge-wrapper">
            <span class="overview-badge">${overview.badge_text}</span>
          </div>
          
          <!-- Heading -->
          <h2 class="overview-heading">${overview.tieu_de}</h2>
          
          <!-- Detailed Paragraph -->
          <p class="overview-desc">${overview.mo_ta_chi_tiet}</p>
          
          <!-- Large Group Photo Container -->
          <div class="overview-photo-container">
            <img src="${photoPath}" alt="${overview.caption_anh}" class="overview-photo" onerror="this.onerror=null; this.src='data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 1200 600%22><rect width=%22100%25%22 height=%22100%25%22 fill=%22%23e2e8f0%22/><text x=%2250%25%22 y=%2250%25%22 font-family=%22sans-serif%22 font-size=%2232%22 text-anchor=%22middle%22 fill=%22%2364748b%22>Hình ảnh tập thể Khoa CNTT - TVU</text></svg>'">
            <div class="overview-photo-badge" style="${overview.caption_anh ? '' : 'display:none;'}">
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="badge-icon">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              <span>${overview.caption_anh}</span>
            </div>
          </div>
          
          <!-- Highlights Grid (3 Cards) -->
          <div class="overview-grid">
            ${gridHtml}
          </div>
        </div>
      </section>
    `;
  }
}

// Define custom element
if (!customElements.get('about-overview-component')) {
  customElements.define('about-overview-component', AboutOverviewComponent);
}
