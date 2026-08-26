import { FutureFan } from "@/components/visualization/FutureFan";
import { IllustrativeBadge } from "@/components/evidence/IllustrativeBadge";
import { InstrumentLabel } from "@/components/ui/InstrumentLabel";

/* INTERSTITIAL — POSSIBLE FUTURES
   Placed immediately after the bet, because the first question anyone asks of a
   causal structure is what it says about what happens next.

   The answer this site is willing to give is deliberately limited: branches, the
   drivers behind each, and the assumptions each depends on. No probabilities, no
   ranking, no weighting — none of which exist yet, and any of which would be a
   number invented to look like an answer. */
export function PossibleFutures() {
  return (
    <section
      id="futures"
      aria-labelledby="futures-heading"
      className="u-gutter relative scroll-mt-20 border-t border-[color:var(--hairline)] py-24 sm:py-32"
    >
      <div className="flex flex-wrap items-center gap-4">
        <InstrumentLabel tone="steel">Interstitial · possible futures</InstrumentLabel>
        <IllustrativeBadge />
      </div>

      <h2 id="futures-heading" className="u-display-2 mt-8 max-w-[18ch] text-bone">
        Branches, not predictions.
      </h2>

      <p className="u-lede u-measure mt-8">
        A causal structure does not produce a single future. It produces a set of them, each
        conditional on assumptions that can be named, checked, and watched for failure. What
        follows is that set — and nothing more than that set.
      </p>

      <p className="u-body u-measure mt-6">
        No probability is attached to any branch. The schema carries the field; no model has
        filled it. When calibrated output exists, it will appear here with its calibration
        status beside it, and not before.
      </p>

      <FutureFan className="mt-16" />
    </section>
  );
}
