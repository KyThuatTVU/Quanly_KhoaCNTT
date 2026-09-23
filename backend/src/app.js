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
import rateLimit    from 'express-rate-limit';

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

// Tin tưởng proxy (Nginx) để lấy đúng IP và Hostname của client
app.set('trust proxy', true);

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

// ── Body parsers (Giới hạn dung lượng 100KB chống flood RAM) ─────────────────
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));
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

// ── Anti-DDoS & Anti-Brute-Force Rate Limiters ─────────────────────────────
// 1. Auth Rate Limiter (Chống dò mật khẩu Brute Force: tối đa 15 req/phút/IP)
const authApiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Phát hiện quá nhiều yêu cầu đăng nhập từ thiết bị của bạn. Vui lòng chờ 1 phút trước khi thử lại.'
  }
});

// 2. Public API Rate Limiter (Tối đa 300 req/phút/IP cho phép F5/reload nhiều tab mượt mà, chống Bot DDoS)
const publicApiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Phát hiện tần suất truy cập cao bất thường từ IP của bạn. Yêu cầu tạm ngắt trong 1 phút để bảo vệ máy chủ.'
  }
});

// ── Routes ────────────────────────────────────────────────────────────────────

// Auth routes (được bảo vệ bởi authApiLimiter)
app.use('/',                        authApiLimiter, adminAuthRoutes);
app.use('/api/auth/lecturer',       authApiLimiter, lecturerAuthRoutes);

// Lecturer profile routes (cần đăng nhập GV)
app.use('/api/lecturer',            lecturerRoutes);

// Public read routes (không cần login, bảo vệ bởi cache 60s và publicApiLimiter)
app.use('/api/v1/public',           publicApiLimiter, publicRoutes);

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

// ── Start server & Configure HTTP Socket Timeouts ────────────────────────────
const server = app.listen(config.app.port, () => {
  logger.info(`🚀 Server dang chay tai http://localhost:${config.app.port}`);
  logger.info(`🔗 Admin API: http://localhost:${config.app.port}/api/v1/admin (Yêu cầu đăng nhập Admin)`);
  logger.info(`🔐 Admin Login: http://localhost:${config.app.port}/auth/google`);
  logger.info(`👨‍🏫 Lecturer Auth: http://localhost:${config.app.port}/api/auth/lecturer/login`);
});

// Chống treo socket / request ngâm lâu quá 10 giây (Tự động ngắt kết nối giải phóng bộ nhớ)
server.requestTimeout = 10000;   // Max 10s per HTTP request
server.headersTimeout = 12000;   // Max 12s header parse
server.keepAliveTimeout = 15000; // Max 15s keep-alive socket

export default app;
