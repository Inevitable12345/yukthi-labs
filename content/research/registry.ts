import type { ComponentType } from "react";

/**
 * Research.
 *
 * Deliberately empty.
 *
 * This route exists for technical notes, experiments, evaluations and benchmark
 * results. None have been produced, so none are listed. Publishing placeholder
 * papers here — or dressing the field notes up as research — would be the exact
 * failure mode this site is built to avoid.
 *
 * Adding a real entry is one `.mdx` file and one line in `entries`.
 */
export type ResearchMeta = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  kind: "paper" | "technical-note" | "experiment" | "evaluation" | "benchmark";
  status: "draft" | "published";
};

export type ResearchEntry = ResearchMeta & { Content: ComponentType };

const entries: ResearchEntry[] = [];

export const researchEntries: ResearchEntry[] = [...entries].sort((a, b) =>
  b.date.localeCompare(a.date),
);

export function getResearchEntry(slug: string): ResearchEntry | undefined {
  return researchEntries.find((entry) => entry.slug === slug);
}
