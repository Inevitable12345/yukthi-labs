"use client";

import { useState } from "react";

import { IllustrativeBadge } from "@/components/evidence/IllustrativeBadge";
import { InstrumentLabel } from "@/components/ui/InstrumentLabel";
import { futureBranches } from "@/data/futures";
import { track } from "@/lib/analytics/analytics";
import { cn } from "@/lib/utils/cn";

/* ============================================================================
   POSSIBLE FUTURES
   ----------------------------------------------------------------------------
   A fan from a present state.

   Every branch is drawn at the same weight, because weighting them would imply a
   probability, and no probability has been produced. When a calibrated model
   exists, `probability` and `calibrationStatus` are already on the schema and the
   branches can take differing weight honestly.
   ========================================================================== */

const WIDTH = 900;
const HEIGHT = 380;
const ORIGIN = { x: 96, y: HEIGHT / 2 };
/* Branches stop short of the frame so that the longest label — "Managed
   fragmentation", 11px mono — finishes inside the viewBox rather than being
   clipped by it. */
const BRANCH_END = WIDTH - 200;

export function FutureFan({ className }: { className?: string }) {
  const [active, setActive] = useState<string>(futureBranches[0]!.id);
  const activeBranch =
    futureBranches.find((branch) => branch.id === active) ?? futureBranches[0]!;

  const branchPoints = futureBranches.map((branch, index) => {
    const spread =
      (index - (futureBranches.length - 1) / 2) / ((futureBranches.length - 1) / 2);
    return {
      branch,
      end: { x: BRANCH_END, y: ORIGIN.y + spread * 128 },
    };
  });

  return (
    <div className={cn("relative", className)}>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <InstrumentLabel tone="steel">Branching from the present state</InstrumentLabel>
        <IllustrativeBadge label="Illustrative scenario — not a model forecast" />
      </div>

      <div className="u-figure-scroll border border-[color:var(--hairline)] bg-deep-field/40">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          role="group"
          aria-label="Four branches diverging from a single present state marked NOW, drawn at equal weight and equal length: managed fragmentation, chokepoint binding, physical coupling event, and regime relearning. A widening shaded region represents growing uncertainty with distance from the present. No branch carries a probability, because none has been produced by a model. Each branch is selectable."
          className="block h-auto w-full"
          style={{ minWidth: 720 }}
        >
          {/* uncertainty widening with distance */}
          <path
            d={`M ${ORIGIN.x} ${ORIGIN.y} L ${BRANCH_END + 22} ${ORIGIN.y - 168} L ${BRANCH_END + 22} ${ORIGIN.y + 168} Z`}
            fill="var(--color-steel)"
            fillOpacity="0.045"
          />

          {/* horizon rules */}
          {[0.35, 0.62, 0.88].map((fraction) => (
            <g key={fraction}>
              <path
                d={`M ${ORIGIN.x + (WIDTH - 260) * fraction} 44 L ${ORIGIN.x + (WIDTH - 260) * fraction} ${HEIGHT - 44}`}
                stroke="var(--hairline-faint)"
                strokeWidth="1"
              />
              <text
                x={ORIGIN.x + (WIDTH - 260) * fraction}
                y={HEIGHT - 24}
                textAnchor="middle"
                fontSize="9"
                letterSpacing="0.18em"
                fill="var(--color-dim-bone)"
              >
                {fraction === 0.35 ? "NEAR" : fraction === 0.62 ? "MID" : "FAR"}
              </text>
            </g>
          ))}

          {branchPoints.map(({ branch, end }) => {
            const isActive = branch.id === active;
            const control = { x: ORIGIN.x + (end.x - ORIGIN.x) * 0.55, y: ORIGIN.y };
            return (
              <g
                key={branch.id}
                role="button"
                tabIndex={0}
                aria-pressed={isActive}
                aria-label={`${branch.label}. ${branch.summary} Illustrative scenario, no probability attached.`}
                className="cursor-pointer outline-none"
                onMouseEnter={() => setActive(branch.id)}
                onFocus={() => setActive(branch.id)}
                onClick={() => {
                  setActive(branch.id);
                  track("scenario_select", { fan: "futures", branch: branch.id });
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setActive(branch.id);
                  }
                }}
              >
                <path
                  d={`M ${ORIGIN.x} ${ORIGIN.y} Q ${control.x} ${control.y} ${end.x} ${end.y}`}
                  fill="none"
                  stroke="transparent"
                  strokeWidth="26"
                />
                <path
                  d={`M ${ORIGIN.x} ${ORIGIN.y} Q ${control.x} ${control.y} ${end.x} ${end.y}`}
                  fill="none"
                  stroke={isActive ? "var(--color-gold)" : "var(--color-steel-dim)"}
                  strokeWidth={isActive ? 1.8 : 1.1}
                  strokeDasharray={isActive ? undefined : "4 5"}
                />
                <circle
                  cx={end.x}
                  cy={end.y}
                  r={isActive ? 5.5 : 3.5}
                  fill={isActive ? "var(--color-gold)" : "var(--color-void)"}
                  stroke={isActive ? "var(--color-gold)" : "var(--color-muted-bone)"}
                  strokeWidth="1.2"
                />
                <text
                  x={end.x + 14}
                  y={end.y + 4}
                  fontSize="11"
                  letterSpacing="0.1em"
                  className="select-none"
                  fill={isActive ? "var(--color-bone)" : "var(--color-muted-bone)"}
                >
                  {branch.label}
                </text>
              </g>
            );
          })}

          {/* now */}
          <circle
            cx={ORIGIN.x}
            cy={ORIGIN.y}
            r="7"
            fill="var(--color-void)"
            stroke="var(--color-bone)"
            strokeWidth="1.6"
          />
          <circle cx={ORIGIN.x} cy={ORIGIN.y} r="2.4" fill="var(--color-bone)" />
          <text
            x={ORIGIN.x}
            y={ORIGIN.y - 22}
            textAnchor="middle"
            fontSize="11"
            letterSpacing="0.24em"
            fill="var(--color-bone)"
          >
            NOW
          </text>
        </svg>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 border-t border-[color:var(--hairline)] pt-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div>
          <InstrumentLabel tone="gold">{activeBranch.label}</InstrumentLabel>
          <p className="u-body mt-3 max-w-md">{activeBranch.summary}</p>
          <p className="mt-5 font-mono text-[0.625rem] tracking-[0.16em] text-rupture uppercase">
            No probability attached · none has been produced
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <InstrumentLabel as="h3">Drivers</InstrumentLabel>
            <ul className="mt-3 space-y-2">
              {activeBranch.drivers.map((driver) => (
                <li key={driver} className="text-[0.8125rem] leading-relaxed text-muted-bone">
                  {driver}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <InstrumentLabel as="h3">Assumptions that must hold</InstrumentLabel>
            <ul className="mt-3 space-y-2">
              {activeBranch.assumptions.map((assumption) => (
                <li
                  key={assumption}
                  className="text-[0.8125rem] leading-relaxed text-muted-bone"
                >
                  {assumption}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
