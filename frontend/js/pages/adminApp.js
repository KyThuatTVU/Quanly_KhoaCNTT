/**
 * ==========================================================================
 * MAIN ADMIN PORTAL APPLICATION CONTROLLER (UPGRADED FULL PAGE MANAGERS)
 * ==========================================================================
 * Orchestrates Google OAuth UI authentication state, categorized sidebar 
 * navigation, custom page forms, detailed data tables, and RESTful API CRUD
 * for EVERY single public page section (Homepage, About, Staff, Research, 
 * Undergraduate, Postgraduate, News, System Settings).
 */

import { AdminAuthService } from '../services/adminAuthService.js';
import { AdminApiService } from '../services/adminApiService.js';
import { renderAdminSidebar, ADMIN_NAV_CATEGORIES } from '../components/adminSidebar.js';

class AdminApp {
  constructor() {
    this.currentNav = 'dashboard';
    this.currentEntityData = [];
    this.editingId = null;
  }

  init() {
    console.log('Khởi tạo Cổng Quản Trị Admin Khoa CNTT TVU...');
    this.bindAuthEvents();
    this.checkAuthState();
    this.bindGlobalEvents();
  }

  /**
   * 1. GOOGLE OAUTH LOGIN UI BINDINGS
   */
  bindAuthEvents() {
    const loginBtn = document.getElementById('btnGoogleSignIn');
    if (loginBtn) {
      loginBtn.addEventListener('click', () => {
        this.handleLogin('lamnn@tvu.edu.vn');
      });
    }

    const demoItems = document.querySelectorAll('.demo-account-item');
    demoItems.forEach(item => {
      item.addEventListener('click', () => {
        const email = item.getAttribute('data-email');
        this.handleLogin(email);
      });
    });

    const logoutBtn = document.getElementById('btnLogoutAdmin');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        AdminAuthService.logout();
        this.showLoginOverlay();
        this.showToast('Đã đăng xuất tài khoản Admin Google.', 'info');
      });
    }
  }

  async handleLogin(email) {
    const user = await AdminAuthService.loginWithGoogle(email);
    this.hideLoginOverlay();
    this.updateHeaderProfile(user);
    this.showToast(`Chào mừng ${user.ho_ten}! Đăng nhập thành công.`, 'success');
    this.navigate('dashboard');
  }

  checkAuthState() {
    if (AdminAuthService.isLoggedIn()) {
      const user = AdminAuthService.getCurrentUser();
      this.hideLoginOverlay();
      this.updateHeaderProfile(user);
      renderAdminSidebar(this.currentNav);
      this.navigate(this.currentNav);
    } else {
      console.log('Bypassing Google login and automatically logging in as TS. Nguyễn Nhứt Lam...');
      this.handleLogin('lamnn@tvu.edu.vn');
    }
  }

  showLoginOverlay() {
    const overlay = document.getElementById('googleLoginOverlay');
    if (overlay) overlay.classList.remove('hidden');
  }

  hideLoginOverlay() {
    const overlay = document.getElementById('googleLoginOverlay');
    if (overlay) overlay.classList.add('hidden');
  }

  updateHeaderProfile(user) {
    if (!user) return;
    const avatarEl = document.getElementById('headerUserAvatar');
    const nameEl = document.getElementById('headerUserName');
    const roleEl = document.getElementById('headerUserRole');

    if (avatarEl && user.avatar_url) avatarEl.src = user.avatar_url;
    if (nameEl) nameEl.textContent = user.ho_ten;
    if (roleEl) roleEl.textContent = user.quyen_han;
  }

  /**
   * 2. SIDEBAR NAVIGATION & ROUTING
   */
  bindGlobalEvents() {
    // Theme toggle
    const themeBtn = document.getElementById('themeToggleBtn');
    if (themeBtn) {
      themeBtn.textContent = document.body.classList.contains('dark-theme') ? '☀️' : '🌙';
      themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        themeBtn.textContent = isDark ? '☀️' : '🌙';
      });
    }

    // Mobile sidebar toggle
    const mobileBtn = document.getElementById('mobileSidebarToggle');
    const sidebar = document.getElementById('adminSidebar');
    if (mobileBtn && sidebar) {
      mobileBtn.addEventListener('click', () => {
        sidebar.classList.toggle('mobile-open');
      });
    }

    // Sidebar navigation click delegate
    document.addEventListener('click', (e) => {
      const navItem = e.target.closest('.nav-menu-item');
      if (navItem) {
        const key = navItem.getAttribute('data-nav');
        if (key) {
          this.navigate(key);
          if (sidebar) sidebar.classList.remove('mobile-open');
        }
      }
    });

    document.addEventListener('click', (e) => {
      const uploadTrigger = e.target.closest('.btn-upload-label');
      if (!uploadTrigger) return;

      const fileInputId = uploadTrigger.getAttribute('data-file-input-id');
      const fileInput = fileInputId ? document.getElementById(fileInputId) : null;
      if (fileInput) {
        fileInput.click();
      }
    });

    // Modal controls
    const closeBtn = document.getElementById('btnCloseModal');
    const cancelBtn = document.getElementById('btnCancelModal');
    if (closeBtn) closeBtn.addEventListener('click', () => this.closeModal());
    if (cancelBtn) cancelBtn.addEventListener('click', () => this.closeModal());

    const modalForm = document.getElementById('adminDynamicForm');
    if (modalForm) {
      modalForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
    }

    // Listener for file selection on local uploader fields
    document.addEventListener('change', async (e) => {
      if (e.target && e.target.classList.contains('local-image-uploader')) {
        const fileInput = e.target;
        const targetId = fileInput.getAttribute('data-target-id');
        const targetField = document.getElementById(targetId);
        if (!fileInput.files || fileInput.files.length === 0) return;

        const file = fileInput.files[0];
        const formData = new FormData();
        formData.append('image', file);

        // Find the parent label and change its text to loading/uploading
        const label = fileInput.closest('.btn-upload-label');
        const originalText = label ? label.innerHTML : '📁 Tải lên';
        if (label) {
          label.innerHTML = '⏳ Đang tải...';
          label.style.opacity = '0.7';
          label.style.pointerEvents = 'none';
        }

        try {
          const response = await fetch('${window.location.port === '5500' ? 'http://localhost:5000' : ''}/api/v1/admin/upload', {
            method: 'POST',
            body: formData
          });

          if (!response.ok) {
            throw new Error(`HTTP Error! Status: ${response.status}`);
          }

          const result = await response.json();
          if (result.success && result.imageUrl) {
            if (targetField) {
              targetField.value = result.imageUrl;
              targetField.dispatchEvent(new Event('input'));
            }
            this.showToast('Tải ảnh lên thành công!', 'success');
          } else {
            throw new Error(result.error || 'Tải lên thất bại!');
          }
        } catch (err) {
          console.error('Lỗi upload file:', err);
          this.showToast(`Lỗi upload: ${err.message}`, 'error');
        } finally {
          if (label) {
            label.innerHTML = originalText;
            label.style.opacity = '1';
            label.style.pointerEvents = 'auto';
          }
        }
      }
    });
  }

  async navigate(navKey) {
    this.currentNav = navKey;
    renderAdminSidebar(navKey);

    const titleEl = document.getElementById('adminPageTitle');
    const contentArea = document.getElementById('adminContentArea');

    if (!contentArea) return;

    if (navKey === 'dashboard') {
      if (titleEl) titleEl.textContent = 'Tổng quan Bảng điều khiển';
      this.renderDashboardPanel(contentArea);
    } else {
      if (titleEl) titleEl.textContent = `Quản lý: ${this.getNavLabel(navKey)}`;
      await this.renderEntityPanel(contentArea, navKey);
    }
  }

  getNavLabel(navKey) {
    const labels = {
      dashboard: 'Dashboard Tổng quan',
      staff: 'Cán bộ - Giảng viên',
      staffGroups: 'Nhóm Nhân sự Khoa',
      staffProfiles: 'Trang cá nhân chi tiết',
      staffResearch: 'Đề tài NCKH Cá nhân',
      staffPapers: 'Bài báo Khoa học Cá nhân',
      staffProjects: 'Dự án & Chuyển giao',
      staffBooks: 'Sách & Giáo trình',
      staffSupervisions: 'Hướng dẫn NCKH các bậc',
      homepageHero: 'Slogan & Hero Banner Trang chủ',
      sliders: 'Carousel Slider Banners',
      homepageAdmissions: 'Box Tuyển sinh 2026',
      homepagePrograms: 'Chương trình Đào tạo Nổi bật',
      infographics: 'Infographic A4 Items',
      homepageEvents: 'Ticker Sự kiện Tiêu điểm',
      stats: 'Số liệu Thống kê Counter',
      students: 'Sinh viên & Đội nhóm Tiêu biểu',
      alumni: 'Cựu sinh viên Tiêu biểu',
      homepageGallery: 'Slide Ảnh Hoạt động',
      aboutOverview: 'Tổng quan Khoa FIT',
      aboutHighlights: '3 Thẻ Highlight Giới thiệu',
      timeline: '8 Mốc Lịch sử (Timeline)',
      aboutMission: 'Sứ mệnh & Tầm nhìn 2030',
      partners: 'Đối tác Hợp tác Quốc tế',
      aboutDeansContact: 'Thẻ Liên hệ Ban Giám Khoa',
      aboutUnitContact: 'Thông tin Địa chỉ Đơn vị',
      researchDirections: 'Hướng Nghiên cứu chính',
      researchProjects: 'Đề tài NCKH các cấp',
      researchPublications: 'Công bố Citrus BibTeX',
      researchLabs: 'Phòng Thí nghiệm CVIP',
      researchContacts: 'Đầu mối Liên hệ NC',
      undergradPrograms: 'Ngành Đào tạo CNTT & AI',
      undergradMethods: 'Phương thức & Tổ hợp môn',
      undergradCurriculum: 'Lộ trình 3 Khối kiến thức',
      undergradPlos: 'Chuẩn đầu ra PLOs',
      undergradCourses: 'Học phần Công nghệ Cốt lõi',
      undergradFaqs: 'FAQ Câu hỏi thường gặp',
      postgradNotices: 'Thông báo Tuyển sinh Sau ĐH',
      postgradPhdStudents: 'Danh sách Nghiên cứu sinh',
      postgradStats: 'Thống kê Chartsy HV & NCS',
      news: 'Bài đăng Tin tức & Timeline',
      gallery: 'Thư viện ảnh chung Gallery',
      adminAccounts: 'Tài khoản Quản trị',
      apiMonitor: 'Trạng thái Hệ thống'
    };
    return labels[navKey] || navKey;
  }

  getFallbackTitle(entityKey, item) {
    const fallbacks = {
      staff: 'Giảng viên',
      staffGroups: 'Nhóm nhân sự',
      staffProfiles: 'Trang cá nhân',
      staffResearch: 'Đề tài NCKH',
      staffPapers: 'Bài báo',
      staffProjects: 'Dự án',
      staffBooks: 'Sách/Giáo trình',
      staffSupervisions: 'Hướng dẫn NCKH',
      sliders: 'Banner Slide',
      homepageAdmissions: 'Thông tin tuyển sinh',
      homepagePrograms: 'Chương trình đào tạo',
      infographics: 'Infographic',
      homepageEvents: 'Sự kiện',
      stats: 'Thống kê',
      students: 'Sinh viên tiêu biểu',
      alumni: 'Cựu sinh viên',
      homepageGallery: 'Ảnh hoạt động',
      aboutHighlights: 'Điểm nổi bật',
      timeline: 'Mốc lịch sử',
      partners: 'Đối tác',
      aboutDeansContact: 'Liên hệ BGK',
      researchDirections: 'Hướng nghiên cứu',
      researchProjects: 'Đề tài NC',
      researchPublications: 'Công bố KH',
      researchLabs: 'Phòng thí nghiệm',
      researchContacts: 'Liên hệ NC',
      undergradPrograms: 'Ngành đào tạo',
      undergradMethods: 'Phương thức TS',
      undergradCurriculum: 'Khối kiến thức',
      undergradPlos: 'Chuẩn đầu ra',
      undergradCourses: 'Học phần',
      undergradFaqs: 'Câu hỏi FAQ',
      postgradNotices: 'Thông báo',
      postgradPhdStudents: 'Nghiên cứu sinh',
      postgradStats: 'Thống kê',
      news: 'Tin tức',
      gallery: 'Hình ảnh',
      adminAccounts: 'Tài khoản'
    };
    const prefix = fallbacks[entityKey] || 'Mục';
    return `${prefix} #${item.id}`;
  }

  /**
   * 3. DASHBOARD & PANEL RENDERERS
   */
  renderDashboardPanel(container) {
    container.innerHTML = `
      <div class="dashboard-panel">
        
        <!-- QUICK STATS CARDS -->
        <div class="stats-cards-grid">
          <div class="stat-card">
            <div class="stat-icon-wrapper">👔</div>
            <div>
              <div class="stat-val">38+</div>
              <div class="stat-lbl">Giảng viên & Cán bộ</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon-wrapper">📰</div>
            <div>
              <div class="stat-val">120+</div>
              <div class="stat-lbl">Bài đăng Tin tức & Sự kiện</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon-wrapper">🔬</div>
            <div>
              <div class="stat-val">45+</div>
              <div class="stat-lbl">Đề tài NCKH & Công bố</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon-wrapper">🎓</div>
            <div>
              <div class="stat-val">1,500+</div>
              <div class="stat-lbl">Sinh viên & NCS Khoa</div>
            </div>
          </div>
        </div>

        <!-- PAGE DIRECTORY SHORTCUTS -->
        <div class="table-card" style="padding: 24px;">
          <h3 style="font-size:1.15rem; font-weight:700; margin-bottom:16px; display:flex; align-items:center; gap:8px;">
            <span>📌</span> Phím Tắt Quản Lý Nhanh Các Trang Người Dùng Xem
          </h3>
          <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:16px;">
            
            <div style="background:rgba(255,255,255,0.04); padding:16px; border-radius:12px; border:1px solid var(--admin-card-border);">
              <div style="font-weight:700; color:var(--admin-accent); margin-bottom:6px;">🏠 Trang Chủ (Home Page)</div>
              <p style="font-size:0.82rem; color:var(--admin-text-muted); margin-bottom:12px;">Quản lý Slogan, Banner Hero, Box Tuyển sinh 2026, 4 Thẻ Đào tạo, Infographics, Ticker, Stats counter & Sliders.</p>
              <button type="button" class="btn-secondary" onclick="document.querySelector('[data-nav=\\'homepageHero\\']').click()" style="font-size:0.8rem; padding:6px 12px;">Quản lý Trang chủ →</button>
            </div>

            <div style="background:rgba(255,255,255,0.04); padding:16px; border-radius:12px; border:1px solid var(--admin-card-border);">
              <div style="font-weight:700; color:var(--admin-accent); margin-bottom:6px;">ℹ️ Trang Giới Thiệu (About Page)</div>
              <p style="font-size:0.82rem; color:var(--admin-text-muted); margin-bottom:12px;">Quản lý Văn bản giới thiệu tổng quan, 3 Thẻ Highlights, 8 Mốc Lịch sử Timeline, Sứ mệnh Tầm nhìn & Đối tác Quốc tế.</p>
              <button type="button" class="btn-secondary" onclick="document.querySelector('[data-nav=\\'aboutOverview\\']').click()" style="font-size:0.8rem; padding:6px 12px;">Quản lý Trang Giới thiệu →</button>
            </div>

            <div style="background:rgba(255,255,255,0.04); padding:16px; border-radius:12px; border:1px solid var(--admin-card-border);">
              <div style="font-weight:700; color:var(--admin-accent); margin-bottom:6px;">👥 Trang Nhân Sự (Staff Directory)</div>
              <p style="font-size:0.82rem; color:var(--admin-text-muted); margin-bottom:12px;">Quản lý Danh sách Giảng viên, Thẻ Ban Lãnh đạo, Học hàm học vị, Hồ sơ cá nhân (Đề tài, Bài báo, Sách, Hướng dẫn).</p>
              <button type="button" class="btn-secondary" onclick="document.querySelector('[data-nav=\\'staff\\']').click()" style="font-size:0.8rem; padding:6px 12px;">Quản lý Trang Nhân sự →</button>
            </div>

            <div style="background:rgba(255,255,255,0.04); padding:16px; border-radius:12px; border:1px solid var(--admin-card-border);">
              <div style="font-weight:700; color:var(--admin-accent); margin-bottom:6px;">🔬 Trang Nghiên Cứu (Research Page)</div>
              <p style="font-size:0.82rem; color:var(--admin-text-muted); margin-bottom:12px;">Quản lý Hướng nghiên cứu chính, Đề tài NCKH các cấp, Danh mục Bài báo Citrus BibTeX, Phòng thí nghiệm CVIP.</p>
              <button type="button" class="btn-secondary" onclick="document.querySelector('[data-nav=\\'researchProjects\\']').click()" style="font-size:0.8rem; padding:6px 12px;">Quản lý Trang Nghiên cứu →</button>
            </div>

            <div style="background:rgba(255,255,255,0.04); padding:16px; border-radius:12px; border:1px solid var(--admin-card-border);">
              <div style="font-weight:700; color:var(--admin-accent); margin-bottom:6px;">🎓 Trang Đào Tạo Đại Học</div>
              <p style="font-size:0.82rem; color:var(--admin-text-muted); margin-bottom:12px;">Quản lý Ngành CNTT & AI, Phương thức xét tuyển, Lộ trình 3 khối kiến thức, Chuẩn đầu ra PLOs & FAQ.</p>
              <button type="button" class="btn-secondary" onclick="document.querySelector('[data-nav=\\'undergradPrograms\\']').click()" style="font-size:0.8rem; padding:6px 12px;">Quản lý Đào tạo Đại học →</button>
            </div>

            <div style="background:rgba(255,255,255,0.04); padding:16px; border-radius:12px; border:1px solid var(--admin-card-border);">
              <div style="font-weight:700; color:var(--admin-accent); margin-bottom:6px;">📚 Trang Sau Đại Học</div>
              <p style="font-size:0.82rem; color:var(--admin-text-muted); margin-bottom:12px;">Quản lý Thông báo Tuyển sinh Tiến sĩ/Thạc sĩ 2026, Danh sách 7 Nghiên cứu sinh Tiến sĩ KHMT & Thống kê Chartsy.</p>
              <button type="button" class="btn-secondary" onclick="document.querySelector('[data-nav=\\'postgradPhdStudents\\']').click()" style="font-size:0.8rem; padding:6px 12px;">Quản lý Sau Đại học →</button>
            </div>

          </div>
        </div>

        <!-- SYSTEM STATUS CARD -->
        <div class="table-card" style="padding: 24px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
            <h3 style="font-size:1.1rem; font-weight:700;">⚙️ Trạng thái Hệ thống</h3>
            <span class="badge-status success">Hệ thống Đang Hoạt động</span>
          </div>
          <p style="color:var(--admin-text-muted); font-size:0.9rem; line-height:1.6;">
            Hệ thống quản lý dữ liệu website Khoa Công nghệ thông tin - Trường Đại học Trà Vinh. Người quản trị có thể thay đổi, cập nhật các danh mục bài viết, nhân sự và thông tin đào tạo hiển thị trực tiếp trên trang chủ.
          </p>
        </div>

      </div>
    `;
  }

  async renderEntityPanel(container, entityKey) {
    container.innerHTML = `<div style="padding:40px; text-align:center; color:var(--admin-text-muted);">Đang tải dữ liệu...</div>`;
    
    if (['staffProfiles', 'staffResearch', 'staffPapers', 'staffProjects', 'staffBooks', 'staffSupervisions'].includes(entityKey)) {
      try {
        this.staffList = await AdminApiService.getList('staff');
      } catch (err) {
        console.warn('Không thể nạp danh sách cán bộ để liên kết:', err);
        this.staffList = [];
      }
    }

    this.currentEntityData = await AdminApiService.getList(entityKey);

    let rowsHtml = '';
    if (this.currentEntityData.length === 0) {
      rowsHtml = `<tr><td colspan="6" style="text-align:center; color:var(--admin-text-muted); padding:30px;">Chưa có bản ghi nào trong danh mục này.</td></tr>`;
    } else {
      this.currentEntityData.forEach((item, idx) => {
        const title = item.ten_chi_so || item.ten_nhom || item.ten_doi_tac || item.ten_don_vi || item.ten_daidien || item.ten_phuong_thuc || item.ma_plo || item.cau_hoi || item.tieu_de_thong_bao || item.tieu_de_bieu_do || item.nam || item.ho_ten || item.ten_bai_bao || item.tieu_de || item.ten_de_tai || item.ten_nganh || item.ten_slide || item.ten || item.name || this.getFallbackTitle(entityKey, item);
        const sub = item.slug_nhom || item.truong_don_vi || item.chuc_vu_nhiem_vu || item.chuc_vu || item.nam_hoan_thanh || item.ngay_dang || item.ma_tuyen_sinh || item.email || item.vai_tro || item.cap_de_tai || item.danh_sach_to_hop || '';
        const img = item.anh_ca_nhan_url || item.hinh_anh_url || item.file_anh_url || item.logo_url || item.src_chinh || item.avatar_url || null;
        
        rowsHtml += `
          <tr>
            <td>${idx + 1}</td>
            <td>
              <div class="table-avatar-cell">
                ${img ? `<img src="${img}" class="table-img" onerror="this.style.display='none'">` : ''}
                <div>
                  <div style="font-weight:600;">${title}</div>
                  ${sub ? `<div style="font-size:0.78rem; color:var(--admin-text-muted);">${sub}</div>` : ''}
                </div>
              </div>
            </td>
            <td>${item.ngay_cap_nhat || item.ngay_tao || '2026-08-09'}</td>
            <td><span class="badge-status success">Hoạt động</span></td>
            <td>
              <div class="table-actions-cell">
                <button type="button" class="btn-icon-action edit" data-id="${item.id}" title="Chỉnh sửa">✏️</button>
                <button type="button" class="btn-icon-action delete" data-id="${item.id}" title="Xóa">🗑️</button>
              </div>
            </td>
          </tr>
        `;
      });
    }

    container.innerHTML = `
      <div class="dashboard-panel">
        <div class="section-toolbar">
          <div class="section-title-group">
            <h2>${this.getNavLabel(entityKey)}</h2>
            <p>Chỉnh sửa và cập nhật dữ liệu hiển thị trực tiếp trên trang chủ.</p>
          </div>
          <div class="toolbar-actions">
            <div class="search-input-box">
              <span class="search-icon-svg">🔍</span>
              <input type="text" id="adminSearchInput" placeholder="Tìm kiếm...">
            </div>
            <button type="button" class="btn-admin-primary" id="btnAddNewItem">
              <span>➕</span> Thêm mới
            </button>
          </div>
        </div>

        <div class="table-card">
          <div class="table-responsive">
            <table class="admin-table">
              <thead>
                <tr>
                  <th style="width: 60px;">STT</th>
                  <th>Tên / Tiêu đề chi tiết</th>
                  <th>Ngày cập nhật</th>
                  <th>Trạng thái</th>
                  <th style="width: 110px;">Thao tác</th>
                </tr>
              </thead>
              <tbody id="adminTableBody">
                ${rowsHtml}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    // Bind item actions
    const addBtn = document.getElementById('btnAddNewItem');
    if (addBtn) addBtn.addEventListener('click', () => this.openModalForAdd(entityKey));

    const editBtns = container.querySelectorAll('.btn-icon-action.edit');
    editBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        this.openModalForEdit(entityKey, id);
      });
    });

    const deleteBtns = container.querySelectorAll('.btn-icon-action.delete');
    deleteBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        this.handleDeleteItem(entityKey, id);
      });
    });

    // Bind Search Input
    const searchInput = document.getElementById('adminSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const trs = container.querySelectorAll('#adminTableBody tr');
        trs.forEach(tr => {
          const text = tr.innerText.toLowerCase();
          tr.style.display = text.includes(query) ? '' : 'none';
        });
      });
    }
  }

  /**
   * 4. DYNAMIC MODAL FORM FOR ADD / EDIT (RESTful API POST/PUT)
   */
  openModalForAdd(entityKey) {
    this.editingId = null;
    const modal = document.getElementById('adminModalOverlay');
    const titleEl = document.getElementById('modalTitle');
    const bodyEl = document.getElementById('modalFormBody');

    if (titleEl) titleEl.textContent = `Thêm mới: ${this.getNavLabel(entityKey)}`;
    bodyEl.innerHTML = this.generateFormFields(entityKey, {});

    if (modal) modal.classList.remove('hidden');
  }

  openModalForEdit(entityKey, id) {
    this.editingId = id;
    const item = this.currentEntityData.find(i => String(i.id) === String(id));
    if (!item) return;

    const modal = document.getElementById('adminModalOverlay');
    const titleEl = document.getElementById('modalTitle');
    const bodyEl = document.getElementById('modalFormBody');

    const itemTitle = item.ten_chi_so || item.ho_ten || item.ten_bai_bao || item.tieu_de || item.ten_de_tai || item.ten_nganh || item.ten_slide || item.ten || item.name || item.ten_nhom || item.ten_doi_tac || item.cau_hoi || item.tieu_de_thong_bao || item.tieu_de_bieu_do || item.ma_plo || this.getFallbackTitle(entityKey, item);
    if (titleEl) titleEl.textContent = `Chỉnh sửa: ${itemTitle}`;
    bodyEl.innerHTML = this.generateFormFields(entityKey, item);

    if (modal) modal.classList.remove('hidden');
  }

  closeModal() {
    const modal = document.getElementById('adminModalOverlay');
    if (modal) modal.classList.add('hidden');
    this.editingId = null;
    // Reset submit flag khi đóng modal
    this._isSubmitting = false;
  }

  generateFormFields(entityKey, data) {
    let html = ``;

    // Tailored field templates per category
    if (entityKey === 'staff') {
      html += `
        <div class="form-group">
          <label>Họ và tên Giảng viên (*)</label>
          <input type="text" name="ho_ten" value="${data.ho_ten || ''}" required placeholder="VD: TS. Nguyễn Nhứt Lam">
        </div>
        <div class="form-group">
          <label>Chức vụ (*)</label>
          <input type="text" name="chuc_vu" value="${data.chuc_vu || ''}" required placeholder="VD: Trưởng khoa">
        </div>
        <div class="form-group">
          <label>Học vị (*)</label>
          <select name="hoc_vi">
            <option value="Tiến sĩ" ${data.hoc_vi === 'Tiến sĩ' ? 'selected' : ''}>Tiến sĩ</option>
            <option value="Thạc sĩ" ${data.hoc_vi === 'Thạc sĩ' ? 'selected' : ''}>Thạc sĩ</option>
            <option value="Kỹ sư" ${data.hoc_vi === 'Kỹ sư' ? 'selected' : ''}>Kỹ sư</option>
            <option value="NCS" ${data.hoc_vi === 'NCS' ? 'selected' : ''}>Nghiên cứu sinh (NCS)</option>
          </select>
        </div>
        <div class="form-group">
          <label>Ngạch viên chức</label>
          <input type="text" name="ngach_vien_chuc" value="${data.ngach_vien_chuc || 'Giảng viên'}" placeholder="Giảng viên chính / Giảng viên cao cấp">
        </div>
        <div class="form-group">
          <label>Email công vụ (@tvu.edu.vn)</label>
          <input type="email" name="email" value="${data.email || ''}" placeholder="lamnn@tvu.edu.vn">
        </div>
        <div class="form-group">
          <label>Ảnh đại diện (URL hoặc Tải lên từ máy)</label>
          <div style="display: flex; gap: 8px;">
            <input type="text" name="anh_ca_nhan_url" id="field_anh_ca_nhan_url" value="${data.anh_ca_nhan_url || ''}" placeholder="assets/images/deans/lamnn.jpg" style="flex: 1;">
            <button type="button" class="btn-upload-label" data-file-input-id="upload_staff_avatar_input" style="background: var(--admin-primary); color: #fff; padding: 10px 14px; border-radius: var(--radius-md); cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 0.85rem; font-weight: 600; margin: 0; box-shadow: var(--shadow-sm); transition: all 0.2s; border: 0;">
              📁 Tải lên
            </button>
            <input type="file" id="upload_staff_avatar_input" class="local-image-uploader" data-target-id="field_anh_ca_nhan_url" accept="image/*" style="display: none;">
          </div>
        </div>
      `;
    } else if (entityKey === 'homepageAdmissions') {
      html += `
        <div class="form-group">
          <label>Tiêu đề Khối Tuyển Sinh</label>
          <input type="text" name="tieu_de_box" value="${data.tieu_de_box || '🎓 Tuyển sinh 2026'}" required>
        </div>
        <div class="form-group">
          <label>Mã ngành Trí tuệ nhân tạo (AI)</label>
          <input type="text" name="ma_nganh_ai" value="${data.ma_nganh_ai || '7480107'}">
        </div>
        <div class="form-group">
          <label>Mã ngành Công nghệ thông tin (CS)</label>
          <input type="text" name="ma_nganh_cs" value="${data.ma_nganh_cs || '7480101'}">
        </div>
        <div class="form-group">
          <label>Các tổ hợp xét tuyển</label>
          <input type="text" name="to_hop_xet_tuyen" value="${data.to_hop_xet_tuyen || 'A00, A01, C01, D07'}">
        </div>
      `;
    } else if (entityKey === 'staffProfiles') {
      let staffOptions = '';
      if (this.staffList && this.staffList.length > 0) {
        staffOptions = this.staffList.map(s => 
          `<option value="${s.id}" ${String(s.id) === String(data.nhan_vien_id) ? 'selected' : ''}>${s.ho_ten} (${s.chuc_vu})</option>`
        ).join('');
      } else {
        staffOptions = `<option value="${data.nhan_vien_id || ''}">${data.nhan_vien_id ? 'Mã giảng viên #' + data.nhan_vien_id : 'Chọn giảng viên...'}</option>`;
      }

      html += `
        <div class="form-group">
          <label>Liên kết Giảng viên (*)</label>
          <select name="nhan_vien_id" required>
            ${staffOptions}
          </select>
        </div>
        <div class="form-group">
          <label>Email liên hệ (*)</label>
          <input type="email" name="email" value="${data.email || ''}" required placeholder="VD: giangvien@tvu.edu.vn">
        </div>
        <div class="form-group">
          <label>Học vị</label>
          <input type="text" name="hoc_vi" value="${data.hoc_vi || 'Thạc sĩ'}" placeholder="VD: Thạc sĩ, Tiến sĩ">
        </div>
        <div class="form-group">
          <label>Ngạch viên chức</label>
          <input type="text" name="ngach_vien_chuc" value="${data.ngach_vien_chuc || 'Giảng viên'}" placeholder="VD: Giảng viên, Giảng viên chính">
        </div>
        <div class="form-group">
          <label>Học hàm</label>
          <input type="text" name="hoc_ham" value="${data.hoc_ham || ''}" placeholder="VD: Giáo sư, Phó giáo sư (nếu có)">
        </div>
        <div class="form-group">
          <label>Đơn vị công tác</label>
          <input type="text" name="don_vi_cong_tac" value="${data.don_vi_cong_tac || 'Khoa Công nghệ thông tin, Trường Kỹ thuật và Công nghệ, Đại học Trà Vinh'}" placeholder="VD: Bộ môn Công nghệ thông tin">
        </div>
        <div class="form-group">
          <label>Lĩnh vực nghiên cứu</label>
          <textarea name="linh_vuc_nghien_cuu" rows="3" placeholder="Các hướng nghiên cứu chính...">${data.linh_vuc_nghien_cuu || ''}</textarea>
        </div>
        <div class="form-group">
          <label>Link Google Scholar</label>
          <input type="url" name="google_scholar_url" value="${data.google_scholar_url || ''}" placeholder="https://scholar.google.com/...">
        </div>
        <div class="form-group">
          <label>Link ORCID</label>
          <input type="url" name="orcid_url" value="${data.orcid_url || ''}" placeholder="https://orcid.org/...">
        </div>
        <div class="form-group">
          <label>Link Github</label>
          <input type="url" name="github_url" value="${data.github_url || ''}" placeholder="https://github.com/...">
        </div>
        <div class="form-group">
          <label>Website cá nhân</label>
          <input type="url" name="website_ca_nhan" value="${data.website_ca_nhan || ''}" placeholder="https://...">
        </div>
      `;
    } else if (entityKey === 'staffResearch') {
      let staffOptions = '';
      if (this.staffList && this.staffList.length > 0) {
        staffOptions = this.staffList.map(s => 
          `<option value="${s.id}" ${String(s.id) === String(data.nhan_vien_id) ? 'selected' : ''}>${s.ho_ten} (${s.chuc_vu})</option>`
        ).join('');
      } else {
        staffOptions = `<option value="${data.nhan_vien_id || ''}">${data.nhan_vien_id ? 'Mã giảng viên #' + data.nhan_vien_id : 'Chọn giảng viên...'}</option>`;
      }
      html += `
        <div class="form-group">
          <label>Giảng viên thực hiện (*)</label>
          <select name="nhan_vien_id" required>
            ${staffOptions}
          </select>
        </div>
        <div class="form-group">
          <label>Tên đề tài NCKH (*)</label>
          <input type="text" name="main_title" value="${data.ten_de_tai || ''}" required placeholder="VD: Nghiên cứu xây dựng chatbot AI...">
        </div>
        <div class="form-group">
          <label>Năm hoàn thành (*)</label>
          <input type="number" name="sub_title" value="${data.nam_hoan_thanh || ''}" required placeholder="VD: 2024">
        </div>
        <div class="form-group">
          <label>Cấp đề tài</label>
          <input type="text" name="description" value="${data.cap_de_tai || 'Đề tài Nghiên cứu cấp Cơ sở'}" placeholder="VD: Đề tài cấp Bộ, Đề tài cấp Tỉnh">
        </div>
        <div class="form-group">
          <label>Trách nhiệm tham gia</label>
          <input type="text" name="trach_nhiem_tham_gia" value="${data.trach_nhiem_tham_gia || 'Chủ nhiệm đề tài'}" placeholder="VD: Chủ nhiệm đề tài, Thành viên...">
        </div>
      `;
    } else if (entityKey === 'staffPapers') {
      let staffOptions = '';
      if (this.staffList && this.staffList.length > 0) {
        staffOptions = this.staffList.map(s => 
          `<option value="${s.id}" ${String(s.id) === String(data.nhan_vien_id) ? 'selected' : ''}>${s.ho_ten} (${s.chuc_vu})</option>`
        ).join('');
      } else {
        staffOptions = `<option value="${data.nhan_vien_id || ''}">${data.nhan_vien_id ? 'Mã giảng viên #' + data.nhan_vien_id : 'Chọn giảng viên...'}</option>`;
      }
      html += `
        <div class="form-group">
          <label>Giảng viên công bộ (*)</label>
          <select name="nhan_vien_id" required>
            ${staffOptions}
          </select>
        </div>
        <div class="form-group">
          <label>Tên bài báo khoa học (*)</label>
          <input type="text" name="main_title" value="${data.ten_bai_bao || ''}" required placeholder="VD: A Study on Deep Learning...">
        </div>
        <div class="form-group">
          <label>Năm xuất bản (*)</label>
          <input type="number" name="sub_title" value="${data.nam_xuat_ban || ''}" required placeholder="VD: 2024">
        </div>
        <div class="form-group">
          <label>Danh sách tác giả (*)</label>
          <textarea name="description" rows="2" required placeholder="VD: Nguyễn Nhứt Lam, Lê Phong Dụ">${data.danh_sach_tac_gia || ''}</textarea>
        </div>
        <div class="form-group">
          <label>Tên tạp chí / hội nghị khoa học</label>
          <input type="text" name="ten_tap_chi_hoi_nghi" value="${data.ten_tap_chi_hoi_nghi || ''}" placeholder="VD: SN Computer Science">
        </div>
      `;
    } else if (entityKey === 'staffProjects') {
      let staffOptions = '';
      if (this.staffList && this.staffList.length > 0) {
        staffOptions = this.staffList.map(s => 
          `<option value="${s.id}" ${String(s.id) === String(data.nhan_vien_id) ? 'selected' : ''}>${s.ho_ten} (${s.chuc_vu})</option>`
        ).join('');
      } else {
        staffOptions = `<option value="${data.nhan_vien_id || ''}">${data.nhan_vien_id ? 'Mã giảng viên #' + data.nhan_vien_id : 'Chọn giảng viên...'}</option>`;
      }
      html += `
        <div class="form-group">
          <label>Giảng viên chủ trì (*)</label>
          <select name="nhan_vien_id" required>
            ${staffOptions}
          </select>
        </div>
        <div class="form-group">
          <label>Tên dự án & Chuyển giao (*)</label>
          <input type="text" name="main_title" value="${data.ten_du_an || ''}" required placeholder="VD: Dự án tư vấn hệ thống IoT...">
        </div>
        <div class="form-group">
          <label>Khoảng thời gian thực hiện (*)</label>
          <input type="text" name="sub_title" value="${data.nam_thuc_hien || ''}" required placeholder="VD: 2023 - 2024">
        </div>
        <div class="form-group">
          <label>Vai trò</label>
          <input type="text" name="vai_tro" value="${data.vai_tro || 'Trưởng nhóm kỹ thuật'}" placeholder="VD: Trưởng nhóm giải pháp">
        </div>
        <div class="form-group">
          <label>Mô tả chi tiết dự án</label>
          <textarea name="description" rows="3" placeholder="Chi tiết chuyển giao...">${data.mo_ta || ''}</textarea>
        </div>
      `;
    } else if (entityKey === 'staffBooks') {
      let staffOptions = '';
      if (this.staffList && this.staffList.length > 0) {
        staffOptions = this.staffList.map(s => 
          `<option value="${s.id}" ${String(s.id) === String(data.nhan_vien_id) ? 'selected' : ''}>${s.ho_ten} (${s.chuc_vu})</option>`
        ).join('');
      } else {
        staffOptions = `<option value="${data.nhan_vien_id || ''}">${data.nhan_vien_id ? 'Mã giảng viên #' + data.nhan_vien_id : 'Chọn giảng viên...'}</option>`;
      }
      html += `
        <div class="form-group">
          <label>Giảng viên chủ biên/viết (*)</label>
          <select name="nhan_vien_id" required>
            ${staffOptions}
          </select>
        </div>
        <div class="form-group">
          <label>Tên sách / Giáo trình (*)</label>
          <input type="text" name="main_title" value="${data.ten_sach_giao_trinh || ''}" required placeholder="VD: Giáo trình Cấu trúc dữ liệu...">
        </div>
        <div class="form-group">
          <label>Năm xuất bản (*)</label>
          <input type="number" name="sub_title" value="${data.nam_xuat_ban || ''}" required placeholder="VD: 2024">
        </div>
        <div class="form-group">
          <label>Nhà xuất bản</label>
          <input type="text" name="nha_xuat_ban" value="${data.nha_xuat_ban || 'NXB Đại học Trà Vinh'}" placeholder="VD: NXB Thông tin và Truyền thông">
        </div>
        <div class="form-group">
          <label>Vai trò</label>
          <input type="text" name="vai_tro" value="${data.vai_tro || 'Chủ biên'}" placeholder="VD: Tác giả chính, Chủ biên...">
        </div>
      `;
    } else if (entityKey === 'staffSupervisions') {
      let staffOptions = '';
      if (this.staffList && this.staffList.length > 0) {
        staffOptions = this.staffList.map(s => 
          `<option value="${s.id}" ${String(s.id) === String(data.nhan_vien_id) ? 'selected' : ''}>${s.ho_ten} (${s.chuc_vu})</option>`
        ).join('');
      } else {
        staffOptions = `<option value="${data.nhan_vien_id || ''}">${data.nhan_vien_id ? 'Mã giảng viên #' + data.nhan_vien_id : 'Chọn giảng viên...'}</option>`;
      }
      html += `
        <div class="form-group">
          <label>Giảng viên hướng dẫn (*)</label>
          <select name="nhan_vien_id" required>
            ${staffOptions}
          </select>
        </div>
        <div class="form-group">
          <label>Tên học viên / sinh viên hướng dẫn (*)</label>
          <input type="text" name="main_title" value="${data.ten_hoc_vien || ''}" required placeholder="VD: Nguyễn Văn A">
        </div>
        <div class="form-group">
          <label>Phân loại bậc học (*)</label>
          <select name="loai_hoc_vien" required>
            <option value="sinh_vien_nckh" ${data.loai_hoc_vien === 'sinh_vien_nckh' ? 'selected' : ''}>Sinh viên NCKH</option>
            <option value="hoc_vien_cao_hoc" ${data.loai_hoc_vien === 'hoc_vien_cao_hoc' ? 'selected' : ''}>Học viên Cao học</option>
            <option value="ncs" ${data.loai_hoc_vien === 'ncs' ? 'selected' : ''}>Nghiên cứu sinh (NCS)</option>
          </select>
        </div>
        <div class="form-group">
          <label>Tên đề tài hướng dẫn (*)</label>
          <textarea name="description" rows="2" required placeholder="VD: Nghiên cứu ứng dụng IoT...">${data.ten_de_tai_huong_dan || ''}</textarea>
        </div>
      `;
    } else {
      // General Fallback Inputs
      const titleVal = data.ho_ten || data.ten_bai_bao || data.tieu_de || data.ten_de_tai || data.ten_nganh || data.ten_slide || data.ten || data.name || '';
      html += `
        <div class="form-group">
          <label>Tên / Tiêu đề chính (*)</label>
          <input type="text" name="main_title" value="${titleVal}" required placeholder="Nhập tiêu đề hoặc họ tên...">
        </div>
        <div class="form-group">
          <label>Thông tin phụ / Chức vụ / Mã số / Ngày</label>
          <input type="text" name="sub_title" value="${data.chuc_vu || data.nam_hoan_thanh || data.ngay_dang || data.ma_tuyen_sinh || data.email || ''}" placeholder="Nhập thông tin phụ...">
        </div>
        <div class="form-group">
          <label>Hình ảnh / Logo (URL hoặc Tải lên từ máy)</label>
          <div style="display: flex; gap: 8px;">
            <input type="text" name="image_url" id="field_image_url" value="${data.anh_ca_nhan_url || data.hinh_anh_url || data.file_anh_url || data.logo_url || data.src_chinh || ''}" placeholder="assets/images/..." style="flex: 1;">
            <button type="button" class="btn-upload-label" data-file-input-id="upload_generic_image_input" style="background: var(--admin-primary); color: #fff; padding: 10px 14px; border-radius: var(--radius-md); cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 0.85rem; font-weight: 600; margin: 0; box-shadow: var(--shadow-sm); transition: all 0.2s; border: 0;">
              📁 Tải lên
            </button>
            <input type="file" id="upload_generic_image_input" class="local-image-uploader" data-target-id="field_image_url" accept="image/*" style="display: none;">
          </div>
        </div>
        <div class="form-group">
          <label>Nội dung Chi tiết / Mô tả</label>
          <textarea name="description" rows="4" placeholder="Nhập chi tiết nội dung...">${data.mo_ta || data.noi_dung || data.linh_vuc_nghien_cuu || ''}</textarea>
        </div>
      `;
    }

    return html;
  }

  async handleFormSubmit(e) {
    e.preventDefault();

    // Chống double-submit
    if (this._isSubmitting) return;
    this._isSubmitting = true;

    const submitBtn = document.querySelector('#adminModalOverlay button[type="submit"], #btnSubmitModal');
    const originalBtnText = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) { submitBtn.disabled = true; submitBtn.innerHTML = '⏳ Đang lưu...'; }

    const form = e.target;
    const formData = new FormData(form);
    
    const payload = {};
    for (let [key, val] of formData.entries()) {
      payload[key] = val;
    }

    // Standardize title fields
    if (formData.get('main_title')) {
      payload.tieu_de = formData.get('main_title');
      payload.ho_ten = formData.get('main_title');
    }

    try {
      if (this.editingId) {
        await AdminApiService.updateItem(this.currentNav, this.editingId, payload);
        this.showToast('Cập nhật dữ liệu thành công!', 'success');
      } else {
        await AdminApiService.createItem(this.currentNav, payload);
        this.showToast('Thêm mới dữ liệu thành công!', 'success');
      }
      this.closeModal();
      this.navigate(this.currentNav);
    } catch (err) {
      this.showToast(`Lỗi hệ thống: ${err.message}`, 'error');
    } finally {
      this._isSubmitting = false;
      if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = originalBtnText; }
    }
  }

  async handleDeleteItem(entityKey, id) {
    if (confirm(`Bạn có chắc chắn muốn xóa mục này không?`)) {
      try {
        await AdminApiService.deleteItem(entityKey, id);
        this.showToast(`Xóa dữ liệu thành công!`, 'success');
        this.navigate(entityKey);
      } catch (err) {
        this.showToast(`Lỗi hệ thống: ${err.message}`, 'error');
      }
    }
  }

  /**
   * 5. TOAST NOTIFICATIONS
   */
  showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <span>${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span>
      <div>${message}</div>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 4000);
  }
}

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new AdminApp();
  app.init();
});
