import type { CausalGraph, CausalRelation, PositionedNode } from "@/data/schema";

export type Point = { x: number; y: number };

export type Viewport = {
  width: number;
  height: number;
  padding: { top: number; right: number; bottom: number; left: number };
};

/** Maps a node's normalised 0–1 position onto the diagram's viewBox. */
export function project(node: PositionedNode, viewport: Viewport): Point {
  const { width, height, padding } = viewport;
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;
  return {
    x: padding.left + node.position.x * innerWidth,
    y: padding.top + node.position.y * innerHeight,
  };
}

export function centroid(points: Point[]): Point {
  if (points.length === 0) return { x: 0, y: 0 };
  const sum = points.reduce(
    (accumulator, point) => ({ x: accumulator.x + point.x, y: accumulator.y + point.y }),
    { x: 0, y: 0 },
  );
  return { x: sum.x / points.length, y: sum.y / points.length };
}

/**
 * A hyperedge is drawn as sources → junction → targets.
 *
 * The junction is the visual claim: these sources act *jointly*. Drawing one line
 * per source-target pair would say something different and weaker — that each
 * source independently produces each target.
 */
export function hyperedgeJunction(sources: Point[], targets: Point[]): Point {
  const from = centroid(sources);
  const to = centroid(targets);
  return { x: from.x + (to.x - from.x) * 0.5, y: from.y + (to.y - from.y) * 0.5 };
}

/**
 * Quadratic curve from `a` to `b`, bowed perpendicular to the run.
 * `bow` of 0 gives a straight line.
 */
export function curve(a: Point, b: Point, bow = 0.14): string {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const midX = a.x + dx / 2;
  const midY = a.y + dy / 2;
  const controlX = midX - dy * bow;
  const controlY = midY + dx * bow;
  return `M ${round(a.x)} ${round(a.y)} Q ${round(controlX)} ${round(controlY)} ${round(b.x)} ${round(b.y)}`;
}

export function line(a: Point, b: Point): string {
  return `M ${round(a.x)} ${round(a.y)} L ${round(b.x)} ${round(b.y)}`;
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

/** Pulls a point toward another by `distance`, so edges stop short of node glyphs. */
export function shorten(from: Point, toward: Point, distance: number): Point {
  const dx = toward.x - from.x;
  const dy = toward.y - from.y;
  const length = Math.hypot(dx, dy) || 1;
  const ratio = Math.min(distance / length, 0.45);
  return { x: from.x + dx * ratio, y: from.y + dy * ratio };
}

export type GraphIndex = {
  nodeById: Map<string, PositionedNode>;
  /** Relations touching a given node, in either direction. */
  relationsByNode: Map<string, CausalRelation[]>;
  /** Node IDs one relation away, in either direction. */
  neighboursByNode: Map<string, Set<string>>;
  upstreamByNode: Map<string, Set<string>>;
  downstreamByNode: Map<string, Set<string>>;
};

export function indexGraph(graph: CausalGraph): GraphIndex {
  const nodeById = new Map(graph.nodes.map((node) => [node.id, node]));
  const relationsByNode = new Map<string, CausalRelation[]>();
  const neighboursByNode = new Map<string, Set<string>>();
  const upstreamByNode = new Map<string, Set<string>>();
  const downstreamByNode = new Map<string, Set<string>>();

  const push = <T>(map: Map<string, T[]>, key: string, value: T) => {
    const existing = map.get(key);
    if (existing) existing.push(value);
    else map.set(key, [value]);
  };

  const add = (map: Map<string, Set<string>>, key: string, value: string) => {
    const existing = map.get(key);
    if (existing) existing.add(value);
    else map.set(key, new Set([value]));
  };

  for (const relation of graph.relations) {
    for (const sourceId of relation.sourceIds) {
      push(relationsByNode, sourceId, relation);
      for (const targetId of relation.targetIds) {
        add(neighboursByNode, sourceId, targetId);
        add(downstreamByNode, sourceId, targetId);
      }
    }
    for (const targetId of relation.targetIds) {
      push(relationsByNode, targetId, relation);
      for (const sourceId of relation.sourceIds) {
        add(neighboursByNode, targetId, sourceId);
        add(upstreamByNode, targetId, sourceId);
      }
    }
  }

  return { nodeById, relationsByNode, neighboursByNode, upstreamByNode, downstreamByNode };
}

/** Walks downstream to a given causal distance. Used by the order-trace view. */
export function traceDownstream(
  index: GraphIndex,
  startId: string,
  maxOrder: number,
): Map<string, number> {
  const distances = new Map<string, number>([[startId, 0]]);
  let frontier = [startId];

  for (let order = 1; order <= maxOrder; order += 1) {
    const next: string[] = [];
    for (const id of frontier) {
      for (const downstreamId of index.downstreamByNode.get(id) ?? []) {
        if (!distances.has(downstreamId)) {
          distances.set(downstreamId, order);
          next.push(downstreamId);
        }
      }
    }
    frontier = next;
    if (frontier.length === 0) break;
  }

  return distances;
}
