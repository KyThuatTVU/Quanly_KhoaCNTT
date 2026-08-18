/**
 * src/modules/auth/repositories/auth.repository.js
 * Data Access Layer cho hệ thống xác thực.
 * Tất cả SQL query liên quan đến auth nằm ở đây.
 */
import pool from '../../../database/index.js';

export const AuthRepository = {

  // ─── ADMIN (tai_khoan_admin_google) ────────────────────────────────────────

  /**
   * Tìm admin theo Google ID
   */
  async findAdminByGoogleId(googleId) {
    const [rows] = await pool.query(
      'SELECT * FROM tai_khoan_admin_google WHERE google_id = ? LIMIT 1',
      [googleId]
    );
    return rows[0] || null;
  },

  /**
   * Tìm admin theo email
   */
  async findAdminByEmail(email) {
    const [rows] = await pool.query(
      'SELECT * FROM tai_khoan_admin_google WHERE email = ? LIMIT 1',
      [email]
    );
    return rows[0] || null;
  },

  /**
   * Cập nhật thông tin admin sau khi đăng nhập Google (upsert)
   */
  async upsertAdminFromGoogle({ googleId, email, hoTen, avatarUrl }) {
    // Tìm theo google_id trước
    const [byGoogleId] = await pool.query(
      'SELECT id FROM tai_khoan_admin_google WHERE google_id = ? LIMIT 1',
      [googleId]
    );

    if (byGoogleId.length > 0) {
      // Cập nhật thông tin và last_login theo google_id
      await pool.query(
        `UPDATE tai_khoan_admin_google
         SET ho_ten = ?, avatar_url = ?, lan_dang_nhap_cuoi = NOW(), ngay_cap_nhat = NOW()
         WHERE google_id = ?`,
        [hoTen, avatarUrl, googleId]
      );
    } else {
      // Tìm theo email (lần đăng nhập Google đầu tiên — admin được tạo trước khi có google_id)
      const [byEmail] = await pool.query(
        'SELECT id FROM tai_khoan_admin_google WHERE email = ? LIMIT 1',
        [email]
      );

      if (byEmail.length > 0) {
        // Cập nhật google_id + avatar_url + last_login
        await pool.query(
          `UPDATE tai_khoan_admin_google
           SET google_id = ?, ho_ten = ?, avatar_url = ?, lan_dang_nhap_cuoi = NOW(), ngay_cap_nhat = NOW()
           WHERE email = ?`,
          [googleId, hoTen, avatarUrl, email]
        );
      }
      // Nếu không tìm thấy cả hai → không tạo mới (chỉ admin được cấp phép mới được đăng nhập)
    }

    // Trả về admin data mới nhất
    const [updated] = await pool.query(
      'SELECT * FROM tai_khoan_admin_google WHERE email = ? LIMIT 1',
      [email]
    );
    return updated[0] || null;
  },

  /**
   * Lấy danh sách tất cả admin
   */
  async getAllAdmins() {
    const [rows] = await pool.query(
      'SELECT id, email, ho_ten, avatar_url, quyen_han, trang_thai, lan_dang_nhap_cuoi, ngay_tao FROM tai_khoan_admin_google ORDER BY id ASC'
    );
    return rows;
  },

  // ─── LECTURER (tai_khoan_nhan_vien) ────────────────────────────────────────

  /**
   * Tìm tài khoản giảng viên theo email
   */
  async findLecturerAccountByEmail(email) {
    const [rows] = await pool.query(
      `SELECT tk.*, nv.ho_ten, nv.anh_ca_nhan_url, nv.hoc_vi, nv.chuc_vu
       FROM tai_khoan_nhan_vien tk
       JOIN nhan_vien nv ON nv.id = tk.nhan_vien_id
       WHERE tk.email = ? LIMIT 1`,
      [email]
    );
    return rows[0] || null;
  },

  /**
   * Tìm tài khoản giảng viên theo ID
   */
  async findLecturerAccountById(id) {
    const [rows] = await pool.query(
      `SELECT tk.*, nv.ho_ten, nv.anh_ca_nhan_url, nv.hoc_vi, nv.chuc_vu
       FROM tai_khoan_nhan_vien tk
       JOIN nhan_vien nv ON nv.id = tk.nhan_vien_id
       WHERE tk.id = ? LIMIT 1`,
      [id]
    );
    return rows[0] || null;
  },

  /**
   * Tìm tài khoản giảng viên theo nhan_vien_id
   */
  async findLecturerAccountByNhanVienId(nhanVienId) {
    const [rows] = await pool.query(
      `SELECT tk.*, nv.ho_ten, nv.anh_ca_nhan_url, nv.hoc_vi, nv.chuc_vu
       FROM tai_khoan_nhan_vien tk
       JOIN nhan_vien nv ON nv.id = tk.nhan_vien_id
       WHERE tk.nhan_vien_id = ? LIMIT 1`,
      [nhanVienId]
    );
    return rows[0] || null;
  },

  /**
   * Cập nhật last_login của giảng viên
   */
  async updateLecturerLastLogin(id) {
    await pool.query(
      'UPDATE tai_khoan_nhan_vien SET lan_dang_nhap_cuoi = NOW() WHERE id = ?',
      [id]
    );
  },

  /**
   * Cập nhật password hash của giảng viên
   */
  async updateLecturerPassword(id, passwordHash) {
    await pool.query(
      `UPDATE tai_khoan_nhan_vien
       SET mat_khau_hash = ?, phai_doi_mat_khau = 0, ngay_cap_nhat = NOW()
       WHERE id = ?`,
      [passwordHash, id]
    );
  },

  /**
   * Tạo tài khoản giảng viên mới
   */
  async createLecturerAccount({ nhanVienId, email, passwordHash, adminId }) {
    const [result] = await pool.query(
      `INSERT INTO tai_khoan_nhan_vien
         (nhan_vien_id, email, mat_khau_hash, nguoi_tao_admin_id, quyen_han, trang_thai, phai_doi_mat_khau)
       VALUES (?, ?, ?, ?, 'STAFF_EDITOR', 1, 1)`,
      [nhanVienId, email, passwordHash, adminId]
    );
    return result.insertId;
  },

  /**
   * Lấy danh sách tất cả tài khoản giảng viên (kèm thông tin nhan_vien)
   */
  async getAllLecturerAccounts() {
    const [rows] = await pool.query(
      `SELECT tk.id, tk.nhan_vien_id, tk.email, tk.quyen_han, tk.trang_thai,
              tk.phai_doi_mat_khau, tk.lan_dang_nhap_cuoi, tk.ngay_tao,
              nv.ho_ten, nv.hoc_vi, nv.chuc_vu, nv.anh_ca_nhan_url
       FROM tai_khoan_nhan_vien tk
       JOIN nhan_vien nv ON nv.id = tk.nhan_vien_id
       ORDER BY nv.ho_ten ASC`
    );
    return rows;
  },

  /**
   * Cập nhật trạng thái tài khoản giảng viên (khóa/mở khóa)
   */
  async updateLecturerStatus(id, trangThai) {
    await pool.query(
      'UPDATE tai_khoan_nhan_vien SET trang_thai = ?, ngay_cap_nhat = NOW() WHERE id = ?',
      [trangThai, id]
    );
  },

  /**
   * Reset mật khẩu giảng viên
   */
  async resetLecturerPassword(id, newPasswordHash) {
    await pool.query(
      `UPDATE tai_khoan_nhan_vien
       SET mat_khau_hash = ?, phai_doi_mat_khau = 1, ngay_cap_nhat = NOW()
       WHERE id = ?`,
      [newPasswordHash, id]
    );
  },

  /**
   * Xóa tài khoản giảng viên
   */
  async deleteLecturerAccount(id) {
    await pool.query('DELETE FROM tai_khoan_nhan_vien WHERE id = ?', [id]);
  },

  // ─── ACTIVITY LOG ──────────────────────────────────────────────────────────

  /**
   * Ghi nhật ký hoạt động
   */
  async logActivity({ userId, userType, hanhDong, moTa, doiTuong, doiTuongId, ip, userAgent }) {
    await pool.query(
      `INSERT INTO nhat_ky_hoat_dong
         (user_id, user_type, hanh_dong, mo_ta, doi_tuong, doi_tuong_id, ip_address, user_agent)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, userType, hanhDong, moTa, doiTuong, doiTuongId, ip, userAgent]
    );
  },

  /**
   * Lấy nhật ký hoạt động gần đây
   */
  async getRecentLogs(limit = 50) {
    const [rows] = await pool.query(
      'SELECT * FROM nhat_ky_hoat_dong ORDER BY ngay_tao DESC LIMIT ?',
      [limit]
    );
    return rows;
  }
};
