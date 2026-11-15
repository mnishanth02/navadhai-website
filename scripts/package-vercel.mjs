import assert from "node:assert/strict";
import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const output = resolve(root, ".vercel/output");
assert(
  output === resolve(root, ".vercel", "output"),
  "Refusing to clear an unexpected build directory",
);
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(resolve(root, "dist"), resolve(output, "static"), { recursive: true });
const { headers } = JSON.parse(await readFile(resolve(root, ".prerender/site.json"), "utf8"));
const config = {
  version: 3,
  routes: [
    { src: "/(.*)", headers, continue: true },
    {
      src: "/assets/(.*)",
      headers: { "Cache-Control": "public, max-age=31536000, immutable" },
      continue: true,
    },
    { src: "/index\\.html", status: 308, headers: { Location: "/" } },
    { handle: "filesystem" },
    { src: "/(.*)", status: 404, dest: "/404.html" },
  ],
};
await writeFile(resolve(output, "config.json"), JSON.stringify(config, null, 2));
console.log(
  "Prepared .vercel/output: static files only, security/cache headers and a real 404. No functions.",
);
