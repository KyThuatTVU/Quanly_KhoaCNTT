/**
 * src/database/index.js
 * MySQL2 connection pool — the single source of truth for DB access.
 * All repositories import this pool; no other file touches mysql2 directly.
 */
import mysql from 'mysql2/promise';
import config from '../config/index.js';

const pool = mysql.createPool({
  host:             config.db.host,
  port:             config.db.port,
  user:             config.db.user,
  password:         config.db.password,
  database:         config.db.name,
  waitForConnections: true,
  connectionLimit:  config.db.connectionLimit,
  queueLimit:       0,
  charset:          'utf8mb4'
});

// Verify connectivity on startup
(async () => {
  try {
    const conn = await pool.getConnection();
    console.log('✅ Kết nối MySQL thành công!');
    conn.release();
  } catch (err) {
    console.error('❌ Lỗi kết nối MySQL:', err.message);
    console.warn('⚠️  Kiểm tra MySQL đang chạy và thông tin trong .env đúng.');
  }
})();

export default pool;
