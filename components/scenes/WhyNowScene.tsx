"use client";

import { ROOM_COPY } from "@/content/thesis";
import { Room } from "@/components/story/Room";
import { RoomBody } from "@/components/story/RoomBody";
import { RoomHeading } from "@/components/story/RoomHeading";
import { useChapterProgress } from "@/lib/story/use-chapter-progress";

/* ============================================================================
   ROOM 10 — WHY NOW  (§16)
   ----------------------------------------------------------------------------
   The environment quietens. Evidence fragments — filings, policies, tenders,
   transcripts — are drawn into a pipeline and resolved into structure.

   No chatbot appears anywhere in this room, deliberately. The claim is about
   the economics of continuous processing, not about a conversational surface.
   ========================================================================== */

const FRAGMENTS = [
  "Regulatory filing",
  "Policy announcement",
  "Customs schedule",
  "Tender document",
  "Earnings transcript",
  "Technical literature",
  "Infrastructure notice",
  "Market data",
];

const STAGES = ROOM_COPY.ai.ladder!.steps;

export function WhyNowScene() {
  const progress = useChapterProgress("ai");
  const flow = Math.min(1, Math.max(0, (progress - 0.12) / 0.6));

  return (
    <Room id="ai">
      <RoomHeading id="ai" />

      <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
        <RoomBody id="ai" showLadder={false} />

        <div className="space-y-8">
          <ul className="flex flex-wrap gap-2">
            {FRAGMENTS.map((fragment, index) => {
              const local = Math.min(1, Math.max(0, flow * FRAGMENTS.length - index));
              return (
                <li
                  key={fragment}
                  className="border px-2.5 py-1 font-mono text-[0.64rem] tracking-[0.1em]"
                  style={{
                    borderColor: local > 0.6 ? "var(--color-brass-dim)" : "var(--color-graphite)",
                    color: local > 0.6 ? "var(--color-bone)" : "var(--color-ash)",
                    transform: `translateY(${(1 - local) * 6}px)`,
                    transition:
                      "transform 300ms linear, color 300ms linear, border-color 300ms linear",
                  }}
                >
                  {fragment}
                </li>
              );
            })}
          </ul>

          <ol className="grid gap-px bg-graphite sm:grid-cols-2">
            {STAGES.map((stage, index) => {
              const local = Math.min(1, Math.max(0, flow * STAGES.length - index));
              return (
                <li key={stage} className="bg-void px-4 py-3">
                  <span
                    className="font-mono text-[0.7rem] tracking-[0.18em]"
                    style={{ color: local > 0.5 ? "var(--color-brass)" : "var(--color-ash)" }}
                  >
                    {(index + 1).toString().padStart(2, "0")} {stage}
                  </span>
                </li>
              );
            })}
          </ol>

          <p className="headline max-w-[26ch] text-white-hot">{ROOM_COPY.ai.pull}</p>
        </div>
      </div>
    </Room>
  );
}
