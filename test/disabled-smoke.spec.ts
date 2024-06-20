import { testNoExtension as test } from "./fixtures";

const expect = test.expect;

test("Smoke test 1: YGOPRODECK extension page baseline", async ({ page }) => {
    await page.goto("https://ygoprodeck.com/decks/transfer-tool/");
    const body = page.locator("body");
    await expect(body).not.toContainText("The extension is detected.");
    await expect(body).toContainText("The extension is not detected.");
    await expect(body).toContainText("Extension Not Detected");
});

test("Smoke test: EN Konami deck recipe page baseline (like 2, opposite 6)", async ({ deckRecipePage }) => {
    const body = deckRecipePage.locator("body");
    await expect(body).not.toContainText("Export YDK");
    await expect(body).not.toContainText("Export to YGOPRODECK");
});
