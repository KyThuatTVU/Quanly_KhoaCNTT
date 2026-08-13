/**
 * ==========================================================================
 * STUDENT SHOWCASE DATA SERVICE
 * ==========================================================================
 * Bridges the frontend UI student showcase with the backend database API.
 * Retrives data from the /api/students endpoint, matching the 
 * 'sinh_vien_tieu_bieu' MySQL database table.
 */

// API Endpoint (Change this when backend is ready)
const API_URL = 'http://localhost:5000/api/v1/admin/students';

export const StudentService = {
  /**
   * Fetch list of outstanding students/teams from the database.
   * Resolves to a JSON array of student items or null if the API is offline.
   */
  async getStudents() {
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
      console.warn('API /api/students chưa sẵn sàng. Trình duyệt đang sử dụng mockup dữ liệu sinh viên tiêu biểu.', error.message);
      return null;
    }
  }
};

/*
=============================================================================
EXPECTED BACKEND API JSON RESPONSE CONTRACT (For 'sinh_vien_tieu_bieu' table)
=============================================================================
Configure your backend `/api/students` endpoint to return a JSON array matching 
the exact schema below. This ensures a clean mapping with the frontend.

[
  {
    "id": 1,
    "ten_doi_ca_nhan": "Đội CTU-LinguTechies",
    "nganh_hoc": "Ngành Khoa học máy tính",
    "thanh_tich": "Vô địch cuộc thi phần mềm nguồn mở năm 2023 tại OLP Tin học sinh viên toàn quốc với sản phẩm VNLawAdvisor",
    "giang_vien_huong_dan": "PGS. TS. Phạm Nguyên Khang",
    "hinh_anh_url": "assets/students/student_olp2023.png",
    "thu_tu": 1
  },
  {
    "id": 2,
    "ten_doi_ca_nhan": "Đội CAAS",
    "nganh_hoc": "Ngành Khoa học máy tính",
    "thanh_tich": "Xuất sắc đạt giải Nhì cuộc thi Nghiên cứu khoa học dành cho Sinh viên năm 2025",
    "giang_vien_huong_dan": "TS. Mã Trường Thành",
    "hinh_anh_url": "assets/students/student_nckh2025.png",
    "thu_tu": 2
  },
  {
    "id": 3,
    "ten_doi_ca_nhan": "Đội CTU Team 1 và CTU Team 2",
    "nganh_hoc": "Nhóm sinh viên ngành Khoa học máy tính và Trí tuệ nhân tạo",
    "thanh_tich": "Giải Nhì và Khuyến khích OLP Trí tuệ nhân tạo miền Nam và hai giải Khuyến khích OLP Trí tuệ nhân tạo toàn quốc 2025",
    "giang_vien_huong_dan": null,
    "hinh_anh_url": "assets/students/student_olpai2025.png",
    "thu_tu": 3
  },
  {
    "id": 4,
    "ten_doi_ca_nhan": "Thái Phú An",
    "nganh_hoc": "Ngành Khoa học máy tính",
    "thanh_tich": "Công bố bài báo tại nhiều hội nghị khoa học trong nước và quốc tế như ACIIDS (rank B), FJCAI, CITA, ISDS. Đặc biệt, giải Ba bài báo xuất sắc tại FJCAI 2026",
    "giang_vien_huong_dan": null,
    "hinh_anh_url": "assets/students/student_thaiphuan.png",
    "thu_tu": 4
  }
]
*/
