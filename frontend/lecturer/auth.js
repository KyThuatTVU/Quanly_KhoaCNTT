/**
 * frontend/lecturer/auth.js
 * Helper dùng chung cho các trang Giảng viên.
 * - Lưu / đọc JWT token từ sessionStorage (fallback khi cookie cross-port không hoạt động)
 * - authFetch(): wrapper fetch() tự động đính kèm Bearer token
 * - requireAuth(): redirect về login nếu chưa đăng nhập
 * - lecturerLogout(): đăng xuất + xóa token
 */

const API_BASE = `${window.location.port === '5500' ? 'http://localhost:5000' : ''}`;

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

// ── Redirect helper for clean URLs vs local .html files ──────────────────
export function getRedirectUrl(page) {
  if (window.location.port === '5500') {
    return page === 'login' ? '/lecturer/login.html' : '/lecturer/dashboard.html';
  }
  return page === 'login' ? '/lecturer-login' : '/lecturer';
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
      window.location.href = getRedirectUrl('login');
      return null;
    }
    const data = await res.json();
    if (!data.success) {
      clearToken();
      window.location.href = getRedirectUrl('login');
      return null;
    }


    return data.user;
  } catch {
    clearToken();
    window.location.href = getRedirectUrl('login');
    return null;
  }
}

// ── Logout ────────────────────────────────────────────────────────────────────
export async function lecturerLogout() {
  try {
    await authFetch(`${API_BASE}/api/auth/lecturer/logout`, { method: 'POST' });
  } catch {}
  clearToken();
  window.location.href = getRedirectUrl('login');
}
