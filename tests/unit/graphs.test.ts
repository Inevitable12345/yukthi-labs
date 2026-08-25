import { describe, expect, it } from "vitest";

import { convergenceChain } from "@/data/convergence";
import { evidenceById } from "@/data/evidence";
import { insuranceAccumulation } from "@/data/insurance";
import { rareEarthCascade } from "@/data/rare-earth";
import { rupturedTopology, stableLattice } from "@/data/demo-hypergraph";
import { semiconductorChain, semiconductorHypergraph } from "@/data/semiconductor";
import { uriLoop } from "@/data/uri";
import { causalGraphSchema, type CausalGraph } from "@/data/schema";

const GRAPHS: CausalGraph[] = [
  rareEarthCascade,
  semiconductorChain,
  semiconductorHypergraph,
  uriLoop,
  insuranceAccumulation,
  convergenceChain,
  stableLattice,
  rupturedTopology,
];

describe("causal graphs", () => {
  it.each(GRAPHS.map((graph) => [graph.id, graph] as const))(
    "%s satisfies the schema",
    (_id, graph) => {
      expect(() => causalGraphSchema.parse(graph)).not.toThrow();
    },
  );

  it.each(GRAPHS.map((graph) => [graph.id, graph] as const))(
    "%s has relations that only reference nodes it contains",
    (_id, graph) => {
      const ids = new Set(graph.nodes.map((node) => node.id));
      for (const relation of graph.relations) {
        for (const nodeId of [...relation.sourceIds, ...relation.targetIds]) {
          expect(ids.has(nodeId), `${relation.id} → ${nodeId}`).toBe(true);
        }
      }
    },
  );

  it.each(GRAPHS.map((graph) => [graph.id, graph] as const))(
    "%s references only evidence records that exist",
    (_id, graph) => {
      const referenced = [
        ...(graph.evidenceIds ?? []),
        ...graph.nodes.flatMap((node) => node.evidenceIds ?? []),
        ...graph.relations.flatMap((relation) => relation.evidenceIds ?? []),
      ];
      for (const evidenceId of referenced) {
        expect(evidenceById.has(evidenceId), evidenceId).toBe(true);
      }
    },
  );

  it.each(GRAPHS.map((graph) => [graph.id, graph] as const))(
    "%s carries a text alternative long enough to replace the diagram",
    (_id, graph) => {
      expect(graph.textAlternative.length).toBeGreaterThan(200);
    },
  );

  it.each(GRAPHS.map((graph) => [graph.id, graph] as const))(
    "%s keeps every node inside the normalised coordinate space",
    (_id, graph) => {
      for (const node of graph.nodes) {
        expect(node.position.x).toBeGreaterThanOrEqual(0);
        expect(node.position.x).toBeLessThanOrEqual(1);
        expect(node.position.y).toBeGreaterThanOrEqual(0);
        expect(node.position.y).toBeLessThanOrEqual(1);
      }
    },
  );

  it("marks every node of an illustrative graph as illustrative or evidenced", () => {
    for (const graph of GRAPHS.filter((candidate) => candidate.illustrative)) {
      for (const node of graph.nodes) {
        const declared = node.illustrative === true;
        const evidenced = (node.evidenceIds?.length ?? 0) > 0;
        expect(declared || evidenced, `${graph.id}/${node.id}`).toBe(true);
      }
    }
  });

  it("expresses at least one genuine hyperedge — the reason for the representation", () => {
    const hyperedges = semiconductorHypergraph.relations.filter(
      (relation) => relation.sourceIds.length > 1 || relation.targetIds.length > 1,
    );
    expect(hyperedges.length).toBeGreaterThan(0);
    expect(hyperedges[0]!.sourceIds.length).toBeGreaterThan(2);
  });

  it("closes the Uri loop back onto itself", () => {
    const targets = new Set(uriLoop.relations.flatMap((relation) => relation.targetIds));
    const sources = new Set(uriLoop.relations.flatMap((relation) => relation.sourceIds));
    // A generation-failure node is both upstream and downstream: that is the loop.
    expect(targets.has("uri-generation")).toBe(true);
    expect(sources.has("uri-generation")).toBe(true);
  });
});
