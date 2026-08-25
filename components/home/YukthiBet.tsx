import { CausalField } from "@/components/visualization/CausalField";
import { MapMonitorForecastLoop } from "@/components/visualization/MapMonitorForecastLoop";
import { InstrumentLabel } from "@/components/ui/InstrumentLabel";
import { ActionLink } from "@/components/ui/ActionLink";
import { SITE } from "@/lib/metadata/site";

/* ACT 11 — YUKTHI'S BET
   The reveal. The field, sparse and latent in Act 01, resolves. This is the only
   place on the homepage that should feel still. */
export function YukthiBet() {
  return (
    <section
      id="the-bet"
      aria-labelledby="the-bet-heading"
      className="relative overflow-hidden border-t border-[color:var(--hairline)]"
    >
      <CausalField
        intensity={1}
        staticCount={130}
        sceneCount={300}
        label="Resolving causal field"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_45%,rgba(7,8,8,0.55),rgba(7,8,8,0.94))]"
      />

      <div className="u-gutter relative py-32 sm:py-44">
        <InstrumentLabel tone="gold">Act 11 · the bet</InstrumentLabel>

        <p className="mt-10 font-mono text-[0.6875rem] tracking-[0.28em] text-muted-bone uppercase">
          That is Yukthi Lab&rsquo;s bet.
        </p>

        <h2 id="the-bet-heading" className="u-display-1 mt-8 max-w-[16ch] text-bone">
          {SITE.technicalBet}
        </h2>

        <p className="mt-10 font-mono text-[0.75rem] tracking-[0.3em] text-gold uppercase sm:text-[0.875rem]">
          {SITE.loop.join(" → ")}
        </p>

        <div className="mt-20 grid grid-cols-1 gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-24">
          <div className="space-y-6">
            <p className="u-lede">
              Frontier AI, forecasting science and an explicit causal structure — connected, so
              that each supplies what the others cannot. The machine components provide scale
              and continuity. The causal structure provides the thing that survives a change of
              regime: a statement of <em>why</em>, which can be checked, argued with, and found
              wrong.
            </p>
            <p className="u-body">
              Scoped, because a model of everything is not a model. The structure is built
              around a decision, with a stated boundary, and it is re-built when the evidence
              says the boundary was in the wrong place.
            </p>
            <div className="flex flex-wrap gap-x-10 gap-y-4 pt-4">
              <ActionLink href="/architecture">Study the architecture</ActionLink>
              <ActionLink href="/thesis">Read the full thesis</ActionLink>
            </div>
          </div>

          <MapMonitorForecastLoop />
        </div>
      </div>
    </section>
  );
}
