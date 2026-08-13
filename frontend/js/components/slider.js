/**
 * ==========================================================================
 * HERO SLIDER WEB COMPONENT
 * ==========================================================================
 * A reusable, native web component for the interactive hero sliding banner.
 * Renders slides from the database (via BannerService) with autoplay,
 * manual navigation, touch swipe controls and micro-animations.
 */

import { BannerService } from '../services/bannerService.js';

class HeroSliderComponent extends HTMLElement {
  constructor() {
    super();
    this.currentIndex = 0;
    this.slidesData = [];
    this.autoplayInterval = null;
    this.autoplayDelay = 5000;
    this.touchStartX = 0;
    this.touchEndX = 0;
    this.assetPrefix = './';
  }

  connectedCallback() {
    this.resolveAssetPrefix();
    try {
      console.log('Khởi chạy <hero-slider-component>...');
      this.init();
    } catch (e) {
      this.innerHTML = `
        <div style="background: #ffebee; border: 2px dashed #f44336; color: #c62828; padding: 24px; text-align: center; font-family: sans-serif; border-radius: 16px; margin: 40px auto; max-width: 1000px;">
          <h3 style="margin: 0 0 10px; font-weight: 800;">Lỗi khởi chạy Banner trượt</h3>
          <p style="margin: 0; font-size: 14px;">${e.stack || e.message}</p>
        </div>
      `;
      console.error('Lỗi khởi chạy Slider:', e);
    }
  }

  disconnectedCallback() {
    this.stopAutoplay();
  }

  resolveAssetPrefix() {
    // All subdirectory pages need '../' to reach the frontend root
    const subFolders = ['dai-hoc', 'gioi-thieu', 'nhan-su', 'nghien-cuu', 'sau-dai-hoc', 'trang-chu', 'tin-tuc'];
    const currentPath = window.location.pathname;
    this.assetPrefix = './';

    for (const folder of subFolders) {
      if (currentPath.includes('/' + folder + '/') || currentPath.includes('/' + folder)) {
        this.assetPrefix = '../';
        break;
      }
    }
    console.log('[Slider] assetPrefix:', this.assetPrefix, '| path:', currentPath);
  }

  async init() {
    await this.fetchData();
  }

  async fetchData() {
    const data = await BannerService.getBanners();
    this.slidesData = data || [];
    this.currentIndex = 0;
    this.render();
    this.initSlider();
    console.log('Tải dữ liệu hero slider thành công. Số slides:', this.slidesData.length);
  }

  /**
   * Render slides using data from Admin panel / database.
   * Each slide uses its own image as background from the uploaded file.
   */
  render() {
    const logoPath = `${this.assetPrefix}assets/images/logo.png`;
    const logoFallback = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='45' fill='%23fff' stroke='%230f6fff' stroke-width='5'/><text x='50%' y='55%' font-family='sans-serif' font-size='22' font-weight='bold' text-anchor='middle' fill='%230f6fff'>TVU</text></svg>";

    // Fallback slide khi không có dữ liệu từ DB
    if (!this.slidesData || this.slidesData.length === 0) {
      this.innerHTML = this._buildShell(`
        <div class="slide ug-slide active" data-index="0">
          <div class="slide-bg" style="background: linear-gradient(135deg, #0d2a6e 0%, #1565c0 60%, #0a3d8f 100%);"></div>
        </div>
      `, '<span class="slider-dot active" data-index="0"></span>');
      return;
    }

    let slidesHtml = '';
    let dotsHtml = '';

    this.slidesData.forEach((slide, idx) => {
      const activeClass = idx === 0 ? 'active' : '';

      // Build background style - use uploaded image if available
      let bgStyle;
      if (slide.bgImage) {
        // If it's already an absolute URL, use as-is; otherwise prepend assetPrefix
        const imgSrc = (slide.bgImage.startsWith('http') || slide.bgImage.startsWith('data:'))
          ? slide.bgImage
          : `${this.assetPrefix}${slide.bgImage}`;
        bgStyle = `background-image: url('${imgSrc}'); background-size: cover; background-position: center; background-repeat: no-repeat;`;
      } else {
        bgStyle = 'background: linear-gradient(135deg, #0d2a6e 0%, #1565c0 60%, #0a3d8f 100%);';
      }

      // If actionUrl is provided and not just '#', make the whole slide clickable
      const linkWrapStart = (slide.actionUrl && slide.actionUrl !== '#') 
          ? `<a href="${slide.actionUrl}" style="display: block; width: 100%; height: 100%; text-decoration: none;">` 
          : '';
      const linkWrapEnd = (slide.actionUrl && slide.actionUrl !== '#') ? `</a>` : '';

      slidesHtml += `
        <div class="slide ug-slide ${activeClass}" data-index="${idx}">
          ${linkWrapStart}
          <div class="slide-bg" style="${bgStyle}"></div>
          ${linkWrapEnd}
        </div>
      `;

      dotsHtml += `<span class="slider-dot ${idx === 0 ? 'active' : ''}" data-index="${idx}"></span>`;
    });

    this.innerHTML = this._buildShell(slidesHtml, dotsHtml);
  }

  /**
   * Build the outer slider HTML shell with slides and nav controls.
   */
  _buildShell(slidesHtml, dotsHtml) {
    return `
      <section class="hero-slider" id="heroSlider">
        <div class="slider-wrapper" id="sliderWrapper">
          ${slidesHtml}
        </div>
        <button class="slider-arrow prev" id="sliderPrev" aria-label="Slide trước">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
        <button class="slider-arrow next" id="sliderNext" aria-label="Slide sau">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
        <div class="slider-dots" id="sliderDots">
          ${dotsHtml}
        </div>
      </section>
    `;
  }

  initSlider() {
    this.slides = this.querySelectorAll('.slide');
    this.dots = this.querySelectorAll('.slider-dot');
    const prevBtn = this.querySelector('#sliderPrev');
    const nextBtn = this.querySelector('#sliderNext');
    const sliderElem = this.querySelector('#heroSlider');

    if (!this.slides || this.slides.length === 0) return;

    if (prevBtn) prevBtn.addEventListener('click', () => this.prevSlide());
    if (nextBtn) nextBtn.addEventListener('click', () => this.nextSlide());

    this.dots.forEach(dot => {
      dot.addEventListener('click', (e) => {
        const index = parseInt(e.target.getAttribute('data-index'));
        this.showSlide(index);
      });
    });

    if (sliderElem) {
      sliderElem.addEventListener('mouseenter', () => this.stopAutoplay());
      sliderElem.addEventListener('mouseleave', () => this.startAutoplay());

      sliderElem.addEventListener('touchstart', (e) => {
        this.touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      sliderElem.addEventListener('touchend', (e) => {
        this.touchEndX = e.changedTouches[0].screenX;
        this.handleSwipe();
      }, { passive: true });
    }

    this.startAutoplay();
  }

  showSlide(index) {
    if (index >= this.slides.length) {
      this.currentIndex = 0;
    } else if (index < 0) {
      this.currentIndex = this.slides.length - 1;
    } else {
      this.currentIndex = index;
    }

    this.slides.forEach((slide, idx) => {
      slide.classList.toggle('active', idx === this.currentIndex);
    });

    this.dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === this.currentIndex);
    });
  }

  nextSlide() { this.showSlide(this.currentIndex + 1); }
  prevSlide() { this.showSlide(this.currentIndex - 1); }

  handleSwipe() {
    const swipeThreshold = 50;
    const diff = this.touchStartX - this.touchEndX;
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) this.nextSlide();
      else this.prevSlide();
    }
  }

  startAutoplay() {
    this.stopAutoplay();
    this.autoplayInterval = setInterval(() => this.nextSlide(), this.autoplayDelay);
  }

  stopAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    }
  }
}

if (!customElements.get('hero-slider-component')) {
  customElements.define('hero-slider-component', HeroSliderComponent);
}
