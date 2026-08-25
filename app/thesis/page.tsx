import { CausalHypergraph } from "@/components/hypergraph/CausalHypergraph";
import { CausalOrderTrace } from "@/components/visualization/CausalOrderTrace";
import { EvidenceMarker } from "@/components/evidence/EvidenceMarker";
import { FutureFan } from "@/components/visualization/FutureFan";
import { MapMonitorForecastLoop } from "@/components/visualization/MapMonitorForecastLoop";
import { StructuralBreakChart } from "@/components/visualization/StructuralBreakChart";
import { ThesisSection, ThesisIndex } from "@/components/thesis/ThesisSection";
import { PageShell } from "@/components/layout/PageShell";
import { WebPageJsonLd } from "@/components/layout/JsonLd";
import { InstrumentLabel } from "@/components/ui/InstrumentLabel";
import { ActionLink } from "@/components/ui/ActionLink";
import { buildMetadata } from "@/lib/metadata/build-metadata";
import { convergenceChain } from "@/data/convergence";
import { rareEarthCascade } from "@/data/rare-earth";
import { semiconductorHypergraph } from "@/data/semiconductor";
import { uriLoop } from "@/data/uri";
import { insuranceAccumulation } from "@/data/insurance";
import { SITE } from "@/lib/metadata/site";

export const metadata = buildMetadata({
  title: "Thesis",
  description:
    "The full argument: the stability assumption, structural rupture, economic weaponisation, nonlinear cascades, structural breaks, the new AI capability, and the technical bet that follows from them.",
  path: "/thesis",
});

export const SECTIONS = [
  { id: "mission", index: "00", title: "Mission" },
  { id: "stability", index: "01", title: "The stability assumption" },
  { id: "rupture", index: "02", title: "Structural rupture" },
  { id: "weaponization", index: "03", title: "Economic weaponisation" },
  { id: "cascades", index: "04", title: "Nonlinear cascades" },
  { id: "breaks", index: "05", title: "Structural breaks" },
  { id: "capability", index: "06", title: "New AI capability" },
  { id: "bet", index: "07", title: "The technical bet" },
  { id: "product", index: "08", title: "Product consequence" },
  { id: "ambition", index: "09", title: "Civilizational ambition" },
];

export default function ThesisPage() {
  return (
    <>
      <WebPageJsonLd
        name="Thesis"
        description="The full Yukthi Lab argument, with its evidence attached."
        path="/thesis"
      />
      <PageShell
        eyebrow="00 / thesis"
        title="The argument, in full."
        lede="Ten sections. Every factual claim carries a source marker you can open where it stands. Every diagram states whether its structure was observed or constructed."
        aside={
          <div>
            <InstrumentLabel as="p">Reading time</InstrumentLabel>
            <p className="mt-2 font-mono text-[0.8125rem] text-muted-bone">About 18 minutes</p>
            <p className="mt-6">
              <ActionLink href="/evidence">Go straight to the evidence</ActionLink>
            </p>
          </div>
        }
      >
        <div className="u-gutter grid grid-cols-1 gap-16 py-16 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-20 lg:py-24">
          <ThesisIndex sections={SECTIONS} />

          <div className="min-w-0">
            <ThesisSection id="mission" index="00" title="Mission">
              <p className="u-display-3 text-bone">{SITE.mission}</p>
              <p>
                That sentence is not a promise to predict what happens. It is a commitment to a
                narrower and more defensible thing: to make the structure of a situation legible
                before its consequences arrive, so that a decision-maker can see which of their
                assumptions is load-bearing and which has quietly stopped being true.
              </p>
              <p>
                The argument for why that is now both necessary and possible runs through the
                nine sections below. It has two halves. The first is that the world&rsquo;s
                causal structure is changing in ways that make historically fitted models
                fragile. The second is that machine reasoning has become capable enough to
                maintain an explicit causal representation continuously, which is the thing that
                was previously impossible at any useful scale.
              </p>
            </ThesisSection>

            <ThesisSection id="stability" index="01" title="The stability assumption">
              <p>
                The operating model of the last several decades assumed relative stability:
                expanding globalisation, predictable trade, dependable supply chains,
                functioning multilateral institutions, and — underneath all of it — the
                assumption that historical patterns remain useful guides to the future.
              </p>
              <p>
                That last assumption is the one that matters, because it is the one every
                quantitative method depends on. A forecasting model does not learn the world. It
                learns a relationship in the world, and it is correct for exactly as long as
                that relationship holds.
              </p>
              <p>
                Under stable structure, extrapolation is not a shortcut. It is the right method,
                and the discipline built around it is a genuine intellectual achievement.
                Nothing in this thesis is an argument that forecasting science is misguided.
              </p>
            </ThesisSection>

            <ThesisSection id="rupture" index="02" title="Structural rupture">
              <p>
                The claim is not that uncertainty has increased. It is that the structure
                generating outcomes is itself changing: emerging multipolarity, geoeconomic
                confrontation, trade fragmentation along geopolitical lines, friend-shoring,
                industrial policy, and national resilience as an organising goal.
              </p>
              <p>
                WTO staff find trade measurably reorganising along geopolitical lines while
                stopping short of declaring fragmentation complete.{" "}
                <EvidenceMarker id="E-017" /> The World Economic Forum&rsquo;s 2026 risk survey
                places geoeconomic confrontation first among risks most likely to trigger a
                material global crisis. <EvidenceMarker id="E-003" />
              </p>
              <p>
                A rupture is not a larger shock. A transition moves a system along relationships
                that continue to hold; a rupture changes which relationships hold at all. The
                first can be forecast by extrapolation. The second cannot be — by anyone.
              </p>
              <p>
                The consequence is a set of second-order effects that compound: more plausible
                futures, wider uncertainty, more nonlinearity, greater exposure to regime
                change, and a higher cost attached to each decision error.
              </p>
            </ThesisSection>

            <ThesisSection id="weaponization" index="03" title="Economic weaponisation">
              <p>
                Trade, technology, critical minerals, energy, finance, tariffs, sanctions and
                supply chains are increasingly instruments of state power. That converts the
                architecture of the global economy from a setting into a variable.
              </p>
              <p>
                The economic magnitude is not speculative. IMF staff estimate long-term output
                losses from trade fragmentation ranging from about 0.2% of global GDP under
                limited fragmentation to nearly 7% in a severe scenario with high adjustment
                costs, rising to 8–12% in some economies once technological decoupling is
                included. <EvidenceMarker id="E-001" /> WTO simulation work, using a different
                method, reaches roughly 5% of global real income under full decoupling into two
                blocs. <EvidenceMarker id="E-002" />
              </p>
              <p className="u-display-3 border-l border-[color:var(--color-gold-dim)] pl-6 text-bone">
                The architecture of the global economy itself is becoming a risk variable.
              </p>
              <p>
                Two independent modelling traditions agreeing on the order of magnitude is
                stronger evidence than either alone. Neither is a forecast; both are scenario
                ranges, and the width of the range is itself the finding.
              </p>
            </ThesisSection>

            <ThesisSection id="cascades" index="04" title="Nonlinear cascades">
              <p>
                Small upstream events can produce nonlinear downstream losses. The mechanism is
                always the same: a concentrated dependency that many apparently unrelated
                activities share, and which nobody was monitoring because it looked like a
                commodity input.
              </p>
              <ThesisFigure>
                <CausalHypergraph graph={rareEarthCascade} height={520} minWidth={900} />
              </ThesisFigure>
              <p>
                Roughly 90% of global rare-earth refining capacity sits in one jurisdiction.{" "}
                <EvidenceMarker id="E-005" /> In April 2025 an export licensing requirement was
                imposed on seven medium and heavy rare earths and certain permanent magnets.{" "}
                <EvidenceMarker id="E-004" /> The IEA estimates that under full implementation,
                up to USD 6.5 trillion of annual economic activity outside China would sit
                behind that constraint. <EvidenceMarker id="E-006" />
              </p>
              <p>
                The semiconductor episode makes the representational point rather than the
                magnitude one. Seven distinct conditions converged on a single shared input,
                none of them sufficient alone.
              </p>
              <ThesisFigure>
                <CausalHypergraph graph={semiconductorHypergraph} height={600} minWidth={960} />
              </ThesisFigure>
              <p>
                A pairwise graph can say <em>A affects C</em>. It cannot say{" "}
                <em>A, B and D together produce C, and none of them does alone</em>. That
                sentence needs an edge between sets — a hyperedge — and it is the reason the
                world model is built on one.
              </p>
              <p>
                Physical systems add a further mechanism: reinforcement. In February 2021, loss
                of electricity supply disabled the natural gas infrastructure that fuelled
                electricity generation, which deepened the loss of supply.{" "}
                <EvidenceMarker id="E-010" />
              </p>
              <ThesisFigure>
                <CausalHypergraph graph={uriLoop} height={520} minWidth={620} />
              </ThesisFigure>
              <p>
                And accumulation adds a third: exposure that was underwritten as independent
                turning out to share a root cause. Swiss Re Institute reports USD 137 billion of
                insured natural catastrophe losses in 2024 against USD 318 billion of economic
                losses — 57% of the economic loss uninsured. <EvidenceMarker id="E-011" />
              </p>
              <ThesisFigure>
                <CausalHypergraph graph={insuranceAccumulation} height={440} minWidth={860} />
              </ThesisFigure>
              <p>
                None of these is a weather problem, a supplier problem or a pricing problem.
                They are all the same problem: a causal structure that no single model
                contained.
              </p>
            </ThesisSection>

            <ThesisSection id="breaks" index="05" title="Structural breaks">
              <p>
                Historical models become most fragile exactly when regimes change — which is to
                say, exactly when their output matters most.
              </p>
              <ThesisFigure>
                <StructuralBreakChart />
              </ThesisFigure>
              <p>
                The European Central Bank&rsquo;s own review of its 2021–22 projections found
                short-term inflation accuracy deteriorating sharply, with the errors
                concentrated where energy dynamics and supply bottlenecks had changed what
                generated the data. <EvidenceMarker id="E-008" /> The underestimation for the
                first quarter of 2022 was reported as the largest one-quarter-ahead error since
                Eurosystem staff projections began in 1998. <EvidenceMarker id="E-009" />
              </p>
              <p>
                This is not a criticism of the ECB. It is the general case, and the ECB deserves
                credit for publishing it. Any model that extrapolates a relationship fails when
                the relationship stops holding, and no quantity of additional history contains
                information about a structure that has not existed before.
              </p>
            </ThesisSection>

            <ThesisSection id="capability" index="06" title="New AI capability">
              <p>
                On the other side of the problem, something changed. Machine systems can now
                search large information spaces, synthesise heterogeneous evidence, reason
                probabilistically, generate and aggregate forecasts, and update continuously.
              </p>
              <p>
                An ensemble of twelve language models producing probabilistic forecasts across a
                three-month tournament was statistically indistinguishable from a crowd of 925
                human forecasters. <EvidenceMarker id="E-012" /> A retrieval-augmented system
                approaches aggregated human crowd accuracy on binary questions.{" "}
                <EvidenceMarker id="E-013" /> More recent evaluations put frontier models past a
                general crowd baseline and still behind expert forecasters.{" "}
                <EvidenceMarker id="E-014" />
              </p>
              <p className="border-l border-[color:var(--color-rupture-deep)] pl-6">
                What this evidence does <em>not</em> establish: that AI outperforms trained
                superforecasters, or that a model can construct a correct causal structure
                unaided. This site does not claim either, and would have to retract if it did.
              </p>
              <p>
                The honest reading is narrower and still significant. Several components a world
                model would need can now be performed at machine scale and machine continuity.
                Assembled without causal structure, they produce a continuously updated
                correlation — the object that fails under regime change, only faster.
              </p>
            </ThesisSection>

            <ThesisSection id="bet" index="07" title="The technical bet">
              <p className="u-display-3 text-bone">{SITE.technicalBet}</p>
              <p>
                Frontier AI, forecasting science and an explicit causal structure, connected so
                that each supplies what the others cannot. The machine components provide scale
                and continuity. The causal structure provides the part that survives a change of
                regime: a statement of <em>why</em>, which can be checked, argued with, and
                found wrong.
              </p>
              <p>
                <strong>Scoped</strong>, because a model of everything is not a model. Structure
                is built around a decision with a stated boundary, and rebuilt when the evidence
                says the boundary was in the wrong place.
              </p>
              <ThesisFigure>
                <MapMonitorForecastLoop />
              </ThesisFigure>
              <p>
                The loop is closed on purpose. Re-mapping changes the structure that mapping
                produced, so the process has no final state — which is the only arrangement that
                can survive a world whose structure keeps moving.
              </p>
              <ThesisFigure>
                <CausalHypergraph graph={convergenceChain} height={840} minWidth={520} />
              </ThesisFigure>
            </ThesisSection>

            <ThesisSection id="product" index="08" title="Product consequence">
              <p className="u-display-3 text-bone">{SITE.promise}</p>
              <p>
                Not <em>we predict the future</em>. The useful claim is narrower: understand
                what changed, trace where it propagates, see which assumptions became fragile,
                explore what happens three causal steps later, quantify plausible futures, and
                intervene before loss compounds.
              </p>
              <ThesisFigure>
                <CausalOrderTrace />
              </ThesisFigure>
              <p>
                And when the structure is held explicitly, the branching of futures becomes
                inspectable rather than rhetorical — each branch carrying the drivers and the
                assumptions that would have to hold for it.
              </p>
              <ThesisFigure>
                <FutureFan />
              </ThesisFigure>
            </ThesisSection>

            <ThesisSection id="ambition" index="09" title="Civilizational ambition">
              <p>
                The coming decade needs an always-on causal intelligence layer that understands
                how the world is changing, not only how it behaved before.
              </p>
              <p className="u-display-3 text-bone">
                Understand what is changing. Reason about what comes next. Make robust decisions
                before uncertainty becomes catastrophe.
              </p>
              <p>
                Whether Yukthi Lab succeeds at that is an empirical question, and the benchmarks
                are stated plainly on the <a href="/architecture">architecture</a> page: did the
                system identify consequential risks earlier, were its probabilities better
                calibrated, did it reveal causal pathways existing systems missed, and could the
                user intervene before the loss occurred. None of those has been demonstrated
                yet. They are the tests this work intends to be judged by.
              </p>
            </ThesisSection>
          </div>
        </div>
      </PageShell>
    </>
  );
}

/** Figures break out of the reading measure into the full column width. */
function ThesisFigure({ children }: { children: React.ReactNode }) {
  return <div className="my-12 min-w-0 max-w-none xl:-mr-10 2xl:-mr-16">{children}</div>;
}
