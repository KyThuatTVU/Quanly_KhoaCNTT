/**
 * ==========================================================================
 * CLIENT-SIDE IDLE WATCHER & RESOURCE CLEANUP MODULE
 * ==========================================================================
 * Monitors user inactivity (mouse movement, clicks, keypresses, touch, scroll).
 * Automatically aborts pending fetch calls, pauses background polling,
 * and displays a clean session recovery modal when idle for 3 minutes (180,000ms).
 */

const IDLE_TIMEOUT_MS = 3 * 60 * 1000; // 3 minutes default
let idleTimer = null;
let isIdle = false;
let globalAbortController = new AbortController();

const eventNames = ['mousemove', 'keydown', 'mousedown', 'touchstart', 'scroll'];

/**
 * Reset idle timer whenever user interacts with the page
 */
function resetIdleTimer() {
  if (isIdle) return; // Don't auto-close modal once triggered, require explicit click

  clearTimeout(idleTimer);
  idleTimer = setTimeout(onIdleTimeout, IDLE_TIMEOUT_MS);
}

/**
 * Triggered when user has been inactive for IDLE_TIMEOUT_MS
 */
function onIdleTimeout() {
  isIdle = true;

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
      <div class="sit-idle-icon">⏳</div>
      <h3 class="sit-idle-title">Phiên Làm Việc Tạm Dừng</h3>
      <p class="sit-idle-desc">
        Bạn đã không hoạt động trong 3 phút. Hệ thống đã tự động ngắt kết nối ngầm để bảo vệ tài nguyên và dữ liệu thiết bị.
      </p>
      <button type="button" class="sit-idle-btn" onclick="window.location.reload()">
        🔄 Khôi Phục Phiên Làm Việc
      </button>
    </div>
  `;

  document.body.appendChild(overlay);
}

export const IdleWatcher = {
  /**
   * Initialize Idle Watcher
   */
  init(timeoutMs = IDLE_TIMEOUT_MS) {
    // Attach user activity listeners
    eventNames.forEach(evt => {
      window.addEventListener(evt, resetIdleTimer, { passive: true });
    });

    // Start timer
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
