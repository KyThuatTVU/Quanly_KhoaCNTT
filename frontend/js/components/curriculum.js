/**
 * ==========================================================================
 * FACULTY ACADEMIC CURRICULUM WEB COMPONENT
 * ==========================================================================
 * Renders the interactive Tab-based training programs details dashboard
 * (Program overview, metadata, 3-block study path, research directions,
 * admission methods with subject combinations, and PLOs outcomes).
 */

import { CurriculumService } from '../services/curriculumService.js';

class CurriculumProgramComponent extends HTMLElement {
  constructor() {
    super();
    this.programs = [];
    this.activeProgramId = 1; // 1: CNTT, 2: AI
    
    // Program details states
    this.activeProgram = null;
    this.studyPath = [];
    this.researchOrientations = [];
    this.admissions = [];
    this.plos = [];
    this.coreCourses = [];
    this.careers = [];
    this.faqs = [];
    this.stats = null;
  }

  connectedCallback() {
    try {
      console.log('Khởi chạy <curriculum-program-component>...');
      this.init();
    } catch (e) {
      console.error('Lỗi khởi chạy Curriculum Component:', e);
    }
  }

  async init() {
    this.programs = await CurriculumService.getPrograms();
    await this.loadProgramDetails(this.activeProgramId);
  }

  /**
   * Load all database-aligned details of a selected program
   */
  async loadProgramDetails(programId) {
    this.activeProgramId = programId;
    this.activeProgram = this.programs.find(p => p.id === programId);
    
    if (!this.activeProgram) return;

    const [studyPath, research, admissions, plos, coreCourses, careers, faqs, stats] = await Promise.all([
      CurriculumService.getStudyPath(programId),
      CurriculumService.getResearchOrientations(programId),
      CurriculumService.getAdmissions(programId),
      CurriculumService.getPLOs(programId),
      CurriculumService.getCoreCourses(programId),
      CurriculumService.getJobOpportunities(programId),
      CurriculumService.getFAQs(),
      CurriculumService.getStudentStats(programId)
    ]);

    this.studyPath = studyPath;
    this.researchOrientations = research;
    this.admissions = admissions;
    this.plos = plos;
    this.coreCourses = coreCourses;
    this.careers = careers;
    this.faqs = faqs;
    this.stats = stats;

    this.render();
    this.bindEvents();
  }

  /**
   * Switch active program tab
   */
  async switchTab(programId) {
    if (programId === this.activeProgramId) return;
    
    // Smooth scroll inside training program header if scrolled too far
    const rect = this.getBoundingClientRect();
    if (rect.top < 0) {
      this.scrollIntoView({ behavior: 'smooth' });
    }

    await this.loadProgramDetails(programId);
  }

  renderSubjectTags(subjectsString) {
    if (!subjectsString) return '';
    
    let parts = [];
    let match;
    
    // Pattern 1: Paren format - A00 (Toán, Lý, Hóa) | A01 (Toán, Lý, Anh)
    const parenRegex = /([A-Z0-9]{3})\s*\(([^)]+)\)/g;
    while ((match = parenRegex.exec(subjectsString)) !== null) {
      parts.push({ code: match[1].trim(), desc: match[2].trim() });
    }
    
    // Pattern 2: Dash format - A00 - Toán, Lý, Hóa A01 - ...
    if (parts.length === 0) {
      const dashRegex = /([A-Z0-9]{3})\s*[-–]\s*([^-–|]+?)(?=\s*[A-Z0-9]{3}\s*[-–]|$|\|)/g;
      while ((match = dashRegex.exec(subjectsString)) !== null) {
        const descClean = match[2].trim().replace(/,\s*$/, '');
        parts.push({ code: match[1].trim(), desc: descClean });
      }
    }
    
    // Fallback: If no matches were found, just split by space or comma
    if (parts.length === 0) {
      const simpleParts = subjectsString.split(/[\s,|]+/);
      return simpleParts.filter(p => p.trim()).map(p => {
        return `<div class="comb-badge"><span class="comb-code">${p.trim()}</span></div>`;
      }).join('');
    }
    
    return parts.map(p => {
      return `
        <div class="comb-badge">
          <span class="comb-code">${p.code}</span>
          <span class="comb-desc">(${p.desc})</span>
        </div>
      `;
    }).join('');
  }

  render() {
    if (!this.activeProgram) return;

    // 1. Program metadata variables
    const programName = this.activeProgram.ten_nganh;
    const code = this.activeProgram.ma_tuyen_sinh;
    const degree = this.activeProgram.van_bang_tot_nghiep;
    const duration = this.activeProgram.thoi_gian_hoc;
    const credits = this.activeProgram.tong_so_tin_chi;

    // 2. Tabs header
    const tabsHtml = this.programs.map(prog => {
      const isActive = prog.id === this.activeProgramId;
      const icon = prog.id === 1 
        ? `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="tab-icon"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>`
        : `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="tab-icon"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A5 5 0 0 0 8 8c0 1 .3 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"></path><path d="M9 18h6"></path><path d="M10 22h4"></path></svg>`;

      return `
        <button class="curr-tab ${isActive ? 'active' : ''}" data-id="${prog.id}">
          ${icon}
          <span>${prog.ten_nganh}</span>
        </button>
      `;
    }).join('');

    // 3. Colors for study path circles
    const pathColors = ['circle-blue', 'circle-cyan', 'circle-red'];

    this.innerHTML = `
      <!-- Program Main Header Banner (Full Width) -->
      <div class="curr-banner">
        <div class="curr-banner-container">
          <h2 class="curr-banner-title">Chương Trình Đào Tạo Đại Học</h2>
          <p class="curr-banner-subtitle">${programName} · Mã tuyển sinh ${code} · ${degree} · ${duration}</p>
          
          <!-- Tabs container -->
          <div class="curr-tabs-wrapper">
            <div class="curr-tabs">
              ${tabsHtml}
            </div>
          </div>
        </div>
      </div>

      <!-- Core Content wrapper (Centered at 1200px max width) -->
      <div class="curr-content-wrapper">
        
        <!-- Metadata Info Cards Row -->
        <div class="curr-meta-row">
          <div class="curr-meta-card-3d">
            <div class="meta-val">${code}</div>
            <div class="meta-label">MÃ TUYỂN SINH</div>
          </div>
          <div class="curr-meta-card-3d">
            <div class="meta-val">${degree}</div>
            <div class="meta-label">VĂN BẰNG</div>
          </div>
          <div class="curr-meta-card-3d">
            <div class="meta-val">${duration}</div>
            <div class="meta-label">THỜI GIAN HỌC</div>
          </div>
          <div class="curr-meta-card-3d">
            <div class="meta-val">${credits} TC</div>
            <div class="meta-label">KHỐI LƯỢNG</div>
          </div>
        </div>

        <!-- Double Columns: Overview & Study Route -->
        <div class="curr-main-grid">
          
          <!-- Left Column (2/3 width) -->
          <div class="curr-left-col">
            <div class="curr-card-3d">
              <h3 class="curr-section-title">Giới thiệu tổng quan ngành</h3>
              <p class="curr-text">${this.activeProgram.gioi_thieu_nganh}</p>
              <p class="curr-text">${this.activeProgram.co_hoi_phat_trien}</p>

              <!-- CSS Volumetric illustration banner -->
              <div class="curr-illustration-block">
                <div class="curr-illustration-shine"></div>
                <div class="curr-illustration-content">
                  <div class="curr-illust-badge">Đại học Trà Vinh</div>
                  <h4 class="curr-illust-title">KHOA CÔNG NGHỆ THÔNG TIN</h4>
                  <p class="curr-illust-subtitle">ENGINEERING PORTAL 2026</p>
                  <div class="curr-illust-chips">
                    <span class="chip-item">Software Dev</span>
                    <span class="chip-item">Artificial Intelligence</span>
                    <span class="chip-item">Network Security</span>
                    <span class="chip-item">IoT Lab</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column (1/3 width) -->
          <div class="curr-right-col">
            
            <!-- Study Path Blocks -->
            <div class="curr-card-3d">
              <h3 class="curr-section-title">Lộ trình học tập</h3>
              <div class="study-path-list">
                ${this.studyPath.map((block, idx) => `
                  <div class="path-item">
                    <div class="path-circle ${pathColors[idx] || 'circle-blue'}">${block.so_tin_chi}</div>
                    <div class="path-content">
                      <h4 class="path-title">${block.ten_khoi}</h4>
                      <p class="path-desc">${block.mo_ta_khoi}</p>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Research Directions -->
            <div class="curr-card-3d" style="margin-top: 30px;">
              <h3 class="curr-section-title">Định hướng nghiên cứu</h3>
              <div class="research-orient-grid">
                ${this.researchOrientations.map(orient => `
                  <div class="orient-card-3d">
                    <div class="orient-icon">🔬</div>
                    <div class="orient-name">${orient.ten_dinh_huong}</div>
                  </div>
                `).join('')}
              </div>
            </div>

          </div>
        </div>

        <!-- Admission Methods & Subject Combinations -->
        <div class="curr-admission-section">
          <div class="curr-card-3d">
            <h3 class="curr-section-title">Phương thức & Tổ hợp xét tuyển</h3>
            <div class="admission-methods-list">
              ${this.admissions.map(method => `
                <div class="method-item">
                  <div class="method-header">
                    <span class="method-dot-icon">i</span>
                    <span class="method-title">${method.ten_phuong_thuc}</span>
                  </div>
                  <div class="method-combinations-badges">
                    ${this.renderSubjectTags(method.danh_sach_to_hop)}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- PLOs (Program Learning Outcomes) -->
        <div class="curr-plos-section" style="margin-top: 36px;">
          <div class="curr-card-3d">
            <h3 class="curr-section-title">Chuẩn đầu ra tiêu biểu (PLOs)</h3>
            <div class="plos-list">
              ${this.plos.map(plo => `
                <div class="plo-item-3d">
                  <div class="plo-code-box">${plo.ma_plo}</div>
                  <div class="plo-content">${plo.noi_dung_plo}</div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Core Technology Courses Table (Image 1) -->
        <div class="curr-courses-section" style="margin-top: 36px;">
          <div class="curr-card-3d">
            <h3 class="curr-section-title">Một số học phần công nghệ cốt lõi tiêu biểu</h3>
            <div class="courses-table-container">
              <table class="courses-table">
                <thead>
                  <tr>
                    <th style="width: 12%;">Mã HP</th>
                    <th style="width: 25%;">Tên học phần học thuật</th>
                    <th style="width: 10%;">Tín chỉ</th>
                    <th>Năng lực công nghệ hình thành cho sinh viên</th>
                  </tr>
                </thead>
                <tbody>
                  ${this.coreCourses.map(course => `
                    <tr>
                      <td class="course-code">${course.ma_hoc_phan}</td>
                      <td class="course-name">${course.ten_hoc_phan}</td>
                      <td class="course-credits">${course.so_tin_chi}</td>
                      <td class="course-desc">${course.nang_luc_hinh_thanh}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Job Opportunities & Environments (Image 2) -->
        <div class="curr-career-section" style="margin-top: 36px;">
          <div class="curr-card-3d">
            <h3 class="curr-section-title">Vị trí việc làm & Nơi làm việc</h3>
            <div class="career-grid">
              
              <!-- Typical positions -->
              <div class="career-col">
                <div class="career-col-header">
                  <span class="career-col-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0f6fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="career-svg-icon" style="display: block;">
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                    </svg>
                  </span>
                  <h4>Vị trí đảm nhận tiêu biểu</h4>
                </div>
                <ul class="career-list">
                  ${this.careers.filter(c => c.loai_thong_tin === 'vi_tri_dam_nhan').flatMap(c =>
                    c.noi_dung
                      .split(/\n|;/)
                      .map(s => s.trim())
                      .filter(s => s.length > 0)
                  ).map(item => `<li>${item}</li>`).join('')}
                </ul>
              </div>

              <!-- Work environments -->
              <div class="career-col">
                <div class="career-col-header">
                  <span class="career-col-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00b4d8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="career-svg-icon" style="display: block;">
                      <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
                      <line x1="9" y1="22" x2="9" y2="16"></line>
                      <line x1="15" y1="22" x2="15" y2="16"></line>
                      <line x1="9" y1="16" x2="15" y2="16"></line>
                      <path d="M8 6h.01M16 6h.01M8 10h.01M16 10h.01M12 6h.01M12 10h.01M8 14h.01M16 14h.01M12 14h.01"></path>
                    </svg>
                  </span>
                  <h4>Môi trường công tác lí tưởng</h4>
                </div>
                <ul class="career-list">
                  ${this.careers.filter(c => c.loai_thong_tin === 'moi_truong_cong_tac').flatMap(c =>
                    c.noi_dung
                      .split(/\n|;/)
                      .map(s => s.trim())
                      .filter(s => s.length > 0)
                  ).map(item => `<li>${item}</li>`).join('')}
                </ul>
              </div>

            </div>
          </div>
        </div>

        <!-- Student Statistics Charts (Image 4) -->
        <div class="curr-stats-section" style="margin-top: 36px;">
          <div class="curr-card-3d">
            <h3 class="curr-section-title">Thống kê sinh viên qua các khoá</h3>
            <div class="charts-container-row">
              
              <!-- Left Chart: Student Count -->
              <div class="chart-box" id="lineChartBox">
                <h4 class="chart-title">Số lượng sinh viên đại học qua các khoá</h4>
                <p class="chart-subtitle">Dữ liệu tính đến tháng 7 năm 2026</p>
                <div class="chart-legend">
                  <span class="legend-dot color-blue"></span>
                  <span class="legend-text">Kỹ sư Khoa học máy tính</span>
                  ${this.activeProgramId === 2 ? `
                    <span class="legend-dot color-pink"></span>
                    <span class="legend-text">Kỹ sư Trí tuệ nhân tạo</span>
                  ` : ''}
                </div>
                <div class="svg-chart-wrapper" style="position: relative;">
                  ${this.renderLineChartSVG()}
                  
                  <!-- Interactive guide line (hidden by default) -->
                  <div class="chart-v-guide"></div>
                  
                  <!-- Floating tooltip popover -->
                  <div class="chart-tooltip">
                    <div class="tooltip-header"></div>
                    <div class="tooltip-body"></div>
                  </div>

                  <!-- Floating Y axis indicator -->
                  <div class="chart-y-indicator"></div>
                  
                  <!-- Floating X axis active tag at the bottom -->
                  <div class="chart-x-indicator"></div>
                </div>
                <div class="chart-axis-label">Khoá</div>
              </div>

              <!-- Right Chart: Graduated student counts -->
              <div class="chart-box">
                <h4 class="chart-title">Số lượng sinh viên đã tốt nghiệp</h4>
                <p class="chart-subtitle">Dữ liệu tính đến tháng 7 năm 2026</p>
                ${this.stats && this.stats.gradBatches.length > 0 ? `
                  <div class="chart-legend">
                    <span class="legend-rect color-blue"></span>
                    <span class="legend-text">Đã tốt nghiệp - Khoa học máy tính</span>
                    <span class="legend-rect color-pink"></span>
                    <span class="legend-text">Tốt nghiệp đúng tiến độ - Khoa học máy tính</span>
                    <span class="legend-rect color-orange"></span>
                    <span class="legend-text">Tốt nghiệp sớm - Khoa học máy tính</span>
                  </div>
                ` : ''}
                <div class="svg-chart-wrapper">
                  ${this.renderBarChartSVG()}
                </div>
                ${this.stats && this.stats.gradBatches.length > 0 ? `<div class="chart-axis-label">Khoá</div>` : ''}
              </div>

            </div>
          </div>
        </div>

        <!-- FAQ Accordion (Image 3) -->
        <div class="curr-faqs-section" style="margin-top: 36px; margin-bottom: 0;">
          <h2 class="faq-main-heading">Câu hỏi thường gặp</h2>
          <div class="faqs-list">
            ${this.faqs.map(faq => `
              <div class="faq-item-3d">
                <button class="faq-question-btn">
                  <span>${faq.cau_hoi}</span>
                  <span class="faq-toggle-arrow">▼</span>
                </button>
                <div class="faq-answer">
                  <p>${faq.tra_loi}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

      </div>
    `;
  }

  /**
   * Bind event listeners for FAQ accordion and tooltips
   */
  bindEvents() {
    // Tab switching event listener
    this.querySelectorAll('.curr-tab').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(e.currentTarget.getAttribute('data-id'));
        this.switchTab(id);
      });
    });

    this.querySelectorAll('.faq-question-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const item = e.currentTarget.parentNode;
        const arrow = e.currentTarget.querySelector('.faq-toggle-arrow');
        const answer = item.querySelector('.faq-answer');
        
        const isOpen = item.classList.toggle('active');
        if (isOpen) {
          arrow.style.transform = 'rotate(180deg)';
          answer.style.maxHeight = answer.scrollHeight + 'px';
        } else {
          arrow.style.transform = 'rotate(0deg)';
          answer.style.maxHeight = '0px';
        }
      });
    });

    // Chart interaction logic (mousemove tracking on Line Chart)
    const chartBox = this.querySelector('#lineChartBox');
    if (chartBox) {
      const svg = chartBox.querySelector('.svg-chart-wrapper svg');
      const guide = chartBox.querySelector('.chart-v-guide');
      const tooltip = chartBox.querySelector('.chart-tooltip');
      const yIndicator = chartBox.querySelector('.chart-y-indicator');
      const xIndicator = chartBox.querySelector('.chart-x-indicator');

      if (svg && guide && tooltip && yIndicator && xIndicator) {
        const batches = ['K42', 'K43', 'K44', 'K45', 'K46', 'K47', 'K48', 'K49', 'K50', 'K51', 'K52'];
        const countsCNTT = [48, 85, 100, 72, 148, 70, 66, 64, 110, 80, 0];
        const countsAI = [0, 0, 0, 0, 0, 0, 0, 0, 0, 60, 0];

        const paddingLeft = 40;
        const paddingRight = 20;
        const paddingTop = 25;
        const paddingBottom = 35;
        const width = 500;
        const height = 240;
        const plotWidth = width - paddingLeft - paddingRight;
        const plotHeight = height - paddingTop - paddingBottom;
        const maxVal = 150;

        const handleMove = (e) => {
          const rect = svg.getBoundingClientRect();
          const mouseX = ((e.clientX - rect.left) / rect.width) * width;
          const mouseY = ((e.clientY - rect.top) / rect.height) * height;

          // Check if cursor is in the active chart plot area
          if (mouseX >= paddingLeft - 5 && mouseX <= width - paddingRight + 5) {
            const idx = Math.round(((mouseX - paddingLeft) / plotWidth) * (batches.length - 1));
            const clampedIdx = Math.max(0, Math.min(batches.length - 1, idx));

            const activeBatch = batches[clampedIdx];
            const valCNTT = countsCNTT[clampedIdx];
            const valAI = countsAI[clampedIdx];

            // Calculate X guide coordinates
            const targetX = paddingLeft + (clampedIdx / (batches.length - 1)) * plotWidth;
            const targetXPercent = (targetX / width) * 100;

            // Update vertical guide line position
            guide.style.left = `${targetXPercent}%`;
            guide.style.display = 'block';

            // Update floating X-axis indicator bubble
            xIndicator.innerText = activeBatch;
            xIndicator.style.left = `${targetXPercent}%`;
            xIndicator.style.display = 'block';

            // Update floating Y-axis indicator bubble matching cursor height
            if (mouseY >= paddingTop && mouseY <= height - paddingBottom) {
              const valY = maxVal * (1 - (mouseY - paddingTop) / plotHeight);
              yIndicator.innerText = valY.toFixed(10); // Matches high-precision display in reference
              const targetYPercent = (mouseY / height) * 100;
              yIndicator.style.top = `${targetYPercent}%`;
              yIndicator.style.display = 'block';
            } else {
              yIndicator.style.display = 'none';
            }

            // Fill tooltip with values
            tooltip.querySelector('.tooltip-header').innerText = activeBatch;
            tooltip.querySelector('.tooltip-body').innerHTML = `
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 5px;">
                <span style="width: 7px; height: 7px; border-radius: 50%; background: #3b82f6; display: inline-block;"></span>
                <span>Kỹ sư Khoa học máy tính: <strong>${valCNTT}</strong></span>
              </div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="width: 7px; height: 7px; border-radius: 50%; background: #d946ef; display: inline-block;"></span>
                <span>Kỹ sư Trí tuệ nhân tạo: <strong>${valAI}</strong></span>
              </div>
            `;

            // Position tooltip dynamically to the right or left of the guide line to avoid clipping
            const isRightSide = clampedIdx < batches.length / 2;
            const tooltipOffset = isRightSide ? 15 : -195; // Shift left if on the right side of plot
            const tooltipLeftPercent = ((targetX + tooltipOffset) / width) * 100;

            tooltip.style.left = `${tooltipLeftPercent}%`;
            tooltip.style.top = '40%';
            tooltip.style.transform = 'translateY(-50%)';
            tooltip.style.display = 'block';
          } else {
            hideTooltip();
          }
        };

        const hideTooltip = () => {
          guide.style.display = 'none';
          tooltip.style.display = 'none';
          yIndicator.style.display = 'none';
          xIndicator.style.display = 'none';
        };

        svg.addEventListener('mousemove', handleMove);
        svg.addEventListener('mouseleave', hideTooltip);
      }
    }
  }

  /**
   * Draw Line/Area student count chart using native SVG (smooth Bezier curve & glow)
   */
  renderLineChartSVG() {
    const stats = this.stats;
    if (!stats) return '';
    const width = 500;
    const height = 240;
    const paddingLeft = 40;
    const paddingRight = 20;
    const paddingTop = 25;
    const paddingBottom = 35;
    
    const plotWidth = width - paddingLeft - paddingRight;
    const plotHeight = height - paddingTop - paddingBottom;
    
    const maxVal = 150;
    
    // Draw Y grid lines
    let gridHtml = '';
    for (let i = 0; i <= 3; i++) {
      const yVal = Math.round(maxVal * (i / 3));
      const yCoord = paddingTop + plotHeight * (1 - i / 3);
      gridHtml += `
        <line x1="${paddingLeft}" y1="${yCoord}" x2="${width - paddingRight}" y2="${yCoord}" stroke="rgba(226, 232, 240, 0.6)" stroke-width="1" stroke-dasharray="3 3" />
        <text x="${paddingLeft - 8}" y="${yCoord + 3.5}" font-family="'Be Vietnam Pro', sans-serif" font-size="9.5" font-weight="600" fill="#94a3b8" text-anchor="end">${yVal}</text>
      `;
    }
    
    // Plot Line Data Coordinates
    let points = [];
    let pathD = '';
    let areaD = '';
    
    stats.studentCounts.forEach((val, idx) => {
      const xCoord = paddingLeft + (idx / (stats.batches.length - 1)) * plotWidth;
      const yCoord = paddingTop + plotHeight * (1 - val / maxVal);
      points.push({ x: xCoord, y: yCoord, val: val, label: stats.batches[idx] });
    });
    
    // Draw Smooth Bezier curve path
    if (points.length > 0) {
      pathD = `M ${points[0].x} ${points[0].y}`;
      for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[i];
        const p1 = points[i+1];
        // Control points to make the line smoothly wave
        const cpX1 = p0.x + (p1.x - p0.x) / 3;
        const cpY1 = p0.y;
        const cpX2 = p1.x - (p1.x - p0.x) / 3;
        const cpY2 = p1.y;
        pathD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
      }
      
      areaD = `${pathD} L ${points[points.length - 1].x} ${height - paddingBottom} L ${points[0].x} ${height - paddingBottom} Z`;
    }
    
    // Draw X Axes label ticks
    let xAxisHtml = '';
    points.forEach((pt, idx) => {
      if (idx % 2 === 0 || idx === points.length - 1) { // Show alternate ticks to avoid cramming
        xAxisHtml += `
          <text x="${pt.x}" y="${height - paddingBottom + 16}" font-family="'Be Vietnam Pro', sans-serif" font-size="9" font-weight="700" fill="#94a3b8" text-anchor="middle">${pt.label}</text>
        `;
      }
    });

    const strokeColor = this.activeProgramId === 1 ? '#0f6fff' : '#d946ef';
    const areaStart = this.activeProgramId === 1 ? 'rgba(15, 111, 255, 0.22)' : 'rgba(217, 70, 239, 0.22)';
    const areaEnd = this.activeProgramId === 1 ? 'rgba(15, 111, 255, 0)' : 'rgba(217, 70, 239, 0)';
    const gradId = `lineGrad-${this.activeProgramId}`;
    const filterId = `glow-${this.activeProgramId}`;

    return `
      <svg viewBox="0 0 ${width} ${height}" style="width:100%; height:100%; display:block;">
        <defs>
          <linearGradient id="${gradId}" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${areaStart}" />
            <stop offset="100%" stop-color="${areaEnd}" />
          </linearGradient>
          <filter id="${filterId}" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="${strokeColor}" flood-opacity="0.3" />
          </filter>
        </defs>
        ${gridHtml}
        <!-- X Axis values -->
        ${xAxisHtml}
        <!-- Area gradient path -->
        ${areaD && this.activeProgramId === 1 ? `<path d="${areaD}" fill="url(#${gradId})" />` : ''}
        <!-- Line stroke path with glow filter -->
        ${pathD ? `<path d="${pathD}" fill="none" stroke="${strokeColor}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" filter="url(#${filterId})" />` : ''}
        
        <!-- Interactive Node circles (Outer transparent halo & Inner solid node) -->
        ${points.map((pt, idx) => pt.val > 0 ? `
          <circle cx="${pt.x}" cy="${pt.y}" r="8" fill="none" stroke="${strokeColor}" stroke-width="1.5" stroke-opacity="0.15" />
          <circle cx="${pt.x}" cy="${pt.y}" r="4.5" fill="#ffffff" stroke="${strokeColor}" stroke-width="3" />
          <text x="${pt.x}" y="${pt.y - 10}" font-family="'Be Vietnam Pro', sans-serif" font-size="9" font-weight="800" fill="${strokeColor}" text-anchor="middle">${pt.val}</text>
        ` : '').join('')}
      </svg>
    `;
  }

  /**
   * Helper to draw a stacked column segment with top rounded corners only if it is the top segment
   */
  drawBarSegment(x, y, w, h, fill, isTop, r = 4) {
    if (h <= 0) return '';
    if (isTop && h > r) {
      // SVG path drawing a top-rounded rectangle
      return `<path d="M ${x} ${y+h} L ${x} ${y+r} Q ${x} ${y} ${x+r} ${y} L ${x+w-r} ${y} Q ${x+w} ${y} ${x+w} ${y+r} L ${x+w} ${y+h} Z" fill="${fill}" />`;
    }
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" />`;
  }

  /**
   * Draw Stacked Bar student graduate chart using native SVG (smooth gradients & top-rounded pillars)
   */
  renderBarChartSVG() {
    const stats = this.stats;
    if (!stats || stats.gradBatches.length === 0) {
      return `
        <div class="stats-empty-msg">
          <div class="empty-icon">🎓</div>
          <p class="empty-text">Ngành Trí tuệ nhân tạo bắt đầu tuyển sinh từ khóa K51 (năm 2025), hiện tại chưa có khóa sinh viên tốt nghiệp.</p>
        </div>
      `;
    }
    const width = 500;
    const height = 240;
    const paddingLeft = 40;
    const paddingRight = 20;
    const paddingTop = 25;
    const paddingBottom = 35;
    
    const plotWidth = width - paddingLeft - paddingRight;
    const plotHeight = height - paddingTop - paddingBottom;
    
    const maxVal = 250;
    
    // Draw Y grid lines
    let gridHtml = '';
    for (let i = 0; i <= 5; i++) {
      const yVal = Math.round(maxVal * (i / 5));
      const yCoord = paddingTop + plotHeight * (1 - i / 5);
      gridHtml += `
        <line x1="${paddingLeft}" y1="${yCoord}" x2="${width - paddingRight}" y2="${yCoord}" stroke="rgba(226, 232, 240, 0.6)" stroke-width="1" stroke-dasharray="3 3" />
        <text x="${paddingLeft - 8}" y="${yCoord + 3.5}" font-family="'Be Vietnam Pro', sans-serif" font-size="9.5" font-weight="600" fill="#94a3b8" text-anchor="end">${yVal}</text>
      `;
    }
    
    // Draw columns
    let barsHtml = '';
    const numBatches = stats.gradBatches.length;
    const barWidth = 34;
    const gap = (plotWidth - numBatches * barWidth) / (numBatches + 1);
    
    stats.gradBatches.forEach((batch, idx) => {
      const xCoord = paddingLeft + gap + idx * (barWidth + gap);
      
      const vGrad = stats.graduated[idx];
      const vOnTime = stats.onTime[idx];
      const vEarly = stats.early[idx];
      // Others = Total - OnTime - Early
      const vOthers = Math.max(0, vGrad - vOnTime - vEarly);
      
      // Heights relative to plot scale
      const hOthers = (vOthers / maxVal) * plotHeight;
      const hOnTime = (vOnTime / maxVal) * plotHeight;
      const hEarly = (vEarly / maxVal) * plotHeight;
      
      // Top Coordinates (stacked columns overlay from bottom up)
      const yZero = height - paddingBottom;
      const yOthers = yZero - hOthers;
      const yOnTime = yOthers - hOnTime;
      const yEarly = yOnTime - hEarly;
      
      // Determine which segment is at the very top of the stack for rounding
      const hasEarly = hEarly > 0;
      const hasOnTime = hOnTime > 0;
      
      const isEarlyTop = hasEarly;
      const isOnTimeTop = !hasEarly && hasOnTime;
      const isOthersTop = !hasEarly && !hasOnTime && hOthers > 0;

      barsHtml += `
        <!-- Stacked columns: Bottom (Others/Late: Blue), Middle (On-Time: Pink), Top (Early: Orange) -->
        ${this.drawBarSegment(xCoord, yOthers, barWidth, hOthers, 'url(#blueGrad)', isOthersTop)}
        ${this.drawBarSegment(xCoord, yOnTime, barWidth, hOnTime, 'url(#pinkGrad)', isOnTimeTop)}
        ${this.drawBarSegment(xCoord, yEarly, barWidth, hEarly, 'url(#orangeGrad)', isEarlyTop)}
        
        <!-- Floating total value tag above the pillar -->
        <text x="${xCoord + barWidth/2}" y="${yEarly - 7}" font-family="'Be Vietnam Pro', sans-serif" font-size="10" font-weight="800" fill="#0f2d59" text-anchor="middle">${vGrad}</text>
        
        <!-- X Axis labels -->
        <text x="${xCoord + barWidth/2}" y="${height - paddingBottom + 16}" font-family="'Be Vietnam Pro', sans-serif" font-size="10" font-weight="700" fill="#94a3b8" text-anchor="middle">${batch}</text>
      `;
    });
    
    return `
      <svg viewBox="0 0 ${width} ${height}" style="width:100%; height:100%; display:block;">
        <defs>
          <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#3b82f6" />
            <stop offset="100%" stop-color="#1d4ed8" />
          </linearGradient>
          <linearGradient id="pinkGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#ec4899" />
            <stop offset="100%" stop-color="#be185d" />
          </linearGradient>
          <linearGradient id="orangeGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#f97316" />
            <stop offset="100%" stop-color="#c2410c" />
          </linearGradient>
        </defs>
        ${gridHtml}
        ${barsHtml}
      </svg>
    `;
  }
}

// Register custom element
if (!customElements.get('curriculum-program-component')) {
  customElements.define('curriculum-program-component', CurriculumProgramComponent);
}
