"use client";

import { useCallback, useSyncExternalStore } from "react";

import { storyStore, type StorySnapshot } from "./store";
import type { StoryChapter } from "./chapters";

/**
 * Subscribe the DOM to the coarse story state.
 *
 * This re-renders only when the chapter, world form or camera mode changes —
 * roughly once per chapter, not once per frame. Components that need the
 * continuous value (only the WebGL world does) read `storyStore.read()` inside
 * their own frame loop instead.
 */
export function useStory(): StorySnapshot {
  return useSyncExternalStore(
    storyStore.subscribe,
    storyStore.read,
    // Server snapshot: the first chapter, unengaged. The static render is the
    // opening state of the story, which is exactly what a crawler should see.
    storyStore.read,
  );
}

/** True when `chapter` is the one currently occupying the viewport. */
export function useIsCurrentChapter(chapter: StoryChapter): boolean {
  const subscribe = storyStore.subscribe;
  const getSnapshot = useCallback(() => storyStore.read().chapter === chapter, [chapter]);
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
