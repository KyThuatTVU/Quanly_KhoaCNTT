/**
 * ==========================================================================
 * ADMIN CATEGORIZED SIDEBAR COMPONENT
 * ==========================================================================
 * Renders structured sidebar categories matching all public TVU FIT modules
 * and database tables cleanly. Uses modern monochrome SVG line icons.
 */

export const ADMIN_NAV_CATEGORIES = [
  {
    id: 'overview',
    title: 'TỔNG QUAN',
    items: [
      { key: 'dashboard', label: 'Bảng điều khiển Overview' }
    ]
  },
  {
    id: 'staff_module',
    title: 'NHÂN SỰ & GIẢNG VIÊN',
    items: [
      { key: 'staff', label: 'Cán bộ - Giảng viên' },
      { key: 'staffGroups', label: 'Nhóm Nhân sự' },
      { key: 'staffProfiles', label: 'Trang cá nhân chi tiết' },
      { key: 'staffResearch', label: 'Đề tài NCKH Cá nhân' },
      { key: 'staffPapers', label: 'Bài báo Khoa học Cá nhân' },
      { key: 'staffProjects', label: 'Dự án & Chuyển giao' },
      { key: 'staffBooks', label: 'Sách & Giáo trình' },
      { key: 'staffSupervisions', label: 'Hướng dẫn NCKH' }
    ]
  },
  {
    id: 'homepage_module',
    title: 'NỘI DUNG TRANG CHỦ',
    items: [
      { key: 'homepageHero', label: 'Banner Hero & Slogan' },
      { key: 'sliders', label: 'Carousel Slider Banners' },
      { key: 'homepageAdmissions', label: 'Box Tuyển sinh 2026' },
      { key: 'homepagePrograms', label: 'CTĐ nổi bật Trang chủ' },
      { key: 'infographics', label: 'Infographic A4 Items' },
      { key: 'homepageEvents', label: 'Ticker Sự kiện Tiêu điểm' },
      { key: 'stats', label: 'Số liệu Thống kê Counter' },
      { key: 'students', label: 'Sinh viên & Đội nhóm' },
      { key: 'alumni', label: 'Cựu sinh viên Tiêu biểu' },
      { key: 'homepageGallery', label: 'Slide Ảnh Hoạt động' }
    ]
  },
  {
    id: 'about_module',
    title: 'NỘI DUNG GIỚI THIỆU',
    items: [
      { key: 'aboutOverview', label: 'Tổng quan Khoa FIT' },
      { key: 'aboutHighlights', label: '3 Thẻ Highlight' },
      { key: 'timeline', label: '8 Mốc Lịch sử (Timeline)' },
      { key: 'aboutMission', label: 'Sứ mệnh & Tầm nhìn 2030' },
      { key: 'partners', label: 'Đối tác Hợp tác Quốc tế' },
      { key: 'aboutDeansContact', label: 'Liên hệ Ban Giám Khoa' },
      { key: 'aboutUnitContact', label: 'Thông tin Địa chỉ Đơn vị' }
    ]
  },
  {
    id: 'research_module',
    title: 'NGHIÊN CỨU KHOA HỌC',
    items: [
      { key: 'researchDirections', label: 'Hướng Nghiên cứu chính' },
      { key: 'researchProjects', label: 'Đề tài NCKH các cấp' },
      { key: 'researchPublications', label: 'Công bố Citrus BibTeX' },
      { key: 'researchLabs', label: 'Phòng Thí nghiệm CVIP' },
      { key: 'researchContacts', label: 'Đầu mối Liên hệ NC' }
    ]
  },
  {
    id: 'undergrad_module',
    title: 'ĐÀO TẠO ĐẠI HỌC',
    items: [
      { key: 'undergradPrograms', label: 'Ngành Đào tạo CNTT & AI' },
      { key: 'undergradMethods', label: 'Phương thức & Tổ hợp môn' },
      { key: 'undergradCurriculum', label: 'Lộ trình 3 Khối kiến thức' },
      { key: 'undergradPlos', label: 'Chuẩn đầu ra PLOs' },
      { key: 'undergradCareers', label: 'Vị trí việc làm & Nơi làm' },
      { key: 'undergradStudentStats', label: 'Thống kê SV theo Khóa' },
      { key: 'undergradCourses', label: 'Học phần Công nghệ cốt lõi' },
      { key: 'undergradFaqs', label: 'FAQ Câu hỏi thường gặp' }
    ]
  },
  {
    id: 'postgrad_module',
    title: 'ĐÀO TẠO SAU ĐẠI HỌC',
    items: [
      { key: 'postgradNotices', label: 'Thông báo Tuyển sinh Sau ĐH' },
      { key: 'postgradPhdStudents', label: 'Danh sách Nghiên cứu sinh' },
      { key: 'postgradStats', label: 'Thống kê Chartsy HV&NCS' }
    ]
  },
  {
    id: 'media_module',
    title: 'TIN TỨC & TRUYỀN THÔNG',
    items: [
      { key: 'news', label: 'Bài đăng Tin tức & Timeline' },
      { key: 'gallery', label: 'Thư viện ảnh chung Gallery' }
    ]
  },
  {
    id: 'system_module',
    title: 'HỆ THỐNG & QUẢN TRỊ',
    items: [
      { key: 'adminAccounts', label: 'Tài khoản Quản trị' },
      { key: 'apiMonitor', label: 'Trạng thái Hệ thống' },
      { key: 'userGuide', label: 'Hướng dẫn sử dụng' }
    ]
  }
];

import { AdminAuthService } from '../services/adminAuthService.js';

/**
 * Generates outline SVG elements matching Lucide specs dynamically per nav key
 */
function getNavIcon(key) {
  const base = '<svg class="sidebar-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">';
  
  let paths = '';
  switch (key) {
    case 'dashboard':
      paths = '<rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect>';
      break;
    case 'staff':
      paths = '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>';
      break;
    case 'staffGroups':
      paths = '<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>';
      break;
    case 'staffProfiles':
      paths = '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline>';
      break;
    case 'staffResearch':
    case 'researchProjects':
      paths = '<path d="M4.5 16.5c-1.5 1.26-2 2.5-2 3.5 0 1 .5 1.5 1.5 1.5h16c1 0 1.5-.5 1.5-1.5 0-1-.5-2.24-2-3.5"></path><path d="M12 2v10"></path><path d="M9 12h6"></path><path d="M12 12c-2 0-3 1.5-3 3.5s1 2.5 3 2.5 3-.5 3-2.5-1-3.5-3-3.5z"></path>';
      break;
    case 'staffPapers':
    case 'researchPublications':
      paths = '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>';
      break;
    case 'staffProjects':
      paths = '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>';
      break;
    case 'staffBooks':
      paths = '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path><line x1="8" y1="6" x2="16" y2="6"></line><line x1="8" y1="10" x2="16" y2="10"></line>';
      break;
    case 'staffSupervisions':
    case 'homepageAdmissions':
    case 'undergradPrograms':
    case 'postgradPhdStudents':
      paths = '<path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"></path>';
      break;
    case 'homepageHero':
    case 'sliders':
    case 'homepageGallery':
    case 'gallery':
      paths = '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline>';
      break;
    case 'homepagePrograms':
    case 'alumni':
      paths = '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>';
      break;
    case 'infographics':
    case 'stats':
    case 'postgradStats':
      paths = '<line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line>';
      break;
    case 'homepageEvents':
      paths = '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path>';
      break;
    case 'students':
      paths = '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>';
      break;
    case 'aboutOverview':
      paths = '<rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><line x1="9" y1="22" x2="9" y2="16"></line><line x1="15" y1="22" x2="15" y2="16"></line><line x1="9" y1="16" x2="15" y2="16"></line><path d="M9 6h6"></path><path d="M9 10h6"></path>';
      break;
    case 'aboutHighlights':
      paths = '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>';
      break;
    case 'timeline':
      paths = '<circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>';
      break;
    case 'aboutMission':
      paths = '<circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle>';
      break;
    case 'partners':
      paths = '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>';
      break;
    case 'aboutDeansContact':
    case 'aboutUnitContact':
    case 'researchContacts':
      paths = '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle>';
      break;
    case 'researchDirections':
      paths = '<path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>';
      break;
    case 'researchLabs':
      paths = '<rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line>';
      break;
    case 'undergradMethods':
      paths = '<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>';
      break;
    case 'undergradCurriculum':
      paths = '<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect><line x1="9" y1="12" x2="15" y2="12"></line><line x1="9" y1="16" x2="15" y2="16"></line><polyline points="9 8 10 8 11 8"></polyline>';
      break;
    case 'undergradPlos':
      paths = '<circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle>';
      break;
    case 'undergradCareers':
      paths = '<rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>';
      break;
    case 'undergradStudentStats':
      paths = '<line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line>';
      break;
    case 'undergradCourses':
      paths = '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>';
      break;
    case 'undergradFaqs':
      paths = '<circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line>';
      break;
    case 'postgradNotices':
      paths = '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path>';
      break;
    case 'news':
      paths = '<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2 3h12a2 2 0 0 1 2 2z"></path><path d="M12 11h6M12 15h6M6 11v4"></path>';
      break;
    case 'adminAccounts':
      paths = '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path>';
      break;
    case 'apiMonitor':
      paths = '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>';
      break;
    case 'userGuide':
      paths = '<circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line>';
      break;
    default:
      paths = '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line>';
  }
  
  return base + paths + '</svg>';
}

export function renderAdminSidebar(activeKey = 'dashboard') {
  const container = document.getElementById('adminSidebar');
  if (!container) return;

  let html = `
    <div class="sidebar-header">
      <img src="../assets/images/sit.jpg" alt="Logo" class="sidebar-logo" onerror="this.onerror=null; this.src='data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><circle cx=%2250%22 cy=%2250%22 r=%2245%22 fill=%22%23ffffff%22 stroke=%22%232563eb%22 stroke-width=%225%22/><text x=%2250%25%22 y=%2255%25%22 font-family=%22sans-serif%22 font-size=%2222%22 font-weight=%22bold%22 text-anchor=%22middle%22 fill=%22%232563eb%22>SIT</text></svg>'">
      <div>
        <div class="sidebar-brand-title">KHOA CNTT TVU</div>
        <div class="sidebar-brand-sub">SIT</div>
      </div>
      <button type="button" class="sidebar-close-btn" id="sidebarCloseBtn" aria-label="Close Sidebar">✕</button>
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
          <span class="nav-item-icon">${getNavIcon(item.key)}</span>
          <span>${item.label}</span>
        </a>
      `;
    });
    html += `</div>`;
  });

  html += `</nav>`;

  // Render profile at bottom if logged in
  if (AdminAuthService.isLoggedIn()) {
    const user = AdminAuthService.getCurrentUser();
    html += `
      <div class="sidebar-profile-card">
        <img src="${user.avatar_url || 'https://ui-avatars.com/api/?name=Admin'}" class="sidebar-profile-avatar" onerror="this.src='https://ui-avatars.com/api/?name=Admin&background=2563eb&color=fff'">
        <div class="sidebar-profile-info">
          <div class="sidebar-profile-name">${user.ho_ten}</div>
          <div class="sidebar-profile-role">${user.quyen_han}</div>
        </div>
        <button type="button" class="sidebar-logout-btn" id="sidebarLogoutBtn" title="Đăng xuất">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
        </button>
      </div>
    `;
  }

  container.innerHTML = html;

  // Auto-scroll the active menu item into view so that the sidebar's highlight state is immediately visible.
  const activeItem = container.querySelector('.nav-menu-item.active');
  if (activeItem) {
    activeItem.scrollIntoView({ block: 'center', behavior: 'auto' });
  }
}
