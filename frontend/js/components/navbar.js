/**
 * ==========================================================================
 * NAVBAR WEB COMPONENT
 * ==========================================================================
 * A reusable, native web component for the Faculty of Information Technology navbar.
 * Automatically highlights the active menu item based on the URL path.
 * Handles mobile hamburger menu interaction and scroll-responsive behavior.
 */

class NavbarComponent extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    this.initScrollBehavior();
    this.initMobileMenu();
    this.highlightActiveLink();
  }

  /**
   * Render the HTML structure of the navbar
   */
  render() {
    const folders = ['trang-chu', 'dai-hoc', 'gioi-thieu', 'nhan-su', 'nghien-cuu', 'sau-dai-hoc'];
    const currentPath = window.location.pathname;
    let prefix = './';

    // Dynamically resolve relative prefix path based on the current page's location
    for (const folder of folders) {
      if (currentPath.includes('/' + folder)) {
        prefix = '../';
        break;
      }
    }

    const logoPath = `${prefix}assets/images/sit.jpg`;
    const homeLink = `${prefix}trang-chu/`;
    const gioiThieuLink = `${prefix}gioi-thieu/`;
    const nhanSuLink = `${prefix}nhan-su/`;
    const nghienCuuLink = `${prefix}nghien-cuu/`;
    const daiHocLink = `${prefix}dai-hoc/`;
    const sauDaiHocLink = `${prefix}sau-dai-hoc/`;

    this.innerHTML = `
      <header class="main-header" id="mainHeader">
        <div class="navbar">
          <!-- Logo & Brand Titles (Uppercase to match reference style) -->
          <a href="${homeLink}" class="navbar-brand" title="Khoa Công nghệ Thông tin - Đại học Trà Vinh">
            <div class="brand-logo-container">
              <img src="${logoPath}" alt="FIT Logo" class="brand-logo" onerror="this.onerror=null; this.src='data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><circle cx=%2250%22 cy=%2250%22 r=%2245%22 fill=%22%23ffffff%22 stroke=%22%230f6fff%22 stroke-width=%225%22/><text x=%2250%25%22 y=%2255%25%22 font-family=%22sans-serif%22 font-size=%2222%22 font-weight=%22bold%22 text-anchor=%22middle%22 fill=%22%230f6fff%22>SIT</text></svg>'">
            </div>
            <div class="brand-text">
              <span class="brand-title">KHOA CÔNG NGHỆ THÔNG TIN</span>
              <span class="brand-subtitle">Faculty of Information Technology</span>
            </div>
          </a>

          <!-- Mobile Hamburger Button -->
          <button class="navbar-toggler" id="navbarToggler" aria-label="Toggle navigation" aria-expanded="false">
            <span></span>
            <span></span>
            <span></span>
          </button>

          <!-- Navigation Links (Plain text with active underlines style) -->
          <ul class="navbar-nav" id="navbarNav">
            <li class="nav-item">
              <a href="${homeLink}" class="nav-link" data-page="home">Trang Chủ</a>
            </li>
            <li class="nav-item">
              <a href="${gioiThieuLink}" class="nav-link" data-page="gioi-thieu">Giới Thiệu</a>
            </li>
            <li class="nav-item">
              <a href="${nhanSuLink}" class="nav-link" data-page="nhan-su">Nhân Sự</a>
            </li>
            <li class="nav-item">
              <a href="${nghienCuuLink}" class="nav-link" data-page="nghien-cuu">Nghiên Cứu</a>
            </li>
            <li class="nav-item">
              <a href="${daiHocLink}" class="nav-link" data-page="dai-hoc">Đại Học</a>
            </li>
            <li class="nav-item">
              <a href="${sauDaiHocLink}" class="nav-link" data-page="sau-dai-hoc">Sau Đại Học</a>
            </li>
          </ul>
        </div>
      </header>
    `;
  }

  /**
   * Handle active menu link highlighting
   */
  highlightActiveLink() {
    const currentPath = window.location.pathname;
    let activePage = 'home';

    if (currentPath.includes('/gioi-thieu')) {
      activePage = 'gioi-thieu';
    } else if (currentPath.includes('/nhan-su')) {
      activePage = 'nhan-su';
    } else if (currentPath.includes('/nghien-cuu')) {
      activePage = 'nghien-cuu';
    } else if (currentPath.includes('/sau-dai-hoc')) {
      activePage = 'sau-dai-hoc';
    } else if (currentPath.includes('/dai-hoc')) {
      activePage = 'dai-hoc';
    } else if (currentPath.includes('/trang-chu')) {
      activePage = 'home';
    } else {
      activePage = 'home';
    }

    const activeLink = this.querySelector(`.nav-link[data-page="${activePage}"]`);
    if (activeLink) {
      activeLink.classList.add('active');
    }
  }

  /**
   * Initialize dynamic scrolling behavior for the sticky header
   */
  initScrollBehavior() {
    const header = this.querySelector('#mainHeader');
    if (!header) return;

    const handleScroll = () => {
      if (window.scrollY > 24) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };

    // Run once on load to catch current scroll position
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  /**
   * Initialize the mobile navigation responsive drawer
   */
  initMobileMenu() {
    const toggler = this.querySelector('#navbarToggler');
    const menu = this.querySelector('#navbarNav');
    if (!toggler || !menu) return;

    const toggleMenu = (e) => {
      e.stopPropagation();
      const isOpen = toggler.classList.toggle('open');
      menu.classList.toggle('open');
      toggler.setAttribute('aria-expanded', isOpen);
    };

    toggler.addEventListener('click', toggleMenu);

    // Close menu when clicking outside of the navbar component
    document.addEventListener('click', (e) => {
      if (!this.contains(e.target) && menu.classList.contains('open')) {
        toggler.classList.remove('open');
        menu.classList.remove('open');
        toggler.setAttribute('aria-expanded', 'false');
      }
    });

    // Close menu when clicking on a link (important for single-page style or slow loads)
    const links = this.querySelectorAll('.nav-link');
    links.forEach(link => {
      link.addEventListener('click', () => {
        toggler.classList.remove('open');
        menu.classList.remove('open');
        toggler.setAttribute('aria-expanded', 'false');
      });
    });
  }
}

// Define the custom element
if (!customElements.get('navbar-component')) {
  customElements.define('navbar-component', NavbarComponent);
}
