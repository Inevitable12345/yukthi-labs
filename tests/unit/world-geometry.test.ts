import { describe, expect, it } from "vitest";

import {
  buildWorld,
  formAt,
  precomputeLayouts,
  positionFor,
  FORM_SEQUENCE,
} from "@/lib/world/geometry";
import type { WorldForm } from "@/lib/story/chapters";

const ALL_FORMS: WorldForm[] = [
  "earth",
  "global-network",
  "fragmented-network",
  "chokepoint",
  "causal-graph",
  "hypergraph",
  "world-model",
  "futures",
];

describe("world construction", () => {
  it("is deterministic for a given seed", () => {
    const a = buildWorld(120);
    const b = buildWorld(120);

    expect(a.nodes.length).toBe(b.nodes.length);
    expect(a.nodes.map((node) => node.kind)).toEqual(b.nodes.map((node) => node.kind));
    expect(a.edges).toEqual(b.edges);
    expect(a.hyperedges).toEqual(b.hyperedges);
  });

  it("keeps node identity across every form", () => {
    // The whole premise of the instrument: the same nodes are reorganised, never
    // replaced. Every layout must therefore describe exactly the same set.
    const graph = buildWorld(120);
    const layouts = precomputeLayouts(graph);

    for (const form of ALL_FORMS) {
      expect(layouts[form].length).toBe(graph.nodes.length * 3);
    }
  });

  it("produces finite coordinates in every form", () => {
    const graph = buildWorld(160);
    const layouts = precomputeLayouts(graph);

    for (const form of ALL_FORMS) {
      for (const value of layouts[form]) {
        expect(Number.isFinite(value)).toBe(true);
      }
    }
  });

  it("orients causal edges downstream only", () => {
    // An edge pointing back upstream would make the diagram a network rather
    // than a causal structure.
    const graph = buildWorld(200);
    for (const edge of graph.edges) {
      const from = graph.nodes[edge.a]!;
      const to = graph.nodes[edge.b]!;
      expect(to.layer).toBeGreaterThan(from.layer);
    }
  });

  it("gives hyperedges more than one participant on at least one side", () => {
    const graph = buildWorld(200);
    expect(graph.hyperedges.length).toBeGreaterThan(0);

    for (const hyperedge of graph.hyperedges) {
      expect(hyperedge.sources.length + hyperedge.targets.length).toBeGreaterThan(2);
      // No node may be both cause and effect of the same relation.
      const overlap = hyperedge.sources.filter((id) => hyperedge.targets.includes(id));
      expect(overlap).toEqual([]);
    }
  });

  it("widens downstream: later layers hold more nodes than the first", () => {
    const graph = buildWorld(240);
    const countAt = (layer: number) =>
      graph.nodes.filter((node) => node.layer === layer).length;

    expect(countAt(0)).toBeLessThan(countAt(5));
  });

  it("scales from a phone budget to a desktop budget", () => {
    const small = buildWorld(90);
    const large = buildWorld(320);

    expect(small.nodes.length).toBeGreaterThan(0);
    expect(large.nodes.length).toBeGreaterThan(small.nodes.length);
    // Both must still be well-formed worlds.
    expect(small.hyperedges.length).toBeGreaterThan(0);
    expect(large.hyperedges.length).toBeGreaterThan(0);
  });
});

describe("the chokepoint form", () => {
  it("places the chokepoint node alone above everything else", () => {
    const graph = buildWorld(180);
    const chokepoint = graph.nodes[graph.chokepointIndex]!;
    expect(chokepoint.kind).toBe("chokepoint");

    const apex = positionFor("chokepoint", chokepoint, graph);

    for (const node of graph.nodes) {
      if (node.index === chokepoint.index) continue;
      const position = positionFor("chokepoint", node, graph);
      expect(position.y).toBeLessThan(apex.y);
    }
  });

  it("fans downstream nodes wider than upstream ones", () => {
    // The hourglass: the geometry has to state the asymmetry before any label
    // does, or the act does not work.
    const graph = buildWorld(240);

    const radiusAt = (layer: number) => {
      const nodes = graph.nodes.filter(
        (node) => node.layer === layer && node.kind !== "chokepoint",
      );
      const radii = nodes.map((node) => {
        const position = positionFor("chokepoint", node, graph);
        return Math.hypot(position.x, position.z);
      });
      return radii.reduce((sum, value) => sum + value, 0) / Math.max(1, radii.length);
    };

    expect(radiusAt(5)).toBeGreaterThan(radiusAt(1));
  });
});

describe("form sequencing", () => {
  it("holds the first form before the story starts", () => {
    expect(formAt(-4)).toMatchObject({ from: "earth", to: "earth" });
    expect(formAt(0).from).toBe("earth");
  });

  it("holds the last form past the end", () => {
    const result = formAt(999);
    expect(result.from).toBe("futures");
    expect(result.to).toBe("futures");
    expect(result.mix).toBe(1);
  });

  it("always returns a mix within 0..1", () => {
    for (let t = -2; t < 16; t += 0.13) {
      const { mix } = formAt(t);
      expect(mix).toBeGreaterThanOrEqual(0);
      expect(mix).toBeLessThanOrEqual(1);
    }
  });

  it("moves through every form in order as the timeline advances", () => {
    const seen: WorldForm[] = [];
    // The timeline runs to 13: thirteen chapters, the last of which spans
    // t=12..13 while the world holds its final form.
    for (let t = 0; t <= 13; t += 0.05) {
      const { from } = formAt(t);
      if (seen[seen.length - 1] !== from) seen.push(from);
    }

    expect(seen).toEqual(FORM_SEQUENCE.map((entry) => entry.form));
  });

  it("keeps the sequence's own checkpoints monotonic", () => {
    const positions = FORM_SEQUENCE.map((entry) => entry.at);
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
  });
});
