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

  if (process.env.NODE_ENV === 'development') {
    // In development, expose full stack trace
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
