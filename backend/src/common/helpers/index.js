/**
 * src/common/helpers/index.js
 * Shared helper functions available across all modules.
 */

/**
 * Safely parses an integer from a value, returning a fallback if parsing fails.
 */
export function safeInt(value, fallback = 0) {
  const n = parseInt(String(value).replace(/\D/g, ''), 10);
  return isNaN(n) ? fallback : n;
}

/**
 * Returns today's date as a YYYY-MM-DD string (MySQL DATE format).
 */
export function todayDateString() {
  return new Date().toISOString().split('T')[0];
}

/**
 * Returns the current 4-digit year as a number.
 */
export function currentYear() {
  return new Date().getFullYear();
}

/**
 * Strips falsy/empty-string values from an object before inserting into DB.
 */
export function cleanPayload(obj) {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined && v !== '')
  );
}
