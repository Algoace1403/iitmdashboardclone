"use client";

import { useState, useEffect } from "react";

export function useIsMobile(breakpoint = 768): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function check() {
      setIsMobile(window.innerWidth < breakpoint);
    }
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);

  return isMobile;
}

export function useIsTablet(): boolean {
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    function check() {
      const w = window.innerWidth;
      setIsTablet(w >= 768 && w < 1024);
    }
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return isTablet;
}
