"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "./ThemeProvider";

const navLinks = [
  { href: "/", label: "Концепты" },
  { href: "/flashcards", label: "Карточки" },
  { href: "/journal", label: "Дневник" },
  { href: "/situation", label: "Ситуация" },
];

export function Header() {
  const pathname = usePathname();
  const { theme, toggle } = useTheme();

  return (
    <header className="border-b border-border sticky top-0 z-50 bg-background/90 backdrop-blur-sm">
      <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
        <nav className="flex items-center gap-1">
          {navLinks.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
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
  );
}
