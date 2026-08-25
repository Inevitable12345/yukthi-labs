import { expect, test } from "@playwright/test";

const ROUTES = [
  "/",
  "/thesis",
  "/architecture",
  "/evidence",
  "/research",
  "/field-notes",
  "/field-notes/2026-08-25-licensing-is-the-mechanism",
  "/about",
  "/privacy",
  "/cookies",
  "/terms",
];

/** Consent is decided up front so the notice does not sit over the content. */
test.beforeEach(async ({ context, baseURL }) => {
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
  void baseURL;
});

test.describe("routes", () => {
  for (const route of ROUTES) {
    test(`${route} responds, renders one h1, and logs no errors`, async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      page.on("console", (message) => {
        if (message.type() === "error") errors.push(message.text());
      });

      const response = await page.goto(route);
      expect(response?.status(), `${route} status`).toBe(200);

      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("main")).toBeVisible();
      await expect(page).toHaveTitle(/Yukthi Lab/);

      await page.waitForTimeout(600);
      expect(errors, `${route} console`).toEqual([]);
    });

    test(`${route} never scrolls the page sideways`, async ({ page }) => {
      await page.goto(route);
      await page.waitForTimeout(500);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, `${route} horizontal overflow`).toBeLessThanOrEqual(1);
    });
  }

  test("an unknown route renders the 404 page", async ({ page }) => {
    const response = await page.goto("/this-route-does-not-exist");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/does not resolve/i);
  });

  test("robots and sitemap are served", async ({ request }) => {
    const robots = await request.get("/robots.txt");
    expect(robots.status()).toBe(200);
    expect(await robots.text()).toContain("Sitemap:");

    const sitemap = await request.get("/sitemap.xml");
    expect(sitemap.status()).toBe(200);
    const xml = await sitemap.text();
    expect(xml).toContain("/thesis");
    expect(xml).toContain("/field-notes/");
  });

  test("the Open Graph card renders as a PNG", async ({ request }) => {
    const response = await request.get("/og");
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("image/png");
  });
});
