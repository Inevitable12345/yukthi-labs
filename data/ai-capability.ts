/* ============================================================================
   THE OPENING CREATED BY AI
   ----------------------------------------------------------------------------
   Five components, stated at the strength the evidence actually supports.

   The evidence does not show that a machine can build an accurate world model. It
   shows that machines can now perform several components of the process that a
   world model would need. That distinction is the whole point of this section and
   is preserved in every line below.
   ========================================================================== */

export type CapabilityStage = {
  id: string;
  index: string;
  label: string;
  claim: string;
  limit: string;
  evidenceIds: string[];
};

export const capabilityStages: CapabilityStage[] = [
  {
    id: "search",
    index: "01",
    label: "Search",
    claim:
      "Retrieve relevant material from a large, unstructured information space without a query written in advance.",
    limit:
      "Retrieval quality bounds everything downstream. A source that is not found cannot be reasoned about.",
    evidenceIds: ["E-013"],
  },
  {
    id: "synthesize",
    index: "02",
    label: "Evidence synthesis",
    claim:
      "Reconcile heterogeneous sources — filings, policy texts, technical literature, market data — into a single statement of what is known.",
    limit:
      "Synthesis can smooth over contradiction. Sources that disagree are more informative than sources that agree, and are easily averaged away.",
    evidenceIds: ["E-013"],
  },
  {
    id: "reason",
    index: "03",
    label: "Probabilistic reasoning",
    claim:
      "Hold uncertainty explicitly and revise it as evidence arrives, rather than asserting a point.",
    limit:
      "Calibration is measurable, and measurement shows the gap to expert forecasters has not closed.",
    evidenceIds: ["E-012", "E-014"],
  },
  {
    id: "forecast",
    index: "04",
    label: "Forecasting",
    claim:
      "Produce probabilistic forecasts that match an aggregated human crowd on binary questions, and in recent evaluations exceed a general crowd baseline.",
    limit:
      "Not superforecasters. Frontier models remain behind expert human forecasters, and this site makes no claim otherwise.",
    evidenceIds: ["E-012", "E-013", "E-014"],
  },
  {
    id: "update",
    index: "05",
    label: "Continuous updating",
    claim:
      "Run without stopping, so a position reflects the evidence available now rather than the evidence available when a report was commissioned.",
    limit:
      "Continuous updating without structure produces a continuously updated correlation — which is exactly the thing that fails under regime change.",
    evidenceIds: ["E-012"],
  },
];

export const MISSING_LAYER = "The missing layer is explicit causal structure.";
