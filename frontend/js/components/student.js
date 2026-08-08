/**
 * ==========================================================================
 * STUDENT SHOWCASE WEB COMPONENT
 * ==========================================================================
 * A reusable, native web component for displaying outstanding students.
 * Connects to /api/students API, matching MySQL table 'sinh_vien_tieu_bieu'.
 * Includes dynamic SVG fallback placeholders for awards and publications.
 */

import { StudentService } from '../services/studentService.js';

class StudentShowcaseComponent extends HTMLElement {
  constructor() {
    super();
    this.studentData = [];
    this.assetPrefix = './'; // Renamed to avoid DOM conflict with Element.prefix
  }

  connectedCallback() {
    this.resolveAssetPrefix();
    try {
      console.log('Khởi chạy <student-showcase-component>...');
      this.init();
    } catch (e) {
      this.innerHTML = `
        <div style="background: #ffebee; border: 2px dashed #f44336; color: #c62828; padding: 24px; text-align: center; font-family: sans-serif; border-radius: 16px; margin: 40px auto; max-width: 1000px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          <h3 style="margin: 0 0 10px; font-weight: 800; text-transform: uppercase;">Lỗi khởi chạy mục Sinh viên tiêu biểu</h3>
          <p style="margin: 0; font-size: 14px; font-weight: 600;">${e.stack || e.message}</p>
        </div>
      `;
      console.error('Lỗi khởi chạy Student Component:', e);
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
   * Populate mock data corresponding to 'sinh_vien_tieu_bieu' table
   */
  loadMockData() {
    this.studentData = [
      {
        id: 1,
        ten_doi_ca_nhan: 'Đội CTU-LinguTechies',
        nganh_hoc: 'Ngành Khoa học máy tính',
        thanh_tich: 'Vô địch cuộc thi phần mềm nguồn mở năm 2023 tại OLP Tin học sinh viên toàn quốc với sản phẩm VNLawAdvisor',
        giang_vien_huong_dan: 'PGS. TS. Phạm Nguyên Khang',
        hinh_anh_url: 'assets/students/student_olp2023.png'
      },
      {
        id: 2,
        ten_doi_ca_nhan: 'Đội CAAS',
        nganh_hoc: 'Ngành Khoa học máy tính',
        thanh_tich: 'Xuất sắc đạt giải Nhì cuộc thi Nghiên cứu khoa học dành cho Sinh viên năm 2025',
        giang_vien_huong_dan: 'TS. Mã Trường Thành',
        hinh_anh_url: 'assets/students/student_nckh2025.png'
      },
      {
        id: 3,
        ten_doi_ca_nhan: 'Đội CTU Team 1 và CTU Team 2',
        nganh_hoc: 'Nhóm sinh viên ngành Khoa học máy tính và Trí tuệ nhân tạo',
        thanh_tich: 'Giải Nhì và Khuyến khích OLP Trí tuệ nhân tạo miền Nam và hai giải Khuyến khích OLP Trí tuệ nhân tạo toàn quốc 2025',
        giang_vien_huong_dan: null,
        hinh_anh_url: 'assets/students/student_olpai2025.png'
      },
      {
        id: 4,
        ten_doi_ca_nhan: 'Thái Phú An',
        nganh_hoc: 'Ngành Khoa học máy tính',
        thanh_tich: 'Công báo bài báo tại nhiều hội nghị khoa học trong nước và quốc tế như ACIIDS (rank B), FJCAI, CITA, ISDS. Đặc biệt, giải Ba bài báo xuất sắc tại FJCAI 2026',
        giang_vien_huong_dan: null,
        hinh_anh_url: 'assets/students/student_thaiphuan.png'
      }
    ];
  }

  /**
   * Fetch live data in background, updates UI if found
   */
  async fetchDataInBackground() {
    const data = await StudentService.getStudents();
    if (data && data.length > 0) {
      this.studentData = data;
      this.render();
      console.log('Cập nhật dữ liệu sinh viên từ API thành công.');
    }
  }

  /**
   * Render HTML structure of the showcase
   */
  render() {
    if (!this.studentData || this.studentData.length === 0) return;

    let cardsHtml = '';

    // Modern academic vectors for SVGs placeholders
    const svgPlaceholders = [
      // 0: Programming Award / Open Source (Laptop & Trophy Cup)
      `<div class="student-svg-placeholder theme-1"><svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="18" y="24" width="64" height="42" rx="3" fill="rgba(15,111,255,0.03)"/><path d="M12 66 h76 v4 a2 2 0 0 1 -2 2 H14 a2 2 0 0 1 -2 -2 z"/><circle cx="50" cy="44" r="12" stroke-dasharray="3 3"/><path d="M44 36 h12 v9 c0 3-2.5 5.5-6 5.5 s-6-2.5-6-5.5 z M50 51.5 v8 M44 59.5 h12" stroke-width="2.5"/></svg></div>`,
      // 1: Scientific Research / NCKH (Scroll & Medal)
      `<div class="student-svg-placeholder theme-2"><svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M28 20 h36 l16 16 v44 a4 4 0 0 1 -4 4 h-48 a4 4 0 0 1 -4 -4 v-56 a4 4 0 0 1 4 -4 z"/><path d="M64 20 v16 h16"/><path d="M38 40 h16 M38 48 h26 M38 56 h26"/><circle cx="50" cy="69" r="7" fill="none" stroke-width="2"/><path d="M46 63.5 l-4-7.5 h16 l-4 7.5" stroke-width="1.5"/></svg></div>`,
      // 2: AI / OLP AI Team (Neural Net AI brain)
      `<div class="student-svg-placeholder theme-3"><svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="50" cy="50" r="22" stroke-dasharray="2 2"/><path d="M50 16 v68 M16 50 h68" stroke-opacity="0.15"/><circle cx="50" cy="50" r="10" fill="none"/><circle cx="50" cy="18" r="4" fill="currentColor"/><circle cx="50" cy="82" r="4" fill="currentColor"/><circle cx="18" cy="50" r="4" fill="currentColor"/><circle cx="82" cy="50" r="4" fill="currentColor"/><circle cx="28" cy="28" r="4" fill="currentColor"/><circle cx="72" cy="72" r="4" fill="currentColor"/><circle cx="72" cy="28" r="4" fill="currentColor"/><circle cx="28" cy="72" r="4" fill="currentColor"/></svg></div>`,
      // 3: Scientific Publications / Book (Open Book & Star Medal)
      `<div class="student-svg-placeholder theme-4"><svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 25 c10-4 26-4 36 0 c10-4 26-4 36 0 v48 c-10-4-26-4-36 0 c-10-4-26-4-36 0 z"/><path d="M50 25 v48"/><path d="M22 38 h18 M22 46 h18 M22 54 h10 M60 38 h18 M60 46 h18 M60 54 h10"/><path d="M50 73 l2.5 5.5 l6 1 l-4.5 4.5 l1 6 l-5 -3.5 l-5 3.5 l1 -6 l-4.5 -4.5 l6 -1 z" fill="rgba(16,185,129,0.1)"/></svg></div>`
    ];

    this.studentData.forEach((item, idx) => {
      const imgPath = `${this.assetPrefix}${item.hinh_anh_url}`;
      
      // Dynamic rendering of advisor if exists
      const advisorText = item.giang_vien_huong_dan 
        ? `, giảng viên hướng dẫn: <strong>${item.giang_vien_huong_dan}</strong>.`
        : '.';

      cardsHtml += `
        <article class="student-card">
          <!-- Card Image area with data-index for event listener based fallbacks -->
          <div class="student-image-wrapper">
            <img class="student-image" src="${imgPath}" alt="${item.ten_doi_ca_nhan}" data-index="${idx}">
          </div>
          
          <!-- Card Content Body -->
          <div class="student-card-body">
            <h3 class="student-card-title">${item.ten_doi_ca_nhan}</h3>
            <div class="student-card-major">${item.nganh_hoc}</div>
            <p class="student-card-desc">
              ${item.thanh_tich}${advisorText}
            </p>
          </div>
        </article>
      `;
    });

    this.innerHTML = `
      <section class="student-section">
        <div class="student-container">
          <h2 class="student-heading">Sinh Viên Tiêu Biểu</h2>
          <div class="student-grid">
            ${cardsHtml}
          </div>
        </div>
      </section>
    `;

    // Initialize event-based image fallbacks to prevent quoting syntax errors
    this.initImageFallbacks(svgPlaceholders);
  }

  /**
   * Attaches error event listeners to image tags dynamically.
   * Prevents syntax errors associated with inline double quotes.
   */
  initImageFallbacks(svgPlaceholders) {
    const images = this.querySelectorAll('.student-image');
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
}

// Define custom element
if (!customElements.get('student-showcase-component')) {
  customElements.define('student-showcase-component', StudentShowcaseComponent);
}
