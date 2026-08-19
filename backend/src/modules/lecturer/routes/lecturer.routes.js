/**
 * src/modules/lecturer/routes/lecturer.routes.js
 * Routes cho Giảng viên — tất cả đều cần xác thực
 */
import { Router }             from 'express';
import { LecturerController } from '../controllers/lecturer.controller.js';
import { requireLecturer }    from '../../auth/middleware/requireLecturer.js';
import { uploadSingle }       from '../../../middleware/upload.middleware.js';

const router = Router();

// Tất cả routes đều cần đăng nhập
router.use(requireLecturer);

// GET  /api/lecturer/profile  → Xem hồ sơ bản thân
router.get('/profile', LecturerController.getProfile);

// PUT  /api/lecturer/profile  → Cập nhật hồ sơ bản thân
router.put('/profile', LecturerController.updateProfile);

// ── Scoped Generic CRUD for Lecturer's Own Data ────────────────────────────────
router.get('/my/:entity', LecturerController.getMyEntityList);
router.post('/my/:entity', LecturerController.createMyEntityItem);
router.put('/my/:entity/:id', LecturerController.updateMyEntityItem);
router.delete('/my/:entity/:id', LecturerController.deleteMyEntityItem);

// POST /api/lecturer/upload   → Upload ảnh đại diện bản thân
router.post('/upload', uploadSingle, async (req, res) => {
  try {
    if (!req.uploadedUrl) {
      return res.status(400).json({ success: false, message: 'Upload thất bại.' });
    }
    // Cập nhật ảnh đại diện trong DB
    const nhanVienId = req.lecturerUser.nhanVienId;
    const { default: pool } = await import('../../../database/index.js');
    await pool.query(
      'UPDATE nhan_vien SET anh_ca_nhan_url = ?, ngay_cap_nhat = NOW() WHERE id = ?',
      [req.uploadedUrl, nhanVienId]
    );
    res.json({ success: true, url: req.uploadedUrl, message: 'Cập nhật ảnh đại diện thành công.' });
  } catch (err) {
    console.error('[Lecturer] upload error:', err);
    res.status(500).json({ success: false, message: 'Lỗi khi upload ảnh.' });
  }
});

export default router;
