/**
 * src/modules/auth/services/adminAuth.service.js
 * Business logic cho Admin authentication qua Google OAuth 2.0
 */
import { AuthRepository } from '../repositories/auth.repository.js';

export const AdminAuthService = {

  /**
   * Xử lý sau khi Google OAuth callback thành công.
   * Kiểm tra email có trong danh sách admin được phép không.
   * Nếu có → update last_login → trả về admin profile
   * Nếu không → throw error
   */
  async handleGoogleCallback(profile) {
    const googleId = profile.id;
    const email    = profile.emails?.[0]?.value;
    const hoTen    = profile.displayName;
    const avatarUrl = profile.photos?.[0]?.value;

    if (!email) {
      throw new Error('Không lấy được email từ tài khoản Google.');
    }

    // Tìm admin theo Google ID trước
    let admin = await AuthRepository.findAdminByGoogleId(googleId);

    if (!admin) {
      // Thử tìm theo email (trường hợp admin được tạo trước khi có google_id)
      admin = await AuthRepository.findAdminByEmail(email);
    }

    if (!admin) {
      throw new Error(`Tài khoản Google <${email}> không có quyền truy cập hệ thống quản trị.`);
    }

    if (admin.trang_thai === 0) {
      throw new Error('Tài khoản quản trị này đã bị khóa. Vui lòng liên hệ Super Admin.');
    }

    // Update Google ID và last_login
    await AuthRepository.upsertAdminFromGoogle({ googleId, email, hoTen, avatarUrl });

    // Trả về admin data mới nhất
    const updatedAdmin = await AuthRepository.findAdminByEmail(email);

    // Ghi log
    await AuthRepository.logActivity({
      userId: updatedAdmin.id,
      userType: 'admin',
      hanhDong: 'login',
      moTa: `Admin ${email} đăng nhập thành công qua Google OAuth`,
      doiTuong: 'admin',
      doiTuongId: updatedAdmin.id,
      ip: null,
      userAgent: null
    });

    return updatedAdmin;
  },

  /**
   * Lấy thông tin admin từ session
   */
  async getAdminProfile(adminId) {
    const [rows] = await import('../../../database/index.js').then(m =>
      m.default.query('SELECT id, email, ho_ten, avatar_url, quyen_han, trang_thai, lan_dang_nhap_cuoi FROM tai_khoan_admin_google WHERE id = ? LIMIT 1', [adminId])
    );
    return rows[0] || null;
  },

  /**
   * Đăng xuất admin — xóa session
   */
  async logoutAdmin(adminId, ip, userAgent) {
    if (adminId) {
      await AuthRepository.logActivity({
        userId: adminId,
        userType: 'admin',
        hanhDong: 'logout',
        moTa: 'Admin đăng xuất',
        doiTuong: 'admin',
        doiTuongId: adminId,
        ip,
        userAgent
      });
    }
  }
};
