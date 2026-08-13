/**
 * ==========================================================================
 * FACULTY POSTGRADUATE SERVICE
 * ==========================================================================
 * Service layer for querying postgraduate admissions notices, PhD students
 * directory, activities photo gallery, and statistical charts.
 * Formatted to align exactly with the database schema structure (Module 7).
 */

export const PostgraduateService = {
  /**
   * Fetch admissions notices (tuyen_sinh_sau_dai_hoc_thong_bao)
   */
  async getAdmissionsNotices() {
    try {
      const response = await fetch('http://localhost:5000/api/v1/admin/postgradNotices');
      if (response.ok) {
        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
          const notices = result.data;
          const contact_info = notices[0]?.lien_he_tu_van || 'Khoa Sau Đại học';
          return {
            title: 'Tuyển sinh Sau Đại học',
            notices: notices,
            contact_info: contact_info
          };
        }
      }
    } catch (e) {
      console.error('Lỗi API /api/postgraduate/notices:', e);
    }
    return {
      title: 'Tuyển sinh Sau Đại học',
      notices: [],
      contact_info: ''
    };
  },

  /**
   * Fetch PhD candidates directory (danh_sach_nghien_cuu_sinh)
   */
  async getPhDStudents() {
    try {
      const response = await fetch('http://localhost:5000/api/v1/admin/postgradPhdStudents');
      if (response.ok) {
        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
          return result.data.map(student => ({
            id: student.id,
            stt: student.stt || '01',
            ho_ten: student.ho_ten,
            chuc_vu_co_quan: student.chuc_vu_co_quan,
            email: student.email,
            google_scholar_url: student.google_scholar_url,
            ma_ncs: student.ma_ncs,
            huong_nghien_cuu: student.huong_nghien_cuu,
            nguoi_huong_dan: student.nguoi_huong_dan,
            trang_thai: student.trang_thai || 'Đang học',
            avatar_url: student.avatar_url || 'assets/images/default-avatar.png'
          }));
        }
      }
    } catch (e) {
      console.error('Lỗi API /api/postgraduate/phd-students:', e);
    }
    return [];
  },

  /**
   * Fetch postgraduate student activities media gallery
   */
  async getActivities() {
    try {
      const response = await fetch('http://localhost:5000/api/v1/admin/postgradActivities');
      if (response.ok) {
        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
          return result.data;
        }
      }
    } catch (e) {
      console.error('Lỗi API /api/postgraduate/activities:', e);
    }
    return [];
  },

  /**
   * Fetch postgraduate student statistics datasets
   */
  async getStats() {
    try {
      const response = await fetch('http://localhost:5000/api/v1/admin/postgradStats');
      if (response.ok) {
        const result = await response.json();
        if (result.success && Array.isArray(result.data) && result.data.length > 0) {
          const config = result.data[0].chart_config_json;
          const stats = typeof config === 'string' ? JSON.parse(config) : config;
          if (stats && stats.batches) {
            return stats;
          }
        }
      }
    } catch (e) {
      console.error('Lỗi API /api/postgraduate/stats:', e);
    }
    return {
      batches: [],
      masterCounts: [],
      phdCounts: [],
      gradBatches: [],
      graduated: [],
      onTime: []
    };
  }
};
