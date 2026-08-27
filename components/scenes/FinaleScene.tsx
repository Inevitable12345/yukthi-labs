import { StoryChapterSection } from "@/components/story/StoryChapter";
import { ActionLink } from "@/components/ui/ActionLink";
import { InstrumentLabel } from "@/components/ui/InstrumentLabel";
import { SITE } from "@/lib/metadata/site";

/* ============================================================================
   CIVILIZATIONAL FINALE (§22)
   ----------------------------------------------------------------------------
   Return to the world. It is no longer merely geographic — the persistent canvas
   behind this section is holding the futures form, branches extended.

   Restrained celestial geometry, a slow pullback, and the mission restated. The
   register is civilizational without mysticism: the instrument analogy is
   historical and literal, not metaphysical.
   ========================================================================== */

export function FinaleScene() {
  return (
    <StoryChapterSection
      chapter="finale"
      eyebrow="Ambition"
      headline="Civilizations have always built instruments to see farther."
      headlineClassName="max-w-[20ch]"
    >
      <div className="grid grid-cols-1 gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-24">
        <div className="space-y-8">
          <Line>Telescopes expanded what humanity could observe.</Line>
          <Line>Computation expanded what humanity could calculate.</Line>
          <Line>
            The next frontier is expanding what humanity can understand about interacting
            systems before consequential decisions are made.
          </Line>

          <Astrolabe />
        </div>

        <div className="space-y-16">
          <div>
            <p className="u-display-3 text-bone">{SITE.mission}</p>
          </div>

          <div className="border-l-2 border-gold-dim pl-8">
            <p className="font-display text-[1.5rem] leading-relaxed font-light text-bone">
              Understand what is changing.
              <br />
              Reason about what comes next.
              <br />
              Make robust decisions before uncertainty becomes catastrophe.
            </p>
          </div>

          <div className="border-t border-[color:var(--hairline)] pt-10">
            <p className="u-display-2 text-bone">Yukthi Lab</p>

            <nav aria-label="Continue" className="mt-12 flex flex-col gap-6">
              <ActionLink href="/thesis" tone="gold">
                Read the thesis
              </ActionLink>
              <ActionLink href="/technology">Explore the technical bet</ActionLink>
              <ActionLink href="/evidence">See the evidence</ActionLink>
              <ActionLink href="/contact">Talk to Yukthi</ActionLink>
            </nav>
          </div>
        </div>
      </div>
    </StoryChapterSection>
  );
}

function Line({ children }: { children: React.ReactNode }) {
  return (
    <p className="border-b border-[color:var(--hairline)] pb-8 font-display text-[1.5rem] leading-snug font-light text-muted-bone">
      {children}
    </p>
  );
}

/**
 * Restrained celestial geometry.
 *
 * An astrolabe ring: concentric graduated circles with tick marks. Static — the
 * instrument is the reference, not the animation. Purely decorative, so it is
 * hidden from assistive technology.
 */
function Astrolabe() {
  const size = 320;
  const centre = size / 2;

  return (
    <div className="pt-8">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="w-full max-w-[20rem]"
        aria-hidden="true"
        focusable="false"
      >
        {[0.42, 0.62, 0.82, 1].map((ratio, ringIndex) => (
          <g key={ratio}>
            <circle
              cx={centre}
              cy={centre}
              r={(size / 2 - 12) * ratio}
              fill="none"
              stroke="var(--hairline)"
              strokeWidth={ringIndex === 3 ? 1 : 0.6}
            />
          </g>
        ))}

        {/* Graduated ticks on the outer ring — the measurement face. */}
        {Array.from({ length: 72 }, (_, i) => {
          const angle = (i / 72) * Math.PI * 2;
          const outer = size / 2 - 12;
          const major = i % 6 === 0;
          const inner = outer - (major ? 12 : 5);
          return (
            <line
              key={i}
              x1={centre + Math.cos(angle) * inner}
              y1={centre + Math.sin(angle) * inner}
              x2={centre + Math.cos(angle) * outer}
              y2={centre + Math.sin(angle) * outer}
              stroke={major ? "var(--color-gold-dim)" : "var(--hairline)"}
              strokeWidth={major ? 1 : 0.6}
            />
          );
        })}

        {/* Two crossed rules and a single centre mark. */}
        <line
          x1={centre}
          y1={16}
          x2={centre}
          y2={size - 16}
          stroke="var(--hairline-faint)"
          strokeWidth={0.6}
        />
        <line
          x1={16}
          y1={centre}
          x2={size - 16}
          y2={centre}
          stroke="var(--hairline-faint)"
          strokeWidth={0.6}
        />
        <circle cx={centre} cy={centre} r={3} fill="var(--color-gold)" />
      </svg>

      <InstrumentLabel as="p" className="mt-6">
        An instrument is a commitment to seeing something before it arrives
      </InstrumentLabel>
    </div>
  );
}
