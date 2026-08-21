/**
 * ==========================================================================
 * COUNTER STATS DATA SERVICE
 * ==========================================================================
 * Bridges the frontend UI stats counters with the backend database API.
 * Retrives data from the /api/stats endpoint, matching the 
 * 'thong_ke_noi_bat' MySQL database table.
 */

// API Endpoint (Change this when backend is ready)
const API_URL = '${window.location.port === '5500' ? 'http://localhost:5000' : ''}/api/v1/public/stats';

export const StatsService = {
  /**
   * Fetch list of statistics from the database.
   * Resolves to a JSON array of stat items or null if the API is offline.
   */
  async getStats() {
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
      console.warn('API /api/stats chưa sẵn sàng. Trình duyệt đang sử dụng mockup dữ liệu thống kê.', error.message);
      return null;
    }
  }
};

/*
=============================================================================
EXPECTED BACKEND API JSON RESPONSE CONTRACT (For 'thong_ke_noi_bat' table)
=============================================================================
Configure your backend `/api/stats` endpoint to return a JSON array matching 
the exact schema below. This ensures a clean mapping with the frontend.

[
  {
    "id": 1,
    "ten_chi_so": "Sinh viên",
    "so_lieu_thong_ke": 1063,
    "don_vi": "+",
    "ghi_chu_thoi_gian": "Số liệu thống kê đến tháng 12/2025",
    "thu_tu": 1
  },
  {
    "id": 2,
    "ten_chi_so": "Học viên sau đại học",
    "so_lieu_thong_ke": 234,
    "don_vi": "+",
    "ghi_chu_thoi_gian": "Số liệu thống kê đến tháng 12/2025",
    "thu_tu": 2
  },
  {
    "id": 3,
    "ten_chi_so": "Đề tài NCKH",
    "so_lieu_thong_ke": 15,
    "don_vi": "+",
    "ghi_chu_thoi_gian": "Số liệu thống kê đến tháng 12/2025",
    "thu_tu": 3
  },
  {
    "id": 4,
    "ten_chi_so": "Bài báo",
    "so_lieu_thong_ke": 60,
    "don_vi": "+",
    "ghi_chu_thoi_gian": "Số liệu thống kê đến tháng 12/2025",
    "thu_tu": 4
  },
  {
    "id": 5,
    "ten_chi_so": "Dự án quốc tế",
    "so_lieu_thong_ke": 3,
    "don_vi": "+",
    "ghi_chu_thoi_gian": "Số liệu thống kê đến tháng 12/2025",
    "thu_tu": 5
  }
]
*/
