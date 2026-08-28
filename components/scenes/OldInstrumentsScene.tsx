import { INSTRUMENTS } from "@/content/thesis";
import { Room } from "@/components/story/Room";
import { RoomBody } from "@/components/story/RoomBody";
import { RoomHeading } from "@/components/story/RoomHeading";
import { Reveal } from "@/components/ui/Reveal";

/* ============================================================================
   ROOM 08 — THE OLD INSTRUMENTS  (§14)
   ----------------------------------------------------------------------------
   A museum, not a demolition. Every case is laid out identically — question,
   strength, limitation — because the argument depends on the reader accepting
   that each instrument is genuinely good at its own job. A page that mocked
   dashboards would forfeit the point it is trying to make.
   ========================================================================== */

export function OldInstrumentsScene() {
  return (
    <Room id="old-tools">
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div>
          <RoomHeading id="old-tools" />
          <RoomBody id="old-tools" className="mt-9" />
        </div>

        <ul className="grid gap-px bg-graphite sm:grid-cols-2">
          {INSTRUMENTS.map((instrument, index) => (
            <li key={instrument.id} className="bg-void">
              <Reveal delay={index * 60}>
                <article className="h-full p-5 sm:p-6">
                  <h3 className="font-mono text-[0.72rem] tracking-[0.2em] uppercase text-brass">
                    {instrument.name}
                  </h3>
                  <p className="standfirst mt-3 text-[1.02rem]">{instrument.question}</p>
                  <dl className="mt-5 space-y-3 text-[0.82rem] leading-relaxed">
                    <div>
                      <dt className="label-dim">Strength</dt>
                      <dd className="mt-1 text-bone/85">{instrument.strength}</dd>
                    </div>
                    <div>
                      <dt className="label-dim">Limitation</dt>
                      <dd className="mt-1 text-ash">{instrument.limitation}</dd>
                    </div>
                  </dl>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </Room>
  );
}
