import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.PORT ?? 3210);
const baseURL = `http://127.0.0.1:${PORT}`;

/**
 * End-to-end configuration.
 *
 * Runs against a production build, because several of the properties under test —
 * security headers, static generation, the deferred 3D chunk — only exist there.
 * `CHROMIUM_PATH` lets a pre-installed browser be used instead of a downloaded one.
 */
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : [["list"]],
  timeout: 45_000,
  expect: { timeout: 8_000 },
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    ...(process.env.CHROMIUM_PATH
      ? { launchOptions: { executablePath: process.env.CHROMIUM_PATH } }
      : {}),
  },
  projects: [
    {
      name: "desktop",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } },
    },
    {
      name: "mobile",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 360, height: 800 },
        isMobile: false,
      },
    },
    {
      name: "reduced-motion",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1280, height: 800 },
        contextOptions: { reducedMotion: "reduce" },
      },
    },
  ],
  webServer: {
    command: `npx next start -p ${PORT}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
