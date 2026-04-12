"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { TopNav } from "./TopNav";
import { Sidebar } from "./Sidebar";
import studentData from "@/data/student.json";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isLoggedIn } = useAuth();

  const isLoginPage = pathname === "/login";
  const isSeekPage = pathname.startsWith("/seek");

  // Login page: no shell at all
  if (isLoginPage || !isLoggedIn) {
    return <>{children}</>;
  }

  // SEEK portal: different layout (handled by seek's own layout)
  if (isSeekPage) {
    return <>{children}</>;
  }

  // App portal: TopNav + Sidebar + Content
  return (
    <>
      <TopNav studentName={studentData.name} />
      <div style={{ display: "flex", minHeight: "calc(100vh - 56px)" }}>
        <Sidebar />
        <main style={{ flex: 1, padding: "16px 24px 32px 24px", background: "#f5f5f5", minWidth: 0 }}>
          {children}
        </main>
      </div>
    </>
  );
}
