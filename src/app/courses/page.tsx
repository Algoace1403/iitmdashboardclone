import { getCourses } from "@/lib/data";
import { CourseCard } from "@/components/cards/CourseCard";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export default function CoursesPage() {
  const courses = getCourses();

  const grouped = courses.reduce(
    (acc, course) => {
      const key = `Term ${course.term}`;
      if (!acc[key]) acc[key] = [];
      acc[key].push(course);
      return acc;
    },
    {} as Record<string, typeof courses>
  );

  const sortedTerms = Object.keys(grouped).sort(
    (a, b) => parseInt(b.split(" ")[1]) - parseInt(a.split(" ")[1])
  );

  return (
    <div className="max-w-7xl mx-auto">
      <Breadcrumbs />
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Courses</h1>

      {sortedTerms.map((term) => (
        <section key={term} className="mb-8">
          <h2 className="text-base font-semibold text-gray-600 mb-3">{term}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {grouped[term].map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </section>
      ))}

      {courses.length === 0 && (
        <div className="bg-white rounded-xl border border-dashed border-gray-300 p-8 text-center">
          <p className="text-gray-500">No courses found. Import your data into src/data/courses.json</p>
        </div>
      )}
    </div>
  );
}
