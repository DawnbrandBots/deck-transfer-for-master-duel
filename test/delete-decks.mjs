import { chromium } from "playwright";

const browser = await chromium.launch();
const context = await browser.newContext({ storageState: "auth.json" });
let deckListPage = await context.newPage();
await deckListPage.goto("https://www.db.yugioh-card.com/yugiohdb/?request_locale=en");
await deckListPage.locator("#main_btn").getByRole("link", { name: "My Deck" }).click();
while (true) {
    const table = await deckListPage.locator(".t_body").textContent();
    if (!table.trim()) {
        await deckListPage.close();
        break;
    }
    const tabOpen = deckListPage.waitForEvent("popup");
    await deckListPage.locator(".date").first().click();
    const newPage = await tabOpen;
    deckListPage.close();
    newPage.once("dialog", async dialog => {
        console.log(`Dialog message: ${dialog.message()}`);
        await dialog.accept();
    });
    await newPage.locator("a").filter({ hasText: "Delete" }).click();
    deckListPage = newPage;
}
await context.close();
await browser.close();
