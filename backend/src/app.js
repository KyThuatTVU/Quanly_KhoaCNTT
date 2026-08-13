/**
 * src/app.js
 * Application entry point.
 * Wires together config, middleware, routes, and error handling.
 */
import express from 'express';
import cors    from 'cors';
import morgan  from 'morgan';

import config          from './config/index.js';
import adminRoutes     from './modules/admin/routes/admin.routes.js';
import { notFoundHandler, globalErrorHandler } from './common/errors/errorHandler.js';
import logger          from './logs/winston.js';

const app = express();

// ── CORS ──────────────────────────────────────────────────────────────────────
app.use(cors({
  origin: config.app.corsOrigin === '*'
    ? '*'
    : config.app.corsOrigin.split(','),
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ── Request logging ───────────────────────────────────────────────────────────
app.use(morgan('dev'));

// ── Body parsers ──────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/v1/admin', adminRoutes);

// Health-check
app.get('/', (_req, res) => {
  res.json({
    status: 'success',
    message: 'TVU Faculty of IT Management API Server is running.',
    timestamp: new Date().toISOString()
  });
});

// Prevent browsers from hitting the not-found handler for favicon requests.
app.get('/favicon.ico', (_req, res) => {
  res.sendStatus(204);
});

// ── Error Handling (must come LAST) ──────────────────────────────────────────
app.use(notFoundHandler);
app.use(globalErrorHandler);

// ── Start server ─────────────────────────────────────────────────────────────
app.listen(config.app.port, () => {
  logger.info(`🚀 Server dang chay tai http://localhost:${config.app.port}`);
  logger.info(`🔗 Admin API: http://localhost:${config.app.port}/api/v1/admin`);
});

export default app;
