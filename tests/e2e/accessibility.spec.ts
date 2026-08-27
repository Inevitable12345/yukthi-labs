import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const ROUTES = ["/", "/thesis", "/technology", "/evidence", "/research", "/contact"];

test.describe("accessibility", () => {
  for (const route of ROUTES) {
    test(`${route} has no detectable WCAG A/AA violations`, async ({ page }) => {
      await page.goto(route);

      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();

      expect(
        results.violations.map((violation) => ({
          id: violation.id,
          nodes: violation.nodes.map((node) => node.target).slice(0, 3),
        })),
      ).toEqual([]);
    });
  }

  test("the skip link is the first thing a keyboard reaches", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");

    const focused = page.locator(":focus");
    await expect(focused).toHaveText(/skip to content/i);
    await expect(focused).toBeVisible();
  });

  test("the chapter rail is keyboard navigable", async ({ page }, testInfo) => {
    await page.goto("/");

    const links = page.locator('nav[aria-label="Chapters"] a');
    await expect(links).toHaveCount(11);

    // The rail is a desktop affordance — below `lg` it is hidden and the same
    // navigation is served by the header menu, so its accessible names are only
    // meaningful where it is actually rendered.
    test.skip(testInfo.project.name === "mobile", "rail is hidden below lg");

    for (let i = 0; i < 11; i += 1) {
      await expect(links.nth(i)).toHaveAccessibleName(/chapter \d+/i);
    }
  });

  test("the evidence drawer traps and returns focus correctly", async ({ page }) => {
    await page.goto("/evidence");

    await page
      .getByRole("button", { name: /full record/i })
      .first()
      .click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
  });
});

test.describe("reduced motion", () => {
  test.use({ contextOptions: { reducedMotion: "reduce" } });

  test("delivers the complete argument without pinning", async ({ page }) => {
    await page.goto("/");

    // Every stage of the operating loop is present at once rather than revealed.
    const loop = page.locator("#operating-loop");
    const text = await loop.innerText();

    for (const stage of ["Map", "Monitor", "Forecast", "Simulate", "Re-map"]) {
      expect(text).toContain(stage);
    }
  });

  test("still reaches the finale", async ({ page }) => {
    await page.goto("/");
    await page.locator("#finale").scrollIntoViewIfNeeded();
    await expect(page.getByRole("heading", { name: /civilizations/i })).toBeVisible();
  });
});
