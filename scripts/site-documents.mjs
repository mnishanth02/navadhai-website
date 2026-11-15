import { createHash } from "node:crypto";
import { JSDOM } from "jsdom";

const absolute = (site, path) => (site.origin ? new URL(path, site.origin).href : path);

function structuredData(site, business, topics) {
  const id = (fragment) => `${site.origin ?? ""}#${fragment}`;
  const area = { "@type": "City", name: "Coimbatore" };
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": id("business"),
        name: business.name,
        slogan: business.tagline,
        ...(site.origin ? { url: site.origin } : {}),
        telephone: `+${business.whatsappNumber}`,
        email: business.email,
        areaServed: area,
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer enquiries",
          telephone: `+${business.whatsappNumber}`,
          email: business.email,
          areaServed: area,
        },
      },
      ...topics.map((topic) => ({
        "@type": "Service",
        "@id": id(topic.id),
        name: topic.name,
        serviceType: topic.name,
        provider: { "@id": id("business") },
        areaServed: area,
        ...(site.origin ? { url: `${site.origin}#services` } : {}),
      })),
    ],
  };
}

export function createSiteDocuments({ shell, markup, notFoundMarkup, site, business, topics }) {
  const dom = new JSDOM(shell.replace("<!--app-html-->", markup));
  try {
    const { document } = dom.window;
    const meta = (name, content, property = false) => {
      const attribute = property ? "property" : "name";
      let element = document.head.querySelector(`meta[${attribute}="${name}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, name);
        document.head.append(element);
      }
      element.setAttribute("content", content);
    };
    meta("robots", site.production ? "index, follow" : "noindex, nofollow");
    meta(
      "description",
      "Blouse making, dress making and customisation enquiries in Coimbatore, Tamil Nadu. Start online with Navodhai on WhatsApp; visits can be arranged when needed.",
    );
    meta(
      "og:description",
      "Blouse and dress making in Coimbatore. Share your idea with Navodhai online; visits can be arranged when needed.",
      true,
    );
    meta("og:image", absolute(site, "og-image.png"), true);
    meta("og:image:width", "1200", true);
    meta("og:image:height", "630", true);
    meta("og:image:alt", "Navodhai. Be a princess. Blouse and dress making in Coimbatore.", true);
    meta("twitter:card", "summary_large_image");
    meta("twitter:image", absolute(site, "og-image.png"));
    if (site.origin) {
      const canonical = document.createElement("link");
      canonical.rel = "canonical";
      canonical.href = site.origin;
      document.head.append(canonical);
      meta("og:url", site.origin, true);
    }
    const schema = document.createElement("script");
    schema.type = "application/ld+json";
    schema.textContent = JSON.stringify(structuredData(site, business, topics)).replaceAll(
      "<",
      "\\u003c",
    );
    document.head.append(schema);

    const hashes = [...document.querySelectorAll("script:not([src])")].map(
      (script) => `'sha256-${createHash("sha256").update(script.textContent).digest("base64")}'`,
    );
    const headers = {
      "Cache-Control": "public, max-age=0, must-revalidate",
      "Content-Security-Policy": [
        "default-src 'self'",
        `script-src 'self' ${hashes.join(" ")}`,
        "script-src-attr 'none'",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data:",
        "font-src 'self'",
        "connect-src 'none'",
        "object-src 'none'",
        "base-uri 'none'",
        "frame-ancestors 'none'",
        "form-action 'none'",
        "upgrade-insecure-requests",
      ].join("; "),
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
      ...(!site.production ? { "X-Robots-Tag": "noindex, nofollow" } : {}),
    };
    const html = dom.serialize();
    // The 404 is a real static document with the same local fonts/styles, no app script.
    for (const script of document.querySelectorAll("script")) script.remove();
    for (const element of document.querySelectorAll(
      'link[rel="canonical"], meta[property^="og:"], meta[name^="twitter:"]',
    ))
      element.remove();
    document.title = "Page not found | Navodhai";
    meta("robots", "noindex, follow");
    document.body.innerHTML = notFoundMarkup;
    const notFound = dom.serialize();
    const robots = site.production
      ? `User-agent: *\nAllow: /\n\nSitemap: ${site.origin}sitemap.xml\n`
      : "User-agent: *\nDisallow: /\n";
    const sitemap = site.production
      ? `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${site.origin.replaceAll("&", "&amp;").replaceAll("<", "&lt;")}</loc></url></urlset>\n`
      : null;
    return { html, notFound, robots, sitemap, headers };
  } finally {
    dom.window.close();
  }
}
