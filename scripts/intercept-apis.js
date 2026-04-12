// ============================================================
// API INTERCEPTOR — Captures ALL network responses
// ============================================================
//
// HOW TO USE:
// 1. Open DevTools (F12) on app.onlinedegree.iitm.ac.in
// 2. Paste this script FIRST (before navigating)
// 3. Then navigate through ALL pages:
//    - Current Courses
//    - Student Courses
//    - Each course detail
//    - Grades / Certificates / etc.
//    - SEEK portal courses
// 4. When done navigating, run the EXPORT command shown in console
//
// This captures the ACTUAL JSON data the server sends to your browser.
// This is the BEST source of truth for all your scores, grades, etc.
// ============================================================

(function() {
  window.__IITM_API_LOG = [];
  let captureCount = 0;

  // ── Intercept fetch() ──
  const origFetch = window.fetch;
  window.fetch = async function(...args) {
    const url = typeof args[0] === 'string' ? args[0] : args[0]?.url || '';
    const method = args[1]?.method || 'GET';
    const startTime = Date.now();

    const response = await origFetch.apply(this, args);
    const clone = response.clone();

    try {
      const contentType = clone.headers.get('content-type') || '';
      let data;

      if (contentType.includes('json')) {
        data = await clone.json();
      } else if (contentType.includes('text')) {
        data = await clone.text();
      }

      if (data) {
        captureCount++;
        window.__IITM_API_LOG.push({
          id: captureCount,
          type: 'fetch',
          url: url,
          method: method,
          status: response.status,
          contentType: contentType,
          data: data,
          duration: Date.now() - startTime,
          timestamp: new Date().toISOString()
        });
        console.log(`📡 [${captureCount}] ${method} ${url.substring(0, 80)}... (${response.status})`);
      }
    } catch(e) { /* non-json response, skip */ }

    return response;
  };

  // ── Intercept XMLHttpRequest ──
  const origOpen = XMLHttpRequest.prototype.open;
  const origSend = XMLHttpRequest.prototype.send;

  XMLHttpRequest.prototype.open = function(method, url) {
    this.__iitm_url = url;
    this.__iitm_method = method;
    this.__iitm_startTime = Date.now();
    return origOpen.apply(this, arguments);
  };

  XMLHttpRequest.prototype.send = function() {
    this.addEventListener('load', function() {
      try {
        const contentType = this.getResponseHeader('content-type') || '';
        let data;

        if (contentType.includes('json')) {
          data = JSON.parse(this.responseText);
        } else if (this.responseText && this.responseText.length < 500000) {
          data = this.responseText;
        }

        if (data) {
          captureCount++;
          window.__IITM_API_LOG.push({
            id: captureCount,
            type: 'xhr',
            url: this.__iitm_url,
            method: this.__iitm_method,
            status: this.status,
            contentType: contentType,
            data: data,
            duration: Date.now() - this.__iitm_startTime,
            timestamp: new Date().toISOString()
          });
          console.log(`📡 [${captureCount}] XHR ${this.__iitm_method} ${String(this.__iitm_url).substring(0, 80)}... (${this.status})`);
        }
      } catch(e) {}
    });
    return origSend.apply(this, arguments);
  };

  console.log('%c🔍 API Interceptor Active!', 'font-size:16px;font-weight:bold;color:#800020');
  console.log('%c📌 Now navigate through ALL pages. Each API call will be logged here.', 'font-size:12px;color:#666');
  console.log('%c📌 When done, run: EXPORT_API_DATA()', 'font-size:13px;font-weight:bold;color:#800020');
  console.log('');

  // ── Export function ──
  window.EXPORT_API_DATA = async function() {
    const jsonStr = JSON.stringify(window.__IITM_API_LOG, null, 2);
    const sizeMB = (jsonStr.length / 1024 / 1024).toFixed(2);

    console.log(`📊 Total captured: ${window.__IITM_API_LOG.length} API calls (${sizeMB} MB)`);

    // If too large for clipboard, download as file
    if (jsonStr.length > 5000000) {
      console.log('📦 Data too large for clipboard, downloading as file...');
      const blob = new Blob([jsonStr], {type: 'application/json'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'iitm_api_captures.json';
      a.click();
      URL.revokeObjectURL(url);
      console.log('%c✅ Downloaded as iitm_api_captures.json!', 'font-size:14px;font-weight:bold;color:green');
    } else {
      try {
        await navigator.clipboard.writeText(jsonStr);
        console.log('%c✅ Copied to clipboard!', 'font-size:14px;font-weight:bold;color:green');
      } catch(e) {
        try {
          copy(jsonStr);
          console.log('%c✅ Copied via copy()!', 'font-size:14px;font-weight:bold;color:green');
        } catch(e2) {
          const blob = new Blob([jsonStr], {type: 'application/json'});
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'iitm_api_captures.json';
          a.click();
          URL.revokeObjectURL(url);
          console.log('%c✅ Downloaded as file!', 'font-size:14px;font-weight:bold;color:green');
        }
      }
    }

    console.log('%c📋 Share the exported data with me!', 'font-size:13px;color:#800020');
  };
})();
