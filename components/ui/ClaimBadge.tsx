import { CLAIM_CLASS_LABEL, type ClaimClass } from "@/lib/graph/types";
import { cn } from "@/lib/utils/cn";

const TONE: Record<ClaimClass, string> = {
  source: "border-signal-dim text-signal",
  interpretation: "border-brass-dim text-brass",
  illustration: "border-graphite text-ash",
  ambition: "border-graphite text-bone/70",
};

/**
 * §33's central discipline made visible: a source fact, an interpretation, an
 * illustration and an ambition never share a typographic register.
 */
export function ClaimBadge({ claim, className }: { claim: ClaimClass; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center border px-2 py-0.5 font-mono text-[0.625rem] tracking-[0.16em] uppercase",
        TONE[claim],
        className,
      )}
    >
      {CLAIM_CLASS_LABEL[claim]}
    </span>
  );
}
