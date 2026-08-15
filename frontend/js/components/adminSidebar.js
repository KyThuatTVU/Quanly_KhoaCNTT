/**
 * ==========================================================================
 * ADMIN CATEGORIZED SIDEBAR COMPONENT
 * ==========================================================================
 * Renders structured sidebar categories matching all public TVU FIT modules
 * and database tables cleanly.
 */

export const ADMIN_NAV_CATEGORIES = [
  {
    id: 'overview',
    title: '📊 TỔNG QUAN',
    items: [
      { key: 'dashboard', label: 'Bảng điều khiển Overview', icon: '⚡' }
    ]
  },
  {
    id: 'staff_module',
    title: '👥 NHÂN SỰ & GIẢNG VIÊN',
    items: [
      { key: 'staff', label: 'Cán bộ - Giảng viên', icon: '👔' },
      { key: 'staffGroups', label: 'Nhóm Nhân sự', icon: '📂' },
      { key: 'staffProfiles', label: 'Trang cá nhân chi tiết', icon: '📝' },
      { key: 'staffResearch', label: 'Đề tài NCKH Cá nhân', icon: '📋' },
      { key: 'staffPapers', label: 'Bài báo Khoa học Cá nhân', icon: '📄' },
      { key: 'staffProjects', label: 'Dự án & Chuyển giao', icon: '🚀' },
      { key: 'staffBooks', label: 'Sách & Giáo trình', icon: '📚' },
      { key: 'staffSupervisions', label: 'Hướng dẫn NCKH', icon: '🎓' }
    ]
  },
  {
    id: 'homepage_module',
    title: '🏠 NỘI DUNG TRANG CHỦ',
    items: [
      { key: 'homepageHero', label: 'Banner Hero & Slogan', icon: '🖼️' },
      { key: 'sliders', label: 'Carousel Slider Banners', icon: '🎞️' },
      { key: 'homepageAdmissions', label: 'Box Tuyển sinh 2026', icon: '🎓' },
      { key: 'homepagePrograms', label: 'CTĐ nổi bật Trang chủ', icon: '⭐' },
      { key: 'infographics', label: 'Infographic A4 Items', icon: '📊' },
      { key: 'homepageEvents', label: 'Ticker Sự kiện Tiêu điểm', icon: '🔔' },
      { key: 'stats', label: 'Số liệu Thống kê Counter', icon: '📈' },
      { key: 'students', label: 'Sinh viên & Đội nhóm', icon: '🏆' },
      { key: 'alumni', label: 'Cựu sinh viên Tiêu biểu', icon: '🌟' },
      { key: 'homepageGallery', label: 'Slide Ảnh Hoạt động', icon: '📷' }
    ]
  },
  {
    id: 'about_module',
    title: 'ℹ️ NỘI DUNG GIỚI THIỆU',
    items: [
      { key: 'aboutOverview', label: 'Tổng quan Khoa FIT', icon: '🏢' },
      { key: 'aboutHighlights', label: '3 Thẻ Highlight', icon: '✨' },
      { key: 'timeline', label: '8 Mốc Lịch sử (Timeline)', icon: '⏳' },
      { key: 'aboutMission', label: 'Sứ mệnh & Tầm nhìn 2030', icon: '🎯' },
      { key: 'partners', label: 'Đối tác Hợp tác Quốc tế', icon: '🤝' },
      { key: 'aboutDeansContact', label: 'Liên hệ Ban Giám Khoa', icon: '🎴' },
      { key: 'aboutUnitContact', label: 'Thông tin Địa chỉ Đơn vị', icon: '📍' }
    ]
  },
  {
    id: 'research_module',
    title: '🔬 NGHIÊN CỨU KHOA HỌC',
    items: [
      { key: 'researchDirections', label: 'Hướng Nghiên cứu chính', icon: '💡' },
      { key: 'researchProjects', label: 'Đề tài NCKH các cấp', icon: '🔬' },
      { key: 'researchPublications', label: 'Công bố Citrus BibTeX', icon: '📑' },
      { key: 'researchLabs', label: 'Phòng Thí nghiệm CVIP', icon: '🖥️' },
      { key: 'researchContacts', label: 'Đầu mối Liên hệ NC', icon: '✉️' }
    ]
  },
  {
    id: 'undergrad_module',
    title: '🎓 ĐÀO TẠO ĐẠI HỌC',
    items: [
      { key: 'undergradPrograms', label: 'Ngành Đào tạo CNTT & AI', icon: '💻' },
      { key: 'undergradMethods', label: 'Phương thức & Tổ hợp môn', icon: '📌' },
      { key: 'undergradCurriculum', label: 'Lộ trình 3 Khối kiến thức', icon: '📑' },
      { key: 'undergradPlos', label: 'Chuẩn đầu ra PLOs', icon: '🎯' },
      { key: 'undergradCourses', label: 'Học phần Công nghệ cốt lõi', icon: '📖' },
      { key: 'undergradFaqs', label: 'FAQ Câu hỏi thường gặp', icon: '❓' }
    ]
  },
  {
    id: 'postgrad_module',
    title: '📚 ĐÀO TẠO SAU ĐẠI HỌC',
    items: [
      { key: 'postgradNotices', label: 'Thông báo Tuyển sinh Sau ĐH', icon: '📢' },
      { key: 'postgradPhdStudents', label: 'Danh sách Nghiên cứu sinh', icon: '👨‍🎓' },
      { key: 'postgradStats', label: 'Thống kê Chartsy HV&NCS', icon: '📊' }
    ]
  },
  {
    id: 'media_module',
    title: '📰 TIN TỨC & TRUYỀN THÔNG',
    items: [
      { key: 'news', label: 'Bài đăng Tin tức & Timeline', icon: '📰' },
      { key: 'gallery', label: 'Thư viện ảnh chung Gallery', icon: '🖼️' }
    ]
  },
  {
    id: 'system_module',
    title: '⚙️ HỆ THỐNG & QUẢN TRỊ',
    items: [
      { key: 'adminAccounts', label: 'Tài khoản Quản trị', icon: '🔑' },
      { key: 'apiMonitor', label: 'Trạng thái Hệ thống', icon: '⚙️' }
    ]
  }
];

export function renderAdminSidebar(activeKey = 'dashboard') {
  const container = document.getElementById('adminSidebar');
  if (!container) return;

  let html = `
    <div class="sidebar-header">
      <img src="./assets/images/sit.jpg" alt="Logo" class="sidebar-logo" onerror="this.onerror=null; this.src='data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><circle cx=%2250%22 cy=%2250%22 r=%2245%22 fill=%22%23ffffff%22 stroke=%22%232563eb%22 stroke-width=%225%22/><text x=%2250%25%22 y=%2255%25%22 font-family=%22sans-serif%22 font-size=%2222%22 font-weight=%22bold%22 text-anchor=%22middle%22 fill=%22%232563eb%22>SIT</text></svg>'">
      <div>
        <div class="sidebar-brand-title">KHOA CNTT TVU</div>
        <div class="sidebar-brand-sub">SIT</div>
      </div>
    </div>
    <nav class="sidebar-nav">
  `;

  ADMIN_NAV_CATEGORIES.forEach(cat => {
    html += `
      <div class="nav-category-group">
        <div class="nav-category-title">${cat.title}</div>
    `;
    cat.items.forEach(item => {
      const isActive = item.key === activeKey ? 'active' : '';
      html += `
        <a class="nav-menu-item ${isActive}" data-nav="${item.key}">
          <span class="nav-item-icon">${item.icon}</span>
          <span>${item.label}</span>
        </a>
      `;
    });
    html += `</div>`;
  });

  html += `</nav>`;
  container.innerHTML = html;
}
