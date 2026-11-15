import { expect, test as base } from "@playwright/test";
import { enquiryMessage, topics } from "../src/content";

const test = base.extend<{ resourceErrors: string[] }>({
  resourceErrors: [
    async ({ page }, use) => {
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      page.on("console", (message) => {
        if (message.type() === "error") errors.push(message.text());
      });
      page.on("requestfailed", (request) => {
        errors.push(`${request.url()}: ${request.failure()?.errorText}`);
      });
      page.on("response", (response) => {
        const type = response.request().resourceType();
        if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`);
        const mime = response.headers()["content-type"] ?? "";
        const expected: Record<string, RegExp> = {
          script: /^(text|application)\/(javascript|ecmascript)(;|$)/i,
          stylesheet: /^text\/css(;|$)/i,
          image: /^image\//i,
          font: /^(font\/|application\/(font|octet-stream))/i,
        };
        if (expected[type] && !expected[type].test(mime)) {
          errors.push(`Unexpected ${type} MIME ${mime}: ${response.url()}`);
        }
      });
      await use(errors);
      expect(errors, "Production resources and hydration must be error-free").toEqual([]);
    },
    { auto: true },
  ],
});

test("static deployment serves security/cache headers, the share image and a real 404", async ({
  request,
}) => {
  const home = await request.get("/");
  expect(home.status()).toBe(200);
  expect(home.headers()["content-security-policy"]).toContain("script-src 'self' 'sha256-");
  expect(home.headers()["content-security-policy"]).toContain("frame-ancestors 'none'");
  expect(home.headers()["x-content-type-options"]).toBe("nosniff");
  expect(home.headers()["cache-control"]).toContain("no-transform");
  const html = await home.text();
  expect(html).toContain('href="https://www.navodhai.in/"');
  expect(html).toContain("Enquire online. Visit by arrangement.");
  expect(html).not.toContain("static.cloudflareinsights.com/beacon");
  const stylesheet = html.match(/href="([^"]+\.css)"/)![1];
  const asset = await request.get(stylesheet);
  expect(asset.status()).toBe(200);
  expect(asset.headers()["cache-control"]).toContain("immutable");
  expect(asset.headers()["cache-control"].match(/max-age=/g)).toHaveLength(1);
  const share = await request.get("/og-image.png");
  expect(share.status()).toBe(200);
  expect(share.headers()["content-type"]).toBe("image/png");
  for (const path of [
    "/missing-page",
    "/assets/missing.js",
    "/src/content.ts",
    "/.prerender/entry-server.js",
    "/_headers",
    "/_redirects",
    "/wrangler.jsonc",
  ]) {
    const missing = await request.get(path);
    expect(missing.status()).toBe(404);
    expect(await missing.text()).toContain("That page isn’t here.");
  }
  const redirect = await request.get("/index.html", { maxRedirects: 0 });
  expect(redirect.status()).toBe(308);
  expect(redirect.headers()["location"]).toBe("/");
});

test("apex redirect preserves the requested path and query", async ({ request }) => {
  test.skip(
    Boolean(process.env.SMOKE_BASE_URL) && !process.env.SMOKE_APEX_URL,
    "Provide the apex URL when validating remote domain routing.",
  );
  const origin = process.env.SMOKE_APEX_URL ?? "http://127.0.0.1:4182";
  for (const path of ["/", "/example/path?source=check"]) {
    const response = await request.get(`${origin}${path}`, { maxRedirects: 0 });
    expect(response.status()).toBe(308);
    expect(response.headers()["location"]).toBe(`https://www.navodhai.in${path}`);
  }
});

test("browser and mobile icons load with the correct types and follow the appearance choice", async ({
  page,
  request,
}) => {
  const fallback = await request.get("/favicon.ico");
  expect(fallback.status()).toBe(200);
  expect(fallback.headers()["content-type"]).toMatch(/^image\/(vnd\.microsoft\.icon|x-icon)$/);
  const manifestResponse = await request.get("/site.webmanifest");
  expect(manifestResponse.status()).toBe(200);
  expect(manifestResponse.headers()["content-type"]).toBe("application/manifest+json");
  const manifest = await manifestResponse.json();
  for (const icon of manifest.icons) {
    const response = await request.get(icon.src);
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toBe("image/png");
    const bytes = await response.body();
    expect(`${bytes.readUInt32BE(16)}x${bytes.readUInt32BE(20)}`).toBe(icon.sizes);
  }
  await page.goto("/");
  await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveAttribute(
    "href",
    "/apple-touch-icon.png",
  );
  const apple = await request.get("/apple-touch-icon.png");
  expect(apple.status()).toBe(200);
  const dark = page.locator('link[data-brand-icon="dark"]');
  const light = page.locator('link[data-brand-icon="light"]');
  await expect(dark).toHaveAttribute("media", "all");
  await expect(dark).toHaveAttribute("href", "/favicon.png");
  await expect(light).toHaveAttribute("media", "not all");
  await page.getByRole("button", { name: "Switch to light mode" }).click();
  await expect(light).toHaveAttribute("media", "all");
  await expect(light).toHaveAttribute("href", "/favicon-light.png");
  await expect(dark).toHaveAttribute("media", "not all");
  for (const path of ["/favicon.png", "/favicon-light.png"]) {
    const response = await request.get(path);
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toBe("image/png");
  }
});

test("production assets load, React hydrates and contact choices remain independent", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("[data-navodhai-app]")).toHaveAttribute("data-hydrated", "true");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Be a princess.");
  await expect(page.locator(".opening-description")).toHaveText("Blouse & dress making.");
  await page.evaluate(() => document.fonts.ready);
  expect(
    await page.evaluate(
      () => document.fonts.check('16px "GFS Didot"') && document.fonts.check('16px "Inter"'),
    ),
  ).toBe(true);
  const image = page.locator(".textile-composition > img");
  await expect(image).toBeVisible();
  expect(
    await image.evaluate(
      (element) =>
        element instanceof HTMLImageElement && element.complete && element.naturalWidth > 0,
    ),
  ).toBe(true);
  await expect(page.locator(".opening-layout")).toHaveCSS("display", "grid");

  const footer = page.locator(".contact-whatsapp");
  const generalEnquiry = await footer.getAttribute("href");
  const dress = page.getByRole("button", { name: "Dress", exact: true });
  await dress.focus();
  await page.keyboard.press("Enter");
  await expect(dress).toHaveAttribute("aria-pressed", "true");
  const heroHref = await page.getByTestId("hero-whatsapp").getAttribute("href");
  expect(new URL(heroHref!).searchParams.get("text")).toBe(enquiryMessage(topics[1]));
  await page.keyboard.press("Tab");
  const customise = page.getByRole("button", { name: "Customise", exact: true });
  await expect(customise).toBeFocused();
  await page.keyboard.press("Space");
  await expect(customise).toHaveAttribute("aria-pressed", "true");
  await expect(footer).toHaveAttribute("href", generalEnquiry!);

  await page.getByRole("button", { name: "Switch to light mode" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.getByRole("button", { name: "Switch to dark mode" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await footer.scrollIntoViewIfNeeded();
  await expect(page.getByRole("link", { name: "Back to top", exact: true })).toBeVisible();
});

test("the tagline stays readable during its finite entrance and does not replay on interaction", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.addInitScript(() => {
    document.addEventListener("animationstart", (event) => {
      const element = event.target;
      if (!(element instanceof HTMLElement) || !element.classList.contains("opening-title-line"))
        return;
      document.documentElement.dataset.taglineStarts = String(
        Number(document.documentElement.dataset.taglineStarts ?? 0) + 1,
      );
      for (const animation of element.getAnimations()) animation.pause();
    });
  });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-tagline-starts", "2");
  const samples = await page.evaluate(() => {
    const lines = [...document.querySelectorAll<HTMLElement>(".opening-title-line")];
    return [0, 0.5, 1].map((progress) =>
      lines.map((line) => {
        const animation = line.getAnimations()[0];
        const timing = animation.effect!.getTiming();
        animation.currentTime = (timing.delay ?? 0) + Number(timing.duration) * progress;
        const style = getComputedStyle(line);
        return {
          opacity: Number(style.opacity),
          shift: style.transform === "none" ? 0 : new DOMMatrixReadOnly(style.transform).m42,
          duration: Number(timing.duration),
          iterations: timing.iterations,
          layoutTop: line.offsetTop,
        };
      }),
    );
  });
  for (const sample of samples.flat()) {
    expect(sample.opacity).toBeGreaterThanOrEqual(0.9);
    expect(sample.shift).toBeGreaterThanOrEqual(0);
    expect(sample.shift).toBeLessThanOrEqual(4);
    expect(sample.duration).toBeLessThanOrEqual(800);
    expect(sample.iterations).toBe(1);
  }
  expect(samples[0].map((line) => line.layoutTop)).toEqual(
    samples[2].map((line) => line.layoutTop),
  );
  for (const line of samples[2]) {
    expect(line.opacity).toBe(1);
    expect(line.shift).toBe(0);
  }
  await page.evaluate(() => {
    document
      .querySelectorAll(".opening-title-line")
      .forEach((line) => line.getAnimations().forEach((animation) => animation.finish()));
  });
  await page.getByRole("button", { name: "Dress", exact: true }).click();
  await page.getByRole("button", { name: "Switch to light mode" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-tagline-starts", "2");
});

test("reduced motion keeps the complete tagline static", async ({ page }) => {
  await page.goto("/");
  for (const line of await page.locator(".opening-title-line").all()) {
    await expect(line).toHaveCSS("animation-name", "none");
    await expect(line).toHaveCSS("transform", "none");
    await expect(line).toHaveCSS("opacity", "1");
  }
  await expect(page.getByRole("heading", { level: 1 })).toHaveAccessibleName("Be a princess.");
  await expect(page.locator(".hero-light-field")).toHaveCSS("display", "none");
});

for (const theme of ["dark", "light"]) {
  test(`one light continuously tracks the header and hero in ${theme} mode without moving content`, async ({
    page,
  }, testInfo) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.addInitScript((theme) => localStorage.setItem("navodhai-theme", theme), theme);
    await page.goto("/");
    await expect(page.locator("[data-navodhai-app]")).toHaveAttribute("data-hydrated", "true");
    await page.evaluate(() => document.fonts.ready);
    const hero = page.locator(".opening");
    const light = page.locator(".hero-light");
    const header = page.locator(".brand-header");
    const headerBefore = await header.boundingBox();
    const before = await page.locator(".opening-layout").boundingBox();
    const box = (await hero.boundingBox())!;
    const surface = (await page.locator(".boutique-page").boundingBox())!;
    const headerBox = headerBefore!;
    const position = () =>
      light.evaluate((element) => {
        const matrix = new DOMMatrixReadOnly(getComputedStyle(element).transform);
        return { x: matrix.m41, y: matrix.m42, opacity: Number(getComputedStyle(element).opacity) };
      });
    await expect(light).toHaveCSS("opacity", "0");
    await expect(light).toHaveCount(1);
    await expect(page.locator(".hero-light-field")).toHaveAttribute("aria-hidden", "true");
    await expect(page.locator(".hero-light-field")).toHaveCSS("pointer-events", "none");
    for (const [clientX, clientY] of [
      [box.x + box.width * 0.16, box.y + box.height * 0.65],
      [headerBox.x + headerBox.width * 0.7, box.y + 2],
      [headerBox.x + headerBox.width * 0.7, box.y - 2],
      [headerBox.x + headerBox.width / 2, headerBox.y + headerBox.height / 2],
      [headerBox.x + headerBox.width * 0.7, box.y - 2],
      [headerBox.x + headerBox.width * 0.7, box.y + 2],
      [box.x + box.width * 0.84, box.y + box.height * 0.25],
    ]) {
      const wasVisible = (await position()).opacity > 0.95;
      await page.mouse.move(clientX, clientY);
      if (wasVisible) expect((await position()).opacity).toBeGreaterThan(0.95);
      const x = clientX - surface.x;
      const y = clientY - surface.y;
      await expect.poll(async () => Math.abs((await position()).x - x)).toBeLessThan(3);
      await expect.poll(async () => Math.abs((await position()).y - y)).toBeLessThan(3);
      await expect.poll(async () => (await position()).opacity).toBeGreaterThan(0.95);
    }
    expect(await header.boundingBox()).toEqual(headerBefore);
    expect(await page.locator(".opening-layout").boundingBox()).toEqual(before);
    const field = (await page.locator(".hero-light-field").boundingBox())!;
    expect(field.y).toBe(surface.y);
    expect(Math.abs(field.y + field.height - (box.y + box.height))).toBeLessThan(1);
    await page.mouse.move(headerBox.x + headerBox.width / 2, headerBox.y + headerBox.height / 2);
    await expect
      .poll(async () =>
        Math.abs((await position()).y - (headerBox.y + headerBox.height / 2 - surface.y)),
      )
      .toBeLessThan(3);
    await page.screenshot({
      path: testInfo.outputPath("pointer-light.png"),
      clip: {
        x: surface.x,
        y: surface.y,
        width: surface.width,
        height: box.y + box.height - surface.y,
      },
    });
    await page.getByRole("button", { name: "Dress", exact: true }).click();
    await expect(page.getByRole("button", { name: "Dress", exact: true })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await page.mouse.move(box.x + box.width / 2, box.y + box.height + 20);
    await expect(light).toHaveCSS("opacity", "0");
    const idleUpdates = await light.evaluate(async (element) => {
      let updates = 0;
      const observer = new MutationObserver((entries) => {
        updates += entries.length;
      });
      observer.observe(element, { attributes: true, attributeFilter: ["style"] });
      await new Promise<void>((done) =>
        requestAnimationFrame(() =>
          requestAnimationFrame(() => requestAnimationFrame(() => done())),
        ),
      );
      observer.disconnect();
      return updates;
    });
    expect(idleUpdates).toBe(0);
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await expect.poll(async () => (await position()).opacity).toBeGreaterThan(0.95);
    await page.mouse.wheel(0, 220);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
    await expect(light).toHaveCSS("opacity", "0");
  });
}

test("hero light stays inactive for keyboard use and responds to live accessibility preferences", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await expect(page.locator("[data-navodhai-app]")).toHaveAttribute("data-hydrated", "true");
  const light = page.locator(".hero-light");
  await page.getByRole("button", { name: "Dress", exact: true }).focus();
  await page.keyboard.press("Enter");
  await expect(light).toHaveCSS("opacity", "0");
  const box = (await page.locator(".opening").boundingBox())!;
  await page.mouse.move(box.x + 120, box.y + 120);
  await expect
    .poll(() => light.evaluate((element) => Number(getComputedStyle(element).opacity)))
    .toBeGreaterThan(0.95);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".hero-light-field")).toHaveCSS("display", "none");
  await expect(light).toHaveCSS("opacity", "0");
  await page.mouse.move(box.x + 200, box.y + 160);
  await expect(light).toHaveCSS("opacity", "0");
  await page.emulateMedia({ reducedMotion: "no-preference", forcedColors: "active" });
  await expect(page.locator(".hero-light-field")).toHaveCSS("display", "none");
  await page.mouse.move(box.x + 240, box.y + 180);
  await expect(light).toHaveCSS("opacity", "0");
});

test.describe("touch input", () => {
  test.use({
    hasTouch: true,
    isMobile: true,
    viewport: { width: 390, height: 844 },
    reducedMotion: "no-preference",
  });
  test("keeps a plain hero background and working garment controls", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("[data-navodhai-app]")).toHaveAttribute("data-hydrated", "true");
    await expect(page.locator(".hero-light-field")).toHaveCSS("display", "none");
    await page.getByRole("button", { name: "Customise", exact: true }).tap();
    await expect(page.getByRole("button", { name: "Customise", exact: true })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await expect(page.locator(".hero-light")).toHaveCSS("opacity", "0");
  });
});

test.describe("without application JavaScript", () => {
  test.use({ javaScriptEnabled: false });
  test("prerenders the approved hero with working native contact routes", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("[data-navodhai-app]")).toHaveAttribute("data-hydrated", "false");
    await expect(page.locator(".hero-light")).toHaveCSS("opacity", "0");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Be a princess.");
    await expect(page.locator(".opening-description")).toHaveText("Blouse & dress making.");
    await expect(page.getByRole("button", { name: "Blouse", exact: true })).toBeDisabled();
    await expect(page.getByTestId("hero-whatsapp")).toHaveAttribute(
      "href",
      /https:\/\/wa\.me\/917845952592\?text=/,
    );
    await expect(page.locator(".contact-whatsapp")).toHaveAttribute(
      "href",
      /https:\/\/wa\.me\/917845952592\?text=/,
    );
  });
});

for (const width of [320, 390, 768, 980, 1280]) {
  for (const scale of [100, 200]) {
    test(`reflows at ${width}px with ${scale}% root text`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      await expect(page.locator("[data-navodhai-app]")).toHaveAttribute("data-hydrated", "true");
      await page.evaluate(async (scale) => {
        document.documentElement.style.fontSize = `${scale}%`;
        await document.fonts.ready;
      }, scale);
      const metrics = await page.evaluate(() => {
        const name = document.querySelector<HTMLElement>(".brand-header-name")!;
        const header = document.querySelector<HTMLElement>(".brand-header")!;
        const lineCount = (node: Node) => {
          const range = document.createRange();
          range.selectNodeContents(node);
          return range.getClientRects().length;
        };
        const choices = [...document.querySelectorAll<HTMLElement>(".piece-choice")];
        const taglineLines = [...document.querySelectorAll<HTMLElement>(".opening-title-line")];
        return {
          overflow: document.documentElement.scrollWidth - window.innerWidth,
          nameLines: lineCount(name),
          nameFont: Number.parseFloat(getComputedStyle(name).fontSize),
          nameCenter:
            (name.parentElement!.getBoundingClientRect().left +
              name.parentElement!.getBoundingClientRect().right) /
            2,
          headerCenter:
            (header.getBoundingClientRect().left + header.getBoundingClientRect().right) / 2,
          choices: choices.map((choice) => ({
            lines: lineCount(choice.firstChild!),
            height: choice.getBoundingClientRect().height,
            top: choice.getBoundingClientRect().top,
          })),
          taglineLines: taglineLines.map((line) => lineCount(line)),
        };
      });
      expect(metrics.overflow).toBeLessThanOrEqual(1);
      expect(metrics.nameLines).toBe(1);
      expect(metrics.nameFont).toBeGreaterThanOrEqual(scale === 200 ? 40 : 20);
      expect(Math.abs(metrics.nameCenter - metrics.headerCenter)).toBeLessThan(1);
      expect(metrics.taglineLines).toEqual([1, 1]);
      for (const choice of metrics.choices) {
        expect(choice.lines).toBe(1);
        expect(choice.height).toBeGreaterThanOrEqual(48);
      }
      if (width <= 390) {
        const rows = new Set(metrics.choices.map((choice) => Math.round(choice.top))).size;
        if (scale === 100) expect(rows).toBe(1);
        else expect(rows).toBeGreaterThan(1);
      }
      const theme = page.getByRole("button", { name: /Switch to (light|dark) mode/ });
      const box = await theme.boundingBox();
      expect(box!.width).toBeGreaterThanOrEqual(44);
      expect(box!.height).toBeGreaterThanOrEqual(44);
      await theme.focus();
      await expect(theme).toBeFocused();
      await expect(theme).toHaveCSS("outline-style", "solid");
      await page.screenshot({ path: testInfo.outputPath("reflow.png"), fullPage: true });
    });
  }
}
