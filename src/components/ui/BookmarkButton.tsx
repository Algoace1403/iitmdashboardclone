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
