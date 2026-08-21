/**
 * src/modules/admin/repositories/admin.repository.js
 * Data Access Layer (DAL) for the Admin module.
 * ALL SQL queries live here — no other layer touches the database directly.
 * Controllers and Services call methods on this repository.
 */
import pool from '../../../database/index.js';
import { NotFoundError } from '../../../common/errors/AppError.js';

function getSortOrder(tableName) {
  switch (tableName) {
    // Newest first
    case 'tin_tuc':
      return 'ngay_dang DESC, id DESC';
    case 'cong_bo_khoa_hoc':
      return 'nam_xuat_ban DESC, id DESC';
    case 'nhan_vien_de_tai_nckh':
      return 'nam_hoan_thanh DESC, stt ASC, id DESC';
    case 'nhan_vien_bai_bao_khoa_hoc':
      return 'nam_xuat_ban DESC, stt ASC, id DESC';
    case 'nhan_vien_huong_dan_nckh':
      return 'nam_bao_ve DESC, id DESC';
      
    // Sort by specific columns
    case 'nhan_vien':
      return 'thu_tu_trong_nhom ASC, id ASC';
    case 'danh_sach_nghien_cuu_sinh':
      return 'stt ASC, id ASC';
      
    case 'nhom_nhan_su':
    case 'slider_trang_chu':
    case 'trang_chu_chuong_trinh_noi_bat':
    case 'infographic_items':
    case 'thong_tin_su_kien_tieu_diem':
    case 'thong_ke_noi_bat':
    case 'sinh_vien_tieu_bieu':
    case 'cuu_sinh_vien_tieu_bieu':
    case 'gallery_hoat_dong_trang_chu':
    case 'gioi_thieu_highlights':
    case 'lich_su_hinh_thanh':
    case 'doi_tac_hop_tac_quoc_te':
    case 'gioi_thieu_lien_he_ban_giam_khoa':
    case 'huong_nghien_cuu':
    case 'de_tai_nghien_cuu':
    case 'lien_he_nghien_cuu':
    case 'cau_truc_khoi_kien_thuc':
    case 'faq_dai_hoc':
    case 'tuyen_sinh_sau_dai_hoc_thong_bao':
    case 'gallery':
    case 'co_hoi_nghe_nghiep':
      return 'thu_tu ASC, id ASC';

    // Structured curriculum data (Oldest first / ID Ascending)
    case 'chuan_dau_ra_plo':
    case 'phuong_thuc_tuyen_sinh':
    case 'hoc_phan_cong_nghe_cot_loi':
    case 'dinh_huong_nghien_cuu_chuyen_nganh':
    case 'nhan_vien_du_an':
    case 'nhan_vien_sach_giao_trinh':
    case 'trang_ca_nhan':
    case 'tai_khoan_admin_google':
      return 'id ASC';

    case 'thong_ke_sinh_vien_dai_hoc':
      return 'nganh_id ASC, thu_tu ASC, id ASC';

    default:
      return 'id DESC';
  }
}

export const AdminRepository = {
  /**
   * Fetch all rows from a table, using logical sort order.
   * @param {string} tableName
   * @returns {Promise<Object[]>}
   */
  async getList(tableName) {
    const orderClause = getSortOrder(tableName);
    if (tableName === 'tin_tuc') {
      const [rows] = await pool.query(`
        SELECT t.*, img.src_chinh AS anh_chinh 
        FROM tin_tuc t
        LEFT JOIN hinh_anh_tin_tuc img ON t.id = img.tin_tuc_id
        ORDER BY ${orderClause}
      `);
      return rows;
    }
    const [rows] = await pool.query(`SELECT * FROM ?? ORDER BY ${orderClause}`, [tableName]);
    return rows;
  },

  /**
   * Fetch a single row by its primary key.
   * @param {string} tableName
   * @param {number} id
   * @returns {Promise<Object>}
   */
  async getById(tableName, id) {
    if (tableName === 'tin_tuc') {
      const [rows] = await pool.query(`
        SELECT t.*, img.src_chinh AS anh_chinh 
        FROM tin_tuc t
        LEFT JOIN hinh_anh_tin_tuc img ON t.id = img.tin_tuc_id
        WHERE t.id = ?
        LIMIT 1
      `, [id]);
      if (!rows.length) {
        throw new NotFoundError(`Bản ghi ID ${id} trong bảng '${tableName}'`);
      }
      return rows[0];
    }
    const [rows] = await pool.query('SELECT * FROM ?? WHERE id = ? LIMIT 1', [tableName, id]);
    if (!rows.length) {
      throw new NotFoundError(`Bản ghi ID ${id} trong bảng '${tableName}'`);
    }
    return rows[0];
  },

  /**
   * Check whether a row exists for a given table and id.
   * @param {string} tableName
   * @param {number} id
   * @returns {Promise<boolean>}
   */
  async existsById(tableName, id) {
    const [rows] = await pool.query('SELECT 1 AS found FROM ?? WHERE id = ? LIMIT 1', [tableName, id]);
    return rows.length > 0;
  },

  /**
   * Returns the smallest id from a table, used as a safe fallback.
   * @param {string} tableName
   * @returns {Promise<number|null>}
   */
  async getFirstId(tableName) {
    const [rows] = await pool.query('SELECT id FROM ?? ORDER BY id ASC LIMIT 1', [tableName]);
    return rows.length ? rows[0].id : null;
  },

  /**
   * Insert a new row into a table.
   * @param {string} tableName
   * @param {Object} data - column → value map
   * @returns {Promise<Object>} inserted row with id
   */
  async createItem(tableName, data) {
    if (tableName === 'tin_tuc') {
      const anh_chinh = data.anh_chinh;
      const dbPayload = { ...data };
      delete dbPayload.anh_chinh;

      const [result] = await pool.query('INSERT INTO tin_tuc SET ?', [dbPayload]);
      const tin_tuc_id = result.insertId;

      if (anh_chinh) {
        await pool.query('INSERT INTO hinh_anh_tin_tuc (tin_tuc_id, src_chinh) VALUES (?, ?)', [tin_tuc_id, anh_chinh]);
      }
      return { id: tin_tuc_id, ...data };
    }
    const [result] = await pool.query('INSERT INTO ?? SET ?', [tableName, data]);
    return { id: result.insertId, ...data };
  },

  /**
   * Update an existing row by ID.
   * @param {string} tableName
   * @param {number} id
   * @param {Object} data - columns to update
   * @returns {Promise<Object>} updated row
   */
  async updateItem(tableName, id, data) {
    if (tableName === 'tin_tuc') {
      const anh_chinh = data.anh_chinh;
      const dbPayload = { ...data };
      delete dbPayload.anh_chinh;

      await pool.query('UPDATE tin_tuc SET ? WHERE id = ?', [dbPayload, id]);

      if (anh_chinh !== undefined) {
        const [existing] = await pool.query('SELECT id FROM hinh_anh_tin_tuc WHERE tin_tuc_id = ? LIMIT 1', [id]);
        if (existing.length) {
          await pool.query('UPDATE hinh_anh_tin_tuc SET src_chinh = ? WHERE tin_tuc_id = ?', [anh_chinh, id]);
        } else {
          await pool.query('INSERT INTO hinh_anh_tin_tuc (tin_tuc_id, src_chinh) VALUES (?, ?)', [id, anh_chinh]);
        }
      }
      return { id, ...data };
    }
    const [result] = await pool.query('UPDATE ?? SET ? WHERE id = ?', [tableName, data, id]);
    if (result.affectedRows === 0) {
      throw new NotFoundError(`Bản ghi ID ${id} trong bảng '${tableName}'`);
    }
    return { id, ...data };
  },

  /**
   * Delete a row by ID.
   * @param {string} tableName
   * @param {number} id
   * @returns {Promise<boolean>}
   */
  async deleteItem(tableName, id) {
    const [result] = await pool.query('DELETE FROM ?? WHERE id = ?', [tableName, id]);
    if (result.affectedRows === 0) {
      throw new NotFoundError(`Bản ghi ID ${id} trong bảng '${tableName}'`);
    }
    return true;
  }
};
