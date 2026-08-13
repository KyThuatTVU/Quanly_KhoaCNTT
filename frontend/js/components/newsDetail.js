/**
 * ==========================================================================
 * NEWS DETAIL WEB COMPONENT
 * ==========================================================================
 * Displays detailed news article based on slug parameter
 */

import { NewsService } from '../services/newsService.js';

class NewsDetailComponent extends HTMLElement {
  constructor() {
    super();
    this.newsItem = null;
    this.slug = null;
  }

  connectedCallback() {
    this.slug = this.getSlugFromUrl();
    this.init();
  }

  /**
   * Extract slug from URL query parameter
   */
  getSlugFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('slug');
  }

  /**
   * Initialize component
   */
  async init() {
    if (!this.slug) {
      this.renderError('Không tìm thấy tin tức');
      return;
    }

    this.renderLoading();
    await this.fetchNewsDetail();
  }

  /**
   * Fetch news detail from API
   */
  async fetchNewsDetail() {
    try {
      // Try to fetch from API
      const allNews = await NewsService.getNews();
      this.newsItem = allNews ? allNews.find(item => item.slug === this.slug) : null;

      if (this.newsItem) {
        this.render();
        // Update page title
        document.title = `${this.newsItem.tieu_de} - Khoa CNTT`;
      } else {
        this.renderError('Không tìm thấy tin tức này');
      }
    } catch (error) {
      console.error('Lỗi khi tải tin tức:', error);
      this.renderError('Không thể tải tin tức');
    }

  /**
   * Render loading state
   */
  renderLoading() {
    this.innerHTML = `
      <div class="news-detail-loading">
        <p>Đang tải tin tức...</p>
      </div>
    `;
  }

  /**
   * Render error state
   */
  renderError(message) {
    this.innerHTML = `
      <div class="news-detail-error">
        <h2>⚠️ ${message}</h2>
        <p>Xin lỗi, tin tức bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
        <a href="../trang-chu/" class="news-detail-back-button" style="display: inline-block; margin-top: 20px;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          <span>Quay lại trang chủ</span>
        </a>
      </div>
    `;
  }

  /**
   * Render news detail
   */
  render() {
    const item = this.newsItem;
    const imgPath = item.anh_chinh.startsWith('http') ? item.anh_chinh : item.anh_chinh;
    
    this.innerHTML = `
      <article class="news-detail-container">
        <!-- Header -->
        <header class="news-detail-header">
          <!-- Breadcrumb -->
          <nav class="news-detail-breadcrumb">
            <a href="../trang-chu/">Trang chủ</a>
            <span>/</span>
            <a href="../trang-chu/#tin-tuc">Tin tức & Sự kiện</a>
            <span>/</span>
            <span>${item.tieu_de}</span>
          </nav>
          
          <!-- Title -->
          <h1 class="news-detail-title">${item.tieu_de}</h1>
          
          <!-- Meta -->
          <div class="news-detail-meta">
            <div class="news-detail-meta-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <span>${this.formatDate(item.ngay_dang)}</span>
            </div>
            <div class="news-detail-meta-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <span>${item.nhan_nho}</span>
            </div>
          </div>
        </header>
        
        <!-- Featured Image -->
        <div class="news-detail-image-wrapper">
          <img src="${imgPath}" alt="${item.tieu_de}" class="news-detail-image" 
               onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 800 400%22><rect width=%22800%22 height=%22400%22 fill=%22%23eef2f6%22/><text x=%2250%25%22 y=%2250%25%22 font-family=%22sans-serif%22 font-size=%2224%22 font-weight=%22bold%22 text-anchor=%22middle%22 fill=%22%2394a3b8%22>Khoa Công nghệ Thông tin</text></svg>'">
        </div>
        
        <!-- Content -->
        <div class="news-detail-content">
          <p><strong>${item.tom_tat}</strong></p>
          ${item.noi_dung || '<p>Nội dung đang được cập nhật...</p>'}
        </div>
        
        <!-- Back Button -->
        <div class="news-detail-back">
          <a href="../trang-chu/#tin-tuc" class="news-detail-back-button">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            <span>Quay lại danh sách tin tức</span>
          </a>
        </div>
      </article>
    `;
  }

  /**
   * Format date to Vietnamese format
   */
  formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
}

// Define the custom element
if (!customElements.get('news-detail-component')) {
  customElements.define('news-detail-component', NewsDetailComponent);
}
