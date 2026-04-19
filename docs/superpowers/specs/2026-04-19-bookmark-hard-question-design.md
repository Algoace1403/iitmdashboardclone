# Bookmark Hard Question — Design Spec

**Date:** 2026-04-19
**Project:** iitm-dashboard
**Status:** Draft (awaiting user approval)

## 1. Goal

Let the student mark any question (in any graded or non-graded assignment, any subject) as "bookmarked" (a hard question to revisit). All bookmarks appear on a dedicated `/bookmarks` page, grouped by course, with the full question details shown inline. Bookmarks must sync across devices.

## 2. Scope

In scope:
- Bookmark toggle on every question in every assignment page (all `type` values: `graded`, `practice`, `bonus`).
- New `/bookmarks` page, grouped by course, showing question text, options, correct answer, explanation, and a link back to the source assignment.
- Cross-device sync via Supabase.
- Sidebar nav entry for `/bookmarks`.

Out of scope:
- Notes/tags on bookmarks.
- Filtering/search on the bookmarks page.
- Bulk actions.
- Offline queue / background sync.

## 3. Data model (Supabase)

Single table:

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

- `unique (user_email, question_id)` prevents duplicate bookmarks.
- Only IDs are stored. Full question/assignment content is looked up from the existing JSON in `src/data/assignments/<assignmentId>.json` at display time, so bookmarks stay in sync with assignment edits automatically.

**RLS policy:** Since auth is a single hardcoded user (`src/lib/auth.tsx`), Row-Level Security is not required. The anon key will be used directly from the browser, with client-side filtering by `user_email`. This matches the current app's auth model. (Documented as a known limitation — can be tightened later if multi-user auth is added.)

## 4. Environment variables

Add to `.env.local` (and Vercel project env):

```
NEXT_PUBLIC_SUPABASE_URL=<from Supabase dashboard>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<from Supabase dashboard>
```

Both must be `NEXT_PUBLIC_` because the client component needs them.

## 5. Architecture

### 5.1 Components and files

| Path | Kind | Purpose |
|---|---|---|
| `src/lib/supabase.ts` | NEW | Creates and exports a singleton Supabase browser client |
| `src/lib/useBookmarks.ts` | NEW | React hook: fetches bookmarks for the current user, exposes `isBookmarked(questionId)`, `toggle({courseId, assignmentId, questionId})`, `bookmarks[]`, `loading`, `error` |
| `src/components/ui/BookmarkButton.tsx` | NEW | Client component; renders a filled/outline star; calls `toggle(...)`; shows disabled state while mutating |
| `src/app/courses/[courseId]/assignments/[assignmentId]/page.tsx` | MODIFY | Stays a server component; loads assignment JSON and passes it to a client child |
| `src/app/courses/[courseId]/assignments/[assignmentId]/AssignmentQuestions.tsx` | NEW | Client component; receives `assignment` prop; renders the question list with a `<BookmarkButton>` per question |
| `src/app/bookmarks/page.tsx` | NEW | Client component; lists bookmarks grouped by course with full question detail |
| `src/components/layout/Sidebar.tsx` | MODIFY | Add `{ label: "Bookmarks", href: "/bookmarks" }` to `navItems` |
| `.env.local` | MODIFY | Add two env vars (user does this after creating Supabase project) |
| `package.json` | MODIFY | Add `@supabase/supabase-js` dependency |

### 5.2 Data flow

**Toggle bookmark on an assignment page:**
1. User clicks star on a question card.
2. `BookmarkButton` calls `toggle()` from `useBookmarks()`.
3. Hook does an optimistic local update, then inserts/deletes the row in Supabase.
4. On success, local state is confirmed. On failure, local state is reverted and an error toast is shown.

**Load bookmarks page:**
1. Client component mounts on `/bookmarks`.
2. `useBookmarks()` reads all rows for `user_email`.
3. For each unique `assignment_id`, the page dynamically imports the assignment JSON (same pattern as the existing assignment page: `await import(\`@/data/assignments/${assignmentId}.json\`)`).
4. The course title/code is read from the existing `getCourseById()` in `src/lib/data.ts` using `course_id`.
5. Entries are grouped by course, then by assignment, then rendered as full question cards reusing the same question-card markup as the assignment page.

### 5.3 Grouping on the bookmarks page

Grouping order: course → assignment → question (by `questionNumber` asc). Courses ordered by the `code` field.

## 6. UI details

- **Bookmark button placement:** top-right of each question card, next to `Q{n} • {marks} marks`. Filled yellow star = bookmarked; outlined gray star = not bookmarked.
- **Accessibility:** button has `aria-label="Bookmark this question"` / `"Remove bookmark"`. Keyboard activatable.
- **Sidebar entry:** inserted just after "Disciplinary Action" (end of list), matching existing style.
- **Empty state:** `/bookmarks` shows "No bookmarks yet. Mark any question as a hard question from the assignment pages."
- **Loading state:** Skeleton list while bookmarks load.
- **Error state:** Red banner with retry button if Supabase fetch fails.

## 7. Error handling

| Case | Behavior |
|---|---|
| Supabase insert fails | Revert optimistic star, show toast "Couldn't save bookmark. Try again." |
| Supabase delete fails | Revert optimistic star, show toast "Couldn't remove bookmark. Try again." |
| Fetch on `/bookmarks` fails | Show banner with retry button |
| Assignment JSON missing for a bookmark (e.g., assignment deleted) | Render a "Source assignment not found — [Remove bookmark]" placeholder |
| No Supabase env vars configured | Hook surfaces a clear error; button is disabled |

## 8. Testing

- **Smoke test (manual):**
  - Bookmark a question → appears in `/bookmarks` page grouped under the right course.
  - Unbookmark → disappears from `/bookmarks`.
  - Bookmark from Device A → visible on Device B (or second browser) after refresh.
  - Error path: disconnect internet → click bookmark → optimistic update reverts with toast.
- **Unit test:** `useBookmarks` toggle logic (happy path + revert on error). Using Vitest or whatever the project standardizes on (no test framework present yet — will be added if user agrees in the plan step).

## 9. Setup steps (for the user)

1. Go to [supabase.com](https://supabase.com) → create a free project.
2. In the Supabase SQL editor, paste and run the SQL from section 3.
3. In Supabase project settings → API, copy `Project URL` and `anon public` key.
4. Paste them into `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
   ```
5. On Vercel: add the same two env vars under Project Settings → Environment Variables.
6. `npm install` (handled as part of the implementation plan).

## 10. Open questions / future work

- Real per-user auth (replacing hardcoded email) → enable RLS then.
- Notes/tags on bookmarks.
- Export bookmarks as PDF/Markdown for offline revision.
