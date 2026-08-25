"use client";

import { useState } from "react";

import { EvidenceDrawer } from "./EvidenceDrawer";
import { getEvidence } from "@/data/evidence";
import { track } from "@/lib/analytics/analytics";

/**
 * The inline source mark: `[E-014]`.
 *
 * Hover or focus reveals the organisation and date; activating it opens the full
 * record. Provenance sits next to the claim it supports rather than in a footer —
 * a reader should never have to leave a sentence to find out who said it.
 */
export function EvidenceMarker({ id }: { id: string }) {
  const [open, setOpen] = useState(false);
  const record = getEvidence(id);

  if (!record) return null;

  const shortSource = [record.organization, record.date?.slice(0, 4)]
    .filter(Boolean)
    .join(" · ");

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setOpen(true);
          track("evidence_open", { evidence: id });
        }}
        aria-label={`Evidence ${id}: ${record.title}. ${shortSource}. Open source record.`}
        title={shortSource}
        className="group relative -mx-0.5 inline-flex items-baseline whitespace-nowrap px-0.5 align-baseline font-mono text-[0.6875rem] tracking-[0.08em] text-gold transition-colors hover:text-bone focus-visible:text-bone"
      >
        <span aria-hidden="true">[{id}]</span>
        <span className="absolute inset-x-0 -bottom-px h-px bg-[color:var(--color-gold-dim)] transition-colors group-hover:bg-gold" />
      </button>
      <EvidenceDrawer id={id} open={open} onClose={() => setOpen(false)} />
    </>
  );
}
