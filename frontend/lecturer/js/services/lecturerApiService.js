/**
 * LECTURER RESTFUL API SERVICE LAYER
 * Client-side service connecting to the lecturer scoped endpoints.
 */

const BASE_URL = `${window.location.port === '5500' ? 'http://localhost:5000' : ''}/api/lecturer`;

import { getToken, getRedirectUrl } from '../../auth.js';

async function authFetch(url, options = {}) {
  const token = getToken();
  const headers = { ...(options.headers || {}) };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return fetch(url, {
    ...options,
    credentials: 'include',
    headers
  });
}

function redirectToLogin() {
  window.location.href = getRedirectUrl('login');
}

export const LecturerApiService = {
  async getList(entityKey) {
    try {
      const response = await authFetch(`${BASE_URL}/my/${entityKey}`);
      if (!response.ok) {
        if (response.status === 401) {
          redirectToLogin();
          return;
        }
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }
      const result = await response.json();
      if (result.success) return result.data;
      throw new Error(result.error || 'Lấy danh sách thất bại');
    } catch (e) {
      console.error(`Error in getList(${entityKey}):`, e);
      throw e;
    }
  },

  async createItem(entityKey, newItem) {
    try {
      const response = await authFetch(`${BASE_URL}/my/${entityKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem)
      });
      const result = await response.json();
      if (!response.ok) {
        if (response.status === 401) {
          redirectToLogin();
          return;
        }
        throw new Error(result.message || `HTTP Error! Status: ${response.status}`);
      }
      if (result.success) return result.data;
      throw new Error(result.error || 'Thêm bản ghi thất bại');
    } catch (e) {
      console.error(`Error in createItem(${entityKey}):`, e);
      throw e;
    }
  },

  async updateItem(entityKey, id, updatedFields) {
    try {
      const response = await authFetch(`${BASE_URL}/my/${entityKey}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields)
      });
      const result = await response.json();
      if (!response.ok) {
        if (response.status === 401) {
          redirectToLogin();
          return;
        }
        throw new Error(result.message || `HTTP Error! Status: ${response.status}`);
      }
      if (result.success) return result.data;
      throw new Error(result.error || 'Cập nhật bản ghi thất bại');
    } catch (e) {
      console.error(`Error in updateItem(${entityKey}, ${id}):`, e);
      throw e;
    }
  },

  async deleteItem(entityKey, id) {
    try {
      const response = await authFetch(`${BASE_URL}/my/${entityKey}/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        if (response.status === 401) {
          redirectToLogin();
          return;
        }
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }
      const result = await response.json();
      if (result.success) return true;
      throw new Error(result.error || 'Xóa bản ghi thất bại');
    } catch (e) {
      console.error(`Error in deleteItem(${entityKey}, ${id}):`, e);
      throw e;
    }
  }
};
