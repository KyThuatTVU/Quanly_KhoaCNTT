/**
 * ==========================================================================
 * GOOGLE OAUTH AUTHENTICATION SERVICE FOR ADMIN PORTAL
 * ==========================================================================
 * Manages Google OAuth authentication state, admin user profile, roles,
 * and session persistence for the FIT-TVU Admin Dashboard.
 */

const STORAGE_KEY = 'tvu_admin_session';

export const MOCK_GOOGLE_ADMINS = [
  {
    id: 1,
    google_id: 'google_sub_109283741928347102938',
    email: 'lamnn@tvu.edu.vn',
    ho_ten: 'TS. Nguyễn Nhứt Lam',
    chuc_vu: 'Trưởng khoa Công nghệ Thông tin',
    quyen_han: 'SUPER_ADMIN',
    avatar_url: 'assets/images/deans/lamnn.jpg',
    lan_dang_nhap_cuoi: new Date().toISOString()
  },
  {
    id: 2,
    google_id: 'google_sub_109283741928347102939',
    email: 'oane@tvu.edu.vn',
    ho_ten: 'TS. Thạch Kọng Saoane',
    chuc_vu: 'Phó Trưởng khoa Công nghệ Thông tin',
    quyen_han: 'SUPER_ADMIN',
    avatar_url: 'assets/images/deans/oane.jpg',
    lan_dang_nhap_cuoi: new Date().toISOString()
  },
  {
    id: 3,
    google_id: 'google_sub_109283741928347102940',
    email: 'lpdu@tvu.edu.vn',
    ho_ten: 'ThS. Lê Phong Dũ',
    chuc_vu: 'Phó Trưởng khoa Công nghệ Thông tin',
    quyen_han: 'STAFF_EDITOR',
    avatar_url: 'assets/images/deans/lpdu.jpg',
    lan_dang_nhap_cuoi: new Date().toISOString()
  }
];

export const AdminAuthService = {
  /**
   * Get current authenticated user session
   */
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

  /**
   * Check if user is currently logged in as Admin
   */
  isLoggedIn() {
    const user = this.getCurrentUser();
    return !!(user && user.email);
  },

  /**
   * Perform Google OAuth Login (Simulated interface login)
   */
  async loginWithGoogle(accountEmail = 'lamnn@tvu.edu.vn') {
    // Fallback using preset mock account
    let selectedUser = MOCK_GOOGLE_ADMINS.find(u => u.email === accountEmail);
    if (!selectedUser) {
      selectedUser = {
        id: Date.now(),
        google_id: `google_sub_${Date.now()}`,
        email: accountEmail,
        ho_ten: accountEmail.split('@')[0].toUpperCase() + ' (Admin TVU)',
        chuc_vu: 'Quản trị viên Khoa CNTT',
        quyen_han: 'SUPER_ADMIN',
        avatar_url: 'https://lh3.googleusercontent.com/a/default-user=s96-c',
        lan_dang_nhap_cuoi: new Date().toISOString()
      };
    } else {
      // Clone to avoid mutating read-only imported module objects
      selectedUser = { ...selectedUser };
    }

    selectedUser.lan_dang_nhap_cuoi = new Date().toLocaleString('vi-VN');
    localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedUser));
    return selectedUser;
  },

  /**
   * Log out current admin
   */
  logout() {
    localStorage.removeItem(STORAGE_KEY);
    console.log('Đã đăng xuất tài khoản Admin Google.');
  }
};
