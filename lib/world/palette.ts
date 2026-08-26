import type { NodeKind } from "@/data/schema";

/* ============================================================================
   PALETTE — WEBGL SIDE
   ----------------------------------------------------------------------------
   WebGL cannot read CSS custom properties, so these values mirror the tokens in
   `app/globals.css`. They are the same semantics, not a second palette:

     gold    rare causal and mission emphasis
     steel   evidence, state, computation
     rupture structural break, risk, discontinuity
     bone    the human-readable layer
   ========================================================================== */

export const WORLD_PALETTE = {
  void: "#070808",
  deepField: "#0c0e0f",
  bone: "#ece7dc",
  mutedBone: "#aaa59c",
  dimBone: "#85827a",
  gold: "#bba36a",
  goldDim: "#7d6c45",
  steel: "#7d98a7",
  steelDim: "#4a5c66",
  rupture: "#c9695f",
  ruptureDeep: "#a04d45",
} as const;

/** Mirrors `NODE_TONE` in `lib/graph/tokens.ts`, which the SVG diagrams use. */
export const NODE_COLOR: Record<NodeKind, string> = {
  policy: WORLD_PALETTE.gold,
  mechanism: WORLD_PALETTE.gold,
  risk: WORLD_PALETTE.rupture,
  outcome: WORLD_PALETTE.rupture,
  event: WORLD_PALETTE.bone,
  actor: WORLD_PALETTE.bone,
  asset: WORLD_PALETTE.bone,
  geography: WORLD_PALETTE.steel,
  infrastructure: WORLD_PALETTE.steel,
  market: WORLD_PALETTE.steel,
  state: WORLD_PALETTE.steel,
  evidence: WORLD_PALETTE.steel,
};

/** Route colour by what the route carries, before anything changes. */
export const CARRIES_COLOR = {
  goods: WORLD_PALETTE.steelDim,
  energy: WORLD_PALETTE.steel,
  minerals: WORLD_PALETTE.goldDim,
  components: WORLD_PALETTE.steel,
  capital: WORLD_PALETTE.dimBone,
  data: WORLD_PALETTE.steel,
} as const;

/** Route colour once the structure has changed. State is never colour alone: the
 *  same information is printed in the readout and in every text alternative. */
export const AFTER_COLOR = {
  held: WORLD_PALETTE.steelDim,
  rerouted: WORLD_PALETTE.gold,
  conditional: WORLD_PALETTE.goldDim,
  broken: WORLD_PALETTE.rupture,
} as const;

export function hexToRgb(hex: string): [number, number, number] {
  const value = hex.replace("#", "");
  const full =
    value.length === 3
      ? value
          .split("")
          .map((character) => character + character)
          .join("")
      : value;
  const int = Number.parseInt(full, 16);
  return [((int >> 16) & 255) / 255, ((int >> 8) & 255) / 255, (int & 255) / 255];
}
