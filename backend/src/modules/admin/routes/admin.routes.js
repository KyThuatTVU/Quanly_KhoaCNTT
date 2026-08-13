/**
 * src/modules/admin/routes/admin.routes.js
 * Route definitions for the Admin module.
 * Maps HTTP methods + URL patterns → Controller handlers.
 * Applies middleware (upload) where needed.
 */
import { Router }          from 'express';
import { AdminController } from '../controllers/admin.controller.js';
import { uploadSingle }    from '../../../middleware/upload.middleware.js';

const router = Router();

// ── File Upload ────────────────────────────────────────────────────────────────
// POST /api/v1/admin/upload
// Must be defined BEFORE the generic /:entity route to avoid capture conflict
router.post('/upload', uploadSingle, AdminController.uploadImage);

// ── Generic CRUD ──────────────────────────────────────────────────────────────
// GET    /api/v1/admin/:entity        → list all records
// POST   /api/v1/admin/:entity        → create a record
// PUT    /api/v1/admin/:entity/:id    → update a record
// DELETE /api/v1/admin/:entity/:id    → delete a record
router.get   ('/:entity',     AdminController.getList);
router.post  ('/:entity',     AdminController.createItem);
router.put   ('/:entity/:id', AdminController.updateItem);
router.delete('/:entity/:id', AdminController.deleteItem);

export default router;
