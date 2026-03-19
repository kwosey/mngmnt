"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { concepts } from "@/lib/data";
import { getLearnedConcepts, getJournalStreak, getTodayEntry } from "@/lib/storage";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground mb-1">
            Management OS
          </h1>
          <p className="text-sm text-muted-foreground">
            Персональный инструмент нового тимлида.
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-10">
          <Link href="/journal">
            <div className={`rounded-lg border p-4 cursor-pointer transition-colors hover:border-muted-foreground/40 ${hasToday ? "border-border" : "border-dashed border-border"}`}>
              <div className="text-xl font-bold text-foreground mb-0.5">
                {streak > 0 ? streak : "—"}
              </div>
              <div className="text-xs text-muted-foreground">
                {streak > 0
                  ? (streak === 1 ? "день подряд" : streak < 5 ? "дня подряд" : "дней подряд")
                  : "Дневник"}
              </div>
              {!hasToday && (
                <div className="text-xs text-muted-foreground/60 mt-1">
                  Не заполнен сегодня
                </div>
              )}
            </div>
          </Link>

          <Link href="/flashcards">
            <div className="rounded-lg border border-border p-4 cursor-pointer transition-colors hover:border-muted-foreground/40">
              <div className="text-xl font-bold text-foreground mb-0.5">
                {learnedCount}/{totalCount}
              </div>
              <div className="text-xs text-muted-foreground">Изучено концептов</div>
              <div className="mt-2 h-1 rounded-full bg-secondary overflow-hidden">
                <div
                  className="h-full rounded-full bg-foreground/40 transition-all"
                  style={{ width: `${(learnedCount / totalCount) * 100}%` }}
                />
              </div>
            </div>
          </Link>

          <Link href="/situation">
            <div className="rounded-lg border border-border p-4 cursor-pointer transition-colors hover:border-muted-foreground/40">
              <div className="text-xl font-bold text-foreground mb-0.5">→</div>
              <div className="text-xs text-muted-foreground">Разобрать ситуацию</div>
            </div>
          </Link>
        </div>

        {/* Concept list */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Концепты
          </h2>
          <Button asChild variant="ghost" size="sm" className="text-xs text-muted-foreground">
            <Link href="/flashcards">Учить →</Link>
          </Button>
        </div>

        <div className="flex flex-col gap-2">
          {concepts.map((concept) => {
            const isLearned = learned.has(concept.id);
            return (
              <Link key={concept.id} href={`/concept/${concept.id}`} className="group">
                <div className="flex items-start gap-3 rounded-lg border border-border px-4 py-3 transition-colors hover:bg-secondary/40 cursor-pointer">
                  <span
                    className={`mt-0.5 text-xs shrink-0 ${
                      isLearned ? "text-foreground/60" : "text-muted-foreground/30"
                    }`}
                  >
                    {isLearned ? "✓" : "○"}
                  </span>
                  <div className="min-w-0">
                    <div className={`text-sm font-medium mb-0.5 ${isLearned ? "text-muted-foreground" : "text-foreground"} group-hover:text-foreground transition-colors`}>
                      {concept.title}
                    </div>
                    <div className="text-xs text-muted-foreground leading-5 truncate">
                      {concept.shortDescription}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
