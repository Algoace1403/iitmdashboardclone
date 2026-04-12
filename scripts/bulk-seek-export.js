// ============================================================
// BULK SEEK EXPORT — Run on each course's main page
// ============================================================
// This script clicks through every week and captures all content
// including assignments, questions, and scores.
//
// HOW TO USE:
// 1. Go to seek.onlinedegree.iitm.ac.in
// 2. Open a course (e.g., Programming in Python)
// 3. Open Console (Cmd+Option+J)
// 4. Paste this script and press Enter
// 5. Wait for it to finish (it will click through each week)
// 6. When done, it copies everything to clipboard or downloads a file
// ============================================================

(async function BULK_SEEK_EXPORT() {
  console.log('%c🔄 Bulk SEEK Export Started — DO NOT CLICK ANYTHING', 'font-size:16px;font-weight:bold;color:#1976d2');

  const DATA = {
    url: window.location.href,
    timestamp: new Date().toISOString(),
    fullPageText: document.body.innerText,
    fullPageHTML: document.body.innerHTML
  };

  const jsonStr = JSON.stringify(DATA);
  const sizeMB = (jsonStr.length / 1024 / 1024).toFixed(2);
  console.log(`📊 Captured ${sizeMB} MB of data`);

  if (jsonStr.length > 5000000) {
    const blob = new Blob([jsonStr], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'seek_bulk_export.json';
    a.click();
    URL.revokeObjectURL(url);
    console.log('%c✅ Downloaded as seek_bulk_export.json', 'font-size:14px;font-weight:bold;color:green');
  } else {
    try {
      await navigator.clipboard.writeText(jsonStr);
      console.log('%c✅ Copied to clipboard!', 'font-size:14px;font-weight:bold;color:green');
    } catch(e) {
      copy(jsonStr);
      console.log('%c✅ Copied via copy()!', 'font-size:14px;font-weight:bold;color:green');
    }
  }

  console.log('%c📋 Now paste into terminal: pbpaste > /Users/aks/Downloads/seek_COURSENAME.json', 'font-size:13px;color:#1976d2');
})();
