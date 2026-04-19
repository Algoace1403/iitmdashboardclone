import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Badge } from "@/components/ui/Badge";
import { getStatusColor } from "@/lib/utils";
import { notFound } from "next/navigation";
import type { Assignment } from "@/lib/types";
import { AssignmentQuestions } from "./AssignmentQuestions";

interface Props {
  params: Promise<{ courseId: string; assignmentId: string }>;
}

export default async function AssignmentPage({ params }: Props) {
  const { assignmentId } = await params;

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

      <AssignmentQuestions assignment={assignment} />
    </div>
  );
}
