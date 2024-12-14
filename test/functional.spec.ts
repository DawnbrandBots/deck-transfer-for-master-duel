import { testWithExtension as test } from "./fixtures";

const expect = test.expect;

test("Export functional test 1: YDK from recent deck recipe", async ({ deckRecipePage }, testInfo) => {
    const downloadPromise = deckRecipePage.waitForEvent("download");
    await deckRecipePage.locator("#btn_ydk").click();
    const download = await downloadPromise;
    const filename = download.suggestedFilename();
    expect(filename.endsWith(".ydk")).toBe(true);
    // TODO: read the response https://nodejs.org/api/webstreams.html#streamconsumersjsonstream to parse the deck
    const path = await download.path();
    await testInfo.attach(filename, { path });
});

test("Export functional test 2: YDKE from recent deck recipe", async ({ context, deckRecipePage }, testInfo) => {
    await deckRecipePage.locator("#btn_ydke").click();
    await expect(deckRecipePage.locator("dialog")).toContainText("Deck copied to clipboard!");
    await deckRecipePage.getByRole('button', { name: 'OK', exact: true }).click();
    await expect(deckRecipePage.locator("dialog")).toBeHidden();
    // Workaround until Playwright introduces first-party clipboard support
    await context.grantPermissions(["clipboard-read"]);
    const ydke = await deckRecipePage.evaluate(() => navigator.clipboard.readText());
    expect(ydke.startsWith("ydke://")).toBe(true);
    // TODO: parse URL
    await testInfo.attach("Exported ydke:// URL", { body: ydke });
});

test("Export functional test 3: YGOPRODECK from recent deck recipe", async ({ deckRecipePage }) => {
    const tabOpen = deckRecipePage.waitForEvent('popup');
    await deckRecipePage.locator('#btn_ygoprodeck').click();
    const newPage = await tabOpen;
    const title = await deckRecipePage.locator("#broad_title").innerText();
    await expect(newPage.getByLabel("Deck Name")).toHaveValue(title.trim(), { timeout: 10000 });
    // This should be just [456], but due to https://github.com/DawnbrandBots/deck-transfer-for-master-duel/issues/18
    // we often encounter decks for which the YGOPRODECK API is missing the Konami IDs
    await expect(newPage.locator("small:below(:text('Main Deck'))").first()).toHaveText(/[123456]\d Cards/);
    const priceBadge = await newPage.getByTitle("TCGPlayer Price").first().innerText();
    expect(parseFloat(priceBadge.split("$")[1])).toBeGreaterThan(0);
});

test("Streamlined import functional test 3", async ({ page }) => {
  await page.goto("https://ygoprodeck.com/");
  await page.getByRole("link", { name: " " }).click();
  await page.getByRole("link", { name: " Random Deck" }).click();
  await page.getByRole("button", { name: "More..." }).click();
  const tabOpen = page.waitForEvent("popup");
  await page.getByRole("link", { name: " Export Master Duel/Neuron" }).click();
  const newPage = await tabOpen;
  await expect(newPage.url().startsWith("https://www.db.yugioh-card.com/yugiohdb/member_deck.action#storm-access=")).toBe(true);
  await expect(newPage.locator("dialog")).toContainText("You are not logged into Konami's official database. Please log in first and then try exporting again.", { timeout: 10000 });
});
