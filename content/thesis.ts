/* ============================================================================
   THESIS COPY
   ----------------------------------------------------------------------------
   Every word the exhibition speaks lives here, keyed by room. Scenes render it;
   they do not author it. That separation is what lets the argument be read as a
   continuous document on /thesis and as a spatial sequence on the homepage
   without the two drifting apart.
   ========================================================================== */

import type { Chapter } from "@/lib/story/chapters";
import type { ClaimClass } from "@/lib/graph/types";

export type RoomCopy = {
  id: Chapter;
  /** Small instrument label above the headline. */
  eyebrow: string;
  headline: string;
  /** One sentence under the headline. Carries the room on its own if nothing else loads. */
  standfirst?: string;
  body: string[];
  /** A line that stands alone at display size. */
  pull?: string;
  /** A monospace ladder — the exhibition's way of showing an ordered mechanism. */
  ladder?: { title?: string; steps: string[] };
  evidenceIds?: string[];
  /** How the room's central assertion should be read (§33). */
  claimClass?: ClaimClass;
};

export const ROOM_COPY: Record<Chapter, RoomCopy> = {
  observatory: {
    id: "observatory",
    eyebrow: "Yukthi Lab / Observatory 01",
    headline: "The world was easier to reason about when its structure was stable.",
    standfirst: "It isn't anymore.",
    body: [
      "This is an instrument for reasoning about a world whose structure has stopped holding still. It is not a product tour. It is the argument for why the instrument needs to exist, made in the order the argument actually runs.",
      "Scroll to begin. Everything here is readable without motion, and every factual claim opens its source.",
    ],
    pull: "Bring certainty to an increasingly unstable world.",
    claimClass: "ambition",
  },

  stability: {
    id: "stability",
    eyebrow: "Room 01 / The stable world",
    headline: "The world we inherited",
    standfirst:
      "For decades, consequential decisions were made inside a world whose historical relationships remained useful enough to guide expectations.",
    body: [
      "It was never a perfect system. It was a sufficiently stable one. Trade routes persisted long enough to plan around. Supplier relationships repeated. Institutions behaved roughly as they had behaved. Prices moved, sometimes violently, but the mechanisms that produced them stayed recognisable.",
      "That stability had a quiet technical consequence, and it is the one that matters here. It meant the past was a usable training set. A demand curve fitted on ten years of history was a reasonable guide to the eleventh. A risk model calibrated on observed correlations could be trusted to hold while you acted on it.",
      "Almost every analytical instrument in serious use today was designed for that world, and inherits its central assumption: that the structure generating the data will still be the structure tomorrow.",
    ],
    ladder: {
      steps: [
        "STABLE RELATIONSHIPS",
        "PREDICTABLE TRADE",
        "REPEATABLE SUPPLY",
        "RELATIVE INSTITUTIONAL STABILITY",
        "HISTORICAL SIGNAL → FUTURE EXPECTATION",
      ],
    },
    claimClass: "interpretation",
  },

  rupture: {
    id: "rupture",
    eyebrow: "Room 02 / Rupture",
    headline: "The world did not simply become noisier. Its structure began to change.",
    standfirst:
      "Noise is a bigger spread around the same relationship. This was something else: the relationships themselves were rewritten, deliberately, by policy.",
    body: [
      "Integration had been the default direction of travel for a generation. It stopped being the default. Export controls, industrial policy, investment screening, technology restrictions and reshoring programmes are not shocks to a system — they are edits to it. Each one changes which paths exist, and on what conditions.",
      "The distinction matters because the two failure modes need different instruments. Noise is handled with wider confidence intervals. A rewritten topology is not, because the model's confidence interval was estimated on the topology that no longer applies.",
      "Note what is being claimed and what is not. This is not an argument that fragmentation is good or bad, nor a forecast of where it ends. It is an observation about structure: dependencies are becoming fewer, longer and more politically conditioned, and that raises the consequence of any single one being cut.",
    ],
    ladder: {
      steps: [
        "GLOBALIZATION",
        "STRATEGIC INTERDEPENDENCE",
        "INDUSTRIAL POLICY",
        "FRIEND-SHORING / RESILIENCE",
        "MULTIPOLAR COMPETITION",
        "STRATEGIC DEPENDENCIES",
      ],
    },
    evidenceIds: ["imf-fragmentation", "chips-act", "eu-chips-act"],
    claimClass: "interpretation",
  },

  chokepoint: {
    id: "chokepoint",
    eyebrow: "Room 03 / Chokepoint",
    headline: "The size of a node is not the size of its consequence.",
    standfirst:
      "Separated heavy rare earths are a small market by revenue. What they gate is not small at all.",
    body: [
      "Rare-earth elements are not geologically rare, and the deposits are widely distributed. The constraint sits one step downstream, in separation and refining — the capability to turn mixed oxides into individual usable elements — and that capability is concentrated far more tightly than the ore.",
      "In April 2025 China introduced export licensing requirements covering seven medium and heavy rare-earth elements and related magnet items. Nothing physical changed. No mine closed, no ship sank, no processing plant burned. An administrative requirement was added at one node.",
      "Follow what that node gates: permanent magnets, and therefore traction motors, and therefore electric vehicles; and separately actuators, guidance and radar; and separately wind turbines; and separately the motors, cooling and drives inside data-centre infrastructure. The upstream node is physically tiny. The downstream system is enormous.",
      "This is the shape of the modern problem in one exhibit. The consequential variable was a change in policy structure at a node most downstream firms could not name, and the exposure was carried not by contract value but by position in a network.",
    ],
    evidenceIds: [
      "mofcom-rare-earth-controls",
      "usgs-rare-earth-concentration",
      "iea-critical-minerals-outlook",
      "alixpartners-auto-chip",
    ],
    claimClass: "source",
  },

  cascade: {
    id: "cascade",
    eyebrow: "Room 04 / Cascade",
    headline: "Consequence travels.",
    standfirst:
      "A pulse in this exhibition means a causal effect propagating through a mechanism, never a decorative particle.",
    body: [
      "In March 2021 a container vessel grounded in the Suez Canal and was refloated six days later. Six days is nothing. The position was everything: a finite obstruction at a node with no substitute reordered sailing schedules, container availability, port labour and inventory positions across several continents for months.",
      "The propagation is not mysterious once you can see it. An event meets a mechanism; the mechanism meets a dependency; the dependency meets a bottleneck; the bottleneck produces effects at a second and third remove from anything the original event touched.",
      "Which raises the question this exhibition turns on, and the one a chain diagram cannot answer.",
    ],
    ladder: {
      title: "Visual grammar",
      steps: [
        "EVENT",
        "MECHANISM",
        "DEPENDENCY",
        "BOTTLENECK",
        "SECOND-ORDER EFFECT",
        "THIRD-ORDER EFFECT",
      ],
    },
    pull: "What happens when there is more than one cause?",
    evidenceIds: ["suez-ever-given", "sia-bcg-supply-chain"],
    claimClass: "source",
  },

  "structural-break": {
    id: "structural-break",
    eyebrow: "Room 05 / Structural break",
    headline: "Reality is not a chain.",
    standfirst: "It is an interacting causal system.",
    body: [
      "A chain says: A causes B causes C. Real systems rarely oblige. Two conditions have to hold together before an effect appears. One cause feeds several unrelated outcomes. A relationship runs backwards as well as forwards. A link holds under one policy and dissolves under another.",
      "A pairwise graph — arrows between single nodes — cannot express conjunction. It cannot say that an export control and a processing concentration are jointly required, and separately harmless. To hold that, an edge has to be able to connect a set of causes to a set of effects. That object is a hypergraph, and the reason it appears in this argument is structural necessity rather than mathematical taste.",
      "The same shift explains why historical models break. In 2022 the European Central Bank published an examination of why its own staff inflation projections had missed, attributing the errors substantially to energy price developments and to conditions historical relationships had not anticipated.",
      "That is not evidence that forecasting is futile. It is a precise statement of the failure mode: a model estimated on one regime loses reliability when the relationships that generated its training data stop holding. The honest response is to model the structure that changed — not to fit the curve harder.",
    ],
    ladder: { steps: ["LINE", "NETWORK", "HYPERGRAPH"] },
    evidenceIds: ["ecb-projection-errors"],
    claimClass: "source",
  },

  feedback: {
    id: "feedback",
    eyebrow: "Room 06 / Feedback",
    headline: "Some crises are systems amplifying themselves.",
    standfirst:
      "In February 2021 the electricity and natural gas systems of Texas did not fail independently. Each failure degraded the other.",
    body: [
      "The joint FERC/NERC inquiry into the February 2021 outages found that freezing conditions caused widespread generating unit outages and simultaneous declines in natural gas production — and that the loss of electricity supply to gas infrastructure contributed in turn to further reductions in the gas available to generators.",
      "Read the loop rather than the list. Cold reduces generation. Reduced generation reduces power to gas production and processing. Reduced gas reduces generation further. Each turn of the loop is small. The loop is not.",
      "A monitoring system watching electricity and watching gas would have seen two difficult but survivable problems. The severity lived in the coupling — which is to say, in a place neither instrument was looking.",
    ],
    ladder: {
      steps: [
        "EXTREME COLD",
        "GENERATION FAILURE",
        "GAS SHORTAGE",
        "ELECTRICITY SHORTAGE",
        "INFRASTRUCTURE FAILURE",
        "MORE GAS SHORTAGE  ↺",
      ],
    },
    pull: "The danger lives in the interaction.",
    evidenceIds: ["ferc-nerc-uri"],
    claimClass: "source",
  },

  convergence: {
    id: "convergence",
    eyebrow: "Room 07 / Convergence",
    headline: "The next decade does not arrive as a list of risks.",
    standfirst: "It arrives as a system of interacting risks.",
    body: [
      "Pull the camera back far enough and the separate exhibits resolve into one object. Artificial intelligence is an electricity question. Electricity is a grid-equipment question. Grid equipment is a copper and critical-minerals question. Minerals are a processing-concentration question. Processing concentration is an export-control question. Export controls are a compute-availability question. Compute availability is an artificial intelligence question.",
      "The IEA reported that data centres, AI and cryptocurrency consumed an estimated 460 TWh of electricity in 2022 and projected that this could exceed 1,000 TWh by 2026. It separately reported that grid investment is not keeping pace with demand growth, with lengthening equipment lead times and long permitting timelines.",
      "Lead time is what converts a shortage into a cascade. When the constrained node takes years to relieve and the demand shock takes months to arrive, ordering matters more than magnitude — and ordering is a causal property, not a statistical one.",
      "No individual domain model is wrong here. Each is answering its own question correctly. The system-level question is simply not any of theirs.",
    ],
    ladder: {
      title: "One path among many",
      steps: [
        "AI",
        "DATA CENTRES",
        "ELECTRICITY",
        "GRID",
        "TRANSFORMERS",
        "COPPER / MINERALS",
        "PROCESSING CONCENTRATION",
        "EXPORT CONTROLS",
        "INFRASTRUCTURE DELAY",
        "COMPUTE CONSTRAINT",
        "STRATEGIC AI COMPETITION",
      ],
    },
    evidenceIds: [
      "iea-electricity-2024",
      "iea-grids",
      "usgs-rare-earth-concentration",
      "panama-canal-draught",
    ],
    claimClass: "source",
  },

  "old-tools": {
    id: "old-tools",
    eyebrow: "Room 08 / The old instruments",
    headline: "Each instrument sees a part of the system.",
    standfirst:
      "This room is a museum, not a demolition. Every instrument in it is good at the thing it was built for.",
    body: [
      "The argument Yukthi makes is not that these tools are wrong. It is narrower and harder to dismiss: each of them was designed to answer a different question, and none of them was designed to answer the question of how the systems they separately observe interact.",
      "The missing problem is not a better dashboard, a better forecast or a better analyst. It is connecting the parts into an evolving causal model.",
    ],
    pull: "The missing problem is connecting the parts into an evolving causal model.",
    claimClass: "interpretation",
  },

  gap: {
    id: "gap",
    eyebrow: "Room 09 / The gap",
    headline: "What if the system itself were the object of analysis?",
    standfirst:
      "Six instruments, six partial views, and no shared representation for the thing they are all looking at.",
    body: [
      "Put them on one screen and the shape of the problem becomes visible. The dashboard knows a number moved. The forecast knows what a number usually does. Search knows something was published. Research knows what it meant last quarter. Simulation knows what happens under assumptions somebody fixed in advance. The analyst knows all of this and has one working week.",
      "Try to draw the lines between them and they do not connect, because there is nothing in the middle for them to connect to. Every instrument holds its own private model of the world in its own private schema, and the interaction between those models exists only in a human head, episodically, under time pressure.",
      "The gap is not a capability that no tool has. It is a representation that no tool shares.",
    ],
    claimClass: "interpretation",
  },

  ai: {
    id: "ai",
    eyebrow: "Room 10 / Why now",
    headline: "AI changes the economics of continuous evidence processing.",
    standfirst:
      "Not because it can reason better than an analyst. Because it can read without stopping.",
    body: [
      "The evidence needed to see structural change early has been public for years: regulatory filings, policy announcements, customs data, tender documents, transcripts, technical literature, infrastructure notices. The obstacle was never availability. It was the cost of reading everything, continuously, across domains that use different vocabularies for the same object.",
      "That cost has changed. Retrieval, entity resolution, synthesis and structured extraction can now run continuously at a price that makes always-on evidence processing tractable rather than heroic.",
      "But scale is not structure, and this is where most of the current wave stops. A system that reads everything and summarises it has produced a faster newspaper. It still cannot tell you that two unrelated documents describe the two conditions of a single conjunction, because it has no object in which conjunction can be represented.",
    ],
    ladder: {
      steps: ["SEARCH", "RESOLVE", "SYNTHESIZE", "REASON", "FORECAST", "CALIBRATE", "UPDATE"],
    },
    pull: "AI alone does not create a causal world model. The missing layer is explicit causal structure.",
    claimClass: "interpretation",
  },

  yukthi: {
    id: "yukthi",
    eyebrow: "Room 11 / Yukthi",
    headline: "Yukthi",
    standfirst: "A Scoped Causal Hypergraph-based World Model.",
    body: [
      "Take the object built through the preceding ten rooms and state it plainly. Nodes are actors, events, policies, resources, infrastructure, markets, risks and outcomes. Relations are hyperedges: sets of causes connected to sets of effects, each carrying an explicit mechanism and the evidence that supports it.",
      "Geography stops being the organising principle. A node's place in this structure is determined by what it causes, not by where it sits. Two facilities on opposite sides of the planet that gate the same component are neighbours here; two plants in the same industrial park that gate nothing in common are not.",
      "That is the technical bet, and it is falsifiable. The rest of this exhibition is what follows from it.",
    ],
    claimClass: "ambition",
  },

  "world-model": {
    id: "world-model",
    eyebrow: "Room 12 / The world model",
    headline: "Scoped means a decision defines the boundary.",
    standfirst:
      "Yukthi does not attempt to model the whole planet at once. Nobody can, and a system claiming to would be lying.",
    body: [
      "A question sets the scope. What if this export restriction happens? What breaks first if a strategic supplier changes policy tomorrow? Where is risk accumulating outside the historical model? The world then reorganises around that question: the nodes that carry consequence for it come into the model, the ones that do not stay out.",
      "The same underlying world supports many scopes. An industrial scope and an insurance scope over the same region share evidence, share mechanisms and disagree completely about what matters — correctly, because they are asking different questions.",
      "Scoping is what makes the model honest about its own limits. Every scope has a boundary, the boundary is a modelling choice, and the choice is shown rather than hidden.",
    ],
    ladder: {
      title: "Scopes",
      steps: ["INDUSTRIAL", "ENERGY", "INSURANCE", "SUPPLY CHAIN", "FINANCIAL RISK", "GOVERNMENT"],
    },
    claimClass: "ambition",
  },

  map: {
    id: "map",
    eyebrow: "Room 13 / Map",
    headline: "Map",
    standfirst: "Build the scoped causal structure.",
    body: [
      "Actors, events, policies, resources, infrastructure, dependencies, mechanisms and evidence assemble into a hypergraph bounded by the decision that called for it. Every relation carries a mechanism in words and a link to what supports it. An edge without a mechanism is a decoration, and does not enter the model.",
    ],
    ladder: {
      steps: [
        "ACTORS",
        "EVENTS",
        "POLICIES",
        "RESOURCES",
        "INFRASTRUCTURE",
        "DEPENDENCIES",
        "MECHANISMS",
        "EVIDENCE",
      ],
    },
    claimClass: "ambition",
  },

  monitor: {
    id: "monitor",
    eyebrow: "Room 14 / Monitor",
    headline: "Monitor",
    standfirst: "New evidence arrives, and the structure answers to it.",
    body: [
      "Evidence does not simply accumulate. It acts on the model: confirming a relation, contradicting one, weakening the support beneath one, introducing a node that did not exist, or widening the uncertainty on a mechanism that used to look settled.",
      "The graph you are looking at is therefore never final. It is the current reading of the structure, and it is expected to change — which is the property that distinguishes a world model from a diagram somebody drew once.",
    ],
    ladder: {
      steps: [
        "CONFIRMS",
        "CONTRADICTS",
        "WEAKENS",
        "INTRODUCES A NODE",
        "CHANGES A RELATIONSHIP",
        "CHANGES UNCERTAINTY",
      ],
    },
    claimClass: "ambition",
  },

  forecast: {
    id: "forecast",
    eyebrow: "Room 15 / Forecast",
    headline: "Forecast",
    standfirst: "Not one prediction. Several futures, each carrying its own reasoning.",
    body: [
      "A single number with a confidence interval hides the thing a decision-maker actually needs: which assumptions produced it. Yukthi's intended output is a small set of branches, each of which states the assumptions it rests on, the causal path it follows, where the uncertainty is concentrated, and the evidence underneath.",
      "This site shows no probability values, because Yukthi has not earned any. Calibration is something a system demonstrates over time against outcomes, and inventing a number here would be the exact failure the thesis is arguing against.",
    ],
    ladder: {
      title: "Each branch carries",
      steps: ["ASSUMPTIONS", "CAUSAL PATH", "UNCERTAINTY", "EVIDENCE"],
    },
    claimClass: "ambition",
  },

  simulate: {
    id: "simulate",
    eyebrow: "Room 16 / Simulate",
    headline: "Simulate",
    standfirst: "Change one condition and watch the consequence traverse the structure.",
    body: [
      "The interaction below is an illustrative scenario built on the documented rare-earth exhibit from Room 03. Toggling the export restriction fires the hyperedges whose conditions are met, in the order their conditions are met. Nothing is sampled, nothing is scored, and no probability is produced.",
      "What it demonstrates is the mechanism of traversal rather than any claim about outcomes: which nodes are reached, in what order, through which stated mechanism, on which evidence.",
    ],
    pull: "Illustrative scenario — not live model output.",
    claimClass: "illustration",
  },

  remap: {
    id: "remap",
    eyebrow: "Room 17 / Re-map",
    headline: "Re-map",
    standfirst: "The loop closes, and the model that emerges is not the model that went in.",
    body: [
      "Evidence gathered while monitoring, and structure exposed while simulating, change what the next map should contain. Nodes that proved inert leave. Mechanisms that turned out to be conditional get their condition. Boundaries that cut through a live dependency move.",
      "This is one continuous system, not five features. The loop is the product.",
    ],
    ladder: { steps: ["MAP", "MONITOR", "FORECAST", "SIMULATE", "RE-MAP", "MAP"] },
    claimClass: "ambition",
  },

  decisions: {
    id: "decisions",
    eyebrow: "Room 18 / The 3 a.m. problem",
    headline: "Know what could break before it becomes your 3 a.m. problem.",
    standfirst:
      "Architecture is only interesting where it meets a decision somebody is accountable for.",
    body: [
      "Each question below activates a different causal scope over the same underlying world. The nodes that matter change. The evidence that matters changes. The structure does not.",
    ],
    claimClass: "ambition",
  },

  investment: {
    id: "investment",
    eyebrow: "Room 19 / The bet",
    headline: "The bet is not perfect prediction. The bet is earlier understanding.",
    standfirst: "Stated as a conditional, because that is what it honestly is.",
    body: [
      "The economic logic is a comparison of two chains. In the first, a hidden dependency changes, the change goes unseen, detection arrives late, the consequence cascades, and the loss is realised. In the second, causal visibility shortens the distance between change and detection, which creates room to reason, which creates room to act.",
      "The conditional: if Yukthi can consistently identify consequential risks earlier and reveal causal pathways that existing systems miss, it can become valuable in environments where the cost of surprise is extremely high.",
      "No saving is guaranteed here, no market size is claimed, and no customer is named. The value of earlier understanding is real but conditional on capability that has to be demonstrated — which is what the proof questions below exist to make testable.",
    ],
    claimClass: "ambition",
  },

  finale: {
    id: "finale",
    eyebrow: "Room 20 / The civilizational bet",
    headline: "Civilizations have always built instruments to see farther.",
    body: [
      "Telescopes expanded what humanity could observe.",
      "Computation expanded what humanity could calculate.",
      "The next frontier is expanding what humanity can understand about interacting systems before consequential decisions are made.",
    ],
    claimClass: "ambition",
  },
};

/** §14 — the museum of existing instruments. */
export type Instrument = {
  id: string;
  name: string;
  question: string;
  strength: string;
  limitation: string;
};

export const INSTRUMENTS: readonly Instrument[] = [
  {
    id: "dashboards",
    name: "Dashboards",
    question: "What is happening?",
    strength: "Monitoring known variables, continuously and reliably.",
    limitation:
      "They do not necessarily expose the full causal structure between changing systems. A dashboard shows that a number moved; the mechanism sits outside the frame.",
  },
  {
    id: "historical-models",
    name: "Historical models",
    question: "What happened before?",
    strength: "Powerful and well-understood while the underlying relationships remain stable.",
    limitation:
      "Fragile under regime change, because the relationships that generated the training data are exactly what a regime change alters.",
  },
  {
    id: "search",
    name: "Search and news",
    question: "What happened?",
    strength: "Massive evidence availability, close to real time.",
    limitation:
      "Evidence arrives fragmented across domains and vocabularies, with no structure that would let two documents about the same dependency recognise one another.",
  },
  {
    id: "analysts",
    name: "Human analysts",
    question: "What does it mean?",
    strength: "Deep contextual reasoning, and the judgement to know which question matters.",
    limitation:
      "Time, scale and attention constraints. There are more consequential interactions than there are analyst-hours to trace them.",
  },
  {
    id: "simulation",
    name: "Simulation",
    question: "What if?",
    strength: "Rigorous and quantitative within a defined set of assumptions.",
    limitation:
      "Results depend on scope and model assumptions that are usually fixed in advance, which makes the interesting case — the assumption that stopped being true — the hardest one to test.",
  },
  {
    id: "consulting",
    name: "Consulting and research",
    question: "What should we think?",
    strength: "High-value synthesis across domains, at a depth no single team can reach alone.",
    limitation:
      "Often episodic rather than continuously updated. The world keeps moving after the report is delivered.",
  },
];

/** §27 — the empirical standard, stated before there is anything to defend. */
export const PROOF_QUESTIONS: readonly string[] = [
  "Did the system identify consequential risks earlier?",
  "Were its probabilities better calibrated?",
  "Did it reveal causal pathways existing systems missed?",
  "Could the user intervene before the loss occurred?",
];

/** §26 — the investment argument as an ordered chain. */
export const INVESTMENT_CHAIN: readonly string[] = [
  "THE WORLD'S STRUCTURE IS CHANGING",
  "INTERDEPENDENCIES ARE BECOMING STRATEGIC",
  "SMALL SHOCKS CAN CREATE NONLINEAR LOSSES",
  "HISTORICAL RELATIONSHIPS CAN BREAK",
  "AI CAN PROCESS EVIDENCE AT NEW SCALE",
  "CAUSAL STRUCTURE CAN CONNECT THAT EVIDENCE",
  "YUKTHI BUILDS THE CONTINUOUS WORLD MODEL",
];

/** §25 — the two economic chains, shown against one another. */
export const LOSS_CHAIN: readonly string[] = [
  "HIDDEN DEPENDENCY",
  "UNSEEN CHANGE",
  "DELAYED DETECTION",
  "CASCADE",
  "LOSS / DISRUPTION",
];

export const VISIBILITY_CHAIN: readonly string[] = [
  "CAUSAL VISIBILITY",
  "EARLIER DETECTION",
  "BETTER REASONING",
  "EARLIER INTERVENTION",
  "POTENTIAL RESILIENCE / LOSS AVOIDANCE",
];

/** §28 — the closing address. */
export const FINALE_LINES: readonly string[] = [
  "UNDERSTAND WHAT IS CHANGING.",
  "REASON ABOUT WHAT COMES NEXT.",
  "MAKE ROBUST DECISIONS BEFORE UNCERTAINTY BECOMES CATASTROPHE.",
];
