import { requireAuth, authFetch } from '../auth.js';

const API_BASE = 'http://localhost:5000';

// Kiểm tra đăng nhập
requireAuth();

function togglePw(id, btn) {
  const input = document.getElementById(id);
  input.type = input.type === 'password' ? 'text' : 'password';
  btn.textContent = input.type === 'password' ? '👁' : '🙈';
}
window.togglePw = togglePw;

function checkStrength(pw) {
  const fill = document.getElementById('strengthFill');
  const text = document.getElementById('strengthText');
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  const levels = [
    { w: '0%',   color: '#e2e8f0', label: 'Nhập mật khẩu' },
    { w: '25%',  color: '#ef4444', label: '⚠ Rất yếu' },
    { w: '50%',  color: '#f59e0b', label: '▲ Trung bình' },
    { w: '75%',  color: '#3b82f6', label: '✓ Khá mạnh' },
    { w: '100%', color: '#22c55e', label: '✅ Mạnh' }
  ];

  fill.style.width = levels[score].w;
  fill.style.background = levels[score].color;
  text.textContent = pw ? levels[score].label : levels[0].label;
}
window.checkStrength = checkStrength;

function showAlert(msg, type = 'error') {
  const box = document.getElementById('alertBox');
  box.className = `alert-box alert-${type}`;
  box.style.display = 'block';
  box.textContent = msg;
}

document.getElementById('changeForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const current = document.getElementById('currentPw').value;
  const newPw   = document.getElementById('newPw').value;
  const confirm = document.getElementById('confirmPw').value;

  if (newPw !== confirm) { showAlert('Xác nhận mật khẩu mới không khớp.'); return; }
  if (newPw.length < 8)  { showAlert('Mật khẩu mới phải có ít nhất 8 ký tự.'); return; }

  const btn  = document.getElementById('btnSubmit');
  const spin = document.getElementById('spinner');
  const txt  = document.getElementById('btnText');
  btn.disabled = true; spin.style.display = 'block'; txt.textContent = 'Đang xử lý...';

  try {
    const res = await authFetch(`${API_BASE}/api/auth/lecturer/change-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mat_khau_hien_tai: current, mat_khau_moi: newPw, xac_nhan_mat_khau_moi: confirm })
    });
    const data = await res.json();
    if (data.success) {
      showAlert('✅ ' + data.message, 'success');
      setTimeout(() => window.location.href = 'dashboard.html', 2000);
    } else {
      showAlert(data.message || 'Đổi mật khẩu thất bại.');
    }
  } catch { showAlert('Lỗi kết nối. Vui lòng thử lại.'); }
  finally { btn.disabled = false; spin.style.display = 'none'; txt.textContent = 'Đổi mật khẩu'; }
});
