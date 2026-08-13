/**
 * src/constants/index.js
 * Global application constants.
 * TABLE_MAP: Whitelist mapping of frontend entity keys → MySQL table names.
 * Centralizing here prevents SQL injection and makes it easy to add new entities.
 */

export const TABLE_MAP = {
  // ── Nhân sự ─────────────────────────────────────────────────────────────────
  staff:             'nhan_vien',
  staffGroups:       'nhom_nhan_su',
  staffProfiles:     'trang_ca_nhan',
  staffResearch:     'nhan_vien_de_tai_nckh',
  staffPapers:       'nhan_vien_bai_bao_khoa_hoc',
  staffProjects:     'nhan_vien_du_an',
  staffBooks:        'nhan_vien_sach_giao_trinh',
  staffSupervisions: 'nhan_vien_huong_dan_nckh',

  // ── Trang chủ ────────────────────────────────────────────────────────────────
  homepageHero:       'trang_chu_hero',
  sliders:            'slider_trang_chu',
  homepageAdmissions: 'thong_tin_tuyen_sinh',
  homepagePrograms:   'trang_chu_chuong_trinh_noi_bat',
  infographics:       'infographic_items',
  homepageEvents:     'thong_tin_su_kien_tieu_diem',
  stats:              'thong_ke_noi_bat',
  students:           'sinh_vien_tieu_bieu',
  alumni:             'cuu_sinh_vien_tieu_bieu',
  homepageGallery:    'gallery_hoat_dong_trang_chu',

  // ── Giới thiệu ───────────────────────────────────────────────────────────────
  aboutOverview:    'gioi_thieu_tong_quan',
  aboutHighlights:  'gioi_thieu_highlights',
  timeline:         'lich_su_hinh_thanh',
  aboutMission:     'su_menh_tam_nhin',
  partners:         'doi_tac_hop_tac_quoc_te',
  aboutDeansContact:'gioi_thieu_lien_he_ban_giam_khoa',
  aboutUnitContact: 'lien_he_don_vi',

  // ── Nghiên cứu ───────────────────────────────────────────────────────────────
  researchDirections:  'huong_nghien_cuu',
  researchProjects:    'de_tai_nghien_cuu',
  researchPublications:'cong_bo_khoa_hoc',
  researchLabs:        'phong_thi_nghiem',
  researchContacts:    'lien_he_nghien_cuu',

  // ── Đào tạo Đại học ──────────────────────────────────────────────────────────
  undergradPrograms:  'chuong_trinh_dao_tao_dai_hoc',
  undergradMethods:   'phuong_thuc_tuyen_sinh',
  undergradCurriculum:'cau_truc_khoi_kien_thuc',
  undergradPlos:      'chuan_dau_ra_plo',
  undergradCourses:   'hoc_phan_cong_nghe_cot_loi',
  undergradFaqs:      'faq_dai_hoc',

  // ── Sau Đại học ──────────────────────────────────────────────────────────────
  postgradNotices:    'tuyen_sinh_sau_dai_hoc_thong_bao',
  postgradPhdStudents:'danh_sach_nghien_cuu_sinh',
  postgradStats:      'thong_ke_sau_dai_hoc_chartsy',

  // ── Tin tức & Gallery ────────────────────────────────────────────────────────
  news:    'tin_tuc',
  gallery: 'gallery',

  // ── Quản trị ─────────────────────────────────────────────────────────────────
  adminAccounts: 'tai_khoan_admin_google'
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500
};
