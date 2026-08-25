import type { CausalRelation, NodeKind } from "@/data/schema";

/* ============================================================================
   VISUAL ENCODING
   ----------------------------------------------------------------------------
   Colour carries meaning here, so colour is never the *only* carrier: every state
   also has a stroke pattern, and every causal order also has a printed label.
   A reader who cannot distinguish gold from steel loses nothing.
   ========================================================================== */

export const NODE_TONE: Record<NodeKind, string> = {
  policy: "var(--color-gold)",
  mechanism: "var(--color-gold)",
  risk: "var(--color-rupture)",
  outcome: "var(--color-rupture)",
  event: "var(--color-bone)",
  actor: "var(--color-bone)",
  asset: "var(--color-bone)",
  geography: "var(--color-steel)",
  infrastructure: "var(--color-steel)",
  market: "var(--color-steel)",
  state: "var(--color-steel)",
  evidence: "var(--color-steel)",
};

export const KIND_LABEL: Record<NodeKind, string> = {
  actor: "Actor",
  event: "Event",
  market: "Market",
  risk: "Risk",
  policy: "Policy",
  asset: "Asset",
  mechanism: "Mechanism",
  evidence: "Evidence",
  state: "State",
  outcome: "Outcome",
  infrastructure: "Infrastructure",
  geography: "Geography",
};

export type RelationState = NonNullable<CausalRelation["state"]>;

export const RELATION_STATE_LABEL: Record<RelationState, string> = {
  active: "Active",
  latent: "Latent",
  broken: "Broken",
  contested: "Contested",
};

/** Stroke pattern is the accessible carrier of relation state. */
export const RELATION_DASH: Record<RelationState, string | undefined> = {
  active: undefined,
  latent: "5 6",
  broken: "2 7",
  contested: "1 4",
};

export const RELATION_TONE: Record<RelationState, string> = {
  active: "var(--color-steel)",
  latent: "var(--color-dim-bone)",
  broken: "var(--color-rupture)",
  contested: "var(--color-gold-dim)",
};

/** Causal distance. Opacity is a reinforcement; the printed degree is the signal. */
export const ORDER_OPACITY: Record<1 | 2 | 3, number> = {
  1: 0.95,
  2: 0.62,
  3: 0.38,
};

export const ORDER_LABEL: Record<1 | 2 | 3, string> = {
  1: "1°",
  2: "2°",
  3: "3°",
};

export const POLARITY_LABEL: Record<NonNullable<CausalRelation["polarity"]>, string> = {
  positive: "Amplifying",
  negative: "Constraining",
  mixed: "Mixed",
  unknown: "Unknown",
};
