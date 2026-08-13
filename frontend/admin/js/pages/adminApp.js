/**
 * ==========================================================================
 * MAIN ADMIN PORTAL APPLICATION CONTROLLER
 * ==========================================================================
 * Orchestrates Google OAuth UI authentication state, categorized sidebar 
 * navigation, custom page forms, detailed data tables, and RESTful API CRUD
 * for EVERY single public page section (Homepage, About, Staff, Research, 
 * Undergraduate, Postgraduate, News, System Settings).
 */

import { AdminAuthService } from '../services/adminAuthService.js';
import { AdminApiService } from '../services/adminApiService.js';
import { renderAdminSidebar } from '../components/adminSidebar.js';

class AdminApp {
  constructor() {
    this.currentNav = 'dashboard';
    this.currentEntityData = [];
    this.editingId = null;
    this.initialFormState = null;

    // Set up debounced handlers
    this.debouncedSaveDraft = this.debounce(() => {
      this.saveFormDraft();
    }, 800);

    this.debouncedSyncUrl = this.debounce(() => {
      this.syncUrlState();
    }, 500);
  }

  formatAdminImgUrl(url) {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
      return url;
    }
    // Nếu path bắt đầu bằng 'assets/', ta chuyển thành '../assets/' để hoạt động đúng từ thư mục admin/
    if (url.startsWith('assets/')) {
      return '../' + url;
    }
    return url;
  }

  init() {
    console.log('Khởi tạo Cổng Quản Trị Admin Khoa CNTT TVU...');
    this.bindAuthEvents();
    this.checkAuthState();
    this.bindGlobalEvents();
  }

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
    
    // Restore navigation key from URL query parameters if present
    const params = new URLSearchParams(window.location.search);
    const navParam = params.get('nav') || 'dashboard';
    this.currentNav = navParam;

    await this.navigate(this.currentNav);
    this.restoreUrlStateAndScroll();
  }

  async checkAuthState() {
    if (AdminAuthService.isLoggedIn()) {
      const user = AdminAuthService.getCurrentUser();
      this.hideLoginOverlay();
      this.updateHeaderProfile(user);
      
      const params = new URLSearchParams(window.location.search);
      const navParam = params.get('nav');
      if (navParam) {
        this.currentNav = navParam;
      }
      
      renderAdminSidebar(this.currentNav);
      await this.navigate(this.currentNav);
      this.restoreUrlStateAndScroll();
    } else {
      console.log('Bypassing Google login and automatically logging in as TS. Nguyễn Nhứt Lam...');
      await this.handleLogin('lamnn@tvu.edu.vn');
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

  bindGlobalEvents() {
    const themeBtn = document.getElementById('themeToggleBtn');
    if (themeBtn) {
      themeBtn.textContent = document.body.classList.contains('dark-theme') ? '☀️' : '🌙';
      themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        themeBtn.textContent = isDark ? '☀️' : '🌙';
      });
    }

    const mobileBtn = document.getElementById('mobileSidebarToggle');
    const sidebar = document.getElementById('adminSidebar');
    if (mobileBtn && sidebar) {
      mobileBtn.addEventListener('click', () => {
        sidebar.classList.toggle('mobile-open');
      });
    }

    // Intercept sidebar navigation to block if form is dirty
    document.addEventListener('click', (e) => {
      const navItem = e.target.closest('.nav-menu-item');
      if (navItem) {
        const key = navItem.getAttribute('data-nav');
        if (key) {
          if (this.isFormDirty()) {
            if (!confirm("Bạn có dữ liệu chưa được lưu trong biểu mẫu. Bạn có chắc chắn muốn rời khỏi trang không?")) {
              return; // Cancel route navigation
            }
          }
          this.navigate(key);
          if (sidebar) sidebar.classList.remove('mobile-open');
        }
      }

      const sidebarLogoutBtn = e.target.closest('#sidebarLogoutBtn');
      if (sidebarLogoutBtn) {
        if (this.isFormDirty()) {
          if (!confirm("Bạn có dữ liệu chưa được lưu trong biểu mẫu. Bạn có chắc chắn muốn đăng xuất không?")) {
            return;
          }
        }
        AdminAuthService.logout();
        this.showLoginOverlay();
        this.showToast('Đã đăng xuất tài khoản Admin Google.', 'info');
      }

      const sidebarCloseBtn = e.target.closest('#sidebarCloseBtn');
      if (sidebarCloseBtn && sidebar) {
        sidebar.classList.remove('mobile-open');
      }

      // Close sidebar when clicking outside on mobile
      if (sidebar && sidebar.classList.contains('mobile-open')) {
        const isClickInsideSidebar = sidebar.contains(e.target);
        const isClickToggle = e.target.closest('#mobileSidebarToggle');
        if (!isClickInsideSidebar && !isClickToggle) {
          sidebar.classList.remove('mobile-open');
        }
      }
    });

    const closeBtn = document.getElementById('btnCloseModal');
    const cancelBtn = document.getElementById('btnCancelModal');
    if (closeBtn) closeBtn.addEventListener('click', () => this.closeModal());
    if (cancelBtn) cancelBtn.addEventListener('click', () => this.closeModal());

    const submitBtn = document.getElementById('btnSubmitModal');
    if (submitBtn) {
      submitBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.handleFormSubmit();
      });
    }

    // Prevent form default submit behavior
    const form = document.getElementById('adminDynamicForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
      });
      
      // Prevent Enter key from submitting form accidentally
      form.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          return false;
        }
      });
    }

    // Listen to form input with debounce to prevent spamming local storage writes
    document.addEventListener('input', (e) => {
      if (e.target && e.target.closest && e.target.closest('#adminDynamicForm')) {
        this.debouncedSaveDraft();
        // Dynamic preview for URL image paste/typing
        if (e.target.id) {
          const previewEl = document.getElementById(`preview_${e.target.id}`);
          if (previewEl) {
            previewEl.src = this.formatAdminImgUrl(e.target.value);
            previewEl.style.display = e.target.value ? 'block' : 'none';
          }
        }
      }
    });

    document.addEventListener('change', (e) => {
      if (e.target && e.target.type === 'file') return;
      if (e.target && e.target.closest && e.target.closest('#adminDynamicForm')) {
        this.saveFormDraft();
        // Dynamic preview for selection/dropdown modifications
        if (e.target.id) {
          const previewEl = document.getElementById(`preview_${e.target.id}`);
          if (previewEl) {
            previewEl.src = this.formatAdminImgUrl(e.target.value);
            previewEl.style.display = e.target.value ? 'block' : 'none';
          }
        }
      }
    });

    // Guard user reload/tab close actions with standard browser confirmation alerts
    window.addEventListener('beforeunload', (e) => {
      if (this.isFormDirty()) {
        const message = 'Bạn có dữ liệu chưa được lưu trong biểu mẫu. Bạn có chắc muốn rời khỏi trang không?';
        e.preventDefault();
        e.returnValue = message;
        return message;
      }
    });

    // Track scroll position in sessionStorage with debounce to optimize render performance
    window.addEventListener('scroll', this.debounce(() => {
      sessionStorage.setItem('admin_scroll_y', window.scrollY);
    }, 150));
  }

  /**
   * Attach upload handlers directly onto each file input inside the modal.
   * Called AFTER modal body HTML is injected so elements exist in the DOM.
   * Using direct listeners (not delegation) guarantees the change event
   * never reaches the <form> and cannot accidentally trigger a submit.
   */
  bindUploadHandlers() {
    const fileInputs = document.querySelectorAll('.local-image-uploader');
    fileInputs.forEach((fileInput) => {
      // Remove any previous listener to avoid duplicates
      const clone = fileInput.cloneNode(true);
      fileInput.parentNode.replaceChild(clone, fileInput);
      const freshInput = clone;

      // Wire the trigger button to open this specific file input
      const inputId = freshInput.id;
      const triggerBtn = document.querySelector(`[data-file-input-id="${inputId}"]`);
      if (triggerBtn) {
        triggerBtn.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          freshInput.click();
        };
      }

      // Direct change listener — lives on the input, not on document/form
      freshInput.addEventListener('change', async (e) => {
        // Stop immediately so the event never reaches the <form>
        e.stopImmediatePropagation();
        e.stopPropagation();
        e.preventDefault();

        if (!freshInput.files || freshInput.files.length === 0) return;

        const targetId = freshInput.getAttribute('data-target-id');
        const targetField = document.getElementById(targetId);
        const file = freshInput.files[0];

        const uploadFormData = new FormData();
        uploadFormData.append('image', file);

        const btn = triggerBtn;
        const originalHTML = btn ? btn.innerHTML : '📁 Tải lên';
        if (btn) {
          btn.innerHTML = '⏳ Đang tải...';
          btn.style.opacity = '0.7';
          btn.style.pointerEvents = 'none';
        }

        try {
          const response = await fetch('http://localhost:5000/api/v1/admin/upload', {
            method: 'POST',
            body: uploadFormData
          });
          if (!response.ok) throw new Error(`HTTP ${response.status}`);

          const result = await response.json();
          if (result.success && result.imageUrl) {
            if (targetField) {
              targetField.value = result.imageUrl;
            }
            // Cập nhật thẻ preview ảnh tương ứng ngay lập tức
            const previewEl = document.getElementById(`preview_${targetId}`);
            if (previewEl) {
              previewEl.src = this.formatAdminImgUrl(result.imageUrl);
              previewEl.style.display = 'block';
            }
            this.saveFormDraft(); // Lưu ngay vào bản nháp khi upload thành công!
            this.showToast('Tải ảnh lên thành công! ✅', 'success');
          } else {
            throw new Error(result.error || 'Tải lên thất bại!');
          }
        } catch (err) {
          console.error('Lỗi upload file:', err);
          this.showToast(`Lỗi upload: ${err.message}`, 'error');
        } finally {
          freshInput.value = '';
          if (btn) {
            btn.innerHTML = originalHTML;
            btn.style.opacity = '1';
            btn.style.pointerEvents = 'auto';
          }
        }
      });
    });
  }

  async navigate(navKey) {
    this.currentNav = navKey;
    renderAdminSidebar(navKey);

    // Reset modal states when changing section
    this.editingId = null;
    this.initialFormState = null;
    this.syncUrlState();

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

  renderDashboardPanel(container) {
    container.innerHTML = `
      <div class="dashboard-panel">
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
        let displayTitle = '';
        let displaySub = '';

        switch (entityKey) {
          case 'staff':
            displayTitle = `[Cán bộ] ${item.ho_ten}`;
            displaySub = `Chức vụ: ${item.chuc_vu} | Học vị: ${item.hoc_vi} | Nhóm: ${item.nhom_id === 1 ? 'Lãnh đạo khoa' : 'Giảng viên & Trợ giảng'}`;
            break;
          case 'staffProfiles': {
            const staffName = this.staffList.find(s => s.id === item.nhan_vien_id)?.ho_ten || `ID cán bộ: ${item.nhan_vien_id}`;
            displayTitle = `[Hồ sơ cá nhân] ${staffName}`;
            displaySub = `Lĩnh vực: ${item.linh_vuc_nghien_cuu || 'Chưa cập nhật'}`;
            break;
          }
          case 'staffResearch': {
            const staffName = this.staffList.find(s => s.id === item.nhan_vien_id)?.ho_ten || `ID cán bộ: ${item.nhan_vien_id}`;
            displayTitle = `[NCKH - Cán bộ: ${staffName}] ${item.ten_de_tai}`;
            displaySub = `Cấp: ${item.cap_de_tai} | Vai trò: ${item.trach_nhiem_tham_gia} | Năm: ${item.nam_hoan_thanh}`;
            break;
          }
          case 'staffPapers': {
            const staffName = this.staffList.find(s => s.id === item.nhan_vien_id)?.ho_ten || `ID cán bộ: ${item.nhan_vien_id}`;
            displayTitle = `[Bài báo - Cán bộ: ${staffName}] ${item.ten_bai_bao}`;
            displaySub = `Tác giả: ${item.danh_sach_tac_gia} | Tạp chí/Hội nghị: ${item.ten_tap_chi_hoi_nghi} | Năm: ${item.nam_xuat_ban}`;
            break;
          }
          case 'staffProjects': {
            const staffName = this.staffList.find(s => s.id === item.nhan_vien_id)?.ho_ten || `ID cán bộ: ${item.nhan_vien_id}`;
            displayTitle = `[Dự án - Cán bộ: ${staffName}] ${item.ten_du_an}`;
            displaySub = `Vai trò: ${item.vai_tro} | Năm: ${item.nam_thuc_hien}`;
            break;
          }
          case 'staffBooks': {
            const staffName = this.staffList.find(s => s.id === item.nhan_vien_id)?.ho_ten || `ID cán bộ: ${item.nhan_vien_id}`;
            displayTitle = `[Sách/Giáo trình - Cán bộ: ${staffName}] ${item.ten_sach_giao_trinh}`;
            displaySub = `NXB: ${item.nha_xuat_ban} | Vai trò: ${item.vai_tro} | Năm: ${item.nam_xuat_ban}`;
            break;
          }
          case 'staffSupervisions': {
            const staffName = this.staffList.find(s => s.id === item.nhan_vien_id)?.ho_ten || `ID cán bộ: ${item.nhan_vien_id}`;
            const loaiLabel = item.loai_hoc_vien === 'ncs' ? 'NCS' : item.loai_hoc_vien === 'hoc_vien_cao_hoc' ? 'Cao học' : 'SV NCKH';
            displayTitle = `[HD NCKH - Cán bộ: ${staffName}] Hướng dẫn ${loaiLabel}: ${item.ten_hoc_vien}`;
            displaySub = `Đề tài: "${item.ten_de_tai_huong_dan}" | Năm bảo vệ: ${item.nam_bao_ve || 'Chưa bảo vệ'}`;
            break;
          }
          case 'students':
            displayTitle = `[🏆 ${item.chuyen_muc || 'Sinh viên tiêu biểu'}] ${item.ten_doi_ca_nhan}`;
            displaySub = `Ngành/Lớp: ${item.nganh_hoc} | GVHD: ${item.giang_vien_huong_dan || 'Không có'} <br><small><strong>Thành tích:</strong> ${item.thanh_tich}</small>`;
            break;
          case 'alumni':
            displayTitle = `[Cựu sinh viên tiêu biểu] ${item.ho_ten}`;
            displaySub = `Chức vụ: ${item.chuc_danh_cong_ty} <br><small><strong>Cảm nhận:</strong> ${item.trich_dan_cam_nhan}</small>`;
            break;
          case 'homepageAdmissions':
            displayTitle = `[Tuyển sinh] ${item.tieu_de_box}`;
            displaySub = `Tổ hợp: ${item.to_hop_xet_tuyen} | Mã AI: ${item.ma_nganh_ai} | Mã CS: ${item.ma_nganh_cs}`;
            break;
          case 'homepagePrograms':
            displayTitle = `[Chương trình nổi bật] [${item.badge_text || 'AUN-QA'}] ${item.ten_chuong_trinh}`;
            displaySub = `Kiểm định: ${item.nhan_kiem_dinh} | Mô tả: ${item.mo_ta_ngan}`;
            break;
          case 'infographics':
            displayTitle = `[Infographic] ${item.ten_infographic}`;
            displaySub = `File ảnh: ${item.file_anh_url} | File PDF: ${item.file_pdf_url || 'Không có'}`;
            break;
          case 'news':
            displayTitle = `[Tin tức - Hoạt động] ${item.tieu_de}`;
            displaySub = `Ngày đăng: ${item.ngay_dang} | Nhãn phụ: ${item.nhan_nho || 'Không có'}`;
            break;
          case 'researchProjects':
            displayTitle = `[NCKH Khoa - Cấp: ${item.cap}] ${item.ten_de_tai}`;
            displaySub = `Chủ nhiệm: ${item.chu_nhiem_ten} | Trạng thái: ${item.trang_thai}`;
            break;
          case 'researchPublications':
            displayTitle = `[Công bố khoa học Khoa] ${item.ten_bai_bao}`;
            displaySub = `Tác giả: ${item.tac_gia} | Loại: ${item.loai_hinh_cong_bo} | Năm: ${item.nam_xuat_ban}`;
            break;
          case 'undergradCurriculum':
            displayTitle = `[Lộ trình - Khối kiến thức] ${item.ten_khoi}`;
            displaySub = `Tín chỉ: ${item.so_tin_chi} | Ghi chú: ${item.ghi_chu_khoi}`;
            break;
          case 'undergradCourses':
            displayTitle = `[Học phần Công nghệ Cốt lõi] ${item.ten_hoc_phan}`;
            displaySub = `Mã học phần: ${item.ma_hoc_phan} | Số tín chỉ: ${item.so_tin_chi}`;
            break;
          default:
            displayTitle = item.ho_ten || item.ten_bai_bao || item.tieu_de || item.ten_de_tai || item.ten_nganh || item.ten_slide || item.ten || item.name || `Bản ghi #${item.id}`;
            displaySub = item.chuc_vu || item.nam_hoan_thanh || item.ngay_dang || item.ma_tuyen_sinh || item.email || item.vai_tro || item.cap_de_tai || item.danh_sach_to_hop || '';
        }

        const rawImg = item.anh_ca_nhan_url || item.hinh_anh_url || item.file_anh_url || item.logo_url || item.src_chinh || item.avatar_url || null;
        const img = this.formatAdminImgUrl(rawImg);
        
        rowsHtml += `
          <tr>
            <td>${idx + 1}</td>
            <td>
              <div class="table-avatar-cell">
                ${img ? `<img src="${img}" class="table-img" onerror="this.style.display='none'">` : ''}
                <div>
                  <div style="font-weight:600;">${displayTitle}</div>
                  ${displaySub ? `<div style="font-size:0.78rem; color:var(--admin-text-muted);">${displaySub}</div>` : ''}
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

    const searchInput = document.getElementById('adminSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const trs = container.querySelectorAll('#adminTableBody tr');
        trs.forEach(tr => {
          const text = tr.innerText.toLowerCase();
          tr.style.display = text.includes(query) ? '' : 'none';
        });

        // Debounce URL state synchronization on search query change
        this.debouncedSyncUrl();
      });
    }
  }

  openModalForAdd(entityKey) {
    this.editingId = null;
    const modal = document.getElementById('adminModalOverlay');
    const titleEl = document.getElementById('modalTitle');
    const bodyEl = document.getElementById('modalFormBody');

    if (titleEl) titleEl.textContent = `Thêm mới: ${this.getNavLabel(entityKey)}`;
    bodyEl.innerHTML = this.generateFormFields(entityKey, {});

    // Bind upload handlers AFTER HTML is injected so file inputs exist in DOM
    this.bindUploadHandlers();
    
    // FIX: Xóa bản nháp cũ trước khi mở form Thêm mới.
    // Không được restore draft khi thêm mới để tránh dữ liệu cũ
    // hiện lại sau khi vừa lưu thành công.
    this.clearFormDraft(entityKey);
    
    // Capture clean (empty) state AFTER clearing draft so isFormDirty() works correctly
    this.captureInitialFormState();

    if (modal) modal.classList.remove('hidden');
    
    // Synchronize current modal add state to URL parameters
    this.syncUrlState();
  }

  openModalForEdit(entityKey, id) {
    this.editingId = id;
    const item = this.currentEntityData.find(i => String(i.id) === String(id));
    if (!item) return;

    const modal = document.getElementById('adminModalOverlay');
    const titleEl = document.getElementById('modalTitle');
    const bodyEl = document.getElementById('modalFormBody');

    if (titleEl) titleEl.textContent = `Chỉnh sửa bản ghi #${id}: ${this.getNavLabel(entityKey)}`;
    bodyEl.innerHTML = this.generateFormFields(entityKey, item);

    // Bind upload handlers AFTER HTML is injected so file inputs exist in DOM
    this.bindUploadHandlers();

    // Capture clean state BEFORE restoring form draft so we can compute formDirty accurately
    this.captureInitialFormState();

    this.restoreFormDraft(entityKey, item);

    if (modal) modal.classList.remove('hidden');

    // Synchronize current modal edit state to URL parameters
    this.syncUrlState();
  }

  closeModal() {
    if (this.isFormDirty()) {
      if (!confirm("Bạn có dữ liệu chưa được lưu. Bạn có chắc muốn rời khỏi trang?")) {
        return;
      }
    }
    const modal = document.getElementById('adminModalOverlay');
    if (modal) modal.classList.add('hidden');
    this.editingId = null;
    this.initialFormState = null;
    this.syncUrlState();
  }

  debounce(func, wait) {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  syncUrlState() {
    const params = new URLSearchParams(window.location.search);
    
    if (this.currentNav) {
      params.set('nav', this.currentNav);
    } else {
      params.delete('nav');
    }
    
    const searchInput = document.getElementById('adminSearchInput');
    if (searchInput && searchInput.value.trim() !== '') {
      params.set('search', searchInput.value.trim());
    } else {
      params.delete('search');
    }
    
    if (this.editingId) {
      params.set('edit', this.editingId);
      params.delete('add');
    } else {
      params.delete('edit');
    }
    
    const modal = document.getElementById('adminModalOverlay');
    const isAddOpen = modal && !modal.classList.contains('hidden') && !this.editingId;
    if (isAddOpen) {
      params.set('add', 'true');
      params.delete('edit');
    } else {
      params.delete('add');
    }
    
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, '', newUrl);
  }

  captureInitialFormState() {
    const container = document.getElementById('adminDynamicForm');
    if (!container) {
      this.initialFormState = null;
      return;
    }
    const state = {};
    const inputs = container.querySelectorAll('input:not([type="file"]), select, textarea');
    inputs.forEach(el => {
      if (el.name) state[el.name] = el.value;
    });
    this.initialFormState = JSON.stringify(state);
  }

  isFormDirty() {
    const container = document.getElementById('adminDynamicForm');
    if (!container || !this.initialFormState) return false;
    
    const currentState = {};
    const inputs = container.querySelectorAll('input:not([type="file"]), select, textarea');
    inputs.forEach(el => {
      if (el.name) currentState[el.name] = el.value;
    });
    
    return this.initialFormState !== JSON.stringify(currentState);
  }

  getDraftStorageKey(entityKey) {
    let tabId = sessionStorage.getItem('tabId');
    if (!tabId) {
      tabId = Math.random().toString(36).substring(2, 10);
      sessionStorage.setItem('tabId', tabId);
    }
    const mode = this.editingId ? `edit-${this.editingId}` : `create-${tabId}`;
    return `admin-form-draft:${entityKey}:${mode}`;
  }

  saveFormDraft() {
    const container = document.getElementById('adminDynamicForm');
    if (!container || !this.currentNav || this.currentNav === 'dashboard') return;

    const draft = {};
    const inputs = container.querySelectorAll('input:not([type="file"]), select, textarea');
    inputs.forEach(el => {
      if (el.name) draft[el.name] = el.value;
    });

    localStorage.setItem(this.getDraftStorageKey(this.currentNav), JSON.stringify(draft));
  }

  restoreFormDraft(entityKey, sourceItem = null) {
    const container = document.getElementById('adminDynamicForm');
    if (!container) return;

    const stored = localStorage.getItem(this.getDraftStorageKey(entityKey));
    if (!stored) return;

    try {
      const draft = JSON.parse(stored);
      Object.entries(draft).forEach(([key, value]) => {
        const field = container.querySelector(`[name="${key}"]`);
        if (field && typeof field.value !== 'undefined') {
          field.value = value;
          
          const targetId = field.id;
          if (targetId) {
            const previewEl = document.getElementById(`preview_${targetId}`);
            if (previewEl) {
              previewEl.src = this.formatAdminImgUrl(value);
              previewEl.style.display = value ? 'block' : 'none';
            }
          }
        }
      });

      if (sourceItem && entityKey === 'staff' && sourceItem.anh_ca_nhan_url && !draft.anh_ca_nhan_url) {
        const avatarField = container.querySelector('[name="anh_ca_nhan_url"]');
        if (avatarField) {
          avatarField.value = sourceItem.anh_ca_nhan_url;
          const previewEl = document.getElementById('preview_field_anh_ca_nhan_url');
          if (previewEl) {
            previewEl.src = this.formatAdminImgUrl(sourceItem.anh_ca_nhan_url);
            previewEl.style.display = 'block';
          }
        }
      }
    } catch (err) {
      console.warn('Không thể khôi phục bản nháp form admin:', err);
    }
  }

  clearFormDraft(entityKey) {
    if (!entityKey || !this.currentNav || this.currentNav === 'dashboard') return;
    localStorage.removeItem(this.getDraftStorageKey(entityKey));
  }

  restoreUrlStateAndScroll() {
    const params = new URLSearchParams(window.location.search);
    
    // Restore search
    const searchParam = params.get('search');
    const searchInput = document.getElementById('adminSearchInput');
    if (searchParam && searchInput) {
      searchInput.value = searchParam;
      const query = searchParam.toLowerCase();
      const trs = document.querySelectorAll('#adminTableBody tr');
      trs.forEach(tr => {
        const text = tr.innerText.toLowerCase();
        tr.style.display = text.includes(query) ? '' : 'none';
      });
    }

    // Restore modal states
    const editParam = params.get('edit');
    const addParam = params.get('add');
    if (editParam) {
      this.openModalForEdit(this.currentNav, editParam);
    } else if (addParam === 'true') {
      this.openModalForAdd(this.currentNav);
    }

    // Restore scroll position
    const storedScrollY = sessionStorage.getItem('admin_scroll_y');
    if (storedScrollY) {
      setTimeout(() => {
        window.scrollTo(0, parseInt(storedScrollY, 10));
      }, 300);
    }
  }

  generateFormFields(entityKey, data) {
    const filterDefaultImg = (url) => {
      if (!url) return '';
      if (url.includes('default.jpg') || url.includes('default-user') || url.includes('default-avatar')) return '';
      return url;
    };

    const renderImageField = (label, name, value, fileInputId, targetId) => {
      const filteredVal = filterDefaultImg(value);
      return `
        <div class="form-group">
          <label>${label}</label>
          <input type="hidden" name="${name}" id="${targetId}" value="${filteredVal}">
          <div style="display: flex; gap: 8px; align-items: center;">
            <button type="button" class="btn-upload-label" data-file-input-id="${fileInputId}" style="background: var(--admin-primary); color: #fff; padding: 10px 14px; border-radius: var(--radius-md); cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 0.85rem; font-weight: 600; margin: 0; box-shadow: var(--shadow-sm); transition: all 0.2s; border: 0;">
              📁 Chọn ảnh & Tải lên từ máy
            </button>
            <input type="file" id="${fileInputId}" class="local-image-uploader" data-target-id="${targetId}" accept="image/*" style="display: none;">
          </div>
          <div style="margin-top: 8px;">
            <img id="preview_${targetId}" src="${filteredVal ? this.formatAdminImgUrl(filteredVal) : ''}" style="max-width: 120px; max-height: 120px; border-radius: var(--radius-md); object-fit: cover; border: 1px solid var(--admin-card-border); ${filteredVal ? '' : 'display: none;'}" onerror="this.style.display='none'">
          </div>
        </div>
      `;
    };

    let html = ``;

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
        ${renderImageField('Ảnh đại diện (Tải lên từ máy)', 'anh_ca_nhan_url', data.anh_ca_nhan_url, 'upload_staff_avatar_input', 'field_anh_ca_nhan_url')}
        <div class="form-group">
          <label>Trạng thái hiển thị nhân sự (*)</label>
          <select name="an_hien" required>
            <option value="1" ${data.an_hien !== 0 ? 'selected' : ''}>Hiện trên Website</option>
            <option value="0" ${data.an_hien === 0 ? 'selected' : ''}>Ẩn khỏi Website</option>
          </select>
        </div>
        <div class="form-group">
          <label>Hiển thị Email cá nhân (*)</label>
          <select name="an_hien_email" required>
            <option value="1" ${data.an_hien_email !== 0 ? 'selected' : ''}>Hiện Email</option>
            <option value="0" ${data.an_hien_email === 0 ? 'selected' : ''}>Ẩn Email</option>
          </select>
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
          <label>Giảng viên công bố (*)</label>
          <select name="nhan_vien_id" required>
            ${staffOptions}
          </select>
        </div>
        <div class="form-group">
          <label>Tên bài báo khoa học (*)</label>
          <input type="text" name="ten_bai_bao" value="${data.ten_bai_bao || ''}" required placeholder="VD: A Study on Deep Learning Applications in Agriculture">
        </div>
        <div class="form-group">
          <label>Năm xuất bản (*)</label>
          <input type="number" name="nam_xuat_ban" value="${data.nam_xuat_ban || new Date().getFullYear()}" required placeholder="VD: 2024">
        </div>
        <div class="form-group">
          <label>Danh sách tác giả (*)</label>
          <textarea name="danh_sach_tac_gia" rows="2" required placeholder="VD: Nguyễn Nhứt Lam, Lê Phong Dụ, Trần Văn A">${data.danh_sach_tac_gia || ''}</textarea>
        </div>
        <div class="form-group">
          <label>Tên tạp chí / hội nghị khoa học</label>
          <input type="text" name="ten_tap_chi_hoi_nghi" value="${data.ten_tap_chi_hoi_nghi || 'Hội nghị Khoa học'}" placeholder="VD: SN Computer Science, IEEE Transactions">
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
    } else if (entityKey === 'staffGroups') {
      html += `
        <div class="form-group">
          <label>Tên nhóm nhân sự (*)</label>
          <input type="text" name="main_title" value="${data.ten_nhom || ''}" required placeholder="VD: Lãnh đạo Khoa">
        </div>
        <div class="form-group">
          <label>Mã số nhóm (Số thứ tự sắp xếp nhóm) (*)</label>
          <input type="number" name="ma_nhom" value="${data.ma_nhom || 2}" required placeholder="VD: 1 cho Lãnh đạo, 2 cho Giảng viên">
        </div>
      `;
    } else if (entityKey === 'homepageHero') {
      html += `
        <div class="form-group">
          <label>Slogan tiếng Việt (*)</label>
          <input type="text" name="main_title" value="${data.slogan_vi || ''}" required placeholder="VD: Tri thức - Sáng tạo - Hội nhập">
        </div>
        <div class="form-group">
          <label>Slogan tiếng Anh</label>
          <input type="text" name="sub_title" value="${data.slogan_en || ''}" placeholder="VD: Knowledge - Creativity - Integration">
        </div>
        ${renderImageField('Ảnh Banner Hero (Tải lên từ máy) (*)', 'image_url', data.hinh_anh_banner_url, 'upload_hero_banner_input', 'field_hero_banner_url')}
      `;
    } else if (entityKey === 'homepagePrograms') {
      html += `
        <div class="form-group">
          <label>Tên chương trình đào tạo (*)</label>
          <input type="text" name="main_title" value="${data.ten_chuong_trinh || ''}" required placeholder="VD: Kỹ sư Trí tuệ nhân tạo">
        </div>
        <div class="form-group">
          <label>Nhãn thẻ (Badge Text - VD: AUN-QA, HOT)</label>
          <input type="text" name="badge_text" value="${data.badge_text || ''}" placeholder="VD: HOT">
        </div>
        <div class="form-group">
          <label>Nhãn kiểm định (VD: Đạt chuẩn kiểm định AUN-QA)</label>
          <input type="text" name="nhan_kiem_dinh" value="${data.nhan_kiem_dinh || ''}" placeholder="VD: Đạt chuẩn kiểm định AUN-QA">
        </div>
        <div class="form-group">
          <label>Mô tả ngắn định hướng (*)</label>
          <textarea name="description" rows="3" required placeholder="Nhập mô tả định hướng của ngành...">${data.mo_ta_ngan || ''}</textarea>
        </div>
        <div class="form-group">
          <label>Đường dẫn chi tiết (Link chi tiết)</label>
          <input type="text" name="link_chi_tiet" value="${data.link_chi_tiet || ''}" placeholder="VD: /dai-hoc/cntt.html">
        </div>
        <div class="form-group">
          <label>Thứ tự hiển thị</label>
          <input type="number" name="thu_tu" value="${data.thu_tu || 0}">
        </div>
      `;
    } else if (entityKey === 'homepageAdmissions') {
      html += `
        <div class="form-group">
          <label>Tiêu đề Box Tuyển sinh (*)</label>
          <input type="text" name="main_title" value="${data.tieu_de_box || ''}" required placeholder="VD: 🎓 Tuyển sinh 2026">
        </div>
        <div class="form-group">
          <label>Mã ngành AI (*)</label>
          <input type="text" name="ma_nganh_ai" value="${data.ma_nganh_ai || '7480107'}" required>
        </div>
        <div class="form-group">
          <label>Mã ngành Khoa học Máy tính (*)</label>
          <input type="text" name="ma_nganh_cs" value="${data.ma_nganh_cs || '7480101'}" required>
        </div>
        <div class="form-group">
          <label>Tổ hợp xét tuyển (*)</label>
          <input type="text" name="to_hop_xet_tuyen" value="${data.to_hop_xet_tuyen || 'A00, A01, D01, D07'}" required placeholder="VD: A00, A01, D01">
        </div>
        <div class="form-group">
          <label>Điểm chuẩn 2025 ngành AI (*)</label>
          <input type="number" step="0.01" name="diem_chuan_2025_ai" value="${data.diem_chuan_2025_ai || 23.04}" required>
        </div>
        <div class="form-group">
          <label>Điểm chuẩn 2025 ngành KHMT (*)</label>
          <input type="number" step="0.01" name="diem_chuan_2025_cs" value="${data.diem_chuan_2025_cs || 23.07}" required>
        </div>
        <div class="form-group">
          <label>Chỉ tiêu 2026 ngành AI (*)</label>
          <input type="number" name="chi_tieu_2026_ai" value="${data.chi_tieu_2026_ai || 200}" required>
        </div>
        <div class="form-group">
          <label>Chỉ tiêu 2026 ngành KHMT (*)</label>
          <input type="number" name="chi_tieu_2026_cs" value="${data.chi_tieu_2026_cs || 83}" required>
        </div>
        <div class="form-group">
          <label>Kênh liên hệ hỗ trợ tuyển sinh (*)</label>
          <input type="text" name="lien_he_tuyen_sinh" value="${data.lien_he_tuyen_sinh || ''}" required placeholder="VD: Số điện thoại hoặc Website">
        </div>
        <div class="form-group">
          <label>Văn bản mô tả đầy đủ (*)</label>
          <textarea name="description" rows="4" required placeholder="Nhập văn bản mô tả đầy đủ tuyển sinh...">${data.noi_dung_day_du || ''}</textarea>
        </div>
        <div class="form-group">
          <label>Trạng thái hiển thị (*)</label>
          <select name="an_hien" required>
            <option value="1" ${data.an_hien !== 0 ? 'selected' : ''}>Hiện trên Website</option>
            <option value="0" ${data.an_hien === 0 ? 'selected' : ''}>Ẩn khỏi Website</option>
          </select>
        </div>
      `;
    } else if (entityKey === 'homepageEvents') {
      html += `
        <div class="form-group">
          <label>Tiêu đề sự kiện (*)</label>
          <input type="text" name="main_title" value="${data.tieu_de_su_kien || ''}" required placeholder="VD: Hội thảo khoa học về Trí tuệ nhân tạo 2026">
        </div>
        <div class="form-group">
          <label>Ngày sự kiện (*)</label>
          <input type="text" name="sub_title" value="${data.ngay_su_kien || ''}" required placeholder="VD: 19-07-2026">
        </div>
        <div class="form-group">
          <label>Link chi tiết tin tức</label>
          <input type="text" name="link_chi_tiet" value="${data.link_chi_tiet || '#'}" placeholder="VD: /tin-tuc/?slug=cita-2026">
        </div>
        <div class="form-group">
          <label>Thứ tự hiển thị</label>
          <input type="number" name="thu_tu" value="${data.thu_tu || 0}">
        </div>
      `;
    } else if (entityKey === 'sliders') {
      html += `
        <div class="form-group">
          <label>Tên Slide (*)</label>
          <input type="text" name="main_title" value="${data.ten_slide || ''}" required placeholder="VD: Chào mừng đến với Khoa CNTT">
        </div>
        <div class="form-group">
          <label>Link liên kết</label>
          <input type="text" name="sub_title" value="${data.link_lien_ket || '#'}" placeholder="VD: #programs-section">
        </div>
        ${renderImageField('Hình ảnh Slide (Tải lên từ máy) (*)', 'image_url', data.hinh_anh_url, 'upload_slider_img_input', 'field_slider_image_url')}
        <div class="form-group">
          <label>Thứ tự hiển thị</label>
          <input type="number" name="thu_tu" value="${data.thu_tu || 0}">
        </div>
      `;
    } else if (entityKey === 'infographics') {
      html += `
        <div class="form-group">
          <label>Tên Infographic (*)</label>
          <input type="text" name="main_title" value="${data.ten_infographic || ''}" required placeholder="VD: Đại học - Ngành Trí tuệ Nhân tạo">
        </div>
        <div class="form-group">
          <label>Link File PDF tải về</label>
          <input type="text" name="sub_title" value="${data.file_pdf_url || '#'}" placeholder="VD: assets/infographic/pdf_ttnt.pdf">
        </div>
        ${renderImageField('Hình ảnh Preview (Tải lên từ máy) (*)', 'image_url', data.file_anh_url, 'upload_infographic_img_input', 'field_infographic_image_url')}
        <div class="form-group">
          <label>Thứ tự hiển thị</label>
          <input type="number" name="thu_tu" value="${data.thu_tu || 0}">
        </div>
      `;
    } else if (entityKey === 'stats') {
      html += `
        <div class="form-group">
          <label>Tên chỉ số (*)</label>
          <input type="text" name="main_title" value="${data.ten_chi_so || ''}" required placeholder="VD: Sinh viên đang theo học">
        </div>
        <div class="form-group">
          <label>Số liệu thống kê (*)</label>
          <input type="number" name="sub_title" value="${data.so_lieu_thong_ke || ''}" required placeholder="VD: 1200">
        </div>
        <div class="form-group">
          <label>Đơn vị (VD: +, %, người)</label>
          <input type="text" name="don_vi" value="${data.don_vi || ''}" placeholder="VD: +">
        </div>
        <div class="form-group">
          <label>Ghi chú thời gian</label>
          <input type="text" name="ghi_chu_thoi_gian" value="${data.ghi_chu_thoi_gian || ''}" placeholder="VD: Tính đến tháng 12/2025">
        </div>
        <div class="form-group">
          <label>Thứ tự hiển thị</label>
          <input type="number" name="thu_tu" value="${data.thu_tu || 0}">
        </div>
      `;
    } else if (entityKey === 'students') {
      html += `
        <div class="form-group">
          <label>Phân loại mục hiển thị (*)</label>
          <select name="chuyen_muc" required>
            <option value="Sinh viên tiêu biểu" ${data.chuyen_muc === 'Sinh viên tiêu biểu' ? 'selected' : ''}>🏆 Sinh viên tiêu biểu</option>
            <option value="Nghiên cứu khoa học sinh viên" ${data.chuyen_muc === 'Nghiên cứu khoa học sinh viên' ? 'selected' : ''}>🔬 Nghiên cứu khoa học sinh viên</option>
            <option value="Dự án AI nổi bật" ${data.chuyen_muc === 'Dự án AI nổi bật' ? 'selected' : ''}>🤖 Dự án AI nổi bật</option>
          </select>
        </div>
        <div class="form-group">
          <label>Tên Đội / Cá nhân (*)</label>
          <input type="text" name="main_title" value="${data.ten_doi_ca_nhan || ''}" required placeholder="VD: Đội CTU-LinguTechies">
        </div>
        <div class="form-group">
          <label>Ngành học / Lớp</label>
          <input type="text" name="sub_title" value="${data.nganh_hoc || ''}" placeholder="VD: Ngành Khoa học máy tính">
        </div>
        <div class="form-group">
          <label>Giảng viên hướng dẫn</label>
          <input type="text" name="giang_vien_huong_dan" value="${data.giang_vien_huong_dan || ''}" placeholder="VD: PGS. TS. Phạm Nguyên Khang">
        </div>
        <div class="form-group">
          <label>Thành tích đạt được (*)</label>
          <textarea name="description" rows="3" required placeholder="Nhập chi tiết thành tích...">${data.thanh_tich || ''}</textarea>
        </div>
        ${renderImageField('Hình ảnh đạt giải / Cá nhân (Tải lên từ máy) (*)', 'image_url', data.hinh_anh_url, 'upload_student_img_input', 'field_student_image_url')}
        <div class="form-group">
          <label>Thứ tự hiển thị</label>
          <input type="number" name="thu_tu" value="${data.thu_tu || 0}">
        </div>
        <div class="form-group">
          <label>Trạng thái hiển thị (*)</label>
          <select name="an_hien" required>
            <option value="1" ${data.an_hien !== 0 ? 'selected' : ''}>Hiện trên Website</option>
            <option value="0" ${data.an_hien === 0 ? 'selected' : ''}>Ẩn khỏi Website</option>
          </select>
        </div>
      `;
    } else if (entityKey === 'alumni') {
      html += `
        <div class="form-group">
          <label>Họ tên Cựu sinh viên (*)</label>
          <input type="text" name="main_title" value="${data.ho_ten || ''}" required placeholder="VD: Trần Hoàng Thảo Nguyên">
        </div>
        <div class="form-group">
          <label>Chức danh & Công ty công tác (*)</label>
          <input type="text" name="sub_title" value="${data.chuc_danh_cong_ty || ''}" required placeholder="VD: Data Engineer @ PTN Global">
        </div>
        <div class="form-group">
          <label>Trích dẫn cảm nghĩ (*)</label>
          <textarea name="description" rows="3" required placeholder="Nhập trích dẫn cảm nhận về Khoa...">${data.trich_dan_cam_nhan || ''}</textarea>
        </div>
        ${renderImageField('Hình ảnh đại diện (Tải lên từ máy) (*)', 'image_url', data.hinh_anh_avatar_url, 'upload_alumni_img_input', 'field_alumni_image_url')}
        <div class="form-group">
          <label>Thứ tự hiển thị</label>
          <input type="number" name="thu_tu" value="${data.thu_tu || 0}">
        </div>
        <div class="form-group">
          <label>Trạng thái hiển thị (*)</label>
          <select name="an_hien" required>
            <option value="1" ${data.an_hien !== 0 ? 'selected' : ''}>Hiện trên Website</option>
            <option value="0" ${data.an_hien === 0 ? 'selected' : ''}>Ẩn khỏi Website</option>
          </select>
        </div>
      `;
    } else if (entityKey === 'homepageGallery') {
      html += `
        <div class="form-group">
          <label>Tiêu đề ảnh (*)</label>
          <input type="text" name="main_title" value="${data.tieu_de_anh || ''}" required placeholder="VD: Lễ bảo vệ luận văn Thạc sĩ">
        </div>
        ${renderImageField('Hình ảnh hoạt động (Tải lên từ máy) (*)', 'image_url', data.hinh_anh_url, 'upload_hpgallery_img_input', 'field_hpgallery_image_url')}
        <div class="form-group">
          <label>Thứ tự hiển thị</label>
          <input type="number" name="thu_tu" value="${data.thu_tu || 0}">
        </div>
      `;
    } else if (entityKey === 'aboutOverview') {
      html += `
        <div class="form-group">
          <label>Tiêu đề chính (*)</label>
          <input type="text" name="main_title" value="${data.tieu_de || ''}" required placeholder="VD: KHOA CÔNG NGHỆ THÔNG TIN">
        </div>
        <div class="form-group">
          <label>Badge text (Chữ nhỏ phía trên) (*)</label>
          <input type="text" name="sub_title" value="${data.badge_text || ''}" required placeholder="VD: GIỚI THIỆU TỔNG QUAN">
        </div>
        <div class="form-group">
          <label>Nội dung giới thiệu chi tiết (*)</label>
          <textarea name="description" rows="5" required placeholder="Nhập nội dung...">${data.mo_ta_chi_tiet || ''}</textarea>
        </div>
        ${renderImageField('Hình ảnh tập thể (Tải lên từ máy) (*)', 'image_url', data.hinh_anh_tap_the_url, 'upload_overview_img_input', 'field_overview_image_url')}
        <div class="form-group">
          <label>Chú thích ảnh tập thể</label>
          <input type="text" name="caption_anh" value="${data.caption_anh || ''}" placeholder="VD: Tập thể giảng viên Khoa CNTT">
        </div>
      `;
    } else if (entityKey === 'aboutHighlights') {
      html += `
        <div class="form-group">
          <label>Tiêu đề highlight (*)</label>
          <input type="text" name="main_title" value="${data.tieu_de || ''}" required placeholder="VD: Chương trình đào tạo">
        </div>
        <div class="form-group">
          <label>Icon class (VD: graduation-cap, flask, share-2) (*)</label>
          <input type="text" name="sub_title" value="${data.icon_class || 'graduation-cap'}" required placeholder="VD: graduation-cap">
        </div>
        <div class="form-group">
          <label>Mô tả ngắn (*)</label>
          <textarea name="description" rows="3" required placeholder="Nhập mô tả điểm nổi bật...">${data.mo_ta || ''}</textarea>
        </div>
        <div class="form-group">
          <label>Thứ tự hiển thị</label>
          <input type="number" name="thu_tu" value="${data.thu_tu || 0}">
        </div>
      `;
    } else if (entityKey === 'aboutMission') {
      html += `
        <div class="form-group">
          <label>Tiêu đề khối (*)</label>
          <input type="text" name="main_title" value="${data.tieu_de || ''}" required placeholder="VD: SỨ MỆNH">
        </div>
        <div class="form-group">
          <label>Phân loại (*)</label>
          <select name="loai" required>
            <option value="su_menh" ${data.loai === 'su_menh' ? 'selected' : ''}>Sứ mệnh (su_menh)</option>
            <option value="tam_nhin" ${data.loai === 'tam_nhin' ? 'selected' : ''}>Tầm nhìn (tam_nhin)</option>
          </select>
        </div>
        <div class="form-group">
          <label>Nội dung chi tiết sứ mệnh/tầm nhìn (*)</label>
          <textarea name="description" rows="5" required placeholder="Nhập nội dung...">${data.noi_dung || ''}</textarea>
        </div>
      `;
    } else if (entityKey === 'timeline') {
      html += `
        <div class="form-group">
          <label>Năm cột mốc (*)</label>
          <input type="text" name="main_title" value="${data.nam || ''}" required placeholder="VD: 2001">
        </div>
        <div class="form-group">
          <label>Ngày cụ thể (nếu có)</label>
          <input type="date" name="ngay_cu_the" value="${data.ngay_cu_the || ''}">
        </div>
        <div class="form-group">
          <label>Số quyết định (nếu có)</label>
          <input type="text" name="so_quyet_dinh" value="${data.so_quyet_dinh || ''}" placeholder="VD: 112/QĐ-UBND">
        </div>
        <div class="form-group">
          <label>Nội dung sự kiện lịch sử (*)</label>
          <textarea name="description" rows="3" required placeholder="Nhập nội dung cột mốc...">${data.noi_dung || ''}</textarea>
        </div>
        <div class="form-group">
          <label>Thứ tự hiển thị</label>
          <input type="number" name="thu_tu" value="${data.thu_tu || 0}">
        </div>
      `;
    } else if (entityKey === 'partners') {
      html += `
        <div class="form-group">
          <label>Tên đối tác (*)</label>
          <input type="text" name="main_title" value="${data.ten_doi_tac || ''}" required placeholder="VD: CNRS">
        </div>
        <div class="form-group">
          <label>Vị trí hiển thị (VD: gioi_thieu) (*)</label>
          <input type="text" name="hien_thi_o" value="${data.hien_thi_o || 'gioi_thieu'}" required placeholder="VD: gioi_thieu">
        </div>
        ${renderImageField('Logo đối tác (Tải lên từ máy) (*)', 'image_url', data.logo_url, 'upload_partner_logo_input', 'field_partner_logo_url')}
        <div class="form-group">
          <label>Thứ tự hiển thị</label>
          <input type="number" name="thu_tu" value="${data.thu_tu || 0}">
        </div>
      `;
    } else if (entityKey === 'aboutDeansContact') {
      let staffOptions = '';
      if (Array.isArray(this.staffList)) {
        staffOptions = this.staffList.map(s => `<option value="${s.id}" ${data.nhan_vien_id === s.id ? 'selected' : ''}>${s.ho_ten} (${s.chuc_vu})</option>`).join('');
      }
      html += `
        <div class="form-group">
          <label>Họ tên Ban Giám Khoa (*)</label>
          <input type="text" name="main_title" value="${data.ho_ten || ''}" required placeholder="VD: TS. Nguyễn Nhứt Lam">
        </div>
        <div class="form-group">
          <label>Chức vụ phụ trách (*)</label>
          <input type="text" name="sub_title" value="${data.chuc_vu_phu_trach || ''}" required placeholder="VD: Trưởng khoa - Phụ trách chung">
        </div>
        <div class="form-group">
          <label>Email liên hệ (*)</label>
          <input type="email" name="email" value="${data.email || ''}" required placeholder="VD: lamnn@tvu.edu.vn">
        </div>
        <div class="form-group">
          <label>Liên kết với tài khoản Nhân sự (Staff)</label>
          <select name="nhan_vien_id">
            <option value="">-- Chọn nhân sự liên kết (Nếu có) --</option>
            ${staffOptions}
          </select>
        </div>
        <div class="form-group">
          <label>Thứ tự hiển thị</label>
          <input type="number" name="thu_tu" value="${data.thu_tu || 0}">
        </div>
      `;
    } else if (entityKey === 'aboutUnitContact') {
      html += `
        <div class="form-group">
          <label>Tên đơn vị (*)</label>
          <input type="text" name="main_title" value="${data.ten_don_vi || ''}" required placeholder="VD: Khoa Công nghệ thông tin">
        </div>
        <div class="form-group">
          <label>Trường trực thuộc (*)</label>
          <input type="text" name="sub_title" value="${data.truong_don_vi || ''}" required placeholder="VD: Trường Đại học Trà Vinh">
        </div>
        <div class="form-group">
          <label>Khu vực (*)</label>
          <input type="text" name="khu" value="${data.khu || 'Khu I'}" required>
        </div>
        <div class="form-group">
          <label>Đại học chủ quản (*)</label>
          <input type="text" name="dai_hoc" value="${data.dai_hoc || 'Đại học Trà Vinh'}" required>
        </div>
        <div class="form-group">
          <label>Số nhà, Đường (*)</label>
          <input type="text" name="dia_chi_duong" value="${data.dia_chi_duong || 'Số 126 Nguyễn Thiện Thành'}" required>
        </div>
        <div class="form-group">
          <label>Phường / Xã (*)</label>
          <input type="text" name="phuong" value="${data.phuong || 'Phường 5'}" required>
        </div>
        <div class="form-group">
          <label>Thành phố / Tỉnh (*)</label>
          <input type="text" name="thanh_pho" value="${data.thanh_pho || 'Thành phố Trà Vinh'}" required>
        </div>
        <div class="form-group">
          <label>Đường dẫn Facebook Fanpage</label>
          <input type="text" name="facebook_url" value="${data.facebook_url || ''}">
        </div>
        <div class="form-group">
          <label>Copyright text chân trang (*)</label>
          <input type="text" name="description" value="${data.copyright_text || ''}" required placeholder="VD: © 2026 Khoa Công nghệ thông tin - ĐHTV">
        </div>
      `;
    } else if (entityKey === 'researchDirections') {
      html += `
        <div class="form-group">
          <label>Tên hướng nghiên cứu (*)</label>
          <input type="text" name="main_title" value="${data.ten || ''}" required placeholder="VD: Khai phá dữ liệu và trí tuệ nhân tạo">
        </div>
        <div class="form-group">
          <label>Mô tả chi tiết (*)</label>
          <textarea name="description" rows="3" required placeholder="Nhập chi tiết hướng nghiên cứu...">${data.mo_ta || ''}</textarea>
        </div>
        <div class="form-group">
          <label>Thứ tự hiển thị</label>
          <input type="number" name="thu_tu" value="${data.thu_tu || 0}">
        </div>
      `;
    } else if (entityKey === 'researchProjects') {
      html += `
        <div class="form-group">
          <label>Tên đề tài NCKH (*)</label>
          <input type="text" name="main_title" value="${data.ten_de_tai || ''}" required placeholder="VD: TVU-Bot: Trợ lý ảo...">
        </div>
        <div class="form-group">
          <label>Chủ nhiệm đề tài (*)</label>
          <input type="text" name="sub_title" value="${data.chu_nhiem_ten || ''}" required placeholder="VD: TS. Nguyễn Nhứt Lam">
        </div>
        <div class="form-group">
          <label>Cấp đề tài</label>
          <input type="text" name="description" value="${data.cap || 'Đề tài nghiên cứu cấp cơ sở'}" placeholder="VD: Đề tài cấp cơ sở, Đề tài cấp Bộ">
        </div>
        <div class="form-group">
          <label>Trạng thái đề tài (*)</label>
          <select name="trang_thai" required>
            <option value="Đang thực hiện" ${data.trang_thai === 'Đang thực hiện' ? 'selected' : ''}>Đang thực hiện</option>
            <option value="Đã hoàn thành" ${data.trang_thai === 'Đã hoàn thành' ? 'selected' : ''}>Đã hoàn thành</option>
          </select>
        </div>
        <div class="form-group">
          <label>Thứ tự hiển thị</label>
          <input type="number" name="thu_tu" value="${data.thu_tu || 0}">
        </div>
      `;
    } else if (entityKey === 'researchPublications') {
      html += `
        <div class="form-group">
          <label>Tên bài báo khoa học (*)</label>
          <input type="text" name="main_title" value="${data.ten_bai_bao || ''}" required placeholder="VD: When Self-supervised Transformers Meet...">
        </div>
        <div class="form-group">
          <label>Năm xuất bản (*)</label>
          <input type="number" name="sub_title" value="${data.nam_xuat_ban || ''}" required placeholder="VD: 2026">
        </div>
        <div class="form-group">
          <label>Danh sách tác giả (*)</label>
          <textarea name="description" rows="2" required placeholder="VD: Nguyen, L. N. and Thach, K. S.">${data.tac_gia || ''}</textarea>
        </div>
        <div class="form-group">
          <label>Loại hình công bố (*)</label>
          <select name="loai_hinh_cong_bo" required>
            <option value="JOURNAL ARTICLE" ${data.loai_hinh_cong_bo === 'JOURNAL ARTICLE' ? 'selected' : ''}>Tạp chí (Journal Article)</option>
            <option value="CONFERENCE PAPER" ${data.loai_hinh_cong_bo === 'CONFERENCE PAPER' ? 'selected' : ''}>Hội nghị (Conference Paper)</option>
            <option value="BOOK CHAPTER" ${data.loai_hinh_cong_bo === 'BOOK CHAPTER' ? 'selected' : ''}>Chương sách (Book Chapter)</option>
          </select>
        </div>
        <div class="form-group">
          <label>Tên tạp chí / hội nghị khoa học (*)</label>
          <input type="text" name="ten_tap_chi_hoi_nghi" value="${data.ten_tap_chi_hoi_nghi || ''}" required placeholder="VD: SN Computer Science, Springer">
        </div>
        <div class="form-group">
          <label>BibTeX Key</label>
          <input type="text" name="bibtex_key" value="${data.bibtex_key || ''}" placeholder="VD: nguyen2026self">
        </div>
        <div class="form-group">
          <label>Thứ tự hiển thị</label>
          <input type="number" name="thu_tu" value="${data.thu_tu || 0}">
        </div>
      `;
    } else if (entityKey === 'researchLabs') {
      let staffOptions = '';
      if (Array.isArray(this.staffList)) {
        staffOptions = this.staffList.map(s => `<option value="${s.id}" ${data.truong_phong_id === s.id ? 'selected' : ''}>${s.ho_ten} (${s.chuc_vu})</option>`).join('');
      }
      html += `
        <div class="form-group">
          <label>Tên phòng thí nghiệm (*)</label>
          <input type="text" name="main_title" value="${data.ten || ''}" required placeholder="VD: Phòng Thí nghiệm Thị giác máy tính và Xử lý ảnh">
        </div>
        <div class="form-group">
          <label>Tên viết tắt (nếu có)</label>
          <input type="text" name="sub_title" value="${data.ten_viet_tat || ''}" placeholder="VD: CVIP">
        </div>
        <div class="form-group">
          <label>Tên Trưởng phòng thí nghiệm (Hiển thị text)</label>
          <input type="text" name="truong_phong_ten" value="${data.truong_phong_ten || ''}" placeholder="VD: TS. Nguyễn Nhứt Lam">
        </div>
        <div class="form-group">
          <label>Nhân sự liên kết Trưởng phòng (Staff Link)</label>
          <select name="truong_phong_id">
            <option value="">-- Chọn nhân sự liên kết --</option>
            ${staffOptions}
          </select>
        </div>
        <div class="form-group">
          <label>Mô tả hoạt động của phòng thí nghiệm</label>
          <textarea name="description" rows="3" placeholder="Nhập mô tả hoạt động chính...">${data.mo_ta || ''}</textarea>
        </div>
        ${renderImageField('Hình ảnh hoạt động / Banner Lab (Tải lên từ máy)', 'image_url', data.hinh_anh_url, 'upload_lab_image_input', 'field_lab_image_url')}
      `;
    } else if (entityKey === 'researchContacts') {
      html += `
        <div class="form-group">
          <label>Tên đại diện (*)</label>
          <input type="text" name="main_title" value="${data.ten_daidien || ''}" required placeholder="VD: TS. Nguyễn Nhứt Lam">
        </div>
        <div class="form-group">
          <label>Chức vụ / Nhiệm vụ (*)</label>
          <input type="text" name="sub_title" value="${data.chuc_vu_nhiem_vu || ''}" required placeholder="VD: Trưởng nhóm Nghiên cứu Trí tuệ Nhân tạo (AILab-TVU)">
        </div>
        <div class="form-group">
          <label>Email liên hệ</label>
          <input type="email" name="email" value="${data.email || ''}" placeholder="VD: lamnn@tvu.edu.vn">
        </div>
        <div class="form-group">
          <label>Thứ tự hiển thị</label>
          <input type="number" name="thu_tu" value="${data.thu_tu || 0}">
        </div>
      `;
    } else if (entityKey === 'undergradPrograms') {
      html += `
        <div class="form-group">
          <label>Tên ngành (*)</label>
          <input type="text" name="main_title" value="${data.ten_nganh || ''}" required placeholder="VD: Công nghệ thông tin">
        </div>
        <div class="form-group">
          <label>Mã tuyển sinh (*)</label>
          <input type="text" name="sub_title" value="${data.ma_tuyen_sinh || ''}" required placeholder="VD: 7480201">
        </div>
        <div class="form-group">
          <label>Văn bằng tốt nghiệp (*)</label>
          <input type="text" name="van_bang_tot_nghiep" value="${data.van_bang_tot_nghiep || 'Kỹ sư'}" required placeholder="VD: Kỹ sư">
        </div>
        <div class="form-group">
          <label>Thời gian học (*)</label>
          <input type="text" name="thoi_gian_hoc" value="${data.thoi_gian_hoc || '4.5 Năm'}" required placeholder="VD: 4.5 Năm">
        </div>
        <div class="form-group">
          <label>Tổng số tín chỉ (*)</label>
          <input type="number" name="tong_so_tin_chi" value="${data.tong_so_tin_chi || 161}" required placeholder="VD: 161">
        </div>
        <div class="form-group">
          <label>Giới thiệu ngành (*)</label>
          <textarea name="gioi_thieu_nganh" rows="4" required placeholder="Mô tả tóm tắt giới thiệu ngành...">${data.gioi_thieu_nganh || ''}</textarea>
        </div>
        <div class="form-group">
          <label>Cơ hội phát triển học tập & nghề nghiệp (*)</label>
          <textarea name="co_hoi_phat_trien" rows="4" required placeholder="Nhập cơ hội nghề nghiệp sau khi ra trường...">${data.co_hoi_phat_trien || ''}</textarea>
        </div>
      `;
    } else if (entityKey === 'undergradMethods' || entityKey === 'undergradCurriculum' || entityKey === 'undergradPlos' || entityKey === 'undergradCourses') {
      const isMethod = entityKey === 'undergradMethods';
      const isCurriculum = entityKey === 'undergradCurriculum';
      const isPlo = entityKey === 'undergradPlos';
      const isCourse = entityKey === 'undergradCourses';

      const programOptions = `
        <option value="1" ${String(data.nganh_id) === '1' ? 'selected' : ''}>Công nghệ thông tin (Kỹ sư)</option>
        <option value="2" ${String(data.nganh_id) === '2' ? 'selected' : ''}>Trí tuệ nhân tạo (Kỹ sư)</option>
      `;

      html += `
        <div class="form-group">
          <label>Liên kết với Ngành đào tạo (*)</label>
          <select name="nganh_id" required>
            ${programOptions}
          </select>
        </div>
      `;

      if (isMethod) {
        html += `
          <div class="form-group">
            <label>Tên phương thức xét tuyển (*)</label>
            <input type="text" name="main_title" value="${data.ten_phuong_thuc || ''}" required placeholder="VD: Xét tuyển học bạ THPT">
          </div>
          <div class="form-group">
            <label>Danh sách các tổ hợp môn (*)</label>
            <input type="text" name="sub_title" value="${data.danh_sach_to_hop || ''}" required placeholder="VD: A00, A01, C01, D07">
          </div>
        `;
      } else if (isCurriculum) {
        html += `
          <div class="form-group">
            <label>Tên khối kiến thức (*)</label>
            <input type="text" name="main_title" value="${data.ten_khoi || ''}" required placeholder="VD: Kiến thức Đại cương">
          </div>
          <div class="form-group">
            <label>Số tín chỉ (*)</label>
            <input type="number" name="sub_title" value="${data.so_tin_chi || 3}" required placeholder="VD: 56">
          </div>
          <div class="form-group">
            <label>Mô tả chi tiết khối kiến thức (*)</label>
            <textarea name="description" rows="3" required placeholder="Các học phần chính hoặc định hướng của khối...">${data.mo_ta_khoi || ''}</textarea>
          </div>
        `;
      } else if (isPlo) {
        html += `
          <div class="form-group">
            <label>Mã PLO (*)</label>
            <input type="text" name="main_title" value="${data.ma_plo || ''}" required placeholder="VD: PLO3">
          </div>
          <div class="form-group">
            <label>Nội dung chuẩn đầu ra PLO (*)</label>
            <textarea name="description" rows="3" required placeholder="Nhập nội dung chuẩn đầu ra...">${data.noi_dung_plo || ''}</textarea>
          </div>
        `;
      } else if (isCourse) {
        html += `
          <div class="form-group">
            <label>Tên học phần (*)</label>
            <input type="text" name="main_title" value="${data.ten_hoc_phan || ''}" required placeholder="VD: Phát triển ứng dụng Web">
          </div>
          <div class="form-group">
            <label>Mã học phần (*)</label>
            <input type="text" name="sub_title" value="${data.ma_hoc_phan || ''}" required placeholder="VD: CT294">
          </div>
          <div class="form-group">
            <label>Số tín chỉ (*)</label>
            <input type="number" name="so_tin_chi" value="${data.so_tin_chi || 3}" required>
          </div>
          <div class="form-group">
            <label>Năng lực hình thành sau học phần (*)</label>
            <textarea name="description" rows="3" required placeholder="VD: Thiết kế, xây dựng và triển khai ứng dụng web...">${data.nang_luc_hinh_thanh || ''}</textarea>
          </div>
        `;
      }

      html += `
        <div class="form-group">
          <label>Thứ tự hiển thị</label>
          <input type="number" name="thu_tu" value="${data.thu_tu || 0}">
        </div>
      `;
    } else if (entityKey === 'undergradFaqs') {
      html += `
        <div class="form-group">
          <label>Câu hỏi (*)</label>
          <input type="text" name="main_title" value="${data.cau_hoi || ''}" required placeholder="Nhập câu hỏi sinh viên...">
        </div>
        <div class="form-group">
          <label>Câu trả lời chi tiết (*)</label>
          <textarea name="description" rows="4" required placeholder="Nhập câu trả lời...">${data.tra_loi || ''}</textarea>
        </div>
        <div class="form-group">
          <label>Thứ tự hiển thị</label>
          <input type="number" name="thu_tu" value="${data.thu_tu || 0}">
        </div>
      `;
    } else if (entityKey === 'postgradNotices') {
      html += `
        <div class="form-group">
          <label>Tiêu đề thông báo tuyển sinh (*)</label>
          <input type="text" name="main_title" value="${data.tieu_de_thong_bao || ''}" required placeholder="VD: Thông báo tuyển sinh Thạc sĩ năm 2026">
        </div>
        <div class="form-group">
          <label>Link chi tiết thông báo (*)</label>
          <input type="text" name="sub_title" value="${data.link_chi_tiet || '#'}" required placeholder="VD: https://gs.tvu.edu.vn/... hoặc #">
        </div>
        <div class="form-group">
          <label>Thông tin liên hệ tư vấn</label>
          <textarea name="description" rows="2" placeholder="VD: Địa chỉ nộp hồ sơ, Số điện thoại...">${data.lien_he_tu_van || ''}</textarea>
        </div>
        <div class="form-group">
          <label>Thứ tự hiển thị</label>
          <input type="number" name="thu_tu" value="${data.thu_tu || 0}">
        </div>
      `;
    } else if (entityKey === 'postgradPhdStudents') {
      html += `
        <div class="form-group">
          <label>Họ tên Nghiên cứu sinh (NCS) (*)</label>
          <input type="text" name="main_title" value="${data.ho_ten || ''}" required placeholder="VD: Bùi Xuân Tùng">
        </div>
        <div class="form-group">
          <label>Mã số NCS (*)</label>
          <input type="text" name="sub_title" value="${data.ma_ncs || ''}" required placeholder="VD: P2425004">
        </div>
        <div class="form-group">
          <label>Người hướng dẫn khoa học (*)</label>
          <input type="text" name="nguoi_huong_dan" value="${data.nguoi_huong_dan || ''}" required placeholder="VD: TS. Nguyễn Nhứt Lam, TS. Trần Việt Châu">
        </div>
        <div class="form-group">
          <label>Email liên hệ</label>
          <input type="email" name="email" value="${data.email || ''}" placeholder="VD: bxtung@tdu.edu.vn">
        </div>
        <div class="form-group">
          <label>Chức vụ & Cơ quan công tác</label>
          <input type="text" name="chuc_vu_co_quan" value="${data.chuc_vu_co_quan || ''}" placeholder="VD: Phó trưởng Bộ môn CNTT, Đại học Tây Đô">
        </div>
        <div class="form-group">
          <label>Số thứ tự hiển thị (VD: 01, 02)</label>
          <input type="text" name="stt" value="${data.stt || '01'}">
        </div>
        <div class="form-group">
          <label>Hướng nghiên cứu luận án (*)</label>
          <textarea name="description" rows="3" required placeholder="Tên đề tài hoặc hướng nghiên cứu của NCS...">${data.huong_nghien_cuu || ''}</textarea>
        </div>
        ${renderImageField('Ảnh đại diện NCS (Tải lên từ máy)', 'image_url', data.avatar_url, 'upload_phd_avatar_input', 'field_phd_avatar_url')}
        <div class="form-group">
          <label>Trạng thái hiển thị NCS (*)</label>
          <select name="an_hien" required>
            <option value="1" ${data.an_hien !== 0 ? 'selected' : ''}>Hiện trên Website</option>
            <option value="0" ${data.an_hien === 0 ? 'selected' : ''}>Ẩn khỏi Website</option>
          </select>
        </div>
        <div class="form-group">
          <label>Hiển thị Mã số NCS (*)</label>
          <select name="an_hien_ma_ncs" required>
            <option value="1" ${data.an_hien_ma_ncs !== 0 ? 'selected' : ''}>Hiện Mã số NCS</option>
            <option value="0" ${data.an_hien_ma_ncs === 0 ? 'selected' : ''}>Ẩn Mã số NCS</option>
          </select>
        </div>
        <div class="form-group">
          <label>Hiển thị Email NCS (*)</label>
          <select name="an_hien_email" required>
            <option value="1" ${data.an_hien_email !== 0 ? 'selected' : ''}>Hiện Email</option>
            <option value="0" ${data.an_hien_email === 0 ? 'selected' : ''}>Ẩn Email</option>
          </select>
        </div>
      `;
    } else if (entityKey === 'postgradStats') {
      html += `
        <div class="form-group">
          <label>Tiêu đề biểu đồ thống kê (*)</label>
          <input type="text" name="main_title" value="${data.tieu_de_bieu_do || ''}" required placeholder="VD: Biểu đồ tuyển sinh qua các năm">
        </div>
        <div class="form-group">
          <label>Mốc thời gian tính (*)</label>
          <input type="text" name="sub_title" value="${data.moc_thoi_gian_tinh || ''}" required placeholder="VD: 2022 - 2026">
        </div>
        <div class="form-group">
          <label>Cấu hình dữ liệu biểu đồ (JSON Config) (*)</label>
          <textarea name="chart_config_json" rows="6" required placeholder='VD: {"batches": ["K22", "K23"], "masterCounts": [9, 8], "phdCounts": [0, 0]}'>${typeof data.chart_config_json === 'object' ? JSON.stringify(data.chart_config_json, null, 2) : (data.chart_config_json || '')}</textarea>
        </div>
        <div class="form-group">
          <label>Thứ tự hiển thị</label>
          <input type="number" name="thu_tu" value="${data.thu_tu || 0}">
        </div>
      `;
    } else if (entityKey === 'news') {
      html += `
        <div class="form-group">
          <label>Tiêu đề bài viết tin tức (*)</label>
          <input type="text" name="main_title" value="${data.tieu_de || ''}" required placeholder="VD: Tham dự hội thảo khoa học quốc tế CITA 2026">
        </div>
        <div class="form-group">
          <label>Ngày đăng (*)</label>
          <input type="date" name="sub_title" value="${data.ngay_dang ? data.ngay_dang.split('T')[0] : ''}" required>
        </div>
        <div class="form-group">
          <label>Nhãn lớn hiển thị ở góc ảnh (VD: 19-07-2026)</label>
          <input type="text" name="nhan_lon" value="${data.nhan_lon || ''}" placeholder="VD: 19-07-2026">
        </div>
        <div class="form-group">
          <label>Nhãn nhỏ / Địa điểm sự kiện (VD: Vịnh Hạ Long)</label>
          <input type="text" name="nhan_nho" value="${data.nhan_nho || 'Tin tức'}" placeholder="VD: Vịnh Hạ Long, Quảng Ninh">
        </div>
        ${renderImageField('Hình ảnh chính bài viết (Tải lên từ máy) (*)', 'image_url', data.anh_chinh, 'upload_news_img_input', 'field_news_image_url')}
        <div class="form-group">
          <label>Tóm tắt ngắn bài viết</label>
          <textarea name="tom_tat" rows="2" placeholder="Nhập tóm tắt hiển thị ở card tin tức...">${data.tom_tat || ''}</textarea>
        </div>
        <div class="form-group">
          <label>Nội dung chi tiết bài viết (HTML) (*)</label>
          <textarea name="description" rows="6" required placeholder="Nhập nội dung chi tiết bài viết (chấp nhận thẻ HTML)...">${data.noi_dung_html || ''}</textarea>
        </div>
        <div class="form-group">
          <label>Thứ tự hiển thị</label>
          <input type="number" name="thu_tu" value="${data.thu_tu || 0}">
        </div>
      `;
    } else if (entityKey === 'gallery') {
      html += `
        <div class="form-group">
          <label>Tiêu đề ảnh (*)</label>
          <input type="text" name="main_title" value="${data.tieu_de || ''}" required placeholder="VD: Hoạt động ngoại khóa học tập">
        </div>
        <div class="form-group">
          <label>Danh mục phân loại (*)</label>
          <select name="danh_muc" required>
            <option value="Sự kiện" ${data.danh_muc === 'Sự kiện' ? 'selected' : ''}>Sự kiện</option>
            <option value="Hoạt động" ${data.danh_muc === 'Hoạt động' ? 'selected' : ''}>Hoạt động</option>
          </select>
        </div>
        ${renderImageField('Hình ảnh Album (Tải lên từ máy) (*)', 'image_url', data.anh_url, 'upload_gallery_img_input', 'field_gallery_image_url')}
        <div class="form-group">
          <label>Mô tả chi tiết ảnh</label>
          <textarea name="description" rows="2" placeholder="Nhập mô tả...">${data.mo_ta || ''}</textarea>
        </div>
        <div class="form-group">
          <label>Thứ tự hiển thị</label>
          <input type="number" name="thu_tu" value="${data.thu_tu || 0}">
        </div>
      `;
    } else if (entityKey === 'adminAccounts') {
      html += `
        <div class="form-group">
          <label>Họ và tên Quản trị viên (*)</label>
          <input type="text" name="main_title" value="${data.ho_ten || ''}" required placeholder="VD: TS. Nguyễn Nhứt Lam">
        </div>
        <div class="form-group">
          <label>Email Google (*)</label>
          <input type="email" name="sub_title" value="${data.email || ''}" required placeholder="VD: lamnn@tvu.edu.vn">
        </div>
        <div class="form-group">
          <label>Google Subject ID (sub - từ Token OAuth) (*)</label>
          <input type="text" name="google_id" value="${data.google_id || ''}" required placeholder="Nhập ID Subject của tài khoản Google">
        </div>
        ${renderImageField('Ảnh đại diện Google (Avatar)', 'image_url', data.avatar_url, 'upload_admin_avatar_input', 'field_admin_avatar_url')}
        <div class="form-group">
          <label>Quyền hạn (*)</label>
          <select name="quyen_han" required>
            <option value="SUPER_ADMIN" ${data.quyen_han === 'SUPER_ADMIN' ? 'selected' : ''}>Quản trị viên cấp cao (SUPER_ADMIN)</option>
            <option value="STAFF_EDITOR" ${data.quyen_han === 'STAFF_EDITOR' ? 'selected' : ''}>Biên tập viên (STAFF_EDITOR)</option>
          </select>
        </div>
        <div class="form-group">
          <label>Trạng thái tài khoản (*)</label>
          <select name="trang_thai" required>
            <option value="1" ${data.trang_thai !== 0 ? 'selected' : ''}>Đang hoạt động</option>
            <option value="0" ${data.trang_thai === 0 ? 'selected' : ''}>Bị khóa</option>
          </select>
        </div>
      `;
    } else {
      const titleVal = data.ho_ten || data.ten_bai_bao || data.tieu_de || data.ten_de_tai || data.ten_nganh || data.ten_slide || data.ten || data.name || '';
      html += `
        <div class="form-group">
          <label>Tên / Tiêu đề chính (*)</label>
          <input type="text" name="main_title" value="${titleVal}" required placeholder="Nhập tiêu đề hoặc họ tên...">
        </div>
        <div class="form-group">
          <label>Thông tin phụ / Chức vụ / Ngày</label>
          <input type="text" name="sub_title" value="${data.chuc_vu || data.nam_hoan_thanh || data.ngay_dang || data.ma_tuyen_sinh || data.email || ''}" placeholder="Nhập thông tin phụ...">
        </div>
        ${renderImageField('Hình ảnh / Logo (Tải lên từ máy)', 'image_url', data.anh_ca_nhan_url || data.hinh_anh_url || data.file_anh_url || data.logo_url || data.src_chinh, 'upload_generic_image_input', 'field_image_url')}
        <div class="form-group">
          <label>Nội dung Chi tiết / Mô tả</label>
          <textarea name="description" rows="4" placeholder="Nhập chi tiết nội dung...">${data.mo_ta || data.noi_dung || data.linh_vuc_nghien_cuu || ''}</textarea>
        </div>
      `;
    }

    return html;
  }

  async handleFormSubmit() {
    // FIX: Chống double-submit — nếu đang gửi thì không cho gửi thêm
    if (this._isSubmitting) {
      console.warn('Form đang được xử lý, vui lòng chờ...');
      return;
    }
    this._isSubmitting = true;

    // Vô hiệu hóa nút Submit để tránh nhấn liên tiếp
    const submitBtn = document.getElementById('btnSubmitModal');
    const originalBtnText = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '⏳ Đang lưu...';
    }

    const formContainer = document.getElementById('adminDynamicForm');
    if (!formContainer) {
      this._isSubmitting = false;
      if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = originalBtnText; }
      return;
    }

    // Thu thập dữ liệu từ tất cả input/select/textarea bên trong modal
    const inputs = formContainer.querySelectorAll('input:not([type="file"]), select, textarea');
    const payload = {};
    inputs.forEach(el => {
      if (el.name) payload[el.name] = el.value;
    });

    // Map generic form fields to specific entity fields
    if (payload.main_title) {
      payload.tieu_de = payload.main_title;
      payload.ho_ten = payload.main_title;
      payload.ten_slide = payload.main_title;
      payload.ten_bai_bao = payload.main_title;
      payload.ten_de_tai = payload.main_title;
      payload.ten_nganh = payload.main_title;
      payload.ten = payload.main_title;
    }
    
    if (payload.sub_title) {
      payload.link_lien_ket = payload.sub_title;
      payload.nam_xuat_ban = payload.sub_title;
      payload.nam_hoan_thanh = payload.sub_title;
      payload.ngay_dang = payload.sub_title;
      payload.chuc_vu = payload.sub_title;
    }
    
    if (payload.image_url) {
      payload.hinh_anh_url = payload.image_url;
      payload.anh_ca_nhan_url = payload.image_url;
      payload.file_anh_url = payload.image_url;
      payload.logo_url = payload.image_url;
    }
    
    if (payload.description) {
      payload.mo_ta = payload.description;
      payload.noi_dung = payload.description;
      payload.danh_sach_tac_gia = payload.description;
    }

    try {
      if (this.editingId) {
        await AdminApiService.updateItem(this.currentNav, this.editingId, payload);
        this.showToast('Cập nhật dữ liệu thành công!', 'success');
      } else {
        await AdminApiService.createItem(this.currentNav, payload);
        this.showToast('Thêm mới dữ liệu thành công!', 'success');
      }
      // FIX: Xóa bản nháp TRƯỚC khi đóng modal để đảm bảo form mới tiếp theo luôn trống
      this.clearFormDraft(this.currentNav);
      // Reset initialFormState để closeModal() không hiện dialog cảnh báo
      this.initialFormState = null;
      this.closeModal();
      this.navigate(this.currentNav);
    } catch (err) {
      this.showToast(`Lỗi hệ thống: ${err.message}`, 'error');
    } finally {
      // FIX: Khôi phục trạng thái nút và cờ submit dù lỗi hay thành công
      this._isSubmitting = false;
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      }
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

document.addEventListener('DOMContentLoaded', () => {
  const app = new AdminApp();
  app.init();
});
