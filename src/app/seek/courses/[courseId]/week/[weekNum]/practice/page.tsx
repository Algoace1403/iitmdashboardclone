"use client";

import { SeekLayout } from "@/components/seek/SeekLayout";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import coursesData from "@/data/courses.json";
import grpaData from "@/data/seek/grpa_data.json";
import rawAssignments from "@/data/seek/raw_assignments.json";
import { MathText } from "@/components/seek/MathText";
import { RawHtmlRenderer } from "@/components/seek/RawHtmlRenderer";

interface Question {
  questionNumber: number;
  text: string;
  points: number;
  type: string;
  options?: string[];
  correctAnswer?: string | string[];
}

export default function PracticeAssignmentPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const weekNum = parseInt(params.weekNum as string);
  const course = coursesData.find((c) => c.id === courseId);

  // Get parsed data (for interactive Check Answers)
  const weekKey = `week${weekNum}`;
  const courseData = (grpaData as Record<string, Record<string, unknown>>)[courseId];
  const weekData = courseData ? (courseData[weekKey] as { practice_assignment?: { title: string; questions: Question[] } } | undefined) : null;
  const practice = weekData?.practice_assignment;
  const hasGoodParsedData = practice && practice.questions.length > 0 && practice.questions.some(q => q.correctAnswer);

  // Get raw HTML (for Math courses with complex formulas)
  const courseRaw = (rawAssignments as Record<string, Record<string, string>>)[courseId] || {};
  let rawHtml = "";
  // Find practice assignment for this week
  Object.entries(courseRaw).forEach(([title, html]) => {
    const lower = title.toLowerCase();
    if (lower.includes("practice") && lower.includes("not graded") && !lower.includes("activity") && !lower.includes("extended")) {
      const weekMatch = title.match(/\d+/);
      if (weekMatch && parseInt(weekMatch[0]) === weekNum) rawHtml = html;
    }
  });
  // If no practice found, try to find any non-graded assignment matching this week
  if (!rawHtml) {
    Object.entries(courseRaw).forEach(([title, html]) => {
      const lower = title.toLowerCase();
      if (lower.includes("not graded") && !lower.includes("activity")) {
        const weekMatch = title.match(/\d+/);
        if (weekMatch && parseInt(weekMatch[0]) === weekNum) rawHtml = html;
      }
    });
  }

  // Use rendered HTML when it has actual rendered math (katex spans = properly captured)
  // For Python/English, prefer parsed interactive version with Check Answers
  const htmlHasRenderedMath = rawHtml.includes("katex") || rawHtml.includes("mjx-") || rawHtml.length > 100000;
  const useRawHtml = !!rawHtml && (htmlHasRenderedMath || !hasGoodParsedData);

  const [answers, setAnswers] = useState<Record<number, string | string[]>>({});
  const [checked, setChecked] = useState(false);

  // Load MathJax for raw HTML rendering
  useEffect(() => {
    if (!useRawHtml) return;
    if (typeof window !== "undefined" && !(window as unknown as Record<string, unknown>).MathJax) {
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.9/MathJax.js?config=TeX-AMS-MML_HTMLorMML";
      script.async = true;
      document.head.appendChild(script);
    }
  }, [useRawHtml]);

  function handleSelect(qNum: number, option: string, type: string) {
    if (checked) return;
    setAnswers((prev) => {
      if (type === "msq") {
        const current = (prev[qNum] as string[]) || [];
        return { ...prev, [qNum]: current.includes(option) ? current.filter((o) => o !== option) : [...current, option] };
      }
      return { ...prev, [qNum]: option };
    });
  }

  function isCorrect(q: Question): boolean | null {
    if (!checked) return null;
    const ans = answers[q.questionNumber];
    if (!ans || !q.correctAnswer) return null;
    if (Array.isArray(q.correctAnswer)) {
      if (!Array.isArray(ans)) return false;
      return q.correctAnswer.length === ans.length && q.correctAnswer.every((a) => ans.includes(a));
    }
    return ans === q.correctAnswer;
  }

  const totalPoints = practice?.questions.reduce((s, q) => s + q.points, 0) || 0;
  const scoredPoints = checked ? practice?.questions.reduce((s, q) => s + (isCorrect(q) === true ? q.points : 0), 0) || 0 : 0;

  return (
    <SeekLayout courseName={course?.title || ""} courseId={courseId}>
      <div style={{ fontFamily: "Roboto, 'Helvetica Neue', sans-serif" }}>
          <h1 style={{ fontSize: 22, fontWeight: 400, color: "rgba(0,0,0,0.87)", marginBottom: 4, marginTop: 8 }}>
            {practice?.title || `Week ${weekNum} | Practice Assignment`}
          </h1>
          <p style={{ fontSize: 13, color: "rgba(0,0,0,0.54)", marginBottom: 24 }}>
            Non-graded — scores are not counted.
          </p>

          {/* Raw HTML rendering for Math courses */}
          {useRawHtml ? (
            <RawHtmlRenderer
              html={rawHtml}
              courseId={courseId}
              assignmentId={`week${weekNum}-practice`}
            />
          ) : practice && practice.questions.length > 0 ? (
            /* Interactive parsed version with Check Answers */
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {checked && (
                <div style={{ background: scoredPoints === totalPoints ? "#e8f5e9" : "#fff3e0", border: `1px solid ${scoredPoints === totalPoints ? "#a5d6a7" : "#ffcc80"}`, borderRadius: 4, padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 15, fontWeight: 600, color: "#212121" }}>Score: {scoredPoints} / {totalPoints}</span>
                  <button onClick={() => { setAnswers({}); setChecked(false); }} style={{ background: "#7b1f1f", color: "#fff", border: "none", padding: "6px 16px", borderRadius: 4, fontSize: 13, cursor: "pointer" }}>Try Again</button>
                </div>
              )}
              {practice.questions.map((q) => {
                const correct = isCorrect(q);
                return (
                  <div key={q.questionNumber} style={{ background: "#fff", border: `1px solid ${checked ? (correct === true ? "#a5d6a7" : correct === false ? "#ef9a9a" : "rgba(0,0,0,0.12)") : "rgba(0,0,0,0.12)"}`, borderRadius: 4, padding: 20, boxShadow: "0px 2px 1px -1px rgba(0,0,0,.2), 0px 1px 1px 0px rgba(0,0,0,.14), 0px 1px 3px 0px rgba(0,0,0,.12)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(0,0,0,0.54)" }}>Question {q.questionNumber}</span>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        {checked && correct !== null && (
                          <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 10, background: correct ? "#e8f5e9" : "#fef3f2", color: correct ? "#2e7d32" : "#d32f2f" }}>
                            {correct ? "Correct" : "Incorrect"}
                          </span>
                        )}
                        <span style={{ fontSize: 12, color: "rgba(0,0,0,0.54)" }}>{q.points} point{q.points > 1 ? "s" : ""}</span>
                      </div>
                    </div>
                    <div style={{ fontSize: 14, color: "rgba(0,0,0,0.87)", lineHeight: "20px", marginBottom: 12 }}>
                      <MathText text={q.text} />
                    </div>
                    {q.options && q.options.length > 0 && (
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {q.options.map((opt, j) => {
                          const isSelected = q.type === "msq" ? ((answers[q.questionNumber] as string[]) || []).includes(opt) : answers[q.questionNumber] === opt;
                          const isCorrectOpt = checked && (Array.isArray(q.correctAnswer) ? q.correctAnswer.includes(opt) : q.correctAnswer === opt);
                          const isWrong = checked && isSelected && !isCorrectOpt;
                          return (
                            <label key={j} onClick={() => handleSelect(q.questionNumber, opt, q.type)} style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "8px 10px", borderRadius: 4, cursor: checked ? "default" : "pointer", fontSize: 14, color: "rgba(0,0,0,0.87)", border: `1px solid ${isCorrectOpt ? "#a5d6a7" : isWrong ? "#ef9a9a" : isSelected ? "#ff4081" : "rgba(0,0,0,0.12)"}`, background: isCorrectOpt ? "#e8f5e9" : isWrong ? "#fef3f2" : isSelected ? "#fce4ec" : "#fff" }}>
                              <input type={q.type === "msq" ? "checkbox" : "radio"} name={`q${q.questionNumber}`} checked={isSelected} readOnly style={{ marginTop: 2, accentColor: "#ff4081" }} />
                              <MathText text={opt} style={{ display: "inline" }} />
                            </label>
                          );
                        })}
                      </div>
                    )}
                    {q.type === "numerical" && (
                      <input type="text" value={(answers[q.questionNumber] as string) || ""} onChange={e => { if (!checked) setAnswers(prev => ({ ...prev, [q.questionNumber]: e.target.value })); }} placeholder="Enter your answer" readOnly={checked} style={{ border: "1px solid rgba(0,0,0,0.12)", borderRadius: 4, padding: "8px 12px", fontSize: 14, width: 200 }} />
                    )}
                    {checked && q.correctAnswer && (
                      <div style={{ marginTop: 12, padding: 12, background: correct ? "#e8f5e9" : "#fff3e0", borderRadius: 4, borderLeft: `3px solid ${correct ? "#2e7d32" : "#e65100"}` }}>
                        <p style={{ fontSize: 13, color: correct ? "#2e7d32" : "#e65100", margin: 0, fontWeight: 500 }}>
                          {correct ? "Yes, the answer is correct." : "No, the answer is incorrect."}
                        </p>
                        <p style={{ fontSize: 12, color: "rgba(0,0,0,0.6)", margin: "4px 0 0" }}>Score: {correct ? q.points : 0}</p>
                        <p style={{ fontSize: 13, fontWeight: 600, color: "rgba(0,0,0,0.7)", margin: "8px 0 4px" }}>Accepted Answers:</p>
                        {Array.isArray(q.correctAnswer) ? q.correctAnswer.map((ans: string, ai: number) => (
                          <p key={ai} style={{ fontSize: 13, color: "#2e7d32", margin: "2px 0" }}><MathText text={ans} style={{ display: "inline" }} /></p>
                        )) : (
                          <p style={{ fontSize: 13, color: "#2e7d32", margin: "2px 0" }}><MathText text={String(q.correctAnswer)} style={{ display: "inline" }} /></p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
              <div style={{ marginTop: 8, display: "flex", gap: 12, alignItems: "center" }}>
                {!checked ? (
                  <button onClick={() => setChecked(true)} style={{ background: "#7b1f1f", color: "#fff", border: "none", padding: "10px 24px", borderRadius: 4, fontSize: 14, fontWeight: 500, cursor: "pointer" }}>Check Answers</button>
                ) : (
                  <button onClick={() => { setAnswers({}); setChecked(false); }} style={{ background: "#7b1f1f", color: "#fff", border: "none", padding: "10px 24px", borderRadius: 4, fontSize: 14, fontWeight: 500, cursor: "pointer" }}>Try Again</button>
                )}
                {checked && practice.questions.every(q => !q.correctAnswer) && (
                  <span style={{ fontSize: 13, color: "#e65100", fontStyle: "italic" }}>Answer key not available for this assignment</span>
                )}
              </div>
            </div>
          ) : (
            <div style={{ background: "#fff", borderRadius: 4, padding: 32, textAlign: "center" }}>
              <p style={{ color: "rgba(0,0,0,0.54)", fontSize: 14 }}>No practice questions loaded for this week.</p>
            </div>
          )}
      </div>
    </SeekLayout>
  );
}
