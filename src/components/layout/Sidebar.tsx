"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/*
 * Sidebar matching real portal CSS (new_dashboard.css):
 *   - width: 60px collapsed, 215px on hover
 *   - background: rgba(0,0,0,0.7)
 *   - position: fixed, min-height: 100vh
 *   - hover color: #d6a64f (gold)
 *   - icon-box padding-right: 0.4rem, max-height: 25px
 */

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
];

// SVG icons matching sidebar icon style
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
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      <style>{`
        .iitm-sidebar {
          position: fixed;
          top: 56px;
          left: 0;
          min-height: calc(100vh - 56px);
          z-index: 10;
          width: 60px;
          overflow: hidden;
          transition: width 0.3s;
        }
        .iitm-sidebar:hover {
          width: 215px;
        }
        .iitm-sidebar ul {
          list-style: none;
          padding: 16px 0;
          margin: 0;
          background-color: rgba(0, 0, 0, 0.7);
          color: white;
          min-height: calc(100vh - 56px);
        }
        .iitm-sidebar li {
          padding: 0;
        }
        .iitm-sidebar a {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          color: white;
          text-decoration: none;
          white-space: nowrap;
          font-size: 14px;
          font-weight: 500;
          transition: color 0.15s;
        }
        .iitm-sidebar a:hover {
          color: #d6a64f;
        }
        .iitm-sidebar a.active {
          background: rgba(255,255,255,0.1);
        }
        .iitm-sidebar .icon-wrap {
          min-width: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
      <div className="iitm-sidebar">
        <ul>
          {navItems.map((item, i) => {
            const isActive =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={isActive ? "active" : ""}
                  title={item.label}
                >
                  <span className="icon-wrap">{icons[i]}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
