"use client";

import { Room } from "@/components/story/Room";
import { RoomBody } from "@/components/story/RoomBody";
import { RoomHeading } from "@/components/story/RoomHeading";
import { useChapterProgress } from "@/lib/story/use-chapter-progress";

/* ============================================================================
   ROOM 03 — THE CHOKEPOINT  (§8)
   ----------------------------------------------------------------------------
   The upstream node stays physically tiny for the entire exhibit. Everything
   that grows, grows downstream of it. The argument is made by the proportion
   itself: a licensing decision at one processing step, and beneath it a widening
   stack of systems that had no part in the decision.

   The bars carry no numbers, because there is no defensible number to put on
   them. What is being shown is order and reach, not magnitude (§46).
   ========================================================================== */

const DOWNSTREAM = [
  { label: "Separation and refining", weight: 0.18 },
  { label: "Separated oxide supply", weight: 0.3 },
  { label: "Permanent magnets", weight: 0.44 },
  { label: "Motors and actuators", weight: 0.6 },
  { label: "Vehicle programmes", weight: 0.78 },
  { label: "Defence systems", weight: 0.86 },
  { label: "Wind generation", weight: 0.92 },
  { label: "Data-centre build-out", weight: 1 },
];

export function ChokepointScene() {
  const progress = useChapterProgress("chokepoint");
  const reveal = Math.min(1, Math.max(0, (progress - 0.15) / 0.6));

  return (
    <Room id="chokepoint" pinned={false}>
      <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
        <div>
          <RoomHeading id="chokepoint" />
          <RoomBody id="chokepoint" className="mt-9" />
        </div>

        <figure className="lg:sticky lg:top-28 lg:self-start">
          <div className="border border-graphite bg-ink/50 p-5 sm:p-8">
            <p className="label-dim">Upstream — the node</p>
            <div className="mt-3 flex items-center gap-4">
              <span
                aria-hidden="true"
                className="block h-2 w-2 shrink-0 bg-rupture"
                style={{ boxShadow: "0 0 18px var(--color-rupture)" }}
              />
              <span className="font-mono text-[0.74rem] tracking-[0.1em] text-bone">
                Export licensing decision
              </span>
            </div>

            <p className="label-dim mt-8">Downstream — what it gates</p>
            <ul className="mt-3 space-y-2.5">
              {DOWNSTREAM.map((item, index) => {
                const step = index / (DOWNSTREAM.length - 1);
                const local = Math.min(1, Math.max(0, (reveal - step * 0.55) / 0.45));
                return (
                  <li key={item.label} className="grid grid-cols-[1fr_auto] items-center gap-3">
                    <div className="h-[3px] w-full bg-graphite/60">
                      <div
                        className="h-full bg-signal"
                        style={{
                          width: `${item.weight * local * 100}%`,
                          transition: "width 240ms linear",
                          opacity: 0.35 + local * 0.65,
                        }}
                      />
                    </div>
                    <span
                      className="font-mono text-[0.66rem] tracking-[0.08em] whitespace-nowrap transition-colors duration-300"
                      style={{ color: local > 0.5 ? "var(--color-bone)" : "var(--color-ash)" }}
                    >
                      {item.label}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          <figcaption className="mt-4 max-w-[46ch] font-mono text-[0.68rem] leading-relaxed tracking-[0.08em] text-ash">
            Bar length shows reach through the dependency structure, not market value or volume. No
            quantity is claimed.
          </figcaption>
        </figure>
      </div>
    </Room>
  );
}
