/**
 * src/modules/auth/routes/lecturerAuth.routes.js
 * Routes cho Giảng viên authentication (Email + Password)
 */
import { Router }                   from 'express';
import rateLimit                    from 'express-rate-limit';
import { LecturerAuthController }   from '../controllers/lecturerAuth.controller.js';
import { requireLecturer }          from '../middleware/requireLecturer.js';

const router = Router();

// Rate limiting: tối đa 10 lần login/phút
const loginLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 phút
  max: 10,
  message: {
    success: false,
    message: 'Quá nhiều lần đăng nhập thất bại. Vui lòng thử lại sau 1 phút.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// ── Public Routes ──────────────────────────────────────────────────────────────
// POST /api/auth/lecturer/login
router.post('/login', loginLimiter, LecturerAuthController.login);

// POST /api/auth/lecturer/forgot-password
router.post('/forgot-password', LecturerAuthController.forgotPassword);

// ── Protected Routes (cần đăng nhập) ──────────────────────────────────────────
// POST /api/auth/lecturer/logout
router.post('/logout', requireLecturer, LecturerAuthController.logout);

// GET /api/auth/lecturer/me
router.get('/me', requireLecturer, LecturerAuthController.getMe);

// POST /api/auth/lecturer/change-password
router.post('/change-password', requireLecturer, LecturerAuthController.changePassword);

export default router;
