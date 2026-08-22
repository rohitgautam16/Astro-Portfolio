/**
 * ThemeToggle - Standalone React island.
 * Reads/writes theme from localStorage + classList directly (no Context needed).
 */
import { useCallback, useEffect, useState } from "react";

type Theme = "dark" | "light";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("light");

  const syncTheme = useCallback(() => {
    const isDark = document.documentElement.classList.contains("dark");
    const stored = window.localStorage.getItem("theme");
    const resolved: Theme = stored === "dark" || isDark ? "dark" : "light";
    setTheme(resolved);
  }, []);

  useEffect(() => {
    syncTheme();
    document.addEventListener("astro:after-swap", syncTheme);
    window.addEventListener("storage", syncTheme);
    return () => {
      document.removeEventListener("astro:after-swap", syncTheme);
      window.removeEventListener("storage", syncTheme);
    };
  }, [syncTheme]);

  const toggle = useCallback(() => {
    setTheme((current) => {
      const next = current === "light" ? "dark" : "light";
      window.localStorage.setItem("theme", next);
      document.documentElement.classList.toggle("dark", next === "dark");
      return next;
    });
  }, []);

  return { theme, toggle };
}
