"use client";

import { line as d3line, curveMonotoneX } from "d3-shape";
import { scaleLinear } from "d3-scale";
import { useMemo } from "react";
import { BREAK_INDEX, STRUCTURAL_BREAK_SERIES } from "@/content/scenarios";

/* ============================================================================
   STRUCTURAL BREAK  (§11)
   ----------------------------------------------------------------------------
   A smooth expectation, a regime change, and the divergence that follows.

   The series is a schematic of the shape the ECB documented, and the chart says
   so on its own face. Reproducing a published series would invite the reader to
   treat these as measured values; inventing one and not saying so would be
   worse. The exhibit's claim is about the shape of a break (§46).
   ========================================================================== */

const WIDTH = 300;
const HEIGHT = 170;
const PAD = { top: 16, right: 18, bottom: 30, left: 30 };

export function BreakChart({ progress }: { progress: number }) {
  const t = Math.min(1, Math.max(0, progress));

  const { expectedPath, realizedPath, breakX, x, y } = useMemo(() => {
    const xScale = scaleLinear()
      .domain([0, STRUCTURAL_BREAK_SERIES.length - 1])
      .range([PAD.left, WIDTH - PAD.right]);
    const yScale = scaleLinear()
      .domain([0, 9.4])
      .range([HEIGHT - PAD.bottom, PAD.top]);

    const generator = d3line<{ t: number; value: number }>()
      .x((point) => xScale(point.t))
      .y((point) => yScale(point.value))
      .curve(curveMonotoneX);

    return {
      expectedPath:
        generator(STRUCTURAL_BREAK_SERIES.map((row) => ({ t: row.t, value: row.expected }))) ?? "",
      realizedPath:
        generator(STRUCTURAL_BREAK_SERIES.map((row) => ({ t: row.t, value: row.realized }))) ?? "",
      breakX: xScale(BREAK_INDEX),
      x: xScale,
      y: yScale,
    };
  }, []);

  // The realised line is drawn on as the room is traversed, so the divergence
  // is watched rather than presented.
  const dash = 900;

  return (
    <figure>
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="h-auto w-full" aria-hidden="true">
        <g stroke="var(--color-graphite)" strokeWidth="0.5" opacity="0.6">
          {[0, 2, 4, 6, 8].map((value) => (
            <line key={value} x1={PAD.left} y1={y(value)} x2={WIDTH - PAD.right} y2={y(value)} />
          ))}
        </g>

        <g opacity={t > 0.25 ? 1 : 0} style={{ transition: "opacity 500ms ease" }}>
          <line
            x1={breakX}
            y1={PAD.top}
            x2={breakX}
            y2={HEIGHT - PAD.bottom}
            stroke="var(--color-rupture)"
            strokeWidth="0.8"
            strokeDasharray="3 3"
          />
          <text
            x={breakX + 5}
            y={HEIGHT - PAD.bottom - 8}
            fontSize="7"
            fontFamily="var(--font-mono)"
            fill="var(--color-rupture)"
            letterSpacing="0.1em"
          >
            THE REGIME CHANGES
          </text>
        </g>

        <path
          d={expectedPath}
          fill="none"
          stroke="var(--color-ash)"
          strokeWidth="1.2"
          strokeDasharray="4 3"
        />

        <path
          d={realizedPath}
          fill="none"
          stroke="var(--color-rupture)"
          strokeWidth="1.6"
          strokeDasharray={dash}
          strokeDashoffset={dash * (1 - Math.min(1, t * 1.25))}
        />

        <text
          x={WIDTH - PAD.right}
          y={y(2.4)}
          textAnchor="end"
          fontSize="7"
          fontFamily="var(--font-mono)"
          fill="var(--color-ash)"
          letterSpacing="0.1em"
        >
          EXPECTED
        </text>
        <text
          x={WIDTH - PAD.right}
          y={y(8.9) - 8}
          textAnchor="end"
          fontSize="7"
          fontFamily="var(--font-mono)"
          fill="var(--color-rupture)"
          letterSpacing="0.1em"
        >
          REALIZED
        </text>

        <line
          x1={PAD.left}
          y1={HEIGHT - PAD.bottom}
          x2={WIDTH - PAD.right}
          y2={HEIGHT - PAD.bottom}
          stroke="var(--color-graphite)"
        />
        <text
          x={PAD.left}
          y={HEIGHT - PAD.bottom + 14}
          fontSize="7"
          fontFamily="var(--font-mono)"
          fill="var(--color-ash)"
          letterSpacing="0.1em"
        >
          TIME →
        </text>
      </svg>

      <figcaption className="mt-3 max-w-[52ch] font-mono text-[0.66rem] leading-relaxed tracking-[0.08em] text-ash">
        Schematic. This is the shape of a structural break, not a reproduction of any published
        series. The ECB&rsquo;s own examination of its projection errors is linked below.
      </figcaption>
    </figure>
  );
}
