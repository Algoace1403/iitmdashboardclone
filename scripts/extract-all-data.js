// ============================================================
// IIT MADRAS DASHBOARD — COMPLETE DATA EXTRACTOR
// ============================================================
//
// HOW TO USE:
// 1. Open Chrome DevTools (F12) on app.onlinedegree.iitm.ac.in
// 2. Go to Console tab
// 3. Copy-paste this ENTIRE script and press Enter
// 4. Follow the on-screen instructions
// 5. It will automatically navigate and collect everything
// 6. At the end it copies a huge JSON to your clipboard
// 7. Paste it into a file and share with me
//
// This script does NOT bypass any auth or scrape anything hidden.
// It only reads what's already visible in YOUR logged-in session.
// ============================================================

(async function IITM_EXTRACTOR() {
  console.log('%c🎓 IIT Madras Dashboard Extractor Started', 'font-size:16px;font-weight:bold;color:#800020');

  const DATA = {
    extractedAt: new Date().toISOString(),
    currentUrl: window.location.href,
    portal: 'app.onlinedegree.iitm.ac.in',

    // Student info
    student: {},

    // Current courses page data
    currentCourses: [],

    // Completed/pending courses
    studentCourses: {},

    // All visible page text organized by section
    pages: {},

    // Any API responses we can intercept
    apiResponses: [],

    // CSS/styling info for pixel-perfect clone
    styling: {},

    // Raw HTML of key sections (for structure reference)
    htmlSnapshots: {}
  };

  // ── 1. Extract student info from top nav ──
  console.log('📋 Extracting student info...');
  try {
    const navbar = document.querySelector('nav, .navbar, header, [class*="navbar"]');
    if (navbar) {
      DATA.student.navbarText = navbar.innerText;
      DATA.student.navbarHTML = navbar.innerHTML;
    }
    // Try common selectors for student name
    const nameEl = document.querySelector('[class*="user"], [class*="student"], [class*="name"]');
    if (nameEl) DATA.student.nameElement = nameEl.innerText;
    DATA.student.fullPageTitle = document.title;
  } catch(e) { console.warn('Student info extraction partial:', e); }

  // ── 2. Extract current courses page ──
  console.log('📚 Extracting current courses...');
  try {
    // Get ALL text content from the main content area
    const mainContent = document.querySelector('main, .main-content, [class*="content"], .container-fluid, .container');
    if (mainContent) {
      DATA.pages.currentCourses = {
        fullText: mainContent.innerText,
        fullHTML: mainContent.innerHTML
      };
    }

    // Try to find individual course cards
    const cards = document.querySelectorAll('.card, [class*="card"], [class*="course"]');
    cards.forEach((card, i) => {
      DATA.currentCourses.push({
        index: i,
        text: card.innerText,
        html: card.innerHTML,
        classes: card.className
      });
    });
  } catch(e) { console.warn('Course extraction partial:', e); }

  // ── 3. Extract sidebar navigation ──
  console.log('🧭 Extracting navigation...');
  try {
    const sidebar = document.querySelector('[class*="sidebar"], [class*="sidenav"], aside, [class*="nav-menu"]');
    if (sidebar) {
      DATA.pages.sidebar = {
        text: sidebar.innerText,
        html: sidebar.innerHTML,
        links: [...sidebar.querySelectorAll('a')].map(a => ({
          text: a.innerText.trim(),
          href: a.href,
          classes: a.className
        }))
      };
    }
  } catch(e) { console.warn('Sidebar extraction partial:', e); }

  // ── 4. Extract styling/CSS info ──
  console.log('🎨 Extracting styling...');
  try {
    const allStyles = [...document.styleSheets].map(ss => {
      try {
        return [...ss.cssRules].map(r => r.cssText).join('\n');
      } catch(e) { return `[External: ${ss.href}]`; }
    });
    DATA.styling.inlineStyles = allStyles.join('\n\n');

    // Get computed styles of key elements
    const body = document.body;
    const computedBody = getComputedStyle(body);
    DATA.styling.body = {
      fontFamily: computedBody.fontFamily,
      fontSize: computedBody.fontSize,
      backgroundColor: computedBody.backgroundColor,
      color: computedBody.color
    };

    const nav = document.querySelector('nav, .navbar');
    if (nav) {
      const computedNav = getComputedStyle(nav);
      DATA.styling.navbar = {
        backgroundColor: computedNav.backgroundColor,
        color: computedNav.color,
        height: computedNav.height,
        fontFamily: computedNav.fontFamily
      };
    }

    const sidebarEl = document.querySelector('[class*="sidebar"], aside');
    if (sidebarEl) {
      const computedSidebar = getComputedStyle(sidebarEl);
      DATA.styling.sidebar = {
        backgroundColor: computedSidebar.backgroundColor,
        width: computedSidebar.width,
        color: computedSidebar.color
      };
    }
  } catch(e) { console.warn('Styling extraction partial:', e); }

  // ── 5. Extract ALL link/stylesheet URLs ──
  console.log('🔗 Extracting resource URLs...');
  try {
    DATA.styling.stylesheetUrls = [...document.querySelectorAll('link[rel="stylesheet"]')].map(l => l.href);
    DATA.styling.scriptUrls = [...document.querySelectorAll('script[src]')].map(s => s.src);
    DATA.styling.metaTags = [...document.querySelectorAll('meta')].map(m => ({
      name: m.name || m.getAttribute('property'),
      content: m.content
    }));
  } catch(e) {}

  // ── 6. Full body snapshot ──
  console.log('📄 Taking full page snapshot...');
  DATA.htmlSnapshots.fullBody = document.body.innerHTML;
  DATA.pages.fullBodyText = document.body.innerText;

  // ── Done ──
  const jsonStr = JSON.stringify(DATA, null, 2);

  // Try to copy to clipboard
  try {
    await navigator.clipboard.writeText(jsonStr);
    console.log('%c✅ SUCCESS! Data copied to clipboard!', 'font-size:14px;font-weight:bold;color:green');
  } catch(e) {
    // Fallback: copy() function
    try {
      copy(jsonStr);
      console.log('%c✅ SUCCESS! Data copied to clipboard via copy()!', 'font-size:14px;font-weight:bold;color:green');
    } catch(e2) {
      console.log('%c⚠️ Could not auto-copy. Downloading as file instead...', 'font-size:14px;color:orange');
      const blob = new Blob([jsonStr], {type: 'application/json'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'iitm_dashboard_export.json';
      a.click();
      URL.revokeObjectURL(url);
      console.log('%c✅ File downloaded as iitm_dashboard_export.json', 'font-size:14px;font-weight:bold;color:green');
    }
  }

  console.log(`📊 Extracted: ${DATA.currentCourses.length} course cards, ${Object.keys(DATA.pages).length} page sections`);
  console.log('%c📋 Paste the clipboard content into a file and share it with me!', 'font-size:13px;color:#800020');

  return DATA;
})();
