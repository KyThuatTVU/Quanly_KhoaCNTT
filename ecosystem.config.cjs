/**
 * ecosystem.config.cjs
 * Cấu hình PM2 Cluster Mode cho Backend FIT-TVU
 * 
 * Lệnh chạy trên VPS:
 *   pm2 start ecosystem.config.cjs
 *   pm2 save
 *   pm2 startup
 */
module.exports = {
  apps: [
    {
      name: 'fit-tvu-backend',
      cwd: './backend',
      script: 'src/app.js',
      instances: 'max',       // Tự động scale tương ứng với tất cả các core CPU của máy chủ
      exec_mode: 'cluster',    // Chế độ Load Balancer đa tiến trình nội bộ
      autorestart: true,
      watch: false,
      max_memory_restart: '500M', // Khởi động lại nếu worker chiếm dụng quá 500MB RAM
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      }
    }
  ]
};
