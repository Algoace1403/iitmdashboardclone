// ============================================================
// SEEK PORTAL — COURSE CONTENT & QUESTIONS EXTRACTOR
// ============================================================
//
// HOW TO USE:
// 1. Open seek.onlinedegree.iitm.ac.in in Chrome
// 2. Navigate to a course (e.g. Programming in Python)
// 3. Open DevTools (F12) → Console
// 4. Paste this script and press Enter
// 5. It will extract ALL visible course structure, weeks, and content
// 6. Copies to clipboard — paste and share with me
//
// RUN THIS ONCE PER COURSE (navigate to each course and run again)
// ============================================================

(async function SEEK_EXTRACTOR() {
  console.log('%c🎓 SEEK Portal Extractor Started', 'font-size:16px;font-weight:bold;color:#3f51b5');

  const DATA = {
    extractedAt: new Date().toISOString(),
    currentUrl: window.location.href,
    portal: 'seek.onlinedegree.iitm.ac.in',

    // Course info
    course: {},

    // Sidebar navigation (weeks list)
    sidebarNav: [],

    // Main content
    mainContent: {},

    // Styling
    styling: {},

    // Full snapshots
    snapshots: {}
  };

  // ── 1. Course info ──
  console.log('📖 Extracting course info...');
  try {
    DATA.course.title = document.querySelector('h1, [class*="title"], [class*="course-name"]')?.innerText || '';
    DATA.course.url = window.location.href;

    // Top toolbar
    const toolbar = document.querySelector('[class*="toolbar"], [class*="header"], mat-toolbar');
    if (toolbar) {
      DATA.course.toolbar = toolbar.innerText;
    }
  } catch(e) {}

  // ── 2. Sidebar / Week navigation ──
  console.log('📋 Extracting sidebar navigation...');
  try {
    const sidebar = document.querySelector('[class*="sidebar"], [class*="sidenav"], mat-sidenav, nav');
    if (sidebar) {
      DATA.sidebarNav = {
        fullText: sidebar.innerText,
        html: sidebar.innerHTML,
        links: [...sidebar.querySelectorAll('a, [class*="item"], [class*="link"]')].map(el => ({
          text: el.innerText.trim(),
          href: el.href || el.getAttribute('routerlink') || '',
          classes: el.className,
          isActive: el.classList.contains('active') || el.getAttribute('aria-selected') === 'true'
        }))
      };
    }
  } catch(e) {}

  // ── 3. Main content area ──
  console.log('📄 Extracting main content...');
  try {
    const main = document.querySelector('[class*="content"], main, [role="main"], mat-sidenav-content, .mat-sidenav-content');
    if (main) {
      DATA.mainContent = {
        fullText: main.innerText,
        html: main.innerHTML
      };
    }
  } catch(e) {}

  // ── 4. Try to find all expandable/accordion sections ──
  console.log('🔽 Checking for expandable sections...');
  try {
    const expandables = document.querySelectorAll('[class*="expand"], [class*="accordion"], mat-expansion-panel, details, [class*="collapse"]');
    DATA.expandableSections = [...expandables].map(el => ({
      text: el.innerText,
      isExpanded: el.classList.contains('expanded') || el.open || el.getAttribute('aria-expanded') === 'true',
      classes: el.className
    }));
  } catch(e) {}

  // ── 5. Extract any visible questions/quiz content ──
  console.log('❓ Checking for quiz/question content...');
  try {
    const questions = document.querySelectorAll('[class*="question"], [class*="quiz"], [class*="problem"], [class*="ques"]');
    DATA.questions = [...questions].map((q, i) => ({
      index: i,
      text: q.innerText,
      html: q.innerHTML,
      classes: q.className
    }));
  } catch(e) {}

  // ── 6. Styling ──
  console.log('🎨 Extracting styling...');
  try {
    DATA.styling.stylesheetUrls = [...document.querySelectorAll('link[rel="stylesheet"]')].map(l => l.href);

    const body = document.body;
    const cs = getComputedStyle(body);
    DATA.styling.body = {
      fontFamily: cs.fontFamily,
      fontSize: cs.fontSize,
      backgroundColor: cs.backgroundColor,
      color: cs.color
    };

    // Angular Material theme colors
    const primaryEl = document.querySelector('.mat-primary, [class*="primary"]');
    if (primaryEl) {
      DATA.styling.primaryColor = getComputedStyle(primaryEl).backgroundColor;
    }
  } catch(e) {}

  // ── 7. Full page snapshot ──
  DATA.snapshots.bodyHTML = document.body.innerHTML;
  DATA.snapshots.bodyText = document.body.innerText;

  // ── Done ──
  const jsonStr = JSON.stringify(DATA, null, 2);

  try {
    await navigator.clipboard.writeText(jsonStr);
    console.log('%c✅ SUCCESS! SEEK data copied to clipboard!', 'font-size:14px;font-weight:bold;color:green');
  } catch(e) {
    try {
      copy(jsonStr);
      console.log('%c✅ SUCCESS! Copied via copy()!', 'font-size:14px;font-weight:bold;color:green');
    } catch(e2) {
      const blob = new Blob([jsonStr], {type: 'application/json'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `seek_${DATA.course.title.replace(/\s+/g, '_') || 'course'}_export.json`;
      a.click();
      URL.revokeObjectURL(url);
      console.log('%c✅ File downloaded!', 'font-size:14px;font-weight:bold;color:green');
    }
  }

  console.log('%c📋 Paste the clipboard content and share with me!', 'font-size:13px;color:#3f51b5');
  console.log('%c🔄 Navigate to the next course and run this script again!', 'font-size:13px;color:#666');

  return DATA;
})();
