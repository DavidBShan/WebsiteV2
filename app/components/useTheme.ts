"use client";

import { useCallback, useEffect, useState } from "react";

// dark mode is desktop-only, so the toggle never half-renders on phones.
// matches the tailwind `sm` breakpoint used for the toggle's layout.
const DESKTOP_QUERY = "(min-width: 640px)";

const applyTheme = (isDark: boolean) => {
  document.documentElement.classList.toggle("dark", isDark);
};

const readStoredTheme = () => localStorage.getItem("theme") === "dark";

/**
 * Keeps the `dark` class on <html> in sync with the stored preference.
 * Below the desktop breakpoint the site is always light: the stored
 * preference is preserved but not applied, so resizing back up restores it.
 */
export function useTheme() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(DESKTOP_QUERY);

    const sync = () => {
      const desktop = query.matches;
      const dark = desktop && readStoredTheme();

      setIsDesktop(desktop);
      setIsDarkMode(dark);
      applyTheme(dark);
    };

    sync();
    query.addEventListener("change", sync);

    return () => query.removeEventListener("change", sync);
  }, []);

  const toggleTheme = useCallback(() => {
    if (!isDesktop) return;

    const next = !isDarkMode;
    setIsDarkMode(next);
    localStorage.setItem("theme", next ? "dark" : "light");
    applyTheme(next);
  }, [isDarkMode, isDesktop]);

  return { isDarkMode, isDesktop, toggleTheme };
}
