import pool from './db.js';

const seed = async () => {
  console.log('🌱 Bat dau don dep va nap du lieu mau (seeding)...');
  const connection = await pool.getConnection();
  try {
    // Disable foreign keys temporarily to truncate tables cleanly
    await connection.query('SET FOREIGN_KEY_CHECKS = 0');
    
    // Clear existing tables
    await connection.query('TRUNCATE TABLE tai_khoan_admin_google');
    await connection.query('TRUNCATE TABLE nhom_nhan_su');
    await connection.query('TRUNCATE TABLE nhan_vien');
    await connection.query('TRUNCATE TABLE slider_trang_chu');
    await connection.query('TRUNCATE TABLE tin_tuc');
    await connection.query('TRUNCATE TABLE de_tai_nghien_cuu');
    await connection.query('TRUNCATE TABLE thong_ke_noi_bat');

    console.log('🧹 Da xoa sach du lieu cu trong cac bang chinh.');

    // 1. Seed nhom_nhan_su
    await connection.query(`
      INSERT INTO nhom_nhan_su (id, ten_nhom, slug_nhom, thu_tu, background_color) VALUES 
      (1, 'BAN LÃNH ĐẠO KHOA', 'lanh-dao-khoa', 1, '#f8fafc'),
      (2, 'GIẢNG VIÊN & TRỢ GIẢNG', 'giang-vien-tro-giang', 2, '#ffffff')
    `);
    console.log('✅ Da nap bang: nhom_nhan_su');

    // 2. Seed tai_khoan_admin_google
    await connection.query(`
      INSERT INTO tai_khoan_admin_google (id, google_id, email, ho_ten, avatar_url, quyen_han, trang_thai) VALUES 
      (1, '111111111111111111111', 'lamnn@tvu.edu.vn', 'TS. Nguyễn Nhứt Lam', 'assets/images/deans/lamnn.jpg', 'SUPER_ADMIN', 1)
    `);
    console.log('✅ Da nap bang: tai_khoan_admin_google');

    // 3. Seed nhan_vien (Lecturers / Staff)
    await connection.query(`
      INSERT INTO nhan_vien (id, nhom_id, ho_ten, hoc_ham, hoc_vi, ngach_vien_chuc, don_vi_cong_tac, chuc_vu, email, slug_ca_nhan, anh_ca_nhan_url, thu_tu_trong_nhom, an_hien) VALUES 
      (1, 1, 'TS. Nguyễn Nhứt Lam', NULL, 'Tiến sĩ', 'Giảng viên chính', 'Khoa Công nghệ thông tin - TVU', 'Trưởng khoa', 'lamnn@tvu.edu.vn', 'lamnn', 'assets/images/deans/lamnn.jpg', 1, 1),
      (2, 1, 'ThS. Lê Phong Dụ', NULL, 'Thạc sĩ', 'Giảng viên', 'Khoa Công nghệ thông tin - TVU', 'Phó trưởng khoa', 'lpdu@tvu.edu.vn', 'lpdu', 'assets/images/deans/lpdu.jpg', 2, 1),
      (3, 2, 'ThS. Nguyễn Ngọc Lâm', NULL, 'Thạc sĩ', 'Giảng viên', 'Khoa Công nghệ thông tin - TVU', 'Trưởng bộ môn mạng', 'lamnn-gv', 'lamnn-gv', 'assets/images/deans/lamnn.jpg', 3, 1)
    `);
    console.log('✅ Da nap bang: nhan_vien');

    // 4. Seed slider_trang_chu
    await connection.query(`
      INSERT INTO slider_trang_chu (id, ten_slide, hinh_anh_url, link_lien_ket, thu_tu) VALUES 
      (1, 'Chào mừng đến với Khoa CNTT - TVU', 'assets/images/sliders/slide1.jpg', '#', 1),
      (2, 'Tuyển sinh ngành Công nghệ thông tin & Trí tuệ nhân tạo', 'assets/images/sliders/slide2.jpg', '#', 2)
    `);
    console.log('✅ Da nap bang: slider_trang_chu');

    // 5. Seed tin_tuc
    await connection.query(`
      INSERT INTO tin_tuc (id, tieu_de, slug, ngay_dang, nhan_lon, nhan_nho, noi_dung_html, tom_tat, icon_svg, huong_hien_thi, an_hien, thu_tu) VALUES 
      (1, 'Hội thảo khoa học về Trí tuệ nhân tạo 2026', 'hoi-thao-ai-2026', '2026-08-01', '01/08/2026', 'Hội trường E4', '<p>Nội dung chi tiết hội thảo khoa học về ứng dụng AI trong giảng dạy và nghiên cứu thực tiễn tại trường Đại học Trà Vinh.</p>', 'Tóm tắt hội thảo AI 2026', NULL, 'right', 1, 1),
      (2, 'Lễ tốt nghiệp khóa 2022 ngành Công nghệ thông tin', 'le-tot-nghiep-2022', '2026-07-15', '15/07/2026', 'Khu I', '<p>Chúc mừng các tân kỹ sư ngành Công nghệ thông tin đã bảo vệ thành công luận văn tốt nghiệp và nhận bằng cử nhân.</p>', 'Tóm tắt tốt nghiệp CNTT', NULL, 'left', 1, 2)
    `);
    console.log('✅ Da nap bang: tin_tuc');

    // 6. Seed de_tai_nghien_cuu
    await connection.query(`
      INSERT INTO de_tai_nghien_cuu (id, ten_de_tai, cap, chu_nhiem_id, chu_nhiem_ten, trang_thai, thu_tu) VALUES 
      (1, 'Nghiên cứu xây dựng chatbot AI tư vấn tuyển sinh TVU', 'Đề tài cấp cơ sở', 1, 'TS. Nguyễn Nhứt Lam', 'Đang thực hiện', 1),
      (2, 'Ứng dụng IoT trong quản lý phòng học thông minh', 'Đề tài cấp cơ sở', 2, 'ThS. Lê Phong Dụ', 'Đã hoàn thành', 2)
    `);
    console.log('✅ Da nap bang: de_tai_nghien_cuu');

    // 7. Seed thong_ke_noi_bat
    await connection.query(`
      INSERT INTO thong_ke_noi_bat (id, ten_chi_so, so_lieu_thong_ke, don_vi, ghi_chu_thoi_gian, thu_tu) VALUES 
      (1, 'Sinh viên đang theo học', 1200, '+', 'Tính đến tháng 12/2025', 1),
      (2, 'Giảng viên chuyên môn', 45, '', 'Tính đến tháng 12/2025', 2),
      (3, 'Đề tài NCKH các cấp', 28, '+', 'Tính đến tháng 12/2025', 3),
      (4, 'Tỷ lệ sinh viên có việc làm', 95, '%', 'Khảo sát sau 1 năm tốt nghiệp', 4)
    `);
    console.log('✅ Da nap bang: thong_ke_noi_bat');

    console.log('🎉 Qua trinh don dep va nap du lieu mau hoan thanh xuat sac!');
  } catch (err) {
    console.error('❌ Loi khi nap du lieu mau:', err.message);
  } finally {
    await connection.query('SET FOREIGN_KEY_CHECKS = 1');
    connection.release();
    process.exit(0);
  }
};

seed();
