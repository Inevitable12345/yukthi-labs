"use client";

import { useSyncExternalStore } from "react";
import { getSnapshot, subscribe, type StorySnapshot } from "./store";

const SERVER_SNAPSHOT: StorySnapshot = { chapter: "observatory", order: 0, entered: false };

/** Chapter-level story state. Re-renders only when the current room changes. */
export function useStory(): StorySnapshot {
  return useSyncExternalStore(subscribe, getSnapshot, () => SERVER_SNAPSHOT);
}
