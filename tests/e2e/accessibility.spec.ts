import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const ROUTES = [
  "/",
  "/thesis",
  "/architecture",
  "/evidence",
  "/research",
  "/field-notes",
  "/about",
  "/privacy",
];

test.beforeEach(async ({ context }) => {
  await context.addInitScript(() => {
    window.localStorage.setItem(
      "yukthi.consent.v1",
      JSON.stringify({
        version: 1,
        decidedAt: "2026-08-25T00:00:00.000Z",
        state: { necessary: true, analytics: false, functional: false, marketing: false },
      }),
    );
  });
});

test.describe("accessibility", () => {
  for (const route of ROUTES) {
    test(`${route} has no WCAG 2.1 A/AA violations`, async ({ page }) => {
      await page.goto(route);
      await page.waitForTimeout(700);

      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();

      expect(
        results.violations.map((violation) => `${violation.id}: ${violation.help}`),
      ).toEqual([]);
    });
  }

  test("the causal inspector dialog is accessible when open", async ({ page }) => {
    await page.goto("/");
    await page.locator("#rare-earth").scrollIntoViewIfNeeded();
    await page
      .getByRole("button", { name: /Refining concentration/i })
      .first()
      .click();
    await expect(page.getByRole("dialog")).toBeVisible();

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    expect(results.violations.map((violation) => violation.id)).toEqual([]);
  });

  test("a causal graph can be operated entirely from the keyboard", async ({ page }) => {
    await page.goto("/");
    const section = page.locator("#rare-earth");
    await section.scrollIntoViewIfNeeded();

    await section
      .getByRole("button", { name: /Refining concentration/i })
      .first()
      .focus();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("dialog")).toBeVisible();
  });

  test("heading order is coherent on the thesis", async ({ page }) => {
    await page.goto("/thesis");
    const levels = await page.$$eval("h1, h2, h3, h4", (elements) =>
      elements.map((element) => Number(element.tagName.slice(1))),
    );

    expect(levels[0]).toBe(1);
    for (let index = 1; index < levels.length; index += 1) {
      expect(levels[index]! - levels[index - 1]!, `jump at index ${index}`).toBeLessThanOrEqual(
        1,
      );
    }
  });

  test("content survives 200% zoom without a horizontal scrollbar", async ({ page }) => {
    await page.setViewportSize({ width: 640, height: 800 });
    await page.goto("/thesis");
    await page.evaluate(() => {
      document.documentElement.style.fontSize = "32px";
    });
    await page.waitForTimeout(500);

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);
  });
});

test.describe("reduced motion", () => {
  test("the argument is fully readable with motion reduced", async ({ page }) => {
    test.skip(
      test.info().project.name !== "reduced-motion",
      "covered by the reduced-motion project",
    );

    await page.goto("/");
    for (const act of ["stable-world", "rare-earth", "the-bet", "ambition"]) {
      const section = page.locator(`#${act}`);
      await section.scrollIntoViewIfNeeded();
      await expect(section).toBeVisible();
    }

    // Nothing is left at zero opacity waiting for an animation that will not run.
    const hidden = await page.$$eval(
      "#rare-earth svg g",
      (groups) =>
        groups.filter((group) => Number(getComputedStyle(group).opacity) === 0).length,
    );
    expect(hidden).toBe(0);
  });

  test("no WebGL canvas is created when motion is reduced", async ({ page }) => {
    test.skip(
      test.info().project.name !== "reduced-motion",
      "covered by the reduced-motion project",
    );

    await page.goto("/");
    await page.waitForTimeout(2000);
    expect(await page.locator("canvas").count()).toBe(0);
    // The world layer still renders — as the static SVG world, which is what the
    // reduced-motion rendering is. Nothing is blank and nothing is animated.
    await expect(page.locator("svg").first()).toBeAttached();
  });
});
