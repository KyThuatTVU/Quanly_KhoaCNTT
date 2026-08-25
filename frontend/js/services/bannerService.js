/**
 * ==========================================================================
 * BANNER DATA SERVICE
 * ==========================================================================
 * Bridges the frontend UI slider component with the backend database API.
 * Contains the API URL configurations, data retrieval logic, and documented 
 * JSON Schema required for future database integration.
 */

// API Endpoint (Change this when backend is ready)
const API_URL = `${window.location.port === '5500' ? 'http://localhost:5000' : ''}/api/v1/public/sliders`;

export const BannerService = {
  /**
   * Fetch banner slides from the backend MySQL database.
   * Resolves to a JSON array of slides or null if the API is offline.
   */
  async getBanners() {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`Lỗi HTTP! Trạng thái: ${response.status}`);
      }
      const result = await response.json();
      if (result.success && Array.isArray(result.data)) {
        return result.data
          .sort((a, b) => (a.thu_tu || 0) - (b.thu_tu || 0))
          .map(item => ({
            id: item.id,
            titleVn: item.ten_slide || '',
            // bgImage: store the path exactly as returned from DB
            // slider component will prepend assetPrefix (./ or ../) itself
            bgImage: item.hinh_anh_url || '',
            actionUrl: item.link_lien_ket || '#',
            actionText: 'Khám phá ngay',
          }));
      }
      throw new Error(result.error || 'Dữ liệu không hợp lệ');
    } catch (error) {
      console.warn('API /api/sliders chưa sẵn sàng, sử dụng dữ liệu mặc định.', error.message);
      return null;
    }
  }
};

/*
=============================================================================
EXPECTED BACKEND API JSON RESPONSE CONTRACT (For MySQL slider_trang_chu table)
=============================================================================
When you implement the backend, configure the `/api/banners` endpoint to return 
a JSON array matching the exact structure below.

[
  {
    "id": 1,
    "type": "welcome",
    "titleVn": "Khoa Công nghệ Thông tin",
    "titleEn": "TRƯỜNG ĐẠI HỌC TRÀ VINH",
    "description": "Nơi khởi đầu của những kỹ sư và nhà khoa học công nghệ xuất sắc, đáp ứng thời đại công nghệ số.",
    "bgImage": "assets/banners/slide_fit.png",
    "actionText": "Khám phá ngay",
    "actionUrl": "#programs-section",
    "extra": {
      "stats": [
        { "value": "2000+", "label": "Sinh viên" },
        { "value": "50+", "label": "Giảng viên" },
        { "value": "AUN-QA", "label": "Kiểm định" }
      ]
    }
  },
  {
    "id": 2,
    "type": "admissions",
    "titleVn": "Kỹ sư Trí tuệ Nhân tạo",
    "titleEn": "ĐÀO TẠO MŨI NHỌN CÔNG NGHỆ",
    "description": "Làm chủ các mô hình học máy nâng cao, xử lý ngôn ngữ tự nhiên và phát triển robot thông minh.",
    "bgImage": "assets/banners/slide_ai.png",
    "actionText": "Đăng ký xét tuyển",
    "actionUrl": "../undergraduate/",
    "extra": {
      "stats": [
        { "value": "100%", "label": "Học bổng doanh nghiệp" },
        { "value": "AI Lab", "label": "Cấu hình cao" },
        { "value": "Lương cao", "label": "Cơ hội rộng mở" }
      ]
    }
  },
  {
    "id": 3,
    "type": "campaign",
    "titleVn": "Có những ước mơ",
    "titleEn": "được dựng xây",
    "description": "nhờ sự chung sức của cả cộng đồng.",
    "bgImage": "assets/banners/slide_campaign.png",
    "extra": {
      "badge": "CHƯƠNG TRÌNH",
      "mainTitle": "VẬN ĐỘNG XÂY DỰNG",
      "subTitle": "Trung tâm SINH HOẠT SINH VIÊN",
      "taglineTitle": "15 NĂM",
      "taglineText": "Kiến tạo tri thức - Tiếp bước tiên phong",
      "bankHeader": "Thông tin tiếp nhận tài trợ",
      "bankAccount": "Trường Đại học Trà Vinh",
      "bankNumber": "1800 20121 3545",
      "bankAgency": "Ngân hàng Nông nghiệp & PTNT (Agribank)",
      "thumbnails": [
        "assets/banners/thumb_bld1.png",
        "assets/banners/thumb_bld2.png",
        "assets/banners/thumb_bld3.png"
      ]
    }
  }
]
*/
