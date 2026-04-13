import { SeekToolbar } from "@/components/seek/SeekToolbar";
import { SeekSidebar } from "@/components/seek/SeekSidebar";
import Link from "next/link";
import coursesData from "@/data/courses.json";
import mathLectures from "@/data/seek/math_lectures.json";
import { notFound } from "next/navigation";

interface ContentItem {
  title: string;
  type: string;
  graded?: boolean;
}

interface WeekData {
  weekNumber: number;
  title: string;
  items: ContentItem[];
}

interface Props {
  params: Promise<{ courseId: string; weekNum: string }>;
}

function TypeIcon({ type }: { type: string }) {
  if (type === "Video") {
    return (
      <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#e0e0e0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <svg style={{ width: 16, height: 16, color: "#616161", marginLeft: 2 }} fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z" />
        </svg>
      </div>
    );
  }
  if (type === "Lesson") {
    return (
      <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#e0e0e0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <svg style={{ width: 16, height: 16, color: "#616161" }} fill="currentColor" viewBox="0 0 24 24">
          <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 7V3.5L18.5 9H13z" />
        </svg>
      </div>
    );
  }
  if (type === "Assignment") {
    return (
      <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#e0e0e0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <svg style={{ width: 16, height: 16, color: "#616161" }} fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
        </svg>
      </div>
    );
  }
  // Programming Assignment
  return (
    <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#e0e0e0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <svg style={{ width: 16, height: 16, color: "#616161" }} fill="currentColor" viewBox="0 0 24 24">
        <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" />
      </svg>
    </div>
  );
}

function typeColor(type: string): string {
  switch (type) {
    case "Video": return "#00897b";
    case "Lesson": return "#5c6bc0";
    case "Assignment": return "#ef6c00";
    case "Programming Assignment": return "#7b1fa2";
    default: return "#616161";
  }
}

export default async function SeekWeekPage({ params }: Props) {
  const { courseId, weekNum } = await params;
  const course = coursesData.find((c) => c.id === courseId);
  if (!course) notFound();

  const weekNumber = parseInt(weekNum);
  let weekData: WeekData | null = null;

  try {
    const data = await import(`@/data/seek/${courseId}.json`);
    const weeks = data.default.weeks as WeekData[];
    weekData = weeks?.find((w) => w.weekNumber === weekNumber) || null;
  } catch { /* no data */ }

  const rawItems = weekData?.items || [];

  // For Math: remove video/lesson items that don't have a YouTube link
  const mathWeekKey = `week${weekNumber}` as keyof typeof mathLectures;
  const mathVideos = courseId === "mathematics_for_data_science_2" ? (mathLectures[mathWeekKey] as { title: string; videoId: string }[] | undefined) : null;

  // Keep all items — videos with YouTube links will open the player
  const items = rawItems;

  return (
    <div>
      <SeekToolbar courseName={course.title} />
      <div style={{ display: "flex" }}>
        <SeekSidebar courseId={courseId} />
        <main style={{ flex: 1, padding: "16px 24px", background: "#fafafa", minHeight: "calc(100vh - 64px)" }}>
          <h1 style={{ fontSize: 22, fontWeight: 400, color: "#212121", marginBottom: 16, marginTop: 8 }}>
            Week {weekNumber}
          </h1>

          {items.length === 0 ? (
            <div style={{ background: "white", border: "1px solid #e0e0e0", borderRadius: 4, padding: 32, textAlign: "center" }}>
              <p style={{ color: "#7d8698", fontSize: 14 }}>No content data for this week yet.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {items.map((item, i) => {
                const isGradedAssignment = item.type === "Assignment" && item.graded;
                const isPracticeAssignment = item.type === "Assignment" && !item.graded;
                const isGradedProgramming = item.type === "Programming Assignment" && item.graded;
                const isPracticeProgramming = item.type === "Programming Assignment" && !item.graded;

                let href: string | undefined;
                if (isGradedAssignment || isGradedProgramming) {
                  href = `/seek/courses/${courseId}/week/${weekNumber}/graded`;
                } else if (isPracticeAssignment || isPracticeProgramming) {
                  // Check if this specific assignment has rendered HTML
                  const titleLower = item.title.toLowerCase();
                  if (titleLower.includes("practice assignment") || titleLower.includes("practice assignment")) {
                    href = `/seek/courses/${courseId}/week/${weekNumber}/practice`;
                  } else {
                    // Activity questions, Solve with us, etc. — link to individual assignment page
                    href = `/seek/courses/${courseId}/week/${weekNumber}/assignment?title=${encodeURIComponent(item.title)}`;
                  }
                } else if (item.type === "Video" || item.type === "Lesson") {
                  // Check if it's a Question Bank with URL
                  const itemWithUrl = item as { title: string; type: string; url?: string };
                  if (itemWithUrl.url) {
                    href = itemWithUrl.url;
                  } else {
                    href = `/seek/courses/${courseId}/week/${weekNumber}/content?title=${encodeURIComponent(item.title)}&type=${item.type}`;
                  }
                }

                const inner = (
                  <div
                    style={{
                      background: "white",
                      borderBottom: "1px solid #eeeeee",
                      padding: "12px 16px",
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                      cursor: href ? "pointer" : "default",
                    }}
                  >
                    <TypeIcon type={item.type} />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 14, fontWeight: 400, color: "#212121", margin: 0, display: "flex", alignItems: "center", gap: 6 }}>
                        {item.title}
                        {weekNumber <= 8 && (item.type === "Assignment" || item.type === "Programming Assignment") && (
                          <svg style={{ width: 14, height: 14, flexShrink: 0 }} viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" fill="#4caf50" />
                            <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </p>
                      <p style={{ fontSize: 12, color: typeColor(item.type), margin: "2px 0 0", fontWeight: 500 }}>
                        {item.type}
                      </p>
                    </div>
                    {href && (
                      <svg style={{ width: 18, height: 18, color: "#bdbdbd", flexShrink: 0 }} fill="currentColor" viewBox="0 0 24 24">
                        <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                      </svg>
                    )}
                  </div>
                );

                return href ? (
                  <Link key={i} href={href} style={{ textDecoration: "none", color: "inherit" }}>
                    {inner}
                  </Link>
                ) : (
                  <div key={i}>{inner}</div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
