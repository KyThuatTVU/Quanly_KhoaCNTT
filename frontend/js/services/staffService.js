/**
 * ==========================================================================
 * FACULTY STAFF PROFILE & RESEARCH SERVICE
 * ==========================================================================
 * Service layer for querying the Faculty of Information Technology staff members
 * and their academic portfolio details (Publications, Books, Projects, Supervisions).
 * Formatted to align exactly with the database schema structure.
 */

export const StaffService = {
  /**
   * Fetch all staff members (leaders and lecturers) grouped by their categories
   */
  async getStaffList() {
    try {
      const response = await fetch(`${window.location.port === '5500' ? 'http://localhost:5000' : ''}/api/v1/public/staff`);
      if (response.ok) {
        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
          return result.data;
        }
      }
    } catch (e) {
      console.error('Lỗi API /api/staff:', e);
    }
    return [];
  },

  /**
   * Fetch all staff groups from CSDL nhom_nhan_su
   */
  async getStaffGroups() {
    try {
      const response = await fetch(`${window.location.port === '5500' ? 'http://localhost:5000' : ''}/api/v1/public/staffGroups`);
      if (response.ok) {
        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
          return result.data;
        }
      }
    } catch (e) {
      console.error('Lỗi API /api/staffGroups:', e);
    }
    return [];
  },

  /**
   * Fetch a lecturer's general profile page overview (trang_ca_nhan) by staff ID
   */
  async getStaffProfile(staffId) {
    try {
      const response = await fetch(`${window.location.port === '5500' ? 'http://localhost:5000' : ''}/api/v1/public/staffProfiles`);
      if (response.ok) {
        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
          const profile = result.data.find(p => parseInt(p.nhan_vien_id, 10) === parseInt(staffId, 10));
          if (profile) return profile;
        }
      }
    } catch (e) {
      console.error(`Lỗi API lấy Trang cá nhân giảng viên #${staffId}:`, e);
    }
    return null;
  },

  /**
   * Fetch research projects by staff ID (nhan_vien_de_tai_nckh)
   */
  async getStaffResearchProjects(staffId) {
    try {
      const response = await fetch(`${window.location.port === '5500' ? 'http://localhost:5000' : ''}/api/v1/public/staffResearch`);
      if (response.ok) {
        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
          return result.data.filter(p => parseInt(p.nhan_vien_id, 10) === parseInt(staffId, 10));
        }
      }
    } catch (e) {
      console.error(`Lỗi API lấy Đề tài NCKH Giảng viên #${staffId}:`, e);
    }
    return [];
  },

  /**
   * Fetch projects by staff ID (nhan_vien_du_an)
   */
  async getStaffProjects(staffId) {
    try {
      const response = await fetch(`${window.location.port === '5500' ? 'http://localhost:5000' : ''}/api/v1/public/staffProjects`);
      if (response.ok) {
        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
          return result.data.filter(p => parseInt(p.nhan_vien_id, 10) === parseInt(staffId, 10));
        }
      }
    } catch (e) {
      console.error(`Lỗi API lấy Dự án Giảng viên #${staffId}:`, e);
    }
    return [];
  },

  /**
   * Fetch scientific publications by staff ID (nhan_vien_bai_bao_khoa_hoc)
   */
  async getStaffPublications(staffId) {
    try {
      const response = await fetch(`${window.location.port === '5500' ? 'http://localhost:5000' : ''}/api/v1/public/staffPapers`);
      if (response.ok) {
        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
          return result.data.filter(p => parseInt(p.nhan_vien_id, 10) === parseInt(staffId, 10));
        }
      }
    } catch (e) {
      console.error(`Lỗi API lấy Bài báo Giảng viên #${staffId}:`, e);
    }
    return [];
  },

  /**
   * Fetch books & syllabus by staff ID (nhan_vien_sach_giao_trinh)
   */
  async getStaffBooks(staffId) {
    try {
      const response = await fetch(`${window.location.port === '5500' ? 'http://localhost:5000' : ''}/api/v1/public/staffBooks`);
      if (response.ok) {
        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
          return result.data.filter(b => parseInt(b.nhan_vien_id, 10) === parseInt(staffId, 10));
        }
      }
    } catch (e) {
      console.error(`Lỗi API lấy Sách & Giáo trình Giảng viên #${staffId}:`, e);
    }
    return [];
  },

  /**
   * Fetch student research & thesis supervision by staff ID (nhan_vien_huong_dan_nckh)
   */
  async getStaffSupervisions(staffId) {
    try {
      const response = await fetch(`${window.location.port === '5500' ? 'http://localhost:5000' : ''}/api/v1/public/staffSupervisions`);
      if (response.ok) {
        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
          return result.data.filter(s => parseInt(s.nhan_vien_id, 10) === parseInt(staffId, 10));
        }
      }
    } catch (e) {
      console.error(`Lỗi API lấy Hướng dẫn NCKH Giảng viên #${staffId}:`, e);
    }
    return [];
  }
};
