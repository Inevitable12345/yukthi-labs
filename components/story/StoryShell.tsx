"use client";

import { useEffect } from "react";

import { ScrollTrigger } from "@/lib/story/gsap";
import { storyStore } from "@/lib/story/store";
import { WorldCanvas } from "@/components/world/WorldCanvas";

import { StoryProgress } from "./StoryProgress";

/* ============================================================================
   THE STORY SHELL
   ----------------------------------------------------------------------------
   Wraps the narrative in its persistent world and its chapter rail, and owns the
   two pieces of global scroll housekeeping:

     · a refresh once fonts have loaded, because web fonts change the height of
       every chapter and therefore every trigger boundary;
     · a full store reset on unmount, so a client-side navigation away from the
       narrative does not leave stale chapter state behind.

   There is no scroll hijacking anywhere in this codebase (§6). The reader's
   scroll is read, never driven.
   ========================================================================== */

export function StoryShell({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Fonts land after first paint and reflow every chapter. Without this the
    // trigger boundaries are measured against the fallback font's metrics.
    let cancelled = false;

    document.fonts?.ready.then(() => {
      if (!cancelled) ScrollTrigger.refresh();
    });

    return () => {
      cancelled = true;
      storyStore.reset();
    };
  }, []);

  return (
    <>
      <WorldCanvas />
      <StoryProgress />
      {children}
    </>
  );
}
