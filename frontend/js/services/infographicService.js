/**
 * ==========================================================================
 * INFOGRAPHIC DATA SERVICE
 * ==========================================================================
 * Bridges the frontend UI infographic grid with the backend database API.
 * Retrives data from the /api/infographics endpoint, matching the 
 * 'infographic_items' MySQL database table.
 */

// API Endpoint (Change this when backend is ready)
const API_URL = '/api/infographics';

export const InfographicService = {
  /**
   * Fetch list of infographics from the database.
   * Resolves to a JSON array of infographic items or null if the API is offline.
   */
  async getInfographics() {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.warn('API /api/infographics chưa sẵn sàng. Trình duyệt đang sử dụng mockup dữ liệu infographic.', error.message);
      return null;
    }
  }
};

/*
=============================================================================
EXPECTED BACKEND API JSON RESPONSE CONTRACT (For 'infographic_items' table)
=============================================================================
Configure your backend `/api/infographics` endpoint to return a JSON array 
matching the exact schema below. This ensures a clean mapping with the frontend.

[
  {
    "id": 1,
    "ten_infographic": "Đại học - Ngành Khoa học Máy tính",
    "file_anh_url": "assets/infographic/info_khmt.png",
    "file_pdf_url": "assets/infographic/info_khmt.png",
    "thu_tu": 1
  },
  {
    "id": 2,
    "ten_infographic": "Đại học - Ngành Trí tuệ Nhân tạo",
    "file_anh_url": "assets/infographic/info_ttnt.png",
    "file_pdf_url": "assets/infographic/info_ttnt.png",
    "thu_tu": 2
  },
  {
    "id": 3,
    "ten_infographic": "Sau Đại học - Thạc sĩ Khoa học Máy tính",
    "file_anh_url": "assets/infographic/info_thacsi.png",
    "file_pdf_url": "assets/infographic/info_thacsi.png",
    "thu_tu": 3
  },
  {
    "id": 4,
    "ten_infographic": "Sau Đại học - Tiến sĩ Khoa học Máy tính",
    "file_anh_url": "assets/infographic/info_tiensi.png",
    "file_pdf_url": "assets/infographic/info_tiensi.png",
    "thu_tu": 4
  }
]
*/
