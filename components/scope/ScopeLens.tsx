"use client";

import { useId, useState } from "react";

import { decisionScopes } from "@/data/scopes";
import { EvidenceInspector } from "@/components/evidence/EvidenceInspector";
import { InstrumentLabel } from "@/components/ui/InstrumentLabel";
import { cn } from "@/lib/utils/cn";

/* ============================================================================
   THE SCOPE LENS (§16, §19)
   ----------------------------------------------------------------------------
   Selecting a decision reorganises the same causal world around it.

   The visual claim is specific and it matters: the entities do not appear from
   nowhere when a scope is chosen — they are *drawn out of the same field*. The
   ring holds every entity from every scope at all times; choosing a scope
   brightens the ones that decision needs and dims the rest.

   That is what "scoped" means, and it is why this is a lens rather than a filter.

   Implemented as a tablist so a keyboard reader gets arrow-key movement between
   scopes and a screen reader is told which panel belongs to which decision.
   ========================================================================== */

export function ScopeLens() {
  const [activeId, setActiveId] = useState(decisionScopes[0]!.id);
  const baseId = useId();
  const active = decisionScopes.find((scope) => scope.id === activeId)!;

  // Every entity in the union, positioned once. Membership changes with the
  // scope; position never does.
  const allEntities = Array.from(
    new Set(decisionScopes.flatMap((scope) => scope.entities)),
  ).sort();

  const onKeyDown = (event: React.KeyboardEvent, index: number) => {
    const delta = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (delta === 0) return;
    event.preventDefault();
    const next = (index + delta + decisionScopes.length) % decisionScopes.length;
    setActiveId(decisionScopes[next]!.id);
    document.getElementById(`${baseId}-tab-${decisionScopes[next]!.id}`)?.focus();
  };

  return (
    <div>
      <div
        role="tablist"
        aria-label="Decision scopes"
        className="flex flex-wrap gap-2 border-b border-[color:var(--hairline)] pb-6"
      >
        {decisionScopes.map((scope, index) => (
          <button
            key={scope.id}
            id={`${baseId}-tab-${scope.id}`}
            role="tab"
            type="button"
            aria-selected={scope.id === activeId}
            aria-controls={`${baseId}-panel-${scope.id}`}
            tabIndex={scope.id === activeId ? 0 : -1}
            onClick={() => setActiveId(scope.id)}
            onKeyDown={(event) => onKeyDown(event, index)}
            className={cn(
              "border px-4 py-2.5 font-mono text-[0.625rem] tracking-[0.16em] uppercase transition-colors",
              scope.id === activeId
                ? "border-gold text-gold"
                : "border-[color:var(--hairline)] text-muted-bone hover:border-bone hover:text-bone",
            )}
          >
            {scope.label}
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        id={`${baseId}-panel-${active.id}`}
        aria-labelledby={`${baseId}-tab-${active.id}`}
        tabIndex={0}
        className="mt-14 grid grid-cols-1 gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-24"
      >
        <div>
          <InstrumentLabel tone="steel">{active.role}</InstrumentLabel>

          <p className="u-display-3 mt-6 text-bone">{active.question}</p>

          <div className="mt-10 border-l border-[color:var(--hairline-strong)] pl-6">
            <InstrumentLabel as="p">The assumption that must break</InstrumentLabel>
            <p className="u-body mt-3">{active.assumption}</p>
          </div>

          <div className="mt-10">
            <InstrumentLabel as="p">What the model watches</InstrumentLabel>
            <ul className="mt-4 space-y-3">
              {active.monitors.map((monitor) => (
                <li key={monitor} className="u-body flex gap-3">
                  <span aria-hidden="true" className="mt-2 h-px w-4 shrink-0 bg-steel-dim" />
                  <span>{monitor}</span>
                </li>
              ))}
            </ul>
          </div>

          <ol className="mt-12 space-y-8">
            {active.trace.map((step) => (
              <li key={step.order} className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-4">
                <InstrumentLabel tone="gold" className="tabular-nums">
                  {step.order}°
                </InstrumentLabel>
                <div>
                  <h4 className="text-[0.9375rem] text-bone">{step.label}</h4>
                  <p className="u-body mt-2">{step.mechanism}</p>
                </div>
              </li>
            ))}
          </ol>

          {active.evidenceIds?.length ? (
            <EvidenceInspector ids={active.evidenceIds} className="mt-10" />
          ) : null}
        </div>

        <ScopeField entities={allEntities} inScope={active.entities} label={active.label} />
      </div>
    </div>
  );
}

/**
 * The lens itself.
 *
 * A ring of every entity the six scopes reference between them. The selected
 * scope's entities resolve — brighter, larger, tethered to the decision at the
 * centre — while the others recede without leaving. Nothing is added or removed
 * from the DOM as the scope changes, which is both the honest visual metaphor
 * and the reason the transition can be a pure CSS interpolation.
 */
function ScopeField({
  entities,
  inScope,
  label,
}: {
  entities: string[];
  inScope: string[];
  label: string;
}) {
  const size = 520;
  const centre = size / 2;
  const radius = 190;
  const active = new Set(inScope);

  return (
    <figure className="m-0 min-w-0">
      <div
        className="u-figure-scroll"
        tabIndex={0}
        role="region"
        aria-label={`${label} scope field`}
      >
        <svg
          viewBox={`0 0 ${size} ${size}`}
          role="img"
          aria-label={`The ${label} scope drawn from the shared entity field. ${inScope.length} of ${entities.length} entities are in scope for this decision: ${inScope.join(", ")}.`}
          className="block w-full"
          style={{ minWidth: 420 }}
        >
          {/* Measurement rings — the instrument face. */}
          {[0.45, 0.72, 1].map((ratio) => (
            <circle
              key={ratio}
              cx={centre}
              cy={centre}
              r={radius * ratio}
              fill="none"
              stroke="var(--hairline-faint)"
              strokeWidth={1}
            />
          ))}

          {entities.map((entity, index) => {
            const angle = (index / entities.length) * Math.PI * 2 - Math.PI / 2;
            const isActive = active.has(entity);
            // In-scope entities are drawn inward, toward the decision.
            const distance = isActive ? radius * 0.72 : radius;
            const x = centre + Math.cos(angle) * distance;
            const y = centre + Math.sin(angle) * distance;

            return (
              <g
                key={entity}
                className="transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{ opacity: isActive ? 1 : 0.22 }}
              >
                {isActive ? (
                  <line
                    x1={centre}
                    y1={centre}
                    x2={x}
                    y2={y}
                    stroke="var(--color-gold-dim)"
                    strokeWidth={0.8}
                  />
                ) : null}

                <circle
                  cx={x}
                  cy={y}
                  r={isActive ? 4.5 : 2.5}
                  fill={isActive ? "var(--color-gold)" : "var(--color-steel-dim)"}
                />

                <text
                  x={centre + Math.cos(angle) * (distance + 16)}
                  y={centre + Math.sin(angle) * (distance + 16)}
                  textAnchor={
                    Math.cos(angle) > 0.15
                      ? "start"
                      : Math.cos(angle) < -0.15
                        ? "end"
                        : "middle"
                  }
                  dominantBaseline="middle"
                  fontSize={9.5}
                  letterSpacing="0.08em"
                  fill={isActive ? "var(--color-muted-bone)" : "var(--color-dim-bone)"}
                  style={{ textTransform: "uppercase" }}
                >
                  {entity}
                </text>
              </g>
            );
          })}

          {/* The decision at the centre. */}
          <circle
            cx={centre}
            cy={centre}
            r={26}
            fill="none"
            stroke="var(--color-gold-dim)"
            strokeWidth={1}
          />
          <circle cx={centre} cy={centre} r={6} fill="var(--color-gold)" />
          <text
            x={centre}
            y={centre + 46}
            textAnchor="middle"
            fontSize={10}
            letterSpacing="0.18em"
            fill="var(--color-bone)"
            style={{ textTransform: "uppercase" }}
          >
            {label}
          </text>
        </svg>
      </div>

      <figcaption className="u-instrument mt-6">
        {inScope.length} of {entities.length} entities in scope · the field does not change, the
        scope does
      </figcaption>
    </figure>
  );
}
