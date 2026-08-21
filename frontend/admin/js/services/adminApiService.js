/**
 * ==========================================================================
 * ADMIN RESTFUL API SERVICE LAYER (MySQL Live Connection)
 * ==========================================================================
 * Client-side service connecting to the backend Express RESTful API server.
 *
 * Có cache in-memory: mỗi entityKey chỉ gọi API 1 lần trong vòng TTL_MS (30s).
 * Cache tự động xóa khi có thao tác ghi (create/update/delete).
 */

const BASE_URL = '${window.location.port === '5500' ? 'http://localhost:5000' : ''}/api/v1/admin';

/** Cache store: { entityKey -> { data, expireAt } } */
function redirectToAdminLogin() {
  const dest = window.location.port === '5500' ? '../admin-login.html' : '/admin-login';
  window.location.href = dest;
}

const _cache = new Map();
const TTL_MS = 30_000; // 30 giây

/** Xóa cache cho 1 entity (sau khi ghi dữ liệu) */
function _invalidate(entityKey) {
  _cache.delete(entityKey);
  // Xóa cả các entity liên quan thường dùng chung
  if (entityKey === 'staff') {
    _cache.delete('deans');
    _cache.delete('lecturers');
    _cache.delete('staffProfiles');
  }
}

/** Xóa toàn bộ cache (dùng khi reload trang) */
export function clearApiCache() {
  _cache.clear();
}

export const AdminApiService = {
  /**
   * Fetch all records of a specific entity from the database.
   * Kết quả được cache trong TTL_MS mili-giây để tránh gọi API lặp lại.
   */
  async getList(entityKey) {
    // Kiểm tra cache còn hạn không
    const cached = _cache.get(entityKey);
    if (cached && Date.now() < cached.expireAt) {
      return cached.data;
    }

    try {
      const response = await fetch(`${BASE_URL}/${entityKey}`, {
        credentials: 'include'
      });
      if (!response.ok) {
        if (response.status === 401) {
          redirectToAdminLogin();
          return;
        }
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }
      const result = await response.json();
      if (result.success) {
        // Lưu vào cache
        _cache.set(entityKey, { data: result.data, expireAt: Date.now() + TTL_MS });
        return result.data;
      }
      throw new Error(result.error || 'Lấy danh sách thất bại');
    } catch (e) {
      console.error(`Error in getList(${entityKey}):`, e);
      throw e;
    }
  },

  /**
   * Insert a new record of a specific entity in the database
   */
  async createItem(entityKey, newItem) {
    try {
      const response = await fetch(`${BASE_URL}/${entityKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(newItem)
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          redirectToAdminLogin();
          return;
        }
        const errorMsg = result.error || result.message || `HTTP Error! Status: ${response.status}`;
        throw new Error(errorMsg);
      }

      if (result.success) {
        _invalidate(entityKey); // Xóa cache sau khi thêm mới
        return result.data;
      }
      throw new Error(result.error || 'Thêm bản ghi thất bại');
    } catch (e) {
      console.error(`Error in createItem(${entityKey}):`, e);
      throw e;
    }
  },

  /**
   * Update an existing record in the database by ID
   */
  async updateItem(entityKey, id, updatedFields) {
    try {
      const response = await fetch(`${BASE_URL}/${entityKey}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(updatedFields)
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          redirectToAdminLogin();
          return;
        }
        const errorMsg = result.error || result.message || `HTTP Error! Status: ${response.status}`;
        throw new Error(errorMsg);
      }

      if (result.success) {
        _invalidate(entityKey); // Xóa cache sau khi cập nhật
        return result.data;
      }
      throw new Error(result.error || 'Cập nhật bản ghi thất bại');
    } catch (e) {
      console.error(`Error in updateItem(${entityKey}, ${id}):`, e);
      throw e;
    }
  },

  /**
   * Delete an existing record in the database by ID
   */
  async deleteItem(entityKey, id) {
    try {
      const response = await fetch(`${BASE_URL}/${entityKey}/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!response.ok) {
        if (response.status === 401) {
          redirectToAdminLogin();
          return;
        }
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }
      const result = await response.json();
      if (result.success) {
        _invalidate(entityKey); // Xóa cache sau khi xóa
        return true;
      }
      throw new Error(result.error || 'Xóa bản ghi thất bại');
    } catch (e) {
      console.error(`Error in deleteItem(${entityKey}, ${id}):`, e);
      throw e;
    }
  }
};
