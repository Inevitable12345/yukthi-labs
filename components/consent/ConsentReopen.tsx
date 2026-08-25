"use client";

import { useConsent } from "./ConsentProvider";

/** Re-opens the consent editor from anywhere in the site body. */
export function ConsentReopen({ label = "Open cookie preferences" }: { label?: string }) {
  const { openPreferences } = useConsent();

  return (
    <button
      type="button"
      onClick={openPreferences}
      className="group inline-flex min-h-11 items-baseline gap-3 border-b border-[color:var(--hairline-strong)] pb-1 font-mono text-[0.6875rem] tracking-[0.2em] text-bone uppercase transition-colors hover:border-gold hover:text-gold"
    >
      {label}
      <span
        aria-hidden="true"
        className="text-gold transition-transform group-hover:translate-x-1"
      >
        →
      </span>
    </button>
  );
}
