# Navodhai

An online-first boutique landing page for blouse making, dress making and customisation enquiries in Coimbatore, Tamil Nadu. Visits can be arranged when needed. Built with **Vite+, TypeScript, Tailwind CSS, Motion and Lucide**. It builds to static files; no production application server, CMS or database is required.

## Run

Use Node 24.11+ in the 24.x line. Cloudflare deployment tooling and CI use Node 24.x. The project pins pnpm 12.18.0 in `package.json`.

```powershell
pnpm install --frozen-lockfile
pnpm dev
```

Open **http://localhost:5173**. For the production build:

```powershell
pnpm exec playwright install chromium
pnpm validate
pnpm preview
```

Production preview runs at http://localhost:4173. Install the Playwright Chromium browser once per development/CI machine with the command above. `pnpm validate` runs formatting, lint, type checks, interaction/theme/prerender tests, resource-checker regression tests, both builds, prerendering, resource-reference and size-budget checks, and Chromium production smoke/reflow tests. The smoke runner serves the packaged static output with its real CSP/cache policy and 404 behavior on port 4181 and closes it after testing; it fails if that port is already in use. `pnpm build:checked` creates the deployable `dist/` with Cloudflare headers and redirects; preview servers are for local review.

## Edit

| File | Purpose |
|---|---|
| `src/content.ts` | Business facts, contact destinations, editorial notes and enquiry messages |
| `src/App.tsx` | Page composition and hero enquiry selection |
| `src/components/ContactClosing.tsx` | Combined contact/footer with WhatsApp, compact identity and direct contact links |
| `src/components/BackToTop.tsx` | Floating native top link, revealed after scrolling down |
| `src/components/BrandHeader.tsx` | Large centred identity in normal page flow with one theme control |
| `src/components/OrderingSection.tsx` | Three static steps explaining online enquiries and optional visits |
| `src/components/Hero.tsx` | Opening headline, transparent textile artwork and garment choices |
| `src/components/ThemeControl.tsx` | Sun/moon appearance toggle, saved preference and dark-mode default |
| `src/components/BrandMonogram.tsx` | Original full-colour gold/rose mark with transparent padding excluded from its layout viewport |
| `src/components/WhatsAppIcon.tsx` | Shared WhatsApp brand glyph for contact actions |
| `src/components/IdeaSection.tsx` | Static editorial section: Made around your idea |
| `src/styles.css` | Tailwind theme, local fonts, component styles and responsive states |
| `src/opening.css` | Desktop, tablet and phone hero layouts |
| `src/header.css` | Static brand lockup, borderless animated theme icon and shared monograms |
| `src/themes.css` | Dark surfaces, dark default and theme crossfade |
| `src/assets/` | Optimised textile artwork and font subsets |
| `public/` | Static favicon/mobile icons, social image, manifest, robots template and font licences |
| `scripts/prerender.mjs` | Build-time React rendering into production HTML |
| `scripts/check-build.mjs` | Prerender, metadata, indexing, resource and size assertions |
| `scripts/site-config.mjs` | Canonical domain and explicit internal/public release policy |
| `scripts/package-cloudflare.mjs` | Cloudflare static headers, routing and apex redirect packaging |

The confirmed contacts are **+91 78459 52592**, **manjulajayanthi1@gmail.com** and **Coimbatore, Tamil Nadu**. Edit these centrally in `src/content.ts`; review the HTML metadata if the business name or purpose changes. Topic choice prepares a message; the visitor sends it in WhatsApp. The site collects no enquiry data.

## Design and motion

The approved editorial hero places **Be a princess.** at the left, the textile illustration in the centre and **Choose your piece** at the right. **Blouse & dress making.** and the locality sit beneath the headline. Blouse starts selected and prepares the corresponding WhatsApp enquiry; bordered controls retain their contrasting fill and visible check. At narrower or enlarged-text container sizes, the hero stacks in reading order and choices wrap as needed. The footer's WhatsApp destination remains a general enquiry. The header proportions remain 64px mark/32px companion text on desktop and 48px mark/20?24px text on phones.

A broad soft light follows the actual mouse position across the header and hero as one continuous surface, with gentle spring smoothing and separate light/dark colour treatments. It sits behind the content and cannot intercept clicks. It fades on exit or scrolling, settles when the pointer stops, and remains off for touch, reduced motion, forced colours and missing JavaScript. No new dependency or continuous idle animation was added.

The monogram retains its transparent background and original colours. A restrained shape-following CSS shadow adds depth, with separate light/dark strengths and a smaller footer shadow; no background badge is added.

The page follows the user's Canva V4 companion: Royal Plum, Ivory, Antique Gold, Dusty Rose and Charcoal; locally hosted GFS Didot and Inter; and the original full-colour gold/rose monogram from the supplied export pack in both themes. The name remains Royal Plum on Ivory and Ivory on dark surfaces. The rejected horizontal logo strip remains absent. A transparent textile composition sits between the introduction and garment choices on desktop; phones stack the content. Selecting a piece updates the hero's WhatsApp destination; its action stays labelled **Enquire** with a WhatsApp glyph.

The centred brand header pairs a 64px desktop monogram frame with the name in 32px GFS Didot companion type. Phones use a 48px frame and a responsive 20–24px name. An SVG viewport excludes the original PNG's transparent padding without redrawing or recolouring its pixels, making the visible artwork more prominent and properly centred. A small type-relative optical adjustment aligns the lettering with the artwork. It stays in normal page flow and scrolls away, so no strip covers the hero or later sections. The floating-header behaviour, tinted surface and blur have been removed.

The second section, **Made around your idea**, presents blouse making, dress making and customisation. Three decorative, static and lazy-loaded tailoring studies accompany those service descriptions. The following **Start with a conversation** section explains sharing an idea online, discussing requirements/measurements and agreeing on the next step. Visits in Coimbatore are optional and arranged as needed. No public address, opening hours, delivery promise, prices or turnaround times have been invented. See [artwork sources and prompts](docs/branding/idea-illustrations/README.md) for the conceptual illustrations; they are not a portfolio of finished garments.

The preparation/FAQ section has been removed. The page closes with **Let’s talk.**: a large heading and WhatsApp text link above one compact row for a 44px monogram, business name, service area, phone and email. This single footer replaces the separate contact section and footer strip. A 48px floating up-arrow appears after scrolling down and follows a native `#top` link; it stays clear of contact links at narrow widths.

Appearance defaults to dark on a first visit, regardless of device appearance. A saved light or dark choice takes precedence, including before the first paint. The no-JavaScript fallback is also dark. A borderless 44px sun/moon button switches directly to the opposite mode and saves that choice locally. Its icons rotate/fade gently, and supporting browsers crossfade the complete page colour state over 220ms through the native View Transition API. Older browsers still apply the theme and animate the icon. Reduced motion disables both effects; initial appearance is applied directly. A head script applies the saved preference before rendering; CSS adapts the surfaces and monogram without JavaScript. Keyboard focus remains visible. Favicons use the supplied charcoal or white single-ink variants. No preference is sent to a server.

The textile artwork is conceptual, not a photograph of Navodhai's work; its alternative text describes it as a conceptual study. The visible illustration caption and hero guidance below the enquiry action were removed at the user's request. Its brand adaptation and original palette-edit prompt are in `docs/branding/`; earlier artwork provenance remains in `docs/redesign-artwork/`. See [Canva brand adaptation](docs/branding/canva-brand-adaptation.md) for sources and logo resolution limits.

The branding remains static during refresh. The hero tagline makes a subtle 4px settling entrance over 650ms, with a 90ms offset between its two lines. Text remains at least 94% opaque from the first frame; reduced-motion users see the final static heading. The effect runs once per page load and does not replay on garment or appearance changes. Garment choices and the appearance control are included in the initial HTML at their final size; hydration enables them in place. Both local fonts are preloaded to reduce fallback-font swapping. The slim scrollbar uses Antique Gold on dark surfaces and muted Plum on Ivory, with a native fallback for older browsers. Motion handles button feedback and small artwork movements/seam drawing on hero garment selection. Native/CSS transitions handle explicit appearance changes. Reduced-motion preferences suppress these movements and smooth scrolling. The header, editorial section and contact closing stay in normal page flow. Production HTML is prerendered, so content and direct contact links work before hydration or if application JavaScript fails.

See [the React implementation guide](docs/react-implementation.md) for current structure and validation, and [the brand adaptation record](docs/branding/canva-brand-adaptation.md) for current asset provenance and limits. [DESIGN.md](DESIGN.md) records current tokens. Earlier plans, implementation records, static snapshots and Python review tools are preserved in [the historical archive](docs/archive/README.md). **`src/` is current source and `dist/` is current output**. Only the current GFS Didot and Inter licence notices ship from `public/licenses/`; historical font licences remain beside the archived static fonts.

## Cloudflare deployment

The approved public site uses Cloudflare Workers Static Assets on the free tier. `www.navodhai.in` is canonical; the apex redirects to www. The former Vercel project, deployments and domain ownership were removed. DNS remains at Cloudflare.

`pnpm validate` checks the source, tests, prerendered documents, resource budgets and browser behavior. Browser tests use the actual local Cloudflare runtime. The main Worker serves only `dist/`; a second asset-only Worker supplies the apex/HTTP redirects. Neither has a custom server script, database or paid binding.

For a production build in PowerShell:

```powershell
$env:SITE_ENV="production"
$env:SITE_VISIBILITY="public"
$env:SITE_URL="https://www.navodhai.in"
pnpm validate
pnpm deploy
```

Wrangler 4.162.0 is pinned in the project. Local deployment uses `pnpm exec wrangler login`; automated deployment uses the scoped `CLOUDFLARE_API_TOKEN` GitHub Actions secret. Tokens never belong in source files. `pnpm deploy` refuses an internal build or an unexpected production canonical origin.

GitHub Actions validates pull requests. After a reviewed merge into `main`, it rebuilds with the explicit public settings, deploys both static Workers, and merges validated main changes back into `development`. Feature builds default to noindex and do not deploy over production. The default workers.dev URL is also marked noindex; the custom domain is the canonical public entry.

The generated `_headers` retain CSP hashes, framing/MIME protections and immutable fingerprinted-asset caching. Cloudflare revalidates ordinary files. Unknown routes return the real static 404. Public builds emit indexable metadata, crawlable robots.txt and a sitemap. Preview/internal builds remain noindex by default.

See [deployment workflow](docs/deployment-workflow.md) for setup and [website icons and sharing](docs/branding/site-sharing.md) for icon regeneration and share-card checks. Organization, Website and Service structured data use only confirmed facts; no address, rating, hours, prices, delivery promises or social handles are invented. Real work photographs and further business policies can be added when supplied. Analytics and external business/search registrations remain outside this implementation.
