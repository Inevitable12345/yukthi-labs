import next from "eslint-config-next";
import prettier from "eslint-config-prettier";

/**
 * Flat config. `eslint-config-next` exports a flat array in v16, so no
 * compatibility shim is required.
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
  prettier,
  {
    // React Three Fiber renders by mutating buffers inside the animation loop.
    // The compiler rules model React rendering, not an imperative renderer
    // driven from `useFrame`, so they are switched off for that one file rather
    // than weakened everywhere.
    files: ["components/world/WorldInstrument.tsx"],
    rules: {
      "react-hooks/refs": "off",
      "react-hooks/immutability": "off",
      "react-hooks/preserve-manual-memoization": "off",
      "react-hooks/purity": "off",
      "react-hooks/globals": "off",
      "react-hooks/set-state-in-effect": "off",
    },
  },
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      // React Three Fiber's JSX elements carry three.js property names that no
      // DOM-oriented rule knows about.
      "react/no-unknown-property": "off",
      "import/no-anonymous-default-export": "off",
    },
  },
];

export default config;
