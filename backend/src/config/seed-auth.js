/**
 * src/config/seed-auth.js
 * Seed dữ liệu xác thực:
 * 1. Tạo/kiểm tra 24 giảng viên trong bảng nhan_vien
 * 2. Tạo tài khoản tai_khoan_nhan_vien với mật khẩu hash
 * Chạy: node src/config/seed-auth.js
 */
import mysql  from 'mysql2/promise';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

const BCRYPT_ROUNDS = 12;

// ── Danh sách 24 giảng viên ────────────────────────────────────────────────────
const LECTURERS = [
  { ho_ten: 'Dương Ngọc Vân Khanh',       email: 'vankhanh@tvu.edu.vn',       dien_thoai: '0988332008' },
  { ho_ten: 'Đoàn Phước Miền',             email: 'phuocmien@tvu.edu.vn',      dien_thoai: '0978962954' },
  { ho_ten: 'Hà Thị Thúy Vi',              email: 'hattvi201084@tvu.edu.vn',   dien_thoai: '0983001084' },
  { ho_ten: 'Huỳnh Văn Thanh',             email: 'hvthanh@tvu.edu.vn',        dien_thoai: '0977654181' },
  { ho_ten: 'Khấu Văn Nhựt',              email: 'nhutkhau@tvu.edu.vn',       dien_thoai: '0993504172' },
  { ho_ten: 'Lê Minh Tự',                 email: 'lmtu@tvu.edu.vn',           dien_thoai: '0918677326' },
  { ho_ten: 'Lê Phong Dũ',                email: 'lpdu@tvu.edu.vn',           dien_thoai: '0914256578' },
  { ho_ten: 'Ngô Thanh Huy',              email: 'huyngocntt@tvu.edu.vn',     dien_thoai: '0989623237' },
  { ho_ten: 'Nguyễn Bá Nhiệm',            email: 'nhiemnb@tvu.edu.vn',        dien_thoai: '0983303609' },
  { ho_ten: 'Nguyễn H.D Thiện',           email: 'thiennhd@tvu.edu.vn',       dien_thoai: '0989274222' },
  { ho_ten: 'Nguyễn Khắc Quốc',           email: 'nkquoc@tvu.edu.vn',         dien_thoai: '0918085180' },
  { ho_ten: 'Nguyễn Mộng Hiền',           email: 'hientvu@tvu.edu.vn',        dien_thoai: '0975999579' },
  { ho_ten: 'Nguyễn Ngọc Đan Thanh',      email: 'ngocdanthanhdt@tvu.edu.vn', dien_thoai: '0916741252' },
  { ho_ten: 'Nguyễn Nhứt Lam',            email: 'lamnn@tvu.edu.vn',          dien_thoai: '0919556441' },
  { ho_ten: 'Nguyễn Thừa Phát Tài',       email: 'phattai@tvu.edu.vn',        dien_thoai: '0988345131' },
  { ho_ten: 'Nguyễn Trần Diễm Hạnh',      email: 'diemhanh_tvu@tvu.edu.vn',   dien_thoai: '0842250996' },
  { ho_ten: 'Phạm Minh Đương',            email: 'duongminh@tvu.edu.vn',      dien_thoai: '0982231344' },
  { ho_ten: 'Phạm Thị Trúc Mai',          email: 'pttmai@tvu.edu.vn',         dien_thoai: '0936010206' },
  { ho_ten: 'Phan Thị Phương Nam',        email: 'ptpnam@tvu.edu.vn',         dien_thoai: '0989236166' },
  { ho_ten: 'Thạch Kọng Saoane',          email: 'oane@tvu.edu.vn',           dien_thoai: '0972904191' },
  { ho_ten: 'Trầm Hoàng Nam',             email: 'tramhoangnam@tvu.edu.vn',    dien_thoai: '0977810235' },
  { ho_ten: 'Trần Văn Nam',              email: 'namtv@tvu.edu.vn',          dien_thoai: '0365583414' },
  { ho_ten: 'Trịnh Quốc Việt',            email: 'tqviettv@tvu.edu.vn',       dien_thoai: '0354696999' },
  { ho_ten: 'Võ Thành C',                 email: 'vothanhc@tvu.edu.vn',       dien_thoai: '0909119657' },
];

// ── Admin mặc định (sẽ được dùng để seed GV) ────────────────────────────────
const DEFAULT_ADMIN = {
  google_id:  'bootstrap_admin_lamnn',
  email:      'lamnn@tvu.edu.vn',
  ho_ten:     'TS. Nguyễn Nhứt Lam',
  avatar_url: 'assets/images/default-avatar.webp',
  quyen_han:  'SUPER_ADMIN',
  trang_thai: 1
};

async function run() {
  const conn = await mysql.createConnection({
    host:     process.env.DB_HOST     || '127.0.0.1',
    port:     parseInt(process.env.DB_PORT || '3306'),
    user:     process.env.DB_USER     || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME     || 'quanly_khoacntt_tvu',
    charset:  'utf8mb4'
  });

  console.log('✅ Đã kết nối MySQL.');

  try {
    // ── 1. Chạy migration thêm cột phai_doi_mat_khau ────────────────────────
    console.log('\n📦 Bước 1: Chạy migration auth fields...');
    try {
      await conn.query(`
        ALTER TABLE tai_khoan_nhan_vien
          ADD COLUMN IF NOT EXISTS phai_doi_mat_khau TINYINT(1) NOT NULL DEFAULT 1
          AFTER trang_thai
      `);
      console.log('  ✅ Cột phai_doi_mat_khau đã sẵn sàng.');
    } catch (e) {
      if (e.code === 'ER_DUP_FIELDNAME') {
        console.log('  ℹ️  Cột phai_doi_mat_khau đã tồn tại, bỏ qua.');
      } else { throw e; }
    }

    // ── 2. Tạo bảng sessions ────────────────────────────────────────────────
    await conn.query(`
      CREATE TABLE IF NOT EXISTS sessions (
        session_id VARCHAR(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
        expires    INT UNSIGNED NOT NULL,
        data       MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
        PRIMARY KEY (session_id),
        INDEX sessions_expires_idx (expires)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('  ✅ Bảng sessions đã sẵn sàng.');

    // ── 3. Tạo bảng nhat_ky_hoat_dong ──────────────────────────────────────
    await conn.query(`
      CREATE TABLE IF NOT EXISTS nhat_ky_hoat_dong (
        id          INT AUTO_INCREMENT PRIMARY KEY,
        user_id     INT DEFAULT NULL,
        user_type   ENUM('admin','lecturer') NOT NULL,
        hanh_dong   VARCHAR(100) NOT NULL,
        mo_ta       TEXT DEFAULT NULL,
        doi_tuong   VARCHAR(100) DEFAULT NULL,
        doi_tuong_id INT DEFAULT NULL,
        ip_address  VARCHAR(45) DEFAULT NULL,
        user_agent  TEXT DEFAULT NULL,
        ngay_tao    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('  ✅ Bảng nhat_ky_hoat_dong đã sẵn sàng.');

    // ── 4. Đảm bảo có ít nhất 1 Admin để tạo FK ────────────────────────────
    console.log('\n👤 Bước 2: Kiểm tra tài khoản Admin mặc định...');
    const [existingAdmin] = await conn.query(
      'SELECT id FROM tai_khoan_admin_google WHERE email = ? LIMIT 1',
      [DEFAULT_ADMIN.email]
    );

    let adminId;
    if (existingAdmin.length > 0) {
      adminId = existingAdmin[0].id;
      console.log(`  ℹ️  Admin ${DEFAULT_ADMIN.email} đã tồn tại (id=${adminId}).`);
    } else {
      const [result] = await conn.query(
        `INSERT INTO tai_khoan_admin_google (google_id, email, ho_ten, avatar_url, quyen_han, trang_thai)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [DEFAULT_ADMIN.google_id, DEFAULT_ADMIN.email, DEFAULT_ADMIN.ho_ten,
         DEFAULT_ADMIN.avatar_url, DEFAULT_ADMIN.quyen_han, DEFAULT_ADMIN.trang_thai]
      );
      adminId = result.insertId;
      console.log(`  ✅ Tạo Admin ${DEFAULT_ADMIN.email} thành công (id=${adminId}).`);
    }

    // ── 5. Lấy nhom_id cho nhóm giảng viên ────────────────────────────────
    const [nhomRows] = await conn.query(
      "SELECT id FROM nhom_nhan_su WHERE slug_nhom = 'giang-vien-tro-giang' OR ten_nhom LIKE '%GIẢNG VIÊN%' LIMIT 1"
    );
    const nhomId = nhomRows.length > 0 ? nhomRows[0].id : 2;
    console.log(`\n📋 Nhóm giảng viên: id=${nhomId}`);

    // ── 6. Seed 24 giảng viên ──────────────────────────────────────────────
    console.log('\n👥 Bước 3: Seed 24 tài khoản giảng viên...');
    let created = 0, skipped = 0;

    for (const lecturer of LECTURERS) {
      // Kiểm tra nhan_vien theo email
      const [existNV] = await conn.query(
        'SELECT id FROM nhan_vien WHERE email = ? LIMIT 1',
        [lecturer.email]
      );

      let nhanVienId;
      if (existNV.length > 0) {
        nhanVienId = existNV[0].id;
      } else {
        // Tạo mới nhan_vien
        const slug = lecturer.email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
        const [nvResult] = await conn.query(
          `INSERT INTO nhan_vien
             (nhom_id, ho_ten, hoc_vi, chuc_vu, email, slug_ca_nhan, anh_ca_nhan_url, thu_tu_trong_nhom, an_hien)
           VALUES (?, ?, 'Thạc sĩ', 'Giảng viên', ?, ?, 'assets/images/default-avatar.webp', 99, 1)`,
          [nhomId, lecturer.ho_ten, lecturer.email, slug]
        );
        nhanVienId = nvResult.insertId;
      }

      // Kiểm tra tai_khoan_nhan_vien
      const [existTK] = await conn.query(
        'SELECT id FROM tai_khoan_nhan_vien WHERE email = ? OR nhan_vien_id = ? LIMIT 1',
        [lecturer.email, nhanVienId]
      );

      if (existTK.length > 0) {
        skipped++;
        console.log(`  ⏩ ${lecturer.ho_ten} (${lecturer.email}) — tài khoản đã tồn tại.`);
        continue;
      }

      // Mật khẩu mặc định = email
      const passwordHash = await bcrypt.hash(lecturer.email, BCRYPT_ROUNDS);
      await conn.query(
        `INSERT INTO tai_khoan_nhan_vien
           (nhan_vien_id, email, mat_khau_hash, nguoi_tao_admin_id, quyen_han, trang_thai, phai_doi_mat_khau)
         VALUES (?, ?, ?, ?, 'STAFF_EDITOR', 1, 1)`,
        [nhanVienId, lecturer.email, passwordHash, adminId]
      );

      created++;
      console.log(`  ✅ ${lecturer.ho_ten} (${lecturer.email}) — tạo thành công.`);
    }

    console.log(`\n🎉 Hoàn tất! Đã tạo: ${created} | Đã tồn tại: ${skipped} | Tổng: ${LECTURERS.length}`);
    console.log('\n📌 Mật khẩu mặc định cho mỗi giảng viên = địa chỉ email của họ.');
    console.log('   Ví dụ: lamnn@tvu.edu.vn → mật khẩu: lamnn@tvu.edu.vn');
    console.log('   Giảng viên sẽ bị bắt đổi mật khẩu ngay sau lần đăng nhập đầu tiên.\n');

  } finally {
    await conn.end();
  }
}

run().catch(err => {
  console.error('❌ Lỗi seed auth:', err);
  process.exit(1);
});
