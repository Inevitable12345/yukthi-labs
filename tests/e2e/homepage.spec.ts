import { expect, test } from "@playwright/test";

const ACTS = [
  "invocation",
  "stable-world",
  "rupture",
  "evidence-field",
  "rare-earth",
  "linear-failure",
  "structural-break",
  "feedback",
  "convergence",
  "three-am",
  "ai-capability",
  "the-bet",
  "ambition",
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

test.describe("homepage sequence", () => {
  test("every act is present and reaches the viewport", async ({ page }) => {
    await page.goto("/");

    for (const act of ACTS) {
      const section = page.locator(`#${act}`);
      await expect(section, `#${act} exists`).toHaveCount(1);
      await section.scrollIntoViewIfNeeded();
      await expect(section).toBeVisible();
    }
  });

  test("the mission is the page's only h1", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      /Bring certainty to an increasingly unstable world/i,
    );
  });

  test("the technical bet and the operating loop are stated", async ({ page }) => {
    await page.goto("/");
    await page.locator("#the-bet").scrollIntoViewIfNeeded();
    await expect(page.locator("#the-bet")).toContainText(
      "Scoped Causal Hypergraph-based World Model",
    );
    await expect(page.locator("#the-bet")).toContainText(
      "Map → Monitor → Forecast → Simulate → Re-map",
    );
  });

  test("no section claims to predict the future", async ({ page }) => {
    await page.goto("/");
    const body = (await page.locator("body").innerText()).toLowerCase();
    expect(body).not.toContain("we predict the future");
    expect(body).toContain("3 a.m. problem");
  });

  test("illustrative diagrams are labelled as illustrative", async ({ page }) => {
    await page.goto("/");
    await page.locator("#linear-failure").scrollIntoViewIfNeeded();
    await expect(
      page
        .locator("#linear-failure")
        .getByText(/Illustrative/i)
        .first(),
    ).toBeVisible();
  });

  test("a causal node opens the inspector and Escape closes it", async ({ page }) => {
    await page.goto("/");
    const section = page.locator("#rare-earth");
    await section.scrollIntoViewIfNeeded();

    await section
      .getByRole("button", { name: /Refining concentration/i })
      .first()
      .click();

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText(/Current state/i);
    await expect(dialog).toContainText(/Second-order effects/i);
    await expect(dialog).toContainText(/Evidence/i);

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
  });

  test("every diagram carries a readable text alternative", async ({ page }) => {
    await page.goto("/");
    const section = page.locator("#rare-earth");
    await section.scrollIntoViewIfNeeded();

    const summary = section.getByText(/Read this diagram as text/i).first();
    await summary.click();
    await expect(section.getByText(/Refining concentration/).first()).toBeVisible();
  });

  test("an evidence marker opens its source record", async ({ page }) => {
    await page.goto("/");
    await page.locator("#rare-earth").scrollIntoViewIfNeeded();
    await page
      .getByRole("button", { name: /Evidence E-005/i })
      .first()
      .click();

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText("International Energy Agency");
    await expect(dialog).toContainText(/Verified/);
  });

  test("the decision scope selector switches scenario", async ({ page }) => {
    await page.goto("/");
    await page.locator("#three-am").scrollIntoViewIfNeeded();

    const frame = page.locator("#three-am");
    await frame.getByRole("tab", { name: /insurance/i }).click();
    await expect(frame.getByRole("tabpanel")).toContainText(
      /risk accumulating inside my book/i,
    );
  });

  test("the representation toggle swaps chain for hypergraph", async ({ page }) => {
    await page.goto("/");
    const section = page.locator("#linear-failure");
    await section.scrollIntoViewIfNeeded();

    await section.getByRole("button", { name: "The hypergraph", exact: true }).click();

    // The shared constraint is now a real node in the diagram, not a line of prose.
    await expect(
      section.getByRole("button", { name: /Semiconductor constraint/ }).first(),
    ).toBeVisible();
    // And the junction label is the visible assertion that the sources act jointly.
    await expect(section.getByText(/joint constraint/i).first()).toBeVisible();
  });
});
