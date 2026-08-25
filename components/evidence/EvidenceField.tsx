"use client";

import { useMemo, useState } from "react";

import { EvidenceDrawer } from "./EvidenceDrawer";
import { EvidenceStatusChip } from "./EvidenceStatusChip";
import { InstrumentLabel } from "@/components/ui/InstrumentLabel";
import { evidenceRecords } from "@/data/evidence";
import type { EvidenceCategory } from "@/data/schema";
import { track } from "@/lib/analytics/analytics";
import { cn } from "@/lib/utils/cn";

const CATEGORY_LABEL: Record<EvidenceCategory, string> = {
  geopolitics: "Geopolitical fragmentation",
  "critical-minerals": "Critical minerals",
  "supply-chains": "Supply chains",
  energy: "Energy",
  insurance: "Insurance",
  markets: "Markets",
  "structural-breaks": "Structural breaks",
  "ai-forecasting": "AI forecasting",
};

const FIELD_ORDER: EvidenceCategory[] = [
  "geopolitics",
  "critical-minerals",
  "supply-chains",
  "energy",
  "structural-breaks",
  "insurance",
  "ai-forecasting",
];

/**
 * The evidence field.
 *
 * Records are grouped by the part of the argument they support, not by
 * chronology or by source — the reader is looking for what backs a claim, not for
 * a bibliography. Selecting a record opens its full provenance.
 */
export function EvidenceField({ className }: { className?: string }) {
  const [category, setCategory] = useState<EvidenceCategory>("geopolitics");
  const [openId, setOpenId] = useState<string | null>(null);

  const records = useMemo(
    () => evidenceRecords.filter((record) => record.categories.includes(category)),
    [category],
  );

  return (
    <div className={cn("relative", className)}>
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <InstrumentLabel tone="gold">Evidence field</InstrumentLabel>
        <InstrumentLabel className="tabular-nums">
          {records.length} of {evidenceRecords.length} records
        </InstrumentLabel>
      </div>

      <div
        role="tablist"
        aria-label="Evidence category"
        className="mt-5 flex flex-wrap gap-x-6 gap-y-2 border-b border-[color:var(--hairline)] pb-4"
      >
        {FIELD_ORDER.map((id) => {
          const isActive = id === category;
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setCategory(id)}
              className={cn(
                "min-h-11 border-b pb-1 font-mono text-[0.625rem] tracking-[0.16em] uppercase transition-colors",
                isActive
                  ? "border-gold text-gold"
                  : "border-transparent text-dim-bone hover:text-muted-bone",
              )}
            >
              {CATEGORY_LABEL[id]}
            </button>
          );
        })}
      </div>

      <ul className="mt-2">
        {records.map((record) => (
          <li key={record.id}>
            <button
              type="button"
              onClick={() => {
                setOpenId(record.id);
                track("evidence_open", { evidence: record.id, from: "field" });
              }}
              className="group grid w-full grid-cols-1 items-start gap-x-8 gap-y-3 border-b border-[color:var(--hairline)] py-6 text-left transition-colors hover:bg-deep-field/60 sm:grid-cols-[5rem_minmax(0,1fr)_9rem]"
            >
              <span className="font-mono text-[0.6875rem] tracking-[0.1em] text-gold tabular-nums">
                {record.id}
              </span>
              <span>
                <span className="block text-[0.9375rem] leading-snug text-bone transition-colors group-hover:text-gold">
                  {record.title}
                </span>
                <span className="mt-2 block max-w-2xl text-[0.8125rem] leading-relaxed text-muted-bone">
                  {record.claim}
                </span>
                <span className="mt-3 block font-mono text-[0.625rem] tracking-[0.14em] text-dim-bone uppercase">
                  {record.organization ?? "Source not recorded"}
                  {record.date ? ` · ${record.date}` : ""}
                </span>
              </span>
              <span className="sm:justify-self-end">
                <EvidenceStatusChip status={record.status} />
              </span>
            </button>
          </li>
        ))}
      </ul>

      {openId ? <EvidenceDrawer id={openId} open onClose={() => setOpenId(null)} /> : null}
    </div>
  );
}
