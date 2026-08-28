"use client";

import { useMemo } from "react";
import { CONVERGENCE_GRAPH } from "@/content/scenarios";
import { seeded } from "@/lib/world/random";

/* ============================================================================
   SCOPE LENS  (§18)
   ----------------------------------------------------------------------------
   One field of nodes, six boundaries. Selecting a scope does not build a new
   world; it decides which part of this one is inside the question. Everything
   outside stays visible and dim, because a boundary the visitor cannot see is
   a boundary they cannot judge.
   ========================================================================== */

export function ScopeLens({ inScope }: { inScope: readonly string[] }) {
  const nodes = useMemo(() => {
    const random = seeded(58008);
    return CONVERGENCE_GRAPH.nodes.map((node) => ({
      id: node.id,
      label: node.label,
      x: (random() - 0.5) * 250,
      y: (random() - 0.5) * 150,
    }));
  }, []);

  const selected = new Set(inScope);
  const active = nodes.filter((node) => selected.has(node.id));

  return (
    <svg viewBox="-150 -100 300 200" className="h-auto w-full" aria-hidden="true">
      {/* The boundary itself: a hull loose enough to read as a choice. */}
      {active.length > 1 ? (
        <polygon
          points={hull(active)
            .map((point) => `${point.x},${point.y}`)
            .join(" ")}
          fill="var(--color-brass)"
          opacity="0.06"
          stroke="var(--color-brass-dim)"
          strokeWidth="0.6"
          strokeDasharray="3 3"
          style={{ transition: "all 600ms cubic-bezier(0.2,0.7,0.2,1)" }}
        />
      ) : null}

      {nodes.map((node) => {
        const inside = selected.has(node.id);
        return (
          <g key={node.id} style={{ transition: "opacity 500ms ease" }} opacity={inside ? 1 : 0.24}>
            <circle
              cx={node.x}
              cy={node.y}
              r={inside ? 3 : 1.8}
              fill={inside ? "var(--color-brass)" : "var(--color-ash)"}
            />
            <text
              x={node.x + 5}
              y={node.y + 2.6}
              fontSize="5.4"
              fontFamily="var(--font-mono)"
              letterSpacing="0.06em"
              fill={inside ? "var(--color-bone)" : "var(--color-ash)"}
            >
              {node.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/**
 * Convex hull, gift-wrapping. Small point counts, so the O(nh) cost is free and
 * the result is stable — which matters more here than asymptotics.
 */
function hull(points: { x: number; y: number }[]): { x: number; y: number }[] {
  if (points.length < 3) return points;
  const start = points.reduce((left, point) => (point.x < left.x ? point : left), points[0]!);
  const result: { x: number; y: number }[] = [];
  let current = start;

  for (let guard = 0; guard < points.length + 1; guard += 1) {
    result.push(current);
    let next = points[0]!;
    for (const candidate of points) {
      if (candidate === current) continue;
      const cross =
        (next.x - current.x) * (candidate.y - current.y) -
        (next.y - current.y) * (candidate.x - current.x);
      if (next === current || cross < 0) next = candidate;
    }
    if (next === start) break;
    current = next;
  }

  return result;
}
