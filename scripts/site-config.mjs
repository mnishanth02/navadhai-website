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
  // CI sets production only for reviewed main-branch builds.
  const productionTarget = env.SITE_ENV === "production";
  const production = productionTarget && env.SITE_VISIBILITY === "public";
  const supplied = env.SITE_URL?.trim();
  // Keep the owner-confirmed canonical domain independent of hosting URLs.
  const value = supplied || "https://www.navodhai.in/";
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
