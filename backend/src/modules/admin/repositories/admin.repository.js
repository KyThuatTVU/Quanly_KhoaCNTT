/**
 * src/modules/admin/repositories/admin.repository.js
 * Data Access Layer (DAL) for the Admin module.
 * ALL SQL queries live here — no other layer touches the database directly.
 * Controllers and Services call methods on this repository.
 */
import pool from '../../../database/index.js';
import { NotFoundError } from '../../../common/errors/AppError.js';

export const AdminRepository = {
  /**
   * Fetch all rows from a table, newest first.
   * @param {string} tableName
   * @returns {Promise<Object[]>}
   */
  async getList(tableName) {
    const [rows] = await pool.query('SELECT * FROM ?? ORDER BY id DESC', [tableName]);
    return rows;
  },

  /**
   * Fetch a single row by its primary key.
   * @param {string} tableName
   * @param {number} id
   * @returns {Promise<Object>}
   */
  async getById(tableName, id) {
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
