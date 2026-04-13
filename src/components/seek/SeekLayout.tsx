"use client";

import { useState } from "react";
import { useIsMobile } from "@/lib/useIsMobile";
import { SeekToolbar } from "./SeekToolbar";
import { SeekSidebar } from "./SeekSidebar";

interface SeekLayoutProps {
  courseName?: string;
  courseId: string;
  children: React.ReactNode;
}

export function SeekLayout({ courseName, courseId, children }: SeekLayoutProps) {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div>
      <SeekToolbar
        courseName={courseName}
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        showMenuButton={isMobile}
      />
      <div style={{ display: "flex" }}>
        <SeekSidebar
          courseId={courseId}
          isMobile={isMobile}
          open={isMobile ? sidebarOpen : true}
          onClose={() => setSidebarOpen(false)}
        />
        <main
          style={{
            flex: 1,
            padding: isMobile ? 12 : 24,
            background: "#fafafa",
            minHeight: "calc(100vh - 64px)",
            marginLeft: isMobile ? 0 : undefined,
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
