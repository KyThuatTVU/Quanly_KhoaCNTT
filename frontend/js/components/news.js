/**
 * ==========================================================================
 * NEWS & EVENTS WEB COMPONENT
 * ==========================================================================
 * A reusable, native web component for displaying the news and events grid.
 * Connects to /api/news API, matching MySQL tables 'tin_tuc' and 'hinh_anh_tin_tuc'.
 * Automatically renders mock data initially and fetches API data in background.
 */

import { NewsService } from '../services/newsService.js';

class NewsEventsComponent extends HTMLElement {
  constructor() {
    super();
    this.newsData = [];
    this.assetPrefix = './'; // Renamed from prefix to avoid conflict with Element.prefix getter
  }

  connectedCallback() {
    this.resolveAssetPrefix();
    try {
      console.log('Khởi chạy <news-events-component>...');
      this.init();
    } catch (e) {
      this.innerHTML = `
        <div style="background: #ffebee; border: 2px dashed #f44336; color: #c62828; padding: 24px; text-align: center; font-family: sans-serif; border-radius: 16px; margin: 40px auto; max-width: 1000px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          <h3 style="margin: 0 0 10px; font-weight: 800; text-transform: uppercase;">Lỗi khởi chạy mục Tin tức & Sự kiện</h3>
          <p style="margin: 0; font-size: 14px; font-weight: 600;">${e.stack || e.message}</p>
        </div>
      `;
      console.error('Lỗi khởi chạy News Component:', e);
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
   * Populate mock data corresponding to 'tin_tuc' and 'hinh_anh_tin_tuc' tables
   */
  loadMockData() {
    this.newsData = [
      {
        id: 1,
        tieu_de: 'Tham dự hội thảo quốc tế CITA 2026 tại Vịnh Hạ Long, Quảng Ninh',
        slug: 'cita-2026',
        ngay_dang: '2026-07-19',
        nhan_lon: '19-07-2026',
        nhan_nho: 'CITA 2026, Vịnh Hạ Long',
        tom_tat: 'Khoa Công nghệ Thông tin - Trường Đại học Trà Vinh đã tham gia và trình bày báo cáo nghiên cứu tại Hội thảo quốc tế về Điện toán và Công nghệ thông tin (CITA 2026) được tổ chức tại thành phố du lịch biển Vịnh Hạ Long, Quảng Ninh.',
        anh_chinh: 'assets/news/news_cita.png'
      },
      {
        id: 2,
        tieu_de: 'Tham dự hội thảo quốc tế ISDS 2026 tại Yuan Ze University, Taiwan',
        slug: 'isds-2026',
        ngay_dang: '2026-11-14',
        nhan_lon: '14-11-2026',
        nhan_nho: 'ISDS 2026, Taiwan',
        tom_tat: 'Đoàn cán bộ nghiên cứu của Khoa đã có chuyến công tác tham gia trình bày báo cáo khoa học tại Hội thảo Quốc tế về Hệ thống Thông tin và Phát triển Dữ liệu (ISDS 2026) diễn ra tại trường Đại học Nguyên Bản (Yuan Ze University), Đài Loan.',
        anh_chinh: 'assets/news/news_isds.png'
      },
      {
        id: 3,
        tieu_de: 'Tham dự hội thảo quốc tế IUKM 2026 tại Quy Nhơn, Bình Định',
        slug: 'iukm-2026',
        ngay_dang: '2026-11-14',
        nhan_lon: '14-11-2026',
        nhan_nho: 'IUKM 2026, Quy Nhơn',
        tom_tat: 'Đại diện giảng viên bộ môn của Khoa tham gia đóng góp chuyên môn và giao lưu trao đổi học thuật tại Hội thảo Khoa học Quốc tế IUKM 2026 tổ chức tại trung tâm hội nghị quốc tế Quy Nhơn, Bình Định.',
        anh_chinh: 'assets/news/news_iukm.png'
      }
    ];
  }

  /**
   * Fetch live data in background, updates UI if found
   */
  async fetchDataInBackground() {
    const data = await NewsService.getNews();
    if (data && data.length > 0) {
      this.newsData = data;
      this.render();
      console.log('Cập nhật dữ liệu tin tức từ API thành công.');
    }
  }

  /**
   * Render HTML structure of the news section
   */
  render() {
    if (!this.newsData || this.newsData.length === 0) return;

    let cardsHtml = '';

    this.newsData.forEach(item => {
      const imgPath = `${this.assetPrefix}${item.anh_chinh}`;
      const detailUrl = `${this.assetPrefix}tin-tuc/?slug=${item.slug}`;

      cardsHtml += `
        <article class="news-card">
          <!-- News Image Wrapper with zooming transitions and floating date badge -->
          <div class="news-image-wrapper">
            <img class="news-image" src="${imgPath}" alt="${item.tieu_de}" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 350 200%22><rect width=%22350%22 height=%22200%22 fill=%22%23eef2f6%22/><text x=%2250%25%22 y=%2250%25%22 font-family=%22sans-serif%22 font-size=%2216%22 font-weight=%22bold%22 text-anchor=%22middle%22 fill=%22%2394a3b8%22>Tin Tức Khoa CNTT</text></svg>'">
            <div class="news-date-badge">${item.nhan_lon}</div>
          </div>
          
          <!-- News Card Body -->
          <div class="news-card-body">
            <!-- Location Badge -->
            <div class="news-meta-location">
              <svg viewBox="0 0 24 24" class="loc-icon" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <span>${item.nhan_nho}</span>
            </div>
            
            <!-- Title -->
            <h3 class="news-card-title" title="${item.tieu_de}">
              <a href="${detailUrl}">${item.tieu_de}</a>
            </h3>
            
            <!-- Summary -->
            <p class="news-card-summary">${item.tom_tat}</p>
            
            <!-- Read More Link with 3D animation -->
            <a href="${detailUrl}" class="news-card-link" title="Xem chi tiết: ${item.tieu_de}">
              <span>Đọc tiếp</span>
              <svg viewBox="0 0 24 24" class="arrow-icon" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </a>
          </div>
        </article>
      `;
    });

    this.innerHTML = `
      <section class="news-section">
        <div class="news-container">
          <h2 class="news-heading">Thông tin & Sự kiện</h2>
          <div class="news-grid">
            ${cardsHtml}
          </div>
        </div>
      </section>
    `;
  }
}

// Define the custom element
if (!customElements.get('news-events-component')) {
  customElements.define('news-events-component', NewsEventsComponent);
}
