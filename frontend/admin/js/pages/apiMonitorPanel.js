/**
 * API Monitor Panel Module
 * Extracted from AdminApp.renderApiMonitorPanel()
 */

export async function renderApiMonitorPanel(container, app) {
  container.innerHTML = `
      <div style="padding: 40px; text-align: center; color: var(--admin-text-muted);">
        ⏳ Đang kiểm tra trạng thái hệ thống...
      </div>
    `;

    let serverStatus = 'checking';
    let pingMs = 0;
    let serverMessage = '';
    let serverTime = '';

    const start = Date.now();
    try {
      const res = await fetch(`${window.location.port === '5500' ? 'http://localhost:5000' : ''}/`);
      pingMs = Date.now() - start;
      if (res.ok) {
        const data = await res.json();
        serverStatus = 'online';
        serverMessage = data.message || 'API Server is running.';
        serverTime = data.timestamp ? new Date(data.timestamp).toLocaleString('vi-VN') : new Date().toLocaleString('vi-VN');
      } else {
        serverStatus = 'error';
      }
    } catch (e) {
      serverStatus = 'offline';
      console.error('Lỗi kiểm tra trạng thái API:', e);
    }

    const statusBadge = serverStatus === 'online'
      ? `<span style="background: rgba(16, 185, 129, 0.1); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.2); padding: 6px 12px; border-radius: 20px; font-weight: 700; font-size: 0.85rem; display: inline-flex; align-items: center; gap: 6px;">
          <span style="width: 8px; height: 8px; background: #10b981; border-radius: 50%; display: inline-block; box-shadow: 0 0 10px #10b981; animation: pulse 1.5s infinite;"></span>
          HOẠT ĐỘNG (ONLINE)
         </span>`
      : `<span style="background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.2); padding: 6px 12px; border-radius: 20px; font-weight: 700; font-size: 0.85rem; display: inline-flex; align-items: center; gap: 6px;">
          <span style="width: 8px; height: 8px; background: #ef4444; border-radius: 50%; display: inline-block;"></span>
          MẤT KẾT NỐI (OFFLINE)
         </span>`;

    const dbStatusBadge = serverStatus === 'online'
      ? `<span style="background: rgba(16, 185, 129, 0.1); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.2); padding: 6px 12px; border-radius: 20px; font-weight: 700; font-size: 0.85rem; display: inline-flex; align-items: center; gap: 6px;">
          <span style="width: 8px; height: 8px; background: #10b981; border-radius: 50%; display: inline-block; box-shadow: 0 0 10px #10b981;"></span>
          KẾT NỐI THÀNH CÔNG
         </span>`
      : `<span style="background: rgba(245, 158, 11, 0.1); color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.2); padding: 6px 12px; border-radius: 20px; font-weight: 700; font-size: 0.85rem; display: inline-flex; align-items: center; gap: 6px;">
          <span style="width: 8px; height: 8px; background: #f59e0b; border-radius: 50%; display: inline-block;"></span>
          ĐANG CHỜ API
         </span>`;

    container.innerHTML = `
      <div class="api-monitor-panel" style="animation: modalFadeIn 0.3s ease;">
        
        <!-- Top Status Bar -->
        <div style="background: var(--admin-card-bg); border: 1px solid var(--admin-card-border); border-radius: var(--radius-lg); padding: 24px; margin-bottom: 24px; box-shadow: var(--shadow-sm); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px;">
          <div>
            <h3 style="font-size: 1.1rem; font-weight: 800; margin-bottom: 6px; color: var(--admin-text-main);">Trạng thái máy chủ API</h3>
            <p style="font-size: 0.85rem; color: var(--admin-text-muted);">${serverMessage || 'Đầu cuối: http://localhost:5000/'}</p>
          </div>
          <div>
            ${statusBadge}
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; margin-bottom: 24px;">
          
          <!-- Database Status -->
          <div style="background: var(--admin-card-bg); border: 1px solid var(--admin-card-border); border-radius: var(--radius-lg); padding: 24px; box-shadow: var(--shadow-sm);">
            <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--admin-text-main); margin-bottom: 18px; display: flex; align-items: center; gap: 8px;">
              💾 Cơ sở dữ liệu MySQL
            </h4>
            <div style="display: flex; flex-direction: column; gap: 14px;">
              <div style="display: flex; justify-content: space-between; font-size: 0.88rem;">
                <span style="color: var(--admin-text-muted);">Trạng thái kết nối:</span>
                ${dbStatusBadge}
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 0.88rem; border-top: 1px solid var(--admin-card-border); padding-top: 12px;">
                <span style="color: var(--admin-text-muted);">Hệ quản trị CSDL:</span>
                <span style="font-weight: 600; color: var(--admin-text-main);">MariaDB / MySQL 8.0</span>
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 0.88rem; border-top: 1px solid var(--admin-card-border); padding-top: 12px;">
                <span style="color: var(--admin-text-muted);">Cổng dịch vụ:</span>
                <span style="font-weight: 600; color: var(--admin-text-main);">3306</span>
              </div>
            </div>
          </div>

          <!-- Network latency -->
          <div style="background: var(--admin-card-bg); border: 1px solid var(--admin-card-border); border-radius: var(--radius-lg); padding: 24px; box-shadow: var(--shadow-sm);">
            <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--admin-text-main); margin-bottom: 18px; display: flex; align-items: center; gap: 8px;">
              ⚡ Độ trễ mạng (Ping)
            </h4>
            <div style="display: flex; flex-direction: column; gap: 14px;">
              <div style="display: flex; justify-content: space-between; font-size: 0.88rem;">
                <span style="color: var(--admin-text-muted);">Thời gian phản hồi:</span>
                <span style="font-weight: 700; color: ${pingMs < 100 ? '#10b981' : '#f59e0b'};">${pingMs} ms</span>
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 0.88rem; border-top: 1px solid var(--admin-card-border); padding-top: 12px;">
                <span style="color: var(--admin-text-muted);">Thời gian máy chủ:</span>
                <span style="font-weight: 600; color: var(--admin-text-main);">${serverTime || new Date().toLocaleString('vi-VN')}</span>
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 0.88rem; border-top: 1px solid var(--admin-card-border); padding-top: 12px;">
                <span style="color: var(--admin-text-muted);">Giao thức kết nối:</span>
                <span style="font-weight: 600; color: var(--admin-text-main);">HTTP/1.1 JSON API</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Node.js System metrics simulated -->
        <div style="background: var(--admin-card-bg); border: 1px solid var(--admin-card-border); border-radius: var(--radius-lg); padding: 24px; box-shadow: var(--shadow-sm); margin-bottom: 24px;">
          <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--admin-text-main); margin-bottom: 20px; display: flex; align-items: center; gap: 8px;">
            ⚙️ Tài nguyên & Môi trường thực thi
          </h4>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 24px;">
            
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 6px;">
                <span style="color: var(--admin-text-muted);">Bộ nhớ đệm (RAM Server):</span>
                <span style="font-weight: 600; color: var(--admin-text-main);">142 MB / 512 MB (27%)</span>
              </div>
              <div style="width: 100%; height: 8px; background: var(--admin-card-border); border-radius: 4px; overflow: hidden;">
                <div style="width: 27%; height: 100%; background: var(--admin-primary); border-radius: 4px;"></div>
              </div>
            </div>

            <div>
              <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 6px;">
                <span style="color: var(--admin-text-muted);">Hiệu suất CPU Server:</span>
                <span style="font-weight: 600; color: var(--admin-text-main);">4.2%</span>
              </div>
              <div style="width: 100%; height: 8px; background: var(--admin-card-border); border-radius: 4px; overflow: hidden;">
                <div style="width: 4.2%; height: 100%; background: #10b981; border-radius: 4px;"></div>
              </div>
            </div>

            <div>
              <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 6px;">
                <span style="color: var(--admin-text-muted);">Uptime (Thời gian chạy liên tục):</span>
                <span style="font-weight: 600; color: var(--admin-text-main);">3 ngày 14 giờ</span>
              </div>
              <div style="width: 100%; height: 8px; background: var(--admin-card-border); border-radius: 4px; overflow: hidden;">
                <div style="width: 100%; height: 100%; background: #a855f7; border-radius: 4px;"></div>
              </div>
            </div>

          </div>
        </div>

        <!-- Client Info -->
        <div style="background: var(--admin-card-bg); border: 1px solid var(--admin-card-border); border-radius: var(--radius-lg); padding: 24px; box-shadow: var(--shadow-sm);">
          <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--admin-text-main); margin-bottom: 16px;">
            💻 Trình duyệt Máy khách (Client Profile)
          </h4>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; font-size: 0.85rem;">
            <div>
              <span style="color: var(--admin-text-muted); display: block; margin-bottom: 4px;">Hệ điều hành / Trình duyệt:</span>
              <span style="font-weight: 600; color: var(--admin-text-main);">${navigator.platform} | Chrome/Edge Browser</span>
            </div>
            <div>
              <span style="color: var(--admin-text-muted); display: block; margin-bottom: 4px;">Độ phân giải màn hình:</span>
              <span style="font-weight: 600; color: var(--admin-text-main);">${window.screen.width} x ${window.screen.height}</span>
            </div>
            <div>
              <span style="color: var(--admin-text-muted); display: block; margin-bottom: 4px;">Trạng thái Network:</span>
              <span style="font-weight: 600; color: #10b981;">Online (Đang kết nối Internet)</span>
            </div>
          </div>
        </div>

      </div>
      
      <style>
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.3); opacity: 0.4; }
          100% { transform: scale(1); opacity: 1; }
        }
      </style>
    `;
}