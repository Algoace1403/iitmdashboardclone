import { SeekLayout } from "@/components/seek/SeekLayout";
import { QuestionBlock } from "@/components/seek/QuestionBlock";
import coursesData from "@/data/courses.json";
import { notFound } from "next/navigation";
import type { Question } from "@/lib/types";

interface Props {
  params: Promise<{ courseId: string; weekNum: string }>;
}

export default async function ActivityQuestionsPage({ params }: Props) {
  const { courseId, weekNum } = await params;
  const course = coursesData.find((c) => c.id === courseId);
  if (!course) notFound();

  const weekNumber = parseInt(weekNum);
  let questions: Question[] = [];

  try {
    const data = await import(`@/data/seek/${courseId}.json`);
    const week = data.default.weeks?.find((w: { weekNumber: number }) => w.weekNumber === weekNumber);
    if (week?.activities) {
      questions = week.activities;
    }
  } catch { /* no data */ }

  return (
    <SeekLayout courseName={course.title} courseId={courseId}>
      <div>
          <div className="mb-6">
            <h1 className="text-xl font-medium text-[#212121]">
              Week {weekNumber} | Activity Questions
            </h1>
            <p className="text-sm text-[#7d8698] mt-1">
              Non-graded self-assessment. Scores NOT counted anywhere.
            </p>
          </div>

          {questions.length === 0 ? (
            <div className="bg-white border border-[#e0e0e0] rounded p-8 text-center">
              <p className="text-[#494f69] text-sm">No activity questions loaded yet.</p>
              <p className="text-[#7d8698] text-xs mt-2">Export your SEEK data to populate.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {questions.map((q) => (
                <QuestionBlock
                  key={q.id}
                  question={q}
                  courseId={courseId}
                  assignmentId={`week${weekNumber}-activity`}
                />
              ))}
            </div>
          )}
      </div>
    </SeekLayout>
  );
}
