/**
 * src/common/errors/AppError.js
 * Custom operational error class.
 * Operational errors are expected (e.g. 404, 400) vs programmer bugs (500).
 */
export class AppError extends Error {
  /**
   * @param {string} message  - Human-readable error message
   * @param {number} statusCode - HTTP status code (default 500)
   */
  constructor(message, statusCode = 500) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.isOperational = true; // distinguishes from unexpected system errors
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(`${resource} không tồn tại.`, 404);
    this.name = 'NotFoundError';
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Yêu cầu không hợp lệ.') {
    super(message, 400);
    this.name = 'BadRequestError';
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Bạn chưa đăng nhập hoặc không có quyền truy cập.') {
    super(message, 401);
    this.name = 'UnauthorizedError';
  }
}
