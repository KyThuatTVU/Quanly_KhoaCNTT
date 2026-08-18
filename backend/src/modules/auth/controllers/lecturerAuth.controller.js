/**
 * src/modules/auth/controllers/lecturerAuth.controller.js
 * HTTP handlers cho Giảng viên authentication (Email + Password)
 */
import { LecturerAuthService } from '../services/lecturerAuth.service.js';
import config from '../../../config/index.js';

const IS_PROD = config.app.env === 'production';

const COOKIE_OPTIONS = {
  httpOnly: true,              // Không cho JS đọc
  secure: IS_PROD,             // HTTPS only trong production
  sameSite: IS_PROD ? 'lax' : 'lax', // 'lax' hoạt động vì cùng hostname localhost
  maxAge: 8 * 60 * 60 * 1000  // 8 giờ
};

export const LecturerAuthController = {

  /**
   * POST /api/auth/lecturer/login
   * Đăng nhập giảng viên bằng email + password
   */
  async login(req, res) {
    try {
      const { email, mat_khau } = req.body;

      if (!email || !mat_khau) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng nhập đầy đủ email và mật khẩu.'
        });
      }

      const ip = req.ip;
      const userAgent = req.headers['user-agent'];

      const result = await LecturerAuthService.login(email, mat_khau, ip, userAgent);

      // Lưu JWT vào HttpOnly cookie
      res.cookie('lecturer_token', result.token, COOKIE_OPTIONS);

      res.json({
        success: true,
        message: 'Đăng nhập thành công.',
        token: result.token,          // Trả về để frontend lưu sessionStorage (fallback cross-port)
        mustChangePassword: result.mustChangePassword,
        user: result.user
      });
    } catch (err) {
      res.status(401).json({
        success: false,
        message: err.message || 'Đăng nhập thất bại.'
      });
    }
  },

  /**
   * POST /api/auth/lecturer/logout
   * Đăng xuất giảng viên
   */
  async logout(req, res) {
    const accountId = req.lecturerUser?.id;
    const ip = req.ip;
    const userAgent = req.headers['user-agent'];

    await LecturerAuthService.logout(accountId, ip, userAgent);

    res.clearCookie('lecturer_token');
    res.json({ success: true, message: 'Đăng xuất thành công.' });
  },

  /**
   * GET /api/auth/lecturer/me
   * Trả về thông tin giảng viên từ JWT (đã qua requireLecturer middleware)
   */
  async getMe(req, res) {
    res.json({ success: true, user: req.lecturerUser });
  },

  /**
   * POST /api/auth/lecturer/change-password
   * Đổi mật khẩu giảng viên
   */
  async changePassword(req, res) {
    try {
      const { mat_khau_hien_tai, mat_khau_moi, xac_nhan_mat_khau_moi } = req.body;
      const accountId = req.lecturerUser.id;

      if (!mat_khau_hien_tai || !mat_khau_moi || !xac_nhan_mat_khau_moi) {
        return res.status(400).json({ success: false, message: 'Vui lòng điền đầy đủ thông tin.' });
      }

      if (mat_khau_moi !== xac_nhan_mat_khau_moi) {
        return res.status(400).json({ success: false, message: 'Xác nhận mật khẩu mới không khớp.' });
      }

      if (mat_khau_moi.length < 8) {
        return res.status(400).json({ success: false, message: 'Mật khẩu mới phải có ít nhất 8 ký tự.' });
      }

      await LecturerAuthService.changePassword(accountId, mat_khau_hien_tai, mat_khau_moi);

      // Cấp lại token mới (không còn must_change_password)
      const { AuthRepository } = await import('../repositories/auth.repository.js');
      const account = await AuthRepository.findLecturerAccountById(accountId);
      const { LecturerAuthService: svc } = await import('../services/lecturerAuth.service.js');
      const newResult = { token: await import('jsonwebtoken').then(jwt =>
        jwt.default.sign({
          id: account.id,
          nhanVienId: account.nhan_vien_id,
          email: account.email,
          hoTen: account.ho_ten,
          quyenHan: account.quyen_han,
          phaDoiMk: false
        }, process.env.JWT_SECRET || 'dev-jwt-secret', { expiresIn: '8h' })
      )};

      res.cookie('lecturer_token', newResult.token, COOKIE_OPTIONS);
      res.json({ success: true, message: 'Đổi mật khẩu thành công! Phiên làm việc đã được gia hạn.' });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  /**
   * POST /api/auth/lecturer/forgot-password
   * Thông báo liên hệ Admin để reset mật khẩu (không gửi email tự động)
   */
  async forgotPassword(req, res) {
    // Không tiết lộ email có tồn tại hay không
    res.json({
      success: true,
      message: 'Nếu email của bạn tồn tại trong hệ thống, vui lòng liên hệ Văn phòng Khoa CNTT để được Admin reset mật khẩu. Sau khi Admin reset, bạn sẽ đăng nhập bằng mật khẩu tạm thời được cấp.'
    });
  }
};
