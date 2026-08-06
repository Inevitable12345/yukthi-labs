import {
  CalendarDays,
  FileText,
  Landmark,
  MapPin,
  MonitorPlay,
  Presentation,
} from "lucide-react";
import { conference } from "@/content/conference";
import { keyAreas } from "@/content/key-areas";

/**
 * Editorial fact panel used where a decorative illustration used to sit.
 *
 * The About sections are two-column layouts; rather than fill the second
 * column with generic vector art, it now carries the details a first-time
 * visitor actually needs. Everything here is read from the content files, so
 * it can never drift out of step with the rest of the site.
 */
const rows = [
  {
    icon: CalendarDays,
    label: "Dates",
    value: conference.dates.label,
  },
  {
    icon: MonitorPlay,
    label: "Mode",
    value: conference.mode,
  },
  {
    icon: MapPin,
    label: "Venue",
    value: "SCSVMV, Enathur, Kanchipuram",
  },
  {
    icon: FileText,
    label: "Submission closes",
    value: "September 5, 2026",
  },
  {
    icon: Presentation,
    label: "Format",
    value: `Oral presentation across ${keyAreas.length} key areas`,
  },
  {
    icon: Landmark,
    label: "Publication",
    value: "Considered for the conference proceedings with ISBN",
  },
];

export function AtAGlance() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-line bg-white">
      {/* Single gradient rule — the only decoration on the panel. */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-royal via-violet to-magenta"
      />

      <div className="border-b border-line px-6 py-5">
        <p className="eyebrow">
          <span aria-hidden="true" className="inline-block h-px w-7 bg-royal/50" />
          At a glance
        </p>
        <p className="mt-2 font-display text-xl font-bold text-deep">
          {conference.acronym}
        </p>
        <p className="mt-1 text-sm text-ink-soft">{conference.fullTitle}</p>
      </div>

      <dl className="divide-y divide-line">
        {rows.map((row) => (
          <div key={row.label} className="flex items-start gap-3.5 px-6 py-4">
            <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-lg bg-surface-blue text-royal">
              <row.icon className="size-4.5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <dt className="text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-ink-soft">
                {row.label}
              </dt>
              <dd className="mt-0.5 font-display text-[0.98rem] font-semibold leading-snug text-deep">
                {row.value}
              </dd>
            </div>
          </div>
        ))}
      </dl>

      <div className="border-t border-line bg-surface px-6 py-4">
        <p className="flex flex-wrap gap-x-4 gap-y-1.5">
          {conference.taglines.map((tagline) => (
            <span
              key={tagline}
              className="font-display text-[0.78rem] font-semibold text-royal"
            >
              {tagline}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}
