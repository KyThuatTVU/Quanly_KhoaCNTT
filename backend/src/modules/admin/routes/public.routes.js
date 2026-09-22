/**
 * src/modules/admin/routes/public.routes.js
 * Route definitions for public readable endpoints (no authentication required).
 * Allows the frontend portal to fetch data (GET only).
 */
import { Router }               from 'express';
import { AdminController }      from '../controllers/admin.controller.js';
import { publicCacheMiddleware } from '../../../common/cache/memoryCache.js';

const router = Router();

// GET /api/v1/public/:entity -> read all records with 60s in-memory caching
router.get('/:entity', publicCacheMiddleware(60), AdminController.getList);

export default router;
