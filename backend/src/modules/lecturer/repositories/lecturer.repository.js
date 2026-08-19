/**
 * src/modules/lecturer/repositories/lecturer.repository.js
 * Truy vấn DB cho module Giảng viên (chỉnh sửa hồ sơ cá nhân)
 */
import pool from '../../../database/index.js';

export const LecturerRepository = {

  /**
   * Lấy thông tin nhan_vien của chính giảng viên
   */
  async getProfile(nhanVienId) {
    const [rows] = await pool.query(
      `SELECT nv.*, tc.email as tc_email, tc.ngach_vien_chuc, tc.hoc_vi as tc_hoc_vi,
              tc.hoc_ham as tc_hoc_ham, tc.don_vi_cong_tac, tc.linh_vuc_nghien_cuu,
              tc.google_scholar_url, tc.orcid_url, tc.github_url, tc.website_ca_nhan
       FROM nhan_vien nv
       LEFT JOIN trang_ca_nhan tc ON tc.nhan_vien_id = nv.id
       WHERE nv.id = ? LIMIT 1`,
      [nhanVienId]
    );
    return rows[0] || null;
  },

  /**
   * Cập nhật thông tin hồ sơ giảng viên (chỉ các field được phép)
   * Admin sẽ dùng API riêng để cập nhật đầy đủ hơn
   */
  async updateProfile(nhanVienId, data) {
    // Chỉ cho phép cập nhật các field an toàn
    const allowedFields = {
      hoc_vi:           data.hoc_vi,
      hoc_ham:          data.hoc_ham,
      ngach_vien_chuc:  data.ngach_vien_chuc,
      don_vi_cong_tac:  data.don_vi_cong_tac,
      anh_ca_nhan_url:  data.anh_ca_nhan_url,
      aria_label_anh:   data.aria_label_anh
    };

    // Loại bỏ undefined
    const updates = Object.fromEntries(
      Object.entries(allowedFields).filter(([, v]) => v !== undefined)
    );

    if (Object.keys(updates).length > 0) {
      const setClauses = Object.keys(updates).map(k => `${k} = ?`).join(', ');
      const values = [...Object.values(updates), nhanVienId];
      await pool.query(
        `UPDATE nhan_vien SET ${setClauses}, ngay_cap_nhat = NOW() WHERE id = ?`,
        values
      );
    }

    // Cập nhật trang_ca_nhan nếu có
    const profileFields = {
      linh_vuc_nghien_cuu: data.linh_vuc_nghien_cuu,
      google_scholar_url:  data.google_scholar_url,
      orcid_url:           data.orcid_url,
      github_url:          data.github_url,
      website_ca_nhan:     data.website_ca_nhan
    };

    const profileUpdates = Object.fromEntries(
      Object.entries(profileFields).filter(([, v]) => v !== undefined)
    );

    if (Object.keys(profileUpdates).length > 0) {
      // Upsert trang_ca_nhan
      const [existing] = await pool.query(
        'SELECT id FROM trang_ca_nhan WHERE nhan_vien_id = ? LIMIT 1',
        [nhanVienId]
      );

      if (existing.length > 0) {
        const setClauses = Object.keys(profileUpdates).map(k => `${k} = ?`).join(', ');
        const values = [...Object.values(profileUpdates), nhanVienId];
        await pool.query(
          `UPDATE trang_ca_nhan SET ${setClauses} WHERE nhan_vien_id = ?`,
          values
        );
      } else {
        profileUpdates.nhan_vien_id = nhanVienId;
        const cols = Object.keys(profileUpdates).join(', ');
        const placeholders = Object.keys(profileUpdates).map(() => '?').join(', ');
        await pool.query(
          `INSERT INTO trang_ca_nhan (${cols}) VALUES (${placeholders})`,
          Object.values(profileUpdates)
        );
      }
    }

    return this.getProfile(nhanVienId);
  },

  /**
   * Fetch all records of a specific entity belonging to the logged-in lecturer.
   */
  async getMyEntityList(tableName, nhanVienId) {
    const orderClause = getSortOrder(tableName);
    const [rows] = await pool.query(
      `SELECT * FROM ?? WHERE nhan_vien_id = ? ORDER BY ${orderClause}`,
      [tableName, nhanVienId]
    );
    return rows;
  },

  /**
   * Create a new entity item scoped to the lecturer.
   */
  async createMyEntityItem(tableName, nhanVienId, data) {
    const payload = { ...data, nhan_vien_id: nhanVienId };
    const [result] = await pool.query('INSERT INTO ?? SET ?', [tableName, payload]);
    return { id: result.insertId, ...payload };
  },

  /**
   * Update an entity item scoped to the lecturer.
   */
  async updateMyEntityItem(tableName, nhanVienId, id, data) {
    const [result] = await pool.query(
      'UPDATE ?? SET ? WHERE id = ? AND nhan_vien_id = ?',
      [tableName, data, id, nhanVienId]
    );
    if (result.affectedRows === 0) {
      throw new Error('Không tìm thấy bản ghi hoặc bạn không có quyền sửa bản ghi này.');
    }
    return { id, ...data, nhan_vien_id: nhanVienId };
  },

  /**
   * Delete an entity item scoped to the lecturer.
   */
  async deleteMyEntityItem(tableName, nhanVienId, id) {
    const [result] = await pool.query(
      'DELETE FROM ?? WHERE id = ? AND nhan_vien_id = ?',
      [tableName, id, nhanVienId]
    );
    if (result.affectedRows === 0) {
      throw new Error('Không tìm thấy bản ghi hoặc bạn không có quyền xóa bản ghi này.');
    }
    return true;
  }
};

function getSortOrder(tableName) {
  switch (tableName) {
    case 'nhan_vien_de_tai_nckh':
      return 'nam_hoan_thanh DESC, stt ASC, id DESC';
    case 'nhan_vien_bai_bao_khoa_hoc':
      return 'nam_xuat_ban DESC, stt ASC, id DESC';
    case 'nhan_vien_huong_dan_nckh':
      return 'nam_bao_ve DESC, id DESC';
    case 'nhan_vien_du_an':
    case 'nhan_vien_sach_giao_trinh':
    case 'trang_ca_nhan':
      return 'id ASC';
    default:
      return 'id DESC';
  }
}
