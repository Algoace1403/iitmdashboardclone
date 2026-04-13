import Link from "next/link";

interface WeekData {
  week: number;
  assignment?: number | null;
  activity?: number | string | null;
  quiz?: number | null;
  grpas?: (number | string)[];
}

interface CourseData {
  id: string;
  code: string;
  title: string;
  status: string;
  program: string;
  allowedEndTerm?: boolean | null;
  coursePageUrl?: string;
  sctForOppe?: number;
  scores: {
    oppyEligible?: number;
    moduleGpaAverages?: { label: string; value: number }[];
    quizScores?: { label: string; value: number }[];
    activities?: { label: string; value: number }[];
  };
  weeks: WeekData[];
}

interface CourseCardProps {
  course: CourseData;
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <div style={{ background: "white", borderRadius: 10, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
      {/* Maroon header with dot pattern + corner gradient */}
      <div
        style={{
          background: `
            radial-gradient(ellipse at bottom left, rgba(0,0,0,0.25) 0%, transparent 60%),
            radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "100% 100%, 16px 16px",
          backgroundColor: "#aa3535",
          padding: "12px 14px",
          color: "white",
          minHeight: 90,
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
        }}
      >
        <h3 style={{ fontSize: 15, fontWeight: 700, fontStyle: "italic", lineHeight: 1.3, margin: 0 }}>
          {course.title}
        </h3>
        <p style={{ fontSize: 11, marginTop: 3, marginBottom: 0, color: "rgba(255,255,255,0.85)", fontStyle: "italic" }}>
          {course.status}
        </p>
        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.65)", marginTop: 6, marginBottom: 0 }}>
          {course.program}
        </p>
      </div>

      {/* Body: Scores */}
      <div style={{ padding: "8px 12px", fontSize: 11, color: "#525f7f", lineHeight: 1.6, maxHeight: 500, overflowY: "auto" }}>
        {/* OPPE Eligible */}
        {course.scores.oppyEligible !== undefined && (
          <p className="font-semibold text-[#32325d]">
            OPPE1_ELIGIBLE - {course.scores.oppyEligible.toFixed(2)}
          </p>
        )}

        {/* Module GPA Averages */}
        {course.scores.moduleGpaAverages?.map((m) => (
          <p key={m.label}>
            {m.label} - <span className="font-medium">{m.value.toFixed(2)}</span>
          </p>
        ))}

        {/* Week assignment scores */}
        {course.weeks.map((w) => (
          <div key={w.week}>
            {w.assignment !== undefined && w.assignment !== null ? (
              <p>
                Week {w.week} Assignment -{" "}
                <span className="font-medium">{w.assignment.toFixed(2)}</span>
              </p>
            ) : w.assignment === null ? (
              <p className="text-[#A7A7A7]">
                Week {w.week} Assignment - <span className="italic">Absent</span>
              </p>
            ) : null}

            {/* GrPA scores */}
            {w.grpas?.map((score, i) => (
              <p key={`grpa-${w.week}-${i}`} className="pl-2">
                Week {w.week} GrPA {i + 1} -{" "}
                <span className={typeof score === "string" ? "italic text-[#A7A7A7]" : "font-medium"}>
                  {typeof score === "number" ? score.toFixed(2) : score}
                </span>
              </p>
            ))}

            {/* Activity scores */}
            {w.activity !== undefined && w.activity !== null && (
              <p>
                Week {w.week} Activity -{" "}
                <span className={typeof w.activity === "string" ? "italic text-[#A7A7A7]" : "font-medium"}>
                  {typeof w.activity === "number" ? w.activity.toFixed(2) : w.activity}
                </span>
              </p>
            )}
          </div>
        ))}

        {/* SCT for OPPE */}
        {course.sctForOppe !== undefined && (
          <p className="mt-1">
            SCT for OPPE - <span className="font-medium">{course.sctForOppe.toFixed(2)}</span>
          </p>
        )}

        {/* Quiz scores */}
        {course.scores.quizScores?.map((q) => (
          <p key={q.label}>
            {q.label} - <span className="font-medium">{q.value.toFixed(2)}</span>
          </p>
        ))}

        {/* Allowed to take End Term */}
        {course.allowedEndTerm !== undefined && course.allowedEndTerm !== null && (
          <div className="mt-2 pt-2 border-t border-gray-100">
            <p className="font-semibold text-[#32325d]">Allowed to take End Term Exam?</p>
            <p>{course.allowedEndTerm ? "Yes" : "No"}</p>
          </div>
        )}

        {/* Course page link */}
        <div className="mt-2 pt-2 border-t border-gray-100">
          <Link href={`/courses/${course.id}`} className="text-[#aa3535] font-medium hover:underline">
            Go to Course page &gt;
          </Link>
        </div>
      </div>
    </div>
  );
}
