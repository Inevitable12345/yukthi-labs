"use client";

import { useState } from "react";

import { InstrumentLabel } from "@/components/ui/InstrumentLabel";
import { cn } from "@/lib/utils/cn";

/* ============================================================================
   MAP → MONITOR → FORECAST → SIMULATE → RE-MAP
   ----------------------------------------------------------------------------
   The brand's central motif, drawn as a closed ring because the last step feeds
   the first. A linear rendering of these five words would misstate the claim.
   ========================================================================== */

const STAGES = [
  {
    id: "map",
    label: "Map",
    detail:
      "Construct the scoped causal structure around a decision — states, mechanisms and the joint conditions between them.",
  },
  {
    id: "monitor",
    label: "Monitor",
    detail:
      "Track the condition of nodes and of relations. A relation can break while every node it connects looks unchanged.",
  },
  {
    id: "forecast",
    label: "Forecast",
    detail:
      "Quantify plausible futures with the structure held in view, and record the calibration so it can be scored.",
  },
  {
    id: "simulate",
    label: "Simulate",
    detail:
      "Impose an intervention that has not happened — a tariff, a restriction, a failure — and propagate it through the mechanisms.",
  },
  {
    id: "remap",
    label: "Re-map",
    detail:
      "When reality contradicts the structure, change the structure. This is the step that makes it a world model rather than a diagram.",
  },
] as const;

const RADIUS = 122;
const CENTRE = 160;
/* The ring is centred at 160, but the stage labels sit outside it and read
   outward, so the viewBox is extended horizontally to hold them. An SVG clips to
   its viewBox, and a clipped label is a missing word. */
const VIEW_BOX = "-88 6 496 308";

export function MapMonitorForecastLoop({ className }: { className?: string }) {
  const [active, setActive] = useState<string>("map");
  const activeStage = STAGES.find((stage) => stage.id === active) ?? STAGES[0];

  const positions = STAGES.map((stage, index) => {
    const angle = (index / STAGES.length) * Math.PI * 2 - Math.PI / 2;
    return {
      ...stage,
      x: CENTRE + RADIUS * Math.cos(angle),
      y: CENTRE + RADIUS * Math.sin(angle),
      angle,
    };
  });

  return (
    <div
      className={cn("grid items-center gap-10 lg:grid-cols-[320px_minmax(0,1fr)]", className)}
    >
      <svg
        viewBox={VIEW_BOX}
        role="group"
        aria-label="Operating loop: map, monitor, forecast, simulate, re-map, and back to map. The loop is closed because re-mapping changes the structure that mapping produced, so the process has no final state. Each stage is selectable."
        className="mx-auto block h-auto w-full max-w-[26rem]"
      >
        <circle
          cx={CENTRE}
          cy={CENTRE}
          r={RADIUS}
          fill="none"
          stroke="var(--hairline)"
          strokeWidth="1"
        />
        <circle
          cx={CENTRE}
          cy={CENTRE}
          r={RADIUS - 26}
          fill="none"
          stroke="var(--hairline-faint)"
          strokeWidth="1"
        />

        {positions.map((stage, index) => {
          const next = positions[(index + 1) % positions.length]!;
          const isActive = stage.id === active;
          return (
            <g key={`arc-${stage.id}`}>
              <path
                d={arc(stage, next)}
                fill="none"
                stroke={isActive ? "var(--color-gold)" : "var(--color-steel-dim)"}
                strokeWidth={isActive ? 1.6 : 1}
                opacity={isActive ? 1 : 0.55}
                markerEnd="url(#loop-arrow)"
              />
            </g>
          );
        })}

        <defs>
          <marker
            id="loop-arrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto-start-reverse"
          >
            <path d="M 0 2 L 9 5 L 0 8 z" fill="currentColor" />
          </marker>
        </defs>

        {positions.map((stage) => {
          const isActive = stage.id === active;
          return (
            <g
              key={stage.id}
              role="button"
              tabIndex={0}
              aria-pressed={isActive}
              aria-label={`${stage.label}. ${stage.detail}`}
              className="cursor-pointer outline-none"
              onMouseEnter={() => setActive(stage.id)}
              onFocus={() => setActive(stage.id)}
              onClick={() => setActive(stage.id)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setActive(stage.id);
                }
              }}
            >
              <circle cx={stage.x} cy={stage.y} r={24} fill="transparent" />
              <circle
                cx={stage.x}
                cy={stage.y}
                r={isActive ? 6.5 : 4}
                fill={isActive ? "var(--color-gold)" : "var(--color-void)"}
                stroke={isActive ? "var(--color-gold)" : "var(--color-muted-bone)"}
                strokeWidth="1.3"
              />
              <text
                x={stage.x + Math.cos(stage.angle) * 22}
                y={stage.y + Math.sin(stage.angle) * 22 + 4}
                textAnchor={labelAnchor(stage.angle)}
                fontSize="11"
                letterSpacing="0.2em"
                className="uppercase select-none"
                fill={isActive ? "var(--color-bone)" : "var(--color-muted-bone)"}
              >
                {stage.label}
              </text>
            </g>
          );
        })}

        <text
          x={CENTRE}
          y={CENTRE - 4}
          textAnchor="middle"
          fontSize="9"
          letterSpacing="0.24em"
          fill="var(--color-dim-bone)"
          className="uppercase"
        >
          Continuous
        </text>
        <text
          x={CENTRE}
          y={CENTRE + 12}
          textAnchor="middle"
          fontSize="9"
          letterSpacing="0.24em"
          fill="var(--color-dim-bone)"
          className="uppercase"
        >
          Loop
        </text>
      </svg>

      <div>
        <InstrumentLabel tone="gold">
          {STAGES.findIndex((stage) => stage.id === active) + 1} / {STAGES.length}
        </InstrumentLabel>
        <h3 className="u-display-3 mt-3 text-bone">{activeStage.label}</h3>
        <p className="u-body mt-4 max-w-md">{activeStage.detail}</p>

        <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
          {STAGES.map((stage) => (
            <li key={stage.id}>
              <button
                type="button"
                onClick={() => setActive(stage.id)}
                aria-pressed={stage.id === active}
                className={cn(
                  "min-h-11 border-b pb-0.5 font-mono text-[0.625rem] tracking-[0.18em] uppercase transition-colors",
                  stage.id === active
                    ? "border-gold text-gold"
                    : "border-transparent text-dim-bone hover:text-muted-bone",
                )}
              >
                {stage.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function arc(
  from: { x: number; y: number; angle: number },
  to: { x: number; y: number; angle: number },
): string {
  const inset = 12;
  const start = {
    x: from.x - Math.cos(from.angle) * 0 + Math.sin(from.angle) * inset,
    y: from.y - Math.sin(from.angle) * 0 - Math.cos(from.angle) * inset,
  };
  const end = {
    x: to.x - Math.sin(to.angle) * inset,
    y: to.y + Math.cos(to.angle) * inset,
  };
  return `M ${start.x.toFixed(2)} ${start.y.toFixed(2)} A ${RADIUS} ${RADIUS} 0 0 1 ${end.x.toFixed(2)} ${end.y.toFixed(2)}`;
}

function labelAnchor(angle: number): "start" | "middle" | "end" {
  const cos = Math.cos(angle);
  if (cos > 0.3) return "start";
  if (cos < -0.3) return "end";
  return "middle";
}
