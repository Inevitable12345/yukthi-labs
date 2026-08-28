"use client";

import { ROOM_COPY } from "@/content/thesis";
import { Room } from "@/components/story/Room";
import { InstrumentLabel } from "@/components/ui/InstrumentLabel";
import { SITE } from "@/lib/metadata/site";
import { useChapterProgress } from "@/lib/story/use-chapter-progress";
import { cn } from "@/lib/utils/cn";

/* ============================================================================
   OBSERVATORY  (§4)
   ----------------------------------------------------------------------------
   Begin in darkness. A coordinate. An ambiguous structure. Then the tension —
   the world was easier to reason about; it isn't anymore — and only after that
   the mission.

   The three statements are cross-faded on scroll rather than revealed on
   intersection, because the pause between them is doing the work. All three are
   in the document at all times; opacity is the only thing scrubbing.
   ========================================================================== */

const copy = ROOM_COPY.observatory;

/** Window in which each statement is at full strength. */
const BEATS: [number, number][] = [
  [0, 0.34],
  [0.3, 0.56],
  [0.52, 1],
];

function strength(progress: number, [start, end]: [number, number]): number {
  if (progress < start) return Math.max(0, 1 - (start - progress) / 0.1);
  if (progress > end) return Math.max(0, 1 - (progress - end) / 0.12);
  return 1;
}

export function ObservatoryScene() {
  const progress = useChapterProgress("observatory");

  return (
    <Room id="observatory" hold={3.2} contentClassName="justify-between">
      <div className="flex min-h-[86vh] flex-col justify-between">
        <div className="pt-10">
          <InstrumentLabel>{copy.eyebrow}</InstrumentLabel>
        </div>

        <div className="relative">
          <h1 id="observatory-heading" className="sr-only">
            Yukthi Lab — {SITE.mission}
          </h1>

          <p className="display max-w-[20ch]" style={{ opacity: strength(progress, BEATS[0]!) }}>
            {copy.headline}
          </p>

          <p
            className="headline mt-8 text-rupture"
            style={{
              opacity: strength(progress, BEATS[1]!),
              transform: `translateY(${(1 - strength(progress, BEATS[1]!)) * 12}px)`,
            }}
          >
            {copy.standfirst}
          </p>

          <div
            className="mt-12 max-w-[46rem] border-l border-brass pl-6"
            style={{
              opacity: strength(progress, BEATS[2]!),
              transform: `translateY(${(1 - strength(progress, BEATS[2]!)) * 16}px)`,
            }}
          >
            <p className="display text-white-hot">{copy.pull}</p>
            <p className="standfirst mt-6 max-w-[54ch]">{copy.body[0]}</p>
          </div>
        </div>

        <div className="flex items-end justify-between gap-6 pb-6">
          <p className="max-w-[42ch] font-mono text-[0.7rem] leading-relaxed tracking-[0.1em] text-ash">
            {copy.body[1]}
          </p>
          <span
            aria-hidden="true"
            className={cn(
              "hidden shrink-0 font-mono text-[0.66rem] tracking-[0.24em] text-brass sm:block",
            )}
          >
            SCROLL
          </span>
        </div>
      </div>
    </Room>
  );
}
