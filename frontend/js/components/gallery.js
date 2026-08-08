/**
 * ==========================================================================
 * ACTIVITY GALLERY WEB COMPONENT
 * ==========================================================================
 * A reusable, native web component for displaying activity photos.
 * Connects to /api/gallery/hoat-dong, matching table 'gallery_hoat_dong_trang_chu'.
 * Includes fullscreen Lightbox Carousel modal with arrow navigation & Escape keys.
 */

import { GalleryService } from '../services/galleryService.js';

class ActivityGalleryComponent extends HTMLElement {
  constructor() {
    super();
    this.photoData = [];
    this.currentIdx = 0;
    this.assetPrefix = './'; // Renamed to avoid DOM conflict with Element.prefix
  }

  connectedCallback() {
    this.resolveAssetPrefix();
    try {
      console.log('Khởi chạy <activity-gallery-component>...');
      this.init();
    } catch (e) {
      this.innerHTML = `
        <div style="background: #ffebee; border: 2px dashed #f44336; color: #c62828; padding: 24px; text-align: center; font-family: sans-serif; border-radius: 16px; margin: 40px auto; max-width: 1000px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          <h3 style="margin: 0 0 10px; font-weight: 800; text-transform: uppercase;">Lỗi khởi chạy Thư viện ảnh hoạt động</h3>
          <p style="margin: 0; font-size: 14px; font-weight: 600;">${e.stack || e.message}</p>
        </div>
      `;
      console.error('Lỗi khởi chạy Gallery Component:', e);
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
    // 1. Instantly paint mock data (15 elements grid)
    this.loadMockData();
    this.render();

    // 2. Fetch live data in the background (non-blocking)
    await this.fetchDataInBackground();
  }

  /**
   * Populate mock data corresponding to 'gallery_hoat_dong_trang_chu' table
   */
  loadMockData() {
    this.photoData = [];
    const titles = [
      'Lễ bảo vệ Đồ án tốt nghiệp đại học',
      'Đồng nghiệp gặp gỡ thảo luận sinh hoạt khoa',
      'Ngày Seminar trao đổi học thuật chuyên đề',
      'Trải nghiệm gian hàng tuyển sinh & tư vấn công nghệ',
      'Khen thưởng đội tuyển thi lập trình ICPC đạt giải cao',
      'Lễ khai mạc Olympic Trí tuệ nhân tạo Việt Nam miền Nam',
      'Họp mặt hội đồng phản biện luận văn sau đại học',
      'Ký kết biên bản ghi nhớ hợp tác doanh nghiệp (MOU)',
      'Học sinh THPT tham quan phòng thí nghiệm khoa',
      'Sinh viên báo cáo nghiên cứu và bảo vệ luận án Tiến sĩ',
      'Lễ bảo vệ luận văn Thạc sĩ ngành Khoa học máy tính',
      'Triển lãm robot và sản phẩm Trí tuệ nhân tạo',
      'Sinh hoạt tập thể chào đón Tân sinh viên khóa mới',
      'Khuôn viên tòa nhà công nghệ thông tin truyền thông',
      'Hội đồng đánh giá nghiệm thu đề tài NCKH cấp cơ sở'
    ];

    for (let i = 1; i <= 15; i++) {
      this.photoData.push({
        id: i,
        tieu_de_anh: titles[i - 1] || 'Ảnh hoạt động Khoa Khoa học máy tính',
        hinh_anh_url: `assets/gallery/gallery_${i}.png`,
        thu_tu: i
      });
    }
  }

  /**
   * Fetch live data in background, updates UI if found
   */
  async fetchDataInBackground() {
    const data = await GalleryService.getActivityPhotos();
    if (data && data.length > 0) {
      this.photoData = data;
      this.render();
      console.log('Cập nhật dữ liệu ảnh hoạt động từ API thành công.');
    }
  }

  /**
   * Render HTML structure of the grid and lightbox
   */
  render() {
    if (!this.photoData || this.photoData.length === 0) return;

    let gridHtml = '';

    // Themed vector SVGs for fallbacks
    const svgPlaceholders = [
      // 0: Seminar/Meeting
      `<div class="gallery-svg-placeholder theme-1"><svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="15" y="15" width="70" height="42" rx="4" fill="rgba(15,111,255,0.03)"/><path d="M15 42 h70 M30 75 h40 M50 57 v18"/><circle cx="50" cy="30" r="6"/><path d="M42 30 h16"/></svg></div>`,
      // 1: Coding Lab
      `<div class="gallery-svg-placeholder theme-2"><svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="18" y="20" width="64" height="45" rx="3" fill="rgba(0,180,216,0.03)"/><path d="M12 65 h76 v5 a2 2 0 0 1 -2 2 H14 a2 2 0 0 1 -2 -2 z"/><path d="M35 32 l8 6 l-8 6 M48 44 h14"/></svg></div>`,
      // 2: Robotics
      `<div class="gallery-svg-placeholder theme-3"><svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="50" cy="50" r="40" stroke-dasharray="2 2"/><rect x="36" y="32" width="28" height="26" rx="6" fill="rgba(247,127,0,0.03)"/><circle cx="43" cy="40" r="2.5" fill="currentColor"/><circle cx="57" cy="40" r="2.5" fill="currentColor"/><path d="M44 48 h12 M50 58 v10 M38 68 h24"/></svg></div>`,
      // 3: Graduation
      `<div class="gallery-svg-placeholder theme-4"><svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M50 20 l32 10 l-32 10 l-32 -10 z M18 30 v18 c0 12 14 20 32 20 s32 -8 32 -20 v-18"/><path d="M82 30 v25 M82 55 l-4 8 l-4 -8 z" fill="currentColor"/></svg></div>`,
      // 4: Research Panel
      `<div class="gallery-svg-placeholder theme-5"><svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M25 20 h50 v50 h-50 z"/><circle cx="50" cy="40" r="10"/><path d="M34 60 c0-10 10-15 16-15 s16 5 16 15"/><path d="M20 70 h60 v6 H20 z" fill="rgba(16,185,129,0.05)"/></svg></div>`
    ];

    this.photoData.forEach((item, idx) => {
      const imgPath = `${this.assetPrefix}${item.hinh_anh_url}`;
      
      gridHtml += `
        <div class="gallery-card" data-index="${idx}">
          <div class="gallery-img-container">
            <img class="gallery-photo" src="${imgPath}" alt="${item.tieu_de_anh}" data-index="${idx}">
          </div>
          <!-- Title overlay shown on hover -->
          <div class="gallery-overlay">
            <span class="gallery-card-title">${item.tieu_de_anh}</span>
          </div>
        </div>
      `;
    });

    this.innerHTML = `
      <section class="gallery-section">
        <div class="gallery-container">
          <h2 class="gallery-heading">Ảnh Hoạt Động</h2>
          <div class="gallery-grid">
            ${gridHtml}
          </div>
        </div>
      </section>

      <!-- Lightbox Carousel Overlay -->
      <div id="galleryLightbox" class="gallery-lightbox">
        <span class="gallery-lightbox-close">&times;</span>
        <button class="gallery-lightbox-btn prev">&#10094;</button>
        <button class="gallery-lightbox-btn next">&#10095;</button>
        <div class="gallery-lightbox-content">
          <img id="galleryLightboxImg" src="" alt="">
          <div id="galleryLightboxCaption" class="gallery-lightbox-caption"></div>
        </div>
      </div>
    `;

    // 1. Attach Event listeners for images loading error fallbacks
    this.initImageFallbacks(svgPlaceholders);

    // 2. Attach Event listeners for Lightbox operations
    this.initLightbox();
  }

  /**
   * Attaches error event listeners to image tags dynamically.
   * Replaces failed images with theme vectors.
   */
  initImageFallbacks(svgPlaceholders) {
    const images = this.querySelectorAll('.gallery-photo');
    images.forEach(img => {
      const replaceWithSVG = () => {
        const idx = parseInt(img.getAttribute('data-index'));
        const placeholderHtml = svgPlaceholders[idx % svgPlaceholders.length];
        
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

  /**
   * Handles Lightbox modal preview gestures and key listeners
   */
  initLightbox() {
    const lightbox = this.querySelector('#galleryLightbox');
    const lightboxImg = this.querySelector('#galleryLightboxImg');
    const lightboxCaption = this.querySelector('#galleryLightboxCaption');
    const closeBtn = this.querySelector('.gallery-lightbox-close');
    const prevBtn = this.querySelector('.gallery-lightbox-btn.prev');
    const nextBtn = this.querySelector('.gallery-lightbox-btn.next');
    const cards = this.querySelectorAll('.gallery-card');

    if (!lightbox || !lightboxImg || !lightboxCaption) return;

    // Helper to paint the lightbox content at current index
    const showPhoto = (idx) => {
      if (idx < 0) idx = this.photoData.length - 1;
      if (idx >= this.photoData.length) idx = 0;
      this.currentIdx = idx;

      const item = this.photoData[idx];
      const imgPath = `${this.assetPrefix}${item.hinh_anh_url}`;

      // Check if original img has been replaced by SVG vector fallback
      const originalCardImg = cards[idx].querySelector('.gallery-photo');
      const originalFallbackSvg = cards[idx].querySelector('.gallery-svg-placeholder');

      if (originalFallbackSvg) {
        // If it was replaced by SVG, inject that SVG cloned into lightbox instead of src image
        lightboxImg.style.display = 'none';
        
        // Remove any previous custom SVG clone inside content box
        const existingSvg = lightbox.querySelector('.gallery-lightbox-content svg');
        if (existingSvg) existingSvg.remove();
        const existingWrapper = lightbox.querySelector('.gallery-lightbox-content .gallery-svg-placeholder');
        if (existingWrapper) existingWrapper.remove();

        const svgClone = originalFallbackSvg.cloneNode(true);
        svgClone.style.width = '320px';
        svgClone.style.height = '320px';
        svgClone.style.margin = '40px auto';
        lightboxImg.parentNode.insertBefore(svgClone, lightboxImg);
      } else {
        // If image loaded successfully, show normal image
        lightboxImg.style.display = 'block';
        const existingWrapper = lightbox.querySelector('.gallery-lightbox-content .gallery-svg-placeholder');
        if (existingWrapper) existingWrapper.remove();

        lightboxImg.src = imgPath;
      }

      lightboxCaption.textContent = item.tieu_de_anh;
    };

    // Click triggers
    cards.forEach((card, idx) => {
      card.addEventListener('click', () => {
        showPhoto(idx);
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Stop background scrolling
      });
    });

    // Close actions
    const closeLightbox = () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = ''; // Resume background scrolling
    };
    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    // Navigation triggers
    const showNext = () => showPhoto(this.currentIdx + 1);
    const showPrev = () => showPhoto(this.currentIdx - 1);

    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      showNext();
    });
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      showPrev();
    });

    // Keyboard bindings (scoped globally while active)
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showNext();
      if (e.key === 'ArrowLeft') showPrev();
    });
  }
}

// Define custom element
if (!customElements.get('activity-gallery-component')) {
  customElements.define('activity-gallery-component', ActivityGalleryComponent);
}
