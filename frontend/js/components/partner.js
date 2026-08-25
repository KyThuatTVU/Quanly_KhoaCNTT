/**
 * ==========================================================================
 * FACULTY PARTNERS WEB COMPONENT
 * ==========================================================================
 * A reusable, native web component for displaying the international partners.
 * Connects to /api/partners endpoint.
 * Implements an infinite horizontal scrolling marquee loop.
 */

import { PartnerService } from '../services/partnerService.js';

class InternationalPartnersComponent extends HTMLElement {
  constructor() {
    super();
    this.partnersData = [];
    this.assetPrefix = './';
  }

  connectedCallback() {
    try {
      console.log('Khởi chạy <international-partners-component>...');
      this.resolveAssetPrefix();
      this.init();
    } catch (e) {
      this.innerHTML = `
        <div style="background: #ffebee; border: 2px dashed #f44336; color: #c62828; padding: 24px; text-align: center; font-family: sans-serif; border-radius: 16px; margin: 40px auto; max-width: 1000px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          <h3 style="margin: 0 0 10px; font-weight: 800; text-transform: uppercase;">Lỗi khởi chạy mục Đối tác hợp tác</h3>
          <p style="margin: 0; font-size: 14px; font-weight: 600;">${e.stack || e.message}</p>
        </div>
      `;
      console.error('Lỗi khởi chạy Partners Component:', e);
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
    const data = await PartnerService.getPartners();
    this.partnersData = data || [];
    this.render();
    console.log('Tải danh sách đối tác thành công.');
  }

  /**
   * Render HTML structure of the partners section
   */
  render() {
    // Fallback mockup partners data if empty
    const partners = this.partnersData && this.partnersData.length > 0 
      ? this.partnersData 
      : [
          { id: 1, ten_doi_tac: "CNRS", logo_url: "assets/images/cnrs.webp", hien_thi_o: "gioi_thieu", thu_tu: 1 },
          { id: 2, ten_doi_tac: "FPT", logo_url: "assets/images/fpt.webp", hien_thi_o: "gioi_thieu", thu_tu: 2 },
          { id: 3, ten_doi_tac: "PTN Global", logo_url: "assets/images/PTN_Logo-01-Khanh-Kieu.png", hien_thi_o: "gioi_thieu", thu_tu: 3 },
          { id: 4, ten_doi_tac: "ULB", logo_url: "assets/images/bruxelles.webp", hien_thi_o: "gioi_thieu", thu_tu: 4 },
          { id: 5, ten_doi_tac: "VNPT", logo_url: "assets/images/vnpt.webp", hien_thi_o: "gioi_thieu", thu_tu: 5 },
          { id: 6, ten_doi_tac: "Inria", logo_url: "assets/images/inria.webp", hien_thi_o: "gioi_thieu", thu_tu: 6 }
        ];

    let cardsHtml = '';

    partners.forEach((item) => {
      // Resolve path to the physical logo image
      const resolvedPath = item.logo_url.startsWith('http')
        ? item.logo_url
        : `${this.assetPrefix}${item.logo_url}`;
      const innerContent = `<img src="${resolvedPath}" alt="${item.ten_doi_tac}" class="partner-img" onerror="this.onerror=null; this.parentNode.innerHTML='<span class=%22partner-text-fallback%22>${item.ten_doi_tac}</span>'">`;

      cardsHtml += `
        <div class="partner-card-3d-wrap">
          <div class="partner-card-3d" title="${item.ten_doi_tac}">
            <div class="partner-logo-container">
              ${innerContent}
            </div>
          </div>
        </div>
      `;
    });

    this.innerHTML = `
      <section class="partners-section">
        <div class="partners-container">
          <!-- Heading -->
          <h2 class="partners-heading">Hợp Tác Quốc Tế</h2>
          
          <!-- Subtitle -->
          <p class="partners-desc">
            Khoa hợp tác rộng rãi với các viện nghiên cứu, trường đại học và đối tác quốc tế trong đào tạo, nghiên cứu khoa học và chuyển giao công nghệ.
          </p>
          
          <!-- Infinite Scrolling Marquee Wrapper -->
          <div class="partners-marquee-wrapper">
            <div class="partners-marquee-track">
              <!-- Double the items to allow a seamless infinite scroll loop -->
              ${cardsHtml}
              ${cardsHtml}
            </div>
          </div>
        </div>
      </section>
    `;
  }
}

// Define custom element
if (!customElements.get('international-partners-component')) {
  customElements.define('international-partners-component', InternationalPartnersComponent);
}
