-- =============================================================================
-- HỆ THỐNG CƠ SỞ DỮ LIỆU KHOA KHOA HỌC MÁY TÍNH - ĐẠI HỌC CẦN THƠ (csd.ctu.edu.vn)
-- Hệ quản trị CSDL: MySQL 8.0+ / MariaDB 10.5+
-- Bảng mã ký tự: utf8mb4 / utf8mb4_unicode_ci
-- Phong cách mã: Sạch sẽ, có chú thích chi tiết, chia module rõ ràng, dễ bảo trì
-- =============================================================================

CREATE DATABASE IF NOT EXISTS `quanly_khoacntt_tvu`
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE `quanly_khoacntt_tvu`;

-- Tắt kiểm tra khóa ngoại tạm thời để khởi tạo các bảng theo thứ tự chuẩn
SET FOREIGN_KEY_CHECKS = 0;

-- =============================================================================
-- MODULE 1: QUẢN LÝ TÀI KHỎAN VÀ ĐĂNG NHẬP (AUTHENTICATION & USER MANAGEMENT)
-- =============================================================================

-- 1.1 Bảng Tài khoản Admin đăng nhập bằng Google OAuth 2.0
DROP TABLE IF EXISTS `tai_khoan_admin_google`;
CREATE TABLE `tai_khoan_admin_google` (
  `id`                 INT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID Quản trị viên',
  `google_id`          VARCHAR(255) NOT NULL UNIQUE COMMENT 'Google Subject ID (sub) từ OAuth token',
  `email`              VARCHAR(200) NOT NULL UNIQUE COMMENT 'Email Google dùng đăng nhập',
  `ho_ten`             VARCHAR(200) NOT NULL COMMENT 'Họ và tên hiển thị',
  `avatar_url`         VARCHAR(500) DEFAULT NULL COMMENT 'URL ảnh đại diện Google',
  `quyen_han`          VARCHAR(50) NOT NULL DEFAULT 'SUPER_ADMIN' COMMENT 'Quyền hạn (SUPER_ADMIN...)',
  `trang_thai`         TINYINT(1) NOT NULL DEFAULT 1 COMMENT '1: Hoạt động, 0: Khóa',
  `lan_dang_nhap_cuoi` DATETIME DEFAULT NULL COMMENT 'Thời điểm đăng nhập gần nhất',
  `ngay_tao`           DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Ngày tạo tài khoản',
  `ngay_cap_nhat`      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Tài khoản Admin đăng nhập qua Google OAuth';

-- 1.2 Bảng Tài khoản Nhân viên (Đăng nhập Email & Mật khẩu - Do Admin khởi tạo)
DROP TABLE IF EXISTS `tai_khoan_nhan_vien`;
CREATE TABLE `tai_khoan_nhan_vien` (
  `id`                 INT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID tài khoản nhân viên',
  `nhan_vien_id`       INT NOT NULL UNIQUE COMMENT 'FK liên kết tới bảng nhan_vien',
  `email`              VARCHAR(200) NOT NULL UNIQUE COMMENT 'Email đăng nhập hệ thống',
  `mat_khau_hash`      VARCHAR(255) NOT NULL COMMENT 'Mật khẩu mã hóa (Bcrypt/Argon2)',
  `nguoi_tao_admin_id` INT NOT NULL COMMENT 'FK ID Admin khởi tạo tài khoản này',
  `quyen_han`          VARCHAR(50) NOT NULL DEFAULT 'STAFF_EDITOR' COMMENT 'Quyền hạn (STAFF_EDITOR...)',
  `trang_thai`         TINYINT(1) NOT NULL DEFAULT 1 COMMENT '1: Hoạt động, 0: Khóa',
  `lan_dang_nhap_cuoi` DATETIME DEFAULT NULL COMMENT 'Thời điểm đăng nhập gần nhất',
  `ngay_tao`           DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Ngày Admin tạo tài khoản',
  `ngay_cap_nhat`      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_tk_nhanvien_nhanvien` FOREIGN KEY (`nhan_vien_id`) REFERENCES `nhan_vien` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_tk_nhanvien_admin` FOREIGN KEY (`nguoi_tao_admin_id`) REFERENCES `tai_khoan_admin_google` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Tài khoản Nhân viên/Giảng viên đăng nhập Email & Mật khẩu';


-- =============================================================================
-- MODULE 2: QUẢN LÝ NHÂN SỰ VÀ TRANG CÁ NHÂN GIẢNG VIÊN (STAFF & PROFILES)
-- =============================================================================

-- 2.1 Bảng Phân nhóm Nhân sự (Lãnh đạo Khoa, Giảng viên & Trợ giảng...)
DROP TABLE IF EXISTS `nhom_nhan_su`;
CREATE TABLE `nhom_nhan_su` (
  `id`               INT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID nhóm nhân sự',
  `ten_nhom`         VARCHAR(100) NOT NULL COMMENT 'Tên nhóm (LÃNH ĐẠO KHOA, GIẢNG VIÊN & TRỢ GIẢNG)',
  `slug_nhom`        VARCHAR(50) NOT NULL UNIQUE COMMENT 'Slug nhóm',
  `thu_tu`           INT NOT NULL DEFAULT 0 COMMENT 'Thứ tự hiển thị',
  `background_color` VARCHAR(50) DEFAULT '#f8fafc' COMMENT 'Mã màu nền CSS',
  `ngay_tao`         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Phân nhóm nhân sự khoa';

-- 2.2 Bảng Nhân viên / Giảng viên (Bảng Trung Tâm)
DROP TABLE IF EXISTS `nhan_vien`;
CREATE TABLE `nhan_vien` (
  `id`                INT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID cán bộ nhân viên',
  `nhom_id`           INT NOT NULL COMMENT 'FK nhóm nhân sự',
  `ho_ten`            VARCHAR(200) NOT NULL COMMENT 'Họ và tên đầy đủ',
  `hoc_ham`           VARCHAR(50) DEFAULT NULL COMMENT 'Học hàm (Giáo sư, Phó giáo sư)',
  `hoc_vi`            VARCHAR(50) NOT NULL COMMENT 'Học vị (Tiến sĩ, Thạc sĩ, Kỹ sư, NCS)',
  `ngach_vien_chuc`   VARCHAR(100) DEFAULT NULL COMMENT 'Ngạch viên chức (Giảng viên cao cấp, GVC...)',
  `don_vi_cong_tac`   VARCHAR(300) DEFAULT NULL COMMENT 'Đơn vị công tác chính',
  `chuc_vu`           VARCHAR(200) NOT NULL COMMENT 'Chức vụ hiển thị trên card',
  `email`             VARCHAR(200) DEFAULT NULL COMMENT 'Email công vụ (@ctu.edu.vn)',
  `slug_ca_nhan`      VARCHAR(100) NOT NULL UNIQUE COMMENT 'URL slug trang cá nhân (/tnmthu, /pxhien...)',
  `anh_ca_nhan_url`   VARCHAR(500) NOT NULL COMMENT 'URL ảnh đại diện cá nhân',
  `anh_format`        ENUM('jpg','webp','png','jpeg') NOT NULL DEFAULT 'webp' COMMENT 'Định dạng file ảnh',
  `aria_label_anh`    VARCHAR(200) DEFAULT NULL COMMENT 'Aria label cho accessibility',
  `thu_tu_trong_nhom` INT NOT NULL DEFAULT 0 COMMENT 'Thứ tự vị trí trong nhóm',
  `an_hien`           TINYINT(1) NOT NULL DEFAULT 1 COMMENT '1: Hiện, 0: Ẩn',
  `an_hien_email`     TINYINT(1) NOT NULL DEFAULT 1 COMMENT '1: Hiện, 0: Ẩn',
  `ngay_tao`          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ngay_cap_nhat`     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_nhanvien_nhom` FOREIGN KEY (`nhom_id`) REFERENCES `nhom_nhan_su` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Danh sách Cán bộ, Giảng viên và Người lao động';

-- 2.3 Bảng Thông tin tổng quan Trang cá nhân giảng viên
DROP TABLE IF EXISTS `trang_ca_nhan`;
CREATE TABLE `trang_ca_nhan` (
  `id`                 INT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID trang cá nhân',
  `nhan_vien_id`       INT NOT NULL UNIQUE COMMENT 'FK liên kết 1-1 với nhan_vien',
  `wp_post_id`         INT DEFAULT NULL COMMENT 'ID bài viết WordPress (nếu có)',
  `email`              VARCHAR(200) DEFAULT NULL COMMENT 'Email liên hệ',
  `ngach_vien_chuc`    VARCHAR(100) DEFAULT NULL COMMENT 'Ngạch viên chức',
  `hoc_vi`             VARCHAR(50) DEFAULT NULL COMMENT 'Trình độ chuyên môn',
  `hoc_ham`            VARCHAR(50) DEFAULT NULL COMMENT 'Học hàm',
  `don_vi_cong_tac`    VARCHAR(300) DEFAULT NULL COMMENT 'Đơn vị công tác',
  `linh_vuc_nghien_cuu` TEXT DEFAULT NULL COMMENT 'Tóm tắt các hướng nghiên cứu',
  `google_scholar_url` VARCHAR(500) DEFAULT NULL COMMENT 'Link Google Scholar profile',
  `google_scholar_id`  VARCHAR(100) DEFAULT NULL COMMENT 'Scholar ID dùng cho shortcode plugin',
  `orcid_url`          VARCHAR(500) DEFAULT NULL COMMENT 'Link ORCID iD',
  `orcid_id`           VARCHAR(50) DEFAULT NULL COMMENT 'Mã ORCID',
  `github_url`         VARCHAR(500) DEFAULT NULL COMMENT 'Link Github cá nhân',
  `website_ca_nhan`    VARCHAR(500) DEFAULT NULL COMMENT 'Link Website cá nhân',
  `ngay_cap_nhat`      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_trangcanhan_nhanvien` FOREIGN KEY (`nhan_vien_id`) REFERENCES `nhan_vien` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Thông tin tổng quan trang cá nhân giảng viên';

-- 2.4 Bảng Đề tài NCKH các cấp của từng Giảng viên
DROP TABLE IF EXISTS `nhan_vien_de_tai_nckh`;
CREATE TABLE `nhan_vien_de_tai_nckh` (
  `id`                   INT AUTO_INCREMENT PRIMARY KEY,
  `nhan_vien_id`         INT NOT NULL COMMENT 'FK giảng viên',
  `stt`                  INT NOT NULL DEFAULT 1 COMMENT 'STT hiển thị',
  `ten_de_tai`           VARCHAR(500) NOT NULL COMMENT 'Tên đề tài / lĩnh vực áp dụng',
  `nam_hoan_thanh`       YEAR NOT NULL COMMENT 'Năm hoàn thành',
  `cap_de_tai`           VARCHAR(100) NOT NULL COMMENT 'Đề tài cấp (Tỉnh, bộ, ngành, cơ sở)',
  `trach_nhiem_tham_gia` VARCHAR(100) NOT NULL COMMENT 'Chủ nhiệm, Thư ký, Thành viên...',
  CONSTRAINT `fk_detai_nhanvien` FOREIGN KEY (`nhan_vien_id`) REFERENCES `nhan_vien` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Đề tài NCKH các cấp của từng giảng viên';

-- 2.5 Bảng Bài báo khoa học của từng Giảng viên
DROP TABLE IF EXISTS `nhan_vien_bai_bao_khoa_hoc`;
CREATE TABLE `nhan_vien_bai_bao_khoa_hoc` (
  `id`                  INT AUTO_INCREMENT PRIMARY KEY,
  `nhan_vien_id`        INT NOT NULL COMMENT 'FK giảng viên',
  `loai_xuat_ban`       ENUM('tieng_anh','tieng_viet') NOT NULL DEFAULT 'tieng_viet' COMMENT 'Loại xuất bản',
  `stt`                 INT NOT NULL DEFAULT 1 COMMENT 'STT bài báo',
  `danh_sach_tac_gia`   TEXT NOT NULL COMMENT 'Danh sách tác giả',
  `nam_xuat_ban`        YEAR NOT NULL COMMENT 'Năm xuất bản',
  `ten_bai_bao`         VARCHAR(500) NOT NULL COMMENT 'Tiêu đề bài báo',
  `ten_tap_chi_hoi_nghi` VARCHAR(500) NOT NULL COMMENT 'Tên tạp chí hoặc hội nghị',
  `so_tap_chi_trang`    VARCHAR(100) DEFAULT NULL COMMENT 'Số tập, số trang (VD: 59. 93-101)',
  `trang_thai_xuat_ban` VARCHAR(100) DEFAULT '(Đã xuất bản)' COMMENT 'Trạng thái',
  CONSTRAINT `fk_baibao_nhanvien` FOREIGN KEY (`nhan_vien_id`) REFERENCES `nhan_vien` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Danh mục bài báo khoa học của từng giảng viên';

-- 2.6 Bảng Dự án / Project của Giảng viên
DROP TABLE IF EXISTS `nhan_vien_du_an`;
CREATE TABLE `nhan_vien_du_an` (
  `id`            INT AUTO_INCREMENT PRIMARY KEY,
  `nhan_vien_id`  INT NOT NULL COMMENT 'FK giảng viên',
  `ten_du_an`     VARCHAR(500) NOT NULL COMMENT 'Tên dự án',
  `nam_thuc_hien` VARCHAR(50) DEFAULT NULL COMMENT 'Năm thực hiện',
  `vai_tro`       VARCHAR(200) DEFAULT NULL COMMENT 'Vai trò trong dự án',
  `mo_ta`         TEXT DEFAULT NULL COMMENT 'Mô tả chi tiết dự án',
  CONSTRAINT `fk_duan_nhanvien` FOREIGN KEY (`nhan_vien_id`) REFERENCES `nhan_vien` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Dự án ứng dụng/chuyển giao của giảng viên';

-- 2.7 Bảng Sách và Giáo trình của Giảng viên
DROP TABLE IF EXISTS `nhan_vien_sach_giao_trinh`;
CREATE TABLE `nhan_vien_sach_giao_trinh` (
  `id`                  INT AUTO_INCREMENT PRIMARY KEY,
  `nhan_vien_id`        INT NOT NULL COMMENT 'FK giảng viên',
  `ten_sach_giao_trinh` VARCHAR(500) NOT NULL COMMENT 'Tên sách hoặc giáo trình',
  `nha_xuat_ban`        VARCHAR(250) DEFAULT NULL COMMENT 'Nhà xuất bản',
  `nam_xuat_ban`        YEAR DEFAULT NULL COMMENT 'Năm xuất bản',
  `vai_tro`             VARCHAR(100) DEFAULT NULL COMMENT 'Chủ biên, Tác giả tham gia...',
  CONSTRAINT `fk_sach_nhanvien` FOREIGN KEY (`nhan_vien_id`) REFERENCES `nhan_vien` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Sách và giáo trình giảng dạy của giảng viên';

-- 2.8 Bảng Hướng dẫn NCS, HVCH, SV NCKH của Giảng viên
DROP TABLE IF EXISTS `nhan_vien_huong_dan_nckh`;
CREATE TABLE `nhan_vien_huong_dan_nckh` (
  `id`                  INT AUTO_INCREMENT PRIMARY KEY,
  `nhan_vien_id`        INT NOT NULL COMMENT 'FK giảng viên',
  `loai_hoc_vien`       ENUM('ncs','hoc_vien_cao_hoc','sinh_vien_nckh') NOT NULL COMMENT 'Phân loại bậc học',
  `ten_hoc_vien`        VARCHAR(200) NOT NULL COMMENT 'Tên NCS / Học viên / Sinh viên',
  `ten_de_tai_huong_dan` VARCHAR(500) NOT NULL COMMENT 'Tên đề tài luận văn/luận án',
  `nam_bao_ve`          YEAR DEFAULT NULL COMMENT 'Năm bảo vệ thành công',
  CONSTRAINT `fk_huongdan_nhanvien` FOREIGN KEY (`nhan_vien_id`) REFERENCES `nhan_vien` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Danh sách hướng dẫn NCKH các bậc học của giảng viên';


-- =============================================================================
-- MODULE 3: QUẢN LÝ NỘI DUNG TRANG CHỦ (HOMEPAGE MANAGEMENT)
-- =============================================================================

-- 3.1 Bảng Slogan & Hero Banner Trang chủ
DROP TABLE IF EXISTS `trang_chu_hero`;
CREATE TABLE `trang_chu_hero` (
  `id`                 INT AUTO_INCREMENT PRIMARY KEY,
  `slogan_vi`          VARCHAR(255) NOT NULL COMMENT 'Slogan tiếng Việt',
  `slogan_en`          VARCHAR(255) NOT NULL COMMENT 'Slogan tiếng Anh',
  `hinh_anh_banner_url` VARCHAR(500) DEFAULT NULL COMMENT 'URL ảnh banner hero',
  `ngay_cap_nhat`      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Slogan và banner Hero trang chủ';

-- 3.2 Bảng 4 Thẻ Chương trình đào tạo nổi bật trên Trang chủ
DROP TABLE IF EXISTS `trang_chu_chuong_trinh_noi_bat`;
CREATE TABLE `trang_chu_chuong_trinh_noi_bat` (
  `id`              INT AUTO_INCREMENT PRIMARY KEY,
  `badge_text`      VARCHAR(50) NOT NULL COMMENT 'AUN-QA / Nổi bật',
  `nhan_kiem_dinh`  VARCHAR(255) NOT NULL COMMENT 'Chương trình đào tạo đạt chuẩn kiểm định AUN-QA',
  `ten_chuong_trinh` VARCHAR(200) NOT NULL COMMENT 'Kỹ sư KHMT, Kỹ sư AI, ThS KHMT, Tiến sĩ KHMT',
  `mo_ta_ngan`      TEXT NOT NULL COMMENT 'Mô tả ngắn định hướng',
  `link_chi_tiet`   VARCHAR(500) DEFAULT NULL COMMENT 'Link chuyển đến chi tiết',
  `thu_tu`          INT NOT NULL DEFAULT 0 COMMENT 'Vị trí hiển thị'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='4 khối chương trình đào tạo nổi bật trang chủ';

-- 3.3 Bảng Thông tin Tuyển sinh 2026 trên Trang chủ
DROP TABLE IF EXISTS `thong_tin_tuyen_sinh`;
CREATE TABLE `thong_tin_tuyen_sinh` (
  `id`                 INT AUTO_INCREMENT PRIMARY KEY,
  `tieu_de_box`        VARCHAR(255) NOT NULL DEFAULT '🎓 Tuyển sinh 2026',
  `noi_dung_day_du`    TEXT NOT NULL COMMENT 'Văn bản mô tả đầy đủ',
  `ma_nganh_ai`        VARCHAR(20) NOT NULL DEFAULT '7480107',
  `ma_nganh_cs`        VARCHAR(20) NOT NULL DEFAULT '7480101',
  `to_hop_xet_tuyen`   VARCHAR(255) NOT NULL COMMENT 'Các tổ hợp xét tuyển A00, A01, X06, X26',
  `diem_chuan_2025_ai` DECIMAL(4,2) NOT NULL DEFAULT 23.04,
  `diem_chuan_2025_cs` DECIMAL(4,2) NOT NULL DEFAULT 23.07,
  `chi_tieu_2026_ai`   INT NOT NULL DEFAULT 200,
  `chi_tieu_2026_cs`   INT NOT NULL DEFAULT 83,
  `lien_he_tuyen_sinh` VARCHAR(255) NOT NULL COMMENT 'Kênh liên hệ hỗ trợ',
  `an_hien`            TINYINT(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Thông tin chi tiết box Tuyển sinh 2026';

-- 3.4 Bảng Slider Banner Carousel Trang chủ
DROP TABLE IF EXISTS `slider_trang_chu`;
CREATE TABLE `slider_trang_chu` (
  `id`            INT AUTO_INCREMENT PRIMARY KEY,
  `ten_slide`     VARCHAR(200) NOT NULL COMMENT 'Tên slide (CTUWebsiteSlideWeb6...)',
  `hinh_anh_url`  VARCHAR(500) NOT NULL COMMENT 'URL ảnh slider',
  `link_lien_ket` VARCHAR(500) DEFAULT NULL COMMENT 'Link khi nhấp vào slide',
  `thu_tu`        INT NOT NULL DEFAULT 0 COMMENT 'Thứ tự slide'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Slider banner carousel trang chủ';

-- 3.5 Bảng Ticker Thông tin & Sự kiện trên Trang chủ
DROP TABLE IF EXISTS `thong_tin_su_kien_tieu_diem`;
CREATE TABLE `thong_tin_su_kien_tieu_diem` (
  `id`              INT AUTO_INCREMENT PRIMARY KEY,
  `ngay_su_kien`    VARCHAR(50) NOT NULL COMMENT 'Ngày sự kiện (19-07-2026...)',
  `tieu_de_su_kien` VARCHAR(500) NOT NULL COMMENT 'Nội dung sự kiện tóm tắt',
  `link_chi_tiet`   VARCHAR(500) DEFAULT NULL,
  `thu_tu`          INT NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Ticker thông tin sự kiện tiêu điểm trang chủ';

-- 3.6 Bảng 4 Khối Infographic A4
DROP TABLE IF EXISTS `infographic_items`;
CREATE TABLE `infographic_items` (
  `id`              INT AUTO_INCREMENT PRIMARY KEY,
  `ten_infographic` VARCHAR(200) NOT NULL COMMENT 'Infographic A4 - 1 đến 4',
  `file_anh_url`    VARCHAR(500) NOT NULL COMMENT 'URL ảnh preview',
  `file_pdf_url`    VARCHAR(500) DEFAULT NULL COMMENT 'Link tải PDF A4',
  `thu_tu`          INT NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Các file Infographic A4 trang chủ';

-- 3.7 Bảng Những con số nổi bật (Counter Stats)
DROP TABLE IF EXISTS `thong_ke_noi_bat`;
CREATE TABLE `thong_ke_noi_bat` (
  `id`                 INT AUTO_INCREMENT PRIMARY KEY,
  `ten_chi_so`         VARCHAR(100) NOT NULL COMMENT 'Sinh viên, Đề tài NCKH, Bài báo...',
  `so_lieu_thong_ke`   INT NOT NULL DEFAULT 0 COMMENT 'Số đếm thống kê',
  `don_vi`             VARCHAR(20) DEFAULT NULL COMMENT 'Đơn vị (+, %)',
  `ghi_chu_thoi_gian`  VARCHAR(150) NOT NULL DEFAULT 'Số liệu thống kê đến tháng 12/2025',
  `thu_tu`             INT NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Số liệu thống kê đếm số nổi bật trang chủ';

-- 3.8 Bảng Thành tích Sinh viên & Đội nhóm tiêu biểu
DROP TABLE IF EXISTS `sinh_vien_tieu_bieu`;
CREATE TABLE `sinh_vien_tieu_bieu` (
  `id`                   INT AUTO_INCREMENT PRIMARY KEY,
  `ten_doi_ca_nhan`      VARCHAR(200) NOT NULL COMMENT 'Đội CTU-LinguTechies, Đội CAAS, Thái Phú An...',
  `nganh_hoc`            VARCHAR(200) NOT NULL COMMENT 'Ngành Khoa học máy tính...',
  `thanh_tich`            TEXT NOT NULL COMMENT 'Chi tiết giải thưởng thành tích',
  `giang_vien_huong_dan` VARCHAR(200) DEFAULT NULL COMMENT 'Tên GVHD nếu có',
  `chuyen_muc`           VARCHAR(100) NOT NULL DEFAULT 'Sinh viên tiêu biểu' COMMENT 'Phân loại: Sinh viên tiêu biểu, Nghiên cứu khoa học sinh viên, Dự án AI nổi bật',
  `hinh_anh_url`         VARCHAR(500) DEFAULT NULL,
  `thu_tu`               INT NOT NULL DEFAULT 0,
  `an_hien`              TINYINT(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Sinh viên và đội nhóm thành tích tiêu biểu';

-- 3.9 Bảng Gương mặt & Trích dẫn Cựu sinh viên tiêu biểu
DROP TABLE IF EXISTS `cuu_sinh_vien_tieu_bieu`;
CREATE TABLE `cuu_sinh_vien_tieu_bieu` (
  `id`                 INT AUTO_INCREMENT PRIMARY KEY,
  `ho_ten`             VARCHAR(200) NOT NULL COMMENT 'Họ tên cựu sinh viên',
  `chuc_danh_cong_ty`  VARCHAR(300) NOT NULL COMMENT 'Vị trí công tác & Tên công ty',
  `trich_dan_cam_nhan` TEXT NOT NULL COMMENT 'Trích dẫn phát biểu cảm nhận',
  `hinh_anh_avatar_url` VARCHAR(500) DEFAULT NULL COMMENT 'Ảnh đại diện cựu SV',
  `thu_tu`             INT NOT NULL DEFAULT 0,
  `an_hien`            TINYINT(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Gương mặt cựu sinh viên tiêu biểu';

-- 3.10 Bảng Thư viện ảnh hoạt động Trang chủ
DROP TABLE IF EXISTS `gallery_hoat_dong_trang_chu`;
CREATE TABLE `gallery_hoat_dong_trang_chu` (
  `id`           INT AUTO_INCREMENT PRIMARY KEY,
  `tieu_de_anh`  VARCHAR(255) DEFAULT 'ảnh hoạt động Khoa Khoa học máy tính',
  `hinh_anh_url` VARCHAR(500) NOT NULL,
  `thu_tu`       INT NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Slider ảnh hoạt động khoa trên trang chủ';


-- =============================================================================
-- MODULE 4: QUẢN LÝ NỘI DUNG TRANG GIỚI THIỆU (ABOUT PAGE MANAGEMENT)
-- =============================================================================

-- 4.1 Bảng Overview Trang Giới thiệu
DROP TABLE IF EXISTS `gioi_thieu_tong_quan`;
CREATE TABLE `gioi_thieu_tong_quan` (
  `id`                   INT AUTO_INCREMENT PRIMARY KEY,
  `badge_text`           VARCHAR(100) NOT NULL DEFAULT 'Giới thiệu tổng quan',
  `tieu_de`              VARCHAR(255) NOT NULL DEFAULT 'Khoa KHOA HỌC MÁY TÍNH',
  `mo_ta_chi_tiet`       TEXT NOT NULL COMMENT 'Nội dung văn bản giới thiệu',
  `hinh_anh_tap_the_url` VARCHAR(500) NOT NULL COMMENT 'URL ảnh tập thể khoa',
  `caption_anh`          VARCHAR(255) NOT NULL DEFAULT 'Khoa Khoa học máy tính - Đại học Trà Vinh'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Tổng quan trang Giới thiệu';

-- 4.2 Bảng 3 Thẻ Highlight trang Giới thiệu
DROP TABLE IF EXISTS `gioi_thieu_highlights`;
CREATE TABLE `gioi_thieu_highlights` (
  `id`         INT AUTO_INCREMENT PRIMARY KEY,
  `icon_class` VARCHAR(100) NOT NULL COMMENT 'FontAwesome icon class',
  `tieu_de`    VARCHAR(150) NOT NULL COMMENT 'Chương trình đào tạo, NCKH, Chuyển giao công nghệ',
  `mo_ta`      VARCHAR(255) NOT NULL,
  `thu_tu`     INT NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='3 thẻ highlight trang Giới thiệu';

-- 4.3 Bảng 8 Mốc Lịch sử hình thành (Timeline)
DROP TABLE IF EXISTS `lich_su_hinh_thanh`;
CREATE TABLE `lich_su_hinh_thanh` (
  `id`            INT AUTO_INCREMENT PRIMARY KEY,
  `nam`           VARCHAR(10) NOT NULL COMMENT 'Năm mốc lịch sử (2009, 2014, 2022...)',
  `ngay_cu_the`   DATE DEFAULT NULL COMMENT 'Ngày sự kiện nếu có',
  `so_quyet_dinh` VARCHAR(50) DEFAULT NULL COMMENT 'Số Quyết định (2082/QĐ-ĐHCT)',
  `noi_dung`      TEXT NOT NULL COMMENT 'Nội dung mốc lịch sử',
  `thu_tu`        INT NOT NULL DEFAULT 0 COMMENT 'Thứ tự dòng thời gian'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='8 mốc lịch sử hình thành khoa';

-- 4.4 Bảng Sứ mệnh & Tầm nhìn 2030
DROP TABLE IF EXISTS `su_menh_tam_nhin`;
CREATE TABLE `su_menh_tam_nhin` (
  `id`       INT AUTO_INCREMENT PRIMARY KEY,
  `loai`     ENUM('su_menh','tam_nhin') NOT NULL,
  `tieu_de`  VARCHAR(100) NOT NULL COMMENT 'Sứ mệnh / Tầm nhìn 2030',
  `noi_dung` TEXT NOT NULL COMMENT 'Nội dung chi tiết'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Khối Sứ mệnh và Tầm nhìn 2030';

-- 4.5 Bảng Đối tác Hợp tác Quốc tế (Giới thiệu & NCKH)
DROP TABLE IF EXISTS `doi_tac_hop_tac_quoc_te`;
CREATE TABLE `doi_tac_hop_tac_quoc_te` (
  `id`          INT AUTO_INCREMENT PRIMARY KEY,
  `ten_doi_tac` VARCHAR(200) NOT NULL COMMENT 'CNRS, FPT, PTN, ULB, VNPT, INRIA, IRISA...',
  `logo_url`    VARCHAR(500) NOT NULL COMMENT 'URL file logo',
  `hien_thi_o`  SET('gioi_thieu','nckh') NOT NULL DEFAULT 'gioi_thieu',
  `thu_tu`      INT NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Logo danh sách đối tác hợp tác quốc tế';

-- 4.6 Bảng Banner "Hợp tác cùng chúng tôi"
DROP TABLE IF EXISTS `gioi_thieu_cta_hop_tac`;
CREATE TABLE `gioi_thieu_cta_hop_tac` (
  `id`             INT AUTO_INCREMENT PRIMARY KEY,
  `tieu_de_banner` VARCHAR(255) NOT NULL DEFAULT 'Hợp tác cùng chúng tôi',
  `noi_dung_banner` TEXT NOT NULL COMMENT 'Thông điệp mời hợp tác',
  `button_text`    VARCHAR(100) DEFAULT 'Liên hệ hợp tác',
  `button_link`    VARCHAR(500) DEFAULT 'mailto:tnmthu@ctu.edu.vn'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Banner CTA hợp tác trang Giới thiệu';

-- 4.7 Bảng 3 Thẻ Liên hệ Ban Giám Khoa trên Trang Giới thiệu
DROP TABLE IF EXISTS `gioi_thieu_lien_he_ban_giam_khoa`;
CREATE TABLE `gioi_thieu_lien_he_ban_giam_khoa` (
  `id`                INT AUTO_INCREMENT PRIMARY KEY,
  `nhan_vien_id`      INT DEFAULT NULL COMMENT 'FK liên kết nhan_vien nếu có',
  `ho_ten`            VARCHAR(200) NOT NULL COMMENT 'TS. GVC. Trần Nguyễn Minh Thư...',
  `chuc_vu_phu_trach` VARCHAR(255) NOT NULL COMMENT 'Trưởng khoa · Phụ trách chung...',
  `email`             VARCHAR(200) NOT NULL COMMENT 'Email trực tiếp',
  `thu_tu`            INT NOT NULL DEFAULT 0,
  CONSTRAINT `fk_bangiamkhoa_nhanvien` FOREIGN KEY (`nhan_vien_id`) REFERENCES `nhan_vien` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Thẻ liên hệ Ban Giám Khoa trang Giới thiệu';

-- 4.8 Bảng Thông tin Địa chỉ & Footer Liên hệ Đơn vị
DROP TABLE IF EXISTS `lien_he_don_vi`;
CREATE TABLE `lien_he_don_vi` (
  `id`             INT AUTO_INCREMENT PRIMARY KEY,
  `ten_don_vi`     VARCHAR(200) NOT NULL DEFAULT 'Khoa Khoa học máy tính',
  `truong_don_vi`  VARCHAR(200) NOT NULL DEFAULT 'Trường Công nghệ thông tin và Truyền thông',
  `khu`            VARCHAR(50) NOT NULL DEFAULT 'Khu II',
  `dai_hoc`        VARCHAR(100) NOT NULL DEFAULT 'Đại học Trà Vinh',
  `dia_chi_duong`  VARCHAR(200) NOT NULL DEFAULT 'Đường 3/2',
  `phuong`         VARCHAR(100) NOT NULL DEFAULT 'Phường Ninh Kiều',
  `thanh_pho`      VARCHAR(100) NOT NULL DEFAULT 'Thành phố Cần Thơ',
  `facebook_url`   VARCHAR(500) DEFAULT 'https://www.facebook.com/khmt.dhct',
  `copyright_text` VARCHAR(200) NOT NULL DEFAULT '© 2026 Khoa Khoa học máy tính'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Thông tin liên hệ địa chỉ footer dùng chung';


-- =============================================================================
-- MODULE 5: QUẢN LÝ NGHỊÊN CỨU KHOA HỌC (RESEARCH MANAGEMENT)
-- =============================================================================

-- 5.1 Bảng Header Trang Nghiên cứu khoa học
DROP TABLE IF EXISTS `trang_nckh_header`;
CREATE TABLE `trang_nckh_header` (
  `id`            INT AUTO_INCREMENT PRIMARY KEY,
  `tieu_de_trang` VARCHAR(255) NOT NULL DEFAULT 'Nghiên cứu khoa học',
  `mo_ta_trang`   TEXT NOT NULL COMMENT 'Mô tả tổng quan hướng nghiên cứu'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Header trang Nghiên cứu khoa học';

-- 5.2 Bảng 2 Hướng nghiên cứu chính
DROP TABLE IF EXISTS `huong_nghien_cuu`;
CREATE TABLE `huong_nghien_cuu` (
  `id`     INT AUTO_INCREMENT PRIMARY KEY,
  `ten`    VARCHAR(200) NOT NULL COMMENT 'Khai phá dữ liệu & AI / Đồ họa & Thị giác máy tính',
  `mo_ta`  TEXT NOT NULL COMMENT 'Nội dung chi tiết hướng NC',
  `thu_tu` INT NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='2 hướng nghiên cứu chính của khoa';

-- 5.3 Bảng 5 Đề tài NCKH cấp cơ sở đang thực hiện
DROP TABLE IF EXISTS `de_tai_nghien_cuu`;
CREATE TABLE `de_tai_nghien_cuu` (
  `id`            INT AUTO_INCREMENT PRIMARY KEY,
  `ten_de_tai`    VARCHAR(500) NOT NULL COMMENT 'Tên đề tài (CICTBot, AFF, MINDA, PATUS...)',
  `cap`           VARCHAR(100) NOT NULL DEFAULT 'Đề tài nghiên cứu cấp cơ sở',
  `chu_nhiem_id`  INT DEFAULT NULL COMMENT 'FK tới nhan_vien nếu có',
  `chu_nhiem_ten` VARCHAR(200) NOT NULL COMMENT 'Họ tên Chủ nhiệm đề tài',
  `trang_thai`    VARCHAR(100) NOT NULL DEFAULT 'Đang thực hiện',
  `thu_tu`        INT NOT NULL DEFAULT 0,
  CONSTRAINT `fk_detainckh_nhanvien` FOREIGN KEY (`chu_nhiem_id`) REFERENCES `nhan_vien` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Đề tài NCKH cấp cơ sở của khoa';

-- 5.4 Bảng Công bố khoa học (Citrus Plugin & BibTeX)
DROP TABLE IF EXISTS `cong_bo_khoa_hoc`;
CREATE TABLE `cong_bo_khoa_hoc` (
  `id`                  INT AUTO_INCREMENT PRIMARY KEY,
  `bibtex_key`          VARCHAR(200) DEFAULT NULL UNIQUE COMMENT 'Citation key BibTeX',
  `nam_xuat_ban`        YEAR NOT NULL COMMENT 'Năm công bố (2026, 2025, 2024...)',
  `ten_bai_bao`         VARCHAR(1000) NOT NULL COMMENT 'Tiêu đề bài báo',
  `loai_hinh_cong_bo`   VARCHAR(100) NOT NULL COMMENT 'Conference Paper, Journal Article',
  `tac_gia`             TEXT NOT NULL COMMENT 'Danh sách tác giả',
  `ten_tap_chi_hoi_nghi` VARCHAR(500) NOT NULL COMMENT 'SN Computer Science, FAIR...',
  `bibtex_raw`          TEXT DEFAULT NULL COMMENT 'Chuỗi BibTeX thô',
  `ngay_tao`            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Danh mục công bố khoa học (BibTeX Citrus Plugin)';

-- 5.5 Bảng Đầu mối Liên hệ Nghiên cứu
DROP TABLE IF EXISTS `lien_he_nghien_cuu`;
CREATE TABLE `lien_he_nghien_cuu` (
  `id`               INT AUTO_INCREMENT PRIMARY KEY,
  `ten_daidien`      VARCHAR(200) NOT NULL COMMENT 'TS. GVC. Mã Trường Thành / Khoa KHMT',
  `chuc_vu_nhiem_vu` VARCHAR(500) NOT NULL COMMENT 'Phụ trách NCKH - Trưởng PTN CVIP...',
  `email`            VARCHAR(200) NOT NULL COMMENT 'Email tiếp nhận liên hệ',
  `thu_tu`           INT NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='2 đầu mối liên hệ nghiên cứu khoa học';


-- =============================================================================
-- MODULE 6: QUẢN LÝ ĐÀO TẠO ĐẠI HỌC (UNDERGRADUATE EDUCATION)
-- =============================================================================

-- 6.1 Bảng Thông tin ngành đào tạo Đại học (Kỹ sư Khoa học máy tính / Kỹ sư AI)
DROP TABLE IF EXISTS `chuong_trinh_dao_tao_dai_hoc`;
CREATE TABLE `chuong_trinh_dao_tao_dai_hoc` (
  `id`                 INT AUTO_INCREMENT PRIMARY KEY,
  `ten_nganh`          VARCHAR(300) NOT NULL COMMENT 'Khoa học máy tính / Trí tuệ nhân tạo',
  `ma_tuyen_sinh`      VARCHAR(50) NOT NULL COMMENT '7480101 / 7480107',
  `van_bang_tot_nghiep` VARCHAR(100) NOT NULL DEFAULT 'Kỹ sư',
  `thoi_gian_hoc`      VARCHAR(50) NOT NULL DEFAULT '4.5 Năm',
  `tong_so_tin_chi`    INT NOT NULL DEFAULT 161 COMMENT 'Tổng số tín chỉ',
  `gioi_thieu_nganh`   TEXT NOT NULL COMMENT 'Mô tả tổng quan ngành học',
  `co_hoi_phat_trien`  TEXT NOT NULL COMMENT 'Khả năng ứng dụng sau tốt nghiệp'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Thông tin tổng quan ngành đào tạo Đại học';

-- 6.2 Bảng Phương thức & Tổ hợp xét tuyển Đại học
DROP TABLE IF EXISTS `phuong_thuc_tuyen_sinh`;
CREATE TABLE `phuong_thuc_tuyen_sinh` (
  `id`              INT AUTO_INCREMENT PRIMARY KEY,
  `nganh_id`        INT NOT NULL COMMENT 'FK ngành đại học',
  `ten_phuong_thuc` VARCHAR(255) NOT NULL COMMENT 'Xét THPT, Xét V-SAT, Xét học bạ',
  `danh_sach_to_hop` VARCHAR(255) NOT NULL COMMENT 'A00, A01, X06, X26',
  CONSTRAINT `fk_tuyensinh_nganh` FOREIGN KEY (`nganh_id`) REFERENCES `chuong_trinh_dao_tao_dai_hoc` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Phương thức và tổ hợp môn xét tuyển đại học';

-- 6.3 Bảng Lộ trình học tập & 3 Khối kiến thức
DROP TABLE IF EXISTS `cau_truc_khoi_kien_thuc`;
CREATE TABLE `cau_truc_khoi_kien_thuc` (
  `id`          INT AUTO_INCREMENT PRIMARY KEY,
  `nganh_id`    INT NOT NULL COMMENT 'FK ngành đại học',
  `ten_khoi`    VARCHAR(200) NOT NULL COMMENT 'Kiến thức Đại cương, Cơ sở ngành, Chuyên ngành',
  `so_tin_chi`  INT NOT NULL COMMENT 'Số tín chỉ của khối (56, 46, 59)',
  `mo_ta_khoi`  TEXT NOT NULL COMMENT 'Nội dung các môn học thuộc khối',
  `thu_tu`      INT NOT NULL DEFAULT 0,
  CONSTRAINT `fk_khoikienthuc_nganh` FOREIGN KEY (`nganh_id`) REFERENCES `chuong_trinh_dao_tao_dai_hoc` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Lộ trình 3 khối kiến thức đào tạo đại học';

-- 6.4 Bảng Định hướng nghiên cứu chuyên ngành
DROP TABLE IF EXISTS `dinh_huong_nghien_cuu_chuyen_nganh`;
CREATE TABLE `dinh_huong_nghien_cuu_chuyen_nganh` (
  `id`              INT AUTO_INCREMENT PRIMARY KEY,
  `nganh_id`        INT NOT NULL COMMENT 'FK ngành đại học',
  `ten_dinh_huong`  VARCHAR(255) NOT NULL COMMENT 'Khám phá tri thức & khai mỏ dữ liệu / Đồ họa & thị giác',
  CONSTRAINT `fk_dinhhuong_nganh` FOREIGN KEY (`nganh_id`) REFERENCES `chuong_trinh_dao_tao_dai_hoc` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Định hướng nghiên cứu chuyên ngành đại học';

-- 6.5 Bảng Chuẩn đầu ra (PLOs tiêu biểu)
DROP TABLE IF EXISTS `chuan_dau_ra_plo`;
CREATE TABLE `chuan_dau_ra_plo` (
  `id`           INT AUTO_INCREMENT PRIMARY KEY,
  `nganh_id`     INT NOT NULL COMMENT 'FK ngành đại học',
  `ma_plo`       VARCHAR(20) NOT NULL COMMENT 'PLO3, PLO5, PLO6...',
  `noi_dung_plo` TEXT NOT NULL COMMENT 'Nội dung năng lực chuẩn đầu ra',
  CONSTRAINT `fk_plo_nganh` FOREIGN KEY (`nganh_id`) REFERENCES `chuong_trinh_dao_tao_dai_hoc` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Chuẩn đầu ra PLOs tiêu biểu của ngành';

-- 6.6 Bảng Học phần công nghệ cốt lõi tiêu biểu
DROP TABLE IF EXISTS `hoc_phan_cong_nghe_cot_loi`;
CREATE TABLE `hoc_phan_cong_nghe_cot_loi` (
  `id`                 INT AUTO_INCREMENT PRIMARY KEY,
  `nganh_id`           INT NOT NULL COMMENT 'FK ngành đại học',
  `ma_hoc_phan`        VARCHAR(20) NOT NULL COMMENT 'CT294, CT316E, CT210, CT282E',
  `ten_hoc_phan`       VARCHAR(255) NOT NULL COMMENT 'Máy học ứng dụng, Xử lý ảnh...',
  `so_tin_chi`         INT NOT NULL DEFAULT 3,
  `nang_luc_hinh_thanh` TEXT NOT NULL COMMENT 'Năng lực công nghệ hình thành',
  CONSTRAINT `fk_hocphan_nganh` FOREIGN KEY (`nganh_id`) REFERENCES `chuong_trinh_dao_tao_dai_hoc` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Một số học phần công nghệ cốt lõi tiêu biểu';

-- 6.7 Bảng Vị trí việc làm & Môi trường công tác
DROP TABLE IF EXISTS `co_hoi_nghe_nghiep`;
CREATE TABLE `co_hoi_nghe_nghiep` (
  `id`            INT AUTO_INCREMENT PRIMARY KEY,
  `nganh_id`      INT NOT NULL COMMENT 'FK ngành đại học',
  `loai_thong_tin` ENUM('vi_tri_dam_nhan','moi_truong_cong_tac') NOT NULL,
  `noi_dung`      TEXT NOT NULL COMMENT 'Mô tả vị trí hoặc môi trường công tác',
  `thu_tu`        INT NOT NULL DEFAULT 0,
  CONSTRAINT `fk_nghenghiep_nganh` FOREIGN KEY (`nganh_id`) REFERENCES `chuong_trinh_dao_tao_dai_hoc` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Vị trí việc làm và môi trường công tác sau tốt nghiệp';

-- 6.8 Bảng FAQ Câu hỏi thường gặp Accordion
DROP TABLE IF EXISTS `faq_dai_hoc`;
CREATE TABLE `faq_dai_hoc` (
  `id`      INT AUTO_INCREMENT PRIMARY KEY,
  `cau_hoi` TEXT NOT NULL COMMENT 'Tiêu đề câu hỏi',
  `tra_loi` TEXT NOT NULL COMMENT 'Nội dung trả lời chi tiết',
  `thu_tu`  INT NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='FAQ câu hỏi thường gặp trang đào tạo đại học';


-- =============================================================================
-- MODULE 7: QUẢN LÝ ĐÀO TẠO SAU ĐẠI HỌC (POSTGRADUATE EDUCATION)
-- =============================================================================

-- 7.1 Bảng Thông báo Tuyển sinh Sau Đại học
DROP TABLE IF EXISTS `tuyen_sinh_sau_dai_hoc_thong_bao`;
CREATE TABLE `tuyen_sinh_sau_dai_hoc_thong_bao` (
  `id`                INT AUTO_INCREMENT PRIMARY KEY,
  `tieu_de_thong_bao` VARCHAR(500) NOT NULL COMMENT 'Thông báo tuyển sinh Tiến sĩ, Thạc sĩ...',
  `link_chi_tiet`     VARCHAR(500) DEFAULT NULL,
  `thu_tu`            INT NOT NULL DEFAULT 0,
  `lien_he_tu_van`    VARCHAR(255) NOT NULL DEFAULT 'Khoa Sau Đại học, Đại học Trà Vinh hoặc qua Facebook của Khoa Sau Đại học'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Thông báo tuyển sinh Sau Đại học 2026';

-- 7.2 Bảng Danh sách Nghiên cứu sinh (Tiến sĩ KHMT)
DROP TABLE IF EXISTS `danh_sach_nghien_cuu_sinh`;
CREATE TABLE `danh_sach_nghien_cuu_sinh` (
  `id`                 INT AUTO_INCREMENT PRIMARY KEY,
  `stt`                VARCHAR(10) NOT NULL COMMENT '01, 02...',
  `ho_ten`             VARCHAR(200) NOT NULL COMMENT 'Họ tên Nghiên cứu sinh',
  `chuc_vu_co_quan`    VARCHAR(300) NOT NULL COMMENT 'Chức vụ và Đơn vị công tác',
  `email`              VARCHAR(200) NOT NULL COMMENT 'Email cá nhân NCS',
  `avatar_url`         VARCHAR(500) DEFAULT NULL COMMENT 'Ảnh đại diện NCS',
  `google_scholar_url` VARCHAR(500) DEFAULT NULL COMMENT 'Link Google Scholar nếu có',
  `ma_ncs`             VARCHAR(50) NOT NULL UNIQUE COMMENT 'Mã số NCS (P2425004, P2426001...)',
  `huong_nghien_cuu`   TEXT NOT NULL COMMENT 'Tên đề tài luận án / Hướng nghiên cứu',
  `nguoi_huong_dan`    VARCHAR(300) NOT NULL COMMENT 'Cán bộ hướng dẫn khoa học',
  `trang_thai`         VARCHAR(100) NOT NULL DEFAULT 'Đang học',
  `an_hien`            TINYINT(1) NOT NULL DEFAULT 1,
  `an_hien_ma_ncs`     TINYINT(1) NOT NULL DEFAULT 1,
  `an_hien_email`      TINYINT(1) NOT NULL DEFAULT 1,
  `ngay_tao`           DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Danh sách 7 Nghiên cứu sinh Tiến sĩ KHMT';

-- 7.3 Bảng Thống kê Sau Đại học Chartsy Plugin
DROP TABLE IF EXISTS `thong_ke_sau_dai_hoc_chartsy`;
CREATE TABLE `thong_ke_sau_dai_hoc_chartsy` (
  `id`                 INT AUTO_INCREMENT PRIMARY KEY,
  `tieu_de_bieu_do`   VARCHAR(255) NOT NULL COMMENT 'Số lượng HV & NCS qua các khóa...',
  `moc_thoi_gian_tinh` VARCHAR(100) NOT NULL DEFAULT 'Dữ liệu tính đến tháng 7 năm 2026',
  `chart_config_json`  JSON DEFAULT NULL COMMENT 'Cấu hình ApexCharts JSON'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Thống kê học viên và NCS qua các khóa (Chartsy)';


-- =============================================================================
-- MODULE 8: CƠ SỞ VẬT CHẤT, TIN TỨC VÀ GALLERY (FACILITIES, NEWS & MEDIA)
-- =============================================================================

-- 8.1 Bảng Phòng Thí Nghiệm (CVIP...)
DROP TABLE IF EXISTS `phong_thi_nghiem`;
CREATE TABLE `phong_thi_nghiem` (
  `id`               INT AUTO_INCREMENT PRIMARY KEY,
  `ten`              VARCHAR(300) NOT NULL COMMENT 'Phòng thí nghiệm Thị giác máy tính và Xử lý ảnh (CVIP)...',
  `ten_viet_tat`     VARCHAR(50) DEFAULT NULL COMMENT 'CVIP',
  `truong_phong_id`  INT DEFAULT NULL COMMENT 'FK tới nhan_vien (Mã Trường Thành)',
  `truong_phong_ten` VARCHAR(200) DEFAULT NULL,
  `mo_ta`            TEXT DEFAULT NULL,
  `hinh_anh_url`     VARCHAR(500) DEFAULT NULL,
  CONSTRAINT `fk_ptn_truongphong` FOREIGN KEY (`truong_phong_id`) REFERENCES `nhan_vien` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Danh sách các phòng thí nghiệm trực thuộc khoa';

-- 8.2 Bảng Bài đăng Tin tức / Timeline Hoạt động
DROP TABLE IF EXISTS `tin_tuc`;
CREATE TABLE `tin_tuc` (
  `id`            INT AUTO_INCREMENT PRIMARY KEY,
  `wp_post_id`    INT DEFAULT NULL COMMENT 'ID bài viết WordPress gốc',
  `tieu_de`       VARCHAR(500) NOT NULL COMMENT 'Tiêu đề bài đăng tin tức',
  `slug`          VARCHAR(500) DEFAULT NULL UNIQUE COMMENT 'URL slug chi tiết',
  `ngay_dang`     DATE NOT NULL COMMENT 'Ngày đăng bài',
  `nhan_lon`      VARCHAR(100) DEFAULT NULL COMMENT 'Label ngày lớn timeline (23/7/2026)',
  `nhan_nho`      VARCHAR(200) DEFAULT NULL COMMENT 'Label nhỏ (FJCAI 2026, Địa điểm)',
  `noi_dung_html` LONGTEXT NOT NULL COMMENT 'Nội dung chi tiết bài viết (HTML)',
  `tom_tat`       TEXT DEFAULT NULL COMMENT 'Tóm tắt ngắn bài đăng',
  `icon_svg`      TEXT DEFAULT NULL COMMENT 'Mã SVG Icon timeline',
  `huong_hien_thi` ENUM('left','right') NOT NULL DEFAULT 'right' COMMENT 'Vị trí trên timeline',
  `co_nhan_nho`   TINYINT(1) NOT NULL DEFAULT 0,
  `an_hien`       TINYINT(1) NOT NULL DEFAULT 1,
  `thu_tu`        INT NOT NULL DEFAULT 0,
  `ngay_tao`      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ngay_cap_nhat` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bài đăng tin tức và timeline Hoạt động khoa';

-- 8.3 Bảng Hình ảnh bài viết Tin tức (srcset đa kích thước)
DROP TABLE IF EXISTS `hinh_anh_tin_tuc`;
CREATE TABLE `hinh_anh_tin_tuc` (
  `id`          INT AUTO_INCREMENT PRIMARY KEY,
  `tin_tuc_id`  INT NOT NULL COMMENT 'FK tới tin_tuc',
  `src_chinh`   VARCHAR(500) NOT NULL COMMENT 'URL ảnh hiển thị chính (800px)',
  `srcset_json` JSON DEFAULT NULL COMMENT 'Mảng JSON srcset [{url, width}]',
  `width`       INT DEFAULT 800,
  `height`      INT DEFAULT 450,
  `alt`         VARCHAR(500) DEFAULT '',
  `sizes_attr`  VARCHAR(200) DEFAULT '(max-width: 800px) 100vw, 800px',
  `thu_tu`      INT NOT NULL DEFAULT 1,
  CONSTRAINT `fk_hinhanh_tintuc` FOREIGN KEY (`tin_tuc_id`) REFERENCES `tin_tuc` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Hình ảnh đại diện và srcset đa kích thước bài tin tức';

-- 8.4 Bảng Thư viện ảnh chung (Gallery)
DROP TABLE IF EXISTS `gallery`;
CREATE TABLE `gallery` (
  `id`            INT AUTO_INCREMENT PRIMARY KEY,
  `tieu_de`       VARCHAR(200) DEFAULT NULL COMMENT 'Tiêu đề bức ảnh',
  `mo_ta`         TEXT DEFAULT NULL,
  `anh_url`       VARCHAR(500) NOT NULL COMMENT 'URL file ảnh',
  `thumbnail_url` VARCHAR(500) DEFAULT NULL,
  `danh_muc`      VARCHAR(100) DEFAULT 'Sự kiện' COMMENT 'Sự kiện, Nghiên cứu, Sinh hoạt',
  `ngay_chup`     DATE DEFAULT NULL,
  `alt`           VARCHAR(300) DEFAULT NULL,
  `ngay_tao`      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Thư viện ảnh chung toàn hệ thống';

-- Bật lại kiểm tra khóa ngoại sau khi khởi tạo thành công tất cả 50 bảng
SET FOREIGN_KEY_CHECKS = 1;

-- =============================================================================
-- HOÀN TẤT THIẾT KẾ CSDL CS.CTU.EDU.VN (50 BẢNG SẠCH SẼ, CHUẨN MỰC)
-- =============================================================================
