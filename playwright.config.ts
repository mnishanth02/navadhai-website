import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  outputDir: ".prerender/smoke",
  workers: 1,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:4181",
    browserName: "chromium",
    headless: true,
    colorScheme: "dark",
    reducedMotion: "reduce",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: "node scripts/serve-build.mjs",
    url: "http://127.0.0.1:4181",
    reuseExistingServer: false,
  },
});
