-- =============================================================================
-- AUTH MIGRATION: Thêm các cột và bảng cần thiết cho hệ thống xác thực
-- Chạy: mysql -u root -p quanly_khoacntt_tvu < add_auth_fields.sql
-- =============================================================================

-- Thêm cột phai_doi_mat_khau nếu chưa có
ALTER TABLE `tai_khoan_nhan_vien`
  ADD COLUMN IF NOT EXISTS `phai_doi_mat_khau` TINYINT(1) NOT NULL DEFAULT 1
    COMMENT '1: Bắt buộc đổi mật khẩu sau lần đăng nhập đầu tiên'
  AFTER `trang_thai`;

-- Bảng lưu session phía server (express-mysql-session)
CREATE TABLE IF NOT EXISTS `sessions` (
  `session_id` VARCHAR(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires`    INT UNSIGNED NOT NULL,
  `data`       MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  PRIMARY KEY (`session_id`),
  INDEX `sessions_expires_idx` (`expires`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Session store cho express-session';

-- Bảng nhật ký hoạt động
CREATE TABLE IF NOT EXISTS `nhat_ky_hoat_dong` (
  `id`          INT AUTO_INCREMENT PRIMARY KEY,
  `user_id`     INT DEFAULT NULL COMMENT 'ID người dùng thực hiện',
  `user_type`   ENUM('admin','lecturer') NOT NULL COMMENT 'Loại tài khoản',
  `hanh_dong`   VARCHAR(100) NOT NULL COMMENT 'Hành động (login, logout, reset_password...)',
  `mo_ta`       TEXT DEFAULT NULL COMMENT 'Mô tả chi tiết',
  `doi_tuong`   VARCHAR(100) DEFAULT NULL COMMENT 'Đối tượng bị tác động',
  `doi_tuong_id` INT DEFAULT NULL COMMENT 'ID đối tượng',
  `ip_address`  VARCHAR(45) DEFAULT NULL COMMENT 'IP người dùng',
  `user_agent`  TEXT DEFAULT NULL COMMENT 'Browser/Client info',
  `ngay_tao`    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Nhật ký hoạt động hệ thống';
