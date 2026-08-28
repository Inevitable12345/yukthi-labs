"use client";

import { useId, useState } from "react";
import { evidenceFor } from "@/content/evidence";
import { cn } from "@/lib/utils/cn";
import { EvidenceRecord } from "./EvidenceRecord";

/* ============================================================================
   EVIDENCE INSPECTOR  (§33)
   ----------------------------------------------------------------------------
   A disclosure rather than a modal, deliberately. There is no focus trap to
   get wrong, no scroll lock to fight the exhibition, and the opened record is
   in the reading order immediately after the button that opened it — which is
   what a keyboard visitor expects and what a screen reader announces correctly
   without a single ARIA override.
   ========================================================================== */

export function EvidenceRack({
  evidenceIds,
  label = "Sources for this room",
  className,
}: {
  evidenceIds: readonly string[];
  label?: string;
  className?: string;
}) {
  const records = evidenceFor(evidenceIds);
  const [openId, setOpenId] = useState<string | null>(null);
  const panelId = useId();

  if (records.length === 0) return null;

  return (
    <div className={cn("not-prose", className)}>
      <p className="label-dim mb-3">{label}</p>
      <ul className="flex flex-wrap gap-2">
        {records.map((record) => {
          const open = openId === record.id;
          return (
            <li key={record.id}>
              <button
                type="button"
                onClick={() => setOpenId(open ? null : record.id)}
                aria-expanded={open}
                aria-controls={`${panelId}-${record.id}`}
                className={cn(
                  "border px-3 py-1.5 text-left font-mono text-[0.68rem] tracking-[0.1em] transition-colors",
                  open
                    ? "border-brass text-brass"
                    : "border-graphite text-ash hover:border-ash hover:text-bone",
                )}
              >
                {record.organization}
                <span className="ml-2 text-ash">{record.date ?? ""}</span>
              </button>
            </li>
          );
        })}
      </ul>

      {records.map((record) => (
        <div
          key={record.id}
          id={`${panelId}-${record.id}`}
          hidden={openId !== record.id}
          className="mt-4"
        >
          <EvidenceRecord evidence={record} />
        </div>
      ))}
    </div>
  );
}
