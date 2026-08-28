/**
 * ==========================================================================
 * i18n.js — Internationalization Engine (VI / EN)
 * ==========================================================================
 * Usage:
 *   import { I18n } from '../i18n.js';
 *   I18n.t('nav.home')   // get translated string
 *
 * In HTML, mark elements with: data-i18n="key"
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

    // ── Home Hero ───────────────────────────────────────────────
    'home.hero.welcome':  'Chào mừng bạn đến với',
    'home.hero.title':    'Khoa Công nghệ Thông tin',
    'home.hero.subtitle': 'Welcome to School of Information Technology',

    // ── Home Programs Cards ─────────────────────────────────────
    'home.prog.it.title':    'Kỹ sư Công nghệ thông tin',
    'home.prog.it.desc':     'Đào tạo kỹ sư CNTT chất lượng cao, định hướng thực hành ứng dụng, làm chủ công nghệ phần mềm và hệ thống mạng hiện đại.',
    'home.prog.ai.title':    'Kỹ sư Trí tuệ nhân tạo',
    'home.prog.ai.desc':     'Đào tạo mũi nhọn về khoa học dữ liệu, thuật toán máy học, xử lý ngôn ngữ tự nhiên và phát triển các hệ thống AI thông minh.',
    'home.prog.ms.title':    'Thạc sĩ Công nghệ thông tin',
    'home.prog.ms.desc':     'Nâng cao chuyên môn học thuật và ứng dụng thực tiễn, trang bị tư duy nghiên cứu độc lập và năng lực quản lý dự án công nghệ lớn.',
    'home.prog.phd.title':   'Tiến sĩ Công nghệ Thông tin',
    'home.prog.phd.desc':    'Chương trình nghiên cứu học thuật chuyên sâu nhất, đào tạo các nhà khoa học, chuyên gia đầu ngành có khả năng tạo ra tri thức công nghệ mới.',

    // ── Home Admission ──────────────────────────────────────────
    'home.admission.title': 'Tuyển sinh 2026',

    // ── Stats ───────────────────────────────────────────────────
    'stats.heading':      'Những Con Số Nổi Bật',

    // ── News ────────────────────────────────────────────────────
    'news.title':         'Tin tức & Sự kiện',
    'news.readmore':      'Xem tiếp',

    // ── Student ─────────────────────────────────────────────────
    'student.title':      'Sinh viên Tiêu biểu',
    'student.more':       'Xem thêm',
    'student.less':       'Rút gọn',

    // ── Alumni ──────────────────────────────────────────────────
    'alumni.title':       'Cựu Sinh Viên Tiêu Biểu',
    'alumni.more':        'Xem thêm',
    'alumni.less':        'Rút gọn',

    // ── Gallery ─────────────────────────────────────────────────
    'gallery.title':      'Hoạt Động Nổi Bật',

    // ── Partners ────────────────────────────────────────────────
    'partners.title':     'Đối tác Hợp tác Quốc tế',

    // ── Footer ──────────────────────────────────────────────────
    'footer.brand.title':    'KHOA CÔNG NGHỆ THÔNG TIN',
    'footer.brand.subtitle': 'Trường Đại học Trà Vinh',
    'footer.brand.desc':     'Đào tạo nguồn nhân lực công nghệ thông tin chất lượng cao, nghiên cứu khoa học chuyên sâu và chuyển giao công nghệ tiên tiến phục vụ sự phát triển của cộng đồng.',
    'footer.links.title':    'Liên kết nhanh',
    'footer.links.home':     'Trang chủ',
    'footer.links.about':    'Giới thiệu',
    'footer.links.staff':    'Đội ngũ nhân sự',
    'footer.links.research': 'Nghiên cứu khoa học',
    'footer.links.undergrad':'Đại học',
    'footer.links.postgrad': 'Sau đại học',
    'footer.contact.title':  'Thông tin liên hệ',
    'footer.contact.address':'Số 126 Nguyễn Thiện Thành, Phường 5, Thành phố Trà Vinh, Tỉnh Trà Vinh.',
    'footer.contact.phone':  'Điện thoại: (+84) 294 3855 246',
    'footer.contact.email':  'Email: CNTT@tvu.edu.vn',
    'footer.copyright':      '© 2026 School of Information Technology - Tra Vinh University. All rights reserved.',
    'footer.note':           'Được nâng cấp đồng bộ chất lượng hoạt động Khoa Công nghệ Thông tin.',

    // ── Staff page ──────────────────────────────────────────────
    'staff.page.title':      'ĐỘI NGŨ NHÂN SỰ',
    'staff.page.desc':       'Đội ngũ cán bộ, viên chức và người lao động thuộc Khoa Công nghệ thông tin - Đại học Trà Vinh',

    // ── Research page ───────────────────────────────────────────
    'research.page.title':   'Nghiên cứu Khoa học',

    // ── Curriculum page ─────────────────────────────────────────
    'curriculum.courses.title':    'Các học phần trong chương trình',
    'curriculum.courses.required': '📚 Học phần bắt buộc',
    'curriculum.courses.elective': '📋 Học phần tự chọn',
    'curriculum.careers.title':    'Vị trí việc làm & Nơi làm việc',
    'curriculum.stats.title':      'Thống kê sinh viên qua các khoá',

    // ── General ─────────────────────────────────────────────────
    'btn.explore':        'Khám phá',
    'btn.contact':        'Liên hệ',
    'loading':            'Đang tải dữ liệu...',
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
    'brand.subtitle': 'Tra Vinh University',

    // ── Home Hero ───────────────────────────────────────────────
    'home.hero.welcome':  'Welcome to',
    'home.hero.title':    'School of Information Technology',
    'home.hero.subtitle': 'Faculty of IT – Tra Vinh University',

    // ── Home Programs Cards ─────────────────────────────────────
    'home.prog.it.title':    'B.Eng. in Information Technology',
    'home.prog.it.desc':     'Training high-quality IT engineers with a practical, application-oriented approach, mastering modern software and network systems.',
    'home.prog.ai.title':    'B.Eng. in Artificial Intelligence',
    'home.prog.ai.desc':     'Specialized training in data science, machine learning algorithms, natural language processing, and intelligent AI system development.',
    'home.prog.ms.title':    'M.Sc. in Information Technology',
    'home.prog.ms.desc':     'Advancing academic expertise and practical skills, equipping independent research thinking and large-scale technology project management.',
    'home.prog.phd.title':   'Ph.D. in Information Technology',
    'home.prog.phd.desc':    'The most advanced research program, training leading scientists and experts capable of generating new technological knowledge.',

    // ── Home Admission ──────────────────────────────────────────
    'home.admission.title': 'Admissions 2026',

    // ── Stats ───────────────────────────────────────────────────
    'stats.heading':      'Key Figures',

    // ── News ────────────────────────────────────────────────────
    'news.title':         'News & Events',
    'news.readmore':      'Read more',

    // ── Student ─────────────────────────────────────────────────
    'student.title':      'Outstanding Students',
    'student.more':       'Read more',
    'student.less':       'Show less',

    // ── Alumni ──────────────────────────────────────────────────
    'alumni.title':       'Distinguished Alumni',
    'alumni.more':        'Read more',
    'alumni.less':        'Show less',

    // ── Gallery ─────────────────────────────────────────────────
    'gallery.title':      'Featured Activities',

    // ── Partners ────────────────────────────────────────────────
    'partners.title':     'International Partnership Network',

    // ── Footer ──────────────────────────────────────────────────
    'footer.brand.title':    'SCHOOL OF INFORMATION TECHNOLOGY',
    'footer.brand.subtitle': 'Tra Vinh University',
    'footer.brand.desc':     'Training high-quality IT human resources, conducting advanced scientific research, and transferring cutting-edge technology for community development.',
    'footer.links.title':    'Quick Links',
    'footer.links.home':     'Home',
    'footer.links.about':    'About',
    'footer.links.staff':    'Faculty & Staff',
    'footer.links.research': 'Research',
    'footer.links.undergrad':'Undergraduate',
    'footer.links.postgrad': 'Postgraduate',
    'footer.contact.title':  'Contact Information',
    'footer.contact.address':'126 Nguyen Thien Thanh, Ward 5, Tra Vinh City, Tra Vinh Province, Vietnam.',
    'footer.contact.phone':  'Phone: (+84) 294 3855 246',
    'footer.contact.email':  'Email: CNTT@tvu.edu.vn',
    'footer.copyright':      '© 2026 School of Information Technology - Tra Vinh University. All rights reserved.',
    'footer.note':           'Upgraded to improve the quality of the School of Information Technology.',

    // ── Staff page ──────────────────────────────────────────────
    'staff.page.title':      'OUR FACULTY',
    'staff.page.desc':       'Faculty members, officers and staff of the School of Information Technology - Tra Vinh University',

    // ── Research page ───────────────────────────────────────────
    'research.page.title':   'Scientific Research',

    // ── Curriculum page ─────────────────────────────────────────
    'curriculum.courses.title':    'Courses in the Program',
    'curriculum.courses.required': '📚 Required Courses',
    'curriculum.courses.elective': '📋 Elective Courses',
    'curriculum.careers.title':    'Career Positions & Workplaces',
    'curriculum.stats.title':      'Student Statistics by Cohort',

    // ── General ─────────────────────────────────────────────────
    'btn.explore':        'Explore',
    'btn.contact':        'Contact',
    'loading':            'Loading data...',
  }
};

export const I18n = {
  lang: localStorage.getItem('fit_lang') || 'vi',

  t(key) {
    return TRANSLATIONS[this.lang]?.[key] ?? TRANSLATIONS['vi']?.[key] ?? key;
  },

  apply() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const translation = this.t(key);
      if (translation) el.textContent = translation;
    });
    document.querySelectorAll('[data-i18n-attr]').forEach(el => {
      const pairs = el.getAttribute('data-i18n-attr').split(',');
      pairs.forEach(pair => {
        const [attr, key] = pair.trim().split(':');
        if (attr && key) el.setAttribute(attr, this.t(key));
      });
    });
    document.documentElement.lang = this.lang;
  },

  toggle() {
    this.lang = this.lang === 'vi' ? 'en' : 'vi';
    localStorage.setItem('fit_lang', this.lang);
    this.apply();
    window.dispatchEvent(new CustomEvent('langchange', { detail: { lang: this.lang } }));
  },

  init() {
    this.lang = localStorage.getItem('fit_lang') || 'vi';
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.apply());
    } else {
      setTimeout(() => this.apply(), 100);
    }
  }
};
