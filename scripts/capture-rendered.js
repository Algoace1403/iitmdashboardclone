// Captures rendered HTML (with math) from the currently visible assignment page
// Run on SEEK portal when an assignment is open and fully loaded
(function() {
  const content = document.querySelector('.gcb-assessment-contents, [class*="assessment"], main, [role="main"]');
  if (!content) { console.log('No content found'); return; }

  const title = document.querySelector('.gcb-assessment-title, h1')?.textContent?.trim() || 'unknown';
  const html = content.innerHTML;

  if (!window.__rendered) window.__rendered = {};
  window.__rendered[title] = html;

  console.log('Captured: ' + title + ' (' + html.length + ' chars, ' + Object.keys(window.__rendered).length + ' total)');
  console.log('When done with all assignments, run: SAVE()');

  window.SAVE = function() {
    const j = JSON.stringify(window.__rendered);
    const b = new Blob([j], {type:'application/json'});
    const u = URL.createObjectURL(b);
    const a = document.createElement('a');
    a.href = u;
    a.download = 'rendered_assignments.json';
    a.click();
    console.log('Downloaded ' + Object.keys(window.__rendered).length + ' rendered assignments');
  };
})();
