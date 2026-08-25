"use client";

import { useState } from "react";

import { InstrumentLabel } from "@/components/ui/InstrumentLabel";
import { LAYER_STATUS_LABEL, architectureLayers, type LayerStatus } from "@/data/architecture";
import { track } from "@/lib/analytics/analytics";
import { cn } from "@/lib/utils/cn";

const STATUS_TONE: Record<LayerStatus, string> = {
  concept: "border-[color:var(--color-steel-dim)] text-steel",
  prototype: "border-[color:var(--color-gold-dim)] text-gold",
  validated: "border-[color:var(--color-steel-dim)] text-steel",
  production: "border-[color:var(--color-steel-dim)] text-steel",
  research: "border-[color:var(--color-rupture-deep)] text-rupture",
};

/**
 * The ten layers, each expandable.
 *
 * The maturity chip is not decoration and is never omitted. Yukthi Lab has not
 * supplied evidence that any layer is past `concept` or open `research`, so no
 * layer claims to be — a page that implied a working system would be the most
 * damaging thing this site could publish.
 */
export function ArchitectureLayers() {
  const [openId, setOpenId] = useState<string | null>(architectureLayers[0]!.id);

  return (
    <ol className="border-t border-[color:var(--hairline)]">
      {architectureLayers.map((layer) => {
        const isOpen = layer.id === openId;
        return (
          <li key={layer.id} className="border-b border-[color:var(--hairline)]">
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`layer-${layer.id}`}
                onClick={() => {
                  setOpenId(isOpen ? null : layer.id);
                  if (!isOpen) track("architecture_explore", { layer: layer.id });
                }}
                className="group flex w-full items-baseline gap-5 py-6 text-left sm:gap-8"
              >
                <span className="font-mono text-[0.6875rem] text-dim-bone tabular-nums">
                  {layer.index}
                </span>
                <span className="flex-1">
                  <span className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
                    <span
                      className={cn(
                        "u-display-3 transition-colors duration-300",
                        isOpen ? "text-gold" : "text-bone group-hover:text-gold",
                      )}
                    >
                      {layer.title}
                    </span>
                    <span
                      className={cn(
                        "border px-2 py-0.5 font-mono text-[0.5625rem] tracking-[0.16em] uppercase",
                        STATUS_TONE[layer.status],
                      )}
                    >
                      {LAYER_STATUS_LABEL[layer.status]}
                    </span>
                  </span>
                  <span className="mt-2 block max-w-2xl text-[0.875rem] leading-relaxed text-muted-bone">
                    {layer.purpose}
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className={cn(
                    "shrink-0 text-gold transition-transform duration-500",
                    isOpen ? "rotate-90" : "",
                  )}
                >
                  →
                </span>
              </button>
            </h3>

            {isOpen ? (
              <div
                id={`layer-${layer.id}`}
                className="grid grid-cols-1 gap-10 pb-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-16"
              >
                <p className="text-[0.9375rem] leading-[1.78] text-muted-bone">
                  {layer.detail}
                </p>
                <div className="space-y-7">
                  <div>
                    <InstrumentLabel as="h4">Inputs</InstrumentLabel>
                    <ul className="mt-2 space-y-1">
                      {layer.inputs.map((input) => (
                        <li key={input} className="text-[0.8125rem] text-muted-bone">
                          {input}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <InstrumentLabel as="h4">Outputs</InstrumentLabel>
                    <ul className="mt-2 space-y-1">
                      {layer.outputs.map((output) => (
                        <li key={output} className="text-[0.8125rem] text-muted-bone">
                          {output}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="border-l border-[color:var(--color-rupture-deep)] pl-4">
                    <InstrumentLabel as="h4" tone="rupture">
                      Open problem
                    </InstrumentLabel>
                    <p className="mt-2 text-[0.8125rem] leading-relaxed text-muted-bone">
                      {layer.openProblem}
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
