/**
 * src/modules/admin/controllers/admin.controller.js
 * HTTP Layer for the Admin module.
 *
 * Responsibilities (ONLY):
 *  - Parse HTTP request (req.params, req.body, req.file)
 *  - Call AdminService
 *  - Send HTTP response
 *  - Pass errors to next() for the global error handler
 *
 * Controllers contain NO business logic and NO SQL.
 */
import { AdminService } from '../services/admin.service.js';
import { HTTP_STATUS }  from '../../../constants/index.js';
import path             from 'path';

export const AdminController = {
  /**
   * GET /api/v1/admin/:entity
   * Returns all records for the given entity.
   */
  async getList(req, res, next) {
    try {
      const { entity } = req.params;
      const data = await AdminService.getList(entity);
      res.status(HTTP_STATUS.OK).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST /api/v1/admin/:entity
   * Creates a new record.
   */
  async createItem(req, res, next) {
    try {
      const { entity } = req.params;
      const newItem = await AdminService.createItem(entity, req.body);
      res.status(HTTP_STATUS.CREATED).json({ success: true, data: newItem });
    } catch (err) {
      next(err);
    }
  },

  /**
   * PUT /api/v1/admin/:entity/:id
   * Updates an existing record.
   */
  async updateItem(req, res, next) {
    try {
      const { entity, id } = req.params;
      const updated = await AdminService.updateItem(entity, id, req.body);
      res.status(HTTP_STATUS.OK).json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  },

  /**
   * DELETE /api/v1/admin/:entity/:id
   * Removes a record by ID.
   */
  async deleteItem(req, res, next) {
    try {
      const { entity, id } = req.params;
      await AdminService.deleteItem(entity, id);
      res.status(HTTP_STATUS.OK).json({ success: true, message: 'Xóa dữ liệu thành công.' });
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST /api/v1/admin/upload
   * Handles image file upload (multer has already processed req.file).
   * Returns the relative URL path to the saved image.
   */
  async uploadImage(req, res, next) {
    try {
      if (!req.file) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          error: 'Vui lòng chọn một file ảnh để tải lên!'
        });
      }
      // Lưu path chuẩn tính từ root của frontend để thống nhất CSDL
      const imageUrl = `assets/images/uploads/${path.basename(req.file.filename)}`;
      res.status(HTTP_STATUS.OK).json({ success: true, imageUrl });
    } catch (err) {
      next(err);
    }
  }
};
