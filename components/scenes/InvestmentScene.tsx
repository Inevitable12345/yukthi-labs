import { StoryChapterSection } from "@/components/story/StoryChapter";
import { InstrumentLabel } from "@/components/ui/InstrumentLabel";
import { ActionLink } from "@/components/ui/ActionLink";

/* ============================================================================
   THE INVESTMENT BET (§20, §21)
   ----------------------------------------------------------------------------
   Quiet and high-conviction. No market sizing, no traction, no fabricated
   numbers — because there are none to report, and inventing them would
   contradict the epistemic discipline the rest of the site argues for.

   The four proof questions are the centre of this section. Stating what would
   falsify the bet creates more credibility than any projection could.
   ========================================================================== */

const CHAIN = [
  "The world's structure is changing",
  "Interdependencies are becoming strategic",
  "Small shocks can create nonlinear losses",
  "Historical relationships become fragile under regime change",
  "AI can process and reason over evidence at new scale",
  "Explicit causal structure can connect these capabilities",
  "Yukthi builds an always-on causal intelligence layer",
];

const PROOF_QUESTIONS = [
  {
    question: "Did the system identify consequential risks earlier?",
    detail:
      "Measured against what the organisation actually knew at the time, not against hindsight. Earlier is only meaningful if it is early enough to act.",
  },
  {
    question: "Were its probabilities better calibrated?",
    detail:
      "Scored against resolved outcomes, on questions fixed in advance. Calibration is measured or it is not claimed.",
  },
  {
    question: "Did it reveal causal pathways existing systems missed?",
    detail:
      "A pathway that was present in the world, absent from the incumbent model, and consequential. All three conditions, or it does not count.",
  },
  {
    question: "Could the user intervene before the loss occurred?",
    detail:
      "The only test that matters commercially. Detection without a usable intervention window is analysis, not decision infrastructure.",
  },
];

const INVESTOR_QUESTIONS = [
  {
    q: "Why now?",
    a: "Two conditions became true at once. The structure of the world started moving fast enough that extrapolation degrades, and machine reasoning became good enough to process evidence at the scale a causal model requires. Neither alone would be sufficient.",
  },
  {
    q: "Why is it painful?",
    a: "Because the losses are nonlinear and land on decisions that were made correctly under the previous structure. A licensing change on seven elements sits upstream of trillions in exposed activity; a forecast miss lands as a record error in a well-run institution.",
  },
  {
    q: "Why are current systems insufficient?",
    a: "Not because they are badly built. Because a model fitted on history encodes an assumption it cannot state — that the process generating tomorrow's data is the one that generated yesterday's — and gives no warning when that stops holding.",
  },
  {
    q: "Why causal hypergraphs?",
    a: "Because the consequential situations are conjunctive and many-to-many. Pairwise edges cannot represent 'these together produce those', and that conjunction is usually the whole mechanism.",
  },
  {
    q: "Why scoped?",
    a: "Because a world model of everything is neither tractable nor necessary. A decision defines what must be represented and how deep the trace runs. Scope is the difference between a research programme and a product.",
  },
  {
    q: "Who pays?",
    a: "Organisations whose 3 a.m. question has a large number attached to it and no current owner: industrial operations, energy, insurance accumulation, supply chain, portfolio and bank risk, and government policy analysis.",
  },
  {
    q: "What must Yukthi prove?",
    a: "The four questions above, on real decisions, against incumbent systems. Everything else is a matter of execution.",
  },
  {
    q: "Why could this become strategically important?",
    a: "Because if it works it is infrastructure rather than an application — a layer that consequential decisions route through. Infrastructure positions are rare, slow to build, and difficult to displace once they hold.",
  },
];

export function InvestmentScene() {
  return (
    <StoryChapterSection
      chapter="investment"
      eyebrow="The investment bet"
      headline="The question is not whether the future can be predicted perfectly."
      headlineClassName="max-w-[22ch]"
      lede={
        <>
          It is whether consequential change can be detected, reasoned about and acted on{" "}
          <em>earlier</em>. That is a narrower claim, and it is the one this whole architecture
          is built to support.
        </>
      }
    >
      <div className="grid grid-cols-1 gap-16 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-24">
        <div>
          <InstrumentLabel as="h3">The chain of reasoning</InstrumentLabel>
          <ol className="mt-8">
            {CHAIN.map((link, index) => (
              <li key={link} className="relative pb-8 last:pb-0">
                <div className="flex gap-5">
                  <div className="flex flex-col items-center">
                    <span
                      aria-hidden="true"
                      className={
                        index === CHAIN.length - 1
                          ? "mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-gold"
                          : "mt-1.5 h-2 w-2 shrink-0 rounded-full bg-steel-dim"
                      }
                    />
                    {index < CHAIN.length - 1 ? (
                      <span
                        aria-hidden="true"
                        className="mt-1 w-px flex-1 bg-[color:var(--hairline)]"
                      />
                    ) : null}
                  </div>
                  <p
                    className={
                      index === CHAIN.length - 1
                        ? "font-display text-[1.375rem] leading-snug font-light text-bone"
                        : "text-[0.9375rem] leading-relaxed text-muted-bone"
                    }
                  >
                    {link}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-12 border-t border-[color:var(--hairline)] pt-8">
            <p className="u-body">
              There is no market sizing on this page. No traction figures, no pilot count, no
              accuracy claim, no named customers. None of those exist yet, and inventing them
              would contradict the entire argument above.
            </p>
          </div>
        </div>

        <div>
          <div className="border border-gold-dim p-8 sm:p-10">
            <InstrumentLabel as="h3" tone="gold">
              The four proof questions
            </InstrumentLabel>
            <p className="u-body mt-4">
              These are the tests Yukthi expects to be held to. Stating them is more useful than
              any projection, because they are falsifiable.
            </p>

            <ol className="mt-10 space-y-8">
              {PROOF_QUESTIONS.map((item, index) => (
                <li key={item.question} className="grid grid-cols-[2rem_minmax(0,1fr)] gap-4">
                  <InstrumentLabel tone="gold" className="tabular-nums">
                    {String(index + 1).padStart(2, "0")}
                  </InstrumentLabel>
                  <div>
                    <h4 className="font-display text-[1.25rem] leading-snug font-light text-bone">
                      {item.question}
                    </h4>
                    <p className="u-body mt-2">{item.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-16">
            <InstrumentLabel as="h3">The questions an investor should ask</InstrumentLabel>
            <dl className="mt-8 space-y-8">
              {INVESTOR_QUESTIONS.map((item) => (
                <div key={item.q} className="border-b border-[color:var(--hairline)] pb-8">
                  <dt className="font-display text-[1.25rem] leading-snug font-light text-bone">
                    {item.q}
                  </dt>
                  <dd className="u-body mt-3">{item.a}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-10 flex flex-wrap gap-8">
              <ActionLink href="/thesis" tone="gold">
                Read the thesis
              </ActionLink>
              <ActionLink href="/research">What Yukthi must prove</ActionLink>
            </div>
          </div>
        </div>
      </div>
    </StoryChapterSection>
  );
}
