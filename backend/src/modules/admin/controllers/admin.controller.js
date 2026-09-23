/**
 * src/modules/admin/controllers/admin.controller.js
 * HTTP Layer for the Admin module.
 *
 * Responsibilities:
 *  - Parse HTTP request (req.params, req.body, req.file)
 *  - Call AdminService
 *  - Invalidate server memory cache
 *  - Emit Real-Time SSE events to public frontend clients (<0.05s)
 *  - Send HTTP response
 */
import { AdminService }   from '../services/admin.service.js';
import { HTTP_STATUS }    from '../../../constants/index.js';
import { memoryCache }    from '../../../common/cache/memoryCache.js';
import { sseBroadcaster } from '../../../common/utils/sseBroadcaster.js';
import path               from 'path';

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
      console.log(`[AdminController] createItem for entity: ${entity}, body:`, req.body);
      const newItem = await AdminService.createItem(entity, req.body);

      // Invalidate server cache & broadcast Real-Time SSE event to public clients
      memoryCache.invalidateEntity(entity);
      sseBroadcaster.broadcastDataUpdate(entity, 'create', newItem);

      res.status(HTTP_STATUS.CREATED).json({ success: true, data: newItem });
    } catch (err) {
      console.error('[AdminController] Error in createItem:', err);
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

      // Invalidate server cache & broadcast Real-Time SSE event to public clients
      memoryCache.invalidateEntity(entity);
      sseBroadcaster.broadcastDataUpdate(entity, 'update', updated);

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

      // Invalidate server cache & broadcast Real-Time SSE event to public clients
      memoryCache.invalidateEntity(entity);
      sseBroadcaster.broadcastDataUpdate(entity, 'delete', { id });

      res.status(HTTP_STATUS.OK).json({ success: true, message: 'Xóa dữ liệu thành công.' });
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST /api/v1/admin/upload
   * Handles image file upload.
   */
  async uploadImage(req, res, next) {
    try {
      if (!req.file) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          error: 'Vui lòng chọn một file ảnh để tải lên!'
        });
      }
      const imageUrl = `assets/images/uploads/${path.basename(req.file.filename)}`;
      res.status(HTTP_STATUS.OK).json({ success: true, imageUrl });
    } catch (err) {
      next(err);
    }
  }
};
