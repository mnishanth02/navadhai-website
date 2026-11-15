import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { resolveSiteConfig } from "./site-config.mjs";
import { createSiteDocuments } from "./site-documents.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const { render, renderNotFound, business, topics } = await import(
  new URL("../.prerender/entry-server.js", import.meta.url).href
);
const path = resolve(root, "dist/index.html");
const shell = await readFile(path, "utf8");
if (!shell.includes("<!--app-html-->")) throw new Error("Prerender placeholder is missing.");
const markup = render();
if (!markup.includes("Blouse &amp; dress making."))
  throw new Error("Prerender did not include the homepage.");
const site = resolveSiteConfig();
const documents = createSiteDocuments({
  shell,
  markup,
  notFoundMarkup: renderNotFound(),
  site,
  business,
  topics,
});
await writeFile(path, documents.html);
await writeFile(resolve(root, "dist/404.html"), documents.notFound);
await writeFile(resolve(root, "dist/robots.txt"), documents.robots);
if (documents.sitemap) await writeFile(resolve(root, "dist/sitemap.xml"), documents.sitemap);
await writeFile(
  resolve(root, ".prerender/site.json"),
  JSON.stringify({ ...site, headers: documents.headers }, null, 2),
);
console.log("Prerendered React homepage: content and contact links work before hydration.");
