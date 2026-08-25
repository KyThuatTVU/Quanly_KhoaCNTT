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
    const folders = ['home', 'undergraduate', 'about', 'staff', 'research', 'postgraduate'];
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
    const homeLink = `${prefix}home/`;
    const gioiThieuLink = `${prefix}about/`;
    const nhanSuLink = `${prefix}staff/`;
    const nghienCuuLink = `${prefix}research/`;
    const daiHocLink = `${prefix}undergraduate/`;
    const sauDaiHocLink = `${prefix}postgraduate/`;

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
              <span class="brand-subtitle">School of Information Technology</span>
            </div>
          </a>

          <!-- Mobile Hamburger Button -->
          <button class="navbar-toggler" id="navbarToggler" aria-label="Toggle navigation" aria-expanded="false">
            <span></span>
            <span></span>
            <span></span>
          </button>

          <!-- Navigation Links with Icons -->
          <ul class="navbar-nav" id="navbarNav">
            <li class="nav-item">
              <a href="${homeLink}" class="nav-link" data-page="home">
                <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
                <span>Trang chủ</span>
              </a>
            </li>
            <li class="nav-item">
              <a href="${gioiThieuLink}" class="nav-link" data-page="about">
                <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                <span>Giới thiệu</span>
              </a>
            </li>
            <li class="nav-item">
              <a href="${nhanSuLink}" class="nav-link" data-page="staff">
                <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                <span>Nhân sự</span>
              </a>
            </li>
            <li class="nav-item">
              <a href="${nghienCuuLink}" class="nav-link" data-page="research">
                <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                </svg>
                <span>Nghiên cứu</span>
              </a>
            </li>
            <li class="nav-item">
              <a href="${daiHocLink}" class="nav-link" data-page="undergraduate">
                <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                  <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                </svg>
                <span>Đại học</span>
              </a>
            </li>
            <li class="nav-item">
              <a href="${sauDaiHocLink}" class="nav-link" data-page="postgraduate">
                <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
                <span>Sau đại học</span>
              </a>
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

    if (currentPath.includes('/about')) {
      activePage = 'about';
    } else if (currentPath.includes('/staff')) {
      activePage = 'staff';
    } else if (currentPath.includes('/research')) {
      activePage = 'research';
    } else if (currentPath.includes('/postgraduate')) {
      activePage = 'postgraduate';
    } else if (currentPath.includes('/undergraduate')) {
      activePage = 'undergraduate';
    } else if (currentPath.includes('/home')) {
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
