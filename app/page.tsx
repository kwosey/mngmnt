"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { concepts } from "@/lib/data";
import { getLearnedConcepts, getBookmarks, addBookmark, deleteBookmark } from "@/lib/storage";
import type { Bookmark } from "@/lib/storage";
import { JourneyTimeline } from "@/components/journey-timeline";
import { getRoleDay } from "@/lib/journey";

const ROLE_START = new Date("2026-04-10T00:00:00");

const PHASES = [
  {
    days: [1, 30],
    label: "Слушать и наблюдать",
    tip: "Задавай вопросы — не давай советов. Твоя цель сейчас понять, а не менять.",
    conceptId: "psychological-safety",
    conceptTitle: "Psychological Safety",
    color: "#8b5cf6",
  },
  {
    days: [31, 60],
    label: "Строить доверие",
    tip: "Первые честные разговоры. Говори прямо и с заботой — это и есть основа.",
    conceptId: "radical-candor",
    conceptTitle: "Radical Candor",
    color: "#3b82f6",
  },
  {
    days: [61, 90],
    label: "Действовать",
    tip: "Пора делать — первые решения требуют смелости. Делегируй осознанно.",
    conceptId: "ownership",
    conceptTitle: "Ownership",
    color: "#22c55e",
  },
];

function JourneyBanner() {
  const day = getRoleDay();

  if (day < 0) {
    const daysLeft = -day;
    const totalPre = Math.floor((ROLE_START.getTime() - new Date("2026-03-22T00:00:00").getTime()) / 86400000);
    const elapsed = totalPre - daysLeft;
    const pct = Math.max(0, Math.min(100, Math.round((elapsed / totalPre) * 100)));
    return (
      <div className="mb-5 animate-in rounded-[20px] p-5" style={{ background: "var(--card)", boxShadow: "0 2px 20px 0 rgba(80,70,140,0.08)" }}>
        <div className="flex items-start justify-between gap-4 mb-3">
          <div>
            <div className="text-xs font-medium mb-0.5" style={{ color: "var(--muted-foreground)" }}>До начала роли</div>
            <div className="text-2xl font-bold tabular-nums" style={{ color: "var(--foreground)" }}>
              {daysLeft} {daysLeft === 1 ? "день" : daysLeft < 5 ? "дня" : "дней"}
            </div>
          </div>
          <div className="text-xs font-medium shrink-0" style={{ color: "var(--muted-foreground)" }}>10 апреля</div>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden mb-4" style={{ background: "var(--secondary)" }}>
          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: "var(--accent)" }} />
        </div>
        <div style={{ borderTop: "1px solid var(--border)" }}>
          <JourneyTimeline />
        </div>
      </div>
    );
  }

  if (day >= 90) {
    return (
      <div className="mb-5 animate-in rounded-[20px] p-5" style={{ background: "var(--card)", boxShadow: "0 2px 20px 0 rgba(80,70,140,0.08)" }}>
        <div className="flex items-start justify-between gap-4 mb-3">
          <div>
            <div className="text-xs font-medium mb-1" style={{ color: "var(--muted-foreground)" }}>Первые 90 дней</div>
            <div className="text-base font-semibold" style={{ color: "#22c55e" }}>Пройдены</div>
          </div>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden mb-4" style={{ background: "var(--secondary)" }}>
          <div className="h-full rounded-full" style={{ width: "100%", background: "#22c55e" }} />
        </div>
        <div style={{ borderTop: "1px solid var(--border)" }}>
          <JourneyTimeline />
        </div>
      </div>
    );
  }

  const phase = PHASES.find(p => day + 1 >= p.days[0] && day + 1 <= p.days[1])!;
  const pct = Math.round(((day + 1) / 90) * 100);

  return (
    <div className="mb-5 animate-in rounded-[20px] p-5" style={{ background: "var(--card)", boxShadow: "0 2px 20px 0 rgba(80,70,140,0.08)" }}>
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <div className="text-xs font-medium mb-0.5" style={{ color: "var(--muted-foreground)" }}>Сейчас</div>
          <div className="text-lg font-bold" style={{ color: phase.color }}>{phase.label}</div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-xs font-medium mb-0.5" style={{ color: "var(--muted-foreground)" }}>из 90 дней</div>
          <div className="text-2xl font-bold tabular-nums" style={{ color: "var(--foreground)" }}>День {day + 1}</div>
        </div>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden mb-3" style={{ background: "var(--secondary)" }}>
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: phase.color }} />
      </div>
      <p className="text-xs mb-3" style={{ color: "var(--muted-foreground)" }}>{phase.tip}</p>
      <Link
        href={`/concept/${phase.conceptId}`}
        className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg transition-opacity hover:opacity-70"
        style={{ background: "var(--secondary)", color: "var(--foreground)" }}
      >
        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: phase.color }} />
        Концепт дня: {phase.conceptTitle} →
      </Link>
      <div className="mt-4" style={{ borderTop: "1px solid var(--border)" }}>
        <JourneyTimeline />
      </div>
    </div>
  );
}

const CONCEPT_COLORS = [
  "#22c55e",
  "#f97316",
  "#eab308",
  "#8b5cf6",
  "#3b82f6",
  "#ec4899",
  "#14b8a6",
  "#f43f5e",
];

function ConceptsIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

function BookmarkIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function BookmarksCard() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [adding, setAdding] = useState(false);
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    setBookmarks(getBookmarks());
  }, []);

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) return;
    const bm = addBookmark({ url: url.trim(), title: title.trim() || url.trim(), note: note.trim() });
    setBookmarks([bm, ...bookmarks]);
    setUrl("");
    setTitle("");
    setNote("");
    setAdding(false);
  }

  function handleDelete(id: string) {
    deleteBookmark(id);
    setBookmarks(bookmarks.filter(b => b.id !== id));
  }

  return (
    <div
      className="bento-bookmarks rounded-[20px] p-5 flex flex-col"
      style={{ background: "var(--card)", boxShadow: "0 2px 20px 0 rgba(80,70,140,0.08)" }}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="mb-2" style={{ color: "var(--accent)" }}>
            <BookmarkIcon />
          </div>
          <h2 className="text-base font-semibold" style={{ color: "var(--card-foreground)" }}>Закладки</h2>
          <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
            Полезные ссылки и материалы
          </p>
        </div>
        <button
          onClick={() => setAdding(!adding)}
          className="text-xs px-3 py-1.5 rounded-lg font-medium transition-opacity hover:opacity-70 shrink-0"
          style={{ background: "var(--secondary)", color: "var(--muted-foreground)" }}
        >
          {adding ? "Отмена" : "+ Добавить"}
        </button>
      </div>

      {adding && (
        <form onSubmit={handleAdd} className="mb-4 flex flex-col gap-2">
          <input
            type="url"
            placeholder="https://..."
            value={url}
            onChange={e => setUrl(e.target.value)}
            required
            className="w-full text-xs px-3 py-2 rounded-lg"
            style={{ background: "var(--secondary)", border: "1px solid var(--border)", color: "var(--foreground)" }}
          />
          <input
            type="text"
            placeholder="Название (необязательно)"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full text-xs px-3 py-2 rounded-lg"
            style={{ background: "var(--secondary)", border: "1px solid var(--border)", color: "var(--foreground)" }}
          />
          <input
            type="text"
            placeholder="Заметка (необязательно)"
            value={note}
            onChange={e => setNote(e.target.value)}
            className="w-full text-xs px-3 py-2 rounded-lg"
            style={{ background: "var(--secondary)", border: "1px solid var(--border)", color: "var(--foreground)" }}
          />
          <button
            type="submit"
            className="w-full text-xs px-3 py-2 rounded-lg font-medium"
            style={{ background: "var(--accent)", color: "var(--accent-foreground)" }}
          >
            Сохранить
          </button>
        </form>
      )}

      {bookmarks.length === 0 && !adding ? (
        <div className="flex-1 flex items-center justify-center py-8">
          <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>Нет сохранённых закладок</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2 overflow-y-auto" style={{ maxHeight: "340px" }}>
          {bookmarks.map(bm => (
            <div
              key={bm.id}
              className="flex items-start gap-2 rounded-xl px-3 py-2.5"
              style={{ border: "1px solid var(--border)" }}
            >
              <div className="flex-1 min-w-0">
                <a
                  href={bm.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium truncate block hover:underline"
                  style={{ color: "var(--accent)" }}
                >
                  {bm.title || bm.url}
                </a>
                {bm.note && (
                  <p className="text-xs mt-0.5 truncate" style={{ color: "var(--muted-foreground)" }}>
                    {bm.note}
                  </p>
                )}
                <p className="text-xs mt-0.5" style={{ color: "var(--border)" }}>
                  {bm.date}
                </p>
              </div>
              <button
                onClick={() => handleDelete(bm.id)}
                className="text-xs shrink-0 hover:opacity-70 transition-opacity"
                style={{ color: "var(--muted-foreground)" }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function HomePage() {
  const [learned, setLearned] = useState<Set<string>>(new Set());

  useEffect(() => {
    setLearned(getLearnedConcepts());
  }, []);

  return (
    <main className="min-h-screen" style={{ background: "var(--background)" }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">

        <JourneyBanner />

        <div className="bento-grid animate-in" style={{ animationDelay: "40ms" }}>

          {/* ── Concepts — left 2 cols ── */}
          <div
            className="bento-concepts rounded-[20px] p-5 sm:p-6 flex flex-col overflow-hidden"
            style={{ background: "var(--card)", boxShadow: "0 2px 20px 0 rgba(80,70,140,0.08)" }}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="mb-2" style={{ color: "var(--accent)" }}>
                  <ConceptsIcon />
                </div>
                <h2 className="text-base font-semibold" style={{ color: "var(--card-foreground)" }}>Концепты</h2>
                <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                  Управленческие практики и инструменты
                </p>
              </div>
            </div>

            <div className="concepts-list flex flex-col gap-2 overflow-y-auto">
              {concepts.map((concept, i) => {
                const isLearned = learned.has(concept.id);
                const color = CONCEPT_COLORS[i % CONCEPT_COLORS.length];
                return (
                  <Link key={concept.id} href={`/concept/${concept.id}`} className="group block">
                    <div
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors min-w-0 overflow-hidden"
                      style={{
                        border: "1px solid var(--border)",
                        background: isLearned ? "var(--secondary)" : "transparent",
                      }}
                    >
                      <div
                        className="w-[3px] shrink-0 rounded-full self-stretch"
                        style={{ background: color, minHeight: "36px" }}
                      />
                      <div className="flex-1 min-w-0">
                        <div
                          className="text-sm font-medium truncate"
                          style={{ color: isLearned ? "var(--muted-foreground)" : "var(--card-foreground)" }}
                        >
                          {concept.title}
                        </div>
                        <div className="text-xs truncate mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                          {concept.shortDescription}
                        </div>
                      </div>
                      <span className="text-sm shrink-0" style={{ color: isLearned ? color : "var(--border)" }}>
                        {isLearned ? "✓" : "→"}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* ── Bookmarks — right col ── */}
          <BookmarksCard />

        </div>
      </div>
    </main>
  );
}
