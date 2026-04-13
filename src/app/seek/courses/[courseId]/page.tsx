import { SeekLayout } from "@/components/seek/SeekLayout";
import coursesData from "@/data/courses.json";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ courseId: string }>;
}

export default async function SeekCoursePage({ params }: Props) {
  const { courseId } = await params;
  const course = coursesData.find((c) => c.id === courseId);
  if (!course) notFound();

  let seekData: Record<string, unknown> = {};
  try {
    const data = await import(`@/data/seek/${courseId}.json`);
    seekData = data.default;
  } catch { /* no data */ }

  const about = seekData.aboutCourse as Record<string, unknown> | undefined;
  const dsFoundation = about?.dsFoundation as Record<string, unknown> | undefined;
  const esDiploma = about?.esDiploma as Record<string, unknown> | undefined;

  return (
    <SeekLayout courseName={course.title} courseId={courseId}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 500, color: "#212121", marginBottom: 24 }}>About the Course</h1>

          <div style={{ background: "white", border: "1px solid #e0e0e0", borderRadius: 4, padding: 24 }}>
            {/* Title */}
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <h2 style={{ fontSize: 16, fontWeight: 500, color: "#212121", margin: 0 }}>
                {about?.title as string || course.title}
              </h2>
              <p style={{ fontSize: 13, color: "#7d8698", margin: "4px 0 0" }}>
                ({about?.subtitle as string || course.program})
              </p>
            </div>

            {/* DS Foundation info */}
            {dsFoundation != null && (
              <div style={{ marginBottom: 20 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "#212121", marginBottom: 8 }}>For Data Science Foundation:</h3>
                <InfoLine label="Course ID" value={dsFoundation.courseId as string} />
                <InfoLine label="Course Credits" value={String(dsFoundation.credits)} />
                <InfoLine label="Course Type" value={dsFoundation.type as string} />
                <InfoLine label="Pre-requisites" value={dsFoundation.prerequisites as string} />
              </div>
            )}

            {/* ES Diploma info */}
            {esDiploma != null && (
              <div style={{ marginBottom: 20 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "#212121", marginBottom: 8 }}>For Electronic System Diploma:</h3>
                <InfoLine label="Course ID" value={esDiploma.courseId as string} />
                <InfoLine label="Course Credits" value={String(esDiploma.credits)} />
                <InfoLine label="Course Type" value={esDiploma.type as string} />
                <InfoLine label="Pre-requisites" value={esDiploma.prerequisites as string} />
              </div>
            )}

            {/* Faculty */}
            {about?.faculty != null && (
              <div style={{ marginBottom: 20 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "#212121", marginBottom: 8 }}>Faculty Name:</h3>
                <p style={{ fontSize: 13, color: "#494f69", margin: 0, lineHeight: 1.6 }}>
                  {about.faculty as string},<br />
                  {about.facultyTitle as string},<br />
                  {about.department as string},<br />
                  {about.institute as string}
                </p>
              </div>
            )}

            {/* Instructors */}
            {about?.instructors != null && (
              <div style={{ marginBottom: 20 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "#212121", marginBottom: 8 }}>Course Instructors</h3>
                <ol style={{ margin: 0, paddingLeft: 20, fontSize: 13, color: "#494f69", lineHeight: 1.8 }}>
                  {(about.instructors as string[]).map((name, i) => (
                    <li key={i}>{name}</li>
                  ))}
                </ol>
              </div>
            )}

            {/* Study Material */}
            {about?.studyMaterial != null && (
              <div style={{ marginBottom: 20 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "#212121", marginBottom: 8 }}>Study Material:</h3>
                <p style={{ fontSize: 13, color: "#494f69", margin: 0, lineHeight: 1.6 }}>
                  {about.studyMaterial as string}
                </p>
              </div>
            )}

            {/* Website Links */}
            {about?.websiteLinks != null && (
              <div>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "#212121", marginBottom: 8 }}>Course Website Link:</h3>
                {Object.entries(about.websiteLinks as Record<string, string>).map(([key, url]) => (
                  <p key={key} style={{ fontSize: 13, color: "#494f69", margin: "4px 0" }}>
                    {key}: <span style={{ color: "#7b1f1f" }}>{url}</span>
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
    </SeekLayout>
  );
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <p style={{ fontSize: 13, color: "#494f69", margin: "2px 0" }}>
      <strong>{label}:</strong> {value}
    </p>
  );
}
