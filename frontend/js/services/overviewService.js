/**
 * ==========================================================================
 * FACULTY OVERVIEW DATA SERVICE
 * ==========================================================================
 * Bridges the frontend UI overview section with the backend database API.
 * Retrives data from the /api/overview and /api/overview/highlights endpoints,
 * matching the 'gioi_thieu_tong_quan' and 'gioi_thieu_highlights' MySQL tables.
 */

// API Endpoints (Change these when backend is ready)
const API_OVERVIEW_URL = '/api/overview';
const API_HIGHLIGHTS_URL = '/api/overview/highlights';

export const OverviewService = {
  /**
   * Fetch general overview information from the database.
   * Resolves to a JSON object of overview data or null if the API is offline.
   */
  async getOverview() {
    try {
      const response = await fetch(API_OVERVIEW_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.warn('API /api/overview chưa sẵn sàng. Trình duyệt đang sử dụng mockup dữ liệu tổng quan.', error.message);
      return null;
    }
  },

  /**
   * Fetch the 3 highlight cards from the database.
   * Resolves to a JSON array of highlights items or null if the API is offline.
   */
  async getHighlights() {
    try {
      const response = await fetch(API_HIGHLIGHTS_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.warn('API /api/overview/highlights chưa sẵn sàng. Trình duyệt đang sử dụng mockup dữ liệu highlight.', error.message);
      return null;
    }
  }
};

/*
=============================================================================
EXPECTED BACKEND API JSON RESPONSE CONTRACT (For 'gioi_thieu_tong_quan')
=============================================================================
Configure your backend `/api/overview` endpoint to return a JSON object matching 
the exact schema below.

{
  "id": 1,
  "badge_text": "GIỚI THIỆU TỔNG QUAN",
  "tieu_de": "KHOA CÔNG NGHỆ THÔNG TIN",
  "mo_ta_chi_tiet": "Khoa Công nghệ thông tin thuộc Trường Đại học Trà Vinh. Khoa được thành lập với nhiệm vụ đào tạo nguồn nhân lực chất lượng cao, nghiên cứu khoa học và chuyển giao công nghệ hàng đầu trong lĩnh vực Công nghệ thông tin, phục vụ đắc lực cho sự nghiệp công nghiệp hóa, hiện đại hóa của tỉnh Trà Vinh nói riêng và cả nước nói chung.",
  "hinh_anh_tap_the_url": "assets/images/sit_group.png",
  "caption_anh": "Tập thể giảng viên, cán bộ Khoa Công nghệ thông tin - Đại học Trà Vinh"
}

=============================================================================
EXPECTED BACKEND API JSON RESPONSE CONTRACT (For 'gioi_thieu_highlights')
=============================================================================
Configure your backend `/api/overview/highlights` endpoint to return a JSON array 
matching the exact schema below.

[
  {
    "id": 1,
    "icon_class": "graduation-cap",
    "tieu_de": "Chương trình đào tạo",
    "mo_ta": "Chương trình đào tạo tiên tiến, cung ứng nguồn nhân lực chất lượng cao cho doanh nghiệp.",
    "thu_tu": 1
  },
  {
    "id": 2,
    "icon_class": "flask",
    "tieu_de": "Nghiên cứu khoa học",
    "mo_ta": "Đẩy mạnh nghiên cứu ứng dụng, chuyển giao công nghệ và các công bố khoa học uy tín.",
    "thu_tu": 2
  },
  {
    "id": 3,
    "icon_class": "share-2",
    "tieu_de": "Chuyển giao công nghệ",
    "mo_ta": "Ứng dụng các giải pháp công nghệ số thực tiễn phục vụ sự phát triển của cộng đồng.",
    "thu_tu": 3
  }
]
*/
