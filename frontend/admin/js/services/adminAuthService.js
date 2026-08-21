/**
 * ==========================================================================
 * GOOGLE OAUTH AUTHENTICATION SERVICE FOR ADMIN PORTAL
 * ==========================================================================
 * Manages Google OAuth authentication state, admin user profile, roles,
 * and session persistence for the FIT-TVU Admin Dashboard.
 */

const STORAGE_KEY = 'tvu_admin_session';
// QUAN TRỌNG: Phải dùng localhost (không phải 127.0.0.1) để cookie session hoạt động
const API_BASE = `${window.location.port === '5500' ? 'http://localhost:5000' : ''}`;

export const AdminAuthService = {
  getCurrentUser() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Lỗi đọc dữ liệu phiên làm việc Admin:', e);
    }
    return null;
  },

  isLoggedIn() {
    const user = this.getCurrentUser();
    return !!(user && user.email);
  },

  async verifySessionWithBackend() {
    try {
      const res = await fetch(`${API_BASE}/api/auth/admin/me`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.isLoggedIn) {
          const user = {
            id: data.user.id,
            google_id: data.user.googleId || data.user.google_id,
            email: data.user.email,
            ho_ten: data.user.hoTen || data.user.ho_ten,
            quyen_han: data.user.quyenHan || data.user.quyen_han,
            avatar_url: data.user.avatarUrl || data.user.avatar_url,
            lan_dang_nhap_cuoi: data.user.lanDangNhapCuoi || data.user.lan_dang_nhap_cuoi
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
          return user;
        }
      }
    } catch (e) {
      console.error('Lỗi kiểm tra session với backend:', e);
    }
    localStorage.removeItem(STORAGE_KEY);
    return null;
  },

  async loginWithGoogle(accountEmail = 'lamnn@tvu.edu.vn') {
    // Không dùng flow mock nữa, redirect thẳng tới Google OAuth của backend
    window.location.href = `${API_BASE}/auth/google`;
    return null;
  },

  logout() {
    localStorage.removeItem(STORAGE_KEY);
    fetch(`${API_BASE}/api/auth/admin/logout`, { method: 'POST', credentials: 'include' })
      .then(() => {
        const dest = window.location.port === '5500' ? '../admin-login.html' : '/admin-login';
        window.location.href = dest;
      })
      .catch(() => {
        const dest = window.location.port === '5500' ? '../admin-login.html' : '/admin-login';
        window.location.href = dest;
      });
  }
};
