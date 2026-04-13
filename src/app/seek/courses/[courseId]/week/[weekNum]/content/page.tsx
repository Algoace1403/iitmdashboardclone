"use client";

import { SeekToolbar } from "@/components/seek/SeekToolbar";
import { SeekSidebar } from "@/components/seek/SeekSidebar";
import { useParams, useSearchParams } from "next/navigation";
import coursesData from "@/data/courses.json";
import Link from "next/link";

export default function ContentViewerPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const courseId = params.courseId as string;
  const weekNum = parseInt(params.weekNum as string);
  const course = coursesData.find((c) => c.id === courseId);

  const title = searchParams.get("title") || "Content";
  const type = searchParams.get("type") || "Video";

  return (
    <div>
      <SeekToolbar courseName={course?.title || ""} />
      <div style={{ display: "flex" }}>
        <SeekSidebar courseId={courseId} />
        <main style={{ flex: 1, padding: "16px 24px", background: "#fafafa", minHeight: "calc(100vh - 64px)" }}>
          {/* Back link */}
          <Link
            href={`/seek/courses/${courseId}/week/${weekNum}`}
            style={{ fontSize: 13, color: "#7b1f1f", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4, marginBottom: 16 }}
          >
            <svg style={{ width: 16, height: 16 }} fill="currentColor" viewBox="0 0 24 24">
              <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z" />
            </svg>
            Back to Week {weekNum}
          </Link>

          <h1 style={{ fontSize: 20, fontWeight: 400, color: "#212121", marginBottom: 8, marginTop: 8 }}>
            {title}
          </h1>
          <p style={{ fontSize: 13, color: "#00897b", marginBottom: 24, fontWeight: 500 }}>{type}</p>

          {type === "Video" ? (
            <div>
              {/* Video player placeholder */}
              <div
                style={{
                  background: "#000",
                  borderRadius: 4,
                  width: "100%",
                  maxWidth: 800,
                  aspectRatio: "16/9",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Dark overlay with play button */}
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: "50%",
                      background: "rgba(255,255,255,0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 12px",
                    }}
                  >
                    <svg style={{ width: 32, height: 32, color: "white", marginLeft: 4 }} fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                  <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, margin: 0 }}>
                    {title}
                  </p>
                  <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, marginTop: 8 }}>
                    Video content hosted on SEEK portal
                  </p>
                </div>
              </div>

              {/* Video info */}
              <div style={{ marginTop: 16, background: "white", border: "1px solid #e0e0e0", borderRadius: 4, padding: 16 }}>
                <h3 style={{ fontSize: 14, fontWeight: 500, color: "#212121", margin: "0 0 8px" }}>{title}</h3>
                <p style={{ fontSize: 13, color: "#7d8698", margin: 0 }}>
                  Week {weekNum} • Programming in Python
                </p>
              </div>
            </div>
          ) : (
            /* Lesson content */
            <div style={{ background: "white", border: "1px solid #e0e0e0", borderRadius: 4, padding: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 500, color: "#212121", margin: "0 0 12px" }}>{title}</h3>
              <p style={{ fontSize: 14, color: "#494f69", lineHeight: 1.7 }}>
                Lesson content is available on the SEEK portal. This content includes supplementary materials,
                notes, and resources for this topic.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
