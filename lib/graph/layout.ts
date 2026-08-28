/* ============================================================================
   DETERMINISTIC LAYERED LAYOUT
   ----------------------------------------------------------------------------
   Force simulations are pretty and unrepeatable. A causal diagram that moves
   when you reload it is a diagram nobody trusts, so layout here is a pure
   function of graph structure: depth from the sources, then a stable ordering
   within each depth.
   ========================================================================== */

import type { CausalGraph } from "./types";

export type LaidOutNode = { id: string; x: number; y: number; depth: number; row: number };

export type GraphLayout = {
  nodes: Map<string, LaidOutNode>;
  width: number;
  height: number;
  depthCount: number;
};

export type LayoutOptions = {
  /** Distance between causal depths, in view units. */
  depthGap?: number;
  /** Distance between siblings at the same depth. */
  rowGap?: number;
  orientation?: "vertical" | "horizontal";
};

/** Longest-path depth: a node sits below every one of its causes. */
export function computeDepths(graph: CausalGraph): Map<string, number> {
  const depth = new Map<string, number>(graph.nodes.map((node) => [node.id, 0]));

  // Relations are re-scanned until depths settle. Graphs here are small
  // (tens of nodes) and cycles are bounded by the node count.
  for (let pass = 0; pass < graph.nodes.length; pass += 1) {
    let changed = false;
    for (const relation of graph.relations) {
      const sourceDepth = Math.max(...relation.sourceIds.map((id) => depth.get(id) ?? 0));
      for (const target of relation.targetIds) {
        const current = depth.get(target) ?? 0;
        if (current < sourceDepth + 1) {
          depth.set(target, sourceDepth + 1);
          changed = true;
        }
      }
    }
    if (!changed) break;
  }

  return depth;
}

export function layoutGraph(graph: CausalGraph, options: LayoutOptions = {}): GraphLayout {
  const { depthGap = 132, rowGap = 96, orientation = "vertical" } = options;
  const depths = computeDepths(graph);

  const byDepth = new Map<number, string[]>();
  for (const node of graph.nodes) {
    const depth = depths.get(node.id) ?? 0;
    const bucket = byDepth.get(depth);
    if (bucket) bucket.push(node.id);
    else byDepth.set(depth, [node.id]);
  }

  const depthCount = byDepth.size;
  const widest = Math.max(1, ...[...byDepth.values()].map((bucket) => bucket.length));

  const nodes = new Map<string, LaidOutNode>();
  for (const [depth, bucket] of byDepth) {
    bucket.forEach((id, row) => {
      const offset = (row - (bucket.length - 1) / 2) * rowGap;
      const along = depth * depthGap;
      nodes.set(id, {
        id,
        depth,
        row,
        x: orientation === "vertical" ? offset : along,
        y: orientation === "vertical" ? along : offset,
      });
    });
  }

  const spread = widest * rowGap;
  const run = Math.max(1, depthCount - 1) * depthGap;

  return {
    nodes,
    width: orientation === "vertical" ? spread : run,
    height: orientation === "vertical" ? run : spread,
    depthCount,
  };
}

/** Centroid of a hyperedge's endpoints — where its mechanism label is anchored. */
export function relationCentroid(
  layout: GraphLayout,
  ids: string[],
): { x: number; y: number } | null {
  const points = ids.map((id) => layout.nodes.get(id)).filter((node) => node !== undefined);
  if (points.length === 0) return null;
  const sum = points.reduce((total, node) => ({ x: total.x + node.x, y: total.y + node.y }), {
    x: 0,
    y: 0,
  });
  return { x: sum.x / points.length, y: sum.y / points.length };
}
