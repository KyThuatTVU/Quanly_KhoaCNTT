/**
 * src/common/utils/slugify.js
 * Converts a Vietnamese string into a URL-safe slug.
 * Usage: slugify('Nguyễn Nhứt Lam') → 'nguyen-nhut-lam'
 */
export function slugify(text) {
  if (!text) return '';
  return text
    .toString()
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')   // strip accent marks
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9 -]/g, '')       // remove special chars
    .replace(/\s+/g, '-')              // spaces → hyphens
    .replace(/-+/g, '-')               // collapse multiple hyphens
    .replace(/^-+|-+$/g, '');          // trim leading/trailing hyphens
}

/**
 * Creates a unique slug by appending a random suffix.
 * Usage: uniqueSlug('Tin tức mới') → 'tin-tuc-moi-742'
 */
export function uniqueSlug(text) {
  return `${slugify(text)}-${Math.floor(Math.random() * 10000)}`;
}

/**
 * Creates a timestamp-based unique slug (for news, etc.)
 * Usage: timestampSlug('Tin tức mới') → 'tin-tuc-moi-1722345678901'
 */
export function timestampSlug(text) {
  return `${slugify(text)}-${Date.now()}`;
}
