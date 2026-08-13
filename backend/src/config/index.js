/**
 * src/config/index.js
 * App-level configuration loaded from environment variables.
 */
import dotenv from 'dotenv';
dotenv.config();

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
  upload: {
    maxSizeBytes: 5 * 1024 * 1024, // 5 MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  }
};

export default config;
