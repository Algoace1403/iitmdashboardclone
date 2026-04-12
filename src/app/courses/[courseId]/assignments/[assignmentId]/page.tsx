import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Badge } from "@/components/ui/Badge";
import { getStatusColor } from "@/lib/utils";
import { notFound } from "next/navigation";
import type { Assignment } from "@/lib/types";

interface Props {
  params: Promise<{ courseId: string; assignmentId: string }>;
}

export default async function AssignmentPage({ params }: Props) {
  const { courseId, assignmentId } = await params;

  let assignment: Assignment | null = null;
  try {
    const data = await import(`@/data/assignments/${assignmentId}.json`);
    assignment = data.default as Assignment;
  } catch {
    notFound();
  }

  if (!assignment) notFound();

  return (
    <div className="max-w-4xl mx-auto">
      <Breadcrumbs />

      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-800">{assignment.title}</h1>
            <p className="text-sm text-gray-500 mt-1">
              {assignment.type} • {assignment.category} • {assignment.totalMarks} marks total
            </p>
          </div>
          <Badge variant={getStatusColor(assignment.status)}>
            {assignment.status.replace("_", " ")}
          </Badge>
        </div>

        {assignment.scoredMarks !== undefined && (
          <div className="mt-4 bg-indigo-50 rounded-lg p-3 inline-block">
            <span className="text-sm text-indigo-600 font-medium">
              Score: {assignment.scoredMarks}/{assignment.totalMarks}
            </span>
          </div>
        )}
      </div>

      {/* Questions */}
      <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Questions ({assignment.questions.length})
        </h2>
        <div className="space-y-4">
          {assignment.questions.map((q) => (
            <div
              key={q.id}
              className="bg-white rounded-xl border border-gray-200 p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs font-medium text-gray-500">
                  Q{q.questionNumber} • {q.marks} mark{q.marks > 1 ? "s" : ""}
                </span>
                {q.scoredMarks !== undefined && (
                  <span
                    className={`text-xs font-bold ${
                      q.scoredMarks === q.marks
                        ? "text-green-600"
                        : q.scoredMarks === 0
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {q.scoredMarks}/{q.marks}
                  </span>
                )}
              </div>

              <p className="text-sm text-gray-800 mb-3 whitespace-pre-wrap">{q.text}</p>

              {/* Options for MCQ/MSQ */}
              {q.options && q.options.length > 0 && (
                <div className="space-y-2">
                  {q.options.map((opt) => {
                    const isSelected =
                      q.studentAnswer &&
                      (Array.isArray(q.studentAnswer)
                        ? q.studentAnswer.includes(opt.label)
                        : q.studentAnswer === opt.label);
                    const isCorrect = opt.isCorrect;

                    return (
                      <div
                        key={opt.id}
                        className={`flex items-start gap-2 p-2.5 rounded-lg border text-sm ${
                          isCorrect
                            ? "border-green-200 bg-green-50"
                            : isSelected
                            ? "border-red-200 bg-red-50"
                            : "border-gray-100 bg-gray-50"
                        }`}
                      >
                        <span className="font-medium text-gray-500 min-w-[1.5rem]">
                          {opt.label}.
                        </span>
                        <span className="text-gray-700">{opt.text}</span>
                        {isCorrect && <span className="ml-auto text-green-600">✓</span>}
                        {isSelected && !isCorrect && (
                          <span className="ml-auto text-red-500">✗</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Numerical answer */}
              {q.type === "numerical" && q.studentAnswer && (
                <div className="mt-2 p-2.5 rounded-lg bg-gray-50 border border-gray-100 text-sm">
                  <span className="text-gray-500">Your answer: </span>
                  <span className="font-medium text-gray-800">{q.studentAnswer}</span>
                  {q.correctAnswer && (
                    <>
                      <span className="text-gray-500 mx-2">|</span>
                      <span className="text-gray-500">Correct: </span>
                      <span className="font-medium text-green-700">{q.correctAnswer}</span>
                    </>
                  )}
                </div>
              )}

              {/* Explanation */}
              {q.explanation && (
                <div className="mt-3 p-3 rounded-lg bg-blue-50 border border-blue-100 text-xs text-blue-800">
                  <strong>Explanation:</strong> {q.explanation}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
