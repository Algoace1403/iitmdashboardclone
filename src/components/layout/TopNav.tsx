"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/lib/auth";

interface TopNavProps {
  studentName: string;
  onMenuToggle?: () => void;
  showMenuButton?: boolean;
}

export function TopNav({ studentName, onMenuToggle, showMenuButton }: TopNavProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const { logout } = useAuth();

  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: showMenuButton ? "10px 12px" : "10px 36px",
        backgroundColor: "#efefef",
        boxShadow: "0 1px 1px 1px lightgray",
        position: "sticky",
        top: 0,
        zIndex: 20,
        height: 56,
        gap: 8,
      }}
    >
      {/* Hamburger (mobile) */}
      {showMenuButton && (
        <button
          onClick={onMenuToggle}
          style={{
            background: "none",
            border: "1px solid #ddd",
            borderRadius: 4,
            padding: "4px 8px",
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          <svg width="20" height="20" fill="none" stroke="#525f7f" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}

      {/* Left: Logo */}
      <Link href="/" style={{ marginRight: "auto", flexShrink: 0 }}>
        <img
          src="/iitm-logo.svg"
          alt="IIT Madras BS Degree Programme"
          style={{ height: showMenuButton ? 40 : 58 }}
        />
      </Link>

      {/* Right: Student name + links */}
      <div style={{ display: "flex", gap: showMenuButton ? 8 : 16, alignItems: "center", flexShrink: 0 }}>
        {/* Student name with dropdown */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              fontWeight: 600,
              fontSize: showMenuButton ? 13 : 16,
              color: "#000",
            }}
          >
            <svg width="16" height="16" fill="#525f7f" viewBox="0 0 20 20">
              <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
            </svg>
            {!showMenuButton && studentName}
            <svg width="10" height="10" fill="#525f7f" viewBox="0 0 20 20" style={{ marginLeft: 2 }}>
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          {profileOpen && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                right: 0,
                marginTop: 4,
                background: "white",
                border: "1px solid #e0e0e0",
                borderRadius: 4,
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                padding: "4px 0",
                minWidth: 180,
                zIndex: 50,
              }}
            >
              <Link
                href="/profile"
                style={{ display: "block", padding: "8px 16px", fontSize: 14, color: "#525f7f", textDecoration: "none" }}
                onClick={() => setProfileOpen(false)}
              >
                View or Edit Profile
              </Link>
            </div>
          )}
        </div>

        <span style={{ color: "#ccc" }}>|</span>

        <Link
          href="/updates"
          style={{
            fontWeight: 600,
            fontSize: showMenuButton ? 12 : 14,
            color: "#aa3535",
            textDecoration: "none",
            whiteSpace: "nowrap",
          }}
        >
          {showMenuButton ? "Updates" : "Latest Updates"}
        </Link>

        <span style={{ color: "#ccc" }}>|</span>

        <button
          onClick={logout}
          style={{
            fontWeight: 600,
            fontSize: showMenuButton ? 12 : 14,
            color: "#aa3535",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            whiteSpace: "nowrap",
          }}
        >
          SIGN OUT
        </button>
      </div>
    </header>
  );
}
