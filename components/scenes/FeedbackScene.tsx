"use client";

import { CausalDiagram } from "@/components/causal/CausalDiagram";
import { FEEDBACK_GRAPH } from "@/content/scenarios";
import { Room } from "@/components/story/Room";
import { RoomBody } from "@/components/story/RoomBody";
import { RoomHeading } from "@/components/story/RoomHeading";
import { useChapterProgress } from "@/lib/story/use-chapter-progress";

/* ============================================================================
   ROOM 06 — FEEDBACK  (§12)
   ----------------------------------------------------------------------------
   The loop tightens as the room is traversed: the ring contracts, the pulse
   accelerates, and the amplitude of each turn rises. That is the whole idea
   made kinetic — each pass is small, and the loop is not.

   The causal structure beneath it is the FERC/NERC finding, drawn as a graph
   whose final relation returns to a node upstream of itself.
   ========================================================================== */

const STEPS = [
  "Extreme cold",
  "Generation failure",
  "Gas shortage",
  "Electricity shortage",
  "Infrastructure failure",
  "More gas shortage",
];

export function FeedbackScene() {
  const progress = useChapterProgress("feedback");
  const tighten = Math.min(1, Math.max(0, (progress - 0.1) / 0.65));
  const radius = 74 - tighten * 26;

  return (
    <Room id="feedback">
      <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
        <div>
          <RoomHeading id="feedback" />
          <RoomBody id="feedback" className="mt-9" />
        </div>

        <figure className="lg:pt-14">
          <svg
            viewBox="-110 -110 220 220"
            className="mx-auto h-auto w-full max-w-[26rem]"
            aria-hidden="true"
          >
            <circle
              cx="0"
              cy="0"
              r={radius}
              fill="none"
              stroke="var(--color-rupture)"
              strokeWidth={0.8 + tighten * 1.4}
              opacity={0.25 + tighten * 0.45}
              strokeDasharray="6 5"
              className="animate-drift"
            />
            {STEPS.map((step, index) => {
              const angle = (index / STEPS.length) * Math.PI * 2 - Math.PI / 2;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;
              const anchor = x > 6 ? "start" : x < -6 ? "end" : "middle";
              const labelX = x + Math.cos(angle) * 12;
              const labelY = y + Math.sin(angle) * 12 + 3;
              return (
                <g key={step}>
                  <circle
                    cx={x}
                    cy={y}
                    r={2.6 + tighten * 1.2}
                    fill="var(--color-rupture)"
                    opacity={0.5 + tighten * 0.5}
                  />
                  <text
                    x={labelX}
                    y={labelY}
                    textAnchor={anchor}
                    fontSize="7"
                    fontFamily="var(--font-mono)"
                    letterSpacing="0.08em"
                    fill="var(--color-bone)"
                    opacity={0.55 + tighten * 0.45}
                  >
                    {step.toUpperCase()}
                  </text>
                </g>
              );
            })}
            <text
              x="0"
              y="2"
              textAnchor="middle"
              fontSize="9"
              fontFamily="var(--font-mono)"
              letterSpacing="0.18em"
              fill="var(--color-brass)"
              opacity={tighten}
            >
              ↺
            </text>
          </svg>
          <figcaption className="mt-4 max-w-[46ch] font-mono text-[0.68rem] leading-relaxed tracking-[0.08em] text-ash">
            The ring contracts as the room is traversed. Each turn is small; the loop is not.
          </figcaption>
        </figure>
      </div>

      <div className="mt-16">
        <CausalDiagram graph={FEEDBACK_GRAPH} />
      </div>
    </Room>
  );
}
