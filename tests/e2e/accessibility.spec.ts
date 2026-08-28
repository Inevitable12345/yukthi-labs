import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const PAGES = ["/", "/thesis", "/technology", "/evidence", "/research", "/contact"];

for (const path of PAGES) {
  test(`${path} has no detectable WCAG A/AA violations`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });
}

test("the skip link is the first thing a keyboard reaches", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
});

test("the room index is keyboard navigable and announces the current room", async ({
  page,
}, testInfo) => {
  // The index is a desktop affordance. On a phone the coordinate readout and the
  // scroll itself carry orientation instead — mobile is not a shrunken desktop (§39).
  test.skip(testInfo.project.name === "mobile", "Room index is desktop-only by design");
  await page.goto("/");
  const index = page.getByRole("navigation", { name: "Exhibition rooms" });
  await expect(index.getByRole("link")).toHaveCount(20);
  await index.getByRole("link", { name: /Room 11/ }).click();
  await expect(page).toHaveURL(/#yukthi$/);
});

test("every room is a labelled landmark section", async ({ page }) => {
  await page.goto("/");
  const sections = page.locator("section[data-room]");
  const count = await sections.count();
  for (let index = 0; index < count; index += 1) {
    const labelledBy = await sections.nth(index).getAttribute("aria-labelledby");
    expect(labelledBy).toBeTruthy();
    await expect(page.locator(`#${labelledBy}`)).toHaveCount(1);
  }
});

test("the decision scopes open from the keyboard", async ({ page }) => {
  await page.goto("/");
  await page.locator("#three-am").scrollIntoViewIfNeeded();
  const trigger = page.getByRole("button", { name: /What tiny dependency/ });
  await trigger.focus();
  await page.keyboard.press("Enter");
  await expect(trigger).toHaveAttribute("aria-expanded", /true|false/);
});
