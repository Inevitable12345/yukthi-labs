import {
  causalOnlyNodes,
  chokepointWave,
  landOutlines,
  scopeMembership,
  worldArcs,
  worldNodeById,
  worldNodes,
  type WorldArc,
} from "@/data/world-model";
import type { NodeKind } from "@/data/schema";

import { arcPoints, latLonToVec3, pointInPolygon, toLineSegments, type Vec3 } from "./geo";
import type { WorldScene, WorldState } from "./state";

/* ============================================================================
   LAYOUT
   ----------------------------------------------------------------------------
   One node list, two positions each: where the thing is, and where it belongs in
   the causal structure. The transformation between them is the site's signature
   move — the moment the model stops being a map.

   Everything here is computed once, deterministically, and reused by every layer
   in the scene. Nothing in this file allocates per frame.
   ========================================================================== */

export const GLOBE_RADIUS = 1;
/** Nodes sit fractionally above the surface so they are never z-fought by it. */
export const NODE_LIFT = 1.02;
/** Causal space is authored at ±1.75; this brings it into frame beside the globe. */
export const CAUSAL_SCALE = 0.78;

export type LayoutNode = {
  id: string;
  label: string;
  kind: NodeKind;
  role: string;
  /** Position on the globe. Causal-only nodes have none, and start at the centre. */
  geo: Vec3;
  causal: Vec3;
  causalOnly: boolean;
  waypoint: boolean;
  evidenceIds: string[];
  scenes: string[];
  illustrative: boolean;
};

export const layoutNodes: LayoutNode[] = [
  ...worldNodes.map((node) => ({
    id: node.id,
    label: node.label,
    kind: node.kind,
    role: node.role,
    geo: latLonToVec3(node.lat, node.lon, NODE_LIFT),
    causal: [
      node.causal[0] * CAUSAL_SCALE,
      node.causal[1] * CAUSAL_SCALE,
      node.causal[2] * CAUSAL_SCALE,
    ] as Vec3,
    causalOnly: false,
    waypoint: node.waypoint,
    evidenceIds: node.evidenceIds,
    scenes: node.scenes,
    illustrative: node.illustrative,
  })),
  ...causalOnlyNodes.map((node) => ({
    id: node.id,
    label: node.label,
    kind: node.kind,
    role: node.role,
    // No address: it starts collapsed at the centre and is carried outward by the
    // morph, which is the visual form of the claim that it has no place on a map.
    geo: [node.causal[0] * 0.06, node.causal[1] * 0.06, node.causal[2] * 0.06] as Vec3,
    causal: [
      node.causal[0] * CAUSAL_SCALE,
      node.causal[1] * CAUSAL_SCALE,
      node.causal[2] * CAUSAL_SCALE,
    ] as Vec3,
    causalOnly: true,
    waypoint: false,
    evidenceIds: node.evidenceIds ?? [],
    scenes: [],
    illustrative: node.illustrative ?? false,
  })),
];

export const layoutIndex = new Map(layoutNodes.map((node, index) => [node.id, index]));

/**
 * Writes current node positions into `target` for a given morph value.
 *
 * Positions bow outward at the halfway point rather than interpolating straight,
 * because a straight interpolation would drag every node through the planet.
 */
export function writePositions(target: Float32Array, morph: number, remap = 0): void {
  const bow = Math.sin(Math.PI * Math.min(1, Math.max(0, morph))) * 0.22;

  for (let index = 0; index < layoutNodes.length; index += 1) {
    const node = layoutNodes[index]!;
    const offset = index * 3;
    // Re-mapping is a real displacement, not a shimmer: when the evidence says the
    // structure was drawn wrong, the nodes end up somewhere else. The offset is
    // deterministic per node, so the rearranged structure is stable and reversible.
    const shift = remap * 0.11;
    const jitterX = Math.sin(index * 12.9898) * shift;
    const jitterY = Math.sin(index * 78.233) * shift;
    const jitterZ = Math.sin(index * 37.719) * shift;

    const x = node.geo[0] + (node.causal[0] + jitterX - node.geo[0]) * morph;
    const y = node.geo[1] + (node.causal[1] + jitterY - node.geo[1]) * morph;
    const z = node.geo[2] + (node.causal[2] + jitterZ - node.geo[2]) * morph;
    const length = Math.hypot(x, y, z) || 1;
    target[offset] = x + (x / length) * bow;
    target[offset + 1] = y + (y / length) * bow;
    target[offset + 2] = z + (z / length) * bow;
  }
}

export function nodePositionAt(id: string, positions: Float32Array): Vec3 {
  const index = layoutIndex.get(id);
  if (index === undefined) return [0, 0, 0];
  const offset = index * 3;
  return [positions[offset]!, positions[offset + 1]!, positions[offset + 2]!];
}

/* --------------------------------------------------------------------------
   ROUTES
   ------------------------------------------------------------------------ */

export type ArcGeometry = {
  /** Flattened line-segment vertices. */
  positions: Float32Array;
  /** Position along the route, 0 → 1, per vertex. Drives the flow and the draw-on. */
  along: Float32Array;
  /** Route index per vertex, so each route can be revealed on its own cadence. */
  route: Float32Array;
  count: number;
};

function arcRoutePoints(arc: WorldArc, variant: "stable" | "changed", segments: number) {
  const from = worldNodeById.get(arc.from);
  const to = worldNodeById.get(arc.to);
  if (!from || !to) return null;

  const start = latLonToVec3(from.lat, from.lon, GLOBE_RADIUS);
  const end = latLonToVec3(to.lat, to.lon, GLOBE_RADIUS);

  const waypointId = variant === "stable" ? arc.via : (arc.reroute ?? arc.via);
  const waypoint = waypointId ? worldNodeById.get(waypointId) : undefined;

  if (!waypoint) return arcPoints(start, end, segments, GLOBE_RADIUS, 0.2);

  const middle = latLonToVec3(waypoint.lat, waypoint.lon, GLOBE_RADIUS);
  const half = Math.max(2, Math.round(segments / 2));
  return [
    ...arcPoints(start, middle, half, GLOBE_RADIUS, 0.14),
    ...arcPoints(middle, end, half, GLOBE_RADIUS, 0.14).slice(1),
  ];
}

/** Every route in a variant, as polylines. The shared source for WebGL and SVG. */
export function arcPolylines(
  variant: "stable" | "changed",
  segments = 48,
): { arc: WorldArc; points: Vec3[] }[] {
  const result: { arc: WorldArc; points: Vec3[] }[] = [];
  for (const arc of worldArcs) {
    const points = arcRoutePoints(arc, variant, segments);
    if (points) result.push({ arc, points });
  }
  return result;
}

/**
 * Builds one merged geometry for every route in a variant.
 *
 * `stable` is the arrangement the last era was built on. `changed` is the same
 * endpoints after the structure moves: rerouted the long way, made conditional,
 * or broken. Both are drawn from the same data, so the rupture is a difference
 * between two states of one world rather than a second picture.
 */
export function buildArcGeometry(variant: "stable" | "changed", segments = 48): ArcGeometry {
  const positions: number[] = [];
  const along: number[] = [];
  const route: number[] = [];

  arcPolylines(variant, segments).forEach(({ points }, arcIndex) => {
    const flattened = toLineSegments(points);
    positions.push(...flattened);

    const pairCount = points.length - 1;
    for (let pair = 0; pair < pairCount; pair += 1) {
      along.push(pair / pairCount, (pair + 1) / pairCount);
      route.push(arcIndex, arcIndex);
    }
  });

  return {
    positions: new Float32Array(positions),
    along: new Float32Array(along),
    route: new Float32Array(route),
    count: positions.length / 3,
  };
}

/** Per-route colour and state, in route order, for the arc shader. */
export function arcRouteAttributes() {
  return worldArcs.map((arc) => ({
    id: arc.id,
    carries: arc.carries,
    after: arc.after,
    illustrative: arc.illustrative,
  }));
}

/* --------------------------------------------------------------------------
   LANDMASS HINTS
   --------------------------------------------------------------------------
   Sampled from the coarse outlines rather than from a texture: a few thousand
   points, deterministic, and small enough that the globe has no download.
   ------------------------------------------------------------------------ */

export function buildLandPoints(step = 2): Float32Array {
  const values: number[] = [];

  for (let latitude = -58; latitude <= 78; latitude += step) {
    // Keep point density roughly even by thinning longitudes near the poles.
    const cosine = Math.max(0.15, Math.cos((latitude * Math.PI) / 180));
    const longitudeStep = step / cosine;

    for (let longitude = -180; longitude <= 180; longitude += longitudeStep) {
      let inside = false;
      for (const outline of landOutlines) {
        if (pointInPolygon(latitude, longitude, outline)) {
          inside = true;
          break;
        }
      }
      if (!inside) continue;
      const point = latLonToVec3(latitude, longitude, GLOBE_RADIUS * 1.002);
      values.push(point[0], point[1], point[2]);
    }
  }

  return new Float32Array(values);
}

/* --------------------------------------------------------------------------
   NODE INTENSITY
   --------------------------------------------------------------------------
   How brightly a node is drawn on a given frame. Pure, so the encoding can be
   reasoned about and tested rather than tuned blindly inside a render loop.
   ------------------------------------------------------------------------ */

const WAVE_INDEX = new Map<string, number>();
chokepointWave.forEach((stage, index) => {
  for (const id of stage) WAVE_INDEX.set(id, index);
});

/**
 * How strongly a node is affected by the simulated intervention.
 *
 * During the SIMULATE phase of the operating loop one policy state is changed —
 * the export-licensing node — and the change is carried outward along the stages
 * of the mechanism, in the same order the chokepoint runs. A node returns 0 until
 * the front reaches it, which is the point: an intervention has consequences in
 * sequence, not everywhere at once.
 */
export function perturbationAt(node: LayoutNode, state: WorldState): number {
  if (state.perturb <= 0) return 0;
  const stage = WAVE_INDEX.get(node.id);
  if (stage === undefined) return 0;

  const front = state.perturb * (chokepointWave.length + 1);
  return Math.min(1, Math.max(0, front - stage)) * state.perturb;
}

export function nodeIntensity(node: LayoutNode, state: WorldState, scope: string): number {
  // A node with no address does not exist until the structure does.
  if (node.causalOnly && state.morph < 0.02 && state.chokepoint < 0.02) return 0;

  let intensity = node.waypoint ? 0.22 : 0.34;

  if (node.scenes.includes(state.scene)) intensity += 0.5;

  // Chokepoint: stages light in the order the mechanism runs, never before.
  const wave = WAVE_INDEX.get(node.id);
  if (wave !== undefined && state.chokepoint > 0) {
    const front = state.chokepoint * (chokepointWave.length + 0.8);
    intensity += 0.75 * Math.min(1, Math.max(0, front - wave));
  }

  // Scoping narrows rather than adds: the unselected structure is still there,
  // and is still drawn, at the intensity of something outside the boundary.
  if (state.scope > 0) {
    const members = scopeMembership[scope];
    const inScope = members ? members.includes(node.id) : false;
    intensity *= 1 - state.scope * (inScope ? -0.55 : 0.62);
  }

  if (node.causalOnly) intensity *= Math.max(state.morph, state.chokepoint * 0.85);
  if (node.illustrative) intensity *= 0.82;

  // Simulate: the changed state and everything downstream of it brightens.
  intensity += 0.55 * perturbationAt(node, state);

  return Math.max(0, intensity * state.presence * (1 - 0.7 * state.horizon));
}

/* --------------------------------------------------------------------------
   LABELS
   --------------------------------------------------------------------------
   Which nodes get a name on screen in a given scene. Few, chosen by what the
   scene is about, and stable for the whole scene — a label that reshuffles while
   it is being read is worse than no label.
   ------------------------------------------------------------------------ */

export function labelNodesForScene(scene: WorldScene, focus?: string, max = 4): LayoutNode[] {
  const byId = (id: string) => layoutNodes.find((node) => node.id === id);

  if (scene === "chokepoint") {
    return chokepointWave
      .flat()
      .map(byId)
      .filter((node): node is LayoutNode => Boolean(node))
      .slice(0, max);
  }

  if (scene === "world-model" || scene === "ai-organization" || scene === "future-space") {
    // Past the morph the interesting nodes are the ones with no address.
    return layoutNodes.filter((node) => node.causalOnly).slice(0, max);
  }

  const scoped = layoutNodes.filter(
    (node) => !node.causalOnly && node.scenes.includes(scene) && !node.waypoint,
  );
  if (scoped.length > 0) return scoped.slice(0, max);

  const focused = focus ? byId(focus) : undefined;
  return focused ? [focused] : [];
}
