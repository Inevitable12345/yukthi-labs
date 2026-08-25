"use client";

import Link from "next/link";

import { useConsent } from "./ConsentProvider";
import { ConsentPreferences } from "./ConsentPreferences";
import { InstrumentLabel } from "@/components/ui/InstrumentLabel";

/**
 * Consent notice.
 *
 * Design constraints, deliberately: all three actions are the same size, weight and
 * colour; "Reject optional" is not hidden behind a second screen; nothing is
 * pre-selected beyond the strictly necessary category; and the notice does not
 * obstruct reading — it docks to the bottom-left and can be dismissed by choosing.
 */
export function CookieBanner() {
  const { decided, preferencesOpen, openPreferences, acceptAll, rejectOptional } = useConsent();

  return (
    <>
      {!decided ? (
        <div
          role="region"
          aria-label="Cookie consent"
          className="u-no-print fixed bottom-0 left-0 z-[80] w-full border-t border-[color:var(--hairline)] bg-deep-field/97 backdrop-blur-sm sm:bottom-6 sm:left-6 sm:w-[min(30rem,calc(100vw-3rem))] sm:border"
        >
          <div className="p-5 sm:p-6">
            <InstrumentLabel tone="steel">Consent</InstrumentLabel>
            <p className="mt-3 text-[0.8125rem] leading-relaxed text-muted-bone">
              This site stores a single record of your cookie choice so it does not have to ask
              again. Analytics and functional storage stay switched off until you turn them on.
              No marketing or cross-site tracking is used.
            </p>
            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3">
              <ConsentAction onClick={rejectOptional}>Reject optional</ConsentAction>
              <ConsentAction onClick={acceptAll}>Accept all</ConsentAction>
              <ConsentAction onClick={openPreferences}>Choose categories</ConsentAction>
            </div>
            <p className="mt-5 text-[0.6875rem] text-dim-bone">
              <Link
                href="/cookies"
                className="underline underline-offset-4 hover:text-muted-bone"
              >
                Cookie policy
              </Link>
              <span aria-hidden="true"> · </span>
              <Link
                href="/privacy"
                className="underline underline-offset-4 hover:text-muted-bone"
              >
                Privacy
              </Link>
            </p>
          </div>
        </div>
      ) : null}
      {/* Keyed so the draft state is rebuilt from the stored decision on each
          opening, rather than being resynchronised by an effect. */}
      <ConsentPreferences key={preferencesOpen ? "open" : "closed"} open={preferencesOpen} />
    </>
  );
}

function ConsentAction({
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
