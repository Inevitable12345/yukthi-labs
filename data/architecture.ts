/* ============================================================================
   ARCHITECTURE
   ----------------------------------------------------------------------------
   Ten layers, each carrying an explicit maturity status.

   `status` is not decoration. Nothing here is marked beyond `concept` or
   `research` unless Yukthi Lab has supplied evidence that it is further along —
   and none has been supplied. Overstating maturity would be the single most
   damaging thing this page could do.
   ========================================================================== */

export type LayerStatus = "concept" | "prototype" | "validated" | "production" | "research";

export const LAYER_STATUS_LABEL: Record<LayerStatus, string> = {
  concept: "Concept",
  prototype: "Prototype",
  validated: "Validated",
  production: "Production",
  research: "Open research",
};

export type ArchitectureLayer = {
  index: string;
  id: string;
  title: string;
  purpose: string;
  detail: string;
  inputs: string[];
  outputs: string[];
  openProblem: string;
  status: LayerStatus;
};

export const architectureLayers: ArchitectureLayer[] = [
  {
    index: "01",
    id: "scope",
    title: "Scope",
    purpose: "Bound the decision before mapping anything.",
    detail:
      "A world model of everything is not a model. Scoping fixes the decision, the horizon and the boundary at which structure stops being represented and becomes an exogenous input. Every node downstream inherits that boundary.",
    inputs: ["Decision under consideration", "Horizon", "Tolerance for loss"],
    outputs: ["Scope definition", "Boundary conditions", "Exogenous variable list"],
    openProblem:
      "Scoping errors are the hardest to detect: a variable left outside the boundary cannot be discovered by any amount of computation inside it.",
    status: "concept",
  },
  {
    index: "02",
    id: "observe",
    title: "Observe",
    purpose: "Acquire signals continuously rather than periodically.",
    detail:
      "Filings, policy publications, regulatory dockets, market data, technical literature, physical sensor and operational telemetry where available. Continuous acquisition is what separates a model that updates from a report that ages.",
    inputs: ["Source registry", "Acquisition schedule"],
    outputs: ["Raw signal stream", "Provenance record"],
    openProblem:
      "Coverage is unevenly distributed. The systems that matter most are frequently the least instrumented.",
    status: "concept",
  },
  {
    index: "03",
    id: "resolve",
    title: "Resolve evidence",
    purpose: "Turn signals into records that can be cited and checked.",
    detail:
      "Each claim is normalised into an evidence record with a source, a date, a status and an accessed timestamp — the same structure that backs every claim on this website. Unverified records stay marked unverified rather than being quietly promoted.",
    inputs: ["Raw signal stream"],
    outputs: ["Evidence records", "Verification status", "Contradiction set"],
    openProblem:
      "Automatic verification against primary documents at scale, without silently accepting a secondary summary as the source.",
    status: "prototype",
  },
  {
    index: "04",
    id: "map",
    title: "Map causal structure",
    purpose: "Construct the scoped hypergraph.",
    detail:
      "States, mechanisms and relations between sets of states. A hyperedge because the interesting conditions are joint: several things holding at once produce an effect that none of them produces alone.",
    inputs: ["Evidence records", "Scope definition", "Domain mechanisms"],
    outputs: ["Scoped causal hypergraph", "Mechanism annotations", "Alternative hypotheses"],
    openProblem:
      "Distinguishing a mechanism from a correlation that has held so far. This is the central difficulty and it is not solved.",
    status: "research",
  },
  {
    index: "05",
    id: "monitor",
    title: "Monitor state",
    purpose: "Track the condition of each node and edge over time.",
    detail:
      "A relation can be active, latent, broken or contested, and can change without any node changing. Monitoring the state of edges — not only of nodes — is what surfaces a structural change before it produces an outcome.",
    inputs: ["Evidence stream", "Current hypergraph"],
    outputs: ["Node states", "Edge states", "Change events"],
    openProblem:
      "Setting a detection threshold that fires on structural change without firing on noise.",
    status: "concept",
  },
  {
    index: "06",
    id: "reason",
    title: "Reason",
    purpose: "Trace consequences through mechanisms, not through correlations.",
    detail:
      "Given a change at a node, follow the mechanisms that carry it. The distinction from pattern matching is that a mechanism states why the effect transmits, which is what allows it to be checked, argued with, and found wrong.",
    inputs: ["Hypergraph", "State estimates", "Intervention"],
    outputs: [
      "Consequence traces",
      "Second- and third-order effects",
      "Assumption dependencies",
    ],
    openProblem:
      "Trace explosion. Beyond three causal steps, the number of admissible paths grows faster than any of them can be justified.",
    status: "research",
  },
  {
    index: "07",
    id: "forecast",
    title: "Forecast",
    purpose: "Quantify plausible futures with explicit uncertainty.",
    detail:
      "Distributions over outcomes, generated with the causal structure held in view, and scored afterwards. Calibration is the measurable part and it is the part that must be earned before any number is published.",
    inputs: ["Consequence traces", "Historical base rates", "Current evidence"],
    outputs: ["Forecast distributions", "Calibration record"],
    openProblem:
      "Calibration under structural change: base rates drawn from the previous regime are exactly the wrong prior for the transition.",
    status: "research",
  },
  {
    index: "08",
    id: "simulate",
    title: "Simulate",
    purpose: "Ask what would happen under an intervention that has not occurred.",
    detail:
      "Counterfactual and scenario simulation over the hypergraph: impose a policy, a price, a restriction or a failure, and propagate it. The answer's value depends entirely on whether the mechanisms are right.",
    inputs: ["Hypergraph", "Intervention specification"],
    outputs: ["Scenario outcomes", "Sensitivity to assumptions"],
    openProblem: "Validating a counterfactual against a world in which it did not happen.",
    status: "concept",
  },
  {
    index: "09",
    id: "remap",
    title: "Re-map",
    purpose: "Revise the structure when reality contradicts it.",
    detail:
      "The step that separates a world model from a diagram. New evidence that a relation has broken should change the graph, not be filed as an exception to it. This is the loop closing.",
    inputs: ["Contradiction set", "Change events", "Forecast errors"],
    outputs: ["Revised hypergraph", "Structural change log"],
    openProblem:
      "Knowing when a contradiction warrants re-specification rather than a wider error bar. Both are always available.",
    status: "research",
  },
  {
    index: "10",
    id: "decision",
    title: "Decision support",
    purpose: "Present the reasoning to a human who is accountable for the decision.",
    detail:
      "The output is not an answer. It is the structure, the evidence, the uncertainty and the alternatives, arranged so a decision-maker can interrogate them and disagree with them. A system that cannot be argued with cannot be trusted with a consequential decision.",
    inputs: ["Traces", "Forecasts", "Scenarios", "Evidence"],
    outputs: [
      "Inspectable reasoning",
      "Intervention options",
      "What would change the conclusion",
    ],
    openProblem:
      "Conveying uncertainty in a way that survives contact with an executive summary.",
    status: "concept",
  },
];

export const architectureFlow = [
  "World signals",
  "Source / evidence layer",
  "Entity + event resolution",
  "Scoped causal hypergraph",
  "State estimation",
  "Mechanism reasoning",
  "Second / third order consequences",
  "Forecast distributions",
  "Counterfactual / scenario simulation",
  "Decision interface",
  "New evidence",
] as const;
