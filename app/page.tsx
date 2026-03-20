"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { concepts } from "@/lib/data";
import { getLearnedConcepts, getJournalStreak, getTodayEntry } from "@/lib/storage";

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

function JournalIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}

function FlashcardsIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" />
    </svg>
  );
}

function ConceptsIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

function SituationIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

export default function HomePage() {
  const [learned, setLearned] = useState<Set<string>>(new Set());
  const [streak, setStreak] = useState(0);
  const [hasToday, setHasToday] = useState(false);

  useEffect(() => {
    setLearned(getLearnedConcepts());
    setStreak(getJournalStreak());
    setHasToday(!!getTodayEntry());
  }, []);

  const learnedCount = learned.size;
  const totalCount = concepts.length;
  const progressPct = totalCount > 0 ? Math.round((learnedCount / totalCount) * 100) : 0;

  return (
    <main className="min-h-screen" style={{ background: "var(--background)" }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">

        <div className="mb-6 animate-in">
          <h1 className="text-xl font-semibold tracking-tight" style={{ color: "var(--foreground)" }}>
            Management OS
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--muted-foreground)" }}>
            Персональный инструмент нового тимлида
          </p>
        </div>

        <div className="bento-grid animate-in" style={{ animationDelay: "40ms" }}>
          {/* ── Concepts — big card, left 2 cols × 2 rows ── */}
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
              <Link
                href="/flashcards"
                className="text-xs px-3 py-1.5 rounded-lg font-medium transition-opacity hover:opacity-70 shrink-0"
                style={{ background: "var(--secondary)", color: "var(--muted-foreground)" }}
              >
                Учить →
              </Link>
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

          {/* ── Journal — top right ── */}
          <Link href="/journal" className="bento-journal block group">
            <div
              className="rounded-[20px] p-5 flex flex-col transition-transform group-hover:scale-[1.02]"
              style={{ background: "var(--card)", boxShadow: "0 2px 20px 0 rgba(80,70,140,0.08)", minHeight: "200px" }}
            >
              <div className="mb-2" style={{ color: "var(--accent)" }}>
                <JournalIcon />
              </div>
              <h2 className="text-base font-semibold" style={{ color: "var(--card-foreground)" }}>Дневник</h2>
              <p className="text-xs mt-0.5 mb-4" style={{ color: "var(--muted-foreground)" }}>
                Рефлексия и ежедневные вопросы
              </p>

              <div className="mt-auto">
                <div
                  className="text-4xl font-bold tabular-nums mb-0.5"
                  style={{ color: streak > 0 ? "var(--accent)" : "var(--muted-foreground)" }}
                >
                  {streak > 0 ? streak : "—"}
                </div>
                <div className="text-xs mb-3" style={{ color: "var(--muted-foreground)" }}>
                  {streak > 0
                    ? streak === 1 ? "день подряд" : streak < 5 ? "дня подряд" : "дней подряд"
                    : "Начни сегодня"}
                </div>
                <div
                  className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg font-medium"
                  style={{
                    background: hasToday ? "#dcfce7" : "var(--secondary)",
                    color: hasToday ? "#16a34a" : "var(--muted-foreground)",
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: hasToday ? "#22c55e" : "var(--muted-foreground)" }}
                  />
                  {hasToday ? "Заполнен" : "Не заполнен"}
                </div>
              </div>
            </div>
          </Link>

          {/* ── Flashcards — bottom right ── */}
          <Link href="/flashcards" className="bento-cards block group">
            <div
              className="rounded-[20px] p-5 flex flex-col transition-transform group-hover:scale-[1.02]"
              style={{ background: "var(--card)", boxShadow: "0 2px 20px 0 rgba(80,70,140,0.08)", minHeight: "200px" }}
            >
              <div className="mb-2" style={{ color: "var(--accent)" }}>
                <FlashcardsIcon />
              </div>
              <h2 className="text-base font-semibold" style={{ color: "var(--card-foreground)" }}>Карточки</h2>
              <p className="text-xs mt-0.5 mb-4" style={{ color: "var(--muted-foreground)" }}>
                Изучай концепты через практику
              </p>

              <div className="mt-auto">
                <div className="flex items-end gap-0.5 mb-3 h-8">
                  {concepts.map((c, i) => {
                    const isL = learned.has(c.id);
                    const color = CONCEPT_COLORS[i % CONCEPT_COLORS.length];
                    return (
                      <div
                        key={c.id}
                        className="flex-1 rounded-sm transition-all duration-500"
                        style={{
                          height: isL ? "100%" : "35%",
                          background: isL ? color : "var(--border)",
                        }}
                      />
                    );
                  })}
                </div>

                <div className="flex items-end justify-between mb-1.5">
                  <div>
                    <span className="text-2xl font-bold tabular-nums" style={{ color: "var(--card-foreground)" }}>
                      {learnedCount}
                    </span>
                    <span className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                      /{totalCount}
                    </span>
                  </div>
                  <span className="text-xs font-semibold" style={{ color: "var(--accent)" }}>
                    {progressPct}%
                  </span>
                </div>

                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--secondary)" }}>
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${progressPct}%`, background: "var(--accent)" }}
                  />
                </div>
              </div>
            </div>
          </Link>

          {/* ── Situation — full width bottom ── */}
          <Link href="/situation" className="bento-situation block group">
            <div
              className="rounded-[20px] p-5 flex items-center gap-4 transition-transform group-hover:scale-[1.005]"
              style={{ background: "var(--card)", boxShadow: "0 2px 20px 0 rgba(80,70,140,0.08)" }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "var(--secondary)", color: "var(--accent)" }}
              >
                <SituationIcon />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-base font-semibold" style={{ color: "var(--card-foreground)" }}>Разобрать ситуацию</h2>
                <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                  Опиши управленческую задачу — получи структурированный разбор
                </p>
              </div>
              <span className="text-base shrink-0" style={{ color: "var(--muted-foreground)" }}>→</span>
            </div>
          </Link>

        </div>
      </div>
    </main>
  );
}
