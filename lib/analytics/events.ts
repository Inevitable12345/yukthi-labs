/**
 * The complete set of events this site may emit.
 *
 * The list is closed on purpose: analytics exists to learn which parts of the
 * argument are read, not to profile readers. No event carries free text, a URL a
 * reader typed, or the contents of anything they inspected beyond its stable ID.
 */
export const ANALYTICS_EVENTS = [
  "thesis_section_view",
  "evidence_open",
  "causal_node_open",
  "scenario_select",
  "architecture_explore",
  "research_open",
  "outbound_source_click",
  "contact_intent",
] as const;

export type AnalyticsEvent = (typeof ANALYTICS_EVENTS)[number];

/** Property values are constrained to primitives that cannot smuggle personal data. */
export type AnalyticsProps = Record<string, string | number | boolean>;
