import { test, expect } from "./fixtures";

test("Smoke test 3: YGOPRODECK extension page detection", async ({ page }) => {
    await page.goto("https://ygoprodeck.com/decks/transfer-tool/");
    const body = page.locator("body");
    await expect(body).toContainText("The extension is detected.");
    await expect(body).not.toContainText("The extension is not detected.");
    await expect(body).not.toContainText("Extension Not Detected");
});

test("Smoke test 6: EN Konami deck recipe page button injection", async ({ page }) => {
    await page.goto("https://www.db.yugioh-card.com/yugiohdb/deck_search.action?request_locale=en");
    const tabOpen = page.waitForEvent("popup");
    await page.locator("a.inside").first().click();
    const newPage = await tabOpen;
    const ydk = newPage.locator("#btn_ydk");
    const ydke = newPage.locator("#btn_ydke");
    const ygoprodeck = newPage.locator("#btn_ygoprodeck");
    await expect(ydk).toBeVisible();
    await expect(ydke).toBeVisible();
    await expect(ygoprodeck).toBeVisible();
    await expect(ydk).toHaveText("Export YDK");
    await expect(ydke).toHaveText("Export YDKE to clipboard");
    await expect(ygoprodeck).toHaveText("Export to YGOPRODECK");
});
