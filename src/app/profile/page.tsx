import { getStudent, getCourses, getGrades } from "@/lib/data";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export default function ProfilePage() {
  const student = getStudent();
  const courses = getCourses();
  const grades = getGrades();

  const completedCourses = courses.filter((c) => c.status === "completed");
  const totalCredits = courses.reduce((s, c) => s + c.credits, 0);
  const earnedCredits = completedCourses.reduce((s, c) => s + c.credits, 0);
  const latestCgpa = grades.length > 0 ? grades[grades.length - 1].cgpa : 0;

  return (
    <div className="max-w-3xl mx-auto">
      <Breadcrumbs />

      <div className="bg-white rounded-xl border border-gray-200 p-8">
        {/* Avatar */}
        <div className="flex items-center gap-5 mb-8">
          <div className="w-20 h-20 rounded-full bg-indigo-600 text-white flex items-center justify-center text-2xl font-bold">
            {student.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)}
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">{student.name}</h1>
            <p className="text-sm text-gray-500">{student.rollNumber}</p>
            <p className="text-sm text-gray-500">{student.email}</p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoRow label="Programme" value={student.program} />
          <InfoRow label="Current Term" value={`Term ${student.currentTerm}`} />
          <InfoRow label="Enrollment Year" value={String(student.enrollmentYear)} />
          <InfoRow label="CGPA" value={latestCgpa.toFixed(2)} />
          <InfoRow label="Credits Earned" value={`${earnedCredits} / ${totalCredits}`} />
          <InfoRow label="Courses Completed" value={String(completedCourses.length)} />
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-3 border-b border-gray-100">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-800">{value}</span>
    </div>
  );
}
