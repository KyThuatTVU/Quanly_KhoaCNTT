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
    const folders = ['trang-chu', 'dai-hoc', 'gioi-thieu', 'nhan-su', 'nghien-cuu', 'sau-dai-hoc'];
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
    if (this.partnersData.length === 0) return;

    let cardsHtml = '';

    // Vector SVGs fallbacks for missing image files to guarantee crisp rendering
    const vectorLogos = {
      'cnrs': `
        <svg viewBox="0 0 120 70" class="partner-logo-svg">
          <circle cx="60" cy="35" r="26" fill="#002d62"/>
          <text x="60" y="41.5" font-family="'Be Vietnam Pro', sans-serif" font-size="16" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="0.5px">cnrs</text>
        </svg>
      `,
      'fpt': `
        <svg viewBox="0 0 120 70" class="partner-logo-svg">
          <text x="60" y="44" font-family="'Arial Black', 'Impact', sans-serif" font-size="28" font-weight="900" font-style="italic" fill="#005691" text-anchor="middle" letter-spacing="-1px">
            F<tspan fill="#f37021">P</tspan><tspan fill="#00a859">T</tspan>
          </text>
        </svg>
      `,
      'ulb': `
        <svg viewBox="0 0 160 70" class="partner-logo-svg">
          <rect x="12" y="16" width="36" height="38" rx="2" fill="#002b62"/>
          <text x="30" y="41" font-family="sans-serif" font-size="13" font-weight="bold" fill="#ffffff" text-anchor="middle">ULB</text>
          <text x="56" y="30" font-family="sans-serif" font-size="9" font-weight="800" fill="#002b62" letter-spacing="0.2px">UNIVERSITÉ</text>
          <text x="56" y="41" font-family="sans-serif" font-size="9" font-weight="800" fill="#002b62" letter-spacing="0.2px">LIBRE</text>
          <text x="56" y="52" font-family="sans-serif" font-size="8" font-weight="800" fill="#002b62" letter-spacing="0.1px">DE BRUXELLES</text>
        </svg>
      `,
      'vnpt': `
        <svg viewBox="0 0 120 70" class="partner-logo-svg">
          <circle cx="60" cy="24" r="13" fill="none" stroke="#005bae" stroke-width="4.5"/>
          <path d="M47 24 C53 13, 67 13, 73 24" fill="none" stroke="#005bae" stroke-width="4.5" stroke-linecap="round"/>
          <text x="60" y="54" font-family="'Arial Black', 'Impact', sans-serif" font-size="13" font-weight="900" fill="#005bae" text-anchor="middle" letter-spacing="1.5px">VNPT</text>
        </svg>
      `,
      'inria': `
        <svg viewBox="0 0 120 70" class="partner-logo-svg">
          <text x="60" y="45" font-family="'Georgia', 'Times New Roman', serif" font-size="28" font-weight="bold" font-style="italic" fill="#e63946" text-anchor="middle" letter-spacing="-0.5px">Inria</text>
        </svg>
      `
    };

    this.partnersData.forEach((item) => {
      const nameKey = item.ten_doi_tac.toLowerCase();
      let innerContent = '';

      // Check if we have a vector logo fallback or load the image file
      if (nameKey.includes('cnrs')) {
        innerContent = vectorLogos['cnrs'];
      } else if (nameKey.includes('fpt')) {
        innerContent = vectorLogos['fpt'];
      } else if (nameKey.includes('ulb')) {
        innerContent = vectorLogos['ulb'];
      } else if (nameKey.includes('vnpt')) {
        innerContent = vectorLogos['vnpt'];
      } else if (nameKey.includes('inria')) {
        innerContent = vectorLogos['inria'];
      } else {
        // Resolve path to the physical logo image (PTN Global, etc.)
        const resolvedPath = item.logo_url.startsWith('http')
          ? item.logo_url
          : `${this.assetPrefix}${item.logo_url}`;
        innerContent = `<img src="${resolvedPath}" alt="${item.ten_doi_tac}" class="partner-img" onerror="this.onerror=null; this.parentNode.innerHTML='<span class=%22partner-text-fallback%22>${item.ten_doi_tac}</span>'">`;
      }

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
