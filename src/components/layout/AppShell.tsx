"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { useIsMobile } from "@/lib/useIsMobile";
import { TopNav } from "./TopNav";
import { Sidebar } from "./Sidebar";
import studentData from "@/data/student.json";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isLoggedIn } = useAuth();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isLoginPage = pathname === "/login";
  const isSeekPage = pathname.startsWith("/seek");

  if (isLoginPage || !isLoggedIn) {
    return <>{children}</>;
  }

  if (isSeekPage) {
    return <>{children}</>;
  }

  // App portal: TopNav + Sidebar + Content
  return (
    <>
      <TopNav
        studentName={studentData.name}
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        showMenuButton={isMobile}
      />
      <Sidebar isMobile={isMobile} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main style={{ marginLeft: isMobile ? 0 : "4rem", padding: isMobile ? 12 : 16, minHeight: "calc(100vh - 56px)" }}>
        {children}
      </main>
    </>
  );
}
