/**
 * ==========================================================================
 * INFOGRAPHIC LIST WEB COMPONENT WITH LIGHTBOX PREVIEW
 * ==========================================================================
 * A reusable, native web component for displaying academic A4 infographics.
 * Connects to /api/infographics API, matching MySQL table 'infographic_items'.
 * Automatically renders mock data initially and fetches API data in background.
 * Includes a premium, built-in fullscreen Lightbox modal overlay for previewing.
 */

import { InfographicService } from '../services/infographicService.js';

class InfographicListComponent extends HTMLElement {
  constructor() {
    super();
    this.infographics = [];
    this.assetPrefix = './'; // Renamed to avoid DOM conflict with Element.prefix
  }

  connectedCallback() {
    this.resolveAssetPrefix();
    try {
      console.log('Khởi chạy <infographic-list-component>...');
      this.init();
    } catch (e) {
      this.innerHTML = `
        <div style="background: #ffebee; border: 2px dashed #f44336; color: #c62828; padding: 24px; text-align: center; font-family: sans-serif; border-radius: 16px; margin: 40px auto; max-width: 1000px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          <h3 style="margin: 0 0 10px; font-weight: 800; text-transform: uppercase;">Lỗi khởi chạy mục Infographic</h3>
          <p style="margin: 0; font-size: 14px; font-weight: 600;">${e.stack || e.message}</p>
        </div>
      `;
      console.error('Lỗi khởi chạy Infographic Component:', e);
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
    this.initLightbox();

    // 2. Fetch live data in the background (non-blocking)
    await this.fetchDataInBackground();
  }

  /**
   * Populate mock data corresponding to 'infographic_items' table
   */
  loadMockData() {
    this.infographics = [
      {
        id: 1,
        ten_infographic: 'Đại học - Ngành Khoa học Máy tính',
        file_anh_url: 'assets/infographic/info_khmt.png',
        file_pdf_url: 'assets/infographic/info_khmt.png',
        thu_tu: 1
      },
      {
        id: 2,
        ten_infographic: 'Đại học - Ngành Trí tuệ Nhân tạo',
        file_anh_url: 'assets/infographic/info_ttnt.png',
        file_pdf_url: 'assets/infographic/info_ttnt.png',
        thu_tu: 2
      },
      {
        id: 3,
        ten_infographic: 'Sau Đại học - Thạc sĩ Khoa học Máy tính',
        file_anh_url: 'assets/infographic/info_thacsi.png',
        file_pdf_url: 'assets/infographic/info_thacsi.png',
        thu_tu: 3
      },
      {
        id: 4,
        ten_infographic: 'Sau Đại học - Tiến sĩ Khoa học Máy tính',
        file_anh_url: 'assets/infographic/info_tiensi.png',
        file_pdf_url: 'assets/infographic/info_tiensi.png',
        thu_tu: 4
      }
    ];
  }

  /**
   * Fetch live data in background, updates UI if found
   */
  async fetchDataInBackground() {
    const data = await InfographicService.getInfographics();
    if (data && data.length > 0) {
      this.infographics = data;
      this.render();
      this.initLightbox();
      console.log('Cập nhật dữ liệu infographic từ API thành công.');
    }
  }

  /**
   * Render HTML structure of the infographic section
   */
  render() {
    if (!this.infographics || this.infographics.length === 0) return;

    let cardsHtml = '';

    this.infographics.forEach(item => {
      const imgPath = `${this.assetPrefix}${item.file_anh_url}`;
      const pdfPath = `${this.assetPrefix}${item.file_pdf_url}`;

      cardsHtml += `
        <div class="info-card">
          <!-- Infographic image wrapper with absolute hover buttons -->
          <div class="info-image-wrapper">
            <img class="info-image" src="${imgPath}" alt="${item.ten_infographic}" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 300 420%22><rect width=%22300%22 height=%22420%22 fill=%22%23eef2f6%22/><text x=%2250%25%22 y=%2250%25%22 font-family=%22sans-serif%22 font-size=%2216%22 font-weight=%22bold%22 text-anchor=%22middle%22 fill=%22%2394a3b8%22>Infographic Tuyển Sinh</text></svg>'">
            <div class="info-overlay">
              <button class="info-btn btn-preview" data-src="${imgPath}" data-title="${item.ten_infographic}">
                <svg viewBox="0 0 24 24" class="btn-icon" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                <span>Xem ảnh lớn</span>
              </button>
              <a href="${pdfPath}" download="${item.ten_infographic}.png" class="info-btn btn-download" title="Tải ảnh/PDF chất lượng cao A4">
                <svg viewBox="0 0 24 24" class="btn-icon" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                <span>Tải PDF (A4)</span>
              </a>
            </div>
          </div>
          <!-- Card Title Footer -->
          <div class="info-card-footer">
            <h3 class="info-card-title">${item.ten_infographic}</h3>
          </div>
        </div>
      `;
    });

    this.innerHTML = `
      <section class="info-section">
        <div class="info-container">
          <h2 class="info-heading">Infographic Tuyển Sinh</h2>
          <div class="info-grid">
            ${cardsHtml}
          </div>
        </div>
      </section>

      <!-- Premium Fullscreen Lightbox Preview Overlay -->
      <div class="info-lightbox" id="infoLightbox" aria-hidden="true" role="dialog">
        <span class="lightbox-close" id="lightboxClose" aria-label="Đóng">&times;</span>
        <div class="lightbox-content-wrapper">
          <img class="lightbox-img" id="lightboxImg" src="" alt="Infographic Preview">
        </div>
        <div class="lightbox-caption" id="lightboxCaption"></div>
      </div>
    `;
  }

  /**
   * Set up Lightbox click events and key listeners
   */
  initLightbox() {
    const previewBtns = this.querySelectorAll('.btn-preview');
    const lightbox = this.querySelector('#infoLightbox');
    const lightboxImg = this.querySelector('#lightboxImg');
    const lightboxCaption = this.querySelector('#lightboxCaption');
    const closeBtn = this.querySelector('#lightboxClose');

    if (!lightbox || !lightboxImg || !lightboxCaption || !closeBtn) return;

    // Attach click triggers to preview buttons
    previewBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const targetBtn = e.currentTarget;
        const imgSrc = targetBtn.getAttribute('data-src');
        const imgTitle = targetBtn.getAttribute('data-title');

        lightboxImg.src = imgSrc;
        lightboxCaption.textContent = imgTitle;
        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // Stop background scrolling
      });
    });

    // Close on click close button
    closeBtn.addEventListener('click', () => this.closeLightbox());

    // Close on click background overlay
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target.classList.contains('lightbox-content-wrapper')) {
        this.closeLightbox();
      }
    });

    // Keyboard listener for Escape button
    this.onEscPress = (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        this.closeLightbox();
      }
    };
    document.removeEventListener('keydown', this.onEscPress);
    document.addEventListener('keydown', this.onEscPress);
  }

  closeLightbox() {
    const lightbox = this.querySelector('#infoLightbox');
    const lightboxImg = this.querySelector('#lightboxImg');
    if (!lightbox) return;

    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = ''; // Restore background scrolling
    
    // Clear src after fade transition ends to avoid flash next open
    setTimeout(() => {
      if (lightboxImg && !lightbox.classList.contains('active')) {
        lightboxImg.src = '';
      }
    }, 300);
  }

  disconnectedCallback() {
    if (this.onEscPress) {
      document.removeEventListener('keydown', this.onEscPress);
    }
  }
}

// Define custom element
if (!customElements.get('infographic-list-component')) {
  customElements.define('infographic-list-component', InfographicListComponent);
}
