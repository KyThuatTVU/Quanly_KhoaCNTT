/**
 * Dashboard Panel Module
 * Extracted from AdminApp.renderDashboardPanel()
 */

export function renderDashboardPanel(container, app) {
  container.innerHTML = `
    <div class="dashboard-panel">
      <div class="stats-cards-grid">
        <div class="stat-card">
          <div class="stat-icon-wrapper">👔</div>
          <div>
            <div class="stat-val">38+</div>
            <div class="stat-lbl">Giảng viên & Cán bộ</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon-wrapper">📰</div>
          <div>
            <div class="stat-val">120+</div>
            <div class="stat-lbl">Bài đăng Tin tức & Sự kiện</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon-wrapper">🔬</div>
          <div>
            <div class="stat-val">45+</div>
            <div class="stat-lbl">Đề tài NCKH & Công bố</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon-wrapper">🎓</div>
          <div>
            <div class="stat-val">1,500+</div>
            <div class="stat-lbl">Sinh viên & NCS Khoa</div>
          </div>
        </div>
      </div>

      <div class="table-card" style="padding: 24px;">
        <h3 style="font-size:1.15rem; font-weight:700; margin-bottom:16px; display:flex; align-items:center; gap:8px;">
          <span>📌</span> Phím Tắt Quản Lý Nhanh Các Trang Người Dùng Xem
        </h3>
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:16px;">
          
          <div style="background:rgba(255,255,255,0.04); padding:16px; border-radius:12px; border:1px solid var(--admin-card-border);">
            <div style="font-weight:700; color:var(--admin-accent); margin-bottom:6px;">🏠 Trang Chủ (Home Page)</div>
            <p style="font-size:0.82rem; color:var(--admin-text-muted); margin-bottom:12px;">Quản lý Slogan, Banner Hero, Box Tuyển sinh 2026, 4 Thẻ Đào tạo, Infographics, Ticker, Stats counter & Sliders.</p>
            <button type="button" class="btn-secondary" onclick="document.querySelector('[data-nav=\\'homepageHero\\']').click()" style="font-size:0.8rem; padding:6px 12px;">Quản lý Trang chủ →</button>
          </div>

          <div style="background:rgba(255,255,255,0.04); padding:16px; border-radius:12px; border:1px solid var(--admin-card-border);">
            <div style="font-weight:700; color:var(--admin-accent); margin-bottom:6px;">ℹ️ Trang Giới Thiệu (About Page)</div>
            <p style="font-size:0.82rem; color:var(--admin-text-muted); margin-bottom:12px;">Quản lý Văn bản giới thiệu tổng quan, 3 Thẻ Highlights, 8 Mốc Lịch sử Timeline, Sứ mệnh Tầm nhìn & Đối tác Quốc tế.</p>
            <button type="button" class="btn-secondary" onclick="document.querySelector('[data-nav=\\'aboutOverview\\']').click()" style="font-size:0.8rem; padding:6px 12px;">Quản lý Trang Giới thiệu →</button>
          </div>

          <div style="background:rgba(255,255,255,0.04); padding:16px; border-radius:12px; border:1px solid var(--admin-card-border);">
            <div style="font-weight:700; color:var(--admin-accent); margin-bottom:6px;">👥 Trang Nhân Sự (Staff Directory)</div>
            <p style="font-size:0.82rem; color:var(--admin-text-muted); margin-bottom:12px;">Quản lý Danh sách Giảng viên, Thẻ Ban Lãnh đạo, Học hàm học vị, Hồ sơ cá nhân (Đề tài, Bài báo, Sách, Hướng dẫn).</p>
            <button type="button" class="btn-secondary" onclick="document.querySelector('[data-nav=\\'staff\\']').click()" style="font-size:0.8rem; padding:6px 12px;">Quản lý Trang Nhân sự →</button>
          </div>

          <div style="background:rgba(255,255,255,0.04); padding:16px; border-radius:12px; border:1px solid var(--admin-card-border);">
            <div style="font-weight:700; color:var(--admin-accent); margin-bottom:6px;">🔬 Trang Nghiên Cứu (Research Page)</div>
            <p style="font-size:0.82rem; color:var(--admin-text-muted); margin-bottom:12px;">Quản lý Hướng nghiên cứu chính, Đề tài NCKH các cấp, Danh mục Bài báo Citrus BibTeX, Phòng thí nghiệm CVIP.</p>
            <button type="button" class="btn-secondary" onclick="document.querySelector('[data-nav=\\'researchProjects\\']').click()" style="font-size:0.8rem; padding:6px 12px;">Quản lý Trang Nghiên cứu →</button>
          </div>

          <div style="background:rgba(255,255,255,0.04); padding:16px; border-radius:12px; border:1px solid var(--admin-card-border);">
            <div style="font-weight:700; color:var(--admin-accent); margin-bottom:6px;">🎓 Trang Đào Tạo Đại Học</div>
            <p style="font-size:0.82rem; color:var(--admin-text-muted); margin-bottom:12px;">Quản lý Ngành CNTT & AI, Phương thức xét tuyển, Lộ trình 3 khối kiến thức, Chuẩn đầu ra PLOs & FAQ.</p>
            <button type="button" class="btn-secondary" onclick="document.querySelector('[data-nav=\\'undergradPrograms\\']').click()" style="font-size:0.8rem; padding:6px 12px;">Quản lý Đào tạo Đại học →</button>
          </div>

          <div style="background:rgba(255,255,255,0.04); padding:16px; border-radius:12px; border:1px solid var(--admin-card-border);">
            <div style="font-weight:700; color:var(--admin-accent); margin-bottom:6px;">📚 Trang Sau Đại Học</div>
            <p style="font-size:0.82rem; color:var(--admin-text-muted); margin-bottom:12px;">Quản lý Thông báo Tuyển sinh Tiến sĩ/Thạc sĩ 2026, Danh sách 7 Nghiên cứu sinh Tiến sĩ KHMT & Thống kê Chartsy.</p>
            <button type="button" class="btn-secondary" onclick="document.querySelector('[data-nav=\\'postgradPhdStudents\\']').click()" style="font-size:0.8rem; padding:6px 12px;">Quản lý Sau Đại học →</button>
          </div>

        </div>
      </div>

      <div class="table-card" style="padding: 24px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
          <h3 style="font-size:1.1rem; font-weight:700;">⚙️ Trạng thái Hệ thống</h3>
          <span class="badge-status success">Hệ thống Đang Hoạt động</span>
        </div>
        <p style="color:var(--admin-text-muted); font-size:0.9rem; line-height:1.6;">
          Hệ thống quản lý dữ liệu website Khoa Công nghệ thông tin - Trường Đại học Trà Vinh. Người quản trị có thể thay đổi, cập nhật các danh mục bài viết, nhân sự và thông tin đào tạo hiển thị trực tiếp trên trang chủ.
        </p>
      </div>

    </div>
  `;
}
