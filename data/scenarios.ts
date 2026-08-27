import { z } from "zod";

/* ============================================================================
   ILLUSTRATIVE SCENARIOS (§18)
   ----------------------------------------------------------------------------
   The "What breaks next?" demo.

   Every one of these is an ILLUSTRATIVE SCENARIO and is labelled as such
   wherever it appears. Specifically, and without exception:

     · no probability values. Not one. A number here would be fabricated, and a
       fabricated probability is worse than no probability because it invites
       exactly the reliance it cannot support;
     · no claim that any of these paths is currently active;
     · no named companies, no named counterparties, no invented incidents;
     · the mechanisms are real and sourced. The *arrangement* is explanatory.

   What this demonstrates is the shape of an answer a scoped causal model would
   produce — which is a claim about architecture, not about output.
   ========================================================================== */

export const scenarioSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  /** The condition that changes. */
  change: z.string().min(1),
  scopeId: z.string().min(1),
  propagation: z.array(z.string()).min(2),
  affected: z.array(z.string()).min(3),
  secondOrder: z.array(z.string()).min(2),
  thirdOrder: z.array(z.string()).min(2),
  monitor: z.array(z.string()).min(2),
  interventions: z.array(z.string()).min(2),
  evidenceIds: z.array(z.string()).min(1),
});

export type Scenario = z.infer<typeof scenarioSchema>;

const scenarios: Scenario[] = [
  {
    id: "rare-earth",
    label: "Rare-earth export restriction",
    change:
      "Licensing throughput for medium and heavy rare earths and finished magnets tightens further.",
    scopeId: "industrial",
    evidenceIds: ["E-005", "E-006", "E-007", "E-008"],
    propagation: [
      "Refining and separation capacity, where roughly 90% of global capability sits",
      "Magnet production, the form in which the constraint reaches manufacturers",
      "Tier-2 and Tier-3 suppliers, below the level most buyers monitor",
      "Component factories producing motors, actuators and sensors",
    ],
    affected: [
      "Automotive assembly",
      "Defence systems with long qualification cycles",
      "Wind generation and grid equipment",
      "Semiconductor tooling",
      "Robotics and industrial automation",
    ],
    secondOrder: [
      "Allocation shifts toward buyers with contractual priority, moving the shortage rather than resolving it",
      "Substitution programmes start, but qualification time — not engineering time — sets the pace",
      "Inventory is drawn down in an order determined by bill-of-materials position, not by part value",
    ],
    thirdOrder: [
      "Production schedules move, and the revenue effect lands one or two quarters after the licensing change",
      "Capital reallocates toward non-concentrated processing capacity, on a build timeline of years",
      "The constrained capability becomes an explicit industrial-policy objective in importing economies",
    ],
    monitor: [
      "Licence approval throughput, not headline policy announcements",
      "Which nominally independent suppliers resolve to the same refiner",
      "Qualification status of alternate parts, before it is needed",
      "Inventory depletion order across the bill of materials",
    ],
    interventions: [
      "Qualify alternates ahead of constraint, while the queue is short",
      "Map suppliers to shared upstream nodes rather than counting supplier names",
      "Hold buffer specifically at the parts whose graph position — not price — makes them critical",
      "Contract for licence-contingent priority rather than for volume alone",
    ],
  },
  {
    id: "grid-event",
    label: "Extreme-weather grid event",
    change:
      "A multi-day extreme cold event coincides with peak heating demand across an interconnected region.",
    scopeId: "energy",
    evidenceIds: ["E-012", "E-014"],
    propagation: [
      "Generating units derate or fail as unwinterised equipment freezes",
      "Reserve margin erodes while demand climbs",
      "Load shedding begins",
      "Gas production and processing sites lose the electricity they depend on",
    ],
    affected: [
      "Electricity customers, including critical facilities",
      "Gas-fired generation losing fuel supply",
      "Water and telecommunications systems dependent on power",
      "Industrial load with no ride-through capability",
      "Wholesale power and gas markets",
    ],
    secondOrder: [
      "The outage removes fuel from the generation that would have ended it — the loop reinforces rather than damps",
      "Restoration is slowed by the same conditions that caused the failure",
      "Market prices reach levels that create counterparty exposure independent of the physical event",
    ],
    thirdOrder: [
      "Insured and uninsured losses diverge sharply, since much of the damage falls outside standard cover",
      "Winterisation and critical-load designation become regulatory requirements",
      "Capacity and reserve market design is revisited across neighbouring jurisdictions",
    ],
    monitor: [
      "Joint distribution of temperature and fuel availability, never each alone",
      "Which gas infrastructure sits on non-critical electrical load",
      "Equipment winterisation status against the temperatures actually forecast",
      "Correlation between demand peak and supply derate, not their separate levels",
    ],
    interventions: [
      "Designate fuel infrastructure as critical load before the event, not during it",
      "Winterise against observed extremes rather than historical design conditions",
      "Pre-position restoration crews on the joint forecast",
      "Contract for firm fuel with physical, not financial, delivery assurance",
    ],
  },
  {
    id: "semiconductor",
    label: "Semiconductor capacity disruption",
    change:
      "A concentrated node in fabrication, assembly or test goes offline for an extended period.",
    scopeId: "supply-chain",
    evidenceIds: ["E-009"],
    propagation: [
      "Wafer or package allocation is re-cut across all customers of that node",
      "Customers without contractual priority move down the queue",
      "Lead times extend well past inventory coverage",
      "Downstream assembly halts on specific part numbers",
    ],
    affected: [
      "Vehicle production lines",
      "Industrial and consumer electronics",
      "Medical and aerospace devices with long qualification cycles",
      "Distributors holding allocation risk",
      "Any product whose bill of materials includes a single-sourced part",
    ],
    secondOrder: [
      "Double-ordering distorts the demand signal, and the distortion outlasts the disruption",
      "Redesign to alternate parts begins, bounded by qualification rather than by engineering",
      "Spot-market pricing decouples from contract pricing for the affected parts",
    ],
    thirdOrder: [
      "Loss estimates are revised upward as additional pathways become visible — the 2021 shortage's estimate nearly doubled within a single quarter",
      "Inventory policy shifts from just-in-time toward buffered, changing working capital structurally",
      "Fabrication capacity becomes a matter of industrial policy rather than of procurement",
    ],
    monitor: [
      "Single-site concentration for each critical part number",
      "Qualification status of alternates, maintained before it is needed",
      "Order-book distortion from double-ordering",
      "Whether your own loss estimate is being revised, and in which direction",
    ],
    interventions: [
      "Maintain qualified alternates for parts whose graph position makes them critical",
      "Buffer by causal position rather than by unit cost",
      "Contract for allocation priority explicitly",
      "Treat a forecast that must be revised as evidence about the model, not only about the world",
    ],
  },
  {
    id: "tariff",
    label: "Strategic tariff escalation",
    change:
      "Tariffs are imposed on a strategically significant category, and reciprocal measures follow.",
    scopeId: "government",
    evidenceIds: ["E-001", "E-002", "E-003"],
    propagation: [
      "Landed cost rises for the targeted category",
      "Trade reroutes through third countries and through reclassification",
      "Reciprocal measures land on an adjacent sector, not the originating one",
      "Investment decisions reprice against a changed expected policy path",
    ],
    affected: [
      "Importers and their downstream customers",
      "Exporters in the sector chosen for reciprocity",
      "Logistics networks absorbing rerouted volume",
      "Domestic producers of substitutes",
      "Consumer prices in the affected categories",
    ],
    secondOrder: [
      "Rerouting recovers part of the flow while raising system-wide cost — the trade continues, less efficiently",
      "Reciprocity lands on a sector chosen for leverage rather than for symmetry",
      "Firms hedge by holding more inventory and more supplier relationships than efficiency alone would justify",
    ],
    thirdOrder: [
      "Trade reorganises along geopolitical lines: growth between blocs slows relative to growth within them",
      "Fragmentation costs accrue as foregone output rather than as a visible event — IMF staff put the long-run range at roughly 0.2% to nearly 7% of global GDP depending on depth",
      "The measure becomes structural, and the counterfactual becomes unobservable",
    ],
    monitor: [
      "Third-country flows that suggest rerouting rather than substitution",
      "Which adjacent sector holds the most reciprocal leverage",
      "Whether trade within blocs is growing faster than trade between them",
      "Domestic capacity actually built, against capacity announced",
    ],
    interventions: [
      "Model the reciprocal step before the first one is taken, in the department that owns the exposed sector",
      "Identify the adjacent sectors that carry retaliation exposure",
      "Sequence measures against domestic capacity that exists rather than capacity that is planned",
      "Set an explicit review point, since the counterfactual stops being observable quickly",
    ],
  },
];

export const demoScenarios: Scenario[] = scenarios.map((scenario) =>
  scenarioSchema.parse(scenario),
);
