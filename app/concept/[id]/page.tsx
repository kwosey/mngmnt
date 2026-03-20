"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getConceptById } from "@/lib/data";
import { getLearnedConcepts, toggleLearnedConcept } from "@/lib/storage";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ConceptPage() {
  const { id } = useParams<{ id: string }>();
  const concept = getConceptById(id);

  const [learned, setLearned] = useState(false);

  useEffect(() => {
    const l = getLearnedConcepts();
    setLearned(l.has(id));
  }, [id]);

  if (!concept) {
    notFound();
  }

  function handleToggleLearned() {
    const updated = toggleLearnedConcept(id);
    setLearned(updated.has(id));
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="mb-8">
          <Button asChild variant="ghost" size="sm" className="mb-6 -ml-2 text-muted-foreground">
            <Link href="/">← Все концепты</Link>
          </Button>
          <div className="flex items-start justify-between gap-3 sm:gap-4">
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
              {concept.title}
            </h1>
            <button
              onClick={handleToggleLearned}
              className={`shrink-0 mt-1.5 px-3 py-1 text-xs rounded-full border transition-colors ${
                learned
                  ? "border-border text-muted-foreground bg-secondary hover:bg-secondary/60"
                  : "border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground/50"
              }`}
            >
              {learned ? "✓ Изучен" : "Отметить изученным"}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <section>
            <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
              Суть
            </h2>
            <p className="text-base leading-7 text-foreground">{concept.summary}</p>
          </section>

          <hr className="border-border" />

          <section>
            <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
              Когда применять
            </h2>
            <p className="text-base leading-7 text-foreground">{concept.whenToApply}</p>
          </section>

          <hr className="border-border" />

          <section>
            <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
              Антипаттерны
            </h2>
            <ul className="flex flex-col gap-2">
              {concept.antiPatterns.map((pattern, i) => (
                <li key={i} className="flex items-start gap-2 text-base text-foreground">
                  <span className="text-muted-foreground mt-1">—</span>
                  <span className="leading-6">{pattern}</span>
                </li>
              ))}
            </ul>
          </section>

          <hr className="border-border" />

          <section>
            <Card className="bg-secondary border-0">
              <CardContent className="pt-6">
                <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                  Вопрос для рефлексии
                </h2>
                <p className="text-base leading-7 text-foreground font-medium">
                  {concept.reflectionQuestion}
                </p>
                <Link
                  href="/journal"
                  className="mt-4 inline-block text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
                >
                  Записать ответ в дневник →
                </Link>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </main>
  );
}
