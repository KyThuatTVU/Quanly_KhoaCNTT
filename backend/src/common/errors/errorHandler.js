/**
 * src/common/errors/errorHandler.js
 * Global Express error-handling middleware.
 * Must be registered LAST in app.js (after all routes).
 *
 * Distinguishes between:
 *  - Operational errors (AppError) → send structured JSON response
 *  - Programmer errors (unexpected) → log and send generic 500
 */
import { AppError } from './AppError.js';

/**
 * 404 handler — call this for any unmatched route.
 */
export function notFoundHandler(req, res, next) {
  next(new AppError(`Route '${req.originalUrl}' không tồn tại.`, 404));
}

/**
 * Global error handler middleware.
 * Express identifies it as error middleware because it has 4 params (err, req, res, next).
 */
export function globalErrorHandler(err, req, res, next) {
  // Determine status code and message
  const statusCode = err.statusCode || 500;
  const isOperational = err.isOperational || false;

  // Lỗi 404: Route không tồn tại (thường do bot trên internet quét /v2/, /.env hoặc gõ sai URL)
  // Chỉ cảnh báo nhẹ, không in cả đống stack trace đỏ rực làm rối log
  if (statusCode === 404) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`⚠️ [404 Not Found] ${req.method} ${req.originalUrl}`);
    }
    return res.status(404).json({
      success: false,
      error: err.message
    });
  }

  if (process.env.NODE_ENV === 'development') {
    // In development, expose full stack trace cho các lỗi 500 thực sự
    console.error('🔴 [ERROR]', err);
    return res.status(statusCode).json({
      success: false,
      error: err.message,
      stack: err.stack,
      isOperational
    });
  }

  // In production, hide internal details for non-operational errors
  if (isOperational) {
    return res.status(statusCode).json({
      success: false,
      error: err.message
    });
  }

  // Unexpected programmer error: log and send generic message
  console.error('🔴 [UNEXPECTED ERROR]', err);
  return res.status(500).json({
    success: false,
    error: 'Lỗi hệ thống nội bộ. Vui lòng thử lại sau.'
  });
}
