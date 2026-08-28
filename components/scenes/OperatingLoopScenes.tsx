"use client";

import { CausalDiagram } from "@/components/causal/CausalDiagram";
import { ScenarioSimulator } from "@/components/causal/ScenarioSimulator";
import { CHOKEPOINT_GRAPH } from "@/content/scenarios";
import { EVIDENCE } from "@/content/evidence";
import { Room } from "@/components/story/Room";
import { RoomBody } from "@/components/story/RoomBody";
import { RoomHeading } from "@/components/story/RoomHeading";
import { Reveal } from "@/components/ui/Reveal";
import { useChapterProgress } from "@/lib/story/use-chapter-progress";

/* ============================================================================
   ROOMS 13–17 — MAP, MONITOR, FORECAST, SIMULATE, RE-MAP  (§19–§23)
   ----------------------------------------------------------------------------
   Five rooms, one system. They live in one file because they are one movement
   of the argument, and separating them into five feature components would have
   made it too easy to let them drift into five feature cards — which §23
   explicitly forbids.
   ========================================================================== */

/* -------------------------------------------------------------- Room 13 -- */

export function MapScene() {
  const progress = useChapterProgress("map");
  const assembled = Math.min(1, Math.max(0, (progress - 0.15) / 0.55));

  // Nodes enter in causal order, so the structure is watched being built rather
  // than presented finished.
  const visible = new Set(
    CHOKEPOINT_GRAPH.nodes
      .slice(0, Math.ceil(assembled * CHOKEPOINT_GRAPH.nodes.length))
      .map((node) => node.id),
  );

  return (
    <Room id="map" hold={2.6}>
      <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div>
          <RoomHeading id="map" />
          <RoomBody id="map" className="mt-9" />
        </div>
        <div>
          <CausalDiagram graph={CHOKEPOINT_GRAPH} activeNodeIds={visible} />
        </div>
      </div>
    </Room>
  );
}

/* -------------------------------------------------------------- Room 14 -- */

const MONITOR_EFFECTS = [
  { effect: "Confirms", detail: "an existing relation, and the support beneath it thickens." },
  { effect: "Contradicts", detail: "a relation, and it is marked for review rather than deleted." },
  { effect: "Weakens", detail: "the evidence under a mechanism that used to look settled." },
  { effect: "Introduces", detail: "a node the scope did not previously contain." },
  { effect: "Changes", detail: "a relationship's direction, condition or lag." },
  { effect: "Widens", detail: "the uncertainty attached to a mechanism." },
];

export function MonitorScene() {
  const progress = useChapterProgress("monitor");
  const arriving = Math.min(1, Math.max(0, (progress - 0.12) / 0.6));

  return (
    <Room id="monitor" hold={2.6}>
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div>
          <RoomHeading id="monitor" />
          <RoomBody id="monitor" className="mt-9" showLadder={false} />
        </div>

        <div>
          <ol className="grid gap-px bg-graphite">
            {MONITOR_EFFECTS.map((row, index) => {
              const local = Math.min(1, Math.max(0, arriving * MONITOR_EFFECTS.length - index));
              return (
                <li key={row.effect} className="bg-void px-5 py-4">
                  <span
                    className="font-mono text-[0.72rem] tracking-[0.18em] uppercase transition-colors duration-300"
                    style={{ color: local > 0.5 ? "var(--color-brass)" : "var(--color-ash)" }}
                  >
                    {row.effect}
                  </span>
                  <span className="ml-2 text-[0.88rem] text-bone/80">{row.detail}</span>
                </li>
              );
            })}
          </ol>

          <div className="mt-8 border border-graphite bg-ink/40 p-5">
            <p className="label-dim">Evidence currently in this exhibition</p>
            <ul className="mt-3 space-y-1.5">
              {EVIDENCE.slice(0, 6).map((record, index) => {
                const local = Math.min(1, Math.max(0, arriving * 8 - index));
                return (
                  <li
                    key={record.id}
                    className="font-mono text-[0.66rem] tracking-[0.06em] text-ash transition-transform duration-300"
                    style={{ transform: `translateX(${(1 - local) * 8}px)` }}
                  >
                    <span
                      style={{ color: local > 0.5 ? "var(--color-brass)" : "var(--color-ash)" }}
                    >
                      {record.organization}
                    </span>{" "}
                    — {record.date}
                  </li>
                );
              })}
              <li className="font-mono text-[0.66rem] tracking-[0.06em] text-ash">
                and {EVIDENCE.length - 6} more, listed in full on the evidence page.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Room>
  );
}

/* -------------------------------------------------------------- Room 15 -- */

const BRANCHES = [
  {
    id: "A",
    title: "Restriction holds, buffers absorb",
    assumptions: "Licensing continues; held inventory covers the requalification window.",
    path: "Policy → processing → oxide supply → magnet output, absorbed at inventory.",
    uncertainty: "Concentrated in the true depth of buffers, which is rarely public.",
  },
  {
    id: "B",
    title: "Restriction holds, buffers exhaust",
    assumptions: "Licensing continues; requalification runs longer than coverage.",
    path: "Policy → … → magnet output → motors → programme schedules.",
    uncertainty: "Concentrated in requalification timelines, which differ by sector.",
  },
  {
    id: "C",
    title: "Substitution capacity arrives",
    assumptions: "Separation capacity is commissioned outside the restricted jurisdiction.",
    path: "Investment → processing capacity → oxide supply, relieving the constraint.",
    uncertainty: "Concentrated in construction and qualification lead times.",
  },
];

export function ForecastScene() {
  const progress = useChapterProgress("forecast");
  const spread = Math.min(1, Math.max(0, (progress - 0.15) / 0.5));

  return (
    <Room id="forecast" hold={2.6}>
      <RoomHeading id="forecast" />

      <div className="mt-12 grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
        <RoomBody id="forecast" />

        <div>
          <svg viewBox="-10 -60 320 120" className="h-auto w-full" aria-hidden="true">
            <line x1="0" y1="0" x2="90" y2="0" stroke="var(--color-bone)" strokeWidth="1.2" />
            {BRANCHES.map((branch, index) => {
              const direction = index - 1;
              const y = direction * 44 * spread;
              return (
                <g key={branch.id}>
                  <path
                    d={`M 90 0 C 150 0, 190 ${y}, 290 ${y}`}
                    fill="none"
                    stroke="var(--color-signal)"
                    strokeWidth="1"
                    strokeDasharray="5 4"
                    opacity={0.35 + spread * 0.5}
                  />
                  <text
                    x="296"
                    y={y + 3}
                    fontSize="9"
                    fontFamily="var(--font-mono)"
                    fill="var(--color-brass)"
                  >
                    {branch.id}
                  </text>
                </g>
              );
            })}
            <text
              x="0"
              y="-10"
              fontSize="7"
              fontFamily="var(--font-mono)"
              fill="var(--color-ash)"
              letterSpacing="0.12em"
            >
              PRESENT STRUCTURE
            </text>
          </svg>

          <ul className="mt-8 grid gap-px bg-graphite lg:grid-cols-3">
            {BRANCHES.map((branch, index) => (
              <li key={branch.id} className="bg-void p-5">
                <Reveal delay={index * 80}>
                  <p className="font-mono text-[0.72rem] tracking-[0.2em] text-brass">
                    STATE {branch.id}
                  </p>
                  <h3 className="mt-2 font-display text-[1.02rem] leading-snug">{branch.title}</h3>
                  <dl className="mt-4 space-y-3 text-[0.8rem] leading-relaxed">
                    <div>
                      <dt className="label-dim">Assumptions</dt>
                      <dd className="mt-1 text-bone/80">{branch.assumptions}</dd>
                    </div>
                    <div>
                      <dt className="label-dim">Causal path</dt>
                      <dd className="mt-1 text-bone/80">{branch.path}</dd>
                    </div>
                    <div>
                      <dt className="label-dim">Uncertainty</dt>
                      <dd className="mt-1 text-ash">{branch.uncertainty}</dd>
                    </div>
                  </dl>
                </Reveal>
              </li>
            ))}
          </ul>

          <p className="mt-6 font-mono text-[0.68rem] leading-relaxed tracking-[0.08em] text-ash">
            No probability is attached to any branch. Calibration is demonstrated against outcomes
            over time; asserting a number here would be the failure this thesis argues against.
          </p>
        </div>
      </div>
    </Room>
  );
}

/* -------------------------------------------------------------- Room 16 -- */

export function SimulateScene() {
  return (
    <Room id="simulate">
      <RoomHeading id="simulate" />
      <div className="mt-12 grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
        <RoomBody id="simulate" showEvidence={false} />
        <ScenarioSimulator />
      </div>
    </Room>
  );
}

/* -------------------------------------------------------------- Room 17 -- */

const LOOP = ["Map", "Monitor", "Forecast", "Simulate", "Re-map"];

export function RemapScene() {
  const progress = useChapterProgress("remap");
  const turn = Math.min(1, Math.max(0, (progress - 0.1) / 0.7));
  const activeStep = Math.min(LOOP.length - 1, Math.floor(turn * LOOP.length));

  return (
    <Room id="remap" hold={2.4}>
      <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-16">
        <div>
          <RoomHeading id="remap" />
          <RoomBody id="remap" className="mt-9" />
        </div>

        <figure>
          <svg
            viewBox="-110 -110 220 220"
            className="mx-auto h-auto w-full max-w-[24rem]"
            aria-hidden="true"
          >
            <circle
              cx="0"
              cy="0"
              r="72"
              fill="none"
              stroke="var(--color-graphite)"
              strokeWidth="0.8"
            />
            <circle
              cx="0"
              cy="0"
              r="72"
              fill="none"
              stroke="var(--color-brass)"
              strokeWidth="1.2"
              strokeDasharray={`${452 * turn} 452`}
              transform="rotate(-90)"
            />
            {LOOP.map((step, index) => {
              const angle = (index / LOOP.length) * Math.PI * 2 - Math.PI / 2;
              const x = Math.cos(angle) * 72;
              const y = Math.sin(angle) * 72;
              const active = index <= activeStep;
              return (
                <g key={step}>
                  <circle
                    cx={x}
                    cy={y}
                    r={active ? 4.5 : 3}
                    fill={active ? "var(--color-brass)" : "var(--color-graphite)"}
                  />
                  <text
                    x={x * 1.28}
                    y={y * 1.28 + 3}
                    textAnchor="middle"
                    fontSize="8"
                    fontFamily="var(--font-mono)"
                    letterSpacing="0.14em"
                    fill={active ? "var(--color-bone)" : "var(--color-ash)"}
                  >
                    {step.toUpperCase()}
                  </text>
                </g>
              );
            })}
          </svg>
          <figcaption className="mt-4 text-center font-mono text-[0.68rem] tracking-[0.1em] text-ash">
            One continuous system, not five features.
          </figcaption>
        </figure>
      </div>
    </Room>
  );
}
