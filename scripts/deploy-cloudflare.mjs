import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
const site = JSON.parse(await readFile(resolve(root, ".prerender/site.json"), "utf8"));
assert(
  site.production,
  "Refusing to publish an internal build. Build with SITE_ENV=production and SITE_VISIBILITY=public first.",
);
assert.equal(
  site.origin,
  "https://www.navodhai.in/",
  "Production must use the confirmed canonical domain.",
);
const cli = resolve(root, "node_modules/wrangler/bin/wrangler.js");
for (const config of ["wrangler.jsonc", "wrangler.apex.jsonc"]) {
  const result = spawnSync(process.execPath, [cli, "deploy", "--config", config], {
    cwd: root,
    stdio: "inherit",
  });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}
