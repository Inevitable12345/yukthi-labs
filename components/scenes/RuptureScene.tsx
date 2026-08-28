"use client";

import { useMemo } from "react";
import { Room } from "@/components/story/Room";
import { RoomBody } from "@/components/story/RoomBody";
import { RoomHeading } from "@/components/story/RoomHeading";
import { useChapterProgress } from "@/lib/story/use-chapter-progress";
import { seeded } from "@/lib/world/random";

/* ============================================================================
   ROOM 02 — RUPTURE  (§7)
   ----------------------------------------------------------------------------
   The world is rewired, not exploded. Routes do not vanish; they are redrawn
   inside blocs, and the handful that still cross between them thicken into the
   strategic dependencies the rest of the exhibition is about.

   Scrubbed by scroll so the visitor controls the transition and can run it
   backwards — which is the only way to see that nothing was destroyed.
   ========================================================================== */

const NODES = 34;
const ROUTES = 46;

type Node = { id: number; open: [number, number]; bloc: [number, number]; group: number };

function buildNodes(): Node[] {
  const random = seeded(4242);
  return Array.from({ length: NODES }, (_, id) => {
    const angle = (id / NODES) * Math.PI * 2 + random() * 0.2;
    const radius = 58 + random() * 46;
    const group = id % 4;
    const blocAngle = (group / 4) * Math.PI * 2 + Math.PI / 4;
    const clusterAngle = angle + (blocAngle - angle) * 0.86;
    const clusterRadius = 36 + random() * 26;
    return {
      id,
      open: [Math.cos(angle) * radius, Math.sin(angle) * radius * 0.62],
      bloc: [
        Math.cos(blocAngle) * 86 + Math.cos(clusterAngle) * clusterRadius * 0.5,
        Math.sin(blocAngle) * 54 + Math.sin(clusterAngle) * clusterRadius * 0.42,
      ],
      group,
    };
  });
}

export function RuptureScene() {
  const progress = useChapterProgress("rupture");
  const { nodes, routes } = useMemo(() => {
    const built = buildNodes();
    const random = seeded(1337);
    const list = Array.from({ length: ROUTES }, () => {
      const a = Math.floor(random() * NODES);
      const b = Math.floor(random() * NODES);
      return { a, b, cross: built[a]!.group !== built[b]!.group };
    });
    return { nodes: built, routes: list };
  }, []);

  // The rewiring runs across the middle of the room, leaving a settled state at
  // each end so the two topologies can actually be compared.
  const t = Math.min(1, Math.max(0, (progress - 0.18) / 0.5));

  return (
    <Room id="rupture" pinned={false}>
      <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-start lg:gap-20">
        <div>
          <RoomHeading id="rupture" />
          <RoomBody id="rupture" className="mt-9" />
        </div>

        <figure className="relative lg:sticky lg:top-28 lg:self-start">
          <svg viewBox="-140 -100 280 200" className="h-auto w-full" aria-hidden="true">
            <g>
              {routes.map((route, index) => {
                const a = nodes[route.a]!;
                const b = nodes[route.b]!;
                const ax = a.open[0] + (a.bloc[0] - a.open[0]) * t;
                const ay = a.open[1] + (a.bloc[1] - a.open[1]) * t;
                const bx = b.open[0] + (b.bloc[0] - b.open[0]) * t;
                const by = b.open[1] + (b.bloc[1] - b.open[1]) * t;
                // Cross-bloc routes thin out and the survivors brighten:
                // fewer, longer, more consequential.
                const survives = route.cross ? index % 5 === 0 : true;
                const opacity = route.cross
                  ? survives
                    ? 0.18 + t * 0.55
                    : 0.3 * (1 - t)
                  : 0.22 + t * 0.2;
                return (
                  <line
                    key={index}
                    x1={ax}
                    y1={ay}
                    x2={bx}
                    y2={by}
                    stroke={
                      route.cross && survives ? "var(--color-rupture)" : "var(--color-signal)"
                    }
                    strokeWidth={route.cross && survives ? 0.7 + t * 0.6 : 0.4}
                    opacity={opacity}
                  />
                );
              })}
            </g>
            <g>
              {nodes.map((node) => (
                <circle
                  key={node.id}
                  cx={node.open[0] + (node.bloc[0] - node.open[0]) * t}
                  cy={node.open[1] + (node.bloc[1] - node.open[1]) * t}
                  r={node.id % 7 === 0 ? 2.4 : 1.4}
                  fill="var(--color-brass)"
                  opacity={0.55 + (node.id % 7 === 0 ? 0.35 : 0.15)}
                />
              ))}
            </g>
          </svg>
          <figcaption className="mt-4 font-mono text-[0.68rem] leading-relaxed tracking-[0.1em] text-ash">
            {t < 0.5
              ? "Integrated topology. Routes distributed, substitutes plentiful, no single link decisive."
              : "Rewired topology. The same nodes, reorganised into blocs. The few surviving cross-bloc routes carry the exposure."}
          </figcaption>
        </figure>
      </div>
    </Room>
  );
}
