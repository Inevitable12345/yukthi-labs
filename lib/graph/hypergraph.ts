/* ============================================================================
   HYPERGRAPH TRAVERSAL
   ----------------------------------------------------------------------------
   Propagation is computed as ordered waves rather than a shortest path, because
   the interesting property of a hyperedge is that it does not fire until every
   one of its sources has been reached. That single rule is what makes the
   visual distinguishable from a decorative particle chain (§9).
   ========================================================================== */

import type { CausalGraph, CausalNode, CausalRelation } from "./types";

export function nodeIndex(graph: CausalGraph): Map<string, CausalNode> {
  return new Map(graph.nodes.map((node) => [node.id, node]));
}

/** Relations whose sources or targets include `nodeId`. */
export function incidentRelations(graph: CausalGraph, nodeId: string): CausalRelation[] {
  return graph.relations.filter(
    (relation) => relation.sourceIds.includes(nodeId) || relation.targetIds.includes(nodeId),
  );
}

export type PropagationWave = {
  /** 1-based order of arrival. Wave 0 is the set of origin nodes. */
  order: number;
  /** Relations that fire at this order. */
  relationIds: string[];
  /** Nodes first reached at this order. */
  nodeIds: string[];
};

/**
 * Walks the hypergraph from `originIds`, firing each relation only once all of
 * its sources have been reached. Terminates on the first wave that reaches
 * nothing new, so cycles (§12 — feedback is a cycle by construction) settle
 * instead of looping forever.
 */
export function propagate(
  graph: CausalGraph,
  originIds: string[],
  maxWaves = 12,
): PropagationWave[] {
  const reached = new Set(originIds.filter((id) => graph.nodes.some((node) => node.id === id)));
  const firedRelations = new Set<string>();
  const waves: PropagationWave[] = [];

  for (let order = 1; order <= maxWaves; order += 1) {
    const relationIds: string[] = [];
    const nodeIds: string[] = [];

    for (const relation of graph.relations) {
      if (firedRelations.has(relation.id)) continue;
      const ready =
        relation.sourceIds.length > 0 && relation.sourceIds.every((id) => reached.has(id));
      if (!ready) continue;
      relationIds.push(relation.id);
      for (const target of relation.targetIds) {
        if (!reached.has(target)) nodeIds.push(target);
      }
    }

    if (relationIds.length === 0) break;

    for (const id of relationIds) firedRelations.add(id);
    for (const id of nodeIds) reached.add(id);

    waves.push({ order, relationIds, nodeIds });
    if (nodeIds.length === 0) break;
  }

  return waves;
}

/** The set of nodes reachable from `originIds`, origins included. */
export function downstream(graph: CausalGraph, originIds: string[]): Set<string> {
  const reached = new Set(originIds);
  for (const wave of propagate(graph, originIds)) {
    for (const id of wave.nodeIds) reached.add(id);
  }
  return reached;
}

export type GraphProblem = { relationId: string; missingNodeId: string };

/** Referential integrity. Run in tests so a typo can never ship as a broken edge. */
export function validateGraph(graph: CausalGraph): GraphProblem[] {
  const ids = new Set(graph.nodes.map((node) => node.id));
  const problems: GraphProblem[] = [];
  for (const relation of graph.relations) {
    for (const id of [...relation.sourceIds, ...relation.targetIds]) {
      if (!ids.has(id)) problems.push({ relationId: relation.id, missingNodeId: id });
    }
  }
  return problems;
}
