import { Act } from "./Act";
import { StructuralBreakChart } from "@/components/visualization/StructuralBreakChart";
import { EvidenceMarker } from "@/components/evidence/EvidenceMarker";

/* ACT 07 — STRUCTURAL BREAK
   This section must not read as an attack on forecasting science. The failure is
   not a failure of skill; it is what happens to any fitted model when the process
   generating its data changes. */
export function StructuralBreak() {
  return (
    <Act
      id="structural-break"
      index="Act 07"
      eyebrow="Model fragility"
      headline="The world changed. The assumptions did not."
      lede={
        <>
          Forecasting works. That is the point. Models trained on stable historical
          relationships become fragile precisely when those relationships change — and they
          become fragile at the moment their output matters most.
        </>
      }
    >
      <StructuralBreakChart />

      <div className="mt-16 grid grid-cols-1 gap-12 border-t border-[color:var(--hairline)] pt-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <blockquote>
          <p className="u-display-3 max-w-[22ch] text-bone">
            Even highly sophisticated institutions struggle when the causal regime generating
            the data changes faster than their modelling assumptions.
          </p>
        </blockquote>

        <div className="space-y-6">
          <p className="u-body">
            The European Central Bank publishes analyses of its own projection errors. Its
            review of 2021–22 found short-term inflation projection accuracy deteriorating
            sharply, with the errors concentrated where energy dynamics and supply bottlenecks
            had changed what generated the data. <EvidenceMarker id="E-008" />
          </p>
          <p className="u-body">
            The underestimation for the first quarter of 2022 was reported as the largest
            one-quarter-ahead error since Eurosystem staff projections began in 1998.{" "}
            <EvidenceMarker id="E-009" />
          </p>
          <p className="border-l border-[color:var(--color-gold-dim)] pl-5 text-[0.875rem] leading-relaxed text-muted-bone">
            This is not a story about one institution. It is the general case. Any model that
            extrapolates a relationship will fail when that relationship stops holding, and no
            amount of additional historical data can supply information about a structure that
            has not existed before.
          </p>
        </div>
      </div>
    </Act>
  );
}
