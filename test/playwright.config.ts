import { defineConfig, devices } from "@playwright/test";

// https://playwright.dev/docs/test-configuration.
export default defineConfig({
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  // https://playwright.dev/docs/test-reporters
  reporter: "html",
  // https://playwright.dev/docs/api/class-testoptions
  use: {
    // https://playwright.dev/docs/trace-viewer
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
