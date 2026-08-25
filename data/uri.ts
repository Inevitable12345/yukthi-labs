import { causalGraphSchema, type CausalGraph } from "./schema";

/* ============================================================================
   WINTER STORM URI — REINFORCING CASCADE
   ----------------------------------------------------------------------------
   Structure: observed, from the FERC/NERC/Regional Entity final report (E-010).

   Drawn as a closed loop because the loop is the finding. The cold triggered the
   first failures; the coupling between electricity and gas turned a shock into a
   process that deepened itself.
   ========================================================================== */

export const uriLoop: CausalGraph = causalGraphSchema.parse({
  id: "uri-feedback-loop",
  title: "Winter Storm Uri",
  scope:
    "Electricity and natural gas coupling in Texas and the South Central United States, February 2021",
  illustrative: false,
  evidenceIds: ["E-010"],
  textAlternative:
    "A closed causal loop of six stages, read clockwise. Extreme cold arrives as an external trigger. Generating units freeze: 1,045 units experienced 4,124 outages, derates or failures to start, removing approximately 61,800 megawatts. Electricity supply falls and more than 4.5 million customers lose power. Those power cuts reach natural gas infrastructure — wellheads, gathering lines, compressor stations and processing plants that themselves run on electricity. Gas production and deliverability fall. Gas-fired generation that was still available loses its fuel. More generation fails, and the loop closes back onto the second stage. The cold is the trigger and appears once. Everything after it is the system acting on itself. A model that treats electricity and gas as separate sectors cannot represent the loop at all, and will therefore under-forecast the depth of the event no matter how accurate its weather input.",
  nodes: [
    {
      id: "uri-cold",
      label: "Extreme cold",
      kind: "event",
      position: { x: 0.5, y: 0.06 },
      state: "8–20 February 2021",
      timestamp: "2021-02-08",
      description:
        "The trigger. It enters the system once and then plays no further causal role.",
      evidenceIds: ["E-010"],
      tags: ["trigger"],
    },
    {
      id: "uri-generation",
      label: "Generation failure",
      kind: "infrastructure",
      position: { x: 0.93, y: 0.31 },
      state: "1,045 units · 4,124 outages, derates or failures to start",
      description: "Freezing of unwinterised equipment across the generation fleet.",
      evidenceIds: ["E-010"],
    },
    {
      id: "uri-electricity",
      label: "Electricity shortage",
      kind: "state",
      position: { x: 0.93, y: 0.72 },
      state: "~61,800 MW lost · >4.5m customers without power",
      evidenceIds: ["E-010"],
    },
    {
      id: "uri-gasinfra",
      label: "Gas infrastructure disruption",
      kind: "infrastructure",
      position: { x: 0.5, y: 0.94 },
      state: "Electrically driven equipment de-energised",
      description:
        "Wellheads, gathering lines, compressors and processing plants that draw power from the grid they supply.",
      evidenceIds: ["E-010"],
      tags: ["coupling"],
    },
    {
      id: "uri-gas",
      label: "Gas shortage",
      kind: "market",
      position: { x: 0.07, y: 0.72 },
      state: "Production and deliverability fall",
      evidenceIds: ["E-010"],
    },
    {
      id: "uri-morefail",
      label: "Further generation failure",
      kind: "outcome",
      position: { x: 0.07, y: 0.31 },
      state: "Fuel-supply-driven, not cold-driven",
      description:
        "The second wave has a different cause from the first. Units that survived the cold failed for want of gas.",
      evidenceIds: ["E-010"],
    },
  ],
  relations: [
    {
      id: "uri-r1",
      sourceIds: ["uri-cold"],
      targetIds: ["uri-generation"],
      label: "freezing",
      mechanism: "Unwinterised equipment fails at temperatures outside its design envelope.",
      polarity: "negative",
      order: 1,
      state: "active",
      evidenceIds: ["E-010"],
    },
    {
      id: "uri-r2",
      sourceIds: ["uri-generation"],
      targetIds: ["uri-electricity"],
      label: "capacity loss",
      mechanism: "Lost dispatchable capacity against rising heating load.",
      polarity: "negative",
      order: 1,
      state: "active",
      evidenceIds: ["E-010"],
    },
    {
      id: "uri-r3",
      sourceIds: ["uri-electricity"],
      targetIds: ["uri-gasinfra"],
      label: "the coupling",
      mechanism:
        "Load shed reaches gas production and processing equipment that runs on grid electricity. This is the edge that turns two sectors into one system.",
      polarity: "negative",
      order: 2,
      state: "active",
      evidenceIds: ["E-010"],
    },
    {
      id: "uri-r4",
      sourceIds: ["uri-gasinfra"],
      targetIds: ["uri-gas"],
      label: "deliverability loss",
      mechanism: "Wellhead freeze-offs and unpowered compression reduce deliverable volumes.",
      polarity: "negative",
      order: 2,
      state: "active",
      evidenceIds: ["E-010"],
    },
    {
      id: "uri-r5",
      sourceIds: ["uri-gas"],
      targetIds: ["uri-morefail"],
      label: "fuel starvation",
      mechanism:
        "Gas-fired units without deliverable fuel cannot run whatever their condition.",
      polarity: "negative",
      order: 3,
      state: "active",
      evidenceIds: ["E-010"],
    },
    {
      id: "uri-r6",
      sourceIds: ["uri-morefail"],
      targetIds: ["uri-generation"],
      label: "reinforcement",
      mechanism:
        "The loop closes. Each turn deepens the shortage that caused it, with no further input from the weather.",
      polarity: "positive",
      order: 3,
      state: "active",
      evidenceIds: ["E-010"],
      alternatives: [
        "Market and reserve-margin design decisions taken years earlier shaped how much unwinterised capacity was exposed in the first place.",
        "Interconnection limits constrained the import of out-of-region generation, deepening the shortage independently of the loop.",
      ],
    },
  ],
});
