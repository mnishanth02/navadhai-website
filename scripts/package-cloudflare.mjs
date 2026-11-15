import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
const { headers, origin } = JSON.parse(
  await readFile(resolve(root, ".prerender/site.json"), "utf8"),
);
// Prevent edge-injected scripts from changing CSP-hashed HTML. Keep one cache policy per path.
const security = Object.entries(headers)
  .filter(([name]) => name !== "Cache-Control")
  .map(([name, value]) => `  ${name}: ${value}`)
  .join("\n");
await writeFile(
  resolve(root, "dist/_headers"),
  `/*\n${security}\n  Cache-Control: public, max-age=0, must-revalidate, no-transform\n\n/assets/*\n  ! Cache-Control\n  Cache-Control: public, max-age=31536000, immutable\n\nhttps://:worker.:account.workers.dev/*\n  X-Robots-Tag: noindex, nofollow\n`,
);
await writeFile(resolve(root, "dist/_redirects"), "/index.html / 308\n");
const apex = resolve(root, ".prerender/apex");
await mkdir(apex, { recursive: true });
await writeFile(resolve(apex, "_redirects"), `/* ${origin}:splat 308\n`);
await writeFile(resolve(apex, "404.html"), await readFile(resolve(root, "dist/404.html")));
console.log("Packaged Cloudflare static assets, security/cache headers, redirects and custom 404.");
