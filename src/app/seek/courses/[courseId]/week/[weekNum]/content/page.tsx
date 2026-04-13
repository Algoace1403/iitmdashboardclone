"use client";

import { SeekLayout } from "@/components/seek/SeekLayout";
import { useParams, useSearchParams } from "next/navigation";
import coursesData from "@/data/courses.json";
import mathLectures from "@/data/seek/math_lectures.json";
import englishLectures from "@/data/seek/english_lectures.json";
import pythonLectures from "@/data/seek/python_lectures.json";
import statsLectures from "@/data/seek/stats_lectures.json";
import Link from "next/link";

const lectureMap: Record<string, Record<string, { title: string; videoId: string; url: string; thumbnail: string }[]>> = {
  mathematics_for_data_science_2: mathLectures as Record<string, { title: string; videoId: string; url: string; thumbnail: string }[]>,
  english_2: englishLectures as Record<string, { title: string; videoId: string; url: string; thumbnail: string }[]>,
  programming_in_python: pythonLectures as Record<string, { title: string; videoId: string; url: string; thumbnail: string }[]>,
  statistics_for_data_science_2: statsLectures as Record<string, { title: string; videoId: string; url: string; thumbnail: string }[]>,
};

export default function ContentViewerPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const courseId = params.courseId as string;
  const weekNum = parseInt(params.weekNum as string);
  const course = coursesData.find((c) => c.id === courseId);

  const title = searchParams.get("title") || "Content";
  const type = searchParams.get("type") || "Video";

  // Find YouTube video for this lecture from any course
  let videoData: { videoId: string; url: string; thumbnail: string } | null = null;
  const courseLectures = lectureMap[courseId];
  if (courseLectures) {
    const weekKey = `week${weekNum}`;
    const weekVideos = courseLectures[weekKey];
    if (weekVideos) {
      // Match by lecture number (L1.1 matches W1_L1, L1.2, etc.)
      const lectureMatch = title.match(/L(\d+)\.(\d+)/);
      if (lectureMatch) {
        const lNum = parseInt(lectureMatch[2]);
        const lectures = weekVideos.filter(v => v.title.match(/_L\d+|L\d+/));
        if (lectures[lNum - 1]) videoData = lectures[lNum - 1];
      }
      // Match by "Lecture N:" pattern
      const lecNumMatch = title.match(/Lecture\s*(\d+)/i);
      if (!videoData && lecNumMatch) {
        const lNum = parseInt(lecNumMatch[1]);
        if (weekVideos[lNum - 1]) videoData = weekVideos[lNum - 1];
      }
      // Match tutorial
      const tutMatch = title.match(/Tutorial\s*(\d+)/i);
      if (!videoData && tutMatch) {
        const tNum = parseInt(tutMatch[1]);
        const tutorials = weekVideos.filter(v => v.title.toLowerCase().includes("tutorial"));
        if (tutorials[tNum - 1]) videoData = tutorials[tNum - 1];
      }
      // Fallback: fuzzy title match
      if (!videoData) {
        const titleLower = title.toLowerCase();
        videoData = weekVideos.find(v => {
          const vLower = v.title.toLowerCase();
          // Match by keywords after the colon
          const colonPart = titleLower.split(":").slice(1).join(":").trim();
          if (colonPart.length > 5 && vLower.includes(colonPart.substring(0, 20))) return true;
          // Match by significant words
          return titleLower.split(/\s+/).filter(w => w.length > 4).some(w => vLower.includes(w));
        }) || null;
      }
    }
  }

  return (
    <SeekLayout courseName={course?.title || ""} courseId={courseId}>
      <div style={{ fontFamily: "Roboto, 'Helvetica Neue', sans-serif" }}>
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
      </div>
    </SeekLayout>
  );
}
