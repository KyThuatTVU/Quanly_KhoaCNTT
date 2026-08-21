/**
 * src/modules/admin/dto/create-admin.dto.js
 * Data Transfer Object for CREATE operations.
 * Maps the generic form payload → exact MySQL column names for INSERT.
 *
 * Separated from update-admin.dto.js because CREATE may have different
 * default values and required fields than UPDATE.
 */
import { slugify, uniqueSlug, timestampSlug } from '../../../common/utils/slugify.js';
import { safeInt, todayDateString, currentYear } from '../../../common/helpers/index.js';
import bcrypt from 'bcrypt';

/**
 * Maps a raw form payload to the correct DB columns for a given entity (CREATE).
 * @param {string} entityKey
 * @param {Object} payload - raw request body from the admin form
 * @returns {Object} - column-value pairs ready for SQL INSERT
 */
export function mapCreatePayload(entityKey, payload) {
  const data = {};
  const title = payload.main_title || payload.tieu_de || payload.ho_ten || payload.ten;
  const sub   = payload.sub_title  || payload.chuc_vu || payload.email || payload.ngay_su_kien || payload.ma_tuyen_sinh;
  const img   = payload.image_url  || payload.anh_ca_nhan_url || payload.logo_url || payload.hinh_anh_url || payload.file_anh_url || payload.anh_url || payload.anh_chinh || payload.avatar_url;
  const desc  = payload.description || payload.mo_ta || payload.noi_dung || payload.thanh_tich || payload.trich_dan_cam_nhan || payload.noi_dung_html || payload.gioi_thieu_nganh || payload.tra_loi || payload.noi_dung_plo;

  switch (entityKey) {
    // ── Nhân sự ────────────────────────────────────────────────────────────────
    case 'staff':
      data.ho_ten         = payload.ho_ten || title;
      data.chuc_vu        = payload.chuc_vu || sub;
      data.hoc_vi         = payload.hoc_vi         || 'Cử nhân';
      data.hoc_ham        = payload.hoc_ham         || null;
      data.ngach_vien_chuc= payload.ngach_vien_chuc || 'Giảng viên';
      data.email          = payload.email           || 'canbo@tvu.edu.vn';
      data.anh_ca_nhan_url= img                     || 'assets/images/lecturers/default.jpg';
      data.nhom_id        = safeInt(payload.nhom_id, 2);
      data.slug_ca_nhan   = uniqueSlug(data.ho_ten);
      data.thu_tu_trong_nhom = safeInt(payload.thu_tu_trong_nhom, 0);
      data.an_hien        = safeInt(payload.an_hien, 1);
      data.an_hien_email  = safeInt(payload.an_hien_email, 1);
      break;

    case 'staffGroups':
      data.ten_nhom        = title;
      data.slug_nhom       = slugify(title);
      data.thu_tu          = safeInt(payload.thu_tu, 0);
      data.background_color= payload.background_color || '#ffffff';
      break;

    case 'staffProfiles':
      data.nhan_vien_id      = safeInt(payload.nhan_vien_id) || null;
      data.email             = payload.email             || null;
      data.ngach_vien_chuc   = payload.ngach_vien_chuc   || 'Giảng viên';
      data.hoc_vi            = payload.hoc_vi            || 'Thạc sĩ';
      data.hoc_ham           = payload.hoc_ham           || null;
      data.don_vi_cong_tac   = payload.don_vi_cong_tac   || null;
      data.linh_vuc_nghien_cuu = payload.linh_vuc_nghien_cuu || null;
      data.google_scholar_url= payload.google_scholar_url || null;
      data.orcid_url         = payload.orcid_url         || null;
      data.github_url        = payload.github_url        || null;
      data.website_ca_nhan   = payload.website_ca_nhan   || null;
      break;

    case 'staffResearch':
      data.ten_de_tai         = title;
      data.nam_hoan_thanh     = safeInt(sub, currentYear());
      data.cap_de_tai         = desc || 'Đề tài cấp cơ sở';
      data.trach_nhiem_tham_gia = payload.trach_nhiem_tham_gia || 'Chủ nhiệm';
      data.nhan_vien_id       = safeInt(payload.nhan_vien_id, 1);
      break;

    case 'staffPapers':
      data.ten_bai_bao           = payload.ten_bai_bao || title || '';
      data.nam_xuat_ban          = safeInt(payload.nam_xuat_ban || sub, currentYear());
      data.danh_sach_tac_gia     = payload.danh_sach_tac_gia || desc || '';
      data.ten_tap_chi_hoi_nghi  = payload.ten_tap_chi_hoi_nghi || 'Hội nghị Khoa học';
      data.nhan_vien_id          = safeInt(payload.nhan_vien_id, 1);
      break;

    case 'staffProjects':
      data.ten_du_an    = title;
      data.nam_thuc_hien= sub || '';
      data.vai_tro      = payload.vai_tro || 'Chủ nhiệm';
      data.mo_ta        = desc || '';
      data.nhan_vien_id = safeInt(payload.nhan_vien_id, 1);
      break;

    case 'staffBooks':
      data.ten_sach_giao_trinh = title;
      data.nha_xuat_ban        = payload.nha_xuat_ban || 'NXB Đại học Trà Vinh';
      data.nam_xuat_ban        = safeInt(sub, currentYear());
      data.vai_tro             = payload.vai_tro || 'Tác giả';
      data.nhan_vien_id        = safeInt(payload.nhan_vien_id, 1);
      break;

    case 'staffSupervisions':
      data.ten_hoc_vien        = title;
      data.ten_de_tai_huong_dan= desc || '';
      data.loai_hoc_vien       = payload.loai_hoc_vien || 'sinh_vien_nckh';
      data.nhan_vien_id        = safeInt(payload.nhan_vien_id, 1);
      break;

    // ── Trang chủ ──────────────────────────────────────────────────────────────
    case 'sliders':
      data.ten_slide    = title;
      data.hinh_anh_url = img || 'assets/images/sliders/default.jpg';
      data.link_lien_ket= sub || '#';
      data.thu_tu       = safeInt(payload.thu_tu, 0);
      break;

    case 'homepageHero':
      data.slogan_vi          = title;
      data.slogan_en          = sub || '';
      data.hinh_anh_banner_url= img || 'assets/images/hero/default.jpg';
      break;

    case 'homepageAdmissions':
      data.tieu_de_box      = title;
      data.noi_dung_day_du  = desc || '';
      data.ma_nganh_ai      = payload.ma_nganh_ai || '7480107';
      data.ma_nganh_cs      = payload.ma_nganh_cs || '7480101';
      data.to_hop_xet_tuyen = payload.to_hop_xet_tuyen || 'A00, A01';
      data.diem_chuan_2025_ai = parseFloat(payload.diem_chuan_2025_ai) || 23.04;
      data.diem_chuan_2025_cs = parseFloat(payload.diem_chuan_2025_cs) || 23.07;
      data.chi_tieu_2026_ai   = safeInt(payload.chi_tieu_2026_ai, 200);
      data.chi_tieu_2026_cs   = safeInt(payload.chi_tieu_2026_cs, 83);
      data.lien_he_tuyen_sinh = payload.lien_he_tuyen_sinh || '';
      data.an_hien            = safeInt(payload.an_hien, 1);
      break;

    case 'homepagePrograms':
      data.ten_chuong_trinh = title;
      data.badge_text       = payload.badge_text || 'Nổi bật';
      data.nhan_kiem_dinh   = payload.nhan_kiem_dinh || 'AUN-QA';
      data.mo_ta_ngan       = desc || '';
      data.link_chi_tiet     = payload.link_chi_tiet || '';
      data.thu_tu           = safeInt(payload.thu_tu, 0);
      break;

    case 'homepageEvents':
      data.tieu_de_su_kien = title;
      data.ngay_su_kien    = sub || '';
      data.link_chi_tiet   = payload.link_chi_tiet || '#';
      data.thu_tu          = safeInt(payload.thu_tu, 0);
      break;

    case 'homepageGallery':
      data.tieu_de_anh = title;
      data.hinh_anh_url= img || 'assets/images/gallery/default.jpg';
      data.thu_tu      = safeInt(payload.thu_tu, 0);
      break;

    case 'infographics':
      data.ten_infographic = title;
      data.file_anh_url    = img || null;
      data.file_pdf_url    = sub || '#';
      data.thu_tu          = safeInt(payload.thu_tu, 0);
      break;

    case 'stats':
      data.ten_chi_so        = title;
      data.so_lieu_thong_ke  = safeInt(sub, 0);
      data.don_vi            = payload.don_vi || '';
      data.ghi_chu_thoi_gian = payload.ghi_chu_thoi_gian || '';
      data.thu_tu            = safeInt(payload.thu_tu, 0);
      break;

    case 'students':
      data.ten_doi_ca_nhan     = title;
      data.nganh_hoc           = sub;
      data.hinh_anh_url        = img || 'assets/images/students/default.jpg';
      data.thanh_tich          = desc || '';
      data.giang_vien_huong_dan= payload.giang_vien_huong_dan || '';
      data.chuyen_muc          = payload.chuyen_muc || 'Sinh viên tiêu biểu';
      data.thu_tu              = safeInt(payload.thu_tu, 0);
      data.an_hien              = safeInt(payload.an_hien, 1);
      break;

    case 'alumni':
      data.ho_ten              = title;
      data.chuc_danh_cong_ty   = sub;
      data.hinh_anh_avatar_url = img || 'assets/images/alumni/default.jpg';
      data.trich_dan_cam_nhan  = desc || '';
      data.thu_tu              = safeInt(payload.thu_tu, 0);
      data.an_hien            = safeInt(payload.an_hien, 1);
      break;

    // ── Giới thiệu ─────────────────────────────────────────────────────────────
    case 'aboutOverview':
      data.tieu_de           = title;
      data.badge_text        = sub || '';
      data.mo_ta_chi_tiet    = desc || '';
      data.hinh_anh_tap_the_url = img || 'assets/images/about/default.jpg';
      data.caption_anh       = payload.caption_anh || '';
      break;

    case 'aboutHighlights':
      data.tieu_de   = title;
      data.icon_class= sub || 'fa-star';
      data.mo_ta     = desc || '';
      data.thu_tu    = safeInt(payload.thu_tu, 0);
      break;

    case 'aboutMission':
      data.tieu_de  = title;
      data.loai     = payload.loai || 'su_menh';
      data.noi_dung = desc || '';
      break;

    case 'timeline':
      data.nam           = title;
      data.noi_dung      = desc || '';
      data.ngay_cu_the   = payload.ngay_cu_the || null;
      data.so_quyet_dinh = payload.so_quyet_dinh || null;
      data.thu_tu        = safeInt(payload.thu_tu, 0);
      break;

    case 'partners':
      data.ten_doi_tac = title;
      data.logo_url    = img || 'assets/images/partners/default.jpg';
      data.hien_thi_o  = payload.hien_thi_o || 'gioi_thieu';
      data.thu_tu      = safeInt(payload.thu_tu, 0);
      break;

    case 'aboutDeansContact':
      data.ho_ten             = title;
      data.chuc_vu_phu_trach  = sub || '';
      data.email              = payload.email || '';
      data.nhan_vien_id       = safeInt(payload.nhan_vien_id) || null;
      data.thu_tu             = safeInt(payload.thu_tu, 0);
      break;

    case 'aboutUnitContact':
      data.ten_don_vi     = title;
      data.truong_don_vi  = sub || '';
      data.copyright_text = desc || '';
      data.khu            = payload.khu || 'Khu I';
      data.dai_hoc        = payload.dai_hoc || 'Đại học Trà Vinh';
      data.dia_chi_duong  = payload.dia_chi_duong || 'Số 126 Nguyễn Thiện Thành';
      data.phuong         = payload.phuong || 'Phường 5';
      data.thanh_pho      = payload.thanh_pho || 'Thành phố Trà Vinh';
      data.facebook_url   = payload.facebook_url || 'https://www.facebook.com/fit.tvu';
      break;

    // ── Nghiên cứu ─────────────────────────────────────────────────────────────
    case 'researchDirections':
      data.ten   = title;
      data.mo_ta = desc || '';
      data.thu_tu= safeInt(payload.thu_tu, 0);
      break;

    case 'researchProjects':
      data.ten_de_tai   = title;
      data.chu_nhiem_ten= sub || 'Bộ môn';
      data.cap          = desc || 'Đề tài Nghiên cứu cấp cơ sở';
      data.trang_thai   = payload.trang_thai || 'Đang thực hiện';
      data.thu_tu       = safeInt(payload.thu_tu, 0);
      break;

    case 'researchPublications':
      data.ten_bai_bao         = title;
      data.nam_xuat_ban        = safeInt(sub, currentYear());
      data.tac_gia             = desc || 'Giảng viên';
      data.loai_hinh_cong_bo   = payload.loai_hinh_cong_bo || 'Journal Article';
      data.ten_tap_chi_hoi_nghi= payload.ten_tap_chi_hoi_nghi || 'Hội nghị Khoa học TVU';
      data.bibtex_key          = payload.bibtex_key || null;
      break;

    case 'researchLabs':
      data.ten              = title;
      data.ten_viet_tat     = sub || '';
      data.hinh_anh_url     = img || 'assets/images/labs/default.jpg';
      data.mo_ta            = desc || '';
      data.truong_phong_id  = safeInt(payload.truong_phong_id) || null;
      data.truong_phong_ten = payload.truong_phong_ten || '';
      break;

    case 'researchContacts':
      data.ten_daidien       = title;
      data.chuc_vu_nhiem_vu  = sub || '';
      data.email             = payload.email || '';
      data.thu_tu            = safeInt(payload.thu_tu, 0);
      break;

    // ── Đào tạo Đại học ────────────────────────────────────────────────────────
    case 'undergradPrograms':
      data.ten_nganh          = title;
      data.ma_tuyen_sinh      = sub;
      data.van_bang_tot_nghiep = payload.van_bang_tot_nghiep || 'Kỹ sư';
      data.thoi_gian_hoc      = payload.thoi_gian_hoc || '4.5 Năm';
      data.tong_so_tin_chi    = safeInt(payload.tong_so_tin_chi, 161);
      data.gioi_thieu_nganh   = payload.gioi_thieu_nganh || desc || '';
      data.co_hoi_phat_trien  = payload.co_hoi_phat_trien || '';
      break;

    case 'undergradMethods':
      data.ten_phuong_thuc = title;
      data.danh_sach_to_hop= sub || '';
      data.nganh_id        = safeInt(payload.nganh_id, 1);
      break;

    case 'undergradCurriculum':
      data.ten_khoi  = title;
      data.so_tin_chi= safeInt(sub, 3);
      data.mo_ta_khoi= desc || '';
      data.nganh_id  = safeInt(payload.nganh_id, 1);
      data.thu_tu    = safeInt(payload.thu_tu, 0);
      break;

    case 'undergradPlos':
      data.ma_plo      = title;
      data.noi_dung_plo= desc || '';
      data.nganh_id    = safeInt(payload.nganh_id, 1);
      break;

    case 'undergradCourses':
      data.ten_hoc_phan    = title;
      data.ma_hoc_phan     = sub || '';
      data.nang_luc_hinh_thanh = desc || '';
      data.so_tin_chi      = safeInt(payload.so_tin_chi, 3);
      data.nganh_id        = safeInt(payload.nganh_id, 1);
      break;

    case 'undergradFaqs':
      data.cau_hoi = title;
      data.tra_loi = desc || '';
      data.thu_tu  = safeInt(payload.thu_tu, 0);
      break;

    case 'undergradCareers':
      data.loai_thong_tin = payload.loai_thong_tin || 'vi_tri_dam_nhan';
      data.noi_dung       = desc || title || '';
      data.nganh_id       = safeInt(payload.nganh_id, 1);
      data.thu_tu         = safeInt(payload.thu_tu, 0);
      break;

    case 'undergradStudentStats':
      data.nganh_id          = safeInt(payload.nganh_id, 1);
      data.khoa              = payload.khoa || '';
      data.so_sinh_vien      = safeInt(payload.so_sinh_vien, 0);
      data.so_tot_nghiep     = safeInt(payload.so_tot_nghiep, 0);
      data.so_dung_tien_do   = safeInt(payload.so_dung_tien_do, 0);
      data.so_tot_nghiep_som = safeInt(payload.so_tot_nghiep_som, 0);
      data.thu_tu            = safeInt(payload.thu_tu, 0);
      break;

    // ── Sau Đại học ────────────────────────────────────────────────────────────
    case 'postgradNotices':
      data.tieu_de_thong_bao = title;
      data.link_chi_tiet     = sub || '#';
      data.lien_he_tu_van    = desc || '';
      data.thu_tu            = safeInt(payload.thu_tu, 0);
      break;

    case 'postgradPhdStudents':
      data.ho_ten         = title;
      data.ma_ncs         = sub;
      data.huong_nghien_cuu = desc || '';
      data.nguoi_huong_dan= payload.nguoi_huong_dan !== undefined ? payload.nguoi_huong_dan : '';
      data.email          = payload.email !== undefined ? payload.email : '';
      data.chuc_vu_co_quan= payload.chuc_vu_co_quan !== undefined ? payload.chuc_vu_co_quan : '';
      data.stt            = payload.stt || '01';
      data.avatar_url     = img || 'assets/images/default-avatar.png';
      data.an_hien        = safeInt(payload.an_hien, 1);
      data.an_hien_ma_ncs = safeInt(payload.an_hien_ma_ncs, 1);
      data.an_hien_email  = safeInt(payload.an_hien_email, 1);
      break;

    case 'postgradStats':
      data.tieu_de_bieu_do   = title;
      data.moc_thoi_gian_tinh= sub || '';
      data.chart_config_json = payload.chart_config_json || '{}';
      break;

    // ── Tin tức & Gallery ──────────────────────────────────────────────────────
    case 'news':
      data.tieu_de      = title;
      data.noi_dung_html= desc || '';
      data.ngay_dang    = sub || todayDateString();
      data.slug         = payload.slug || timestampSlug(title);
      data.tom_tat      = payload.tom_tat || (desc ? desc.substring(0, 150) : '');
      data.anh_chinh    = img || 'assets/images/news/default.jpg';
      data.nhan_nho     = payload.nhan_nho || 'Tin tức';
      data.nhan_lon     = payload.nhan_lon || todayDateString();
      data.thu_tu       = safeInt(payload.thu_tu, 0);
      data.an_hien      = safeInt(payload.an_hien, 1);
      break;

    case 'gallery':
      data.tieu_de = title;
      data.anh_url = img || 'assets/images/gallery/default.jpg';
      data.mo_ta   = desc || '';
      data.danh_muc= payload.danh_muc || 'Sự kiện';
      data.thu_tu  = safeInt(payload.thu_tu, 0);
      break;

    // ── Quản trị ───────────────────────────────────────────────────────────────
    case 'adminAccounts':
      data.ho_ten     = title;
      data.email      = sub;
      data.google_id  = payload.google_id || `google_id_${Date.now()}`;
      data.avatar_url = img || 'https://lh3.googleusercontent.com/a/default-user=s96-c';
      data.quyen_han  = payload.quyen_han || 'SUPER_ADMIN';
      data.trang_thai = safeInt(payload.trang_thai, 1);
      break;

    case 'lecturerAccounts':
      data.nhan_vien_id = safeInt(payload.nhan_vien_id) || null;
      data.email        = payload.email || sub;
      const plainPw     = payload.mat_khau || data.email;
      if (plainPw) {
        data.mat_khau_hash = bcrypt.hashSync(plainPw, 12);
      }
      data.nguoi_tao_admin_id = safeInt(payload.nguoi_tao_admin_id, 1);
      data.quyen_han    = payload.quyen_han || 'STAFF_EDITOR';
      data.trang_thai   = safeInt(payload.trang_thai, 1);
      data.phai_doi_mat_khau = safeInt(payload.phai_doi_mat_khau, 1);
      break;

    default:
      // Passthrough — copy all keys as-is for unlisted entities
      Object.assign(data, payload);
  }

  // Remove generic form keys that are not real DB columns
  const genericKeys = ['main_title', 'sub_title', 'image_url', 'description', 'ho_ten_original'];
  genericKeys.forEach((k) => delete data[k]);

  return data;
}
