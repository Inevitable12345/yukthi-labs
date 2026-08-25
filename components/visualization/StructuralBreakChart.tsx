import { IllustrativeBadge } from "@/components/evidence/IllustrativeBadge";
import { EvidenceMarker } from "@/components/evidence/EvidenceMarker";
import { InstrumentLabel } from "@/components/ui/InstrumentLabel";

/* ============================================================================
   STRUCTURAL BREAK — SCHEMATIC
   ----------------------------------------------------------------------------
   A diagram of a mechanism, not a plot of data.

   The ordinate carries no scale and the abscissa carries no dates, because no
   series is being plotted. Drawing the ECB episode as a chart with numbers on it
   would manufacture data that was never fitted here. The verified claims about
   that episode are in E-008 and E-009 and are stated in words beside the diagram.
   ========================================================================== */

const HISTORY =
  "M 60 250 C 130 244, 160 258, 220 248 C 280 238, 310 256, 370 246 C 430 236, 460 254, 520 244";
const PROJECTION = "M 520 244 C 600 238, 700 234, 900 230";
const ACTUAL = "M 520 244 C 590 226, 640 176, 700 120 C 745 78, 800 62, 900 58";
const CONE_UPPER = "M 520 244 C 610 232, 720 224, 900 218";
const CONE_LOWER = "M 520 244 C 610 250, 720 250, 900 248";
/** The region between the projected path and the path actually taken. */
const ERROR_REGION =
  "M 520 244 C 590 226, 640 176, 700 120 C 745 78, 800 62, 900 58 L 900 230 C 700 234, 600 238, 520 244 Z";

export function StructuralBreakChart() {
  return (
    <figure className="relative">
      <figcaption className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <InstrumentLabel tone="steel">Forecast under a change of regime</InstrumentLabel>
        <IllustrativeBadge label="Schematic — no data plotted" />
      </figcaption>

      {/* This diagram holds no controls, so the scroll frame itself must be
          focusable — otherwise a keyboard user cannot reach the part of the chart
          that is off-screen at narrow widths. */}
      <div
        className="u-figure-scroll border border-[color:var(--hairline)] bg-deep-field/40"
        tabIndex={0}
        role="group"
        aria-label="Structural break diagram — scrollable horizontally"
      >
        <svg
          viewBox="0 0 960 340"
          role="img"
          aria-label="A schematic of forecast failure under a structural break. Time runs left to right; the vertical axis is an unscaled level. A solid line traces the historical period, moving in a narrow, regular band — the regime a model is fitted on. A vertical rule marks the structural break: the point at which the relationships generating the data change. To the right of it two paths separate. A dashed line continues almost flat: the projection the fitted model produces, because it extrapolates the relationships it learned. A solid line rises steeply away from it: the path actually taken. Between the two, a widening shaded region is the forecast error. A thin cone around the projection shows the model's own stated uncertainty, and the actual path leaves it entirely. The diagram carries no numbers because no series is being plotted; it is a picture of a mechanism, not a record of an episode."
          className="block h-auto w-full"
          style={{ minWidth: 760 }}
        >
          <defs>
            <linearGradient id="break-error" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--color-rupture)" stopOpacity="0.02" />
              <stop offset="100%" stopColor="var(--color-rupture)" stopOpacity="0.16" />
            </linearGradient>
          </defs>

          {/* axes */}
          <path d="M 60 296 L 900 296" stroke="var(--hairline-strong)" strokeWidth="1" />
          <path d="M 60 44 L 60 296" stroke="var(--hairline-strong)" strokeWidth="1" />
          <text
            x="900"
            y="316"
            textAnchor="end"
            fontSize="10"
            letterSpacing="0.18em"
            fill="var(--color-dim-bone)"
          >
            TIME →
          </text>
          <text
            x="52"
            y="44"
            textAnchor="end"
            fontSize="10"
            letterSpacing="0.18em"
            fill="var(--color-dim-bone)"
            transform="rotate(-90 52 44)"
          >
            LEVEL (UNSCALED)
          </text>

          {/* the fitted regime */}
          <rect
            x="60"
            y="44"
            width="460"
            height="252"
            fill="var(--color-steel)"
            fillOpacity="0.03"
          />
          <text x="72" y="66" fontSize="10" letterSpacing="0.18em" fill="var(--color-steel)">
            HISTORICAL REGIME · MODEL FITTED HERE
          </text>

          {/* the error region */}
          <path d={ERROR_REGION} fill="url(#break-error)" stroke="none" opacity="0.9" />

          {/* stated uncertainty around the projection */}
          <path
            d={CONE_UPPER}
            fill="none"
            stroke="var(--color-dim-bone)"
            strokeWidth="1"
            strokeDasharray="2 5"
          />
          <path
            d={CONE_LOWER}
            fill="none"
            stroke="var(--color-dim-bone)"
            strokeWidth="1"
            strokeDasharray="2 5"
          />

          {/* history */}
          <path d={HISTORY} fill="none" stroke="var(--color-steel)" strokeWidth="1.8" />

          {/* projection */}
          <path
            d={PROJECTION}
            fill="none"
            stroke="var(--color-gold)"
            strokeWidth="1.6"
            strokeDasharray="7 6"
          />

          {/* actual */}
          <path d={ACTUAL} fill="none" stroke="var(--color-rupture)" strokeWidth="2" />

          {/* the break */}
          <path
            d="M 520 44 L 520 296"
            stroke="var(--color-rupture)"
            strokeWidth="1"
            strokeDasharray="3 4"
          />
          <circle
            cx="520"
            cy="244"
            r="4"
            fill="var(--color-void)"
            stroke="var(--color-rupture)"
            strokeWidth="1.6"
          />
          <text x="530" y="62" fontSize="10" letterSpacing="0.18em" fill="var(--color-rupture)">
            STRUCTURAL BREAK
          </text>
          <text x="530" y="78" fontSize="9" letterSpacing="0.1em" fill="var(--color-dim-bone)">
            CAUSAL DRIVERS CHANGE
          </text>

          {/* series labels */}
          <text x="905" y="62" fontSize="10" letterSpacing="0.14em" fill="var(--color-rupture)">
            ACTUAL
          </text>
          <text x="905" y="234" fontSize="10" letterSpacing="0.14em" fill="var(--color-gold)">
            FORECAST
          </text>
          <text
            x="905"
            y="248"
            fontSize="9"
            letterSpacing="0.08em"
            fill="var(--color-dim-bone)"
          >
            FITTED PATH
          </text>
          <text x="200" y="238" fontSize="10" letterSpacing="0.14em" fill="var(--color-steel)">
            OBSERVED
          </text>

          {/* divergence callout */}
          <path
            d="M 700 120 L 700 230"
            stroke="var(--color-rupture)"
            strokeWidth="1"
            strokeDasharray="2 4"
            opacity="0.7"
          />
          <text
            x="710"
            y="180"
            fontSize="10"
            letterSpacing="0.12em"
            fill="var(--color-rupture)"
          >
            FORECAST ERROR
          </text>
        </svg>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <p className="u-body">
          The model is not badly built. It is well built for a world that has stopped existing.
          Its projection is the honest output of the relationships it was fitted on, and those
          relationships changed on the vertical rule.
        </p>
        <p className="u-body">
          The ECB&rsquo;s own review of 2021–22 found exactly this pattern: a marked
          deterioration in short-term inflation projection accuracy, concentrated where energy
          dynamics and supply bottlenecks had altered what generated the data.{" "}
          <EvidenceMarker id="E-008" /> <EvidenceMarker id="E-009" />
        </p>
      </div>
    </figure>
  );
}
