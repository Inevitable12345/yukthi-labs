import { CollaborationForm } from "@/components/contact/CollaborationForm";
import { MapMonitorForecastLoop } from "@/components/visualization/MapMonitorForecastLoop";
import { PageShell, Section } from "@/components/layout/PageShell";
import { Prose } from "@/components/layout/Prose";
import { WebPageJsonLd } from "@/components/layout/JsonLd";
import { Hairline } from "@/components/ui/Hairline";
import { InstrumentLabel } from "@/components/ui/InstrumentLabel";
import { ActionLink } from "@/components/ui/ActionLink";
import { buildMetadata } from "@/lib/metadata/build-metadata";
import { SITE } from "@/lib/metadata/site";

export const metadata = buildMetadata({
  title: "About",
  description:
    "Yukthi Lab's mission, its technical bet, how it works, the domains it intends to prove itself in, and how to make contact.",
  path: "/about",
});

const PROOF_GROUNDS = [
  {
    index: "01",
    title: "Supply chains",
    detail:
      "Tier-N dependency, concentration, and constraints that bind through licensing and qualification rather than through price.",
  },
  {
    index: "02",
    title: "Energy and grid",
    detail:
      "Coupled physical systems where fuel and electricity depend on each other, and where reinforcement compresses the response window.",
  },
  {
    index: "03",
    title: "Insurance and accumulation",
    detail:
      "Correlated loss forming across exposures that were written as independent, through infrastructure, liability and legal regime.",
  },
  {
    index: "04",
    title: "Markets under regime change",
    detail:
      "Correlation structures estimated on a previous regime, and what replaces them when the thing generating them moves.",
  },
  {
    index: "05",
    title: "Strategic and policy decisions",
    detail:
      "What happens three causal steps after a sanction, tariff or export restriction — including on the side that imposed it.",
  },
];

export default function AboutPage() {
  return (
    <>
      <WebPageJsonLd
        name="About"
        description="Yukthi Lab's mission, method and collaboration channel."
        path="/about"
      />
      <PageShell
        eyebrow="00 / about"
        title="An institution from the future that remembers civilization has a past."
        lede={SITE.mission}
      >
        <Section index="01 / mission" title="Mission">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-24">
            <Prose>
              <p>
                The world&rsquo;s prior operating model assumed relative stability — expanding
                globalisation, predictable trade, dependable supply chains, functioning
                multilateral institutions, and history as a usable guide to the future.
              </p>
              <p>
                That last assumption is the load-bearing one, because every quantitative method
                rests on it. Yukthi Lab exists because the structure generating outcomes is
                itself changing, and because a model of a relationship is only correct for as
                long as the relationship holds.
              </p>
              <p>
                The mission is not to predict what happens. It is to make the structure of a
                situation legible before its consequences arrive.
              </p>
            </Prose>
            <Prose>
              <h2>What the name carries</h2>
              <p>
                <strong>Yukti</strong> — reasoning, method, the joining of things so that they
                work. Not intuition and not computation alone: the discipline of connecting
                evidence to conclusion in a way that another person can follow and dispute.
              </p>
              <p>
                That is the standard the whole site is built to. Every claim carries a source.
                Every diagram states whether its structure was observed or constructed. Every
                field the system cannot fill says <em>not recorded</em> rather than showing a
                plausible number.
              </p>
            </Prose>
          </div>
        </Section>

        <Section index="02 / bet" title="The technical bet">
          <p className="u-display-2 max-w-[16ch] text-bone">{SITE.technicalBet}</p>
          <p className="u-lede u-measure mt-8">
            Frontier AI, forecasting science and an explicit causal structure, connected so that
            each supplies what the others cannot.
          </p>
          <div className="mt-16">
            <MapMonitorForecastLoop />
          </div>
          <p className="mt-12">
            <ActionLink href="/architecture">The architecture, layer by layer</ActionLink>
          </p>
        </Section>

        <Section index="03 / method" title="Research method">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-24">
            <Prose>
              <h2>Evidence first, and inspectable</h2>
              <p>
                Every factual claim on this site resolves to a record with a source, a date and
                a verification status. Records that have not been checked against the primary
                document say so wherever they appear, and are never quietly promoted.
              </p>

              <h2>Structure stated, not implied</h2>
              <p>
                A diagram whose structure was observed and a diagram drawn to explain a
                mechanism are different objects, and the site never lets them look the same.
                Illustrative material carries a badge at the point of use.
              </p>

              <h2>Claims sized to their evidence</h2>
              <p>
                The AI capability argument is the easiest thing on this site to overclaim, so it
                is stated with its limits attached at the same visual weight. Machine
                forecasting has crossed a general crowd baseline; it has not crossed the expert
                one, and this site says so.
              </p>
            </Prose>
            <Prose>
              <h2>What has not been done</h2>
              <p>
                There is no deployed system. No layer of the architecture is marked beyond
                concept or open research. No benchmark has been run, and the research page is
                empty because nothing has been produced for it.
              </p>
              <p>
                The benchmarks this work intends to be judged by are published on the
                architecture page — deliberately fixed before results exist rather than fitted
                to them afterwards: did the system identify consequential risks earlier, were
                its probabilities better calibrated, did it reveal causal pathways existing
                systems missed, and could the user intervene before the loss occurred.
              </p>
            </Prose>
          </div>
        </Section>

        <Section index="04 / proof grounds" title="Where this has to prove itself">
          <p className="u-lede u-measure">
            Domains chosen because each has a documented episode where the causal structure, not
            the data, was the binding constraint.
          </p>
          <ol className="mt-14">
            {PROOF_GROUNDS.map((ground) => (
              <li key={ground.index}>
                <Hairline />
                <div className="grid grid-cols-1 gap-x-10 gap-y-3 py-7 sm:grid-cols-[3.5rem_minmax(0,1fr)]">
                  <span className="font-mono text-[0.625rem] text-dim-bone tabular-nums">
                    {ground.index}
                  </span>
                  <span>
                    <span className="block text-[1.0625rem] leading-snug text-bone">
                      {ground.title}
                    </span>
                    <span className="mt-2 block max-w-2xl text-[0.875rem] leading-relaxed text-muted-bone">
                      {ground.detail}
                    </span>
                  </span>
                </div>
              </li>
            ))}
          </ol>
          <Hairline />
        </Section>

        <Section index="05 / contact" title="Collaboration">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-24">
            <div>
              <p className="u-lede u-measure">
                If you hold a decision whose failure mode you cannot yet name, that is the
                conversation worth having.
              </p>
              <div className="mt-10 space-y-6 text-[0.875rem] leading-relaxed text-muted-bone">
                <p>
                  Five fields, and only what is needed to write a reply. No newsletter, no
                  onboarding sequence, no analytics attached to the submission.
                </p>
                <p className="border-l border-[color:var(--color-rupture-deep)] pl-5 text-dim-bone">
                  Please do not send confidential, regulated or personally sensitive information
                  through this form. It is a first contact channel, not a secure one.
                </p>
              </div>
              <p className="mt-10">
                <ActionLink href="/privacy">What happens to what you send</ActionLink>
              </p>
            </div>

            <div>
              <InstrumentLabel as="h3" tone="gold">
                Enquiry
              </InstrumentLabel>
              <div className="mt-8">
                <CollaborationForm />
              </div>
            </div>
          </div>
        </Section>
      </PageShell>
    </>
  );
}
