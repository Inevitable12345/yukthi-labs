import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/**
 * The mark at favicon scale: a ring, a meridian, and one node off the axis.
 * Generated rather than stored so it stays in step with the palette.
 */
export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#05070a",
      }}
    >
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="#e7e3da" strokeWidth="1.2" opacity="0.65" />
        <ellipse cx="12" cy="12" rx="3.6" ry="9" stroke="#e7e3da" strokeWidth="1" opacity="0.35" />
        <path d="M3 12h18" stroke="#e7e3da" strokeWidth="1" opacity="0.35" />
        <circle cx="17.4" cy="7.2" r="2.4" fill="#c8a45c" />
      </svg>
    </div>,
    size,
  );
}
