import next from "eslint-config-next";
import tseslint from "typescript-eslint";

/**
 * Flat config.
 *
 * `eslint-config-next` v16 exports a flat-config array directly, so it is spread
 * rather than wrapped in FlatCompat — the compat layer cannot serialise the
 * plugin graph this config produces and fails on a circular reference.
 */
const config = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "playwright-report/**",
      "test-results/**",
      "next-env.d.ts",
    ],
  },

  ...next,

  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: { "@typescript-eslint": tseslint.plugin },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },

  {
    // React Three Fiber elements are lowercase intrinsics carrying three.js
    // props the React plugin does not know about.
    files: ["components/world/**/*.tsx", "components/scenes/**/*.tsx"],
    rules: { "react/no-unknown-property": "off" },
  },

  {
    // The world layer writes GPU buffers in place inside `useFrame`.
    //
    // `react-hooks/immutability` encodes React's render-phase purity rules, and
    // it is right to do so for components that render. A `useFrame` callback is
    // not one: it runs on the animation loop, outside React's render cycle,
    // against typed arrays that are uploaded straight to the GPU. Allocating a
    // new buffer per frame to satisfy the rule would produce sixty allocations a
    // second and the garbage collection pauses that come with them — which is
    // the specific failure this architecture exists to avoid.
    //
    // Scoped to `components/world` only. Everywhere else in the codebase the
    // rule stands, and the two violations it caught outside this directory were
    // real bugs and were fixed rather than suppressed.
    files: ["components/world/**/*.tsx"],
    rules: { "react-hooks/immutability": "off" },
  },
];

export default config;
