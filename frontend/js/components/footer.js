/**
 * ==========================================================================
 * FOOTER WEB COMPONENT
 * ==========================================================================
 * A reusable, native web component for the Faculty of Information Technology footer.
 * Dynamically resolves link prefixes based on current path to prevent broken links.
 */

class FooterComponent extends HTMLElement {
  constructor() {
    super();
    this.assetPrefix = './'; // Renamed to avoid DOM conflict with Element.prefix
  }

  connectedCallback() {
    this.resolveAssetPrefix();
    this.render();
  }

  /**
   * Resolve relative prefix path based on the current page's location
   */
  resolveAssetPrefix() {
    const folders = ['home', 'undergraduate', 'about', 'staff', 'research', 'postgraduate'];
    const currentPath = window.location.pathname;
    this.assetPrefix = './';

    for (const folder of folders) {
      if (currentPath.includes('/' + folder)) {
        this.assetPrefix = '../';
        break;
      }
    }
  }

  /**
   * Render the HTML structure of the footer
   */
  render() {
    const logoPath = `${this.assetPrefix}assets/images/sit.jpg`;
    const homeLink = `${this.assetPrefix}home/`;
    const gioiThieuLink = `${this.assetPrefix}about/`;
    const nhanSuLink = `${this.assetPrefix}staff/`;
    const nghienCuuLink = `${this.assetPrefix}research/`;
    const daiHocLink = `${this.assetPrefix}undergraduate/`;
    const sauDaiHocLink = `${this.assetPrefix}postgraduate/`;

    this.innerHTML = `
      <footer class="main-footer">
        <div class="footer-container">
          
          <!-- Column 1: Brand Info -->
          <div class="footer-col brand-col">
            <div class="footer-logo-row">
              <div class="footer-logo-container">
                <img src="${logoPath}" alt="FIT Logo" class="footer-logo" onerror="this.onerror=null; this.src='data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><circle cx=%2250%22 cy=%2250%22 r=%2245%22 fill=%22%23ffffff%22 stroke=%22%230f6fff%22 stroke-width=%225%22/><text x=%2250%25%22 y=%2255%25%22 font-family=%22sans-serif%22 font-size=%2222%22 font-weight=%22bold%22 text-anchor=%22middle%22 fill=%22%230f6fff%22>SIT</text></svg>'">
              </div>
              <div class="footer-brand-text">
                <h3 class="footer-brand-title">KHOA CÔNG NGHỆ THÔNG TIN</h3>
                <h4 class="footer-brand-subtitle">Trường Đại học Trà Vinh</h4>
              </div>
            </div>
            <p class="footer-brand-desc">
              Đào tạo nguồn nhân lực công nghệ thông tin chất lượng cao, nghiên cứu khoa học chuyên sâu và chuyển giao công nghệ tiên tiến phục vụ sự phát triển của cộng đồng.
            </p>
          </div>

          <!-- Column 2: Quick Links -->
          <div class="footer-col links-col">
            <h3 class="footer-col-title">Liên Kết Nhanh</h3>
            <ul class="footer-links">
              <li><a href="${homeLink}">Trang Chủ</a></li>
              <li><a href="${gioiThieuLink}">Giới Thiệu</a></li>
              <li><a href="${nhanSuLink}">Đội Ngũ Nhân Sự</a></li>
              <li><a href="${nghienCuuLink}">Nghiên Cứu Khoa Học</a></li>
              <li><a href="${daiHocLink}">Đại Học</a></li>
              <li><a href="${sauDaiHocLink}">Sau Đại Học</a></li>
              
          </div>

          <!-- Column 3: Contact Details -->
          <div class="footer-col contact-col">
            <h3 class="footer-col-title">Thông Tin Liên Hệ</h3>
            <ul class="footer-contact">
              <li>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="contact-icon">
                  <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>Số 126 Nguyễn Thiện Thành, Phường 5, Thành phố Trà Vinh, Tỉnh Trà Vinh.</span>
              </li>
              <li>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="contact-icon">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                <span>Điện thoại: (+84) 294 3855 246</span>
              </li>
              <li>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="contact-icon">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <span>Email: CNTT@tvu.edu.vn</span>
              </li>
            </ul>
          </div>
          
        </div>

        <!-- Copyright Bar -->
        <div class="footer-bottom">
          <div class="footer-bottom-container">
            <p class="copyright-text">© 2026 School of Information Technology - Tra Vinh University. All rights reserved.</p>
            <p class="footer-note">Được nâng cấp đồng bộ chất lượng hoạt động Khoa Công nghệ Thông tin.</p>
          </div>
        </div>
      </footer>
    `;
  }
}

// Define the custom element
if (!customElements.get('footer-component')) {
  customElements.define('footer-component', FooterComponent);
}
