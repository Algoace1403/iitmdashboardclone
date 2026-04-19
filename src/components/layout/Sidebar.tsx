"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { label: "My Current Courses", href: "/" },
  { label: "Completed & Pending Courses", href: "/student_courses" },
  { label: "My Completed Projects", href: "/projects" },
  { label: "Hall Ticket & Exam Cities", href: "/hall-ticket" },
  { label: "Academic Calendar", href: "/calendar" },
  { label: "Certificates", href: "/certificates" },
  { label: "Documents for Download", href: "/documents" },
  { label: "Submitted Documents", href: "/submitted" },
  { label: "Payments & Transactions", href: "/payments" },
  { label: "Disciplinary Action", href: "/disciplinary" },
  { label: "Bookmarks", href: "/bookmarks" },
];

const icons = [
  <svg key="0" width="22" height="22" fill="none" stroke="white" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
  <svg key="1" width="22" height="22" fill="none" stroke="white" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  <svg key="2" width="22" height="22" fill="none" stroke="white" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>,
  <svg key="3" width="22" height="22" fill="none" stroke="white" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>,
  <svg key="4" width="22" height="22" fill="none" stroke="white" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  <svg key="5" width="22" height="22" fill="none" stroke="white" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>,
  <svg key="6" width="22" height="22" fill="none" stroke="white" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
  <svg key="7" width="22" height="22" fill="none" stroke="white" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
  <svg key="8" width="22" height="22" fill="none" stroke="white" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>,
  <svg key="9" width="22" height="22" fill="none" stroke="white" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
  <svg key="10" width="22" height="22" fill="none" stroke="white" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" /></svg>,
];

interface SidebarProps {
  isMobile: boolean;
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ isMobile, open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(false);

  // On mobile: hidden by default, shown as overlay when open
  if (isMobile && !open) {
    return null;
  }

  return (
    <>
      {/* Backdrop for mobile overlay */}
      {isMobile && open && (
        <div
          onClick={onClose}
          style={{
            position: "fixed",
            inset: 0,
            top: 56,
            background: "rgba(0,0,0,0.4)",
            zIndex: 9,
          }}
        />
      )}
      <div
        style={{
          position: "fixed",
          top: 56,
          left: 0,
          width: isMobile ? 260 : (expanded ? 230 : 60),
          minHeight: "calc(100vh - 56px)",
          zIndex: 10,
          transition: "width 0.3s",
          overflow: "hidden",
        }}
      >
        <ul
          style={{
            listStyle: "none",
            padding: "8px 0",
            margin: 0,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            color: "white",
            minHeight: "calc(100vh - 56px)",
          }}
        >
          {navItems.map((item, i) => {
            const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            const showLabel = isMobile || expanded;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  title={item.label}
                  onClick={isMobile ? onClose : undefined}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px 16px",
                    color: "white",
                    textDecoration: "none",
                    whiteSpace: "nowrap",
                    fontSize: 14,
                    fontWeight: 500,
                    background: isActive ? "rgba(255,255,255,0.1)" : "transparent",
                  }}
                >
                  <span style={{ minWidth: 28, display: "flex", alignItems: "center", justifyContent: "center" }}>{icons[i]}</span>
                  {showLabel && <span>{item.label}</span>}
                </Link>
              </li>
            );
          })}

          {/* Collapse/Expand toggle — only on desktop */}
          {!isMobile && (
            <li>
              <button
                onClick={() => setExpanded(!expanded)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 16px",
                  color: "white",
                  background: "none",
                  border: "none",
                  borderTop: "1px solid rgba(255,255,255,0.1)",
                  cursor: "pointer",
                  width: "100%",
                  fontSize: 14,
                  fontWeight: 500,
                  marginTop: 8,
                }}
              >
                <span style={{ minWidth: 28, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg
                    width="20"
                    height="20"
                    fill="none"
                    stroke="white"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                    style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s" }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  </svg>
                </span>
                {expanded && <span>Collapse</span>}
              </button>
            </li>
          )}
        </ul>
      </div>
    </>
  );
}
