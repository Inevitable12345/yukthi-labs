"use client";

import { useMemo } from "react";
import { seeded } from "@/lib/world/random";

/* ============================================================================
   THE REVEAL  (§17)
   ----------------------------------------------------------------------------
   Ten stages, one continuous scalar. The globe shell fades; the geographic
   nodes stay; the nodes leave their coordinates; the relationships reorganise
   around causation; pairwise edges form; hyperedges form; evidence attaches;
   mechanisms appear; uncertainty becomes visible; futures branch.

   The moment the argument has been building toward is stage three. Everything
   before it is a map. Everything after it is a model. The animation is
   scrubbed, not played, so a visitor can hold that moment still and look at it.
   ========================================================================== */

export const REVEAL_STAGES = [
  "The globe shell fades",
  "Geographic nodes remain",
  "Nodes detach from geographic coordinates",
  "Relationships reorganise around causality",
  "Pairwise edges form",
  "Hyperedges form",
  "Evidence attaches",
  "Mechanisms appear",
  "Uncertainty becomes visible",
  "Future branches appear",
] as const;

const NODE_COUNT = 22;
const HYPEREDGES = 4;

type RevealNode = {
  geo: [number, number];
  causal: [number, number];
  layer: number;
  edge: number;
};

function build(): RevealNode[] {
  const random = seeded(20250404);
  return Array.from({ length: NODE_COUNT }, (_, index) => {
    // Geographic placement: on the shell, as a map would put it.
    const lat = (random() - 0.5) * Math.PI * 0.82;
    const lon = random() * Math.PI * 2;
    const geo: [number, number] = [Math.cos(lat) * Math.sin(lon) * 88, -Math.sin(lat) * 62];

    // Causal placement: depth from the causes, and nothing else.
    const layer = index % 5;
    const within = Math.floor(index / 5);
    const causal: [number, number] = [-92 + within * 44 + (layer % 2) * 16, -62 + layer * 31];

    return { geo, causal, layer, edge: index % HYPEREDGES };
  });
}

export function stageIndex(progress: number): number {
  return Math.min(REVEAL_STAGES.length - 1, Math.floor(progress * REVEAL_STAGES.length));
}

/** Strength of one stage, ramping in over the first third of its own window. */
function at(progress: number, stage: number): number {
  const span = 1 / REVEAL_STAGES.length;
  return Math.min(1, Math.max(0, (progress - stage * span) / (span * 0.75)));
}

export function YukthiReveal({ progress }: { progress: number }) {
  const t = Math.min(1, Math.max(0, progress));
  const nodes = useMemo(() => build(), []);

  const shell = 1 - at(t, 0);
  const detach = at(t, 2);
  const pairwise = at(t, 4);
  const hyper = at(t, 5);
  const evidence = at(t, 6);
  const mechanisms = at(t, 7);
  const uncertainty = at(t, 8);
  const futures = at(t, 9);

  const placed = nodes.map((node) => ({
    ...node,
    x: node.geo[0] + (node.causal[0] - node.geo[0]) * detach,
    y: node.geo[1] + (node.causal[1] - node.geo[1]) * detach,
  }));

  const edgeCentres = Array.from({ length: HYPEREDGES }, (_, edge) => {
    const members = placed.filter((node) => node.edge === edge);
    const sum = members.reduce((total, node) => ({ x: total.x + node.x, y: total.y + node.y }), {
      x: 0,
      y: 0,
    });
    return { x: sum.x / (members.length || 1), y: sum.y / (members.length || 1) };
  });

  return (
    <svg viewBox="-130 -95 260 195" className="h-auto w-full" aria-hidden="true">
      {/* Stage 1 — the shell, and the meridians that made it a globe. */}
      <g opacity={shell} stroke="var(--color-graphite)" fill="none">
        <circle cx="0" cy="0" r="72" strokeWidth="0.7" />
        {[0.32, 0.62, 0.88].map((k) => (
          <ellipse key={k} cx="0" cy="0" rx={72 * k} ry="72" strokeWidth="0.4" />
        ))}
        <ellipse cx="0" cy="0" rx="72" ry="24" strokeWidth="0.4" />
      </g>

      {/* Stage 9 — uncertainty, drawn as a field around each node rather than
          as a number, because no number would be honest here. */}
      <g opacity={uncertainty * 0.5}>
        {placed.map((node, index) => (
          <circle
            key={`u-${index}`}
            cx={node.x}
            cy={node.y}
            r={6 + (index % 4) * 2.6}
            fill="var(--color-signal)"
            opacity="0.1"
          />
        ))}
      </g>

      {/* Stages 4–5 — pairwise edges, then the hyperedge junctions that
          supersede them. */}
      <g stroke="var(--color-signal)" fill="none" opacity={pairwise * (1 - hyper * 0.65)}>
        {placed.slice(0, NODE_COUNT - 1).map((node, index) => {
          const next = placed[index + 1]!;
          return (
            <line
              key={`p-${index}`}
              x1={node.x}
              y1={node.y}
              x2={next.x}
              y2={next.y}
              strokeWidth="0.5"
            />
          );
        })}
      </g>

      <g opacity={hyper}>
        {edgeCentres.map((centre, edge) => (
          <g key={`h-${edge}`}>
            {placed
              .filter((node) => node.edge === edge)
              .map((node, index) => (
                <line
                  key={index}
                  x1={node.x}
                  y1={node.y}
                  x2={centre.x}
                  y2={centre.y}
                  stroke="var(--color-brass)"
                  strokeWidth="0.6"
                  opacity="0.7"
                />
              ))}
            <circle
              cx={centre.x}
              cy={centre.y}
              r="4"
              fill="var(--color-void)"
              stroke="var(--color-brass)"
              strokeWidth="0.9"
            />
            <text
              x={centre.x}
              y={centre.y + 2.4}
              textAnchor="middle"
              fontSize="5.5"
              fontFamily="var(--font-mono)"
              fill="var(--color-brass)"
            >
              &amp;
            </text>
            {/* Stage 8 — the mechanism written on the edge. An edge without one
                does not enter the model. */}
            <text
              x={centre.x + 7}
              y={centre.y - 4}
              fontSize="4.4"
              fontFamily="var(--font-mono)"
              letterSpacing="0.08em"
              fill="var(--color-ash)"
              opacity={mechanisms}
            >
              MECHANISM
            </text>
          </g>
        ))}
      </g>

      {/* Stage 7 — evidence attaching from outside the structure. */}
      <g opacity={evidence}>
        {placed.slice(0, 9).map((node, index) => {
          const originX = node.x + (index % 2 === 0 ? -1 : 1) * 46;
          const originY = node.y - 44 + (index % 3) * 12;
          return (
            <g key={`e-${index}`}>
              <line
                x1={originX}
                y1={originY}
                x2={node.x}
                y2={node.y}
                stroke="var(--color-brass-dim)"
                strokeWidth="0.35"
                strokeDasharray="1.5 2"
              />
              <rect
                x={originX - 2}
                y={originY - 2}
                width="4"
                height="4"
                fill="var(--color-brass)"
                opacity="0.75"
              />
            </g>
          );
        })}
      </g>

      {/* Stage 10 — futures leaving the structure. */}
      <g opacity={futures} stroke="var(--color-signal)" fill="none">
        {[-1, 0, 1].map((direction) => (
          <path
            key={direction}
            d={`M 0 78 C ${direction * 24} 92, ${direction * 62} 96, ${direction * 96} 100`}
            strokeWidth="0.8"
            strokeDasharray="4 3"
            opacity={0.75 - Math.abs(direction) * 0.2}
          />
        ))}
      </g>

      <g>
        {placed.map((node, index) => (
          <circle
            key={`n-${index}`}
            cx={node.x}
            cy={node.y}
            r={index % 6 === 0 ? 2.9 : 1.9}
            fill={index % 6 === 0 ? "var(--color-brass)" : "var(--color-bone)"}
            opacity={0.55 + detach * 0.45}
          />
        ))}
      </g>
    </svg>
  );
}
