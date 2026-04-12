"use client";

import { getStudent } from "@/lib/data";

export function TopBar() {
  const student = getStudent();

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-40">
      <div>
        <h1 className="text-lg font-semibold text-gray-800">
          Welcome back, {student.name.split(" ")[0]}
        </h1>
        <p className="text-xs text-gray-500">
          {student.program} • Term {student.currentTerm}
        </p>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications bell placeholder */}
        <button className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition">
          🔔
        </button>
        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-medium">
          {student.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)}
        </div>
      </div>
    </header>
  );
}
