"use client";

import { BreakChart } from "@/components/causal/BreakChart";
import { LineToHypergraph, stageLabel } from "@/components/causal/LineToHypergraph";
import { Room } from "@/components/story/Room";
import { RoomBody } from "@/components/story/RoomBody";
import { RoomHeading } from "@/components/story/RoomHeading";
import { useChapterProgress } from "@/lib/story/use-chapter-progress";

/* ============================================================================
   ROOM 05 — STRUCTURAL BREAK  (§10, §11)
   ----------------------------------------------------------------------------
   Two exhibits, one claim. The morph shows why a line cannot hold the structure;
   the chart shows what happens to a model that assumed it could. They sit in the
   same room because they are the same failure seen from two directions.
   ========================================================================== */

export function StructuralBreakScene() {
  const progress = useChapterProgress("structural-break");
  const morph = Math.min(1, Math.max(0, (progress - 0.08) / 0.42));
  const chart = Math.min(1, Math.max(0, (progress - 0.42) / 0.4));

  return (
    <Room id="structural-break" pinned={false}>
      <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-start lg:gap-20">
        <div>
          <RoomHeading id="structural-break" />
          <RoomBody id="structural-break" className="mt-9" />
        </div>

        <div className="space-y-12 lg:sticky lg:top-28 lg:self-start">
          <figure>
            <div className="border border-graphite bg-ink/40 p-4 sm:p-6">
              <LineToHypergraph progress={morph} />
            </div>
            <figcaption className="mt-3 font-mono text-[0.68rem] tracking-[0.1em] text-brass">
              {stageLabel(morph)}
            </figcaption>
          </figure>

          <div className="border border-graphite bg-ink/40 p-4 sm:p-6">
            <BreakChart progress={chart} />
          </div>
        </div>
      </div>
    </Room>
  );
}
