"use client";

import { useMemo, useState } from "react";

import { evidenceRecords } from "@/data/evidence";
import {
  EVIDENCE_CATEGORY_LABEL,
  type EvidenceCategory,
  type EvidenceRecord,
} from "@/data/schema";
import { InstrumentLabel } from "@/components/ui/InstrumentLabel";
import { cn } from "@/lib/utils/cn";

import { SourceDrawer } from "./SourceDrawer";

/* ============================================================================
   THE SOURCE LIBRARY (§35)
   ----------------------------------------------------------------------------
   Every source behind every claim, grouped the way the argument uses them.
   Filtering is client-side over a small fixed list — no search index, no
   network, and the full list is in the DOM before any script runs.
   ========================================================================== */

const CATEGORY_ORDER: EvidenceCategory[] = [
  "fragmentation",
  "critical-minerals",
  "semiconductors",
  "structural-breaks",
  "energy",
  "insurance",
  "ai-forecasting",
];

export function EvidenceLibrary() {
  const [filter, setFilter] = useState<EvidenceCategory | "all">("all");
  const [open, setOpen] = useState<EvidenceRecord | null>(null);

  const groups = useMemo(
    () =>
      CATEGORY_ORDER.map((category) => ({
        category,
        records: evidenceRecords.filter(
          (record) =>
            record.categories.includes(category) && (filter === "all" || filter === category),
        ),
      })).filter((group) => group.records.length > 0),
    [filter],
  );

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter sources by subject">
        <FilterButton active={filter === "all"} onClick={() => setFilter("all")}>
          All
        </FilterButton>
        {CATEGORY_ORDER.map((category) => (
          <FilterButton
            key={category}
            active={filter === category}
            onClick={() => setFilter(category)}
          >
            {EVIDENCE_CATEGORY_LABEL[category]}
          </FilterButton>
        ))}
      </div>

      <div className="mt-16 space-y-20">
        {groups.map((group) => (
          <section key={group.category} aria-labelledby={`group-${group.category}`}>
            <h2
              id={`group-${group.category}`}
              className="u-display-3 border-b border-[color:var(--hairline)] pb-6 text-bone"
            >
              {EVIDENCE_CATEGORY_LABEL[group.category]}
            </h2>

            <ul className="mt-10 space-y-10">
              {group.records.map((record) => (
                <li key={`${group.category}-${record.id}`}>
                  <article className="grid gap-4 sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-8">
                    <div>
                      <InstrumentLabel tone="gold" className="tabular-nums">
                        {record.id}
                      </InstrumentLabel>
                      {record.status === "needs-verification" ? (
                        <p className="u-instrument mt-2 text-rupture">Unverified</p>
                      ) : null}
                    </div>

                    <div>
                      <h3 className="text-[1.0625rem] leading-snug text-bone">
                        {record.title}
                      </h3>
                      <p className="u-instrument mt-2">
                        {record.organization}
                        {record.date ? ` · ${record.date}` : ""}
                      </p>
                      <p className="u-body mt-4 u-measure">{record.claim}</p>

                      <button
                        type="button"
                        onClick={() => setOpen(record)}
                        aria-haspopup="dialog"
                        className="u-instrument mt-5 border-b border-[color:var(--hairline-strong)] pb-1 text-muted-bone transition-colors hover:border-gold hover:text-gold"
                      >
                        Full record
                        <span className="u-sr-only"> for {record.title}</span>
                      </button>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      {open ? <SourceDrawer record={open} open onClose={() => setOpen(null)} /> : null}
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "border px-3 py-2 font-mono text-[0.625rem] tracking-[0.16em] uppercase transition-colors",
        active
          ? "border-gold text-gold"
          : "border-[color:var(--hairline)] text-muted-bone hover:border-bone hover:text-bone",
      )}
    >
      {children}
    </button>
  );
}
