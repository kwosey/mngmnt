"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { getAnchors, addAnchor, updateAnchor, deleteAnchor, type Anchor } from "@/lib/anchors";
import { AnchorCard } from "@/components/anchor-card";

export default function AnchorsPage() {
  const [anchors, setAnchors] = useState<Anchor[]>([]);
  const [adding, setAdding] = useState(false);
  const [newText, setNewText] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setAnchors(getAnchors());
  }, []);

  useEffect(() => {
    if (adding) inputRef.current?.focus();
  }, [adding]);

  function handleAdd() {
    const text = newText.trim();
    setAdding(false);
    setNewText("");
    if (!text) return;
    const anchor = addAnchor(text);
    setAnchors((prev) => [...prev, anchor]);
  }

  function handleUpdate(id: string, text: string) {
    updateAnchor(id, text);
    setAnchors((prev) => prev.map((a) => (a.id === id ? { ...a, text } : a)));
  }

  function handleDelete(id: string) {
    deleteAnchor(id);
    setAnchors((prev) => prev.filter((a) => a.id !== id));
  }

  return (
    <main className="min-h-screen" style={{ background: "var(--background)" }}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-10">

        {/* Back */}
        <Link
          href="/"
          className="text-xs transition-opacity hover:opacity-70 mb-8 inline-block"
          style={{ color: "var(--muted-foreground)" }}
        >
          ← назад
        </Link>

        <h1
          className="text-base font-semibold mb-1"
          style={{ color: "var(--foreground)" }}
        >
          Якоря
        </h1>
        <p
          className="text-xs mb-8"
          style={{ color: "var(--muted-foreground)" }}
        >
          Короткие мысли, которые держишь в голове прямо сейчас.
        </p>

        {/* List */}
        <div>
          {anchors.map((anchor) => (
            <AnchorCard key={anchor.id} anchor={anchor} onUpdate={handleUpdate} onDelete={handleDelete} />
          ))}
        </div>

        {/* Add new */}
        {adding ? (
          <div className="mt-4">
            <textarea
              ref={inputRef}
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleAdd(); }
                if (e.key === "Escape") { setAdding(false); setNewText(""); }
              }}
              onBlur={handleAdd}
              placeholder="Коротко — 1–2 строки..."
              rows={2}
              className="w-full bg-transparent outline-none text-sm resize-none"
              style={{
                color: "var(--foreground)",
                borderBottom: "1px solid var(--accent)",
                paddingBottom: "4px",
              }}
            />
          </div>
        ) : (
          <button
            onClick={() => setAdding(true)}
            className="mt-5 text-xs transition-opacity hover:opacity-70 flex items-center gap-1"
            style={{ color: "var(--muted-foreground)" }}
          >
            <span style={{ fontSize: "14px", lineHeight: 1 }}>+</span> добавить якорь
          </button>
        )}
      </div>
    </main>
  );
}
