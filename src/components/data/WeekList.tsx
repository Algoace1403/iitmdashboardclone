"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Week } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { getStatusColor } from "@/lib/utils";

interface WeekListProps {
  courseId: string;
}

export function WeekList({ courseId }: WeekListProps) {
  const [weeks, setWeeks] = useState<Week[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await import(`@/data/weeks/${courseId}.json`);
        setWeeks(data.default);
      } catch {
        setWeeks([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [courseId]);

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (weeks.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-dashed border-gray-300 p-6 text-center">
        <p className="text-gray-500 text-sm">
          No week data. Add file: src/data/weeks/{courseId}.json
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {weeks.map((week) => (
        <Link
          key={week.id}
          href={`/courses/${courseId}/weeks/${week.id}`}
          className="block bg-white rounded-xl border border-gray-200 p-4 hover:border-indigo-200 hover:shadow-sm transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center text-sm font-bold">
                {week.weekNumber}
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-800">{week.title}</h3>
                <p className="text-xs text-gray-500">
                  {week.lectures.length} lectures • {week.assignments.length} assignments
                </p>
              </div>
            </div>
            <Badge variant={getStatusColor(week.status)}>{week.status}</Badge>
          </div>
        </Link>
      ))}
    </div>
  );
}
