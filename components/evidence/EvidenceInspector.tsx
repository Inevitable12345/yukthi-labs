"use client";

import { useCallback, useState } from "react";

import { getEvidenceMany } from "@/data/evidence";
import type { EvidenceRecord } from "@/data/schema";
import { cn } from "@/lib/utils/cn";

import { SourceDrawer } from "./SourceDrawer";

/* ============================================================================
   EVIDENCE INSPECTOR (§23)
   ----------------------------------------------------------------------------
   Evidence is part of the visual system, not a footnote pile at the bottom of
   the page. Any claim can carry its sources inline, and opening one is a single
   interaction from wherever the claim is made.

   The trigger is a real <button> with the evidence ID as its visible text — so
   the citation is readable, quotable and keyboard-reachable whether or not the
   drawer ever opens.
   ========================================================================== */

export function EvidenceInspector({
  ids,
  className,
  label = "Sources",
}: {
  ids: readonly string[];
  className?: string;
  label?: string;
}) {
  const records = getEvidenceMany(ids);
  const [open, setOpen] = useState<EvidenceRecord | null>(null);
  const close = useCallback(() => setOpen(null), []);

  if (records.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <span className="u-instrument">{label}</span>

      {records.map((record) => (
        <button
          key={record.id}
          type="button"
          onClick={() => setOpen(record)}
          className={cn(
            "group inline-flex items-center gap-2 border px-2 py-1 font-mono text-[0.5625rem] tracking-[0.16em] uppercase transition-colors",
            record.status === "verified"
              ? "border-[color:var(--hairline)] text-steel hover:border-steel hover:text-bone"
              : "border-rupture-deep text-rupture hover:border-rupture hover:text-bone",
          )}
          aria-haspopup="dialog"
        >
          <span className="tabular-nums">{record.id}</span>
          <span className="u-sr-only">
            — {record.title}, {record.organization}.
            {record.status === "verified"
              ? " Verified against the cited publication."
              : " Not yet verified against the primary document."}
          </span>
          <span aria-hidden="true" className="text-dim-bone group-hover:text-current">
            {record.status === "verified" ? "◆" : "△"}
          </span>
        </button>
      ))}

      {open ? <SourceDrawer record={open} open onClose={close} /> : null}
    </div>
  );
}
