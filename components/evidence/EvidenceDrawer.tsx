"use client";

import { EvidenceCard } from "./EvidenceCard";
import { Dialog } from "@/components/ui/Dialog";
import { InstrumentLabel } from "@/components/ui/InstrumentLabel";
import { getEvidence } from "@/data/evidence";

/** Full source record, docked to the side of the reading column. */
export function EvidenceDrawer({
  id,
  open,
  onClose,
}: {
  id: string;
  open: boolean;
  onClose: () => void;
}) {
  const record = getEvidence(id);
  if (!record) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={`Evidence ${id}`}
      labelledBy="evidence-drawer-title"
      variant="drawer"
      description="A source record: the claim, its provenance, its context and its verification status."
    >
      <div className="sticky top-0 z-10 flex items-center justify-between gap-6 border-b border-[color:var(--hairline)] bg-deep-field px-6 py-5 sm:px-8">
        <InstrumentLabel tone="gold">Source record</InstrumentLabel>
        <button
          type="button"
          onClick={onClose}
          className="min-h-11 font-mono text-[0.625rem] tracking-[0.2em] text-muted-bone uppercase transition-colors hover:text-gold"
        >
          Close
        </button>
      </div>
      <div className="px-6 py-8 sm:px-8">
        <h2 id="evidence-drawer-title" className="u-sr-only">
          Evidence {id}: {record.title}
        </h2>
        <EvidenceCard record={record} />
      </div>
    </Dialog>
  );
}
