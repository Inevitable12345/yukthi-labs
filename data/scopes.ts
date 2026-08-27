import { z } from "zod";

/* ============================================================================
   DECISION SCOPES (§16, §19)
   ----------------------------------------------------------------------------
   "Scoped" is the most important word in the technical bet and the easiest to
   skip past. It is the claim that Yukthi does *not* model the whole planet.

   A consequential decision defines a scope: which entities matter, which
   relations are worth representing, and how deep the causal trace needs to run
   before the answer stops changing. The same world reorganises around each one.

   Every trace here is an illustrative mechanism. None is a finding, a forecast,
   or a claim that this path is live for any particular organisation.
   ========================================================================== */

export const decisionScopeSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  /** The role whose 3 a.m. question this is. */
  role: z.string().min(1),
  /** The question, in the words the person would actually use. */
  question: z.string().min(1),
  /** What is assumed true today, and would have to break for this to matter. */
  assumption: z.string().min(1),
  /** The entities this scope pulls into the model. */
  entities: z.array(z.string()).min(3),
  /** What the model watches continuously for this scope. */
  monitors: z.array(z.string()).min(2),
  trace: z
    .array(
      z.object({
        order: z.union([z.literal(1), z.literal(2), z.literal(3)]),
        label: z.string().min(1),
        mechanism: z.string().min(1),
      }),
    )
    .length(3),
  evidenceIds: z.array(z.string()).optional(),
});

export type DecisionScope = z.infer<typeof decisionScopeSchema>;

const scopes: DecisionScope[] = [
  {
    id: "industrial",
    label: "Industrial",
    role: "Automotive or industrial COO",
    question:
      "Which tiny Tier-3 component can shut down a multi-billion-dollar production line?",
    assumption:
      "That the components you cannot name are commodity inputs with substitutable sources.",
    entities: [
      "Tier-1 to Tier-N suppliers",
      "Bill of materials",
      "Qualification status",
      "Plant inventory",
      "Upstream materials",
      "Logistics routes",
    ],
    monitors: [
      "Export licensing and customs actions on named materials",
      "Single-site concentration in tiers below direct suppliers",
      "Qualification lead times for alternate parts",
    ],
    evidenceIds: ["E-005", "E-006", "E-007", "E-009"],
    trace: [
      {
        order: 1,
        label: "Upstream licensing or capacity event",
        mechanism:
          "A control action or single-site failure two or three tiers below your direct suppliers changes availability without changing any price you currently monitor.",
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
          "A line stops for the cheapest missing item as readily as the most expensive one. Bill-of-materials value does not predict stoppage risk; position in the causal graph does.",
      },
    ],
  },
  {
    id: "energy",
    label: "Energy",
    role: "Grid operator, utility CRO or energy trader",
    question:
      "What combination of weather, fuel, grid conditions and geopolitics can invalidate tomorrow's forecast?",
    assumption: "That fuel supply is independent of the electricity system it supplies.",
    entities: [
      "Generation fleet and fuel type",
      "Gas production and processing",
      "Transmission constraints",
      "Weather-driven demand",
      "Interconnection and imports",
      "Critical-load designations",
    ],
    monitors: [
      "Joint weather and fuel-availability conditions, not each separately",
      "Equipment winterisation and derate history",
      "Electricity dependence of fuel infrastructure",
    ],
    evidenceIds: ["E-012", "E-013"],
    trace: [
      {
        order: 1,
        label: "Simultaneous demand peak and supply derate",
        mechanism:
          "The same weather that raises heating load removes generating capacity. The two are not independent draws, and modelling them as independent understates the tail badly.",
      },
      {
        order: 2,
        label: "Fuel system loses the power it supplies",
        mechanism:
          "Load shedding removes electricity from gas production and processing, cutting fuel to the generation that would end the shortage.",
      },
      {
        order: 3,
        label: "The loop reinforces",
        mechanism:
          "Each turn deepens the shortfall rather than damping it. Recovery requires breaking the loop, not waiting for the trigger to pass.",
      },
    ],
  },
  {
    id: "insurance",
    label: "Insurance",
    role: "Chief risk officer or head of accumulation",
    question: "Where is risk accumulating that the historical loss model has not learned?",
    assumption:
      "That the loss distribution fitted on past events still describes the exposure you hold now.",
    entities: [
      "Exposure by geography and peril",
      "Secondary-peril frequency",
      "Reinsurance structure",
      "Correlation assumptions",
      "Built exposure growth",
      "Protection gap",
    ],
    monitors: [
      "Where exposure is being built relative to hazard, not hazard alone",
      "Secondary perils aggregating below single-event thresholds",
      "Correlations that were historically low and are now structural",
    ],
    evidenceIds: ["E-014"],
    trace: [
      {
        order: 1,
        label: "Exposure migrates faster than the model updates",
        mechanism:
          "New building concentrates in areas whose hazard profile the loss history under-represents. The exposure changes shape faster than the loss record accumulates.",
      },
      {
        order: 2,
        label: "Secondary perils aggregate",
        mechanism:
          "Severe convective storms, floods and wildfires each fall below the threshold that triggers scrutiny, and together drive the loss trend.",
      },
      {
        order: 3,
        label: "Accumulation appears in a dimension nobody indexed",
        mechanism:
          "Losses correlate through a shared driver the portfolio was never sorted by — so the diversification on the books is not diversification in the world.",
      },
    ],
  },
  {
    id: "supply-chain",
    label: "Supply chain",
    role: "Chief procurement or supply-chain officer",
    question: "If a strategic supplier or country changes policy tomorrow, what breaks first?",
    assumption:
      "That supplier diversity on paper corresponds to independence in the physical network.",
    entities: [
      "Supplier network by tier",
      "Country and jurisdiction exposure",
      "Shared sub-suppliers",
      "Logistics chokepoints",
      "Inventory buffers",
      "Contractual priority",
    ],
    monitors: [
      "Shared upstream nodes behind nominally independent suppliers",
      "Policy and licensing changes in supplier jurisdictions",
      "Route concentration through single physical chokepoints",
    ],
    evidenceIds: ["E-005", "E-008", "E-003"],
    trace: [
      {
        order: 1,
        label: "Policy changes in one jurisdiction",
        mechanism:
          "A licensing or customs decision alters throughput without altering any commercial term you track.",
      },
      {
        order: 2,
        label: "Diversified suppliers turn out to share a parent node",
        mechanism:
          "Three independent suppliers resolve to one refiner, one port or one qualified process. Diversity at Tier 1 is not independence upstream.",
      },
      {
        order: 3,
        label: "Buffers deplete in a known order",
        mechanism:
          "The sequence in which inventory runs out is knowable in advance. That ordering is the intervention window, and it is usually discovered after it closes.",
      },
    ],
  },
  {
    id: "portfolio",
    label: "Portfolio / bank",
    role: "Portfolio manager or bank risk officer",
    question: "Which assumption connecting my assets stops being true under the next regime?",
    assumption:
      "That the correlation structure estimated from history is a property of the assets rather than of the regime.",
    entities: [
      "Positions and sector exposure",
      "Estimated correlations",
      "Macro regime indicators",
      "Counterparty linkages",
      "Collateral and liquidity",
      "Policy sensitivity",
    ],
    monitors: [
      "Whether the relationships the model relies on are still transmitting",
      "Shared physical or policy dependencies beneath separate sectors",
      "Forecast errors clustering in one direction",
    ],
    evidenceIds: ["E-010", "E-011", "E-001"],
    trace: [
      {
        order: 1,
        label: "The data-generating structure changes",
        mechanism:
          "A relationship the model treats as stable is a feature of the previous regime. Nothing in the price history announces this.",
      },
      {
        order: 2,
        label: "Diversification stops working when it is needed",
        mechanism:
          "Assets held as unrelated turn out to share a dependency that only becomes visible under stress — which is precisely when it matters.",
      },
      {
        order: 3,
        label: "The error is systematic, not random",
        mechanism:
          "Forecast errors cluster in one direction, as the ECB's own review of its 2021–22 projections documents. Systematic error is a structural signal, not noise.",
      },
    ],
  },
  {
    id: "government",
    label: "Government",
    role: "Policy maker or national security analyst",
    question: "If we impose this policy, what happens three causal steps later?",
    assumption: "That the policy's effect is largely confined to its intended target.",
    entities: [
      "Policy instruments",
      "Affected industries",
      "Trading partners and blocs",
      "Strategic dependencies",
      "Retaliation options",
      "Domestic capacity",
    ],
    monitors: [
      "Second- and third-order effects on domestic industry",
      "Counterparty capability to respond in an adjacent domain",
      "Whether the constrained capability is being rebuilt elsewhere",
    ],
    evidenceIds: ["E-001", "E-002", "E-005", "E-007"],
    trace: [
      {
        order: 1,
        label: "The instrument achieves its stated effect",
        mechanism:
          "The targeted flow is restricted. This step is usually modelled well, because it is the one the policy was designed around.",
      },
      {
        order: 2,
        label: "Adjustment happens in an adjacent system",
        mechanism:
          "Affected parties reroute, substitute or retaliate in a domain the original analysis did not include, because it belonged to a different department's model.",
      },
      {
        order: 3,
        label: "The response returns through the domestic economy",
        mechanism:
          "Third-order effects land on domestic industry, allied relationships or the same strategic capability the policy was meant to protect.",
      },
    ],
  },
];

export const decisionScopes: DecisionScope[] = scopes.map((scope) =>
  decisionScopeSchema.parse(scope),
);

export function getScope(id: string): DecisionScope | undefined {
  return decisionScopes.find((scope) => scope.id === id);
}
