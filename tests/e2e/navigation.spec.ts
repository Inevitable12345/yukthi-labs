import { expect, test } from "@playwright/test";

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

test.describe("navigation", () => {
  test("the index drawer opens, traps focus, and closes on Escape", async ({ page }) => {
    await page.goto("/");

    await page
      .getByRole("button", { name: /index|menu/i })
      .first()
      .click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAttribute("aria-modal", "true");

    // Focus starts inside the dialog and stays there across a full tab cycle.
    for (let index = 0; index < 14; index += 1) {
      await page.keyboard.press("Tab");
      const inside = await dialog.evaluate((element) =>
        element.contains(document.activeElement),
      );
      expect(inside, `focus escaped after ${index + 1} tabs`).toBe(true);
    }

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
  });

  test("the drawer navigates to a route and closes itself", async ({ page }) => {
    await page.goto("/");
    await page
      .getByRole("button", { name: /index|menu/i })
      .first()
      .click();
    await page.getByRole("dialog").locator('a[href="/thesis"]').click();

    await expect(page).toHaveURL(/\/thesis$/);
    await expect(page.getByRole("dialog")).toBeHidden();
  });

  test("the skip link is the first tab stop and moves focus to main", async ({ page }) => {
    await page.goto("/thesis");
    await page.keyboard.press("Tab");

    const skip = page.getByRole("link", { name: /skip to content/i });
    await expect(skip).toBeFocused();

    await page.keyboard.press("Enter");
    await expect(page.locator("#main")).toBeFocused();
  });

  test("the footer reaches every route and the legal pages", async ({ page }) => {
    await page.goto("/");
    const footer = page.locator("footer");
    await footer.scrollIntoViewIfNeeded();

    for (const label of ["Thesis", "Architecture", "Evidence", "Research", "About"]) {
      await expect(footer.getByRole("link", { name: label, exact: true })).toBeVisible();
    }
    for (const label of ["Privacy", "Cookies", "Terms"]) {
      await expect(footer.getByRole("link", { name: label, exact: true })).toBeVisible();
    }
  });

  test("the thesis section index tracks the section being read", async ({ page }) => {
    test.skip(
      test.info().project.name !== "desktop",
      "the section index is a desktop affordance",
    );
    await page.goto("/thesis");
    await page.locator("#breaks").scrollIntoViewIfNeeded();
    await page.waitForTimeout(900);

    await expect(
      page
        .getByRole("navigation", { name: /thesis sections/i })
        .getByText(/Structural breaks/i),
    ).toBeVisible();
  });
});

test.describe("consent", () => {
  test("no optional storage is written before a choice is made", async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto("/");

    const stored = await page.evaluate(() => window.localStorage.getItem("yukthi.consent.v1"));
    expect(stored).toBeNull();

    await expect(page.getByRole("region", { name: /cookie consent/i })).toBeVisible();
    await context.close();
  });

  test("rejecting optional storage records only the necessary category", async ({
    browser,
  }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto("/");

    await page.getByRole("button", { name: /reject optional/i }).click();
    const stored = await page.evaluate(() =>
      JSON.parse(window.localStorage.getItem("yukthi.consent.v1") ?? "{}"),
    );
    expect(stored.state).toEqual({
      necessary: true,
      analytics: false,
      functional: false,
      marketing: false,
    });
    await expect(page.getByRole("region", { name: /cookie consent/i })).toBeHidden();
    await context.close();
  });

  test("preferences can be reopened from the footer", async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto("/");
    await page.getByRole("button", { name: /accept all/i }).click();

    await page.locator("footer").scrollIntoViewIfNeeded();
    await page
      .locator("footer")
      .getByRole("button", { name: /cookie preferences/i })
      .click();

    await expect(page.getByRole("dialog")).toContainText(/Cookie preferences/i);
    await context.close();
  });
});

test.describe("security headers", () => {
  test("the production response carries the hardened header set", async ({ request }) => {
    const response = await request.get("/");
    const headers = response.headers();

    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["x-frame-options"]).toBe("DENY");
    expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
    expect(headers["permissions-policy"]).toContain("camera=()");
    expect(headers["strict-transport-security"]).toContain("max-age=");

    const csp = headers["content-security-policy"];
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("base-uri 'self'");
    expect(csp).not.toContain("unsafe-eval");
  });
});

test.describe("contact endpoint", () => {
  test("rejects a malformed enquiry with field-level errors", async ({ request }) => {
    const response = await request.post("/api/contact", {
      data: {
        name: "x",
        email: "nope",
        organization: "",
        role: "",
        message: "",
        consent: false,
      },
    });
    expect(response.status()).toBe(422);
    const body = await response.json();
    expect(body.ok).toBe(false);
    expect(body.fieldErrors).toBeTruthy();
  });

  test("refuses a non-JSON body and a GET", async ({ request }) => {
    const form = await request.post("/api/contact", {
      form: { name: "someone" },
    });
    expect(form.status()).toBe(415);

    const get = await request.get("/api/contact");
    expect(get.status()).toBe(405);
  });
});
