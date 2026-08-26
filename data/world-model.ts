import { z } from "zod";

import { nodeKindSchema, type NodeKind } from "./schema";

/* ============================================================================
   THE WORLD CAUSAL OBSERVATORY — DATA
   ----------------------------------------------------------------------------
   The homepage's background layer is not decoration. It is the same argument the
   acts make, drawn at planetary scale, and it is built from this file.

   Rules this file keeps, identically to `evidence.ts`:
     · every place is a real place, at its real coordinates;
     · every role written against a place is one the cited evidence supports, or
       is marked `illustrative` because it exists to explain a mechanism;
     · no quantity appears here that is not in the evidence library;
     · routes are drawn because they exist, not to make the sphere look busy.

   Coordinates are decimal degrees. Causal coordinates are model space, in the
   layered arrangement the hypergraph morph resolves into:

     x  causal depth   upstream (−1.75) → outcome (+1.75)
     y  rank within the layer
     z  a shallow third axis, so the structure has volume rather than being a wall
   ========================================================================== */

export const worldNodeSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  kind: nodeKindSchema,
  /** Decimal degrees. Real coordinates for real places. */
  lat: z.number().min(-90).max(90),
  lon: z.number().min(-180).max(180),
  /** Why this place is in the model at all. One line, no adjectives. */
  role: z.string().min(1),
  /** Position after the geographic shell is dropped and structure takes over. */
  causal: z.tuple([z.number(), z.number(), z.number()]),
  /** Scenes in which this node is lit rather than latent. */
  scenes: z.array(z.string()).default([]),
  evidenceIds: z.array(z.string()).default([]),
  /** True where the node explains a mechanism rather than reporting an observation. */
  illustrative: z.boolean().default(false),
  /** Waypoints carry routes but are not themselves subjects of the argument. */
  waypoint: z.boolean().default(false),
});

export type WorldNode = z.infer<typeof worldNodeSchema> & { kind: NodeKind };

export const worldArcSchema = z.object({
  id: z.string().min(1),
  from: z.string().min(1),
  to: z.string().min(1),
  /** What moves along this route. */
  carries: z.enum(["goods", "energy", "minerals", "components", "capital", "data"]),
  /** Optional waypoint the stable route runs through. */
  via: z.string().optional(),
  /**
   * How the route stands after the structure changes:
   *   held        unchanged;
   *   rerouted    same endpoints, different path — `reroute` names the waypoint;
   *   conditional continues, but subject to a licence, quota or exemption;
   *   broken      no longer available on the terms it was priced on.
   */
  after: z.enum(["held", "rerouted", "conditional", "broken"]),
  reroute: z.string().optional(),
  evidenceIds: z.array(z.string()).default([]),
  illustrative: z.boolean().default(false),
});

export type WorldArc = z.infer<typeof worldArcSchema>;

/* --------------------------------------------------------------------------
   STRATEGIC NODES
   -------------------------------------------------------------------------- */

const NODES: unknown[] = [
  {
    id: "rare-earth-refining",
    label: "Rare-earth separation",
    kind: "infrastructure",
    lat: 40.66,
    lon: 109.84,
    role: "Separation and refining capacity concentrated in one jurisdiction",
    causal: [-1.75, 0.85, 0.1],
    scenes: ["rupture", "evidence", "chokepoint", "world-model"],
    evidenceIds: ["E-005"],
  },
  {
    id: "export-licensing",
    label: "Export licensing",
    kind: "policy",
    lat: 39.9,
    lon: 116.4,
    role: "Licensing requirement imposed on seven elements and certain magnets, April 2025",
    causal: [-1.75, 0.2, -0.3],
    scenes: ["rupture", "chokepoint", "world-model", "decision-scope"],
    evidenceIds: ["E-004", "E-016"],
  },
  {
    id: "fab-concentration",
    label: "Advanced fabrication",
    kind: "infrastructure",
    lat: 24.77,
    lon: 120.99,
    role: "Geographic concentration of leading-edge semiconductor fabrication",
    causal: [-1.75, -0.45, 0.35],
    scenes: ["stability", "rupture", "hypergraph-intro", "world-model"],
    evidenceIds: ["E-007"],
  },
  {
    id: "packaging",
    label: "Assembly and test",
    kind: "infrastructure",
    lat: 3.14,
    lon: 101.69,
    role: "Back-end semiconductor packaging exposed to a 2021 production stoppage",
    causal: [-1.75, -1.05, -0.15],
    scenes: ["hypergraph-intro", "world-model"],
    evidenceIds: ["E-007"],
  },
  {
    id: "fab-fire",
    label: "Fab interruption",
    kind: "event",
    lat: 36.45,
    lon: 140.6,
    role: "A single plant interruption removing capacity from an already tight market",
    causal: [-1.75, -1.6, 0.2],
    scenes: ["hypergraph-intro"],
    evidenceIds: ["E-007"],
  },
  {
    id: "ercot",
    label: "Texas interconnection",
    kind: "infrastructure",
    lat: 31.0,
    lon: -99.0,
    role: "Electricity and gas systems that depend on each other, February 2021",
    causal: [-0.85, -1.35, -0.4],
    scenes: ["feedback", "world-model", "decision-scope"],
    evidenceIds: ["E-010"],
  },
  {
    id: "ecb",
    label: "Euro area projections",
    kind: "actor",
    lat: 50.11,
    lon: 8.68,
    role: "Institutional inflation projections tested by a change of regime, 2021–22",
    causal: [0.0, 1.5, -0.5],
    scenes: ["structural-break", "world-model"],
    evidenceIds: ["E-008", "E-009"],
  },
  {
    id: "auto-manufacturing",
    label: "Vehicle assembly",
    kind: "asset",
    lat: 48.78,
    lon: 9.18,
    role: "Assembly capacity downstream of both magnet and semiconductor supply",
    causal: [1.75, 0.75, 0.2],
    scenes: ["chokepoint", "hypergraph-intro", "world-model"],
    evidenceIds: ["E-006", "E-007"],
  },
  {
    id: "grid-equipment",
    label: "Grid and wind equipment",
    kind: "asset",
    lat: 55.68,
    lon: 12.57,
    role: "Generation and transmission equipment dependent on permanent magnets",
    causal: [1.75, 0.15, -0.35],
    scenes: ["chokepoint", "world-model"],
    evidenceIds: ["E-006"],
  },
  {
    id: "data-centres",
    label: "Data-centre build-out",
    kind: "asset",
    lat: 39.04,
    lon: -77.49,
    role: "Electricity demand growth from data centres to 2030",
    causal: [1.75, -0.5, 0.4],
    scenes: ["chokepoint", "decision-scope", "world-model"],
    evidenceIds: ["E-015"],
  },
  {
    id: "catastrophe-loss",
    label: "Insured catastrophe loss",
    kind: "outcome",
    lat: 27.99,
    lon: -82.45,
    role: "Global insured natural-catastrophe losses recorded for 2024",
    causal: [1.75, -1.15, -0.2],
    scenes: ["decision-scope", "world-model"],
    evidenceIds: ["E-011"],
  },
  {
    id: "copper",
    label: "Copper supply",
    kind: "market",
    lat: -22.45,
    lon: -68.9,
    role: "Material input to the transformers and cabling the build-out depends on",
    causal: [-0.85, -0.2, 0.5],
    scenes: ["decision-scope", "world-model"],
    evidenceIds: ["E-015"],
    illustrative: true,
  },
  {
    id: "iron-ore",
    label: "Bulk mineral export",
    kind: "market",
    lat: -22.24,
    lon: 118.6,
    role: "Long-haul bulk flow whose route, not whose supply, is the fragile part",
    causal: [-0.85, -0.85, 0.15],
    scenes: ["stability", "rupture"],
    evidenceIds: [],
    illustrative: true,
  },
  {
    id: "gulf-energy",
    label: "Seaborne energy",
    kind: "market",
    lat: 26.57,
    lon: 53.5,
    role: "Energy flow whose transit passes through a small number of straits",
    causal: [-0.85, 0.95, -0.5],
    scenes: ["stability", "rupture", "decision-scope"],
    evidenceIds: [],
    illustrative: true,
  },
  {
    id: "rotterdam",
    label: "Northwest Europe port",
    kind: "infrastructure",
    lat: 51.95,
    lon: 4.14,
    role: "Entry point where redirected flows arrive later and cost more",
    causal: [0.85, 0.95, 0.3],
    scenes: ["stability", "rupture", "world-model"],
    evidenceIds: [],
  },
  {
    id: "los-angeles",
    label: "US west coast port",
    kind: "infrastructure",
    lat: 33.74,
    lon: -118.26,
    role: "Entry point for trans-Pacific components and finished goods",
    causal: [0.85, -1.4, 0.25],
    scenes: ["stability", "rupture"],
    evidenceIds: [],
  },
  {
    id: "shanghai",
    label: "East Asia export hub",
    kind: "infrastructure",
    lat: 31.23,
    lon: 121.47,
    role: "Origin of the container flows the stable era was arranged around",
    causal: [0.0, -0.95, -0.15],
    scenes: ["stability", "rupture", "world-model"],
    evidenceIds: ["E-017"],
  },
  {
    id: "singapore",
    label: "Malacca transit",
    kind: "geography",
    lat: 1.35,
    lon: 103.82,
    role: "Strait through which a large share of east–west maritime trade passes",
    causal: [0.0, -0.35, 0.45],
    scenes: ["stability", "rupture"],
    evidenceIds: [],
    waypoint: true,
  },
  {
    id: "suez",
    label: "Suez transit",
    kind: "geography",
    lat: 30.5,
    lon: 32.35,
    role: "Short route between Asia and Europe; the first thing given up when it is not available",
    causal: [0.0, 0.45, -0.45],
    scenes: ["stability", "rupture"],
    evidenceIds: [],
    waypoint: true,
  },
  {
    id: "cape",
    label: "Cape routing",
    kind: "geography",
    lat: -34.35,
    lon: 18.47,
    role: "The long way round: the same cargo, more days, more working capital",
    causal: [0.0, 0.0, 0.6],
    scenes: ["rupture"],
    evidenceIds: [],
    waypoint: true,
  },
  {
    id: "panama",
    label: "Panama transit",
    kind: "geography",
    lat: 9.08,
    lon: -79.68,
    role: "Interoceanic transit whose capacity depends on freshwater availability",
    causal: [0.85, -0.95, -0.5],
    scenes: ["stability", "rupture"],
    evidenceIds: [],
    waypoint: true,
  },
  {
    id: "hormuz",
    label: "Hormuz transit",
    kind: "geography",
    lat: 26.57,
    lon: 56.25,
    role: "Strait carrying a large share of seaborne crude and LNG",
    causal: [-0.85, 1.45, -0.15],
    scenes: ["stability", "rupture"],
    evidenceIds: [],
    waypoint: true,
  },
];

export const worldNodes: WorldNode[] = NODES.map(
  (node) => worldNodeSchema.parse(node) as WorldNode,
);

export const worldNodeById = new Map(worldNodes.map((node) => [node.id, node]));

/* --------------------------------------------------------------------------
   ROUTES
   --------------------------------------------------------------------------
   The stable era's arrangement, and what each route becomes when the structure
   changes. `after` is the whole rupture argument in one field: almost nothing
   disappears — it becomes conditional, or longer, or repriced.
   ------------------------------------------------------------------------ */

const ARCS: unknown[] = [
  {
    id: "arc-shanghai-rotterdam",
    from: "shanghai",
    to: "rotterdam",
    via: "suez",
    carries: "goods",
    after: "rerouted",
    reroute: "cape",
    illustrative: true,
  },
  {
    id: "arc-shanghai-la",
    from: "shanghai",
    to: "los-angeles",
    carries: "goods",
    after: "held",
    illustrative: true,
  },
  {
    id: "arc-fab-la",
    from: "fab-concentration",
    to: "los-angeles",
    carries: "components",
    after: "conditional",
    evidenceIds: ["E-007"],
  },
  {
    id: "arc-fab-auto",
    from: "fab-concentration",
    to: "auto-manufacturing",
    via: "suez",
    carries: "components",
    after: "conditional",
    evidenceIds: ["E-007"],
  },
  {
    id: "arc-packaging-fab",
    from: "packaging",
    to: "fab-concentration",
    carries: "components",
    after: "conditional",
    evidenceIds: ["E-007"],
  },
  {
    id: "arc-magnet-auto",
    from: "rare-earth-refining",
    to: "auto-manufacturing",
    carries: "minerals",
    after: "conditional",
    evidenceIds: ["E-004", "E-005", "E-006"],
  },
  {
    id: "arc-magnet-grid",
    from: "rare-earth-refining",
    to: "grid-equipment",
    carries: "minerals",
    after: "conditional",
    evidenceIds: ["E-006"],
  },
  {
    id: "arc-magnet-datacentre",
    from: "rare-earth-refining",
    to: "data-centres",
    carries: "minerals",
    after: "conditional",
    evidenceIds: ["E-006", "E-015"],
  },
  {
    id: "arc-licensing-refining",
    from: "export-licensing",
    to: "rare-earth-refining",
    carries: "capital",
    after: "broken",
    evidenceIds: ["E-004"],
  },
  {
    id: "arc-iron-shanghai",
    from: "iron-ore",
    to: "shanghai",
    carries: "minerals",
    after: "held",
    illustrative: true,
  },
  {
    id: "arc-copper-shanghai",
    from: "copper",
    to: "shanghai",
    via: "panama",
    carries: "minerals",
    after: "rerouted",
    reroute: "cape",
    illustrative: true,
  },
  {
    id: "arc-gulf-singapore",
    from: "gulf-energy",
    to: "singapore",
    via: "hormuz",
    carries: "energy",
    after: "conditional",
    illustrative: true,
  },
  {
    id: "arc-gulf-rotterdam",
    from: "gulf-energy",
    to: "rotterdam",
    via: "suez",
    carries: "energy",
    after: "rerouted",
    reroute: "cape",
    illustrative: true,
  },
  {
    id: "arc-singapore-rotterdam",
    from: "singapore",
    to: "rotterdam",
    via: "suez",
    carries: "goods",
    after: "rerouted",
    reroute: "cape",
    illustrative: true,
  },
  {
    id: "arc-ercot-datacentre",
    from: "ercot",
    to: "data-centres",
    carries: "energy",
    after: "conditional",
    evidenceIds: ["E-010", "E-015"],
  },
  {
    id: "arc-ecb-auto",
    from: "ecb",
    to: "auto-manufacturing",
    carries: "capital",
    after: "conditional",
    evidenceIds: ["E-008"],
    illustrative: true,
  },
  {
    id: "arc-cat-la",
    from: "catastrophe-loss",
    to: "los-angeles",
    carries: "capital",
    after: "conditional",
    evidenceIds: ["E-011"],
    illustrative: true,
  },
  {
    id: "arc-shanghai-panama",
    from: "shanghai",
    to: "panama",
    carries: "goods",
    after: "held",
    illustrative: true,
  },
];

export const worldArcs: WorldArc[] = ARCS.map((arc) => worldArcSchema.parse(arc));

/* --------------------------------------------------------------------------
   CAUSAL-ONLY NODES
   --------------------------------------------------------------------------
   States and mechanisms with no address. They have no place on a map, which is
   exactly why a map is not enough: they appear only once the geographic shell is
   dropped and the structure is arranged by relationship instead.
   ------------------------------------------------------------------------ */

export type CausalOnlyNode = {
  id: string;
  label: string;
  kind: NodeKind;
  causal: readonly [number, number, number];
  role: string;
  evidenceIds?: string[];
  illustrative?: boolean;
};

export const causalOnlyNodes: CausalOnlyNode[] = [
  {
    id: "licence-queue",
    label: "Licence processing",
    kind: "mechanism",
    causal: [-0.85, 0.55, -0.1],
    role: "The binding constraint is the time between application and grant, not scarcity",
    evidenceIds: ["E-004", "E-016"],
  },
  {
    id: "magnet-constraint",
    label: "Magnet supply constraint",
    kind: "state",
    causal: [0.0, 0.85, 0.05],
    role: "Availability becomes a queue, and the queue propagates downstream",
    evidenceIds: ["E-005", "E-006"],
  },
  {
    id: "tier-n",
    label: "Tier-2 / Tier-3 suppliers",
    kind: "actor",
    causal: [0.85, 0.45, 0.15],
    role: "The layer holding the least inventory and the least pricing power",
    evidenceIds: ["E-006"],
  },
  {
    id: "semi-constraint",
    label: "Semiconductor constraint",
    kind: "state",
    causal: [0.0, -0.8, 0.2],
    role: "One shared constraint produced jointly by several unrelated conditions",
    evidenceIds: ["E-007"],
  },
  {
    id: "demand-surge",
    label: "Demand shift",
    kind: "event",
    causal: [-1.75, -0.95, 0.55],
    role: "Order cancellations followed by a faster-than-expected return of demand",
    evidenceIds: ["E-007"],
    illustrative: true,
  },
  {
    id: "allocation",
    label: "Allocation decisions",
    kind: "mechanism",
    causal: [0.85, -0.45, -0.1],
    role: "Scarce supply is assigned by decisions taken outside the buyer's view",
    evidenceIds: ["E-007"],
  },
  {
    id: "assembly-stop",
    label: "Assembly interruption",
    kind: "outcome",
    causal: [1.75, -0.95, -0.05],
    role: "Production stops at the line, several steps from the original constraint",
    evidenceIds: ["E-007"],
  },
  {
    id: "gas-freeze",
    label: "Gas production decline",
    kind: "state",
    causal: [-0.85, -1.75, -0.3],
    role: "Wellhead and processing losses under the same condition degrading generation",
    evidenceIds: ["E-010"],
  },
  {
    id: "power-shortfall",
    label: "Generation shortfall",
    kind: "state",
    causal: [0.0, -1.65, -0.25],
    role: "Outages that then remove power from the infrastructure supplying the fuel",
    evidenceIds: ["E-010"],
  },
  {
    id: "regime-shift",
    label: "Regime change",
    kind: "state",
    causal: [-0.85, 1.6, -0.55],
    role: "The relationship the model learned stops holding while the model keeps applying it",
    evidenceIds: ["E-008", "E-009"],
  },
];

/* --------------------------------------------------------------------------
   HYPEREDGES
   --------------------------------------------------------------------------
   Many-to-many, because that is what the cases actually look like. A hyperedge
   asserts joint production: these conditions together produce this state. Drawing
   one line per pair would assert something weaker and untrue.
   ------------------------------------------------------------------------ */

export type WorldHyperedge = {
  id: string;
  sourceIds: string[];
  targetIds: string[];
  label: string;
  mechanism: string;
  order: 1 | 2 | 3;
  evidenceIds?: string[];
  illustrative?: boolean;
};

export const worldHyperedges: WorldHyperedge[] = [
  {
    id: "he-licensing",
    sourceIds: ["export-licensing", "rare-earth-refining"],
    targetIds: ["licence-queue"],
    label: "Control meets concentration",
    mechanism:
      "A licensing requirement binds only where capacity is concentrated enough that it cannot be sourced elsewhere.",
    order: 1,
    evidenceIds: ["E-004", "E-005"],
  },
  {
    id: "he-magnet",
    sourceIds: ["licence-queue"],
    targetIds: ["magnet-constraint", "tier-n"],
    label: "Queue becomes constraint",
    mechanism: "Shipments continue at the rate licences are granted, not at the rate demanded.",
    order: 2,
    evidenceIds: ["E-016"],
  },
  {
    id: "he-downstream",
    sourceIds: ["magnet-constraint", "tier-n"],
    targetIds: ["auto-manufacturing", "grid-equipment", "data-centres"],
    label: "Downstream exposure",
    mechanism:
      "Components carrying small quantities of the constrained input sit inside much larger assemblies.",
    order: 3,
    evidenceIds: ["E-006"],
  },
  {
    id: "he-semiconductor",
    sourceIds: ["fab-concentration", "packaging", "fab-fire", "demand-surge", "ercot"],
    targetIds: ["semi-constraint"],
    label: "Joint constraint",
    mechanism:
      "Concentration, a plant interruption, a lockdown, a demand reversal and a weather event acted together. No single one of them explains the shortage.",
    order: 1,
    evidenceIds: ["E-007"],
  },
  {
    id: "he-allocation",
    sourceIds: ["semi-constraint"],
    targetIds: ["allocation", "assembly-stop"],
    label: "Allocation and interruption",
    mechanism: "Scarcity is resolved by allocation decisions, which relocate the loss.",
    order: 2,
    evidenceIds: ["E-007"],
  },
  {
    id: "he-feedback",
    sourceIds: ["ercot", "gas-freeze"],
    targetIds: ["power-shortfall"],
    label: "Reinforcing loop",
    mechanism:
      "Generation loss removes power from gas infrastructure, which removes fuel from generation. The output is also an input.",
    order: 1,
    evidenceIds: ["E-010"],
  },
  {
    id: "he-regime",
    sourceIds: ["regime-shift"],
    targetIds: ["ecb"],
    label: "Fragility under regime change",
    mechanism:
      "A model fitted on one causal regime keeps projecting after the regime generating the data has changed.",
    order: 1,
    evidenceIds: ["E-008", "E-009"],
  },
];

/* --------------------------------------------------------------------------
   COARSE LANDMASS OUTLINES
   --------------------------------------------------------------------------
   Deliberately approximate: enough for a reader to orient themselves, not enough
   to be mistaken for a survey. Pairs are [longitude, latitude].
   ------------------------------------------------------------------------ */

export const landOutlines: readonly (readonly (readonly [number, number])[])[] = [
  // North America
  [
    [-168, 65],
    [-155, 71],
    [-133, 69],
    [-115, 70],
    [-95, 72],
    [-80, 73],
    [-64, 60],
    [-55, 52],
    [-66, 45],
    [-70, 42],
    [-76, 35],
    [-81, 25],
    [-97, 26],
    [-105, 20],
    [-115, 30],
    [-124, 40],
    [-135, 58],
    [-150, 60],
  ],
  // Central America
  [
    [-92, 18],
    [-84, 15],
    [-78, 9],
    [-77, 8],
    [-83, 8],
    [-88, 14],
    [-95, 16],
  ],
  // South America
  [
    [-81, 8],
    [-72, 11],
    [-60, 10],
    [-50, 2],
    [-35, -6],
    [-38, -20],
    [-48, -25],
    [-58, -35],
    [-62, -41],
    [-66, -50],
    [-72, -54],
    [-75, -45],
    [-72, -30],
    [-70, -18],
    [-80, -5],
    [-79, 2],
  ],
  // Africa
  [
    [-17, 15],
    [-10, 28],
    [10, 37],
    [25, 32],
    [35, 31],
    [43, 12],
    [51, 11],
    [42, -2],
    [40, -15],
    [35, -24],
    [25, -34],
    [18, -34],
    [12, -18],
    [9, 4],
    [-8, 5],
  ],
  // Europe
  [
    [-10, 36],
    [-9, 43],
    [-2, 48],
    [3, 51],
    [5, 58],
    [10, 58],
    [12, 65],
    [25, 70],
    [30, 70],
    [40, 66],
    [45, 55],
    [40, 48],
    [30, 45],
    [28, 41],
    [22, 40],
    [15, 38],
    [12, 45],
    [3, 42],
    [-2, 37],
  ],
  // Britain and Ireland
  [
    [-10, 51],
    [-6, 55],
    [-8, 57],
    [-3, 58],
    [0, 53],
    [1, 51],
    [-5, 50],
  ],
  // Asia
  [
    [30, 45],
    [45, 45],
    [58, 42],
    [60, 30],
    [56, 25],
    [48, 25],
    [45, 12],
    [56, 24],
    [68, 24],
    [72, 19],
    [77, 8],
    [80, 13],
    [87, 21],
    [92, 21],
    [97, 16],
    [100, 13],
    [105, 10],
    [110, 20],
    [117, 23],
    [122, 31],
    [126, 40],
    [131, 43],
    [135, 55],
    [145, 60],
    [160, 62],
    [178, 66],
    [178, 71],
    [140, 73],
    [110, 74],
    [80, 74],
    [60, 70],
    [50, 68],
    [40, 66],
    [32, 60],
  ],
  // Japan
  [
    [130, 32],
    [136, 35],
    [141, 37],
    [142, 41],
    [145, 44],
    [141, 45],
    [138, 37],
    [133, 33],
  ],
  // Maritime Southeast Asia
  [
    [95, 5],
    [105, -5],
    [115, -8],
    [130, -8],
    [141, -8],
    [141, -2],
    [130, 0],
    [118, 1],
    [108, 3],
    [100, 6],
  ],
  // Australia
  [
    [114, -22],
    [122, -18],
    [130, -12],
    [137, -12],
    [143, -11],
    [146, -19],
    [151, -25],
    [153, -28],
    [150, -37],
    [145, -38],
    [140, -38],
    [135, -35],
    [129, -32],
    [120, -34],
    [115, -34],
  ],
  // New Zealand
  [
    [166, -46],
    [174, -41],
    [178, -38],
    [173, -35],
    [170, -43],
  ],
  // Greenland
  [
    [-45, 60],
    [-30, 68],
    [-22, 72],
    [-25, 80],
    [-40, 83],
    [-58, 80],
    [-55, 70],
    [-50, 64],
  ],
  // Madagascar
  [
    [43, -12],
    [50, -15],
    [50, -24],
    [45, -25],
    [43, -18],
  ],
];

/* --------------------------------------------------------------------------
   CHOKEPOINT PROPAGATION ORDER
   --------------------------------------------------------------------------
   The stages of the rare-earth cascade, in the order the mechanism runs. The
   world layer activates them in this order and no other: the sequence is the
   claim, so it is data rather than an animation parameter.
   ------------------------------------------------------------------------ */

export const chokepointWave: readonly (readonly string[])[] = [
  ["export-licensing"],
  ["rare-earth-refining"],
  ["licence-queue"],
  ["magnet-constraint", "tier-n"],
  ["auto-manufacturing", "grid-equipment", "data-centres"],
];

/* --------------------------------------------------------------------------
   DECISION SCOPES
   --------------------------------------------------------------------------
   Which part of the world each scope in Act 09 is built around. Scoping is the
   first act of the architecture, and this is what it means concretely: the same
   world, a different boundary, a different subset of structure carried into it.
   ------------------------------------------------------------------------ */

export const scopeMembership: Record<string, readonly string[]> = {
  industry: [
    "rare-earth-refining",
    "export-licensing",
    "licence-queue",
    "magnet-constraint",
    "tier-n",
    "auto-manufacturing",
    "assembly-stop",
  ],
  energy: ["ercot", "gas-freeze", "power-shortfall", "gulf-energy", "data-centres", "hormuz"],
  insurance: ["catastrophe-loss", "ercot", "gas-freeze", "los-angeles", "auto-manufacturing"],
  "supply-chain": [
    "shanghai",
    "singapore",
    "suez",
    "cape",
    "rotterdam",
    "los-angeles",
    "fab-concentration",
    "packaging",
    "semi-constraint",
    "allocation",
  ],
  portfolio: ["ecb", "regime-shift", "copper", "shanghai", "catastrophe-loss", "iron-ore"],
  government: [
    "export-licensing",
    "licence-queue",
    "rare-earth-refining",
    "fab-concentration",
    "grid-equipment",
    "data-centres",
    "hormuz",
  ],
};
