/**
 * ==========================================================================
 * FACULTY STAFF DIRECTORY & PORTFOLIO WEB COMPONENT
 * ==========================================================================
 * Displays the list of Faculty Leadership and Lecturers with a premium 3D layout.
 * Clicking on any card transitions smoothly to a detailed Academic Portfolio view
 * (Personal Info, Research Projects, Projects, Publications, Books, and Supervisions).
 */

import { StaffService } from '../services/staffService.js';

class StaffDirectoryComponent extends HTMLElement {
  constructor() {
    super();
    this.staffList = [];
    this.currentView = 'directory'; // 'directory' or 'profile'
    this.activeStaffId = null;
    this.staffGroups = [];
    
    // Details cached states
    this.profileData = null;
    this.researchProjects = [];
    this.projects = [];
    this.publications = [];
    this.books = [];
    this.supervisions = [];
    this.assetPrefix = './';
  }

  connectedCallback() {
    try {
      console.log('Khởi chạy <staff-directory-component>...');
      this.resolveAssetPrefix();
      this.init();
    } catch (e) {
      console.error('Lỗi khởi chạy Staff Component:', e);
    }
  }

  resolveAssetPrefix() {
    const folders = ['home', 'undergraduate', 'about', 'staff', 'research', 'postgraduate'];
    const currentPath = window.location.pathname;
    this.assetPrefix = './';

    for (const folder of folders) {
      if (currentPath.includes('/' + folder)) {
        this.assetPrefix = '../';
        break;
      }
    }
  }

  async init() {
    try {
      const [groups, staff] = await Promise.all([
        StaffService.getStaffGroups(),
        StaffService.getStaffList()
      ]);
      this.staffGroups = groups || [];
      this.staffList = staff || [];
      
      // Fallback if groups are empty
      if (!this.staffGroups || this.staffGroups.length === 0) {
        this.staffGroups = [
          { id: 1, ten_nhom: 'BAN LÃNH ĐẠO KHOA', thu_tu: 1 },
          { id: 2, ten_nhom: 'GIẢNG VIÊN & TRỢ GIẢNG', thu_tu: 2 }
        ];
      } else {
        // Sort groups by display order (thu_tu)
        this.staffGroups.sort((a, b) => (a.thu_tu || 0) - (b.thu_tu || 0));
      }
    } catch (e) {
      console.error('Lỗi khi nạp dữ liệu nhân sự/nhóm:', e);
      this.staffGroups = [
        { id: 1, ten_nhom: 'BAN LÃNH ĐẠO KHOA', thu_tu: 1 },
        { id: 2, ten_nhom: 'GIẢNG VIÊN & TRỢ GIẢNG', thu_tu: 2 }
      ];
    }

    // Check if URL has ?id= or ?email= to auto-open a staff profile
    const urlParams = new URLSearchParams(window.location.search);
    const paramId    = urlParams.get('id');
    const paramEmail = urlParams.get('email');
    const paramName  = urlParams.get('name');

    console.log('[Staff] URL params:', { paramId, paramEmail, paramName });
    console.log('[Staff] Loaded staff list:', this.staffList.map(s => ({ id: s.id, ho_ten: s.ho_ten, email: s.email })));

    if (paramId) {
      const targetStaff = this.staffList.find(s => String(s.id) === String(paramId));
      console.log('[Staff] Found by id:', targetStaff);
      if (targetStaff) {
        await this.showProfile(targetStaff.id);
        return;
      }
    } else if (paramEmail) {
      const targetStaff = this.staffList.find(s => (s.email || '').toLowerCase().trim() === paramEmail.toLowerCase().trim());
      console.log('[Staff] Found by email:', targetStaff);
      if (targetStaff) {
        await this.showProfile(targetStaff.id);
        return;
      }
      // Fallback: match by name if email not found
      console.warn('[Staff] Email không khớp, thử tìm theo tên...');
    } else if (paramName) {
      const decodedName = decodeURIComponent(paramName);
      const targetStaff = this.staffList.find(s =>
        (s.ho_ten || '').toLowerCase().includes(decodedName.toLowerCase())
      );
      console.log('[Staff] Found by name:', targetStaff);
      if (targetStaff) {
        await this.showProfile(targetStaff.id);
        return;
      }
    }

    this.render();
  }

  /**
   * Transition to the detailed profile view of a staff member
   */
  async showProfile(staffId) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.activeStaffId = staffId;
    this.currentView = 'profile';
    this.renderLoading();

    try {
      // Query database-aligned profiles and achievements in parallel
      const [profile, research, projects, papers, books, supervisions] = await Promise.all([
        StaffService.getStaffProfile(staffId),
        StaffService.getStaffResearchProjects(staffId),
        StaffService.getStaffProjects(staffId),
        StaffService.getStaffPublications(staffId),
        StaffService.getStaffBooks(staffId),
        StaffService.getStaffSupervisions(staffId)
      ]);

      this.profileData = profile;
      this.researchProjects = research;
      this.projects = projects;
      this.publications = papers;
      this.books = books;
      this.supervisions = supervisions;

      this.render();
    } catch (e) {
      console.error('Lỗi tải thông tin chi tiết cán bộ:', e);
      this.currentView = 'directory';
      this.render();
    }
  }

  /**
   * Return to directory view
   */
  goBack() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.currentView = 'directory';
    this.activeStaffId = null;
    this.profileData = null;
    this.render();
  }

  renderLoading() {
    this.innerHTML = `
      <div class="staff-loading-container">
        <div class="staff-spinner"></div>
        <p>Đang tải hồ sơ khoa học...</p>
      </div>
    `;
  }

  /**
   * Returns generic fallback SVG avatar
   */
  getFallbackAvatar() {
    return `
      <svg viewBox="0 0 100 100" class="staff-fallback-svg">
        <circle cx="50" cy="50" r="48" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="2"/>
        <path d="M50 18 A16 16 0 1 0 50 50 A16 16 0 1 0 50 18 Z" fill="#94a3b8"/>
        <path d="M18 82 C18 68, 28 60, 50 60 C72 60, 82 68, 82 82 Z" fill="#64748b"/>
      </svg>
    `;
  }

  render() {
    if (this.currentView === 'directory') {
      this.renderDirectory();
    } else {
      this.renderProfile();
    }
  }

  /**
   * Renders the directory list grouped by groups
   */
  renderDirectory() {
    // Sắp xếp cán bộ giảng viên theo thứ tự trong nhóm (tăng dần)
    const visibleStaff = this.staffList
      .filter(item => item.an_hien !== 0)
      .sort((a, b) => (a.thu_tu_trong_nhom || 0) - (b.thu_tu_trong_nhom || 0));

    const renderCard = (item) => {
      // Làm sạch đường dẫn trong DB nếu lỡ lưu có '../' ở đầu
      let rawPath = item.anh_ca_nhan_url || '';
      if (rawPath.startsWith('../')) {
        rawPath = rawPath.substring(3);
      }
      const imgPath = `${this.assetPrefix}${rawPath}`;
      const avatarHtml = `
        <div class="staff-card-img-container">
          <img src="${imgPath}" alt="${item.ho_ten}" class="staff-card-img" onerror="this.style.display='none'; if(this.nextElementSibling) this.nextElementSibling.style.display='flex';">
          <div class="staff-fallback-avatar-wrapper" style="display: none; width: 100%; height: 100%; align-items: center; justify-content: center;">
            ${this.getFallbackAvatar()}
          </div>
        </div>
      `;

      const titleAndName = item.ho_ten;
      const subtitle = item.chuc_vu;

      return `
        <div class="staff-card-3d-wrap" onclick="this.closest('staff-directory-component').showProfile(${item.id})">
          <div class="staff-card-3d">
            ${avatarHtml}
            <div class="staff-card-info">
              <h3 class="staff-card-name">${titleAndName}</h3>
              <p class="staff-card-role">${subtitle}</p>
            </div>
          </div>
        </div>
      `;
    };

    let groupsHtml = '';
    this.staffGroups.forEach(group => {
      const groupStaff = visibleStaff.filter(item => item.nhom_id === group.id);
      
      // Render the section if there is staff inside it, or if it is one of the main groups (1 or 2)
      if (groupStaff.length > 0 || group.id === 1 || group.id === 2) {
        groupsHtml += `
          <div class="staff-group-section">
            <h2 class="staff-group-title">${group.ten_nhom}</h2>
            <div class="staff-grid">
              ${groupStaff.length > 0 
                ? groupStaff.map(renderCard).join('') 
                : '<div style="color:#64748b; padding:20px; font-size:0.95rem; font-weight:500;">Chưa cập nhật cán bộ/giảng viên trong nhóm này.</div>'}
            </div>
          </div>
        `;
      }
    });

    this.innerHTML = `
      <div class="staff-directory-section">
        <div class="staff-banner-container">
          <h1 class="staff-main-title">Nhân Sự Khoa Công Nghệ Thông Tin</h1>
          <p class="staff-main-desc">Đội ngũ cán bộ, viên chức và người lao động thuộc Khoa Công nghệ thông tin - Đại học Trà Vinh</p>
        </div>

        ${groupsHtml}
      </div>
    `;
  }

  /**
   * Renders the detailed portfolio page
   */
  renderProfile() {
    const staff = this.staffList.find(item => item.id === this.activeStaffId);
    if (!staff) return;

    const pData = this.profileData || {
      nhan_vien_id: staff.id,
      email: staff.email,
      ngach_vien_chuc: staff.ngach_vien_chuc || 'Giảng viên',
      hoc_vi: staff.hoc_vi || 'Cử nhân',
      hoc_ham: staff.hoc_ham || '',
      don_vi_cong_tac: staff.don_vi_cong_tac || 'Khoa Công nghệ thông tin',
      linh_vuc_nghien_cuu: 'Chưa cập nhật',
      google_scholar_url: '#',
      orcid_url: '#',
      github_url: '#',
      website_ca_nhan: '#'
    };

    const rawResearchField = pData.linh_vuc_nghien_cuu || '';
    const cleanResearchField = rawResearchField.split('||hide:')[0] || 'Chưa cập nhật';
    const hideConfig = rawResearchField.includes('||hide:') ? rawResearchField.split('||hide:')[1] : '';
    const hiddenSections = hideConfig ? hideConfig.split(',') : [];

    let rawPath = staff.anh_ca_nhan_url || '';
    if (rawPath.startsWith('../')) {
      rawPath = rawPath.substring(3);
    }
    const imgPath = `${this.assetPrefix}${rawPath}`;
    const avatarHtml = `
      <img src="${imgPath}" alt="${staff.ho_ten}" class="profile-avatar-img" onerror="this.style.display='none'; if(this.nextElementSibling) this.nextElementSibling.style.display='flex';">
      <div class="staff-fallback-avatar-wrapper" style="display: none; width: 100%; height: 100%; align-items: center; justify-content: center;">
        ${this.getFallbackAvatar()}
      </div>
    `;

    // 1. Table of Research Projects
    let researchTableHtml = `
      <div class="profile-empty-section">Chưa cập nhật đề tài nghiên cứu.</div>
    `;
    if (this.researchProjects && this.researchProjects.length > 0) {
      researchTableHtml = `
        <div class="profile-table-wrapper">
          <table class="profile-table">
            <thead>
              <tr>
                <th style="width: 60px;">STT</th>
                <th>Tên đề tài nghiên cứu/lĩnh vực áp dụng</th>
                <th style="width: 140px; text-align: center;">Năm hoàn thành</th>
                <th>Đề tài cấp (Tỉnh, bộ, ngành, cơ sở)</th>
                <th>Trách nhiệm tham gia</th>
              </tr>
            </thead>
            <tbody>
              ${this.researchProjects.map(proj => `
                <tr>
                  <td style="text-align: center; font-weight: 700; color: #0f6fff;">${proj.stt}</td>
                  <td style="font-weight: 600; color: #1e293b;">${proj.ten_de_tai}</td>
                  <td style="text-align: center; font-weight: 500;">${proj.nam_hoan_thanh}</td>
                  <td><span class="badge-level">${proj.cap_de_tai}</span></td>
                  <td style="font-weight: 600; color: #0096c7;">${proj.trach_nhiem_tham_gia}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    }

    // 2. Projects (Dự án)
    let projectsHtml = `
      <div class="profile-empty-section">Chưa cập nhật dự án.</div>
    `;
    if (this.projects && this.projects.length > 0) {
      projectsHtml = `
        <div class="projects-list">
          ${this.projects.map(proj => `
            <div class="project-item-3d">
              <div class="project-header">
                <span class="project-icon">📂</span>
                <h4 class="project-title">${proj.ten_du_an}</h4>
                <span class="project-year">${proj.nam_thuc_hien}</span>
              </div>
              <div class="project-body">
                <p><strong>Vai trò:</strong> <span style="color: #0f6fff; font-weight: 700;">${proj.vai_tro}</span></p>
                <p>${proj.mo_ta}</p>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }

    // 3. Publications (Bài báo khoa học)
    let publicationsHtml = `
      <div class="profile-empty-section">Chưa cập nhật bài báo khoa học.</div>
    `;
    if (this.publications && this.publications.length > 0) {
      const engPapers = this.publications.filter(p => p.loai_xuat_ban === 'tieng_anh');
      const viPapers = this.publications.filter(p => p.loai_xuat_ban !== 'tieng_anh');

      publicationsHtml = `
        <div class="papers-container">
          ${engPapers.length > 0 ? `
            <h4 class="papers-sub-title">Tiếng Anh / International Publications</h4>
            <ul class="papers-list">
              ${engPapers.map(paper => `
                <li>
                  <span class="paper-stt">${paper.stt}.</span>
                  <span class="paper-authors">${paper.danh_sach_tac_gia}</span> (${paper.nam_xuat_ban}). 
                  <strong class="paper-title">"${paper.ten_bai_bao}"</strong>. 
                  <em class="paper-journal">${paper.ten_tap_chi_hoi_nghi}</em>, ${paper.so_tap_chi_trang}. 
                  <span class="paper-status">${paper.trang_thai_xuat_ban}</span>
                </li>
              `).join('')}
            </ul>
          ` : ''}

          ${viPapers.length > 0 ? `
            <h4 class="papers-sub-title" style="margin-top: 24px;">Tiếng Việt / Domestic Publications</h4>
            <ul class="papers-list">
              ${viPapers.map(paper => `
                <li>
                  <span class="paper-stt">${paper.stt}.</span>
                  <span class="paper-authors">${paper.danh_sach_tac_gia}</span> (${paper.nam_xuat_ban}). 
                  <strong class="paper-title">"${paper.ten_bai_bao}"</strong>. 
                  <em class="paper-journal">${paper.ten_tap_chi_hoi_nghi}</em>, ${paper.so_tap_chi_trang}. 
                  <span class="paper-status">${paper.trang_thai_xuat_ban}</span>
                </li>
              `).join('')}
            </ul>
          ` : ''}
        </div>
      `;
    }

    // 4. Books and teaching syllabus (Sách và giáo trình)
    let booksHtml = `
      <div class="profile-empty-section">Chưa cập nhật sách và giáo trình.</div>
    `;
    if (this.books && this.books.length > 0) {
      booksHtml = `
        <div class="books-grid">
          ${this.books.map(book => `
            <div class="book-card-3d">
              <div class="book-spine"></div>
              <div class="book-cover">
                <span class="book-icon">📘</span>
                <h4 class="book-title">${book.ten_sach_giao_trinh}</h4>
                <p class="book-publisher">${book.nha_xuat_ban} (${book.nam_xuat_ban})</p>
                <div class="book-badge">${book.vai_tro}</div>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }

    // 5. Supervisions (Hướng dẫn NCKH)
    let supervisionsHtml = `
      <div class="profile-empty-section">Chưa hướng dẫn nghiên cứu sinh, học viên cao học hay sinh viên NCKH.</div>
    `;
    if (this.supervisions && this.supervisions.length > 0) {
      const typeIcons = {
        ncs: '🎓',
        hoc_vien_cao_hoc: '👨‍🎓',
        sinh_vien_nckh: '💻'
      };
      const typeLabels = {
        ncs: 'Hướng dẫn Nghiên cứu sinh (PhD)',
        hoc_vien_cao_hoc: 'Hướng dẫn Học viên Cao học (Master)',
        sinh_vien_nckh: 'Hướng dẫn Sinh viên Nghiên cứu khoa học'
      };

      supervisionsHtml = `
        <div class="supervisions-list">
          ${this.supervisions.map(item => `
            <div class="supervision-card-3d">
              <div class="supervision-icon-box">${typeIcons[item.loai_hoc_vien] || '👨‍🎓'}</div>
              <div class="supervision-content">
                <div class="supervision-label">${typeLabels[item.loai_hoc_vien]}</div>
                <h4 class="supervision-student"><strong>Học viên:</strong> ${item.ten_hoc_vien}</h4>
                <p class="supervision-topic"><strong>Đề tài:</strong> "${item.ten_de_tai_huong_dan}"</p>
                <div class="supervision-year">Năm bảo vệ: ${item.nam_bao_ve || 'Đang thực hiện'}</div>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }

    this.innerHTML = `
      <div class="profile-layout-container">
        <!-- Back Button -->
        <button class="back-btn-3d" onclick="this.parentNode.parentNode.goBack()">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="back-arrow-icon"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          <span>Quay lại danh sách nhân sự</span>
        </button>

        <div class="profile-main-grid">
          <!-- Left Column: Avatar & Summary -->
          <div class="profile-left-col">
            <div class="profile-summary-card-3d">
              <div class="profile-avatar-wrapper">
                ${avatarHtml}
              </div>
              <h2 class="profile-name">${staff.ho_ten}</h2>
              <p class="profile-title">${staff.hoc_vi}, ${pData.ngach_vien_chuc}</p>
              <p class="profile-faculty-desc">${pData.don_vi_cong_tac || staff.don_vi_cong_tac || 'Giảng viên Khoa Công nghệ thông tin'}</p>
              
              <!-- Contact social row -->
              <div class="profile-social-row">
                ${staff.an_hien_email !== 0 ? `
                  <a href="mailto:${pData.email || staff.email}" class="social-icon-btn" title="Gửi Email">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  </a>
                ` : ''}
                <a href="tel:02943855246" class="social-icon-btn" title="Điện thoại">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                </a>
                <a href="https://facebook.com" target="_blank" class="social-icon-btn" title="Facebook">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                </a>
              </div>
            </div>
          </div>

          <!-- Right Column: Personal Information Details -->
          <div class="profile-right-col">
            <div class="personal-info-card-3d">
              <h3 class="personal-info-heading">📝 Thông tin cá nhân</h3>
              <ul class="personal-info-list">
                ${staff.an_hien_email !== 0 ? `
                  <li>
                    <span class="info-label">📧 Email:</span>
                    <span class="info-val"><a href="mailto:${pData.email || staff.email}">${pData.email || staff.email}</a></span>
                  </li>
                ` : ''}
                <li>
                  <span class="info-label">🏛️ Ngạch viên chức:</span>
                  <span class="info-val">${pData.ngach_vien_chuc}</span>
                </li>
                <li>
                  <span class="info-label">🎓 Trình độ chuyên môn:</span>
                  <span class="info-val">${pData.hoc_vi}</span>
                </li>
                <li>
                  <span class="info-label">🎖️ Học hàm:</span>
                  <span class="info-val">${pData.hoc_ham || 'Chưa phong'}</span>
                </li>
                <li>
                  <span class="info-label">🏢 Đơn vị công tác:</span>
                  <span class="info-val">${pData.don_vi_cong_tac}</span>
                </li>
                <li>
                  <span class="info-label">🔬 Lĩnh vực nghiên cứu:</span>
                  <span class="info-val">${cleanResearchField}</span>
                </li>
                <li>
                  <span class="info-label">📊 Google Scholar:</span>
                  <span class="info-val"><a href="${pData.google_scholar_url}" target="_blank">Xem Link</a></span>
                </li>
                <li>
                  <span class="info-label">🆔 ORCID ID:</span>
                  <span class="info-val"><a href="${pData.orcid_url}" target="_blank">Xem Link</a></span>
                </li>
                <li>
                  <span class="info-label">💻 Github:</span>
                  <span class="info-val"><a href="${pData.github_url}" target="_blank">Xem Link</a></span>
                </li>
                <li>
                  <span class="info-label">🌐 Website cá nhân:</span>
                  <span class="info-val"><a href="${pData.website_ca_nhan}" target="_blank">Xem Link</a></span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Full-Width Bottom Sections -->
        <div class="profile-details-sections">
          
          <!-- 1. Research Projects (Đề tài NCKH các cấp) -->
          ${hiddenSections.includes('nckh') ? '' : `
            <div class="profile-section-card-3d">
              <h3 class="section-title-3d">🧪 Đề tài NCKH các cấp</h3>
              ${researchTableHtml}
            </div>
          `}

          <!-- 2. Projects (Dự án) -->
          ${hiddenSections.includes('project') ? '' : `
            <div class="profile-section-card-3d">
              <h3 class="section-title-3d">💼 Dự án / Project</h3>
              ${projectsHtml}
            </div>
          `}

          <!-- 3. Scientific Papers (Bài báo khoa học) -->
          ${hiddenSections.includes('paper') ? '' : `
            <div class="profile-section-card-3d">
              <h3 class="section-title-3d">📘 Bài báo khoa học</h3>
              ${publicationsHtml}
            </div>
          `}

          <!-- 4. Books and Teaching Syllabus (Sách và giáo trình) -->
          ${hiddenSections.includes('book') ? '' : `
            <div class="profile-section-card-3d">
              <h3 class="section-title-3d">📚 Sách và Giáo trình giảng dạy</h3>
              ${booksHtml}
            </div>
          `}

          <!-- 5. Thesis Supervision (Hướng dẫn học viên) -->
          ${hiddenSections.includes('supervision') ? '' : `
            <div class="profile-section-card-3d">
              <h3 class="section-title-3d">👨‍🎓 Hướng dẫn Nghiên cứu sinh, Học viên cao học, SV NCKH</h3>
              ${supervisionsHtml}
            </div>
          `}

        </div>
      </div>
    `;
  }
}

// Register custom element
if (!customElements.get('staff-directory-component')) {
  customElements.define('staff-directory-component', StaffDirectoryComponent);
}
