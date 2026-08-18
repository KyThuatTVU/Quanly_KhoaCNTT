/**
 * src/modules/lecturer/controllers/lecturer.controller.js
 * HTTP handlers cho Giảng viên profile management
 */
import { LecturerRepository } from '../repositories/lecturer.repository.js';

export const LecturerController = {

  /**
   * GET /api/lecturer/profile
   * Lấy hồ sơ của chính giảng viên đang đăng nhập
   */
  async getProfile(req, res) {
    try {
      const nhanVienId = req.lecturerUser.nhanVienId;
      const profile = await LecturerRepository.getProfile(nhanVienId);

      if (!profile) {
        return res.status(404).json({ success: false, message: 'Không tìm thấy hồ sơ.' });
      }

      // Không trả về password_hash hay thông tin nhạy cảm
      const { mat_khau_hash, ...safeProfile } = profile;
      res.json({ success: true, data: safeProfile });
    } catch (err) {
      console.error('[LecturerController] getProfile error:', err);
      res.status(500).json({ success: false, message: 'Lỗi server khi lấy hồ sơ.' });
    }
  },

  /**
   * PUT /api/lecturer/profile
   * Cập nhật hồ sơ của chính giảng viên
   * QUAN TRỌNG: Chỉ cho phép sửa field cụ thể, không cho sửa email
   */
  async updateProfile(req, res) {
    try {
      const nhanVienId = req.lecturerUser.nhanVienId;

      // Loại bỏ các field không được phép sửa (email, id, nhom_id, v.v.)
      const { email, id, nhom_id, slug_ca_nhan, an_hien, nguoi_tao_admin_id, ...allowedData } = req.body;

      const updated = await LecturerRepository.updateProfile(nhanVienId, allowedData);
      res.json({ success: true, message: 'Cập nhật hồ sơ thành công.', data: updated });
    } catch (err) {
      console.error('[LecturerController] updateProfile error:', err);
      res.status(500).json({ success: false, message: 'Lỗi server khi cập nhật hồ sơ.' });
    }
  }
};
