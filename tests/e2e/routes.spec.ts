import { expect, test } from "@playwright/test";

const ROUTES = [
  {
    path: "/thesis",
    heading: "The world was easier to reason about when its structure was stable.",
  },
  { path: "/technology", heading: "A Scoped Causal Hypergraph-based World Model" },
  { path: "/evidence", heading: "Every source, in full" },
  { path: "/research", heading: "Case studies and open questions" },
  { path: "/contact", heading: "Write to us" },
  { path: "/privacy", heading: "What this site collects" },
];

for (const route of ROUTES) {
  test(`${route.path} renders and is titled`, async ({ page }) => {
    await page.goto(route.path);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(route.heading);
    await expect(page).toHaveTitle(/Yukthi Lab/);
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
  });
}

test("the thesis carries every room as static text", async ({ page }) => {
  await page.goto("/thesis");
  await expect(page.locator("section[id^='thesis-']")).toHaveCount(22);
  await expect(
    page.getByRole("heading", { name: "What Yukthi would have to prove" }),
  ).toBeVisible();
});

test("the evidence library filters without losing records from the document", async ({ page }) => {
  await page.goto("/evidence");
  const total = await page.locator("article[aria-labelledby^='ev-']").count();
  expect(total).toBeGreaterThan(10);

  await page.getByRole("button", { name: "International Energy Agency" }).click();
  await expect(
    page.getByText(/Showing \d+ of \d+ records from International Energy Agency/),
  ).toBeVisible();
  // Filtering hides; it does not unmount. The library stays crawlable.
  await expect(page.locator("article[aria-labelledby^='ev-']")).toHaveCount(total);
});

test("the contact form rejects a bad submission before it reaches the network", async ({
  page,
}) => {
  await page.goto("/contact");
  await page.getByLabel("Name").fill("A");
  await page.getByLabel("Email").fill("not-an-address");
  await page.getByLabel("Message").fill("short");
  await page.getByRole("button", { name: "Send" }).click();
  await expect(page.getByText(/Please give a name|Please give an address/)).toBeVisible();
});

test("robots and sitemap are served", async ({ request }) => {
  const robots = await request.get("/robots.txt");
  expect(robots.ok()).toBe(true);
  expect(await robots.text()).toContain("Sitemap:");

  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.ok()).toBe(true);
  expect(await sitemap.text()).toContain("/technology");
});

test("security headers are present on a document response", async ({ request }) => {
  const response = await request.get("/");
  const headers = response.headers();
  expect(headers["content-security-policy"]).toContain("frame-ancestors 'none'");
  expect(headers["x-content-type-options"]).toBe("nosniff");
  expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
});

test("the contact endpoint refuses a malformed payload and rate-limits a flood", async ({
  request,
}, testInfo) => {
  // The limiter keys on the forwarded address, so each run claims its own
  // window. Without this the two browser projects share a counter and the
  // second one starts already exhausted.
  const caller = `203.0.113.${(testInfo.workerIndex % 200) + 10}`;
  const headers = { "x-forwarded-for": caller };

  const bad = await request.post("/api/contact", { data: { name: "x" }, headers });
  expect(bad.status()).toBe(422);

  const payload = {
    name: "A Reader",
    email: "reader@example.org",
    intent: "research",
    message: "A message long enough to satisfy the twenty character minimum requirement.",
  };
  let sawLimit = false;
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const response = await request.post("/api/contact", { data: payload, headers });
    if (response.status() === 429) sawLimit = true;
  }
  expect(sawLimit).toBe(true);
});
