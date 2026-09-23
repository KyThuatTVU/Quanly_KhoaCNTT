/**
 * ==========================================================================
 * CLIENT-SIDE IDLE WATCHER & MOBILE BACKGROUND LIFECYCLE MODULE
 * ==========================================================================
 * Monitors user inactivity (mouse movement, clicks, keypresses, touch, scroll)
 * AND mobile browser lifecycle (switching apps, home screen, tab backgrounding).
 * 
 * Behavior on Mobile & Desktop:
 *  1. Tab Hidden / Switched App: Immediately aborts pending HTTP requests.
 *  2. Tab Returned (> 3 mins): Triggers session recovery modal.
 *  3. Inactivity (> 3 mins): Triggers session pause modal.
 */

const IDLE_TIMEOUT_MS = 3 * 60 * 1000; // 3 minutes (180,000ms)
let idleTimer = null;
let isIdle = false;
let hiddenTimestamp = null;
let lastActivityTime = Date.now();
let globalAbortController = new AbortController();

const eventNames = ['mousemove', 'keydown', 'mousedown', 'touchstart', 'scroll'];

/**
 * Reset idle timer whenever user interacts with the page
 */
function resetIdleTimer(e) {
  if (isIdle) return; // Don't auto-close modal once triggered

  const now = Date.now();
  // Throttle mousemove jitter so subtle sensor/pointer movement within 2s doesn't spam reset
  if (e && e.type === 'mousemove' && now - lastActivityTime < 2000) {
    return;
  }

  lastActivityTime = now;
  clearTimeout(idleTimer);
  idleTimer = setTimeout(onIdleTimeout, IDLE_TIMEOUT_MS);
}

/**
 * Triggered when user has been inactive or backgrounded for IDLE_TIMEOUT_MS
 */
function onIdleTimeout() {
  if (isIdle) return;
  isIdle = true;
  console.log('⏳ [IdleWatcher] Phát hiện người dùng rảnh rỗi quá 3 phút -> Kích hoạt màn hình tạm dừng.');

  // 1. Abort all in-flight fetch requests
  try {
    globalAbortController.abort('Client idle timeout triggered');
  } catch (err) {
    console.warn('AbortController error:', err);
  }

  // 2. Remove activity listeners
  eventNames.forEach(evt => {
    window.removeEventListener(evt, resetIdleTimer);
  });

  // 3. Render modern glassmorphism pause overlay
  showIdleModal();
}

/**
 * Handle Mobile & Desktop Tab Visibility Changes (Switching apps / Home screen)
 */
function handleVisibilityChange() {
  if (document.visibilityState === 'hidden') {
    // User switched to another app or home screen
    hiddenTimestamp = Date.now();
    console.log('📱 [IdleWatcher] Người dùng đã chuyển ứng dụng / ẩn tab di động.');

    // Immediately abort any pending network calls to free up mobile sockets/memory
    try {
      globalAbortController.abort('Tab backgrounded');
    } catch (e) {
      // Ignore
    }
  } else if (document.visibilityState === 'visible') {
    // User returned to browser tab
    console.log('📱 [IdleWatcher] Người dùng vừa mở lại tab trình duyệt.');
    if (hiddenTimestamp) {
      const elapsedBackgroundTime = Date.now() - hiddenTimestamp;

      // If user was away in another app for more than 3 minutes -> Trigger Idle Modal
      if (elapsedBackgroundTime >= IDLE_TIMEOUT_MS) {
        onIdleTimeout();
        return;
      }
    }

    // If user returned within 3 minutes and wasn't idle -> Re-create fresh AbortController
    if (!isIdle) {
      globalAbortController = new AbortController();
      resetIdleTimer();
    }
  }
}

/**
 * Render user-friendly glassmorphism idle modal
 */
function showIdleModal() {
  if (document.getElementById('sit-idle-overlay')) return;

  const overlay = document.createElement('div');
  overlay.id = 'sit-idle-overlay';
  overlay.style.cssText = `
    position: fixed;
    inset: 0;
    z-index: 999999;
    background: rgba(15, 23, 42, 0.75);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    animation: sitFadeIn 0.3s ease;
  `;

  overlay.innerHTML = `
    <style>
      @keyframes sitFadeIn {
        from { opacity: 0; transform: scale(0.96); }
        to { opacity: 1; transform: scale(1); }
      }
      .sit-idle-card {
        background: rgba(255, 255, 255, 0.95);
        border: 1px solid rgba(255, 255, 255, 0.9);
        border-radius: 24px;
        padding: 40px 32px;
        max-width: 440px;
        width: 100%;
        text-align: center;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        font-family: 'Quicksand', 'Be Vietnam Pro', system-ui, sans-serif;
      }
      .sit-idle-icon {
        width: 64px;
        height: 64px;
        background: #eef4ff;
        border: 2px solid #bfdbfe;
        border-radius: 50%;
        color: #0f6fff;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 20px;
        font-size: 28px;
        box-shadow: 0 8px 16px rgba(15, 111, 255, 0.15);
      }
      .sit-idle-title {
        font-size: 20px;
        font-weight: 850;
        color: #0f2d59;
        margin: 0 0 10px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      .sit-idle-desc {
        font-size: 14px;
        line-height: 1.6;
        color: #475569;
        margin: 0 0 28px;
        font-weight: 500;
      }
      .sit-idle-btn {
        width: 100%;
        padding: 14px 24px;
        background: linear-gradient(135deg, #0f6fff 0%, #00b4d8 100%);
        color: #ffffff;
        font-size: 14px;
        font-weight: 800;
        border: none;
        border-radius: 14px;
        cursor: pointer;
        box-shadow: 0 8px 20px rgba(15, 111, 255, 0.3);
        transition: all 0.25s ease;
      }
      .sit-idle-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 24px rgba(15, 111, 255, 0.4);
      }
    </style>
    <div class="sit-idle-card">
      <div class="sit-idle-icon">🔔</div>
      <h3 class="sit-idle-title">Thông Báo</h3>
      <p class="sit-idle-desc">
        Bạn đã tạm dừng thao tác hoặc vừa chuyển sang ứng dụng khác. Vui lòng nhấn bên dưới để tiếp tục xem nội dung mới nhất.
      </p>
      <button type="button" class="sit-idle-btn" onclick="window.location.reload()">
        Tiếp Tục Xem Trang
      </button>
    </div>
  `;

  document.body.appendChild(overlay);
}

export const IdleWatcher = {
  /**
   * Initialize Idle Watcher & Mobile Page Lifecycle Listeners
   */
  init(timeoutMs = IDLE_TIMEOUT_MS) {
    console.log(`⏳ [IdleWatcher] Kích hoạt theo dõi rảnh rỗi (${timeoutMs / 1000}s)...`);

    // 1. Attach user activity listeners
    eventNames.forEach(evt => {
      window.addEventListener(evt, resetIdleTimer, { passive: true });
    });

    // 2. Attach Page Visibility API for Mobile app switching & tab backgrounding
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', handleVisibilityChange);

    // 3. Start timer
    resetIdleTimer();
  },

  /**
   * Get current AbortSignal for fetch requests
   */
  getSignal() {
    return globalAbortController.signal;
  },

  /**
   * Check if client is currently in idle state
   */
  isClientIdle() {
    return isIdle;
  },

  /**
   * Manual trigger for testing in Dev Tools
   */
  triggerIdleForTest() {
    onIdleTimeout();
  }
};
