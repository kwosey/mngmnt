"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAnchors, getRandomAnchor, type Anchor } from "@/lib/anchors";

export function AnchorPreview() {
  const [anchor, setAnchor] = useState<Anchor | null>(null);

  useEffect(() => {
    const anchors = getAnchors();
    setAnchor(getRandomAnchor(anchors));
  }, []);

  if (!anchor) return null;

  return (
    <Link href="/anchors" className="block mb-6 group" style={{ textDecoration: "none" }}>
      <div
        className="rounded-lg transition-opacity group-hover:opacity-70"
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
          className="text-[10px] font-semibold uppercase tracking-widest block mb-1.5"
          style={{ color: "var(--primary)" }}
        >
          Сейчас держу в голове
        </span>
        <span
          className="text-sm leading-snug"
          style={{ color: "var(--foreground)" }}
        >
          {anchor.text}
        </span>
      </div>
    </Link>
  );
}
