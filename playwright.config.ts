import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  outputDir: ".prerender/smoke",
  workers: 1,
  reporter: "list",
  use: {
    baseURL: process.env.SMOKE_BASE_URL ?? "http://127.0.0.1:4181",
    browserName: "chromium",
    headless: true,
    colorScheme: "dark",
    reducedMotion: "reduce",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  webServer: process.env.SMOKE_BASE_URL
    ? undefined
    : [
        {
          command:
            "pnpm exec wrangler dev --local --ip 127.0.0.1 --port 4181 --inspector-port 0 --show-interactive-dev-session=false",
          url: "http://127.0.0.1:4181",
          reuseExistingServer: false,
        },
        {
          command:
            "pnpm exec wrangler dev --local --config wrangler.apex.jsonc --ip 127.0.0.1 --port 4182 --inspector-port 0 --show-interactive-dev-session=false",
          port: 4182,
          reuseExistingServer: false,
        },
      ],
});
