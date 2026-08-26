import { graticuleSegments, orthographic, type Vec3 } from "@/lib/world/geo";
import {
  GLOBE_RADIUS,
  arcPolylines,
  buildLandPoints,
  layoutNodes,
  labelNodesForScene,
} from "@/lib/world/layout";
import { AFTER_COLOR, CARRIES_COLOR, NODE_COLOR, WORLD_PALETTE } from "@/lib/world/palette";
import { WORLD_SCENES, focusRotation } from "@/lib/world/state";
import { worldHyperedges } from "@/data/world-model";

/* ============================================================================
   THE WORLD WITHOUT WEBGL
   ----------------------------------------------------------------------------
   Same coordinates, same routes, same structure — drawn as SVG.

   This is not a placeholder. It renders on the server, so it is in the HTML
   before any script runs; it is what a reader sees with JavaScript disabled, on a
   device without WebGL, on a low-powered device, and while the 3D chunk is still
   arriving. The scene it draws is the scene the reader is in.

   It is static by construction. Nothing here animates, which is also what makes
   it the right rendering under `prefers-reduced-motion`.
   ========================================================================== */

const VIEW = 2.2;

function path(points: { x: number; y: number; visible: boolean }[]): string {
  let result = "";
  let pen = false;
  for (const point of points) {
    if (!point.visible) {
      pen = false;
      continue;
    }
    result += `${pen ? "L" : "M"}${point.x.toFixed(3)} ${point.y.toFixed(3)}`;
    pen = true;
  }
  return result;
}

export function WorldFallback({ index = 0 }: { index?: number }) {
  const scene = WORLD_SCENES[Math.min(WORLD_SCENES.length - 1, Math.max(0, index))]!;
  const rotation = focusRotation(scene);
  const project = (point: Vec3) => orthographic(point, rotation.x, rotation.y);

  // Past the morph the model is no longer geographic, and neither is this drawing.
  const structural = index >= 9;
  const changed = index >= 2;

  const graticule: string[] = [];
  if (!structural) {
    const values = graticuleSegments({
      meridians: 12,
      parallels: 7,
      radius: GLOBE_RADIUS,
      resolution: 48,
    });
    for (let vertex = 0; vertex < values.length; vertex += 6) {
      const a = project([values[vertex]!, values[vertex + 1]!, values[vertex + 2]!]);
      const b = project([values[vertex + 3]!, values[vertex + 4]!, values[vertex + 5]!]);
      if (!a.visible || !b.visible) continue;
      graticule.push(
        `M${a.x.toFixed(3)} ${a.y.toFixed(3)}L${b.x.toFixed(3)} ${b.y.toFixed(3)}`,
      );
    }
  }

  const land: string[] = [];
  if (!structural) {
    const points = buildLandPoints(5.2);
    for (let offset = 0; offset < points.length; offset += 3) {
      const projected = project([points[offset]!, points[offset + 1]!, points[offset + 2]!]);
      if (!projected.visible) continue;
      land.push(`M${projected.x.toFixed(3)} ${projected.y.toFixed(3)}h0.011`);
    }
  }

  const routes = structural
    ? []
    : arcPolylines(changed ? "changed" : "stable", 30).map(({ arc, points }) => ({
        arc,
        d: path(points.map(project)),
      }));

  const nodePoint = (id: string) => {
    const node = layoutNodes.find((candidate) => candidate.id === id);
    if (!node) return null;
    if (structural) {
      const projected = orthographic(node.causal, 0.06, 0);
      return { node, ...projected, visible: true };
    }
    if (node.causalOnly) return null;
    return { node, ...project(node.geo) };
  };

  const labels = labelNodesForScene(scene.id, scene.focus, 3)
    .map((node) => nodePoint(node.id))
    .filter((point): point is NonNullable<typeof point> => Boolean(point?.visible));

  return (
    <svg
      viewBox={`${-VIEW / 2} ${-VIEW / 2} ${VIEW} ${VIEW}`}
      className="h-full w-full"
      role="presentation"
      focusable="false"
    >
      {!structural ? (
        <>
          <circle
            cx="0"
            cy="0"
            r={GLOBE_RADIUS}
            fill={WORLD_PALETTE.deepField}
            fillOpacity="0.85"
          />
          <circle
            cx="0"
            cy="0"
            r={GLOBE_RADIUS}
            fill="none"
            stroke={WORLD_PALETTE.steelDim}
            strokeWidth="0.004"
            strokeOpacity="0.5"
          />
          <path
            d={graticule.join("")}
            fill="none"
            stroke={WORLD_PALETTE.steelDim}
            strokeWidth="0.0025"
            strokeOpacity="0.4"
          />
          <path
            d={land.join("")}
            fill="none"
            stroke={WORLD_PALETTE.mutedBone}
            strokeWidth="0.011"
            strokeLinecap="round"
            strokeOpacity="0.35"
          />
        </>
      ) : null}

      {routes.map(({ arc, d }) => (
        <path
          key={arc.id}
          d={d}
          fill="none"
          stroke={changed ? AFTER_COLOR[arc.after] : CARRIES_COLOR[arc.carries]}
          strokeWidth="0.005"
          strokeOpacity={arc.after === "broken" && changed ? 0.75 : 0.55}
          strokeDasharray={
            changed && (arc.after === "broken" || arc.after === "conditional")
              ? "0.02 0.022"
              : undefined
          }
        />
      ))}

      {structural
        ? worldHyperedges.map((edge) => {
            const sources = edge.sourceIds
              .map(nodePoint)
              .filter((point): point is NonNullable<typeof point> => Boolean(point));
            const targets = edge.targetIds
              .map(nodePoint)
              .filter((point): point is NonNullable<typeof point> => Boolean(point));
            if (sources.length === 0 || targets.length === 0) return null;

            const jx =
              (sources.reduce((sum, point) => sum + point.x, 0) / sources.length +
                targets.reduce((sum, point) => sum + point.x, 0) / targets.length) /
              2;
            const jy =
              (sources.reduce((sum, point) => sum + point.y, 0) / sources.length +
                targets.reduce((sum, point) => sum + point.y, 0) / targets.length) /
              2;

            const tone = edge.order === 1 ? WORLD_PALETTE.gold : WORLD_PALETTE.steel;
            const opacity = edge.order === 1 ? 0.6 : edge.order === 2 ? 0.42 : 0.28;

            return (
              <g key={edge.id}>
                {[...sources, ...targets].map((point, slot) => (
                  <path
                    key={`${edge.id}-${slot}`}
                    d={`M${point.x.toFixed(3)} ${point.y.toFixed(3)}L${jx.toFixed(3)} ${jy.toFixed(3)}`}
                    stroke={tone}
                    strokeWidth="0.004"
                    strokeOpacity={opacity}
                    fill="none"
                  />
                ))}
                <circle
                  cx={jx}
                  cy={jy}
                  r="0.016"
                  fill="none"
                  stroke={WORLD_PALETTE.gold}
                  strokeWidth="0.004"
                  strokeOpacity={opacity}
                />
              </g>
            );
          })
        : null}

      {layoutNodes.map((node) => {
        const point = nodePoint(node.id);
        if (!point?.visible) return null;
        const lit = node.scenes.includes(scene.id) || structural;
        return (
          <circle
            key={node.id}
            cx={point.x}
            cy={point.y}
            r={node.waypoint ? 0.009 : 0.013}
            fill={NODE_COLOR[node.kind]}
            fillOpacity={lit ? 0.9 : 0.4}
          />
        );
      })}

      {labels.map((point) => (
        <text
          key={point.node.id}
          x={point.x + 0.03}
          y={point.y - 0.022}
          fill={WORLD_PALETTE.mutedBone}
          fillOpacity="0.75"
          fontSize="0.042"
          letterSpacing="0.004"
        >
          {point.node.label}
        </text>
      ))}
    </svg>
  );
}
