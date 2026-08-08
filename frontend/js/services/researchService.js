/**
 * ==========================================================================
 * FACULTY RESEARCH ACTIVITY SERVICE
 * ==========================================================================
 * Service layer for querying the Faculty of Information Technology scientific
 * research directions, active projects, publications (BibTeX-aligned), and contacts.
 * Formatted to align exactly with the database schema structure.
 */

export const ResearchService = {
  /**
   * Fetch main research directions (huong_nghien_cuu)
   */
  async getResearchDirections() {
    try {
      const response = await fetch('/api/research/directions');
      if (response.ok) {
        return await response.json();
      }
    } catch (e) {
      console.warn('API /api/research/directions chưa sẵn sàng, sử dụng dữ liệu giả lập.', e);
    }

    return [
      {
        id: 1,
        ten: 'Khai phá dữ liệu và trí tuệ nhân tạo',
        mo_ta: 'Nghiên cứu các mô hình học sâu (Deep Learning), khai phá tri thức, phân tích dữ liệu lớn (Big Data) và phát triển các hệ thống hỗ trợ ra quyết định thông minh.',
        thu_tu: 1
      },
      {
        id: 2,
        ten: 'Đồ họa và thị giác máy tính',
        mo_ta: 'Tập trung vào xử lý ảnh, nhận dạng đối tượng, thị giác máy tính ứng dụng (Computer Vision) trong y tế, nông nghiệp số và trực quan hóa dữ liệu không gian.',
        thu_tu: 2
      }
    ];
  },

  /**
   * Fetch active research topics/projects (de_tai_nghien_cuu)
   */
  async getResearchTopics() {
    try {
      const response = await fetch('/api/research/topics');
      if (response.ok) {
        return await response.json();
      }
    } catch (e) {
      console.warn('API /api/research/topics chưa sẵn sàng, sử dụng dữ liệu giả lập.', e);
    }

    return [
      {
        id: 1,
        ten_de_tai: 'TVU-Bot: Trợ lý ảo trích xuất tri thức và tự động trả lời văn bản hành chính cho văn phòng khoa CNTT',
        cap: 'Đề tài nghiên cứu cấp cơ sở',
        chu_nhiem_id: 1,
        chu_nhiem_ten: 'TS. Nguyễn Nhứt Lam',
        trang_thai: 'Đang thực hiện',
        thu_tu: 1
      },
      {
        id: 2,
        ten_de_tai: 'AFF-Sys: Hệ thống tự động hóa điền biểu mẫu học vụ dựa trên trích xuất thông tin tiếng Việt bằng Trí tuệ nhân tạo',
        cap: 'Đề tài nghiên cứu cấp cơ sở',
        chu_nhiem_id: 4,
        chu_nhiem_ten: 'Ths. Nguyễn Bá Nhiệm',
        trang_thai: 'Đang thực hiện',
        thu_tu: 2
      },
      {
        id: 3,
        ten_de_tai: 'MINDA: Hệ thống AI tự động ghi âm, nhận diện giọng nói và tóm tắt biên bản cuộc họp thông minh',
        cap: 'Đề tài nghiên cứu cấp cơ sở',
        chu_nhiem_id: 3,
        chu_nhiem_ten: 'TS. Nguyễn Trần Diễm Hạnh',
        trang_thai: 'Đang thực hiện',
        thu_tu: 3
      },
      {
        id: 4,
        ten_de_tai: 'TVU-Semantic: Hệ thống truy vấn ngữ nghĩa đa tầng hỗ trợ công tác Đảng và Đoàn Thanh niên Đại học Trà Vinh',
        cap: 'Đề tài nghiên cứu cấp cơ sở',
        chu_nhiem_id: 2,
        chu_nhiem_ten: 'TS. Thạch Kọng Saoane',
        trang_thai: 'Đang thực hiện',
        thu_tu: 4
      },
      {
        id: 5,
        ten_de_tai: 'Xây dựng chatbot tư vấn hướng nghiệp tự động dựa trên mô hình ngôn ngữ lớn cho học sinh THPT tỉnh Trà Vinh',
        cap: 'Đề tài nghiên cứu cấp cơ sở',
        chu_nhiem_id: 5,
        chu_nhiem_ten: 'Ths. Lê Phong Dũ',
        trang_thai: 'Đang thực hiện',
        thu_tu: 5
      }
    ];
  },

  /**
   * Fetch scientific publications grouped by year (cong_bo_khoa_hoc)
   */
  async getScientificPublications() {
    try {
      const response = await fetch('/api/research/publications');
      if (response.ok) {
        return await response.json();
      }
    } catch (e) {
      console.warn('API /api/research/publications chưa sẵn sàng, sử dụng dữ liệu giả lập.', e);
    }

    return [
      {
        id: 1,
        bibtex_key: 'nguyen2026self',
        nam_xuat_ban: 2026,
        ten_bai_bao: 'When Self-supervised Transformers Meet Knowledge Distillation: Efficient Chest X-Ray Classification in Low-Resource Hospitals',
        loai_hinh_cong_bo: 'CONFERENCE PAPER',
        tac_gia: 'Nguyen, L. N. and Thach, K. S.',
        ten_tap_chi_hoi_nghi: 'International Conference on Multi-disciplinary Trends in Artificial Intelligence, 2026.'
      },
      {
        id: 2,
        bibtex_key: 'nguyen2025segment',
        nam_xuat_ban: 2025,
        ten_bai_bao: 'Enhancing Segment-Based Bag of Clusters with Mixture Models and Late Chunking for Document Clustering',
        loai_hinh_cong_bo: 'JOURNAL ARTICLE',
        tac_gia: 'Nguyen, L. N. and Tran, D. H.',
        ten_tap_chi_hoi_nghi: 'SN Computer Science, Springer, 2025.'
      },
      {
        id: 3,
        bibtex_key: 'thach2025iot',
        nam_xuat_ban: 2025,
        ten_bai_bao: 'IoT-Enabled Deep Learning System for Real-time Water Quality Monitoring in Shrimp Farms of Tra Vinh Province',
        loai_hinh_cong_bo: 'JOURNAL ARTICLE',
        tac_gia: 'Thach, K. S., Nguyen, B. N., and Le, P. D.',
        ten_tap_chi_hoi_nghi: 'IEEE Internet of Things Journal, 2025.'
      }
    ];
  },

  /**
   * Fetch research contact information (lien_he_nghien_cuu)
   */
  async getResearchContacts() {
    try {
      const response = await fetch('/api/research/contacts');
      if (response.ok) {
        return await response.json();
      }
    } catch (e) {
      console.warn('API /api/research/contacts chưa sẵn sàng, sử dụng dữ liệu giả lập.', e);
    }

    return [
      {
        id: 1,
        ten_daidien: 'TS. Nguyễn Nhứt Lam',
        chuc_vu_nhiem_vu: 'Phụ trách nghiên cứu khoa học và chuyển giao công nghệ - Trưởng nhóm Nghiên cứu Trí tuệ Nhân tạo (AILab-TVU)',
        email: 'lamnn@tvu.edu.vn',
        thu_tu: 1
      },
      {
        id: 2,
        ten_daidien: 'Khoa Công nghệ thông tin',
        chuc_vu_nhiem_vu: 'Hợp tác nghiên cứu khoa học, chuyển giao công nghệ ứng dụng và hợp tác doanh nghiệp',
        email: 'fit@tvu.edu.vn',
        thu_tu: 2
      }
    ];
  }
};
