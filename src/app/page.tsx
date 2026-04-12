import coursesData from "@/data/courses.json";
import studentData from "@/data/student.json";
import { CourseCard } from "@/components/cards/CourseCard";
import type { Course } from "@/lib/types";

export default function CurrentCoursesPage() {
  const courses = coursesData as Course[];
  const today = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div>
      {/* Date + Term */}
      <div className="flex justify-end mb-4 text-sm text-gray-600">
        <div className="text-right">
          <p className="font-medium text-gray-800">{today}</p>
          <p className="text-xs uppercase tracking-wide text-gray-500">
            {studentData.currentTerm}
          </p>
        </div>
      </div>

      {/* Title + CGPA */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">My Current Courses</h1>
        <p className="text-sm text-gray-600">
          Cumulative Grade Point Average (CGPA) till this term -{" "}
          <span className="font-bold text-gray-900">{studentData.cgpa}</span>
        </p>
      </div>

      {/* Course Cards Grid — 4 equal columns matching real portal */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 16,
          alignItems: "start",
        }}
      >
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}
