import { StoryChapterSection } from "@/components/story/StoryChapter";
import { CausalDiagram } from "@/components/hypergraph/CausalDiagram";
import { InstrumentLabel } from "@/components/ui/InstrumentLabel";
import { ClaimClassChip } from "@/components/evidence/ClaimClassChip";
import { comingDecade } from "@/data/graphs";

/* ACT VII — THE COMING DECADE (§13)
   Eight pressures introduced as one interconnected system rather than a list.
   The traced path returns to where it started, which is the property that makes
   them a system. */

const PRESSURES = [
  "Geopolitical fragmentation",
  "AI infrastructure race",
  "Energy transition",
  "Electricity-demand growth",
  "Critical-mineral concentration",
  "Climate physical risk",
  "Supply-chain weaponisation",
  "Rapid technological change",
];

export function ComingDecadeScene() {
  return (
    <StoryChapterSection
      chapter="coming-decade"
      eyebrow="Why now"
      headline="The risks of the next decade do not arrive one at a time. They interact."
      headlineClassName="max-w-[22ch]"
      lede={
        <>
          Each of these is separately well documented and separately managed, usually by a
          different department, under a different model, on a different time horizon. The
          exposure lives in the connections between them — which is precisely the part no single
          department owns.
        </>
      }
    >
      <div className="grid grid-cols-1 gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:gap-24">
        <div>
          <InstrumentLabel as="h3">Eight concurrent pressures</InstrumentLabel>
          <ul className="mt-6 space-y-0">
            {PRESSURES.map((pressure, index) => (
              <li
                key={pressure}
                className="flex items-baseline gap-4 border-b border-[color:var(--hairline)] py-4"
              >
                <InstrumentLabel className="tabular-nums" tone="steel">
                  {String(index + 1).padStart(2, "0")}
                </InstrumentLabel>
                <span className="text-[0.9375rem] text-bone">{pressure}</span>
              </li>
            ))}
          </ul>

          <div className="mt-10">
            <ClaimClassChip claimClass="yukthi-interpretation" />
            <p className="u-body mt-5">
              A list invites you to rank them. A graph asks a different question: which of these
              share a node, and what happens when two of them move at once?
            </p>
            <p className="u-body mt-4">
              Trace one path and it returns to where it began. The AI build-out raises
              electricity demand, which raises demand for grid equipment, which raises demand
              for copper and critical minerals, which meets processing concentration, which —
              given the political relationship — becomes export-control exposure, which raises
              infrastructure cost, which delays data centres, which constrains compute, which
              intensifies the strategic competition that drove the build-out.
            </p>
            <p className="u-body mt-4">
              That closure is not a rhetorical flourish. It is the property that makes these
              pressures a system rather than a list, and it is the reason they cannot be managed
              one at a time.
            </p>
          </div>
        </div>

        <CausalDiagram graph={comingDecade} height={600} minWidth={640} />
      </div>
    </StoryChapterSection>
  );
}
