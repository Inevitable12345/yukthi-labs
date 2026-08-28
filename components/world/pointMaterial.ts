import * as THREE from "three";

/* ============================================================================
   PARTICLE MATERIAL
   ----------------------------------------------------------------------------
   A single additive point shader carries the whole cloud. Each particle has a
   tone (brass ↔ signal) and a brightness, so the two instrument colours mix
   within one draw call rather than requiring two systems.
   ========================================================================== */

const VERTEX = /* glsl */ `
  attribute float aTone;
  attribute float aBrightness;
  uniform float uSize;
  uniform float uPixelRatio;
  varying float vTone;
  varying float vBrightness;

  void main() {
    vTone = aTone;
    vBrightness = aBrightness;
    vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * viewPosition;
    // Size attenuates with distance so depth reads without fog.
    gl_PointSize = uSize * uPixelRatio * (1.0 / max(0.35, -viewPosition.z));
  }
`;

const FRAGMENT = /* glsl */ `
  precision mediump float;
  uniform vec3 uBrass;
  uniform vec3 uSignal;
  uniform float uOpacity;
  varying float vTone;
  varying float vBrightness;

  void main() {
    // Circular sprite with a soft edge. Discarding outside the disc keeps the
    // additive blend from stacking square corners into visible grid artefacts.
    vec2 offset = gl_PointCoord - vec2(0.5);
    float distance = length(offset);
    if (distance > 0.5) discard;
    float falloff = smoothstep(0.5, 0.03, distance);
    vec3 tint = mix(uBrass, uSignal, vTone);
    gl_FragColor = vec4(tint, falloff * vBrightness * uOpacity);
  }
`;

export function createPointMaterial(pixelRatio: number): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    vertexShader: VERTEX,
    fragmentShader: FRAGMENT,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uSize: { value: 62 },
      uPixelRatio: { value: pixelRatio },
      uBrass: { value: new THREE.Color("#c8a45c") },
      uSignal: { value: new THREE.Color("#7fb3c4") },
      uOpacity: { value: 0 },
    },
  });
}
