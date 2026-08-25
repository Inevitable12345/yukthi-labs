"use client";

import { useMemo, useState } from "react";

import { EvidenceCard } from "./EvidenceCard";
import { EvidenceStatusChip } from "./EvidenceStatusChip";
import { Hairline } from "@/components/ui/Hairline";
import { InstrumentLabel } from "@/components/ui/InstrumentLabel";
import { evidenceRecords } from "@/data/evidence";
import type { EvidenceCategory, EvidenceStatus } from "@/data/schema";
import { track } from "@/lib/analytics/analytics";
import { cn } from "@/lib/utils/cn";

const CATEGORIES: Array<{ id: EvidenceCategory; label: string }> = [
  { id: "geopolitics", label: "Geopolitics" },
  { id: "supply-chains", label: "Supply chains" },
  { id: "energy", label: "Energy" },
  { id: "insurance", label: "Insurance" },
  { id: "markets", label: "Markets" },
  { id: "ai-forecasting", label: "AI forecasting" },
  { id: "structural-breaks", label: "Structural breaks" },
  { id: "critical-minerals", label: "Critical minerals" },
];

const STATUSES: Array<{ id: EvidenceStatus; label: string }> = [
  { id: "verified", label: "Verified" },
  { id: "needs-verification", label: "Needs verification" },
  { id: "illustrative", label: "Illustrative" },
];

/**
 * The full source index.
 *
 * Filters narrow; they never hide. The counts beside each filter are computed from
 * the same array that renders the list, so the page cannot claim a record it does
 * not hold — and the unverified records are as reachable as the verified ones.
 */
export function EvidenceLibrary() {
  const [categories, setCategories] = useState<Set<EvidenceCategory>>(new Set());
  const [statuses, setStatuses] = useState<Set<EvidenceStatus>>(new Set());
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const records = useMemo(
    () =>
      evidenceRecords.filter((record) => {
        const categoryMatch =
          categories.size === 0 ||
          record.categories.some((category) => categories.has(category));
        const statusMatch = statuses.size === 0 || statuses.has(record.status);
        return categoryMatch && statusMatch;
      }),
    [categories, statuses],
  );

  const toggle = <T,>(set: Set<T>, value: T): Set<T> => {
    const next = new Set(set);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    return next;
  };

  return (
    <div>
      <div className="grid grid-cols-1 gap-8 border-b border-[color:var(--hairline)] pb-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-16">
        <div>
          <InstrumentLabel as="h2">Filter by category</InstrumentLabel>
          <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
            {CATEGORIES.map((category) => {
              const count = evidenceRecords.filter((record) =>
                record.categories.includes(category.id),
              ).length;
              const isActive = categories.has(category.id);
              return (
                <li key={category.id}>
                  <FilterButton
                    active={isActive}
                    onClick={() => setCategories((previous) => toggle(previous, category.id))}
                  >
                    {category.label}
                    <span className="ml-2 text-dim-bone tabular-nums">{count}</span>
                  </FilterButton>
                </li>
              );
            })}
          </ul>
        </div>

        <div>
          <InstrumentLabel as="h2">Filter by status</InstrumentLabel>
          <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
            {STATUSES.map((status) => {
              const count = evidenceRecords.filter(
                (record) => record.status === status.id,
              ).length;
              return (
                <li key={status.id}>
                  <FilterButton
                    active={statuses.has(status.id)}
                    onClick={() => setStatuses((previous) => toggle(previous, status.id))}
                  >
                    {status.label}
                    <span className="ml-2 text-dim-bone tabular-nums">{count}</span>
                  </FilterButton>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <p
        aria-live="polite"
        className="mt-6 font-mono text-[0.625rem] tracking-[0.18em] text-dim-bone uppercase tabular-nums"
      >
        {records.length} of {evidenceRecords.length} records
        {categories.size + statuses.size > 0 ? (
          <button
            type="button"
            onClick={() => {
              setCategories(new Set());
              setStatuses(new Set());
            }}
            className="ml-6 border-b border-[color:var(--hairline-strong)] pb-0.5 text-bone transition-colors hover:border-gold hover:text-gold"
          >
            Clear filters
          </button>
        ) : null}
      </p>

      <ul className="mt-8">
        {records.map((record) => {
          const isExpanded = expandedId === record.id;
          return (
            <li key={record.id}>
              <Hairline />
              <div className="py-7">
                <button
                  type="button"
                  aria-expanded={isExpanded}
                  aria-controls={`record-${record.id}`}
                  onClick={() => {
                    setExpandedId(isExpanded ? null : record.id);
                    if (!isExpanded)
                      track("evidence_open", { evidence: record.id, from: "library" });
                  }}
                  className="group grid w-full grid-cols-1 items-start gap-x-8 gap-y-3 text-left sm:grid-cols-[4.5rem_minmax(0,1fr)_9rem]"
                >
                  <span className="font-mono text-[0.6875rem] text-gold tabular-nums">
                    {record.id}
                  </span>
                  <span>
                    <span className="block text-[1rem] leading-snug text-bone transition-colors group-hover:text-gold">
                      {record.title}
                    </span>
                    <span className="mt-2 block font-mono text-[0.625rem] tracking-[0.14em] text-dim-bone uppercase">
                      {record.organization ?? "Source not recorded"}
                      {record.date ? ` · ${record.date}` : ""}
                    </span>
                    {!isExpanded ? (
                      <span className="mt-3 block max-w-2xl text-[0.875rem] leading-relaxed text-muted-bone">
                        {record.claim}
                      </span>
                    ) : null}
                  </span>
                  <span className="sm:justify-self-end">
                    <EvidenceStatusChip status={record.status} />
                  </span>
                </button>

                {isExpanded ? (
                  <div id={`record-${record.id}`} className="mt-8 sm:pl-[5.75rem]">
                    <EvidenceCard record={record} />
                  </div>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>
      <Hairline />

      {records.length === 0 ? (
        <p className="py-16 text-center text-[0.875rem] text-muted-bone">
          No record matches this combination of filters.
        </p>
      ) : null}
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
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "min-h-11 border-b pb-1 font-mono text-[0.625rem] tracking-[0.16em] uppercase transition-colors",
        active ? "border-gold text-gold" : "border-transparent text-muted-bone hover:text-bone",
      )}
    >
      {children}
    </button>
  );
}
