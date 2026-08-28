"use client";

import { useState } from "react";
import { DECISION_SCOPES } from "@/content/decisions";
import { EvidenceRack } from "@/components/evidence/EvidenceRack";
import { Room } from "@/components/story/Room";
import { RoomBody } from "@/components/story/RoomBody";
import { RoomHeading } from "@/components/story/RoomHeading";
import { ScopeLens } from "@/components/scope/ScopeLens";
import { cn } from "@/lib/utils/cn";

/* ============================================================================
   ROOM 18 — THE 3 A.M. PROBLEM  (§24)
   ----------------------------------------------------------------------------
   Six questions somebody is accountable for. Selecting one activates its scope
   over the same world; what changes is the boundary and the evidence, never the
   structure.

   The list is a disclosure set rather than a tab set here — several questions
   can be open at once, because the interesting comparison is between two of
   them and forcing a single selection would prevent it.
   ========================================================================== */

export function DecisionScopesScene() {
  const [openId, setOpenId] = useState<string | null>(DECISION_SCOPES[0]!.id);

  return (
    <Room id="decisions">
      <RoomHeading id="decisions" />
      <RoomBody id="decisions" className="mt-9 max-w-[60ch]" />

      <ul className="mt-12 grid gap-px bg-graphite">
        {DECISION_SCOPES.map((scope) => {
          const open = openId === scope.id;
          return (
            <li key={scope.id} className="bg-void">
              <h3>
                <button
                  type="button"
                  onClick={() => setOpenId(open ? null : scope.id)}
                  aria-expanded={open}
                  aria-controls={`decision-${scope.id}`}
                  className="group grid w-full grid-cols-[8rem_1fr_auto] items-baseline gap-4 px-5 py-5 text-left transition-colors hover:bg-ink/50 sm:px-7"
                >
                  <span
                    className={cn(
                      "font-mono text-[0.68rem] tracking-[0.2em] uppercase transition-colors",
                      open ? "text-brass" : "text-ash",
                    )}
                  >
                    {scope.sector}
                  </span>
                  <span className="standfirst text-[1.02rem] sm:text-[1.12rem]">
                    {scope.question}
                  </span>
                  <span aria-hidden="true" className="font-mono text-[0.8rem] text-ash">
                    {open ? "−" : "+"}
                  </span>
                </button>
              </h3>

              <div id={`decision-${scope.id}`} hidden={!open} className="px-5 pb-7 sm:px-7">
                <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
                  <div className="space-y-5">
                    <div>
                      <p className="label-dim">In scope</p>
                      <ul className="mt-2 space-y-1">
                        {scope.inScope.map((item) => (
                          <li key={item} className="text-[0.86rem] leading-relaxed text-bone/85">
                            — {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="label-dim">Boundary</p>
                      <p className="mt-2 text-[0.86rem] leading-relaxed text-ash">
                        {scope.boundary}
                      </p>
                    </div>
                    <div>
                      <p className="label-dim">Mechanism traced</p>
                      <p className="mt-2 text-[0.86rem] leading-relaxed text-bone/85">
                        {scope.mechanism}
                      </p>
                    </div>
                  </div>

                  <div>
                    <div className="border border-graphite bg-ink/40 p-3">
                      <ScopeLens inScope={scope.worldNodes} />
                    </div>
                    <EvidenceRack
                      className="mt-6"
                      label="Evidence in this scope"
                      evidenceIds={scope.evidenceIds}
                    />
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </Room>
  );
}
