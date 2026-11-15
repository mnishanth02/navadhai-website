import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { test } from "node:test";
import { JSDOM } from "jsdom";
import { resolveSiteConfig } from "./site-config.mjs";
import { createSiteDocuments } from "./site-documents.mjs";

await test("local builds default to an unindexed preview with the owner-confirmed canonical domain", () => {
  assert.deepEqual(resolveSiteConfig({}), {
    production: false,
    origin: "https://www.navodhai.in/",
  });
});
await test("preview builds cannot become indexable through a shared visibility override", () => {
  assert.equal(
    resolveSiteConfig({ SITE_ENV: "preview", SITE_VISIBILITY: "public" }).production,
    false,
  );
});
await test("public indexing requires an explicit production build and public visibility", () => {
  assert.equal(
    resolveSiteConfig({ SITE_ENV: "production", SITE_VISIBILITY: "public" }).production,
    true,
  );
  assert.equal(resolveSiteConfig({ SITE_ENV: "production" }).production, false);
  assert.equal(resolveSiteConfig({ SITE_VISIBILITY: "public" }).production, false);
  assert.equal(
    resolveSiteConfig({ SITE_ENV: "production", SITE_VISIBILITY: "internal" }).production,
    false,
  );
});
await test("preview deployment URLs never replace the canonical domain", () => {
  assert.equal(
    resolveSiteConfig({
      WORKERS_CI_BRANCH: "feature/example",
      WORKERS_CI_COMMIT_SHA: "temporary",
    }).origin,
    "https://www.navodhai.in/",
  );
});
for (const url of [
  "http://navodhai.in",
  "https://www.navodhai.in/path",
  "https://user:pass@navodhai.in",
  "https://www.navodhai.in/?query=1",
  "https://www.navodhai.in/#fragment",
  "https://localhost",
]) {
  await test(`rejects an invalid canonical URL: ${url}`, () => {
    assert.throws(() => resolveSiteConfig({ SITE_URL: url }));
  });
}

const business = {
  name: "Navodhai",
  tagline: "Be a princess.",
  whatsappNumber: "917845952592",
  email: "manjulajayanthi1@gmail.com",
};
const topics = [
  { id: "blouse", name: "Blouse making" },
  { id: "dress", name: "Dress making" },
  { id: "customisation", name: "Customisation" },
];
const bootstrap = "document.documentElement.dataset.theme='dark';";
const shell = `<!doctype html><html><head><meta name="robots" content="noindex, nofollow"><link rel="stylesheet" href="/assets/app.css"><script>${bootstrap}</script></head><body><div id="root"><!--app-html--></div><script type="module" src="/assets/app.js"></script></body></html>`;

for (const production of [false, true]) {
  await test(`generates consistent ${production ? "production" : "preview"} indexing, schema and hashed CSP`, () => {
    const site = { production, origin: "https://www.navodhai.in/" };
    const result = createSiteDocuments({
      shell,
      markup: "<h1>Be a princess.</h1>",
      notFoundMarkup: "<main>Page not found</main>",
      site,
      business,
      topics,
    });
    const dom = new JSDOM(result.html);
    try {
      const { document } = dom.window;
      assert.equal(
        document.querySelector('meta[name="robots"]').content,
        production ? "index, follow" : "noindex, nofollow",
      );
      assert.equal(document.querySelector('link[rel="canonical"]').href, site.origin);
      assert.equal(
        document.querySelector('meta[property="og:image"]').content,
        "https://www.navodhai.in/og-image.png",
      );
      const schema = JSON.parse(
        document.querySelector('script[type="application/ld+json"]').textContent,
      );
      assert.equal(schema["@graph"].filter((item) => item["@type"] === "Service").length, 3);
      assert.equal(schema["@graph"][0].name, "Navodhai");
      assert.equal(schema["@graph"][0].logo.url, `${site.origin}icon-512.png`);
      const website = schema["@graph"].find((item) => item["@type"] === "WebSite");
      assert.equal(website.url, site.origin);
      assert.equal(website.publisher["@id"], schema["@graph"][0]["@id"]);
      for (const property of ["og:title", "twitter:title"]) {
        const attribute = property.startsWith("og:") ? "property" : "name";
        assert.equal(document.querySelectorAll(`meta[${attribute}="${property}"]`).length, 1);
        assert.equal(
          document.querySelector(`meta[${attribute}="${property}"]`).content,
          document.title,
        );
      }
      assert.equal(document.querySelector('meta[property="og:image:type"]').content, "image/png");
      assert.equal(
        document.querySelector('meta[property="og:image:secure_url"]').content,
        `${site.origin}og-image.png`,
      );
      assert.equal(
        document.querySelector('meta[name="twitter:description"]').content,
        document.querySelector('meta[name="description"]').content,
      );
      assert.equal(
        document.querySelector('meta[name="twitter:image:alt"]').content,
        document.querySelector('meta[property="og:image:alt"]').content,
      );
      assert.equal(schema["@graph"][0].address, undefined);
      assert(!result.html.includes("aggregateRating"));
      const hash = createHash("sha256").update(bootstrap).digest("base64");
      assert(result.headers["Content-Security-Policy"].includes(`'sha256-${hash}'`));
      assert(!result.headers["Content-Security-Policy"].includes("script-src 'unsafe-inline'"));
      assert.equal(result.headers["X-Robots-Tag"], production ? undefined : "noindex, nofollow");
      assert(result.robots.includes(production ? "Allow: /" : "Disallow: /"));
      assert.equal(Boolean(result.sitemap), production);
      if (production) assert(result.sitemap.includes("https://www.navodhai.in/"));
      assert(!result.notFound.includes("<script"));
      assert(!result.notFound.includes('rel="canonical"'));
      assert(!result.notFound.includes('property="og:'));
      assert(!result.notFound.includes('name="twitter:'));
    } finally {
      dom.window.close();
    }
  });
}
