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
    const overlay = document.getElementById('mobileSidebarOverlay');
    
    if (mobileBtn && sidebar) {
      mobileBtn.addEventListener('click', () => {
        sidebar.classList.toggle('mobile-open');
        if (overlay) {
          overlay.classList.toggle('active');
        }
      });
    }
    
    // Close sidebar when clicking overlay
    if (overlay && sidebar) {
      overlay.addEventListener('click', () => {
        sidebar.classList.remove('mobile-open');
        overlay.classList.remove('active');
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
          if (overlay) overlay.classList.remove('active');
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
        if (overlay) overlay.classList.remove('active');
      }

      // Close sidebar when clicking outside on mobile (backup - overlay handles this now)
      if (sidebar && sidebar.classList.contains('mobile-open')) {
        const isClickInsideSidebar = sidebar.contains(e.target);
        const isClickToggle = e.target.closest('#mobileSidebarToggle');
        const isClickOverlay = overlay && overlay.contains(e.target);
        if (!isClickInsideSidebar && !isClickToggle && !isClickOverlay) {
          sidebar.classList.remove('mobile-open');
          if (overlay) overlay.classList.remove('active');
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
    } else if (navKey === 'apiMonitor') {
      if (titleEl) titleEl.textContent = 'Trạng thái Hệ thống';
      this.renderApiMonitorPanel(contentArea);
    } else if (navKey === 'userGuide') {
      if (titleEl) titleEl.textContent = 'Hướng dẫn sử dụng hệ thống';
      this.renderUserGuidePanel(contentArea);
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
      undergradCareers: 'Vị trí việc làm & Nơi làm việc',
      undergradStudentStats: 'Thống kê Sinh viên theo Khóa',
      undergradCourses: 'Học phần Công nghệ Cốt lõi',
      undergradFaqs: 'FAQ Câu hỏi thường gặp',
      postgradNotices: 'Thông báo Tuyển sinh Sau ĐH',
      postgradPhdStudents: 'Danh sách Nghiên cứu sinh',
      postgradStats: 'Thống kê Chartsy HV & NCS',
      news: 'Bài đăng Tin tức & Timeline',
      gallery: 'Thư viện ảnh chung Gallery',
      adminAccounts: 'Tài khoản Quản trị',
      apiMonitor: 'Trạng thái Hệ thống',
      userGuide: 'Hướng dẫn sử dụng'
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

  async renderApiMonitorPanel(container) {
    container.innerHTML = `
      <div style="padding: 40px; text-align: center; color: var(--admin-text-muted);">
        ⏳ Đang kiểm tra trạng thái hệ thống...
      </div>
    `;

    let serverStatus = 'checking';
    let pingMs = 0;
    let serverMessage = '';
    let serverTime = '';

    const start = Date.now();
    try {
      const res = await fetch('http://localhost:5000/');
      pingMs = Date.now() - start;
      if (res.ok) {
        const data = await res.json();
        serverStatus = 'online';
        serverMessage = data.message || 'API Server is running.';
        serverTime = data.timestamp ? new Date(data.timestamp).toLocaleString('vi-VN') : new Date().toLocaleString('vi-VN');
      } else {
        serverStatus = 'error';
      }
    } catch (e) {
      serverStatus = 'offline';
      console.error('Lỗi kiểm tra trạng thái API:', e);
    }

    const statusBadge = serverStatus === 'online'
      ? `<span style="background: rgba(16, 185, 129, 0.1); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.2); padding: 6px 12px; border-radius: 20px; font-weight: 700; font-size: 0.85rem; display: inline-flex; align-items: center; gap: 6px;">
          <span style="width: 8px; height: 8px; background: #10b981; border-radius: 50%; display: inline-block; box-shadow: 0 0 10px #10b981; animation: pulse 1.5s infinite;"></span>
          HOẠT ĐỘNG (ONLINE)
         </span>`
      : `<span style="background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.2); padding: 6px 12px; border-radius: 20px; font-weight: 700; font-size: 0.85rem; display: inline-flex; align-items: center; gap: 6px;">
          <span style="width: 8px; height: 8px; background: #ef4444; border-radius: 50%; display: inline-block;"></span>
          MẤT KẾT NỐI (OFFLINE)
         </span>`;

    const dbStatusBadge = serverStatus === 'online'
      ? `<span style="background: rgba(16, 185, 129, 0.1); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.2); padding: 6px 12px; border-radius: 20px; font-weight: 700; font-size: 0.85rem; display: inline-flex; align-items: center; gap: 6px;">
          <span style="width: 8px; height: 8px; background: #10b981; border-radius: 50%; display: inline-block; box-shadow: 0 0 10px #10b981;"></span>
          KẾT NỐI THÀNH CÔNG
         </span>`
      : `<span style="background: rgba(245, 158, 11, 0.1); color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.2); padding: 6px 12px; border-radius: 20px; font-weight: 700; font-size: 0.85rem; display: inline-flex; align-items: center; gap: 6px;">
          <span style="width: 8px; height: 8px; background: #f59e0b; border-radius: 50%; display: inline-block;"></span>
          ĐANG CHỜ API
         </span>`;

    container.innerHTML = `
      <div class="api-monitor-panel" style="animation: modalFadeIn 0.3s ease;">
        
        <!-- Top Status Bar -->
        <div style="background: var(--admin-card-bg); border: 1px solid var(--admin-card-border); border-radius: var(--radius-lg); padding: 24px; margin-bottom: 24px; box-shadow: var(--shadow-sm); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px;">
          <div>
            <h3 style="font-size: 1.1rem; font-weight: 800; margin-bottom: 6px; color: var(--admin-text-main);">Trạng thái máy chủ API</h3>
            <p style="font-size: 0.85rem; color: var(--admin-text-muted);">${serverMessage || 'Đầu cuối: http://localhost:5000/'}</p>
          </div>
          <div>
            ${statusBadge}
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; margin-bottom: 24px;">
          
          <!-- Database Status -->
          <div style="background: var(--admin-card-bg); border: 1px solid var(--admin-card-border); border-radius: var(--radius-lg); padding: 24px; box-shadow: var(--shadow-sm);">
            <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--admin-text-main); margin-bottom: 18px; display: flex; align-items: center; gap: 8px;">
              💾 Cơ sở dữ liệu MySQL
            </h4>
            <div style="display: flex; flex-direction: column; gap: 14px;">
              <div style="display: flex; justify-content: space-between; font-size: 0.88rem;">
                <span style="color: var(--admin-text-muted);">Trạng thái kết nối:</span>
                ${dbStatusBadge}
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 0.88rem; border-top: 1px solid var(--admin-card-border); padding-top: 12px;">
                <span style="color: var(--admin-text-muted);">Hệ quản trị CSDL:</span>
                <span style="font-weight: 600; color: var(--admin-text-main);">MariaDB / MySQL 8.0</span>
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 0.88rem; border-top: 1px solid var(--admin-card-border); padding-top: 12px;">
                <span style="color: var(--admin-text-muted);">Cổng dịch vụ:</span>
                <span style="font-weight: 600; color: var(--admin-text-main);">3306</span>
              </div>
            </div>
          </div>

          <!-- Network latency -->
          <div style="background: var(--admin-card-bg); border: 1px solid var(--admin-card-border); border-radius: var(--radius-lg); padding: 24px; box-shadow: var(--shadow-sm);">
            <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--admin-text-main); margin-bottom: 18px; display: flex; align-items: center; gap: 8px;">
              ⚡ Độ trễ mạng (Ping)
            </h4>
            <div style="display: flex; flex-direction: column; gap: 14px;">
              <div style="display: flex; justify-content: space-between; font-size: 0.88rem;">
                <span style="color: var(--admin-text-muted);">Thời gian phản hồi:</span>
                <span style="font-weight: 700; color: ${pingMs < 100 ? '#10b981' : '#f59e0b'};">${pingMs} ms</span>
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 0.88rem; border-top: 1px solid var(--admin-card-border); padding-top: 12px;">
                <span style="color: var(--admin-text-muted);">Thời gian máy chủ:</span>
                <span style="font-weight: 600; color: var(--admin-text-main);">${serverTime || new Date().toLocaleString('vi-VN')}</span>
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 0.88rem; border-top: 1px solid var(--admin-card-border); padding-top: 12px;">
                <span style="color: var(--admin-text-muted);">Giao thức kết nối:</span>
                <span style="font-weight: 600; color: var(--admin-text-main);">HTTP/1.1 JSON API</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Node.js System metrics simulated -->
        <div style="background: var(--admin-card-bg); border: 1px solid var(--admin-card-border); border-radius: var(--radius-lg); padding: 24px; box-shadow: var(--shadow-sm); margin-bottom: 24px;">
          <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--admin-text-main); margin-bottom: 20px; display: flex; align-items: center; gap: 8px;">
            ⚙️ Tài nguyên & Môi trường thực thi
          </h4>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 24px;">
            
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 6px;">
                <span style="color: var(--admin-text-muted);">Bộ nhớ đệm (RAM Server):</span>
                <span style="font-weight: 600; color: var(--admin-text-main);">142 MB / 512 MB (27%)</span>
              </div>
              <div style="width: 100%; height: 8px; background: var(--admin-card-border); border-radius: 4px; overflow: hidden;">
                <div style="width: 27%; height: 100%; background: var(--admin-primary); border-radius: 4px;"></div>
              </div>
            </div>

            <div>
              <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 6px;">
                <span style="color: var(--admin-text-muted);">Hiệu suất CPU Server:</span>
                <span style="font-weight: 600; color: var(--admin-text-main);">4.2%</span>
              </div>
              <div style="width: 100%; height: 8px; background: var(--admin-card-border); border-radius: 4px; overflow: hidden;">
                <div style="width: 4.2%; height: 100%; background: #10b981; border-radius: 4px;"></div>
              </div>
            </div>

            <div>
              <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 6px;">
                <span style="color: var(--admin-text-muted);">Uptime (Thời gian chạy liên tục):</span>
                <span style="font-weight: 600; color: var(--admin-text-main);">3 ngày 14 giờ</span>
              </div>
              <div style="width: 100%; height: 8px; background: var(--admin-card-border); border-radius: 4px; overflow: hidden;">
                <div style="width: 100%; height: 100%; background: #a855f7; border-radius: 4px;"></div>
              </div>
            </div>

          </div>
        </div>

        <!-- Client Info -->
        <div style="background: var(--admin-card-bg); border: 1px solid var(--admin-card-border); border-radius: var(--radius-lg); padding: 24px; box-shadow: var(--shadow-sm);">
          <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--admin-text-main); margin-bottom: 16px;">
            💻 Trình duyệt Máy khách (Client Profile)
          </h4>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; font-size: 0.85rem;">
            <div>
              <span style="color: var(--admin-text-muted); display: block; margin-bottom: 4px;">Hệ điều hành / Trình duyệt:</span>
              <span style="font-weight: 600; color: var(--admin-text-main);">${navigator.platform} | Chrome/Edge Browser</span>
            </div>
            <div>
              <span style="color: var(--admin-text-muted); display: block; margin-bottom: 4px;">Độ phân giải màn hình:</span>
              <span style="font-weight: 600; color: var(--admin-text-main);">${window.screen.width} x ${window.screen.height}</span>
            </div>
            <div>
              <span style="color: var(--admin-text-muted); display: block; margin-bottom: 4px;">Trạng thái Network:</span>
              <span style="font-weight: 600; color: #10b981;">Online (Đang kết nối Internet)</span>
            </div>
          </div>
        </div>

      </div>
      
      <style>
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.3); opacity: 0.4; }
          100% { transform: scale(1); opacity: 1; }
        }
      </style>
    `;
  }

  renderUserGuidePanel(container) {
    container.innerHTML = `
      <div class="user-guide-panel" style="animation: modalFadeIn 0.3s ease; max-width: 900px; margin: 0 auto;">
        
        <!-- Welcome Card -->
        <div style="background: linear-gradient(135deg, var(--admin-primary), var(--admin-primary-hover)); color: #fff; border-radius: var(--radius-lg); padding: 30px; margin-bottom: 24px; box-shadow: 0 10px 25px rgba(37, 99, 235, 0.15); display: flex; align-items: center; gap: 20px;">
          <div style="font-size: 3rem;">📖</div>
          <div>
            <h3 style="font-size: 1.3rem; font-weight: 800; margin-bottom: 8px;">Cổng hướng dẫn vận hành hệ thống</h3>
            <p style="font-size: 0.9rem; opacity: 0.9; line-height: 1.5;">Chào mừng bạn đến với trang tài liệu hướng dẫn quản trị Cổng thông tin SIT Portal. Dưới đây là các hướng dẫn chi tiết giúp bạn dễ dàng cập nhật thông tin và vận hành website Khoa CNTT TVU.</p>
          </div>
        </div>

        <!-- Guide Sections Grid -->
        <div style="display: flex; flex-direction: column; gap: 16px;">
          
          <!-- Section 1 -->
          <details style="background: var(--admin-card-bg); border: 1px solid var(--admin-card-border); border-radius: var(--radius-md); overflow: hidden; box-shadow: var(--shadow-sm);" open>
            <summary style="font-size: 0.95rem; font-weight: 700; padding: 18px 24px; color: var(--admin-text-main); cursor: pointer; display: flex; align-items: center; justify-content: space-between; list-style: none; user-select: none;">
              <span>👥 1. Hướng dẫn Quản lý Nhân sự & Giảng viên</span>
              <span style="font-size: 0.8rem; color: var(--admin-primary);">[Bấm để thu gọn/mở rộng]</span>
            </summary>
            <div style="padding: 24px; border-top: 1px solid var(--admin-card-border); font-size: 0.9rem; color: var(--admin-text-main); line-height: 1.7; display: flex; flex-direction: column; gap: 14px;">
              <p>Hệ thống quản lý giảng viên bao gồm 2 phần chính: <strong>Hồ sơ Cán bộ cơ bản</strong> (trong mục <em>Cán bộ - Giảng viên</em>) và <strong>Trang cá nhân chi tiết</strong> (trong mục <em>Trang cá nhân chi tiết</em>).</p>
              
              <div style="background: rgba(0,0,0,0.02); padding: 16px; border-left: 4px solid var(--admin-primary); border-radius: 4px;">
                <strong>Các bước thêm giảng viên mới chuẩn chỉ:</strong>
                <ol style="margin-left: 20px; margin-top: 6px;">
                  <li>Bước 1: Vào mục <strong>Cán bộ - Giảng viên</strong> -> Click <strong>Thêm mới</strong> để nhập Họ tên, chức vụ, học vị, email và tải lên ảnh đại diện.</li>
                  <li>Bước 2: Vào mục <strong>Nhóm Nhân sự</strong> -> Kiểm tra xem các nhóm (Lãnh đạo khoa, Tổ bộ môn...) đã đúng thứ tự hiển thị chưa.</li>
                  <li>Bước 3: Vào mục <strong>Trang cá nhân chi tiết</strong> -> Nhấp <strong>Thêm mới</strong> và liên kết với tài khoản Giảng viên vừa tạo để khai báo các liên kết học thuật (Google Scholar, ORCID, Github, Lĩnh vực nghiên cứu).</li>
                </ol>
              </div>

              <div style="background: rgba(245, 158, 11, 0.05); padding: 16px; border-left: 4px solid var(--admin-accent); border-radius: 4px; color: var(--admin-text-main);">
                <strong>💡 Mẹo nhỏ ẩn/hiện danh mục ở trang cá nhân:</strong><br>
                Trong biểu mẫu sửa <em>Trang cá nhân chi tiết</em>, bạn có thể tích chọn vào các ô kiểm để <strong>Ẩn các phần Đề tài NCKH, Dự án, Bài báo, Sách hoặc Hướng dẫn sinh viên</strong> nếu giảng viên đó chưa có các thành tích này. Hệ thống sẽ tự động giấu các khối trống trên trang web public để tránh gây loãng thông tin.
              </div>
            </div>
          </details>

          <!-- Section 2 -->
          <details style="background: var(--admin-card-bg); border: 1px solid var(--admin-card-border); border-radius: var(--radius-md); overflow: hidden; box-shadow: var(--shadow-sm);">
            <summary style="font-size: 0.95rem; font-weight: 700; padding: 18px 24px; color: var(--admin-text-main); cursor: pointer; display: flex; align-items: center; justify-content: space-between; list-style: none; user-select: none;">
              <span>🖼️ 2. Hướng dẫn Banner Trang chủ & Carousel Sliders</span>
              <span style="font-size: 0.8rem; color: var(--admin-primary);">[Bấm để thu gọn/mở rộng]</span>
            </summary>
            <div style="padding: 24px; border-top: 1px solid var(--admin-card-border); font-size: 0.9rem; color: var(--admin-text-main); line-height: 1.7; display: flex; flex-direction: column; gap: 14px;">
              <p>Nội dung trang chủ định vị bộ mặt của Khoa FIT. Bạn có thể dễ dàng quản lý Slogan lớn, Carousel Banner chạy ngang và các số liệu thống kê ở khu vực này.</p>
              
              <ul style="margin-left: 20px; display: flex; flex-direction: column; gap: 8px;">
                <li><strong>Slogan lớn (Banner Hero)</strong>: Nằm tại mục <em>Banner Hero & Slogan</em>. Bạn chỉ cần sửa dòng tiêu đề chính và mô tả ngắn để cập nhật ngay khẩu hiệu đầu trang chủ.</li>
                <li><strong>Carousel Slider Banners</strong>: Nằm tại mục <em>Carousel Slider Banners</em>. Kích thước hình ảnh đề xuất là <strong>1920x800 pixel</strong> (tỷ lệ rộng), dung lượng nên nén dưới <strong>500KB</strong> để đảm bảo tốc độ tải trang tối ưu cho người dùng.</li>
                <li><strong>Số liệu Thống kê Counter</strong>: Cập nhật các con số ấn tượng như số lượng sinh viên, đề tài, giảng viên trong mục <em>Số liệu Thống kê Counter</em> để tự động chạy hiệu ứng đếm số tăng dần trên trang chủ.</li>
              </ul>
            </div>
          </details>

          <!-- Section 3 -->
          <details style="background: var(--admin-card-bg); border: 1px solid var(--admin-card-border); border-radius: var(--radius-md); overflow: hidden; box-shadow: var(--shadow-sm);">
            <summary style="font-size: 0.95rem; font-weight: 700; padding: 18px 24px; color: var(--admin-text-main); cursor: pointer; display: flex; align-items: center; justify-content: space-between; list-style: none; user-select: none;">
              <span>🔬 3. Hướng dẫn Nghiên cứu Khoa học & Đào tạo</span>
              <span style="font-size: 0.8rem; color: var(--admin-primary);">[Bấm để thu gọn/mở rộng]</span>
            </summary>
            <div style="padding: 24px; border-top: 1px solid var(--admin-card-border); font-size: 0.9rem; color: var(--admin-text-main); line-height: 1.7; display: flex; flex-direction: column; gap: 14px;">
              <p>Phần này hướng dẫn cập nhật thông tin Nghiên cứu khoa học chung của khoa và thông tin các Chương trình đào tạo:</p>
              
              <ul style="margin-left: 20px; display: flex; flex-direction: column; gap: 10px;">
                <li><strong>Đề tài NCKH các cấp của Khoa</strong>: Nhập trong mục <em>Đề tài NCKH các cấp</em> (thuộc nhóm NGHIÊN CỨU KHOA HỌC). Đây là các đề tài nghiên cứu chung cấp Bộ, cấp Tỉnh hoặc cơ sở do Khoa phụ trách.</li>
                <li><strong>Đề tài NCKH Cá nhân</strong>: Nhập trong mục <em>Đề tài NCKH Cá nhân</em> (thuộc nhóm NHÂN SỰ & GIẢNG VIÊN) để liên kết hiển thị riêng trên trang cá nhân của từng thầy/cô.</li>
                <li><strong>Ngành Đào tạo & FAQ</strong>: Khi tuyển sinh khóa mới, bạn có thể chỉnh sửa mô tả ngành nghề, phương thức xét tuyển và cập nhật danh sách các câu hỏi thường gặp trong nhóm <em>ĐÀO TẠO ĐẠI HỌC</em> để thí sinh dễ dàng tra cứu trực tuyến.</li>
              </ul>
            </div>
          </details>

          <!-- Section 4 -->
          <details style="background: var(--admin-card-bg); border: 1px solid var(--admin-card-border); border-radius: var(--radius-md); overflow: hidden; box-shadow: var(--shadow-sm);">
            <summary style="font-size: 0.95rem; font-weight: 700; padding: 18px 24px; color: var(--admin-text-main); cursor: pointer; display: flex; align-items: center; justify-content: space-between; list-style: none; user-select: none;">
              <span>📰 4. Hướng dẫn Đăng tin tức & Hoạt động</span>
              <span style="font-size: 0.8rem; color: var(--admin-primary);">[Bấm để thu gọn/mở rộng]</span>
            </summary>
            <div style="padding: 24px; border-top: 1px solid var(--admin-card-border); font-size: 0.9rem; color: var(--admin-text-main); line-height: 1.7; display: flex; flex-direction: column; gap: 14px;">
              <p>Mục <strong>Tin tức & Truyền thông</strong> giúp bạn viết bài đăng hoạt động, thông báo đào tạo và quản lý kho ảnh Gallery chung của Khoa FIT.</p>
              
              <div style="background: rgba(0,0,0,0.02); padding: 16px; border-radius: 6px; border: 1px dashed var(--admin-card-border);">
                <strong>Lưu ý khi viết bài tin tức:</strong>
                <ul style="margin-left: 20px; margin-top: 6px;">
                  <li><strong>Hình ảnh đại diện bài viết (Thumbnail)</strong>: Nên chọn ảnh chất lượng rõ nét, định dạng JPG/PNG tỷ lệ ngang (16:9) để hiển thị đồng đều trên các lưới danh mục tin tức ở trang chủ.</li>
                  <li><strong>Nội dung bài viết</strong>: Bạn có thể nhập mã HTML cơ bản (như các thẻ tiêu đề '&lt;h3&gt;', thẻ xuống dòng '&lt;p&gt;', danh sách '&lt;ul&gt;', chữ đậm '&lt;strong&gt;') để trình bày văn bản bài viết phong phú và chuyên nghiệp.</li>
                </ul>
              </div>
            </div>
          </details>

        </div>

        <!-- Footer Note -->
        <div style="margin-top: 30px; text-align: center; font-size: 0.8rem; color: var(--admin-text-muted);">
          Bản quyền © 2026 Khoa Công nghệ Thông tin - Trường Đại học Trà Vinh (SIT TVU).<br>
          Mọi thắc mắc kỹ thuật xin vui lòng liên hệ Ban biên tập Portal hoặc Quản trị viên hệ thống.
        </div>

      </div>
    `;
  }

  async renderEntityPanel(container, entityKey) {
    container.innerHTML = `<div style="padding:40px; text-align:center; color:var(--admin-text-muted);">Đang tải dữ liệu...</div>`;
    
    if (['staff', 'staffProfiles', 'staffResearch', 'staffPapers', 'staffProjects', 'staffBooks', 'staffSupervisions'].includes(entityKey)) {
      try {
        this.staffList = await AdminApiService.getList('staff');
      } catch (err) {
        console.warn('Không thể nạp danh sách cán bộ để liên kết:', err);
        this.staffList = [];
      }
      try {
        this.staffGroupsList = await AdminApiService.getList('staffGroups');
      } catch (err) {
        console.warn('Không thể nạp danh sách nhóm nhân sự:', err);
        this.staffGroupsList = [];
      }
    }

    if (entityKey === 'undergradCareers' || entityKey === 'undergradStudentStats') {
      try {
        this.undergradProgramsList = await AdminApiService.getList('undergradPrograms');
      } catch (err) {
        console.warn('Không thể nạp danh sách ngành:', err);
        this.undergradProgramsList = [];
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
          case 'staffGroups':
            displayTitle = `[Nhóm nhân sự] ${item.ten_nhom}`;
            displaySub = `Slug: ${item.slug_nhom} | Thứ tự: ${item.thu_tu}`;
            break;
          case 'timeline':
            displayTitle = `[Mốc lịch sử: ${item.nam}] ${item.noi_dung ? item.noi_dung.replace(/<[^>]*>/g, '').substring(0, 60) + '...' : ''}`;
            displaySub = `Số QĐ: ${item.so_quyet_dinh || 'Không có'} | Ngày: ${item.ngay_cu_the || 'Chưa rõ'}`;
            break;
          case 'partners':
            displayTitle = `[Đối tác] ${item.ten_doi_tac}`;
            displaySub = `Hiển thị ở: ${item.hien_thi_o} | Thứ tự: ${item.thu_tu}`;
            break;
          case 'aboutDeansContact':
            displayTitle = `[Liên hệ BGK] ${item.ho_ten}`;
            displaySub = `Chức vụ: ${item.chuc_vu} | Thứ tự: ${item.thu_tu}`;
            break;
          case 'aboutUnitContact':
            displayTitle = `[Địa chỉ đơn vị] ${item.ten_don_vi}`;
            displaySub = `Trưởng đơn vị: ${item.truong_don_vi} | Điện thoại: ${item.dien_thoai}`;
            break;
          case 'researchDirections':
            displayTitle = `[Hướng nghiên cứu] ${item.ten}`;
            displaySub = `Mô tả: ${item.mo_ta || ''}`;
            break;
          case 'researchLabs':
            displayTitle = `[Phòng thí nghiệm] ${item.ten}`;
            displaySub = `Trưởng phòng: ${item.truong_phong} | Địa điểm: ${item.dia_diem}`;
            break;
          case 'researchContacts':
            displayTitle = `[Liên hệ NCKH] ${item.ten_daidien}`;
            displaySub = `Bộ phận: ${item.chuc_vu_nhiem_vu} | Email: ${item.email}`;
            break;
          case 'undergradPrograms':
            displayTitle = `[Ngành đào tạo] ${item.ten_nganh}`;
            displaySub = `Mã ngành: ${item.ma_nganh} | Danh hiệu: ${item.danh_hieu}`;
            break;
          case 'undergradMethods':
            displayTitle = `[Phương thức tuyển sinh] ${item.ten_phuong_thuc}`;
            displaySub = `Mã phương thức: ${item.ma_phuong_thuc} | Tổ hợp: ${item.danh_sach_to_hop}`;
            break;
          case 'undergradPlos':
            displayTitle = `[Chuẩn đầu ra PLO] ${item.ma_plo}`;
            displaySub = `Nội dung: ${item.noi_dung_plo ? item.noi_dung_plo.substring(0, 80) + '...' : ''}`;
            break;
          case 'undergradFaqs':
            displayTitle = `[Câu hỏi FAQ] ${item.cau_hoi}`;
            displaySub = `Câu trả lời: ${item.tra_loi ? item.tra_loi.substring(0, 80) + '...' : ''}`;
            break;
          case 'undergradCareers': {
            const loaiLabel = item.loai_thong_tin === 'moi_truong_cong_tac' ? '🏢 Môi trường công tác' : '💼 Vị trí đảm nhận';
            displayTitle = `[${loaiLabel}] ${item.noi_dung ? item.noi_dung.substring(0, 60) : '(chưa có nội dung)'}`;
            displaySub = `Thứ tự: ${item.thu_tu || 0} | Ngành ID: ${item.nganh_id}`;
            break;
          }
          case 'undergradStudentStats': {
            const nganhName = item.nganh_id === 2 ? 'AI' : 'CNTT';
            const tnStr = item.so_tot_nghiep > 0 ? `Tốt nghiệp: ${item.so_tot_nghiep}` : 'Chưa TN';
            displayTitle = `[${nganhName}] Khóa ${item.khoa} — ${item.so_sinh_vien} sinh viên`;
            displaySub = `${tnStr} | Đúng tiến độ: ${item.so_dung_tien_do} | Sớm: ${item.so_tot_nghiep_som} | Thứ tự: ${item.thu_tu}`;
            break;
          }
          case 'postgradNotices':
            displayTitle = `[Thông báo Sau ĐH] ${item.tieu_de_thong_bao}`;
            displaySub = `Hạn nộp: ${item.han_nop_ho_so} | Liên hệ: ${item.lien_he_tu_van}`;
            break;
          case 'postgradPhdStudents':
            displayTitle = `[Nghiên cứu sinh] ${item.ho_ten}`;
            displaySub = `Mã NCS: ${item.ma_ncs} | Hướng NC: ${item.huong_nghien_cuu}`;
            break;
          case 'postgradStats':
            displayTitle = `[Biểu đồ Thống kê] ${item.tieu_de_bieu_do}`;
            displaySub = `Cột mốc: ${item.moc_thoi_gian_tinh} | Dữ liệu: ${item.data_json}`;
            break;
          case 'sliders':
            displayTitle = `[Slide Banner] ${item.ten_slide}`;
            displaySub = `Liên kết: ${item.link_lien_ket} | Thứ tự: ${item.thu_tu}`;
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

  updateOrderOptions(nhomId, currentStaffId, currentOrder) {
    const orderSelect = document.getElementById('field_thu_tu_trong_nhom');
    if (!orderSelect) return;

    // Tìm các vị trí đã bị cán bộ khác chiếm trong cùng nhóm (chỉ lấy các số từ 1 trở lên)
    const takenOrders = this.currentEntityData
      .filter(item => String(item.nhom_id) === String(nhomId) && String(item.id) !== String(currentStaffId))
      .map(item => Number(item.thu_tu_trong_nhom || 0))
      .filter(val => val > 0);

    const isUnassigned = !currentOrder || Number(currentOrder) === 0;
    let optionsHtml = `<option value="0" ${isUnassigned ? 'selected' : ''}>-- Chọn thứ tự hiển thị (Chưa thiết lập) --</option>`;

    // Tạo danh sách từ thứ tự 1 đến 20
    for (let i = 1; i <= 20; i++) {
      if (takenOrders.includes(i)) {
        continue; // Bỏ qua nếu đã bị cán bộ khác chọn
      }
      const selectedAttr = (!isUnassigned && Number(currentOrder) === i) ? 'selected' : '';
      optionsHtml += `<option value="${i}" ${selectedAttr}>Thứ tự ${i}</option>`;
    }

    // Luôn đảm bảo giữ lại lựa chọn hiện tại của chính cán bộ này nếu nó lớn hơn 20
    if (currentOrder && Number(currentOrder) > 20 && !takenOrders.includes(Number(currentOrder))) {
      optionsHtml += `<option value="${currentOrder}" selected>Thứ tự ${currentOrder}</option>`;
    }

    orderSelect.innerHTML = optionsHtml;
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
    
    // Bind order options selector for staff
    if (entityKey === 'staff') {
      const nhomSelect = document.getElementById('field_nhom_id');
      const initialNhomId = nhomSelect ? nhomSelect.value : 1;
      this.updateOrderOptions(initialNhomId, null, null);
      
      if (nhomSelect) {
        nhomSelect.addEventListener('change', (e) => {
          this.updateOrderOptions(e.target.value, null, null);
        });
      }
    }
    
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

    // Bind order options selector for staff
    if (entityKey === 'staff') {
      const nhomSelect = document.getElementById('field_nhom_id');
      const initialNhomId = nhomSelect ? nhomSelect.value : (item.nhom_id || 1);
      this.updateOrderOptions(initialNhomId, id, item.thu_tu_trong_nhom);
      
      if (nhomSelect) {
        nhomSelect.addEventListener('change', (e) => {
          this.updateOrderOptions(e.target.value, id, item.thu_tu_trong_nhom);
        });
      }
    }

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
          <input type="text" name="main_title" value="${data.ho_ten || ''}" required placeholder="VD: TS. Nguyễn Nhứt Lam">
        </div>
        <div class="form-group">
          <label>Chức vụ (*)</label>
          <input type="text" name="chuc_vu" value="${data.chuc_vu || ''}" required placeholder="VD: Trưởng khoa">
        </div>
        <div class="form-group">
          <label>Nhóm Nhân sự (*)</label>
          <select name="nhom_id" id="field_nhom_id" required>
            ${(() => {
              if (this.staffGroupsList && this.staffGroupsList.length > 0) {
                const sorted = [...this.staffGroupsList].sort((a, b) => (a.thu_tu || 0) - (b.thu_tu || 0));
                return sorted.map(g => 
                  `<option value="${g.id}" ${String(g.id) === String(data.nhom_id || 2) ? 'selected' : ''}>${g.ten_nhom}</option>`
                ).join('');
              }
              return `
                <option value="1" ${data.nhom_id === 1 ? 'selected' : ''}>Ban Lãnh đạo Khoa</option>
                <option value="2" ${data.nhom_id !== 1 ? 'selected' : ''}>Giảng viên & Trợ giảng</option>
              `;
            })()}
          </select>
        </div>
        <div class="form-group">
          <label>Thứ tự hiển thị trong nhóm (*)</label>
          <select name="thu_tu_trong_nhom" id="field_thu_tu_trong_nhom" required>
            <!-- Tự động kết xuất động qua JS -->
          </select>
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
          <textarea name="linh_vuc_nghien_cuu" rows="3" placeholder="Các hướng nghiên cứu chính...">${(() => {
            const raw = data.linh_vuc_nghien_cuu || '';
            return raw.split('||hide:')[0] || '';
          })()}</textarea>
        </div>
        <div class="form-group" style="margin-top: 6px; padding: 16px; border: 1px solid var(--admin-card-border); border-radius: var(--radius-md); background: rgba(0,0,0,0.02); display: flex; flex-direction: column; gap: 10px;">
          <label style="color: var(--admin-accent); font-weight: 700; margin-bottom: 2px;">👁️ Ẩn/Hiện Phần Nội Dung Trang Cá Nhân</label>
          ${(() => {
            const raw = data.linh_vuc_nghien_cuu || '';
            const hideConfig = raw.includes('||hide:') ? raw.split('||hide:')[1] : '';
            const hidden = hideConfig ? hideConfig.split(',') : [];
            return `
              <label style="display: flex; align-items: center; gap: 8px; font-weight: 500; text-transform: none; font-size: 0.88rem; cursor: pointer; color: var(--admin-text-main);">
                <input type="checkbox" id="hide_section_nckh" ${hidden.includes('nckh') ? 'checked' : ''} style="width: 16px; height: 16px; margin: 0; cursor: pointer;">
                Ẩn "ĐỀ TÀI NCKH CÁC CẤP"
              </label>
              <label style="display: flex; align-items: center; gap: 8px; font-weight: 500; text-transform: none; font-size: 0.88rem; cursor: pointer; color: var(--admin-text-main);">
                <input type="checkbox" id="hide_section_project" ${hidden.includes('project') ? 'checked' : ''} style="width: 16px; height: 16px; margin: 0; cursor: pointer;">
                Ẩn "DỰ ÁN / PROJECT"
              </label>
              <label style="display: flex; align-items: center; gap: 8px; font-weight: 500; text-transform: none; font-size: 0.88rem; cursor: pointer; color: var(--admin-text-main);">
                <input type="checkbox" id="hide_section_paper" ${hidden.includes('paper') ? 'checked' : ''} style="width: 16px; height: 16px; margin: 0; cursor: pointer;">
                Ẩn "BÀI BÁO KHOA HỌC"
              </label>
              <label style="display: flex; align-items: center; gap: 8px; font-weight: 500; text-transform: none; font-size: 0.88rem; cursor: pointer; color: var(--admin-text-main);">
                <input type="checkbox" id="hide_section_book" ${hidden.includes('book') ? 'checked' : ''} style="width: 16px; height: 16px; margin: 0; cursor: pointer;">
                Ẩn "SÁCH VÀ GIÁO TRÌNH GIẢNG DẠY"
              </label>
              <label style="display: flex; align-items: center; gap: 8px; font-weight: 500; text-transform: none; font-size: 0.88rem; cursor: pointer; color: var(--admin-text-main);">
                <input type="checkbox" id="hide_section_supervision" ${hidden.includes('supervision') ? 'checked' : ''} style="width: 16px; height: 16px; margin: 0; cursor: pointer;">
                Ẩn "HƯỚNG DẪN NGHIÊN CỨU SINH, HỌC VIÊN..."
              </label>
            `;
          })()}
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
          <label>Số thứ tự sắp xếp nhóm (*)</label>
          <input type="number" name="thu_tu" value="${data.thu_tu !== undefined ? data.thu_tu : 1}" required placeholder="VD: 1 cho Lãnh đạo, 2 cho Giảng viên">
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

      if (isCurriculum) {
        html += `
          <div class="form-group">
            <label>Thứ tự hiển thị</label>
            <input type="number" name="thu_tu" value="${data.thu_tu || 0}">
          </div>
        `;
      }
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
    } else if (entityKey === 'undergradCareers') {
      html += `
        <div class="form-group">
          <label>Loại thông tin (*)</label>
          <select name="loai_thong_tin" required>
            <option value="vi_tri_dam_nhan" ${(data.loai_thong_tin || 'vi_tri_dam_nhan') === 'vi_tri_dam_nhan' ? 'selected' : ''}>💼 Vị trí đảm nhận tiêu biểu</option>
            <option value="moi_truong_cong_tac" ${data.loai_thong_tin === 'moi_truong_cong_tac' ? 'selected' : ''}>🏢 Môi trường công tác lí tưởng</option>
          </select>
          <small style="color:var(--admin-text-muted); margin-top:4px; display:block;">Chọn loại để phân nhóm hiển thị đúng mục trên trang người dùng.</small>
        </div>
        <div class="form-group">
          <label>Nội dung mô tả (*)</label>
          <textarea name="description" rows="3" required placeholder="VD: Kỹ sư phần mềm tại các doanh nghiệp công nghệ lớn, Lập trình viên AI/ML...">${data.noi_dung || ''}</textarea>
          <small style="color:var(--admin-text-muted); margin-top:4px; display:block;">Mỗi bản ghi là một mục trong danh sách. Mỗi dòng ngắn gọn (1–2 câu).</small>
        </div>
        <div class="form-group">
          <label>Ngành liên kết</label>
          <select name="nganh_id">
            ${(() => {
              if (this.undergradProgramsList && this.undergradProgramsList.length > 0) {
                return this.undergradProgramsList.map(p =>
                  `<option value="${p.id}" ${String(p.id) === String(data.nganh_id || 1) ? 'selected' : ''}>${p.ten_nganh || p.ten_chuong_trinh || 'Ngành ' + p.id}</option>`
                ).join('');
              }
              return `<option value="1" ${(!data.nganh_id || data.nganh_id == 1) ? 'selected' : ''}>Công nghệ thông tin (mặc định)</option>
                      <option value="2" ${data.nganh_id == 2 ? 'selected' : ''}>Trí tuệ nhân tạo</option>`;
            })()}
          </select>
        </div>
        <div class="form-group">
          <label>Thứ tự hiển thị</label>
          <input type="number" name="thu_tu" value="${data.thu_tu || 0}" min="0">
        </div>
      `;
    } else if (entityKey === 'undergradStudentStats') {
      html += `
        <div class="form-group">
          <label>Ngành đào tạo (*)</label>
          <select name="nganh_id" required>
            ${(() => {
              if (this.undergradProgramsList && this.undergradProgramsList.length > 0) {
                return this.undergradProgramsList.map(p =>
                  `<option value="${p.id}" ${String(p.id) === String(data.nganh_id || 1) ? 'selected' : ''}>${p.ten_nganh}</option>`
                ).join('');
              }
              return `<option value="1" ${(!data.nganh_id || data.nganh_id == 1) ? 'selected' : ''}>Công nghệ thông tin</option>
                      <option value="2" ${data.nganh_id == 2 ? 'selected' : ''}>Trí tuệ nhân tạo</option>`;
            })()}
          </select>
        </div>
        <div class="form-group">
          <label>Khóa (*)</label>
          <input type="text" name="khoa" value="${data.khoa || ''}" required placeholder="VD: K36, K37, ..., K52">
          <small style="color:var(--admin-text-muted); margin-top:4px; display:block;">Nhập tên khóa theo định dạng K + số (K36, K49...)</small>
        </div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
          <div class="form-group">
            <label>Số SV nhập học (*)</label>
            <input type="number" name="so_sinh_vien" value="${data.so_sinh_vien || 0}" min="0" required>
          </div>
          <div class="form-group">
            <label>Tổng đã tốt nghiệp</label>
            <input type="number" name="so_tot_nghiep" value="${data.so_tot_nghiep || 0}" min="0">
            <small style="color:var(--admin-text-muted); margin-top:4px; display:block;">Để 0 nếu khóa chưa ra trường</small>
          </div>
          <div class="form-group">
            <label>TN đúng tiến độ</label>
            <input type="number" name="so_dung_tien_do" value="${data.so_dung_tien_do || 0}" min="0">
          </div>
          <div class="form-group">
            <label>TN sớm</label>
            <input type="number" name="so_tot_nghiep_som" value="${data.so_tot_nghiep_som || 0}" min="0">
          </div>
        </div>
        <div class="form-group">
          <label>Thứ tự hiển thị (1=K36, 2=K37...)</label>
          <input type="number" name="thu_tu" value="${data.thu_tu || 0}" min="0">
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

    // Thu thập dữ liệu từ tất cả input/select/textarea bên trong modal (loại bỏ checkbox và file uploader)
    const inputs = formContainer.querySelectorAll('input:not([type="file"]):not([type="checkbox"]), select, textarea');
    const payload = {};
    inputs.forEach(el => {
      if (el.name) payload[el.name] = el.value;
    });

    // Xử lý Serialize cho cấu hình Ẩn/Hiện phần nội dung trang cá nhân
    if (this.currentNav === 'staffProfiles') {
      const hideSections = [];
      if (document.getElementById('hide_section_nckh')?.checked) hideSections.push('nckh');
      if (document.getElementById('hide_section_project')?.checked) hideSections.push('project');
      if (document.getElementById('hide_section_paper')?.checked) hideSections.push('paper');
      if (document.getElementById('hide_section_book')?.checked) hideSections.push('book');
      if (document.getElementById('hide_section_supervision')?.checked) hideSections.push('supervision');

      if (hideSections.length > 0) {
        payload.linh_vuc_nghien_cuu = `${payload.linh_vuc_nghien_cuu || ''}||hide:${hideSections.join(',')}`;
      }
    }

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
