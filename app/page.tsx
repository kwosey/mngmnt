import Link from "next/link";
import { concepts } from "@/lib/data";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="mb-12">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground mb-2">
            Management OS
          </h1>
          <p className="text-muted-foreground text-base">
            Инструмент для осмысления управленческих ситуаций.
          </p>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Концепты
          </h2>
          <Button asChild variant="outline" size="sm">
            <Link href="/situation">Разобрать ситуацию →</Link>
          </Button>
        </div>

        <div className="flex flex-col gap-3">
          {concepts.map((concept) => (
            <Link key={concept.id} href={`/concept/${concept.id}`} className="group">
              <Card className="transition-shadow hover:shadow-md cursor-pointer border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium group-hover:text-primary/80 transition-colors">
                    {concept.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm text-muted-foreground leading-relaxed">
                    {concept.shortDescription}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
