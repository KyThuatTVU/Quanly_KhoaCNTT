/**
 * ==========================================================================
 * FACULTY TIMELINE DATA SERVICE
 * ==========================================================================
 * Bridges the frontend UI timeline with the backend database API.
 * Retrieves data from the /api/timeline endpoint, matching the 'lich_su_hinh_thanh' MySQL table.
 */

// API Endpoint (Change this when backend is ready)
const API_TIMELINE_URL = '/api/timeline';

export const TimelineService = {
  /**
   * Fetch all timeline history items from the database.
   * Resolves to a JSON array of timeline milestones or null if the API is offline.
   */
  async getTimeline() {
    try {
      const response = await fetch(API_TIMELINE_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      // Sort data by order order ('thu_tu' or 'nam')
      return data.sort((a, b) => {
        if (a.thu_tu !== b.thu_tu) return a.thu_tu - b.thu_tu;
        return parseInt(a.nam) - parseInt(b.nam);
      });
    } catch (error) {
      console.warn('API /api/timeline chưa sẵn sàng. Trình duyệt đang sử dụng mockup dữ liệu lịch sử khoa.', error.message);
      return null;
    }
  }
};

/*
=============================================================================
EXPECTED BACKEND API JSON RESPONSE CONTRACT (For 'lich_su_hinh_thanh')
=============================================================================
Configure your backend `/api/timeline` endpoint to return a JSON array matching 
the exact schema below.

[
  {
    "id": 1,
    "nam": "2001",
    "ngay_cu_the": "2001-09-05",
    "so_quyet_dinh": "112/QĐ-UBND",
    "noi_dung": "Thành lập <strong>Bộ môn Công nghệ thông tin</strong> thuộc Khoa Kỹ thuật và Công nghệ - tiền thân của Khoa Công nghệ thông tin ngày nay, đặt nền móng cho công cuộc đào tạo kỹ thuật số tại Trà Vinh.",
    "thu_tu": 1
  },
  {
    "id": 2,
    "nam": "2006",
    "ngay_cu_the": "2006-06-19",
    "so_quyet_dinh": "141/2006/QĐ-TTg",
    "noi_dung": "Trường <strong>Đại học Trà Vinh</strong> chính thức được thành lập. Bộ môn CNTT mở rộng chương trình đào tạo đại học hệ chính quy nhằm đáp ứng nhân lực số vùng ĐBSCL.",
    "thu_tu": 2
  },
  {
    "id": 3,
    "nam": "2014",
    "ngay_cu_the": null,
    "so_quyet_dinh": null,
    "noi_dung": "Bắt đầu tuyển sinh và đào tạo trình độ <strong>Thạc sĩ ngành Công nghệ thông tin</strong>, đánh dấu bước phát triển đột phá trong đào tạo sau đại học và nghiên cứu khoa học chuyên sâu.",
    "thu_tu": 3
  },
  {
    "id": 4,
    "nam": "2019",
    "ngay_cu_the": null,
    "so_quyet_dinh": null,
    "noi_dung": "Chương trình đào tạo ngành Công nghệ thông tin hệ Đại học đạt chuẩn <strong>kiểm định chất lượng quốc tế AUN-QA / FIBAA</strong>, khẳng định thương hiệu đào tạo hội nhập quốc tế.",
    "thu_tu": 4
  },
  {
    "id": 5,
    "nam": "2023",
    "ngay_cu_the": null,
    "so_quyet_dinh": null,
    "noi_dung": "Đầu tư phát triển hệ thống <strong>phòng Lab trí tuệ nhân tạo (AI), IoT và an toàn thông tin</strong> hiện đại, thúc đẩy công tác nghiên cứu ứng dụng và chuyển giao công nghệ cho doanh nghiệp.",
    "thu_tu": 5
  }
]
*/
