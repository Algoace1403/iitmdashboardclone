# Browser Console Export Commands

Run these in your browser DevTools (F12 → Console) while logged into your IIT Madras dashboard.
Copy-paste each output into the corresponding JSON file in `src/data/`.

---

## 1. Student Profile

Go to your profile/dashboard page and run:

```javascript
// Copy visible student info
copy(JSON.stringify({
  name: document.querySelector('.student-name, .user-name, [class*="name"]')?.textContent?.trim() || "FILL_MANUALLY",
  rollNumber: document.querySelector('[class*="roll"], [class*="id"]')?.textContent?.trim() || "FILL_MANUALLY",
  email: "FILL_MANUALLY",
  program: document.querySelector('[class*="program"], [class*="degree"]')?.textContent?.trim() || "FILL_MANUALLY",
  currentTerm: 0, // FILL: your current term number
  enrollmentYear: 0, // FILL: year you enrolled
}, null, 2));
```

If selectors don't work, just manually create `src/data/student.json`:
```json
{
  "name": "Your Name",
  "rollNumber": "21f1XXXXXX",
  "email": "your@email.com",
  "program": "BS in Data Science and Applications",
  "currentTerm": 5,
  "enrollmentYear": 2021
}
```

---

## 2. All Courses (from Network tab)

1. Open Network tab in DevTools
2. Navigate to your courses page
3. Filter by "XHR" or "Fetch"
4. Look for requests like `/api/courses`, `/student/courses`, or similar
5. Click the response → Preview tab → Right-click → "Copy object"
6. Paste into `src/data/courses.json`

If no clear API, run on the courses list page:

```javascript
// Scrape visible course cards
const courses = [...document.querySelectorAll('[class*="course-card"], .course-item, tr[class*="course"]')].map((el, i) => ({
  id: `course_${i+1}`,
  code: el.querySelector('[class*="code"]')?.textContent?.trim() || "",
  title: el.querySelector('[class*="title"], [class*="name"], h3, h4')?.textContent?.trim() || "",
  term: 0, // FILL
  status: "ongoing",
  progress: 0
}));
copy(JSON.stringify(courses, null, 2));
```

---

## 3. Course Weeks & Content (per course)

Navigate to a course detail page, then:

```javascript
// Scrape weeks/modules
const weeks = [...document.querySelectorAll('[class*="week"], [class*="module"], .accordion-item')].map((el, i) => ({
  weekNumber: i + 1,
  title: el.querySelector('[class*="title"], h3, h4, summary')?.textContent?.trim() || `Week ${i+1}`,
  status: el.classList.contains('locked') ? 'locked' : el.classList.contains('completed') ? 'completed' : 'open',
  lectures: [...el.querySelectorAll('[class*="lecture"], [class*="video"], li')].map((lec, j) => ({
    title: lec.textContent?.trim() || "",
    type: lec.querySelector('svg, [class*="video"]') ? 'video' : 'reading',
    completed: lec.classList.contains('completed') || !!lec.querySelector('[class*="check"], [class*="done"]')
  }))
}));
copy(JSON.stringify(weeks, null, 2));
```

---

## 4. Graded Assignment Questions (per week)

Navigate to each graded assignment page:

```javascript
// Scrape questions from assignment/quiz page
const questions = [...document.querySelectorAll('[class*="question"], .question-container, [class*="ques"]')].map((el, i) => ({
  questionNumber: i + 1,
  text: el.querySelector('[class*="text"], [class*="stem"], p')?.textContent?.trim() || "",
  type: el.querySelector('input[type="radio"]') ? 'mcq' : el.querySelector('input[type="checkbox"]') ? 'msq' : 'numerical',
  options: [...el.querySelectorAll('[class*="option"], label')].map((opt, j) => ({
    label: String.fromCharCode(65 + j),
    text: opt.textContent?.trim() || ""
  })),
  marks: 1 // adjust if shown
}));
copy(JSON.stringify(questions, null, 2));
```

---

## 5. Grades

Navigate to grades/results page:

```javascript
// Scrape grade table
const grades = [...document.querySelectorAll('table tbody tr, [class*="grade-row"]')].map(row => {
  const cells = [...row.querySelectorAll('td, [class*="cell"]')];
  return {
    courseCode: cells[0]?.textContent?.trim() || "",
    courseTitle: cells[1]?.textContent?.trim() || "",
    credits: parseInt(cells[2]?.textContent?.trim() || "0"),
    grade: cells[3]?.textContent?.trim() || "",
  };
});
copy(JSON.stringify(grades, null, 2));
```

---

## 6. Bulk Network Export (BEST METHOD)

This captures actual API data with zero guessing:

1. Open DevTools → Network tab
2. Check "Preserve log"
3. Navigate through: Dashboard → Courses → Each Course → Grades
4. When done, right-click in the Network panel → "Save all as HAR with content"
5. Save as `captures/network.har`

Then I'll parse the HAR file to extract all JSON responses automatically.

---

## 7. Screenshot Batch

For visual reference, take full-page screenshots (Cmd+Shift+P → "Capture full size screenshot" in Chrome DevTools):

- `captures/dashboard.png`
- `captures/courses-list.png`
- `captures/course-detail-[name].png`
- `captures/week-expanded.png`
- `captures/assignment-graded.png`
- `captures/assignment-practice.png`
- `captures/grades.png`
- `captures/sidebar.png`

---

## Quick Alternative: Manual JSON

If the console commands don't work well with your platform's DOM structure, just manually type/paste your data into JSON files following the schema in `src/lib/types.ts`. I'll build import tooling that handles any format.
