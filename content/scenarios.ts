/* ============================================================================
   CAUSAL GRAPHS AND SCENARIOS
   ----------------------------------------------------------------------------
   Each graph is scoped to one question (§18). Every relation states a mechanism
   in plain words, and mechanisms are written as claims about how causation runs
   — not as assertions that it will. Where a relation rests on a published
   document, it carries the evidence id.

   None of this is model output. It is a hand-authored illustration of the
   representation Yukthi intends to build and maintain automatically (§22, §46).
   ========================================================================== */

import type { CausalGraph } from "@/lib/graph/types";

/* --------------------------------------------------------------------------
   Room 03 / Room 16 — the rare-earth chokepoint, and the scenario built on it.
   -------------------------------------------------------------------------- */

export const CHOKEPOINT_GRAPH: CausalGraph = {
  id: "chokepoint",
  title: "Separated heavy rare earths",
  scopedTo: "What does an export restriction at one processing node reach?",
  nodes: [
    {
      id: "policy",
      label: "Export licensing decision",
      category: "policy",
      note: "An administrative requirement introduced at a national level.",
      evidenceIds: ["mofcom-rare-earth-controls"],
    },
    {
      id: "processing",
      label: "Separation and refining",
      category: "infrastructure",
      note: "Capability to separate mixed oxides into individual usable elements.",
      evidenceIds: ["usgs-rare-earth-concentration", "iea-critical-minerals-outlook"],
    },
    {
      id: "oxide",
      label: "Separated oxide supply",
      category: "resource",
      note: "The element in the form a magnet producer can actually use.",
    },
    {
      id: "magnet",
      label: "Permanent magnet production",
      category: "market",
      note: "Sintered magnets carrying heavy rare-earth additions for heat tolerance.",
    },
    {
      id: "motor",
      label: "Traction motors and actuators",
      category: "market",
      note: "The component in which the magnet's properties become a specification.",
    },
    {
      id: "automotive",
      label: "Vehicle programmes",
      category: "outcome",
      note: "Production lines whose schedule depends on motor availability.",
      evidenceIds: ["alixpartners-auto-chip"],
    },
    {
      id: "defence",
      label: "Defence systems",
      category: "outcome",
      note: "Guidance, actuation and sensing subsystems with qualified suppliers.",
    },
    {
      id: "energy",
      label: "Wind generation build-out",
      category: "outcome",
      note: "Direct-drive turbine designs with high magnet intensity.",
    },
    {
      id: "datacentre",
      label: "Data-centre build-out",
      category: "infrastructure",
      note: "Cooling, drives and power equipment inside compute facilities.",
      evidenceIds: ["iea-electricity-2024"],
    },
    {
      id: "qualification",
      label: "Requalification time",
      category: "risk",
      note: "The months or years an alternate supplier takes to be approved.",
    },
    {
      id: "inventory",
      label: "Held inventory",
      category: "resource",
      note: "The buffer that decides whether a disruption is felt at all.",
    },
  ],
  relations: [
    {
      id: "r-policy-processing",
      sourceIds: ["policy"],
      targetIds: ["processing"],
      mechanism: "Licensing places an administrative condition on export from the processing step.",
      lag: "immediate",
      evidenceIds: ["mofcom-rare-earth-controls"],
    },
    {
      id: "r-processing-oxide",
      sourceIds: ["processing"],
      targetIds: ["oxide"],
      mechanism:
        "Where separation capacity is concentrated, a condition on it passes through to available supply of the separated element.",
      lag: "weeks",
      evidenceIds: ["usgs-rare-earth-concentration"],
    },
    {
      id: "r-oxide-magnet",
      sourceIds: ["oxide", "inventory"],
      targetIds: ["magnet"],
      mechanism:
        "Magnet output is constrained only once available supply and held inventory are both insufficient — a conjunction, not a chain.",
      lag: "weeks",
    },
    {
      id: "r-magnet-motor",
      sourceIds: ["magnet"],
      targetIds: ["motor"],
      mechanism: "Motor and actuator assemblies are specified around a magnet grade.",
      lag: "months",
    },
    {
      id: "r-motor-auto",
      sourceIds: ["motor", "qualification"],
      targetIds: ["automotive"],
      mechanism:
        "A programme is disrupted where the motor is constrained and requalifying an alternate supplier takes longer than the buffer.",
      lag: "months",
    },
    {
      id: "r-motor-defence",
      sourceIds: ["motor", "qualification"],
      targetIds: ["defence"],
      mechanism:
        "Qualified-supplier requirements make substitution slower in defence than in commercial programmes.",
      lag: "years",
    },
    {
      id: "r-magnet-energy",
      sourceIds: ["magnet"],
      targetIds: ["energy"],
      mechanism: "Direct-drive turbine designs carry high magnet intensity per unit of capacity.",
      lag: "months",
    },
    {
      id: "r-magnet-datacentre",
      sourceIds: ["magnet"],
      targetIds: ["datacentre"],
      mechanism:
        "Cooling and power equipment inside compute facilities depends on the same motor supply base.",
      lag: "months",
      evidenceIds: ["iea-electricity-2024"],
    },
  ],
};

export type ScenarioLever = {
  id: string;
  label: string;
  /** Nodes activated when the lever is on. */
  activates: string[];
  offCaption: string;
  onCaption: string;
};

export type Scenario = {
  id: string;
  title: string;
  graphId: string;
  question: string;
  lever: ScenarioLever;
  /** Printed alongside the interaction, always (§22). */
  disclaimer: string;
};

export const EXPORT_RESTRICTION_SCENARIO: Scenario = {
  id: "export-restriction",
  title: "Export restriction",
  graphId: "chokepoint",
  question: "What if this export restriction happens?",
  lever: {
    id: "restriction",
    label: "Export restriction",
    activates: ["policy", "qualification"],
    offCaption:
      "The structure is present but inert. Nothing has fired, because no condition has been met.",
    onCaption:
      "Hyperedges fire in the order their conditions are met. A relation with two sources waits for both.",
  },
  disclaimer:
    "Illustrative scenario — not live model output. Propagation order follows the hand-authored mechanisms above. No probability is computed, and none is implied.",
};

/* --------------------------------------------------------------------------
   Room 06 — the February 2021 feedback loop.
   -------------------------------------------------------------------------- */

export const FEEDBACK_GRAPH: CausalGraph = {
  id: "feedback",
  title: "February 2021, Texas and the south-central United States",
  scopedTo: "How did electricity and gas failures amplify one another?",
  nodes: [
    { id: "cold", label: "Extreme cold", category: "event" },
    { id: "generation", label: "Generating unit outages", category: "infrastructure" },
    { id: "gas-production", label: "Natural gas production decline", category: "resource" },
    { id: "gas-to-generators", label: "Gas available to generators", category: "resource" },
    { id: "electricity", label: "Electricity shortfall", category: "outcome" },
    { id: "gas-infrastructure", label: "Power to gas infrastructure", category: "infrastructure" },
  ],
  relations: [
    {
      id: "f-cold-generation",
      sourceIds: ["cold"],
      targetIds: ["generation"],
      mechanism: "Freezing conditions caused widespread generating unit outages.",
      lag: "immediate",
      evidenceIds: ["ferc-nerc-uri"],
    },
    {
      id: "f-cold-gas",
      sourceIds: ["cold"],
      targetIds: ["gas-production"],
      mechanism: "The same conditions caused simultaneous declines in natural gas production.",
      lag: "immediate",
      evidenceIds: ["ferc-nerc-uri"],
    },
    {
      id: "f-gas-delivery",
      sourceIds: ["gas-production"],
      targetIds: ["gas-to-generators"],
      mechanism: "Reduced production passes through to the gas actually deliverable to generators.",
      lag: "immediate",
      evidenceIds: ["ferc-nerc-uri"],
    },
    {
      id: "f-generation-electricity",
      sourceIds: ["generation", "gas-to-generators"],
      targetIds: ["electricity"],
      mechanism:
        "Outages and reduced fuel supply together produced the electricity shortfall — either alone would have been survivable.",
      lag: "immediate",
      evidenceIds: ["ferc-nerc-uri"],
    },
    {
      id: "f-electricity-infrastructure",
      sourceIds: ["electricity"],
      targetIds: ["gas-infrastructure"],
      mechanism: "Loss of electricity supply reached gas production and processing facilities.",
      lag: "immediate",
      evidenceIds: ["ferc-nerc-uri"],
    },
    {
      id: "f-infrastructure-gas",
      sourceIds: ["gas-infrastructure", "gas-production"],
      targetIds: ["gas-to-generators"],
      mechanism:
        "Reduced power to gas infrastructure contributed to further reductions in gas available to generators — closing the loop.",
      lag: "immediate",
      evidenceIds: ["ferc-nerc-uri"],
    },
  ],
};

/* --------------------------------------------------------------------------
   Room 07 — the convergence graph.
   -------------------------------------------------------------------------- */

export const CONVERGENCE_GRAPH: CausalGraph = {
  id: "convergence",
  title: "Compute, electricity and materials",
  scopedTo: "Where do the systems normally analysed apart actually touch?",
  nodes: [
    { id: "ai", label: "AI capability demand", category: "market" },
    {
      id: "datacentres",
      label: "Data-centre build-out",
      category: "infrastructure",
      evidenceIds: ["iea-electricity-2024"],
    },
    { id: "electricity", label: "Electricity demand", category: "resource" },
    { id: "grid", label: "Grid capacity", category: "infrastructure", evidenceIds: ["iea-grids"] },
    { id: "transformers", label: "Grid equipment supply", category: "resource" },
    {
      id: "minerals",
      label: "Copper and critical minerals",
      category: "resource",
      evidenceIds: ["usgs-rare-earth-concentration"],
    },
    {
      id: "processing",
      label: "Processing concentration",
      category: "infrastructure",
      evidenceIds: ["iea-critical-minerals-outlook"],
    },
    { id: "controls", label: "Export controls", category: "policy" },
    { id: "permitting", label: "Permitting timelines", category: "policy" },
    { id: "delay", label: "Infrastructure delay", category: "risk" },
    { id: "compute", label: "Compute constraint", category: "outcome" },
    { id: "competition", label: "Strategic AI competition", category: "actor" },
    { id: "climate", label: "Hydrological and weather variability", category: "event" },
    {
      id: "logistics",
      label: "Maritime chokepoints",
      category: "infrastructure",
      evidenceIds: ["panama-canal-draught", "suez-ever-given"],
    },
  ],
  relations: [
    {
      id: "c-ai-dc",
      sourceIds: ["ai"],
      targetIds: ["datacentres"],
      mechanism: "Capability demand is met by building physical compute capacity.",
      lag: "months",
    },
    {
      id: "c-dc-elec",
      sourceIds: ["datacentres"],
      targetIds: ["electricity"],
      mechanism:
        "The IEA estimated data centre, AI and crypto electricity use at 460 TWh in 2022, and projected it could exceed 1,000 TWh by 2026.",
      lag: "months",
      evidenceIds: ["iea-electricity-2024"],
    },
    {
      id: "c-elec-grid",
      sourceIds: ["electricity", "permitting"],
      targetIds: ["grid"],
      mechanism:
        "New demand becomes a grid constraint where connection and reinforcement are also gated by permitting timelines.",
      lag: "years",
      evidenceIds: ["iea-grids"],
    },
    {
      id: "c-grid-transformers",
      sourceIds: ["grid"],
      targetIds: ["transformers"],
      mechanism: "Grid expansion converts into demand for long-lead-time equipment.",
      lag: "years",
      evidenceIds: ["iea-grids"],
    },
    {
      id: "c-transformers-minerals",
      sourceIds: ["transformers"],
      targetIds: ["minerals"],
      mechanism: "Equipment manufacture draws on copper and on specialised material inputs.",
      lag: "months",
    },
    {
      id: "c-minerals-processing",
      sourceIds: ["minerals"],
      targetIds: ["processing"],
      mechanism: "Usable material depends on refining, which is more concentrated than extraction.",
      lag: "months",
      evidenceIds: ["iea-critical-minerals-outlook"],
    },
    {
      id: "c-processing-controls",
      sourceIds: ["processing", "competition"],
      targetIds: ["controls"],
      mechanism:
        "Concentration plus strategic competition makes a processing step available as a policy instrument.",
      lag: "months",
    },
    {
      id: "c-controls-delay",
      sourceIds: ["controls", "logistics"],
      targetIds: ["delay"],
      mechanism:
        "Restriction at a concentrated node, combined with constrained routes, lengthens infrastructure delivery.",
      lag: "months",
      evidenceIds: ["panama-canal-draught"],
    },
    {
      id: "c-climate-logistics",
      sourceIds: ["climate"],
      targetIds: ["logistics"],
      mechanism:
        "Water levels and weather change the throughput of fixed maritime routes with no substitute.",
      lag: "months",
      evidenceIds: ["panama-canal-draught"],
    },
    {
      id: "c-delay-compute",
      sourceIds: ["delay", "grid"],
      targetIds: ["compute"],
      mechanism:
        "Compute is constrained where facilities are ready but power delivery is not — a conjunction of two independent programmes.",
      lag: "years",
    },
    {
      id: "c-compute-competition",
      sourceIds: ["compute"],
      targetIds: ["competition"],
      mechanism:
        "Constrained capability raises the strategic value of securing it, closing the loop onto policy.",
      lag: "years",
    },
  ],
};

export const GRAPHS: Record<string, CausalGraph> = {
  chokepoint: CHOKEPOINT_GRAPH,
  feedback: FEEDBACK_GRAPH,
  convergence: CONVERGENCE_GRAPH,
};

/* --------------------------------------------------------------------------
   Room 05 — the structural break series.

   A schematic of the shape the ECB documented, not a reproduction of any
   published series. Values are illustrative and labelled as such wherever the
   chart is drawn; the exhibit's claim is about the shape of a break, and it
   would be dishonest to imply these are measured observations.
   -------------------------------------------------------------------------- */

export type BreakSeries = {
  /** Period index. Deliberately unitless — this is a shape, not a dataset. */
  t: number;
  /** What a model estimated on the prior regime would have expected. */
  expected: number;
  /** What the regime actually produced. */
  realized: number;
};

export const STRUCTURAL_BREAK_SERIES: readonly BreakSeries[] = [
  { t: 0, expected: 1.4, realized: 1.4 },
  { t: 1, expected: 1.5, realized: 1.5 },
  { t: 2, expected: 1.5, realized: 1.6 },
  { t: 3, expected: 1.6, realized: 1.6 },
  { t: 4, expected: 1.6, realized: 1.8 },
  { t: 5, expected: 1.7, realized: 2.2 },
  { t: 6, expected: 1.7, realized: 3.1 },
  { t: 7, expected: 1.8, realized: 4.4 },
  { t: 8, expected: 1.8, realized: 5.9 },
  { t: 9, expected: 1.9, realized: 7.3 },
  { t: 10, expected: 1.9, realized: 8.4 },
  { t: 11, expected: 2.0, realized: 8.9 },
];

/** The index at which the generating relationships stopped holding. */
export const BREAK_INDEX = 5;
