"use client";

import { useRef, useState } from "react";
import type { Anchor } from "@/lib/anchors";

interface AnchorCardProps {
  anchor: Anchor;
  onUpdate: (id: string, text: string) => void;
  onDelete: (id: string) => void;
  onCyclePriority: (id: string) => void;
}

const priorityStyles: Record<Anchor["priority"], {
  bg: string;
  borderLeft: string;
  dot: string;
}> = {
  0: { bg: "transparent", borderLeft: "3px solid transparent", dot: "var(--muted-foreground)" },
  1: { bg: "color-mix(in srgb, var(--primary) 6%, transparent)", borderLeft: "3px solid color-mix(in srgb, var(--primary) 40%, transparent)", dot: "var(--primary)" },
  2: { bg: "color-mix(in srgb, var(--primary) 14%, transparent)", borderLeft: "3px solid var(--primary)", dot: "var(--primary)" },
};

export function AnchorCard({ anchor, onUpdate, onDelete, onCyclePriority }: AnchorCardProps) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(anchor.text);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  function startEdit() {
    setText(anchor.text);
    setEditing(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  function commit() {
    setEditing(false);
    const trimmed = text.trim();
    if (!trimmed) {
      onDelete(anchor.id);
    } else if (trimmed !== anchor.text) {
      onUpdate(anchor.id, trimmed);
    }
  }

  const ps = priorityStyles[anchor.priority];

  return (
    <div
      className="py-3 px-3 flex items-start gap-3 transition-colors duration-200"
      style={{
        borderBottom: "1px solid var(--border)",
        background: ps.bg,
        borderLeft: ps.borderLeft,
      }}
    >
      <div className="flex-1 min-w-0">
        {editing ? (
          <textarea
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); commit(); }
              if (e.key === "Escape") { setEditing(false); setText(anchor.text); }
            }}
            rows={2}
            className="w-full bg-transparent outline-none text-sm resize-none"
            style={{
              color: "var(--foreground)",
              borderBottom: "1px solid var(--accent)",
              paddingBottom: "2px",
            }}
          />
        ) : (
          <span
            className="text-sm leading-snug cursor-text block"
            style={{ color: "var(--foreground)" }}
            onClick={startEdit}
          >
            {anchor.text}
          </span>
        )}
      </div>

      <button
        onClick={() => onCyclePriority(anchor.id)}
        className="shrink-0 flex items-center gap-0.5 pt-0.5 transition-opacity hover:opacity-70"
        aria-label={`Приоритет: ${anchor.priority}`}
        title={`Важность: ${anchor.priority}/2`}
      >
        {[0, 1].map((i) => (
          <span
            key={i}
            className="inline-block rounded-full transition-all duration-200"
            style={{
              width: "6px",
              height: "6px",
              background: i < anchor.priority ? ps.dot : "var(--border)",
            }}
          />
        ))}
      </button>
    </div>
  );
}
