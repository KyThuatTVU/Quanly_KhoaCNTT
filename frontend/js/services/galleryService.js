/**
 * ==========================================================================
 * ACTIVITY GALLERY DATA SERVICE
 * ==========================================================================
 * Bridges the frontend UI activity gallery with the backend database API.
 * Retrives data from the /api/gallery/hoat-dong endpoint, matching the 
 * 'gallery_hoat_dong_trang_chu' MySQL database table.
 */

// API Endpoint (Change this when backend is ready)
const API_URL = `${window.location.port === '5500' ? 'http://localhost:5000' : ''}/api/v1/public/homepageGallery`;

export const GalleryService = {
  /**
   * Fetch list of homepage activity photos from the database.
   * Resolves to a JSON array of photo items or null if the API is offline.
   */
  async getActivityPhotos() {
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
      console.warn('API /api/gallery/hoat-dong chưa sẵn sàng. Trình duyệt đang sử dụng mockup dữ liệu ảnh hoạt động.', error.message);
      return null;
    }
  }
};

/*
=============================================================================
EXPECTED BACKEND API JSON RESPONSE CONTRACT (For 'gallery_hoat_dong_trang_chu')
=============================================================================
Configure your backend `/api/gallery/hoat-dong` endpoint to return a JSON array 
matching the exact schema below. This ensures a clean mapping with the frontend.

[
  {
    "id": 1,
    "tieu_de_anh": "Lễ bảo vệ Đồ án tốt nghiệp đại học",
    "hinh_anh_url": "assets/gallery/gallery_1.png",
    "thu_tu": 1
  },
  {
    "id": 2,
    "tieu_de_anh": "Đồng nghiệp gặp gỡ thảo luận sinh hoạt khoa",
    "hinh_anh_url": "assets/gallery/gallery_2.png",
    "thu_tu": 2
  },
  {
    "id": 3,
    "tieu_de_anh": "Ngày Seminar trao đổi học thuật chuyên đề",
    "hinh_anh_url": "assets/gallery/gallery_3.png",
    "thu_tu": 3
  },
  {
    "id": 4,
    "tieu_de_anh": "Trải nghiệm gian hàng tuyển sinh & tư vấn công nghệ",
    "hinh_anh_url": "assets/gallery/gallery_4.png",
    "thu_tu": 4
  },
  {
    "id": 5,
    "tieu_de_anh": "Khen thưởng đội tuyển thi lập trình ICPC đạt giải cao",
    "hinh_anh_url": "assets/gallery/gallery_5.png",
    "thu_tu": 5
  },
  {
    "id": 6,
    "tieu_de_anh": "Lễ khai mạc Olympic Trí tuệ nhân tạo Việt Nam miền Nam",
    "hinh_anh_url": "assets/gallery/gallery_6.png",
    "thu_tu": 6
  },
  {
    "id": 7,
    "tieu_de_anh": "Họp mặt hội đồng phản biện luận văn sau đại học",
    "hinh_anh_url": "assets/gallery/gallery_7.png",
    "thu_tu": 7
  },
  {
    "id": 8,
    "tieu_de_anh": "Ký kết biên bản ghi nhớ hợp tác doanh nghiệp (MOU)",
    "hinh_anh_url": "assets/gallery/gallery_8.png",
    "thu_tu": 8
  },
  {
    "id": 9,
    "tieu_de_anh": "Học sinh THPT tham quan phòng thí nghiệm khoa",
    "hinh_anh_url": "assets/gallery/gallery_9.png",
    "thu_tu": 9
  },
  {
    "id": 10,
    "tieu_de_anh": "Sinh viên báo cáo nghiên cứu và bảo vệ luận án Tiến sĩ",
    "hinh_anh_url": "assets/gallery/gallery_10.png",
    "thu_tu": 10
  },
  {
    "id": 11,
    "tieu_de_anh": "Lễ bảo vệ luận văn Thạc sĩ ngành Khoa học máy tính",
    "hinh_anh_url": "assets/gallery/gallery_11.png",
    "thu_tu": 11
  },
  {
    "id": 12,
    "tieu_de_anh": "Triển lãm robot và sản phẩm Trí tuệ nhân tạo",
    "hinh_anh_url": "assets/gallery/gallery_12.png",
    "thu_tu": 12
  },
  {
    "id": 13,
    "tieu_de_anh": "Sinh hoạt tập thể chào đón Tân sinh viên khóa mới",
    "hinh_anh_url": "assets/gallery/gallery_13.png",
    "thu_tu": 13
  },
  {
    "id": 14,
    "tieu_de_anh": "Khuôn viên tòa nhà công nghệ thông tin truyền thông",
    "hinh_anh_url": "assets/gallery/gallery_14.png",
    "thu_tu": 14
  },
  {
    "id": 15,
    "tieu_de_anh": "Hội đồng đánh giá nghiệm thu đề tài NCKH cấp cơ sở",
    "hinh_anh_url": "assets/gallery/gallery_15.png",
    "thu_tu": 15
  }
]
*/
