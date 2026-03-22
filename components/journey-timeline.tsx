"use client";

import { JOURNEY_STAGES, getActiveStageId } from "@/lib/journey";

export function JourneyTimeline() {
  const activeId = getActiveStageId();

  return (
    <div className="pt-4 pb-1">
      <div className="relative">
        {/* Vertical line */}
        <div
          className="absolute left-[7px] top-2 bottom-2 w-px"
          style={{ background: "var(--border)" }}
        />

        <div className="flex flex-col gap-0">
          {JOURNEY_STAGES.map((stage, i) => {
            const isActive = stage.id === activeId;
            const isPast = JOURNEY_STAGES.findIndex(s => s.id === activeId) > i;

            return (
              <div key={stage.id} className="relative flex gap-4 pb-6 last:pb-0">
                {/* Dot */}
                <div className="relative z-10 flex-shrink-0 mt-0.5">
                  {isActive ? (
                    <div
                      className="w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center"
                      style={{
                        borderColor: "var(--accent)",
                        background: "var(--card)",
                      }}
                    >
                      <div
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: "var(--accent)" }}
                      />
                    </div>
                  ) : (
                    <div
                      className="w-3.5 h-3.5 rounded-full"
                      style={{
                        background: isPast ? "var(--border)" : "var(--secondary)",
                        border: "1.5px solid var(--border)",
                      }}
                    />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Period label */}
                  <div
                    className="text-[10px] font-medium mb-0.5 uppercase tracking-wide"
                    style={{
                      color: isActive ? "var(--accent)" : "var(--border)",
                    }}
                  >
                    {stage.period}
                  </div>

                  {/* Stage name */}
                  <div
                    className="text-sm font-semibold leading-snug"
                    style={{
                      color: isActive
                        ? "var(--foreground)"
                        : isPast
                        ? "var(--muted-foreground)"
                        : "var(--muted-foreground)",
                      opacity: isPast ? 0.5 : 1,
                    }}
                  >
                    {stage.label}
                  </div>

                  {/* Description */}
                  <div
                    className="text-xs mt-0.5"
                    style={{
                      color: "var(--muted-foreground)",
                      opacity: isPast ? 0.5 : isActive ? 1 : 0.75,
                    }}
                  >
                    {stage.description}
                  </div>

                  {/* Reflection question — only for active stage */}
                  {isActive && (
                    <div
                      className="mt-2 text-xs italic px-3 py-2 rounded-xl"
                      style={{
                        background: "var(--secondary)",
                        color: "var(--muted-foreground)",
                        borderLeft: "2px solid var(--accent)",
                      }}
                    >
                      {stage.question}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
