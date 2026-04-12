"use client";

import { SeekToolbar } from "@/components/seek/SeekToolbar";
import { SeekSidebar } from "@/components/seek/SeekSidebar";
import { useParams } from "next/navigation";
import coursesData from "@/data/courses.json";
import grpaData from "@/data/seek/grpa_data.json";

interface Question {
  questionNumber: number;
  text: string;
  points: number;
  type: string;
  options?: string[];
  correctAnswer?: string;
}

export default function PracticeAssignmentPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const weekNum = parseInt(params.weekNum as string);
  const course = coursesData.find((c) => c.id === courseId);

  const weekKey = `week${weekNum}` as keyof typeof grpaData.programming_in_python;
  const weekData = courseId === "programming_in_python"
    ? (grpaData.programming_in_python[weekKey] as { practice_assignment?: { title: string; questions: Question[] } } | undefined)
    : null;
  const practice = weekData?.practice_assignment;

  return (
    <div>
      <SeekToolbar courseName={course?.title || ""} />
      <div style={{ display: "flex" }}>
        <SeekSidebar courseId={courseId} />
        <main style={{ flex: 1, padding: "16px 24px", background: "#fafafa", minHeight: "calc(100vh - 64px)" }}>
          <h1 style={{ fontSize: 22, fontWeight: 400, color: "#212121", marginBottom: 4, marginTop: 8 }}>
            {practice?.title || `Week ${weekNum} | Practice Assignment`}
          </h1>
          <p style={{ fontSize: 13, color: "#7d8698", marginBottom: 24 }}>
            Non-graded — scores are not counted. Solution PDFs available after attempting.
          </p>

          {!practice || practice.questions.length === 0 ? (
            <div style={{ background: "white", border: "1px solid #e0e0e0", borderRadius: 4, padding: 32, textAlign: "center" }}>
              <p style={{ color: "#7d8698", fontSize: 14 }}>No practice questions loaded for this week.</p>
              <p style={{ color: "#9e9e9e", fontSize: 12, marginTop: 8 }}>Browse this week on the SEEK portal to capture the data.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {practice.questions.map((q, i) => (
                <MCQQuestion key={i} question={q} />
              ))}
              <div style={{ marginTop: 8 }}>
                <button style={{ background: "#1976d2", color: "white", border: "none", padding: "10px 24px", borderRadius: 4, fontSize: 14, fontWeight: 500, cursor: "pointer" }}>
                  Check Answers
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function MCQQuestion({ question: q }: { question: Question }) {
  return (
    <div style={{ background: "white", border: "1px solid #e0e0e0", borderRadius: 4, padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: "#7d8698" }}>Question {q.questionNumber}</span>
        <span style={{ fontSize: 12, color: "#7d8698" }}>{q.points} point{q.points > 1 ? "s" : ""}</span>
      </div>
      <p style={{ fontSize: 14, color: "#212121", lineHeight: 1.7, margin: "0 0 12px", whiteSpace: "pre-wrap" }}>
        {q.text}
      </p>
      {q.options && q.options.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {q.options.map((opt, j) => (
            <label key={j} style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "6px 10px", borderRadius: 4, border: "1px solid #e0e0e0", cursor: "pointer", fontSize: 13, color: "#424242" }}>
              <input type={q.type === "msq" ? "checkbox" : "radio"} name={`q${q.questionNumber}`} style={{ marginTop: 2, accentColor: "#1976d2" }} />
              <span>{opt}</span>
            </label>
          ))}
        </div>
      )}
      {q.type === "numerical" && (
        <input type="text" placeholder="Enter your answer" style={{ border: "1px solid #e0e0e0", borderRadius: 4, padding: "8px 12px", fontSize: 13, width: 200 }} />
      )}
    </div>
  );
}
