import { z } from "zod";

/* ============================================================================
   CAUSAL SCHEMA
   ----------------------------------------------------------------------------
   The representation the whole site is built on: typed states, typed
   relationships between *sets* of states (hyperedges, not edges), and evidence
   that attaches to both.

   Two invariants are enforced by these types rather than by convention:
     1. anything not drawn from a source is `illustrative: true`;
     2. every evidence record carries an explicit verification `status`.
   ========================================================================== */

export const nodeKindSchema = z.enum([
  "actor",
  "event",
  "market",
  "risk",
  "policy",
  "asset",
  "mechanism",
  "evidence",
  "state",
  "outcome",
  "infrastructure",
  "geography",
]);

export type NodeKind = z.infer<typeof nodeKindSchema>;

export const causalNodeSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  kind: nodeKindSchema,
  description: z.string().optional(),
  /** Observed or assumed condition of this node right now. */
  state: z.string().optional(),
  /** 0–1. Only present where a defensible basis exists. Never a decorative number. */
  confidence: z.number().min(0).max(1).optional(),
  timestamp: z.string().optional(),
  /** The decision this node was mapped for. Structure is scoped, never global. */
  scope: z.string().optional(),
  evidenceIds: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  /** True when the node exists to explain a mechanism, not to report an observation. */
  illustrative: z.boolean().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export type CausalNode = z.infer<typeof causalNodeSchema>;

export const causalRelationSchema = z.object({
  id: z.string().min(1),
  /** A hyperedge: many sources may be jointly required to produce many targets. */
  sourceIds: z.array(z.string()).min(1),
  targetIds: z.array(z.string()).min(1),
  label: z.string().optional(),
  /** How the effect is transmitted. The part a correlation cannot supply. */
  mechanism: z.string().optional(),
  polarity: z.enum(["positive", "negative", "mixed", "unknown"]).optional(),
  confidence: z.number().min(0).max(1).optional(),
  evidenceIds: z.array(z.string()).optional(),
  /** Causal distance from the origin of the trace. */
  order: z.union([z.literal(1), z.literal(2), z.literal(3)]).optional(),
  state: z.enum(["active", "latent", "broken", "contested"]).optional(),
  illustrative: z.boolean().optional(),
  /** Alternative readings that would also explain the observation. */
  alternatives: z.array(z.string()).optional(),
});

export type CausalRelation = z.infer<typeof causalRelationSchema>;

export const evidenceStatusSchema = z.enum(["verified", "needs-verification", "illustrative"]);

export type EvidenceStatus = z.infer<typeof evidenceStatusSchema>;

export const evidenceCategorySchema = z.enum([
  "geopolitics",
  "supply-chains",
  "energy",
  "insurance",
  "markets",
  "ai-forecasting",
  "structural-breaks",
  "critical-minerals",
]);

export type EvidenceCategory = z.infer<typeof evidenceCategorySchema>;

export const evidenceRecordSchema = z.object({
  id: z.string().regex(/^E-\d{3}$/, "Evidence IDs are E-001 … E-999"),
  title: z.string().min(1),
  organization: z.string().optional(),
  publication: z.string().optional(),
  date: z.string().optional(),
  url: z.string().url().optional(),
  /** The single sentence this record is cited for. */
  claim: z.string().min(1),
  excerpt: z.string().optional(),
  context: z.string().optional(),
  /** Why the claim matters causally — not merely that it is interesting. */
  causalRelevance: z.string().optional(),
  categories: z.array(evidenceCategorySchema).min(1),
  status: evidenceStatusSchema,
  accessedAt: z.string().optional(),
});

export type EvidenceRecord = z.infer<typeof evidenceRecordSchema>;

/* --------------------------------------------------------------------------
   Positioned graphs
   --------------------------------------------------------------------------
   Diagram geometry is authored, not force-simulated: a causal argument reads in
   a particular order and a physics layout would scramble it on every load.
   Coordinates are normalised 0–1 and mapped onto the viewBox at render time.
   ------------------------------------------------------------------------ */

export const positionSchema = z.object({
  x: z.number().min(0).max(1),
  y: z.number().min(0).max(1),
});

export type Position = z.infer<typeof positionSchema>;

export const positionedNodeSchema = causalNodeSchema.extend({
  position: positionSchema,
  /** Horizontal label alignment when the default would collide or overflow. */
  anchor: z.enum(["start", "middle", "end"]).optional(),
  /** Which side of the glyph the label sits on. Defaults to below. */
  labelSide: z.enum(["above", "below", "left", "right"]).optional(),
});

export type PositionedNode = z.infer<typeof positionedNodeSchema>;

export const causalGraphSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  scope: z.string().min(1),
  /** Plain-language description read by screen readers in place of the diagram. */
  textAlternative: z.string().min(1),
  nodes: z.array(positionedNodeSchema).min(1),
  relations: z.array(causalRelationSchema),
  /** True when the *structure* is explanatory rather than observed. */
  illustrative: z.boolean(),
  evidenceIds: z.array(z.string()).optional(),
});

export type CausalGraph = z.infer<typeof causalGraphSchema>;

/* --------------------------------------------------------------------------
   Scenarios
   ------------------------------------------------------------------------ */

export const scenarioSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  /** The role whose 3 a.m. question this is. */
  role: z.string().min(1),
  question: z.string().min(1),
  /** What is assumed to be true today, and would have to break. */
  assumption: z.string().min(1),
  trace: z.array(
    z.object({
      order: z.union([z.literal(1), z.literal(2), z.literal(3)]),
      label: z.string(),
      mechanism: z.string(),
    }),
  ),
  evidenceIds: z.array(z.string()).optional(),
  illustrative: z.literal(true),
});

export type Scenario = z.infer<typeof scenarioSchema>;

/**
 * Branching futures.
 *
 * `probability` is deliberately absent from the authored data. The field exists on
 * the type so that calibrated model output can be attached later without a schema
 * migration — but until a model produces one, nothing here carries a number.
 */
export const futureBranchSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  summary: z.string().min(1),
  drivers: z.array(z.string()).min(1),
  assumptions: z.array(z.string()).min(1),
  probability: z.number().min(0).max(1).optional(),
  calibrationStatus: z.string().optional(),
  illustrative: z.literal(true),
});

export type FutureBranch = z.infer<typeof futureBranchSchema>;
