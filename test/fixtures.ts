import { resolve } from "path";
import { Page, test as base, chromium, type BrowserContext } from "@playwright/test";

export const testNoExtension = base.extend<{ deckRecipePage: Page }>({
    deckRecipePage: async ({ page }, use) => {
        await page.goto("https://www.db.yugioh-card.com/yugiohdb/deck_search.action?request_locale=en");
        const tabOpen = page.waitForEvent("popup");
        await page.locator("a.inside").first().click();
        const newPage = await tabOpen;
        await use(newPage);
    },
});

export const testWithExtension = testNoExtension.extend({
  context: async ({}, use) => {
    const pathToExtension = resolve(__dirname, "..", "src");
    const context = await chromium.launchPersistentContext("", {
      headless: false,
      args: [
        "--headless=new", // not officially supported!
        `--disable-extensions-except=${pathToExtension}`,
        `--load-extension=${pathToExtension}`,
      ],
    });
    await use(context);
    await context.close();
  },
});
