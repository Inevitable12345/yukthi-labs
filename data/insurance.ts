import { causalGraphSchema, type CausalGraph } from "./schema";

/* ============================================================================
   INSURANCE RISK ACCUMULATION
   ----------------------------------------------------------------------------
   Structure: illustrative. This is a mechanism, not a book of business.

   No portfolio data, no loss numbers, no attachment points, no exposure figures
   are shown or implied anywhere on this site. The single real number here is the
   published market-level figure in E-011.
   ========================================================================== */

export const insuranceAccumulation: CausalGraph = causalGraphSchema.parse({
  id: "insurance-accumulation",
  title: "Accumulation as an emerging topology",
  scope: "How correlated loss forms across a portfolio that was written as if uncorrelated",
  illustrative: true,
  evidenceIds: ["E-011"],
  textAlternative:
    "An illustrative chain of six stages showing how loss accumulates through routes a peril-based model does not price. A weather event causes infrastructure failure. Infrastructure failure causes business interruption across firms that share that infrastructure but were underwritten separately. Business interruption produces liability claims. Liability claims produce litigation, whose cost and duration depend on legal and regulatory conditions rather than on the original hazard. Litigation aggregates into reinsurance accumulation, where exposures written as independent turn out to share a single root cause. A seventh node sits alongside: regulatory and legal change, which modifies the litigation stage without appearing anywhere in the hazard model. The market-level context is Swiss Re Institute's report of 137 billion US dollars of insured natural catastrophe losses in 2024 against 318 billion dollars of economic losses, leaving 57 percent uninsured. This diagram is illustrative and contains no portfolio data of any kind.",
  nodes: [
    {
      id: "in-weather",
      label: "Weather event",
      kind: "event",
      position: { x: 0.08, y: 0.3 },
      illustrative: true,
      description: "Modelled well, and usually the only stage that is.",
    },
    {
      id: "in-infra",
      label: "Infrastructure failure",
      kind: "infrastructure",
      position: { x: 0.26, y: 0.3 },
      illustrative: true,
      description: "Power, water, telecoms, transport — shared by policies written separately.",
    },
    {
      id: "in-bi",
      label: "Business interruption",
      kind: "outcome",
      position: { x: 0.44, y: 0.3 },
      illustrative: true,
      description:
        "Where a physical event becomes a financial one, often without physical damage.",
    },
    {
      id: "in-liability",
      label: "Liability claims",
      kind: "risk",
      position: { x: 0.62, y: 0.3 },
      illustrative: true,
    },
    {
      id: "in-litigation",
      label: "Litigation",
      kind: "mechanism",
      position: { x: 0.8, y: 0.3 },
      illustrative: true,
      description:
        "Duration and severity here are set by legal conditions, not by the hazard that started the chain.",
    },
    {
      id: "in-reinsurance",
      label: "Reinsurance accumulation",
      kind: "state",
      position: { x: 0.95, y: 0.3 },
      illustrative: true,
      description:
        "Independently written exposures discovered to share one root cause, after the fact.",
    },
    {
      id: "in-regulation",
      label: "Legal + regulatory change",
      kind: "policy",
      position: { x: 0.8, y: 0.82 },
      illustrative: true,
      description:
        "Enters the chain at litigation. Appears in no peril model, and moves the outcome anyway.",
    },
    {
      id: "in-exposure",
      label: "Exposure growth",
      kind: "state",
      position: { x: 0.26, y: 0.82 },
      illustrative: true,
      description:
        "Where value has been built since the historical record was assembled. The hazard need not change for the loss to.",
      evidenceIds: ["E-011"],
    },
  ],
  relations: [
    {
      id: "in-r1",
      sourceIds: ["in-weather", "in-exposure"],
      targetIds: ["in-infra"],
      label: "hazard × exposure",
      mechanism:
        "Loss is the product of hazard and what has been built in its path. Only one of the two is in the catastrophe model.",
      polarity: "positive",
      order: 1,
      state: "active",
      illustrative: true,
      evidenceIds: ["E-011"],
    },
    {
      id: "in-r2",
      sourceIds: ["in-infra"],
      targetIds: ["in-bi"],
      label: "shared dependency",
      mechanism:
        "One failed utility interrupts many insureds at once, correlating policies that were priced as independent.",
      polarity: "positive",
      order: 2,
      state: "active",
      illustrative: true,
    },
    {
      id: "in-r3",
      sourceIds: ["in-bi"],
      targetIds: ["in-liability"],
      label: "interruption → liability",
      mechanism:
        "Contractual failure downstream of interruption converts operational loss into claims.",
      polarity: "positive",
      order: 2,
      state: "active",
      illustrative: true,
    },
    {
      id: "in-r4",
      sourceIds: ["in-liability", "in-regulation"],
      targetIds: ["in-litigation"],
      label: "claims × legal regime",
      mechanism:
        "The same claim behaves differently under different legal conditions. The regime is a causal variable, not context.",
      polarity: "mixed",
      order: 3,
      state: "contested",
      illustrative: true,
      alternatives: [
        "Rising claim severity may reflect economic inflation in repair and replacement cost rather than a change in legal regime.",
      ],
    },
    {
      id: "in-r5",
      sourceIds: ["in-litigation"],
      targetIds: ["in-reinsurance"],
      label: "aggregation",
      mechanism:
        "Correlation appears at the reinsurance layer, which is the last place it can be observed and the worst place to discover it.",
      polarity: "positive",
      order: 3,
      state: "active",
      illustrative: true,
    },
  ],
});
