"use client";

import coursesData from "@/data/courses.json";
import studentData from "@/data/student.json";
import { CourseCard } from "@/components/cards/CourseCard";
import { useIsMobile, useIsTablet } from "@/lib/useIsMobile";
import type { Course } from "@/lib/types";

export default function CurrentCoursesPage() {
  const courses = coursesData as Course[];
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const today = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const columns = isMobile ? "1fr" : "1fr 1fr 1fr 1fr";

  return (
    <div>
      {/* Date + Term -- top right */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <div style={{ textAlign: "right" }}>
          <p style={{ fontWeight: 600, fontSize: isMobile ? 15 : 18, color: "#000", margin: 0 }}>{today}</p>
          <p style={{ fontSize: 12, color: "#707070", margin: 0, textTransform: "uppercase", letterSpacing: 1 }}>
            {studentData.currentTerm}
          </p>
        </div>
      </div>

      {/* Title + CGPA */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: isMobile ? 20 : 24, fontWeight: 700, color: "#000", margin: "0 0 4px" }}>My Current Courses</h1>
        <p style={{ fontSize: isMobile ? 13 : 14, color: "#000", margin: 0 }}>
          Cumulative Grade Point Average (CGPA) till this term - <strong>{studentData.cgpa}</strong>
        </p>
      </div>

      {/* Course Cards -- responsive grid */}
      {isMobile ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: columns,
            gap: 12,
            alignItems: "start",
          }}
        >
          {courses.map((course) => (
            <div key={course.id}>
              <CourseCard course={course} />
            </div>
          ))}
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr 1fr",
            gridTemplateRows: "auto auto",
            gap: 18,
            alignItems: "start",
          }}
        >
          {/* Python -- spans 2 rows in first column */}
          <div style={{ gridColumn: "1", gridRow: "1 / 3" }}>
            <CourseCard course={courses[0]} />
          </div>
          {/* Stats */}
          <div style={{ gridColumn: "2", gridRow: "1" }}>
            <CourseCard course={courses[1]} />
          </div>
          {/* POSH */}
          <div style={{ gridColumn: "3", gridRow: "1" }}>
            <CourseCard course={courses[2]} />
          </div>
          {/* Math */}
          <div style={{ gridColumn: "4", gridRow: "1" }}>
            <CourseCard course={courses[4]} />
          </div>
          {/* English -- below POSH */}
          <div style={{ gridColumn: "3", gridRow: "2" }}>
            <CourseCard course={courses[3]} />
          </div>
        </div>
      )}

      {/* Footer reporting text */}
      <div style={{ marginTop: 40, background: "#efefef", padding: isMobile ? "0.6rem 1rem" : "0.8rem 1.8rem", fontSize: 12, color: "#525f7f" }}>
        Reporting harassment: IITM BS Degree Team is committed to ensuring that everyone is equally valued and treats one another with respect. All complaints of bullying or harassment will be taken seriously and will be dealt with quickly and with respect for all people involved. Learners may write to this email id students.grievance@study.iitm.ac.in which will be considered as a formal complaint. We will make reasonable and appropriate efforts to preserve an individual&apos;s privacy and protect the confidentiality of information.
      </div>
      <div style={{ padding: isMobile ? "0.8rem 1rem" : "1rem 1.8rem", color: "white", backgroundColor: "#a0322c", fontSize: 12 }}>
        &copy; 2026 IIT Madras BS Degree Programme. All rights reserved.
      </div>
    </div>
  );
}
