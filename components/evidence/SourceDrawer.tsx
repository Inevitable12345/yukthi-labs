"use client";

import { useEffect, useId, useRef } from "react";

import type { EvidenceRecord } from "@/data/schema";
import { InstrumentLabel } from "@/components/ui/InstrumentLabel";

/* ============================================================================
   SOURCE DRAWER (§23)
   ----------------------------------------------------------------------------
   The full record behind a claim: organisation, publication, date, the claim it
   supports, the link, why it matters causally, and — where it changes how the
   figure should be read — how it was produced.

   Accessibility is the whole design here (§33):
     · a native <dialog> so the browser supplies modality and escape handling;
     · focus moves in on open and returns to the trigger on close;
     · the drawer is labelled by its heading and describable by its claim;
     · nothing inside is reachable while it is closed.
   ========================================================================== */

export function SourceDrawer({
  record,
  open,
  onClose,
}: {
  record: EvidenceRecord;
  open: boolean;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const headingId = useId();

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;

    if (open && !element.open) {
      element.showModal();
    } else if (!open && element.open) {
      element.close();
    }
  }, [open]);

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;

    // `close` fires for Escape and for the backdrop-driven close alike, so the
    // parent's state stays in step with the browser's.
    const handleClose = () => onClose();
    element.addEventListener("close", handleClose);
    return () => element.removeEventListener("close", handleClose);
  }, [onClose]);

  return (
    <dialog
      ref={dialog}
      aria-labelledby={headingId}
      className="u-panel m-0 ml-auto h-full max-h-none w-full max-w-[34rem] border-l border-[color:var(--hairline)] p-0 text-bone backdrop:bg-[rgba(7,8,8,0.72)]"
      onClick={(event) => {
        // Click on the backdrop — the dialog element itself — closes. Clicks on
        // the panel inside do not bubble here.
        if (event.target === dialog.current) onClose();
      }}
    >
      <div className="flex h-full flex-col overflow-y-auto bg-deep-field">
        <header className="flex items-start justify-between gap-6 border-b border-[color:var(--hairline)] p-8">
          <div>
            <InstrumentLabel tone="gold" className="tabular-nums">
              {record.id}
            </InstrumentLabel>
            <h2 id={headingId} className="u-display-3 mt-4 text-bone">
              {record.title}
            </h2>
            <p className="u-instrument mt-4">{record.organization}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="u-instrument shrink-0 border border-[color:var(--hairline)] px-3 py-2 transition-colors hover:border-bone hover:text-bone"
          >
            Close
          </button>
        </header>

        <div className="space-y-8 p-8">
          <Field label="Supported claim">
            <p className="text-[0.9375rem] leading-relaxed text-bone">{record.claim}</p>
          </Field>

          {record.context ? (
            <Field label="What this does not say">
              <p className="u-body">{record.context}</p>
            </Field>
          ) : null}

          {record.methodology ? (
            <Field label="Methodology">
              <p className="u-body">{record.methodology}</p>
            </Field>
          ) : null}

          {record.causalRelevance ? (
            <Field label="Relevance to Yukthi">
              <p className="u-body">{record.causalRelevance}</p>
            </Field>
          ) : null}

          <div className="grid grid-cols-2 gap-6 border-t border-[color:var(--hairline)] pt-8">
            {record.publication ? (
              <Field label="Publication" className="col-span-2">
                <p className="u-body">{record.publication}</p>
              </Field>
            ) : null}
            {record.date ? (
              <Field label="Date">
                <p className="u-body tabular-nums">{record.date}</p>
              </Field>
            ) : null}
            <Field label="Verification">
              <p className="u-body">
                {record.status === "verified" ? (
                  "Checked against the cited publication."
                ) : (
                  <span className="text-rupture">
                    Not yet checked against the primary document.
                  </span>
                )}
              </p>
            </Field>
          </div>

          {record.url ? (
            <a
              href={record.url}
              target="_blank"
              rel="noopener noreferrer"
              className="u-instrument inline-flex items-center gap-3 border border-[color:var(--hairline)] px-4 py-3 text-bone transition-colors hover:border-gold hover:text-gold"
            >
              Open the source
              <span aria-hidden="true">↗</span>
              <span className="u-sr-only">(opens in a new tab)</span>
            </a>
          ) : (
            <p className="u-body">
              No stable public URL recorded for this document. The publication reference above
              is sufficient to retrieve it.
            </p>
          )}
        </div>
      </div>
    </dialog>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <InstrumentLabel as="p">{label}</InstrumentLabel>
      <div className="mt-3">{children}</div>
    </div>
  );
}
