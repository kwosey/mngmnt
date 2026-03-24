import { JourneyTimeline } from "@/components/journey-timeline";
import { AnchorPreview } from "@/components/anchor-preview";
import { CurrentDatetime } from "@/components/current-datetime";

export default function HomePage() {
  return (
    <main className="min-h-screen" style={{ background: "var(--background)" }}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <AnchorPreview />
        <CurrentDatetime />
        <JourneyTimeline />
      </div>
    </main>
  );
}
