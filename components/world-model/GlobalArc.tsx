"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import { buildArcGeometry, arcRouteAttributes } from "@/lib/world/layout";
import { AFTER_COLOR, CARRIES_COLOR, hexToRgb } from "@/lib/world/palette";

import { useWorld } from "./world-state-context";

/* ============================================================================
   ROUTES
   ----------------------------------------------------------------------------
   Two complete versions of the same world, cross-faded by one number.

   `stable`  every route on the path the last era arranged for it.
   `changed` the same endpoints after the structure moves: rerouted the long way,
             continuing only under licence, or no longer available on the terms it
             was priced on.

   Colour is not the only carrier of that difference — the routes physically move,
   the readout names the state in words, and the text alternative describes it.
   ========================================================================== */

const VERTEX = /* glsl */ `
  attribute float aAlong;
  attribute float aRouteNorm;
  attribute float aState;
  attribute vec3 aColor;

  varying float vAlong;
  varying float vRouteNorm;
  varying float vState;
  varying vec3 vColor;

  void main() {
    vAlong = aAlong;
    vRouteNorm = aRouteNorm;
    vState = aState;
    vColor = aColor;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAGMENT = /* glsl */ `
  precision mediump float;

  uniform float uTime;
  uniform float uOpacity;
  uniform float uReveal;
  uniform float uFlow;

  varying float vAlong;
  varying float vRouteNorm;
  varying float vState;
  varying vec3 vColor;

  void main() {
    // Routes arrive in order rather than all at once, so the arrangement reads as
    // something that was built rather than something that was always there.
    float reveal = smoothstep(0.0, 0.35, uReveal * 1.4 - vRouteNorm * 0.4 - vAlong * 0.25);

    // Circulation. Regular and unhurried while the world is stable; the same
    // motion carries the eye along the new path once routes are redrawn.
    float travel = fract(vAlong * 3.0 - uTime * 0.11);
    float pulse = 0.30 + 0.70 * pow(travel, 4.0);

    // Conditional routes are drawn intermittently: the flow continues, but only
    // in the intervals it is permitted to.
    float conditional = step(1.5, vState) * step(vState, 2.5);
    float gate = mix(1.0, step(0.42, fract(vAlong * 9.0)), conditional);

    // A broken route keeps its geometry and loses its continuity.
    float broken = step(2.5, vState);
    gate *= mix(1.0, step(0.62, fract(vAlong * 22.0 + 0.2)), broken);

    float alpha = uOpacity * reveal * gate * mix(1.0, pulse, uFlow);
    if (alpha < 0.004) discard;

    gl_FragColor = vec4(vColor, alpha);
  }
`;

const STATE_CODE = { held: 0, rerouted: 1, conditional: 2, broken: 3 } as const;

export function GlobalArc({ variant }: { variant: "stable" | "changed" }) {
  const { stateRef, quality } = useWorld();
  const material = useRef<THREE.ShaderMaterial>(null);

  const geometry = useMemo(() => {
    const routes = arcRouteAttributes();
    const built = buildArcGeometry(variant, quality === "high" ? 56 : 28);
    const vertexCount = built.count;

    const colors = new Float32Array(vertexCount * 3);
    const states = new Float32Array(vertexCount);
    const routeNorm = new Float32Array(vertexCount);

    for (let vertex = 0; vertex < vertexCount; vertex += 1) {
      const routeIndex = built.route[vertex]!;
      const route = routes[routeIndex]!;
      const hex =
        variant === "stable" ? CARRIES_COLOR[route.carries] : AFTER_COLOR[route.after];
      const [r, g, b] = hexToRgb(hex);
      colors[vertex * 3] = r;
      colors[vertex * 3 + 1] = g;
      colors[vertex * 3 + 2] = b;
      states[vertex] = variant === "stable" ? 0 : STATE_CODE[route.after];
      routeNorm[vertex] = routes.length > 1 ? routeIndex / (routes.length - 1) : 0;
    }

    const result = new THREE.BufferGeometry();
    result.setAttribute("position", new THREE.BufferAttribute(built.positions, 3));
    result.setAttribute("aAlong", new THREE.BufferAttribute(built.along, 1));
    result.setAttribute("aRouteNorm", new THREE.BufferAttribute(routeNorm, 1));
    result.setAttribute("aState", new THREE.BufferAttribute(states, 1));
    result.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
    return result;
  }, [variant, quality]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uOpacity: { value: 0 },
      uReveal: { value: 0 },
      uFlow: { value: 1 },
    }),
    [],
  );

  useFrame((_, delta) => {
    const state = stateRef.current;
    const shader = material.current;
    if (!shader) return;

    shader.uniforms.uTime!.value += delta;

    // The geographic routes belong to the geographic model. As the structure
    // takes over they hand off to the hyperedges rather than lingering underneath.
    const geographic = state.presence * (1 - state.morph);
    const weight = variant === "stable" ? 1 - state.rewire : state.rewire;

    shader.uniforms.uOpacity!.value = 0.72 * geographic * weight;
    shader.uniforms.uReveal!.value = state.resolve;
    // Circulation is legible and regular in the stable world; after the rewiring
    // it is the changed routes that carry it.
    shader.uniforms.uFlow!.value = variant === "stable" ? 0.45 + 0.55 * state.stability : 1;
  });

  return (
    <lineSegments geometry={geometry}>
      <shaderMaterial
        ref={material}
        vertexShader={VERTEX}
        fragmentShader={FRAGMENT}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </lineSegments>
  );
}
