"use client";

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";

const ThemeContext = createContext({
  dark: false,
  toggle: () => {},
});

export function useThemeContext() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("wordsite_theme");
    if (stored === "dark") {
      setDark(true);
    } else if (!stored) {
      const prefers = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setDark(prefers);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("wordsite_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("wordsite_theme", "light");
    }
  }, [dark, mounted]);

  const toggle = useCallback(() => setDark((p) => !p), []);

  return (
    <ThemeContext.Provider value={{ dark, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}
