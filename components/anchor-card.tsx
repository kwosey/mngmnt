"use client";

import { useRef, useState } from "react";
import type { Anchor } from "@/lib/anchors";

interface AnchorCardProps {
  anchor: Anchor;
  onUpdate: (id: string, text: string) => void;
  onDelete: (id: string) => void;
}

export function AnchorCard({ anchor, onUpdate, onDelete }: AnchorCardProps) {
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

  return (
    <div
      className="py-3"
      style={{ borderBottom: "1px solid var(--border)" }}
    >
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
  );
}
