"use client";

import type { Anchor } from "@/lib/anchors";

interface AnchorCardProps {
  anchor: Anchor;
  onDelete: (id: string) => void;
}

export function AnchorCard({ anchor, onDelete }: AnchorCardProps) {
  return (
    <div
      className="group flex items-start justify-between gap-4 py-3"
      style={{ borderBottom: "1px solid var(--border)" }}
    >
      <span className="text-sm leading-snug flex-1" style={{ color: "var(--foreground)" }}>
        {anchor.text}
      </span>
      <button
        onClick={() => onDelete(anchor.id)}
        className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-xs"
        style={{ color: "var(--muted-foreground)" }}
        aria-label="Удалить якорь"
      >
        ✕
      </button>
    </div>
  );
}
