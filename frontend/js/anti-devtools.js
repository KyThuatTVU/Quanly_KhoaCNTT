/**
 * frontend/js/anti-devtools.js
 * Source Code Protection System.
 * Prevents inspect element, disables keyboard shortcuts, and hides source content
 * by wiping the DOM if DevTools (F12) is detected as open.
 */

(function () {
  // 1. Disable right click (Context Menu)
  document.addEventListener('contextmenu', (e) => e.preventDefault());

  // 2. Disable DevTools and View Source Hotkeys
  document.addEventListener('keydown', (e) => {
    // F12
    if (e.key === 'F12') {
      e.preventDefault();
      return false;
    }
    // Ctrl + Shift + I, Ctrl + Shift + J, Ctrl + Shift + C
    if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) {
      e.preventDefault();
      return false;
    }
    // Ctrl + U (View Source)
    if (e.ctrlKey && e.key.toLowerCase() === 'u') {
      e.preventDefault();
      return false;
    }
    // Ctrl + S (Save Page)
    if (e.ctrlKey && e.key.toLowerCase() === 's') {
      e.preventDefault();
      return false;
    }
  });

  // 3. DevTools Open Detection via Timing
  function detectDevTools() {
    const startTime = performance.now();
    debugger; // Triggers only when DevTools is open
    const endTime = performance.now();
    
    // If execution was halted, time difference will be large
    if (endTime - startTime > 100) {
      document.body.innerHTML = `
        <div style="display:flex; justify-content:center; align-items:center; height:100vh; font-family:sans-serif; background:#f8fafc; color:#0f172a; text-align:center; padding:20px; box-sizing:border-box;">
          <div style="max-width:500px; padding:40px; background:#ffffff; border-radius:16px; box-shadow:0 10px 25px rgba(0,0,0,0.05); border:1px solid #e2e8f0;">
            <div style="font-size:4rem; margin-bottom:20px;">🛡️</div>
            <h1 style="font-size:1.6rem; margin:0 0 12px; color:#e11d48; font-weight:800; text-transform:uppercase;">Hệ thống bảo vệ nguồn</h1>
            <p style="font-size:1rem; color:#64748b; margin:0 0 24px; line-height:1.6;">Vui lòng tắt Công cụ phát triển (DevTools / F12) để có thể xem nội dung trang web.</p>
            <button onclick="window.location.reload()" style="background:#0f6fff; color:#ffffff; border:none; padding:12px 28px; border-radius:8px; font-weight:700; cursor:pointer; font-size:0.9rem; box-shadow:0 4px 12px rgba(15,111,255,0.25);">Tải lại trang</button>
          </div>
        </div>
      `;
      console.clear();
      throw new Error("DevTools detected!");
    }
  }

  // 4. Run detection periodically
  setInterval(detectDevTools, 500);
})();
