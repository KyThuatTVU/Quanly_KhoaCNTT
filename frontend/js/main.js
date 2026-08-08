import './components/navbar.js';
import './components/slider.js';
import './components/stats.js';
import './components/alumni.js';
import './components/news.js';
import './components/student.js';
import './components/infographic.js';
import './components/gallery.js';
import './components/footer.js';
import './components/overview.js';
import './components/timeline.js';
import './components/partner.js';
import './components/contact.js';
import './components/cooperateCta.js';
import './components/staff.js';
import './components/research.js';
import './components/curriculum.js';
import './components/postgraduate.js';

// Clean up URL to hide .html and index.html for a cleaner, professional look
try {
  const path = window.location.pathname;
  if (path.endsWith('/index.html')) {
    const cleanPath = path.substring(0, path.lastIndexOf('/index.html') + 1);
    window.history.replaceState(null, '', cleanPath + window.location.search + window.location.hash);
  } else if (path.endsWith('.html')) {
    const cleanPath = path.substring(0, path.length - 5);
    window.history.replaceState(null, '', cleanPath + window.location.search + window.location.hash);
  }
} catch (e) {
  console.warn('Không thể định dạng lại URL trong môi trường này:', e);
}

// Favicon Manager class to dynamically apply sit.jpg as favicon across all pages
class FaviconManager {
  static apply() {
    try {
      const folders = ['trang-chu', 'dai-hoc', 'gioi-thieu', 'nhan-su', 'nghien-cuu', 'sau-dai-hoc'];
      const currentPath = window.location.pathname;
      let prefix = './';

      for (const folder of folders) {
        if (currentPath.includes('/' + folder)) {
          prefix = '../';
          break;
        }
      }

      const faviconPath = `${prefix}assets/images/sit.jpg`;

      // Find or create favicon element in the document head
      let link = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.type = 'image/jpeg';
      link.href = faviconPath;
      console.log('Đã thiết lập logo trình duyệt (favicon):', faviconPath);
    } catch (e) {
      console.error('Lỗi khi thiết lập favicon:', e);
    }
  }
}

// Global application logic
document.addEventListener('DOMContentLoaded', () => {
  console.log('Ứng dụng Khoa CNTT TVU đã sẵn sàng.');
  FaviconManager.apply();
});
