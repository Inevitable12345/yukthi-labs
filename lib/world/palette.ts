/* ============================================================================
   WORLD PALETTE (§4)
   ----------------------------------------------------------------------------
   The 3D layer cannot read CSS custom properties, so the palette is mirrored
   here as numbers. A unit test asserts these stay identical to the CSS tokens —
   a drifting palette is the fastest way for a design system to stop being one.
   ========================================================================== */

export const WORLD_COLOR = {
  /** Ordinary nodes: the human-readable knowledge layer. */
  bone: "#ece7dc",
  /** Evidence, state, computation. */
  steel: "#7d98a7",
  steelDim: "#4a5c66",
  /** Rare causal and mission emphasis. Never a highlighter. */
  gold: "#bba36a",
  goldDim: "#7d6c45",
  /** Structural break, discontinuity. Used on at most one element at a time. */
  rupture: "#c9695f",
  void: "#070808",
} as const;

export type WorldColorToken = keyof typeof WORLD_COLOR;
