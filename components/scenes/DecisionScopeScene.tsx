import { StoryChapterSection } from "@/components/story/StoryChapter";
import { ScopeLens } from "@/components/scope/ScopeLens";
import { WhatBreaksNext } from "@/components/demo/WhatBreaksNext";
import { InstrumentLabel } from "@/components/ui/InstrumentLabel";

/* ACT XI — THE 3 A.M. PROBLEMS (§18, §19)
   Architecture translated into economic value. Each question re-scopes the
   graph, which is the point: the same model, organised around a different
   decision. */
export function DecisionScopeScene() {
  return (
    <StoryChapterSection
      chapter="decision-scopes"
      eyebrow="The 3 a.m. problems"
      headline="Know what could break before it becomes your 3 a.m. problem."
      headlineClassName="max-w-[20ch]"
      lede={
        <>
          These are the questions people actually lose sleep over. Each one defines a scope — a
          set of entities, relations and monitored conditions — and the same causal world
          reorganises around it.
        </>
      }
    >
      <ScopeLens />

      <div className="mt-32">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-baseline sm:gap-8">
          <InstrumentLabel tone="gold">Illustrative</InstrumentLabel>
          <InstrumentLabel>What breaks next?</InstrumentLabel>
        </div>

        <h3 className="u-display-3 mt-6 max-w-[24ch] text-bone">
          Change one condition. Follow it three causal steps.
        </h3>

        <p className="u-lede u-measure mt-6">
          This is the shape of the answer a scoped causal model produces. The mechanisms are
          sourced; their arrangement into these paths is explanatory. Nothing here is live model
          output and nothing here carries a probability.
        </p>

        <div className="mt-14">
          <WhatBreaksNext />
        </div>
      </div>
    </StoryChapterSection>
  );
}
