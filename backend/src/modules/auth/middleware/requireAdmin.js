/**
 * src/modules/auth/middleware/requireAdmin.js
 * Middleware bảo vệ các route chỉ dành cho Admin.
 * Kiểm tra session được tạo sau khi Google OAuth thành công.
 */
import config from '../../../config/index.js';

export function requireAdmin(req, res, next) {
  // Kiểm tra session
  if (!req.session || !req.session.adminUser) {
    return res.status(401).json({
      success: false,
      message: 'Bạn chưa đăng nhập. Vui lòng đăng nhập bằng tài khoản Admin Google.',
      redirectTo: config.frontend.adminLogin
    });
  }

  const admin = req.session.adminUser;

  // Kiểm tra tài khoản bị khóa
  if (admin.trang_thai === 0) {
    req.session.destroy();
    return res.status(403).json({
      success: false,
      message: 'Tài khoản Admin đã bị khóa.',
      redirectTo: config.frontend.adminLogin
    });
  }

  // Gán user vào request để dùng trong controller
  req.adminUser = admin;
  next();
}
