"use client";

import { useState } from "react";
import { DECISION_SCOPES } from "@/content/decisions";
import { ScopeLens } from "@/components/scope/ScopeLens";
import { Room } from "@/components/story/Room";
import { RoomBody } from "@/components/story/RoomBody";
import { RoomHeading } from "@/components/story/RoomHeading";
import { cn } from "@/lib/utils/cn";

/* ============================================================================
   ROOM 12 — THE WORLD MODEL  (§18)
   ----------------------------------------------------------------------------
   What "scoped" means, made operable. Six scopes over one world; the boundary
   moves and the structure does not.

   Implemented as a real tab set — arrow keys move between scopes, the panel is
   labelled by its tab, and nothing depends on hover (§42).
   ========================================================================== */

export function WorldModelScene() {
  const [activeId, setActiveId] = useState(DECISION_SCOPES[0]!.id);
  const active = DECISION_SCOPES.find((scope) => scope.id === activeId) ?? DECISION_SCOPES[0]!;

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const index = DECISION_SCOPES.findIndex((scope) => scope.id === activeId);
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      setActiveId(DECISION_SCOPES[(index + 1) % DECISION_SCOPES.length]!.id);
    }
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      setActiveId(
        DECISION_SCOPES[(index - 1 + DECISION_SCOPES.length) % DECISION_SCOPES.length]!.id,
      );
    }
  };

  return (
    <Room id="world-model">
      <RoomHeading id="world-model" />

      <div className="mt-12 grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <RoomBody id="world-model" showLadder={false} />

        <div>
          <div
            role="tablist"
            aria-label="Decision scopes"
            onKeyDown={onKeyDown}
            className="flex flex-wrap gap-2"
          >
            {DECISION_SCOPES.map((scope) => {
              const selected = scope.id === activeId;
              return (
                <button
                  key={scope.id}
                  type="button"
                  role="tab"
                  id={`scope-tab-${scope.id}`}
                  aria-selected={selected}
                  aria-controls={`scope-panel-${scope.id}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActiveId(scope.id)}
                  className={cn(
                    "border px-3 py-1.5 font-mono text-[0.68rem] tracking-[0.14em] uppercase transition-colors",
                    selected
                      ? "border-brass text-brass"
                      : "border-graphite text-ash hover:border-ash hover:text-bone",
                  )}
                >
                  {scope.sector}
                </button>
              );
            })}
          </div>

          <div
            role="tabpanel"
            id={`scope-panel-${active.id}`}
            aria-labelledby={`scope-tab-${active.id}`}
            className="mt-6"
          >
            <p className="standfirst max-w-[46ch]">{active.question}</p>
            <div className="mt-6 border border-graphite bg-ink/40 p-4">
              <ScopeLens inScope={active.worldNodes} />
            </div>
            <p className="mt-4 max-w-[56ch] text-[0.86rem] leading-relaxed text-ash">
              <span className="label-dim">Boundary — </span>
              {active.boundary}
            </p>
          </div>
        </div>
      </div>
    </Room>
  );
}
