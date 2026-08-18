/**
 * ==========================================================================
 * NEWS & EVENTS DATA SERVICE
 * ==========================================================================
 * Bridges the frontend UI news grid component with the backend database API.
 * Retrives data from the /api/news endpoint, matching the 'tin_tuc' and 
 * 'hinh_anh_tin_tuc' MySQL database tables.
 */

// API Endpoint (Change this when backend is ready)
const API_URL = 'http://localhost:5000/api/v1/public/news';

export const NewsService = {
  /**
   * Fetch list of news/events from the database.
   * Resolves to a JSON array of news items or null if the API is offline.
   */
  async getNews() {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      if (result.success && Array.isArray(result.data)) {
        return result.data.map(item => ({
          id: item.id,
          tieu_de: item.tieu_de,
          slug: item.slug,
          ngay_dang: item.ngay_dang,
          nhan_lon: item.nhan_lon || new Date(item.ngay_dang).toLocaleDateString('vi-VN'),
          nhan_nho: item.nhan_nho || 'Tin tức',
          tom_tat: item.tom_tat || '',
          anh_chinh: item.anh_chinh || 'assets/images/news/default.jpg'
        }));
      }
      throw new Error(result.error || 'Dữ liệu không hợp lệ');
    } catch (error) {
      console.warn('API /api/news chưa sẵn sàng. Trình duyệt đang sử dụng mockup dữ liệu tin tức.', error.message);
      return null;
    }
  }
};

/*
=============================================================================
EXPECTED BACKEND API JSON RESPONSE CONTRACT (For 'tin_tuc' & 'hinh_anh_tin_tuc')
=============================================================================
Configure your backend `/api/news` endpoint to return a JSON array matching 
the exact schema below. This ensures a clean mapping with the frontend cards.

[
  {
    "id": 1,
    "tieu_de": "Tham dự hội thảo quốc tế CITA 2026 tại Vịnh Hạ Long, Quảng Ninh",
    "slug": "cita-2026",
    "ngay_dang": "2026-07-19",
    "nhan_lon": "19-07-2026",
    "nhan_nho": "CITA 2026, Vịnh Hạ Long",
    "tom_tat": "Khoa Công nghệ Thông tin - Trường Đại học Trà Vinh đã tham gia và trình bày báo cáo nghiên cứu tại Hội thảo quốc tế về Điện toán và Công nghệ thông tin (CITA 2026) được tổ chức tại thành phố du lịch biển Vịnh Hạ Long, Quảng Ninh.",
    "anh_chinh": "assets/news/news_cita.png"
  },
  {
    "id": 2,
    "tieu_de": "Tham dự hội thảo quốc tế ISDS 2026 tại Yuan Ze University, Taiwan",
    "slug": "isds-2026",
    "ngay_dang": "2026-11-14",
    "nhan_lon": "14-11-2026",
    "nhan_nho": "ISDS 2026, Taiwan",
    "tom_tat": "Đoàn cán bộ nghiên cứu của Khoa đã có chuyến công tác tham gia trình bày báo cáo khoa học tại Hội thảo Quốc tế về Hệ thống Thông tin và Phát triển Dữ liệu (ISDS 2026) diễn ra tại trường Đại học Nguyên Bản (Yuan Ze University), Đài Loan.",
    "anh_chinh": "assets/news/news_isds.png"
  },
  {
    "id": 3,
    "tieu_de": "Tham dự hội thảo quốc tế IUKM 2026 tại Quy Nhơn, Bình Định",
    "slug": "iukm-2026",
    "ngay_dang": "2026-11-14",
    "nhan_lon": "14-11-2026",
    "nhan_nho": "IUKM 2026, Quy Nhơn",
    "tom_tat": "Đại diện giảng viên bộ môn của Khoa tham gia đóng góp chuyên môn và giao lưu trao đổi học thuật tại Hội thảo Khoa học Quốc tế IUKM 2026 tổ chức tại trung tâm hội nghị quốc tế Quy Nhơn, Bình Định.",
    "anh_chinh": "assets/news/news_iukm.png"
  }
]
*/
