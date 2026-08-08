/**
 * ==========================================================================
 * COUNTER STATS WEB COMPONENT WITH SCROLL ANIMATION
 * ==========================================================================
 * A reusable, native web component for displaying key statistics with count-up.
 * Connects to /api/stats API, matching MySQL table 'thong_ke_noi_bat'.
 * Uses IntersectionObserver to trigger a smooth count-up animation when in view.
 */

import { StatsService } from '../services/statsService.js';

class StatsCounterComponent extends HTMLElement {
  constructor() {
    super();
    this.statsData = [];
    this.hasAnimated = false;
  }

  connectedCallback() {
    try {
      console.log('Khởi chạy <stats-counter-component>...');
      this.init();
    } catch (e) {
      this.innerHTML = `
        <div style="background: #ffebee; border: 2px dashed #f44336; color: #c62828; padding: 24px; text-align: center; font-family: sans-serif; border-radius: 16px; margin: 40px auto; max-width: 1000px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          <h3 style="margin: 0 0 10px; font-weight: 800; text-transform: uppercase;">Lỗi khởi chạy mục Số liệu thống kê</h3>
          <p style="margin: 0; font-size: 14px; font-weight: 600;">${e.stack || e.message}</p>
        </div>
      `;
      console.error('Lỗi khởi chạy Stats Component:', e);
    }
  }

  /**
   * Initialize data flow and trigger IntersectionObserver
   */
  async init() {
    // 1. Instantly paint mock structure
    this.loadMockData();
    this.render();
    this.initObserver();

    // 2. Fetch live data in the background (non-blocking)
    await this.fetchDataInBackground();
  }

  /**
   * Populate mock data corresponding to 'thong_ke_noi_bat' table
   */
  loadMockData() {
    this.statsData = [
      {
        id: 1,
        ten_chi_so: 'Sinh viên',
        so_lieu_thong_ke: 1063,
        don_vi: '+',
        ghi_chu_thoi_gian: 'Số liệu thống kê đến tháng 12/2025'
      },
      {
        id: 2,
        ten_chi_so: 'Học viên sau đại học',
        so_lieu_thong_ke: 234,
        don_vi: '+',
        ghi_chu_thoi_gian: 'Số liệu thống kê đến tháng 12/2025'
      },
      {
        id: 3,
        ten_chi_so: 'Đề tài NCKH',
        so_lieu_thong_ke: 15,
        don_vi: '+',
        ghi_chu_thoi_gian: 'Số liệu thống kê đến tháng 12/2025'
      },
      {
        id: 4,
        ten_chi_so: 'Bài báo',
        so_lieu_thong_ke: 60,
        don_vi: '+',
        ghi_chu_thoi_gian: 'Số liệu thống kê đến tháng 12/2025'
      },
      {
        id: 5,
        ten_chi_so: 'Dự án quốc tế',
        so_lieu_thong_ke: 3,
        don_vi: '+',
        ghi_chu_thoi_gian: 'Số liệu thống kê đến tháng 12/2025'
      }
    ];
  }

  /**
   * Fetch live data in background, updates UI if found
   */
  async fetchDataInBackground() {
    const data = await StatsService.getStats();
    if (data && data.length > 0) {
      this.statsData = data;
      this.hasAnimated = false; // Allow re-animation on new data fetch
      this.render();
      this.initObserver();
      console.log('Cập nhật dữ liệu thống kê từ API thành công.');
    }
  }

  /**
   * Render HTML structure of the statistics section
   */
  render() {
    if (!this.statsData || this.statsData.length === 0) return;

    let gridHtml = '';
    
    // SVGs for statistics
    const iconSvgs = [
      // 0: Student (User Icon)
      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`,
      // 1: Postgraduate student (Cap/Laptop Icon)
      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"></path></svg>`,
      // 2: Research topics (Microscope Icon)
      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`,
      // 3: Scientific publications (Document Icon)
      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`,
      // 4: International projects (Globe Icon)
      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`
    ];

    this.statsData.forEach((item, idx) => {
      // Rotate icons if data length exceeds predefined SVGs
      const svgIcon = iconSvgs[idx % iconSvgs.length];

      gridHtml += `
        <div class="stat-card">
          <div class="stat-icon-wrapper theme-${idx + 1}">
            ${svgIcon}
          </div>
          <div class="stat-number-wrapper">
            <span class="stat-number" data-target="${item.so_lieu_thong_ke}">0</span>
            <span class="stat-unit">${item.don_vi || '+'}</span>
          </div>
          <div class="stat-label">${item.ten_chi_so}</div>
        </div>
      `;
    });

    const timestamp = this.statsData[0]?.ghi_chu_thoi_gian || 'Số liệu thống kê';

    this.innerHTML = `
      <section class="stats-section">
        <div class="stats-container">
          <h2 class="stats-heading">Những Con Số Nổi Bật</h2>
          <div class="stats-subheading">(${timestamp})</div>
          <div class="stats-grid">
            ${gridHtml}
          </div>
        </div>
      </section>
    `;
  }

  /**
   * Set up scroll triggers using IntersectionObserver
   */
  initObserver() {
    const grid = this.querySelector('.stats-grid');
    if (!grid) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.hasAnimated) {
          this.hasAnimated = true;
          this.animateCounters();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    observer.observe(grid);
  }

  /**
   * Perform high performance count-up transition
   */
  animateCounters() {
    const counters = this.querySelectorAll('.stat-number');
    const duration = 2000; // Animation runs for 2 seconds

    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'));
      const start = 0;
      let startTime = null;

      const step = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        
        // Easing function (easeOutQuad) for smooth deceleration at the end
        const easeProgress = progress * (2 - progress);
        const currentValue = Math.floor(easeProgress * (target - start) + start);
        
        // Format with dots as thousand separators (matching Vietnamese style, e.g. 1.063)
        counter.textContent = currentValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          // Double check to output precise target value
          counter.textContent = target.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        }
      };

      window.requestAnimationFrame(step);
    });
  }
}

// Define custom element
if (!customElements.get('stats-counter-component')) {
  customElements.define('stats-counter-component', StatsCounterComponent);
}
