# Website icons and sharing

The website uses the approved V4 monogram, palette, local fonts and conceptual textile artwork. No logo was redrawn or recoloured. All assets below are committed static files; hosting does not generate images or run a browser.

| Asset | Purpose |
| --- | --- |
| `public/favicon.ico` | 16, 32 and 48px browser fallback |
| `public/favicon.png` | 96px white single-ink mark on Royal Plum, dark/default favicon |
| `public/favicon-light.png` | 96px Charcoal mark on Ivory, light appearance favicon |
| `public/apple-touch-icon.png` | 180px full-colour monogram on Ivory for Apple home-screen bookmarks |
| `public/icon-192.png`, `public/icon-512.png` | Android/bookmark icons |
| `public/icon-maskable-512.png` | Android icon with artwork inside the central safe zone |
| `public/site.webmanifest` | Site name, icons and normal browser display mode |
| `public/og-image.png` | Existing 1200×630 social image with tagline, services, locality and conceptual textile study |

The source PNGs are 200px connector exports. Padding is removed using the same approved viewport as the page monogram. Large icon files are derived from those previews; replace the source exports with higher-resolution originals when available. The manifest keeps browser navigation and does not add a service worker, offline mode or install prompt.

Regenerate icons with `node scripts/generate-site-icons.mjs`, and the share card with `node scripts/generate-share-image.mjs`, after installing Playwright Chromium. These scripts are developer tools only. Review the results before committing. Favicon URLs stay stable so browsers/search engines can revisit them.

The build writes one consistent title/description across page, Open Graph and X card tags, including an absolute HTTPS image URL, dimensions, MIME type and descriptive image text. Website and Organization structured data identify the site and logo using confirmed facts. The canonical origin defaults to `https://www.navodhai.in/`; `SITE_URL` can override it for a future hosting migration.

## Public launch check

The owner approved a public, indexable Cloudflare launch. The canonical homepage and all image/icon URLs must be accessible without sign-in. Internal/feature builds remain noindex; the workers.dev diagnostic hostname has its own noindex response header.

At launch, confirm the homepage, icon and OG image return 200 without authentication; verify apex-to-www HTTPS redirects and canonical/share URLs. Then test actual link previews. Platforms cache cards independently, so use their preview refresh tools when available after an image changes. A noindex directive is separate from authentication; feature work must not publish an internal build over the public domains.

References: [Open Graph](https://ogp.me/), [Google favicon guidance](https://developers.google.com/search/docs/appearance/favicon-in-search), [Apple web clip icons](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html), [manifest icons](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/icons).
