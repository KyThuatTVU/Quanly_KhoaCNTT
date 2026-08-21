/**
 * ==========================================================================
 * ALUMNI DATA SERVICE
 * ==========================================================================
 * Bridges the frontend UI alumni showcase with the backend database API.
 * Retrives data from the /api/alumni endpoint, matching the 
 * 'cuu_sinh_vien_tieu_bieu' MySQL database table.
 */

// API Endpoint (Change this when backend is ready)
const API_URL = '${window.location.port === '5500' ? 'http://localhost:5000' : ''}/api/v1/public/alumni';

export const AlumniService = {
  /**
   * Fetch list of outstanding alumni from the database.
   * Resolves to a JSON array of alumni items or null if the API is offline.
   */
  async getAlumni() {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      if (result.success && Array.isArray(result.data)) {
        return result.data;
      }
      throw new Error(result.error || 'Dữ liệu không hợp lệ');
    } catch (error) {
      console.warn('API /api/alumni chưa sẵn sàng. Trình duyệt đang sử dụng mockup dữ liệu cựu sinh viên.', error.message);
      return null;
    }
  }
};

/*
=============================================================================
EXPECTED BACKEND API JSON RESPONSE CONTRACT (For 'cuu_sinh_vien_tieu_bieu')
=============================================================================
Configure your backend `/api/alumni` endpoint to return a JSON array matching 
the exact schema below. This ensures a clean mapping with the frontend.

[
  {
    "id": 1,
    "ho_ten": "Trần Hoàng Thảo Nguyên",
    "chuc_danh_cong_ty": "Data Engineer @ PTN Global\nMEng. in Human Computer Interaction @ KIT",
    "trich_dan_cam_nhan": "Những kiến thức nền tảng và kỹ năng nghiên cứu tại Khoa đã giúp tôi tự tin phát triển trong môi trường công nghệ.",
    "hinh_anh_avatar_url": "assets/alumni/alumni_nguyen.png",
    "thu_tu": 1
  },
  {
    "id": 2,
    "ho_ten": "Tạ Đặng Vĩnh Phúc",
    "chuc_danh_cong_ty": "Co-Founder @ Flux Astromesh\nDoanh nghiệp chuyển đổi số",
    "trich_dan_cam_nhan": "Chương trình học giúp tôi có nền tảng tốt về dữ liệu, lập trình và tư duy giải quyết vấn đề.",
    "hinh_anh_avatar_url": "assets/alumni/alumni_phuc.png",
    "thu_tu": 2
  },
  {
    "id": 3,
    "ho_ten": "Trần Quốc Khang",
    "chuc_danh_cong_ty": "Trợ giảng @ Khoa Khoa học máy tính\nĐại học Trà Vinh",
    "trich_dan_cam_nhan": "Môi trường học thuật tại Khoa là nền tảng quan trọng giúp tôi tiếp tục theo đuổi nghiên cứu và ứng dụng AI.",
    "hinh_anh_avatar_url": "assets/alumni/alumni_khang.png",
    "thu_tu": 3
  }
]
*/
