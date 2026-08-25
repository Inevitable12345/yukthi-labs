import { describe, expect, it } from "vitest";

import { rareEarthCascade } from "@/data/rare-earth";
import {
  centroid,
  hyperedgeJunction,
  indexGraph,
  project,
  shorten,
  traceDownstream,
  type Viewport,
} from "@/lib/graph/geometry";
import { wrapLabel } from "@/lib/graph/labels";

const viewport: Viewport = {
  width: 1000,
  height: 500,
  padding: { top: 50, right: 50, bottom: 50, left: 50 },
};

describe("graph geometry", () => {
  it("projects normalised coordinates into the padded viewBox", () => {
    const node = { position: { x: 0, y: 0 } } as never;
    expect(project(node, viewport)).toEqual({ x: 50, y: 50 });

    const far = { position: { x: 1, y: 1 } } as never;
    expect(project(far, viewport)).toEqual({ x: 950, y: 450 });
  });

  it("computes a centroid, and returns the origin for an empty set", () => {
    expect(
      centroid([
        { x: 0, y: 0 },
        { x: 10, y: 20 },
      ]),
    ).toEqual({ x: 5, y: 10 });
    expect(centroid([])).toEqual({ x: 0, y: 0 });
  });

  it("places a hyperedge junction between the source and target centroids", () => {
    const junction = hyperedgeJunction(
      [
        { x: 0, y: 0 },
        { x: 0, y: 100 },
      ],
      [{ x: 100, y: 50 }],
    );
    expect(junction).toEqual({ x: 50, y: 50 });
  });

  it("shortens toward a point without ever overshooting it", () => {
    const shortened = shorten({ x: 0, y: 0 }, { x: 10, y: 0 }, 100);
    expect(shortened.x).toBeLessThanOrEqual(10);
    expect(shortened.x).toBeCloseTo(4.5);
  });

  it("indexes upstream and downstream relationships in both directions", () => {
    const index = indexGraph(rareEarthCascade);
    expect(index.nodeById.size).toBe(rareEarthCascade.nodes.length);
    expect(index.downstreamByNode.get("re-licence")?.has("re-magnet")).toBe(true);
    expect(index.upstreamByNode.get("re-magnet")?.has("re-licence")).toBe(true);
    expect(index.neighboursByNode.get("re-magnet")?.has("re-licence")).toBe(true);
  });

  it("traces downstream by causal distance and stops at the requested order", () => {
    const index = indexGraph(rareEarthCascade);
    const distances = traceDownstream(index, "re-control", 3);

    expect(distances.get("re-control")).toBe(0);
    expect(distances.get("re-licence")).toBe(1);
    expect(distances.get("re-magnet")).toBe(2);
    // Fourth-order nodes are excluded at maxOrder 3.
    expect(distances.get("re-exposure")).toBeUndefined();
  });
});

describe("label wrapping", () => {
  it("keeps a short label on one line", () => {
    expect(wrapLabel("Magnet supply", 22, 2)).toEqual(["Magnet supply"]);
  });

  it("wraps a long label at a word boundary", () => {
    const lines = wrapLabel("Tier-2 / Tier-3 suppliers", 14, 2);
    expect(lines.length).toBe(2);
    expect(lines.join(" ")).toBe("Tier-2 / Tier-3 suppliers");
  });

  it("never drops words, even past the line budget", () => {
    const label = "Motors and sensors and actuators and controllers";
    expect(wrapLabel(label, 12, 2).join(" ")).toBe(label);
  });

  it("does not break a single long word", () => {
    expect(wrapLabel("Interdependencies", 6, 2)).toEqual(["Interdependencies"]);
  });
});
