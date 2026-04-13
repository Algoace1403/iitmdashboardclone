import data from "@/data/completed_courses.json";

export default function StudentCoursesPage() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Foundational Level Courses</h1>

      {/* Completed */}
      <section className="mb-8">
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-4 pb-2 border-b border-gray-300">
          COMPLETED COURSES
        </h2>
        <div className="space-y-1">
          {data.foundational.completed.map((c) => (
            <div key={c.title} className="py-3 border-b border-gray-200">
              <p className="text-sm text-[#aa3535] font-medium hover:underline cursor-pointer">
                {c.title}
              </p>
              <p className="text-sm text-gray-700">Grade Letter: {c.grade}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Current */}
      <section>
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-4 pb-2 border-b border-gray-300">
          CURRENT COURSES
        </h2>
        <div className="space-y-1">
          {data.foundational.current.map((c) => (
            <div key={c.title} className="py-3 border-b border-gray-200">
              <p className="text-sm text-[#aa3535] font-medium hover:underline cursor-pointer">
                {c.title}
              </p>
              <p className="text-sm text-gray-700">Current Course</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
