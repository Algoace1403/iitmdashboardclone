"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface SeekSidebarProps {
  courseId: string;
  weekCount?: number;
}

export function SeekSidebar({ courseId, weekCount = 10 }: SeekSidebarProps) {
  const pathname = usePathname();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    "course-intro": true,
  });

  function toggle(key: string) {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  const weeks = Array.from({ length: weekCount + 1 }, (_, i) => i); // Week 0 to weekCount

  const iconBarItems = [
    {
      label: "Modules",
      icon: (
        <svg style={{ width: 22, height: 22 }} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
        </svg>
      ),
      active: true,
    },
    {
      label: "Grades",
      icon: (
        <svg style={{ width: 22, height: 22 }} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      href: `/courses/${courseId}`,
    },
  ];

  return (
    <div style={{ display: "flex", position: "sticky", top: 64, height: "calc(100vh - 64px)" }}>
      {/* Left icon bar */}
      <div
        style={{
          width: 64,
          background: "#f5f5f5",
          borderRight: "1px solid #e0e0e0",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: 8,
          gap: 4,
        }}
      >
        {iconBarItems.map((item) => (
          <Link
            key={item.label}
            href={item.href || `/seek/courses/${courseId}`}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              padding: "8px 4px",
              color: item.active ? "#3f51b5" : "#616161",
              textDecoration: "none",
              fontSize: 10,
              fontWeight: 500,
              borderRadius: 4,
              width: 56,
              textAlign: "center",
            }}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </div>

      {/* Accordion panel */}
      <div
        style={{
          width: 260,
          background: "white",
          borderRight: "1px solid #e0e0e0",
          overflowY: "auto",
        }}
      >
        {/* Course Introduction */}
        <AccordionSection
          title="Course Introduction"
          expanded={expandedSections["course-intro"]}
          onToggle={() => toggle("course-intro")}
        >
          <SidebarLink
            href={`/seek/courses/${courseId}`}
            label="About the Course"
            sublabel="Lesson"
            active={pathname === `/seek/courses/${courseId}`}
            gold
          />
          <SidebarLink
            href={`/seek/courses/${courseId}/grading`}
            label="Grading Policy"
            sublabel="Lesson"
            active={pathname === `/seek/courses/${courseId}/grading`}
          />
        </AccordionSection>

        {/* Disciplinary */}
        <AccordionSection
          title="Disciplinary & Non Academic Conduct"
          expanded={expandedSections["disciplinary"]}
          onToggle={() => toggle("disciplinary")}
        />

        {/* Malpractice */}
        <AccordionSection
          title="Malpractice Rules"
          expanded={expandedSections["malpractice"]}
          onToggle={() => toggle("malpractice")}
        />

        {/* Weeks */}
        {weeks.map((w) => {
          const weekPath = `/seek/courses/${courseId}/week/${w}`;
          const isActive = pathname.startsWith(weekPath);

          return (
            <AccordionSection
              key={w}
              title={`Week ${w}`}
              expanded={expandedSections[`week-${w}`] || isActive}
              onToggle={() => toggle(`week-${w}`)}
              href={weekPath}
              active={isActive}
            />
          );
        })}

        {/* Practice Tests */}
        <AccordionSection
          title="Practice Tests (Objective)"
          expanded={expandedSections["practice"]}
          onToggle={() => toggle("practice")}
        />
      </div>
    </div>
  );
}

function AccordionSection({
  title,
  expanded,
  onToggle,
  children,
  href,
  active,
}: {
  title: string;
  expanded?: boolean;
  onToggle: () => void;
  children?: React.ReactNode;
  href?: string;
  active?: boolean;
}) {
  const header = (
    <div
      onClick={href ? undefined : onToggle}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "16px 16px",
        borderBottom: "1px solid #eeeeee",
        cursor: "pointer",
        background: active ? "#f0f0ff" : "transparent",
      }}
    >
      {/* Circle indicator */}
      <div
        style={{
          width: 14,
          height: 14,
          borderRadius: "50%",
          border: `2px solid ${active ? "#3f51b5" : "#bdbdbd"}`,
          background: active ? "#3f51b5" : "transparent",
          flexShrink: 0,
        }}
      />
      <span style={{ flex: 1, fontSize: 14, fontWeight: 400, color: "#212121" }}>
        {title}
      </span>
      {/* Chevron */}
      <svg
        style={{
          width: 20,
          height: 20,
          color: "#9e9e9e",
          transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
          transition: "transform 0.2s",
          flexShrink: 0,
        }}
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
      </svg>
    </div>
  );

  return (
    <div>
      {href ? (
        <a href={href} style={{ textDecoration: "none", color: "inherit" }}>
          {header}
        </a>
      ) : (
        header
      )}
      {expanded && children && (
        <div style={{ borderBottom: "1px solid #eeeeee" }}>
          {children}
        </div>
      )}
    </div>
  );
}

function SidebarLink({
  href,
  label,
  sublabel,
  active,
  gold,
}: {
  href: string;
  label: string;
  sublabel?: string;
  active: boolean;
  gold?: boolean;
}) {
  return (
    <a
      href={href}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "12px 16px 12px 28px",
        textDecoration: "none",
        borderLeft: active ? "3px solid #3f51b5" : "3px solid transparent",
        background: active ? "#f5f5ff" : "transparent",
      }}
    >
      <div
        style={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: gold ? "#e6a817" : "#bdbdbd",
          flexShrink: 0,
        }}
      />
      <div>
        <p style={{ fontSize: 13, color: active ? "#3f51b5" : "#494f69", margin: 0, fontWeight: active ? 500 : 400 }}>
          {label}
        </p>
        {sublabel && (
          <p style={{ fontSize: 11, color: "#00897b", margin: "2px 0 0" }}>{sublabel}</p>
        )}
      </div>
    </a>
  );
}
