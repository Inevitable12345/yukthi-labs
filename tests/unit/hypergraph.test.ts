import { describe, expect, it } from "vitest";
import { CHOKEPOINT_GRAPH, CONVERGENCE_GRAPH, FEEDBACK_GRAPH, GRAPHS } from "@/content/scenarios";
import { downstream, propagate, validateGraph } from "@/lib/graph/hypergraph";
import { computeDepths, layoutGraph } from "@/lib/graph/layout";
import type { CausalGraph } from "@/lib/graph/types";

describe("graph integrity", () => {
  it.each(Object.entries(GRAPHS))("%s references only nodes it declares", (_id, graph) => {
    expect(validateGraph(graph)).toEqual([]);
  });

  it.each(Object.entries(GRAPHS))("%s states a mechanism on every relation", (_id, graph) => {
    for (const relation of graph.relations) {
      expect(relation.mechanism.length, relation.id).toBeGreaterThan(20);
    }
  });

  it("declares hyperedges, not just pairwise edges", () => {
    const conjunctions = CHOKEPOINT_GRAPH.relations.filter(
      (relation) => relation.sourceIds.length > 1,
    );
    expect(conjunctions.length).toBeGreaterThan(0);
  });
});

describe("propagation", () => {
  it("does not fire a hyperedge until every source is reached", () => {
    // `r-oxide-magnet` requires both the oxide supply and the inventory node.
    // Starting from the policy alone, oxide is reached but inventory is not.
    const waves = propagate(CHOKEPOINT_GRAPH, ["policy"]);
    const fired = waves.flatMap((wave) => wave.relationIds);
    expect(fired).toContain("r-policy-processing");
    expect(fired).toContain("r-processing-oxide");
    expect(fired).not.toContain("r-oxide-magnet");
  });

  it("fires the conjunction once both sources are present", () => {
    const waves = propagate(CHOKEPOINT_GRAPH, ["policy", "inventory"]);
    const fired = waves.flatMap((wave) => wave.relationIds);
    expect(fired).toContain("r-oxide-magnet");
  });

  it("orders waves by causal distance", () => {
    const waves = propagate(CHOKEPOINT_GRAPH, ["policy", "inventory", "qualification"]);
    const orderOf = (relationId: string) =>
      waves.find((wave) => wave.relationIds.includes(relationId))?.order ?? Infinity;
    expect(orderOf("r-policy-processing")).toBeLessThan(orderOf("r-processing-oxide"));
    expect(orderOf("r-processing-oxide")).toBeLessThan(orderOf("r-oxide-magnet"));
    expect(orderOf("r-oxide-magnet")).toBeLessThan(orderOf("r-magnet-motor"));
  });

  it("settles on a cycle instead of looping forever", () => {
    // The February 2021 graph closes: gas infrastructure feeds back into the
    // fuel available to generators.
    const waves = propagate(FEEDBACK_GRAPH, ["cold"]);
    expect(waves.length).toBeGreaterThan(0);
    expect(waves.length).toBeLessThanOrEqual(12);
    expect(downstream(FEEDBACK_GRAPH, ["cold"]).has("gas-to-generators")).toBe(true);
  });

  it("reaches nothing from an unknown origin", () => {
    expect(propagate(CHOKEPOINT_GRAPH, ["not-a-node"])).toEqual([]);
  });
});

describe("layout", () => {
  it("places every effect below all of its causes", () => {
    const depths = computeDepths(CHOKEPOINT_GRAPH);
    for (const relation of CHOKEPOINT_GRAPH.relations) {
      const deepestSource = Math.max(...relation.sourceIds.map((id) => depths.get(id) ?? 0));
      for (const target of relation.targetIds) {
        expect(depths.get(target)!, `${relation.id} → ${target}`).toBeGreaterThan(deepestSource);
      }
    }
  });

  it("is deterministic", () => {
    const first = layoutGraph(CONVERGENCE_GRAPH);
    const second = layoutGraph(CONVERGENCE_GRAPH);
    for (const [id, node] of first.nodes) {
      expect(second.nodes.get(id)).toEqual(node);
    }
  });

  it("survives a graph with no relations", () => {
    const empty: CausalGraph = {
      id: "empty",
      title: "Empty",
      scopedTo: "Nothing",
      nodes: [{ id: "a", label: "A", category: "event" }],
      relations: [],
    };
    const layout = layoutGraph(empty);
    expect(layout.nodes.get("a")).toBeDefined();
    expect(layout.depthCount).toBe(1);
  });
});
