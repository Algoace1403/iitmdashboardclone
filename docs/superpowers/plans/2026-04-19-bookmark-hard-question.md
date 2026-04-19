# Bookmark Hard Question Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a "bookmark hard question" feature on every question in every assignment, plus a dedicated `/bookmarks` page grouped by course, with cross-device sync via Supabase.

**Architecture:** Browser-side Supabase client writes to a single `bookmarks` table keyed by `user_email + question_id`. Assignment page becomes a server component that passes data to a new client component which renders bookmark buttons. `/bookmarks` page is a client component that queries Supabase, then dynamically imports matching assignment JSON to render full question detail.

**Tech Stack:** Next.js 16.2.3 (App Router), React 19, TypeScript 5, Tailwind 4, `@supabase/supabase-js`.

**Related spec:** `docs/superpowers/specs/2026-04-19-bookmark-hard-question-design.md`

---

## Task 1: User provisions Supabase and provides keys (BLOCKS all subsequent tasks)

**Files:**
- Create: `.env.local`

This task is performed by the user (human). The assistant pauses and waits.

- [ ] **Step 1: User creates Supabase project**

User action:
1. Go to https://supabase.com → sign in or sign up.
2. Click **New Project** → pick a name (e.g. `iitm-dashboard`) → set a database password → choose nearest region → click **Create new project**.
3. Wait ~1 minute for provisioning.

- [ ] **Step 2: User creates the `bookmarks` table**

User action:
1. In the Supabase dashboard, open **SQL Editor**.
2. Paste the following and click **Run**:

```sql
create table bookmarks (
  id            uuid primary key default gen_random_uuid(),
  user_email    text not null,
  course_id     text not null,
  assignment_id text not null,
  question_id   text not null,
  created_at    timestamptz default now(),
  unique (user_email, question_id)
);

create index bookmarks_user_idx on bookmarks (user_email);
```

- [ ] **Step 3: User copies API keys and pastes to assistant**

User action:
1. In the Supabase dashboard, go to **Project Settings → API**.
2. Copy the values labelled **Project URL** and **anon public** (the short label under "Project API keys").
3. Paste both values into the chat.

- [ ] **Step 4: Assistant creates `.env.local`**

Create `/Users/aks/iitm-dashboard/.env.local` with the values pasted by the user:

```
NEXT_PUBLIC_SUPABASE_URL=<the URL the user pasted>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<the anon key the user pasted>
```

- [ ] **Step 5: Commit `.gitignore` entry (if missing)**

Verify `.env.local` is listed in `.gitignore`. If not, add it. Never commit `.env.local` itself.

Run: `grep -q "^\.env\.local$" .gitignore || echo ".env.local" >> .gitignore`

```bash
git add .gitignore
git commit -m "chore: ensure .env.local is gitignored"
```

---

## Task 2: Install Supabase client dependency

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`

- [ ] **Step 1: Install the package**

Run:
```bash
cd /Users/aks/iitm-dashboard && npm install @supabase/supabase-js
```

Expected: the package is added to `dependencies` in `package.json`.

- [ ] **Step 2: Verify it was added**

Run:
```bash
grep "@supabase/supabase-js" package.json
```

Expected: a line like `"@supabase/supabase-js": "^2.x.x"`.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add @supabase/supabase-js dependency"
```

---

## Task 3: Create Supabase browser client

**Files:**
- Create: `src/lib/supabase.ts`

- [ ] **Step 1: Create the client file**

Create `/Users/aks/iitm-dashboard/src/lib/supabase.ts`:

```typescript
"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let cached: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!url || !anonKey) {
    throw new Error(
      "Supabase env vars missing: set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local"
    );
  }
  if (!cached) {
    cached = createClient(url, anonKey, {
      auth: { persistSession: false },
    });
  }
  return cached;
}

export interface BookmarkRow {
  id: string;
  user_email: string;
  course_id: string;
  assignment_id: string;
  question_id: string;
  created_at: string;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/supabase.ts
git commit -m "feat: add Supabase browser client"
```

---

## Task 4: Create `useBookmarks` hook

**Files:**
- Create: `src/lib/useBookmarks.ts`

- [ ] **Step 1: Create the hook**

Create `/Users/aks/iitm-dashboard/src/lib/useBookmarks.ts`:

```typescript
"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { getSupabase, type BookmarkRow } from "@/lib/supabase";

export interface ToggleArgs {
  courseId: string;
  assignmentId: string;
  questionId: string;
}

interface UseBookmarksResult {
  bookmarks: BookmarkRow[];
  loading: boolean;
  error: string | null;
  isBookmarked: (questionId: string) => boolean;
  toggle: (args: ToggleArgs) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useBookmarks(): UseBookmarksResult {
  const { userEmail } = useAuth();
  const [bookmarks, setBookmarks] = useState<BookmarkRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!userEmail) {
      setBookmarks([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const sb = getSupabase();
      const { data, error: err } = await sb
        .from("bookmarks")
        .select("*")
        .eq("user_email", userEmail)
        .order("created_at", { ascending: false });
      if (err) throw err;
      setBookmarks((data ?? []) as BookmarkRow[]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load bookmarks");
    } finally {
      setLoading(false);
    }
  }, [userEmail]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const isBookmarked = useCallback(
    (questionId: string) => bookmarks.some((b) => b.question_id === questionId),
    [bookmarks]
  );

  const toggle = useCallback(
    async ({ courseId, assignmentId, questionId }: ToggleArgs) => {
      if (!userEmail) {
        setError("You must be logged in to bookmark questions");
        return;
      }
      const existing = bookmarks.find((b) => b.question_id === questionId);
      const sb = getSupabase();

      if (existing) {
        const prev = bookmarks;
        setBookmarks((b) => b.filter((x) => x.question_id !== questionId));
        const { error: err } = await sb
          .from("bookmarks")
          .delete()
          .eq("id", existing.id);
        if (err) {
          setBookmarks(prev);
          setError("Couldn't remove bookmark. Try again.");
        }
      } else {
        const optimistic: BookmarkRow = {
          id: `tmp-${questionId}`,
          user_email: userEmail,
          course_id: courseId,
          assignment_id: assignmentId,
          question_id: questionId,
          created_at: new Date().toISOString(),
        };
        setBookmarks((b) => [optimistic, ...b]);
        const { data, error: err } = await sb
          .from("bookmarks")
          .insert({
            user_email: userEmail,
            course_id: courseId,
            assignment_id: assignmentId,
            question_id: questionId,
          })
          .select()
          .single();
        if (err) {
          setBookmarks((b) => b.filter((x) => x.id !== optimistic.id));
          setError("Couldn't save bookmark. Try again.");
        } else if (data) {
          setBookmarks((b) =>
            b.map((x) => (x.id === optimistic.id ? (data as BookmarkRow) : x))
          );
        }
      }
    },
    [bookmarks, userEmail]
  );

  return { bookmarks, loading, error, isBookmarked, toggle, refresh };
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/useBookmarks.ts
git commit -m "feat: add useBookmarks hook with optimistic toggle"
```

---

## Task 5: Create `BookmarkButton` component

**Files:**
- Create: `src/components/ui/BookmarkButton.tsx`

- [ ] **Step 1: Create the component**

Create `/Users/aks/iitm-dashboard/src/components/ui/BookmarkButton.tsx`:

```typescript
"use client";

import { useBookmarks } from "@/lib/useBookmarks";

interface BookmarkButtonProps {
  courseId: string;
  assignmentId: string;
  questionId: string;
}

export function BookmarkButton({
  courseId,
  assignmentId,
  questionId,
}: BookmarkButtonProps) {
  const { isBookmarked, toggle } = useBookmarks();
  const active = isBookmarked(questionId);

  return (
    <button
      type="button"
      onClick={() => toggle({ courseId, assignmentId, questionId })}
      aria-label={active ? "Remove bookmark" : "Bookmark this hard question"}
      title={active ? "Remove bookmark" : "Bookmark as hard question"}
      className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 transition"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill={active ? "#f59e0b" : "none"}
        stroke={active ? "#f59e0b" : "#9ca3af"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
    </button>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ui/BookmarkButton.tsx
git commit -m "feat: add BookmarkButton component"
```

---

## Task 6: Split assignment page into server loader + client questions

**Files:**
- Create: `src/app/courses/[courseId]/assignments/[assignmentId]/AssignmentQuestions.tsx`
- Modify: `src/app/courses/[courseId]/assignments/[assignmentId]/page.tsx`

- [ ] **Step 1: Create the client questions component**

Create `/Users/aks/iitm-dashboard/src/app/courses/[courseId]/assignments/[assignmentId]/AssignmentQuestions.tsx`:

```typescript
"use client";

import { BookmarkButton } from "@/components/ui/BookmarkButton";
import type { Assignment } from "@/lib/types";

interface Props {
  assignment: Assignment;
}

export function AssignmentQuestions({ assignment }: Props) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Questions ({assignment.questions.length})
      </h2>
      <div className="space-y-4">
        {assignment.questions.map((q) => (
          <div
            key={q.id}
            className="bg-white rounded-xl border border-gray-200 p-5"
          >
            <div className="flex items-start justify-between mb-3">
              <span className="text-xs font-medium text-gray-500">
                Q{q.questionNumber} • {q.marks} mark{q.marks > 1 ? "s" : ""}
              </span>
              <div className="flex items-center gap-2">
                {q.scoredMarks !== undefined && (
                  <span
                    className={`text-xs font-bold ${
                      q.scoredMarks === q.marks
                        ? "text-green-600"
                        : q.scoredMarks === 0
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {q.scoredMarks}/{q.marks}
                  </span>
                )}
                <BookmarkButton
                  courseId={assignment.courseId}
                  assignmentId={assignment.id}
                  questionId={q.id}
                />
              </div>
            </div>

            <p className="text-sm text-gray-800 mb-3 whitespace-pre-wrap">
              {q.text}
            </p>

            {q.options && q.options.length > 0 && (
              <div className="space-y-2">
                {q.options.map((opt) => {
                  const isSelected =
                    q.studentAnswer &&
                    (Array.isArray(q.studentAnswer)
                      ? q.studentAnswer.includes(opt.label)
                      : q.studentAnswer === opt.label);
                  const isCorrect = opt.isCorrect;
                  return (
                    <div
                      key={opt.id}
                      className={`flex items-start gap-2 p-2.5 rounded-lg border text-sm ${
                        isCorrect
                          ? "border-green-200 bg-green-50"
                          : isSelected
                          ? "border-red-200 bg-red-50"
                          : "border-gray-100 bg-gray-50"
                      }`}
                    >
                      <span className="font-medium text-gray-500 min-w-[1.5rem]">
                        {opt.label}.
                      </span>
                      <span className="text-gray-700">{opt.text}</span>
                      {isCorrect && <span className="ml-auto text-green-600">✓</span>}
                      {isSelected && !isCorrect && (
                        <span className="ml-auto text-red-500">✗</span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {q.type === "numerical" && q.studentAnswer && (
              <div className="mt-2 p-2.5 rounded-lg bg-gray-50 border border-gray-100 text-sm">
                <span className="text-gray-500">Your answer: </span>
                <span className="font-medium text-gray-800">{q.studentAnswer}</span>
                {q.correctAnswer && (
                  <>
                    <span className="text-gray-500 mx-2">|</span>
                    <span className="text-gray-500">Correct: </span>
                    <span className="font-medium text-green-700">
                      {q.correctAnswer}
                    </span>
                  </>
                )}
              </div>
            )}

            {q.explanation && (
              <div className="mt-3 p-3 rounded-lg bg-blue-50 border border-blue-100 text-xs text-blue-800">
                <strong>Explanation:</strong> {q.explanation}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Simplify the server page to use the client component**

Replace `/Users/aks/iitm-dashboard/src/app/courses/[courseId]/assignments/[assignmentId]/page.tsx` with:

```typescript
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Badge } from "@/components/ui/Badge";
import { getStatusColor } from "@/lib/utils";
import { notFound } from "next/navigation";
import type { Assignment } from "@/lib/types";
import { AssignmentQuestions } from "./AssignmentQuestions";

interface Props {
  params: Promise<{ courseId: string; assignmentId: string }>;
}

export default async function AssignmentPage({ params }: Props) {
  const { assignmentId } = await params;

  let assignment: Assignment | null = null;
  try {
    const data = await import(`@/data/assignments/${assignmentId}.json`);
    assignment = data.default as Assignment;
  } catch {
    notFound();
  }

  if (!assignment) notFound();

  return (
    <div className="max-w-4xl mx-auto">
      <Breadcrumbs />

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-800">{assignment.title}</h1>
            <p className="text-sm text-gray-500 mt-1">
              {assignment.type} • {assignment.category} • {assignment.totalMarks} marks total
            </p>
          </div>
          <Badge variant={getStatusColor(assignment.status)}>
            {assignment.status.replace("_", " ")}
          </Badge>
        </div>

        {assignment.scoredMarks !== undefined && (
          <div className="mt-4 bg-indigo-50 rounded-lg p-3 inline-block">
            <span className="text-sm text-indigo-600 font-medium">
              Score: {assignment.scoredMarks}/{assignment.totalMarks}
            </span>
          </div>
        )}
      </div>

      <AssignmentQuestions assignment={assignment} />
    </div>
  );
}
```

- [ ] **Step 3: Start dev server and manually verify one assignment page still renders**

Run in a background shell:
```bash
cd /Users/aks/iitm-dashboard && npm run dev
```

Open `http://localhost:3000`, navigate to any assignment, confirm: questions render, answers shown, a gray star icon appears top-right of each question card.

- [ ] **Step 4: Commit**

```bash
git add src/app/courses/[courseId]/assignments/[assignmentId]/page.tsx src/app/courses/[courseId]/assignments/[assignmentId]/AssignmentQuestions.tsx
git commit -m "feat: wire bookmark button into assignment question cards"
```

---

## Task 7: Create `/bookmarks` page

**Files:**
- Create: `src/app/bookmarks/page.tsx`

- [ ] **Step 1: Create the bookmarks page**

Create `/Users/aks/iitm-dashboard/src/app/bookmarks/page.tsx`:

```typescript
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useBookmarks } from "@/lib/useBookmarks";
import { getCourseById } from "@/lib/data";
import type { Assignment, Course, Question } from "@/lib/types";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { BookmarkButton } from "@/components/ui/BookmarkButton";

interface BookmarkEntry {
  courseId: string;
  assignmentId: string;
  questionId: string;
  course: Course | null;
  assignment: Assignment | null;
  question: Question | null;
}

export default function BookmarksPage() {
  const { bookmarks, loading, error, refresh } = useBookmarks();
  const [entries, setEntries] = useState<BookmarkEntry[]>([]);
  const [hydrating, setHydrating] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function hydrate() {
      setHydrating(true);
      const results: BookmarkEntry[] = [];
      for (const b of bookmarks) {
        const course = getCourseById(b.course_id) ?? null;
        let assignment: Assignment | null = null;
        try {
          const mod = await import(`@/data/assignments/${b.assignment_id}.json`);
          assignment = (mod.default ?? mod) as Assignment;
        } catch {
          assignment = null;
        }
        const question = assignment?.questions.find((q) => q.id === b.question_id) ?? null;
        results.push({
          courseId: b.course_id,
          assignmentId: b.assignment_id,
          questionId: b.question_id,
          course,
          assignment,
          question,
        });
      }
      if (!cancelled) {
        setEntries(results);
        setHydrating(false);
      }
    }
    hydrate();
    return () => {
      cancelled = true;
    };
  }, [bookmarks]);

  const grouped = new Map<string, BookmarkEntry[]>();
  for (const e of entries) {
    const key = e.course?.code ?? e.courseId;
    const arr = grouped.get(key) ?? [];
    arr.push(e);
    grouped.set(key, arr);
  }
  const courseKeys = Array.from(grouped.keys()).sort();

  return (
    <div className="max-w-4xl mx-auto">
      <Breadcrumbs />
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Bookmarks</h1>
      <p className="text-sm text-gray-600 mb-6">
        Hard questions you&apos;ve marked, grouped by course. Synced across your devices.
      </p>

      {loading || hydrating ? (
        <p className="text-sm text-gray-500">Loading your bookmarks…</p>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-800">
          <p className="font-medium mb-2">Couldn&apos;t load bookmarks.</p>
          <p className="mb-3">{error}</p>
          <button
            onClick={() => refresh()}
            className="px-3 py-1.5 bg-red-600 text-white rounded text-xs font-medium"
          >
            Retry
          </button>
        </div>
      ) : entries.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
          <p className="text-sm text-gray-600">
            No bookmarks yet. Mark any question as a hard question from the assignment
            pages.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {courseKeys.map((courseKey) => {
            const items = grouped.get(courseKey)!;
            const course = items[0]?.course;
            return (
              <div key={courseKey}>
                <h2 className="text-lg font-semibold text-gray-800 mb-3">
                  {course ? `${course.code} — ${course.title}` : courseKey}
                </h2>
                <div className="space-y-4">
                  {items.map((e) => (
                    <BookmarkCard key={e.questionId} entry={e} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function BookmarkCard({ entry }: { entry: BookmarkEntry }) {
  const { course, assignment, question, courseId, assignmentId, questionId } = entry;

  if (!assignment || !question) {
    return (
      <div className="bg-white border border-yellow-200 rounded-xl p-4 text-sm">
        <p className="text-yellow-800 mb-2">
          Source assignment or question no longer available.
        </p>
        <BookmarkButton
          courseId={courseId}
          assignmentId={assignmentId}
          questionId={questionId}
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="text-xs font-medium text-gray-500">
            {assignment.title} • Q{question.questionNumber} • {question.marks} mark
            {question.marks > 1 ? "s" : ""}
          </p>
        </div>
        <BookmarkButton
          courseId={courseId}
          assignmentId={assignmentId}
          questionId={questionId}
        />
      </div>

      <p className="text-sm text-gray-800 mb-3 whitespace-pre-wrap">{question.text}</p>

      {question.options && question.options.length > 0 && (
        <div className="space-y-2">
          {question.options.map((opt) => (
            <div
              key={opt.id}
              className={`flex items-start gap-2 p-2.5 rounded-lg border text-sm ${
                opt.isCorrect
                  ? "border-green-200 bg-green-50"
                  : "border-gray-100 bg-gray-50"
              }`}
            >
              <span className="font-medium text-gray-500 min-w-[1.5rem]">
                {opt.label}.
              </span>
              <span className="text-gray-700">{opt.text}</span>
              {opt.isCorrect && <span className="ml-auto text-green-600">✓</span>}
            </div>
          ))}
        </div>
      )}

      {question.type === "numerical" && question.correctAnswer && (
        <div className="mt-2 p-2.5 rounded-lg bg-gray-50 border border-gray-100 text-sm">
          <span className="text-gray-500">Correct: </span>
          <span className="font-medium text-green-700">
            {Array.isArray(question.correctAnswer)
              ? question.correctAnswer.join(", ")
              : question.correctAnswer}
          </span>
        </div>
      )}

      {question.explanation && (
        <div className="mt-3 p-3 rounded-lg bg-blue-50 border border-blue-100 text-xs text-blue-800">
          <strong>Explanation:</strong> {question.explanation}
        </div>
      )}

      <div className="mt-4">
        <Link
          href={`/courses/${courseId}/assignments/${assignmentId}`}
          className="text-xs text-indigo-600 font-medium hover:underline"
        >
          Go to assignment →
        </Link>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/bookmarks/page.tsx
git commit -m "feat: add /bookmarks page grouped by course"
```

---

## Task 8: Add "Bookmarks" entry to sidebar nav

**Files:**
- Modify: `src/components/layout/Sidebar.tsx`

- [ ] **Step 1: Add the nav item and a star icon**

In `/Users/aks/iitm-dashboard/src/components/layout/Sidebar.tsx`:

**Change 1** — add nav item. Replace the `navItems` array (lines 7-18) with:

```typescript
const navItems = [
  { label: "My Current Courses", href: "/" },
  { label: "Completed & Pending Courses", href: "/student_courses" },
  { label: "My Completed Projects", href: "/projects" },
  { label: "Hall Ticket & Exam Cities", href: "/hall-ticket" },
  { label: "Academic Calendar", href: "/calendar" },
  { label: "Certificates", href: "/certificates" },
  { label: "Documents for Download", href: "/documents" },
  { label: "Submitted Documents", href: "/submitted" },
  { label: "Payments & Transactions", href: "/payments" },
  { label: "Disciplinary Action", href: "/disciplinary" },
  { label: "Bookmarks", href: "/bookmarks" },
];
```

**Change 2** — add matching icon. Inside the `icons` array (ends at line 31), add one more entry before the closing `]`:

```tsx
  <svg key="10" width="22" height="22" fill="none" stroke="white" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" /></svg>,
```

- [ ] **Step 2: Manually verify the sidebar shows a "Bookmarks" entry with a star icon**

Open `http://localhost:3000` with the dev server running. Confirm the sidebar now has a "Bookmarks" item with a bookmark-shaped icon. Click it → lands on `/bookmarks`.

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/Sidebar.tsx
git commit -m "feat: add Bookmarks entry to sidebar nav"
```

---

## Task 9: End-to-end manual smoke test

**Files:** (no code changes)

- [ ] **Step 1: Verify bookmark toggle on an assignment page**

With dev server running:
1. Navigate to any assignment (e.g. `/courses/<id>/assignments/<id>`).
2. Click the star on a question. Expect: star turns filled/yellow immediately.
3. Refresh the page. Expect: star remains filled.
4. Click the star again. Expect: star returns to outline/gray.

- [ ] **Step 2: Verify the `/bookmarks` page**

1. Bookmark 2-3 questions across different assignments/courses.
2. Navigate to `/bookmarks`.
3. Expect: sections grouped by course; each card shows question text, options (with correct one highlighted), explanation, and a "Go to assignment →" link.
4. Click "Go to assignment →" → lands on the right assignment.
5. Unbookmark from the assignment page → return to `/bookmarks` → entry is gone (refresh may be needed).

- [ ] **Step 3: Verify cross-device sync**

1. Open the site in a second browser (or incognito window, or another device on the same network via `http://<laptop-lan-ip>:3000`).
2. Log in with the same credentials.
3. Expect: the same bookmarks appear on `/bookmarks`.
4. Bookmark a new question on device A → refresh device B → new bookmark appears.

- [ ] **Step 4: Verify error handling**

1. In browser devtools, set network to "Offline".
2. Click a star. Expect: toast-like error (or the star snaps back to its previous state) and no silent failure.
3. Restore network.

- [ ] **Step 5: Stop the dev server**

Stop the background `npm run dev` process.

---

## Self-review checklist (assistant runs after implementation)

- [ ] No `console.log` left in new code (search: `grep -rn "console.log" src/lib/supabase.ts src/lib/useBookmarks.ts src/components/ui/BookmarkButton.tsx src/app/bookmarks src/app/courses/\[courseId\]/assignments/\[assignmentId\]/AssignmentQuestions.tsx`)
- [ ] `.env.local` is gitignored; no keys in any committed file.
- [ ] `npm run lint` passes.
- [ ] `npm run build` passes.
