/**
 * ==========================================================================
 * FACULTY ACADEMIC CURRICULUM SERVICE
 * ==========================================================================
 * Service layer for querying undergraduate training programs, admission
 * methods, knowledge blocks study paths, research directions, and PLOs.
 * Formatted to align exactly with the database schema structure.
 */

const CURRICULUM_API_BASE = '/api/curriculum';

async function fetchCollection(endpoint, fallbackFactory) {
  try {
    const response = await fetch(endpoint);
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.warn(`API ${endpoint} chưa sẵn sàng, sử dụng dữ liệu giả lập.`, error);
  }

  return typeof fallbackFactory === 'function' ? fallbackFactory() : fallbackFactory;
}

export const CurriculumService = {
  /**
   * Fetch all undergraduate programs (chuong_trinh_dao_tao_dai_hoc)
   */
  async getPrograms() {
    return fetchCollection(`${CURRICULUM_API_BASE}/chuong-trinh-dao-tao-dai-hoc`, () => [
      {
        id: 1,
        ten_nganh: 'Công nghệ thông tin',
        ma_tuyen_sinh: '7480201',
        van_bang_tot_nghiep: 'Kỹ sư',
        thoi_gian_hoc: '4.5 Năm',
        tong_so_tin_chi: 161,
        gioi_thieu_nganh: 'Ngành Công nghệ thông tin là trụ cột cốt lõi của chuyển đổi số xã hội hiện đại. Chương trình đào tạo Kỹ sư Công nghệ thông tin tại Đại học Trà Vinh được thiết kế tối ưu thực hành ứng dụng, chuẩn bị cho sinh viên năng lực làm chủ các công nghệ phần mềm, kiến trúc hệ thống mạng và an toàn thông tin doanh nghiệp.',
        co_hoi_phat_trien: 'Sinh viên sau khi tốt nghiệp có khả năng tư duy và trực tiếp thiết kế, phát triển ứng dụng di động, hệ thống web, quản trị cơ sở dữ liệu lớn, quản trị hạ tầng mạng an toàn và thích ứng linh hoạt với sự thay đổi của cuộc cách mạng công nghệ mới.'
      },
      {
        id: 2,
        ten_nganh: 'Trí tuệ nhân tạo',
        ma_tuyen_sinh: '7480107',
        van_bang_tot_nghiep: 'Kỹ sư',
        thoi_gian_hoc: '4.5 Năm',
        tong_so_tin_chi: 161,
        gioi_thieu_nganh: 'Ngành Trí tuệ nhân tạo là ngành đào tạo mũi nhọn đón đầu xu thế công nghệ tương lai. Chương trình đào tạo Kỹ sư Trí tuệ nhân tạo trang bị các kiến thức chuyên sâu về xử lý dữ liệu lớn, thuật toán học máy (Machine Learning), học sâu (Deep Learning), xử lý ngôn ngữ tự nhiên và thị giác máy tính.',
        co_hoi_phat_trien: 'Sinh viên sau khi tốt nghiệp có khả năng nghiên cứu, lập trình các mô hình AI thông minh, phát triển hệ thống robot tự động, xử lý ảnh ứng dụng trong y tế số, nông nghiệp công nghệ cao và tối ưu hóa hệ thống ra quyết định trong doanh nghiệp.'
      }
    ]);
  },

  /**
   * Fetch study path structures (cau_truc_khoi_kien_thuc) by program ID
   */
  async getStudyPath(programId) {
    return fetchCollection(`${CURRICULUM_API_BASE}/cau-truc-khoi-kien-thuc?nganh_id=${programId}`, () => {
      if (programId === 1) {
        return [
        {
          id: 1,
          nganh_id: 1,
          ten_khoi: 'Kiến thức Đại cương',
          so_tin_chi: 56,
          mo_ta_khoi: 'Toán học cốt lõi (Giải tích, Đại số tuyến tính, Xác suất thống kê), Kỹ năng mềm chuyên nghiệp, Khởi nghiệp đổi mới sáng tạo và Lý luận chính trị.',
          thu_tu: 1
        },
        {
          id: 2,
          nganh_id: 1,
          ten_khoi: 'Kiến thức Cơ sở ngành',
          so_tin_chi: 46,
          mo_ta_khoi: 'Lập trình căn bản (C/C++), Cấu trúc dữ liệu và giải thuật, Lập trình hướng đối tượng (OOP), Hệ điều hành máy tính, Cơ sở dữ liệu và Mạng máy tính.',
          thu_tu: 2
        },
        {
          id: 3,
          nganh_id: 1,
          ten_khoi: 'Kiến thức Chuyên ngành',
          so_tin_chi: 59,
          mo_ta_khoi: 'Công nghệ phần mềm nâng cao, Phân tích thiết kế hệ thống, Phát triển ứng dụng Web/Mobile, An toàn thông tin mạng, Cơ sở dữ liệu lớn và Đồ án tốt nghiệp.',
          thu_tu: 3
        }
        ];
      }

      // Trí tuệ nhân tạo (ID = 2)
      return [
        {
          id: 4,
          nganh_id: 2,
          ten_khoi: 'Kiến thức Đại cương',
          so_tin_chi: 56,
          mo_ta_khoi: 'Toán học nâng cao cho khoa học dữ liệu, Thống kê ứng dụng, Kỹ năng mềm giao tiếp khoa học, Khởi nghiệp công nghệ và Chính trị đại cương.',
          thu_tu: 1
        },
        {
          id: 5,
          nganh_id: 2,
          ten_khoi: 'Kiến thức Cơ sở ngành',
          so_tin_chi: 46,
          mo_ta_khoi: 'Lập trình ngôn ngữ Python chuyên sâu, Giải thuật và tối ưu toán học, Cơ sở dữ liệu lớn, Nhập môn Trí tuệ nhân tạo, Mạng máy tính cơ bản.',
          thu_tu: 2
        },
        {
          id: 6,
          nganh_id: 2,
          ten_khoi: 'Kiến thức Chuyên ngành',
          so_tin_chi: 59,
          mo_ta_khoi: 'Thuật toán Học máy (Machine Learning), Học sâu (Deep Learning), Thị giác máy tính (Computer Vision), Xử lý ngôn ngữ tự nhiên (NLP), Hệ thống robot tự hành.',
          thu_tu: 3
        }
      ];
    });
  },

  /**
   * Fetch research orientations (dinh_huong_nghien_cuu_chuyen_nganh) by program ID
   */
  async getResearchOrientations(programId) {
    return fetchCollection(`${CURRICULUM_API_BASE}/dinh-huong-nghien-cuu-chuyen-nganh?nganh_id=${programId}`, () => {
      if (programId === 1) {
        return [
        { id: 1, nganh_id: 1, ten_dinh_huong: 'Phần mềm & Hệ thống thông tin' },
        { id: 2, nganh_id: 1, ten_dinh_huong: 'Mạng máy tính & An toàn thông tin' }
        ];
      }

      return [
        { id: 3, nganh_id: 2, ten_dinh_huong: 'Khai phá dữ liệu & Học máy' },
        { id: 4, nganh_id: 2, ten_dinh_huong: 'Thị giác máy tính & Xử lý ảnh' }
      ];
    });
  },

  /**
   * Fetch admission combinations (phuong_thuc_tuyen_sinh) by program ID
   */
  async getAdmissions(programId) {
    return fetchCollection(`${CURRICULUM_API_BASE}/phuong-thuc-tuyen-sinh?nganh_id=${programId}`, () => {
      if (programId === 1) {
        return [
        {
          id: 1,
          nganh_id: 1,
          ten_phuong_thuc: 'Xét kết quả thi tốt nghiệp THPT',
          danh_sach_to_hop: 'A00 (Toán, Lý, Hóa) | A01 (Toán, Lý, Anh) | C01 (Toán, Văn, Lý) | D07 (Toán, Hóa, Anh)'
        },
        {
          id: 2,
          nganh_id: 1,
          ten_phuong_thuc: 'Xét tuyển dựa trên kỳ thi đánh giá năng lực V-SAT',
          danh_sach_to_hop: 'A00 (Toán, Lý, Hóa) | A01 (Toán, Lý, Anh)'
        },
        {
          id: 3,
          nganh_id: 1,
          ten_phuong_thuc: 'Xét tuyển học bạ THPT',
          danh_sach_to_hop: 'A00 (Toán, Lý, Hóa) | A01 (Toán, Lý, Anh) | C01 (Toán, Văn, Lý) | D07 (Toán, Hóa, Anh)'
        }
        ];
      }

      return [
        {
          id: 4,
          nganh_id: 2,
          ten_phuong_thuc: 'Xét kết quả thi tốt nghiệp THPT',
          danh_sach_to_hop: 'A00 (Toán, Lý, Hóa) | A01 (Toán, Lý, Anh) | X06 (Toán, Lý, Tin) | X26 (Toán, Tin, Anh)'
        },
        {
          id: 5,
          nganh_id: 2,
          ten_phuong_thuc: 'Xét tuyển dựa trên kỳ thi đánh giá năng lực V-SAT',
          danh_sach_to_hop: 'A00 (Toán, Lý, Hóa) | A01 (Toán, Lý, Anh)'
        },
        {
          id: 6,
          nganh_id: 2,
          ten_phuong_thuc: 'Xét tuyển học bạ THPT',
          danh_sach_to_hop: 'A00 (Toán, Lý, Hóa) | A01 (Toán, Lý, Anh) | X06 (Toán, Lý, Tin) | X26 (Toán, Tin, Anh)'
        }
      ];
    });
  },

  /**
   * Fetch PLOs (chuan_dau_ra_plo) by program ID
   */
  async getPLOs(programId) {
    return fetchCollection(`${CURRICULUM_API_BASE}/chuan-dau-ra-plo?nganh_id=${programId}`, () => {
      if (programId === 1) {
        return [
        {
          id: 1,
          nganh_id: 1,
          ma_plo: 'PLO3',
          noi_dung_plo: 'Đề xuất giải pháp thực tế giải quyết các bài toán kỹ thuật CNTT dựa trên phân tích và tổng hợp thông tin.'
        },
        {
          id: 2,
          nganh_id: 1,
          ma_plo: 'PLO5',
          noi_dung_plo: 'Vận dụng kiến thức cốt lõi Công nghệ phần mềm để thiết kế cấu trúc dữ liệu, thuật toán và lập trình phần mềm phức tạp.'
        },
        {
          id: 3,
          nganh_id: 1,
          ma_plo: 'PLO6',
          noi_dung_plo: 'Đánh giá, lựa chọn công nghệ mạng và giải pháp an toàn thông tin phù hợp với yêu cầu thực tế doanh nghiệp số.'
        }
        ];
      }

      return [
        {
          id: 4,
          nganh_id: 2,
          ma_plo: 'PLO3',
          noi_dung_plo: 'Đề xuất giải pháp giải quyết những bài toán được khái quát hóa từ thực tế dựa trên mô hình toán tối ưu và lập trình học máy chuyên sâu.'
        },
        {
          id: 5,
          nganh_id: 2,
          ma_plo: 'PLO5',
          noi_dung_plo: 'Thiết lập thuật toán học sâu tối ưu hóa cấu trúc mạng neural phục vụ xử lý hình ảnh và văn bản tự nhiên.'
        },
        {
          id: 6,
          nganh_id: 2,
          ma_plo: 'PLO6',
          noi_dung_plo: 'Đánh giá, tích hợp hệ thống trí tuệ nhân tạo và các giải pháp robot tự động hóa trong môi trường công nghiệp thực tế.'
        }
      ];
    });
  },

  /**
   * Fetch typical core technology courses (hoc_phan_cong_nghe_cot_loi) by program ID
   */
  async getCoreCourses(programId) {
    return fetchCollection(`${CURRICULUM_API_BASE}/hoc-phan-cong-nghe-cot-loi?nganh_id=${programId}`, () => {
      if (programId === 1) {
        return [
        {
          id: 1,
          nganh_id: 1,
          ma_hoc_phan: 'CT294',
          ten_hoc_phan: 'Phát triển ứng dụng Web',
          so_tin_chi: 3,
          nang_luc_hinh_thanh: 'Thiết kế, xây dựng và triển khai các ứng dụng web hiện đại hoàn chỉnh phía client và server.'
        },
        {
          id: 2,
          nganh_id: 1,
          ma_hoc_phan: 'CT316E',
          ten_hoc_phan: 'Quản trị mạng doanh nghiệp',
          so_tin_chi: 3,
          nang_luc_hinh_thanh: 'Cấu hình, giám sát, khắc phục sự cố và bảo mật hạ tầng mạng doanh nghiệp dựa trên thiết bị thực tế.'
        },
        {
          id: 3,
          nganh_id: 1,
          ma_hoc_phan: 'CT210',
          ten_hoc_phan: 'Cơ sở dữ liệu lớn (Big Data)',
          so_tin_chi: 3,
          nang_luc_hinh_thanh: 'Thiết kế, tối ưu hóa truy vấn lược đồ dữ liệu quy mô lớn và sử dụng thành thạo các cơ sở dữ liệu NoSQL.'
        },
        {
          id: 4,
          nganh_id: 1,
          ma_hoc_phan: 'CT282E',
          ten_hoc_phan: 'An toàn thông tin',
          so_tin_chi: 3,
          nang_luc_hinh_thanh: 'Áp dụng thuật toán mã hóa dữ liệu, phòng chống các lỗ hổng mạng phổ biến và đánh giá an ninh hệ thống.'
        }
        ];
      }

      // Trí tuệ nhân tạo (ID = 2)
      return [
        {
          id: 5,
          nganh_id: 2,
          ma_hoc_phan: 'CT294',
          ten_hoc_phan: 'Máy học ứng dụng',
          so_tin_chi: 3,
          nang_luc_hinh_thanh: 'Thiết kế và triển khai các thuật toán học máy tự động phân tích dữ liệu lớn phục vụ dự báo doanh nghiệp.'
        },
        {
          id: 6,
          nganh_id: 2,
          ma_hoc_phan: 'CT316E',
          ten_hoc_phan: 'Xử lý ảnh',
          so_tin_chi: 3,
          nang_luc_hinh_thanh: 'Làm chủ các phép toán xử lý, lọc nhiễu, khôi phục, biến đổi và trích xuất đặc trưng của ảnh kỹ thuật số.'
        },
        {
          id: 7,
          nganh_id: 2,
          ma_hoc_phan: 'CT210',
          ten_hoc_phan: 'Thị giác máy tính',
          so_tin_chi: 3,
          nang_luc_hinh_thanh: 'Lập trình mô phỏng máy ảnh thông minh, nhận diện đối tượng thực tế và tái cấu trúc không gian 3D.'
        },
        {
          id: 8,
          nganh_id: 2,
          ma_hoc_phan: 'CT282E',
          ten_hoc_phan: 'Học sâu (Deep Learning)',
          so_tin_chi: 3,
          nang_luc_hinh_thanh: 'Xây dựng mạng neuron đa lớp phức tạp (CNN, RNN, Transformer) phục vụ nhận dạng giọng nói và hình ảnh.'
        }
      ];
    });
  },

  /**
   * Fetch typical job opportunities (co_hoi_nghe_nghiep) by program ID
   */
  async getCareerOpportunities(programId) {
    return fetchCollection(`${CURRICULUM_API_BASE}/co-hoi-nghe-nghiep?nganh_id=${programId}`, () => {
      if (programId === 1) {
        return [
          {
            id: 1,
            nganh_id: 1,
            loai_thong_tin: 'vi_tri_dam_nhan',
            noi_dung: 'Lập trình viên chuyên nghiệp (Frontend, Backend, Fullstack Developer), kiến trúc sư phát triển phần mềm.'
          },
          {
            id: 2,
            nganh_id: 1,
            loai_thong_tin: 'vi_tri_dam_nhan',
            noi_dung: 'Chuyên viên quản trị hệ thống mạng, kỹ sư bảo mật và giám sát an toàn thông tin doanh nghiệp.'
          },
          {
            id: 3,
            nganh_id: 1,
            loai_thong_tin: 'vi_tri_dam_nhan',
            noi_dung: 'Chuyên viên phân tích thiết kế hệ thống thông tin, quản trị cơ sở dữ liệu lớn (Database Administrator).'
          },
          {
            id: 4,
            nganh_id: 1,
            loai_thong_tin: 'vi_tri_dam_nhan',
            noi_dung: 'Chuyên viên tư vấn, thẩm định dự án công nghệ thông tin và chuyển đổi số cho cơ quan hành chính.'
          },
          {
            id: 5,
            nganh_id: 1,
            loai_thong_tin: 'vi_tri_dam_nhan',
            noi_dung: 'Giảng viên, cán bộ nghiên cứu ứng dụng công nghệ thông tin tại các trường Đại học, Cao đẳng.'
          },
          {
            id: 6,
            nganh_id: 1,
            loai_thong_tin: 'moi_truong_cong_tac',
            noi_dung: 'Các tập đoàn phát triển, gia công, bảo trì phần mềm đa quốc gia và startup công nghệ số.'
          },
          {
            id: 7,
            nganh_id: 1,
            loai_thong_tin: 'moi_truong_cong_tac',
            noi_dung: 'Các nhà cung cấp dịch vụ viễn thông, mạng internet, bảo mật thông tin và điện toán đám mây.'
          },
          {
            id: 8,
            nganh_id: 1,
            loai_thong_tin: 'moi_truong_cong_tac',
            noi_dung: 'Các ngân hàng thương mại, tổ chức tài chính, chứng khoán và doanh nghiệp thương mại lớn.'
          },
          {
            id: 9,
            nganh_id: 1,
            loai_thong_tin: 'moi_truong_cong_tac',
            noi_dung: 'Các cơ quan nhà nước, đơn vị sự nghiệp hành chính ứng dụng chuyển đổi số toàn diện.'
          },
          {
            id: 10,
            nganh_id: 1,
            loai_thong_tin: 'moi_truong_cong_tac',
            noi_dung: 'Học viện, Viện nghiên cứu công nghệ thông tin và chuyển giao tri thức trong và ngoài nước.'
          }
        ];
      }

      return [
        {
          id: 11,
          nganh_id: 2,
          loai_thong_tin: 'vi_tri_dam_nhan',
          noi_dung: 'Chuyên viên phân tích dữ liệu, khai phá dữ liệu lớn (Data Analyst, Data Scientist) trong các doanh nghiệp số.'
        },
        {
          id: 12,
          nganh_id: 2,
          loai_thong_tin: 'vi_tri_dam_nhan',
          noi_dung: 'Kỹ sư phát triển mô hình học máy (Machine Learning Engineer) và học sâu (Deep Learning Engineer).'
        },
        {
          id: 13,
          nganh_id: 2,
          loai_thong_tin: 'vi_tri_dam_nhan',
          noi_dung: 'Kỹ sư thiết kế thuật toán đồ họa kỹ thuật, xử lý hình ảnh y tế, VR/AR, Game thông minh.'
        },
        {
          id: 14,
          nganh_id: 2,
          loai_thong_tin: 'vi_tri_dam_nhan',
          noi_dung: 'Chuyên viên R&D nghiên cứu các công nghệ mô hình thông minh cho doanh nghiệp, thành phố thông minh.'
        },
        {
          id: 15,
          nganh_id: 2,
          loai_thong_tin: 'vi_tri_dam_nhan',
          noi_dung: 'Giảng viên, cán bộ nghiên cứu khoa học máy tính chuyên sâu tại các trường Đại học, Viện công nghệ.'
        },
        {
          id: 16,
          nganh_id: 2,
          loai_thong_tin: 'moi_truong_cong_tac',
          noi_dung: 'Các tập đoàn phát triển phần mềm đa quốc gia, trung tâm R&D chuyên biệt về trí tuệ nhân tạo và robotics.'
        },
        {
          id: 17,
          nganh_id: 2,
          loai_thong_tin: 'moi_truong_cong_tac',
          noi_dung: 'Các công ty tư vấn giải pháp mạng, viễn thông và tích hợp hệ thống dữ liệu thông minh.'
        },
        {
          id: 18,
          nganh_id: 2,
          loai_thong_tin: 'moi_truong_cong_tac',
          noi_dung: 'Các doanh nghiệp TMĐT, Fintech, Logistics sử dụng công cụ AI phân tích hành vi khách hàng.'
        },
        {
          id: 19,
          nganh_id: 2,
          loai_thong_tin: 'moi_truong_cong_tac',
          noi_dung: 'Các cơ quan nhà nước, bệnh viện thông minh, hợp tác xã nông nghiệp công nghệ cao.'
        },
        {
          id: 20,
          nganh_id: 2,
          loai_thong_tin: 'moi_truong_cong_tac',
          noi_dung: 'Học viện, Viện nghiên cứu khoa học máy tính, AI Lab trong và ngoài nước.'
        }
      ];
    });
  },

  async getJobOpportunities(programId) {
    return this.getCareerOpportunities(programId);
  },

  /**
   * Fetch FAQ accordion Q&A (faq_dai_hoc)
   */
  async getFAQs() {
    return fetchCollection(`${CURRICULUM_API_BASE}/faq-dai-hoc`, () => [
      {
        id: 1,
        cau_hoi: 'Em có hoàn cảnh gia đình khó khăn không biết Nhà Trường có hỗ trợ gì không?',
        tra_loi: 'Trường hợp sinh viên khó khăn đột xuất do thiên tai, dịch bệnh, hỏa hoạn... thì có thể làm đơn xin trợ cấp khó khăn đột xuất theo mẫu và nộp về Phòng Công tác Sinh viên (Phòng 102, Tòa nhà A1) để được xem xét hỗ trợ kịp thời. Ngoài ra, sinh viên có thể theo dõi và đăng ký xét các nguồn học bổng tài trợ từ doanh nghiệp và cựu sinh viên được khoa thông báo thường xuyên.'
      },
      {
        id: 2,
        cau_hoi: 'Em thuộc diện Hộ nghèo có được miễn, giảm học phí không?',
        tra_loi: 'Sinh viên thuộc diện Hộ nghèo, cận nghèo được hỗ trợ miễn, giảm học phí theo quy định tại Nghị định 81/2021/NĐ-CP và Nghị định 104/2022/NĐ-CP của Chính phủ. Em vui lòng chuẩn bị Giấy chứng nhận hộ nghèo/cận nghèo năm hiện tại công chứng kèm Đơn đề nghị miễn giảm học phí nộp trực tiếp tại Phòng Kế hoạch - Tài chính Trường để hoàn tất hồ sơ xét miễn giảm.'
      }
    ]);
  },

  /**
   * Fetch student statistics datasets for chart rendering
   */
  async getStudentStats(programId) {
    // Simulated database query results for student counts
    if (programId === 1) {
      return {
        // Line chart data (K42 - K52)
        batches: ['K42', 'K43', 'K44', 'K45', 'K46', 'K47', 'K48', 'K49', 'K50', 'K51', 'K52'],
        studentCounts: [48, 85, 100, 72, 148, 70, 66, 64, 110, 80, 0], // K52: 0 (not enrolled yet)
        
        // Bar chart data (Graduated K42 - K46)
        gradBatches: ['K42', 'K43', 'K44', 'K45', 'K46'],
        graduated: [45, 80, 95, 65, 120],
        onTime: [20, 30, 45, 35, 75],
        early: [0, 5, 12, 8, 10]
      };
    }

    // AI Program (ID = 2)
    return {
      batches: ['K42', 'K43', 'K44', 'K45', 'K46', 'K47', 'K48', 'K49', 'K50', 'K51', 'K52'],
      studentCounts: [0, 0, 0, 0, 0, 0, 0, 0, 0, 60, 0], // AI started at K51!
      
      // No graduates yet as K51 is in their 2nd year!
      gradBatches: [],
      graduated: [],
      onTime: [],
      early: []
    };
  }
};
