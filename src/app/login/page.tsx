"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/lib/auth";

const announcements = [
  "Welcome to the IIT Madras BS Degree Programme! Access your courses, assignments, and grades from the dashboard.",
  "End Term Exam registrations are now open. Check Hall Ticket & Exam Cities for details.",
  "New courses for January 2026 term are now available. Complete your course registration.",
  "POSH Training is mandatory for all students. Please complete it at the earliest.",
  "Check the Academic Calendar for important dates and deadlines.",
];

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoggedIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect
  if (isLoggedIn) {
    router.replace("/");
    return null;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      const result = login(email, password);
      if (result.success) {
        router.replace("/");
      } else {
        setError(result.error || "Invalid user details");
        setLoading(false);
      }
    }, 500);
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Top Navbar */}
      <header
        style={{
          height: 56,
          background: "#efefef",
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          boxShadow: "0 1px 1px 1px lightgray",
          flexShrink: 0,
        }}
      >
        <img src="/iitm-logo.svg" alt="IIT Madras BS Degree Programme" style={{ height: 48 }} />
      </header>

      {/* Gradient background */}
      <div
        style={{
          flex: 1,
          background: "linear-gradient(207deg, #A0322C 0%, #EBC133 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "32px 16px",
        }}
      >
        <div style={{ width: "100%", maxWidth: 960, display: "flex", gap: 32, alignItems: "flex-start", flexWrap: "wrap" }}>
          {/* Login Card */}
          <div
            style={{
              background: "white",
              borderRadius: 16,
              padding: 32,
              boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
              width: "100%",
              maxWidth: 380,
              flexShrink: 0,
            }}
          >
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#32325d", marginBottom: 8, marginTop: 0 }}>
              Student Sign In
            </h2>
            <p style={{ fontSize: 13, color: "#525f7f", marginBottom: 24, lineHeight: 1.6 }}>
              Sign-in using your registered email ID and password to access your course dashboard.
            </p>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#525f7f", marginBottom: 6 }}>
                  Email ID
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="yourrollno@ds.study.iitm.ac.in"
                  required
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "1px solid #d1d5db",
                    borderRadius: 6,
                    fontSize: 14,
                    outline: "none",
                    boxSizing: "border-box",
                    transition: "border-color 0.15s",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#aa3535")}
                  onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
                />
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#525f7f", marginBottom: 6 }}>
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "1px solid #d1d5db",
                    borderRadius: 6,
                    fontSize: 14,
                    outline: "none",
                    boxSizing: "border-box",
                    transition: "border-color 0.15s",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#aa3535")}
                  onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
                />
              </div>

              {/* Error message */}
              {error && (
                <div
                  style={{
                    background: "#fef3f2",
                    border: "1px solid #fecaca",
                    borderRadius: 6,
                    padding: "10px 12px",
                    marginBottom: 16,
                    fontSize: 13,
                    color: "#dc2626",
                    fontWeight: 500,
                  }}
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "10px 16px",
                  background: loading ? "#c0756f" : "#aa3535",
                  color: "white",
                  border: "none",
                  borderRadius: 6,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: loading ? "not-allowed" : "pointer",
                  transition: "background 0.15s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                {loading && (
                  <div
                    style={{
                      width: 16,
                      height: 16,
                      border: "2px solid rgba(255,255,255,0.3)",
                      borderTopColor: "white",
                      borderRadius: "50%",
                      animation: "spin 0.8s linear infinite",
                    }}
                  />
                )}
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid #f1f1f1" }}>
              <p style={{ fontSize: 11, color: "#8898aa", textAlign: "center", margin: 0 }}>
                IIT Madras BS Degree Programme - Online Student Portal
              </p>
            </div>
          </div>

          {/* Announcements */}
          <div style={{ flex: 1, minWidth: 280 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "white", marginBottom: 16, marginTop: 0 }}>
              Latest Updates / Announcements
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {announcements.map((text, i) => (
                <div
                  key={i}
                  style={{
                    background: "rgba(255,255,255,0.15)",
                    backdropFilter: "blur(4px)",
                    borderRadius: 8,
                    padding: 16,
                    fontSize: 13,
                    color: "rgba(255,255,255,0.9)",
                    lineHeight: 1.6,
                  }}
                >
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer
        style={{
          background: "#aa3535",
          color: "white",
          padding: "16px 24px",
          flexShrink: 0,
        }}
      >
        <div style={{ maxWidth: 960, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, flexWrap: "wrap", gap: 8 }}>
          <span>IIT Madras BS Degree Programme</span>
          <span style={{ color: "rgba(255,255,255,0.7)" }}>Contact: 7850-999966</span>
        </div>
      </footer>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
