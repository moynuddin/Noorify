"use client";

import { useEffect, useState } from "react";
import { usePreferencesStore } from "../store/usePreferencesStore";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const theme = usePreferencesStore((state) => state.theme);

  useEffect(() => {
    setMounted(true);
    const applyTheme = () => {
      const root = window.document.documentElement;
      root.classList.remove("light", "dark");
      
      if (theme === "system") {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        root.classList.add(systemTheme);
      } else {
        root.classList.add(theme);
      }
    };

    applyTheme();
    
    // Listen to system changes if theme is system
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (theme === "system") applyTheme();
    };
    mediaQuery.addEventListener("change", handleChange);
    
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  // To prevent hydration mismatch, we can optionally render children directly
  // but it might flash lightly. Let's just render anyway.
  if (!mounted) {
    return <div className="invisible">{children}</div>;
  }

  return <>{children}</>;
}
