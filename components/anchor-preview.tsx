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
        className="transition-opacity group-hover:opacity-70"
        style={{ paddingLeft: "26px" }}
      >
        <span
          className="text-[10px] font-medium uppercase tracking-wide block mb-1"
          style={{ color: "var(--muted-foreground)" }}
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
