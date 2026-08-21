// Kiểm tra lỗi từ URL query param
const params = new URLSearchParams(window.location.search);
const error  = params.get('error');
if (error) {
  const box = document.getElementById('errorBox');
  box.style.display = 'block';
  const messages = {
    'auth_failed':    'Xác thực thất bại. Tài khoản Google này không có quyền truy cập hệ thống quản trị.',
    'session_error':  'Lỗi tạo phiên làm việc. Vui lòng thử lại.',
    'account_blocked': 'Tài khoản quản trị của bạn đã bị khóa.',
  };
  box.textContent = messages[error] || decodeURIComponent(error);
}

// Kiểm tra nếu đã đăng nhập admin
(async () => {
  try {
    const res = await fetch(`${window.location.port === '5500' ? 'http://localhost:5000' : ''}/api/auth/admin/me`, { credentials: 'include' });
    if (res.ok) {
      const data = await res.json();
      if (data.isLoggedIn) {
        const dest = window.location.port === '5500' ? 'admin/index.html' : '/admin';
        window.location.href = dest;
      }
    }
  } catch {}
})();
