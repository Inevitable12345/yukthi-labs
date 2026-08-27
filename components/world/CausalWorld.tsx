"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo } from "react";

import { CHAPTERS } from "@/lib/story/chapters";
import { smoothstep, storyStore } from "@/lib/story/store";
import { buildWorld, formAt, precomputeLayouts } from "@/lib/world/geometry";
import type { PerformanceTier } from "@/lib/utils/capability";
import { TIER_BUDGET } from "@/lib/utils/capability";

import { CameraRig } from "./CameraRig";
import { CausalArc } from "./CausalArc";
import { EvidenceMarker } from "./EvidenceMarker";
import { FutureBranch } from "./FutureBranch";
import { Hyperedge } from "./Hyperedge";
import { ParticleEvidence } from "./ParticleEvidence";
import { StrategicNode } from "./StrategicNode";
import { WorldFrameProvider, type WorldFrame } from "./world-context";
import { WorldMeridians } from "./WorldMeridians";
import { WorldShell } from "./WorldShell";

/* ============================================================================
   THE CAUSAL WORLD (§5)
   ----------------------------------------------------------------------------
   The scene root, and the only place in the 3D layer that touches the story
   store's continuous value.

   Each frame it does exactly two things:
     1. resolves the timeline into a pair of layouts and a blend factor;
     2. writes the interpolated positions into one shared buffer.

   Every child then reads that buffer. This is why the globe and the causal graph
   are demonstrably the same object rather than two scenes cross-faded: there is
   only ever one set of positions, and the transformation is an interpolation
   between two arrangements of it.
   ========================================================================== */

export function CausalWorld({ tier }: { tier: PerformanceTier }) {
  const budget = TIER_BUDGET[tier];
  const still = tier === "reduced";

  const graph = useMemo(() => buildWorld(budget.nodes), [budget.nodes]);
  const layouts = useMemo(() => precomputeLayouts(graph), [graph]);

  // Plain mutable holders rather than React refs: these are written every frame
  // by the render loop, which is outside React's render cycle entirely. Creating
  // them here — already seeded with the opening form — means the very first
  // painted frame is the calm earth rather than an origin-clustered flash, and
  // nothing is written through a ref during render.
  const frame: WorldFrame = useMemo(() => {
    const buffer = new Float32Array(graph.nodes.length * 3);
    buffer.set(layouts.earth);

    return {
      graph,
      positions: { current: buffer },
      state: {
        current: {
          abstraction: 0,
          chokepoint: 0,
          hyper: 0,
          evidence: 0,
          futures: 0,
          timeline: 0,
        },
      },
    };
  }, [graph, layouts]);

  const positions = frame.positions;
  const state = frame.state;

  // Under reduced motion the canvas runs on demand, so nothing would redraw when
  // the reader scrolls. Subscribing to the store's coarse changes gives exactly
  // the behaviour §31 asks for: discrete state changes rather than continuous
  // motion. In the always-on tiers this subscription is harmless — `invalidate`
  // is a no-op when a frame is already scheduled.
  const invalidate = useThree((viewport) => viewport.invalidate);
  useEffect(() => storyStore.subscribe(invalidate), [invalidate]);

  const index = (id: (typeof CHAPTERS)[number]["id"]) =>
    CHAPTERS.findIndex((chapter) => chapter.id === id);

  const CHOKEPOINT_AT = index("rare-earth");
  const SEMICONDUCTOR_AT = index("semiconductor");
  const YUKTHI_AT = index("yukthi");
  const AI_AT = index("ai");
  const FINALE_AT = index("finale");

  useFrame(() => {
    const story = storyStore.read();
    const timeline = story.timeline;
    const { from, to, mix } = formAt(timeline);

    const eased = smoothstep(mix);
    const source = layouts[from];
    const target = layouts[to];
    const buffer = positions.current;

    // One linear pass over a typed array. No allocation, no trigonometry.
    for (let i = 0; i < buffer.length; i += 1) {
      const a = source[i]!;
      buffer[i] = a + (target[i]! - a) * eased;
    }

    const scalars = state.current;
    scalars.timeline = timeline;

    // `abstraction` is the master dissolve: geography giving way to structure.
    // It leads the form change slightly so the shell is already fading as the
    // nodes begin to reorganise.
    scalars.abstraction = smoothstep(
      clamp01((timeline - CHOKEPOINT_AT) / (SEMICONDUCTOR_AT - CHOKEPOINT_AT + 0.4)),
    );

    // A ridge rather than a ramp: the chokepoint is emphasised as the reader
    // passes through its chapter and released afterwards.
    scalars.chokepoint = ridge(timeline, CHOKEPOINT_AT, 1.4);

    scalars.hyper = smoothstep(
      clamp01((timeline - SEMICONDUCTOR_AT) / (YUKTHI_AT - SEMICONDUCTOR_AT)),
    );
    scalars.evidence = smoothstep(clamp01((timeline - AI_AT + 0.6) / 2.4));
    scalars.futures = smoothstep(clamp01((timeline - FINALE_AT + 1.1) / 1.4));
  });

  return (
    <WorldFrameProvider value={frame}>
      <CameraRig still={still} />

      <WorldShell />
      <WorldMeridians />

      <CausalArc maxEdges={budget.arcs} />
      <Hyperedge />
      <EvidenceMarker />
      <FutureBranch maxBranches={Math.round(budget.nodes / 12)} />

      <StrategicNode />
      <ParticleEvidence count={budget.particles} />
    </WorldFrameProvider>
  );
}

function clamp01(value: number): number {
  return value < 0 ? 0 : value > 1 ? 1 : value;
}

/** 1 at `centre`, falling to 0 `width` chapters either side. */
function ridge(value: number, centre: number, width: number): number {
  const distance = Math.abs(value - centre);
  return distance >= width ? 0 : smoothstep(1 - distance / width);
}
