import { futureBranchSchema, type FutureBranch } from "./schema";

/* ============================================================================
   POSSIBLE FUTURES
   ----------------------------------------------------------------------------
   Four branches from a present state.

   Note what is absent: probabilities. The schema carries `probability` and
   `calibrationStatus` fields so that calibrated model output can be attached
   without a migration — and every one of them is undefined here, because no model
   has produced one. A number in this position that was not produced by a model
   would be decoration pretending to be evidence.
   ========================================================================== */

export const futureBranches: FutureBranch[] = [
  {
    id: "managed-fragmentation",
    label: "Managed fragmentation",
    summary:
      "Blocs form and harden, but carve-outs, exemptions and third-country routing keep most trade flowing at higher cost.",
    drivers: [
      "Licensing regimes used as leverage rather than as embargo",
      "Third-country intermediation absorbing redirected flows",
      "Industrial policy funding parallel capacity slowly",
    ],
    assumptions: [
      "Escalation stays reciprocal and bounded",
      "Substitute capacity arrives faster than restrictions tighten",
    ],
    illustrative: true,
  },
  {
    id: "chokepoint-binding",
    label: "Chokepoint binding",
    summary:
      "One concentrated input is restricted for long enough that downstream requalification, not inventory, becomes the limiting factor.",
    drivers: [
      "Processing concentration persisting past inventory cover",
      "Requalification cycles measured in quarters",
      "Simultaneous demand from several sectors on one input",
    ],
    assumptions: [
      "No large substitute capacity is commissioned inside the window",
      "Stockpiles are not released or are not sufficient",
    ],
    illustrative: true,
  },
  {
    id: "physical-coupling",
    label: "Physical coupling event",
    summary:
      "An extreme weather or infrastructure event propagates between coupled physical systems faster than operators can intervene.",
    drivers: [
      "Electricity and fuel systems that depend on each other",
      "Load and supply degradation driven by the same condition",
      "Response windows shortening with each reinforcement cycle",
    ],
    assumptions: [
      "Winterisation and interconnection remain as built",
      "Coupled dependencies stay unmodelled across sector boundaries",
    ],
    illustrative: true,
  },
  {
    id: "regime-relearning",
    label: "Regime relearning",
    summary:
      "Institutions re-specify their models around the new structure, and forecast accuracy recovers — at the cost of one full cycle of error.",
    drivers: [
      "Published post-mortems of forecast failure",
      "Explicit structural variables entering standard models",
      "Continuous rather than periodic re-estimation",
    ],
    assumptions: [
      "The new structure holds still long enough to be learned",
      "Institutional revision moves faster than the next change",
    ],
    illustrative: true,
  },
].map((branch) => futureBranchSchema.parse(branch));
