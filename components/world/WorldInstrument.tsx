"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { ROOM_BY_ID, type WorldForm } from "@/lib/story/chapters";
import { getSnapshot, readProgress, subscribe } from "@/lib/story/store";
import { relationPairs, writePositions } from "@/lib/world/forms";
import { damp } from "@/lib/world/camera";
import { seeded } from "@/lib/world/random";
import { createPointMaterial } from "./pointMaterial";
import { useWorldSettings } from "./world-context";

/* ============================================================================
   THE PERSISTENT WORLD INSTRUMENT  (§5)
   ----------------------------------------------------------------------------
   One point cloud and one relation mesh for the entire exhibition. When the
   room changes, the current positions become the origin of the next morph and
   the target buffer is rewritten — so the object is continuously the same
   object, and the transformation itself is what the visitor watches.

   Relations crossfade rather than morph. Their topology genuinely differs
   between forms (a causal layer is not a trade route), and interpolating
   between two different meanings would produce a third that means nothing.
   ========================================================================== */

const MORPH_SECONDS = 2.1;

export function WorldInstrument() {
  const { budget, reducedMotion } = useWorldSettings();
  const { gl } = useThree();

  const count = budget.particles;
  const relations = budget.relations;

  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const groupRef = useRef<THREE.Group>(null);

  /* ------------------------------------------------------------ buffers -- */

  const buffers = useMemo(() => {
    const current = new Float32Array(count * 3);
    const origin = new Float32Array(count * 3);
    const target = new Float32Array(count * 3);
    const tone = new Float32Array(count);
    const brightness = new Float32Array(count);

    writePositions(current, "abstract", count);
    origin.set(current);
    target.set(current);

    const random = seeded(9001);
    for (let index = 0; index < count; index += 1) {
      // A minority of particles carry the signal colour. Keeping brass dominant
      // is what stops the field reading as generic sci-fi cyan.
      tone[index] = random() < 0.28 ? 0.55 + random() * 0.45 : random() * 0.22;
      brightness[index] = 0.35 + random() * 0.65;
    }

    return { current, origin, target, tone, brightness };
  }, [count]);

  const pointGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(buffers.current, 3));
    geometry.setAttribute("aTone", new THREE.BufferAttribute(buffers.tone, 1));
    geometry.setAttribute("aBrightness", new THREE.BufferAttribute(buffers.brightness, 1));
    geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 8);
    return geometry;
  }, [buffers]);

  const linePositions = useMemo(() => new Float32Array(relations * 6), [relations]);

  const lineGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
    geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 8);
    return geometry;
  }, [linePositions]);

  const pointMaterial = useMemo(
    () => createPointMaterial(Math.min(budget.maxDpr, gl.getPixelRatio())),
    [budget.maxDpr, gl],
  );

  const lineMaterial = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: new THREE.Color("#7fb3c4"),
        transparent: true,
        opacity: 0,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [],
  );

  useEffect(() => {
    return () => {
      // Explicit disposal (§38). React Three Fiber releases what it created;
      // these were created here, so they are released here.
      pointGeometry.dispose();
      lineGeometry.dispose();
      pointMaterial.dispose();
      lineMaterial.dispose();
    };
  }, [pointGeometry, lineGeometry, pointMaterial, lineMaterial]);

  /* -------------------------------------------------------- morph state -- */

  const state = useRef({
    form: "abstract" as WorldForm,
    /** 0 → 1 across the current morph. */
    morph: 1,
    pairs: relationPairs("abstract", count, relations),
    pendingPairs: null as Uint32Array | null,
    opacity: 0,
    spin: 0,
  });

  useEffect(() => {
    state.current.pairs = relationPairs(state.current.form, count, relations);
  }, [count, relations]);

  useEffect(() => {
    const applyForm = () => {
      const nextForm = ROOM_BY_ID[getSnapshot().chapter].world;
      if (nextForm === state.current.form) return;
      // The morph always begins from wherever the particles actually are, which
      // is what makes an interrupted transition recover gracefully.
      buffers.origin.set(buffers.current);
      writePositions(buffers.target, nextForm, count);
      state.current.form = nextForm;
      state.current.morph = 0;
      state.current.pendingPairs = relationPairs(nextForm, count, relations);
    };

    applyForm();
    return subscribe(applyForm);
  }, [buffers, count, relations]);

  /* --------------------------------------------------------------- loop -- */

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);
    const current = state.current;

    // Reduced motion converts the morph into a near-instant discrete change
    // rather than removing it — the world still shows the right form (§40).
    const rate = reducedMotion ? 1 / 0.18 : 1 / MORPH_SECONDS;
    if (current.morph < 1) {
      current.morph = Math.min(1, current.morph + delta * rate);
      const eased = easeInOutCubic(current.morph);
      const positions = buffers.current;
      for (let i = 0; i < positions.length; i += 1) {
        const from = buffers.origin[i] ?? 0;
        const to = buffers.target[i] ?? 0;
        positions[i] = from + (to - from) * eased;
      }
      pointGeometry.attributes.position!.needsUpdate = true;
    }

    // Relations dip to nothing at the midpoint of a morph; the topology swap
    // happens there, unseen.
    const crossfade = Math.abs(current.morph * 2 - 1);
    if (current.pendingPairs && current.morph >= 0.5) {
      current.pairs = current.pendingPairs;
      current.pendingPairs = null;
    }

    const pairs = current.pairs;
    const positions = buffers.current;
    for (let i = 0; i < relations; i += 1) {
      const a = (pairs[i * 2] ?? 0) * 3;
      const b = (pairs[i * 2 + 1] ?? 0) * 3;
      linePositions[i * 6] = positions[a] ?? 0;
      linePositions[i * 6 + 1] = positions[a + 1] ?? 0;
      linePositions[i * 6 + 2] = positions[a + 2] ?? 0;
      linePositions[i * 6 + 3] = positions[b] ?? 0;
      linePositions[i * 6 + 4] = positions[b + 1] ?? 0;
      linePositions[i * 6 + 5] = positions[b + 2] ?? 0;
    }
    lineGeometry.attributes.position!.needsUpdate = true;

    // The world fades up out of darkness as the visitor enters the first room,
    // and is never at full strength behind dense text.
    const snapshot = getSnapshot();
    const room = ROOM_BY_ID[snapshot.chapter];
    const within = readProgress(snapshot.chapter);
    // The world is a ground, not a subject. It resolves out of darkness in the
    // observatory, then settles to a level that leaves body text unambiguously
    // the brightest thing on screen — and drops further still where the camera
    // is close enough to fill the frame behind a column of prose.
    const entryFade = snapshot.chapter === "observatory" ? 0.4 + within * 0.6 : 1;
    const readingRoom =
      room.camera === "macro" ||
      room.camera === "deep" ||
      room.camera === "flat" ||
      room.camera === "focus";
    const roomLevel = readingRoom ? 0.26 : 0.5;
    const targetOpacity = entryFade * roomLevel;

    current.opacity = damp(current.opacity, targetOpacity, 2.4, delta);
    pointMaterial.uniforms.uOpacity!.value = current.opacity;
    lineMaterial.opacity = current.opacity * 0.3 * crossfade;

    if (groupRef.current) {
      // A single slow rotation, and none at all under reduced motion (§40).
      if (!reducedMotion && budget.ambientDrift) current.spin += delta * 0.032;
      groupRef.current.rotation.y = current.spin;
      groupRef.current.rotation.x = reducedMotion ? 0 : Math.sin(current.spin * 0.6) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      <points
        ref={pointsRef}
        geometry={pointGeometry}
        material={pointMaterial}
        frustumCulled={false}
      />
      <lineSegments
        ref={linesRef}
        geometry={lineGeometry}
        material={lineMaterial}
        frustumCulled={false}
      />
    </group>
  );
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
