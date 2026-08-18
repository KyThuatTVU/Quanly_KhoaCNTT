/**
 * src/modules/admin/routes/public.routes.js
 * Route definitions for public readable endpoints (no authentication required).
 * Allows the frontend portal to fetch data (GET only).
 */
import { Router }          from 'express';
import { AdminController } from '../controllers/admin.controller.js';

const router = Router();

// GET /api/v1/public/:entity -> read all records
router.get('/:entity', AdminController.getList);

export default router;
