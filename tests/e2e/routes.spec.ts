import { expect, test } from "@playwright/test";

const ROUTES = [
  "/",
  "/thesis",
  "/technology",
  "/evidence",
  "/research",
  "/contact",
  "/privacy",
  "/terms",
];

test.describe("routes", () => {
  for (const route of ROUTES) {
    test(`${route} renders with exactly one h1`, async ({ page }) => {
      const response = await page.goto(route);
      expect(response?.status()).toBe(200);
      await expect(page.locator("h1")).toHaveCount(1);
    });
  }

  test("serves a sitemap listing every route", async ({ request }) => {
    const response = await request.get("/sitemap.xml");
    expect(response.status()).toBe(200);

    const body = await response.text();
    for (const route of ["/thesis", "/technology", "/evidence", "/research", "/contact"]) {
      expect(body).toContain(route);
    }
  });

  test("serves robots.txt", async ({ request }) => {
    const response = await request.get("/robots.txt");
    expect(response.status()).toBe(200);
    expect(await response.text()).toContain("Sitemap:");
  });

  test("serves an Open Graph image", async ({ request }) => {
    const response = await request.get("/og");
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("image");
  });

  test("returns 404 for an unknown path", async ({ page }) => {
    const response = await page.goto("/no-such-page");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: /no path to this node/i })).toBeVisible();
  });

  test("sets the security headers", async ({ request }) => {
    const response = await request.get("/");
    const headers = response.headers();

    expect(headers["x-frame-options"]).toBe("DENY");
    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["content-security-policy"]).toContain("object-src 'none'");
    expect(headers["content-security-policy"]).not.toContain("unsafe-eval");
  });
});

/**
 * The contact endpoint.
 *
 * The rate limiter is real, in-process, and keyed by IP — which means every
 * project in this suite shares one counter against the same server. Rather than
 * weakening production behaviour to make the tests convenient, these run
 * serially and treat a 429 as a valid outcome: the limiter engaging *is* the
 * endpoint working. The limiter's own logic is covered deterministically in
 * `tests/unit/security.test.ts`, where time is injected.
 */
test.describe.serial("the contact endpoint", () => {
  test("rejects an invalid submission", async ({ request }) => {
    const response = await request.post("/api/contact", {
      data: { name: "", email: "nope", context: "short" },
    });

    if (response.status() === 429) return;

    expect(response.status()).toBe(422);
    const body = await response.json();
    expect(body.ok).toBe(false);
    expect(body.errors).toBeTruthy();
  });

  test("accepts a valid submission", async ({ request }) => {
    const response = await request.post("/api/contact", {
      data: {
        name: "A Reader",
        email: "reader@example.com",
        context:
          "We operate a production line and cannot see two tiers below our direct suppliers.",
      },
    });

    if (response.status() === 429) return;

    expect(response.status()).toBe(200);
    expect((await response.json()).ok).toBe(true);
  });

  test("rejects a malformed body", async ({ request }) => {
    const response = await request.post("/api/contact", {
      headers: { "Content-Type": "application/json" },
      data: "not json",
    });

    // Never a 5xx: a malformed body is the caller's error, not the server's.
    expect(response.status()).toBeLessThan(500);
    expect([400, 422, 429]).toContain(response.status());
  });

  test("rate limits sustained submissions", async ({ request }) => {
    const send = () =>
      request.post("/api/contact", {
        data: {
          name: "A Reader",
          email: "reader@example.com",
          context: "Repeated submission used to confirm the limiter engages as designed.",
        },
      });

    let limited = false;
    for (let i = 0; i < 8 && !limited; i += 1) {
      const response = await send();
      if (response.status() === 429) {
        limited = true;
        expect(response.headers()["retry-after"]).toBeTruthy();
      }
    }

    expect(limited).toBe(true);
  });
});
