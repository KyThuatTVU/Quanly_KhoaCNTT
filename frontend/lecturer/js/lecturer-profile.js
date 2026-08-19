import { requireAuth, authFetch, lecturerLogout } from './auth.js';

const API_BASE = 'http://localhost:5000';
let currentNhanVienId = null;

// Kiểm tra đăng nhập và load dữ liệu
async function init() {
  const user = await requireAuth();   // Tự redirect login nếu 401
  if (!user) return;

  document.getElementById('sidebarName').textContent = user.hoTen;
  document.getElementById('profileCardName').textContent = user.hoTen;

  // Load full profile
  await loadProfile();
}

async function loadProfile() {
  try {
    const res = await authFetch(`${API_BASE}/api/lecturer/profile`);
    if (!res.ok) throw new Error('Không thể lấy thông tin hồ sơ.');
    const { data } = await res.json();

    currentNhanVienId = data.id;

    // Set values to fields
    document.getElementById('hoTen').value        = data.ho_ten || '';
    document.getElementById('email').value         = data.email || '';
    document.getElementById('hocVi').value         = data.hoc_vi || '';
    document.getElementById('hocHam').value        = data.hoc_ham || '';
    document.getElementById('chucVu').value        = data.chuc_vu || '';
    document.getElementById('donViCongTac').value  = data.don_vi_cong_tac || '';
    document.getElementById('linhVucNghienCuu').value = data.linh_vuc_nghien_cuu || '';
    document.getElementById('googleScholar').value = data.google_scholar_url || '';
    document.getElementById('orcid').value         = data.orcid_url || '';
    document.getElementById('github').value        = data.github_url || '';
    document.getElementById('websiteCaNhan').value = data.website_ca_nhan || '';

    // Set avatar previews
    const avatarUrl = data.anh_ca_nhan_url ? `${API_BASE}/${data.anh_ca_nhan_url}` : '../assets/images/default-avatar.webp';
    document.getElementById('avatarPreview').src = avatarUrl;

    const sidebarAvatar = document.getElementById('sidebarAvatar');
    sidebarAvatar.innerHTML = `<img src="${avatarUrl}" alt="Avatar" onerror="this.parentNode.textContent='${data.ho_ten[0]}'">`;
  } catch (err) {
    showAlert('Không thể kết nối lấy dữ liệu hồ sơ.');
  }
}

function showAlert(msg, type = 'error') {
  const box = document.getElementById('alertBox');
  box.className = `alert-box alert-${type}`;
  box.style.display = 'block';
  box.textContent = msg;
}

// Xử lý submit form
document.getElementById('profileForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const btn  = document.getElementById('btnSave');
  const spin = document.getElementById('spinner');
  const txt  = document.getElementById('btnSaveText');

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
      showAlert('✅ Lưu thay đổi thành công!', 'success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      await loadProfile();
    } else {
      showAlert(result.message || 'Lỗi khi lưu thay đổi.');
    }
  } catch {
    showAlert('Lỗi kết nối máy chủ.');
  } finally {
    btn.disabled = false; spin.style.display = 'none'; txt.textContent = 'Lưu thay đổi';
  }
});

// Xử lý upload avatar
document.getElementById('avatarFileInput').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('image', file);

  try {
    showAlert('Đang upload ảnh đại diện...', 'success');
    const res = await authFetch(`${API_BASE}/api/lecturer/upload`, {
      method: 'POST',
      body: formData
    });
    const result = await res.json();

    if (result.success) {
      showAlert('✅ Cập nhật ảnh đại diện thành công!', 'success');
      await loadProfile();
    } else {
      showAlert(result.message || 'Lỗi khi upload ảnh.');
    }
  } catch {
    showAlert('Lỗi kết nối upload.');
  }
});

// Đăng xuất
document.getElementById('btnLogout').addEventListener('click', () => lecturerLogout());

init();
