import { StoryChapterSection } from "@/components/story/StoryChapter";
import { EvidenceInspector } from "@/components/evidence/EvidenceInspector";
import { InstrumentLabel } from "@/components/ui/InstrumentLabel";
import { ClaimClassChip } from "@/components/evidence/ClaimClassChip";

/* ============================================================================
   ACT V — STRUCTURAL BREAK (§11)
   ----------------------------------------------------------------------------
   The analytical plane.

   The rule this act obeys: never say forecasting does not work. The ECB is one
   of the best-resourced forecasting institutions in the world, and the argument
   is stronger — not weaker — for saying so. What failed was not capability. What
   failed was the assumption that the relationships being extrapolated were still
   the relationships generating the data.
   ========================================================================== */

export function StructuralBreakScene() {
  return (
    <StoryChapterSection
      chapter="structural-break"
      eyebrow="The structural break"
      headline="Models trained on stable historical relationships become fragile when those relationships suddenly change."
      headlineClassName="max-w-[26ch]"
      lede={
        <>
          This is not a story about a bad forecast. It is a story about a very good forecasting
          institution, using a well-specified model, at the moment the structure it described
          stopped being the structure that was operating.
        </>
      }
    >
      <div className="grid grid-cols-1 gap-16 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-24">
        <BreakChart />

        <div className="space-y-10">
          <div>
            <InstrumentLabel as="h3" tone="steel">
              What the ECB found in its own review
            </InstrumentLabel>
            <p className="u-body mt-4">
              The accuracy of short-term HICP inflation projections deteriorated markedly during
              2021–22, with staff projections substantially underestimating the surge. The ECB
              attributes the errors principally to energy price dynamics and supply bottlenecks
              that the projection framework did not capture.
            </p>
            <p className="u-body mt-4">
              A central bank publishing an analysis of its own forecast errors is unusual and
              valuable. The point is not that the errors occurred. It is that they were
              concentrated exactly where the causal regime had changed.
            </p>
            <EvidenceInspector ids={["E-010", "E-011"]} className="mt-6" />
          </div>

          <div className="border-t border-[color:var(--hairline)] pt-8">
            <ClaimClassChip claimClass="yukthi-interpretation" />
            <p className="u-body mt-5">
              A model fitted on history encodes an assumption it cannot state: that the process
              generating tomorrow&rsquo;s data is the process that generated yesterday&rsquo;s.
              When that holds, extrapolation is correct and efficient. When it stops holding,
              the model fails on schedule and gives no warning — because the failure is in the
              assumption, and the assumption is not one of its parameters.
            </p>
            <p className="u-body mt-4">
              Systematic error in one direction is the signature. Random error is noise. Error
              that clusters is information about structure.
            </p>
          </div>
        </div>
      </div>
    </StoryChapterSection>
  );
}

/**
 * The break, drawn.
 *
 * A historical relationship, its forecast continuation, the point the regime
 * changes, the actual path, and the error between them.
 *
 * The shape is schematic and labelled as such — it illustrates what a structural
 * break looks like, and does not plot the ECB's published series. Drawing real
 * data here would require reproducing it accurately from the source, and an
 * approximation presented as data is a fabrication.
 */
function BreakChart() {
  const W = 640;
  const H = 440;
  const breakX = 0.52;

  const toX = (t: number) => 60 + t * (W - 110);
  const toY = (v: number) => H - 70 - v * (H - 130);

  // Historical path: stable, mildly cyclical.
  const history = Array.from({ length: 40 }, (_, i) => {
    const t = (i / 39) * breakX;
    return { x: toX(t), y: toY(0.28 + Math.sin(i / 4.5) * 0.05) };
  });

  // The forecast: a continuation of the historical relationship.
  const forecast = Array.from({ length: 30 }, (_, i) => {
    const t = breakX + (i / 29) * (1 - breakX);
    return { x: toX(t), y: toY(0.3 + Math.sin((40 + i) / 4.5) * 0.04) };
  });

  // What actually happened: the regime changed.
  const actual = Array.from({ length: 30 }, (_, i) => {
    const p = i / 29;
    const t = breakX + p * (1 - breakX);
    return { x: toX(t), y: toY(0.3 + Math.pow(p, 1.5) * 0.52) };
  });

  const path = (points: { x: number; y: number }[]) =>
    points.map((point, i) => `${i === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");

  return (
    <figure className="m-0 min-w-0">
      <div
        className="u-figure-scroll"
        tabIndex={0}
        role="region"
        aria-label="Structural break chart"
      >
        <svg
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-label="A schematic chart of a structural break. A historical series runs stable and mildly cyclical up to a marked break point. From that point two paths diverge: a forecast that continues the historical relationship and stays flat, and an actual path that rises sharply away from it. The widening gap between them is labelled as forecast error. The chart illustrates the shape of a structural break; it does not plot published data."
          className="block w-full"
          style={{ minWidth: 480 }}
        >
          {/* Baseline grid — an analytical plane, not a decorative one. */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
            <line
              key={ratio}
              x1={60}
              y1={toY(ratio * 0.9)}
              x2={W - 50}
              y2={toY(ratio * 0.9)}
              stroke="var(--hairline-faint)"
              strokeWidth={1}
            />
          ))}

          {/* The break. */}
          <line
            x1={toX(breakX)}
            y1={40}
            x2={toX(breakX)}
            y2={H - 70}
            stroke="var(--color-rupture)"
            strokeWidth={1}
            strokeDasharray="4 5"
          />
          <text
            x={toX(breakX) + 8}
            y={54}
            fontSize={10}
            letterSpacing="0.16em"
            fill="var(--color-rupture)"
            style={{ textTransform: "uppercase" }}
          >
            Regime change
          </text>

          {/* The error band. */}
          <path
            d={`${path(forecast)} L ${actual[actual.length - 1]!.x} ${actual[actual.length - 1]!.y} ${path([...actual].reverse()).replace("M", "L")} Z`}
            fill="var(--color-rupture)"
            opacity={0.09}
          />

          <path d={path(history)} fill="none" stroke="var(--color-bone)" strokeWidth={1.8} />
          <path
            d={path(forecast)}
            fill="none"
            stroke="var(--color-steel)"
            strokeWidth={1.6}
            strokeDasharray="6 4"
          />
          <path d={path(actual)} fill="none" stroke="var(--color-rupture)" strokeWidth={1.8} />

          {/* Labels sit on the lines they name — no separate legend to cross-reference. */}
          <text
            x={72}
            y={toY(0.42)}
            fontSize={10}
            letterSpacing="0.14em"
            fill="var(--color-bone)"
            style={{ textTransform: "uppercase" }}
          >
            Historical relationship
          </text>
          <text
            x={toX(0.72)}
            y={toY(0.24)}
            fontSize={10}
            letterSpacing="0.14em"
            fill="var(--color-steel)"
            style={{ textTransform: "uppercase" }}
          >
            Forecast
          </text>
          <text
            x={toX(0.78)}
            y={toY(0.74)}
            fontSize={10}
            letterSpacing="0.14em"
            fill="var(--color-rupture)"
            style={{ textTransform: "uppercase" }}
          >
            Actual
          </text>
          <text
            x={toX(0.86)}
            y={toY(0.5)}
            fontSize={9.5}
            letterSpacing="0.14em"
            fill="var(--color-muted-bone)"
            style={{ textTransform: "uppercase" }}
          >
            Error
          </text>
        </svg>
      </div>

      <figcaption className="u-instrument mt-6">
        Schematic. Illustrates the shape of a structural break — not a plot of published series.
      </figcaption>
    </figure>
  );
}
