/**
 * src/modules/auth/middleware/requireSelfLecturer.js
 * Middleware đảm bảo giảng viên chỉ thao tác trên dữ liệu của chính mình.
 * QUAN TRỌNG: Lấy lecturer_id từ req.lecturerUser (JWT đã xác thực),
 * KHÔNG tin vào params/:id từ client.
 */

/**
 * Dùng cho route có :id là ID của tai_khoan_nhan_vien
 */
export function requireSelfLecturerById(req, res, next) {
  const requestedId = parseInt(req.params.id, 10);
  const myId = req.lecturerUser?.id;

  if (!myId || requestedId !== myId) {
    return res.status(403).json({
      success: false,
      message: 'Bạn không có quyền thao tác trên tài khoản của giảng viên khác.',
      code: 'FORBIDDEN'
    });
  }

  next();
}

/**
 * Dùng cho route có :nhanVienId là ID của bảng nhan_vien
 */
export function requireSelfByNhanVienId(req, res, next) {
  const requestedNhanVienId = parseInt(req.params.nhanVienId, 10);
  const myNhanVienId = req.lecturerUser?.nhanVienId;

  if (!myNhanVienId || requestedNhanVienId !== myNhanVienId) {
    return res.status(403).json({
      success: false,
      message: 'Bạn không có quyền thao tác trên hồ sơ của giảng viên khác.',
      code: 'FORBIDDEN'
    });
  }

  next();
}
