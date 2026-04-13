"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";

interface AuthContextType {
  isLoggedIn: boolean;
  userEmail: string | null;
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  userEmail: null,
  login: () => ({ success: false }),
  logout: () => {},
});

const VALID_EMAIL = "25f3000406@ds.study.iitm.ac.in";
const VALID_PASSWORD = "Anuj&424614";
const AUTH_KEY = "iitm_auth";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const stored = localStorage.getItem(AUTH_KEY);
    if (stored === VALID_EMAIL) {
      setIsLoggedIn(true);
      setUserEmail(stored);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading && !isLoggedIn && pathname !== "/login") {
      router.replace("/login");
    }
  }, [loading, isLoggedIn, pathname, router]);

  function login(email: string, password: string): { success: boolean; error?: string } {
    if (email === VALID_EMAIL && password === VALID_PASSWORD) {
      localStorage.setItem(AUTH_KEY, email);
      setIsLoggedIn(true);
      setUserEmail(email);
      return { success: true };
    }
    return { success: false, error: "Invalid user details" };
  }

  function logout() {
    localStorage.removeItem(AUTH_KEY);
    setIsLoggedIn(false);
    setUserEmail(null);
    router.replace("/login");
  }

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f5f5f5" }}>
        <div style={{ width: 32, height: 32, border: "3px solid #e0e0e0", borderTopColor: "#aa3535", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!isLoggedIn && pathname !== "/login") {
    return null;
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, userEmail, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
