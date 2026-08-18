/**
 * src/modules/auth/middleware/requireLecturer.js
 * Middleware bảo vệ các route chỉ dành cho Giảng viên đã đăng nhập.
 * Nhận JWT token từ HttpOnly cookie (ưu tiên) HOẶC Authorization Bearer header (fallback).
 */
import { LecturerAuthService } from '../services/lecturerAuth.service.js';

export function requireLecturer(req, res, next) {
  // Ưu tiên cookie httpOnly, fallback sang Authorization header (dev cross-port)
  let token = req.cookies?.lecturer_token;

  if (!token) {
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.slice(7);
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Phiên làm việc hết hạn. Vui lòng đăng nhập lại.',
      code: 'UNAUTHORIZED'
    });
  }

  try {
    const decoded = LecturerAuthService.verifyToken(token);

    // Kiểm tra bắt buộc đổi mật khẩu
    if (decoded.phaDoiMk && req.path !== '/change-password') {
      return res.status(403).json({
        success: false,
        message: 'Bạn cần đổi mật khẩu trước khi tiếp tục.',
        code: 'MUST_CHANGE_PASSWORD'
      });
    }

    // Gán thông tin user vào request
    req.lecturerUser = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.',
        code: 'TOKEN_EXPIRED'
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Token không hợp lệ. Vui lòng đăng nhập lại.',
      code: 'INVALID_TOKEN'
    });
  }
}
