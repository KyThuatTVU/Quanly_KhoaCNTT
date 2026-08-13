/**
 * src/modules/admin/dto/update-admin.dto.js
 * Data Transfer Object for UPDATE operations.
 * Re-uses the same column mapping logic as CREATE but is kept separate
 * so UPDATE-specific rules (e.g., no auto-slug regeneration) can diverge.
 */
import { mapCreatePayload } from './create-admin.dto.js';

/**
 * Maps a raw form payload to DB columns for UPDATE.
 * For most entities delegates to create DTO.
 * For staff: skip anh_ca_nhan_url default fallback so existing image is not overwritten.
 * @param {string} entityKey
 * @param {Object} payload
 * @returns {Object}
 */
export function mapUpdatePayload(entityKey, payload) {
  const data = mapCreatePayload(entityKey, payload);

  // Khi UPDATE: tránh ghi đè ảnh cũ bằng giá trị mặc định (default) khi form không tải lên ảnh mới
  const hasNoNewImage = !payload.image_url && !payload.anh_ca_nhan_url && !payload.logo_url && !payload.hinh_anh_url && !payload.file_anh_url && !payload.anh_url && !payload.anh_chinh && !payload.avatar_url && !payload.hinh_anh_avatar_url && !payload.hinh_anh_banner_url;

  if (hasNoNewImage) {
    delete data.anh_ca_nhan_url;
    delete data.hinh_anh_banner_url;
    delete data.hinh_anh_url;
    delete data.file_anh_url;
    delete data.hinh_anh_avatar_url;
    delete data.avatar_url;
    delete data.anh_chinh;
    delete data.anh_url;
  }

  return data;
}
