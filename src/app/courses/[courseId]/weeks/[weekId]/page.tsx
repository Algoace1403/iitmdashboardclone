import { getCourseById } from "@/lib/data";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Badge } from "@/components/ui/Badge";
import { getStatusColor } from "@/lib/utils";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Week } from "@/lib/types";

interface Props {
  params: Promise<{ courseId: string; weekId: string }>;
}

export default async function WeekDetailPage({ params }: Props) {
  const { courseId, weekId } = await params;
  const course = getCourseById(courseId);

  if (!course) notFound();

  let week: Week | undefined;
  try {
    const data = await import(`@/data/weeks/${courseId}.json`);
    const weeks: Week[] = data.default;
    week = weeks.find((w) => w.id === weekId);
  } catch {
    notFound();
  }

  if (!week) notFound();

  return (
    <div className="max-w-4xl mx-auto">
      <Breadcrumbs />

      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-lg font-bold">
          {week.weekNumber}
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-800">{week.title}</h1>
          <p className="text-sm text-gray-500">{course.code} • {course.title}</p>
        </div>
      </div>

      {/* Lectures */}
      <section className="mb-8">
        <h2 className="text-base font-semibold text-gray-700 mb-3">Lectures & Content</h2>
        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
          {week.lectures.length === 0 ? (
            <div className="p-4 text-sm text-gray-500 text-center">No lectures listed</div>
          ) : (
            week.lectures.map((lecture) => (
              <div key={lecture.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-lg">
                    {lecture.type === "video" ? "🎬" : lecture.type === "live" ? "📡" : "📖"}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{lecture.title}</p>
                    {lecture.duration && (
                      <p className="text-xs text-gray-500">{lecture.duration}</p>
                    )}
                  </div>
                </div>
                {lecture.completed ? (
                  <span className="text-green-500 text-sm">✓ Done</span>
                ) : (
                  <span className="text-gray-400 text-sm">○ Pending</span>
                )}
              </div>
            ))
          )}
        </div>
      </section>

      {/* Assignments */}
      <section>
        <h2 className="text-base font-semibold text-gray-700 mb-3">Assignments & Quizzes</h2>
        <div className="space-y-3">
          {week.assignments.length === 0 ? (
            <div className="bg-white rounded-xl border border-dashed border-gray-300 p-4 text-center text-sm text-gray-500">
              No assignments for this week
            </div>
          ) : (
            week.assignments.map((assignment) => (
              <Link
                key={assignment.id}
                href={`/courses/${courseId}/assignments/${assignment.id}`}
                className="block bg-white rounded-xl border border-gray-200 p-4 hover:border-indigo-200 hover:shadow-sm transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-medium text-gray-800">{assignment.title}</h3>
                      <Badge variant={getStatusColor(assignment.status)}>
                        {assignment.status.replace("_", " ")}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {assignment.type} • {assignment.category} • {assignment.totalMarks} marks
                    </p>
                  </div>
                  {assignment.scoredMarks !== undefined && (
                    <div className="text-right">
                      <p className="text-lg font-bold text-indigo-600">
                        {assignment.scoredMarks}/{assignment.totalMarks}
                      </p>
                    </div>
                  )}
                </div>
              </Link>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
