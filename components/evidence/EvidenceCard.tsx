import type { EvidenceRecord } from "@/data/schema";
import { EvidenceStatusChip } from "./EvidenceStatusChip";
import { OutboundSourceLink } from "./OutboundSourceLink";
import { InstrumentLabel } from "@/components/ui/InstrumentLabel";
import { cn } from "@/lib/utils/cn";

/**
 * A source record, rendered in full: claim, provenance, context, causal relevance
 * and verification status. Provenance is never reduced to a footnote number.
 */
export function EvidenceCard({
  record,
  className,
  compact = false,
}: {
  record: EvidenceRecord;
  className?: string;
  compact?: boolean;
}) {
  return (
    <article className={cn("relative", className)}>
      <div className="flex flex-wrap items-center gap-3">
        <InstrumentLabel tone="gold" className="tabular-nums">
          {record.id}
        </InstrumentLabel>
        <EvidenceStatusChip status={record.status} />
      </div>

      <h3 className="mt-3 text-[0.9375rem] leading-snug text-bone">{record.title}</h3>

      <p className="mt-3 text-[0.875rem] leading-relaxed text-muted-bone">{record.claim}</p>

      <dl className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2">
        <div>
          <dt className="u-instrument">Source</dt>
          <dd className="mt-1 text-[0.8125rem] text-bone">
            {record.organization ?? "Not recorded"}
          </dd>
        </div>
        <div>
          <dt className="u-instrument">Date</dt>
          <dd className="mt-1 font-mono text-[0.8125rem] text-muted-bone tabular-nums">
            {record.date ?? "Not recorded"}
          </dd>
        </div>
        {record.publication ? (
          <div className="sm:col-span-2">
            <dt className="u-instrument">Publication</dt>
            <dd className="mt-1 text-[0.8125rem] leading-relaxed text-muted-bone">
              {record.publication}
            </dd>
          </div>
        ) : null}
      </dl>

      {!compact && record.context ? (
        <div className="mt-5">
          <InstrumentLabel as="p">Context</InstrumentLabel>
          <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-muted-bone">
            {record.context}
          </p>
        </div>
      ) : null}

      {!compact && record.causalRelevance ? (
        <div className="mt-5 border-l border-[color:var(--color-gold-dim)] pl-4">
          <InstrumentLabel as="p" tone="gold">
            Causal relevance
          </InstrumentLabel>
          <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-muted-bone">
            {record.causalRelevance}
          </p>
        </div>
      ) : null}

      <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2">
        {record.url ? (
          <OutboundSourceLink href={record.url} evidenceId={record.id}>
            Open source
          </OutboundSourceLink>
        ) : (
          <span className="font-mono text-[0.625rem] tracking-[0.16em] text-dim-bone uppercase">
            No stable link recorded
          </span>
        )}
        {record.accessedAt ? (
          <InstrumentLabel className="tabular-nums">
            Checked {record.accessedAt}
          </InstrumentLabel>
        ) : null}
      </div>
    </article>
  );
}
