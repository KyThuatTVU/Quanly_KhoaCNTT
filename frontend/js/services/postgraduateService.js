/**
 * ==========================================================================
 * FACULTY POSTGRADUATE SERVICE
 * ==========================================================================
 * Service layer for querying postgraduate admissions notices, PhD students
 * directory, activities photo gallery, and statistical charts.
 * Formatted to align exactly with the database schema structure (Module 7).
 */

export const PostgraduateService = {
  /**
   * Fetch admissions notices (tuyen_sinh_sau_dai_hoc_thong_bao)
   */
  async getAdmissionsNotices() {
    try {
      const response = await fetch('/api/postgraduate/notices');
      if (response.ok) {
        return await response.json();
      }
    } catch (e) {
      console.warn('API /api/postgraduate/notices chưa sẵn sàng, sử dụng dữ liệu giả lập.', e);
    }

    return {
      title: 'Tuyển sinh Sau Đại học 2026',
      notices: [
        {
          id: 1,
          tieu_de_thong_bao: 'Thông báo tuyển sinh đào tạo trình độ tiến sĩ năm 2026 đợt 2',
          link_chi_tiet: '#'
        },
        {
          id: 2,
          tieu_de_thong_bao: 'Lịch bảo vệ đề cương nghiên cứu dự tuyển tiến sĩ năm 2026 đợt 1',
          link_chi_tiet: '#'
        },
        {
          id: 3,
          tieu_de_thong_bao: 'Thông báo tuyển sinh trình độ Thạc sĩ năm 2026 đợt 2',
          link_chi_tiet: '#'
        }
      ],
      contact_info: 'Khoa Sau Đại học, Đại học Cần Thơ hoặc qua Facebook của Khoa Sau Đại học'
    };
  },

  /**
   * Fetch PhD candidates directory (danh_sach_nghien_cuu_sinh)
   */
  async getPhDStudents() {
    try {
      const response = await fetch('/api/postgraduate/phd-students');
      if (response.ok) {
        return await response.json();
      }
    } catch (e) {
      console.warn('API /api/postgraduate/phd-students chưa sẵn sàng, sử dụng dữ liệu giả lập.', e);
    }

    return [
      {
        id: 1,
        stt: '01',
        ho_ten: 'Bùi Xuân Tùng',
        chuc_vu_co_quan: 'Phó trưởng Bộ môn Công nghệ thông tin, Trường Đại học Tây Đô',
        email: 'bxtung@tdu.edu.vn',
        google_scholar_url: null,
        ma_ncs: 'P2425004',
        huong_nghien_cuu: 'Mô hình học đa mô thức hỗ trợ phát hiện và sàng lọc bất thường ổ bụng từ dữ liệu siêu âm',
        nguoi_huong_dan: 'TS. Mã Trường Thành, TS. Trần Việt Châu',
        trang_thai: 'Đang học',
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
      },
      {
        id: 2,
        stt: '02',
        ho_ten: 'Châu Mũi Khéo',
        chuc_vu_co_quan: 'Giảng viên Trường Đại học FPT Cần Thơ',
        email: 'chaumuikheo@gmail.com',
        google_scholar_url: 'https://scholar.google.com',
        ma_ncs: 'P2426001',
        huong_nghien_cuu: 'Chuẩn đoán bệnh trên thú cưng sử dụng tiếp cận đa phương thức',
        nguoi_huong_dan: 'TS. Trần Nguyễn Minh Thư, TS. Thái Minh Tuấn',
        trang_thai: 'Đang học',
        avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80'
      },
      {
        id: 3,
        stt: '03',
        ho_ten: 'Lê Thanh Sang',
        chuc_vu_co_quan: 'Phó Giám đốc Trung tâm Chuyển đổi số - Đại học Cần Thơ',
        email: 'ltsang@ctu.edu.vn',
        google_scholar_url: null,
        ma_ncs: 'P2426002',
        huong_nghien_cuu: 'Phân tích dữ liệu người học phục vụ quản lý và hỗ trợ học tập',
        nguoi_huong_dan: 'PGS. TS. Đỗ Thanh Nghị',
        trang_thai: 'Đang học',
        avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
      }
    ];
  },

  /**
   * Fetch postgraduate student activities media gallery
   */
  async getActivities() {
    try {
      const response = await fetch('/api/postgraduate/activities');
      if (response.ok) {
        return await response.json();
      }
    } catch (e) {
      console.warn('API /api/postgraduate/activities chưa sẵn sàng, sử dụng dữ liệu giả lập.', e);
    }

    return [
      {
        id: 1,
        title: 'Báo cáo Seminar chuyên đề Tiến sĩ KHMT',
        image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=600&q=80'
      },
      {
        id: 2,
        title: 'Lễ bảo vệ Đề cương nghiên cứu dự tuyển Tiến sĩ',
        image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80'
      },
      {
        id: 3,
        title: 'Hội thảo Khoa học Sau Đại học CNTT 2026',
        image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=600&q=80'
      },
      {
        id: 4,
        title: 'Báo cáo Tiến độ Luận án Tiến sĩ đợt 1',
        image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=600&q=80'
      }
    ];
  },

  /**
   * Fetch postgraduate student statistics datasets
   */
  async getStats() {
    try {
      const response = await fetch('/api/postgraduate/stats');
      if (response.ok) {
        return await response.json();
      }
    } catch (e) {
      console.warn('API /api/postgraduate/stats chưa sẵn sàng, sử dụng dữ liệu giả lập.', e);
    }

    return {
      // Line chart data (K22 - K33)
      batches: ['K22', 'K23', 'K24', 'K25', 'K26', 'K27', 'K28', 'K29', 'K30', 'K31', 'K32', 'K33'],
      masterCounts: [9, 8, 7, 45, 38, 22, 18, 15, 7, 15, 28, 15],
      phdCounts: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8], // PhD started recently at K33!

      // Stacked Bar chart data (Graduated K22 - K31)
      gradBatches: ['K22', 'K23', 'K24', 'K25', 'K26', 'K27', 'K28', 'K29', 'K30', 'K31'],
      graduated: [9, 9, 8, 50, 32, 25, 12, 16, 11, 0],
      onTime: [2, 3, 4, 11, 2, 0, 0, 2, 2, 0]
    };
  }
};
