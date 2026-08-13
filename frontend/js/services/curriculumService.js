/**
 * ==========================================================================
 * FACULTY ACADEMIC CURRICULUM SERVICE
 * ==========================================================================
 * Service layer for querying undergraduate training programs, admission
 * methods, knowledge blocks study paths, research directions, and PLOs.
 * Formatted to align exactly with the database schema structure.
 */

const CURRICULUM_API_BASE = '/api/curriculum';
const BACKEND_BASE = 'http://localhost:5000/api/v1/admin';

const ENDPOINT_MAP = {
  'chuong-trinh-dao-tao-dai-hoc': 'undergradPrograms',
  'cau-truc-khoi-kien-thuc': 'undergradCurriculum',
  'phuong-thuc-tuyen-sinh': 'undergradMethods',
  'chuan-dau-ra-plo': 'undergradPlos',
  'hoc-phan-cong-nghe-cot-loi': 'undergradCourses',
  'faq-dai-hoc': 'undergradFaqs'
};

async function fetchCollection(endpoint) {
  try {
    const urlPath = endpoint.split('?')[0];
    const pathSegments = urlPath.split('/');
    const lastSegment = pathSegments[pathSegments.length - 1];
    
    const entity = ENDPOINT_MAP[lastSegment];
    if (entity) {
      const response = await fetch(`${BACKEND_BASE}/${entity}`);
      if (response.ok) {
        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
          let data = result.data;
          
          const queryParams = new URLSearchParams(endpoint.split('?')[1] || '');
          const nganhId = queryParams.get('nganh_id');
          if (nganhId) {
            data = data.filter(item => parseInt(item.nganh_id, 10) === parseInt(nganhId, 10));
          }
          
          return data;
        }
      }
    }
  } catch (error) {
    console.error(`Lỗi tải dữ liệu từ API ${endpoint}:`, error);
  }

  return [];
}

export const CurriculumService = {
  /**
   * Fetch all undergraduate programs (chuong_trinh_dao_tao_dai_hoc)
   */
  async getPrograms() {
    return fetchCollection(`${CURRICULUM_API_BASE}/chuong-trinh-dao-tao-dai-hoc`);
  },

  /**
   * Fetch study path structures (cau_truc_khoi_kien_thuc) by program ID
   */
  async getStudyPath(programId) {
    return fetchCollection(`${CURRICULUM_API_BASE}/cau-truc-khoi-kien-thuc?nganh_id=${programId}`);
  },

  /**
   * Fetch research orientations (dinh_huong_nghien_cuu_chuyen_nganh) by program ID
   */
  async getResearchOrientations(programId) {
    return fetchCollection(`${CURRICULUM_API_BASE}/dinh-huong-nghien-cuu-chuyen-nganh?nganh_id=${programId}`);
  },

  /**
   * Fetch admission combinations (phuong_thuc_tuyen_sinh) by program ID
   */
  async getAdmissions(programId) {
    return fetchCollection(`${CURRICULUM_API_BASE}/phuong-thuc-tuyen-sinh?nganh_id=${programId}`);
  },

  /**
   * Fetch PLOs (chuan_dau_ra_plo) by program ID
   */
  async getPLOs(programId) {
    return fetchCollection(`${CURRICULUM_API_BASE}/chuan-dau-ra-plo?nganh_id=${programId}`);
  },

  /**
   * Fetch typical core technology courses (hoc_phan_cong_nghe_cot_loi) by program ID
   */
  async getCoreCourses(programId) {
    return fetchCollection(`${CURRICULUM_API_BASE}/hoc-phan-cong-nghe-cot-loi?nganh_id=${programId}`);
  },

  /**
   * Fetch typical job opportunities (co_hoi_nghe_nghiep) by program ID
   */
  async getCareerOpportunities(programId) {
    return fetchCollection(`${CURRICULUM_API_BASE}/co-hoi-nghe-nghiep?nganh_id=${programId}`);
  },

  async getJobOpportunities(programId) {
    return this.getCareerOpportunities(programId);
  },

  /**
   * Fetch FAQ accordion Q&A (faq_dai_hoc)
   */
  async getFAQs() {
    return fetchCollection(`${CURRICULUM_API_BASE}/faq-dai-hoc`);
  },

  /**
   * Fetch student statistics datasets for chart rendering
   */
  async getStudentStats(programId) {
    // Simulated database query results for student counts (retained as mock)
    if (programId === 1) {
      return {
        batches: ['K42', 'K43', 'K44', 'K45', 'K46', 'K47', 'K48', 'K49', 'K50', 'K51', 'K52'],
        studentCounts: [48, 85, 100, 72, 148, 70, 66, 64, 110, 80, 0],
        gradBatches: ['K42', 'K43', 'K44', 'K45', 'K46'],
        graduated: [45, 80, 95, 65, 120],
        onTime: [20, 30, 45, 35, 75],
        early: [0, 5, 12, 8, 10]
      };
    }

    return {
      batches: ['K42', 'K43', 'K44', 'K45', 'K46', 'K47', 'K48', 'K49', 'K50', 'K51', 'K52'],
      studentCounts: [0, 0, 0, 0, 0, 0, 0, 0, 0, 60, 0],
      gradBatches: [],
      graduated: [],
      onTime: [],
      early: []
    };
  }
};
