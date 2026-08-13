/**
 * src/modules/admin/validators/admin.validator.js
 * Input validation layer for the Admin module.
 * Validates entity keys and required fields before they reach the service layer.
 */
import { AdminModel } from '../models/admin.model.js';
import { BadRequestError } from '../../../common/errors/AppError.js';

export const AdminValidator = {
  /**
   * Validate that the entity key exists in TABLE_MAP.
   * Throws BadRequestError if invalid.
   * @param {string} entityKey
   */
  validateEntity(entityKey) {
    if (!entityKey || !AdminModel.isValidEntity(entityKey)) {
      throw new BadRequestError(
        `Entity key '${entityKey}' không hợp lệ. ` +
        `Các entity hợp lệ: ${AdminModel.getAllEntities().slice(0, 5).join(', ')}...`
      );
    }
  },

  /**
   * Validate that required fields are present in the payload.
   * @param {Object} payload
   * @param {string[]} requiredFields
   */
  validateRequiredFields(payload, requiredFields) {
    const missing = requiredFields.filter(
      (field) => payload[field] === undefined || payload[field] === null || payload[field] === ''
    );
    if (missing.length > 0) {
      throw new BadRequestError(`Thiếu các trường bắt buộc: ${missing.join(', ')}`);
    }
  },

  /**
   * Validate that an ID parameter is a valid positive integer.
   * @param {string|number} id
   * @returns {number}
   */
  validateId(id) {
    const parsed = parseInt(id, 10);
    if (isNaN(parsed) || parsed <= 0) {
      throw new BadRequestError(`ID '${id}' không hợp lệ. ID phải là số nguyên dương.`);
    }
    return parsed;
  }
};
