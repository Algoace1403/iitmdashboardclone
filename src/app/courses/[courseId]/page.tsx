import { getCourseById } from "@/lib/data";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Course } from "@/lib/types";

interface Props {
  params: Promise<{ courseId: string }>;
}

export default async function CourseDetailPage({ params }: Props) {
  const { courseId } = await params;
  const course = getCourseById(courseId);

  if (!course) {
    notFound();
  }

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">{course.title}</h1>
      <p className="text-sm text-gray-600 mb-6">{course.code} &bull; {course.program}</p>

      {/* Scores summary */}
      <div className="bg-white border border-gray-200 rounded-sm p-5 mb-6">
        <h2 className="text-base font-bold text-gray-900 mb-3">Scores</h2>

        {course.scores.oppyEligible !== undefined && (
          <p className="text-sm mb-1">
            <span className="font-semibold">OPPY1_ELIGIBLE:</span> {course.scores.oppyEligible.toFixed(2)}
          </p>
        )}

        {course.scores.moduleGpaAverages?.map((m) => (
          <p key={m.label} className="text-sm mb-1">
            <span className="font-semibold">{m.label}:</span> {m.value.toFixed(2)}
          </p>
        ))}

        {course.allowedEndTerm !== undefined && course.allowedEndTerm !== null && (
          <p className="text-sm mt-2 font-semibold">
            Allowed to take End Term Exam? {course.allowedEndTerm ? "Yes" : "No"}
          </p>
        )}
      </div>

      {/* Week-by-week scores */}
      <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
        <h2 className="text-base font-bold text-gray-900 p-5 pb-3">Weekly Scores</h2>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-y border-gray-200">
            <tr>
              <th className="text-left px-5 py-2 font-medium text-gray-600">Week</th>
              <th className="text-right px-5 py-2 font-medium text-gray-600">Assignment</th>
              <th className="text-right px-5 py-2 font-medium text-gray-600">Quiz</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {course.weeks.map((w) => (
              <tr key={w.week}>
                <td className="px-5 py-2 text-gray-800">Week {w.week}</td>
                <td className="px-5 py-2 text-right text-gray-700">
                  {w.assignment !== null && w.assignment !== undefined
                    ? w.assignment.toFixed(2)
                    : <span className="text-gray-400 italic">Absent</span>}
                </td>
                <td className="px-5 py-2 text-right text-gray-700">
                  {w.quiz !== null && w.quiz !== undefined
                    ? w.quiz.toFixed(2)
                    : <span className="text-gray-400">—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between" }}>
        <Link href="/" className="text-[#aa3535] text-sm font-medium hover:underline">
          &larr; Back to Current Courses
        </Link>
        <Link
          href={`/seek/courses/${courseId}`}
          style={{ background: "#aa3535", color: "white", padding: "8px 20px", borderRadius: 4, fontSize: 13, fontWeight: 600, textDecoration: "none" }}
        >
          View Course Content &rarr;
        </Link>
      </div>
    </div>
  );
}
