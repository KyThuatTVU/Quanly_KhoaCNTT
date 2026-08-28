import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environmental config from backend/.env
const envPath = path.resolve(__dirname, '../../../.env');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

const pool = mysql.createPool({
  host:             process.env.DB_HOST || '127.0.0.1',
  port:             parseInt(process.env.DB_PORT || '3306', 10),
  user:             process.env.DB_USER || 'root',
  password:         process.env.DB_PASSWORD || '',
  database:         process.env.DB_NAME || 'quanly_khoacntt_tvu',
  waitForConnections: true,
  connectionLimit:  5,
  queueLimit:       0,
  charset:          'utf8mb4'
});

async function main() {
  console.log('🚀 Đang kết nối tới CSDL để nạp dữ liệu mẫu cho các bảng còn trống...');
  const conn = await pool.getConnection();

  try {
    // 1. Tắt tạm thời kiểm tra khóa ngoại để dọn dẹp và nạp mới sạch sẽ
    await conn.query('SET FOREIGN_KEY_CHECKS = 0');
    console.log('🔓 Đã tắt kiểm tra khóa ngoại (FOREIGN_KEY_CHECKS = 0)');

    // Danh sách các bảng cần truncate và chèn dữ liệu
    const tablesToClean = [
      'chuong_trinh_dao_tao_dai_hoc',
      'cau_truc_khoi_kien_thuc',
      'dinh_huong_nghien_cuu_chuyen_nganh',
      'phuong_thuc_tuyen_sinh',
      'chuan_dau_ra_plo',
      'hoc_phan_cong_nghe_cot_loi',
      'co_hoi_nghe_nghiep',
      'faq_dai_hoc',
      'trang_ca_nhan',
      'nhan_vien_de_tai_nckh',
      'nhan_vien_bai_bao_khoa_hoc',
      'nhan_vien_du_an',
      'nhan_vien_sach_giao_trinh',
      'nhan_vien_huong_dan_nckh',
      'tuyen_sinh_sau_dai_hoc_thong_bao',
      'danh_sach_nghien_cuu_sinh',
      'thong_ke_sau_dai_hoc_chartsy',
      'hoat_dong_sau_dai_hoc',
      'phong_thi_nghiem',
      'hinh_anh_tin_tuc',
      'gallery',
      'doi_tac_hop_tac_quoc_te',
      'lich_su_hinh_thanh',
      'su_menh_tam_nhin',
      'gioi_thieu_tong_quan',
      'gioi_thieu_highlights',
      'thong_tin_tuyen_sinh',
      'trang_chu_hero',
      'trang_chu_chuong_trinh_noi_bat',
      'thong_tin_su_kien_tieu_diem',
      'infographic_items',
      'sinh_vien_tieu_bieu',
      'cuu_sinh_vien_tieu_bieu',
      'gallery_hoat_dong_trang_chu',
      'gioi_thieu_lien_he_ban_giam_khoa',
      'lien_he_don_vi'
    ];

    for (const table of tablesToClean) {
      await conn.query(`TRUNCATE TABLE \`${table}\``);
    }
    console.log('🧹 Đã xóa sạch dữ liệu cũ trong các bảng.');

    // 2. Chèn bảng chuong_trinh_dao_tao_dai_hoc (Các ngành đại học)
    await conn.query(`
      INSERT INTO chuong_trinh_dao_tao_dai_hoc (id, ten_nganh, ma_tuyen_sinh, van_bang_tot_nghiep, thoi_gian_hoc, tong_so_tin_chi, gioi_thieu_nganh, co_hoi_phat_trien) VALUES
      (1, 'Công nghệ thông tin', '7480201', 'Kỹ sư', '4.5 Năm', 161, 'Chương trình đào tạo Kỹ sư Công nghệ thông tin trang bị kiến thức chuyên sâu về công nghệ phần mềm, quản trị mạng, an toàn thông tin và trí tuệ nhân tạo nhằm đào tạo nguồn nhân lực chất lượng cao bắt kịp xu thế số hóa.', 'Sinh viên tốt nghiệp có cơ hội làm việc tại các vị trí Lập trình viên, Chuyên viên quản trị mạng, Kiểm thử phần mềm, Kỹ sư hệ thống tại các công ty công nghệ lớn trong và ngoài nước.'),
      (2, 'Trí tuệ nhân tạo', '7480107', 'Kỹ sư', '4.5 Năm', 161, 'Chương trình đào tạo Kỹ sư Trí tuệ nhân tạo tiên phong định hướng xử lý ngôn ngữ tự nhiên, học máy, phân tích dữ liệu lớn và thiết kế robot thông minh phục vụ cách mạng công nghiệp 4.0.', 'Kỹ sư AI có cơ hội việc làm rộng mở như Kỹ sư dữ liệu (Data Engineer), Kỹ sư học máy (Machine Learning Engineer), Nghiên cứu viên AI, chuyên viên phân tích nghiệp vụ công nghệ.')
    `);
    console.log('✅ Đã nạp bảng: chuong_trinh_dao_tao_dai_hoc');

    // 3. Chèn bảng cau_truc_khoi_kien_thuc (Khối kiến thức)
    await conn.query(`
      INSERT INTO cau_truc_khoi_kien_thuc (id, nganh_id, ten_khoi, so_tin_chi, mo_ta_khoi, thu_tu) VALUES
      (1, 1, 'Kiến thức Giáo dục đại cương', 46, 'Bao gồm các học phần lý luận chính trị, toán học giải tích, đại số tuyến tính, vật lý đại cương, ngoại ngữ và giáo dục thể chất làm nền tảng phát triển tư duy.', 1),
      (2, 1, 'Kiến thức Cơ sở ngành', 56, 'Bao gồm các học phần cốt lõi như Lập trình hướng đối tượng, Cấu trúc dữ liệu & Giải thuật, Hệ điều hành, Cơ sở dữ liệu, Kiến trúc máy tính và Mạng máy tính.', 2),
      (3, 1, 'Kiến thức Chuyên ngành', 59, 'Bao gồm các học phần nâng cao: Phát triển ứng dụng Web, Công nghệ phần mềm, An toàn thông tin, Điện toán đám mây và Đồ án tốt nghiệp kỹ sư.', 3),
      (4, 2, 'Kiến thức Giáo dục đại cương (AI)', 46, 'Bao gồm các học phần đại cương cơ bản kết hợp toán cao cấp chuyên biệt phục vụ khoa học dữ liệu và học máy (Xác suất thống kê, Giải tích số).', 1),
      (5, 2, 'Kiến thức Cơ sở ngành (AI)', 56, 'Bao gồm các học phần: Nhập môn Trí tuệ nhân tạo, Cấu trúc dữ liệu giải thuật, Học máy cơ bản, Cơ sở dữ liệu lớn (Big Data) và Python chuyên sâu.', 2),
      (6, 2, 'Kiến thức Chuyên ngành (AI)', 59, 'Bao gồm các học phần: Học sâu (Deep Learning), Thị giác máy tính, Xử lý ngôn ngữ tự nhiên, Robot học thông minh và Đồ án tốt nghiệp chuyên ngành AI.', 3)
    `);
    console.log('✅ Đã nạp bảng: cau_truc_khoi_kien_thuc');

    // 4. Chèn bảng dinh_huong_nghien_cuu_chuyen_nganh (Hướng nghiên cứu chuyên ngành)
    await conn.query(`
      INSERT INTO dinh_huong_nghien_cuu_chuyen_nganh (id, nganh_id, ten_dinh_huong) VALUES
      (1, 1, 'Công nghệ phần mềm & Hệ thống thông tin'),
      (2, 1, 'Mạng máy tính & An toàn thông tin'),
      (3, 2, 'Học máy nâng cao & Thị giác máy tính'),
      (4, 2, 'Xử lý ngôn ngữ tự nhiên & Khai phá dữ liệu')
    `);
    console.log('✅ Đã nạp bảng: dinh_huong_nghien_cuu_chuyen_nganh');

    // 5. Chèn bảng phuong_thuc_tuyen_sinh (Phương thức tuyển sinh)
    await conn.query(`
      INSERT INTO phuong_thuc_tuyen_sinh (id, nganh_id, ten_phuong_thuc, danh_sach_to_hop) VALUES
      (1, 1, 'Xét tuyển dựa vào kết quả thi tốt nghiệp THPT', 'A00, A01, C01, D07'),
      (2, 1, 'Xét tuyển dựa vào kết quả học tập THPT (Học bạ)', 'A00, A01, C01, D07'),
      (3, 1, 'Xét tuyển kết quả kỳ thi Đánh giá năng lực ĐHQG', 'Bài thi ĐGNL'),
      (4, 2, 'Xét tuyển dựa vào kết quả thi tốt nghiệp THPT', 'A00, A01, C01, D07'),
      (5, 2, 'Xét tuyển kết quả học bạ THPT lớp 12', 'A00, A01, D07')
    `);
    console.log('✅ Đã nạp bảng: phuong_thuc_tuyen_sinh');

    // 6. Chèn bảng chuan_dau_ra_plo (PLOs)
    await conn.query(`
      INSERT INTO chuan_dau_ra_plo (id, nganh_id, ma_plo, noi_dung_plo) VALUES
      (1, 1, 'PLO 1', 'Khả năng áp dụng kiến thức toán học, khoa học cơ bản và kiến thức cốt lõi của CNTT để phân tích và giải quyết các bài toán kỹ thuật phức tạp.'),
      (2, 1, 'PLO 2', 'Khả năng phân tích, thiết kế, cài đặt và kiểm thử các hệ thống, thành phần hoặc chương trình phần mềm đáp ứng các yêu cầu thực tiễn.'),
      (3, 1, 'PLO 3', 'Khả năng giao tiếp hiệu quả, làm việc nhóm độc lập và có đạo đức nghề nghiệp, trách nhiệm xã hội cao.'),
      (4, 2, 'PLO 1', 'Khả năng áp dụng toán học chuyên sâu, lý thuyết học máy và thuật toán trí tuệ nhân tạo để mô hình hóa và giải quyết các vấn đề dữ liệu lớn.'),
      (5, 2, 'PLO 2', 'Khả năng phát triển, huấn luyện và tối ưu hóa các mô hình học sâu, thị giác máy tính và hệ thống tự hành thông minh.')
    `);
    console.log('✅ Đã nạp bảng: chuan_dau_ra_plo');

    // 7. Chèn bảng hoc_phan_cong_nghe_cot_loi (Học phần công nghệ cốt lõi)
    await conn.query(`
      INSERT INTO hoc_phan_cong_nghe_cot_loi (id, nganh_id, ma_hoc_phan, ten_hoc_phan, so_tin_chi, nang_luc_hinh_thanh) VALUES
      (1, 1, 'CN201', 'Lập trình Web nâng cao', 3, 'Sinh viên làm chủ công nghệ ReactJS, NodeJS, xây dựng các ứng dụng Web Fullstack chịu tải tốt và bảo mật.'),
      (2, 1, 'CN205', 'Quản trị mạng & An toàn thông tin', 3, 'Khả năng thiết kế hệ thống mạng doanh nghiệp, cài đặt tường lửa, phát hiện xâm nhập và ứng cứu sự cố bảo mật mạng.'),
      (3, 2, 'AI301', 'Học máy ứng dụng (Applied Machine Learning)', 3, 'Sử dụng thành thạo thư viện Scikit-learn, xây dựng các mô hình phân lớp, hồi quy và tiền xử lý dữ liệu chuẩn hóa.'),
      (4, 2, 'AI305', 'Học sâu chuyên sâu (Deep Learning)', 3, 'Thiết kế mạng nơ-ron nhân tạo CNN, RNN, Transformer trên môi trường PyTorch / TensorFlow để xử lý hình ảnh và ngôn ngữ.')
    `);
    console.log('✅ Đã nạp bảng: hoc_phan_cong_nghe_cot_loi');

    // 8. Chèn bảng co_hoi_nghe_nghiep (Vị trí việc làm / Môi trường công tác)
    await conn.query(`
      INSERT INTO co_hoi_nghe_nghiep (id, nganh_id, loai_thong_tin, noi_dung, thu_tu) VALUES
      (1, 1, 'vi_tri_dam_nhan', 'Kỹ sư phát triển phần mềm (Fullstack Web/Mobile Developer).', 1),
      (2, 1, 'vi_tri_dam_nhan', 'Chuyên viên Quản trị và Bảo mật hệ thống mạng doanh nghiệp.', 2),
      (3, 1, 'moi_truong_cong_tac', 'Các tập đoàn công nghệ lớn: FPT Software, VNPT, Viettel, TMA Solutions.', 1),
      (4, 2, 'vi_tri_dam_nhan', 'Kỹ sư Trí tuệ nhân tạo và Machine Learning Engineer.', 1),
      (5, 2, 'vi_tri_dam_nhan', 'Chuyên viên phân tích dữ liệu khoa học (Data Analyst / Data Scientist).', 2),
      (6, 2, 'moi_truong_cong_tac', 'Làm việc tại các trung tâm R&D về AI, phòng thí nghiệm thông minh hoặc các startup công nghệ.', 1)
    `);
    console.log('✅ Đã nạp bảng: co_hoi_nghe_nghiep');

    // 9. Chèn bảng faq_dai_hoc (FAQ)
    await conn.query(`
      INSERT INTO faq_dai_hoc (id, cau_hoi, tra_loi, thu_tu) VALUES
      (1, 'Học phí ngành Công nghệ thông tin tại TVU là bao nhiêu?', 'Học phí được tính theo số tín chỉ đăng ký thực tế. Trung bình khoảng 15 đến 18 triệu đồng mỗi năm học tùy thuộc vào chương trình đào tạo.', 1),
      (2, 'Ngành Trí tuệ nhân tạo khác gì so với Công nghệ thông tin?', 'Ngành Trí tuệ nhân tạo tập trung sâu vào toán học thuật toán, mô hình hóa dữ liệu lớn, xử lý hình ảnh và giọng nói nâng cao; trong khi Công nghệ thông tin có phạm vi rộng hơn bao gồm cả hạ tầng mạng, quản trị hệ thống và phát triển phần mềm ứng dụng thông thường.', 2)
    `);
    console.log('✅ Đã nạp bảng: faq_dai_hoc');

    // 10. Chèn bảng trang_ca_nhan (Giảng viên profile)
    await conn.query(`
      INSERT INTO trang_ca_nhan (id, nhan_vien_id, wp_post_id, email, ngach_vien_chuc, hoc_vi, hoc_ham, don_vi_cong_tac, linh_vuc_nghien_cuu, google_scholar_url, google_scholar_id, orcid_url, orcid_id, github_url, website_ca_nhan) VALUES
      (1, 1, NULL, 'lamnn@tvu.edu.vn', 'Giảng viên chính', 'Tiến sĩ', NULL, 'Khoa Công nghệ thông tin, Trường Đại học Trà Vinh', 'Trí tuệ nhân tạo, Học máy nâng cao, Khai phá dữ liệu lớn, Chatbot thông minh phục vụ giáo dục số.', 'https://scholar.google.com', 'GS-ID123', 'https://orcid.org', 'ORCID-123', 'https://github.com', 'https://fit.tvu.edu.vn'),
      (2, 2, NULL, 'lpdu@tvu.edu.vn', 'Giảng viên', 'Thạc sĩ', NULL, 'Khoa Công nghệ thông tin, Trường Đại học Trà Vinh', 'Mạng máy tính, Điện toán đám mây, Thiết kế hệ thống mạng IoT an toàn thông tin.', 'https://scholar.google.com', 'GS-ID456', 'https://orcid.org', 'ORCID-456', 'https://github.com', 'https://fit.tvu.edu.vn')
    `);
    console.log('✅ Đã nạp bảng: trang_ca_nhan');

    // 11. Chèn bảng nhan_vien_de_tai_nckh
    await conn.query(`
      INSERT INTO nhan_vien_de_tai_nckh (id, nhan_vien_id, stt, ten_de_tai, nam_hoan_thanh, cap_de_tai, trach_nhiem_tham_gia) VALUES
      (1, 1, 1, 'Nghiên cứu xây dựng chatbot AI hỗ trợ tư vấn học vụ sinh viên', 2025, 'Đề tài cấp cơ sở', 'Chủ nhiệm đề tài'),
      (2, 2, 1, 'Xây dựng mô hình giám sát phòng lab thông minh dùng IoT', 2024, 'Đề tài cấp cơ sở', 'Chủ nhiệm đề tài')
    `);
    console.log('✅ Đã nạp bảng: nhan_vien_de_tai_nckh');

    // 12. Chèn bảng nhan_vien_bai_bao_khoa_hoc
    await conn.query(`
      INSERT INTO nhan_vien_bai_bao_khoa_hoc (id, nhan_vien_id, loai_xuat_ban, stt, danh_sach_tac_gia, nam_xuat_ban, ten_bai_bao, ten_tap_chi_hoi_nghi, so_tap_chi_trang, trang_thai_xuat_ban) VALUES
      (1, 1, 'tieng_anh', 1, 'Nguyen Nhut Lam, Tran Van A', 2025, 'An Empirical Study on Transformer Architectures for Educational Chatbots', 'IEEE Conference on AI in Education', 'Vol 12, pp. 45-56', '(Đã xuất bản)'),
      (2, 2, 'tieng_viet', 1, 'Lê Phong Dũ, Nguyễn Văn B', 2024, 'Xây dựng giải pháp giám sát an ninh mạng IoT cho doanh nghiệp nhỏ', 'Tạp chí Khoa học Đại học Trà Vinh', 'Số 42, tr. 12-20', '(Đã xuất bản)')
    `);
    console.log('✅ Đã nạp bảng: nhan_vien_bai_bao_khoa_hoc');

    // 13. Chèn bảng nhan_vien_du_an
    await conn.query(`
      INSERT INTO nhan_vien_du_an (id, nhan_vien_id, ten_du_an, nam_thuc_hien, vai_tro, mo_ta) VALUES
      (1, 1, 'Dự án số hóa học vụ tuyển sinh và quản lý đào tạo trực tuyến', '2024 - 2025', 'Trưởng nhóm kỹ thuật', 'Thiết kế kiến trúc hệ thống và tích hợp mô hình AI.'),
      (2, 2, 'Dự án tư vấn hạ tầng đám mây cho Sở Thông tin và Truyền thông', '2023 - 2024', 'Chuyên gia tư vấn', 'Tư vấn an toàn thông tin và giải pháp chịu tải cao.')
    `);
    console.log('✅ Đã nạp bảng: nhan_vien_du_an');

    // 14. Chèn bảng nhan_vien_sach_giao_trinh
    await conn.query(`
      INSERT INTO nhan_vien_sach_giao_trinh (id, nhan_vien_id, ten_sach_giao_trinh, nha_xuat_ban, nam_xuat_ban, vai_tro) VALUES
      (1, 1, 'Giáo trình Cơ sở Trí tuệ Nhân tạo', 'NXB Đại học Trà Vinh', 2024, 'Chủ biên'),
      (2, 2, 'Giáo trình An toàn thông tin mạng cơ bản', 'NXB Đại học Trà Vinh', 2023, 'Đồng tác giả')
    `);
    console.log('✅ Đã nạp bảng: nhan_vien_sach_giao_trinh');

    // 15. Chèn bảng nhan_vien_huong_dan_nckh
    await conn.query(`
      INSERT INTO nhan_vien_huong_dan_nckh (id, nhan_vien_id, loai_hoc_vien, ten_hoc_vien, ten_de_tai_huong_dan, nam_bao_ve) VALUES
      (1, 1, 'hoc_vien_cao_hoc', 'Trần Văn Cường', 'Ứng dụng thuật toán học sâu nhận dạng chữ viết tay', 2024),
      (2, 2, 'sinh_vien_nckh', 'Nhóm SV K22-CNTT', 'Xây dựng thiết bị tưới tự động tiết kiệm nước qua ứng dụng di động', 2025)
    `);
    console.log('✅ Đã nạp bảng: nhan_vien_huong_dan_nckh');

    // 16. Chèn bảng tuyen_sinh_sau_dai_hoc_thong_bao (Thông báo SĐH)
    await conn.query(`
      INSERT INTO tuyen_sinh_sau_dai_hoc_thong_bao (id, tieu_de_thong_bao, link_chi_tiet, thu_tu, lien_he_tu_van) VALUES
      (1, 'Thông báo tuyển sinh trình độ Thạc sĩ ngành Công nghệ thông tin đợt 1 năm 2026', '#', 1, 'Văn phòng tuyển sinh Sau đại học, tầng trệt tòa nhà B1, Đại học Trà Vinh.'),
      (2, 'Thông báo tuyển sinh trình độ Tiến sĩ ngành Khoa học máy tính năm 2026', '#', 2, 'Văn phòng tuyển sinh Sau đại học, tầng trệt tòa nhà B1, Đại học Trà Vinh.')
    `);
    console.log('✅ Đã nạp bảng: tuyen_sinh_sau_dai_hoc_thong_bao');

    // 17. Chèn bảng danh_sach_nghien_cuu_sinh (Nghiên cứu sinh)
    await conn.query(`
      INSERT INTO danh_sach_nghien_cuu_sinh (id, stt, ho_ten, chuc_vu_co_quan, email, avatar_url, google_scholar_url, ma_ncs, huong_nghien_cuu, nguoi_huong_dan, trang_thai, an_hien, an_hien_ma_ncs, an_hien_email) VALUES
      (1, '01', 'Nguyễn Văn Minh', 'Giảng viên tại Cao đẳng Nghề Trà Vinh', 'minhnv@gmail.com', 'assets/images/deans/lamnn.jpg', '#', 'NCS-2024-001', 'Nghiên cứu tối ưu hóa thuật toán phân cụm dữ liệu lớn', 'TS. Nguyễn Nhứt Lam', 'Đang học', 1, 1, 1),
      (2, '02', 'Trần Thị Mai', 'Chuyên viên Sở KH&CN Trà Vinh', 'maitt@gmail.com', 'assets/images/deans/lamnn.jpg', '#', 'NCS-2024-002', 'Ứng dụng AI nhận dạng bệnh hại cây trồng vùng ĐBSCL', 'TS. Nguyễn Nhứt Lam', 'Đang học', 1, 1, 1)
    `);
    console.log('✅ Đã nạp bảng: danh_sach_nghien_cuu_sinh');

    // 18. Chèn bảng thong_ke_sau_dai_hoc_chartsy
    await conn.query(`
      INSERT INTO thong_ke_sau_dai_hoc_chartsy (id, tieu_de_bieu_do, moc_thoi_gian_tinh, chart_config_json) VALUES
      (1, 'Biểu đồ số lượng Học viên Cao học & Nghiên cứu sinh qua các khóa tuyển sinh', 'Số liệu tính đến tháng 7 năm 2026', '{\"series\": [{\"name\": \"Học viên\", \"data\": [30, 45, 35, 50, 40]}, {\"name\": \"NCS\", \"data\": [2, 4, 3, 5, 6]}], \"categories\": [\"Khóa 2022\", \"Khóa 2023\", \"Khóa 2024\", \"Khóa 2025\", \"Khóa 2026\"]}')
    `);
    console.log('✅ Đã nạp bảng: thong_ke_sau_dai_hoc_chartsy');

    // 19. Chèn bảng hoat_dong_sau_dai_hoc (Postgrad Gallery)
    await conn.query(`
      INSERT INTO hoat_dong_sau_dai_hoc (id, tieu_de, hinh_anh_url, thu_tu, an_hien) VALUES
      (1, 'Lễ khai giảng khóa đào tạo Thạc sĩ CNTT khóa 2025', 'assets/images/gallery/gallery1.jpg', 1, 1),
      (2, 'Học viên cao học bảo vệ thành công luận văn tốt nghiệp', 'assets/images/gallery/gallery2.jpg', 2, 1)
    `);
    console.log('✅ Đã nạp bảng: hoat_dong_sau_dai_hoc');

    // 20. Chèn bảng phong_thi_nghiem (Labs)
    await conn.query(`
      INSERT INTO phong_thi_nghiem (id, ten, ten_viet_tat, truong_phong_id, truong_phong_ten, mo_ta, hinh_anh_url) VALUES
      (1, 'Phòng Thí nghiệm Thị giác máy tính và Xử lý ảnh', 'CVIP Lab', 1, 'TS. Nguyễn Nhứt Lam', 'Phòng lab trang bị máy tính cấu hình cao phục vụ các nghiên cứu về xử lý ảnh y tế, nhận dạng hành vi và xử lý ngôn ngữ tự nhiên.', 'assets/images/gallery/gallery3.jpg')
    `);
    console.log('✅ Đã nạp bảng: phong_thi_nghiem');

    // 21. Chèn bảng hinh_anh_tin_tuc
    await conn.query(`
      INSERT INTO hinh_anh_tin_tuc (id, tin_tuc_id, src_chinh, srcset_json, width, height, alt, sizes_attr, thu_tu) VALUES
      (1, 1, 'assets/images/news/news1.jpg', '[]', 800, 450, 'Hội thảo AI 2026', '(max-width: 800px) 100vw, 800px', 1),
      (2, 2, 'assets/images/news/news2.jpg', '[]', 800, 450, 'Lễ tốt nghiệp CNTT', '(max-width: 800px) 100vw, 800px', 1)
    `);
    console.log('✅ Đã nạp bảng: hinh_anh_tin_tuc');

    // 22. Chèn bảng gallery
    await conn.query(`
      INSERT INTO gallery (id, tieu_de, mo_ta, anh_url, thumbnail_url, danh_muc, ngay_chup, alt) VALUES
      (1, 'Hội thảo AI Quốc tế 2026', 'Ảnh lưu niệm các giáo sư tham dự hội thảo khoa học.', 'assets/images/gallery/gallery1.jpg', 'assets/images/gallery/gallery1.jpg', 'Sự kiện', '2026-08-01', 'Hội thảo AI'),
      (2, 'Thiết bị IoT đo độ mặn tự động', 'Mô hình nghiên cứu chuyển giao công nghệ cho nông nghiệp.', 'assets/images/gallery/gallery2.jpg', 'assets/images/gallery/gallery2.jpg', 'Nghiên cứu', '2026-05-15', 'Thiết bị IoT')
    `);
    console.log('✅ Đã nạp bảng: gallery');

    // 23. Chèn bảng doi_tac_hop_tac_quoc_te (Partners)
    await conn.query(`
      INSERT INTO doi_tac_hop_tac_quoc_te (id, ten_doi_tac, logo_url, hien_thi_o, thu_tu) VALUES
      (1, 'FPT Software', 'assets/images/partners/fpt.png', 'gioi_thieu', 1),
      (2, 'TMA Solutions', 'assets/images/partners/tma.png', 'gioi_thieu', 2),
      (3, 'VNPT Trà Vinh', 'assets/images/partners/vnpt.png', 'gioi_thieu', 3)
    `);
    console.log('✅ Đã nạp bảng: doi_tac_hop_tac_quoc_te');

    // 24. Chèn bảng lich_su_hinh_thanh (Timeline)
    await conn.query(`
      INSERT INTO lich_su_hinh_thanh (id, nam, ngay_cu_the, so_quyet_dinh, noi_dung, thu_tu) VALUES
      (1, '2009', '2009-08-15', '124/QĐ-ĐHTV', 'Thành lập Bộ môn Công nghệ thông tin trực thuộc Khoa Kỹ thuật và Công nghệ.', 1),
      (2, '2022', '2022-11-20', '892/QĐ-ĐHTV', 'Nâng cấp và chính thức thành lập Khoa Công nghệ thông tin (Trường Kỹ thuật và Công nghệ, ĐHTV).', 2)
    `);
    console.log('✅ Đã nạp bảng: lich_su_hinh_thanh');

    // 25. Chèn bảng su_menh_tam_nhin
    await conn.query(`
      INSERT INTO su_menh_tam_nhin (id, loai, tieu_de, noi_dung) VALUES
      (1, 'su_menh', 'SỨ MỆNH', 'Đào tạo nguồn nhân lực trình độ đại học và sau đại học ngành Công nghệ thông tin và Trí tuệ nhân tạo chất lượng cao, định hướng ứng dụng thực tiễn và hội nhập quốc tế.'),
      (2, 'tam_nhin', 'TẦM NHÌN 2030', 'Trở thành một trong những trung tâm đào tạo, nghiên cứu ứng dụng và chuyển giao công nghệ số hàng đầu tại khu vực Đồng bằng sông Cửu Long.')
    `);
    console.log('✅ Đã nạp bảng: su_menh_tam_nhin');

    // 26. Chèn bảng gioi_thieu_tong_quan
    await conn.query(`
      INSERT INTO gioi_thieu_tong_quan (id, badge_text, tieu_de, mo_ta_chi_tiet, hinh_anh_tap_the_url, caption_anh) VALUES
      (1, 'GIỚI THIỆU TỔNG QUAN', 'KHOA CÔNG NGHỆ THÔNG TIN', 'Khoa Công nghệ thông tin trường Đại học Trà Vinh (SIT) là cái nôi đào tạo hàng ngàn kỹ sư công nghệ chất lượng cao phục vụ tiến trình chuyển đổi số quốc gia. Khoa sở hữu đội ngũ giảng viên giàu kinh nghiệm, đạt trình độ Tiến sĩ, Thạc sĩ tốt nghiệp từ các trường đại học uy tín.', 'assets/images/gallery/gallery1.jpg', 'Tập thể giảng viên Khoa Công nghệ thông tin - TVU')
    `);
    console.log('✅ Đã nạp bảng: gioi_thieu_tong_quan');

    // 27. Chèn bảng gioi_thieu_highlights
    await conn.query(`
      INSERT INTO gioi_thieu_highlights (id, icon_class, tieu_de, mo_ta, thu_tu) VALUES
      (1, 'graduation-cap', 'Chương trình đạt chuẩn kiểm định', 'Chương trình đào tạo Kỹ sư CNTT đã hoàn tất kiểm định và hướng tới đạt chuẩn quốc tế ABET.', 1),
      (2, 'laptop-code', 'Cơ sở vật chất hiện đại', 'Hệ thống phòng lab chuyên dụng được trang bị cấu hình cao phục vụ nghiên cứu deep learning và IoT.', 2)
    `);
    console.log('✅ Đã nạp bảng: gioi_thieu_highlights');

    // 28. Chèn bảng thong_tin_tuyen_sinh
    await conn.query(`
      INSERT INTO thong_tin_tuyen_sinh (id, tieu_de_box, noi_dung_day_du, ma_nganh_ai, ma_nganh_cs, to_hop_xet_tuyen, diem_chuan_2025_ai, diem_chuan_2025_cs, chi_tieu_2026_ai, chi_tieu_2026_cs, lien_he_tuyen_sinh, an_hien) VALUES
      (1, '🎓 Tuyển sinh 2026', 'Khoa Công nghệ thông tin mở rộng chỉ tiêu xét tuyển các ngành hot năm 2026.', '7480107', '7480201', 'A00, A01, C01, D07', 16.00, 15.00, 50, 150, 'Hotline: 0294 3855 246 - Phòng Tuyển sinh TVU', 1)
    `);
    console.log('✅ Đã nạp bảng: thong_tin_tuyen_sinh');

    // 29. Chèn bảng trang_chu_hero
    await conn.query(`
      INSERT INTO trang_chu_hero (id, slogan_vi, slogan_en, hinh_anh_banner_url) VALUES
      (1, 'Khoa Công nghệ Thông tin', 'School of Information Technology', 'assets/banners/slide_fit.png')
    `);
    console.log('✅ Đã nạp bảng: trang_chu_hero');

    // 30. Chèn bảng trang_chu_chuong_trinh_noi_bat
    await conn.query(`
      INSERT INTO trang_chu_chuong_trinh_noi_bat (id, badge_text, nhan_kiem_dinh, ten_chuong_trinh, mo_ta_ngan, link_chi_tiet, thu_tu) VALUES
      (1, 'ABET', 'Đang tự đánh giá chuẩn kiểm định', 'Kỹ sư Công nghệ thông tin', 'Chương trình định hướng ứng dụng thực tế, đào tạo fullstack, quản trị mạng và bảo mật.', '../undergraduate/', 1),
      (2, 'HOT', 'Mũi nhọn công nghệ số', 'Kỹ sư Trí tuệ nhân tạo', 'Đào tạo học máy sâu, khoa học dữ liệu lớn và lập trình hệ thống robot thông minh.', '../undergraduate/', 2)
    `);
    console.log('✅ Đã nạp bảng: trang_chu_chuong_trinh_noi_bat');

    // 31. Chèn bảng thong_tin_su_kien_tieu_diem
    await conn.query(`
      INSERT INTO thong_tin_su_kien_tieu_diem (id, ngay_su_kien, tieu_de_su_kien, link_chi_tiet, thu_tu) VALUES
      (1, '01-09-2026', 'Khai giảng năm học mới và chào đón tân sinh viên khóa 2026', '#', 1),
      (2, '15-10-2026', 'Ngày hội việc làm CNTT (IT Job Fair 2026) với sự tham gia của 20 doanh nghiệp', '#', 2)
    `);
    console.log('✅ Đã nạp bảng: thong_tin_su_kien_tieu_diem');

    // 32. Chèn bảng infographic_items
    await conn.query(`
      INSERT INTO infographic_items (id, ten_infographic, file_anh_url, file_pdf_url, thu_tu) VALUES
      (1, 'Infographic Tuyển sinh ngành CNTT', 'assets/images/gallery/gallery1.jpg', '#', 1),
      (2, 'Infographic Tuyển sinh ngành AI', 'assets/images/gallery/gallery2.jpg', '#', 2)
    `);
    console.log('✅ Đã nạp bảng: infographic_items');

    // 33. Chèn bảng sinh_vien_tieu_bieu
    await conn.query(`
      INSERT INTO sinh_vien_tieu_bieu (id, ten_doi_ca_nhan, nganh_hoc, thanh_tich, giang_vien_huong_dan, chuyen_muc, hinh_anh_url, thu_tu, an_hien) VALUES
      (1, 'Đội SIT-AICode', 'Ngành Trí tuệ nhân tạo', 'Giải Nhất cuộc thi Ý tưởng Khởi nghiệp sinh viên TVU 2025', 'TS. Nguyễn Nhứt Lam', 'Sinh viên tiêu biểu', 'assets/images/gallery/gallery2.jpg', 1, 1),
      (2, 'Trần Văn Tiến', 'Ngành Công nghệ thông tin', 'Đạt danh hiệu Sinh viên 5 Tốt cấp Tỉnh năm học 2024-2025', NULL, 'Sinh viên tiêu biểu', 'assets/images/gallery/gallery3.jpg', 2, 1)
    `);
    console.log('✅ Đã nạp bảng: sinh_vien_tieu_bieu');

    // 34. Chèn bảng cuu_sinh_vien_tieu_bieu
    await conn.query(`
      INSERT INTO cuu_sinh_vien_tieu_bieu (id, ho_ten, chuc_danh_cong_ty, trich_dan_cam_nhan, hinh_anh_avatar_url, thu_tu, an_hien) VALUES
      (1, 'Nguyễn Văn Đạt', 'Senior Developer @ FPT Software (Cựu SV khóa 2018)', 'Kiến thức thực tiễn học tại khoa giúp tôi thích nghi và thăng tiến rất nhanh trong môi trường doanh nghiệp lớn.', 'assets/images/deans/lamnn.jpg', 1, 1),
      (2, 'Trần Thị Thu thảo', 'Data Analyst @ VNG Corporation (Cựu SV khóa 2019)', 'Môi trường học tập năng động và các thầy cô luôn tận tình định hướng nghề nghiệp cho sinh viên từ rất sớm.', 'assets/images/deans/lamnn.jpg', 2, 1)
    `);
    console.log('✅ Đã nạp bảng: cuu_sinh_vien_tieu_bieu');

    // 35. Chèn bảng gallery_hoat_dong_trang_chu
    await conn.query(`
      INSERT INTO gallery_hoat_dong_trang_chu (id, tieu_de_anh, hinh_anh_url, thu_tu) VALUES
      (1, 'Lễ khai mạc hội thảo công nghệ thông tin 2026', 'assets/images/gallery/gallery1.jpg', 1),
      (2, 'Sinh viên khoa CNTT trong giờ thực hành lập trình', 'assets/images/gallery/gallery2.jpg', 2),
      (3, 'Đoàn trường khen thưởng sinh viên có thành tích xuất sắc', 'assets/images/gallery/gallery3.jpg', 3)
    `);
    console.log('✅ Đã nạp bảng: gallery_hoat_dong_trang_chu');

    // 36. Chèn bảng gioi_thieu_lien_he_ban_giam_khoa
    await conn.query(`
      INSERT INTO gioi_thieu_lien_he_ban_giam_khoa (id, nhan_vien_id, ho_ten, chuc_vu_phu_trach, email, thu_tu) VALUES
      (1, 1, 'TS. Nguyễn Nhứt Lam', 'Trưởng khoa - Phụ trách chung', 'lamnn@tvu.edu.vn', 1),
      (2, 2, 'ThS. Lê Phong Dũ', 'Phó trưởng khoa - Phụ trách học vụ', 'lpdu@tvu.edu.vn', 2)
    `);
    console.log('✅ Đã nạp bảng: gioi_thieu_lien_he_ban_giam_khoa');

    // 37. Chèn bảng lien_he_don_vi
    await conn.query(`
      INSERT INTO lien_he_don_vi (id, ten_don_vi, truong_don_vi, khu, dai_hoc, dia_chi_duong, phuong, thanh_pho, facebook_url, copyright_text) VALUES
      (1, 'Khoa Công nghệ thông tin', 'Trường Kỹ thuật và Công nghệ', 'Khu I', 'Trường Đại học Trà Vinh', 'Số 126 Nguyễn Thiện Thành', 'Phường 5', 'Thành phố Trà Vinh', 'https://www.facebook.com/fit.tvu.edu.vn', '© 2026 School of Information Technology - TVU')
    `);
    console.log('✅ Đã nạp bảng: lien_he_don_vi');

    console.log('🚀 NẠP DỮ LIỆU THÀNH CÔNG VÀ ĐỒNG NHẤT 100% CHO TẤT CẢ CÁC BẢNG!');
  } catch (err) {
    console.error('❌ Lỗi khi nạp dữ liệu mẫu:', err.message);
  } finally {
    // Bật lại kiểm tra khóa ngoại sau khi hoàn tất
    await conn.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log('🔒 Đã bật lại kiểm tra khóa ngoại (FOREIGN_KEY_CHECKS = 1)');
    conn.release();
    pool.end();
  }
}

main();
