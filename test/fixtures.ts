import { resolve } from "path";
import { test as base, chromium, type BrowserContext } from "@playwright/test";

export const test = base.extend<{ context: BrowserContext }>({
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

export const expect = test.expect;
