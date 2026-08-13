/**
 * src/modules/admin/services/admin.service.js
 * Business Logic Layer for the Admin module.
 *
 * Responsibilities:
 *  - Validate entity keys (via AdminModel)
 *  - Map payloads to DB columns (via DTOs)
 *  - Delegate data access to AdminRepository
 *  - Apply any business rules (e.g., auto-slug, default values)
 *
 * Controllers call Service; Service calls Repository.
 * Service NEVER writes SQL directly.
 */
import { AdminModel }      from '../models/admin.model.js';
import { AdminRepository } from '../repositories/admin.repository.js';
import { AdminValidator }  from '../validators/admin.validator.js';
import { mapCreatePayload } from '../dto/create-admin.dto.js';
import { mapUpdatePayload } from '../dto/update-admin.dto.js';
import { BadRequestError } from '../../../common/errors/AppError.js';

async function resolveValidStaffGroupId(preferredGroupId) {
  const staffGroupsTable = AdminModel.getTableName('staffGroups');
  const preferredId = Number.parseInt(preferredGroupId, 10);

  if (Number.isInteger(preferredId) && preferredId > 0) {
    if (await AdminRepository.existsById(staffGroupsTable, preferredId)) {
      return preferredId;
    }
  }

  const fallbackId = await AdminRepository.getFirstId(staffGroupsTable);
  if (fallbackId) {
    return fallbackId;
  }

  throw new BadRequestError('Bảng nhóm nhân sự đang trống, không thể tạo hoặc cập nhật giảng viên.');
}

export const AdminService = {
  /**
   * Retrieve all records for a given entity.
   * @param {string} entityKey
   * @returns {Promise<Object[]>}
   */
  async getList(entityKey) {
    AdminValidator.validateEntity(entityKey);
    const tableName = AdminModel.getTableName(entityKey);
    return AdminRepository.getList(tableName);
  },

  /**
   * Create a new record for a given entity.
   * @param {string} entityKey
   * @param {Object} rawPayload - raw form body
   * @returns {Promise<Object>} created record
   */
  async createItem(entityKey, rawPayload) {
    AdminValidator.validateEntity(entityKey);
    const tableName = AdminModel.getTableName(entityKey);
    const mappedData = mapCreatePayload(entityKey, rawPayload);

    // Validation for staffPapers
    if (entityKey === 'staffPapers') {
      if (!mappedData.ten_bai_bao || mappedData.ten_bai_bao.trim() === '') {
        throw new BadRequestError('Tên bài báo không được để trống');
      }
    }

    if (entityKey === 'staff') {
      mappedData.nhom_id = await resolveValidStaffGroupId(rawPayload?.nhom_id);
    }

    return AdminRepository.createItem(tableName, mappedData);
  },

  /**
   * Update an existing record.
   * @param {string} entityKey
   * @param {number|string} id
   * @param {Object} rawPayload
   * @returns {Promise<Object>} updated record
   */
  async updateItem(entityKey, id, rawPayload) {
    AdminValidator.validateEntity(entityKey);
    const validId = AdminValidator.validateId(id);
    const tableName = AdminModel.getTableName(entityKey);
    const mappedData = mapUpdatePayload(entityKey, rawPayload);

    if (entityKey === 'staff') {
      if (rawPayload?.nhom_id === undefined || rawPayload?.nhom_id === null || rawPayload?.nhom_id === '') {
        delete mappedData.nhom_id;
      } else {
        mappedData.nhom_id = await resolveValidStaffGroupId(rawPayload.nhom_id);
      }
    }

    return AdminRepository.updateItem(tableName, validId, mappedData);
  },

  /**
   * Delete a record by ID.
   * @param {string} entityKey
   * @param {number|string} id
   * @returns {Promise<boolean>}
   */
  async deleteItem(entityKey, id) {
    AdminValidator.validateEntity(entityKey);
    const validId = AdminValidator.validateId(id);
    const tableName = AdminModel.getTableName(entityKey);
    return AdminRepository.deleteItem(tableName, validId);
  }
};
