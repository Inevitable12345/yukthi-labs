"use client";

import { useEffect } from "react";

import { InstrumentLabel } from "@/components/ui/InstrumentLabel";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // The digest is the only identifier that maps to a server-side log entry.
    console.error("Unhandled route error", error.digest ?? error.message);
  }, [error]);

  return (
    <section className="u-gutter flex min-h-screen flex-col justify-center py-40">
      <InstrumentLabel tone="rupture">Runtime · fault</InstrumentLabel>
      <h1 className="u-display-2 mt-8 max-w-3xl text-bone">
        Something in this view failed to resolve.
      </h1>
      <p className="u-lede u-measure mt-6">
        The rest of the site is unaffected. Re-resolving this view is usually enough.
      </p>
      <div className="mt-10">
        <button
          type="button"
          onClick={reset}
          className="min-h-11 border-b border-[color:var(--hairline-strong)] pb-1 font-mono text-[0.6875rem] tracking-[0.2em] text-bone uppercase transition-colors hover:border-gold hover:text-gold"
        >
          Re-resolve view
        </button>
      </div>
      {error.digest ? (
        <p className="mt-8 font-mono text-[0.625rem] tracking-[0.16em] text-dim-bone uppercase">
          Digest {error.digest}
        </p>
      ) : null}
    </section>
  );
}
