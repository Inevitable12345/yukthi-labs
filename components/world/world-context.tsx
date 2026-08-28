"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { TierBudget } from "@/lib/performance/tier";

export type WorldSettings = {
  budget: TierBudget;
  reducedMotion: boolean;
};

const WorldContext = createContext<WorldSettings | null>(null);

export function WorldSettingsProvider({
  value,
  children,
}: {
  value: WorldSettings;
  children: ReactNode;
}) {
  return <WorldContext.Provider value={value}>{children}</WorldContext.Provider>;
}

export function useWorldSettings(): WorldSettings {
  const value = useContext(WorldContext);
  if (!value) throw new Error("useWorldSettings must be used inside WorldSettingsProvider");
  return value;
}
