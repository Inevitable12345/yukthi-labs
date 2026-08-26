"use client";

import { useEffect, useRef, useState } from "react";

import {
  SCENE_COUNT,
  WORLD_SCENES,
  sceneCoordinate,
  worldStateAt,
  type AnchorSpan,
  type WorldState,
} from "./state";

/* ============================================================================
   SCROLL → SCENE
   ----------------------------------------------------------------------------
   Scroll is read, never taken. There is no scroll-jacking, no pinning that
   swallows a gesture, and no minimum dwell: the reader moves the page and the
   world layer follows, in both directions, at whatever speed they choose.

   The continuous value lives in a ref, because it changes on every frame and
   React should not hear about that. Only the scene *index* is state, because
   only the labels and the readout care which scene is current.
   ========================================================================== */

export type SceneProgress = {
  /** Read inside `useFrame` and in the label loop. Never triggers a render. */
  stateRef: React.RefObject<WorldState>;
  /** Current scene index. Changes at most thirteen times over the page. */
  index: number;
  /** False until the anchors have been found and measured. */
  ready: boolean;
};

function measure(): AnchorSpan[] {
  if (typeof document === "undefined") return [];
  const scrollY = window.scrollY;
  const spans: AnchorSpan[] = [];

  for (const scene of WORLD_SCENES) {
    let start = Number.POSITIVE_INFINITY;
    let end = Number.NEGATIVE_INFINITY;

    for (const anchor of scene.anchors) {
      const element = document.getElementById(anchor);
      if (!element) continue;
      const box = element.getBoundingClientRect();
      start = Math.min(start, box.top + scrollY);
      end = Math.max(end, box.bottom + scrollY);
    }

    if (!Number.isFinite(start) || !Number.isFinite(end)) return [];
    spans.push({ id: scene.id, start, end });
  }

  return spans.length === SCENE_COUNT ? spans : [];
}

export function useSceneProgress(enabled = true): SceneProgress {
  const stateRef = useRef<WorldState>(worldStateAt(0));
  const spansRef = useRef<AnchorSpan[]>([]);
  const [index, setIndex] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    let frame = 0;
    let disposed = false;

    const apply = () => {
      frame = 0;
      const spans = spansRef.current;
      if (spans.length === 0) return;

      // The reading line is the middle of the viewport: a scene peaks while its
      // section is being read, not when its top edge crosses the fold.
      const reading = window.scrollY + window.innerHeight * 0.5;
      const next = worldStateAt(sceneCoordinate(spans, reading));
      stateRef.current = next;
      setIndex((current) => (current === next.index ? current : next.index));
    };

    const schedule = () => {
      if (frame || disposed) return;
      frame = window.requestAnimationFrame(apply);
    };

    const remeasure = () => {
      spansRef.current = measure();
      if (spansRef.current.length > 0) setReady(true);
      apply();
    };

    remeasure();

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", remeasure);
    window.addEventListener("orientationchange", remeasure);

    // Sections change height as fonts land and as diagrams hydrate. Re-measuring
    // on layout change is what keeps a scene aligned with its section.
    const observer =
      typeof ResizeObserver === "undefined" ? null : new ResizeObserver(remeasure);
    observer?.observe(document.body);

    const settle = window.setTimeout(remeasure, 1200);

    return () => {
      disposed = true;
      if (frame) window.cancelAnimationFrame(frame);
      window.clearTimeout(settle);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", remeasure);
      window.removeEventListener("orientationchange", remeasure);
      observer?.disconnect();
    };
  }, [enabled]);

  return { stateRef, index, ready };
}

/* --------------------------------------------------------------------------
   DECISION SCOPE
   --------------------------------------------------------------------------
   The scope selector in Act 09 is a DOM control; the world layer is a canvas
   behind it. They are connected by one event rather than by shared React state,
   so neither owns the other and the selector keeps working with the layer absent.
   ------------------------------------------------------------------------ */

export const SCOPE_EVENT = "yukthi:scope";

export function announceScope(scope: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(SCOPE_EVENT, { detail: scope }));
}

export function useActiveScope(initial: string): string {
  const [scope, setScope] = useState(initial);

  useEffect(() => {
    const onScope = (event: Event) => {
      const detail = (event as CustomEvent<string>).detail;
      if (typeof detail === "string") setScope(detail);
    };
    window.addEventListener(SCOPE_EVENT, onScope);
    return () => window.removeEventListener(SCOPE_EVENT, onScope);
  }, []);

  return scope;
}
