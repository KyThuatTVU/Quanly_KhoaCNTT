/**
 * ==========================================================================
 * HERO SLIDER WEB COMPONENT
 * ==========================================================================
 * A reusable, native web component for the interactive 3D hero sliding banner.
 * Supports dynamic data connection with a mock fallback.
 * Includes autoplay, manual navigation, touch swipe controls, and micro-animations.
 */

import { BannerService } from '../services/bannerService.js';

class HeroSliderComponent extends HTMLElement {
  constructor() {
    super();
    this.currentIndex = 0;
    this.slidesData = [];
    this.autoplayInterval = null;
    this.autoplayDelay = 5000; // 5 seconds
    this.touchStartX = 0;
    this.touchEndX = 0;
    this.assetPrefix = './'; // Renamed from prefix to avoid conflict with Element.prefix getter
  }

  connectedCallback() {
    this.resolveAssetPrefix();
    try {
      console.log('Khởi chạy <hero-slider-component>...');
      this.init();
    } catch (e) {
      this.innerHTML = `
        <div style="background: #ffebee; border: 2px dashed #f44336; color: #c62828; padding: 24px; text-align: center; font-family: sans-serif; border-radius: 16px; margin: 40px auto; max-width: 1000px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          <h3 style="margin: 0 0 10px; font-weight: 800; text-transform: uppercase;">Lỗi khởi chạy Banner trượt</h3>
          <p style="margin: 0; font-size: 14px; font-weight: 600;">${e.stack || e.message}</p>
        </div>
      `;
      console.error('Lỗi khởi chạy Slider:', e);
    }
  }

  disconnectedCallback() {
    this.stopAutoplay();
  }

  /**
   * Dynamically resolve relative prefix path based on the current page's location
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
   * Initialize slider flow: loads mock data first, then fetches in background.
   */
  async init() {
    // 1. Instantly load mockup data for immediate paint
    this.loadMockData();
    this.render();
    this.initSlider();

    // 2. Load API data in background (non-blocking)
    this.fetchDataInBackground();
  }

  /**
   * Populate mockup database for instant presentation
   */
  loadMockData() {
    this.slidesData = [
      {
        id: 1,
        type: 'welcome',
        titleVn: 'Khoa Công nghệ Thông tin',
        titleEn: 'TRƯỜNG ĐẠI HỌC TRÀ VINH',
        description: 'Nơi khởi đầu của những kỹ sư và nhà khoa học công nghệ xuất sắc, đáp ứng thời đại công nghệ số.',
        bgImage: 'assets/banners/slide_fit.png',
        actionText: 'Khám phá ngay',
        actionUrl: '#programs-section',
        extra: {
          stats: [
            { value: '2000+', label: 'Sinh viên' },
            { value: '50+', label: 'Giảng viên' },
            { value: 'AUN-QA', label: 'Kiểm định' }
          ]
        }
      },
      {
        id: 2,
        type: 'admissions',
        titleVn: 'Kỹ sư Trí tuệ Nhân tạo',
        titleEn: 'ĐÀO TẠO MŨI NHỌN CÔNG NGHỆ',
        description: 'Làm chủ các mô hình học máy nâng cao, xử lý ngôn ngữ tự nhiên và phát triển robot thông minh.',
        bgImage: 'assets/banners/slide_ai.png',
        actionText: 'Đăng ký xét tuyển',
        actionUrl: '../dai-hoc/',
        extra: {
          stats: [
            { value: '100%', label: 'Học bổng doanh nghiệp' },
            { value: 'AI Lab', label: 'Cấu hình cao' },
            { value: 'Lương cao', label: 'Cơ hội rộng mở' }
          ]
        }
      },
      {
        id: 3,
        type: 'campaign',
        titleVn: 'Có những ước mơ',
        titleEn: 'được dựng xây',
        description: 'nhờ sự chung sức của cả cộng đồng.',
        bgImage: 'assets/banners/slide_campaign.png',
        extra: {
          badge: 'CHƯƠNG TRÌNH',
          mainTitle: 'VẬN ĐỘNG XÂY DỰNG',
          subTitle: 'Trung tâm SINH HOẠT SINH VIÊN',
          taglineTitle: '15 NĂM',
          taglineText: 'Kiến tạo tri thức - Tiếp bước tiên phong',
          bankHeader: 'Thông tin tiếp nhận tài trợ',
          bankAccount: 'Trường Đại học Trà Vinh',
          bankNumber: '1800 20121 3545',
          bankAgency: 'Ngân hàng Nông nghiệp & PTNT (Agribank)',
          thumbnails: [
            'assets/banners/thumb_bld1.png',
            'assets/banners/thumb_bld2.png',
            'assets/banners/thumb_bld3.png'
          ]
        }
      }
    ];
  }

  /**
   * Fetch data asynchronously in the background. If it fails, falls back silently.
   */
  async fetchDataInBackground() {
    const data = await BannerService.getBanners();
    if (data && data.length > 0) {
      this.slidesData = data;
      this.currentIndex = 0; // Reset active slide index
      this.render();
      this.initSlider();
      console.log('Cập nhật dữ liệu hero slider từ API thành công.');
    }
  }

  /**
   * Render the slider structure dynamically
   */
  render() {
    if (!this.slidesData || this.slidesData.length === 0) return;

    let slidesHtml = '';
    let dotsHtml = '';

    this.slidesData.forEach((slide, idx) => {
      const activeClass = idx === 0 ? 'active' : '';
      const bgImgPath = `${this.assetPrefix}${slide.bgImage}`;

      if (slide.type === 'campaign') {
        // Fundraiser Layout matching the Can Tho University design reference
        const bank = slide.extra;
        const thumb1 = `${this.assetPrefix}${bank.thumbnails[0]}`;
        const thumb2 = `${this.assetPrefix}${bank.thumbnails[1]}`;
        const thumb3 = `${this.assetPrefix}${bank.thumbnails[2]}`;
        const logoPath = `${this.assetPrefix}assets/images/logo.png`;

        slidesHtml += `
          <div class="slide campaign-slide ${activeClass}" data-index="${idx}">
            <div class="slide-bg" style="background-image: url('${bgImgPath}');"></div>
            <div class="slide-container">
              
              <!-- Left section: glow pill and building renders -->
              <div class="slide-left">
                <div class="glow-box">
                  <span class="airplane ap-top">
                    <svg viewBox="0 0 24 24" width="36" height="36" fill="currentColor">
                      <path d="M2 21l21-9L2 3v7l15 2-15 2z"/>
                    </svg>
                  </span>
                  <span class="airplane ap-bottom">
                    <svg viewBox="0 0 24 24" width="44" height="44" fill="currentColor">
                      <path d="M2 21l21-9L2 3v7l15 2-15 2z"/>
                    </svg>
                  </span>
                  
                  <h2 class="glow-title">${slide.titleVn}</h2>
                  <h3 class="glow-subtitle">${slide.titleEn}</h3>
                  <p class="glow-text">${slide.description}</p>
                </div>
                
                <div class="render-thumbs">
                  <div class="thumb" title="Phối cảnh chính diện"><img src="${thumb1}" alt="Render 1"></div>
                  <div class="thumb" title="Phối cảnh góc nghiêng"><img src="${thumb2}" alt="Render 2"></div>
                  <div class="thumb" title="Phối cảnh sân vườn"><img src="${thumb3}" alt="Render 3"></div>
                </div>
              </div>

              <!-- Right section: program names & Bank Detail Card & QR -->
              <div class="slide-right">
                <div class="banner-logos">
                  <img src="${logoPath}" alt="TVU Logo" class="uni-logo" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><circle cx=%2250%22 cy=%2250%22 r=%2245%22 fill=%22%23ffffff%22 stroke=%22%230f6fff%22 stroke-width=%225%22/><text x=%2250%25%22 y=%2255%25%22 font-family=%22sans-serif%22 font-size=%2222%22 font-weight=%22bold%22 text-anchor=%22middle%22 fill=%22%230f6fff%22>TVU</text></svg>'">
                  <div class="campaign-tagline">
                    <strong>${bank.taglineTitle}</strong>
                    <span>${bank.taglineText}</span>
                  </div>
                </div>

                <div class="campaign-badge">${bank.badge}</div>
                <h2 class="campaign-main-title">${bank.mainTitle}</h2>
                <h3 class="campaign-sub-title">
                  Trung tâm <span class="highlight">${bank.subTitle.replace('Trung tâm ', '')}</span>
                </h3>

                <div class="bank-card-wrapper">
                  <!-- bank accounts details -->
                  <div class="bank-card">
                    <div class="bank-card-header">${bank.bankHeader}</div>
                    <div class="bank-detail-item">
                      <span class="label">Tên tài khoản:</span>
                      <span class="value">${bank.bankAccount}</span>
                    </div>
                    <div class="bank-detail-item highlight-item">
                      <span class="label">Số tài khoản:</span>
                      <span class="value">${bank.bankNumber}</span>
                    </div>
                    <div class="bank-detail-item">
                      <span class="label">Tại:</span>
                      <span class="value">${bank.bankAgency}</span>
                    </div>
                  </div>

                  <!-- payment QR code -->
                  <div class="qr-container" title="Quét mã chuyển khoản tài trợ">
                    <svg viewBox="0 0 100 100" class="qr-code-svg">
                      <rect width="100" height="100" fill="white" rx="8"/>
                      <rect x="8" y="8" width="22" height="22" fill="#081a36" rx="2"/>
                      <rect x="12" y="12" width="14" height="14" fill="white" rx="1"/>
                      <rect x="15" y="15" width="8" height="8" fill="#081a36" rx="1"/>
                      
                      <rect x="70" y="8" width="22" height="22" fill="#081a36" rx="2"/>
                      <rect x="74" y="12" width="14" height="14" fill="white" rx="1"/>
                      <rect x="77" y="15" width="8" height="8" fill="#081a36" rx="1"/>
                      
                      <rect x="8" y="70" width="22" height="22" fill="#081a36" rx="2"/>
                      <rect x="12" y="74" width="14" height="14" fill="white" rx="1"/>
                      <rect x="15" y="77" width="8" height="8" fill="#081a36" rx="1"/>
                      
                      <rect x="74" y="74" width="10" height="10" fill="#081a36" rx="1"/>
                      <rect x="77" y="77" width="4" height="4" fill="white" rx="0.5"/>
                      <rect x="78" y="78" width="2" height="2" fill="#081a36"/>
                      
                      <path d="M 38 8 h 4 v 4 h -4 z M 46 8 h 4 v 4 h -4 z M 54 8 h 4 v 4 h -4 z M 62 8 h 4 v 4 h -4 z
                               M 38 16 h 4 v 4 h -4 z M 46 16 h 8 v 4 h -8 z M 62 16 h 4 v 4 h -4 z
                               M 38 24 h 12 v 4 h -12 z M 58 24 h 8 v 4 h -8 z
                               M 8 38 h 4 v 12 h -4 z M 16 38 h 8 v 4 h -8 z M 30 38 h 4 v 4 h -4 z M 38 38 h 4 v 4 h -4 z M 46 38 h 4 v 8 h -4 z M 58 38 h 8 v 4 h -8 z M 70 38 h 8 v 4 h -8 z M 86 38 h 8 v 4 h -8 z
                               M 16 46 h 4 v 4 h -4 z M 24 46 h 8 v 4 h -8 z M 38 46 h 8 v 4 h -8 z M 54 46 h 4 v 8 h -4 z M 78 46 h 4 v 4 h -4 z M 86 46 h 4 v 8 h -4 z
                               M 8 54 h 8 v 4 h -8 z M 24 54 h 4 v 4 h -4 z M 34 54 h 8 v 4 h -8 z M 46 54 h 4 v 4 h -4 z M 66 54 h 12 v 4 h -12 z M 86 54 h 4 v 4 h -4 z
                               M 12 62 h 4 v 4 h -4 z M 20 62 h 8 v 4 h -8 z M 34 62 h 4 v 8 h -4 z M 46 62 h 12 v 4 h -12 z M 62 62 h 4 v 4 h -4 z M 78 62 h 8 v 4 h -8 z
                               M 38 70 h 8 v 4 h -8 z M 50 70 h 4 v 4 h -4 z M 58 70 h 8 v 4 h -8 z
                               M 38 78 h 4 v 8 h -4 z M 46 78 h 12 v 4 h -12 z M 62 78 h 4 v 4 h -4 z
                               M 38 86 h 8 v 4 h -8 z M 50 86 h 12 v 4 h -12 z M 66 86 h 4 v 4 h -4 z" fill="#081a36"/>
                               
                      <rect x="40" y="40" width="20" height="20" fill="white" rx="3" stroke="#e8ecf1" stroke-width="1"/>
                      <circle cx="50" cy="50" r="8" fill="#1565c0"/>
                      <text x="50" y="53" font-family="'Montserrat', sans-serif" font-size="7" font-weight="bold" fill="white" text-anchor="middle">TVU</text>
                    </svg>
                  </div>
                </div>
              </div>

            </div>
          </div>
        `;
      } else {
        // Welcome and Admission Info Slides Layout
        const stats = slide.extra.stats;
        const logoPath = `${this.assetPrefix}assets/images/logo.png`;
        const themeClass = slide.type === 'ai' ? 'ai-slide' : 'ug-slide';
        const badgeTheme = slide.type === 'ai' ? 'ai' : 'ug';

        slidesHtml += `
          <div class="slide ${themeClass} ${activeClass}" data-index="${idx}">
            <div class="slide-bg" style="background-image: url('${bgImgPath}');"></div>
            <div class="slide-container">
              
              <!-- Left Column: Title Glow Container & Stats -->
              <div class="slide-left">
                <div class="glow-box">
                  <h2 class="glow-title">${slide.titleVn}</h2>
                  <h3 class="glow-subtitle">${slide.titleEn}</h3>
                  <p class="glow-text">${slide.description}</p>
                </div>
                
                <div class="stat-badges">
                  <div class="stat-badge ${badgeTheme}">
                    <span class="stat-value">${stats[0].value}</span>
                    <span class="stat-label">${stats[0].label}</span>
                  </div>
                  <div class="stat-badge ${badgeTheme}">
                    <span class="stat-value">${stats[1].value}</span>
                    <span class="stat-label">${stats[1].label}</span>
                  </div>
                  <div class="stat-badge ${badgeTheme}">
                    <span class="stat-value">${stats[2].value}</span>
                    <span class="stat-label">${stats[2].label}</span>
                  </div>
                </div>
              </div>

              <!-- Right Column: Interactive call to action -->
              <div class="slide-right">
                <div class="banner-logos">
                  <img src="${logoPath}" alt="TVU Logo" class="uni-logo" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><circle cx=%2250%22 cy=%2250%22 r=%2245%22 fill=%22%23ffffff%22 stroke=%22%230f6fff%22 stroke-width=%225%22/><text x=%2250%25%22 y=%2255%25%22 font-family=%22sans-serif%22 font-size=%2222%22 font-weight=%22bold%22 text-anchor=%22middle%22 fill=%22%230f6fff%22>TVU</text></svg>'">
                </div>

                <div class="action-card">
                  <h4>CHƯƠNG TRÌNH TUYỂN SINH MỚI</h4>
                  <p>Mở ra cơ hội học tập trong môi trường chuyên nghiệp, hợp tác doanh nghiệp chặt chẽ, hỗ trợ việc làm ngay sau khi tốt nghiệp.</p>
                  
                  <div style="margin-top: 10px; display: flex; justify-content: flex-start;">
                    <a href="${slide.actionUrl}" class="program-link" style="padding: 10px 24px; font-size: 12.5px;">
                      ${slide.actionText}
                    </a>
                  </div>
                </div>
              </div>

            </div>
          </div>
        `;
      }

      dotsHtml += `<span class="slider-dot ${idx === 0 ? 'active' : ''}" data-index="${idx}"></span>`;
    });

    this.innerHTML = `
      <section class="hero-slider" id="heroSlider">
        <div class="slider-wrapper" id="sliderWrapper">
          ${slidesHtml}
        </div>
        
        <!-- Navigation Arrows -->
        <button class="slider-arrow prev" id="sliderPrev" aria-label="Slide trước">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <button class="slider-arrow next" id="sliderNext" aria-label="Slide sau">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>

        <!-- Navigation Dots -->
        <div class="slider-dots" id="sliderDots">
          ${dotsHtml}
        </div>
      </section>
    `;
  }

  /**
   * Initialize slider actions, swipe events and autoplay
   */
  initSlider() {
    this.slides = this.querySelectorAll('.slide');
    this.dots = this.querySelectorAll('.slider-dot');
    const prevBtn = this.querySelector('#sliderPrev');
    const nextBtn = this.querySelector('#sliderNext');
    const sliderElem = this.querySelector('#heroSlider');

    if (!this.slides || this.slides.length === 0) return;

    // Arrow controls click listeners
    if (prevBtn) prevBtn.addEventListener('click', () => this.prevSlide());
    if (nextBtn) nextBtn.addEventListener('click', () => this.nextSlide());

    // Dot controls click listeners
    this.dots.forEach(dot => {
      dot.addEventListener('click', (e) => {
        const index = parseInt(e.target.getAttribute('data-index'));
        this.showSlide(index);
      });
    });

    // Pause autoplay on mouse hover
    if (sliderElem) {
      sliderElem.addEventListener('mouseenter', () => this.stopAutoplay());
      sliderElem.addEventListener('mouseleave', () => this.startAutoplay());
      
      // Touch swipe events for mobile
      sliderElem.addEventListener('touchstart', (e) => {
        this.touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });
      
      sliderElem.addEventListener('touchend', (e) => {
        this.touchEndX = e.changedTouches[0].screenX;
        this.handleSwipe();
      }, { passive: true });
    }

    // Start initial rotation
    this.startAutoplay();
  }

  /**
   * Slide rendering mechanics
   */
  showSlide(index) {
    if (index >= this.slides.length) {
      this.currentIndex = 0;
    } else if (index < 0) {
      this.currentIndex = this.slides.length - 1;
    } else {
      this.currentIndex = index;
    }

    // Toggle active state on slide elements
    this.slides.forEach((slide, idx) => {
      if (idx === this.currentIndex) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    // Toggle active state on dots indicators
    this.dots.forEach((dot, idx) => {
      if (idx === this.currentIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  nextSlide() {
    this.showSlide(this.currentIndex + 1);
  }

  prevSlide() {
    this.showSlide(this.currentIndex - 1);
  }

  handleSwipe() {
    const swipeThreshold = 50;
    const diff = this.touchStartX - this.touchEndX;
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        this.nextSlide(); // Swiped left
      } else {
        this.prevSlide(); // Swiped right
      }
    }
  }

  startAutoplay() {
    this.stopAutoplay();
    this.autoplayInterval = setInterval(() => {
      this.nextSlide();
    }, this.autoplayDelay);
  }

  stopAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    }
  }
}

// Define the custom element
if (!customElements.get('hero-slider-component')) {
  customElements.define('hero-slider-component', HeroSliderComponent);
}
