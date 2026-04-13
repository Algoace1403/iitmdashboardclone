"use client";

import { SeekToolbar } from "@/components/seek/SeekToolbar";
import { SeekSidebar } from "@/components/seek/SeekSidebar";
import { useParams, useSearchParams } from "next/navigation";
import coursesData from "@/data/courses.json";
import mathLectures from "@/data/seek/math_lectures.json";
import Link from "next/link";

export default function ContentViewerPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const courseId = params.courseId as string;
  const weekNum = parseInt(params.weekNum as string);
  const course = coursesData.find((c) => c.id === courseId);

  const title = searchParams.get("title") || "Content";
  const type = searchParams.get("type") || "Video";

  // Find YouTube video for this lecture
  let videoData: { videoId: string; url: string; thumbnail: string } | null = null;
  if (courseId === "mathematics_for_data_science_2") {
    const weekKey = `week${weekNum}` as keyof typeof mathLectures;
    const weekVideos = mathLectures[weekKey] as { title: string; videoId: string; url: string; thumbnail: string }[] | undefined;
    if (weekVideos) {
      // Match by lecture number (L1.1 matches W1_L1, etc.)
      const lectureMatch = title.match(/L(\d+)\.(\d+)/);
      if (lectureMatch) {
        const lNum = parseInt(lectureMatch[2]);
        // Find by lecture number within the week
        const lectures = weekVideos.filter(v => v.title.includes("_L"));
        if (lectures[lNum - 1]) videoData = lectures[lNum - 1];
      }
      // Also try matching tutorial
      const tutMatch = title.match(/Tutorial\s*(\d+)/i);
      if (tutMatch) {
        const tNum = parseInt(tutMatch[1]);
        const tutorials = weekVideos.filter(v => v.title.includes("Tutorial") || v.title.includes("tutorial"));
        if (tutorials[tNum - 1]) videoData = tutorials[tNum - 1];
      }
      // Fallback: fuzzy title match
      if (!videoData) {
        const titleLower = title.toLowerCase();
        videoData = weekVideos.find(v => {
          const vLower = v.title.toLowerCase();
          return titleLower.split(":").some(part => vLower.includes(part.trim().substring(0, 15)));
        }) || null;
      }
    }
  }

  return (
    <div>
      <SeekToolbar courseName={course?.title || ""} />
      <div style={{ display: "flex" }}>
        <SeekSidebar courseId={courseId} />
        <main style={{ flex: 1, padding: "16px 24px", background: "#fafafa", minHeight: "calc(100vh - 64px)", fontFamily: "Roboto, 'Helvetica Neue', sans-serif" }}>
          <Link
            href={`/seek/courses/${courseId}/week/${weekNum}`}
            style={{ fontSize: 13, color: "#7b1f1f", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4, marginBottom: 16 }}
          >
            ← Back to Week {weekNum}
          </Link>

          <h1 style={{ fontSize: 20, fontWeight: 400, color: "#212121", marginBottom: 8, marginTop: 8 }}>
            {title}
          </h1>
          <p style={{ fontSize: 13, color: "#00897b", marginBottom: 24, fontWeight: 500 }}>{type}</p>

          {type === "Video" && videoData ? (
            <div>
              {/* Embedded YouTube player */}
              <div style={{ position: "relative", width: "100%", maxWidth: 800, paddingBottom: "56.25%", height: 0, overflow: "hidden", borderRadius: 8, background: "#000" }}>
                <iframe
                  src={`https://www.youtube.com/embed/${videoData.videoId}`}
                  style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={title}
                />
              </div>
              <div style={{ marginTop: 16, background: "white", border: "1px solid #e0e0e0", borderRadius: 4, padding: 16 }}>
                <h3 style={{ fontSize: 14, fontWeight: 500, color: "#212121", margin: "0 0 4px" }}>{title}</h3>
                <p style={{ fontSize: 13, color: "#7d8698", margin: 0 }}>Week {weekNum} • {course?.title}</p>
              </div>
            </div>
          ) : type === "Video" ? (
            <div style={{ background: "white", border: "1px solid #e0e0e0", borderRadius: 4, padding: 16 }}>
              <p style={{ fontSize: 14, color: "#494f69", margin: 0 }}>This lecture is available on the SEEK portal.</p>
            </div>
          ) : (
            <div style={{ background: "white", border: "1px solid #e0e0e0", borderRadius: 4, padding: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 500, color: "#212121", margin: "0 0 12px" }}>{title}</h3>
              <p style={{ fontSize: 14, color: "#494f69", lineHeight: 1.7 }}>Lesson content available on SEEK portal.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
