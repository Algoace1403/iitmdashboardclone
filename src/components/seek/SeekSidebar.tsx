"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface SeekSidebarProps {
  courseId: string;
  weekCount?: number;
  isMobile?: boolean;
  open?: boolean;
  onClose?: () => void;
}

export function SeekSidebar({ courseId, weekCount = 10, isMobile = false, open = true, onClose }: SeekSidebarProps) {
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

  // On mobile: hidden unless open, shown as overlay
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
            top: 64,
            background: "rgba(0,0,0,0.4)",
            zIndex: 39,
          }}
        />
      )}
      <div
        style={{
          display: "flex",
          position: isMobile ? "fixed" : "sticky",
          top: 64,
          left: 0,
          height: "calc(100vh - 64px)",
          zIndex: isMobile ? 40 : undefined,
          ...(isMobile ? { width: 280 } : {}),
        }}
      >
        {/* Left icon bar -- hidden on mobile */}
        {!isMobile && (
          <div
            style={{
              width: 64,
              background: "#fafafa",
              borderRight: "1px solid rgba(0,0,0,0.12)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              paddingTop: 8,
              gap: 4,
              fontFamily: "Roboto, 'Helvetica Neue', sans-serif",
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
                  color: item.active ? "#7b1f1f" : "rgba(0,0,0,0.54)",
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
        )}

        {/* Accordion panel */}
        <div
          style={{
            width: isMobile ? 280 : 260,
            background: "#ffffff",
            borderRight: "1px solid rgba(0,0,0,0.12)",
            overflowY: "auto",
            fontFamily: "Roboto, 'Helvetica Neue', sans-serif",
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
              onClick={isMobile ? onClose : undefined}
            />
            <SidebarLink
              href={`/seek/courses/${courseId}/grading`}
              label="Grading Policy"
              sublabel="Lesson"
              active={pathname === `/seek/courses/${courseId}/grading`}
              onClick={isMobile ? onClose : undefined}
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
            const isCompleted = w >= 1 && w <= 8;

            return (
              <AccordionSection
                key={w}
                title={`Week ${w}`}
                expanded={expandedSections[`week-${w}`] || isActive}
                onToggle={() => toggle(`week-${w}`)}
                href={weekPath}
                active={isActive}
                completed={isCompleted}
              />
            );
          })}

          {/* Practice Tests */}
          <AccordionSection
            title="Practice Tests (Objective)"
            expanded={expandedSections["practice"]}
            onToggle={() => toggle("practice")}
          >
            {courseId === "statistics_for_data_science_2" && (
              <SidebarLink
                href="https://drive.google.com/file/d/1cnQ32AWYL6DVosWFSgw-3IWmZkQ0dLrI/view?usp=drive_link"
                label="Quiz 2 - Question Paper"
                sublabel="Lesson"
                active={false}
                onClick={isMobile ? onClose : undefined}
              />
            )}
          </AccordionSection>

          {/* Supplementary Contents */}
          <AccordionSection
            title="Supplementary Contents"
            expanded={expandedSections["supplementary"]}
            onToggle={() => toggle("supplementary")}
          >
            <SidebarLink
              href="https://drive.google.com/drive/folders/1xjgelPNfh5QGKjnBxtjVYJwICG0Pkix_"
              label="Lecture PPTs/Slides"
              sublabel="Lesson"
              active={false}
              onClick={isMobile ? onClose : undefined}
            />
            <SidebarLink
              href="https://drive.google.com/drive/folders/1xjgelPNfh5QGKjnBxtjVYJwICG0Pkix_"
              label="Lecture Transcripts"
              sublabel="Lesson"
              active={false}
              onClick={isMobile ? onClose : undefined}
            />
            <SidebarLink
              href="#"
              label="Quiz 1 - Question Paper and Answer key"
              sublabel="Lesson"
              active={false}
              onClick={isMobile ? onClose : undefined}
            />
            {courseId === "statistics_for_data_science_2" && (
              <SidebarLink
                href="https://drive.google.com/drive/folders/1giM0HunaYBKNzTeXXK_XEYcDQl7iZECl?usp=sharing"
                label="Quiz 2 - Question Paper and Answer key"
                sublabel="Lesson"
                active={false}
                onClick={isMobile ? onClose : undefined}
              />
            )}
          </AccordionSection>
        </div>
      </div>
    </>
  );
}

function AccordionSection({
  title,
  expanded,
  onToggle,
  children,
  href,
  active,
  completed,
}: {
  title: string;
  expanded?: boolean;
  onToggle: () => void;
  children?: React.ReactNode;
  href?: string;
  active?: boolean;
  completed?: boolean;
}) {
  const header = (
    <div
      onClick={href ? undefined : onToggle}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "0 16px",
        height: expanded ? 64 : 48,
        borderBottom: "1px solid rgba(0,0,0,0.12)",
        cursor: "pointer",
        background: active ? "#f0f0ff" : "transparent",
        fontFamily: "Roboto, 'Helvetica Neue', sans-serif",
        transition: "height 0.2s ease",
      }}
    >
      {/* Circle indicator / green tick */}
      {completed ? (
        <svg style={{ width: 18, height: 18, flexShrink: 0 }} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" fill="#4caf50" />
          <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <div
          style={{
            width: 14,
            height: 14,
            borderRadius: "50%",
            border: `2px solid ${active ? "#7b1f1f" : "#bdbdbd"}`,
            background: active ? "#7b1f1f" : "transparent",
            flexShrink: 0,
          }}
        />
      )}
      <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: "rgba(0,0,0,0.87)" }}>
        {title}
      </span>
      {/* Chevron */}
      <svg
        style={{
          width: 20,
          height: 20,
          color: "rgba(0,0,0,0.54)",
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
        <div style={{ borderBottom: "1px solid rgba(0,0,0,0.12)" }}>
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
  onClick,
}: {
  href: string;
  label: string;
  sublabel?: string;
  active: boolean;
  gold?: boolean;
  onClick?: () => void;
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "12px 16px 12px 28px",
        textDecoration: "none",
        borderLeft: active ? "3px solid #7b1f1f" : "3px solid transparent",
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
        <p style={{ fontSize: 13, color: active ? "#7b1f1f" : "rgba(0,0,0,0.87)", margin: 0, fontWeight: active ? 500 : 400, fontFamily: "Roboto, 'Helvetica Neue', sans-serif" }}>
          {label}
        </p>
        {sublabel && (
          <p style={{ fontSize: 11, color: "#00897b", margin: "2px 0 0" }}>{sublabel}</p>
        )}
      </div>
    </a>
  );
}
