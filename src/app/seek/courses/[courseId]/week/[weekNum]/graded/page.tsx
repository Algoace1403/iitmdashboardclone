"use client";

import { SeekToolbar } from "@/components/seek/SeekToolbar";
import { SeekSidebar } from "@/components/seek/SeekSidebar";
import { useState } from "react";
import { useParams } from "next/navigation";
import coursesData from "@/data/courses.json";
import seekPythonData from "@/data/seek/programming_in_python.json";
import grpaData from "@/data/seek/grpa_data.json";

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

  const seekData = courseId === "programming_in_python" ? seekPythonData : null;
  const weekData = seekData?.weeks?.find((w) => w.weekNumber === weekNum);
  const gradedItems = weekData?.items?.filter((i) => i.graded) || [];
  const currentItem = gradedItems[selectedAssignment];

  // Get GrPA detail data — parser stores as { grpa: [...], practice_assignment: {...}, graded_assignment: {...} }
  const weekKey = `week${weekNum}` as keyof typeof grpaData.programming_in_python;
  const courseGrpaData = courseId === "programming_in_python" ? grpaData.programming_in_python : null;
  const weekGrpaObj = courseGrpaData ? (courseGrpaData[weekKey] as { grpa?: GrpaInfo[] } | undefined) : null;
  const grpaArray = weekGrpaObj?.grpa || [];
  const currentGrpa = grpaArray[selectedAssignment] || null;

  const tabs: Tab[] = ["Overview", "Question", "Test Cases", "Solution"];

  return (
    <div>
      <SeekToolbar courseName={course?.title || ""} />
      <div style={{ display: "flex" }}>
        <SeekSidebar courseId={courseId} />
        <main style={{ display: "flex", flex: 1, minHeight: "calc(100vh - 64px)" }}>
          {/* Assignment list sub-sidebar */}
          <div style={{ width: 260, background: "white", borderRight: "1px solid #e0e0e0", overflowY: "auto", flexShrink: 0 }}>
            <div style={{ padding: "12px 16px", borderBottom: "1px solid #e0e0e0" }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#212121", margin: 0 }}>
                Week {weekNum} Assignments
              </p>
            </div>
            {gradedItems.map((item, i) => (
              <div
                key={i}
                onClick={() => { setSelectedAssignment(i); setActiveTab("Overview"); }}
                style={{
                  padding: "10px 16px",
                  borderBottom: "1px solid #f5f5f5",
                  cursor: "pointer",
                  background: selectedAssignment === i ? "#f0f0ff" : "transparent",
                  borderLeft: selectedAssignment === i ? "3px solid #3f51b5" : "3px solid transparent",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{
                    width: 10, height: 10, borderRadius: "50%",
                    background: selectedAssignment === i ? "#e6a817" : "#bdbdbd",
                    flexShrink: 0,
                  }} />
                  <div>
                    <p style={{ fontSize: 12, color: "#212121", margin: 0, fontWeight: selectedAssignment === i ? 500 : 400 }}>
                      {item.title}
                    </p>
                    <p style={{ fontSize: 10, color: "#00897b", margin: "2px 0 0" }}>{item.type}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Main content */}
          <div style={{ flex: 1, background: "#fafafa", minWidth: 0 }}>
            {/* Tabs */}
            <div style={{ display: "flex", borderBottom: "2px solid #e0e0e0", background: "white" }}>
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: "12px 24px",
                    fontSize: 14,
                    fontWeight: 500,
                    color: activeTab === tab ? "#3f51b5" : "#616161",
                    background: "none",
                    border: "none",
                    borderBottom: activeTab === tab ? "2px solid #3f51b5" : "2px solid transparent",
                    cursor: "pointer",
                    marginBottom: -2,
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div style={{ padding: 24 }}>
              {/* Title area */}
              <h2 style={{ fontSize: 18, fontWeight: 500, color: "#212121", margin: "0 0 4px" }}>
                {currentGrpa?.title || currentItem?.title || `Week ${weekNum} Graded Assignment`}
              </h2>
              <p style={{ fontSize: 13, color: "#7d8698", margin: "0 0 4px" }}>
                {currentGrpa?.type || currentItem?.type || "Programming Assignment"}
              </p>
              {currentGrpa?.deadlinePassed && (
                <p style={{ fontSize: 12, color: "#d32f2f", margin: "0 0 4px", fontStyle: "italic" }}>
                  Submission deadline has passed for this assignment
                </p>
              )}
              <p style={{ fontSize: 13, color: "#616161", margin: "0 0 24px" }}>
                {currentGrpa?.dueDate || "Due date not available"}
              </p>

              {/* ──── OVERVIEW TAB ──── */}
              {activeTab === "Overview" && (
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
                            stroke={currentGrpa && currentGrpa.score >= 50 ? "#4caf50" : "#ff9800"}
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

              {/* ──── QUESTION TAB ──── */}
              {activeTab === "Question" && (
                <div>
                  <div style={{ background: "#1e1e1e", borderRadius: 4, overflow: "hidden" }}>
                    {/* Editor header */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 16px", background: "#2d2d2d", borderBottom: "1px solid #404040" }}>
                      <span style={{ fontSize: 13, color: "#cccccc", fontWeight: 500 }}>Python3</span>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button style={{ background: "#0e639c", color: "white", border: "none", padding: "4px 12px", borderRadius: 3, fontSize: 12, cursor: "pointer" }}>Test Run</button>
                        <button style={{ background: "#4caf50", color: "white", border: "none", padding: "4px 12px", borderRadius: 3, fontSize: 12, cursor: "pointer" }}>Submit</button>
                      </div>
                    </div>
                    {/* Code content */}
                    <pre style={{ margin: 0, padding: 16, fontSize: 13, lineHeight: 1.6, color: "#d4d4d4", fontFamily: "'Roboto Mono', 'Courier New', monospace", overflowX: "auto", whiteSpace: "pre" }}>
                      {currentGrpa?.savedCode || currentGrpa?.codeTemplate || "# No code available\n# Export this assignment from the SEEK portal to see the actual code"}
                    </pre>
                  </div>
                </div>
              )}

              {/* ──── TEST CASES TAB ──── */}
              {activeTab === "Test Cases" && (
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 600, color: "#212121", margin: "0 0 16px" }}>Public Test Cases</h3>
                  {currentGrpa?.publicTestCases && currentGrpa.publicTestCases.length > 0 ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      {currentGrpa.publicTestCases.map((tc, i) => (
                        <div key={i} style={{ background: "white", border: "1px solid #e0e0e0", borderRadius: 4, padding: 16 }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                            <span style={{ fontSize: 13, fontWeight: 600, color: "#212121" }}>Test Case {i + 1}</span>
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

              {/* ──── SOLUTION TAB ──── */}
              {activeTab === "Solution" && (
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 600, color: "#212121", margin: "0 0 16px" }}>Solution</h3>
                  {currentGrpa?.savedCode || currentGrpa?.codeTemplate ? (
                    <div style={{ background: "#1e1e1e", borderRadius: 4, overflow: "hidden" }}>
                      <div style={{ padding: "8px 16px", background: "#2d2d2d", borderBottom: "1px solid #404040" }}>
                        <span style={{ fontSize: 13, color: "#cccccc", fontWeight: 500 }}>Python3 — Your Submission</span>
                      </div>
                      <pre style={{ margin: 0, padding: 16, fontSize: 13, lineHeight: 1.6, color: "#d4d4d4", fontFamily: "'Roboto Mono', 'Courier New', monospace", overflowX: "auto", whiteSpace: "pre" }}>
                        {currentGrpa.code}
                      </pre>
                    </div>
                  ) : (
                    <p style={{ fontSize: 13, color: "#7d8698" }}>Solution available after deadline. Export from SEEK to populate.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function TestSection({ title, passed, total, submittedAt }: {
  title: string; passed: number; total: number; submittedAt: string;
}) {
  return (
    <div style={{ marginBottom: 20, background: "white", border: "1px solid #e0e0e0", borderRadius: 4, padding: 16 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <h4 style={{ fontSize: 14, fontWeight: 600, color: "#212121", margin: 0 }}>{title}</h4>
        <button style={{ fontSize: 12, color: "#3f51b5", background: "none", border: "none", cursor: "pointer", fontWeight: 500 }}>
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
