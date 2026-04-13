"use client";

import Link from "next/link";
import { useIsMobile } from "@/lib/useIsMobile";

interface SeekToolbarProps {
  courseName?: string;
  onMenuToggle?: () => void;
  showMenuButton?: boolean;
}

export function SeekToolbar({ courseName, onMenuToggle, showMenuButton }: SeekToolbarProps) {
  const isMobile = useIsMobile();

  return (
    <header
      style={{
        height: 64,
        backgroundColor: "#7b1f1f",
        color: "#ffffff",
        display: "flex",
        alignItems: "center",
        paddingLeft: isMobile ? 8 : 16,
        paddingRight: isMobile ? 8 : 16,
        position: "sticky",
        top: 0,
        zIndex: 50,
        boxShadow: "0px 2px 4px -1px rgba(0,0,0,.2), 0px 4px 5px 0px rgba(0,0,0,.14), 0px 1px 10px 0px rgba(0,0,0,.12)",
        fontFamily: "Roboto, 'Helvetica Neue', sans-serif",
        gap: 8,
      }}
    >
      {/* Hamburger (mobile) */}
      {showMenuButton && (
        <button
          onClick={onMenuToggle}
          style={{
            background: "none",
            border: "none",
            color: "#ffffff",
            cursor: "pointer",
            padding: 4,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
          }}
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}

      {/* Left: Logo + Brand */}
      <Link
        href="/seek"
        style={{
          display: "flex",
          alignItems: "center",
          gap: isMobile ? 8 : 12,
          textDecoration: "none",
          color: "inherit",
          minWidth: 0,
          overflow: "hidden",
        }}
      >
        <img src="/iitm-seal.svg" alt="IIT Madras" style={{ width: isMobile ? 32 : 40, height: isMobile ? 32 : 40, flexShrink: 0, borderRadius: "50%" }} />
        <span
          style={{
            fontSize: isMobile ? 16 : 20,
            fontWeight: 500,
            letterSpacing: "0.0125em",
            lineHeight: "32px",
            color: "#ffffff",
            flexShrink: 0,
          }}
        >
          IIT Madras
        </span>
        {courseName && !isMobile && (
          <>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>|</span>
            <span
              style={{
                fontSize: 14,
                fontWeight: 400,
                color: "rgba(255,255,255,0.8)",
                letterSpacing: "0.0125em",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {courseName}
            </span>
          </>
        )}
      </Link>

      <div style={{ flex: 1 }} />

      {/* Right: Icons */}
      <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
        {/* Bell icon */}
        <button
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "none",
            border: "none",
            color: "#ffffff",
            cursor: "pointer",
          }}
        >
          <svg style={{ width: 24, height: 24 }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>
        {/* Profile */}
        <button
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "none",
            border: "none",
            color: "#ffffff",
            cursor: "pointer",
          }}
        >
          <svg style={{ width: 24, height: 24 }} fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
          </svg>
        </button>
      </div>
    </header>
  );
}
