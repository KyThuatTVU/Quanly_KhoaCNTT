/**
 * ==========================================================================
 * FACULTY RESEARCH ACTIVITY SERVICE
 * ==========================================================================
 * Service layer for querying the Faculty of Information Technology scientific
 * research directions, active projects, publications (BibTeX-aligned), and contacts.
 * Formatted to align exactly with the database schema structure.
 */

export const ResearchService = {
  /**
   * Fetch main research directions (huong_nghien_cuu)
   */
  async getResearchDirections() {
    try {
      const response = await fetch('http://localhost:5000/api/v1/admin/researchDirections');
      if (response.ok) {
        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
          return result.data;
        }
      }
    } catch (e) {
      console.error('Lỗi API /api/research/directions:', e);
    }
    return [];
  },

  /**
   * Fetch active research topics/projects (de_tai_nghien_cuu)
   */
  async getResearchTopics() {
    try {
      const response = await fetch('http://localhost:5000/api/v1/admin/researchProjects');
      if (response.ok) {
        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
          return result.data;
        }
      }
    } catch (e) {
      console.error('Lỗi API /api/research/topics:', e);
    }
    return [];
  },

  /**
   * Fetch scientific publications grouped by year (cong_bo_khoa_hoc)
   */
  async getScientificPublications() {
    try {
      const response = await fetch('http://localhost:5000/api/v1/admin/researchPublications');
      if (response.ok) {
        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
          return result.data;
        }
      }
    } catch (e) {
      console.error('Lỗi API /api/research/publications:', e);
    }
    return [];
  },

  /**
   * Fetch research contact information (lien_he_nghien_cuu)
   */
  async getResearchContacts() {
    try {
      const response = await fetch('http://localhost:5000/api/v1/admin/researchContacts');
      if (response.ok) {
        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
          return result.data;
        }
      }
    } catch (e) {
      console.error('Lỗi API /api/research/contacts:', e);
    }
    return [];
  }
};
