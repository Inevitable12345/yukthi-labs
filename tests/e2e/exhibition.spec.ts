import { expect, test } from "@playwright/test";

/* The exhibition's structural promises, checked in a real browser. */

test.describe("the exhibition", () => {
  test("opens in the observatory and states the tension before the mission", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Yukthi Lab / Observatory 01")).toBeVisible();
    await expect(
      page.getByText("The world was easier to reason about when its structure was stable."),
    ).toBeVisible();
    await expect(
      page.getByText("Bring certainty to an increasingly unstable world.").first(),
    ).toBeVisible();
  });

  test("carries all twenty rooms in the document", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("section[data-room]")).toHaveCount(21);
    for (const coordinate of ["01", "11", "20"]) {
      await expect(page.locator(`section[data-coordinate="${coordinate}"]`)).toHaveCount(1);
    }
  });

  test("advances the coordinate readout as rooms are entered", async ({ page }) => {
    await page.goto("/");
    const readout = page.getByText(/YUKTHI \/ OBSERVATORY/).first();

    await page.locator("#yukthi").scrollIntoViewIfNeeded();
    await expect(readout).toContainText("11");

    // Reverse traversal has to work exactly as well as forward (§31).
    await page.locator("#rupture").scrollIntoViewIfNeeded();
    await expect(readout).toContainText("02");
  });

  test("runs the scenario and propagates in causal order", async ({ page }) => {
    await page.goto("/");
    await page.locator("#simulate").scrollIntoViewIfNeeded();

    const lever = page.getByRole("switch", { name: /Export restriction/ });
    await expect(lever).toHaveAttribute("aria-checked", "false");
    await expect(page.getByText("Structure present, inert")).toBeVisible();

    await lever.click();
    await expect(lever).toHaveAttribute("aria-checked", "true");
    await expect(page.getByText(/Wave \d+ of \d+/)).toBeVisible();
    await expect(
      page.getByText(/Propagation order follows the hand-authored mechanisms/),
    ).toBeVisible();
  });

  test("never states a probability alongside the scenario", async ({ page }) => {
    await page.goto("/");
    const body = (await page.locator("body").innerText()).toLowerCase();
    expect(body).not.toMatch(/\d+%\s*(chance|probability|likelihood)/);
  });

  test("opens an evidence record from the exhibition", async ({ page }) => {
    await page.goto("/");
    await page.locator("#feedback").scrollIntoViewIfNeeded();
    const chip = page.getByRole("button", { name: /Federal Energy Regulatory Commission/ }).first();
    await chip.click();
    await expect(page.getByText("Yukthi interpretation").first()).toBeVisible();
  });
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("keeps the argument, the diagrams and the interaction intact", async ({ page }) => {
    await page.goto("/");
    await page.locator("#simulate").scrollIntoViewIfNeeded();

    await expect(page.getByRole("heading", { name: "Simulate" })).toBeVisible();

    const lever = page.getByRole("switch", { name: /Export restriction/ });
    await lever.click();
    // Every wave arrives at once; the ordering is still published.
    await expect(page.getByText(/Wave \d+ of \d+/)).toBeVisible();
    await expect(page.getByText(/nodes reached/)).toBeVisible();
  });
});
