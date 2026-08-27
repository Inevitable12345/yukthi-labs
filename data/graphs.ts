import { defineGraph } from "./schema";

/* ============================================================================
   THE SIGNATURE CAUSAL CASES
   ----------------------------------------------------------------------------
   Five authored graphs, each carrying one act of the argument.

   Structure is authored rather than force-simulated: a causal argument reads in
   a particular order, and a physics layout would scramble that order on every
   load. Positions are normalised 0–1.

   Every graph declares its epistemic class. Where a graph is `illustrative-
   scenario`, the *structure* is explanatory — the mechanisms are real and
   sourced, but the particular arrangement is drawn to explain, not observed.
   ========================================================================== */

/* --- ACT I — THE STABLE LATTICE --------------------------------------- */

export const stableLattice = defineGraph({
  id: "stable-lattice",
  title: "The prior regime: short, repeatable paths",
  scope: "The global trading system as it was assumed to work",
  claimClass: "yukthi-interpretation",
  textAlternative:
    "A regular lattice of six nodes — demand, production, shipping, inventory, price and investment — connected by short, direct, two-way relationships. Every path between any two parts of the system is one or two steps long, and every relationship is marked active. This is the structure under which extrapolation from history is the correct method, not a lazy one.",
  nodes: [
    {
      id: "demand",
      label: "Demand",
      kind: "market",
      position: { x: 0.12, y: 0.28 },
      claimClass: "yukthi-interpretation",
      description: "Stable and forecastable from its own history.",
    },
    {
      id: "production",
      label: "Production",
      kind: "infrastructure",
      position: { x: 0.36, y: 0.16 },
      claimClass: "yukthi-interpretation",
      description: "Capacity responds to price with a known lag.",
    },
    {
      id: "shipping",
      label: "Shipping",
      kind: "infrastructure",
      position: { x: 0.62, y: 0.24 },
      claimClass: "yukthi-interpretation",
      description: "Cost and duration vary within a narrow band.",
    },
    {
      id: "inventory",
      label: "Inventory",
      kind: "state",
      position: { x: 0.84, y: 0.44 },
      labelSide: "right",
      claimClass: "yukthi-interpretation",
      description: "Held thin, because replenishment is dependable.",
    },
    {
      id: "price",
      label: "Price",
      kind: "market",
      position: { x: 0.55, y: 0.66 },
      claimClass: "yukthi-interpretation",
      description: "Clears the system. Carries most of the information anyone needs.",
    },
    {
      id: "investment",
      label: "Investment",
      kind: "outcome",
      position: { x: 0.22, y: 0.72 },
      claimClass: "yukthi-interpretation",
      description: "Committed years ahead against an extrapolated demand curve.",
    },
  ],
  relations: [
    {
      id: "r1",
      sourceIds: ["demand"],
      targetIds: ["production"],
      mechanism: "Orders pull output. The response lag is stable enough to plan against.",
      polarity: "positive",
      claimClass: "yukthi-interpretation",
    },
    {
      id: "r2",
      sourceIds: ["production"],
      targetIds: ["shipping"],
      mechanism: "Output becomes freight at a predictable ratio.",
      polarity: "positive",
      claimClass: "yukthi-interpretation",
    },
    {
      id: "r3",
      sourceIds: ["shipping"],
      targetIds: ["inventory"],
      mechanism: "Arrivals replenish stock on a schedule reliable enough to run lean.",
      polarity: "positive",
      claimClass: "yukthi-interpretation",
    },
    {
      id: "r4",
      sourceIds: ["inventory"],
      targetIds: ["price"],
      mechanism: "Stock levels clear into price without administrative intervention.",
      polarity: "negative",
      claimClass: "yukthi-interpretation",
    },
    {
      id: "r5",
      sourceIds: ["price"],
      targetIds: ["demand"],
      mechanism: "Price rations demand. The loop closes, and it damps.",
      polarity: "negative",
      claimClass: "yukthi-interpretation",
    },
    {
      id: "r6",
      sourceIds: ["price"],
      targetIds: ["investment"],
      mechanism: "Sustained margin justifies new capacity.",
      polarity: "positive",
      claimClass: "yukthi-interpretation",
    },
    {
      id: "r7",
      sourceIds: ["investment"],
      targetIds: ["production"],
      mechanism: "Capacity arrives and raises output — years later, but reliably.",
      polarity: "positive",
      claimClass: "yukthi-interpretation",
    },
  ],
});

/* --- ACT III — THE RARE-EARTH CHOKEPOINT ------------------------------- */

export const rareEarthCascade = defineGraph({
  id: "rare-earth-cascade",
  title: "One licensing decision, ten downstream systems",
  scope: "Rare-earth export licensing and the activity that depends on it",
  claimClass: "source-claim",
  evidenceIds: ["E-005", "E-006", "E-007", "E-008"],
  textAlternative:
    "A cascade running from a single policy node — export licensing on seven medium and heavy rare earth elements, introduced in April 2025 — through refining concentration and magnet availability, into tier-N suppliers and component factories, and from there fanning into automotive, defence, energy, semiconductors and AI infrastructure. The upstream node is one administrative decision. The downstream base is, on the IEA's estimate, up to 6.5 trillion US dollars of annual activity outside China. The asymmetry between the two is the entire point.",
  nodes: [
    {
      id: "policy",
      label: "Export licensing",
      kind: "policy",
      position: { x: 0.5, y: 0.07 },
      evidenceIds: ["E-005"],
      claimClass: "observed-fact",
      state: "Active since 4 April 2025",
      description:
        "Licensing requirements on seven medium and heavy rare earth elements and certain permanent magnets. Not an embargo — a rate limiter.",
    },
    {
      id: "refining",
      label: "Refining concentration",
      kind: "infrastructure",
      position: { x: 0.5, y: 0.22 },
      evidenceIds: ["E-006"],
      claimClass: "observed-fact",
      state: "≈90% of global capacity",
      description:
        "The concentration is at the refining stage, not the mine. Mined supply is far more distributed than processing.",
    },
    {
      id: "magnets",
      label: "Magnet availability",
      kind: "resource",
      position: { x: 0.5, y: 0.37 },
      evidenceIds: ["E-008"],
      claimClass: "source-claim",
      state: "Rate-limited by licence throughput",
      description:
        "Permanent magnets are the form in which the constraint reaches manufacturers.",
    },
    {
      id: "tiern",
      label: "Tier-N suppliers",
      kind: "actor",
      position: { x: 0.3, y: 0.53 },
      claimClass: "illustrative-scenario",
      description:
        "Two or three tiers below the buyers who would notice. Typically invisible on any dashboard.",
    },
    {
      id: "components",
      label: "Component factories",
      kind: "infrastructure",
      position: { x: 0.68, y: 0.53 },
      claimClass: "illustrative-scenario",
      description:
        "Motors, actuators, sensors. Individually cheap, individually indispensable.",
    },
    {
      id: "auto",
      label: "Automotive",
      kind: "market",
      position: { x: 0.12, y: 0.78 },
      evidenceIds: ["E-007"],
      claimClass: "source-claim",
      description:
        "The largest single block of exposed activity — over USD 3 trillion on the IEA's estimate.",
    },
    {
      id: "defence",
      label: "Defence",
      kind: "market",
      position: { x: 0.31, y: 0.86 },
      evidenceIds: ["E-005"],
      claimClass: "source-claim",
      description:
        "Long qualification cycles make substitution slow even where alternatives exist.",
    },
    {
      id: "energy",
      label: "Energy systems",
      kind: "infrastructure",
      position: { x: 0.5, y: 0.9 },
      evidenceIds: ["E-006"],
      claimClass: "source-claim",
      description: "Wind generation and grid equipment both draw on the same magnet supply.",
    },
    {
      id: "semis",
      label: "Semiconductors",
      kind: "market",
      position: { x: 0.69, y: 0.86 },
      claimClass: "illustrative-scenario",
      description: "Fab tooling and precision motion systems depend on the same inputs.",
    },
    {
      id: "ai",
      label: "AI infrastructure",
      kind: "infrastructure",
      position: { x: 0.88, y: 0.78 },
      labelSide: "right",
      evidenceIds: ["E-013"],
      claimClass: "illustrative-scenario",
      description: "Where this cascade meets the electricity demand curve of the AI build-out.",
    },
  ],
  relations: [
    {
      id: "c1",
      sourceIds: ["policy"],
      targetIds: ["refining"],
      mechanism:
        "Licensing applies to material that must pass through a stage one jurisdiction overwhelmingly controls. Concentration is what converts an administrative step into a global constraint.",
      order: 1,
      evidenceIds: ["E-005", "E-006"],
      claimClass: "source-claim",
    },
    {
      id: "c2",
      sourceIds: ["refining"],
      targetIds: ["magnets"],
      mechanism:
        "Separated oxides are the input to magnet production. Constrain the oxide and the magnet output follows, with a lag set by inventory rather than by physics.",
      order: 1,
      evidenceIds: ["E-006"],
      claimClass: "source-claim",
    },
    {
      id: "c3",
      sourceIds: ["magnets"],
      targetIds: ["tiern", "components"],
      mechanism:
        "Scarce supply is allocated by contract and relationship. A buyer's position in that queue was fixed long before the constraint appeared.",
      order: 2,
      claimClass: "illustrative-scenario",
      alternatives: [
        "Substitution to ferrite or to redesigned motors, where qualification time allows",
      ],
    },
    {
      id: "c4",
      sourceIds: ["tiern", "components"],
      targetIds: ["auto", "defence", "energy", "semis", "ai"],
      mechanism:
        "A production line stops for the cheapest missing item as readily as for the most expensive one. Bill-of-materials value does not predict stoppage risk — position in the graph does.",
      order: 3,
      evidenceIds: ["E-007"],
      claimClass: "illustrative-scenario",
    },
  ],
});

/* --- ACT IV — REALITY IS NOT A CHAIN ---------------------------------- */

export const semiconductorHypergraph = defineGraph({
  id: "semiconductor-hypergraph",
  title: "The 2021 shortage was not a chain",
  scope: "Why automotive semiconductor supply failed, and why the first estimate doubled",
  claimClass: "source-claim",
  evidenceIds: ["E-009"],
  textAlternative:
    "Nine causes — pandemic demand shift, consumer electronics demand, geographic concentration of fabrication, lockdowns in assembly and test, drought affecting fab water supply, a fab fire, logistics disruption, just-in-time inventory design, and order-cancellation decisions early in 2020 — converge through two junctions onto wafer allocation and then onto vehicle production. No single cause is sufficient. The joint effect is what AlixPartners priced at 210 billion US dollars of lost revenue and 7.7 million units in 2021, after revising an earlier estimate of 110 billion and 3.9 million units four months previously.",
  nodes: [
    {
      id: "pandemic",
      label: "Pandemic demand shift",
      kind: "event",
      position: { x: 0.08, y: 0.12 },
      claimClass: "observed-fact",
    },
    {
      id: "consumer",
      label: "Consumer electronics demand",
      kind: "market",
      position: { x: 0.3, y: 0.08 },
      claimClass: "observed-fact",
    },
    {
      id: "cancellation",
      label: "Order cancellations",
      kind: "policy",
      position: { x: 0.53, y: 0.12 },
      claimClass: "observed-fact",
      description:
        "Vehicle makers released fab capacity in early 2020 against a forecast of collapsing demand. Recovering it required re-entering a queue that had already been filled.",
    },
    {
      id: "jit",
      label: "Just-in-time inventory",
      kind: "state",
      position: { x: 0.76, y: 0.08 },
      claimClass: "yukthi-interpretation",
      description:
        "A design that is optimal under stable replenishment and fragile under any interruption to it.",
    },
    {
      id: "concentration",
      label: "Fab concentration",
      kind: "infrastructure",
      position: { x: 0.06, y: 0.36 },
      claimClass: "observed-fact",
    },
    {
      id: "lockdown",
      label: "Assembly & test lockdowns",
      kind: "event",
      position: { x: 0.26, y: 0.4 },
      claimClass: "observed-fact",
    },
    {
      id: "drought",
      label: "Drought",
      kind: "event",
      position: { x: 0.5, y: 0.44 },
      claimClass: "observed-fact",
      description:
        "Fabrication is water-intensive. Water availability became a semiconductor input.",
    },
    {
      id: "fire",
      label: "Fab fire",
      kind: "event",
      position: { x: 0.72, y: 0.4 },
      claimClass: "observed-fact",
    },
    {
      id: "logistics",
      label: "Logistics disruption",
      kind: "infrastructure",
      position: { x: 0.92, y: 0.36 },
      labelSide: "left",
      claimClass: "observed-fact",
    },
    {
      id: "allocation",
      label: "Wafer allocation",
      kind: "mechanism",
      position: { x: 0.5, y: 0.68 },
      claimClass: "yukthi-interpretation",
      description:
        "The junction where every upstream cause is resolved into a single scarce quantity, distributed by contract rather than by need.",
    },
    {
      id: "production",
      label: "Vehicle production",
      kind: "outcome",
      position: { x: 0.5, y: 0.9 },
      evidenceIds: ["E-009"],
      claimClass: "source-claim",
      state: "−7.7 million units, 2021",
      description:
        "The measured consequence: USD 210 billion of lost revenue on AlixPartners' September 2021 estimate.",
    },
  ],
  relations: [
    {
      id: "h1",
      sourceIds: ["pandemic", "consumer", "cancellation"],
      targetIds: ["allocation"],
      label: "Demand-side conjunction",
      mechanism:
        "Demand moved to consumer electronics at the same moment vehicle makers released their capacity. Either alone would have been absorbed; together they reassigned the queue.",
      order: 1,
      claimClass: "source-claim",
    },
    {
      id: "h2",
      sourceIds: ["concentration", "lockdown", "drought", "fire", "logistics"],
      targetIds: ["allocation"],
      label: "Supply-side conjunction",
      mechanism:
        "Independent shocks — public health, weather, fire, freight — landed on a supply base concentrated enough that they could not be routed around.",
      order: 1,
      claimClass: "source-claim",
    },
    {
      id: "h3",
      sourceIds: ["allocation", "jit"],
      targetIds: ["production"],
      label: "Amplification",
      mechanism:
        "Thin inventory converts a supply delay directly into a stoppage. The inventory design did not cause the shortage; it set how quickly the shortage became a shutdown.",
      order: 2,
      evidenceIds: ["E-009"],
      claimClass: "yukthi-interpretation",
      alternatives: ["Slower demand recovery would have masked part of the constraint"],
    },
  ],
});

/* --- ACT VI — THE URI FEEDBACK LOOP ----------------------------------- */

export const uriFeedback = defineGraph({
  id: "uri-feedback",
  title: "Winter Storm Uri: a reinforcing loop",
  scope: "The February 2021 Texas and South Central US outages",
  claimClass: "observed-fact",
  evidenceIds: ["E-012"],
  textAlternative:
    "A closed reinforcing loop. Extreme cold causes generating units to fail; generation failure reduces electricity supply; reduced electricity supply cuts power to gas production and processing infrastructure; falling gas supply removes fuel from gas-fired generation; and further generation fails, returning to the start. The FERC and NERC joint inquiry documents approximately 61,800 megawatts of generation lost, 1,045 units affected across 4,124 outages, derates or failures to start, and more than 4.5 million customers without power. The cold was the trigger; the loop is the mechanism.",
  nodes: [
    {
      id: "cold",
      label: "Extreme cold",
      kind: "event",
      position: { x: 0.5, y: 0.08 },
      evidenceIds: ["E-012"],
      claimClass: "observed-fact",
      description: "The trigger, and the only part of this diagram that is weather.",
    },
    {
      id: "genfail",
      label: "Generators fail",
      kind: "infrastructure",
      position: { x: 0.82, y: 0.3 },
      labelSide: "right",
      evidenceIds: ["E-012"],
      claimClass: "observed-fact",
      state: "≈61,800 MW lost",
      description:
        "Freezing of equipment was one of the two dominant causes identified by the inquiry.",
    },
    {
      id: "elec",
      label: "Electricity supply falls",
      kind: "outcome",
      position: { x: 0.86, y: 0.62 },
      labelSide: "right",
      evidenceIds: ["E-012"],
      claimClass: "observed-fact",
      state: "4.5m+ customers without power",
    },
    {
      id: "gasinfra",
      label: "Gas infrastructure loses power",
      kind: "infrastructure",
      position: { x: 0.5, y: 0.85 },
      evidenceIds: ["E-012"],
      claimClass: "observed-fact",
      description:
        "Wellheads, gathering and processing all draw electricity from the grid they supply.",
    },
    {
      id: "gas",
      label: "Gas supply falls",
      kind: "resource",
      position: { x: 0.14, y: 0.62 },
      labelSide: "left",
      evidenceIds: ["E-012"],
      claimClass: "observed-fact",
      description:
        "Loss of fuel supply was the second dominant cause. It is downstream of the outage it then deepens.",
    },
    {
      id: "fuel",
      label: "Fuel to generation falls",
      kind: "mechanism",
      position: { x: 0.18, y: 0.3 },
      labelSide: "left",
      claimClass: "observed-fact",
    },
  ],
  relations: [
    {
      id: "u1",
      sourceIds: ["cold"],
      targetIds: ["genfail"],
      mechanism:
        "Unwinterised equipment freezes: instrumentation, water lines, sensing elements.",
      order: 1,
      evidenceIds: ["E-012"],
      claimClass: "observed-fact",
    },
    {
      id: "u2",
      sourceIds: ["genfail"],
      targetIds: ["elec"],
      mechanism: "Lost capacity meets peak heating demand. Load shed follows.",
      order: 1,
      evidenceIds: ["E-012"],
      claimClass: "observed-fact",
    },
    {
      id: "u3",
      sourceIds: ["elec"],
      targetIds: ["gasinfra"],
      mechanism:
        "Load shedding removes power from gas production and processing sites, many of which were not designated as critical load.",
      order: 2,
      evidenceIds: ["E-012"],
      claimClass: "observed-fact",
    },
    {
      id: "u4",
      sourceIds: ["gasinfra"],
      targetIds: ["gas"],
      mechanism: "Unpowered wellheads and processing plants stop delivering.",
      order: 2,
      evidenceIds: ["E-012"],
      claimClass: "observed-fact",
    },
    {
      id: "u5",
      sourceIds: ["gas"],
      targetIds: ["fuel"],
      mechanism: "Gas-fired generation loses its fuel at the moment it is most needed.",
      order: 3,
      evidenceIds: ["E-012"],
      claimClass: "observed-fact",
    },
    {
      id: "u6",
      sourceIds: ["fuel", "cold"],
      targetIds: ["genfail"],
      label: "Loop closes",
      mechanism:
        "Fuel starvation and continuing cold together remove more generation — the same node the loop began at. This is the arrow that makes the event a cascade rather than a shortfall.",
      order: 3,
      evidenceIds: ["E-012"],
      claimClass: "observed-fact",
    },
  ],
});

/* --- ACT VII — THE COMING DECADE -------------------------------------- */

export const comingDecade = defineGraph({
  id: "coming-decade",
  title: "The risks of the next decade interact",
  scope: "Eight concurrent structural pressures, treated as one system",
  claimClass: "yukthi-interpretation",
  evidenceIds: ["E-001", "E-006", "E-013", "E-014"],
  textAlternative:
    "Eight pressures — geopolitical fragmentation, the AI infrastructure build-out, the energy transition, electricity demand growth, critical-mineral concentration, physical climate risk, supply-chain weaponisation and rapid technological change — connected rather than listed. One traced path runs from the AI build-out to data centres, to electricity demand, to grid and transformer requirements, to copper and critical minerals, into processing concentration, into export control exposure, back out to infrastructure cost and data-centre delay, and finally to compute constraint and strategic competition. The path returns to where it started, which is the property that makes these pressures a system rather than a list.",
  nodes: [
    {
      id: "ai-boom",
      label: "AI build-out",
      kind: "market",
      position: { x: 0.5, y: 0.06 },
      evidenceIds: ["E-013"],
      claimClass: "observed-fact",
    },
    {
      id: "datacentre",
      label: "Data centres",
      kind: "infrastructure",
      position: { x: 0.72, y: 0.2 },
      evidenceIds: ["E-013"],
      claimClass: "observed-fact",
    },
    {
      id: "electricity",
      label: "Electricity demand",
      kind: "resource",
      position: { x: 0.86, y: 0.38 },
      labelSide: "right",
      evidenceIds: ["E-013"],
      claimClass: "source-claim",
      state: "≈415 TWh (2024) → ≈945 TWh (2030, base case)",
    },
    {
      id: "grid",
      label: "Grid & transformers",
      kind: "infrastructure",
      position: { x: 0.8, y: 0.6 },
      labelSide: "right",
      claimClass: "illustrative-scenario",
    },
    {
      id: "minerals",
      label: "Copper & critical minerals",
      kind: "resource",
      position: { x: 0.58, y: 0.76 },
      evidenceIds: ["E-006"],
      claimClass: "source-claim",
    },
    {
      id: "processing",
      label: "Processing concentration",
      kind: "infrastructure",
      position: { x: 0.34, y: 0.82 },
      evidenceIds: ["E-006"],
      claimClass: "observed-fact",
    },
    {
      id: "control",
      label: "Export control",
      kind: "policy",
      position: { x: 0.14, y: 0.66 },
      labelSide: "left",
      evidenceIds: ["E-005", "E-008"],
      claimClass: "observed-fact",
    },
    {
      id: "cost",
      label: "Infrastructure cost",
      kind: "outcome",
      position: { x: 0.1, y: 0.42 },
      labelSide: "left",
      claimClass: "illustrative-scenario",
    },
    {
      id: "delay",
      label: "Data-centre delay",
      kind: "outcome",
      position: { x: 0.2, y: 0.22 },
      labelSide: "left",
      claimClass: "illustrative-scenario",
    },
    {
      id: "compute",
      label: "Compute constraint",
      kind: "risk",
      position: { x: 0.34, y: 0.1 },
      claimClass: "illustrative-scenario",
    },
    {
      id: "climate",
      label: "Physical climate risk",
      kind: "risk",
      position: { x: 0.5, y: 0.46 },
      evidenceIds: ["E-014"],
      claimClass: "source-claim",
      description:
        "Bears on generation, transmission and the siting of everything else in this diagram.",
    },
    {
      id: "fragmentation",
      label: "Fragmentation",
      kind: "policy",
      position: { x: 0.26, y: 0.46 },
      evidenceIds: ["E-001", "E-003"],
      claimClass: "source-claim",
    },
  ],
  relations: [
    {
      id: "d1",
      sourceIds: ["ai-boom"],
      targetIds: ["datacentre"],
      mechanism:
        "Model training and inference become buildings, land and interconnection queues.",
      order: 1,
      claimClass: "yukthi-interpretation",
    },
    {
      id: "d2",
      sourceIds: ["datacentre"],
      targetIds: ["electricity"],
      mechanism:
        "Compute becomes load. The IEA's base case has data centre consumption roughly doubling by 2030, growing about four times faster than total electricity demand.",
      order: 1,
      evidenceIds: ["E-013"],
      claimClass: "source-claim",
    },
    {
      id: "d3",
      sourceIds: ["electricity"],
      targetIds: ["grid"],
      mechanism:
        "New load requires transmission, substations and transformers on lead times measured in years.",
      order: 2,
      claimClass: "illustrative-scenario",
    },
    {
      id: "d4",
      sourceIds: ["grid"],
      targetIds: ["minerals"],
      mechanism:
        "Grid equipment is a copper and critical-mineral demand line before it is anything else.",
      order: 2,
      claimClass: "illustrative-scenario",
    },
    {
      id: "d5",
      sourceIds: ["minerals"],
      targetIds: ["processing"],
      mechanism:
        "Demand resolves onto the processing stage, which is where concentration sits.",
      order: 2,
      evidenceIds: ["E-006"],
      claimClass: "source-claim",
    },
    {
      id: "d6",
      sourceIds: ["processing", "fragmentation"],
      targetIds: ["control"],
      label: "Concentration meets strategy",
      mechanism:
        "Concentration is only leverage where the political relationship makes it usable. The two together produce export control; neither alone does.",
      order: 2,
      evidenceIds: ["E-005", "E-008"],
      claimClass: "yukthi-interpretation",
    },
    {
      id: "d7",
      sourceIds: ["control", "climate"],
      targetIds: ["cost"],
      mechanism:
        "Constrained inputs and physical risk both raise the delivered cost of the same infrastructure.",
      order: 3,
      claimClass: "illustrative-scenario",
    },
    {
      id: "d8",
      sourceIds: ["cost"],
      targetIds: ["delay"],
      mechanism: "Cost and equipment lead times move build schedules out.",
      order: 3,
      claimClass: "illustrative-scenario",
    },
    {
      id: "d9",
      sourceIds: ["delay"],
      targetIds: ["compute"],
      mechanism: "Delayed capacity becomes a constraint on available compute.",
      order: 3,
      claimClass: "illustrative-scenario",
    },
    {
      id: "d10",
      sourceIds: ["compute"],
      targetIds: ["ai-boom"],
      label: "The loop closes",
      mechanism:
        "Compute scarcity feeds back into the strategic competition that drove the build-out — and into the policy environment that produced the export control. The path returns to its origin.",
      order: 3,
      claimClass: "yukthi-interpretation",
    },
  ],
});

export const signatureGraphs = {
  stableLattice,
  rareEarthCascade,
  semiconductorHypergraph,
  uriFeedback,
  comingDecade,
};
