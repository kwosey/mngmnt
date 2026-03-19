import Link from "next/link";
import { notFound } from "next/navigation";
import { getConceptById } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ConceptPageProps {
  params: Promise<{ id: string }>;
}

export default async function ConceptPage({ params }: ConceptPageProps) {
  const { id } = await params;
  const concept = getConceptById(id);

  if (!concept) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className="mb-8">
          <Button asChild variant="ghost" size="sm" className="mb-6 -ml-2 text-muted-foreground">
            <Link href="/">← Все концепты</Link>
          </Button>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground mb-0">
            {concept.title}
          </h1>
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
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </main>
  );
}
