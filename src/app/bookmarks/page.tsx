"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useBookmarks } from "@/lib/useBookmarks";
import { getCourseById } from "@/lib/data";
import type { Assignment, Course, Question } from "@/lib/types";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { BookmarkButton } from "@/components/ui/BookmarkButton";
import rawAssignments from "@/data/seek/raw_assignments.json";

interface BookmarkEntry {
  courseId: string;
  assignmentId: string;
  questionId: string;
  course: Course | null;
  assignment: Assignment | null;
  question: Question | null;
  rawHtml: string | null;
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

        // Try structured JSON (old-style assignments under /courses/.../assignments)
        let assignment: Assignment | null = null;
        try {
          const mod = await import(`@/data/assignments/${b.assignment_id}.json`);
          assignment = (mod.default ?? mod) as Assignment;
        } catch {
          assignment = null;
        }
        const question = assignment?.questions.find((q) => q.id === b.question_id) ?? null;

        // Fallback: try raw HTML (seek assignments)
        let rawHtml: string | null = null;
        if (!assignment) {
          const courseRaw = (rawAssignments as Record<string, Record<string, string>>)[b.course_id];
          const fullHtml = courseRaw?.[b.assignment_id];
          if (fullHtml) {
            rawHtml = extractQuestionHtml(fullHtml, b.question_id);
          }
        }

        results.push({
          courseId: b.course_id,
          assignmentId: b.assignment_id,
          questionId: b.question_id,
          course,
          assignment,
          question,
          rawHtml,
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
  const { assignment, question, rawHtml, courseId, assignmentId, questionId } = entry;

  // Structured JSON path
  if (assignment && question) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-start justify-between mb-2">
          <p className="text-xs font-medium text-gray-500">
            {assignment.title} • Q{question.questionNumber} • {question.marks} mark
            {question.marks > 1 ? "s" : ""}
          </p>
          <BookmarkButton courseId={courseId} assignmentId={assignmentId} questionId={questionId} />
        </div>

        <p className="text-sm text-gray-800 mb-3 whitespace-pre-wrap">{question.text}</p>

        {question.options && question.options.length > 0 && (
          <div className="space-y-2">
            {question.options.map((opt) => (
              <div
                key={opt.id}
                className={`flex items-start gap-2 p-2.5 rounded-lg border text-sm ${
                  opt.isCorrect ? "border-green-200 bg-green-50" : "border-gray-100 bg-gray-50"
                }`}
              >
                <span className="font-medium text-gray-500 min-w-[1.5rem]">{opt.label}.</span>
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

  // Raw HTML path (seek assignments)
  if (rawHtml) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-start justify-between mb-2">
          <p className="text-xs font-medium text-gray-500">{assignmentId}</p>
          <BookmarkButton courseId={courseId} assignmentId={assignmentId} questionId={questionId} />
        </div>
        <RawQuestionPreview html={rawHtml} />
        <div className="mt-4">
          <Link
            href={buildSeekLink(courseId, assignmentId)}
            className="text-xs text-indigo-600 font-medium hover:underline"
          >
            Go to assignment →
          </Link>
        </div>
      </div>
    );
  }

  // Fallback
  return (
    <div className="bg-white border border-yellow-200 rounded-xl p-4 text-sm">
      <p className="text-yellow-800 mb-2">Source assignment or question no longer available.</p>
      <BookmarkButton courseId={courseId} assignmentId={assignmentId} questionId={questionId} />
    </div>
  );
}

function RawQuestionPreview({ html }: { html: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.innerHTML = html;

    // Show correct answers (inverse of hideCapturedFeedback) — bookmarks should show the answer.
    // Unhide anything we ship that says "correct", "Accepted Answers", or highlights
    ref.current.querySelectorAll<HTMLElement>(".qt-feedback, .qt-correct, .qt-partially-correct").forEach((el) => {
      el.style.display = "";
    });

    // MathJax typeset
    function typesetMath() {
      const mj = (window as unknown as Record<string, unknown>).MathJax as
        | { Hub?: { Queue: (args: unknown[]) => void } }
        | undefined;
      if (mj?.Hub && ref.current) {
        mj.Hub.Queue(["Typeset", mj.Hub, ref.current]);
      }
    }

    if ((window as unknown as Record<string, unknown>).MathJax) {
      typesetMath();
    } else {
      const configScript = document.createElement("script");
      configScript.type = "text/x-mathjax-config";
      configScript.textContent = `MathJax.Hub.Config({tex2jax:{inlineMath:[['\\\\(','\\\\)'],['$','$']],displayMath:[['\\\\[','\\\\]'],['$$','$$']],processEscapes:true},TeX:{extensions:["AMSmath.js","AMSsymbols.js"]},messageStyle:"none"});`;
      document.head.appendChild(configScript);
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.9/MathJax.js?config=TeX-AMS-MML_HTMLorMML";
      script.async = true;
      script.onload = () => setTimeout(typesetMath, 200);
      document.head.appendChild(script);
    }
  }, [html]);

  return (
    <div
      ref={ref}
      style={{ fontSize: 14, lineHeight: 1.7, color: "rgba(0,0,0,0.87)" }}
    />
  );
}

function extractQuestionHtml(fullHtml: string, compositeQuestionId: string): string | null {
  const parts = compositeQuestionId.split(":");
  const rawId = parts[parts.length - 1];
  if (!rawId) return null;

  if (typeof window === "undefined") return null;
  const doc = new DOMParser().parseFromString(fullHtml, "text/html");

  // Attribute selector value is inside quotes — CSS.escape handles any special chars safely.
  const escaped = typeof CSS !== "undefined" && CSS.escape ? CSS.escape(rawId) : rawId.replace(/"/g, '\\"');
  const target = doc.querySelector<HTMLElement>(
    `.qt-mc-question[id="${escaped}"], .qt-sa-question[id="${escaped}"]`
  );
  if (!target) return null;

  // Include the parent group's introduction (context text like "Use the info below for Q3 and Q4"),
  // plus the specific question element. That gives the student full context + the question.
  const group = target.closest<HTMLElement>(".qt-question-group");
  const intro = group?.querySelector<HTMLElement>(":scope > .qt-introduction");
  if (intro) {
    const wrap = doc.createElement("div");
    wrap.appendChild(intro.cloneNode(true));
    wrap.appendChild(target.cloneNode(true));
    return wrap.innerHTML;
  }
  return target.outerHTML;
}

function buildSeekLink(courseId: string, assignmentId: string): string {
  // Seek assignment ids can be titles like "AQ4.4: ..." — use them in the title query param.
  // Try to detect a week number from the title if present.
  const weekMatch = assignmentId.match(/\d+/);
  const weekNum = weekMatch ? weekMatch[0] : "1";
  if (assignmentId.endsWith("-graded")) {
    return `/seek/courses/${courseId}/week/${weekNum}/graded`;
  }
  if (assignmentId.endsWith("-practice")) {
    return `/seek/courses/${courseId}/week/${weekNum}/practice`;
  }
  if (assignmentId.endsWith("-activity")) {
    return `/seek/courses/${courseId}/week/${weekNum}/activity`;
  }
  // Default: assignment route with title
  return `/seek/courses/${courseId}/week/${weekNum}/assignment?title=${encodeURIComponent(assignmentId)}`;
}
