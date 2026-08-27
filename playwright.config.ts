import { existsSync } from "node:fs";

import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.PORT ?? 3000);
const baseURL = `http://127.0.0.1:${PORT}`;

/**
 * Use a pre-installed Chromium when the environment provides one.
 *
 * CI images often ship a browser build that does not match the exact revision
 * this Playwright version would download. Pointing at the provided binary keeps
 * the suite runnable without a network fetch; where no such binary exists this
 * is undefined and Playwright resolves its own browser as usual.
 */
const PREINSTALLED_CHROMIUM = "/opt/pw-browsers/chromium";
const executablePath = existsSync(PREINSTALLED_CHROMIUM) ? PREINSTALLED_CHROMIUM : undefined;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? "github" : "list",
  timeout: 45_000,

  use: {
    baseURL,
    trace: "on-first-retry",
    // The narrative is scroll-driven; a stable viewport keeps ScrollTrigger
    // measurements deterministic between runs.
    viewport: { width: 1280, height: 900 },
  },

  projects: [
    {
      name: "desktop",
      use: { ...devices["Desktop Chrome"], launchOptions: { executablePath } },
    },
    {
      name: "mobile",
      use: { ...devices["Pixel 7"], launchOptions: { executablePath } },
    },
  ],

  webServer: {
    command: "npm run build && npm run start",
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 240_000,
  },
});
