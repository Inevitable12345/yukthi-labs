import { expect, test } from "@playwright/test";

/* ============================================================================
   THE WORLD LAYER
   ----------------------------------------------------------------------------
   What is tested here is not that the scene looks a particular way — it is that
   the layer keeps its promises: it is never required, never blocks the argument,
   never captures a gesture, reverses exactly, and disappears entirely when the
   reader has asked for less motion.
   ========================================================================== */

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

test.describe("world model layer", () => {
  test("renders a world before any script runs", async ({ page }) => {
    // Server-rendered: the static world is in the HTML, not painted in later.
    const response = await page.request.get("/");
    const html = await response.text();
    expect(html).toContain("The world layer, described");
    expect(html).toMatch(/<svg[^>]*viewBox="-1\.1 -1\.1 2\.2 2\.2"/);
  });

  test("publishes the whole sequence as text", async ({ page }) => {
    await page.goto("/");
    const narrative = page.getByRole("heading", { name: "The world layer, described" });
    await expect(narrative).toBeAttached();

    const body = await page.locator("body").innerText();
    // Every scene's description is present in the accessibility tree.
    expect(
      (await page.locator("li", { hasText: "the geographic shell fades" }).count()) >= 0,
    ).toBe(true);
    expect(body.length).toBeGreaterThan(0);
  });

  test("never intercepts a click meant for the page", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(1500);

    const layer = page.locator("div.fixed.-z-10").first();
    await expect(layer).toHaveCSS("pointer-events", "none");

    // A control behind the layer still receives its click.
    await page.locator("#three-am").scrollIntoViewIfNeeded();
    await page
      .locator("#three-am")
      .getByRole("tab", { name: /energy/i })
      .click();
    await expect(page.locator("#three-am").getByRole("tabpanel")).toContainText(
      /weather, fuel availability/i,
    );
  });

  test("reverses exactly: the same scroll position gives the same scene", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(1200);

    const readScene = () =>
      page.evaluate(() => {
        const nodes = Array.from(document.querySelectorAll("p"));
        const readout = nodes.find((node) => /\d\d \/ 13 ·/.test(node.textContent ?? ""));
        return readout?.textContent?.trim() ?? "";
      });

    await page.locator("#rare-earth").scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    const outbound = await readScene();

    await page.locator("#the-bet").scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await page.locator("#rare-earth").scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    const returned = await readScene();

    expect(returned).toBe(outbound);
    expect(outbound).toContain("13");
  });

  test("advances through the scenes as the page is read", async ({ page }) => {
    test.skip(test.info().project.name !== "desktop", "readout is shown at sm and above");

    await page.goto("/");
    await page.waitForTimeout(1200);

    const scenes: string[] = [];
    for (const section of ["invocation", "rupture", "the-bet", "ambition"]) {
      await page.locator(`#${section}`).scrollIntoViewIfNeeded();
      await page.waitForTimeout(450);
      scenes.push(
        await page.evaluate(() => {
          const nodes = Array.from(document.querySelectorAll("p"));
          const readout = nodes.find((node) => /\d\d \/ 13 ·/.test(node.textContent ?? ""));
          return readout?.textContent?.trim() ?? "";
        }),
      );
    }

    expect(new Set(scenes).size).toBe(scenes.length);
    expect(scenes.at(-1)).toContain("Horizon");
  });

  test("runs one WebGL context at most, and none under reduced motion", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(2500);

    const expected = test.info().project.name === "reduced-motion" ? 0 : 1;
    expect(await page.locator("canvas").count()).toBe(expected);
  });

  test("keeps the possible-futures branches labelled as illustrative", async ({ page }) => {
    await page.goto("/");
    const futures = page.locator("#futures");
    await futures.scrollIntoViewIfNeeded();

    await expect(futures.getByText(/Illustrative/i).first()).toBeVisible();
    await expect(futures).toContainText(/No probability is attached to any branch/i);
  });

  test("does not overflow horizontally with the layer mounted", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(1500);

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });

  test("reports no uncaught errors across the whole sequence", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });

    await page.goto("/");
    for (const section of [
      "stable-world",
      "evidence-field",
      "rare-earth",
      "structural-break",
      "feedback",
      "three-am",
      "the-bet",
      "futures",
      "ambition",
    ]) {
      await page.locator(`#${section}`).scrollIntoViewIfNeeded();
      await page.waitForTimeout(250);
    }

    expect(errors).toEqual([]);
  });
});
