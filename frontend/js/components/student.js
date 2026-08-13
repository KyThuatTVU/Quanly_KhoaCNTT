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
    const folders = ['trang-chu', 'dai-hoc', 'gioi-thieu', 'nhan-su', 'nghien-cuu', 'sau-dai-hoc'];
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
    const data = await StudentService.getStudents();
    this.studentData = data || [];
    this.render();
    console.log('Tải dữ liệu sinh viên tiêu biểu thành công.');
  }

  /**
   * Render HTML structure of the showcase
   */
  render() {
    if (!this.studentData || this.studentData.length === 0) return;

    // Filter active records
    const activeData = this.studentData.filter(item => item.an_hien !== 0);

    // Group by chuyen_muc
    const groups = {
      'Sinh viên tiêu biểu': [],
      'Nghiên cứu khoa học sinh viên': [],
      'Dự án AI nổi bật': []
    };

    activeData.forEach(item => {
      const cat = item.chuyen_muc || 'Sinh viên tiêu biểu';
      if (!groups[cat]) {
        groups[cat] = [];
      }
      groups[cat].push(item);
    });

    // We only render groups that have at least one record
    let sectionsHtml = '';
    
    // Fallback vector arrays for placeholders
    const svgPlaceholders = [
      `<div class="student-svg-placeholder theme-1"><svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="18" y="24" width="64" height="42" rx="3" fill="rgba(15,111,255,0.03)"/><path d="M12 66 h76 v4 a2 2 0 0 1 -2 2 H14 a2 2 0 0 1 -2 -2 z"/><circle cx="50" cy="44" r="12" stroke-dasharray="3 3"/><path d="M44 36 h12 v9 c0 3-2.5 5.5-6 5.5 s-6-2.5-6-5.5 z M50 51.5 v8 M44 59.5 h12" stroke-width="2.5"/></svg></div>`,
      `<div class="student-svg-placeholder theme-2"><svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M28 20 h36 l16 16 v44 a4 4 0 0 1 -4 4 h-48 a4 4 0 0 1 -4 -4 v-56 a4 4 0 0 1 4 -4 z"/><path d="M64 20 v16 h16"/><path d="M38 40 h16 M38 48 h26 M38 56 h26"/><circle cx="50" cy="69" r="7" fill="none" stroke-width="2"/><path d="M46 63.5 l-4-7.5 h16 l-4 7.5" stroke-width="1.5"/></svg></div>`,
      `<div class="student-svg-placeholder theme-3"><svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="50" cy="50" r="22" stroke-dasharray="2 2"/><path d="M50 16 v68 M16 50 h68" stroke-opacity="0.15"/><circle cx="50" cy="50" r="10" fill="none"/><circle cx="50" cy="18" r="4" fill="currentColor"/><circle cx="50" cy="82" r="4" fill="currentColor"/><circle cx="18" cy="50" r="4" fill="currentColor"/><circle cx="82" cy="50" r="4" fill="currentColor"/><circle cx="28" cy="28" r="4" fill="currentColor"/><circle cx="72" cy="72" r="4" fill="currentColor"/><circle cx="72" cy="28" r="4" fill="currentColor"/><circle cx="28" cy="72" r="4" fill="currentColor"/></svg></div>`
    ];

    let overallIdx = 0;

    const groupMeta = {
      'Sinh viên tiêu biểu': {
        title: 'Sinh Viên Tiêu Biểu',
        icon: '🏆',
        themeClass: 'showcase-achievement'
      },
      'Nghiên cứu khoa học sinh viên': {
        title: 'Nghiên cứu khoa học sinh viên',
        icon: '🔬',
        themeClass: 'showcase-research'
      },
      'Dự án AI nổi bật': {
        title: 'Dự án AI nổi bật',
        icon: '🤖',
        themeClass: 'showcase-ai'
      }
    };

    Object.keys(groups).forEach(catKey => {
      const list = groups[catKey];
      if (list.length === 0) return; // Skip if no data for this group

      const meta = groupMeta[catKey] || { title: catKey, icon: '🌟', themeClass: 'showcase-generic' };
      
      let cardsHtml = '';
      list.forEach((item) => {
        const imgPath = `${this.assetPrefix}${item.hinh_anh_url}`;
        
        // Dynamic rendering of advisor if exists, matching original inline style
        const advisorText = item.giang_vien_huong_dan 
          ? `, giảng viên hướng dẫn: <strong>${item.giang_vien_huong_dan}</strong>.`
          : '.';

        cardsHtml += `
          <article class="student-card ${meta.themeClass}">
            <!-- Card Image Area -->
            <div class="student-image-wrapper">
              <img class="student-image" src="${imgPath}" alt="${item.ten_doi_ca_nhan}" data-index="${overallIdx}">
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
        overallIdx++;
      });

      sectionsHtml += `
        <div class="student-group-container">
          <div class="student-group-header">
            <span class="student-group-icon">${meta.icon}</span>
            <h3 class="student-group-title-text">${meta.title}</h3>
          </div>
          <div class="student-grid">
            ${cardsHtml}
          </div>
        </div>
      `;
    });

    this.innerHTML = `
      <section class="student-section">
        <div class="student-container">
          <h2 class="student-heading">Gương mặt Tiêu biểu & Thành tích Nổi bật</h2>
          ${sectionsHtml}
        </div>
      </section>
    `;

    // Initialize event-based image fallbacks
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
