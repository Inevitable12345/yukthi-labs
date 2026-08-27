import type { WorldForm } from "@/lib/story/chapters";

/* ============================================================================
   THE CAUSAL WORLD — GEOMETRY (§5)
   ----------------------------------------------------------------------------
   The instrument is one persistent set of nodes. It is never rebuilt, never
   swapped for a different object, and never re-seeded between chapters.

   What changes is the *layout*: each node holds a position in every one of the
   eight forms, and the world interpolates between them. That is the entire
   argument expressed as geometry — the same entities, reorganised from
   "where things are" into "why things happen".

   Everything here is seeded rather than random, so the server render, the client
   render and the SVG fallback are the same picture, and so the composition can be
   tuned rather than re-rolled.
   ========================================================================== */

/** Mulberry32 — small, fast, and stable across engines. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type WorldNodeKind = "ordinary" | "strategic" | "chokepoint" | "evidence";

export type WorldNode = {
  index: number;
  kind: WorldNodeKind;
  /** 0–1. Drives size and brightness. A few nodes carry the composition. */
  weight: number;
  /** Geopolitical bloc, assigned in the rupture form. */
  bloc: 0 | 1 | 2;
  /** Depth in the causal ordering, 0 (upstream) … 5 (downstream). */
  layer: number;
  /** Index within its causal layer. */
  rank: number;
  /** Population of its layer, for even spacing. */
  layerSize: number;
};

export type Vec3 = { x: number; y: number; z: number };

export type WorldEdge = {
  a: number;
  b: number;
  /** 0–1. Thin, near-invisible edges are still structure, not noise. */
  strength: number;
};

/**
 * A hyperedge: several sources jointly producing several targets, drawn through
 * a shared junction rather than as a bundle of pairwise arrows.
 */
export type WorldHyperedge = {
  sources: number[];
  targets: number[];
  /** Where the junction sits, as a fraction between source and target centroids. */
  waist: number;
};

export type WorldGraph = {
  nodes: WorldNode[];
  edges: WorldEdge[];
  hyperedges: WorldHyperedge[];
  /** Index of the single upstream node the chokepoint form funnels through. */
  chokepointIndex: number;
};

const LAYER_COUNT = 6;

/**
 * Build the world.
 *
 * Node count varies by device tier, so every layout is expressed in terms of
 * `layerSize` and `rank` rather than absolute indices — a 90-node world and a
 * 320-node world produce the same composition at different densities.
 */
export function buildWorld(count: number, seed = 20260827): WorldGraph {
  const random = mulberry32(seed);
  const nodes: WorldNode[] = [];

  // Layer populations widen downstream: few upstream inputs, many dependent
  // outputs. This is the shape of the argument, so it is assigned rather than
  // sampled.
  const layerWeights = [0.05, 0.1, 0.16, 0.22, 0.24, 0.23];
  const layerCounts = layerWeights.map((weight) => Math.max(2, Math.round(count * weight)));
  const total = layerCounts.reduce((sum, value) => sum + value, 0);

  let index = 0;
  for (let layer = 0; layer < LAYER_COUNT; layer += 1) {
    const layerSize = layerCounts[layer]!;
    for (let rank = 0; rank < layerSize; rank += 1) {
      const roll = random();
      const kind: WorldNodeKind =
        layer === 0 && rank === 0
          ? "chokepoint"
          : roll > 0.93
            ? "strategic"
            : roll > 0.82
              ? "evidence"
              : "ordinary";

      nodes.push({
        index,
        kind,
        weight: Math.pow(random(), 2.2),
        bloc: Math.floor(random() * 3) as 0 | 1 | 2,
        layer,
        rank,
        layerSize,
      });
      index += 1;
    }
  }

  // Edges run downstream only. A causal diagram that lets effects point
  // backwards is a network diagram, not a causal one.
  const edges: WorldEdge[] = [];
  for (const node of nodes) {
    if (node.layer >= LAYER_COUNT - 1) continue;
    const fanOut = 1 + Math.floor(random() * 2.4);
    for (let n = 0; n < fanOut; n += 1) {
      const targets = nodes.filter((candidate) => candidate.layer === node.layer + 1);
      if (targets.length === 0) continue;
      const target = targets[Math.floor(random() * targets.length)]!;
      edges.push({ a: node.index, b: target.index, strength: 0.3 + random() * 0.7 });
    }
  }

  // A handful of genuine many-to-many relations. Kept few and legible: the point
  // is that hyperedges exist and are readable, not that the screen is full.
  const hyperedges: WorldHyperedge[] = [];
  for (let h = 0; h < 5; h += 1) {
    const layer = 1 + Math.floor(random() * 3);
    const sourcePool = nodes.filter((node) => node.layer === layer);
    const targetPool = nodes.filter((node) => node.layer === layer + 1);
    if (sourcePool.length < 2 || targetPool.length < 2) continue;

    const pick = (pool: WorldNode[], howMany: number) => {
      const chosen = new Set<number>();
      while (chosen.size < Math.min(howMany, pool.length)) {
        chosen.add(pool[Math.floor(random() * pool.length)]!.index);
      }
      return [...chosen];
    };

    hyperedges.push({
      sources: pick(sourcePool, 2 + Math.floor(random() * 2)),
      targets: pick(targetPool, 2 + Math.floor(random() * 2)),
      waist: 0.42 + random() * 0.16,
    });
  }

  void total;

  return { nodes, edges, hyperedges, chokepointIndex: 0 };
}

/* --------------------------------------------------------------------------
   THE EIGHT LAYOUTS
   --------------------------------------------------------------------------
   Each returns a position for one node in one form. Same input node, eight
   places it can be. The world is the interpolation between them.
   -------------------------------------------------------------------------- */

/** Deterministic per-node angles, so a node keeps its identity across forms. */
function angles(node: WorldNode): { theta: number; phi: number } {
  const random = mulberry32(0x9e37 + node.index * 2654435761);
  return { theta: random() * Math.PI * 2, phi: Math.acos(2 * random() - 1) };
}

/** EARTH — an abstract planetary body. Sparse, calm, evenly covered. */
function earthLayout(node: WorldNode): Vec3 {
  const { theta, phi } = angles(node);
  const radius = 1;
  return {
    x: Math.sin(phi) * Math.cos(theta) * radius,
    y: Math.cos(phi) * radius * 0.94,
    z: Math.sin(phi) * Math.sin(theta) * radius,
  };
}

/** GLOBAL NETWORK — the same body, with strategic nodes lifted clear of it. */
function globalNetworkLayout(node: WorldNode): Vec3 {
  const base = earthLayout(node);
  const lift = node.kind === "strategic" ? 1.13 : node.kind === "chokepoint" ? 1.2 : 1.02;
  return { x: base.x * lift, y: base.y * lift, z: base.z * lift };
}

/**
 * FRAGMENTED NETWORK — the rupture.
 *
 * Nodes are not scattered: they are pulled toward three bloc centres. The world
 * does not explode, it *rewires* (§8). Distance between blocs opens up while the
 * body stays intact.
 */
function fragmentedLayout(node: WorldNode): Vec3 {
  const base = earthLayout(node);
  const blocAngle = (node.bloc / 3) * Math.PI * 2;
  const centre = {
    x: Math.cos(blocAngle) * 0.62,
    y: (node.bloc - 1) * 0.16,
    z: Math.sin(blocAngle) * 0.62,
  };
  // 55% toward the bloc centre: clustered, but the globe is still recognisable.
  const pull = 0.55;
  return {
    x: base.x * (1 - pull) + centre.x * pull * 1.9,
    y: base.y * (1 - pull) + centre.y * pull * 1.9,
    z: base.z * (1 - pull) + centre.z * pull * 1.9,
  };
}

/**
 * CHOKEPOINT — an hourglass.
 *
 * One node at the top, a narrow waist, and an enormous fan beneath it. The
 * geometry states the asymmetry before any label does: everything below depends
 * on passing through a single point above.
 */
function chokepointLayout(node: WorldNode): Vec3 {
  const { theta } = angles(node);
  const t = node.layer / (LAYER_COUNT - 1);

  // Held clear above the rest of layer 0, not merely at the top of it. The
  // apex has to read as a single point everything else hangs beneath, so the
  // separation is explicit rather than incidental.
  if (node.kind === "chokepoint") return { x: 0, y: 1.95, z: 0 };

  // Waist at layer 1: the licensing step everything must pass through.
  const waistCloseness = Math.abs(t - 0.2);
  const radius = 0.06 + Math.pow(waistCloseness, 1.35) * 2.55;
  const spread = node.layerSize > 1 ? node.rank / node.layerSize : 0;
  const angle = theta * 0.35 + spread * Math.PI * 2;

  return {
    x: Math.cos(angle) * radius,
    y: 1.5 - t * 3,
    z: Math.sin(angle) * radius,
  };
}

/**
 * CAUSAL GRAPH — geography is gone.
 *
 * Nodes sit in causal layers on a near-plane. This is the signature moment: the
 * same points the reader has been watching as a globe are now arranged by what
 * causes what.
 */
function causalGraphLayout(node: WorldNode): Vec3 {
  const spread = node.layerSize > 1 ? node.rank / (node.layerSize - 1) : 0.5;
  const jitter = mulberry32(node.index * 7919)();

  return {
    x: (spread - 0.5) * 3.5,
    y: 1.35 - (node.layer / (LAYER_COUNT - 1)) * 2.7,
    z: (jitter - 0.5) * 0.34,
  };
}

/**
 * CAUSAL HYPERGRAPH — the layers gain depth.
 *
 * Nodes participating in a hyperedge are drawn toward their junction, so
 * many-to-many relations become visible as structure rather than as more lines.
 */
function hypergraphLayout(node: WorldNode, graph: WorldGraph): Vec3 {
  const base = causalGraphLayout(node);
  const member = graph.hyperedges.find(
    (edge) => edge.sources.includes(node.index) || edge.targets.includes(node.index),
  );

  const depth = ((node.index % 5) - 2) * 0.3;

  if (!member) return { x: base.x, y: base.y, z: base.z + depth };

  const cluster = graph.hyperedges.indexOf(member);
  const pullX = Math.cos(cluster * 1.7) * 0.55;
  const pullZ = Math.sin(cluster * 1.7) * 0.55;

  return {
    x: base.x * 0.78 + pullX,
    y: base.y,
    z: base.z + depth * 0.6 + pullZ,
  };
}

/**
 * WORLD MODEL — the working instrument.
 *
 * The causal structure holds its shape while evidence nodes migrate outward into
 * a surrounding shell: the monitoring layer that keeps the model current.
 */
function worldModelLayout(node: WorldNode, graph: WorldGraph): Vec3 {
  const base = hypergraphLayout(node, graph);
  if (node.kind !== "evidence") return base;

  const { theta, phi } = angles(node);
  const radius = 2.35;
  return {
    x: Math.sin(phi) * Math.cos(theta) * radius,
    y: Math.cos(phi) * radius * 0.72,
    z: Math.sin(phi) * Math.sin(theta) * radius * 0.6,
  };
}

/**
 * FUTURES — possible paths.
 *
 * The downstream layers fan forward into branches. Nothing here carries a
 * probability, and the geometry is deliberately open-ended: branches thin out
 * rather than terminating in outcomes.
 */
function futuresLayout(node: WorldNode, graph: WorldGraph): Vec3 {
  const base = worldModelLayout(node, graph);
  const downstream = node.layer / (LAYER_COUNT - 1);
  if (downstream < 0.5) return base;

  const branch = ((node.index % 5) - 2) * 0.42;
  const reach = (downstream - 0.5) * 2;

  return {
    x: base.x + branch * reach * 1.15,
    y: base.y - reach * 0.28,
    z: base.z + reach * 1.5,
  };
}

/** Position of one node in one form. */
export function positionFor(form: WorldForm, node: WorldNode, graph: WorldGraph): Vec3 {
  switch (form) {
    case "earth":
      return earthLayout(node);
    case "global-network":
      return globalNetworkLayout(node);
    case "fragmented-network":
      return fragmentedLayout(node);
    case "chokepoint":
      return chokepointLayout(node);
    case "causal-graph":
      return causalGraphLayout(node);
    case "hypergraph":
      return hypergraphLayout(node, graph);
    case "world-model":
      return worldModelLayout(node, graph);
    case "futures":
      return futuresLayout(node, graph);
  }
}

/**
 * All eight layouts, precomputed as flat Float32Arrays.
 *
 * Built once per world. The frame loop then only interpolates between two of
 * them, which is a linear pass over a typed array rather than any per-frame
 * trigonometry.
 */
export function precomputeLayouts(graph: WorldGraph): Record<WorldForm, Float32Array> {
  const forms: WorldForm[] = [
    "earth",
    "global-network",
    "fragmented-network",
    "chokepoint",
    "causal-graph",
    "hypergraph",
    "world-model",
    "futures",
  ];

  const result = {} as Record<WorldForm, Float32Array>;

  for (const form of forms) {
    const buffer = new Float32Array(graph.nodes.length * 3);
    graph.nodes.forEach((node, i) => {
      const position = positionFor(form, node, graph);
      buffer[i * 3] = position.x;
      buffer[i * 3 + 1] = position.y;
      buffer[i * 3 + 2] = position.z;
    });
    result[form] = buffer;
  }

  return result;
}

/**
 * The form the world should hold at a given point on the timeline, plus how far
 * it has travelled toward the next one.
 *
 * The world runs slightly ahead of the prose: a transformation should be
 * underway as the reader arrives at the sentence explaining it, not begin
 * afterwards.
 */
export const FORM_SEQUENCE: readonly { at: number; form: WorldForm }[] = [
  { at: 0, form: "earth" },
  { at: 0.6, form: "global-network" },
  { at: 1.2, form: "fragmented-network" },
  { at: 2.2, form: "chokepoint" },
  { at: 3.3, form: "causal-graph" },
  { at: 6.4, form: "hypergraph" },
  { at: 9.2, form: "world-model" },
  { at: 12, form: "futures" },
] as const;

export function formAt(timeline: number): { from: WorldForm; to: WorldForm; mix: number } {
  const sequence = FORM_SEQUENCE;

  if (timeline <= sequence[0]!.at) {
    return { from: sequence[0]!.form, to: sequence[0]!.form, mix: 0 };
  }

  for (let i = 0; i < sequence.length - 1; i += 1) {
    const current = sequence[i]!;
    const next = sequence[i + 1]!;
    if (timeline <= next.at) {
      const mix = (timeline - current.at) / (next.at - current.at);
      return { from: current.form, to: next.form, mix: mix < 0 ? 0 : mix > 1 ? 1 : mix };
    }
  }

  const last = sequence[sequence.length - 1]!;
  return { from: last.form, to: last.form, mix: 1 };
}
