import { Room } from "@/components/story/Room";
import { RoomBody } from "@/components/story/RoomBody";
import { RoomHeading } from "@/components/story/RoomHeading";
import { Reveal } from "@/components/ui/Reveal";

/* ============================================================================
   ROOM 04 — CASCADE  (§9)
   ----------------------------------------------------------------------------
   Consequence travels through a mechanism. The pulses in the world instrument
   behind this room are causal effects; they are not ambient particles, and the
   grammar ladder beside the prose says what each stage of one means.
   ========================================================================== */

export function CascadeScene() {
  return (
    <Room id="cascade" pinned={false}>
      <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">
        <div>
          <RoomHeading id="cascade" />
          <RoomBody id="cascade" className="mt-9" showLadder={false} />
        </div>

        <Reveal delay={120} className="lg:sticky lg:top-28 lg:self-start">
          <div className="border-l border-graphite pl-6">
            <p className="label-dim">Visual grammar</p>
            <ol className="mt-4 space-y-5">
              {[
                ["Event", "Something happens, at a place, at a time."],
                ["Mechanism", "The stated reason the event can matter elsewhere."],
                ["Dependency", "The relationship the mechanism travels along."],
                ["Bottleneck", "Where the dependency has no substitute."],
                ["Second order", "Effects on systems the event never touched."],
                ["Third order", "Effects on systems the second order never touched."],
              ].map(([term, gloss], index) => (
                <li key={term}>
                  <p className="font-mono text-[0.72rem] tracking-[0.16em] uppercase text-brass">
                    {(index + 1).toString().padStart(2, "0")} · {term}
                  </p>
                  <p className="mt-1 max-w-[38ch] text-[0.86rem] leading-relaxed text-ash">
                    {gloss}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </Reveal>
      </div>
    </Room>
  );
}
