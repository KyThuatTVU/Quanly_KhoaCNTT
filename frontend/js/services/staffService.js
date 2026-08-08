/**
 * ==========================================================================
 * FACULTY STAFF PROFILE & RESEARCH SERVICE
 * ==========================================================================
 * Service layer for querying the Faculty of Information Technology staff members
 * and their academic portfolio details (Publications, Books, Projects, Supervisions).
 * Formatted to align exactly with the database schema structure.
 */

export const StaffService = {
  /**
   * Fetch all staff members (leaders and lecturers) grouped by their categories
   */
  async getStaffList() {
    try {
      const response = await fetch('/api/staff');
      if (response.ok) {
        return await response.json();
      }
    } catch (e) {
      console.warn('API /api/staff chưa sẵn sàng, sử dụng dữ liệu giả lập.', e);
    }

    // Default mock staff directory list matching TVU/mockup structure
    return [
      {
        id: 1,
        ho_ten: 'TS. Nguyễn Nhứt Lam',
        hoc_vi: 'Tiến sĩ',
        hoc_ham: null,
        ngach_vien_chuc: 'Giảng viên chính',
        chuc_vu: 'Trưởng khoa',
        slug_ca_nhan: 'lamnn',
        anh_ca_nhan_url: 'assets/images/deans/lamnn.jpg',
        nhom_id: 1 // Ban Lãnh đạo
      },
      {
        id: 2,
        ho_ten: 'TS. Thạch Kọng Saoane',
        hoc_vi: 'Tiến sĩ',
        hoc_ham: null,
        ngach_vien_chuc: 'Giảng viên',
        chuc_vu: 'Phó Trưởng khoa',
        slug_ca_nhan: 'oane',
        anh_ca_nhan_url: 'assets/images/deans/oane.jpg',
        nhom_id: 1 // Ban Lãnh đạo
      },
      {
        id: 3,
        ho_ten: 'TS. Nguyễn Trần Diễm Hạnh',
        hoc_vi: 'Tiến sĩ',
        hoc_ham: null,
        ngach_vien_chuc: 'Giảng viên',
        chuc_vu: 'Phó Trưởng khoa',
        slug_ca_nhan: 'diemhanh',
        anh_ca_nhan_url: 'assets/images/deans/diemhanh.jpg',
        nhom_id: 1 // Ban Lãnh đạo
      },
      {
        id: 4,
        ho_ten: 'Ths. Nguyễn Bá Nhiệm',
        hoc_vi: 'Thạc sĩ',
        hoc_ham: null,
        ngach_vien_chuc: 'Giảng viên',
        chuc_vu: 'Phó Trưởng khoa',
        slug_ca_nhan: 'nhiemnb',
        anh_ca_nhan_url: 'assets/images/deans/nhiemnb.jpg',
        nhom_id: 1 // Ban Lãnh đạo
      },
      {
        id: 5,
        ho_ten: 'Ths. Lê Phong Dũ',
        hoc_vi: 'Thạc sĩ',
        hoc_ham: null,
        ngach_vien_chuc: 'Giảng viên',
        chuc_vu: 'Phó Trưởng khoa',
        slug_ca_nhan: 'lpdu',
        anh_ca_nhan_url: 'assets/images/deans/lpdu.jpg',
        nhom_id: 1 // Ban Lãnh đạo
      },
      // Lecturers & TAs
      {
        id: 6,
        ho_ten: 'PGS. TS. Phạm Nguyên Khang',
        hoc_vi: 'Tiến sĩ',
        hoc_ham: 'Phó Giáo sư',
        ngach_vien_chuc: 'Giảng viên cao cấp',
        chuc_vu: 'Giảng viên cao cấp - Trưởng khoa Sau Đại học',
        slug_ca_nhan: 'pnkhang',
        anh_ca_nhan_url: 'assets/images/lecturers/pnkhang.jpg',
        nhom_id: 2
      },
      {
        id: 7,
        ho_ten: 'TS. Lưu Tiến Đạo',
        hoc_vi: 'Tiến sĩ',
        hoc_ham: null,
        ngach_vien_chuc: 'Giảng viên',
        chuc_vu: 'Giảng viên - Chủ tịch Công đoàn Khoa',
        slug_ca_nhan: 'ltdao',
        anh_ca_nhan_url: 'assets/images/lecturers/ltdao.jpg',
        nhom_id: 2
      },
      {
        id: 8,
        ho_ten: 'NCS. Phan Bích Chung',
        hoc_vi: 'NCS',
        hoc_ham: null,
        ngach_vien_chuc: 'Giảng viên',
        chuc_vu: 'Giảng viên - Phó Chủ tịch Công đoàn Khoa',
        slug_ca_nhan: 'pbchung',
        anh_ca_nhan_url: 'assets/images/lecturers/pbchung.jpg',
        nhom_id: 2
      }
    ];
  },

  /**
   * Fetch a lecturer's general profile page overview (trang_ca_nhan) by staff ID
   */
  async getStaffProfile(staffId) {
    try {
      const response = await fetch(`/api/staff/profile?id=${staffId}`);
      if (response.ok) {
        return await response.json();
      }
    } catch (e) {
      console.warn(`API /api/staff/profile?id=${staffId} chưa sẵn sàng, sử dụng dữ liệu giả lập.`);
    }

    // Default representative teacher profile (TS. Nguyễn Nhứt Lam)
    if (staffId === 1) {
      return {
        id: 1,
        nhan_vien_id: 1,
        email: 'lamnn@tvu.edu.vn',
        ngach_vien_chuc: 'Giảng viên chính',
        hoc_vi: 'Tiến sĩ',
        hoc_ham: null,
        don_vi_cong_tac: 'Khoa Công nghệ thông tin, Trường Kỹ thuật và Công nghệ, Đại học Trà Vinh',
        linh_vuc_nghien_cuu: 'Trí tuệ nhân tạo (AI), Học máy (Machine Learning), Khai phá dữ liệu (Data Mining), Tin sinh học (Bioinformatics)',
        google_scholar_url: 'https://scholar.google.com/citations?user=mock',
        orcid_url: 'https://orcid.org/0000-0002-mock',
        github_url: 'https://github.com/mock-lamnn',
        website_ca_nhan: 'https://fit.tvu.edu.vn/lamnn'
      };
    }

    // Default fallback profiles for other lecturers to avoid empty states
    return {
      id: staffId,
      nhan_vien_id: staffId,
      email: 'giangvien@tvu.edu.vn',
      ngach_vien_chuc: 'Giảng viên',
      hoc_vi: 'Thạc sĩ',
      hoc_ham: null,
      don_vi_cong_tac: 'Khoa Công nghệ thông tin, Trường Kỹ thuật và Công nghệ, Đại học Trà Vinh',
      linh_vuc_nghien_cuu: 'Công nghệ thông tin ứng dụng, Khoa học máy tính',
      google_scholar_url: '#',
      orcid_url: '#',
      github_url: '#',
      website_ca_nhan: '#'
    };
  },

  /**
   * Fetch research projects by staff ID (nhan_vien_de_tai_nckh)
   */
  async getStaffResearchProjects(staffId) {
    try {
      const response = await fetch(`/api/staff/projects?id=${staffId}`);
      if (response.ok) {
        return await response.json();
      }
    } catch (e) {
      console.warn(`API /api/staff/projects?id=${staffId} chưa sẵn sàng, sử dụng dữ liệu giả lập.`);
    }

    if (staffId === 1) {
      return [
        {
          id: 1,
          nhan_vien_id: 1,
          stt: 1,
          ten_de_tai: 'Nghiên cứu xây dựng mô hình học sâu hỗ trợ chẩn đoán hình ảnh y tế tại các bệnh viện khu vực ĐBSCL',
          nam_hoan_thanh: 2024,
          cap_de_tai: 'Đề tài cấp Bộ Giáo dục & Đào tạo',
          trach_nhiem_tham_gia: 'Chủ nhiệm đề tài'
        },
        {
          id: 2,
          nhan_vien_id: 1,
          stt: 2,
          ten_de_tai: 'Xây dựng thuật toán gom cụm nâng cao ứng dụng tối ưu hóa dự báo thời tiết và khí hậu tại tỉnh Trà Vinh',
          nam_hoan_thanh: 2022,
          cap_de_tai: 'Đề tài cấp Cơ sở (Trường ĐH Trà Vinh)',
          trach_nhiem_tham_gia: 'Chủ nhiệm đề tài'
        },
        {
          id: 3,
          nhan_vien_id: 1,
          stt: 3,
          ten_de_tai: 'Nghiên cứu ứng dụng IoT và Machine Learning giám sát chất lượng nước ao nuôi tôm siêu thâm canh',
          nam_hoan_thanh: 2020,
          cap_de_tai: 'Đề tài cấp Tỉnh',
          trach_nhiem_tham_gia: 'Thành viên nghiên cứu chính'
        }
      ];
    }
    return [];
  },

  /**
   * Fetch projects by staff ID (nhan_vien_du_an)
   */
  async getStaffProjects(staffId) {
    try {
      const response = await fetch(`/api/staff/duan?id=${staffId}`);
      if (response.ok) {
        return await response.json();
      }
    } catch (e) {
      console.warn(`API /api/staff/duan?id=${staffId} chưa sẵn sàng, sử dụng dữ liệu giả lập.`);
    }

    if (staffId === 1) {
      return [
        {
          id: 1,
          nhan_vien_id: 1,
          ten_du_an: 'Dự án tư vấn chuyển giao hệ thống tự động hóa quan trắc môi trường thông minh cho Sở Tài nguyên và Môi trường',
          nam_thuc_hien: '2023 - 2024',
          vai_tro: 'Trưởng nhóm giải pháp kỹ thuật',
          mo_ta: 'Thiết kế kiến trúc hệ thống cloud thu thập dữ liệu IoT cảm biến, tích hợp cảnh báo ô nhiễm nước sông tự động dựa trên thuật toán học máy.'
        }
      ];
    }
    return [];
  },

  /**
   * Fetch scientific publications by staff ID (nhan_vien_bai_bao_khoa_hoc)
   */
  async getStaffPublications(staffId) {
    try {
      const response = await fetch(`/api/staff/papers?id=${staffId}`);
      if (response.ok) {
        return await response.json();
      }
    } catch (e) {
      console.warn(`API /api/staff/papers?id=${staffId} chưa sẵn sàng, sử dụng dữ liệu giả lập.`);
    }

    if (staffId === 1) {
      return [
        {
          id: 1,
          nhan_vien_id: 1,
          loai_xuat_ban: 'tieng_anh',
          stt: 1,
          danh_sach_tac_gia: 'Nguyen Nhut Lam, Tran Van B, Le Thi C',
          nam_xuat_ban: 2024,
          ten_bai_bao: 'A Deep Learning Approach for Medical Decision Support in Data-Scarce Environments',
          ten_tap_chi_hoi_nghi: 'IEEE Access Journal',
          so_tap_chi_trang: 'Vol. 12, pp. 3456-3467',
          trang_thai_xuat_ban: 'Đã xuất bản'
        },
        {
          id: 2,
          nhan_vien_id: 1,
          loai_xuat_ban: 'tieng_viet',
          stt: 2,
          danh_sach_tac_gia: 'Nguyễn Nhứt Lam, Thạch Kọng Saoane',
          nam_xuat_ban: 2023,
          ten_bai_bao: 'Ứng dụng thuật toán gom cụm nâng cao trong phân tích dữ liệu nông nghiệp Trà Vinh',
          ten_tap_chi_hoi_nghi: 'Tạp chí Khoa học Đại học Trà Vinh',
          so_tap_chi_trang: 'Số 45, tr. 12-20',
          trang_thai_xuat_ban: 'Đã xuất bản'
        }
      ];
    }
    return [];
  },

  /**
   * Fetch books & syllabus by staff ID (nhan_vien_sach_giao_trinh)
   */
  async getStaffBooks(staffId) {
    try {
      const response = await fetch(`/api/staff/books?id=${staffId}`);
      if (response.ok) {
        return await response.json();
      }
    } catch (e) {
      console.warn(`API /api/staff/books?id=${staffId} chưa sẵn sàng, sử dụng dữ liệu giả lập.`);
    }

    if (staffId === 1) {
      return [
        {
          id: 1,
          nhan_vien_id: 1,
          ten_sach_giao_trinh: 'Giáo trình Trí tuệ Nhân tạo ứng dụng',
          nha_xuat_ban: 'Nhà xuất bản Đại học Quốc gia TP.HCM',
          nam_xuat_ban: 2023,
          vai_tro: 'Chủ biên'
        },
        {
          id: 2,
          nhan_vien_id: 1,
          ten_sach_giao_trinh: 'Sách chuyên khảo Nhập môn Học máy ứng dụng',
          nha_xuat_ban: 'Nhà xuất bản Khoa học và Kỹ thuật',
          nam_xuat_ban: 2021,
          vai_tro: 'Đồng tác giả'
        }
      ];
    }
    return [];
  },

  /**
   * Fetch student research & thesis supervision by staff ID (nhan_vien_huong_dan_nckh)
   */
  async getStaffSupervisions(staffId) {
    try {
      const response = await fetch(`/api/staff/supervision?id=${staffId}`);
      if (response.ok) {
        return await response.json();
      }
    } catch (e) {
      console.warn(`API /api/staff/supervision?id=${staffId} chưa sẵn sàng, sử dụng dữ liệu giả lập.`);
    }

    if (staffId === 1) {
      return [
        {
          id: 1,
          nhan_vien_id: 1,
          loai_hoc_vien: 'ncs',
          ten_hoc_vien: 'NCS. Trần Văn An',
          ten_de_tai_huong_dan: 'Nghiên cứu các mô hình học sâu tối ưu hóa dữ liệu nông nghiệp thông minh tại Đồng bằng sông Cửu Long',
          nam_bao_ve: 2025
        },
        {
          id: 2,
          nhan_vien_id: 1,
          loai_hoc_vien: 'hoc_vien_cao_hoc',
          ten_hoc_vien: 'HVCH. Nguyễn Thị Bình',
          ten_de_tai_huong_dan: 'Ứng dụng Thị giác máy tính nhận dạng và phân loại sâu bệnh hại cây lúa vùng duyên hải Trà Vinh',
          nam_bao_ve: 2024
        },
        {
          id: 3,
          nhan_vien_id: 1,
          loai_hoc_vien: 'sinh_vien_nckh',
          ten_hoc_vien: 'Nhóm SV FIT-TVU',
          ten_de_tai_huong_dan: 'Xây dựng chatbot hỗ trợ học vụ thông minh dựa trên mô hình ngôn ngữ lớn Llama 3',
          nam_bao_ve: 2023
        }
      ];
    }
    return [];
  }
};
