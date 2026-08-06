/**
 * Important dates.
 *
 * Only the three milestones printed on the official poster appear here.
 * Do not add speculative dates (notification of acceptance, camera-ready,
 * programme release) without written approval from the organising committee.
 */

export type Milestone = {
  id: string;
  label: string;
  dateLabel: string;
  /** ISO date used for countdowns, sorting and structured data. */
  dateISO: string;
  description: string;
  /** `deadline` renders in the urgent accent; `event` renders as the finale. */
  kind: "deadline" | "event";
};

export const importantDates: Milestone[] = [
  {
    id: "submission",
    label: "Registration & Paper Submission",
    dateLabel: "September 5, 2026",
    dateISO: "2026-09-05T23:59:59+05:30",
    description:
      "Last date for registration and submission of papers.",
    kind: "deadline",
  },
  {
    id: "acceptance",
    label: "Paper Acceptance & Payment",
    dateLabel: "September 10, 2026",
    dateISO: "2026-09-10T23:59:59+05:30",
    description: "Last date for paper acceptance and payment.",
    kind: "deadline",
  },
  {
    id: "conference",
    label: "Conference Dates",
    dateLabel: "September 18–19, 2026",
    dateISO: "2026-09-18T09:00:00+05:30",
    description:
      "ICRTET-2026 is held in hybrid mode at SCSVMV, Kanchipuram, Tamil Nadu.",
    kind: "event",
  },
];

/**
 * The next milestone that has not yet passed — used to highlight one glowing
 * dot on the timeline. Falls back to the final milestone once all have passed.
 */
export function getNextMilestone(now: Date = new Date()): Milestone {
  return (
    importantDates.find((m) => new Date(m.dateISO).getTime() > now.getTime()) ??
    importantDates[importantDates.length - 1]
  );
}
