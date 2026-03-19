"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  getJournalEntries,
  saveJournalEntry,
  getTodayEntry,
  getJournalStreak,
  todayStr,
  type JournalEntry,
} from "@/lib/storage";
import { getDailyConceptForDate } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

function formatDateRu(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    weekday: "long",
  });
}

export default function JournalPage() {
  const today = todayStr();
  const dailyConcept = getDailyConceptForDate(today);

  const [answer, setAnswer] = useState("");
  const [saved, setSaved] = useState(false);
  const [streak, setStreak] = useState(0);
  const [history, setHistory] = useState<JournalEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const entry = getTodayEntry();
    if (entry) {
      setAnswer(entry.answer);
      setSaved(true);
    }
    setStreak(getJournalStreak());
    setHistory(getJournalEntries());
  }, []);

  function handleSave() {
    if (!answer.trim()) return;
    const entry: JournalEntry = {
      date: today,
      question: dailyConcept.reflectionQuestion,
      answer: answer.trim(),
      conceptId: dailyConcept.id,
    };
    saveJournalEntry(entry);
    setSaved(true);
    setStreak(getJournalStreak());
    setHistory(getJournalEntries());
  }

  function handleEdit() {
    setSaved(false);
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Header row */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground mb-1">
              Дневник
            </h1>
            <p className="text-sm text-muted-foreground">{formatDateRu(today)}</p>
          </div>
          {streak > 0 && (
            <div className="flex flex-col items-end">
              <span className="text-2xl font-bold text-foreground">{streak}</span>
              <span className="text-xs text-muted-foreground">
                {streak === 1 ? "день подряд" : streak < 5 ? "дня подряд" : "дней подряд"}
              </span>
            </div>
          )}
        </div>

        {/* Today's entry */}
        <section className="mb-10">
          <div className="mb-1 flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Концепт дня
            </span>
            <Link
              href={`/concept/${dailyConcept.id}`}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
            >
              {dailyConcept.title}
            </Link>
          </div>
          <p className="text-base font-medium text-foreground leading-7 mb-6">
            {dailyConcept.reflectionQuestion}
          </p>

          {saved ? (
            <div className="rounded-lg border border-border bg-secondary p-4">
              <p className="text-base text-foreground leading-7 whitespace-pre-wrap">
                {answer}
              </p>
              <button
                onClick={handleEdit}
                className="mt-3 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Редактировать
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <Textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Напиши своими словами — это только для тебя..."
                className="min-h-[140px] text-base leading-7 resize-none bg-secondary border-border"
                autoFocus
              />
              <div className="flex justify-end">
                <Button onClick={handleSave} disabled={!answer.trim()}>
                  Сохранить
                </Button>
              </div>
            </div>
          )}
        </section>

        {/* History */}
        {history.length > 1 && (
          <section>
            <button
              onClick={() => setShowHistory((v) => !v)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors mb-4 flex items-center gap-1"
            >
              <span>{showHistory ? "↑" : "↓"}</span>
              <span>История ({history.length - (saved ? 0 : 0)} записей)</span>
            </button>

            {showHistory && (
              <div className="flex flex-col gap-6">
                {history
                  .filter((e) => e.date !== today)
                  .map((entry) => (
                    <div key={entry.date} className="border-l-2 border-border pl-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-muted-foreground">
                          {formatDateRu(entry.date)}
                        </span>
                        <Link
                          href={`/concept/${entry.conceptId}`}
                          className="text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
                        >
                          {entry.conceptId}
                        </Link>
                      </div>
                      <p className="text-xs text-muted-foreground italic mb-2">
                        {entry.question}
                      </p>
                      <p className="text-sm text-foreground leading-6 whitespace-pre-wrap">
                        {entry.answer}
                      </p>
                    </div>
                  ))}
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
