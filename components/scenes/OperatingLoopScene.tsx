"use client";

import { useRef, useState } from "react";

import { useGSAP } from "@gsap/react";

import { ScrollTrigger } from "@/lib/story/gsap";
import { useChapterProgress } from "@/lib/story/use-chapter-progress";
import { usePrefersReducedMotion } from "@/lib/utils/use-capability";
import { InstrumentLabel } from "@/components/ui/InstrumentLabel";
import { ClaimClassChip } from "@/components/evidence/ClaimClassChip";
import { cn } from "@/lib/utils/cn";

/* ============================================================================
   THE OPERATING LOOP (§17)
   ----------------------------------------------------------------------------
   Map → Monitor → Forecast → Simulate → Re-map, as one continuous pinned
   sequence rather than five feature cards.

   The single graph on the right is the same graph throughout. Each stage acts on
   it: Map builds it, Monitor lands evidence on it, Forecast extends paths from
   it, Simulate flips one condition and propagates, Re-map changes its structure
   in response. The reader should finish this section understanding that these
   are five things done to one object, not five products.

   Under reduced motion, and without JavaScript, all five stages are present in
   the DOM as an ordered list and the section does not pin.
   ========================================================================== */

const STAGES = [
  {
    id: "map",
    title: "Map",
    summary: "Construct the causal structure a specific decision depends on.",
    detail:
      "Entities, relations and mechanisms are assembled for one decision — not for the world. The scope is what makes the model tractable, and it is chosen deliberately rather than discovered by what data happened to be available.",
  },
  {
    id: "monitor",
    title: "Monitor",
    summary: "New evidence arrives and attaches to the structure it bears on.",
    detail:
      "Reports, filings, policy actions, prices and physical observations are resolved against the map. The question is never 'what happened today' but 'which relation in this model does today's news bear on'.",
  },
  {
    id: "forecast",
    title: "Forecast",
    summary: "Extend paths forward, with uncertainty that widens honestly.",
    detail:
      "Forecasts are produced along causal paths rather than by extrapolating a series. Where the structure is uncertain, the forecast says so — the uncertainty of the structure is part of the uncertainty of the answer.",
  },
  {
    id: "simulate",
    title: "Simulate",
    summary: "Change one condition. Watch the consequences propagate.",
    detail:
      "A condition is set — an export restriction becomes active, a route closes, a plant derates — and the model propagates it through first, second and third-order effects. This is the step that answers 'what breaks next', and the step a correlation model cannot perform at all.",
  },
  {
    id: "remap",
    title: "Re-map",
    summary: "Evidence that contradicts the structure changes the structure.",
    detail:
      "When observations stop fitting, the model's shape is revised rather than its parameters re-tuned. This is the difference between a system that degrades under regime change and one that responds to it — and it is the step that makes the loop a loop.",
  },
] as const;

export function OperatingLoopScene() {
  const chapterRef = useChapterProgress("operating-loop");
  const reducedMotion = usePrefersReducedMotion();
  const container = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState(0);

  useGSAP(
    () => {
      const element = container.current;
      // No pinning under reduced motion: the section becomes a plain sequence
      // and every stage is visible at once (§31).
      if (!element || reducedMotion) return;

      const trigger = ScrollTrigger.create({
        trigger: element,
        start: "top top",
        // One viewport height of scroll per stage, so no stage passes unread.
        end: () => `+=${STAGES.length * 90}%`,
        pin: true,
        anticipatePin: 1,
        scrub: false,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const index = Math.min(STAGES.length - 1, Math.floor(self.progress * STAGES.length));
          setStage(index);
        },
      });

      return () => trigger.kill();
    },
    { scope: container, dependencies: [reducedMotion] },
  );

  return (
    <section
      ref={chapterRef as React.RefObject<HTMLElement>}
      id="operating-loop"
      aria-labelledby="operating-loop-heading"
      className="relative border-t border-[color:var(--hairline)]"
    >
      <div
        ref={container}
        className={cn(
          "u-gutter flex min-h-screen flex-col justify-center py-24 lg:pl-[calc(var(--gutter)+var(--rail-width))]",
          reducedMotion && "min-h-0",
        )}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-baseline sm:gap-8">
          <InstrumentLabel tone="gold" className="tabular-nums">
            09
          </InstrumentLabel>
          <InstrumentLabel>The operating loop</InstrumentLabel>
        </div>

        <h2 id="operating-loop-heading" className="u-display-2 mt-8 max-w-[16ch] text-bone">
          Map. Monitor. Forecast. Simulate. Re-map.
        </h2>

        <p className="u-lede u-measure mt-8">
          Five things done to one object, continuously. The loop is the product — not five
          features that happen to be listed together.
        </p>

        <div className="mt-16 grid grid-cols-1 gap-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-20">
          <ol className="space-y-1">
            {STAGES.map((item, index) => {
              const active = !reducedMotion ? index === stage : true;
              const passed = !reducedMotion && index < stage;

              return (
                <li key={item.id}>
                  <div
                    className={cn(
                      "border-l py-5 pl-6 transition-all duration-500",
                      active
                        ? "border-gold"
                        : passed
                          ? "border-[color:var(--hairline-strong)]"
                          : "border-[color:var(--hairline)]",
                    )}
                  >
                    <div className="flex items-baseline gap-4">
                      <InstrumentLabel tone={active ? "gold" : "dim"} className="tabular-nums">
                        {String(index + 1).padStart(2, "0")}
                      </InstrumentLabel>
                      <h3
                        className={cn(
                          "font-display text-[1.75rem] leading-none font-light transition-colors",
                          active ? "text-bone" : "text-dim-bone",
                        )}
                      >
                        {item.title}
                      </h3>
                    </div>

                    <p
                      className={cn(
                        "mt-3 text-[0.9375rem] leading-relaxed transition-colors",
                        active ? "text-muted-bone" : "text-dim-bone",
                      )}
                    >
                      {item.summary}
                    </p>

                    {/* The detail is always in the DOM — collapsing it visually
                        must never remove it from the accessibility tree. */}
                    <p
                      className={cn(
                        "u-body mt-3 transition-opacity duration-500",
                        active ? "opacity-100" : "opacity-0 lg:h-0 lg:overflow-hidden",
                      )}
                    >
                      {item.detail}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>

          <div>
            <LoopDiagram
              stage={reducedMotion ? STAGES.length - 1 : stage}
              showAll={reducedMotion}
            />
            <ClaimClassChip claimClass="product-ambition" className="mt-6" />
            <p className="u-body mt-4 u-measure">
              This describes the architecture Yukthi is building. It is not a description of a
              running system with customers, and nothing here is model output.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * The one graph the loop acts on.
 *
 * Six nodes and their relations, drawn once. Each stage changes what is
 * emphasised — never what exists — because the argument is that these operations
 * share a substrate.
 */
function LoopDiagram({ stage, showAll }: { stage: number; showAll: boolean }) {
  const nodes = [
    { id: "a", x: 0.5, y: 0.12, label: "Policy" },
    { id: "b", x: 0.22, y: 0.38, label: "Supply" },
    { id: "c", x: 0.78, y: 0.38, label: "Price" },
    { id: "d", x: 0.3, y: 0.68, label: "Production" },
    { id: "e", x: 0.72, y: 0.68, label: "Demand" },
    { id: "f", x: 0.5, y: 0.9, label: "Outcome" },
  ];

  const edges = [
    ["a", "b"],
    ["a", "c"],
    ["b", "d"],
    ["c", "e"],
    ["d", "f"],
    ["e", "f"],
  ];

  const byId = new Map(nodes.map((node) => [node.id, node]));
  const W = 460;
  const H = 420;

  const at = (id: string) => {
    const node = byId.get(id)!;
    return { x: node.x * W, y: node.y * H };
  };

  const show = (from: number) => showAll || stage >= from;

  return (
    <figure className="m-0 min-w-0">
      <div
        className="u-figure-scroll"
        tabIndex={0}
        role="region"
        aria-label="The operating loop graph"
      >
        <svg
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-label="A six-node causal graph — policy, supply, price, production, demand and outcome. Across the loop it is built, has evidence attached, is extended forward into possible paths, has one condition changed and propagated, and finally has its own structure revised. It is the same graph at every stage."
          className="block w-full"
          style={{ minWidth: 360 }}
        >
          {/* MAP — the structure itself. */}
          <g>
            {edges.map(([from, to]) => {
              const a = at(from!);
              const b = at(to!);
              return (
                <line
                  key={`${from}-${to}`}
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  stroke="var(--color-steel-dim)"
                  strokeWidth={1.2}
                />
              );
            })}
          </g>

          {/* MONITOR — evidence arriving on the relations it bears on. */}
          <g className="transition-opacity duration-700" style={{ opacity: show(1) ? 1 : 0 }}>
            {edges.slice(0, 4).map(([from, to], index) => {
              const a = at(from!);
              const b = at(to!);
              return (
                <circle
                  key={`ev-${index}`}
                  cx={a.x + (b.x - a.x) * 0.55}
                  cy={a.y + (b.y - a.y) * 0.55}
                  r={3}
                  fill="var(--color-steel)"
                />
              );
            })}
          </g>

          {/* FORECAST — paths extending forward, widening. */}
          <g className="transition-opacity duration-700" style={{ opacity: show(2) ? 1 : 0 }}>
            {[-1, 0, 1].map((offset) => {
              const origin = at("f");
              return (
                <path
                  key={offset}
                  d={`M ${origin.x} ${origin.y} Q ${origin.x + offset * 40} ${origin.y + 18} ${origin.x + offset * 78} ${origin.y + 30}`}
                  fill="none"
                  stroke="var(--color-bone)"
                  strokeWidth={0.9}
                  strokeDasharray="3 5"
                  opacity={0.5}
                />
              );
            })}
          </g>

          {/* SIMULATE — one condition active, propagating downstream. */}
          <g className="transition-opacity duration-700" style={{ opacity: show(3) ? 1 : 0 }}>
            {[
              ["a", "b"],
              ["b", "d"],
              ["d", "f"],
            ].map(([from, to]) => {
              const a = at(from!);
              const b = at(to!);
              return (
                <line
                  key={`sim-${from}-${to}`}
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  stroke="var(--color-gold)"
                  strokeWidth={2}
                />
              );
            })}
            <text
              x={at("a").x}
              y={at("a").y - 26}
              textAnchor="middle"
              fontSize={9.5}
              letterSpacing="0.16em"
              fill="var(--color-gold)"
              style={{ textTransform: "uppercase" }}
            >
              Restriction = on
            </text>
          </g>

          {/* RE-MAP — a new relation the evidence forced into the structure. */}
          <g className="transition-opacity duration-700" style={{ opacity: show(4) ? 1 : 0 }}>
            <line
              x1={at("c").x}
              y1={at("c").y}
              x2={at("d").x}
              y2={at("d").y}
              stroke="var(--color-rupture)"
              strokeWidth={1.6}
              strokeDasharray="6 4"
            />
            <text
              x={(at("c").x + at("d").x) / 2}
              y={(at("c").y + at("d").y) / 2 - 10}
              textAnchor="middle"
              fontSize={9.5}
              letterSpacing="0.16em"
              fill="var(--color-rupture)"
              style={{ textTransform: "uppercase" }}
            >
              New relation
            </text>
          </g>

          {/* The nodes, drawn last so they sit above every layer. */}
          <g>
            {nodes.map((node) => {
              const point = at(node.id);
              return (
                <g key={node.id}>
                  <circle cx={point.x} cy={point.y} r={6} fill="var(--color-bone)" />
                  <text
                    x={point.x}
                    y={point.y + 20}
                    textAnchor="middle"
                    fontSize={9.5}
                    letterSpacing="0.14em"
                    fill="var(--color-muted-bone)"
                    style={{ textTransform: "uppercase" }}
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>
    </figure>
  );
}
