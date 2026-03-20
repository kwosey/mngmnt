"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "./ThemeProvider";

const navLinks = [
  { href: "/", label: "Концепты", shortLabel: "Концепты", icon: "○" },
  { href: "/flashcards", label: "Карточки", shortLabel: "Карточки", icon: "▣" },
  { href: "/journal", label: "Дневник", shortLabel: "Дневник", icon: "✎" },
  { href: "/situation", label: "Ситуация", shortLabel: "Ситуация", icon: "◆" },
];

export function Header() {
  const pathname = usePathname();
  const { theme, toggle } = useTheme();

  function isActive(href: string) {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  }

  return (
    <>
      {/* Desktop top header */}
      <header className="border-b border-border sticky top-0 z-50 bg-background/90 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          {/* Logo — visible on mobile */}
          <span className="sm:hidden text-sm font-semibold tracking-tight text-foreground">
            Management OS
          </span>

          {/* Desktop nav */}
          <nav className="hidden sm:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                    active
                      ? "text-foreground bg-secondary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <button
            onClick={toggle}
            aria-label="Переключить тему"
            className="w-8 h-8 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors text-sm"
          >
            {theme === "dark" ? "☀" : "◑"}
          </button>
        </div>
      </header>

      {/* Mobile bottom navigation */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur-sm">
        <div className="flex h-14">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors ${
                  active ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                <span className="text-base leading-none">{link.icon}</span>
                <span className="text-[10px] leading-none">{link.shortLabel}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
