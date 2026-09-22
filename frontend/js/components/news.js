/**
 * ==========================================================================
 * NEWS & EVENTS WEB COMPONENT
 * ==========================================================================
 * A reusable, native web component for displaying the news and events carousel.
 * Connects to /api/news API, matching MySQL tables 'tin_tuc' and 'hinh_anh_tin_tuc'.
 */

import { NewsService } from '../services/newsService.js';

class NewsEventsComponent extends HTMLElement {
  constructor() {
    super();
    this.newsData = [];
    this.assetPrefix = './';
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
    const data = await NewsService.getNews();
    this.newsData = data || [];
    this.render();
    console.log('Tải dữ liệu tin tức thành công.');
  }

  /**
   * Render HTML structure of the news section
   */
  render() {
    if (!this.newsData || this.newsData.length === 0) return;

    let cardsHtml = '';

    this.newsData.forEach(item => {
      const imgPath = `${this.assetPrefix}${item.anh_chinh}`;
      let detailUrl = `${this.assetPrefix}news/?slug=${item.slug}`;
      if (item.redirect_url && item.redirect_url.trim()) {
        const url = item.redirect_url.trim();
        if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//')) {
          detailUrl = url;
        } else if (url.startsWith('./') || url.startsWith('../') || url.startsWith('/')) {
          detailUrl = `${this.assetPrefix}${url.replace(/^\//, '')}`;
        } else if (url.includes('.') && (!url.includes('/') || url.indexOf('.') < url.indexOf('/'))) {
          detailUrl = `https://${url}`;
        } else {
          detailUrl = `${this.assetPrefix}${url}`;
        }
      }

      let formattedDate = item.nhan_lon || '';
      if (item.ngay_dang) {
        try {
          const d = new Date(item.ngay_dang);
          if (!isNaN(d.getTime())) {
            const day = String(d.getDate()).padStart(2, '0');
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const year = d.getFullYear();
            formattedDate = `${day}/${month}/${year}`;
          }
        } catch (_) {}
      }

      const categoryText = (item.nhan_nho || 'TIN TỨC').toUpperCase();

      cardsHtml += `
        <article class="news-card">
          <!-- News Image Wrapper: Full image display (contain) without cropping poster details -->
          <div class="news-image-wrapper">
            <a href="${detailUrl}" class="news-img-link" title="${item.tieu_de}">
              <img class="news-image" src="${imgPath}" alt="${item.tieu_de}" loading="lazy" onerror="this.onerror=null; this.src='data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 350 200%22><rect width=%22350%22 height=%22200%22 fill=%22%23f1f5f9%22/><text x=%2250%25%22 y=%2250%25%22 font-family=%22sans-serif%22 font-size=%2216%22 font-weight=%22bold%22 text-anchor=%22middle%22 fill=%22%2394a3b8%22>Tin Tức Khoa CNTT</text></svg>'">
            </a>
            ${formattedDate ? `<div class="news-date-badge">${formattedDate}</div>` : ''}
          </div>
          
          <!-- News Card Body -->
          <div class="news-card-body">
            <!-- Category / Tag -->
            <div class="news-category">
              <span class="news-category-dash">—</span>
              <span class="news-category-name">${categoryText}</span>
            </div>
            
            <!-- Title -->
            <h3 class="news-card-title" title="${item.tieu_de}">
              <a href="${detailUrl}">${item.tieu_de}</a>
            </h3>
            
            <!-- Summary -->
            ${item.tom_tat ? `<p class="news-card-summary">${item.tom_tat}</p>` : ''}

            <!-- Read More Link -->
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
      <section class="news-section" id="news">
        <div class="news-container">
          <h2 class="news-heading" data-i18n="news.heading">TIN TỨC & SỰ KIỆN</h2>
          
          <div class="news-carousel-wrapper">
            <button type="button" class="news-nav-btn prev-btn" id="newsPrevBtn" aria-label="Tin trước" title="Tin trước">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>

            <div class="news-track" id="newsTrack">
              ${cardsHtml}
            </div>

            <button type="button" class="news-nav-btn next-btn" id="newsNextBtn" aria-label="Tin tiếp theo" title="Tin tiếp theo">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        </div>
      </section>
    `;

    this.initCarousel();
  }

  /**
   * Initialize carousel arrow controls and drag/touch scroll
   */
  initCarousel() {
    const track = this.querySelector('#newsTrack');
    const prevBtn = this.querySelector('#newsPrevBtn');
    const nextBtn = this.querySelector('#newsNextBtn');
    if (!track || !prevBtn || !nextBtn) return;

    const getScrollStep = () => {
      const card = track.querySelector('.news-card');
      return card ? (card.offsetWidth + 24) : 320;
    };

    prevBtn.addEventListener('click', () => {
      track.scrollBy({ left: -getScrollStep(), behavior: 'smooth' });
    });

    nextBtn.addEventListener('click', () => {
      track.scrollBy({ left: getScrollStep(), behavior: 'smooth' });
    });

    const updateNavButtons = () => {
      const maxScroll = track.scrollWidth - track.clientWidth;
      if (maxScroll <= 5) {
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'none';
        return;
      } else {
        prevBtn.style.display = 'flex';
        nextBtn.style.display = 'flex';
      }
      prevBtn.style.opacity = track.scrollLeft <= 10 ? '0.35' : '1';
      prevBtn.style.pointerEvents = track.scrollLeft <= 10 ? 'none' : 'auto';
      nextBtn.style.opacity = track.scrollLeft >= maxScroll - 10 ? '0.35' : '1';
      nextBtn.style.pointerEvents = track.scrollLeft >= maxScroll - 10 ? 'none' : 'auto';
    };

    track.addEventListener('scroll', updateNavButtons, { passive: true });
    window.addEventListener('resize', updateNavButtons, { passive: true });
    setTimeout(updateNavButtons, 250);
  }
}

// Define the custom element
if (!customElements.get('news-events-component')) {
  customElements.define('news-events-component', NewsEventsComponent);
}
