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
import { BadRequestError }  from '../../../common/errors/AppError.js';
import { memoryCache }      from '../../../common/cache/memoryCache.js';

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

    const created = await AdminRepository.createItem(tableName, mappedData);
    memoryCache.invalidateEntity(entityKey);
    return created;
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

    const updated = await AdminRepository.updateItem(tableName, validId, mappedData);

    // Tự động đồng bộ 2 chiều trường Lĩnh vực nghiên cứu giữa nhan_vien và trang_ca_nhan
    if (entityKey === 'staff' && mappedData.linh_vuc_nghien_cuu !== undefined) {
      try {
        const { default: pool } = await import('../../../database/index.js');
        const [exists] = await pool.query('SELECT id FROM trang_ca_nhan WHERE nhan_vien_id = ? LIMIT 1', [validId]);
        if (exists.length > 0) {
          await pool.query('UPDATE trang_ca_nhan SET linh_vuc_nghien_cuu = ? WHERE nhan_vien_id = ?', [mappedData.linh_vuc_nghien_cuu, validId]);
        } else {
          await pool.query(
            'INSERT INTO trang_ca_nhan (nhan_vien_id, email, ngach_vien_chuc, hoc_vi, hoc_ham, don_vi_cong_tac, linh_vuc_nghien_cuu) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [validId, mappedData.email || '', mappedData.ngach_vien_chuc || 'Giảng viên', mappedData.hoc_vi || 'Cử nhân', mappedData.hoc_ham || '', mappedData.don_vi_cong_tac || 'Khoa Công nghệ thông tin', mappedData.linh_vuc_nghien_cuu]
          );
        }
        memoryCache.invalidateEntity('staffProfiles');
      } catch (errSync) {
        console.warn('Lỗi đồng bộ sang trang_ca_nhan:', errSync.message);
      }
    } else if (entityKey === 'staffProfiles' && mappedData.linh_vuc_nghien_cuu !== undefined) {
      try {
        const { default: pool } = await import('../../../database/index.js');
        let nvId = mappedData.nhan_vien_id;
        if (!nvId) {
          const [prof] = await pool.query('SELECT nhan_vien_id FROM trang_ca_nhan WHERE id = ? LIMIT 1', [validId]);
          nvId = prof[0]?.nhan_vien_id;
        }
        if (nvId) {
          await pool.query('UPDATE nhan_vien SET linh_vuc_nghien_cuu = ? WHERE id = ?', [mappedData.linh_vuc_nghien_cuu, nvId]);
          memoryCache.invalidateEntity('staff');
        }
      } catch (errSync) {
        console.warn('Lỗi đồng bộ sang nhan_vien:', errSync.message);
      }
    }

    memoryCache.invalidateEntity(entityKey);
    return updated;
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
    const deleted = await AdminRepository.deleteItem(tableName, validId);
    memoryCache.invalidateEntity(entityKey);
    return deleted;
  }
};

