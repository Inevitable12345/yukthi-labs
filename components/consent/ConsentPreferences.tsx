"use client";

import { useState } from "react";

import { useConsent } from "./ConsentProvider";
import { Dialog } from "@/components/ui/Dialog";
import { Hairline } from "@/components/ui/Hairline";
import { InstrumentLabel } from "@/components/ui/InstrumentLabel";
import {
  ALL_CONSENT,
  CONSENT_CATEGORIES,
  DEFAULT_CONSENT,
  type ConsentState,
} from "@/lib/consent/consent";

/** Category-level consent editor. Optional categories start off, always. */
export function ConsentPreferences({ open }: { open: boolean }) {
  const { consent, closePreferences, save } = useConsent();
  // The component is remounted by key each time it opens, so the initial value is
  // always the stored decision and no effect is needed to keep them in step.
  const [draft, setDraft] = useState<ConsentState>(consent);

  return (
    <Dialog
      open={open}
      onClose={closePreferences}
      title="Cookie preferences"
      labelledBy="consent-title"
      description="Choose which categories of storage this site may use."
    >
      <div className="p-6 sm:p-8">
        <InstrumentLabel tone="steel">Consent · categories</InstrumentLabel>
        <h2 id="consent-title" className="u-display-3 mt-4 text-bone">
          Cookie preferences
        </h2>
        <p className="u-body mt-4 max-w-prose">
          Nothing optional is enabled until you enable it. Your choice is stored on this device
          only and can be changed at any time from the footer.
        </p>

        <ul className="mt-8 space-y-0">
          {CONSENT_CATEGORIES.map((category) => {
            const checked = category.required ? true : draft[category.id];
            return (
              <li key={category.id}>
                <Hairline />
                <label
                  className={`flex min-h-11 cursor-pointer items-start gap-4 py-5 ${
                    category.required ? "cursor-default opacity-80" : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    disabled={category.required}
                    onChange={(event) =>
                      setDraft((previous) => ({
                        ...previous,
                        [category.id]: event.target.checked,
                      }))
                    }
                    className="mt-1 h-4 w-4 shrink-0 accent-[color:var(--color-gold)]"
                  />
                  <span>
                    <span className="flex flex-wrap items-baseline gap-3">
                      <span className="text-sm text-bone">{category.label}</span>
                      {category.required ? (
                        <InstrumentLabel>Always active</InstrumentLabel>
                      ) : null}
                    </span>
                    <span className="mt-1.5 block text-[0.8125rem] leading-relaxed text-muted-bone">
                      {category.description}
                    </span>
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
        <Hairline />

        <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
          <PreferenceAction onClick={() => save(draft)}>Accept selected</PreferenceAction>
          <PreferenceAction onClick={() => save(ALL_CONSENT)}>Accept all</PreferenceAction>
          <PreferenceAction onClick={() => save(DEFAULT_CONSENT)}>
            Reject optional
          </PreferenceAction>
        </div>
      </div>
    </Dialog>
  );
}

function PreferenceAction({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="min-h-11 border-b border-[color:var(--hairline-strong)] pb-0.5 text-[0.8125rem] tracking-[0.02em] text-bone transition-colors duration-300 hover:border-gold hover:text-gold"
    >
      {children}
    </button>
  );
}
