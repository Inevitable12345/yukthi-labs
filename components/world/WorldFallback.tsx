"use client";

import { useMemo } from "react";
import { ROOM_BY_ID } from "@/lib/story/chapters";
import { useStory } from "@/lib/story/use-story";
import { positionFor, relationPairs } from "@/lib/world/forms";

/* ============================================================================
   WORLD FALLBACK  (§41)
   ----------------------------------------------------------------------------
   When WebGL is unavailable the exhibition does not lose its protagonist. The
   same form geometry that drives the particle system is projected orthographic-
   ally into SVG, at a density a phone can transition without complaint.

   This is the second reason the geometry in `lib/world/forms` is pure: it has
   to render identically in two completely different pipelines.
   ========================================================================== */

const NODES = 110;
const EDGES = 74;
const SCALE = 46;

export function WorldFallback() {
  const { chapter } = useStory();
  const form = ROOM_BY_ID[chapter].world;

  const { nodes, edges } = useMemo(() => {
    const points = Array.from({ length: NODES }, (_, index) => {
      const point = positionFor(form, index, NODES);
      // Orthographic projection with a slight vertical compression, so the
      // depth axis reads as depth rather than as scatter.
      return { x: point.x * SCALE, y: -point.y * SCALE * 0.86, depth: point.z };
    });
    const pairs = relationPairs(form, NODES, EDGES);
    const lines: { a: number; b: number }[] = [];
    for (let index = 0; index < EDGES; index += 1) {
      lines.push({ a: pairs[index * 2] ?? 0, b: pairs[index * 2 + 1] ?? 0 });
    }
    return { nodes: points, edges: lines };
  }, [form]);

  return (
    <svg
      viewBox="-190 -170 380 340"
      role="img"
      aria-label={`Schematic of the world model in its ${form.replace(/-/g, " ")} form. The full argument, evidence and diagrams are available as text on this page.`}
      className="h-full w-full"
      preserveAspectRatio="xMidYMid slice"
    >
      <g stroke="var(--color-signal)" strokeWidth="0.4" opacity="0.3">
        {edges.map((edge, index) => {
          const a = nodes[edge.a];
          const b = nodes[edge.b];
          if (!a || !b) return null;
          return (
            <line
              key={index}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              style={{ transition: "all 1200ms cubic-bezier(0.2,0.7,0.2,1)" }}
            />
          );
        })}
      </g>
      <g>
        {nodes.map((node, index) => (
          <circle
            key={index}
            r={index % 9 === 0 ? 1.5 : 0.85}
            fill={index % 4 === 0 ? "var(--color-signal)" : "var(--color-brass)"}
            opacity={0.32 + (node.depth + 3) / 12}
            style={{
              transform: `translate(${node.x}px, ${node.y}px)`,
              transition: "transform 1200ms cubic-bezier(0.2,0.7,0.2,1)",
            }}
          />
        ))}
      </g>
    </svg>
  );
}
