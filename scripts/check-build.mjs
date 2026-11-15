import assert from "node:assert/strict";
import { readFile, readdir, writeFile } from "node:fs/promises";
import { gzipSync } from "node:zlib";
import { resolve, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { checkResources } from "./check-resources.mjs";
import { JSDOM } from "jsdom";

const root = fileURLToPath(new URL("../", import.meta.url));
const output = resolve(root, "dist");
const resources = await checkResources(output);
await checkResources(output, { entry: "404.html", requireApp: false });
const site = JSON.parse(await readFile(resolve(root, ".prerender/site.json"), "utf8"));
const html = await readFile(resolve(output, "index.html"), "utf8");
assert(html.includes("Blouse &amp; dress making."), "Homepage must be prerendered");
assert(html.includes(">Be a</span> <span"), "Brand tagline must be readable before hydration");
assert(html.includes(">princess.</span>"), "Missing confirmed brand tagline");
assert(html.includes("Made around your idea."), "Editorial section must be prerendered");
assert(
  html.includes('data-hydrated="false"'),
  "Production HTML must include a usable unhydrated state",
);
assert(html.includes("manjulajayanthi1@gmail.com"), "Missing email alternative");
assert(html.includes("tel:+917845952592"), "Missing phone alternative");
const dom = new JSDOM(html);
const document = dom.window.document;
assert.equal(
  document.querySelector('meta[name="robots"]').content,
  site.production ? "index, follow" : "noindex, nofollow",
);
assert.equal(
  document.querySelector('link[rel="canonical"]')?.getAttribute("href") ?? null,
  site.origin,
);
const data = JSON.parse(document.querySelector('script[type="application/ld+json"]').textContent);
assert(data["@graph"].some((item) => item["@type"] === "Organization" && item.name === "Navodhai"));
assert.equal(data["@graph"].filter((item) => item["@type"] === "Service").length, 3);
assert(html.includes("Start with a conversation."), "Ordering information must be prerendered");
const share = await readFile(resolve(output, "og-image.png"));
assert.equal(share.subarray(1, 4).toString(), "PNG", "Share image must be a real PNG");
assert.equal(share.readUInt32BE(16), 1200);
assert.equal(share.readUInt32BE(20), 630);
assert(
  site.headers["Content-Security-Policy"].includes("'sha256-"),
  "Theme bootstrap must be allowed by a CSP hash",
);
dom.window.close();
assert(html.includes("monogram-gold-export"), "Use the supplied transparent V4 monogram");
assert(
  html.includes("textile-study-cutout"),
  "Opening illustration must use the transparent asset",
);
assert(!html.includes("navodhai-v4-horizontal"), "The boxed header lockup was rejected");
assert(
  html.includes('data-brand-icon="light"') && html.includes('data-brand-icon="dark"'),
  "Provide adaptive single-ink favicons",
);
assert(!html.includes("<!--app-html-->"), "Unprocessed prerender placeholder");
const robots = await readFile(resolve(output, "robots.txt"), "utf8");
assert(robots.includes(site.production ? "Allow: /" : "Disallow: /"));
if (site.production) {
  assert(robots.includes(`Sitemap: ${site.origin}sitemap.xml`));
  assert(
    (await readFile(resolve(output, "sitemap.xml"), "utf8")).includes(`<loc>${site.origin}</loc>`),
  );
}

const assets = await readdir(resolve(output, "assets"));
const files = [
  "index.html",
  ...assets
    .filter((name) => /\.(js|css|woff2|webp|png)$/.test(name))
    .map((name) => `assets/${name}`),
];
const sizes = {};
let total = 0;
let javascript = 0;
for (const file of files) {
  const buffer = await readFile(resolve(output, file));
  const bytes = /\.(js|css|html)$/.test(file) ? gzipSync(buffer).byteLength : buffer.byteLength;
  sizes[file] = { raw: buffer.byteLength, estimatedTransfer: bytes };
  total += bytes;
  if (extname(file) === ".js") javascript += bytes;
}
assert(total <= 450_000, `Initial resource budget exceeded: ${total} bytes`);
assert(javascript <= 120_000, `React/Motion JavaScript budget exceeded: ${javascript} bytes`);
const report = {
  passed: true,
  referencedResources: resources,
  initialTransferEstimate: total,
  javascriptGzip: javascript,
  files: sizes,
};
await writeFile(resolve(root, ".prerender/build-report.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
console.log(
  "Sizes assume server text compression. Public-host LCP, TLS and caching still require deployment checks.",
);
