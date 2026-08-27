import { evidenceRecordSchema, type EvidenceCategory, type EvidenceRecord } from "./schema";

/* ============================================================================
   EVIDENCE LIBRARY
   ----------------------------------------------------------------------------
   Every factual claim made anywhere on this site resolves to a record here, and
   every record names a real, publicly retrievable document.

   The rules governing this file, without exception:

     · no claim is written that the named source does not support;
     · figures keep the units, scenario conditions and hedges of the original —
       a range is never quoted as a point estimate;
     · `status: "verified"` means the claim was checked against the cited
       publication; `needs-verification` means it has not been, and the site
       says so wherever the record is shown;
     · `context` records what the number does not say. It is not optional
       decoration: a figure without its limits is a misquotation.

   `accessedAt` records when the source was last checked, not when it was written.
   ========================================================================== */

const ACCESSED = "2026-08-27";

const records: EvidenceRecord[] = [
  /* --- FRAGMENTATION ---------------------------------------------------- */
  {
    id: "E-001",
    title: "Output cost of geoeconomic fragmentation",
    organization: "International Monetary Fund",
    publication:
      "Staff Discussion Note SDN/2023/001 — Geoeconomic Fragmentation and the Future of Multilateralism",
    date: "2023-01",
    url: "https://www.imf.org/-/media/files/publications/sdn/2023/english/sdnea2023001.pdf",
    claim:
      "IMF staff estimate long-term output losses from trade fragmentation ranging from about 0.2% of global GDP in a limited-fragmentation scenario to nearly 7% in a severe scenario; adding technological decoupling raises losses to 8–12% of GDP in some economies.",
    context:
      "A scenario range, not a forecast. The spread between 0.2% and 7% is itself the finding: the cost depends on how fast fragmentation happens and how far substitution can go.",
    methodology:
      "Model-based scenario analysis synthesising several modelling approaches. The bounds correspond to assumptions about the depth of decoupling, not to confidence intervals.",
    causalRelevance:
      "Establishes that the arrangement of the trading system is itself an economic variable. If structure can move output by several percent, then structure belongs inside the model rather than in its assumptions.",
    categories: ["fragmentation"],
    status: "verified",
    accessedAt: ACCESSED,
  },
  {
    id: "E-002",
    title: "Real income loss under decoupling into two blocs",
    organization: "World Trade Organization",
    publication:
      "Staff Working Paper ERSD-2022-09 — The Impact of Geopolitical Conflicts on Trade, Growth, and Innovation",
    date: "2022",
    url: "https://www.wto.org/english/res_e/reser_e/ersd202209_e.htm",
    claim:
      "WTO simulation work finds that decoupling the world economy into two isolated trading blocs would reduce global real income by roughly 5% in the long run, with losses distributed unevenly across blocs.",
    context:
      "An illustrative simulation, described as such by its authors. It models full decoupling, which is a bound rather than an expectation.",
    methodology:
      "General-equilibrium simulation. Independent in method from the IMF work in E-001, which is why the agreement in order of magnitude carries weight.",
    causalRelevance:
      "Two different modelling traditions reaching the same scale is stronger evidence than either alone.",
    categories: ["fragmentation"],
    status: "verified",
    accessedAt: ACCESSED,
  },
  {
    id: "E-003",
    title: "Is the global economy fragmenting?",
    organization: "World Trade Organization",
    publication: "Staff Working Paper ERSD-2023-10 — Is the Global Economy Fragmenting?",
    date: "2023",
    url: "https://www.wto.org/english/res_e/reser_e/ersd202310_e.pdf",
    claim:
      "WTO staff find measurable signs that trade is reorganising along geopolitical lines — trade growth between blocs slowing relative to trade within them — while stopping short of concluding that global fragmentation is an established state.",
    context:
      "Explicitly cautious. The authors distinguish reorganisation visible in the data from fragmentation as a completed condition, and this site preserves that distinction.",
    causalRelevance:
      "Evidence that the topology of trade is being redrawn rather than merely disturbed. Reorganisation is precisely the condition under which historically fitted relationships stop transferring.",
    categories: ["fragmentation", "structural-breaks"],
    status: "verified",
    accessedAt: ACCESSED,
  },
  {
    id: "E-004",
    title: "Geoeconomic confrontation ranked the leading near-term global risk",
    organization: "World Economic Forum",
    publication: "The Global Risks Report 2026",
    date: "2026-01",
    url: "https://www.weforum.org/publications/global-risks-report-2026/digest/",
    claim:
      "In the Global Risks Report 2026, geoeconomic confrontation is ranked the risk most likely to trigger a material global crisis in the coming year, cited by 18% of respondents, ahead of state-based armed conflict at 14%.",
    context:
      "A survey of perceived risk, not a measurement of realised probability. It records expert expectation — which is itself a driver of the hedging, stockpiling and industrial policy that follow.",
    methodology:
      "Opinion survey of the report's respondent panel. Susceptible to salience effects: recent events raise their own ranking.",
    causalRelevance:
      "Perception feeds back into behaviour. Expected confrontation produces the defensive positioning that makes confrontation more likely — a loop, not an observation.",
    categories: ["fragmentation"],
    status: "verified",
    accessedAt: ACCESSED,
  },

  /* --- CRITICAL MINERALS ------------------------------------------------ */
  {
    id: "E-005",
    title: "Export licensing on medium and heavy rare earths",
    organization: "Center for Strategic and International Studies",
    publication:
      "China's New Rare Earth and Magnet Restrictions Threaten U.S. Defense Supply Chains",
    date: "2025-04",
    url: "https://www.csis.org/analysis/chinas-new-rare-earth-and-magnet-restrictions-threaten-us-defense-supply-chains",
    claim:
      "On 4 April 2025 China introduced export licensing requirements covering seven medium and heavy rare earth elements — samarium, gadolinium, terbium, dysprosium, lutetium, scandium and yttrium — together with certain permanent magnets.",
    context:
      "A licensing regime, not an embargo. The constraint is administrative: shipments continue, but only at the rate licences are granted.",
    causalRelevance:
      "The upstream control event in the rare-earth cascade. Its significance is that a paperwork step, rather than a physical shortage, becomes the rate limiter for downstream production.",
    categories: ["critical-minerals", "fragmentation"],
    status: "verified",
    accessedAt: ACCESSED,
  },
  {
    id: "E-006",
    title: "Concentration of rare-earth refining capacity",
    organization: "International Energy Agency",
    publication: "Global Critical Minerals Outlook 2025",
    date: "2025-05",
    url: "https://www.iea.org/reports/global-critical-minerals-outlook-2025/executive-summary",
    claim:
      "The IEA reports that refining and separation of rare earth elements remains among the most concentrated stages of any critical-mineral supply chain, with China holding roughly 90% of global refining capacity, and projects that share falling toward about 70% by 2035 as new projects come online.",
    context:
      "Concentration is measured at the refining stage, not at the mine. Mined production is materially more distributed than processing — which is exactly why the chokepoint sits where it does.",
    methodology:
      "Capacity accounting by processing stage, with the 2035 figure resting on announced projects delivering to schedule. Announced capacity is not delivered capacity.",
    causalRelevance:
      "Concentration converts an ordinary commercial input into a chokepoint. One jurisdiction's administrative decision propagates globally only because alternative paths do not yet exist at scale.",
    categories: ["critical-minerals", "energy"],
    status: "verified",
    accessedAt: ACCESSED,
  },
  {
    id: "E-007",
    title: "Downstream activity exposed to rare-earth export restriction",
    organization: "International Energy Agency",
    publication: "Rare Earth Elements — Executive summary",
    date: "2026",
    url: "https://www.iea.org/reports/rare-earth-elements/executive-summary",
    claim:
      "The IEA estimates that under full implementation of rare-earth export controls, up to USD 6.5 trillion of annual economic activity outside China could be exposed, with automotive carrying over USD 3 trillion of that direct exposure, and the United States and Europe each facing more than USD 1.5 trillion.",
    context:
      "This is exposed downstream activity under a full-implementation scenario. It is not a loss that has occurred, and not a prediction that it will. It measures how much output sits behind the chokepoint, not how much would stop.",
    methodology:
      "Exposure accounting: output of sectors dependent on the constrained input. Exposure is an upper envelope — substitution, inventory and redesign all reduce realised impact.",
    causalRelevance:
      "The quantitative statement of the asymmetry. A tightly held upstream input sits beneath an enormous downstream base; the ratio between them is what makes the node worth watching continuously.",
    categories: ["critical-minerals", "fragmentation"],
    status: "verified",
    accessedAt: ACCESSED,
  },
  {
    id: "E-008",
    title: "Export controls as a realised concentration risk",
    organization: "International Energy Agency",
    publication:
      "With new export controls on critical minerals, supply concentration risks become reality",
    date: "2025-04",
    url: "https://www.iea.org/commentaries/with-new-export-controls-on-critical-minerals-supply-concentration-risks-become-reality",
    claim:
      "The IEA characterises the 2025 critical-mineral export controls as the point at which long-identified supply concentration ceased to be a theoretical vulnerability and became an operating constraint on downstream manufacturers.",
    context:
      "An agency commentary rather than a modelled projection. Its value is the timing: the risk had been documented for years before it bound.",
    causalRelevance:
      "A latent relation becoming active. The structure did not change on the day of the announcement — the concentration was already there. What changed was the state of the edge.",
    categories: ["critical-minerals", "fragmentation"],
    status: "verified",
    accessedAt: ACCESSED,
  },

  /* --- SEMICONDUCTORS --------------------------------------------------- */
  {
    id: "E-009",
    title: "Semiconductor shortage cost to vehicle manufacturers, 2021",
    organization: "AlixPartners",
    publication: "2021 automotive industry semiconductor shortage forecast",
    date: "2021-09",
    url: "https://www.alixpartners.com/newsroom/press-release-shortages-related-to-semiconductors-to-cost-the-auto-industry-210-billion-in-revenues-this-year-says-new-alixpartners-forecast/",
    claim:
      "AlixPartners forecast that semiconductor-related shortages would cost the global automotive industry USD 210 billion in revenue during 2021 and remove 7.7 million units of vehicle production — revised upward from USD 110 billion and 3.9 million units four months earlier.",
    context:
      "A consultancy estimate. The revision matters as much as the level: the same analysts nearly doubled their figure within a single quarter as new causes kept arriving.",
    methodology:
      "Bottom-up production-loss modelling. Revised as additional disruptions — a fab fire, drought, COVID closures in assembly and test — entered the picture.",
    causalRelevance:
      "The revision is the evidence. A forecast that must double mid-year is a forecast whose causal structure was incomplete: pathways were active that the original model did not contain.",
    categories: ["semiconductors", "structural-breaks"],
    status: "verified",
    accessedAt: ACCESSED,
  },

  /* --- STRUCTURAL BREAKS ------------------------------------------------ */
  {
    id: "E-010",
    title: "Deterioration in Eurosystem and ECB staff inflation projections",
    organization: "European Central Bank",
    publication:
      "Economic Bulletin, Issue 2/2024 — An update on the accuracy of recent Eurosystem/ECB staff projections for short-term inflation",
    date: "2024-03",
    url: "https://www.ecb.europa.eu/press/economic-bulletin/focus/2024/html/ecb.ebbox202402_05~10d8d08f79.en.html",
    claim:
      "The ECB's own review finds that the accuracy of its short-term HICP inflation projections deteriorated markedly during 2021–22, with staff projections substantially underestimating the inflation surge, and attributes the errors principally to energy price dynamics and supply bottlenecks that the projection framework did not capture.",
    context:
      "A central bank publishing analysis of its own forecast errors. The point is not that errors occurred, but that they were concentrated exactly where the causal regime had changed.",
    methodology:
      "Ex-post decomposition of projection error by contributing component, against the institution's own published projection vintages.",
    causalRelevance:
      "The clearest available demonstration that forecasting capability is not the binding constraint. When the data-generating structure moves, a well-specified model of the previous structure fails on schedule.",
    categories: ["structural-breaks"],
    status: "verified",
    accessedAt: ACCESSED,
  },
  {
    id: "E-011",
    title: "Largest one-quarter-ahead euro area inflation projection error since 1998",
    organization: "European Central Bank",
    publication:
      "Economic Bulletin, Issue 3/2022 — What explains recent errors in the inflation projections of Eurosystem and ECB staff?",
    date: "2022-05",
    claim:
      "The ECB reports that the underestimation of first-quarter 2022 euro area inflation was the largest one-quarter-ahead projection error since Eurosystem staff projections began in 1998, a gap of roughly 2.0 percentage points against the December 2021 projection.",
    context:
      "Recorded here from a secondary summary of the relevant Economic Bulletin box. The primary document has not been read end to end, so this record stays unverified until it has been — and the site labels it as such wherever it appears.",
    causalRelevance:
      "Dates the structural break precisely. A record error in a mature, well-resourced forecasting institution marks the moment the relationships being extrapolated stopped holding.",
    categories: ["structural-breaks"],
    status: "needs-verification",
    accessedAt: ACCESSED,
  },

  /* --- ENERGY ----------------------------------------------------------- */
  {
    id: "E-012",
    title: "February 2021 cold weather outages in Texas and the South Central United States",
    organization: "FERC, NERC and Regional Entity staff",
    publication:
      "The February 2021 Cold Weather Outages in Texas and the South Central United States — final report",
    date: "2021-11",
    url: "https://www.ferc.gov/media/february-2021-cold-weather-outages-texas-and-south-central-united-states-ferc-nerc-and",
    claim:
      "The joint FERC/NERC inquiry into Winter Storm Uri documents the loss of approximately 61,800 MW of electric generation, with 1,045 individual generating units experiencing 4,124 outages, derates or failures to start, and more than 4.5 million customers losing power.",
    context:
      "A regulatory inquiry with full access to operator data, published nine months after the event. Freezing of generating equipment and loss of natural gas fuel supply were the two dominant causes.",
    methodology:
      "Post-event inquiry using mandatory data submissions from generator and gas operators — a census of what failed, not a sample or a reconstruction.",
    causalRelevance:
      "The canonical reinforcing cascade: electricity loss disabled gas infrastructure, which cut fuel to generation, which deepened electricity loss. The loop is the mechanism; the cold was only the trigger.",
    categories: ["energy"],
    status: "verified",
    accessedAt: ACCESSED,
  },
  {
    id: "E-013",
    title: "Data centre electricity demand to 2030",
    organization: "International Energy Agency",
    publication: "Energy and AI — Executive summary",
    date: "2025-04",
    url: "https://www.iea.org/reports/energy-and-ai/executive-summary",
    claim:
      "The IEA estimates data centre electricity consumption at around 415 TWh in 2024 — about 1.5% of global electricity — and projects it roughly doubling to about 945 TWh by 2030 in its base case, just under 3% of global consumption, growing about four times faster than total electricity demand.",
    context:
      "A base-case projection with wide stated uncertainty, and one the IEA revisits. The growth rate matters more than the level: it is the rate that collides with grid build-out timelines.",
    methodology:
      "Bottom-up demand modelling by facility type and region. Sensitive to assumptions about efficiency gains and about how much announced capacity is actually built.",
    causalRelevance:
      "The coupling point between the AI build-out and physical infrastructure. Compute demand becomes electricity demand, which becomes transformer and copper demand, which re-enters the critical-minerals chokepoint already established.",
    categories: ["energy", "critical-minerals", "ai-forecasting"],
    status: "verified",
    accessedAt: ACCESSED,
  },

  /* --- INSURANCE -------------------------------------------------------- */
  {
    id: "E-014",
    title: "Global insured losses from natural catastrophes, 2024",
    organization: "Swiss Re Institute",
    publication:
      "sigma 1/2025 — Natural catastrophes: insured losses on trend to USD 145 billion in 2025",
    date: "2025-04",
    url: "https://www.swissre.com/institute/research/sigma-research/sigma-2025-01-natural-catastrophes-trend.html",
    claim:
      "Swiss Re Institute reports global insured losses from natural catastrophes of USD 137 billion in 2024 against USD 318 billion of total economic losses — leaving 57% of the economic loss uninsured — with secondary perils such as severe convective storms, floods and wildfires driving the increase.",
    context:
      "Insured loss measures what was covered, not what happened. The 57% protection gap is the part of the exposure no risk model was pricing.",
    methodology:
      "Loss accounting from company reporting and catastrophe records, normalised for inflation. Economic-loss estimates carry wider error bars than insured-loss figures.",
    causalRelevance:
      "Loss is migrating toward frequent secondary perils whose accumulation depends on where exposure has been built, not on the return period of a single hazard. That is a change in causal structure, not only in weather.",
    categories: ["insurance", "energy"],
    status: "verified",
    accessedAt: ACCESSED,
  },

  /* --- AI FORECASTING --------------------------------------------------- */
  {
    id: "E-015",
    title: "Language model ensembles compared with a human crowd",
    organization: "Schoenegger, Tuminauskaite, Park and Tetlock",
    publication:
      "Wisdom of the silicon crowd: LLM ensemble prediction capabilities rival human crowd accuracy — Science Advances",
    date: "2024-09",
    url: "https://www.science.org/doi/10.1126/sciadv.adp1528",
    claim:
      "An ensemble of twelve language models making probabilistic forecasts across a three-month tournament was statistically indistinguishable from a crowd of 925 human forecasters, and beat a no-information benchmark.",
    context:
      "Indistinguishable from a human crowd — not from trained superforecasters, and over a limited question set. The result is about aggregation, not about any single model.",
    methodology:
      "Pre-registered forecasting tournament with resolution against real outcomes. Ensemble aggregation does much of the work; individual models were weaker.",
    causalRelevance:
      "Supports a narrow claim only: machine forecasting is now good enough to be a component in a larger process. It does not establish that a model can build an accurate world model.",
    categories: ["ai-forecasting"],
    status: "verified",
    accessedAt: ACCESSED,
  },
  {
    id: "E-016",
    title: "Retrieval-based language model forecasting system",
    organization: "Halawi, Zhang, Yueh-Han and Steinhardt",
    publication: "Approaching Human-Level Forecasting with Language Models — NeurIPS 2024",
    date: "2024",
    url: "https://arxiv.org/pdf/2402.18563",
    claim:
      "A retrieval-augmented language model system that searches for news, summarises it and produces calibrated probabilistic forecasts approaches — and under some conditions matches — the accuracy of an aggregated human crowd on binary forecasting questions.",
    context:
      "The title's verb is 'approaching'. Performance depends heavily on retrieval quality and on question selection, and does not surpass expert forecasters.",
    methodology:
      "Retrieval over a news corpus with a fixed information cut-off per question, scored against resolved outcomes to avoid look-ahead leakage.",
    causalRelevance:
      "Demonstrates the exact components Yukthi's bet depends on — search, evidence synthesis, probabilistic reasoning, continuous updating — working end to end. It says nothing about causal structure, which is the part still missing.",
    categories: ["ai-forecasting"],
    status: "verified",
    accessedAt: ACCESSED,
  },
  {
    id: "E-017",
    title: "Frontier models against expert forecasters",
    organization: "arXiv preprint",
    publication: "Evaluating LLMs on Real-World Forecasting Against Expert Forecasters",
    date: "2025-07",
    url: "https://arxiv.org/html/2507.04562v3",
    claim:
      "Evaluated on real-world forecasting questions, frontier models improved enough to surpass a general human crowd baseline — one model reaching a Brier score of 0.1352 against a crowd baseline of 0.149 — while still falling short of expert forecasters.",
    context:
      "A preprint, not peer-reviewed. Brier scores are comparable only within the same question set and resolution window, and the gap to expert forecasters persists.",
    causalRelevance:
      "Fixes the honest position precisely. Machine forecasting has crossed the crowd baseline and has not crossed the expert one. Any claim of AI superiority over superforecasters would go beyond this evidence.",
    categories: ["ai-forecasting"],
    status: "needs-verification",
    accessedAt: ACCESSED,
  },
];

/** Parsing at module scope: a malformed record fails the build, not a page view. */
export const evidenceRecords: EvidenceRecord[] = records.map((record) =>
  evidenceRecordSchema.parse(record),
);

export const evidenceById: Map<string, EvidenceRecord> = new Map(
  evidenceRecords.map((record) => [record.id, record]),
);

export function getEvidence(id: string): EvidenceRecord | undefined {
  return evidenceById.get(id);
}

export function getEvidenceMany(ids: readonly string[] = []): EvidenceRecord[] {
  return ids
    .map((id) => evidenceById.get(id))
    .filter((record): record is EvidenceRecord => record !== undefined);
}

export function evidenceByCategory(category: EvidenceCategory): EvidenceRecord[] {
  return evidenceRecords.filter((record) => record.categories.includes(category));
}

export const evidenceCounts = {
  total: evidenceRecords.length,
  verified: evidenceRecords.filter((record) => record.status === "verified").length,
  needsVerification: evidenceRecords.filter((record) => record.status === "needs-verification")
    .length,
};
