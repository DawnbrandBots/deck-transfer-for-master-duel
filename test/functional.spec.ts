import { test, expect } from "./fixtures";

// Export functional test 1: YDK
// Export functional test 2: YDKE
// Export functional test 3: YGOPRODECK

test("Streamlined import functional test 3", async ({ page }) => {
  await page.goto("https://ygoprodeck.com/");
  await page.getByRole("link", { name: " " }).click();
  await page.getByRole("link", { name: " Random Deck" }).click();
  await page.getByRole("button", { name: "More..." }).click();
  const tabOpen = page.waitForEvent("popup");
  await page.getByRole("link", { name: " Export Master Duel/Neuron" }).click();
  const newPage = await tabOpen;
  await expect(newPage.url().startsWith("https://www.db.yugioh-card.com/yugiohdb/member_deck.action#storm-access=")).toBe(true);
  await expect(newPage.locator("body")).toContainText("You are not logged into Konami's official database. Please log in first and then try exporting again.");
});
