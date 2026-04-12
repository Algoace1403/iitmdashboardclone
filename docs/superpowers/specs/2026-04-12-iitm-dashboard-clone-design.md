# IIT Madras Student Dashboard Clone — Design Spec

## Overview

100% faithful clone of both IIT Madras BS Degree portals:
1. **App Portal** (`app.onlinedegree.iitm.ac.in`) — admin dashboard
2. **SEEK Portal** (`seek.onlinedegree.iitm.ac.in`) — learning/content portal

Student: ANUJ KUMAR SONI, BS in Data Science and Applications, CGPA 8.25

---

## Architecture

- **Framework**: Next.js 16 (App Router) with TypeScript
- **Styling**: Tailwind CSS matching exact portal colors
- **Font**: Open Sans (app portal), Roboto (SEEK portal)
- **Auth**: Simple local auth mimicking Firebase Google sign-in flow
- **Data**: Static JSON files populated from user's real exports
- **Deploy**: Runs on localhost, deployable to Vercel

---

## Portal 1: App Dashboard

### Tech Reference
- Original: Flask/Jinja2 + HTMX + Alpine.js + Bootstrap 4.6.1 + Argon Design System
- Clone: Next.js + Tailwind (matching Argon's exact colors/spacing)

### Exact Colors
| Token | Hex | Usage |
|-------|-----|-------|
| primary | #A0332D | Links, buttons, footer, sidebar course cards |
| primary-hover | #822925 | Button hover |
| secondary/gold | #D6A64F | Accents |
| login-gradient | #A0322C → #EBC133 | Login background (207deg) |
| navbar-bg | #efefef | Top nav bar |
| navbar-shadow | 0 1px 1px 1px lightgray | Nav shadow |
| body-bg | #f5f5f5 | Page background |
| body-text | #525f7f | Paragraph text |
| dark-text | #32325d | Headings |
| card-muted | #8898aa | Card secondary text |
| gray | #6A6A6A | Secondary text |
| gray-dark | #323232 | Dark text |
| gray-badge | #A7A7A7 | Badge text |
| sidebar-bg | #A0332D | Left sidebar |
| logo-maroon | #781e19 | Logo outer circle |
| logo-gold | #d5a44f | Logo inner design |

### Typography
- Font: Open Sans, weights 300/400/600/700
- Body: 1rem, weight 400, line-height 1.5
- Icons: Font Awesome 5 equivalents (using SVG icons)

### Login Page (`/login`)
- Full-viewport gradient background: `linear-gradient(207deg, #A0322C 0%, #EBC133 100%)`
- Top: Light gray navbar (#efefef) with IIT Madras logo (58px)
- Two-panel centered layout:
  - Left (30%): White card, border-radius 1rem, shadow
    - "Sign-in using the Google account you registered with"
    - Google sign-in button (styled like FirebaseUI)
  - Right (70%): "Latest Updates / Announcements" carousel, white text
- Bottom: Maroon footer (#A0332D) with contact info

### Top Navbar (all pages after login)
- Height: 56px (3.5rem)
- Background: #efefef
- Box-shadow: 0 1px 1px 1px lightgray
- Left: IIT Madras logo SVG (58px, colors #781e19/#d5a44f/#fff)
- Center: Student name with person icon
- Right: "Latest Updates" link + "Sign Out" button (both #A0332D)

### Left Sidebar
- Background: #A0332D
- Width: 224px (14rem), collapsible to 56px icon-only
- Position: fixed, below navbar
- Items (11 total):
  1. My Current Courses (📖)
  2. Completed & Pending Courses (✓)
  3. My Completed Projects (📋)
  4. Hall Ticket & Exam Cities (🎫)
  5. Academic Calendar (📅)
  6. Certificates (🏆)
  7. Documents for Download (⬇️)
  8. Submitted Documents (📄)
  9. Payments & Transactions (💳)
  10. Disciplinary Action (⚠️)
  11. Issues & Queries (❓)
- Active state: white left border + white bg overlay 15%
- Collapse button at bottom

### Route Map (App Portal)
| Route | Page |
|-------|------|
| `/login` | Login page |
| `/` | My Current Courses (dashboard home) |
| `/student_courses` | Completed & Pending Courses (Foundation/Diploma/Degree) |
| `/projects` | My Completed Projects |
| `/hall-ticket` | Hall Ticket & Exam Cities |
| `/calendar` | Academic Calendar |
| `/certificates` | Certificates |
| `/documents` | Documents for Download |
| `/submitted` | Submitted Documents |
| `/payments` | Payments & Transactions |
| `/disciplinary` | Disciplinary Action |
| `/issues` | Issues & Queries |
| `/updates` | Latest Updates |
| `/courses/[courseId]` | Course detail (scores table) |

### Current Courses Page (`/`)
- Top right: Date + Term label (e.g., "12 April, 2026" / "JANUARY 2026 TERM")
- Title: "My Current Courses"
- Subtitle: "Cumulative Grade Point Average (CGPA) till this term - **8.25**"
- Course cards in 4-column grid:
  - Maroon header (#A0332D) with radial dot pattern overlay
  - Title, "NEW COURSE" badge, program name
  - White body: OPPY_ELIGIBLE score, MODULE_GPA_AVERAGEs, Week 1-12 assignments, Quiz scores, Activity scores
  - "Allowed to take End Term Exam? Yes/No"
  - "Go to Course page >" link

### Student Courses Page (`/student_courses`)
- Title: "Foundational Level Courses"
- Section: "COMPLETED COURSES" — list with grade letters
- Section: "CURRENT COURSES" — list with "Current Course" label
- Course names are maroon links (#A0332D)

### Grading Scale
| Grade | Points | Score |
|-------|--------|-------|
| S | 10 | ≥90 |
| A | 9 | ≥80 |
| B | 8 | ≥70 |
| C | 7 | ≥60 |
| D | 6 | ≥50 |
| E | 5 | ≥40 |
| U | 0 | <40 |

---

## Portal 2: SEEK Learning Portal

### Tech Reference
- Original: Angular 18.2 + Angular Material 18 (MDC) + KaTeX
- Clone: Next.js pages styled to match Angular Material look

### Exact Colors
| Token | Hex | Usage |
|-------|-----|-------|
| seek-primary | #3f51b5 | Material Indigo 500 |
| seek-theme | #1976d2 | Material Blue 700, toolbar |
| seek-accent | #ff4081 | Material Pink A200 |
| seek-bg | #fafafa | Background |
| seek-text | #212121 | Primary text |
| seek-text-secondary | #494f69 | Secondary text |
| seek-gray | #7d8698 | Muted text |
| seek-maroon | #781f1a | IIT Madras accent |
| seek-gold | #bf8d30 | Gold accent |
| seek-green | #039855 | Success |
| seek-error | #d92d20 | Error/Red |

### Typography
- Font: Roboto, weights 300/400/500/700
- Material Icons for navigation icons

### SEEK Layout
- Top toolbar: #1976d2 (Material Blue), 64px height
  - Left: "IIT Madras" text + term selector
  - Right: Bell icon (notifications), profile
- Left sidebar: White/light bg, 280px width
  - Course Introduction
    - About the Course
    - Grading Policy
    - Disciplinary & Non Academic Conduct
    - Malpractice Rules
  - Week 0 through Week 12
  - Practice Tests (Objective)
- Main content: White card area, #fafafa background

### SEEK Route Map
| Route | Page |
|-------|------|
| `/seek` | SEEK home / course list |
| `/seek/courses/[courseId]` | Course landing (About the Course) |
| `/seek/courses/[courseId]/week/[weekNum]` | Week content list |
| `/seek/courses/[courseId]/week/[weekNum]/graded` | Graded assignment |
| `/seek/courses/[courseId]/week/[weekNum]/practice` | Practice assignment |
| `/seek/courses/[courseId]/week/[weekNum]/activity` | Activity questions |
| `/seek/courses/[courseId]/practice-tests` | Practice tests |

### Course "About" Page
- Course ID, Credits, Course Type (Foundation/Diploma/Degree)
- Faculty Name, Department
- Course Instructors list
- Study Material description
- Course Website Link

### Week Content Page
- List of items:
  - Video lectures (with duration)
  - Lecture PPTs/Slides
  - Lecture Transcripts
  - Activity Questions
  - Practice Assignment
  - Graded Assignment (with due date)
  - Feedback link

### Graded Assignment Page
- Title: "Week N | Graded Assignment N"
- Due date: "YYYY-MM-DD, 23:59 IST"
- Questions listed vertically
- Each question:
  - Question number + marks
  - Question text (KaTeX math rendering)
  - MCQ: radio buttons, options A/B/C/D
  - MSQ: checkboxes, options A/B/C/D
  - Numerical: text input field
  - Programming: code block
- Submit button
- Score display after grading

---

## Data Model

### Student
```typescript
{
  name: string;            // "ANUJ KUMAR SONI"
  rollNumber: string;
  email: string;
  program: string;         // "BS in Data Science and Applications"
  currentTerm: string;     // "JANUARY 2026 TERM"
  enrollmentYear: number;
  cgpa: number;            // 8.25
}
```

### Course (App Portal view)
```typescript
{
  id: string;              // "programming_in_python"
  code: string;            // "CS1002"
  title: string;           // "Programming in Python"
  term: string;
  category: string;        // "foundation"
  credits: number;
  status: string;          // "NEW COURSE"
  program: string;
  allowedEndTerm: boolean | null;
  scores: {
    oppyEligible?: number;
    moduleGpaAverages?: { label: string; value: number }[];
  };
  weeks: { week: number; assignment?: number; quiz?: number; activity?: number }[];
}
```

### SEEK Course Content
```typescript
{
  courseId: string;
  seekCode: string;        // "ns_26t1_cs1002"
  aboutCourse: {
    courseId: string;
    credits: number;
    type: string;
    faculty: string;
    department: string;
    instructors: string[];
    studyMaterial: string;
    websiteLink: string;
  };
  weeks: SeekWeek[];       // 12 weeks
}
```

### SeekWeek
```typescript
{
  weekNumber: number;
  title: string;
  lectures: { title: string; type: "video"|"ppt"|"transcript"; duration?: string }[];
  activities: Question[];
  practiceAssignment: Question[];
  gradedAssignment: {
    title: string;
    dueDate: string;
    questions: Question[];
    totalMarks: number;
    scoredMarks?: number;
  };
}
```

### Question
```typescript
{
  id: string;
  questionNumber: number;
  text: string;            // supports LaTeX
  type: "mcq" | "msq" | "numerical" | "programming";
  marks: number;
  options?: { label: string; text: string; isCorrect?: boolean }[];
  correctAnswer?: string | string[];
  studentAnswer?: string | string[];
  scoredMarks?: number;
  explanation?: string;
}
```

---

## Known User Data (from screenshots)

### Completed Courses
| Course | Grade |
|--------|-------|
| Statistics for Data Science I | C |
| Mathematics for Data Science I | A |
| English I | A |
| Computational Thinking | B |

### Current Courses (Jan 2026 Term)
1. Programming in Python — NEW COURSE
2. Statistics for Data Science II — NEW COURSE
3. POSH Training — NEW COURSE
4. Mathematics for Data Science II — NEW COURSE
5. English II — NEW COURSE

### CGPA: 8.25

---

## File Structure

```
iitm-dashboard/
├── src/
│   ├── app/
│   │   ├── layout.tsx                    # App shell (navbar + sidebar)
│   │   ├── page.tsx                      # Current Courses (dashboard home)
│   │   ├── login/page.tsx                # Login page
│   │   ├── student_courses/page.tsx      # Completed & Pending
│   │   ├── projects/page.tsx
│   │   ├── hall-ticket/page.tsx
│   │   ├── calendar/page.tsx
│   │   ├── certificates/page.tsx
│   │   ├── documents/page.tsx
│   │   ├── submitted/page.tsx
│   │   ├── payments/page.tsx
│   │   ├── disciplinary/page.tsx
│   │   ├── issues/page.tsx
│   │   ├── updates/page.tsx
│   │   ├── courses/[courseId]/page.tsx    # Course detail
│   │   └── seek/                         # SEEK portal section
│   │       ├── layout.tsx                # SEEK layout (different nav/styling)
│   │       ├── page.tsx                  # SEEK home
│   │       └── courses/[courseId]/
│   │           ├── page.tsx              # About the Course
│   │           └── week/[weekNum]/
│   │               ├── page.tsx          # Week content list
│   │               ├── graded/page.tsx   # Graded assignment
│   │               ├── practice/page.tsx # Practice assignment
│   │               └── activity/page.tsx # Activity questions
│   ├── components/
│   │   ├── layout/
│   │   │   ├── TopNav.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── SeekToolbar.tsx
│   │   │   └── SeekSidebar.tsx
│   │   ├── cards/
│   │   │   └── CourseCard.tsx
│   │   ├── seek/
│   │   │   ├── QuestionBlock.tsx
│   │   │   ├── WeekContent.tsx
│   │   │   └── CourseAbout.tsx
│   │   └── ui/
│   │       ├── Badge.tsx
│   │       ├── ProgressBar.tsx
│   │       └── GoogleSignInButton.tsx
│   ├── lib/
│   │   ├── types.ts
│   │   ├── data.ts
│   │   └── utils.ts
│   └── data/
│       ├── student.json
│       ├── courses.json
│       ├── completed_courses.json
│       ├── grades.json
│       ├── notices.json
│       └── seek/
│           ├── programming_in_python.json
│           ├── statistics_ds2.json
│           ├── math_ds2.json
│           ├── english2.json
│           └── posh_training.json
├── public/
│   ├── captures/
│   └── iitm-logo.svg
├── scripts/
│   ├── extract-all-data.js
│   ├── extract-seek-data.js
│   ├── intercept-apis.js
│   └── import-har.ts
└── docs/
    ├── tech-research.md
    └── seek-research.md
```

---

## Execution Order

1. Login page (pixel-match)
2. Fix current courses page (exact Argon-style cards)
3. All 11 sidebar pages
4. SEEK layout + toolbar + sidebar
5. SEEK course pages (about, weeks, assignments, questions)
6. Data import pipeline
7. Populate with real user data
8. Visual parity QA
