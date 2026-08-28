import { expect, test } from "@playwright/test";

/* §41 — the thesis has to work without WebGL. Chromium is launched with the
   GPU and both WebGL contexts disabled, so the probe genuinely fails and the
   SVG fallback is what renders. */

test.use({
  launchOptions: {
    args: ["--disable-gpu", "--disable-webgl", "--disable-webgl2"],
    ...(process.env.PLAYWRIGHT_CHROMIUM_PATH
      ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH }
      : {}),
  },
});

test("renders the fallback world rather than a blank canvas", async ({ page }) => {
  await page.goto("/");
  const fallback = page.getByRole("img", { name: /Schematic of the world model/ });
  await expect(fallback).toBeVisible();
  await expect(page.locator("canvas")).toHaveCount(0);
});

test("keeps the whole argument, its diagrams and its evidence", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "The size of a node is not the size of its consequence." }),
  ).toBeAttached();

  await page.locator("#simulate").scrollIntoViewIfNeeded();
  await page.getByRole("switch", { name: /Export restriction/ }).click();
  await expect(page.getByText(/nodes reached/)).toBeVisible();

  await page.locator("#three-am").scrollIntoViewIfNeeded();
  await expect(page.getByText(/What tiny dependency/).first()).toBeVisible();
});
