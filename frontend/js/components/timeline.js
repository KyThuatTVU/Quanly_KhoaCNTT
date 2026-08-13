/**
 * ==========================================================================
 * FACULTY TIMELINE WEB COMPONENT
 * ==========================================================================
 * A reusable, native web component for displaying the faculty history timeline.
 * Connects to /api/timeline endpoint.
 */

import { TimelineService } from '../services/timelineService.js';

class TimelineHistoryComponent extends HTMLElement {
  constructor() {
    super();
    this.timelineData = [];
  }

  connectedCallback() {
    try {
      console.log('Khởi chạy <timeline-history-component>...');
      this.init();
    } catch (e) {
      this.innerHTML = `
        <div style="background: #ffebee; border: 2px dashed #f44336; color: #c62828; padding: 24px; text-align: center; font-family: sans-serif; border-radius: 16px; margin: 40px auto; max-width: 1000px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          <h3 style="margin: 0 0 10px; font-weight: 800; text-transform: uppercase;">Lỗi khởi chạy mục Lịch sử hình thành</h3>
          <p style="margin: 0; font-size: 14px; font-weight: 600;">${e.stack || e.message}</p>
        </div>
      `;
      console.error('Lỗi khởi chạy Timeline Component:', e);
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
    const data = await TimelineService.getTimeline();
    this.timelineData = data || [];
    this.render();
    console.log('Tải dữ liệu lịch sử thành công.');
  }

  /**
   * Render HTML structure of the timeline section
   */
  render() {
    if (this.timelineData.length === 0) return;

    let itemsHtml = '';

    this.timelineData.forEach((item) => {
      // Clean display date format if present
      let dateBadge = '';
      if (item.ngay_cu_the) {
        try {
          const d = new Date(item.ngay_cu_the);
          const day = String(d.getDate()).padStart(2, '0');
          const month = String(d.getMonth() + 1).padStart(2, '0');
          const year = d.getFullYear();
          dateBadge = `<span class="timeline-date-label">${day}/${month}/${year}</span>`;
        } catch (e) {
          // ignore date parse errors
        }
      }

      itemsHtml += `
        <div class="timeline-item">
          <!-- Timeline Vertical Node Dot -->
          <div class="timeline-dot-container">
            <div class="timeline-dot"></div>
          </div>
          
          <!-- Volumetric 3D Card viewport -->
          <div class="timeline-card-3d-wrap">
            <div class="timeline-card-3d">
              <div class="timeline-card-header">
                <div class="timeline-year-badge">${item.nam}</div>
                ${dateBadge}
              </div>
              <div class="timeline-card-body">
                <p class="timeline-text">${item.noi_dung}</p>
                ${item.so_quyet_dinh ? `<span class="timeline-dec">Quyết định số: ${item.so_quyet_dinh}</span>` : ''}
              </div>
            </div>
          </div>
        </div>
      `;
    });

    this.innerHTML = `
      <section class="timeline-section">
        <div class="timeline-container">
          <!-- Heading -->
          <h2 class="timeline-heading">Lịch Sử Hình Thành</h2>
          
          <!-- Timeline list wrapping the vertical line -->
          <div class="timeline-list">
            <div class="timeline-vertical-line"></div>
            ${itemsHtml}
          </div>
        </div>
      </section>
    `;
  }
}

// Define custom element
if (!customElements.get('timeline-history-component')) {
  customElements.define('timeline-history-component', TimelineHistoryComponent);
}
