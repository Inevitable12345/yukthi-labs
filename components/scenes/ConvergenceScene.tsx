import { CausalDiagram } from "@/components/causal/CausalDiagram";
import { CONVERGENCE_GRAPH } from "@/content/scenarios";
import { Room } from "@/components/story/Room";
import { RoomBody } from "@/components/story/RoomBody";
import { RoomHeading } from "@/components/story/RoomHeading";
import { Reveal } from "@/components/ui/Reveal";

/* ============================================================================
   ROOM 07 — CONVERGENCE  (§13)
   ----------------------------------------------------------------------------
   The camera pulls back and the separate exhibits resolve into one object. Ten
   systems, one graph, and a loop that returns from strategic competition to the
   policy node it started from.
   ========================================================================== */

const SYSTEMS = [
  "AI",
  "Energy",
  "Electricity",
  "Critical minerals",
  "Supply chains",
  "Geopolitics",
  "Climate",
  "Finance",
  "Infrastructure",
  "Technology",
];

export function ConvergenceScene() {
  return (
    <Room id="convergence">
      <RoomHeading id="convergence" />

      <div className="mt-12 grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div>
          <RoomBody id="convergence" />
        </div>

        <div className="space-y-8">
          <Reveal>
            <ul className="flex flex-wrap gap-2">
              {SYSTEMS.map((system) => (
                <li
                  key={system}
                  className="border border-graphite px-3 py-1.5 font-mono text-[0.68rem] tracking-[0.14em] uppercase text-ash"
                >
                  {system}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={120}>
            <CausalDiagram graph={CONVERGENCE_GRAPH} />
          </Reveal>
        </div>
      </div>
    </Room>
  );
}
