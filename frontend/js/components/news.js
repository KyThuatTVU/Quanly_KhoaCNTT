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
   * Helper to render UN SDG Badges matching reference UI
   */
  renderSdgBadges(item) {
    const text = `${item.tieu_de || ''} ${item.nhan_nho || ''}`.toLowerCase();
    let sdgs = [];

    if (text.includes('học bổng') || text.includes('cựu sinh viên')) {
      sdgs = []; // Empty, as shown in reference card 2
    } else if (text.includes('lịch') || text.includes('cố vấn') || text.includes('học tập')) {
      sdgs = [4]; // SDG 4 for card 3
    } else if (text.includes('nckh') || text.includes('giải thưởng') || text.includes('công bố') || text.includes('tài năng')) {
      sdgs = [4, 9, 17]; // SDG 4, 9, 17 for card 4
    } else {
      sdgs = [4, 8, 17]; // SDG 4, 8, 17 for card 1
    }

    if (!sdgs || sdgs.length === 0) return '';

    return sdgs.map(num => {
      switch (num) {
        case 4:
          return `
            <div class="sdg-badge sdg-4" title="SDG 4: Giáo dục có chất lượng">
              <span class="sdg-num">4</span>
              <svg viewBox="0 0 24 24" class="sdg-svg" fill="currentColor">
                <path d="M12 4L3 8.5v7L12 20l9-4.5v-7L12 4zm0 2.2l6.5 3.3L12 12.8 5.5 9.5 12 6.2zm-7 4.1l6 3v5.4l-6-3v-5.4zm8 8.4v-5.4l6-3v5.4l-6 3z"/>
              </svg>
            </div>`;
        case 8:
          return `
            <div class="sdg-badge sdg-8" title="SDG 8: Tăng trưởng kinh tế & Việc làm bền vững">
              <span class="sdg-num">8</span>
              <svg viewBox="0 0 24 24" class="sdg-svg" fill="currentColor">
                <path d="M5 19h14v2H5v-2zm2-4h2v3H7v-3zm4-5h2v8h-2V10zm4-4h2v12h-2V6zm-8 4l4-4 4 4 4-4v2l-4 4-4-4-4 4V10z"/>
              </svg>
            </div>`;
        case 9:
          return `
            <div class="sdg-badge sdg-9" title="SDG 9: Công nghiệp, Sáng tạo & Phát triển hạ tầng">
              <span class="sdg-num">9</span>
              <svg viewBox="0 0 24 24" class="sdg-svg" fill="currentColor">
                <path d="M12 2l-8 4.5v9L12 20l8-4.5v-9L12 2zm0 2.2l6 3.4-6 3.4-6-3.4 6-3.4zm-7 4.7l6 3.4v6.8l-6-3.4V8.9zm8 10.2v-6.8l6-3.4v6.8l-6 3.4z"/>
              </svg>
            </div>`;
        case 17:
          return `
            <div class="sdg-badge sdg-17" title="SDG 17: Quan hệ đối tác vì các mục tiêu">
              <span class="sdg-num">17</span>
              <svg viewBox="0 0 24 24" class="sdg-svg" fill="currentColor">
                <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="2"/>
                <circle cx="6" cy="12" r="2.5" fill="none" stroke="currentColor" stroke-width="1.6"/>
                <circle cx="18" cy="12" r="2.5" fill="none" stroke="currentColor" stroke-width="1.6"/>
                <circle cx="12" cy="6" r="2.5" fill="none" stroke="currentColor" stroke-width="1.6"/>
                <circle cx="12" cy="18" r="2.5" fill="none" stroke="currentColor" stroke-width="1.6"/>
              </svg>
            </div>`;
        default:
          return '';
      }
    }).join('');
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

      const categoryText = (item.nhan_nho || 'THÔNG BÁO CHUNG').toUpperCase();

      cardsHtml += `
        <article class="news-card">
          <!-- News Image Wrapper: 100% full frame cover, rounded corners -->
          <div class="news-image-wrapper">
            <a href="${detailUrl}" class="news-img-link" title="${item.tieu_de}">
              <img class="news-image" src="${imgPath}" alt="${item.tieu_de}" loading="lazy" onerror="this.onerror=null; this.src='data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 350 220%22><rect width=%22350%22 height=%22220%22 fill=%22%23e2e8f0%22/><text x=%2250%25%22 y=%2250%25%22 font-family=%22sans-serif%22 font-size=%2216%22 font-weight=%22bold%22 text-anchor=%22middle%22 fill=%22%2364748b%22>Tin Tức Khoa CNTT</text></svg>'">
            </a>
          </div>
          
          <!-- News Card Body -->
          <div class="news-card-body">
            <!-- Category line with dash -->
            <div class="news-category">
              <span class="news-category-dash">—</span>
              <span class="news-category-name">${categoryText}</span>
            </div>
            
            <!-- Title -->
            <h3 class="news-card-title" title="${item.tieu_de}">
              <a href="${detailUrl}">${item.tieu_de}</a>
            </h3>
            
            <!-- Date -->
            <div class="news-date">
              <svg class="news-date-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <span>${formattedDate}</span>
            </div>

            <!-- UN SDG Badges -->
            <div class="news-sdg-container">
              ${this.renderSdgBadges(item)}
            </div>
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
