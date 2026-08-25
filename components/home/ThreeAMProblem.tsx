import { Act } from "./Act";
import { ScenarioSelector } from "@/components/scenario/ScenarioSelector";
import { CausalOrderTrace } from "@/components/visualization/CausalOrderTrace";

/* ACT 09 — THE 3 A.M. PROBLEM
   The commercial translation layer. A decision frame, deliberately not a grid of
   persona cards. */
export function ThreeAMProblem() {
  return (
    <Act
      id="three-am"
      index="Act 09"
      eyebrow="Decision scope"
      headline={
        <>
          The question is not: what happens next?
          <span className="mt-6 block text-muted-bone">
            The question is: what could invalidate the assumptions you are relying on?
          </span>
        </>
      }
      headlineClassName="max-w-[26ch]"
      lede="Every consequential decision rests on assumptions that are usually never written down. The 3 a.m. problem is not the event — it is the assumption that failed hours before anyone noticed."
    >
      <ScenarioSelector />

      <div className="mt-20">
        <CausalOrderTrace />
      </div>
    </Act>
  );
}
