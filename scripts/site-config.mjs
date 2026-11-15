import assert from "node:assert/strict";

export function resolveSiteConfig(env = process.env) {
  assert(
    !env.SITE_ENV || ["preview", "production"].includes(env.SITE_ENV),
    "SITE_ENV must be preview or production",
  );
  assert(
    !env.SITE_VISIBILITY || ["internal", "public"].includes(env.SITE_VISIBILITY),
    "SITE_VISIBILITY must be internal or public",
  );
  // A Vercel Preview must never become indexable through a shared override.
  const productionTarget = env.VERCEL_ENV
    ? env.VERCEL_ENV === "production"
    : env.SITE_ENV === "production";
  const production = productionTarget && env.SITE_VISIBILITY === "public";
  const supplied = env.SITE_URL?.trim();
  // The owner-confirmed domain stays canonical across Vercel and Cloudflare.
  const value = supplied || "https://navodhai.in/";
  let origin = null;
  if (value) {
    const url = new URL(value);
    assert(
      url.protocol === "https:" &&
        !url.username &&
        !url.password &&
        !url.search &&
        !url.hash &&
        url.pathname === "/" &&
        !url.port,
      "SITE_URL must be a public HTTPS origin without a path, credentials, query, port or fragment",
    );
    assert(
      !["localhost", "127.0.0.1", "[::1]"].includes(url.hostname),
      "SITE_URL must use a public hostname",
    );
    origin = `${url.origin}/`;
  }
  return { production, origin };
}
