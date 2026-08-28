/**
 * ==========================================================================
 * i18n.js — Internationalization Engine (VI / EN)
 * ==========================================================================
 * Usage:
 *   import { I18n } from '../js/i18n.js';
 *   I18n.init();          // call once (auto-called by navbar)
 *   I18n.toggle();        // toggle language
 *   I18n.t('nav.home')   // get translated string
 *
 * In HTML, mark elements with: data-i18n="key"
 * In HTML, mark attributes:    data-i18n-attr="placeholder:key"
 */

const TRANSLATIONS = {
  vi: {
    // ── Navbar ──────────────────────────────────────────────────
    'nav.home':           'Trang chủ',
    'nav.about':          'Giới thiệu',
    'nav.staff':          'Nhân sự',
    'nav.research':       'Nghiên cứu',
    'nav.undergraduate':  'Đại học',
    'nav.postgraduate':   'Sau đại học',
    'nav.lang':           'EN',
    'nav.lang.title':     'Switch to English',

    // ── Brand ───────────────────────────────────────────────────
    'brand.title':    'KHOA CÔNG NGHỆ THÔNG TIN',
    'brand.subtitle': 'School of Information Technology',

    // ── Home page ───────────────────────────────────────────────
    'home.hero.tag':        'Tiên phong Công nghệ – Kiến tạo Tương lai',
    'home.hero.title':      'Khoa Công nghệ Thông tin',
    'home.hero.sub':        'Đại học Trà Vinh',
    'home.hero.desc':       'Đào tạo kỹ sư CNTT và AI chất lượng cao, hội nhập quốc tế, đáp ứng nhu cầu chuyển đổi số của xã hội.',
    'home.hero.btn.explore':'Khám phá Khoa',
    'home.hero.btn.contact':'Liên hệ tư vấn',

    'home.stats.students':  'Sinh viên đang học',
    'home.stats.lecturers': 'Giảng viên cơ hữu',
    'home.stats.research':  'Đề tài NCKH',
    'home.stats.partners':  'Đối tác doanh nghiệp',

    'home.news.title':      'Tin tức & Sự kiện',
    'home.news.more':       'Xem tất cả tin tức',
    'home.news.readmore':   'Xem tiếp',

    'home.partners.title':  'Đối tác Hợp tác Quốc tế',

    // ── About page ──────────────────────────────────────────────
    'about.title':          'Giới thiệu Khoa',
    'about.history':        'Lịch sử hình thành',
    'about.vision':         'Tầm nhìn & Sứ mệnh',
    'about.mission':        'Sứ mệnh',
    'about.core_values':    'Giá trị cốt lõi',

    // ── Staff page ──────────────────────────────────────────────
    'staff.title':          'Đội ngũ Nhân sự',
    'staff.deans':          'Ban Lãnh đạo Khoa',
    'staff.lecturers':      'Giảng viên Cơ hữu',
    'staff.visiting':       'Giảng viên Thỉnh giảng',
    'staff.position':       'Chức vụ',
    'staff.degree':         'Học vị',
    'staff.email':          'Email',
    'staff.research_area':  'Hướng nghiên cứu',

    // ── Research page ───────────────────────────────────────────
    'research.title':       'Nghiên cứu Khoa học',
    'research.directions':  'Hướng nghiên cứu',
    'research.projects':    'Đề tài NCKH',
    'research.publications':'Công bố khoa học',
    'research.labs':        'Phòng thí nghiệm',
    'research.contact':     'Liên hệ nghiên cứu',

    // ── Undergraduate page ──────────────────────────────────────
    'undergrad.title':      'Đào tạo Đại học',
    'undergrad.programs':   'Chương trình đào tạo',
    'undergrad.curriculum': 'Chương trình học',
    'undergrad.admission':  'Thông tin tuyển sinh',
    'undergrad.careers':    'Cơ hội việc làm',

    // ── Postgraduate page ───────────────────────────────────────
    'postgrad.title':       'Đào tạo Sau Đại học',
    'postgrad.phd':         'Nghiên cứu sinh',
    'postgrad.master':      'Học viên Cao học',

    // ── Footer ──────────────────────────────────────────────────
    'footer.address':       'Địa chỉ',
    'footer.phone':         'Điện thoại',
    'footer.email':         'Email',
    'footer.rights':        '© 2025 Khoa Công nghệ Thông tin – Đại học Trà Vinh. Bảo lưu mọi quyền.',
  },

  en: {
    // ── Navbar ──────────────────────────────────────────────────
    'nav.home':           'Home',
    'nav.about':          'About',
    'nav.staff':          'Faculty',
    'nav.research':       'Research',
    'nav.undergraduate':  'Undergraduate',
    'nav.postgraduate':   'Postgraduate',
    'nav.lang':           'VI',
    'nav.lang.title':     'Chuyển sang Tiếng Việt',

    // ── Brand ───────────────────────────────────────────────────
    'brand.title':    'SCHOOL OF INFORMATION TECHNOLOGY',
    'brand.subtitle': 'Trường Đại học Trà Vinh',

    // ── Home page ───────────────────────────────────────────────
    'home.hero.tag':        'Pioneering Technology – Shaping the Future',
    'home.hero.title':      'School of Information Technology',
    'home.hero.sub':        'Tra Vinh University',
    'home.hero.desc':       'Training high-quality IT and AI engineers, internationally integrated, meeting the digital transformation needs of society.',
    'home.hero.btn.explore':'Explore the Faculty',
    'home.hero.btn.contact':'Contact & Advising',

    'home.stats.students':  'Current Students',
    'home.stats.lecturers': 'Faculty Members',
    'home.stats.research':  'Research Projects',
    'home.stats.partners':  'Industry Partners',

    'home.news.title':      'News & Events',
    'home.news.more':       'View all news',
    'home.news.readmore':   'Read more',

    'home.partners.title':  'International Partnership Network',

    // ── About page ──────────────────────────────────────────────
    'about.title':          'About the Faculty',
    'about.history':        'History',
    'about.vision':         'Vision & Mission',
    'about.mission':        'Mission',
    'about.core_values':    'Core Values',

    // ── Staff page ──────────────────────────────────────────────
    'staff.title':          'Our Faculty',
    'staff.deans':          'Faculty Leadership',
    'staff.lecturers':      'Full-time Lecturers',
    'staff.visiting':       'Visiting Lecturers',
    'staff.position':       'Position',
    'staff.degree':         'Degree',
    'staff.email':          'Email',
    'staff.research_area':  'Research Area',

    // ── Research page ───────────────────────────────────────────
    'research.title':       'Scientific Research',
    'research.directions':  'Research Directions',
    'research.projects':    'Research Projects',
    'research.publications':'Publications',
    'research.labs':        'Research Laboratories',
    'research.contact':     'Research Contact',

    // ── Undergraduate page ──────────────────────────────────────
    'undergrad.title':      'Undergraduate Programs',
    'undergrad.programs':   'Degree Programs',
    'undergrad.curriculum': 'Curriculum',
    'undergrad.admission':  'Admission Info',
    'undergrad.careers':    'Career Opportunities',

    // ── Postgraduate page ───────────────────────────────────────
    'postgrad.title':       'Postgraduate Programs',
    'postgrad.phd':         'PhD Candidates',
    'postgrad.master':      'Master Students',

    // ── Footer ──────────────────────────────────────────────────
    'footer.address':       'Address',
    'footer.phone':         'Phone',
    'footer.email':         'Email',
    'footer.rights':        '© 2025 School of Information Technology – Tra Vinh University. All rights reserved.',
  }
};

export const I18n = {
  /** Current language ('vi' | 'en') */
  lang: localStorage.getItem('fit_lang') || 'vi',

  /** Get translation by key */
  t(key) {
    return TRANSLATIONS[this.lang]?.[key] ?? TRANSLATIONS['vi']?.[key] ?? key;
  },

  /** Apply translations to all [data-i18n] elements in the document */
  apply() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const translation = this.t(key);
      if (translation) el.textContent = translation;
    });
    // Also handle attribute translations: data-i18n-attr="placeholder:key,title:key2"
    document.querySelectorAll('[data-i18n-attr]').forEach(el => {
      const pairs = el.getAttribute('data-i18n-attr').split(',');
      pairs.forEach(pair => {
        const [attr, key] = pair.trim().split(':');
        if (attr && key) el.setAttribute(attr, this.t(key));
      });
    });
    // Update <html lang="">
    document.documentElement.lang = this.lang;
  },

  /** Toggle between VI and EN */
  toggle() {
    this.lang = this.lang === 'vi' ? 'en' : 'vi';
    localStorage.setItem('fit_lang', this.lang);
    this.apply();
    // Dispatch event so components can react
    window.dispatchEvent(new CustomEvent('langchange', { detail: { lang: this.lang } }));
  },

  /** Initialize: apply stored language preference on page load */
  init() {
    this.lang = localStorage.getItem('fit_lang') || 'vi';
    // Wait for DOM to settle before applying
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.apply());
    } else {
      // Small delay to let web components render first
      setTimeout(() => this.apply(), 50);
    }
  }
};
