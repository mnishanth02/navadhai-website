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
        logo: {
          "@type": "ImageObject",
          url: absolute(site, "icon-512.png"),
          width: 512,
          height: 512,
        },
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
      {
        "@type": "WebSite",
        "@id": id("website"),
        name: business.name,
        ...(site.origin ? { url: site.origin } : {}),
        publisher: { "@id": id("business") },
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
    const title = `${business.name} | Blouse & Dress Making, Coimbatore`;
    const description =
      "Blouse making, dress making and customisation enquiries in Coimbatore, Tamil Nadu. Start online with Navodhai on WhatsApp; visits can be arranged when needed.";
    const image = absolute(site, "og-image.png");
    const imageAlt =
      "Navodhai. Be a princess. Plum, ivory and rose textile pattern pieces beside blouse and dress making in Coimbatore.";
    document.title = title;
    meta("robots", site.production ? "index, follow" : "noindex, nofollow");
    meta("description", description);
    meta("og:type", "website", true);
    meta("og:site_name", business.name, true);
    meta("og:locale", "en_IN", true);
    meta("og:title", title, true);
    meta("og:description", description, true);
    meta("og:image", image, true);
    meta("og:image:secure_url", image, true);
    meta("og:image:type", "image/png", true);
    meta("og:image:width", "1200", true);
    meta("og:image:height", "630", true);
    meta("og:image:alt", imageAlt, true);
    meta("twitter:card", "summary_large_image");
    meta("twitter:title", title);
    meta("twitter:description", description);
    meta("twitter:image", image);
    meta("twitter:image:alt", imageAlt);
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
