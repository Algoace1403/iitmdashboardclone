"use client";

import { SeekLayout } from "@/components/seek/SeekLayout";
import { RawHtmlRenderer } from "@/components/seek/RawHtmlRenderer";
import { useParams, useSearchParams } from "next/navigation";
import coursesData from "@/data/courses.json";
import rawAssignments from "@/data/seek/raw_assignments.json";
import Link from "next/link";

export default function AssignmentViewPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const courseId = params.courseId as string;
  const weekNum = parseInt(params.weekNum as string);
  const course = coursesData.find((c) => c.id === courseId);
  const title = searchParams.get("title") || "";

  // Find rendered HTML by title
  const courseRaw = (rawAssignments as Record<string, Record<string, string>>)[courseId] || {};
  const html = courseRaw[title] || "";

  return (
    <SeekLayout courseName={course?.title || ""} courseId={courseId}>
      <div style={{ fontFamily: "Roboto, 'Helvetica Neue', sans-serif" }}>
          <Link
            href={`/seek/courses/${courseId}/week/${weekNum}`}
            style={{ fontSize: 13, color: "#7b1f1f", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4, marginBottom: 16 }}
          >
            ← Back to Week {weekNum}
          </Link>

          <h1 style={{ fontSize: 22, fontWeight: 400, color: "rgba(0,0,0,0.87)", marginBottom: 16, marginTop: 8 }}>
            {title}
          </h1>

          {html ? (
            <RawHtmlRenderer
              html={html}
              courseId={courseId}
              assignmentId={title || `week${weekNum}-assignment`}
            />
          ) : (
            <div style={{ background: "#fff", borderRadius: 4, padding: 32, textAlign: "center" }}>
              <p style={{ color: "rgba(0,0,0,0.54)", fontSize: 14 }}>
                Content not yet captured. Open this assignment on SEEK, run the capture script, and re-export.
              </p>
            </div>
          )}
      </div>
    </SeekLayout>
  );
}
