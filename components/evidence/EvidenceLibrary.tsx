"use client";

import { useMemo, useState } from "react";
import { EVIDENCE } from "@/content/evidence";
import { cn } from "@/lib/utils/cn";
import { EvidenceRecord } from "./EvidenceRecord";

/**
 * The library, filterable by publisher. Filtering is client state over a
 * server-rendered list, so every record is in the initial HTML and the filter
 * only hides — which keeps the whole library crawlable (§45).
 */
export function EvidenceLibrary({ className }: { className?: string }) {
  const organizations = useMemo(
    () => [...new Set(EVIDENCE.map((record) => record.organization))].sort(),
    [],
  );
  const [filter, setFilter] = useState<string | null>(null);

  const visible = filter ? EVIDENCE.filter((record) => record.organization === filter) : EVIDENCE;

  return (
    <div className={className}>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setFilter(null)}
          aria-pressed={filter === null}
          className={cn(
            "border px-3 py-1.5 font-mono text-[0.66rem] tracking-[0.12em] uppercase transition-colors",
            filter === null
              ? "border-brass text-brass"
              : "border-graphite text-ash hover:text-bone",
          )}
        >
          All {EVIDENCE.length}
        </button>
        {organizations.map((organization) => (
          <button
            key={organization}
            type="button"
            onClick={() => setFilter(organization === filter ? null : organization)}
            aria-pressed={organization === filter}
            className={cn(
              "border px-3 py-1.5 text-left font-mono text-[0.66rem] tracking-[0.12em] transition-colors",
              organization === filter
                ? "border-brass text-brass"
                : "border-graphite text-ash hover:text-bone",
            )}
          >
            {organization}
          </button>
        ))}
      </div>

      <p aria-live="polite" className="mt-4 font-mono text-[0.66rem] tracking-[0.1em] text-ash">
        Showing {visible.length} of {EVIDENCE.length} records
        {filter ? ` from ${filter}` : ""}.
      </p>

      <ul className="mt-8 space-y-6">
        {EVIDENCE.map((record) => (
          <li key={record.id} hidden={filter !== null && record.organization !== filter}>
            <EvidenceRecord evidence={record} />
          </li>
        ))}
      </ul>
    </div>
  );
}
