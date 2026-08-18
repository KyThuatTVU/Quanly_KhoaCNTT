/**
 * src/modules/auth/services/lecturerAuth.service.js
 * Business logic cho Giảng viên authentication (Email + Password + JWT)
 */
import bcrypt from 'bcrypt';
import jwt    from 'jsonwebtoken';
import { AuthRepository } from '../repositories/auth.repository.js';
import config from '../../../config/index.js';

const BCRYPT_ROUNDS = 12;

export const LecturerAuthService = {

  /**
   * Đăng nhập giảng viên bằng email + mật khẩu
   * Trả về JWT token nếu hợp lệ
   */
  async login(email, matKhau, ip, userAgent) {
    // Tìm tài khoản — không tiết lộ email có tồn tại hay không
    const account = await AuthRepository.findLecturerAccountByEmail(email.toLowerCase().trim());

    // Thông báo lỗi chung để không lộ thông tin
    const ERROR_MSG = 'Email hoặc mật khẩu không chính xác.';

    if (!account) {
      // Vẫn chạy bcrypt để tránh timing attack
      await bcrypt.compare(matKhau, '$2b$12$invalidhashfortimingprotection');
      throw new Error(ERROR_MSG);
    }

    if (account.trang_thai === 0) {
      throw new Error('Tài khoản của bạn đã bị khóa. Vui lòng liên hệ Admin để được hỗ trợ.');
    }

    const isMatch = await bcrypt.compare(matKhau, account.mat_khau_hash);
    if (!isMatch) {
      throw new Error(ERROR_MSG);
    }

    // Cập nhật last_login
    await AuthRepository.updateLecturerLastLogin(account.id);

    // Ghi log
    await AuthRepository.logActivity({
      userId: account.id,
      userType: 'lecturer',
      hanhDong: 'login',
      moTa: `Giảng viên ${email} đăng nhập thành công`,
      doiTuong: 'tai_khoan_nhan_vien',
      doiTuongId: account.id,
      ip,
      userAgent
    });

    // Tạo JWT payload (KHÔNG chứa password)
    const payload = {
      id:          account.id,
      nhanVienId:  account.nhan_vien_id,
      email:       account.email,
      hoTen:       account.ho_ten,
      quyenHan:    account.quyen_han,
      phaDoiMk:    account.phai_doi_mat_khau === 1
    };

    const token = jwt.sign(payload, config.jwt.secret, { expiresIn: config.jwt.expiresIn });

    return {
      token,
      mustChangePassword: account.phai_doi_mat_khau === 1,
      user: {
        id:         account.id,
        nhanVienId: account.nhan_vien_id,
        hoTen:      account.ho_ten,
        email:      account.email,
        hocVi:      account.hoc_vi,
        chucVu:     account.chuc_vu,
        anhUrl:     account.anh_ca_nhan_url,
        quyenHan:   account.quyen_han
      }
    };
  },

  /**
   * Đổi mật khẩu giảng viên
   */
  async changePassword(accountId, matKhauHienTai, matKhauMoi) {
    const account = await AuthRepository.findLecturerAccountById(accountId);
    if (!account) {
      throw new Error('Tài khoản không tồn tại.');
    }

    // Kiểm tra mật khẩu hiện tại
    const isMatch = await bcrypt.compare(matKhauHienTai, account.mat_khau_hash);
    if (!isMatch) {
      throw new Error('Mật khẩu hiện tại không chính xác.');
    }

    // Không cho dùng lại mật khẩu cũ
    const isSame = await bcrypt.compare(matKhauMoi, account.mat_khau_hash);
    if (isSame) {
      throw new Error('Mật khẩu mới không được trùng với mật khẩu hiện tại.');
    }

    if (matKhauMoi.length < 8) {
      throw new Error('Mật khẩu mới phải có ít nhất 8 ký tự.');
    }

    const newHash = await bcrypt.hash(matKhauMoi, BCRYPT_ROUNDS);
    await AuthRepository.updateLecturerPassword(accountId, newHash);

    // Ghi log
    await AuthRepository.logActivity({
      userId: accountId,
      userType: 'lecturer',
      hanhDong: 'doi_mat_khau',
      moTa: 'Giảng viên đổi mật khẩu thành công',
      doiTuong: 'tai_khoan_nhan_vien',
      doiTuongId: accountId,
      ip: null,
      userAgent: null
    });
  },

  /**
   * Hash mật khẩu (dùng khi tạo tài khoản hoặc reset)
   */
  async hashPassword(plainText) {
    return bcrypt.hash(plainText, BCRYPT_ROUNDS);
  },

  /**
   * Verify JWT token
   */
  verifyToken(token) {
    return jwt.verify(token, config.jwt.secret);
  },

  /**
   * Đăng xuất giảng viên — ghi log (token vô hiệu hóa do client xóa cookie)
   */
  async logout(accountId, ip, userAgent) {
    if (accountId) {
      await AuthRepository.logActivity({
        userId: accountId,
        userType: 'lecturer',
        hanhDong: 'logout',
        moTa: 'Giảng viên đăng xuất',
        doiTuong: 'tai_khoan_nhan_vien',
        doiTuongId: accountId,
        ip,
        userAgent
      });
    }
  }
};
