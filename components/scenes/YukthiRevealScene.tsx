"use client";

import { REVEAL_STAGES, YukthiReveal, stageIndex } from "@/components/causal/YukthiReveal";
import { ROOM_COPY } from "@/content/thesis";
import { Room } from "@/components/story/Room";
import { ClaimBadge } from "@/components/ui/ClaimBadge";
import { InstrumentLabel } from "@/components/ui/InstrumentLabel";
import { useChapterProgress } from "@/lib/story/use-chapter-progress";
import { cn } from "@/lib/utils/cn";

/* ============================================================================
   ROOM 11 — YUKTHI  (§17)
   ----------------------------------------------------------------------------
   The reveal is held for the length of the room and scrubbed by the scroll, so
   the visitor drives it and can stop on the stage that matters to them.
   ========================================================================== */

const copy = ROOM_COPY.yukthi;

export function YukthiRevealScene() {
  const progress = useChapterProgress("yukthi");
  const reveal = Math.min(1, Math.max(0, (progress - 0.12) / 0.72));
  const stage = stageIndex(reveal);

  return (
    <Room id="yukthi" hold={4}>
      <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-16">
        <div>
          <div className="flex flex-wrap items-center gap-4">
            <InstrumentLabel>{copy.eyebrow}</InstrumentLabel>
            {copy.claimClass ? <ClaimBadge claim={copy.claimClass} /> : null}
          </div>

          <h2 id="yukthi-heading" className="display mt-6 tracking-[0.02em]">
            {copy.headline}
          </h2>
          <p className="standfirst mt-5 max-w-[30ch] text-brass">{copy.standfirst}</p>

          <div className="prose-argument mt-8">
            {copy.body.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>

        <div>
          <div className="border border-graphite bg-ink/40 p-4 sm:p-7">
            <YukthiReveal progress={reveal} />
          </div>

          <ol className="mt-6 grid gap-x-8 gap-y-1 sm:grid-cols-2">
            {REVEAL_STAGES.map((label, index) => (
              <li
                key={label}
                aria-current={index === stage ? "step" : undefined}
                className={cn(
                  "font-mono text-[0.66rem] leading-relaxed tracking-[0.08em] transition-colors duration-300",
                  index === stage ? "text-brass" : index < stage ? "text-bone/75" : "text-ash",
                )}
              >
                {(index + 1).toString().padStart(2, "0")} · {label}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Room>
  );
}
