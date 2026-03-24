"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { RefreshCw } from "lucide-react";
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
      <div
        className="rounded-lg flex items-center gap-3"
        style={{
          paddingLeft: "16px",
          paddingRight: "12px",
          paddingTop: "12px",
          paddingBottom: "12px",
          borderLeft: "3px solid var(--primary)",
          background: "color-mix(in srgb, var(--primary) 8%, transparent)",
        }}
      >
        <Link href="/anchors" className="flex-1 hover:opacity-70 transition-opacity" style={{ textDecoration: "none" }}>
          <span
            className="text-sm leading-snug"
            style={{ color: "var(--foreground)" }}
          >
            {anchor.text}
          </span>
        </Link>
        {anchors.length > 1 && (
          <button
            onClick={refresh}
            className="shrink-0 opacity-30 hover:opacity-70 transition-opacity"
            style={{ background: "none", border: "none", cursor: "pointer", padding: "2px", color: "var(--foreground)" }}
          >
            <RefreshCw size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
