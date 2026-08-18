/**
 * src/app.js
 * Application entry point.
 * Wires together config, middleware, routes, and error handling.
 */
import express      from 'express';
import cors         from 'cors';
import morgan       from 'morgan';
import cookieParser from 'cookie-parser';
import session      from 'express-session';
import passport     from 'passport';
import MySQLStore   from 'express-mysql-session';

import config              from './config/index.js';
import { configurePassport } from './modules/auth/passport.config.js';
import adminAuthRoutes     from './modules/auth/routes/adminAuth.routes.js';
import lecturerAuthRoutes  from './modules/auth/routes/lecturerAuth.routes.js';
import lecturerRoutes      from './modules/lecturer/routes/lecturer.routes.js';
import adminRoutes         from './modules/admin/routes/admin.routes.js';
import publicRoutes        from './modules/admin/routes/public.routes.js';
import { requireAdmin }    from './modules/auth/middleware/requireAdmin.js';
import { notFoundHandler, globalErrorHandler } from './common/errors/errorHandler.js';
import logger              from './logs/winston.js';

const app = express();

// ── CORS ──────────────────────────────────────────────────────────────────────
app.use(cors({
  origin: config.app.corsOrigin === '*'
    ? true
    : config.app.corsOrigin.split(',').map(s => s.trim()),
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true  // Cần thiết cho cookie cross-origin
}));

// ── Request logging ───────────────────────────────────────────────────────────
app.use(morgan('dev'));

// ── Body parsers ──────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ── Session (cho Admin Google OAuth) ─────────────────────────────────────────
const SessionStore = MySQLStore(session);
const sessionStore = new SessionStore({
  host:            config.db.host,
  port:            config.db.port,
  user:            config.db.user,
  password:        config.db.password,
  database:        config.db.name,
  createDatabaseTable: true,
  schema: {
    tableName:          'sessions',
    columnNames: {
      session_id: 'session_id',
      expires:    'expires',
      data:       'data'
    }
  }
});

app.use(session({
  key:    'tvu.sid',
  secret: config.session.secret,
  store:  sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure:   false,                              // false cho dev (http)
    sameSite: config.app.env === 'production' ? 'lax' : false,  // false = cho phép cross-site trong dev
    maxAge:   config.session.maxAge
  }
}));

// ── Passport (Google OAuth) ───────────────────────────────────────────────────
configurePassport();
app.use(passport.initialize());
app.use(passport.session());

// ── Routes ────────────────────────────────────────────────────────────────────

// Auth routes (không cần login để truy cập)
app.use('/',                        adminAuthRoutes);
app.use('/api/auth/lecturer',       lecturerAuthRoutes);

// Lecturer profile routes (cần đăng nhập GV)
app.use('/api/lecturer',            lecturerRoutes);

// Public read routes (không cần login)
app.use('/api/v1/public',           publicRoutes);

// Admin CRUD routes (BẢO VỆ bởi requireAdmin middleware)
app.use('/api/v1/admin',            requireAdmin, adminRoutes);

// Health-check (public)
app.get('/', (_req, res) => {
  res.json({
    status:    'success',
    message:   'TVU Faculty of IT Management API Server is running.',
    timestamp: new Date().toISOString(),
    auth:      { admin: 'Google OAuth 2.0', lecturer: 'Email + JWT' }
  });
});

// Prevent browsers from hitting the not-found handler for favicon requests.
app.get('/favicon.ico', (_req, res) => res.sendStatus(204));

// ── Error Handling (must come LAST) ──────────────────────────────────────────
app.use(notFoundHandler);
app.use(globalErrorHandler);

// ── Start server ─────────────────────────────────────────────────────────────
app.listen(config.app.port, () => {
  logger.info(`🚀 Server dang chay tai http://localhost:${config.app.port}`);
  logger.info(`🔗 Admin API: http://localhost:${config.app.port}/api/v1/admin (Yêu cầu đăng nhập Admin)`);
  logger.info(`🔐 Admin Login: http://localhost:${config.app.port}/auth/google`);
  logger.info(`👨‍🏫 Lecturer Auth: http://localhost:${config.app.port}/api/auth/lecturer/login`);
});

export default app;
