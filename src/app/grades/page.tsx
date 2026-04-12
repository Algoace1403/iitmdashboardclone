import { getGrades } from "@/lib/data";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Badge } from "@/components/ui/Badge";
import { getGradeColor } from "@/lib/utils";

export default function GradesPage() {
  const terms = getGrades();

  return (
    <div className="max-w-5xl mx-auto">
      <Breadcrumbs />
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Academic Performance</h1>

      {/* CGPA Summary */}
      {terms.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-indigo-600">
                {terms[terms.length - 1]?.cgpa?.toFixed(2) || "—"}
              </p>
              <p className="text-xs text-gray-500">CGPA</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {terms[terms.length - 1]?.sgpa?.toFixed(2) || "—"}
              </p>
              <p className="text-xs text-gray-500">Latest SGPA</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {terms.reduce((sum, t) => sum + t.creditsEarned, 0)}
              </p>
              <p className="text-xs text-gray-500">Credits Earned</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{terms.length}</p>
              <p className="text-xs text-gray-500">Terms Completed</p>
            </div>
          </div>
        </div>
      )}

      {/* Per-term grades */}
      {terms.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-gray-300 p-8 text-center">
          <p className="text-gray-500">No grades data. Import into src/data/grades.json</p>
        </div>
      ) : (
        terms
          .slice()
          .reverse()
          .map((term) => (
            <section key={term.termId} className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-semibold text-gray-700">Term {term.term}</h2>
                <div className="flex gap-4 text-xs text-gray-500">
                  <span>SGPA: <strong className="text-gray-800">{term.sgpa.toFixed(2)}</strong></span>
                  <span>Credits: <strong className="text-gray-800">{term.creditsEarned}</strong></span>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Code</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Course</th>
                      <th className="text-center px-4 py-3 font-medium text-gray-600">Credits</th>
                      <th className="text-center px-4 py-3 font-medium text-gray-600">Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {term.grades.map((g) => (
                      <tr key={g.courseId}>
                        <td className="px-4 py-3 font-medium text-gray-800">{g.courseCode}</td>
                        <td className="px-4 py-3 text-gray-600">{g.courseTitle}</td>
                        <td className="px-4 py-3 text-center text-gray-600">{g.credits}</td>
                        <td className="px-4 py-3 text-center">
                          <Badge variant={getGradeColor(g.grade)}>{g.grade}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ))
      )}
    </div>
  );
}
