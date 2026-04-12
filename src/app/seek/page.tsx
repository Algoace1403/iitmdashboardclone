import { SeekToolbar } from "@/components/seek/SeekToolbar";
import Link from "next/link";
import coursesData from "@/data/courses.json";

export default function SeekHomePage() {
  const courses = coursesData.filter((c) => c.seekCode);

  return (
    <div>
      <SeekToolbar />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-medium text-[#212121] mb-6">My Courses</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.map((course) => (
            <Link
              key={course.id}
              href={`/seek/courses/${course.id}`}
              className="block bg-white border border-[#e0e0e0] rounded p-5 hover:shadow-md transition-shadow"
            >
              <h3 className="text-base font-medium text-[#212121] mb-1">{course.title}</h3>
              <p className="text-sm text-[#494f69]">{course.code}</p>
              <p className="text-xs text-[#7d8698] mt-2">{course.term}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
