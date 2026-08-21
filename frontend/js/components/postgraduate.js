import { PostgraduateService } from '../services/postgraduateService.js';

/**
 * ==========================================================================
 * POSTGRADUATE PAGE COMPONENT (<postgraduate-page-component>)
 * ==========================================================================
 * Renders the Postgraduate Education portal featuring:
 * 1. Admissions announcements card (Tuyển sinh Sau Đại học 2026)
 * 2. PhD Candidates Table Directory (Danh sách nghiên cứu sinh)
 * 3. Student & Researcher Activities Gallery (Hoạt động học viên & NCS)
 * 4. Analytical SVG Charts (Thống kê qua các khóa: K22-K33 & Tốt nghiệp)
 */
class PostgraduatePageComponent extends HTMLElement {
  constructor() {
    super();
    this.noticesData = null;
    this.phdStudents = [];
    this.activities = [];
    this.stats = null;
  }

  async connectedCallback() {
    await this.loadData();
    this.render();
    this.bindEvents();
  }

  async loadData() {
    try {
      const [noticesData, phdStudents, activities, stats] = await Promise.all([
        PostgraduateService.getAdmissionsNotices(),
        PostgraduateService.getPhDStudents(),
        PostgraduateService.getActivities(),
        PostgraduateService.getStats()
      ]);
      this.noticesData = noticesData;
      this.phdStudents = phdStudents;
      this.activities = activities;
      this.stats = stats;
    } catch (e) {
      console.error('Error loading postgraduate data:', e);
    }
  }

  render() {
    this.innerHTML = `
      <div class="postgrad-container">
        
        <!-- SECTION 1: ADMISSIONS ANNOUNCEMENTS CARD -->
        <div class="postgrad-section">
          <div class="postgrad-admissions-card">
            <div class="admissions-card-header">
              <span class="header-icon">🎓</span>
              <h3 class="header-title">${this.noticesData ? this.noticesData.title : 'Tuyển sinh Sau Đại học 2026'}</h3>
            </div>
            
            <ul class="admissions-notice-list">
              ${this.noticesData && this.noticesData.notices ? this.noticesData.notices.map(notice => `
                <li>
                  <span class="notice-arrow">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0f6fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                  </span>
                  <a href="${notice.link_chi_tiet}" class="notice-link">${notice.tieu_de_thong_bao}</a>
                </li>
              `).join('') : ''}
            </ul>

            <div class="admissions-card-footer">
              Mọi thông tin chi tiết xin vui lòng liên hệ <a href="https://gs.tvu.edu.vn" target="_blank" rel="noopener">Khoa Sau Đại học, Đại học Trà Vinh</a> hoặc qua <a href="https://facebook.com" target="_blank" rel="noopener">Facebook của Khoa Sau Đại học</a>.
            </div>
          </div>
        </div>

        <!-- SECTION 2: PHD CANDIDATES DIRECTORY TABLE -->
        <div class="postgrad-section" style="margin-top: 48px;">
          <h2 class="postgrad-main-heading">DANH SÁCH NGHIÊN CỨU SINH</h2>
          <div class="phd-table-wrapper">
            <table class="phd-table">
              <thead>
                <tr>
                  <th style="width: 60px; text-align: center;">STT</th>
                  <th style="width: 260px;">Nghiên cứu sinh</th>
                  <th>Hướng nghiên cứu</th>
                  <th style="width: 180px;">Người hướng dẫn</th>
                  <th style="width: 110px; text-align: center;">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                ${this.phdStudents.filter(student => student.an_hien !== 0).map((student, index) => {
                  const seq = String(index + 1).padStart(2, '0');
                  const firstLetter = student.ho_ten ? student.ho_ten.trim().charAt(0) : '?';
                  return `
                    <tr>
                      <td class="stt-col">${seq}</td>
                      <td class="student-profile-col">
                        <div class="student-avatar-box">
                          <img src="${student.avatar_url}" alt="${student.ho_ten}" class="student-avatar-img" onerror="this.style.display='none'; this.parentNode.appendChild(document.createTextNode('${firstLetter}'));" />
                        </div>
                        <div class="student-info">
                          <h4 class="student-name">${student.ho_ten}</h4>
                        <p class="student-role">${student.chuc_vu_co_quan}</p>
                        ${student.an_hien_email !== 0 ? `
                          <a href="mailto:${student.email}" class="student-email">
                            <span class="email-icon">M</span> ${student.email}
                          </a>
                        ` : ''}
                        ${student.google_scholar_url ? `
                          <a href="${student.google_scholar_url}" target="_blank" rel="noopener" class="scholar-link">
                            <svg class="scholar-icon" width="12" height="12" viewBox="0 0 24 24" fill="#0f6fff"><path d="M12 24a12 12 0 1 1 12-12 12.013 12.013 0 0 1-12 12zm0-22a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2z"/><path d="M12 5l-7 4 7 4 7-4-7-4zm-4 6.5v3c0 1.5 1.8 2.5 4 2.5s4-1 4-2.5v-3l-4 2-4-2z"/></svg>
                            Google Scholar
                          </a>
                        ` : ''}
                      </div>
                    </td>
                    <td class="topic-col">${student.huong_nghien_cuu && student.huong_nghien_cuu.trim() ? student.huong_nghien_cuu : '<span style="color: #94a3b8; font-style: italic;">Không có</span>'}</td>
                    <td class="advisor-col">
                      ${student.nguoi_huong_dan && student.nguoi_huong_dan.trim() && student.nguoi_huong_dan.trim() !== 'Ban Giám Khoa' ? 
                        student.nguoi_huong_dan.split(',').map(adv => `<div>${adv.trim()}</div>`).join('') : 
                        '<span style="color: #94a3b8; font-style: italic;">Không có</span>'
                      }
                    </td>
                    <td class="status-col">
                      <span class="status-badge-green">${student.trang_thai}</span>
                    </td>
                  </tr>
                `; }).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- SECTION 3: STUDENT ACTIVITIES PHOTO GALLERY -->
        <div class="postgrad-section" style="margin-top: 56px;">
          <h2 class="postgrad-main-heading">HOẠT ĐỘNG CỦA HỌC VIÊN VÀ NGHIÊN CỨU SINH</h2>
          <div class="activities-grid">
            ${this.activities.map(act => `
              <div class="activity-card">
                <img src="${act.image}" alt="${act.title}" class="activity-img" />
                <div class="activity-overlay">
                  <p class="activity-title">${act.title}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- SECTION 4: STUDENT STATISTICS CHARTS -->
        <div class="postgrad-section" style="margin-top: 56px;">
          <h2 class="postgrad-main-heading">THỐNG KÊ HỌC VIÊN VÀ NGHIÊN CỨU SINH QUA CÁC KHOÁ</h2>
          
          <div class="postgrad-charts-row">
            
            <!-- Left Chart: HV & NCS counts -->
            <div class="postgrad-chart-box" id="postgradLineChartBox">
              <h4 class="chart-title">Số lượng học viên và nghiên cứu sinh qua các khoá</h4>
              <p class="chart-subtitle">Dữ liệu tính đến tháng 7 năm 2026</p>
              <div class="chart-legend">
                <span class="legend-dot color-blue"></span>
                <span class="legend-text">Thạc sĩ Khoa học máy tính</span>
                <span class="legend-dot color-pink"></span>
                <span class="legend-text">Nghiên cứu sinh Khoa học máy tính</span>
              </div>
              <div class="svg-chart-wrapper" style="position: relative;">
                ${this.renderLineChartSVG()}

                <!-- Interactive guide line -->
                <div class="chart-v-guide"></div>
                <!-- Floating tooltip popover -->
                <div class="chart-tooltip">
                  <div class="tooltip-header"></div>
                  <div class="tooltip-body"></div>
                </div>
                <!-- Floating Y axis indicator -->
                <div class="chart-y-indicator"></div>
                <!-- Floating X axis active tag -->
                <div class="chart-x-indicator"></div>
              </div>
              <div class="chart-axis-label">Khoá</div>
            </div>

            <!-- Right Chart: Graduated student counts -->
            <div class="postgrad-chart-box" id="postgradBarChartBox">
              <h4 class="chart-title">Số lượng học viên và nghiên cứu sinh đã tốt nghiệp</h4>
              <p class="chart-subtitle">Dữ liệu tính đến tháng 7 năm 2026</p>
              <div class="chart-legend">
                <span class="legend-rect color-blue"></span>
                <span class="legend-text">Thạc sĩ Khoa học máy tính</span>
                <span class="legend-rect color-pink"></span>
                <span class="legend-text">Tốt nghiệp đúng tiến độ - Thạc sĩ Khoa học máy tính</span>
              </div>
              <div class="svg-chart-wrapper">
                ${this.renderBarChartSVG()}
              </div>
              <div class="chart-axis-label">Khoá</div>
            </div>

          </div>
        </div>

      </div>
    `;
  }

  /**
   * Bind event listeners for line chart hover tracking
   */
  bindEvents() {
    const chartBox = this.querySelector('#postgradLineChartBox');
    if (!chartBox || !this.stats) return;

    const svg = chartBox.querySelector('.svg-chart-wrapper svg');
    const guide = chartBox.querySelector('.chart-v-guide');
    const tooltip = chartBox.querySelector('.chart-tooltip');
    const yIndicator = chartBox.querySelector('.chart-y-indicator');
    const xIndicator = chartBox.querySelector('.chart-x-indicator');

    if (svg && guide && tooltip && yIndicator && xIndicator) {
      const batches = this.stats.batches;
      const masterCounts = this.stats.masterCounts;
      const phdCounts = this.stats.phdCounts;

      const paddingLeft = 40;
      const paddingRight = 20;
      const paddingTop = 25;
      const paddingBottom = 35;
      const width = 500;
      const height = 240;
      const plotWidth = width - paddingLeft - paddingRight;
      const plotHeight = height - paddingTop - paddingBottom;
      const maxVal = 50;

      const handleMove = (e) => {
        const rect = svg.getBoundingClientRect();
        const mouseX = ((e.clientX - rect.left) / rect.width) * width;
        const mouseY = ((e.clientY - rect.top) / rect.height) * height;

        if (mouseX >= paddingLeft - 5 && mouseX <= width - paddingRight + 5) {
          const idx = Math.round(((mouseX - paddingLeft) / plotWidth) * (batches.length - 1));
          const clampedIdx = Math.max(0, Math.min(batches.length - 1, idx));

          const activeBatch = batches[clampedIdx];
          const valMaster = masterCounts[clampedIdx];
          const valPhD = phdCounts[clampedIdx];

          const targetX = paddingLeft + (clampedIdx / (batches.length - 1)) * plotWidth;
          const targetXPercent = (targetX / width) * 100;

          guide.style.left = `${targetXPercent}%`;
          guide.style.display = 'block';

          xIndicator.innerText = activeBatch;
          xIndicator.style.left = `${targetXPercent}%`;
          xIndicator.style.display = 'block';

          if (mouseY >= paddingTop && mouseY <= height - paddingBottom) {
            const valY = maxVal * (1 - (mouseY - paddingTop) / plotHeight);
            yIndicator.innerText = valY.toFixed(10);
            const targetYPercent = (mouseY / height) * 100;
            yIndicator.style.top = `${targetYPercent}%`;
            yIndicator.style.display = 'block';
          } else {
            yIndicator.style.display = 'none';
          }

          tooltip.querySelector('.tooltip-header').innerText = activeBatch;
          tooltip.querySelector('.tooltip-body').innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 5px;">
              <span style="width: 7px; height: 7px; border-radius: 50%; background: #3b82f6; display: inline-block;"></span>
              <span>Thạc sĩ Khoa học máy tính: <strong>${valMaster}</strong></span>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="width: 7px; height: 7px; border-radius: 50%; background: #d946ef; display: inline-block;"></span>
              <span>Nghiên cứu sinh Khoa học máy tính: <strong>${valPhD}</strong></span>
            </div>
          `;

          const isRightSide = clampedIdx < batches.length / 2;
          const tooltipOffset = isRightSide ? 15 : -215;
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

  /**
   * Draw Line/Area Postgraduate student count SVG chart
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
    const maxVal = 50;
    
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

    // Masters Line Coordinates
    let masterPoints = [];
    let masterPathD = '';
    let masterAreaD = '';
    stats.masterCounts.forEach((val, idx) => {
      const xCoord = paddingLeft + (idx / (stats.batches.length - 1)) * plotWidth;
      const yCoord = paddingTop + plotHeight * (1 - val / maxVal);
      masterPoints.push({ x: xCoord, y: yCoord, val: val, label: stats.batches[idx] });
    });

    if (masterPoints.length > 0) {
      masterPathD = `M ${masterPoints[0].x} ${masterPoints[0].y}`;
      for (let i = 0; i < masterPoints.length - 1; i++) {
        const p0 = masterPoints[i];
        const p1 = masterPoints[i+1];
        const cpX1 = p0.x + (p1.x - p0.x) / 3;
        const cpY1 = p0.y;
        const cpX2 = p1.x - (p1.x - p0.x) / 3;
        const cpY2 = p1.y;
        masterPathD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
      }
      masterAreaD = `${masterPathD} L ${masterPoints[masterPoints.length - 1].x} ${height - paddingBottom} L ${masterPoints[0].x} ${height - paddingBottom} Z`;
    }

    // PhD Line Coordinates
    let phdPoints = [];
    let phdPathD = '';
    stats.phdCounts.forEach((val, idx) => {
      const xCoord = paddingLeft + (idx / (stats.batches.length - 1)) * plotWidth;
      const yCoord = paddingTop + plotHeight * (1 - val / maxVal);
      phdPoints.push({ x: xCoord, y: yCoord, val: val, label: stats.batches[idx] });
    });

    if (phdPoints.length > 0) {
      phdPathD = `M ${phdPoints[0].x} ${phdPoints[0].y}`;
      for (let i = 0; i < phdPoints.length - 1; i++) {
        const p0 = phdPoints[i];
        const p1 = phdPoints[i+1];
        const cpX1 = p0.x + (p1.x - p0.x) / 3;
        const cpY1 = p0.y;
        const cpX2 = p1.x - (p1.x - p0.x) / 3;
        const cpY2 = p1.y;
        phdPathD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
      }
    }

    // X Axis Ticks
    let xAxisHtml = '';
    masterPoints.forEach((pt, idx) => {
      xAxisHtml += `
        <text x="${pt.x}" y="${height - paddingBottom + 16}" font-family="'Be Vietnam Pro', sans-serif" font-size="9" font-weight="700" fill="#94a3b8" text-anchor="middle">${pt.label}</text>
      `;
    });

    return `
      <svg viewBox="0 0 ${width} ${height}" style="width:100%; height:100%; display:block;">
        <defs>
          <linearGradient id="postgradMasterGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="rgba(15, 111, 255, 0.22)" />
            <stop offset="100%" stop-color="rgba(15, 111, 255, 0)" />
          </linearGradient>
          <filter id="postgradGlowBlue" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#0f6fff" flood-opacity="0.3" />
          </filter>
          <filter id="postgradGlowPink" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#d946ef" flood-opacity="0.3" />
          </filter>
        </defs>
        ${gridHtml}
        ${xAxisHtml}

        <!-- Master Gradient Area -->
        ${masterAreaD ? `<path d="${masterAreaD}" fill="url(#postgradMasterGrad)" />` : ''}

        <!-- Master Line Path -->
        ${masterPathD ? `<path d="${masterPathD}" fill="none" stroke="#0f6fff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" filter="url(#postgradGlowBlue)" />` : ''}

        <!-- PhD Line Path -->
        ${phdPathD ? `<path d="${phdPathD}" fill="none" stroke="#d946ef" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" filter="url(#postgradGlowPink)" />` : ''}

        <!-- Master Nodes -->
        ${masterPoints.map(pt => pt.val > 0 ? `
          <circle cx="${pt.x}" cy="${pt.y}" r="8" fill="none" stroke="#0f6fff" stroke-width="1.5" stroke-opacity="0.15" />
          <circle cx="${pt.x}" cy="${pt.y}" r="4.5" fill="#ffffff" stroke="#0f6fff" stroke-width="3" />
        ` : '').join('')}

        <!-- PhD Nodes -->
        ${phdPoints.map(pt => pt.val > 0 ? `
          <circle cx="${pt.x}" cy="${pt.y}" r="8" fill="none" stroke="#d946ef" stroke-width="1.5" stroke-opacity="0.15" />
          <circle cx="${pt.x}" cy="${pt.y}" r="4.5" fill="#ffffff" stroke="#d946ef" stroke-width="3" />
        ` : '').join('')}
      </svg>
    `;
  }

  /**
   * Helper to draw top-rounded stacked column segments
   */
  drawBarSegment(x, y, w, h, fill, isTop, r = 4) {
    if (h <= 0) return '';
    if (isTop && h > r) {
      return `<path d="M ${x} ${y+h} L ${x} ${y+r} Q ${x} ${y} ${x+r} ${y} L ${x+w-r} ${y} Q ${x+w} ${y} ${x+w} ${y+r} L ${x+w} ${y+h} Z" fill="${fill}" />`;
    }
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" />`;
  }

  /**
   * Draw Stacked Bar Postgraduate graduate chart
   */
  renderBarChartSVG() {
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
    const maxVal = 60;
    
    // Draw Y grid lines
    let gridHtml = '';
    for (let i = 0; i <= 6; i++) {
      const yVal = Math.round(maxVal * (i / 6));
      const yCoord = paddingTop + plotHeight * (1 - i / 6);
      gridHtml += `
        <line x1="${paddingLeft}" y1="${yCoord}" x2="${width - paddingRight}" y2="${yCoord}" stroke="rgba(226, 232, 240, 0.6)" stroke-width="1" stroke-dasharray="3 3" />
        <text x="${paddingLeft - 8}" y="${yCoord + 3.5}" font-family="'Be Vietnam Pro', sans-serif" font-size="9.5" font-weight="600" fill="#94a3b8" text-anchor="end">${yVal}</text>
      `;
    }

    let barsHtml = '';
    const numBatches = stats.gradBatches.length;
    const barWidth = 26;
    const gap = (plotWidth - numBatches * barWidth) / (numBatches + 1);

    stats.gradBatches.forEach((batch, idx) => {
      const xCoord = paddingLeft + gap + idx * (barWidth + gap);
      const vGrad = stats.graduated[idx];
      const vOnTime = stats.onTime[idx];
      const vOthers = Math.max(0, vGrad - vOnTime);

      const hOthers = (vOthers / maxVal) * plotHeight;
      const hOnTime = (vOnTime / maxVal) * plotHeight;

      const yZero = height - paddingBottom;
      const yOthers = yZero - hOthers;
      const yOnTime = yOthers - hOnTime;

      const hasOnTime = hOnTime > 0;
      const isOnTimeTop = hasOnTime;
      const isOthersTop = !hasOnTime && hOthers > 0;

      barsHtml += `
        ${this.drawBarSegment(xCoord, yOthers, barWidth, hOthers, 'url(#pgBlueGrad)', isOthersTop)}
        ${this.drawBarSegment(xCoord, yOnTime, barWidth, hOnTime, 'url(#pgPinkGrad)', isOnTimeTop)}

        ${vGrad > 0 ? `
          <text x="${xCoord + barWidth/2}" y="${yOnTime - 6}" font-family="'Be Vietnam Pro', sans-serif" font-size="9.5" font-weight="800" fill="#0f2d59" text-anchor="middle">${vGrad}</text>
        ` : ''}

        <text x="${xCoord + barWidth/2}" y="${height - paddingBottom + 16}" font-family="'Be Vietnam Pro', sans-serif" font-size="9.5" font-weight="700" fill="#94a3b8" text-anchor="middle">${batch}</text>
      `;
    });

    return `
      <svg viewBox="0 0 ${width} ${height}" style="width:100%; height:100%; display:block;">
        <defs>
          <linearGradient id="pgBlueGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#3b82f6" />
            <stop offset="100%" stop-color="#1d4ed8" />
          </linearGradient>
          <linearGradient id="pgPinkGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#ec4899" />
            <stop offset="100%" stop-color="#be185d" />
          </linearGradient>
        </defs>
        ${gridHtml}
        ${barsHtml}
      </svg>
    `;
  }
}

// Register Web Component
if (!customElements.get('postgraduate-page-component')) {
  customElements.define('postgraduate-page-component', PostgraduatePageComponent);
}
