import { saveToken, authFetch, getRedirectUrl } from '../auth.js';

const API_BASE = 'http://localhost:5000';

// Toggle hiện/ẩn mật khẩu
document.getElementById('togglePassword').addEventListener('click', () => {
  const input = document.getElementById('password');
  const icon  = document.getElementById('eyeIcon');
  if (input.type === 'password') {
    input.type = 'text';
    icon.innerHTML = `<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>`;
  } else {
    input.type = 'password';
    icon.innerHTML = `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>`;
  }
});

// Hiển thị thông báo
function showAlert(message, type = 'error') {
  const box = document.getElementById('alertBox');
  box.className = `alert-box alert-${type}`;
  box.style.display = 'flex';
  box.textContent = message;
}

function hideAlert() {
  document.getElementById('alertBox').style.display = 'none';
}

// Xử lý đăng nhập
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  hideAlert();

  const email    = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  if (!email || !password) {
    showAlert('Vui lòng nhập đầy đủ email và mật khẩu.'); return;
  }

  const btn     = document.getElementById('btnLogin');
  const spinner = document.getElementById('spinner');
  const btnText = document.getElementById('btnText');
  btn.disabled  = true;
  spinner.style.display = 'block';
  btnText.textContent   = 'Đang xác thực...';

  try {
    const res = await fetch(`${API_BASE}/api/auth/lecturer/login`, {
      method:      'POST',
      headers:     { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, mat_khau: password })
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      showAlert(data.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
      return;
    }

    // Lưu token vào sessionStorage (fallback khi cookie cross-port bị chặn)
    if (data.token) saveToken(data.token);
    sessionStorage.setItem('lecturer_user', JSON.stringify(data.user));

    showAlert('Đăng nhập thành công! Đang chuyển hướng...', 'success');
    setTimeout(() => { window.location.href = getRedirectUrl('dashboard'); }, 1000);
  } catch (err) {
    showAlert('Không thể kết nối đến máy chủ. Vui lòng thử lại sau.');
  } finally {
    btn.disabled = false;
    spinner.style.display = 'none';
    btnText.textContent   = 'Đăng nhập';
  }
});

// Kiểm tra nếu đã đăng nhập (dùng authFetch — gửi cả cookie lẫn Bearer)
(async () => {
  try {
    const res = await authFetch(`${API_BASE}/api/auth/lecturer/me`);
    if (res.ok) {
      const data = await res.json();
      if (data.success) window.location.href = getRedirectUrl('dashboard');
    }
  } catch {}
})();
