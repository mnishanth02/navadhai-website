// Regenerate committed icons from approved artwork; hosting builds need no browser.
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { chromium } from "@playwright/test";

const root = fileURLToPath(new URL("../", import.meta.url));
const output = resolve(root, "public");
const artwork = Object.fromEntries(
  await Promise.all(
    ["charcoal", "white", "gold"].map(async (name) => [
      name,
      `data:image/png;base64,${(await readFile(resolve(root, `src/assets/brand/monogram-${name}-export.png`))).toString("base64")}`,
    ]),
  ),
);
const browser = await chromium.launch();
try {
  await mkdir(output, { recursive: true });
  const page = await browser.newPage({ deviceScaleFactor: 1 });
  const render = async (size, colour, background, proportion) => {
    await page.setViewportSize({ width: size, height: size });
    await page.setContent(`<!doctype html><html><head><style>
      *{box-sizing:border-box}body{margin:0;width:${size}px;height:${size}px;display:grid;place-items:center;background:${background}}
      svg{width:${size * proportion}px;height:${(size * proportion * 113) / 135}px}
      </style></head><body><svg xmlns="http://www.w3.org/2000/svg" viewBox="33 47 135 113"><image href="${artwork[colour]}" width="200" height="200"/></svg></body></html>`);
    await page.evaluate(async (source) => {
      const image = new Image();
      image.src = source;
      await image.decode();
    }, artwork[colour]);
    return page.screenshot({ type: "png" });
  };
  for (const [file, size, colour, background, proportion] of [
    ["favicon.png", 96, "white", "#47162f", 0.84],
    ["favicon-light.png", 96, "charcoal", "#f9f0e3", 0.84],
    ["apple-touch-icon.png", 180, "gold", "#f9f0e3", 0.72],
    ["icon-192.png", 192, "gold", "#f9f0e3", 0.72],
    ["icon-512.png", 512, "gold", "#f9f0e3", 0.72],
    ["icon-maskable-512.png", 512, "gold", "#f9f0e3", 0.6],
  ]) {
    await writeFile(resolve(output, file), await render(size, colour, background, proportion));
  }
  const sizes = [16, 32, 48];
  const entries = [];
  const images = [];
  let offset = 6 + sizes.length * 16;
  for (const size of sizes) {
    const png = await render(size, "white", "#47162f", 0.84);
    const entry = Buffer.alloc(16);
    entry[0] = size;
    entry[1] = size;
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(png.length, 8);
    entry.writeUInt32LE(offset, 12);
    entries.push(entry);
    images.push(png);
    offset += png.length;
  }
  const header = Buffer.alloc(6);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(sizes.length, 4);
  await writeFile(resolve(output, "favicon.ico"), Buffer.concat([header, ...entries, ...images]));
  console.log("Generated browser, Apple and Android icons from the original monogram.");
} finally {
  await browser.close();
}
