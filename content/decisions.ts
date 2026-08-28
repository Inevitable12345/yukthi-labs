/* ============================================================================
   DECISION SCOPES  (§24, §18)
   ----------------------------------------------------------------------------
   Six questions somebody is accountable for at three in the morning. Each one
   selects a different scope over the same underlying world: different nodes
   matter, different evidence matters, and the structure itself does not change.
   ========================================================================== */

export type DecisionScope = {
  id: string;
  sector: string;
  question: string;
  /** What the scope pulls into the model. */
  inScope: string[];
  /** What the scope deliberately leaves out, and why. */
  boundary: string;
  /** The mechanism the scope exists to trace. */
  mechanism: string;
  evidenceIds: string[];
  /**
   * Nodes of the convergence graph this scope pulls in. The same world, read
   * through six different boundaries — which is what §18 means by scoped.
   */
  worldNodes: string[];
};

export const DECISION_SCOPES: readonly DecisionScope[] = [
  {
    id: "industrial",
    sector: "Industrial",
    question: "What tiny dependency can stop a multi-billion-dollar production system?",
    inScope: [
      "Bill of materials to the third tier",
      "Sole-source and qualified-source components",
      "Requalification lead times",
      "Processing and refining concentration",
      "Export control regimes touching any input",
    ],
    boundary:
      "Demand-side variables stay out. The question is not whether the product sells; it is whether it can be built.",
    mechanism:
      "Exposure is carried by position and substitutability, not by contract value. A component worth a few dollars gates a programme worth billions when nothing else is qualified to replace it.",
    evidenceIds: ["mofcom-rare-earth-controls", "alixpartners-auto-chip", "sia-bcg-supply-chain"],
    worldNodes: ["minerals", "processing", "controls", "transformers", "delay"],
  },
  {
    id: "energy",
    sector: "Energy",
    question:
      "What combination of weather, fuel, infrastructure and geopolitics can invalidate tomorrow's forecast?",
    inScope: [
      "Generation availability under temperature extremes",
      "Fuel supply and its own power dependencies",
      "Interconnection and transfer limits",
      "Demand response under the same conditions",
      "Equipment lead times for repair and reinforcement",
    ],
    boundary:
      "Long-run capacity planning stays out. This scope is about the next few days, where coupling dominates.",
    mechanism:
      "Coupled systems fail together. The February 2021 inquiry documented electricity and gas each degrading the other, which is invisible to a model that treats fuel supply as exogenous.",
    evidenceIds: ["ferc-nerc-uri", "iea-grids"],
    worldNodes: ["electricity", "grid", "transformers", "permitting", "delay"],
  },
  {
    id: "insurance",
    sector: "Insurance",
    question: "Where is emerging risk accumulating outside the historical model?",
    inScope: [
      "Correlated exposure across nominally independent lines",
      "New dependencies inside insured operations",
      "Regime-sensitive assumptions in pricing models",
      "Aggregation through shared infrastructure",
    ],
    boundary:
      "Individual claim adjudication stays out. The scope is about accumulation the portfolio model cannot see.",
    mechanism:
      "Independence is an assumption, not a property. Two books that share a physical or policy dependency are correlated whether or not the pricing model says so.",
    evidenceIds: ["ecb-projection-errors", "panama-canal-draught"],
    worldNodes: ["climate", "logistics", "delay", "grid", "minerals"],
  },
  {
    id: "supply-chain",
    sector: "Supply chain",
    question: "If a strategic supplier changes policy tomorrow, what breaks first?",
    inScope: [
      "Supplier concentration by capability, not by name",
      "Inventory buffers and their true coverage",
      "Alternate qualification timelines",
      "Logistics routes with no substitute",
    ],
    boundary: "Cost optimisation stays out. The question is order of failure, not price.",
    mechanism:
      "First failure is decided by the ratio of buffer to lead time, node by node — which means the answer is a traversal, not a ranking.",
    evidenceIds: ["mofcom-rare-earth-controls", "suez-ever-given"],
    worldNodes: ["logistics", "processing", "controls", "minerals", "transformers"],
  },
  {
    id: "financial",
    sector: "Financial risk",
    question: "Which assumption connecting assets stops being true under the next regime?",
    inScope: [
      "Cross-asset relationships and what generates them",
      "Policy regimes that condition those relationships",
      "Real-economy dependencies behind financial exposure",
      "Model assumptions with an expiry date nobody wrote down",
    ],
    boundary:
      "Execution and microstructure stay out. This scope is about the assumptions underneath the correlation, not the correlation itself.",
    mechanism:
      "Correlation is downstream of structure. When the structure that produced a relationship changes, the relationship is not noisy — it is void.",
    evidenceIds: ["ecb-projection-errors", "imf-fragmentation"],
    worldNodes: ["compute", "ai", "competition", "controls", "electricity"],
  },
  {
    id: "government",
    sector: "Government",
    question: "If we impose this policy, what happens three causal steps later?",
    inScope: [
      "Direct compliance effects",
      "Substitution and rerouting responses",
      "Reciprocal action by other actors",
      "Effects on domestic industries not named in the policy",
    ],
    boundary: "Political feasibility stays out. The scope traces consequence, not passage.",
    mechanism:
      "Second and third-order effects arrive through actors who were not party to the decision, which is precisely why they are the ones missed.",
    evidenceIds: ["chips-act", "eu-chips-act", "imf-fragmentation"],
    worldNodes: ["controls", "competition", "permitting", "processing", "compute"],
  },
];

export const DECISION_BY_ID: Record<string, DecisionScope> = Object.fromEntries(
  DECISION_SCOPES.map((scope) => [scope.id, scope]),
);
