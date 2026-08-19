/**
 * src/modules/lecturer/controllers/lecturer.controller.js
 * HTTP handlers cho Giảng viên profile management
 */
import { LecturerRepository } from '../repositories/lecturer.repository.js';
import { AdminModel } from '../../admin/models/admin.model.js';
import { mapCreatePayload } from '../../admin/dto/create-admin.dto.js';
import { mapUpdatePayload } from '../../admin/dto/update-admin.dto.js';
import { HTTP_STATUS } from '../../../constants/index.js';

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
  },

  /**
   * Check whether an entity key is allowed for a lecturer.
   */
  _validateLecturerEntity(entity) {
    const LECTURER_ALLOWED_ENTITIES = [
      'staffProfiles',
      'staffResearch',
      'staffPapers',
      'staffProjects',
      'staffBooks',
      'staffSupervisions'
    ];
    if (!LECTURER_ALLOWED_ENTITIES.includes(entity)) {
      throw new Error(`Bạn không có quyền quản lý thực thể '${entity}'.`);
    }
  },

  /**
   * GET /api/lecturer/my/:entity
   */
  async getMyEntityList(req, res, next) {
    try {
      const { entity } = req.params;
      LecturerController._validateLecturerEntity(entity);
      const nhanVienId = req.lecturerUser.nhanVienId;
      const tableName = AdminModel.getTableName(entity);

      const data = await LecturerRepository.getMyEntityList(tableName, nhanVienId);
      res.json({ success: true, data });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  /**
   * POST /api/lecturer/my/:entity
   */
  async createMyEntityItem(req, res, next) {
    try {
      const { entity } = req.params;
      LecturerController._validateLecturerEntity(entity);
      const nhanVienId = req.lecturerUser.nhanVienId;
      const tableName = AdminModel.getTableName(entity);

      // Force nhan_vien_id to be the logged-in lecturer
      const payload = { ...req.body, nhan_vien_id: nhanVienId };
      const mappedData = mapCreatePayload(entity, payload);

      const newItem = await LecturerRepository.createMyEntityItem(tableName, nhanVienId, mappedData);
      res.status(HTTP_STATUS.CREATED).json({ success: true, data: newItem });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  /**
   * PUT /api/lecturer/my/:entity/:id
   */
  async updateMyEntityItem(req, res, next) {
    try {
      const { entity, id } = req.params;
      LecturerController._validateLecturerEntity(entity);
      const nhanVienId = req.lecturerUser.nhanVienId;
      const tableName = AdminModel.getTableName(entity);

      // Force nhan_vien_id to be the logged-in lecturer
      const payload = { ...req.body, nhan_vien_id: nhanVienId };
      const mappedData = mapUpdatePayload(entity, payload);

      const updated = await LecturerRepository.updateMyEntityItem(tableName, nhanVienId, id, mappedData);
      res.json({ success: true, data: updated });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  /**
   * DELETE /api/lecturer/my/:entity/:id
   */
  async deleteMyEntityItem(req, res, next) {
    try {
      const { entity, id } = req.params;
      LecturerController._validateLecturerEntity(entity);
      const nhanVienId = req.lecturerUser.nhanVienId;
      const tableName = AdminModel.getTableName(entity);

      await LecturerRepository.deleteMyEntityItem(tableName, nhanVienId, id);
      res.json({ success: true, message: 'Xóa dữ liệu thành công.' });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }
};
