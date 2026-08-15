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
  'cau-truc-khoi-kien-thuc':      'undergradCurriculum',
  'phuong-thuc-tuyen-sinh':       'undergradMethods',
  'chuan-dau-ra-plo':             'undergradPlos',
  'co-hoi-nghe-nghiep':           'undergradCareers',
  'hoc-phan-cong-nghe-cot-loi':   'undergradCourses',
  'thong-ke-sinh-vien-dai-hoc':   'undergradStudentStats',
  'faq-dai-hoc':                  'undergradFaqs'
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
   * Fetch student statistics from DB (thong_ke_sinh_vien_dai_hoc) for chart rendering
   */
  async getStudentStats(programId) {
    try {
      const allRows = await fetchCollection(`${CURRICULUM_API_BASE}/thong-ke-sinh-vien-dai-hoc`);
      const rows = allRows.filter(r => parseInt(r.nganh_id, 10) === parseInt(programId, 10));

      if (rows.length === 0) {
        return { batches: [], studentCounts: [], gradBatches: [], graduated: [], onTime: [], early: [] };
      }

      const batches       = rows.map(r => r.khoa);
      const studentCounts = rows.map(r => parseInt(r.so_sinh_vien, 10) || 0);

      const gradRows    = rows.filter(r => parseInt(r.so_tot_nghiep, 10) > 0);
      const gradBatches = gradRows.map(r => r.khoa);
      const graduated   = gradRows.map(r => parseInt(r.so_tot_nghiep,     10) || 0);
      const onTime      = gradRows.map(r => parseInt(r.so_dung_tien_do,   10) || 0);
      const early       = gradRows.map(r => parseInt(r.so_tot_nghiep_som, 10) || 0);

      return { batches, studentCounts, gradBatches, graduated, onTime, early };
    } catch (err) {
      console.error('Lỗi tải thống kê sinh viên:', err);
      return { batches: [], studentCounts: [], gradBatches: [], graduated: [], onTime: [], early: [] };
    }
  }
};

