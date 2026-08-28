"use client";

import { Room } from "@/components/story/Room";
import { RoomBody } from "@/components/story/RoomBody";
import { RoomHeading } from "@/components/story/RoomHeading";
import { useChapterProgress } from "@/lib/story/use-chapter-progress";

/* ============================================================================
   ROOM 09 — THE GAP  (§15)
   ----------------------------------------------------------------------------
   Six windows, and connectors that reach toward the centre and stop short. The
   shortfall is the exhibit: the lines fail to meet because there is nothing in
   the middle for them to connect to. Only when the visitor reaches the end of
   the room does the label CAUSAL STRUCTURE appear in the space they were
   reaching for.
   ========================================================================== */

const WINDOWS = [
  { id: "dashboard", label: "Dashboard", knows: "A number moved." },
  { id: "forecast", label: "Forecast", knows: "What a number usually does." },
  { id: "search", label: "Search", knows: "Something was published." },
  { id: "research", label: "Research", knows: "What it meant last quarter." },
  { id: "simulation", label: "Simulation", knows: "What happens under fixed assumptions." },
  { id: "analyst", label: "Analyst", knows: "All of the above, and one working week." },
];

export function GapScene() {
  const progress = useChapterProgress("gap");
  const reach = Math.min(1, Math.max(0, (progress - 0.2) / 0.4));
  const centre = Math.min(1, Math.max(0, (progress - 0.62) / 0.28));

  return (
    <Room id="gap">
      <RoomHeading id="gap" />

      <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
        <RoomBody id="gap" />

        <figure>
          <svg viewBox="-150 -110 300 220" className="h-auto w-full" aria-hidden="true">
            {WINDOWS.map((window, index) => {
              const angle = (index / WINDOWS.length) * Math.PI * 2 - Math.PI / 2;
              const x = Math.cos(angle) * 108;
              const y = Math.sin(angle) * 74;
              // Connectors stop 26 units short of the centre, and the shortfall
              // never closes. That gap is the room's entire argument.
              const endX = x * (1 - reach * 0.72);
              const endY = y * (1 - reach * 0.72);
              return (
                <g key={window.id}>
                  <line
                    x1={x}
                    y1={y}
                    x2={endX}
                    y2={endY}
                    stroke="var(--color-signal)"
                    strokeWidth="0.7"
                    opacity={0.2 + reach * 0.4}
                    strokeDasharray="3 3"
                  />
                  <rect
                    x={x - 34}
                    y={y - 13}
                    width="68"
                    height="26"
                    fill="var(--color-void)"
                    stroke="var(--color-graphite)"
                  />
                  <text
                    x={x}
                    y={y - 1}
                    textAnchor="middle"
                    fontSize="7"
                    fontFamily="var(--font-mono)"
                    letterSpacing="0.14em"
                    fill="var(--color-bone)"
                  >
                    {window.label.toUpperCase()}
                  </text>
                  <text
                    x={x}
                    y={y + 8}
                    textAnchor="middle"
                    fontSize="5.4"
                    fontFamily="var(--font-mono)"
                    fill="var(--color-ash)"
                  >
                    {window.knows}
                  </text>
                </g>
              );
            })}

            <g opacity={centre}>
              <circle
                cx="0"
                cy="0"
                r="30"
                fill="none"
                stroke="var(--color-brass)"
                strokeWidth="0.6"
                strokeDasharray="2 4"
              />
              <text
                x="0"
                y="-1"
                textAnchor="middle"
                fontSize="7.5"
                fontFamily="var(--font-mono)"
                letterSpacing="0.16em"
                fill="var(--color-brass)"
              >
                CAUSAL
              </text>
              <text
                x="0"
                y="8"
                textAnchor="middle"
                fontSize="7.5"
                fontFamily="var(--font-mono)"
                letterSpacing="0.16em"
                fill="var(--color-brass)"
              >
                STRUCTURE
              </text>
            </g>
          </svg>
          <figcaption className="mt-4 max-w-[48ch] font-mono text-[0.68rem] leading-relaxed tracking-[0.08em] text-ash">
            The connectors stop short. Nothing in the middle holds a shared representation of the
            system all six instruments are observing.
          </figcaption>
        </figure>
      </div>
    </Room>
  );
}
