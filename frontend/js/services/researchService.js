/**
 * ==========================================================================
 * FACULTY RESEARCH ACTIVITY SERVICE
 * ==========================================================================
 * Service layer for querying the Faculty of Information Technology scientific
 * research directions, active projects, publications (BibTeX-aligned), and contacts.
 * Formatted to align exactly with the database schema structure.
 * Protected by fetchWithCache to prevent duplicate calls and server flooding.
 */

import { fetchWithCache } from '../utils/apiClient.js';

const BASE_URL = `${window.location.port === '5500' ? 'http://localhost:5000' : ''}/api/v1/public`;

export const ResearchService = {
  /**
   * Fetch main research directions (huong_nghien_cuu)
   */
  async getResearchDirections() {
    try {
      const result = await fetchWithCache(`${BASE_URL}/researchDirections`);
      if (result && result.success && Array.isArray(result.data)) {
        return result.data;
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
      const result = await fetchWithCache(`${BASE_URL}/researchProjects`);
      if (result && result.success && Array.isArray(result.data)) {
        return result.data;
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
      const result = await fetchWithCache(`${BASE_URL}/researchPublications`);
      if (result && result.success && Array.isArray(result.data)) {
        return result.data;
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
      const result = await fetchWithCache(`${BASE_URL}/researchContacts`);
      if (result && result.success && Array.isArray(result.data)) {
        return result.data;
      }
    } catch (e) {
      console.error('Lỗi API /api/research/contacts:', e);
    }
    return [];
  }
};
