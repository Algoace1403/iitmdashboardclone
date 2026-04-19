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
