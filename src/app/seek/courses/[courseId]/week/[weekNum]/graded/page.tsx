"use client";

import { SeekLayout } from "@/components/seek/SeekLayout";
import { useState } from "react";
import { useParams } from "next/navigation";
import coursesData from "@/data/courses.json";
import seekPythonData from "@/data/seek/programming_in_python.json";
import seekEnglishData from "@/data/seek/english_2.json";
import seekMathData from "@/data/seek/mathematics_for_data_science_2.json";
import seekStatsData from "@/data/seek/statistics_for_data_science_2.json";
import grpaData from "@/data/seek/grpa_data.json";
import rawAssignments from "@/data/seek/raw_assignments.json";
import { MathText } from "@/components/seek/MathText";
import { RawHtmlRenderer } from "@/components/seek/RawHtmlRenderer";

const seekCourseMap: Record<string, typeof seekPythonData> = {
  programming_in_python: seekPythonData,
  english_2: seekEnglishData as unknown as typeof seekPythonData,
  mathematics_for_data_science_2: seekMathData as unknown as typeof seekPythonData,
  statistics_for_data_science_2: seekStatsData as unknown as typeof seekPythonData,
};

type Tab = "Overview" | "Question" | "Test Cases" | "Solution";

interface GrpaInfo {
  id?: number;
  title?: string;
  type?: string;
  dueDate?: string;
  deadlinePassed?: boolean;
  score?: number;
  totalScore?: number;
  maxScore?: number;
  publicTests?: { passed: number; total: number };
  privateTests?: { passed: number; total: number };
  publicTestCases?: { input: string; output: string }[];
  submittedAt?: string;
  codeTemplate?: string;
  savedCode?: string;
  description?: string;
  difficulty?: string;
}

export default function GradedAssignmentPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const weekNum = parseInt(params.weekNum as string);
  const course = coursesData.find((c) => c.id === courseId);
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const [selectedAssignment, setSelectedAssignment] = useState(0);
  const [mcqAnswers, setMcqAnswers] = useState<Record<number, string | string[]>>({});
  const [mcqChecked, setMcqChecked] = useState(false);

  // MathJax loading handled by RawHtmlRenderer component

  const seekData = seekCourseMap[courseId] || null;
  const weekData = seekData?.weeks?.find((w) => w.weekNumber === weekNum);

  // Separate MCQ graded quiz from programming GrPAs
  const allGradedItems = weekData?.items?.filter((i) => i.graded) || [];
  const mcqGradedItem = allGradedItems.find((i) => i.type === "Assignment");
  const programmingItems = allGradedItems.filter((i) => i.type === "Programming Assignment");

  // Get GrPA detail data — works for any course
  const weekKey = `week${weekNum}`;
  const courseGrpaData = (grpaData as Record<string, Record<string, unknown>>)[courseId] || null;
  const weekGrpaObj = courseGrpaData ? (courseGrpaData[weekKey] as { grpa?: GrpaInfo[]; graded_assignment?: { title: string; questions: unknown[] } } | undefined) : null;
  const grpaArray = weekGrpaObj?.grpa || [];

  // Build unified sidebar list: MCQ quiz first (if exists), then GrPAs
  const sidebarItems: { title: string; type: "mcq" | "grpa"; grpaIndex?: number }[] = [];
  if (mcqGradedItem) {
    sidebarItems.push({ title: mcqGradedItem.title, type: "mcq" });
  }
  // Use programming items from structure file, or fall back to grpaArray titles
  if (programmingItems.length > 0) {
    programmingItems.forEach((item, i) => {
      sidebarItems.push({ title: item.title, type: "grpa", grpaIndex: i });
    });
  } else if (grpaArray.length > 0) {
    grpaArray.forEach((g, i) => {
      sidebarItems.push({ title: g.title || `GrPA ${i + 1}`, type: "grpa", grpaIndex: i });
    });
  }

  const currentSidebarItem = sidebarItems[selectedAssignment];
  const currentGrpa = currentSidebarItem?.type === "grpa" && currentSidebarItem.grpaIndex !== undefined
    ? grpaArray[currentSidebarItem.grpaIndex] || null
    : null;
  const isMcqView = currentSidebarItem?.type === "mcq";

  const tabs: Tab[] = ["Overview", "Question", "Test Cases", "Solution"];

  return (
    <SeekLayout courseName={course?.title || ""} courseId={courseId}>
        <div style={{ display: "flex", flex: 1, minHeight: "calc(100vh - 64px)" }}>
          {/* Assignment list sub-sidebar */}
          <div style={{ width: 260, background: "#ffffff", borderRight: "1px solid rgba(0,0,0,0.12)", overflowY: "auto", flexShrink: 0, fontFamily: "Roboto, 'Helvetica Neue', sans-serif" }}>
            <div style={{ padding: "12px 16px", borderBottom: "1px solid rgba(0,0,0,0.12)" }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: "rgba(0,0,0,0.87)", margin: 0 }}>
                Week {weekNum} Assignments
              </p>
            </div>
            {sidebarItems.map((item, i) => (
              <div
                key={i}
                onClick={() => { setSelectedAssignment(i); setActiveTab("Overview"); setMcqAnswers({}); setMcqChecked(false); }}
                style={{
                  padding: "10px 16px",
                  borderBottom: "1px solid rgba(0,0,0,0.06)",
                  cursor: "pointer",
                  background: selectedAssignment === i ? "#f0f0ff" : "transparent",
                  borderLeft: selectedAssignment === i ? "3px solid #7b1f1f" : "3px solid transparent",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {/* Green tick for completed (weeks 1-8) */}
                  {weekNum <= 8 ? (
                    <svg style={{ width: 14, height: 14, flexShrink: 0 }} viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" fill="#4caf50" />
                      <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <div style={{
                      width: 10, height: 10, borderRadius: "50%",
                      background: selectedAssignment === i ? "#e6a817" : "#bdbdbd",
                      flexShrink: 0,
                    }} />
                  )}
                  <div>
                    <p style={{ fontSize: 12, color: "rgba(0,0,0,0.87)", margin: 0, fontWeight: selectedAssignment === i ? 500 : 400 }}>
                      {item.title}
                    </p>
                    <p style={{ fontSize: 10, color: item.type === "mcq" ? "#ef6c00" : "#00897b", margin: "2px 0 0" }}>
                      {item.type === "mcq" ? "Assignment" : "Programming Assignment"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Main content */}
          <div style={{ flex: 1, background: "#fafafa", minWidth: 0 }}>
            {/* Tabs -- mat-tab: 48px height, 2px indicator #7b1f1f, Roboto 14px/500 */}
            <div style={{
              display: "flex",
              borderBottom: "1px solid rgba(0,0,0,0.12)",
              background: "#ffffff",
              height: 48,
              fontFamily: "Roboto, 'Helvetica Neue', sans-serif",
            }}>
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: "0 24px",
                    height: 48,
                    fontSize: 14,
                    fontWeight: 500,
                    letterSpacing: "0.0892857em",
                    color: activeTab === tab ? "#7b1f1f" : "rgba(0,0,0,0.54)",
                    background: "none",
                    border: "none",
                    borderBottom: activeTab === tab ? "2px solid #7b1f1f" : "2px solid transparent",
                    cursor: "pointer",
                    marginBottom: -1,
                    fontFamily: "Roboto, 'Helvetica Neue', sans-serif",
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div style={{ padding: 24, fontFamily: "Roboto, 'Helvetica Neue', sans-serif" }}>
              {/* Title area */}
              <h2 style={{ fontSize: 18, fontWeight: 500, color: "rgba(0,0,0,0.87)", margin: "0 0 4px" }}>
                {isMcqView
                  ? currentSidebarItem?.title || `Week ${weekNum} Graded Assignment`
                  : currentGrpa?.title || currentSidebarItem?.title || `Week ${weekNum} Graded Assignment`}
              </h2>
              <p style={{ fontSize: 13, color: "rgba(0,0,0,0.54)", margin: "0 0 4px" }}>
                {isMcqView ? "Assignment" : "Programming Assignment"}
              </p>
              {!isMcqView && currentGrpa?.deadlinePassed && (
                <p style={{ fontSize: 12, color: "#d32f2f", margin: "0 0 4px", fontStyle: "italic" }}>
                  Submission deadline has passed for this assignment
                </p>
              )}
              <p style={{ fontSize: 13, color: "rgba(0,0,0,0.54)", margin: "0 0 24px" }}>
                {isMcqView ? "" : (currentGrpa?.dueDate || "")}
              </p>

              {/* ──── MCQ VIEW — render raw HTML from SEEK API ──── */}
              {isMcqView && (() => {
                // Find the raw HTML for this graded assignment
                const courseRaw = (rawAssignments as Record<string, Record<string, string>>)[courseId] || {};
                let gradedHtml = "";
                Object.entries(courseRaw).forEach(([title, html]) => {
                  const lower = title.toLowerCase();
                  const isGraded = lower.includes("graded") && !lower.includes("not graded") && !lower.includes("practice");
                  const weekMatch = title.match(/\d+/);
                  const titleWeek = weekMatch ? parseInt(weekMatch[0]) : 0;
                  if (isGraded && titleWeek === weekNum) gradedHtml = html;
                });

                // Also try activity questions
                if (!gradedHtml) {
                  Object.entries(courseRaw).forEach(([title, html]) => {
                    const weekMatch = title.match(/\d+/);
                    const titleWeek = weekMatch ? parseInt(weekMatch[0]) : 0;
                    if (title.toLowerCase().includes("graded") && titleWeek === weekNum) gradedHtml = html;
                  });
                }

                // Fallback to old parsed data if no raw HTML
                const mcqData = weekGrpaObj?.graded_assignment;
                const questions = (mcqData?.questions || []) as { questionNumber: number; text: string; points: number; type: string; options?: string[]; correctAnswer?: string | string[] }[];

                const totalPts = questions.reduce((s, q) => s + q.points, 0);
                const scoredPts = mcqChecked
                  ? questions.reduce((s, q) => {
                      const ans = mcqAnswers[q.questionNumber];
                      if (!ans || !q.correctAnswer) return s;
                      if (Array.isArray(q.correctAnswer)) {
                        if (!Array.isArray(ans)) return s;
                        return s + (q.correctAnswer.length === ans.length && q.correctAnswer.every(a => ans.includes(a)) ? q.points : 0);
                      }
                      return s + (ans === q.correctAnswer ? q.points : 0);
                    }, 0)
                  : 0;

                function handleMcqSelect(qNum: number, opt: string, type: string) {
                  if (mcqChecked) return;
                  setMcqAnswers(prev => {
                    if (type === "msq") {
                      const cur = (prev[qNum] as string[]) || [];
                      return { ...prev, [qNum]: cur.includes(opt) ? cur.filter(o => o !== opt) : [...cur, opt] };
                    }
                    return { ...prev, [qNum]: opt };
                  });
                }

                function isQCorrect(q: { correctAnswer?: string | string[] }, qNum: number): boolean | null {
                  if (!mcqChecked) return null;
                  const ans = mcqAnswers[qNum];
                  if (!ans || !q.correctAnswer) return null;
                  if (Array.isArray(q.correctAnswer)) {
                    if (!Array.isArray(ans)) return false;
                    return q.correctAnswer.length === ans.length && q.correctAnswer.every(a => ans.includes(a));
                  }
                  return ans === q.correctAnswer;
                }

                // If we have raw HTML, render it directly (100% accurate)
                if (gradedHtml) {
                  return <RawHtmlRenderer html={gradedHtml} />;
                }

                // Fallback: parsed questions with Check Answers
                return (
                  <div>
                    {mcqChecked && (
                      <div style={{
                        background: scoredPts === totalPts ? "#e8f5e9" : "#fff3e0",
                        border: `1px solid ${scoredPts === totalPts ? "#a5d6a7" : "#ffcc80"}`,
                        borderRadius: 4, padding: "12px 16px", marginBottom: 20,
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                      }}>
                        <span style={{ fontSize: 15, fontWeight: 600, color: "#212121" }}>
                          Score: {scoredPts} / {totalPts}
                        </span>
                        <button onClick={() => { setMcqAnswers({}); setMcqChecked(false); }}
                          style={{ background: "#7b1f1f", color: "#fff", border: "none", padding: "6px 16px", borderRadius: 4, fontSize: 13, cursor: "pointer" }}>
                          Try Again
                        </button>
                      </div>
                    )}

                    {questions.length === 0 ? (
                      <p style={{ fontSize: 13, color: "rgba(0,0,0,0.54)" }}>No MCQ questions loaded for this week.</p>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        {questions.map((q) => {
                          const correct = isQCorrect(q, q.questionNumber);
                          return (
                            <div key={q.questionNumber} style={{
                              background: "#fff", borderRadius: 4, padding: 16,
                              border: `1px solid ${mcqChecked ? (correct === true ? "#a5d6a7" : correct === false ? "#ef9a9a" : "rgba(0,0,0,0.12)") : "rgba(0,0,0,0.12)"}`,
                              boxShadow: "0px 1px 3px rgba(0,0,0,0.12)",
                            }}>
                              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                                <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(0,0,0,0.54)" }}>Question {q.questionNumber}</span>
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                  {mcqChecked && correct !== null && (
                                    <span style={{
                                      fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 10,
                                      background: correct ? "#e8f5e9" : "#fef3f2",
                                      color: correct ? "#2e7d32" : "#d32f2f",
                                    }}>
                                      {correct ? "Correct" : "Incorrect"}
                                    </span>
                                  )}
                                  <span style={{ fontSize: 12, color: "rgba(0,0,0,0.54)" }}>{q.points} pt{q.points > 1 ? "s" : ""}</span>
                                </div>
                              </div>
                              <div style={{ fontSize: 14, color: "rgba(0,0,0,0.87)", lineHeight: "20px", margin: "0 0 10px" }}><MathText text={q.text} /></div>
                              {q.options && q.options.length > 0 && (
                                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                                  {q.options.map((opt, j) => {
                                    const isSelected = q.type === "msq"
                                      ? ((mcqAnswers[q.questionNumber] as string[]) || []).includes(opt)
                                      : mcqAnswers[q.questionNumber] === opt;
                                    const isCorrectOpt = mcqChecked && (
                                      Array.isArray(q.correctAnswer) ? q.correctAnswer.includes(opt) : q.correctAnswer === opt
                                    );
                                    const isWrong = mcqChecked && isSelected && !isCorrectOpt;
                                    return (
                                      <label key={j} onClick={() => handleMcqSelect(q.questionNumber, opt, q.type)}
                                        style={{
                                          display: "flex", alignItems: "flex-start", gap: 8,
                                          padding: "8px 10px", borderRadius: 4, cursor: mcqChecked ? "default" : "pointer",
                                          fontSize: 13, color: "rgba(0,0,0,0.87)",
                                          border: `1px solid ${isCorrectOpt ? "#a5d6a7" : isWrong ? "#ef9a9a" : isSelected ? "#ff4081" : "rgba(0,0,0,0.12)"}`,
                                          background: isCorrectOpt ? "#e8f5e9" : isWrong ? "#fef3f2" : isSelected ? "#fce4ec" : "#fff",
                                        }}>
                                        <input type={q.type === "msq" ? "checkbox" : "radio"} name={`mcq_g_${q.questionNumber}`}
                                          checked={isSelected} readOnly style={{ marginTop: 2, accentColor: "#ff4081" }} />
                                        <MathText text={opt} style={{ display: "inline" }} />
                                        {mcqChecked && isCorrectOpt && (
                                          <svg style={{ width: 16, height: 16, color: "#2e7d32", marginLeft: "auto", flexShrink: 0 }} fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                          </svg>
                                        )}
                                        {mcqChecked && isWrong && (
                                          <svg style={{ width: 16, height: 16, color: "#d32f2f", marginLeft: "auto", flexShrink: 0 }} fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                          </svg>
                                        )}
                                      </label>
                                    );
                                  })}
                                </div>
                              )}
                              {q.type === "numerical" && (
                                <input type="text" value={(mcqAnswers[q.questionNumber] as string) || ""}
                                  onChange={e => { if (!mcqChecked) setMcqAnswers(prev => ({ ...prev, [q.questionNumber]: e.target.value })); }}
                                  placeholder="Enter your answer" readOnly={mcqChecked}
                                  style={{ border: "1px solid rgba(0,0,0,0.12)", borderRadius: 4, padding: "8px 12px", fontSize: 14, width: 200 }} />
                              )}
                              {mcqChecked && q.correctAnswer && (
                                <div style={{ marginTop: 12, padding: 12, background: correct ? "#e8f5e9" : "#fff3e0", borderRadius: 4, borderLeft: `3px solid ${correct ? "#2e7d32" : "#e65100"}` }}>
                                  <p style={{ fontSize: 13, color: correct ? "#2e7d32" : "#e65100", margin: 0, fontWeight: 500 }}>
                                    {correct ? "Yes, the answer is correct." : "No, the answer is incorrect."}
                                  </p>
                                  <p style={{ fontSize: 12, color: "rgba(0,0,0,0.6)", margin: "4px 0 0" }}>
                                    Score: {correct ? q.points : 0}
                                  </p>
                                  <p style={{ fontSize: 13, fontWeight: 600, color: "rgba(0,0,0,0.7)", margin: "8px 0 4px" }}>
                                    Accepted Answers:
                                  </p>
                                  {Array.isArray(q.correctAnswer) ? (
                                    q.correctAnswer.map((ans, ai) => (
                                      <div key={ai} style={{ fontSize: 13, color: "#2e7d32", margin: "2px 0" }}><MathText text={ans} style={{ display: "inline" }} /></div>
                                    ))
                                  ) : (
                                    <div style={{ fontSize: 13, color: "#2e7d32", margin: "2px 0" }}><MathText text={String(q.correctAnswer)} style={{ display: "inline" }} /></div>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                        <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 16 }}>
                          {!mcqChecked ? (
                            <button onClick={() => setMcqChecked(true)}
                              style={{ background: "#7b1f1f", color: "#fff", border: "none", padding: "10px 24px", borderRadius: 4, fontSize: 14, fontWeight: 500, cursor: "pointer" }}>
                              Check Answers
                            </button>
                          ) : (
                            <button onClick={() => { setMcqAnswers({}); setMcqChecked(false); }}
                              style={{ background: "#7b1f1f", color: "#fff", border: "none", padding: "10px 24px", borderRadius: 4, fontSize: 14, fontWeight: 500, cursor: "pointer" }}>
                              Try Again
                            </button>
                          )}
                          {mcqChecked && questions.every(q => !q.correctAnswer) && (
                            <span style={{ fontSize: 13, color: "#e65100", fontStyle: "italic" }}>
                              Answer key not available for this assignment
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* ──── OVERVIEW TAB (GrPA only) ──── */}
              {!isMcqView && activeTab === "Overview" && (
                <div>
                  <div style={{ marginBottom: 24 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 600, color: "#212121", margin: "0 0 8px" }}>Instructions</h3>
                    <ul style={{ fontSize: 13, color: "#494f69", lineHeight: 1.8, paddingLeft: 20, margin: 0 }}>
                      <li>Use &quot;Test Run&quot; to verify your code with public test cases.</li>
                      <li>Press &quot;Submit&quot; to have your assignment evaluated.</li>
                      <li>You can submit your assignment multiple times up until the deadline.</li>
                      <li>Make sure to submit your final code by the deadline to receive your score.</li>
                    </ul>
                  </div>

                  {/* Score Circle */}
                  <div style={{ marginBottom: 24 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 600, color: "#212121", margin: "0 0 16px" }}>Summary</h3>
                    <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
                      <div style={{ position: "relative", width: 120, height: 120 }}>
                        <svg viewBox="0 0 120 120" style={{ width: 120, height: 120 }}>
                          <circle cx="60" cy="60" r="50" fill="none" stroke="#e0e0e0" strokeWidth="8" />
                          <circle
                            cx="60" cy="60" r="50" fill="none"
                            stroke={(currentGrpa?.score ?? 0) >= 50 ? "#4caf50" : "#ff9800"}
                            strokeWidth="8"
                            strokeDasharray={`${2 * Math.PI * 50}`}
                            strokeDashoffset={`${2 * Math.PI * 50 * (1 - (currentGrpa?.score || 0) / (currentGrpa?.maxScore || currentGrpa?.totalScore || 100))}`}
                            strokeLinecap="round"
                            transform="rotate(-90 60 60)"
                          />
                        </svg>
                        <div style={{
                          position: "absolute", top: 0, left: 0, width: 120, height: 120,
                          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                        }}>
                          <span style={{ fontSize: 28, fontWeight: 700, color: "#212121" }}>{currentGrpa?.score ?? "—"}</span>
                          <span style={{ fontSize: 11, color: "#9e9e9e" }}>out of {currentGrpa?.totalScore ?? 100}</span>
                        </div>
                      </div>
                      <span style={{ fontSize: 14, color: "#9e9e9e", fontWeight: 500 }}>Score</span>
                    </div>
                  </div>

                  {currentGrpa?.publicTests && (
                    <TestSection title="Public Tests" passed={currentGrpa.publicTests.passed} total={currentGrpa.publicTests.total} submittedAt={currentGrpa.submittedAt || ""} />
                  )}
                  {currentGrpa?.privateTests && (
                    <TestSection title="Private Tests" passed={currentGrpa.privateTests.passed} total={currentGrpa.privateTests.total} submittedAt={currentGrpa.submittedAt || ""} />
                  )}
                </div>
              )}

              {/* ──── QUESTION TAB (GrPA only) ──── */}
              {!isMcqView && activeTab === "Question" && (() => {
                const codeText = currentGrpa?.savedCode || currentGrpa?.codeTemplate || "# No code available\n# Export this assignment from the SEEK portal to see the actual code";
                const codeLines = codeText.replace(/\r\n/g, "\n").split("\n");
                const testCases = currentGrpa?.publicTestCases || [];
                const descriptionText = currentGrpa?.description || "";

                return (
                  <div style={{ display: "flex", gap: 0, height: "calc(100vh - 280px)", minHeight: 500 }}>
                    {/* Left panel — Problem Description */}
                    <div style={{
                      flex: "0 0 40%",
                      background: "white",
                      border: "1px solid #e0e0e0",
                      borderRadius: "4px 0 0 4px",
                      overflowY: "auto",
                      display: "flex",
                      flexDirection: "column",
                    }}>
                      {/* Description header */}
                      <div style={{
                        padding: "10px 16px",
                        borderBottom: "1px solid #e0e0e0",
                        background: "#f5f5f5",
                        flexShrink: 0,
                      }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: "#212121" }}>Problem Description</span>
                      </div>

                      {/* Description body */}
                      <div style={{ padding: 16, flex: 1, overflowY: "auto" }}>
                        {descriptionText ? (
                          /<[a-z][\s\S]*>/i.test(descriptionText) ? (
                            <div
                              style={{ fontSize: 13, color: "#333", lineHeight: 1.7, wordBreak: "break-word" }}
                              dangerouslySetInnerHTML={{ __html: descriptionText }}
                            />
                          ) : (
                            <pre style={{
                              fontSize: 13,
                              color: "#333",
                              lineHeight: 1.7,
                              whiteSpace: "pre-wrap",
                              wordBreak: "break-word",
                              fontFamily: "inherit",
                              margin: 0,
                            }}>
                              {descriptionText}
                            </pre>
                          )
                        ) : (
                          <p style={{ fontSize: 13, color: "#9e9e9e" }}>No description available.</p>
                        )}

                        {/* Public Test Cases table */}
                        {testCases.length > 0 && (
                          <div style={{ marginTop: 24 }}>
                            <h4 style={{ fontSize: 14, fontWeight: 600, color: "#212121", margin: "0 0 12px" }}>
                              Public Test Cases
                            </h4>
                            <table style={{
                              width: "100%",
                              borderCollapse: "collapse",
                              fontSize: 12,
                              fontFamily: "'Roboto Mono', 'Courier New', monospace",
                            }}>
                              <thead>
                                <tr>
                                  <th style={{ textAlign: "left", padding: "8px 10px", background: "#f5f5f5", borderBottom: "2px solid #e0e0e0", color: "#616161", fontWeight: 600, fontSize: 11 }}>#</th>
                                  <th style={{ textAlign: "left", padding: "8px 10px", background: "#f5f5f5", borderBottom: "2px solid #e0e0e0", color: "#616161", fontWeight: 600, fontSize: 11 }}>Input</th>
                                  <th style={{ textAlign: "left", padding: "8px 10px", background: "#f5f5f5", borderBottom: "2px solid #e0e0e0", color: "#616161", fontWeight: 600, fontSize: 11 }}>Expected Output</th>
                                </tr>
                              </thead>
                              <tbody>
                                {testCases.map((tc, idx) => (
                                  <tr key={idx}>
                                    <td style={{ padding: "6px 10px", borderBottom: "1px solid #eee", color: "#757575", verticalAlign: "top" }}>{idx + 1}</td>
                                    <td style={{ padding: "6px 10px", borderBottom: "1px solid #eee", color: "#333", whiteSpace: "pre-wrap", verticalAlign: "top" }}>{tc.input}</td>
                                    <td style={{ padding: "6px 10px", borderBottom: "1px solid #eee", color: "#333", whiteSpace: "pre-wrap", verticalAlign: "top" }}>{tc.output}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right panel — Code Editor */}
                    <div style={{
                      flex: "0 0 60%",
                      background: "#1e1e1e",
                      borderRadius: "0 4px 4px 0",
                      display: "flex",
                      flexDirection: "column",
                      overflow: "hidden",
                    }}>
                      {/* Editor toolbar */}
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "8px 16px",
                        background: "#2d2d2d",
                        borderBottom: "1px solid #404040",
                        flexShrink: 0,
                      }}>
                        <div style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          background: "#3c3c3c",
                          padding: "4px 10px",
                          borderRadius: 3,
                        }}>
                          <span style={{ fontSize: 12, color: "#cccccc", fontWeight: 500 }}>Python3</span>
                          <span style={{ fontSize: 10, color: "#888", marginLeft: 2 }}>&#9662;</span>
                        </div>
                        <div style={{ display: "flex", gap: 8 }}>
                          <button style={{
                            background: "#0e639c",
                            color: "white",
                            border: "none",
                            padding: "6px 16px",
                            borderRadius: 3,
                            fontSize: 12,
                            fontWeight: 500,
                            cursor: "pointer",
                          }}>
                            Test Run
                          </button>
                          <button style={{
                            background: "#4caf50",
                            color: "white",
                            border: "none",
                            padding: "6px 16px",
                            borderRadius: 3,
                            fontSize: 12,
                            fontWeight: 500,
                            cursor: "pointer",
                          }}>
                            Submit
                          </button>
                        </div>
                      </div>

                      {/* Code area with line numbers */}
                      <div style={{ flex: 1, overflowY: "auto", overflowX: "auto" }}>
                        <table style={{
                          borderCollapse: "collapse",
                          width: "100%",
                          fontFamily: "'Roboto Mono', 'Courier New', monospace",
                          fontSize: 13,
                          lineHeight: 1.6,
                        }}>
                          <tbody>
                            {codeLines.map((line, idx) => (
                              <tr key={idx}>
                                <td style={{
                                  width: 48,
                                  minWidth: 48,
                                  textAlign: "right",
                                  paddingRight: 12,
                                  paddingLeft: 8,
                                  color: "#858585",
                                  userSelect: "none",
                                  verticalAlign: "top",
                                  borderRight: "1px solid #333",
                                  background: "#1e1e1e",
                                }}>
                                  {idx + 1}
                                </td>
                                <td style={{
                                  paddingLeft: 16,
                                  color: "#d4d4d4",
                                  whiteSpace: "pre",
                                }}>
                                  {line || "\u00A0"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* ──── TEST CASES TAB (GrPA only) ──── */}
              {!isMcqView && activeTab === "Test Cases" && (
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 600, color: "#212121", margin: "0 0 16px" }}>Public Test Cases</h3>
                  {currentGrpa?.publicTestCases && currentGrpa.publicTestCases.length > 0 ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      {currentGrpa.publicTestCases.map((tc, i) => (
                        <div key={i} style={{ background: "#ffffff", borderRadius: 4, padding: 16, boxShadow: "0px 2px 1px -1px rgba(0,0,0,.2), 0px 1px 1px 0px rgba(0,0,0,.14), 0px 1px 3px 0px rgba(0,0,0,.12)" }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                            <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(0,0,0,0.87)" }}>Test Case {i + 1}</span>
                            <span style={{
                              fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 10,
                              background: "#e8f5e9", color: "#2e7d32",
                            }}>
                              Passed
                            </span>
                          </div>
                          <div style={{ display: "flex", gap: 16 }}>
                            <div style={{ flex: 1 }}>
                              <p style={{ fontSize: 11, color: "#9e9e9e", margin: "0 0 4px", fontWeight: 500 }}>Input</p>
                              <pre style={{ background: "#f5f5f5", borderRadius: 4, padding: 8, fontSize: 12, fontFamily: "monospace", color: "#424242", margin: 0, whiteSpace: "pre-wrap" }}>
                                {tc.input}
                              </pre>
                            </div>
                            <div style={{ flex: 1 }}>
                              <p style={{ fontSize: 11, color: "#9e9e9e", margin: "0 0 4px", fontWeight: 500 }}>Expected Output</p>
                              <pre style={{ background: "#f5f5f5", borderRadius: 4, padding: 8, fontSize: 12, fontFamily: "monospace", color: "#424242", margin: 0, whiteSpace: "pre-wrap" }}>
                                {tc.output}
                              </pre>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ fontSize: 13, color: "#7d8698" }}>No public test cases available for this assignment.</p>
                  )}

                  <h3 style={{ fontSize: 15, fontWeight: 600, color: "#212121", margin: "24px 0 16px" }}>Private Test Cases</h3>
                  <p style={{ fontSize: 13, color: "#7d8698" }}>
                    {currentGrpa?.privateTests ? `${currentGrpa.privateTests.passed}/${currentGrpa.privateTests.total} Passed` : "Not available"}
                  </p>
                </div>
              )}

              {/* ──── SOLUTION TAB (GrPA only) ──── */}
              {!isMcqView && activeTab === "Solution" && (
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 600, color: "#212121", margin: "0 0 16px" }}>Solution</h3>
                  {currentGrpa?.savedCode || currentGrpa?.codeTemplate ? (
                    <div style={{ background: "#1e1e1e", borderRadius: 4, overflow: "hidden" }}>
                      <div style={{ padding: "8px 16px", background: "#2d2d2d", borderBottom: "1px solid #404040" }}>
                        <span style={{ fontSize: 13, color: "#cccccc", fontWeight: 500 }}>Python3 — Your Submission</span>
                      </div>
                      <pre style={{ margin: 0, padding: 16, fontSize: 13, lineHeight: 1.6, color: "#d4d4d4", fontFamily: "'Roboto Mono', 'Courier New', monospace", overflowX: "auto", whiteSpace: "pre" }}>
                        {currentGrpa?.savedCode || currentGrpa?.codeTemplate}
                      </pre>
                    </div>
                  ) : (
                    <p style={{ fontSize: 13, color: "#7d8698" }}>Solution available after deadline. Export from SEEK to populate.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
    </SeekLayout>
  );
}

function TestSection({ title, passed, total, submittedAt }: {
  title: string; passed: number; total: number; submittedAt: string;
}) {
  return (
    <div style={{ marginBottom: 20, background: "#ffffff", borderRadius: 4, padding: 16, boxShadow: "0px 2px 1px -1px rgba(0,0,0,.2), 0px 1px 1px 0px rgba(0,0,0,.14), 0px 1px 3px 0px rgba(0,0,0,.12)", fontFamily: "Roboto, 'Helvetica Neue', sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <h4 style={{ fontSize: 14, fontWeight: 600, color: "rgba(0,0,0,0.87)", margin: 0 }}>{title}</h4>
        <button style={{ fontSize: 12, color: "#7b1f1f", background: "none", border: "none", cursor: "pointer", fontWeight: 500 }}>
          View details
        </button>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{
          background: passed === total ? "#e8f5e9" : "#fff3e0",
          color: passed === total ? "#2e7d32" : "#e65100",
          padding: "4px 12px", borderRadius: 12, fontSize: 13, fontWeight: 600,
        }}>
          {passed}/{total}
        </div>
        <span style={{ fontSize: 13, color: passed === total ? "#2e7d32" : "#e65100", fontWeight: 500 }}>
          Passed
        </span>
      </div>
      <p style={{ fontSize: 11, color: "#9e9e9e", margin: "8px 0 0" }}>{submittedAt}</p>
    </div>
  );
}
