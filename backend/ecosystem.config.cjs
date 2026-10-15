/**
 * backend/ecosystem.config.cjs
 * Cấu hình PM2 Cluster Mode khi chạy trực tiếp từ thư mục backend/
 */
module.exports = {
  apps: [
    {
      name: 'fit-tvu-backend',
      script: 'src/app.js',
      instances: 'max',       // Tự động scale tương ứng với tất cả các core CPU của máy chủ
      exec_mode: 'cluster',    // Chế độ Load Balancer đa tiến trình nội bộ
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      }
    }
  ]
};
