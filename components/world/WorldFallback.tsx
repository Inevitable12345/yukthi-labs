import { WORLD_COLOR } from "@/lib/world/palette";

/**
 * The world without WebGL (§31).
 *
 * Rendered on the server, shown to every visitor before the 3D layer resolves,
 * and kept permanently where WebGL is unavailable or unwelcome. It is a still
 * frame of the instrument, not a placeholder: it carries the same meridians,
 * strategic markers and causal structure at lower fidelity.
 *
 * Deliberately `aria-hidden`: the argument it illustrates is stated in full in
 * the surrounding prose, and a screen reader gains nothing from a description of
 * decorative geometry.
 */
export function WorldFallback() {
  const rings = [0.34, 0.52, 0.7, 0.88];
  const meridians = Array.from({ length: 7 }, (_, i) => (i / 7) * 180);

  // Deterministic marker placement — the same picture on every render.
  const markers = Array.from({ length: 34 }, (_, i) => {
    const angle = (i * 2.39996) % (Math.PI * 2);
    const radius = 0.16 + (((i * 37) % 71) / 71) * 0.78;
    return {
      x: 50 + Math.cos(angle) * radius * 42,
      y: 50 + Math.sin(angle) * radius * 34,
      r: i % 11 === 0 ? 1.5 : i % 4 === 0 ? 0.9 : 0.55,
      strategic: i % 11 === 0,
    };
  });

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      className="h-full w-full"
      aria-hidden="true"
      focusable="false"
    >
      <g opacity="0.5">
        {rings.map((ratio) => (
          <ellipse
            key={ratio}
            cx="50"
            cy="50"
            rx={ratio * 44}
            ry={ratio * 36}
            fill="none"
            stroke={WORLD_COLOR.steelDim}
            strokeWidth="0.12"
          />
        ))}

        {meridians.map((rotation) => (
          <ellipse
            key={rotation}
            cx="50"
            cy="50"
            rx="12"
            ry="38"
            fill="none"
            stroke={WORLD_COLOR.steelDim}
            strokeWidth="0.1"
            transform={`rotate(${rotation} 50 50)`}
          />
        ))}
      </g>

      {markers.map((marker, index) => (
        <circle
          key={index}
          cx={marker.x}
          cy={marker.y}
          r={marker.r}
          fill={marker.strategic ? WORLD_COLOR.gold : WORLD_COLOR.bone}
          opacity={marker.strategic ? 0.75 : 0.34}
        />
      ))}
    </svg>
  );
}
