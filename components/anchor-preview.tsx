"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAnchors, getRandomAnchor, type Anchor } from "@/lib/anchors";

export function AnchorPreview() {
  const [anchor, setAnchor] = useState<Anchor | null>(null);
  const [anchors, setAnchors] = useState<Anchor[]>([]);

  useEffect(() => {
    const list = getAnchors();
    setAnchors(list);
    setAnchor(getRandomAnchor(list));
  }, []);

  function refresh(e: React.MouseEvent) {
    e.preventDefault();
    const next = getRandomAnchor(anchors.filter((a) => a.id !== anchor?.id));
    if (next) setAnchor(next);
  }

  if (!anchor) return null;

  return (
    <div className="block mb-6">
      <Link href="/anchors" style={{ textDecoration: "none" }}>
        <div
          className="rounded-lg group transition-opacity hover:opacity-70"
          style={{
            paddingLeft: "16px",
            paddingRight: "16px",
            paddingTop: "12px",
            paddingBottom: "12px",
            borderLeft: "3px solid var(--primary)",
            background: "color-mix(in srgb, var(--primary) 8%, transparent)",
          }}
        >
          <span
            className="text-sm leading-snug"
            style={{ color: "var(--foreground)" }}
          >
            {anchor.text}
          </span>
        </div>
      </Link>
      {anchors.length > 1 && (
        <button
          onClick={refresh}
          className="mt-1.5 text-[11px] opacity-40 hover:opacity-70 transition-opacity"
          style={{ color: "var(--foreground)", background: "none", border: "none", cursor: "pointer", padding: 0 }}
        >
          обновить
        </button>
      )}
    </div>
  );
}
