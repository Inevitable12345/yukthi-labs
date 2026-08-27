import { z } from "zod";

/* ============================================================================
   CAUSAL SCHEMA
   ----------------------------------------------------------------------------
   The representation the entire site is built on.

   Two commitments are enforced by these types rather than by convention:

     1. A relation connects *sets* to *sets*. Pairwise edges are the degenerate
        case, not the primitive. This is what makes the structure a hypergraph
        and it is the reason the type is called `CausalRelation` and not `Edge`.

     2. Every assertion carries an explicit epistemic class. Nothing rendered on
        this site is allowed to be ambiguous about whether it was observed,
        claimed by a source, interpreted by Yukthi, or invented to explain a
        mechanism.
   ========================================================================== */

/**
 * The five epistemic classes (§2 of the brief).
 *
 * These are rendered with distinct visual treatments everywhere they appear. A
 * reader must never have to guess which one they are looking at.
 */
export const claimClassSchema = z.enum([
  /** Measured and reported by a named institution. */
  "observed-fact",
  /** Asserted by a named source, including its own hedging. */
  "source-claim",
  /** Yukthi's reading of what the evidence means. Argued, not measured. */
  "yukthi-interpretation",
  /** A mechanism drawn to explain how something works. Not a finding. */
  "illustrative-scenario",
  /** What the product intends to do, and does not yet do. */
  "product-ambition",
]);

export type ClaimClass = z.infer<typeof claimClassSchema>;

export const CLAIM_CLASS_LABEL: Record<ClaimClass, string> = {
  "observed-fact": "Observed fact",
  "source-claim": "Source claim",
  "yukthi-interpretation": "Yukthi interpretation",
  "illustrative-scenario": "Illustrative scenario",
  "product-ambition": "Product ambition",
};

/** One-line explanation shown in the legend and in every source drawer. */
export const CLAIM_CLASS_DEFINITION: Record<ClaimClass, string> = {
  "observed-fact": "Measured and published by the named institution.",
  "source-claim": "Asserted by the named source, carrying that source's own hedges.",
  "yukthi-interpretation": "Yukthi's reading of the evidence. An argument, not a measurement.",
  "illustrative-scenario": "A mechanism drawn to explain how something could propagate.",
  "product-ambition": "What Yukthi intends to build. Not a description of what exists.",
};

export const nodeKindSchema = z.enum([
  "actor",
  "event",
  "market",
  "risk",
  "policy",
  "resource",
  "infrastructure",
  "mechanism",
  "state",
  "outcome",
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
  /** The decision this node was mapped for. Structure is scoped, never global. */
  scope: z.string().optional(),
  evidenceIds: z.array(z.string()).optional(),
  claimClass: claimClassSchema.default("illustrative-scenario"),
});

export type CausalNode = z.infer<typeof causalNodeSchema>;

/**
 * A hyperedge.
 *
 * `sourceIds` and `targetIds` are both arrays because the situations this site
 * exists to describe are conjunctive: cold weather AND unwinterised equipment AND
 * gas-fired generation share produce an outage. Decomposing that into three
 * pairwise arrows loses the conjunction, which is the part that matters.
 */
export const causalRelationSchema = z.object({
  id: z.string().min(1),
  sourceIds: z.array(z.string()).min(1),
  targetIds: z.array(z.string()).min(1),
  label: z.string().optional(),
  /** How the effect is transmitted. The part a correlation cannot supply. */
  mechanism: z.string().min(1),
  polarity: z.enum(["positive", "negative", "mixed", "unknown"]).default("unknown"),
  /** Causal distance from the origin of the trace. */
  order: z.union([z.literal(1), z.literal(2), z.literal(3)]).optional(),
  state: z.enum(["active", "latent", "broken", "contested"]).default("active"),
  evidenceIds: z.array(z.string()).optional(),
  claimClass: claimClassSchema.default("illustrative-scenario"),
  /** Readings that would also explain the observation. Never omitted to look decisive. */
  alternatives: z.array(z.string()).optional(),
});

export type CausalRelation = z.infer<typeof causalRelationSchema>;

/* --------------------------------------------------------------------------
   EVIDENCE
   -------------------------------------------------------------------------- */

export const evidenceStatusSchema = z.enum(["verified", "needs-verification"]);
export type EvidenceStatus = z.infer<typeof evidenceStatusSchema>;

export const evidenceCategorySchema = z.enum([
  "fragmentation",
  "critical-minerals",
  "semiconductors",
  "structural-breaks",
  "energy",
  "insurance",
  "ai-forecasting",
]);

export type EvidenceCategory = z.infer<typeof evidenceCategorySchema>;

export const EVIDENCE_CATEGORY_LABEL: Record<EvidenceCategory, string> = {
  fragmentation: "Fragmentation",
  "critical-minerals": "Critical minerals",
  semiconductors: "Semiconductors",
  "structural-breaks": "Structural breaks",
  energy: "Energy",
  insurance: "Insurance",
  "ai-forecasting": "AI forecasting",
};

export const evidenceRecordSchema = z.object({
  id: z.string().regex(/^E-\d{3}$/, "Evidence IDs are E-001 … E-999"),
  title: z.string().min(1),
  organization: z.string().min(1),
  publication: z.string().optional(),
  date: z.string().optional(),
  url: z.string().url().optional(),
  /** The single sentence this record is cited for, with the source's own units. */
  claim: z.string().min(1),
  /** What the number does not say. Never omitted where a hedge exists. */
  context: z.string().optional(),
  /** Why it matters causally — not merely that it is interesting. */
  causalRelevance: z.string().optional(),
  /** How the figure was produced, where that changes how it should be read. */
  methodology: z.string().optional(),
  categories: z.array(evidenceCategorySchema).min(1),
  status: evidenceStatusSchema,
  accessedAt: z.string().optional(),
});

export type EvidenceRecord = z.infer<typeof evidenceRecordSchema>;

/* --------------------------------------------------------------------------
   POSITIONED GRAPHS
   --------------------------------------------------------------------------
   Diagram geometry is authored, not force-simulated: a causal argument reads in
   a particular order, and a physics layout would scramble that order on every
   load. Coordinates are normalised 0–1 and mapped onto the viewBox at render.
   -------------------------------------------------------------------------- */

export const positionSchema = z.object({
  x: z.number().min(0).max(1),
  y: z.number().min(0).max(1),
});
export type Position = z.infer<typeof positionSchema>;

export const positionedNodeSchema = causalNodeSchema.extend({
  position: positionSchema,
  anchor: z.enum(["start", "middle", "end"]).optional(),
  labelSide: z.enum(["above", "below", "left", "right"]).optional(),
});

export type PositionedNode = z.infer<typeof positionedNodeSchema>;

export const causalGraphSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  scope: z.string().min(1),
  /** Read by screen readers in place of the diagram. Required, never generated. */
  textAlternative: z.string().min(1),
  nodes: z.array(positionedNodeSchema).min(1),
  relations: z.array(causalRelationSchema),
  claimClass: claimClassSchema,
  evidenceIds: z.array(z.string()).optional(),
});

export type CausalGraph = z.infer<typeof causalGraphSchema>;

/** Parses and freezes a graph at module scope, so a malformed graph fails the build. */
export function defineGraph(graph: z.input<typeof causalGraphSchema>): CausalGraph {
  const parsed = causalGraphSchema.parse(graph);

  const ids = new Set(parsed.nodes.map((node) => node.id));
  for (const relation of parsed.relations) {
    for (const id of [...relation.sourceIds, ...relation.targetIds]) {
      if (!ids.has(id)) {
        throw new Error(
          `Graph "${parsed.id}": relation "${relation.id}" references unknown node "${id}".`,
        );
      }
    }
  }

  return parsed;
}
