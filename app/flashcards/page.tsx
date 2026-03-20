"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { concepts, type Concept } from "@/lib/data";
import { getLearnedConcepts, toggleLearnedConcept } from "@/lib/storage";
import { Button } from "@/components/ui/button";

type CardState = "front" | "back";
type Filter = "all" | "unlearned";

export default function FlashcardsPage() {
  const [learned, setLearned] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<Filter>("unlearned");
  const [queue, setQueue] = useState<Concept[]>([]);
  const [index, setIndex] = useState(0);
  const [cardState, setCardState] = useState<CardState>("front");
  const [done, setDone] = useState(false);

  useEffect(() => {
    const l = getLearnedConcepts();
    setLearned(l);
    buildQueue(l, filter);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const buildQueue = useCallback((l: Set<string>, f: Filter) => {
    const pool = f === "unlearned"
      ? concepts.filter((c) => !l.has(c.id))
      : [...concepts];
    // shuffle
    const shuffled = pool.sort(() => Math.random() - 0.5);
    setQueue(shuffled);
    setIndex(0);
    setCardState("front");
    setDone(shuffled.length === 0);
  }, []);

  function handleFilter(f: Filter) {
    setFilter(f);
    buildQueue(learned, f);
  }

  function flip() {
    setCardState((s) => (s === "front" ? "back" : "front"));
  }

  function markLearned() {
    const card = queue[index];
    const updated = toggleLearnedConcept(card.id);
    setLearned(new Set(updated));
    next();
  }

  function markAgain() {
    next();
  }

  function next() {
    const nextIndex = index + 1;
    if (nextIndex >= queue.length) {
      setDone(true);
    } else {
      setIndex(nextIndex);
      setCardState("front");
    }
  }

  const learnedCount = learned.size;
  const totalCount = concepts.length;
  const progressPct = Math.round((learnedCount / totalCount) * 100);

  const card = queue[index];

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground mb-1">
              Карточки
            </h1>
            <p className="text-sm text-muted-foreground">
              Изучено {learnedCount} из {totalCount}
            </p>
          </div>

          {/* Progress bar */}
          <div className="flex flex-col items-end gap-1.5 pt-1">
            <div className="w-24 h-1.5 rounded-full bg-secondary overflow-hidden">
              <div
                className="h-full rounded-full bg-foreground transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground">{progressPct}%</span>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-8">
          {(["unlearned", "all"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => handleFilter(f)}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                filter === f
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {f === "unlearned" ? "Неизученные" : "Все карточки"}
            </button>
          ))}
        </div>

        {done ? (
          <div className="flex flex-col items-center gap-6 py-16 text-center">
            {filter === "unlearned" && learnedCount === totalCount ? (
              <>
                <div className="text-4xl">✓</div>
                <p className="text-lg font-medium text-foreground">
                  Все концепты изучены
                </p>
                <p className="text-sm text-muted-foreground max-w-xs">
                  Можешь вернуться к отдельным концептам или повторить все снова.
                </p>
              </>
            ) : (
              <>
                <div className="text-4xl">◎</div>
                <p className="text-lg font-medium text-foreground">
                  {filter === "unlearned"
                    ? "Больше неизученных нет"
                    : "Сессия завершена"}
                </p>
              </>
            )}
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => buildQueue(learned, filter)}>
                Ещё раз
              </Button>
              <Button variant="outline" onClick={() => handleFilter("all")}>
                Повторить все
              </Button>
            </div>
          </div>
        ) : card ? (
          <div className="flex flex-col gap-6">
            {/* Progress in session */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {index + 1} / {queue.length}
              </span>
              <div className="flex-1 h-0.5 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-muted-foreground/40 transition-all duration-300"
                  style={{ width: `${((index + 1) / queue.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Card */}
            <button
              onClick={flip}
              className="w-full text-left rounded-xl border border-border bg-card p-8 min-h-[220px] flex flex-col justify-between cursor-pointer hover:border-muted-foreground/30 transition-colors group"
            >
              <div>
                <span className="text-xs text-muted-foreground uppercase tracking-wider">
                  {cardState === "front" ? "Название концепта" : "Суть"}
                </span>
                <p
                  className={`mt-4 leading-7 text-foreground ${
                    cardState === "front"
                      ? "text-2xl font-semibold"
                      : "text-base"
                  }`}
                >
                  {cardState === "front" ? card.title : card.summary}
                </p>
              </div>
              <div className="mt-6">
                {cardState === "front" ? (
                  <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                    Нажми, чтобы перевернуть →
                  </span>
                ) : (
                  <Link
                    href={`/concept/${card.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
                  >
                    Открыть концепт
                  </Link>
                )}
              </div>
            </button>

            {/* Actions — only after flip */}
            {cardState === "back" && (
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={markAgain}
                  className="flex-1"
                >
                  Повторить позже
                </Button>
                <Button
                  onClick={markLearned}
                  className="flex-1"
                  variant={learned.has(card.id) ? "outline" : "default"}
                >
                  {learned.has(card.id) ? "Убрать из изученных" : "Знаю ✓"}
                </Button>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </main>
  );
}
