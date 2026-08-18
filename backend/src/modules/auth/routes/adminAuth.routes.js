/**
 * src/modules/auth/routes/adminAuth.routes.js
 * Routes cho Admin authentication (Google OAuth)
 */
import { Router }              from 'express';
import passport                from 'passport';
import { AdminAuthController } from '../controllers/adminAuth.controller.js';
import { requireAdmin }        from '../middleware/requireAdmin.js';

const router = Router();

// ── Google OAuth Flow ──────────────────────────────────────────────────────────
// GET /auth/google → Redirect đến Google
router.get('/auth/google', AdminAuthController.initiateGoogleAuth);

// GET /auth/google/callback → Google xác thực xong gọi về đây
router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/google/failed' }),
  AdminAuthController.googleCallback
);

// GET /auth/google/failed → Tài khoản không có quyền
router.get('/auth/google/failed', AdminAuthController.handleAuthError);

// ── Admin API ──────────────────────────────────────────────────────────────────
// GET  /api/auth/admin/me
router.get('/api/auth/admin/me', AdminAuthController.getMe);

// POST /api/auth/admin/logout
router.post('/api/auth/admin/logout', requireAdmin, AdminAuthController.logout);

export default router;
