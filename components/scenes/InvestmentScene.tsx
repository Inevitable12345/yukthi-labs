import { INVESTMENT_CHAIN, LOSS_CHAIN, PROOF_QUESTIONS, VISIBILITY_CHAIN } from "@/content/thesis";
import { Room } from "@/components/story/Room";
import { RoomBody } from "@/components/story/RoomBody";
import { RoomHeading } from "@/components/story/RoomHeading";
import { Ladder } from "@/components/ui/Ladder";
import { Reveal } from "@/components/ui/Reveal";

/* ============================================================================
   ROOM 19 — THE BET  (§25, §26, §27)
   ----------------------------------------------------------------------------
   The experience slows. Minimal movement, editorial typography, and an argument
   that states its own conditionality: two chains compared, the thesis as an
   ordered sequence, and the four questions Yukthi has to answer before any of
   it is worth believing.
   ========================================================================== */

export function InvestmentScene() {
  return (
    <Room id="investment">
      <RoomHeading id="investment" size="display" />

      <div className="mt-14 grid gap-14 lg:grid-cols-[1fr_1fr] lg:gap-20">
        <RoomBody id="investment" />

        <div className="space-y-10">
          <Reveal>
            <div className="grid gap-8 sm:grid-cols-2">
              <div>
                <p className="label-dim mb-3">Without causal visibility</p>
                <Ladder steps={LOSS_CHAIN} dense />
              </div>
              <div>
                <p className="label mb-3">With causal visibility</p>
                <Ladder steps={VISIBILITY_CHAIN} dense />
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <Ladder steps={INVESTMENT_CHAIN} title="The thesis, in order" />
          </Reveal>

          <Reveal delay={180}>
            <div className="border border-brass-dim/60 p-6">
              <p className="label">Four proof questions</p>
              <p className="mt-3 max-w-[52ch] text-[0.86rem] leading-relaxed text-ash">
                Stated here, before there is anything to defend, so that they can be used against
                Yukthi later. The standard is intentionally falsifiable.
              </p>
              <ol className="mt-5 space-y-3">
                {PROOF_QUESTIONS.map((question, index) => (
                  <li key={question} className="flex gap-3">
                    <span className="font-mono text-[0.68rem] text-brass-dim">
                      {(index + 1).toString().padStart(2, "0")}
                    </span>
                    <span className="font-display text-[1.02rem] leading-snug text-bone">
                      {question}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>
        </div>
      </div>
    </Room>
  );
}
