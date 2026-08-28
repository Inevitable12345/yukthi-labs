import { ImageResponse } from "next/og";
import { SITE } from "@/lib/metadata/site";

export const runtime = "nodejs";

/**
 * Open Graph card (§45). Generated rather than stored, so it always carries the
 * page's own title, and drawn with the site's own palette so a shared link
 * reads as part of the same institution.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = (searchParams.get("title") ?? SITE.name).slice(0, 120);
  const caption = (searchParams.get("caption") ?? SITE.mission).slice(0, 180);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#05070a",
        padding: "72px",
        fontFamily: "serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ width: 12, height: 12, background: "#c8a45c", borderRadius: 999 }} />
        <div
          style={{
            color: "#c8a45c",
            fontSize: 22,
            letterSpacing: 8,
            textTransform: "uppercase",
            fontFamily: "monospace",
          }}
        >
          Yukthi Lab
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
        <div style={{ color: "#e7e3da", fontSize: 66, lineHeight: 1.05, maxWidth: 980 }}>
          {title}
        </div>
        <div style={{ color: "#8b929e", fontSize: 28, lineHeight: 1.4, maxWidth: 900 }}>
          {caption}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          borderTop: "1px solid #232a35",
          paddingTop: 24,
          color: "#8b929e",
          fontSize: 20,
          letterSpacing: 4,
          fontFamily: "monospace",
          textTransform: "uppercase",
        }}
      >
        <span>Map → Monitor → Forecast → Simulate → Re-map</span>
        <span>Observatory</span>
      </div>
    </div>,
    { width: 1200, height: 630 },
  );
}
