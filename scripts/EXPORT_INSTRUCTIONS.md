# Data Export Instructions

Run these commands in your browser DevTools console (F12 → Console) while logged into your IIT Madras dashboard.

## METHOD 1: HAR File (RECOMMENDED — captures EVERYTHING)

1. Open Chrome DevTools (F12)
2. Go to **Network** tab
3. Check **"Preserve log"** checkbox
4. Navigate through ALL these pages:
   - `app.onlinedegree.iitm.ac.in/student_dashboard/current_courses`
   - `app.onlinedegree.iitm.ac.in/student_dashboard/student_courses`
   - Click into each course
   - Go to grades page
5. Right-click anywhere in the Network panel → **"Save all as HAR with content"**
6. Save the file as `network.har` and share it with me

## METHOD 2: Console commands (if HAR is too large)

### Command 1: Run on Current Courses page
This captures all visible course data and scores:

```javascript
// Run on: app.onlinedegree.iitm.ac.in/student_dashboard/current_courses
(function() {
  const cards = document.querySelectorAll('.card, [class*="course"], .col-md-3, .col-lg-3');
  const courses = [];
  cards.forEach((card, i) => {
    const lines = card.innerText.split('\n').map(l => l.trim()).filter(Boolean);
    courses.push({ cardIndex: i, lines: lines, html: card.innerHTML });
  });
  const result = {
    url: window.location.href,
    pageTitle: document.title,
    bodyText: document.querySelector('main, .container, [class*="content"]')?.innerText || document.body.innerText,
    courses: courses,
    timestamp: new Date().toISOString()
  };
  copy(JSON.stringify(result, null, 2));
  console.log('✅ Copied! Paste into a file called current_courses_export.json');
})();
```

### Command 2: Run on Student Courses page
```javascript
// Run on: app.onlinedegree.iitm.ac.in/student_dashboard/student_courses
(function() {
  const result = {
    url: window.location.href,
    fullText: document.querySelector('main, .container, [class*="content"]')?.innerText || document.body.innerText,
    tables: [...document.querySelectorAll('table')].map(t => t.outerHTML),
    timestamp: new Date().toISOString()
  };
  copy(JSON.stringify(result, null, 2));
  console.log('✅ Copied! Paste into student_courses_export.json');
})();
```

### Command 3: Capture ALL network API responses
Run this BEFORE navigating to pages, then navigate around:

```javascript
// Run this FIRST, then navigate through all pages
(function() {
  window.__apiCaptures = [];
  const origFetch = window.fetch;
  window.fetch = async function(...args) {
    const response = await origFetch.apply(this, args);
    const clone = response.clone();
    try {
      const data = await clone.json();
      window.__apiCaptures.push({
        url: typeof args[0] === 'string' ? args[0] : args[0]?.url,
        method: args[1]?.method || 'GET',
        data: data,
        timestamp: new Date().toISOString()
      });
    } catch(e) {}
    return response;
  };
  
  const origXHR = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(method, url) {
    this.__url = url;
    this.__method = method;
    this.addEventListener('load', function() {
      try {
        const data = JSON.parse(this.responseText);
        window.__apiCaptures.push({
          url: this.__url,
          method: this.__method,
          data: data,
          timestamp: new Date().toISOString()
        });
      } catch(e) {}
    });
    return origXHR.apply(this, arguments);
  };
  
  console.log('🔍 API capture started. Navigate through all pages, then run:');
  console.log('copy(JSON.stringify(window.__apiCaptures, null, 2))');
})();
```

After navigating through all pages, run:
```javascript
copy(JSON.stringify(window.__apiCaptures, null, 2));
console.log(`✅ Captured ${window.__apiCaptures.length} API responses. Paste into api_captures.json`);
```

### Command 4: For SEEK portal (course content / questions)
Navigate to each course on seek.onlinedegree.iitm.ac.in:

```javascript
// Run on any SEEK course page
(function() {
  const result = {
    url: window.location.href,
    courseTitle: document.querySelector('h1, [class*="title"]')?.innerText,
    sidebar: document.querySelector('[class*="sidebar"], nav, [class*="menu"]')?.innerText,
    mainContent: document.querySelector('[class*="content"], main, [role="main"]')?.innerText,
    allText: document.body.innerText,
    timestamp: new Date().toISOString()
  };
  copy(JSON.stringify(result, null, 2));
  console.log('✅ Copied SEEK page data');
})();
```
