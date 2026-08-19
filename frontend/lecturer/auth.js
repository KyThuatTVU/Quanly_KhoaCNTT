/**
 * frontend/lecturer/auth.js
 * Helper dùng chung cho các trang Giảng viên.
 * - Lưu / đọc JWT token từ sessionStorage (fallback khi cookie cross-port không hoạt động)
 * - authFetch(): wrapper fetch() tự động đính kèm Bearer token
 * - requireAuth(): redirect về login nếu chưa đăng nhập
 * - lecturerLogout(): đăng xuất + xóa token
 */

const API_BASE = 'http://localhost:5000';

// ── Token helpers ─────────────────────────────────────────────────────────────

export function saveToken(token) {
  if (token) sessionStorage.setItem('lecturer_token', token);
}

export function getToken() {
  return sessionStorage.getItem('lecturer_token');
}

export function clearToken() {
  sessionStorage.removeItem('lecturer_token');
  sessionStorage.removeItem('lecturer_user');
}

// ── Authenticated fetch ───────────────────────────────────────────────────────
/**
 * Wrapper cho fetch() — tự động gửi cookie + Authorization Bearer header.
 * Dùng thay cho fetch() ở tất cả các trang protected.
 */
export function authFetch(url, options = {}) {
  const token = getToken();
  const headers = { ...(options.headers || {}) };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return fetch(url, {
    ...options,
    credentials: 'include',   // Vẫn gửi cookie (nếu browser hỗ trợ)
    headers
  });
}

// ── Auth guard ────────────────────────────────────────────────────────────────
/**
 * Gọi ở đầu mỗi trang protected. Nếu 401 → redirect về login.
 * Trả về user object nếu đã đăng nhập.
 */
export async function requireAuth() {
  try {
    const res = await authFetch(`${API_BASE}/api/auth/lecturer/me`);
    if (!res.ok) {
      clearToken();
      window.location.href = 'login.html';
      return null;
    }
    const data = await res.json();
    if (!data.success) {
      clearToken();
      window.location.href = 'login.html';
      return null;
    }
    
    // Nếu bắt buộc đổi mật khẩu và chưa ở trang change-password.html -> chuyển hướng
    const isChangePwPage = window.location.pathname.endsWith('change-password.html');
    if (data.user?.phaDoiMk && !isChangePwPage) {
      window.location.href = 'change-password.html';
      return null;
    }

    return data.user;
  } catch {
    clearToken();
    window.location.href = 'login.html';
    return null;
  }
}

// ── Logout ────────────────────────────────────────────────────────────────────
export async function lecturerLogout() {
  try {
    await authFetch(`${API_BASE}/api/auth/lecturer/logout`, { method: 'POST' });
  } catch {}
  clearToken();
  window.location.href = 'login.html';
}
