import { SeekToolbar } from "@/components/seek/SeekToolbar";
import { SeekSidebar } from "@/components/seek/SeekSidebar";
import coursesData from "@/data/courses.json";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ courseId: string }>;
}

export default async function GradingPolicyPage({ params }: Props) {
  const { courseId } = await params;
  const course = coursesData.find((c) => c.id === courseId);
  if (!course) notFound();

  return (
    <div>
      <SeekToolbar courseName={course.title} />
      <div style={{ display: "flex" }}>
        <SeekSidebar courseId={courseId} />
        <main style={{ flex: 1, padding: "16px 24px", background: "#fafafa", minHeight: "calc(100vh - 64px)" }}>
          <h1 style={{ fontSize: 22, fontWeight: 400, color: "#212121", marginBottom: 8, marginTop: 8 }}>Grading Policy</h1>

          <div style={{ background: "white", border: "1px solid #e0e0e0", borderRadius: 4, padding: 24, fontSize: 14, color: "#212121", lineHeight: 1.8 }}>
            <h2 style={{ fontSize: 18, color: "#7b1f1f", margin: "0 0 16px" }}>Intro to python programming</h2>

            <h3 style={{ fontSize: 16, fontWeight: 700, margin: "24px 0 8px", textDecoration: "underline" }}>Academic policies</h3>
            <ol style={{ paddingLeft: 20, margin: "0 0 16px" }}>
              <li>In each programming assignment, be it any course or any OPPE, taking help from LLMs (e.g. ChatGPT, Gemini) partially or completely is considered plagiarism.</li>
              <li>Unless explicitly permitted, <span style={{ color: "red", textDecoration: "underline" }}>do not use LLMs</span>. Using LLMs is considered a violation of honour code.</li>
              <li>Students can discuss and learn from each other but the assignments are expected to be done individually based on their understanding.</li>
            </ol>

            <div style={{ margin: "16px 0", fontSize: 13 }}>
              <p><strong>Quiz 1:</strong> March 15 2026 &nbsp;&nbsp; <strong>Quiz 2:</strong> No Quiz &nbsp;&nbsp; <strong>End term:</strong> May 10 2026</p>
              <p><strong>OPPE1:</strong> 4th April (Standalone students) &amp; 5th April (standalone+others)</p>
              <p><strong>OPPE2:</strong> 1st May</p>
              <p style={{ fontSize: 12, color: "#616161" }}>Possible additional dates: - (Timing 2.30 pm to 4.30 pm) 2nd May (Saturday)</p>
              <p style={{ fontSize: 12, color: "#616161" }}>Depending on your eligibility for OPPE1 &amp; OPPE2, you will be allocated one of the slots mentioned above by the team. Please keep yourself free on the dates given.</p>
            </div>

            <h3 style={{ fontSize: 14, fontWeight: 700, color: "red", margin: "20px 0 8px" }}>Eligibility for Bonus:</h3>
            <p>Only if you do the SCT, will the bonus be applicable to you and be added to your final course score. Even if you attend the mock tests, only if you do the sct, you will get the bonus.</p>

            <h3 style={{ fontSize: 14, fontWeight: 700, color: "red", margin: "20px 0 8px" }}>Eligibility to appear for OPPE1 AND OPPE2:</h3>
            <p>It is MANDATORY to complete the OPPE System Compatibility Test (SCT) exam.</p>
            <p>SoP for the SCT Exam is as follows: Click here for OPPE SCT SoP Document</p>
            <p style={{ fontWeight: 700 }}>OPPE1/OPPE2 will not be scheduled for students who fail to complete the OPPE SCT exam.</p>

            <h3 style={{ fontSize: 14, fontWeight: 700, margin: "20px 0 8px" }}>Syllabus for OPPE 1 - Week1 to Week 5</h3>
            <h3 style={{ fontSize: 14, fontWeight: 700, margin: "0 0 8px" }}>Syllabus for OPPE 2 - Week1 to Week 8</h3>

            <div style={{ margin: "12px 0", fontSize: 13 }}>
              <p>A1: Average of GrPA scores in week 1</p>
              <p>A2: Average of GrPA scores in week 2</p>
              <p>A3: Average of GrPA scores in week 3</p>
              <p>A4: Average of GrPA scores in week 4</p>
              <p>A5: Average of GrPA scores in week 5</p>
              <p>A6: Average of GrPA scores in week 6</p>
              <p>A7: Average of GrPA scores in week 7</p>
              <p>A8: Average of GrPA scores in week 8</p>
            </div>

            <h3 style={{ fontSize: 14, fontWeight: 700, color: "red", margin: "20px 0 8px" }}>Eligibility for writing oppe1:</h3>
            <p>Completing SCT</p>
            <p>AND</p>
            <p>A1&gt;=40/100 AND A2&gt;=40/100 AND A3&gt;=40/100 AND A4&gt;=40/100</p>

            <h3 style={{ fontSize: 14, fontWeight: 700, color: "red", margin: "20px 0 8px" }}>Eligibility to appear for the OPPE 2:</h3>
            <p>Completing SCT</p>
            <p>AND</p>
            <p>A5&gt;=40/100 AND A6&gt;=40/100 AND A7&gt;=40/100 AND A8&gt;=40/100</p>
            <p>AND</p>
            <p>Average of the best 5 out of the first 7 weekly assessments (objective and programming) scores &gt;= 40/100 (becoming eligible to give the end term exam)</p>
            <p style={{ fontSize: 12, color: "#616161" }}>If you do not satisfy this, we will not schedule OPPE2 for you.</p>

            <h3 style={{ fontSize: 14, fontWeight: 700, color: "red", margin: "20px 0 8px" }}>Eligibility to appear for the end term exam is as follows:</h3>
            <p>Average of the best 5 out of the first 7 weekly assessments (objective and programming) scores &gt;= 40/100</p>
            <p>AND</p>
            <p>Being eligible to appear for atleast one of the 2 oppes. If you are ineligible for both, you have to repeat the entire course.</p>

            <h3 style={{ fontSize: 14, fontWeight: 700, margin: "20px 0 8px" }}>Eligibility to obtain the final course grade: Both the conditions below should be satisfied.</h3>
            <p>Attending the end term exam AND</p>
            <p>Minimum score to be obtained in one of the programming exams (OPPE1, OPPE2) should be &gt;= 40/100</p>

            <h3 style={{ fontSize: 14, fontWeight: 700, margin: "20px 0 12px" }}>The calculation of Final course Score for eligible students is as follows:</h3>
            <div style={{ fontSize: 13, fontFamily: "monospace", background: "#f5f5f5", padding: 12, borderRadius: 4, margin: "0 0 16px" }}>
              <p style={{ margin: "4px 0" }}>S/Z1 = score in Quiz (0, if not attempted) - in centre</p>
              <p style={{ margin: "4px 0" }}>PE1 = score in OPPE1 (0, if not attempted) - programming exam 1</p>
              <p style={{ margin: "4px 0" }}>PE2 = score in OPPE2 (0, if not attempted) - programming exam 2</p>
              <p style={{ margin: "4px 0" }}>F = score in final exam</p>
              <p style={{ margin: "8px 0 4px", fontWeight: 700 }}>T = 0.1(Qz)+ 0.4F + 0.25 max(PE1, PE2) + 0.2 min(PE1, PE2) + bonus</p>
            </div>

            {/* Grade Table */}
            <h3 style={{ fontSize: 14, fontWeight: 700, margin: "20px 0 12px" }}>Possibilities for student</h3>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr style={{ background: "#f5f5f5" }}>
                    <th style={thStyle}>#</th>
                    <th style={thStyle}>OPPE1/OPPE2</th>
                    <th style={thStyle}>ET</th>
                    <th style={thStyle}>T</th>
                    <th style={thStyle}>Grade</th>
                    <th style={thStyle}>Possibilities for student</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td style={tdStyle}>1</td><td style={tdStyle}>Absent</td><td style={tdStyle}>Absent</td><td style={tdStyle}>-</td><td style={tdStyle}>U</td><td style={tdStyle}>Repeat the course.</td></tr>
                  <tr><td style={tdStyle}>2</td><td style={tdStyle}>Absent</td><td style={tdStyle}>Present</td><td style={tdStyle}>&gt;=35</td><td style={tdStyle}>I, OP</td><td style={tdStyle}>Complete OPPE alone in next term. Both oppes will be scheduled. GA, quiz and ET marks will be carried over OR Repeat the entire course</td></tr>
                  <tr><td style={tdStyle}>3</td><td style={tdStyle}></td><td style={tdStyle}></td><td style={tdStyle}>&lt;35</td><td style={tdStyle}>U</td><td style={tdStyle}>Repeat the entire course</td></tr>
                  <tr><td style={tdStyle}>4</td><td style={tdStyle}>Present</td><td style={tdStyle}>Present</td><td style={tdStyle}>&gt;=40</td><td style={tdStyle}>I, OP</td><td style={tdStyle}>Complete OPPE alone in next term. Both oppes will be scheduled. GA, quiz and ET marks will be carried over OR Repeat the entire course</td></tr>
                  <tr><td style={tdStyle}>5</td><td style={tdStyle}>Score &lt; 40/100</td><td style={tdStyle}></td><td style={tdStyle}></td><td style={tdStyle}></td><td style={tdStyle}></td></tr>
                  <tr><td style={tdStyle}>6</td><td style={tdStyle}></td><td style={tdStyle}>Absent</td><td style={tdStyle}>-</td><td style={tdStyle}>I, BOTH</td><td style={tdStyle}>Complete ET and OPE in next term. Both oppes will be scheduled. GA and quiz marks will be carried over OR Repeat the entire course</td></tr>
                  <tr><td style={tdStyle}>7</td><td style={tdStyle}>Present &gt;=40/100</td><td style={tdStyle}>Absent</td><td style={tdStyle}>-</td><td style={tdStyle}>I</td><td style={tdStyle}>Complete ET alone in next term. OPPE will NOT be scheduled. GA, quiz and OPPE marks will be carried over OR Repeat the entire course</td></tr>
                  <tr><td style={tdStyle}>8</td><td style={tdStyle}></td><td style={tdStyle}>Present</td><td style={tdStyle}></td><td style={tdStyle}></td><td style={tdStyle}>Grade as per the Total score T</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

const thStyle: React.CSSProperties = {
  padding: "8px 12px",
  textAlign: "left",
  borderBottom: "2px solid #e0e0e0",
  fontWeight: 600,
  color: "#424242",
};

const tdStyle: React.CSSProperties = {
  padding: "8px 12px",
  borderBottom: "1px solid #e9ecef",
  color: "#424242",
  verticalAlign: "top",
};
