/**
 * frontend/js/utils/apiClient.js
 * Smart, resilient client-side API fetcher with Idle Abort & Hard Timeouts.
 * 
 * Features:
 *  1. Hard Timeout (10s): Prevents hanging requests from consuming browser memory.
 *  2. Request Deduplication: In-flight requests with identical URLs share 
 *     the same Promise, eliminating redundant parallel HTTP calls.
 *  3. In-Memory Cache (TTL: 30s): Instant local response without network roundtrips.
 *  4. Idle Protection: Checks IdleWatcher state to abort requests when user is inactive.
 */

import { IdleWatcher } from './idleWatcher.js';

const inFlightMap = new Map();
const clientCache = new Map();
const DEFAULT_TTL_MS = 30 * 1000; // 30 seconds
const FETCH_TIMEOUT_MS = 10 * 1000; // 10 seconds hard timeout per request
const MAX_CACHE_ENTRIES = 200;

/**
 * Combine multiple AbortSignals into one
 */
function createTimeoutSignal(customSignal) {
  const timeoutSignal = AbortSignal.timeout(FETCH_TIMEOUT_MS);
  const idleSignal = IdleWatcher.getSignal();

  // If browser supports AbortSignal.any (Modern browsers)
  if (typeof AbortSignal.any === 'function') {
    const signals = [timeoutSignal, idleSignal];
    if (customSignal) signals.push(customSignal);
    return AbortSignal.any(signals);
  }

  return timeoutSignal;
}

/**
 * Fetch with automatic deduplication, 10s timeout & client caching
 * @param {string} url
 * @param {Object} options
 * @returns {Promise<any>} Parsed JSON response
 */
export async function fetchWithCache(url, options = {}) {
  // Prevent executing fetch if client tab is currently idle
  if (IdleWatcher.isClientIdle()) {
    throw new Error('Client tab is currently idle. Request cancelled.');
  }

  const method = (options.method || 'GET').toUpperCase();
  const requestSignal = createTimeoutSignal(options.signal);
  const fetchOptions = { ...options, signal: requestSignal };

  // Only cache GET requests
  if (method !== 'GET' || options.noCache) {
    const res = await fetch(url, fetchOptions);
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
      const res = await fetch(url, fetchOptions);
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
