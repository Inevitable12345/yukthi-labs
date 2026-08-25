import { causalGraphSchema, type CausalGraph } from "./schema";

/* ============================================================================
   SEMICONDUCTOR CONSTRAINT — CHAIN vs HYPERGRAPH
   ----------------------------------------------------------------------------
   Two representations of the same episode, so the difference between them is the
   argument rather than an assertion about it.

   The causes listed are all documented features of 2020–21. What is deliberately
   NOT claimed: that they combined in one fixed order, that each was necessary, or
   that their effects were additive. They are drawn as interacting pathways into a
   shared constraint, which is what a hyperedge is for.
   ========================================================================== */

/** The representation most supply-chain systems actually hold. */
export const semiconductorChain: CausalGraph = causalGraphSchema.parse({
  id: "semiconductor-chain",
  title: "The chain",
  scope: "Vehicle production dependency on semiconductors, as modelled linearly",
  illustrative: true,
  textAlternative:
    "A single straight line with three stages: supplier, then component, then vehicle. Each stage depends only on the one before it. This is the representation most procurement systems hold, and it has no place to record that seven unrelated events could converge on one input.",
  nodes: [
    {
      id: "sc-supplier",
      label: "Supplier",
      kind: "actor",
      position: { x: 0.14, y: 0.5 },
      illustrative: true,
    },
    {
      id: "sc-component",
      label: "Component",
      kind: "asset",
      position: { x: 0.5, y: 0.5 },
      illustrative: true,
    },
    {
      id: "sc-vehicle",
      label: "Vehicle",
      kind: "outcome",
      position: { x: 0.86, y: 0.5 },
      illustrative: true,
    },
  ],
  relations: [
    {
      id: "sc-c1",
      sourceIds: ["sc-supplier"],
      targetIds: ["sc-component"],
      label: "supplies",
      order: 1,
      state: "active",
      illustrative: true,
    },
    {
      id: "sc-c2",
      sourceIds: ["sc-component"],
      targetIds: ["sc-vehicle"],
      label: "assembles into",
      order: 1,
      state: "active",
      illustrative: true,
    },
  ],
});

/** What the same period actually looked like. */
export const semiconductorHypergraph: CausalGraph = causalGraphSchema.parse({
  id: "semiconductor-hypergraph",
  title: "The hypergraph",
  scope: "Vehicle production dependency on semiconductors, 2020–2021",
  illustrative: false,
  evidenceIds: ["E-007"],
  textAlternative:
    "Seven contributing conditions sit on the left: a pandemic demand shift toward consumer electronics, foundry capacity concentrated in Taiwan, pandemic lockdowns affecting assembly and test capacity in Malaysia, a severe winter storm halting fabrication plants in Texas, a fire at a Japanese fabrication plant, a surge in end demand, and container logistics congestion. None of them is individually sufficient, and they did not occur in a fixed order. All seven feed a single joint relationship — a hyperedge — into one shared state: a semiconductor supply constraint. From that constraint the structure narrows again: allocation decisions across Tier-N suppliers, then assembly shutdowns, then revenue loss. AlixPartners estimated 210 billion US dollars of lost automotive revenue and 7.7 million units of lost production for 2021, an estimate revised up from 110 billion dollars and 3.9 million units four months earlier. The revision is the evidence: a model whose forecast must double mid-year did not contain all the active pathways.",
  nodes: [
    {
      id: "sh-pandemic",
      label: "Pandemic demand shift",
      kind: "event",
      position: { x: 0.075, y: 0.09 },
      description:
        "Consumer electronics demand rose while vehicle orders were being cancelled.",
    },
    {
      id: "sh-taiwan",
      label: "Foundry concentration",
      kind: "geography",
      position: { x: 0.075, y: 0.235 },
      description: "Advanced-node capacity concentrated in a small number of sites.",
    },
    {
      id: "sh-malaysia",
      label: "Malaysia lockdown",
      kind: "event",
      position: { x: 0.075, y: 0.38 },
      description: "Assembly and test capacity — the step after the wafer, before the part.",
    },
    {
      id: "sh-texas",
      label: "Texas winter storm",
      kind: "event",
      position: { x: 0.075, y: 0.525 },
      description:
        "The same storm that appears in the energy cascade, entering a different system.",
      evidenceIds: ["E-010"],
    },
    {
      id: "sh-fire",
      label: "Fab fire",
      kind: "event",
      position: { x: 0.075, y: 0.67 },
      description: "A single-site loss of automotive-grade capacity.",
    },
    {
      id: "sh-demand",
      label: "Demand surge",
      kind: "market",
      position: { x: 0.075, y: 0.815 },
      description: "Vehicle demand recovered faster than cancelled orders could be reinstated.",
    },
    {
      id: "sh-logistics",
      label: "Logistics congestion",
      kind: "infrastructure",
      position: { x: 0.075, y: 0.955 },
      description:
        "Container availability and port throughput extending every lead time at once.",
    },
    {
      id: "sh-constraint",
      label: "Semiconductor constraint",
      kind: "state",
      position: { x: 0.46, y: 0.5 },
      state: "Binding across the sector",
      description:
        "The joint consequence. No single upstream condition produced it; the conjunction did.",
      evidenceIds: ["E-007"],
    },
    {
      id: "sh-allocation",
      label: "Tier-N allocation",
      kind: "mechanism",
      position: { x: 0.66, y: 0.5 },
      description:
        "Scarce parts are allocated by relationships and contracts, not by need. The allocation rule is itself causal.",
    },
    {
      id: "sh-shutdown",
      label: "Assembly shutdown",
      kind: "outcome",
      position: { x: 0.82, y: 0.5 },
      state: "7.7 million units of lost production, 2021 estimate",
      evidenceIds: ["E-007"],
    },
    {
      id: "sh-revenue",
      label: "Revenue loss",
      kind: "outcome",
      position: { x: 0.955, y: 0.5 },
      state: "USD 210bn estimated for 2021, revised up from USD 110bn",
      description:
        "The revision, not the level, is the finding: the causal structure behind the first estimate was incomplete.",
      evidenceIds: ["E-007"],
    },
  ],
  relations: [
    {
      id: "sh-hyper",
      sourceIds: [
        "sh-pandemic",
        "sh-taiwan",
        "sh-malaysia",
        "sh-texas",
        "sh-fire",
        "sh-demand",
        "sh-logistics",
      ],
      targetIds: ["sh-constraint"],
      label: "joint constraint",
      mechanism:
        "Seven pathways, none individually sufficient, converging on one shared input. A pairwise graph cannot express 'jointly, but not separately' — a hyperedge can.",
      polarity: "negative",
      order: 1,
      state: "active",
      evidenceIds: ["E-007"],
      alternatives: [
        "Order cancellation early in the pandemic, followed by rapid reinstatement, may be sufficient on its own to explain much of the automotive-specific shortfall.",
        "Automotive-grade qualification requirements, rather than raw wafer capacity, may have been the binding constraint for some parts.",
      ],
    },
    {
      id: "sh-r2",
      sourceIds: ["sh-constraint"],
      targetIds: ["sh-allocation"],
      label: "scarcity → allocation",
      mechanism: "Under scarcity, the allocation rule determines who is affected and when.",
      polarity: "negative",
      order: 2,
      state: "active",
    },
    {
      id: "sh-r3",
      sourceIds: ["sh-allocation"],
      targetIds: ["sh-shutdown"],
      label: "allocation → interruption",
      mechanism:
        "A missing part with no substitute stops a line regardless of what else is present.",
      polarity: "negative",
      order: 2,
      state: "active",
      evidenceIds: ["E-007"],
    },
    {
      id: "sh-r4",
      sourceIds: ["sh-shutdown"],
      targetIds: ["sh-revenue"],
      label: "interruption → loss",
      mechanism: "Unbuilt units are unrecoverable revenue within the model year.",
      polarity: "negative",
      order: 3,
      state: "active",
      evidenceIds: ["E-007"],
    },
  ],
});
