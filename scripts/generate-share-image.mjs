// One-time/regeneration tool, not part of the hosting build. The PNG is versioned.
import { readFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { chromium } from "@playwright/test";

const root = fileURLToPath(new URL("../", import.meta.url));
const data = async (file, mime) =>
  `data:${mime};base64,${(await readFile(resolve(root, file))).toString("base64")}`;
const [didot, inter, mark, art] = await Promise.all([
  data("src/assets/fonts/gfs-didot-latin.woff2", "font/woff2"),
  data("src/assets/fonts/inter-latin.woff2", "font/woff2"),
  data("src/assets/brand/monogram-gold-export.png", "image/png"),
  data("src/assets/textile-study-cutout.webp", "image/webp"),
]);
const browser = await chromium.launch();
try {
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1,
  });
  await page.setContent(`<!doctype html><html lang="en"><head><meta charset="utf-8"><style>
    @font-face{font-family:Didot;src:url("${didot}") format("woff2");font-weight:400}
    @font-face{font-family:Inter;src:url("${inter}") format("woff2");font-weight:400 600}
    *{box-sizing:border-box}body{margin:0;width:1200px;height:630px;background:#261a24;color:#f9f0e3;font-family:Inter,Arial,sans-serif}
    header{position:absolute;top:48px;left:64px;display:flex;align-items:center;gap:16px}header svg{width:64px;height:64px}header span{font:400 40px/1.1 Didot,Georgia,serif}
    h1{position:absolute;left:64px;top:172px;margin:0;font:400 88px/1.06 Didot,Georgia,serif;letter-spacing:-.015em}
    .service{position:absolute;left:64px;top:402px;margin:0;font-size:28px;line-height:1.5}
    .place{position:absolute;left:64px;bottom:54px;margin:0;color:#dbc4c4;font-size:22px;line-height:1.5}
    img{position:absolute;right:24px;top:135px;width:590px;height:auto}
  </style></head><body><header><svg viewBox="33 47 135 113" role="img" aria-label="Navodhai monogram"><image href="${mark}" width="200" height="200"/></svg><span>Navodhai</span></header><h1>Be a<br>princess.</h1><p class="service">Blouse &amp; dress making.</p><p class="place">Coimbatore, Tamil Nadu</p><img src="${art}" alt="Conceptual textile study"></body></html>`);
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].map((image) => image.decode()));
  });
  await mkdir(resolve(root, "public"), { recursive: true });
  await page.screenshot({ path: resolve(root, "public/og-image.png"), type: "png" });
  console.log("Generated public/og-image.png (1200 × 630) from the existing brand assets.");
} finally {
  await browser.close();
}
