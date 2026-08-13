/**
 * ==========================================================================
 * ADMIN RESTFUL API SERVICE LAYER (MySQL Live Connection)
 * ==========================================================================
 * Client-side service connecting to the backend Express RESTful API server.
 */

const BASE_URL = 'http://localhost:5000/api/v1/admin';

export const AdminApiService = {
  /**
   * Fetch all records of a specific entity from the database
   */
  async getList(entityKey) {
    try {
      const response = await fetch(`${BASE_URL}/${entityKey}`);
      if (!response.ok) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }
      const result = await response.json();
      if (result.success) {
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
        body: JSON.stringify(newItem)
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        // Lấy message lỗi từ backend
        const errorMsg = result.error || result.message || `HTTP Error! Status: ${response.status}`;
        throw new Error(errorMsg);
      }
      
      if (result.success) {
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
        body: JSON.stringify(updatedFields)
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        // Lấy message lỗi từ backend
        const errorMsg = result.error || result.message || `HTTP Error! Status: ${response.status}`;
        throw new Error(errorMsg);
      }
      
      if (result.success) {
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
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }
      const result = await response.json();
      if (result.success) {
        return true;
      }
      throw new Error(result.error || 'Xóa bản ghi thất bại');
    } catch (e) {
      console.error(`Error in deleteItem(${entityKey}, ${id}):`, e);
      throw e;
    }
  }
};
