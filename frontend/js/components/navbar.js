/**
 * ==========================================================================
 * NAVBAR WEB COMPONENT
 * ==========================================================================
 * A reusable, native web component for the Faculty of Information Technology navbar.
 * Automatically highlights the active menu item based on the URL path.
 * Handles mobile hamburger menu interaction and scroll-responsive behavior.
 * Includes VI/EN language switcher integrated with i18n.js.
 */

import { I18n } from '../i18n.js';

class NavbarComponent extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    this.initScrollBehavior();
    this.initMobileMenu();
    this.highlightActiveLink();
    this.initLangSwitcher();
    // Re-apply i18n after render (in case I18n.init() was called before navbar rendered)
    I18n.apply();
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

    const currentLang = I18n.lang;
    const labelNext = currentLang === 'vi' ? 'EN' : 'VI';

    this.innerHTML = `
      <header class="main-header notranslate" id="mainHeader" translate="no">
        <div class="navbar">
          <!-- Logo & Brand Titles -->
          <a href="${homeLink}" class="navbar-brand" title="Khoa Công nghệ Thông tin - Đại học Trà Vinh">
            <div class="brand-logo-container">
              <img src="${logoPath}" alt="FIT Logo" class="brand-logo" onerror="this.onerror=null; this.src='data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><circle cx=%2250%22 cy=%2250%22 r=%2245%22 fill=%22%23ffffff%22 stroke=%22%230f6fff%22 stroke-width=%225%22/><text x=%2250%25%22 y=%2255%25%22 font-family=%22sans-serif%22 font-size=%2222%22 font-weight=%22bold%22 text-anchor=%22middle%22 fill=%22%230f6fff%22>SIT</text></svg>'">
            </div>
            <div class="brand-text">
              <span class="brand-title" data-i18n="brand.title">KHOA CÔNG NGHỆ THÔNG TIN</span>
              <span class="brand-subtitle" data-i18n="brand.subtitle">School of Information Technology</span>
            </div>
          </a>

          <!-- Mobile Hamburger Button -->
          <button class="navbar-toggler" id="navbarToggler" aria-label="Toggle navigation" aria-expanded="false">
            <span></span>
            <span></span>
            <span></span>
          </button>

          <!-- Navigation Links (Icons removed, dimensions preserved, protected from translation corruption) -->
          <ul class="navbar-nav notranslate" id="navbarNav" translate="no">
            <li class="nav-item">
              <a href="${homeLink}" class="nav-link" data-page="home">
                <span data-i18n="nav.home">${I18n.t('nav.home')}</span>
              </a>
            </li>
            <li class="nav-item">
              <a href="${gioiThieuLink}" class="nav-link" data-page="about">
                <span data-i18n="nav.about">${I18n.t('nav.about')}</span>
              </a>
            </li>
            <li class="nav-item">
              <a href="${nhanSuLink}" class="nav-link" data-page="staff">
                <span data-i18n="nav.staff">${I18n.t('nav.staff')}</span>
              </a>
            </li>
            <li class="nav-item">
              <a href="${nghienCuuLink}" class="nav-link" data-page="research">
                <span data-i18n="nav.research">${I18n.t('nav.research')}</span>
              </a>
            </li>
            <li class="nav-item">
              <a href="${daiHocLink}" class="nav-link" data-page="undergraduate">
                <span data-i18n="nav.undergraduate">${I18n.t('nav.undergraduate')}</span>
              </a>
            </li>
            <li class="nav-item">
              <a href="${sauDaiHocLink}" class="nav-link" data-page="postgraduate">
                <span data-i18n="nav.postgraduate">${I18n.t('nav.postgraduate')}</span>
              </a>
            </li>

            <!-- Segmented Pill Language Switcher (Matches Reference: 🇻🇳 VI | 🇺🇸 EN) -->
            <li class="nav-item nav-lang-item">
              <div class="lang-switcher-pill" id="navLangSwitcher" role="group" aria-label="Language selection">
                <button type="button" class="lang-opt-btn ${currentLang === 'vi' ? 'active' : ''}" data-lang="vi" title="Tiếng Việt">
                  <svg class="lang-flag" viewBox="0 0 20 14" width="16" height="11" aria-hidden="true">
                    <rect width="20" height="14" rx="2" fill="#da251d"/>
                    <polygon points="10,2.5 11.2,6.2 15.1,6.2 11.9,8.5 13.1,12.2 10,9.9 6.9,12.2 8.1,8.5 4.9,6.2 8.8,6.2" fill="#ffff00"/>
                  </svg>
                  <span class="lang-code">VI</span>
                </button>
                <button type="button" class="lang-opt-btn ${currentLang === 'en' ? 'active' : ''}" data-lang="en" title="English">
                  <svg class="lang-flag" viewBox="0 0 20 14" width="16" height="11" aria-hidden="true">
                    <defs>
                      <clipPath id="flag-us-clip"><rect width="20" height="14" rx="2"/></clipPath>
                    </defs>
                    <g clip-path="url(#flag-us-clip)">
                      <rect width="20" height="14" fill="#b22234"/>
                      <path d="M0 2.15h20M0 4.31h20M0 6.46h20M0 8.62h20M0 10.77h20M0 12.92h20" stroke="#ffffff" stroke-width="1.08"/>
                      <rect width="8" height="7.54" fill="#3c3b6e"/>
                      <circle cx="2" cy="2" r="0.6" fill="#fff"/>
                      <circle cx="4" cy="2" r="0.6" fill="#fff"/>
                      <circle cx="6" cy="2" r="0.6" fill="#fff"/>
                      <circle cx="3" cy="3.77" r="0.6" fill="#fff"/>
                      <circle cx="5" cy="3.77" r="0.6" fill="#fff"/>
                      <circle cx="2" cy="5.54" r="0.6" fill="#fff"/>
                      <circle cx="4" cy="5.54" r="0.6" fill="#fff"/>
                      <circle cx="6" cy="5.54" r="0.6" fill="#fff"/>
                    </g>
                  </svg>
                  <span class="lang-code">EN</span>
                </button>
              </div>
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

  /**
   * Initialize the segmented pill language switcher buttons (VI | EN)
   */
  initLangSwitcher() {
    const switcher = this.querySelector('#navLangSwitcher');
    if (!switcher) return;

    const buttons = switcher.querySelectorAll('.lang-opt-btn');

    const updateUI = (activeLang) => {
      buttons.forEach((btn) => {
        const lang = btn.getAttribute('data-lang');
        if (lang === activeLang) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    };

    buttons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const targetLang = btn.getAttribute('data-lang');
        if (targetLang && targetLang !== I18n.lang) {
          btn.classList.add('lang-switching');
          setTimeout(() => btn.classList.remove('lang-switching'), 400);
          I18n.setLang(targetLang);
          updateUI(targetLang);
        }
      });
    });

    // Keep in sync if another component or event triggers a language change
    window.addEventListener('langchange', (e) => {
      const currentLang = e.detail?.lang || I18n.lang;
      updateUI(currentLang);
    });
  }
}

// Define the custom element
if (!customElements.get('navbar-component')) {
  customElements.define('navbar-component', NavbarComponent);
}

// Auto-init i18n on first load
I18n.init();
