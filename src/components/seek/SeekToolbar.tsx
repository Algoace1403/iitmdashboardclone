"use client";

import Link from "next/link";

interface SeekToolbarProps {
  courseName?: string;
}

export function SeekToolbar({ courseName }: SeekToolbarProps) {
  return (
    <header className="h-16 bg-[#1976d2] text-white flex items-center px-4 sticky top-0 z-50 shadow-md">
      {/* Left: Brand */}
      <Link href="/seek" className="flex items-center gap-3">
        <span className="text-base font-medium">IIT Madras</span>
        {courseName && (
          <>
            <span className="text-white/40">|</span>
            <span className="text-sm text-white/80">{courseName}</span>
          </>
        )}
      </Link>

      <div className="flex-1" />

      {/* Right: Icons */}
      <div className="flex items-center gap-3">
        {/* Bell icon */}
        <button className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center transition">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>
        {/* Profile */}
        <button className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center transition">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
          </svg>
        </button>
      </div>
    </header>
  );
}
