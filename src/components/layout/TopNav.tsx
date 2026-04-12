"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/lib/auth";

interface TopNavProps {
  studentName: string;
}

export function TopNav({ studentName }: TopNavProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const { logout } = useAuth();

  return (
    <header
      style={{
        height: 56,
        background: "#f8f8f8",
        display: "flex",
        alignItems: "center",
        padding: "0 12px",
        position: "sticky",
        top: 0,
        zIndex: 50,
        boxShadow: "0 1px 1px 1px lightgray",
      }}
    >
      {/* Left: Logo in bordered box — matches real portal */}
      <Link href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none", flexShrink: 0 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            border: "1px solid #ccc",
            borderRadius: 4,
            padding: "2px 8px",
            background: "white",
          }}
        >
          <img
            src="/iitm-logo.svg"
            alt="IIT Madras"
            style={{ height: 40 }}
          />
        </div>
      </Link>

      {/* Hamburger icon */}
      <button
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 8,
          marginLeft: 8,
          display: "flex",
          alignItems: "center",
        }}
      >
        <svg style={{ width: 20, height: 20, color: "#525f7f" }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Center: Student Name */}
      <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px 8px",
              borderRadius: 4,
            }}
          >
            <svg style={{ width: 16, height: 16, color: "#6A6A6A" }} fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
            </svg>
            <span style={{ fontSize: 14, fontWeight: 600, color: "#323232" }}>{studentName}</span>
          </button>
          {profileOpen && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: "50%",
                transform: "translateX(-50%)",
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
                style={{ display: "block", padding: "8px 16px", fontSize: 13, color: "#525f7f", textDecoration: "none" }}
                onClick={() => setProfileOpen(false)}
              >
                View or Edit Profile
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Right */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 13, flexShrink: 0 }}>
        <Link href="/updates" style={{ color: "#800020", fontWeight: 600, textDecoration: "none" }}>
          Latest Updates
        </Link>
        <button
          onClick={logout}
          style={{
            color: "#800020",
            fontWeight: 600,
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 13,
          }}
        >
          SIGN OUT
        </button>
      </div>
    </header>
  );
}
