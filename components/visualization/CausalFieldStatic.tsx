import { buildField } from "@/lib/graph/field";
import { cn } from "@/lib/utils/cn";

/**
 * The causal field as static SVG.
 *
 * This is not a degraded placeholder — it is the field, rendered without WebGL.
 * It is what a reader sees with no GPU, with reduced motion, on a low-powered
 * device, or before the 3D chunk has loaded. It is server-rendered, so the page
 * is never empty while something downloads.
 */
export function CausalFieldStatic({
  count = 90,
  intensity = 0.5,
  className,
}: {
  count?: number;
  intensity?: number;
  className?: string;
}) {
  const field = buildField(count);
  const project = (node: { x: number; y: number; z: number }) => ({
    // Weak perspective: nearer points sit slightly further from centre.
    x: 600 + node.x * 330 * (1 + node.z * 0.12),
    y: 300 + node.y * 330 * (1 + node.z * 0.12),
    depth: (node.z + 0.62) / 1.24,
  });

  return (
    <svg
      viewBox="0 0 1200 600"
      aria-hidden="true"
      className={cn("block h-full w-full", className)}
      preserveAspectRatio="xMidYMid slice"
    >
      <g>
        {field.edges.map((edge, index) => {
          const a = project(field.nodes[edge.a]!);
          const b = project(field.nodes[edge.b]!);
          return (
            <path
              key={`e-${index}`}
              d={`M ${a.x.toFixed(1)} ${a.y.toFixed(1)} L ${b.x.toFixed(1)} ${b.y.toFixed(1)}`}
              stroke="var(--color-steel)"
              strokeWidth={0.6}
              opacity={0.04 + edge.strength * 0.14 * intensity}
            />
          );
        })}
      </g>
      <g>
        {field.nodes.map((node, index) => {
          const point = project(node);
          const isKey = node.weight > 0.72;
          return (
            <circle
              key={`n-${index}`}
              cx={point.x.toFixed(1)}
              cy={point.y.toFixed(1)}
              r={(0.8 + node.weight * 2.4).toFixed(2)}
              fill={isKey ? "var(--color-gold)" : "var(--color-bone)"}
              opacity={
                (0.1 + point.depth * 0.32 + node.weight * 0.4) * (0.55 + intensity * 0.45)
              }
            />
          );
        })}
      </g>
    </svg>
  );
}
