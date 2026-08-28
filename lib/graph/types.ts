/* ============================================================================
   CAUSAL DATA MODEL  (§32, §33)
   ----------------------------------------------------------------------------
   The site's central discipline is that four kinds of statement never blur into
   one another: what a source says, what Yukthi infers from it, what an
   illustrative scenario shows, and what Yukthi intends to build. Every claim
   carries its class, and the evidence inspector prints that class next to the
   claim (§33, §46).
   ========================================================================== */

export type ClaimClass =
  /** Reported by the named organisation in the named document. */
  | "source"
  /** Yukthi's reading of one or more sources. Not the source's own conclusion. */
  | "interpretation"
  /** A worked example with chosen inputs. Never model output, never a forecast. */
  | "illustration"
  /** What Yukthi intends to build. Not a description of what exists today. */
  | "ambition";

export const CLAIM_CLASS_LABEL: Record<ClaimClass, string> = {
  source: "Source fact",
  interpretation: "Yukthi interpretation",
  illustration: "Illustrative scenario",
  ambition: "Product ambition",
};

export type Evidence = {
  id: string;
  /** Document title, as published. */
  title: string;
  organization: string;
  /** Publication date, or the period the document covers. */
  date?: string;
  url?: string;
  /** Where to find the document if no stable link is given. */
  locator?: string;
  /** What the document reports, stated without embellishment. */
  claim: string;
  /** Which step of the thesis this evidence carries. */
  supports: string;
  /** Yukthi's reading. Explicitly separated from `claim`. */
  interpretation: string;
  /** Rooms and pages that cite this record. */
  usedIn: string[];
};

export type NodeCategory =
  "event" | "actor" | "policy" | "market" | "resource" | "infrastructure" | "risk" | "outcome";

export const NODE_CATEGORY_LABEL: Record<NodeCategory, string> = {
  event: "Event",
  actor: "Actor",
  policy: "Policy",
  market: "Market",
  resource: "Resource",
  infrastructure: "Infrastructure",
  risk: "Risk",
  outcome: "Outcome",
};

export type CausalNode = {
  id: string;
  label: string;
  category: NodeCategory;
  /** One line explaining what this node is, for the inspector and for screen readers. */
  note?: string;
  evidenceIds?: string[];
};

/**
 * A hyperedge.
 *
 * `sourceIds` and `targetIds` are both arrays, and that is the whole point: a
 * pairwise graph cannot express "an export control *and* a processing
 * concentration *together* constrain a component supply". Conjunction is the
 * structure, not a convenience.
 */
export type CausalRelation = {
  id: string;
  sourceIds: string[];
  targetIds: string[];
  /** How the causation runs. Never omitted — an unexplained edge is a decoration. */
  mechanism: string;
  /** Qualitative lag. The model reasons about order, and refuses to invent timings. */
  lag?: "immediate" | "weeks" | "months" | "years";
  evidenceIds?: string[];
};

export type CausalGraph = {
  id: string;
  title: string;
  /** What question this scope was built to answer (§18). */
  scopedTo: string;
  nodes: CausalNode[];
  relations: CausalRelation[];
};
