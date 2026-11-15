# Navodhai React implementation

This guide describes the current app. Earlier migration decisions and measurements are preserved in the [original migration record](archive/react-implementation.md); superseded plans and snapshots live in the [archive](archive/README.md).

## Scope and tooling

The app is a single React/TypeScript landing page for blouse making, dress making and customisation enquiries. Vite+ handles development, linting, formatting, type checks, tests and builds. Tailwind supplies theme utilities, Motion supplies hero feedback and seam drawing, and Lucide supplies interface icons. Exact dependencies and tooling versions are pinned in the root package manifest and lockfile. There is no CMS, database, enquiry collector or production application server.

## Current source

Tailwind scans only `src/` through an explicit source directive. Archived pages, documentation and deployment tooling cannot add unused utilities or change the CSS between local and hosted builds.

| File | Responsibility |
| --- | --- |
| [App](../src/App.tsx) | Page composition, default blouse selection, enhancement and reduced-motion state |
| [Content](../src/content.ts) | Confirmed business facts, topic messages, general WhatsApp route and editorial notes |
| [BrandHeader](../src/components/BrandHeader.tsx) and [BrandMonogram](../src/components/BrandMonogram.tsx) | Centred identity in normal document flow, with the supplied full-colour monogram |
| [Hero](../src/components/Hero.tsx) | Garment buttons, topic-specific WhatsApp destination, transparent artwork and decorative seam marks |
| [HeroLight](../src/components/HeroLight.tsx) | Decorative pointer light, spring values, input/preference gates and listener/observer cleanup |
| [ThemeControl](../src/components/ThemeControl.tsx) | Saved light/dark choice, dark default and interruption-safe appearance transitions |
| [IdeaSection](../src/components/IdeaSection.tsx) | Three confirmed services with decorative illustrations |
| [OrderingSection](../src/components/OrderingSection.tsx) | Static online-enquiry process and optional visits |
| [ContactClosing](../src/components/ContactClosing.tsx) and [WhatsAppIcon](../src/components/WhatsAppIcon.tsx) | Combined contact/footer with independent WhatsApp, phone and email links |
| [BackToTop](../src/components/BackToTop.tsx) | Scroll-dependent native top link |
| [Styles](../src/styles.css), [header](../src/header.css), [opening](../src/opening.css), [themes](../src/themes.css) | Current tokens, local fonts, layout, responsive states and appearance |

The approved option A hero leads with **Be a princess.** beside the central illustration and right-hand enquiry. The service description and locality sit beneath the headline. CSS gives its two readable lines a finite 4px/650ms settling entrance, staggered by 90ms, only when reduced motion is not requested. No hydration flag, timer, new dependency or hidden initial text is used. Rem-based container queries stack the hero when available space or text size demands it.

A single light follows the actual mouse coordinates across the header and hero using existing Motion spring values. Its canvas and tracking bounds end at the hero; crossing between the header and hero neither fades nor restarts it. Cached geometry keeps per-move work limited to the existing motion values. The gradient is painted on a bounded layer; tracking updates transform and opacity without React state updates. First entry jumps to the pointer, preventing travel from a page corner. It fades on exit/scroll and resets for geometry, visibility and preference changes. Coarse/touch input, reduced motion, forced colours and missing JavaScript retain a plain canvas. The native cursor, focus outlines, contact links and scrolling are unchanged.

The hero uses ordinary pressed-state buttons, with Blouse selected by default. Selection changes the prepared WhatsApp message and artwork marks; it sends nothing. The closing WhatsApp link always uses a separate general enquiry. The services and ordering sections have no second selector or message preview. Ordering explains online enquiries and optional visits; the old preparation/FAQ remains removed.

Appearance defaults to dark regardless of device preference. A saved manual choice takes precedence. The head script restores it before paint; the theme button enables after hydration. Current typography is locally hosted GFS Didot and Inter. The [design system](../DESIGN.md) and [brand adaptation record](branding/canva-brand-adaptation.md) describe current visuals and asset provenance.

## Build and fallback

The [client entry](../src/main.tsx) hydrates prerendered markup, or mounts the app in development. The [server entry](../src/entry-server.tsx) renders the app and a separate 404 at build time. It is not deployed as a server. `pnpm build` builds both entries and runs [prerender.mjs](../scripts/prerender.mjs) to inject complete page markup into `dist/index.html`.

Without application JavaScript, the page remains readable, the default blouse enquiry and footer contact links work, and the footer monogram links to the top. Theme and garment buttons are visible at their final size but disabled until hydration. The floating top control starts hidden. Both local fonts are preloaded. Deploy only `dist/`; `.prerender/` is disposable build output.

## Validation

From the repository root:

```powershell
pnpm exec playwright install chromium
pnpm validate
```

Install Playwright Chromium once on each development/CI machine. Validation runs formatting, lint and TypeScript checks; interaction/theme/prerender tests; [resource-checker regression tests](../scripts/check-resources.test.mjs); client and server builds; prerendering; [output checks](../scripts/check-build.mjs); and [production Chromium smoke/reflow tests](../tests/production.spec.ts). The smoke runner serves the packaged static files with generated headers on port 4181, refuses to reuse an existing process, and closes its server after the run. Captures and failure traces stay in ignored `.prerender/smoke/` output. Tests cover topic handoffs, keyboard interaction, independent contacts, saved/default appearance, interrupted transitions, reduced motion, top navigation and usable prerendered content.

Output checks resolve local HTML resource URLs, inline styles, every srcset/preload-image candidate, and recursively imported CSS/font/image URLs against files inside `dist/`. Missing files and removed client-module/stylesheet tags fail validation. External/data/fragment URLs are excluded from this filesystem check. They also enforce the explicit internal/public indexing policy, expected active artwork and monograms, prerendered content, a 450,000-byte compressed-transfer estimate and a 120,000-byte gzip JavaScript budget. These are build estimates assuming host text compression.

Production smoke checks catch HTTP/network/MIME errors and browser console/hydration errors, verify loaded artwork/fonts and keyboard-operated garment/theme controls, and check layout at 320, 390, 768 and 1280px with normal and 200% root text. Additional browser tests verify the tagline stays readable during its finite entrance, does not replay on interaction, stays static with reduced motion, and is present with JavaScript disabled. Pointer-light checks cover both appearances, visible coordinate tracking, unchanged layout, working controls, fade on exit/scroll, settled style updates, live accessibility preference changes and touch fallback. The header gives the identity a full row below 16rem of container space; garment choices wrap as needed. The text-scaling checks are controlled CSS tests, not native browser zoom or physical-device text settings. Public-host performance, compression, caching, domain metadata and launch indexing still require release-specific verification, as do cross-browser, real-device and assistive-technology checks.

## Deployment output and scope

`pnpm build:ci` validates and builds the static application. [package-cloudflare.mjs](../scripts/package-cloudflare.mjs) writes Cloudflare `_headers` and `_redirects` into `dist/`, plus the asset-only apex redirect bundle. [wrangler.jsonc](../wrangler.jsonc) and [wrangler.apex.jsonc](../wrangler.apex.jsonc) deploy the main site and redirect using no custom Worker scripts.

[site-config.mjs](../scripts/site-config.mjs) defaults to internal/noindex. Only SITE_ENV=production together with SITE_VISIBILITY=public produces indexable documents and a sitemap. The canonical origin is https://www.navodhai.in/. GitHub Actions supplies those flags only for main-branch production builds. Cloudflare credentials are provided to the deploy step only, through an Actions secret.

Browser smoke tests run against Wrangler/workerd itself, including the real static 404, headers, reserved configuration paths, asset MIME types, theme behavior and apex redirects. Set SMOKE_BASE_URL and SMOKE_APEX_URL to validate deployed domains with the same suite. The public application needs no sign-in, database, analytics or enquiry collector.
