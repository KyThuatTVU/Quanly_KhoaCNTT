/**
 * src/modules/admin/models/admin.model.js
 * Admin module model layer.
 * Defines the mapping between entity keys and database table names.
 * Also documents the column structure of each table for reference.
 */
import { TABLE_MAP } from '../../../constants/index.js';

export class AdminModel {
  /**
   * Returns the MySQL table name for a given entity key.
   * @param {string} entityKey
   * @returns {string} tableName
   */
  static getTableName(entityKey) {
    return TABLE_MAP[entityKey] || null;
  }

  /**
   * Checks whether an entity key is registered and safe to query.
   * @param {string} entityKey
   * @returns {boolean}
   */
  static isValidEntity(entityKey) {
    return Object.prototype.hasOwnProperty.call(TABLE_MAP, entityKey);
  }

  /**
   * Returns all registered entity keys.
   * @returns {string[]}
   */
  static getAllEntities() {
    return Object.keys(TABLE_MAP);
  }
}
