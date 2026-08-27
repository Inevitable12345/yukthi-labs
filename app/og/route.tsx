import { ImageResponse } from "next/og";

import { SITE } from "@/lib/metadata/site";

export const runtime = "nodejs";
export const alt = SITE.titleDefault;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * The Open Graph card.
 *
 * Drawn rather than photographed: a node with relations leaving it, which is the
 * smallest honest picture of what the company builds. System fonts only — a
 * remote font fetch is a build-time failure mode for very little gain.
 */
export function GET() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#070808",
        padding: "72px",
        fontFamily: "Georgia, serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
        <svg width="34" height="34" viewBox="0 0 24 24">
          <line x1="12" y1="12" x2="4" y2="19" stroke="#4a5c66" strokeWidth="1" />
          <line x1="12" y1="12" x2="20" y2="19" stroke="#4a5c66" strokeWidth="1" />
          <line x1="12" y1="12" x2="12" y2="4" stroke="#4a5c66" strokeWidth="1" />
          <circle cx="4" cy="19" r="1.6" fill="#ece7dc" opacity="0.7" />
          <circle cx="20" cy="19" r="1.6" fill="#ece7dc" opacity="0.7" />
          <circle cx="12" cy="4" r="1.6" fill="#ece7dc" opacity="0.7" />
          <circle cx="12" cy="12" r="2.6" fill="#bba36a" />
        </svg>
        <div
          style={{
            fontSize: 24,
            color: "#85827a",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            fontFamily: "monospace",
          }}
        >
          Yukthi Lab
        </div>
      </div>

      <div
        style={{
          display: "flex",
          fontSize: 78,
          lineHeight: 1.06,
          color: "#ece7dc",
          maxWidth: "900px",
          letterSpacing: "-0.02em",
        }}
      >
        {SITE.mission}
      </div>

      <div
        style={{
          display: "flex",
          borderTop: "1px solid rgba(236,231,220,0.14)",
          paddingTop: "28px",
          fontSize: 22,
          color: "#aaa59c",
          fontFamily: "monospace",
          letterSpacing: "0.06em",
        }}
      >
        Scoped Causal Hypergraph-based World Model
      </div>
    </div>,
    size,
  );
}
