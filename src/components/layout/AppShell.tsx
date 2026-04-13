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

  if (isLoginPage || !isLoggedIn) {
    return <>{children}</>;
  }

  if (isSeekPage) {
    return <>{children}</>;
  }

  // App portal: TopNav + Sidebar + Content
  // Real CSS: #main-content { margin-left: 4rem }
  return (
    <>
      <TopNav studentName={studentData.name} />
      <Sidebar />
      <main style={{ marginLeft: "4rem", padding: 16, minHeight: "calc(100vh - 56px)" }}>
        {children}
      </main>
    </>
  );
}
