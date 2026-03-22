"use client";

import { useTheme } from "./ThemeProvider";

export function Header() {
  const { theme, toggle } = useTheme();

  return (
    <header className="border-b border-border sticky top-0 z-50 bg-background/90 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <span className="text-sm font-semibold tracking-tight" style={{ color: "var(--foreground)" }}>
          Management OS
        </span>
        <button
          onClick={toggle}
          aria-label="Переключить тему"
          className="w-8 h-8 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors text-sm"
        >
          {theme === "dark" ? "☀" : "◑"}
        </button>
      </div>
    </header>
  );
}
