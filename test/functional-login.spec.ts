import { Page } from "@playwright/test";
import { testWithExtension } from "./fixtures";

function cookie(name: string, env: string) {
    return {
        name,
        value: process.env[env],
        domain: "www.db.yugioh-card.com",
        path: "/yugiohdb",
        expires: -1,
        httpOnly: true,
        secure: true,
        sameSite: "Lax",
    } as const;
}

export const test = testWithExtension.extend({
    context: async ({ context }, use) => {
        await context.addCookies([
            cookie("JSESSIONID", "KONAMI_JSESSIONID"),
            cookie("yugiohdb_cgid", "KONAMI_CGID"),
            cookie("yugiohdb_lt", "KONAMI_LT"),
        ]);
        await use(context);
    },
});

const expect = test.expect;

async function expectLoggedIn(page: Page) {
    await expect(page.locator("body")).toContainText(/Logged in \[\d+\]/);
}

async function expectImport(page: Page) {
    await page.waitForURL("https://www.db.yugioh-card.com/yugiohdb/member_deck.action?ope=2**");
    await expect(page.locator("#btn_ydke")).toHaveText("Import YDKE from clipboard");
    await expect(page.locator("#btn_ydke_save")).toHaveText("Import clipboard and save");
    await expect(page.locator("#btn_ydk")).toHaveText("Import YDK file");
    await expect(page.locator("#btn_ydk_save")).toHaveText("Import YDK and save");
    await expect(page.locator("#monm_1")).toHaveValue(/\w/);
    await page.locator("#btn_regist").click();
    await expect(page.locator(".card_image_monster_0_1").first()).toBeVisible({ timeout: 20000 });
}

test("Streamlined import functional test 4", async ({ page }) => {
    await page.goto(
        "https://www.db.yugioh-card.com/yugiohdb/member_deck.action#storm-access=QdqrBFPsSADcsOQB4PFpBeDxaQXg8WkFkum2A5LptgOS6bYDcYFxAXGBcQFje9QEY3vUBGN71AQHJHQCsCPeALAj3gCwI94AU%2FeKA1P3igMqCxoDKgsaA%2F2JnAWyMswFsjLMBWg0lgVoNJYFaDSWBVXO4wNVzuMDVc7jA%2F28hQWQBiMA4XjJBD6kcQH73BQBWXtjBN8WLwM4ozcFWjNpBA%3D%3D%21X83PArGdywSxncsEzVuMBQC5CARh0cEBiVRyAcREIQWNJ5gDV2FkA%2Bsr%2FwLrK%2F8CoqNEBL8OSQI%3D%21kFaQAcQ7RwWyMswFz%2B%2FQBA%3D%3D%21"
    );
    await expectLoggedIn(page);
    await expectImport(page);
});

test("Streamlined import functional test 5", async ({ ygoprodeckPage }) => {
    test.setTimeout(60000);
    await ygoprodeckPage.getByRole("button", { name: "More..." }).click();
    const tabOpen = ygoprodeckPage.waitForEvent("popup");
    await ygoprodeckPage.getByRole("link", { name: " Export Master Duel/Neuron" }).click();
    const page = await tabOpen;
    await expectImport(page);
});

test("Streamlined import functional test 6", async ({ page }) => {
    await page.goto("https://www.db.yugioh-card.com/yugiohdb/member_deck.action#storm-access=");
    await expectLoggedIn(page);
    await expect(page.locator("dialog")).toContainText("Invalid YDKE URL: missing deck component", { timeout: 10000 });
});

test.afterAll(async ({ page: deckListPage }) => {
    await deckListPage.goto("https://www.db.yugioh-card.com/yugiohdb/?request_locale=en");
    await deckListPage.locator("#main_btn").getByRole("link", { name: "My Deck" }).click();
    while (true) {
        const table = await deckListPage.locator(".t_body").textContent();
        if (!table?.trim()) {
            await deckListPage.close();
            break;
        }
        const tabOpen = deckListPage.waitForEvent("popup");
        await deckListPage.locator(".date").first().click();
        const newPage = await tabOpen;
        deckListPage.close();
        newPage.once("dialog", async (dialog) => {
            console.log(`Dialog message: ${dialog.message()}`, newPage.url());
            await dialog.accept();
        });
        await newPage.locator("a").filter({ hasText: "Delete" }).click();
        deckListPage = newPage;
    }
});
