"use client";

import Link from "next/link";
import { useState } from "react";
import { concepts } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface SuggestionConcept {
  id: string;
  title: string;
  tip: string;
}

function getRandomSuggestions(count: number): SuggestionConcept[] {
  const shuffled = [...concepts].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map((c) => ({
    id: c.id,
    title: c.title,
    tip: c.summary.split(".")[0] + ".",
  }));
}

export default function SituationPage() {
  const [situation, setSituation] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [suggestions, setSuggestions] = useState<SuggestionConcept[]>([]);
  const [submittedText, setSubmittedText] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!situation.trim()) return;
    const picked = getRandomSuggestions(3);
    setSuggestions(picked);
    setSubmittedText(situation.trim());
    setSubmitted(true);
  }

  function handleReset() {
    setSituation("");
    setSubmitted(false);
    setSuggestions([]);
    setSubmittedText("");
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className="mb-8">
          <Button asChild variant="ghost" size="sm" className="mb-6 -ml-2 text-muted-foreground">
            <Link href="/">← Все концепты</Link>
          </Button>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground mb-2">
            Разобрать ситуацию
          </h1>
          <p className="text-muted-foreground text-base">
            Опиши управленческую ситуацию — получи релевантные концепты.
          </p>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Textarea
              value={situation}
              onChange={(e) => setSituation(e.target.value)}
              placeholder="Например: мой сотрудник постоянно ждёт указаний и не берёт инициативу. Я провожу много времени в объяснениях очевидного..."
              className="min-h-[160px] text-base leading-7 resize-none"
              autoFocus
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={!situation.trim()}>
                Получить подход
              </Button>
            </div>
          </form>
        ) : (
          <div className="flex flex-col gap-8">
            <Card className="bg-secondary border-0">
              <CardContent className="pt-6">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                  Ваша ситуация
                </p>
                <p className="text-base leading-7 text-foreground">{submittedText}</p>
              </CardContent>
            </Card>

            <div>
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
                Концепты для этой ситуации
              </h2>
              <div className="flex flex-col gap-4">
                {suggestions.map((s) => (
                  <Card key={s.id} className="border-border">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-medium">
                        <Link
                          href={`/concept/${s.id}`}
                          className="hover:text-primary/70 transition-colors"
                        >
                          {s.title} →
                        </Link>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground leading-6">{s.tip}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={handleReset}>
                Разобрать другую ситуацию
              </Button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
