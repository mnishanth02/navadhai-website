import assert from "node:assert/strict";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, resolve } from "node:path";
import { test } from "node:test";
import { checkResources } from "./check-resources.mjs";

async function fixture(context, { html = "", css = "" } = {}) {
  const root = await mkdtemp(resolve(tmpdir(), "navodhai-resources-"));
  context.after(async () => {
    assert.equal(dirname(root), resolve(tmpdir()));
    assert(root.startsWith(resolve(tmpdir(), "navodhai-resources-")));
    await rm(root, { recursive: true, force: true });
  });
  await mkdir(resolve(root, "assets"));
  await writeFile(
    resolve(root, "index.html"),
    `<script type="module" src="/assets/app.js"></script><link rel="stylesheet" href="/assets/app.css">${html}`,
  );
  await writeFile(resolve(root, "assets/app.js"), "export {};");
  await writeFile(resolve(root, "assets/app.css"), css);
  return root;
}

await test("resolves nested CSS, encoded URLs and srcset while ignoring remote/data/fragment references", async (context) => {
  const root = await fixture(context, {
    html: '<img src="/assets/photo%20one.webp?v=1#view" srcset="data:image/png;base64,AAAA 1x, /assets/photo%20one.webp 2x"><svg><use href="#symbol"></use></svg><img src="https://example.invalid/remote.webp">',
    css: '@import "nested.css"; @import url("nested.css"); /* url(missing.webp) */ .a { background: url("data:image/svg+xml,<svg/>") }',
  });
  await writeFile(resolve(root, "assets/photo one.webp"), "image");
  await writeFile(
    resolve(root, "assets/nested.css"),
    '@import "app.css"; @font-face { src: url("font.woff2?#font") }',
  );
  await writeFile(resolve(root, "assets/font.woff2"), "font");
  assert.deepEqual(await checkResources(root), [
    "assets/app.css",
    "assets/app.js",
    "assets/font.woff2",
    "assets/nested.css",
    "assets/photo one.webp",
  ]);
});

for (const file of ["app.js", "app.css"]) {
  await test(`rejects missing ${file}`, async (context) => {
    const root = await fixture(context);
    await rm(resolve(root, "assets", file));
    await assert.rejects(checkResources(root), /Missing resource/);
  });
}

for (const { name, ...options } of [
  { name: "hero image", html: '<img src="/assets/missing.webp">' },
  { name: "font", css: '@font-face { src: url("missing.woff2") }' },
  { name: "srcset candidate", html: '<img srcset="/assets/missing.webp 400w">' },
  {
    name: "preloaded image candidate",
    html: '<link rel="preload" as="image" imagesrcset="/assets/missing.webp 2x">',
  },
  { name: "CSS import", css: '@import url("missing.css");' },
  {
    name: "inline style resource",
    html: '<div style="background:url(/assets/missing.webp)"></div>',
  },
  { name: "SVG image", html: '<svg><image href="/assets/missing.png"></image></svg>' },
]) {
  await test(`rejects nonexistent ${name}`, async (context) => {
    const root = await fixture(context, options);
    await assert.rejects(checkResources(root), /Missing resource/);
  });
}

for (const [name, html] of [
  ["client module", '<link rel="stylesheet" href="/assets/app.css">'],
  ["stylesheet", '<script type="module" src="/assets/app.js"></script>'],
]) {
  await test(`rejects a removed ${name} tag`, async (context) => {
    const root = await fixture(context);
    await writeFile(resolve(root, "index.html"), html);
    await assert.rejects(checkResources(root), /Missing (client module|stylesheet)/);
  });
}

await test("rejects an encoded path outside the build output", async (context) => {
  const root = await fixture(context, { html: '<img src="/..%2foutside.webp">' });
  await assert.rejects(checkResources(root), /Resource escapes build output/);
});
