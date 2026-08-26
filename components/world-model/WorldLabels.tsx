"use client";

import { useEffect, useRef } from "react";

import { worldNodeById } from "@/data/world-model";
import { layoutNodes } from "@/lib/world/layout";
import { SCENE_COUNT, WORLD_SCENES, type WorldState } from "@/lib/world/state";

import type { ProjectedLabel } from "./LabelProjector";

/* ============================================================================
   LABELS AND READOUT
   ----------------------------------------------------------------------------
   The instrument's writing: names, coordinates, and a statement of what the model
   is currently doing. Small, monospaced, and dim — an inscription on the
   apparatus rather than an interface.

   Two rules hold here. Positions are written directly to the DOM in an animation
   frame, never through React state, so the labels cost nothing to follow. And the
   whole overlay is hidden from assistive technology, because the same content is
   published in full, as prose, in the scene narrative alongside it.
   ========================================================================== */

const LOOP_PHASES = ["Map", "Monitor", "Forecast", "Simulate", "Re-map"];

function coordinateOf(id: string): string {
  const node = worldNodeById.get(id);
  if (!node) return "no coordinates";
  const latitude = `${Math.abs(node.lat).toFixed(1)}°${node.lat >= 0 ? "N" : "S"}`;
  const longitude = `${Math.abs(node.lon).toFixed(1)}°${node.lon >= 0 ? "E" : "W"}`;
  return `${latitude} ${longitude}`;
}

export function WorldLabels({
  index,
  labelIds,
  labelsRef,
  stateRef,
  status,
}: {
  index: number;
  labelIds: string[];
  labelsRef: React.RefObject<ProjectedLabel[]>;
  stateRef: React.RefObject<WorldState>;
  status: "resolving" | "live" | "static";
}) {
  const containers = useRef<(HTMLDivElement | null)[]>([]);
  const phases = useRef<(HTMLSpanElement | null)[]>([]);
  const scene = WORLD_SCENES[index] ?? WORLD_SCENES[0]!;

  useEffect(() => {
    if (status !== "live") return;
    let frame = 0;

    const tick = () => {
      const labels = labelsRef.current;
      const state = stateRef.current;

      if (labels) {
        for (let slot = 0; slot < containers.current.length; slot += 1) {
          const element = containers.current[slot];
          const label = labels[slot];
          if (!element || !label) continue;
          element.style.transform = `translate3d(${(label.x * 100).toFixed(2)}vw, ${(label.y * 100).toFixed(2)}vh, 0)`;
          element.style.opacity = label.opacity.toFixed(3);
        }
      }

      if (state) {
        for (let slot = 0; slot < phases.current.length; slot += 1) {
          const element = phases.current[slot];
          if (!element) continue;
          const active = state.loop > 0.05 && Math.floor(state.loopPhase) === slot;
          element.style.color = active ? "var(--color-gold)" : "var(--color-dim-bone)";
        }
      }

      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [status, labelsRef, stateRef]);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
      {status === "live"
        ? labelIds.map((id, slot) => {
            const node = layoutNodes.find((candidate) => candidate.id === id);
            if (!node) return null;
            return (
              <div
                key={id}
                ref={(element) => {
                  containers.current[slot] = element;
                }}
                className="absolute top-0 left-0 hidden -translate-y-1/2 will-change-transform sm:block"
                style={{ opacity: 0 }}
              >
                <div className="-translate-y-1/2 pl-3">
                  <span className="block h-3 w-px bg-[color:var(--hairline-strong)]" />
                  <span className="mt-1 block font-mono text-[0.5625rem] tracking-[0.16em] text-muted-bone uppercase">
                    {node.label}
                  </span>
                  <span className="block font-mono text-[0.5rem] tracking-[0.12em] text-dim-bone tabular-nums">
                    {node.causalOnly ? "no coordinates" : coordinateOf(node.id)}
                  </span>
                </div>
              </div>
            );
          })
        : null}

      {/* The readout sits below the header on the right, where no act places
          content, so it never has to compete with anything being read. */}
      <div className="absolute top-24 right-[max(1rem,env(safe-area-inset-right))] hidden text-right sm:block">
        <p className="font-mono text-[0.5rem] tracking-[0.22em] text-dim-bone uppercase tabular-nums">
          {String(index + 1).padStart(2, "0")} / {SCENE_COUNT} · {scene.label}
        </p>
        <p className="mt-1 max-w-[16rem] font-mono text-[0.5rem] leading-relaxed tracking-[0.14em] text-dim-bone uppercase">
          {status === "resolving" ? "Resolving causal field" : scene.state}
        </p>

        {scene.id === "world-model" ? (
          <p className="mt-2 flex justify-end gap-2 font-mono text-[0.5rem] tracking-[0.2em] uppercase">
            {LOOP_PHASES.map((phase, slot) => (
              <span
                key={phase}
                ref={(element) => {
                  phases.current[slot] = element;
                }}
                style={{ color: "var(--color-dim-bone)" }}
              >
                {phase}
              </span>
            ))}
          </p>
        ) : null}

        {scene.id === "future-space" ? (
          <p className="mt-2 font-mono text-[0.5rem] tracking-[0.2em] text-gold uppercase">
            Illustrative scenario — not a model forecast
          </p>
        ) : null}
      </div>
    </div>
  );
}
