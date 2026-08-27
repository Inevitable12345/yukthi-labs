import { expect, test } from "@playwright/test";

/* The homepage is a scroll-driven argument. These tests assert the properties
   that matter: it is complete without scripting, it survives reverse scroll, and
   it never traps the reader. */

test.describe("the narrative", () => {
  test("opens with the mission", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: /bring certainty to an increasingly unstable world/i }),
    ).toBeVisible();
  });

  test("contains every chapter as real content", async ({ page }) => {
    await page.goto("/");

    for (const id of [
      "stability",
      "rupture",
      "rare-earth",
      "semiconductor",
      "structural-break",
      "feedback",
      "coming-decade",
      "ai",
      "yukthi",
      "operating-loop",
      "decision-scopes",
      "investment",
      "finale",
    ]) {
      await expect(page.locator(`#${id}`)).toHaveCount(1);
    }
  });

  test("answers the acceptance questions somewhere in the page", async ({ page }) => {
    await page.goto("/");
    const text = (await page.locator("main").innerText()).toLowerCase();

    for (const claim of [
      "structure began to change",
      "causal chokepoints",
      "reality is not a chain",
      "become fragile",
      "interaction",
      "has not eliminated uncertainty",
      "scoped causal hypergraph",
      "map. monitor. forecast. simulate. re-map.",
      "3 a.m. problem",
      "proof questions",
    ]) {
      expect(text, `missing: ${claim}`).toContain(claim);
    }
  });

  test("never scrolls the body horizontally", async ({ page }) => {
    await page.goto("/");

    for (const ratio of [0, 0.25, 0.5, 0.75, 1]) {
      await page.evaluate((r) => window.scrollTo(0, document.body.scrollHeight * r), ratio);
      await page.waitForTimeout(180);

      const overflows = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      );
      expect(overflows, `horizontal overflow at ${ratio}`).toBe(false);
    }
  });

  test("restores the opening state when scrolled back to the top", async ({ page }) => {
    await page.goto("/");

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.6));
    await page.waitForTimeout(400);

    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(600);

    // The rail's first chapter is current again.
    await expect(page.locator('nav[aria-label="Chapters"] a[aria-current="step"]')).toHaveCount(
      1,
    );
    await expect(page.getByRole("heading", { name: /bring certainty/i })).toBeInViewport();
  });

  test("does not hijack scrolling", async ({ page }) => {
    await page.goto("/");

    const before = await page.evaluate(() => window.scrollY);
    await page.mouse.wheel(0, 700);
    await page.waitForTimeout(250);
    const after = await page.evaluate(() => window.scrollY);

    expect(after).toBeGreaterThan(before);
  });

  test("reaches the end of the argument", async ({ page }) => {
    await page.goto("/");
    await page.locator("#finale").scrollIntoViewIfNeeded();

    await expect(
      page.getByRole("heading", { name: /civilizations have always built instruments/i }),
    ).toBeVisible();
  });
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("the whole argument is still readable", async ({ page }) => {
    await page.goto("/");

    const text = await page.locator("main").innerText();

    // The thesis, the evidence and the conclusion must all survive.
    expect(text).toContain("Bring certainty to an increasingly unstable world");
    expect(text.toLowerCase()).toContain("scoped causal hypergraph");
    expect(text.toLowerCase()).toContain("proof questions");
    expect(text.length).toBeGreaterThan(6000);
  });

  test("evidence citations are present as text", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("E-005").first()).toBeVisible();
  });
});
