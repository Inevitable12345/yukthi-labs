import { describe, expect, it } from "vitest";

import {
  angleBetween,
  arcPoints,
  graticuleSegments,
  latLonToVec3,
  orthographic,
  pointInPolygon,
  ringSegments,
  slerp,
  toLineSegments,
} from "@/lib/world/geo";
import {
  SCENE_COUNT,
  WORLD_SCENES,
  cameraAt,
  sceneCoordinate,
  smoothstep,
  worldStateAt,
  type AnchorSpan,
} from "@/lib/world/state";
import {
  GLOBE_RADIUS,
  arcPolylines,
  buildArcGeometry,
  buildLandPoints,
  labelNodesForScene,
  layoutIndex,
  layoutNodes,
  nodeIntensity,
  perturbationAt,
  writePositions,
} from "@/lib/world/layout";
import { causalOnlyNodes, worldArcs, worldHyperedges, worldNodes } from "@/data/world-model";

describe("spherical geometry", () => {
  it("places coordinates on the sphere at the requested radius", () => {
    for (const [lat, lon] of [
      [0, 0],
      [51.95, 4.14],
      [-34.35, 18.47],
      [40.66, 109.84],
    ] as const) {
      const point = latLonToVec3(lat, lon, 2);
      expect(Math.hypot(...point)).toBeCloseTo(2, 6);
    }
  });

  it("puts the north pole above the equator and the south pole below", () => {
    expect(latLonToVec3(90, 0)[1]).toBeCloseTo(1, 6);
    expect(latLonToVec3(-90, 0)[1]).toBeCloseTo(-1, 6);
  });

  it("measures antipodal points as half a turn apart", () => {
    expect(angleBetween(latLonToVec3(0, 0), latLonToVec3(0, 180))).toBeCloseTo(Math.PI, 5);
  });

  it("interpolates along the surface rather than through the body", () => {
    const middle = slerp(latLonToVec3(0, -60), latLonToVec3(0, 60), 0.5);
    expect(Math.hypot(...middle)).toBeCloseTo(1, 6);
  });

  it("bows an arc above the surface at its apex and lands it on both ends", () => {
    const from = latLonToVec3(31.23, 121.47, GLOBE_RADIUS);
    const to = latLonToVec3(51.95, 4.14, GLOBE_RADIUS);
    const points = arcPoints(from, to, 32, GLOBE_RADIUS, 0.2);

    expect(Math.hypot(...points[0]!)).toBeCloseTo(GLOBE_RADIUS, 5);
    expect(Math.hypot(...points.at(-1)!)).toBeCloseTo(GLOBE_RADIUS, 5);
    expect(Math.hypot(...points[16]!)).toBeGreaterThan(GLOBE_RADIUS);
  });

  it("builds a graticule and a measurement ring as paired line vertices", () => {
    expect(graticuleSegments({ meridians: 4, parallels: 3 }).length % 6).toBe(0);
    expect(ringSegments({ ticks: 12 }).length % 6).toBe(0);
  });

  it("emits one segment fewer than the points it is given", () => {
    expect(
      toLineSegments([
        [0, 0, 0],
        [1, 0, 0],
        [2, 0, 0],
      ]).length,
    ).toBe(12);
  });

  it("tests containment against a lat/lon polygon", () => {
    const square = [
      [-10, -10],
      [10, -10],
      [10, 10],
      [-10, 10],
    ] as const;
    expect(pointInPolygon(0, 0, square)).toBe(true);
    expect(pointInPolygon(40, 0, square)).toBe(false);
  });

  it("marks the far side of the sphere as not visible when projected", () => {
    const near = orthographic(latLonToVec3(0, -90), 0, 0);
    const far = orthographic(latLonToVec3(0, 90), 0, 0);
    expect(near.visible).toBe(true);
    expect(far.visible).toBe(false);
  });
});

describe("scene state", () => {
  it("covers thirteen scenes, each anchored to a section of the page", () => {
    expect(SCENE_COUNT).toBe(13);
    for (const scene of WORLD_SCENES) {
      expect(scene.anchors.length).toBeGreaterThan(0);
      expect(scene.textAlternative.length).toBeGreaterThan(60);
    }
  });

  it("is a pure function of scroll position — the same input gives the same frame", () => {
    for (const t of [0, 2.4, 5.5, 9.9, 12]) {
      expect(worldStateAt(t)).toEqual(worldStateAt(t));
    }
  });

  it("is reversible: coming back to a position restores its exact state", () => {
    const outbound = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map(worldStateAt);
    const inbound = [13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0].map(worldStateAt).reverse();
    expect(inbound).toEqual(outbound);
  });

  it("clamps outside the sequence instead of wrapping or overshooting", () => {
    expect(worldStateAt(-8)).toEqual(worldStateAt(0));
    expect(worldStateAt(99)).toEqual(worldStateAt(SCENE_COUNT));
  });

  it("keeps every visual quantity inside its range across the whole sequence", () => {
    for (let t = 0; t <= SCENE_COUNT; t += 0.05) {
      const state = worldStateAt(t);
      for (const [key, value] of Object.entries(state)) {
        if (typeof value !== "number") continue;
        if (key === "t" || key === "index" || key === "loopPhase") continue;
        expect(value, `${key} at t=${t.toFixed(2)}`).toBeGreaterThanOrEqual(0);
        expect(value, `${key} at t=${t.toFixed(2)}`).toBeLessThanOrEqual(1);
      }
    }
  });

  it("names the scene the coordinate falls in", () => {
    expect(worldStateAt(0).scene).toBe("invocation");
    expect(worldStateAt(2.5).scene).toBe("rupture");
    expect(worldStateAt(4.2).scene).toBe("chokepoint");
    expect(worldStateAt(10.5).scene).toBe("world-model");
    expect(worldStateAt(12).scene).toBe("horizon");
    expect(worldStateAt(13).scene).toBe("horizon");
    expect(worldStateAt(13).horizon).toBeGreaterThan(0.95);
  });

  it("runs the operating loop once across the reveal, in order", () => {
    const map = worldStateAt(10.0);
    const simulate = worldStateAt(10.55);
    const remap = worldStateAt(10.95);

    expect(map.loopPhase).toBeLessThan(simulate.loopPhase);
    expect(simulate.perturb).toBeGreaterThan(map.perturb);
    expect(remap.remap).toBeGreaterThan(simulate.remap);
  });

  it("drops the geographic shell only as the structure takes over", () => {
    expect(worldStateAt(1).morph).toBe(0);
    expect(worldStateAt(1).geoShell).toBeGreaterThan(0.5);
    expect(worldStateAt(10.4).morph).toBeGreaterThan(0.9);
    expect(worldStateAt(10.4).geoShell).toBeLessThan(0.1);
  });

  it("never lets the layer reach full strength", () => {
    for (let t = 0; t <= SCENE_COUNT; t += 0.1) {
      expect(worldStateAt(t).presence).toBeLessThanOrEqual(1);
    }
  });

  it("takes the short way round when the focus longitude jumps", () => {
    const start = cameraAt(3);
    const end = cameraAt(4);
    expect(Math.abs(end.rotationY - start.rotationY)).toBeLessThanOrEqual(Math.PI * 1.01);
  });

  it("ramps smoothly and saturates", () => {
    expect(smoothstep(0, 1, -1)).toBe(0);
    expect(smoothstep(0, 1, 0.5)).toBeCloseTo(0.5, 6);
    expect(smoothstep(0, 1, 2)).toBe(1);
  });
});

describe("scroll to scene mapping", () => {
  const spans: AnchorSpan[] = WORLD_SCENES.map((scene, index) => ({
    id: scene.id,
    start: index * 1000,
    end: index * 1000 + 800,
  }));

  it("holds at the first scene above the first section", () => {
    expect(sceneCoordinate(spans, -500)).toBe(0);
  });

  it("advances monotonically down the page", () => {
    let previous = -1;
    for (let scroll = 0; scroll < 13000; scroll += 137) {
      const value = sceneCoordinate(spans, scroll);
      expect(value).toBeGreaterThanOrEqual(previous);
      previous = value;
    }
  });

  it("returns the same coordinate for the same scroll position in either direction", () => {
    const down = [0, 2500, 6400, 9100, 12400].map((scroll) => sceneCoordinate(spans, scroll));
    const up = [12400, 9100, 6400, 2500, 0]
      .map((scroll) => sceneCoordinate(spans, scroll))
      .reverse();
    expect(up).toEqual(down);
  });

  it("treats the gap between two sections as the handover between their scenes", () => {
    const inGap = sceneCoordinate(spans, 900);
    expect(inGap).toBeGreaterThan(0.9);
    expect(inGap).toBeLessThan(1.0001);
  });
});

describe("world data", () => {
  it("gives every node a real coordinate and a stated role", () => {
    for (const node of worldNodes) {
      expect(Math.abs(node.lat)).toBeLessThanOrEqual(90);
      expect(Math.abs(node.lon)).toBeLessThanOrEqual(180);
      expect(node.role.length).toBeGreaterThan(10);
    }
  });

  it("resolves every route endpoint and every re-route waypoint to a node", () => {
    const ids = new Set(worldNodes.map((node) => node.id));
    for (const arc of worldArcs) {
      expect(ids.has(arc.from), arc.id).toBe(true);
      expect(ids.has(arc.to), arc.id).toBe(true);
      if (arc.via) expect(ids.has(arc.via), arc.id).toBe(true);
      if (arc.reroute) expect(ids.has(arc.reroute), arc.id).toBe(true);
    }
  });

  it("resolves every hyperedge endpoint, and states a mechanism for each", () => {
    for (const edge of worldHyperedges) {
      for (const id of [...edge.sourceIds, ...edge.targetIds]) {
        expect(layoutIndex.has(id), `${edge.id} → ${id}`).toBe(true);
      }
      expect(edge.mechanism.length).toBeGreaterThan(20);
      expect(edge.sourceIds.length + edge.targetIds.length).toBeGreaterThan(1);
    }
  });

  it("carries at least one genuinely many-to-one relationship", () => {
    // The semiconductor case is the argument for hypergraphs over graphs: several
    // conditions producing one constraint jointly. If this ever became a chain of
    // pairs, the site would be claiming something weaker than the evidence shows.
    const joint = worldHyperedges.find((edge) => edge.id === "he-semiconductor");
    expect(joint?.sourceIds.length).toBeGreaterThanOrEqual(4);
  });

  it("cites only evidence ids in the library's format", () => {
    const referenced = [
      ...worldNodes.flatMap((node) => node.evidenceIds),
      ...worldArcs.flatMap((arc) => arc.evidenceIds),
      ...causalOnlyNodes.flatMap((node) => node.evidenceIds ?? []),
      ...worldHyperedges.flatMap((edge) => edge.evidenceIds ?? []),
    ];
    expect(referenced.length).toBeGreaterThan(10);
    for (const id of referenced) expect(id).toMatch(/^E-\d{3}$/);
  });
});

describe("layout", () => {
  it("starts every node at its coordinates and ends it in the structure", () => {
    const positions = new Float32Array(layoutNodes.length * 3);

    writePositions(positions, 0);
    const geographic = layoutNodes.find((node) => node.id === "rare-earth-refining")!;
    const index = layoutIndex.get("rare-earth-refining")!;
    expect(positions[index * 3]).toBeCloseTo(geographic.geo[0], 5);

    writePositions(positions, 1);
    expect(positions[index * 3]).toBeCloseTo(geographic.causal[0], 5);
  });

  it("returns to the identical arrangement when the morph is reversed", () => {
    const forward = new Float32Array(layoutNodes.length * 3);
    const back = new Float32Array(layoutNodes.length * 3);
    writePositions(forward, 0.37);
    writePositions(back, 1);
    writePositions(back, 0.37);
    expect(Array.from(back)).toEqual(Array.from(forward));
  });

  it("keeps the geographic nodes off the surface so they are never buried in it", () => {
    for (const node of layoutNodes.filter((candidate) => !candidate.causalOnly)) {
      expect(Math.hypot(...node.geo)).toBeGreaterThan(GLOBE_RADIUS);
    }
  });

  it("hides structure-only nodes until there is a structure to show", () => {
    const licenceQueue = layoutNodes.find((node) => node.id === "licence-queue")!;
    expect(nodeIntensity(licenceQueue, worldStateAt(1), "industry")).toBe(0);
    expect(nodeIntensity(licenceQueue, worldStateAt(10.4), "industry")).toBeGreaterThan(0);
  });

  it("lights the chokepoint stages in the order the mechanism runs", () => {
    const upstream = layoutNodes.find((node) => node.id === "rare-earth-refining")!;
    const downstream = layoutNodes.find((node) => node.id === "auto-manufacturing")!;
    const early = worldStateAt(3.8);

    expect(nodeIntensity(upstream, early, "industry")).toBeGreaterThan(
      nodeIntensity(downstream, early, "industry"),
    );
  });

  it("narrows rather than empties when a decision scope is selected", () => {
    const state = worldStateAt(8);
    const inScope = layoutNodes.find((node) => node.id === "ercot")!;
    const outOfScope = layoutNodes.find((node) => node.id === "rotterdam")!;

    expect(nodeIntensity(inScope, state, "energy")).toBeGreaterThan(
      nodeIntensity(outOfScope, state, "energy"),
    );
    // Out of scope is dimmed, never deleted: the rest of the world is still there.
    expect(nodeIntensity(outOfScope, state, "energy")).toBeGreaterThan(0);
  });

  it("builds route geometry for both arrangements of the same world", () => {
    const stable = buildArcGeometry("stable", 16);
    const changed = buildArcGeometry("changed", 16);
    expect(stable.count).toBeGreaterThan(0);
    expect(changed.count).toBeGreaterThan(0);
    expect(stable.positions.length).toBe(stable.along.length * 3);
    expect(arcPolylines("stable", 16).length).toBe(worldArcs.length);
  });

  it("moves the routes that the data says were re-routed, and only those", () => {
    const stable = new Map(
      arcPolylines("stable", 12).map((entry) => [entry.arc.id, entry.points]),
    );
    for (const { arc, points } of arcPolylines("changed", 12)) {
      const before = stable.get(arc.id)!;
      const moved = JSON.stringify(before) !== JSON.stringify(points);
      expect(moved, arc.id).toBe(Boolean(arc.reroute));
    }
  });

  it("samples landmass hints without downloading anything", () => {
    const points = buildLandPoints(6);
    expect(points.length).toBeGreaterThan(300);
    for (let offset = 0; offset < points.length; offset += 3) {
      const radius = Math.hypot(points[offset]!, points[offset + 1]!, points[offset + 2]!);
      expect(radius).toBeCloseTo(GLOBE_RADIUS * 1.002, 4);
    }
  });

  it("labels a small, stable set of nodes per scene", () => {
    for (const scene of WORLD_SCENES) {
      const labels = labelNodesForScene(scene.id, scene.focus, 4);
      expect(labels.length).toBeLessThanOrEqual(4);
      expect(labelNodesForScene(scene.id, scene.focus, 4)).toEqual(labels);
    }
  });
});

describe("the operating loop", () => {
  it("changes one state and carries the change downstream in order", () => {
    const policy = layoutNodes.find((node) => node.id === "export-licensing")!;
    const downstream = layoutNodes.find((node) => node.id === "auto-manufacturing")!;
    const unrelated = layoutNodes.find((node) => node.id === "ecb")!;

    // Sample while the front is still travelling, which is where the ordering is
    // the claim. Once it has passed, every stage on the path is affected.
    let travelling: ReturnType<typeof worldStateAt> | null = null;
    for (let t = 10; t <= 11; t += 0.005) {
      const state = worldStateAt(t);
      if (state.perturb > 0.3 && state.perturb < 0.6) {
        travelling = state;
        break;
      }
    }

    expect(travelling).not.toBeNull();
    expect(perturbationAt(policy, travelling!)).toBeGreaterThan(0);
    expect(perturbationAt(policy, travelling!)).toBeGreaterThan(
      perturbationAt(downstream, travelling!),
    );
    // A node outside the mechanism is not affected by the intervention at all.
    expect(perturbationAt(unrelated, travelling!)).toBe(0);
    expect(perturbationAt(unrelated, worldStateAt(10.6))).toBe(0);
  });

  it("applies no intervention outside the simulate phase", () => {
    const policy = layoutNodes.find((node) => node.id === "export-licensing")!;
    expect(perturbationAt(policy, worldStateAt(3))).toBe(0);
    expect(perturbationAt(policy, worldStateAt(12))).toBe(0);
  });

  it("re-maps into a different arrangement, and stays there", () => {
    const before = new Float32Array(layoutNodes.length * 3);
    const after = new Float32Array(layoutNodes.length * 3);
    writePositions(before, 1, 0);
    writePositions(after, 1, 1);
    expect(Array.from(after)).not.toEqual(Array.from(before));

    const later = new Float32Array(layoutNodes.length * 3);
    writePositions(later, 1, worldStateAt(11.4).remap);
    expect(worldStateAt(11.4).remap).toBe(1);
    expect(Array.from(later)).toEqual(Array.from(after));
  });
});
