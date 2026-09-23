/**
 * ==========================================================================
 * FRONTEND REAL-TIME EVENTSOURCE CLIENT
 * ==========================================================================
 * Establishes native Server-Sent Events (SSE) stream with the Backend.
 * Whenever the Admin modifies any data, this module automatically:
 *  1. Clears client-side fetch memory cache (`clearClientCache()`)
 *  2. Dispatches a custom DOM event 'sit-data-updated'
 *  3. Prompts active Web Components to re-fetch & re-render live without F5
 */

import { clearClientCache } from './apiClient.js';

let eventSource = null;
let reconnectTimer = null;

const BACKEND_BASE = `${window.location.port === '5500' ? 'http://localhost:5000' : ''}/api/v1/public`;

function connectRealtime() {
  if (eventSource && eventSource.readyState !== EventSource.CLOSED) {
    return;
  }

  try {
    const sseUrl = `${BACKEND_BASE}/events`;
    eventSource = new EventSource(sseUrl, { withCredentials: true });

    eventSource.onopen = () => {
      console.log('📡 [RealTime] Đã kết nối luồng sự kiện thời gian thực (SSE) với máy chủ.');
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
        reconnectTimer = null;
      }
    };

    eventSource.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);

        if (payload.type === 'DATA_UPDATED') {
          console.log(`⚡ [RealTime] Admin vừa cập nhật danh mục: ${payload.entity} (${payload.action})`);
          
          // 1. Clear local memory cache so next fetch gets fresh DB data
          clearClientCache();

          // 2. Dispatch custom event for active Web Components to listen & auto-refresh
          window.dispatchEvent(new CustomEvent('sit-data-updated', { detail: payload }));
        }
      } catch (err) {
        console.warn('⚡ [RealTime] Lỗi đọc dữ liệu sự kiện SSE:', err);
      }
    };

    eventSource.onerror = () => {
      // Close broken connection & attempt auto-reconnect after 5s
      if (eventSource) {
        eventSource.close();
        eventSource = null;
      }
      if (!reconnectTimer) {
        reconnectTimer = setTimeout(connectRealtime, 5000);
      }
    };
  } catch (err) {
    console.warn('⚡ [RealTime] Không thể khởi tạo kết nối SSE:', err);
  }
}

function disconnectRealtime() {
  if (eventSource) {
    eventSource.close();
    eventSource = null;
  }
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }
}

// Mobile & Tab Background Lifecycle: Disconnect SSE when tab is hidden, reconnect when visible
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') {
    disconnectRealtime();
  } else if (document.visibilityState === 'visible') {
    connectRealtime();
  }
});

export const RealtimeClient = {
  init() {
    connectRealtime();
  },
  disconnect() {
    disconnectRealtime();
  }
};
