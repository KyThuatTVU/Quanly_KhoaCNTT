/**
 * src/config/index.js
 * App-level configuration loaded from environment variables.
 */
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const config = {
  app: {
    port: parseInt(process.env.PORT || '5000', 10),
    env: process.env.NODE_ENV || 'development',
    corsOrigin: process.env.CORS_ORIGIN || '*'
  },
  db: {
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    name: process.env.DB_NAME || 'quanly_khoacntt_tvu',
    connectionLimit: 10
  },
  session: {
    secret: process.env.SESSION_SECRET || 'dev-session-secret',
    maxAge: 24 * 60 * 60 * 1000 // 24 giờ
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'dev-jwt-secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '8h'
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackUrl: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/auth/google/callback'
  },
  frontend: {
    adminDashboard: process.env.ADMIN_DASHBOARD_URL || 'http://127.0.0.1:5500/frontend/admin/index.html',
    adminLogin:     process.env.ADMIN_LOGIN_URL     || 'http://127.0.0.1:5500/frontend/admin-login.html',
    lecturerDashboard: process.env.LECTURER_DASHBOARD_URL || 'http://127.0.0.1:5500/frontend/lecturer/dashboard.html'
  },
  upload: {
    maxSizeBytes: 5 * 1024 * 1024, // 5 MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  }
};

export default config;
