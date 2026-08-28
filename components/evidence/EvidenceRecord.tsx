import { ExternalLink } from "@/components/ui/ExternalLink";
import type { Evidence } from "@/lib/graph/types";
import { cn } from "@/lib/utils/cn";

/* ============================================================================
   EVIDENCE RECORD  (§33)
   ----------------------------------------------------------------------------
   Six fields, always in the same order, always visually distinct: source,
   organization, date, claim, what it supports, Yukthi's interpretation.

   The separation between the fourth and the sixth field is the entire point of
   this component. What the document says and what Yukthi concludes from it are
   never allowed to occupy the same paragraph.
   ========================================================================== */

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1 sm:grid-cols-[10rem_1fr] sm:gap-6">
      <dt className="label-dim pt-0.5">{label}</dt>
      <dd className="text-[0.9rem] leading-relaxed text-bone/88">{children}</dd>
    </div>
  );
}

export function EvidenceRecord({
  evidence,
  className,
}: {
  evidence: Evidence;
  className?: string;
}) {
  return (
    <article className={cn("panel p-5 sm:p-7", className)} aria-labelledby={`ev-${evidence.id}`}>
      <dl className="space-y-4">
        <Field label="Source">
          <h3
            id={`ev-${evidence.id}`}
            className="font-display text-[1.05rem] leading-snug text-bone"
          >
            {evidence.title}
          </h3>
        </Field>
        <Field label="Organization">{evidence.organization}</Field>
        <Field label="Date">{evidence.date ?? "Undated"}</Field>
        <Field label="Claim">{evidence.claim}</Field>
        <Field label="What this supports">{evidence.supports}</Field>
        <Field label="Yukthi interpretation">
          <span className="text-bone/75">{evidence.interpretation}</span>
        </Field>
        <Field label="Locate">
          {evidence.url ? (
            <ExternalLink href={evidence.url}>{evidence.url}</ExternalLink>
          ) : (
            <span className="text-ash">{evidence.locator}</span>
          )}
        </Field>
      </dl>

      <p className="mt-6 border-t border-graphite pt-4 font-mono text-[0.66rem] leading-relaxed tracking-[0.1em] text-ash">
        Cited in: {evidence.usedIn.join(" · ")}
      </p>
    </article>
  );
}
