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
    // Fallback mockup timeline data if empty
    const timeline = this.timelineData && this.timelineData.length > 0 
      ? this.timelineData 
      : [
          {
            id: 1,
            nam: "2001",
            ngay_cu_the: "2001-09-05",
            so_quyet_dinh: "112/QĐ-UBND",
            noi_dung: "Thành lập <strong>Bộ môn Công nghệ thông tin</strong> thuộc Khoa Kỹ thuật và Công nghệ - tiền thân của Khoa Công nghệ thông tin ngày nay, đặt nền móng cho công cuộc đào tạo kỹ thuật số tại Trà Vinh.",
            thu_tu: 1
          },
          {
            id: 2,
            nam: "2006",
            ngay_cu_the: "2006-06-19",
            so_quyet_dinh: "141/2006/QĐ-TTg",
            noi_dung: "Trường <strong>Đại học Trà Vinh</strong> chính thức được thành lập. Bộ môn CNTT mở rộng chương trình đào tạo đại học hệ chính quy nhằm đáp ứng nhân lực số vùng ĐBSCL.",
            thu_tu: 2
          },
          {
            id: 3,
            nam: "2014",
            ngay_cu_the: null,
            so_quyet_dinh: null,
            noi_dung: "Bắt đầu tuyển sinh và đào tạo trình độ <strong>Thạc sĩ ngành Công nghệ thông tin</strong>, đánh dấu bước phát triển đột phá trong đào tạo sau đại học và nghiên cứu khoa học chuyên sâu.",
            thu_tu: 3
          },
          {
            id: 4,
            nam: "2019",
            ngay_cu_the: null,
            so_quyet_dinh: null,
            noi_dung: "Chương trình đào tạo ngành Công nghệ thông tin hệ Đại học đạt chuẩn <strong>kiểm định chất lượng quốc tế AUN-QA / FIBAA</strong>, khẳng định thương hiệu đào tạo hội nhập quốc tế.",
            thu_tu: 4
          },
          {
            id: 5,
            nam: "2023",
            ngay_cu_the: null,
            so_quyet_dinh: null,
            noi_dung: "Đầu tư phát triển hệ thống <strong>phòng Lab trí tuệ nhân tạo (AI), IoT và an toàn thông tin</strong> hiện đại, thúc đẩy công tác nghiên cứu ứng dụng và chuyển giao công nghệ cho doanh nghiệp.",
            thu_tu: 5
          }
        ];

    let itemsHtml = '';

    timeline.forEach((item) => {
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
