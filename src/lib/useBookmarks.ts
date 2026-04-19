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
