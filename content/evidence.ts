/* ============================================================================
   EVIDENCE LIBRARY  (§33, §46)
   ----------------------------------------------------------------------------
   Rules this file obeys without exception:

     • Every record names a real organisation and a real document.
     • `claim` states only what that document reports.
     • `interpretation` is Yukthi's reading, and is never presented as the
       source's own conclusion.
     • `url` appears only where a stable published address is known. Where it is
       not, `locator` says precisely how to find the document instead. A link
       that might rot into a 404 is worse than no link, and an invented link is
       not permitted at all.
     • No figure appears here that its named source does not report.
   ========================================================================== */

import type { Evidence } from "@/lib/graph/types";

export const EVIDENCE: readonly Evidence[] = [
  {
    id: "mofcom-rare-earth-controls",
    title: "Export control measures on certain medium and heavy rare-earth related items",
    organization: "Ministry of Commerce of the People's Republic of China",
    date: "April 2025",
    locator:
      "MOFCOM / General Administration of Customs joint announcement, 4 April 2025, published on mofcom.gov.cn.",
    claim:
      "China introduced export licensing requirements covering seven medium and heavy rare-earth elements — samarium, gadolinium, terbium, dysprosium, lutetium, scandium and yttrium — together with related magnet and processed items.",
    supports:
      "A policy decision taken at one point in a supply chain can change the availability of inputs to industries that never negotiated with the decision-maker.",
    interpretation:
      "The instrument here is administrative, not physical. Nothing was mined less, shipped slower or consumed faster; a licensing requirement was added. Yukthi's reading is that the consequential variable for a downstream manufacturer was a change in policy structure, and that structural change is exactly what a historical demand-and-price model is not built to see.",
    usedIn: ["Room 03 — Chokepoint", "Room 16 — Simulate", "/evidence", "/thesis"],
  },
  {
    id: "usgs-rare-earth-concentration",
    title: "Mineral Commodity Summaries — Rare Earths",
    organization: "United States Geological Survey",
    date: "Published annually",
    url: "https://www.usgs.gov/centers/national-minerals-information-center/rare-earths-statistics-and-information",
    claim:
      "The USGS reports that global rare-earth mine production is highly concentrated, with China the largest producing country, and that separation and refining capacity is more concentrated still than mining.",
    supports:
      "Concentration downstream of extraction is the binding constraint, not the location of the ore.",
    interpretation:
      "Reserves are widely distributed; the capability to separate mixed rare-earth oxides into usable elements is not. Yukthi treats processing concentration, rather than geological endowment, as the node that carries systemic consequence — which is why a map of deposits answers the wrong question.",
    usedIn: ["Room 03 — Chokepoint", "Room 07 — Convergence", "/evidence"],
  },
  {
    id: "iea-critical-minerals-outlook",
    title: "Global Critical Minerals Outlook",
    organization: "International Energy Agency",
    date: "2024",
    url: "https://www.iea.org/reports/global-critical-minerals-outlook-2024",
    claim:
      "The IEA reports that refining and processing of several critical minerals remains concentrated in a small number of countries, and identifies that concentration as a supply-security concern for energy technologies.",
    supports:
      "Concentration risk in critical minerals is documented by a mainstream energy institution, not inferred by Yukthi.",
    interpretation:
      "The IEA describes the concentration. It does not attempt to trace, continuously, what a change at one of those processing nodes would do to a specific manufacturer's programme three steps downstream. That traversal is the work Yukthi is building.",
    usedIn: ["Room 03 — Chokepoint", "Room 07 — Convergence", "/evidence", "/technology"],
  },
  {
    id: "sia-bcg-supply-chain",
    title: "Strengthening the Global Semiconductor Supply Chain in an Uncertain Era",
    organization: "Semiconductor Industry Association and Boston Consulting Group",
    date: "April 2021",
    locator: "Joint SIA/BCG report, published at semiconductors.org.",
    claim:
      "The report finds that manufacturing capacity for the most advanced logic nodes is concentrated in a very small number of facilities in East Asia, and characterises this concentration as a single point of failure for the global electronics supply chain.",
    supports:
      "Physical concentration of an irreplaceable capability creates exposure that no individual buyer can diversify away.",
    interpretation:
      "Yukthi reads this as a structural rather than a commercial fact. A firm can second-source a component; it cannot second-source a fabrication capability that exists in one place. Exposure of that kind belongs in a causal model of the world, not in a supplier scorecard.",
    usedIn: ["Room 04 — Cascade", "Room 07 — Convergence", "/evidence"],
  },
  {
    id: "alixpartners-auto-chip",
    title: "Semiconductor shortage impact on global automotive revenue",
    organization: "AlixPartners",
    date: "September 2021",
    locator: "AlixPartners forecast, published at alixpartners.com.",
    claim:
      "AlixPartners estimated that the semiconductor shortage would cost the global automotive industry approximately US$210 billion in revenue during 2021.",
    supports:
      "A shortage of a low-cost component produced a loss several orders of magnitude larger than the component market itself.",
    interpretation:
      "This figure is a consultancy's estimate, not a measured outcome, and Yukthi cites it as such. What matters for the thesis is the ratio, not the precision: the value at risk was set by what the component enabled, not by what the component cost.",
    usedIn: ["Room 03 — Chokepoint", "Room 19 — The bet", "/evidence"],
  },
  {
    id: "ecb-projection-errors",
    title: "What explains recent errors in the inflation projections of Eurosystem and ECB staff?",
    organization: "European Central Bank",
    date: "Economic Bulletin, Issue 3/2022",
    url: "https://www.ecb.europa.eu/press/economic-bulletin/html/index.en.html",
    claim:
      "The ECB examined why its staff inflation projections had under-predicted realised inflation, attributing the errors substantially to energy price developments and to conditions that historical relationships had not anticipated.",
    supports:
      "A well-resourced institution publicly documented the failure of its own historical models under changed conditions.",
    interpretation:
      "Yukthi does not read this as evidence that forecasting is futile. It reads it as the clearest available statement of the failure mode: models estimated on one regime lose reliability when the relationships that generated their training data stop holding. The correct response is to model the structure that changed, not to fit the curve harder.",
    usedIn: ["Room 05 — Structural break", "/evidence", "/thesis"],
  },
  {
    id: "ferc-nerc-uri",
    title:
      "The February 2021 Cold Weather Outages in Texas and the South Central United States — FERC, NERC and Regional Entity staff report",
    organization:
      "Federal Energy Regulatory Commission and North American Electric Reliability Corporation",
    date: "November 2021",
    locator: "Joint FERC/NERC staff inquiry report, published at ferc.gov and nerc.com.",
    claim:
      "The joint inquiry found that freezing conditions caused widespread generating unit outages and simultaneous declines in natural gas production, and that loss of electricity supply to natural gas infrastructure contributed in turn to further reductions in gas available to generators.",
    supports: "Electricity and gas did not fail independently. Each failure degraded the other.",
    interpretation:
      "This is the reference case for a self-amplifying system. Yukthi's reading is that the severity was produced by the coupling, not by either sector's own fragility, and that a monitoring system watching each sector separately would have seen two manageable problems rather than one escalating loop.",
    usedIn: ["Room 06 — Feedback", "/evidence", "/thesis"],
  },
  {
    id: "iea-electricity-2024",
    title: "Electricity 2024 — Analysis and forecast to 2026",
    organization: "International Energy Agency",
    date: "January 2024",
    url: "https://www.iea.org/reports/electricity-2024",
    claim:
      "The IEA reported that electricity consumption from data centres, artificial intelligence and the cryptocurrency sector reached an estimated 460 TWh in 2022, and projected that it could exceed 1,000 TWh by 2026.",
    supports:
      "Computation has become a first-order claim on electrical infrastructure within a single planning cycle.",
    interpretation:
      "Yukthi treats this as the join between two systems that used to be analysed apart. Once compute demand is an electricity question, it is also a grid-equipment question, a critical-minerals question and a permitting question — and those dependencies run through nodes that no AI roadmap contains.",
    usedIn: ["Room 07 — Convergence", "/evidence", "/technology"],
  },
  {
    id: "iea-grids",
    title: "Electricity Grids and Secure Energy Transitions",
    organization: "International Energy Agency",
    date: "October 2023",
    url: "https://www.iea.org/reports/electricity-grids-and-secure-energy-transitions",
    claim:
      "The IEA reported that grid investment and expansion are not keeping pace with the growth of electricity demand and generation connections, and identified lengthening lead times for grid equipment and long permitting timelines as constraints.",
    supports: "The physical layer beneath the digital economy has multi-year response times.",
    interpretation:
      "Lead time is the property that converts a shortage into a cascade. Yukthi's reading is that when the constrained node takes years to relieve and the demand shock takes months to arrive, ordering matters more than magnitude — which is a causal question, not a forecasting one.",
    usedIn: ["Room 07 — Convergence", "Room 18 — The 3 a.m. problem", "/evidence"],
  },
  {
    id: "imf-fragmentation",
    title: "Geo-Economic Fragmentation and the Future of Multilateralism",
    organization: "International Monetary Fund",
    date: "January 2023",
    locator: "IMF Staff Discussion Note SDN/2023/001, published at imf.org.",
    claim:
      "IMF staff described a policy-driven reversal of global economic integration, and analysed channels — trade restriction, technology diffusion, capital flows, migration — through which fragmentation imposes costs.",
    supports:
      "The change in the world's economic structure is documented by the institution most invested in the previous structure.",
    interpretation:
      "Yukthi's reading is narrower than the IMF's. Fragmentation is not primarily a growth story here; it is a topology story. When integration reverses, dependencies do not disappear — they become fewer, longer and more politically conditioned, which raises the consequence of any single one being cut.",
    usedIn: ["Room 02 — Rupture", "/evidence", "/thesis"],
  },
  {
    id: "chips-act",
    title: "CHIPS and Science Act of 2022",
    organization: "United States Congress",
    date: "August 2022",
    locator: "Public Law 117-167, published at congress.gov.",
    claim:
      "The Act appropriated federal funding to support domestic semiconductor manufacturing, research and workforce development, and attached conditions on recipients' investment in certain foreign jurisdictions.",
    supports:
      "Industrial policy returned as a routine instrument of major economies, changing where capacity is built and on what terms.",
    interpretation:
      "For a causal model the significant feature is the conditionality, not the appropriation. Public money now arrives attached to constraints on where a recipient may operate, which means a firm's location decisions became a function of policy in a way that its historical cost model does not represent.",
    usedIn: ["Room 02 — Rupture", "/evidence"],
  },
  {
    id: "eu-chips-act",
    title:
      "Regulation (EU) 2023/1781 establishing a framework of measures for strengthening Europe's semiconductor ecosystem",
    organization: "European Union",
    date: "September 2023",
    locator: "Published in the Official Journal of the European Union, eur-lex.europa.eu.",
    claim:
      "The European Chips Act established a framework of measures intended to strengthen semiconductor manufacturing capacity in the Union, including a mechanism for monitoring supply and responding to shortages.",
    supports:
      "Multiple major economies moved simultaneously toward strategic capacity policy, rather than one acting alone.",
    interpretation:
      "Simultaneity is the point. When several large economies each act to secure the same capability, the aggregate result is not the sum of the individual policies — it is a competitive reallocation of the same finite equipment, talent and inputs. That interaction is invisible in any single jurisdiction's plan.",
    usedIn: ["Room 02 — Rupture", "/evidence"],
  },
  {
    id: "suez-ever-given",
    title: "Grounding of the container vessel Ever Given in the Suez Canal",
    organization: "Suez Canal Authority",
    date: "March 2021",
    locator: "Suez Canal Authority statements, 23–29 March 2021, suezcanal.gov.eg.",
    claim:
      "A container vessel grounded in the Suez Canal on 23 March 2021 and was refloated on 29 March 2021, halting transits through the canal in both directions during that period.",
    supports:
      "A single physical obstruction of finite duration produced disruption far beyond the vessels immediately queued behind it.",
    interpretation:
      "Yukthi cites this as the most legible possible demonstration that consequence is carried by position in a network rather than by scale of event. Six days is nothing. The location was everything.",
    usedIn: ["Room 04 — Cascade", "/evidence"],
  },
  {
    id: "panama-canal-draught",
    title: "Transit restrictions during low water levels at Gatun Lake",
    organization: "Panama Canal Authority",
    date: "2023–2024",
    locator: "Panama Canal Authority advisories to shipping, pancanal.com.",
    claim:
      "The Panama Canal Authority reduced the number of daily vessel transits and imposed draft restrictions in response to low water levels in the canal watershed.",
    supports:
      "A hydrological condition became a trade-capacity constraint through an infrastructure dependency.",
    interpretation:
      "Rainfall and freight rates are not conventionally modelled together. Yukthi's reading is that the canal is the mechanism that joins them, and that the general case — a physical dependency quietly linking two domains that separate teams monitor separately — is common rather than exotic.",
    usedIn: ["Room 07 — Convergence", "/evidence"],
  },
] as const;

export const EVIDENCE_BY_ID: Record<string, Evidence> = Object.fromEntries(
  EVIDENCE.map((record) => [record.id, record]),
);

export function evidenceFor(ids: readonly string[] | undefined): Evidence[] {
  if (!ids) return [];
  return ids
    .map((id) => EVIDENCE_BY_ID[id])
    .filter((record): record is Evidence => Boolean(record));
}
