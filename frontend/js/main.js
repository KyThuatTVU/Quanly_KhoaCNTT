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

// Global application logic can be placed here
document.addEventListener('DOMContentLoaded', () => {
  console.log('Ứng dụng Khoa CNTT TVU đã sẵn sàng.');
});
