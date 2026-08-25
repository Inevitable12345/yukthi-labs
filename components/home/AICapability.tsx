import { Act } from "./Act";
import { EvidenceMarker } from "@/components/evidence/EvidenceMarker";
import { InstrumentLabel } from "@/components/ui/InstrumentLabel";
import { MISSING_LAYER, capabilityStages } from "@/data/ai-capability";

/* ACT 10 — THE OPENING CREATED BY AI
   The most easily overclaimed section on the site, and therefore the most
   carefully hedged. Each capability is stated with its limit attached, in the
   same visual weight. No chatbot. */
export function AICapability() {
  return (
    <Act
      id="ai-capability"
      index="Act 10"
      eyebrow="What changed on the other side"
      headline="A new analytical capability is becoming possible."
      lede={
        <>
          The evidence does not show that a machine can build an accurate world model. It shows
          that machines can now perform several components a world model would need — and that
          is a different, smaller and checkable claim.
        </>
      }
    >
      <ol className="grid gap-px border border-[color:var(--hairline)] bg-[color:var(--hairline)] lg:grid-cols-5">
        {capabilityStages.map((stage) => (
          <li key={stage.id} className="flex flex-col bg-void p-6">
            <InstrumentLabel tone="steel" className="tabular-nums">
              {stage.index}
            </InstrumentLabel>
            <h3 className="mt-4 text-[1.0625rem] leading-tight text-bone">{stage.label}</h3>
            <p className="mt-4 flex-1 text-[0.8125rem] leading-relaxed text-muted-bone">
              {stage.claim}
            </p>
            <div className="mt-5 border-t border-[color:var(--color-rupture-deep)] pt-4">
              <InstrumentLabel as="p" tone="rupture">
                Limit
              </InstrumentLabel>
              <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-dim-bone">
                {stage.limit}
              </p>
            </div>
            <p className="mt-4 flex flex-wrap gap-2">
              {stage.evidenceIds.map((id) => (
                <EvidenceMarker key={id} id={id} />
              ))}
            </p>
          </li>
        ))}
      </ol>

      <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div>
          <p className="u-display-3 max-w-[20ch] text-gold">{MISSING_LAYER}</p>
          <p className="u-body mt-6">
            Search, synthesis, probabilistic reasoning, forecasting and continuous updating can
            all run without ever representing why one thing causes another. Assembled that way
            they produce a continuously updated correlation — which is exactly the object that
            fails under regime change, only faster.
          </p>
        </div>
        <div className="border-l border-[color:var(--hairline)] pl-8">
          <InstrumentLabel as="h3">What this site does not claim</InstrumentLabel>
          <ul className="mt-5 space-y-4">
            <Denial>
              That AI outperforms trained superforecasters. Evaluations show frontier models
              past a general crowd baseline and still behind expert forecasters.{" "}
              <EvidenceMarker id="E-014" />
            </Denial>
            <Denial>
              That a language model can construct a correct causal structure unaided. Nothing in
              the record supports that, and this lab does not assert it.
            </Denial>
            <Denial>
              That any of this predicts the future. The promise is narrower and more useful:
              know what could break.
            </Denial>
          </ul>
        </div>
      </div>
    </Act>
  );
}

function Denial({ children }: { children: React.ReactNode }) {
  return (
    <li className="relative pl-6 text-[0.875rem] leading-relaxed text-muted-bone">
      <span
        aria-hidden="true"
        className="absolute top-[0.62em] left-0 block h-px w-3 bg-[color:var(--color-rupture-deep)]"
      />
      {children}
    </li>
  );
}
