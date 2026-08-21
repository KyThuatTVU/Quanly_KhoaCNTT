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
import { renderDashboardPanel as renderDashboardPanelFn } from './dashboardPanel.js';
import { renderApiMonitorPanel as renderApiMonitorPanelFn } from './apiMonitorPanel.js';
import { renderUserGuidePanel as renderUserGuidePanelFn } from './userGuidePanel.js';
import {
  renderEntityPanel as renderEntityPanelFn,
  updateOrderOptions as updateOrderOptionsFn,
  openModalForAdd as openModalForAddFn,
  openModalForEdit as openModalForEditFn,
  closeModal as closeModalFn,
  captureInitialFormState as captureInitialFormStateFn,
  isFormDirty as isFormDirtyFn,
  saveFormDraft as saveFormDraftFn,
  restoreFormDraft as restoreFormDraftFn,
  clearFormDraft as clearFormDraftFn,
  generateFormFields as generateFormFieldsFn,
  debounce as debounceFn,
  syncUrlState as syncUrlStateFn,
  getDraftStorageKey as getDraftStorageKeyFn,
  restoreUrlStateAndScroll as restoreUrlStateAndScrollFn
} from './entityForms.js';
import { showToast as showToastFn } from '../utils/adminUtils.js';

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
    const user = await AdminAuthService.verifySessionWithBackend();
    if (user) {
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
      const dest = window.location.port === '5500' ? '../admin-login.html' : '/admin-login';
      window.location.href = dest;
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
          const response = await fetch(`${window.location.port === '5500' ? 'http://localhost:5000' : ''}/api/v1/admin/upload`, {
            method: 'POST',
            credentials: 'include',
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
      deans: 'Ban Lãnh đạo Khoa',
      lecturers: 'Giảng viên & Trợ giảng',
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
      lecturerAccounts: 'Tài khoản Giảng viên',
      apiMonitor: 'Trạng thái Hệ thống',
      userGuide: 'Hướng dẫn sử dụng'
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
      undergradCareers: 'Vị trí việc làm',
      undergradStudentStats: 'Thống kê SV',
      undergradCourses: 'Học phần',
      undergradFaqs: 'Câu hỏi FAQ',
      postgradNotices: 'Thông báo',
      postgradPhdStudents: 'Nghiên cứu sinh',
      postgradStats: 'Thống kê',
      news: 'Tin tức',
      gallery: 'Hình ảnh',
      adminAccounts: 'Tài khoản',
      lecturerAccounts: 'Tài khoản GV'
    };
    const prefix = fallbacks[entityKey] || 'Mục';
    return `${prefix} #${item.id}`;
  }


  renderDashboardPanel(container) {
    renderDashboardPanelFn(container, this);
  }

  async renderApiMonitorPanel(container) {
    await renderApiMonitorPanelFn(container, this);
  }

  renderUserGuidePanel(container) {
    renderUserGuidePanelFn(container, this);
  }

  async renderEntityPanel(container, entityKey) {
    return renderEntityPanelFn.call(this, container, entityKey);
  }

  updateOrderOptions(nhomId, currentStaffId, currentOrder) {
    return updateOrderOptionsFn.call(this, nhomId, currentStaffId, currentOrder);
  }

  openModalForAdd(entityKey) {
    return openModalForAddFn.call(this, entityKey);
  }

  openModalForEdit(entityKey, id) {
    return openModalForEditFn.call(this, entityKey, id);
  }

  closeModal() {
    return closeModalFn.call(this);
  }

  captureInitialFormState() {
    return captureInitialFormStateFn.call(this);
  }

  isFormDirty() {
    return isFormDirtyFn.call(this);
  }

  saveFormDraft() {
    return saveFormDraftFn.call(this);
  }

  restoreFormDraft(entityKey, sourceItem = null) {
    return restoreFormDraftFn.call(this, entityKey, sourceItem);
  }

  clearFormDraft(entityKey) {
    return clearFormDraftFn.call(this, entityKey);
  }

  generateFormFields(entityKey, data) {
    return generateFormFieldsFn.call(this, entityKey, data);
  }

  debounce(func, wait) {
    return debounceFn(func, wait);
  }

  syncUrlState() {
    return syncUrlStateFn.call(this);
  }

  getDraftStorageKey(entityKey) {
    return getDraftStorageKeyFn.call(this, entityKey);
  }

  restoreUrlStateAndScroll() {
    return restoreUrlStateAndScrollFn.call(this);
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
      let apiNav = this.currentNav;
      if (this.currentNav === 'deans' || this.currentNav === 'lecturers') {
        apiNav = 'staff';
      }

      if (this.editingId) {
        await AdminApiService.updateItem(apiNav, this.editingId, payload);
        this.showToast('Cập nhật dữ liệu thành công!', 'success');
      } else {
        if (this.currentNav === 'deans' && payload.appoint_action === 'true') {
          // Bổ nhiệm Giảng viên có sẵn làm Lãnh đạo khoa (Gọi updateItem thay vì createItem)
          const appointId = payload.appoint_nhan_vien_id;
          const appointPayload = {
            nhom_id: 1,
            chuc_vu: payload.chuc_vu,
            thu_tu_trong_nhom: payload.thu_tu_trong_nhom
          };
          await AdminApiService.updateItem('staff', appointId, appointPayload);
          this.showToast('Bổ nhiệm Lãnh đạo khoa thành công!', 'success');
        } else {
          await AdminApiService.createItem(apiNav, payload);
          this.showToast('Thêm mới dữ liệu thành công!', 'success');
        }
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
    if (entityKey === 'deans') {
      if (confirm('Bạn có muốn chuyển cán bộ này về làm Giảng viên bình thường không?\n(Nhấn Cancel nếu muốn xóa hoàn toàn khỏi khoa)')) {
        try {
          await AdminApiService.updateItem('staff', id, { nhom_id: 2, chuc_vu: 'Giảng viên' });
          this.showToast('Đã chuyển cán bộ về làm Giảng viên bình thường.', 'success');
          this.navigate(entityKey);
        } catch (err) {
          this.showToast(`Lỗi: ${err.message}`, 'error');
        }
        return;
      }
    }

    const apiKey = (entityKey === 'deans' || entityKey === 'lecturers') ? 'staff' : entityKey;
    if (confirm(`Bạn có chắc chắn muốn xóa hoàn toàn cán bộ/mục này khỏi cơ sở dữ liệu không?`)) {
      try {
        await AdminApiService.deleteItem(apiKey, id);
        this.showToast(`Xóa dữ liệu thành công!`, 'success');
        this.navigate(entityKey);
      } catch (err) {
        this.showToast(`Lỗi hệ thống: ${err.message}`, 'error');
      }
    }
  }


  showToast(message, type = 'success') {
    showToastFn(message, type);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const app = new AdminApp();
  app.init();
});
