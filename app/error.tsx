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
    console.error(error);
  }, [error]);

  return (
    <div className="u-gutter py-32">
      <InstrumentLabel tone="rupture">Error</InstrumentLabel>
      <h1 className="u-display-2 mt-6 max-w-[16ch] text-bone">Something failed to resolve.</h1>
      <p className="u-lede u-measure mt-8">
        The page could not be rendered. The argument itself is unaffected — try again, or start
        from the beginning.
      </p>

      <div className="mt-12 flex flex-wrap gap-8">
        <button
          type="button"
          onClick={reset}
          className="border border-gold px-6 py-3.5 font-mono text-[0.6875rem] tracking-[0.18em] text-gold uppercase transition-colors hover:bg-gold hover:text-void"
        >
          Try again
        </button>
      </div>

      {error.digest ? (
        <InstrumentLabel as="p" className="mt-10">
          Reference {error.digest}
        </InstrumentLabel>
      ) : null}
    </div>
  );
}
