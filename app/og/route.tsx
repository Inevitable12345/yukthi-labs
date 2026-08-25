import { ImageResponse } from "next/og";

import { buildField } from "@/lib/graph/field";
import { SITE } from "@/lib/metadata/site";

export const runtime = "nodejs";
export const contentType = "image/png";

const WIDTH = 1200;
const HEIGHT = 630;

/**
 * Open Graph card.
 *
 * Drawn, not templated: a near-black field, a real projection of the same causal
 * field the site renders, the mission line, and coordinate inscriptions. No
 * gradient, no stock imagery, no screenshot of a product that does not exist.
 *
 * `?title=` renders a route's own title beneath the wordmark; without it the card
 * carries the mission.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawTitle = searchParams.get("title")?.slice(0, 90) ?? "";
  const title = rawTitle.trim();

  const field = buildField(70, 90210);
  const project = (node: { x: number; y: number; z: number }) => ({
    x: WIDTH * 0.66 + node.x * 250,
    y: HEIGHT * 0.5 + node.y * 250,
    depth: (node.z + 0.62) / 1.24,
  });
  const points = field.nodes.map(project);

  return new ImageResponse(
    <div
      style={{
        width: WIDTH,
        height: HEIGHT,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#070808",
        padding: 64,
        position: "relative",
        fontFamily: "sans-serif",
      }}
    >
      {/* the field */}
      <svg width={WIDTH} height={HEIGHT} style={{ position: "absolute", top: 0, left: 0 }}>
        {field.edges.map((edge, index) => {
          const a = points[edge.a]!;
          const b = points[edge.b]!;
          return (
            <line
              key={index}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke="#7d98a7"
              strokeWidth={0.7}
              strokeOpacity={0.06 + edge.strength * 0.16}
            />
          );
        })}
        {field.nodes.map((node, index) => {
          const point = points[index]!;
          const isKey = node.weight > 0.72;
          return (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r={isKey ? 3.4 : 1.6}
              fill={isKey ? "#bba36a" : "#ece7dc"}
              fillOpacity={isKey ? 0.9 : 0.2 + point.depth * 0.3}
            />
          );
        })}
        {/* horizon */}
        <line
          x1={0}
          y1={HEIGHT - 118}
          x2={WIDTH}
          y2={HEIGHT - 118}
          stroke="#ece7dc"
          strokeOpacity={0.12}
          strokeWidth={1}
        />
      </svg>

      <div style={{ display: "flex", alignItems: "center", gap: 16, position: "relative" }}>
        <svg width="34" height="34" viewBox="0 0 32 32">
          <circle cx="16" cy="16" r="14.25" stroke="#bba36a" strokeOpacity="0.4" fill="none" />
          <circle cx="16" cy="16" r="9.5" stroke="#bba36a" strokeOpacity="0.2" fill="none" />
          <path d="M1.75 16H30.25" stroke="#bba36a" strokeOpacity="0.2" />
          <path
            d="M8.4 10.6 16 16m7.6-5.4L16 16m0 0v6.9"
            stroke="#bba36a"
            strokeWidth="1.2"
            fill="none"
          />
          <circle cx="8.4" cy="10.6" r="1.7" fill="#bba36a" />
          <circle cx="23.6" cy="10.6" r="1.7" fill="#bba36a" />
          <circle cx="16" cy="23.4" r="2.15" fill="#bba36a" />
        </svg>
        <div
          style={{
            display: "flex",
            fontSize: 19,
            letterSpacing: 7,
            color: "#ece7dc",
            textTransform: "uppercase",
          }}
        >
          Yukthi Lab
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", position: "relative" }}>
        <div
          style={{
            display: "flex",
            fontSize: title ? 62 : 70,
            lineHeight: 1.05,
            color: "#ece7dc",
            maxWidth: 760,
            letterSpacing: -1.5,
          }}
        >
          {title || SITE.mission}
        </div>
        {title ? (
          <div
            style={{
              display: "flex",
              marginTop: 22,
              fontSize: 22,
              color: "#aaa59c",
              maxWidth: 700,
              lineHeight: 1.4,
            }}
          >
            {SITE.mission}
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              marginTop: 26,
              fontSize: 18,
              letterSpacing: 5,
              color: "#bba36a",
              textTransform: "uppercase",
            }}
          >
            {SITE.loop.join("  →  ")}
          </div>
        )}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          position: "relative",
          fontSize: 14,
          letterSpacing: 3.4,
          color: "#6f6c66",
          textTransform: "uppercase",
        }}
      >
        <div style={{ display: "flex" }}>Scoped causal hypergraph-based world model</div>
        <div style={{ display: "flex" }}>Evidence · causality · uncertainty</div>
      </div>
    </div>,
    {
      width: WIDTH,
      height: HEIGHT,
      headers: {
        "Cache-Control": "public, max-age=3600, s-maxage=86400, immutable",
      },
    },
  );
}
