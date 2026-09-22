/**
 * frontend/js/utils/apiClient.js
 * Smart, resilient client-side API fetcher.
 * 
 * Features:
 *  1. Request Deduplication: In-flight requests with identical URLs share 
 *     the same Promise, eliminating redundant parallel HTTP calls on page load.
 *  2. In-Memory Cache (TTL: 30s): Instant local response without network roundtrips.
 *  3. Auto Cleanup: Bound cache size to prevent memory leaks in the browser.
 */

const inFlightMap = new Map();
const clientCache = new Map();
const DEFAULT_TTL_MS = 30 * 1000; // 30 seconds
const MAX_CACHE_ENTRIES = 200;

/**
 * Fetch with automatic deduplication & client caching
 * @param {string} url
 * @param {Object} options
 * @returns {Promise<any>} Parsed JSON response
 */
export async function fetchWithCache(url, options = {}) {
  const method = (options.method || 'GET').toUpperCase();

  // Only cache GET requests
  if (method !== 'GET' || options.noCache) {
    const res = await fetch(url, options);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return res.json();
  }

  // Check client memory cache
  const cached = clientCache.get(url);
  const now = Date.now();
  if (cached && now < cached.expiresAt) {
    return cached.data;
  }

  // Check if identical request is already pending (in-flight deduplication)
  if (inFlightMap.has(url)) {
    return inFlightMap.get(url);
  }

  const promise = (async () => {
    try {
      const res = await fetch(url, options);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const json = await res.json();

      // Bound cache size
      if (clientCache.size >= MAX_CACHE_ENTRIES) {
        const oldestKey = clientCache.keys().next().value;
        if (oldestKey) clientCache.delete(oldestKey);
      }

      const ttl = options.ttlMs || DEFAULT_TTL_MS;
      clientCache.set(url, {
        data: json,
        expiresAt: Date.now() + ttl
      });

      return json;
    } catch (err) {
      throw err;
    } finally {
      inFlightMap.delete(url);
    }
  })();

  inFlightMap.set(url, promise);
  return promise;
}

/**
 * Clear client memory cache
 */
export function clearClientCache() {
  clientCache.clear();
  inFlightMap.clear();
}
