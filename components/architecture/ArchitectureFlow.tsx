import { InstrumentLabel } from "@/components/ui/InstrumentLabel";
import { architectureFlow } from "@/data/architecture";

/**
 * The conceptual flow, drawn as a closed cycle: new evidence returns to the top.
 * Rendered as an ordered list with rules rather than as an image, so it reads
 * correctly to a screen reader and prints.
 */
export function ArchitectureFlow() {
  return (
    <div className="relative">
      <InstrumentLabel tone="steel">Conceptual flow</InstrumentLabel>
      <ol className="mt-6 border-l border-[color:var(--hairline)] pl-8">
        {architectureFlow.map((stage, index) => {
          const isLast = index === architectureFlow.length - 1;
          return (
            <li key={stage} className="relative pb-7 last:pb-0">
              <span
                aria-hidden="true"
                className="absolute top-[0.6em] -left-[2.05rem] block h-1.5 w-1.5 rounded-full"
                style={{ background: isLast ? "var(--color-gold)" : "var(--color-steel)" }}
              />
              <span className="flex flex-wrap items-baseline gap-3">
                <span className="font-mono text-[0.625rem] text-dim-bone tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span
                  className="text-[0.9375rem] leading-snug"
                  style={{ color: isLast ? "var(--color-gold)" : "var(--color-bone)" }}
                >
                  {stage}
                </span>
              </span>
              {isLast ? (
                <span className="mt-2 block font-mono text-[0.625rem] tracking-[0.16em] text-dim-bone uppercase">
                  ↺ returns to the source / evidence layer
                </span>
              ) : null}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
