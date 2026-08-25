import { scenarioSchema, type Scenario } from "./schema";

/* ============================================================================
   THE 3 A.M. PROBLEM
   ----------------------------------------------------------------------------
   Six decision scopes. Each carries the question the role actually loses sleep
   over, the assumption that would have to break for it to matter, and a three-step
   causal trace.

   Every trace is `illustrative: true`. These are mechanisms a scoped model would
   be built to reason about — not findings, not forecasts, and not a claim that
   this particular path is live for any particular organisation.
   ========================================================================== */

export const scenarios: Scenario[] = [
  {
    id: "industry",
    label: "Industry",
    role: "Automotive / industrial COO",
    question:
      "Which tiny component somewhere in my Tier-3 supply chain can shut down a multi-billion-dollar production line next month?",
    assumption:
      "That the components you cannot name are commodity inputs with substitutable sources.",
    illustrative: true,
    evidenceIds: ["E-004", "E-005", "E-006", "E-007"],
    trace: [
      {
        order: 1,
        label: "Upstream licensing or capacity event",
        mechanism:
          "A control action or single-site failure two or three tiers below your direct suppliers changes availability without changing any price you monitor.",
      },
      {
        order: 2,
        label: "Allocation at the tier you cannot see",
        mechanism:
          "Scarce supply is allocated by contract and relationship. Your position in that queue was set long before the constraint appeared.",
      },
      {
        order: 3,
        label: "Line stoppage on a part worth cents",
        mechanism:
          "A line stops for the cheapest missing item as readily as for the most expensive one. Bill-of-materials value does not predict stoppage risk.",
      },
    ],
  },
  {
    id: "energy",
    label: "Energy",
    role: "Energy trader / grid operator / utility CRO",
    question:
      "What combination of weather, fuel availability, grid conditions, infrastructure and geopolitics could invalidate tomorrow's forecast?",
    assumption: "That fuel supply is independent of the electricity system it supplies.",
    illustrative: true,
    evidenceIds: ["E-010", "E-015"],
    trace: [
      {
        order: 1,
        label: "Simultaneous demand peak and supply derate",
        mechanism:
          "The conditions that raise load are frequently the same conditions that reduce available capacity. The correlation is physical, not statistical.",
      },
      {
        order: 2,
        label: "Fuel infrastructure loses its own power supply",
        mechanism:
          "Production, compression and processing draw from the grid they feed. Load shed becomes fuel loss, which becomes further generation loss.",
      },
      {
        order: 3,
        label: "Reinforcement outruns the response window",
        mechanism:
          "Once the loop is turning, each cycle shortens the time available to intervene in the next.",
      },
    ],
  },
  {
    id: "insurance",
    label: "Insurance",
    role: "Insurance CRO / MGA / reinsurer",
    question:
      "Where is risk accumulating inside my book that my historical loss model has not learned yet?",
    assumption:
      "That policies written under different perils, in different lines, remain independent in a loss year.",
    illustrative: true,
    evidenceIds: ["E-011"],
    trace: [
      {
        order: 1,
        label: "Exposure grows where the record is thin",
        mechanism:
          "Value is built in places the historical loss record barely covers. The hazard need not change for the loss to.",
      },
      {
        order: 2,
        label: "Shared infrastructure correlates separate policies",
        mechanism:
          "One failed utility interrupts many insureds simultaneously. The correlation was always there; only the trigger was missing.",
      },
      {
        order: 3,
        label: "Legal and regulatory conditions set severity",
        mechanism:
          "The same claim resolves differently under different regimes. That variable sits outside every peril model.",
      },
    ],
  },
  {
    id: "supply-chain",
    label: "Supply chain",
    role: "Supply-chain / procurement executive",
    question:
      "If a strategic supplier or major country changes policy tomorrow, what breaks first?",
    assumption: "That diversified suppliers imply diversified dependency.",
    illustrative: true,
    evidenceIds: ["E-004", "E-016", "E-017"],
    trace: [
      {
        order: 1,
        label: "Policy changes the cost of a route, not its existence",
        mechanism:
          "Tariffs, licensing and screening rarely close a path outright. They make it slower and more expensive, which is harder to detect and just as binding.",
      },
      {
        order: 2,
        label: "Qualified alternatives are fewer than contracted ones",
        mechanism:
          "Several suppliers of record can resolve to one qualified process, one certification, or one facility.",
      },
      {
        order: 3,
        label: "Requalification is measured in quarters",
        mechanism:
          "The substitution that exists on paper takes longer than the disruption it was meant to absorb.",
      },
    ],
  },
  {
    id: "portfolio",
    label: "Portfolio",
    role: "Portfolio manager / bank CRO",
    question:
      "Which assumption connecting my assets stops being true under the next geopolitical regime?",
    assumption:
      "That the correlation structure estimated from history survives a change in what generates it.",
    illustrative: true,
    evidenceIds: ["E-001", "E-002", "E-008"],
    trace: [
      {
        order: 1,
        label: "A policy action re-prices a shared input",
        mechanism:
          "Energy, freight, a critical material or a funding channel that sits behind many positions at once.",
      },
      {
        order: 2,
        label: "Diversification collapses toward the shared factor",
        mechanism:
          "Holdings that diversified across sectors need not diversify across inputs. The hedge fails precisely when it is needed.",
      },
      {
        order: 3,
        label: "The estimated correlation matrix describes the old regime",
        mechanism:
          "Risk systems calibrated on the prior structure understate joint loss exactly during the transition they were meant to survive.",
      },
    ],
  },
  {
    id: "government",
    label: "Government",
    role: "Government / strategic decision-maker",
    question:
      "If we impose this sanction, tariff or export restriction, what happens three causal steps later?",
    assumption: "That the first-order effect is the effect.",
    illustrative: true,
    evidenceIds: ["E-004", "E-006", "E-016"],
    trace: [
      {
        order: 1,
        label: "The intended target is constrained",
        mechanism: "The first-order effect is the one the measure was designed to produce.",
      },
      {
        order: 2,
        label: "Counterparties reroute and substitute",
        mechanism:
          "Adaptation begins immediately. Trade re-forms around the constraint, often through third parties.",
      },
      {
        order: 3,
        label: "Domestic industries meet the return path",
        mechanism:
          "Retaliation, re-pricing and reciprocal control land on sectors that were not part of the original decision — and were not modelled when it was taken.",
      },
    ],
  },
].map((scenario) => scenarioSchema.parse(scenario));

export const scenarioById = new Map(scenarios.map((scenario) => [scenario.id, scenario]));
