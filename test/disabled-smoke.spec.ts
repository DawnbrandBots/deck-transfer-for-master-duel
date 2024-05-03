import { test, expect } from "@playwright/test";

test("Smoke test 1: YGOPRODECK extension page baseline", async ({ page }) => {
    await page.goto("https://ygoprodeck.com/decks/transfer-tool/");
    const body = page.locator("body");
    await expect(body).not.toContainText("The extension is detected.");
    await expect(body).toContainText("The extension is not detected.");
    await expect(body).toContainText("Extension Not Detected");
});

test("Smoke test: EN Konami deck recipe page baseline (like 2, opposite 6)", async ({ page }) => {
    await page.goto("https://www.db.yugioh-card.com/yugiohdb/deck_search.action?request_locale=en");
    const tabOpen = page.waitForEvent("popup");
    await page.locator("a.inside").first().click();
    const newPage = await tabOpen;
    const body = newPage.locator("body");
    await expect(body).not.toContainText("Export YDK");
    await expect(body).not.toContainText("Export to YGOPRODECK");
});
