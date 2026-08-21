/**
 * src/modules/auth/controllers/adminAuth.controller.js
 * HTTP handlers cho Admin Google OAuth authentication
 */
import passport from 'passport';
import { AdminAuthService } from '../services/adminAuth.service.js';
import config from '../../../config/index.js';

export const AdminAuthController = {

  /**
   * GET /auth/google
   * Bắt đầu flow Google OAuth
   */
  initiateGoogleAuth(req, res, next) {
    const isLocal = req.get('host').includes('localhost') || req.get('host').includes('127.0.0.1');
    const callbackURL = isLocal 
      ? 'http://localhost:5000/auth/google/callback'
      : `http://${req.get('host')}/auth/google/callback`;

    passport.authenticate('google', {
      scope: ['profile', 'email'],
      prompt: 'select_account',
      callbackURL: callbackURL
    })(req, res, next);
  },

  /**
   * GET /auth/google/callback
   * Google OAuth callback — xử lý sau khi xác thực
   */
  async googleCallback(req, res) {
    // Passport đã xác thực và gán req.user từ passport strategy
    try {
      const admin = req.user;

      // Lưu vào session
      req.session.adminUser = {
        id:        admin.id,
        email:     admin.email,
        hoTen:     admin.ho_ten,
        avatarUrl: admin.avatar_url,
        quyenHan:  admin.quyen_han,
        trangThai: admin.trang_thai
      };

      req.session.save((err) => {
        const isLocal = req.get('host').includes('localhost') || req.get('host').includes('127.0.0.1');
        const adminLoginUrl = isLocal ? config.frontend.adminLogin : `http://${req.get('host')}/admin-login`;
        const dashboardUrl = isLocal ? config.frontend.adminDashboard : `http://${req.get('host')}/admin/`;

        if (err) {
          console.error('[AdminAuth] Lỗi lưu session:', err);
          return res.redirect(`${adminLoginUrl}?error=session_error`);
        }
        // Dùng HTML redirect thay vì HTTP 302 để đảm bảo cookie được ghi trước khi browser chuyển trang
        res.send(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Đăng nhập thành công...</title>
</head>
<body>
  <p>Đang chuyển hướng vào Dashboard...</p>
  <script>
    window.location.replace('${dashboardUrl}');
  </script>
</body>
</html>`);
      });
    } catch (err) {
      console.error('[AdminAuth] Lỗi callback:', err);
      const isLocal = req.get('host').includes('localhost') || req.get('host').includes('127.0.0.1');
      const adminLoginUrl = isLocal ? config.frontend.adminLogin : `http://${req.get('host')}/admin-login`;
      res.redirect(`${adminLoginUrl}?error=auth_failed`);
    }
  },

  /**
   * POST /api/auth/admin/logout
   * Đăng xuất admin — xóa session
   */
  async logout(req, res) {
    const adminId = req.session?.adminUser?.id;
    const ip = req.ip;
    const userAgent = req.headers['user-agent'];

    await AdminAuthService.logoutAdmin(adminId, ip, userAgent);

    req.session.destroy((err) => {
      if (err) {
        console.error('[AdminAuth] Lỗi xóa session:', err);
      }
      res.clearCookie('connect.sid');
      res.json({ success: true, message: 'Đăng xuất thành công.', redirectTo: config.frontend.adminLogin });
    });
  },

  /**
   * GET /api/auth/admin/me
   * Trả về thông tin admin hiện tại từ session
   */
  async getMe(req, res) {
    if (!req.session?.adminUser) {
      return res.status(401).json({ success: false, message: 'Chưa đăng nhập.', isLoggedIn: false });
    }
    res.json({ success: true, isLoggedIn: true, user: req.session.adminUser });
  },

  /**
   * Xử lý lỗi khi Google OAuth thất bại (account không có quyền)
   */
  handleAuthError(req, res) {
    const message = req.query.message || 'Tài khoản Google này không có quyền truy cập hệ thống quản trị.';
    const isLocal = req.get('host').includes('localhost') || req.get('host').includes('127.0.0.1');
    const adminLoginUrl = isLocal ? config.frontend.adminLogin : `http://${req.get('host')}/admin-login`;
    res.redirect(`${adminLoginUrl}?error=${encodeURIComponent(message)}`);
  }
};
