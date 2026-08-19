/**
 * MAIN LECTURER PORTAL APPLICATION CONTROLLER (SPA)
 */

import { requireAuth, authFetch, lecturerLogout } from '../../auth.js';
import { LecturerApiService } from '../services/lecturerApiService.js';
import { LECTURER_ENTITY_CONFIG, generateFormHtml } from './lecturerEntities.js';

const API_BASE = 'http://localhost:5000';

class LecturerApp {
  constructor() {
    this.currentNav = 'dashboard';
    this.user = null;
    this.currentDataList = [];
    this.editingId = null;
    this.isSubmitting = false;
  }

  async init() {
    // 1. Authenticate user
    this.user = await requireAuth();
    if (!this.user) return;

    // 2. Set up user info in sidebar
    document.getElementById('sidebarName').textContent = this.user.hoTen;
    const avatarUrl = this.user.anhUrl ? `${API_BASE}/${this.user.anhUrl}` : '../assets/images/default-avatar.webp';
    document.getElementById('sidebarAvatar').innerHTML = `<img src="${avatarUrl}" alt="Avatar" onerror="this.parentNode.textContent='${this.user.hoTen[0]}'">`;

    // 3. Bind sidebar events & Mobile toggle
    const sidebar = document.getElementById('lecturerSidebar');
    const backdrop = document.getElementById('sidebarBackdrop');
    const menuToggle = document.getElementById('btnMenuToggle');

    if (menuToggle && sidebar && backdrop) {
      const toggleMenu = () => {
        sidebar.classList.toggle('open');
        backdrop.classList.toggle('hidden');
      };
      menuToggle.addEventListener('click', toggleMenu);
      backdrop.addEventListener('click', toggleMenu);
    }

    const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        navItems.forEach(n => n.classList.remove('active'));
        item.classList.add('active');
        const nav = item.getAttribute('data-nav');
        
        // Hide sidebar on mobile after navigating
        if (sidebar && !backdrop.classList.contains('hidden')) {
          sidebar.classList.remove('open');
          backdrop.classList.add('hidden');
        }
        
        this.navigate(nav);
      });
    });

    // 4. Bind logout
    document.getElementById('btnLogout').addEventListener('click', () => lecturerLogout());

    // 5. Bind modal close actions
    document.getElementById('btnLecturerCloseModal').addEventListener('click', () => this.closeModal());
    document.getElementById('btnLecturerCancelModal').addEventListener('click', () => this.closeModal());

    // 6. Bind form submission
    document.getElementById('lecturerDynamicForm').addEventListener('submit', (e) => this.handleFormSubmit(e));

    // 7. Initial routing
    this.navigate('dashboard');
  }

  navigate(nav) {
    this.currentNav = nav;
    const container = document.getElementById('lecturerMainContent');
    container.innerHTML = ''; // Clear content

    if (nav === 'dashboard') {
      this.renderDashboardPanel(container);
    } else if (nav === 'profile') {
      this.renderProfilePanel(container);
    } else if (nav === 'change-password') {
      this.renderChangePasswordPanel(container);
    } else {
      // It's a CRUD entity panel
      this.renderEntityPanel(container, nav);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ── PANEL: DASHBOARD ────────────────────────────────────────────────────────
  renderDashboardPanel(container) {
    const isPwWarning = this.user.phaDoiMk ? `
      <div class="change-pw-banner" id="changePwBanner" style="display: flex;">
        <span>⚠️</span>
        <p><strong>Bắt buộc đổi mật khẩu:</strong> Bạn đang dùng mật khẩu mặc định. Vui lòng đổi mật khẩu ngay.</p>
        <a href="#" onclick="document.querySelector('[data-nav=change-password]').click()">Đổi ngay</a>
      </div>
    ` : '';

    container.innerHTML = `
      ${isPwWarning}
      <div class="welcome-card">
        <div class="welcome-text">
          <h2>Xin chào, ${this.user.hoTen}!</h2>
          <p>Hệ thống quản lý hồ sơ giảng viên — Khoa Công nghệ Thông tin, TVU</p>
        </div>
        <div style="font-size: 48px;">👨‍🏫</div>
      </div>

      <div class="quick-cards">
        <a href="#" class="quick-card" onclick="document.querySelector('[data-nav=profile]').click()">
          <div class="quick-icon" style="background:#eff6ff;">📝</div>
          <div class="quick-label">Hồ sơ cá nhân</div>
          <div class="quick-desc">Cập nhật thông tin học vị, chuyên môn, lĩnh vực nghiên cứu</div>
        </a>
        <a href="#" class="quick-card" onclick="document.querySelector('[data-nav=staffResearch]').click()">
          <div class="quick-icon" style="background:#faf5ff;">🔬</div>
          <div class="quick-label">Nghiên cứu Khoa học</div>
          <div class="quick-desc">Tự khai báo đề tài NCKH, bài báo khoa học, sách & giáo trình cá nhân</div>
        </a>
      </div>
    `;
  }

  // ── PANEL: PROFILE ──────────────────────────────────────────────────────────
  async renderProfilePanel(container) {
    container.innerHTML = `
      <div class="page-header">
        <h1 class="page-title">📝 Hồ sơ cá nhân</h1>
        <p class="page-subtitle">Cập nhật thông tin giảng dạy, học vị và chuyên môn của bản thân</p>
      </div>

      <div id="alertBox" class="alert-box"></div>

      <div class="profile-container">
        <div class="profile-card-left">
          <div class="avatar-upload-container">
            <img id="avatarPreview" src="../assets/images/default-avatar.webp" alt="Avatar" class="avatar-preview">
            <label for="avatarFileInput" class="avatar-btn-label" title="Đổi ảnh đại diện">📷</label>
            <input type="file" id="avatarFileInput" accept="image/*" style="display:none;">
          </div>
          <h2 class="lecturer-name" id="profileCardName">${this.user.hoTen}</h2>
          <div class="lecturer-role-badge" id="profileCardRole">Giảng viên</div>
        </div>

        <div class="profile-card-right">
          <form id="profileForm">
            <div class="section-title">👤 Thông tin cơ bản</div>
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Họ và tên</label>
                <input type="text" id="hoTen" class="form-input" disabled />
              </div>
              <div class="form-group">
                <label class="form-label">Email đăng nhập</label>
                <input type="email" id="email" class="form-input" disabled />
              </div>
              <div class="form-group">
                <label class="form-label">Học vị (*)</label>
                <input type="text" id="hocVi" class="form-input" required />
              </div>
              <div class="form-group">
                <label class="form-label">Học hàm</label>
                <input type="text" id="hocHam" class="form-input" />
              </div>
              <div class="form-group">
                <label class="form-label">Chức danh / Chức vụ (*)</label>
                <input type="text" id="chucVu" class="form-input" required />
              </div>
              <div class="form-group">
                <label class="form-label">Đơn vị công tác (*)</label>
                <input type="text" id="donViCongTac" class="form-input" required />
              </div>
            </div>

            <div class="section-title" style="margin-top: 36px;">🔬 Chuyên môn & Nghiên cứu</div>
            <div class="form-grid">
              <div class="form-group full-width">
                <label class="form-label">Hướng nghiên cứu / Lĩnh vực nghiên cứu</label>
                <textarea id="linhVucNghienCuu" class="form-input" rows="4"></textarea>
              </div>
              <div class="form-group">
                <label class="form-label">Google Scholar Profile URL</label>
                <input type="url" id="googleScholar" class="form-input" />
              </div>
              <div class="form-group">
                <label class="form-label">ORCID URL</label>
                <input type="url" id="orcid" class="form-input" />
              </div>
              <div class="form-group">
                <label class="form-label">GitHub URL</label>
                <input type="url" id="github" class="form-input" />
              </div>
              <div class="form-group">
                <label class="form-label">Website cá nhân / Blog</label>
                <input type="url" id="websiteCaNhan" class="form-input" />
              </div>
            </div>

            <button type="submit" class="btn-save" id="btnSave">
              <div class="spinner" id="btnSpinner"></div>
              <span id="btnSaveText">Lưu thay đổi</span>
            </button>
          </form>
        </div>
      </div>
    `;

    // Load full profile details from API
    await this.loadProfileData();

    // Bind profile submit
    document.getElementById('profileForm').addEventListener('submit', (e) => this.handleProfileSubmit(e));

    // Bind avatar uploader
    const fileInput = document.getElementById('avatarFileInput');
    document.querySelector('.avatar-btn-label').addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => this.handleAvatarUpload(e));
  }

  async loadProfileData() {
    try {
      const res = await authFetch(`${API_BASE}/api/lecturer/profile`);
      if (!res.ok) throw new Error('Không thể lấy thông tin hồ sơ.');
      const { data } = await res.json();

      document.getElementById('hoTen').value = data.ho_ten || '';
      document.getElementById('email').value = data.email || '';
      document.getElementById('hocVi').value = data.hoc_vi || '';
      document.getElementById('hocHam').value = data.hoc_ham || '';
      document.getElementById('chucVu').value = data.chuc_vu || '';
      document.getElementById('donViCongTac').value = data.don_vi_cong_tac || '';
      document.getElementById('linhVucNghienCuu').value = data.linh_vuc_nghien_cuu || '';
      document.getElementById('googleScholar').value = data.google_scholar_url || '';
      document.getElementById('orcid').value = data.orcid_url || '';
      document.getElementById('github').value = data.github_url || '';
      document.getElementById('websiteCaNhan').value = data.website_ca_nhan || '';

      const avatarUrl = data.anh_ca_nhan_url ? `${API_BASE}/${data.anh_ca_nhan_url}` : '../assets/images/default-avatar.webp';
      document.getElementById('avatarPreview').src = avatarUrl;
    } catch {
      this.showPanelAlert('Không thể kết nối lấy dữ liệu hồ sơ.');
    }
  }

  async handleProfileSubmit(e) {
    e.preventDefault();
    const btn = document.getElementById('btnSave');
    const spin = document.getElementById('btnSpinner');
    const txt = document.getElementById('btnSaveText');

    btn.disabled = true; spin.style.display = 'block'; txt.textContent = 'Đang lưu...';

    const bodyData = {
      hoc_vi: document.getElementById('hocVi').value.trim(),
      hoc_ham: document.getElementById('hocHam').value.trim(),
      chuc_vu: document.getElementById('chucVu').value.trim(),
      don_vi_cong_tac: document.getElementById('donViCongTac').value.trim(),
      linh_vuc_nghien_cuu: document.getElementById('linhVucNghienCuu').value.trim(),
      google_scholar_url: document.getElementById('googleScholar').value.trim(),
      orcid_url: document.getElementById('orcid').value.trim(),
      github_url: document.getElementById('github').value.trim(),
      website_ca_nhan: document.getElementById('websiteCaNhan').value.trim()
    };

    try {
      const res = await authFetch(`${API_BASE}/api/lecturer/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData)
      });
      const result = await res.json();
      if (result.success) {
        this.showPanelAlert('✅ Lưu thay đổi thành công!', 'success');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        await this.loadProfileData();
      } else {
        this.showPanelAlert(result.message || 'Lỗi khi lưu thay đổi.');
      }
    } catch {
      this.showPanelAlert('Lỗi kết nối máy chủ.');
    } finally {
      btn.disabled = false; spin.style.display = 'none'; txt.textContent = 'Lưu thay đổi';
    }
  }

  async handleAvatarUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      this.showPanelAlert('Đang tải ảnh đại diện lên...', 'success');
      const res = await authFetch(`${API_BASE}/api/lecturer/upload`, {
        method: 'POST',
        body: formData
      });
      const result = await res.json();
      if (result.success) {
        this.showPanelAlert('✅ Cập nhật ảnh đại diện thành công!', 'success');
        await this.loadProfileData();
      } else {
        this.showPanelAlert(result.message || 'Lỗi khi upload ảnh.');
      }
    } catch {
      this.showPanelAlert('Lỗi kết nối upload.');
    }
  }

  showPanelAlert(msg, type = 'error') {
    const box = document.getElementById('alertBox');
    if (!box) return;
    box.className = `alert-box alert-${type}`;
    box.style.display = 'block';
    box.textContent = msg;
  }

  // ── PANEL: CHANGE PASSWORD ──────────────────────────────────────────────────
  renderChangePasswordPanel(container) {
    container.innerHTML = `
      <div class="page-header">
        <h1 class="page-title">🔐 Đổi mật khẩu</h1>
        <p class="page-subtitle">Cập nhật mật khẩu mới an toàn cho tài khoản giảng viên của bạn</p>
      </div>

      <div id="alertBox" class="alert-box"></div>

      <div class="profile-container" style="display:block; max-width:600px; margin: 0 auto;">
        <div class="profile-card-right" style="padding: 30px;">
          <div class="rules" style="margin-bottom: 24px;">
            <h4>Yêu cầu mật khẩu mới:</h4>
            <ul>
              <li>Ít nhất 8 ký tự</li>
              <li>Không trùng với mật khẩu hiện tại</li>
              <li>Nên kết hợp chữ, số và ký tự đặc biệt</li>
            </ul>
          </div>

          <form id="changeForm">
            <div class="form-group">
              <label class="form-label">Mật khẩu hiện tại</label>
              <div class="password-wrapper">
                <input type="password" id="currentPw" class="form-input" placeholder="Nhập mật khẩu hiện tại" required />
                <button type="button" class="toggle-password" id="btnToggleCurrent">👁</button>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Mật khẩu mới</label>
              <div class="password-wrapper">
                <input type="password" id="newPw" class="form-input" placeholder="Nhập mật khẩu mới" required />
                <button type="button" class="toggle-password" id="btnToggleNew">👁</button>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Xác nhận mật khẩu mới</label>
              <div class="password-wrapper">
                <input type="password" id="confirmPw" class="form-input" placeholder="Nhập lại mật khẩu mới" required />
                <button type="button" class="toggle-password" id="btnToggleConfirm">👁</button>
              </div>
            </div>

            <button type="submit" class="btn-save" id="btnChangeSubmit" style="width: 100%; margin-top: 16px;">
              <div class="spinner" id="changeSpinner"></div>
              <span id="btnChangeText">Đổi mật khẩu</span>
            </button>
          </form>
        </div>
      </div>
    `;

    // Toggle password triggers
    const toggle = (inputId, btnId) => {
      const btn = document.getElementById(btnId);
      const input = document.getElementById(inputId);
      btn.addEventListener('click', () => {
        input.type = input.type === 'password' ? 'text' : 'password';
      });
    };
    toggle('currentPw', 'btnToggleCurrent');
    toggle('newPw', 'btnToggleNew');
    toggle('confirmPw', 'btnToggleConfirm');

    // Bind submit
    document.getElementById('changeForm').addEventListener('submit', (e) => this.handleChangePwSubmit(e));
  }

  async handleChangePwSubmit(e) {
    e.preventDefault();
    const current = document.getElementById('currentPw').value;
    const newPw = document.getElementById('newPw').value;
    const confirm = document.getElementById('confirmPw').value;

    if (newPw !== confirm) { this.showPanelAlert('Xác nhận mật khẩu mới không khớp.'); return; }
    if (newPw.length < 8) { this.showPanelAlert('Mật khẩu mới phải có ít nhất 8 ký tự.'); return; }

    const btn = document.getElementById('btnChangeSubmit');
    const spin = document.getElementById('changeSpinner');
    const txt = document.getElementById('btnChangeText');
    btn.disabled = true; spin.style.display = 'block'; txt.textContent = 'Đang xử lý...';

    try {
      const res = await authFetch(`${API_BASE}/api/auth/lecturer/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mat_khau_hien_tai: current, mat_khau_moi: newPw, xac_nhan_mat_khau_moi: confirm })
      });
      const data = await res.json();
      if (data.success) {
        this.showPanelAlert('✅ ' + data.message, 'success');
        setTimeout(() => this.navigate('dashboard'), 2000);
      } else {
        this.showPanelAlert(data.message || 'Đổi mật khẩu thất bại.');
      }
    } catch {
      this.showPanelAlert('Lỗi kết nối. Vui lòng thử lại.');
    } finally {
      btn.disabled = false; spin.style.display = 'none'; txt.textContent = 'Đổi mật khẩu';
    }
  }

  // ── PANEL: GENERIC CRUD FOR ENTITIES ─────────────────────────────────────────
  async renderEntityPanel(container, entityKey) {
    const config = LECTURER_ENTITY_CONFIG[entityKey];
    if (!config) return;

    container.innerHTML = `
      <div class="page-header" style="display:flex; justify-content:space-between; align-items:center;">
        <div>
          <h1 class="page-title">${config.icon} ${config.label}</h1>
          <p class="page-subtitle">Danh sách các thông tin và bài viết đã khai báo của bạn</p>
        </div>
        <button class="btn-add-new" id="btnLecturerAddNew">
          ➕ Thêm thông tin mới
        </button>
      </div>

      <div id="alertBox" class="alert-box"></div>

      <div class="table-container">
        <table class="data-table" id="lecturerTable">
          <thead>
            <tr>
              <th style="width: 5%">ID</th>
              <th style="width: 75%">Thông tin chính</th>
              <th style="width: 20%; text-align: right;">Hành động</th>
            </tr>
          </thead>
          <tbody id="lecturerTableBody">
            <tr>
              <td colspan="3" style="text-align: center; color: #64748b;">Đang tải danh sách...</td>
            </tr>
          </tbody>
        </table>
      </div>
    `;

    // Bind Add button
    document.getElementById('btnLecturerAddNew').addEventListener('click', () => this.openModalForAdd(entityKey));

    // Load data from API
    await this.loadEntityData(entityKey);
  }

  async loadEntityData(entityKey) {
    const config = LECTURER_ENTITY_CONFIG[entityKey];
    const tbody = document.getElementById('lecturerTableBody');

    try {
      this.currentDataList = await LecturerApiService.getList(entityKey);
      
      if (!this.currentDataList || this.currentDataList.length === 0) {
        tbody.innerHTML = `<tr><td colspan="3" style="text-align: center; color: #94a3b8; padding: 24px;">Bạn chưa khai báo bản ghi nào trong mục này.</td></tr>`;
        return;
      }

      tbody.innerHTML = this.currentDataList.map(item => {
        const title = config.getDisplayTitle(item);
        const sub = config.getDisplaySub(item);

        return `
          <tr>
            <td>${item.id}</td>
            <td>
              <div style="font-weight:700; color:#0f2d59; font-size:14.5px;">${title}</div>
              <div style="font-size:12.5px; color:#64748b; margin-top:4px;">${sub}</div>
            </td>
            <td style="text-align: right;">
              <div class="action-buttons" style="justify-content: flex-end;">
                <button class="btn-action edit" data-id="${item.id}">Sửa</button>
                <button class="btn-action delete" data-id="${item.id}">Xóa</button>
              </div>
            </td>
          </tr>
        `;
      }).join('');

      // Bind row actions
      tbody.querySelectorAll('.btn-action.edit').forEach(btn => {
        btn.addEventListener('click', () => this.openModalForEdit(entityKey, btn.getAttribute('data-id')));
      });
      tbody.querySelectorAll('.btn-action.delete').forEach(btn => {
        btn.addEventListener('click', () => this.handleDeleteItem(entityKey, btn.getAttribute('data-id')));
      });

    } catch (e) {
      tbody.innerHTML = `<tr><td colspan="3" style="text-align: center; color: #dc2626; padding: 24px;">Lỗi tải dữ liệu. Vui lòng thử lại sau.</td></tr>`;
    }
  }

  openModalForAdd(entityKey) {
    this.editingId = null;
    const config = LECTURER_ENTITY_CONFIG[entityKey];
    document.getElementById('lecturerModalTitle').textContent = `➕ Thêm mới ${config.label}`;
    
    const fieldsContainer = document.getElementById('lecturerFormFields');
    fieldsContainer.innerHTML = generateFormHtml(entityKey);

    document.getElementById('lecturerModalOverlay').classList.remove('hidden');
  }

  openModalForEdit(entityKey, id) {
    this.editingId = id;
    const config = LECTURER_ENTITY_CONFIG[entityKey];
    const record = this.currentDataList.find(item => String(item.id) === String(id));
    if (!record) return;

    document.getElementById('lecturerModalTitle').textContent = `📝 Chỉnh sửa ${config.label}`;
    
    const fieldsContainer = document.getElementById('lecturerFormFields');
    fieldsContainer.innerHTML = generateFormHtml(entityKey, record);

    document.getElementById('lecturerModalOverlay').classList.remove('hidden');
  }

  closeModal() {
    document.getElementById('lecturerModalOverlay').classList.add('hidden');
    document.getElementById('lecturerFormFields').innerHTML = '';
    this.editingId = null;
  }

  async handleFormSubmit(e) {
    e.preventDefault();
    if (this.isSubmitting) return;

    const form = document.getElementById('lecturerDynamicForm');
    const formData = new FormData(form);
    const payload = {};
    formData.forEach((value, key) => {
      payload[key] = value;
    });

    const submitBtn = document.getElementById('btnLecturerSubmitModal');
    const originalText = submitBtn.textContent;
    
    this.isSubmitting = true;
    submitBtn.disabled = true;
    submitBtn.textContent = '⏳ Đang lưu...';

    try {
      if (this.editingId) {
        await LecturerApiService.updateItem(this.currentNav, this.editingId, payload);
        this.showPanelAlert('✅ Cập nhật dữ liệu thành công!', 'success');
      } else {
        await LecturerApiService.createItem(this.currentNav, payload);
        this.showPanelAlert('✅ Thêm mới dữ liệu thành công!', 'success');
      }
      this.closeModal();
      await this.loadEntityData(this.currentNav);
    } catch (err) {
      alert(`Lỗi: ${err.message}`);
    } finally {
      this.isSubmitting = false;
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  }

  async handleDeleteItem(entityKey, id) {
    if (!confirm('Bạn có chắc chắn muốn xóa bản ghi này khỏi danh sách cá nhân?')) return;

    try {
      await LecturerApiService.deleteItem(entityKey, id);
      this.showPanelAlert('✅ Xóa dữ liệu thành công!', 'success');
      await this.loadEntityData(entityKey);
    } catch (err) {
      this.showPanelAlert(`Lỗi: ${err.message}`);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const app = new LecturerApp();
  app.init();
});
