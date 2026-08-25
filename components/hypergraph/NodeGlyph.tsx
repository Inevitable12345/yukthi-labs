import type { NodeKind } from "@/data/schema";

/**
 * One geometric form per node kind, so the type of a thing is legible without
 * reading its label — and without relying on colour alone.
 */
export function NodeGlyph({
  kind,
  x,
  y,
  r = 7,
  tone,
  emphasis = false,
}: {
  kind: NodeKind;
  x: number;
  y: number;
  r?: number;
  tone: string;
  emphasis?: boolean;
}) {
  const stroke = tone;
  const fill = emphasis ? tone : "var(--color-void)";
  const strokeWidth = emphasis ? 1.6 : 1.2;
  const common = { stroke, fill, strokeWidth, vectorEffect: "non-scaling-stroke" as const };

  switch (kind) {
    case "policy":
      // Square: an imposed rule.
      return <rect x={x - r} y={y - r} width={r * 2} height={r * 2} {...common} />;
    case "event":
      // Diamond: something that happened at a point in time.
      return (
        <path
          d={`M ${x} ${y - r * 1.25} L ${x + r * 1.15} ${y} L ${x} ${y + r * 1.25} L ${x - r * 1.15} ${y} Z`}
          {...common}
        />
      );
    case "risk":
      // Triangle: an unrealised possibility.
      return (
        <path
          d={`M ${x} ${y - r * 1.3} L ${x + r * 1.2} ${y + r * 0.85} L ${x - r * 1.2} ${y + r * 0.85} Z`}
          {...common}
        />
      );
    case "mechanism":
      // Circle crossed by its own axis: transmission.
      return (
        <g>
          <circle cx={x} cy={y} r={r} {...common} />
          <path
            d={`M ${x - r * 0.62} ${y} L ${x + r * 0.62} ${y}`}
            stroke={stroke}
            strokeWidth={1.1}
            vectorEffect="non-scaling-stroke"
          />
        </g>
      );
    case "outcome":
      // Concentric: a terminal state that others resolve into.
      return (
        <g>
          <circle cx={x} cy={y} r={r} {...common} />
          <circle cx={x} cy={y} r={r * 0.42} fill={stroke} stroke="none" />
        </g>
      );
    case "infrastructure":
      // Braced rectangle: something physical that can fail.
      return (
        <g>
          <rect
            x={x - r * 1.25}
            y={y - r * 0.78}
            width={r * 2.5}
            height={r * 1.56}
            {...common}
          />
          <path
            d={`M ${x} ${y - r * 0.78} L ${x} ${y + r * 0.78}`}
            stroke={stroke}
            strokeWidth={1}
            opacity={0.7}
            vectorEffect="non-scaling-stroke"
          />
        </g>
      );
    case "geography":
      // Circle with a horizon chord: a place.
      return (
        <g>
          <circle cx={x} cy={y} r={r} {...common} />
          <path
            d={`M ${x - r * 0.92} ${y + r * 0.3} L ${x + r * 0.92} ${y + r * 0.3}`}
            stroke={stroke}
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
          />
        </g>
      );
    case "market":
      // Wide ellipse: a clearing surface.
      return <ellipse cx={x} cy={y} rx={r * 1.35} ry={r * 0.8} {...common} />;
    case "evidence":
      // Small square with a mark: a record.
      return (
        <g>
          <rect
            x={x - r * 0.85}
            y={y - r * 0.85}
            width={r * 1.7}
            height={r * 1.7}
            {...common}
          />
          <circle cx={x} cy={y} r={r * 0.26} fill={stroke} stroke="none" />
        </g>
      );
    case "asset":
      // Hexagon: a produced thing.
      return <path d={hexagon(x, y, r * 1.12)} {...common} />;
    case "actor":
      // Open circle: something with agency.
      return <circle cx={x} cy={y} r={r} {...common} />;
    case "state":
    default:
      // Filled-centre circle: an observed condition.
      return (
        <g>
          <circle cx={x} cy={y} r={r} {...common} opacity={0.9} />
          <circle cx={x} cy={y} r={r * 0.3} fill={stroke} stroke="none" opacity={0.6} />
        </g>
      );
  }
}

function hexagon(cx: number, cy: number, r: number): string {
  const points = Array.from({ length: 6 }, (_, index) => {
    const angle = (Math.PI / 3) * index - Math.PI / 2;
    return `${(cx + r * Math.cos(angle)).toFixed(2)} ${(cy + r * Math.sin(angle)).toFixed(2)}`;
  });
  return `M ${points.join(" L ")} Z`;
}
