import { resolve } from "path";
import { Page, test as base, chromium } from "@playwright/test";

export const testNoExtension = base.extend<{ deckRecipePage: Page }>({
    deckRecipePage: async ({ page }, use, testInfo) => {
        await page.goto("https://www.db.yugioh-card.com/yugiohdb/deck_search.action?request_locale=en");
        const tabOpen = page.waitForEvent("popup");
        await page.locator("a.inside").first().click();
        const newPage = await tabOpen;
        console.log(testInfo.title, testInfo.retry, newPage.url());
        await use(newPage);
    },
});

export const testWithExtension = testNoExtension.extend<{ ygoprodeckPage: Page }>({
    context: async ({}, use) => {
        const pathToExtension = resolve(__dirname, "..", "src");
        const context = await chromium.launchPersistentContext("", {
            headless: false,
            args: [
                "--headless=new", // not officially supported!
                `--disable-extensions-except=${pathToExtension}`,
                `--load-extension=${pathToExtension}`,
                // https://github.com/ungoogled-software/ungoogled-chromium/issues/662#issuecomment-3013111113
                "--disable-features=ExtensionManifestV2Unsupported,ExtensionManifestV2Disabled", // Still works in Chrome 140
            ],
        });
        await use(context);
        await context.close();
    },
    ygoprodeckPage: async ({ page }, use, testInfo) => {
        await page.goto("https://ygoprodeck.com/");
        await page.locator("#navbarDropdownMenuLink").click();
        await page.getByRole("link", { name: "Random Deck" }).click();
        await page.waitForURL("https://ygoprodeck.com/deck/**");
        console.log(testInfo.title, testInfo.retry, page.url());
        await use(page);
    },
});
