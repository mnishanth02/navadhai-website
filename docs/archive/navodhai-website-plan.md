---
title: "Navodhai | Boutique Website & CMS Product Plan"
version: "1.1"
status: "Superseded for the current release by the static landing page plan on 2026-11-14"
date: "2026-11-11"
owner: "Navodhai"
---

> **Archived historical record.** Component names, paths, measurements and release instructions below describe earlier versions. See the [archive index](README.md) for preserved snapshots, working reproduction commands and current guidance.

# Navodhai

## Boutique Website & CMS Product Plan

> **Historical plan, superseded on 14 November 2026.** Use the [static landing page plan](static-landing-page-plan.md) for current scope and delivery. The CMS, portfolio, infrastructure and implementation instructions below are not current release requirements.

**Version:** 1.1  
**Prepared:** 10 November 2026; revised 11 November 2026  
**Primary goal:** Launch a premium, visually distinctive and exceptionally usable portfolio experience for a new handcrafted boutique.  
**Deployment path:** Private Vercel testing → self-hosted public launch.  
**Technology baseline:** Next.js + TypeScript + Payload CMS + PostgreSQL + Cloudflare R2.

> **North star:** Every interaction should help a visitor appreciate the craftsmanship and make it effortless to enquire. Animation must amplify the story, not slow the site down.

**Execution status:** This revision incorporates the plan review. No application, dependency installation or integration test is complete yet. Technical defaults below are selected for implementation; the M2 gate must prove them. Business inputs remain tracked in section 16. Use the [implementation checklist](implementation-checklist.md) to work through one package at a time.

## 1. Executive decision record

| Decision | Baseline | Rationale / constraint |
|---|---|---|
| Business stage | Portfolio and brand discovery, not e-commerce | Establish trust and capture enquiries before selling online |
| App architecture | One Next.js codebase containing frontend and Payload | Fewer services, direct server-side CMS access, easier portability |
| CMS | Payload 3.93.0 with matching official packages | Stable release; drafts, versions, media, admin, auth |
| Database | PostgreSQL with `@payloadcms/db-postgres` | Same adapter on Vercel and self-hosted; no platform-specific DB APIs |
| Media | Private R2 source bucket; separate public bucket for approved derivatives; `@payloadcms/storage-s3` on Node | Originals and draft assets stay private; delivery remains portable |
| Testing host | Vercel, privately protected | Fast iterations and stakeholder review |
| Public host | Self-hosted Docker / Node.js behind HTTPS proxy | Hosting control, reversible cutover |
| Public interaction | Bespoke editorial UI; progressive enhancement | Strong signature experience without fragile scripts |
| Primary conversion | WhatsApp enquiry intent plus visible email; optional contact form P1 | Working alternative for visitors without WhatsApp |
| Design source of truth | Existing Navodhai V4 brand assets | Do not invent a new logo, palette or typography system |

### 1.1 Explicit boundaries

**In MVP:** Homepage, portfolio catalogue, design detail, about, contact, CMS editing and preview, responsive media, SEO, analytics, private testing, production deployment readiness.

**Not in MVP:** Checkout, payments, carts, customer accounts, appointment booking, order/measurement management, inventory, loyalty programmes, multilingual publishing, complex page-builder freedom, AI chatbots, and application-wide 3D scenes.

**Future integration principle:** A separate boutique operations application can later own orders, measurements and customers. Payload remains the content and presentation backend; do not make it a business ERP.

### 1.2 Dependency and runtime baseline

**Verified release snapshot: 11 November 2026.** These are proposed exact installation pins, checked against live release metadata and declared peer requirements. They are not a claim that a build has passed. Recheck the snapshot when scaffolding; record any replacement and its compatibility evidence before changing the baseline.

| Component | Selected version | Requirement |
|---|---|---|
| Node.js | 26.13.0 LTS | Local/CI runtime pin; Vercel selects `26.x` and manages patch updates |
| Next.js | 16.4.6 | App Router; Node runtime for Payload |
| React / React DOM | 19.3.1 / 19.3.1 | Keep both packages on the same version |
| Payload | 3.93.0 | Stable 3.x baseline |
| Official Payload packages | 3.93.0 each | `@payloadcms/next`, `@payloadcms/ui`, `@payloadcms/db-postgres`, `@payloadcms/storage-s3`, `@payloadcms/plugin-seo`, `@payloadcms/richtext-lexical`, `@payloadcms/live-preview-react`, `@payloadcms/plugin-redirects`, `@payloadcms/email-nodemailer` |
| S3 client for derivative publication | 3.1166.0 | Pin `@aws-sdk/client-s3` as a direct dependency if imported by the publication service |
| GraphQL | 16.15.0 | Compatibility exception: current `latest` is 17.1.0, but Payload requires `^16.8.1` |
| TypeScript | 7.0.2 | Strict checking; current Next.js uses project-local CLI checking |
| PostgreSQL | 18.6 | Supported stable server release; keep local/staging/production on the same major |
| Motion | 14.12.0 | Import React features from `motion/react` |
| Sharp | 0.35.5 | Verify native binary in the Linux build and runtime images |
| Biome | 2.6.6 | Pin `@biomejs/biome`; commit `biome.json` |
| pnpm | 12.18.0 | Pin in `packageManager`; commit `pnpm-lock.yaml` |
| Playwright | 1.65.0 | Pin `@playwright/test`; use its matching browser binaries |
| Vitest | 5.1.0 | Target meaningful query, permission, lifecycle and validation tests |
| React type packages | 19.3.0 each | `@types/react` and `@types/react-dom` |
| Node type package | 26.6.6 | `@types/node` aligned with the selected runtime major |

Payload 3.93.0 declares Node `^22.23.4 || >=24.22.1`; its Next adapter accepts `>=16.3.3 <17.0.0`, which includes Next.js 16.4.6. Install without force or ignored peer errors. Keep the listed Payload packages together during upgrades.

**Version-specific documentation rule:** Context7 and unversioned GitHub `main` snippets can already describe Payload 4 prerelease APIs. For this baseline, resolve documentation first, then verify examples against the `v3.93.0` tag and installed types. In particular, Payload 3 Local API reads default to bypassing access control, and its image pipeline uses `upload.imageSizes` with Sharp. Do not copy incompatible v4 defaults or configuration shapes. See the versioned references in section 18.

### 1.3 Feature adoption decisions

| Capability | MVP decision |
|---|---|
| Next.js Server Components and native metadata routes | Default for public content, metadata, sitemap and robots |
| Typed routes and async request APIs | Enable typed routes; await `params`, `searchParams`, `cookies()`, `headers()` and `draftMode()` where used |
| Public content caching | Tagged cache around public DTO queries; initial `unstable_cache` integration follows the Payload 3 website template; policy in section 7.5 |
| Cache Components / `use cache` and React Compiler | Evaluate separately after M2; initially disabled to keep the Payload admin integration unchanged |
| Payload drafts, autosave and version history | Enable on portfolio items and editorial globals; cap retained versions and test restoring |
| Payload Live Preview | Authenticated mobile/desktop breakpoints; unpublished work is never shared-cached |
| Payload image sizing, crop and focal point | Use built-in 3.x capabilities; keep original files and generated draft sizes private |
| Payload generated types, import map, migrations and document locks | Generate/check in CI; respect locks on user-driven writes |
| Redirects | Use Payload's redirects plugin plus explicit frontend resolution and invalidation; stable slugs remain the default |
| Motion | CSS for simple states; `LazyMotion`/`m` for selected interactive islands; reduced-motion fallback |
| Optional forms and video | Form P1; public video deferred until the image pipeline and core pages pass |

### 1.4 Repository tooling and update policy

- Save exact direct dependency versions and commit the lockfile, `packageManager`, Node pin and `biome.json`. Use frozen-lockfile installs in CI. Pin production container bases to a version/digest and update them deliberately.
- Use Biome on supported source/configuration files. Add other tooling only for unsupported files or specific missing rules; one formatter owns each file type.
- Keep TypeScript strict. CI runs formatting/lint checks, generated Payload type/import-map drift checks, type checking, targeted unit/integration tests, production build and Playwright smoke tests.
- Test draft isolation, role permissions, public media delivery, publish/unpublish invalidation and migrations with real PostgreSQL/storage integrations where relevant. Avoid tests that merely repeat implementation details.
- Check dependency updates weekly; prioritise security patches. Upgrade Payload packages as a group and rerun the M2 smoke flow before promotion. Re-run the full release checks when an upgrade changes runtime behavior.
- Record installed versions, Node build/runtime versions and test evidence in the implementation checklist. The review snapshot alone does not satisfy this requirement.

## 2. Users, jobs and measurable outcomes

### 2.1 Personas

| Persona | Goal | Friction to remove |
|---|---|---|
| Prospective customer on mobile | Discover styles, assess craftsmanship, enquire | Slow media, hard navigation, unclear contact action |
| Returning visitor | Find a design previously seen | Poor categories, broken URLs, no recognisable thumbnails |
| Boutique founder / content editor | Publish recent work without developer support | Technical fields, confusing media upload, fear of mistakes |
| Developer / site owner | Iterate safely, operate at low cost, move hosting | Environment coupling, manual migration, unpredictable builds |

### 2.2 Product outcomes

- Brand feels personal, elegant, crafted, warm and credible; not like a generic store template.
- Visitors can browse designs without signing in, understand the work, and start a relevant WhatsApp conversation.
- Founder can add and preview a portfolio item end-to-end without development involvement.
- Pages remain responsive and stable even with image-heavy content and scroll interaction.
- The private build can be migrated to a self-hosted public server without a codebase rewrite.

### 2.3 Launch KPIs (initial targets; revisit with real traffic)

| Measure | Target / definition |
|---|---|
| Prelaunch performance | Repeatable mobile lab runs on home/list/detail; LCP ≤ 2.5s and CLS ≤ 0.1 under the recorded test profile; representative interactions tested for responsiveness |
| Postlaunch Web Vitals | LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1 at p75 in real-user data; assess mobile and desktop separately once a useful sample exists |
| Lighthouse | ≥ 90 performance, accessibility and best-practices on representative mobile pages; diagnostic, not proof of accessibility conformance |
| Enquiry intent | `whatsapp_enquiry_intent` records an outbound click only; never report it as a sent message or completed conversation |
| Form submission, if enabled | `contact_form_submitted` fires only after server validation and successful persistence; delivery of an email is a separate outcome |
| Editor task | Upload → add details → preview → publish without developer assistance |
| Content readiness | At least 8–12 real, high-quality portfolio entries across meaningful categories before public launch |
| Accessibility | WCAG 2.2 AA as a practical design and QA target |
| Migration readiness | Restore verified DB backup, deliver media, and serve site from Docker in staging before DNS cutover |

Record the lab device/browser, network profile, build commit and results. Use a repeatable mid-range mobile/slow-4G profile for launch checks and a low-end Android for interaction testing. Review the first 28 days of available real-user measurements after launch; insufficient field traffic is not a prelaunch blocker. Analytics failures must never prevent a visitor opening WhatsApp.

## 3. Brand and experience direction

### 3.1 Brand framing

Navodhai is an emerging, handcrafted boutique with a focus on blouse and dress making. The digital experience should communicate *thoughtful craft, personal attention, detail and quiet confidence*. It is a portfolio and discovery journey, not a price-first catalogue.

Retain the approved **Navodhai V4** brand system: refined N-floral monogram, elegant wordmark, deep plum / antique-gold family, rose accent and approved typography. Extract **exact** hex values, font licenses, logo variations, spacing and usage rules from the existing brand assets during discovery. Values in this document are semantic placeholders, not replacement brand specifications.

### 3.2 Experience principles

1. **Photography first:** A garment, not the interface, should be the hero.
2. **Editorial rhythm:** Alternate bold image-led modules with calm typography and open space.
3. **A distinctive signature:** Use one or two memorable interaction patterns repeatedly; avoid a grab-bag of animations.
4. **Mobile elegance:** Touch and thumb reach are first-class; never rely on hover for key actions.
5. **Speed is part of luxury:** Transitions are fluid, but the site responds instantly to input.
6. **Accessibility is the default:** Respect reduced motion, keyboard focus, semantic navigation and meaningful alternative text.
7. **Founder-friendly publishing:** The CMS should speak the language of designs, categories and stories.

### 3.3 Visual design system to build

| Token group | Requirements |
|---|---|
| Colours | Map approved V4 values to `brand.plum`, `brand.gold`, `brand.rose`, `surface.paper`, `surface.ink`, `border.subtle`, `text.muted`; test contrast |
| Typography | Approved display serif for editorial headlines; highly legible body family; variable responsive scale; restrained signature script only where approved |
| Grid | 4-column mobile, 8-column tablet, 12-column desktop; generous margins and intentional asymmetry |
| Spacing | One consistent spacing scale, plus editorial section presets; avoid cramped cards |
| Radius / shadow | Minimal, subtle and consistent; the clothing photography carries visual weight |
| Imagery | Defined portrait/landscape ratios; art direction, focal positions and consistent grading |
| Motion | Shared duration/easing tokens; entrance, hover, gallery, page and overlay patterns |
| Controls | Accessible navigation, category chips, gallery, lightbox, buttons, enquiry CTA and form states |
| Content | Responsive heading lengths and text limits; graceful empty and sparse states |

**Recommended direction:** Warm ivory/linen surfaces, dark plum type, measured gold detail, editorial serif headings, close-up craftsmanship imagery, subtle texture and calm motion. Avoid glassmorphism, excessive shadows, heavy parallax and constant autoplay.

### 3.4 Moodboard and reference research (mandatory design phase)

Research premium experiences **beyond boutique competitors**: editorial magazines, independent ateliers, luxury hotels, architecture studios, design-led restaurants and art portfolios. Build a reference board of 12–15 patterns annotated for what works, why it works, performance cost and mobile adaptation. Do not copy a full website or layout. Confirm licensing for any third-party imagery or fonts. Review 2–3 art directions against the existing V4 identity, then freeze one before implementation.

**Creative approval gate:** Signed-off moodboard, colour tokens, responsive type specimen, homepage storyboard, gallery prototype, and motion examples on both mobile and desktop.

## 4. Information architecture and screen-level requirements

### 4.1 Sitemap

- `/` — homepage / brand entry
- `/portfolio` — all work with category filtering
- `/portfolio/[slug]` — individual design story
- `/about` — founder and craftsmanship
- `/contact` — WhatsApp and enquiry
- `/privacy` — privacy notice, including any submitted enquiries and analytics
- `/terms` — optional policy page if appropriate
- CMS `/admin` — authenticated, not indexable

**Potential phase 2:** `/collections/[slug]`, `/journal/[slug]`, and dedicated stories. Keep URLs stable even if content IA expands.

### 4.2 Homepage (priority P0)

**Story beats:**

1. **First impression:** Editorial hero featuring a real Navodhai garment; concise positioning; primary “Explore designs” and secondary “Enquire on WhatsApp”. Prefer a strong still image before considering muted motion.
2. **Signature introduction:** Short statement on handmade craft and personal attention, with modest staggered reveal.
3. **Featured work:** Three to six curated designs, asymmetrical responsive gallery and an obvious “View all work” escape.
4. **Craft close-up:** Macro texture / stitching photographs with concise process notes.
5. **Founder story:** Authentic portrait or workspace image with a personal, specific introduction.
6. **Trust and contact:** Service location/coverage, process expectations and a clear WhatsApp CTA.
7. **Footer:** Logo, navigation, Instagram, contact, legal and copyright.

**Interactive rules:** CTA visible within first viewport; hero image must never block interaction; avoid sticky animated elements covering content; on touch, feature cards act as direct links. Content remains available with JavaScript disabled wherever feasible.

**Acceptance:** First paint communicates brand even before motion hydrates; no sideways scroll; headings readable on 320px; homepage content manageable in Payload.

### 4.3 Portfolio index (priority P0)

- Visually calm masonry-*inspired* editorial grid, but avoid unpredictable layout shifts; use known image aspect ratios.
- Filter by category with “All”, a contextual result count and shareable query parameters. Use link/GET navigation so filtering and pagination work without JavaScript; enhance transitions on the client.
- Distinguish between portrait images and detail crops; don't use every item as the same image ratio.
- Hover on pointer devices: restrained image zoom/overlay; on touch: design title/category always discoverable.
- Lazy-load lower items and provide skeletons with reserved dimensions; pagination or “Load more” before implementing infinite scroll.
- Provide useful empty states and a keyboard-accessible filter group. Preserve logical DOM, reading and focus order in the editorial grid.

**Acceptance:** Filter works with keyboard and touch; Back navigation preserves chosen filter/scroll where practical; direct links resolve for every published design.

### 4.4 Portfolio detail (priority P0)

- Image-first opening with design title, category and a one-line craft descriptor.
- Responsive gallery with full-view lightbox, thumbnail choices, zoom where appropriate, keyboard controls and close behaviour.
- Optional craftsmanship story, material notes and what makes the design distinctive; avoid fabricated descriptions.
- Related designs using hand-picked or category fallback relations.
- Primary “Enquire about this design” opens WhatsApp with a prefilled message containing design title and canonical public URL; no sensitive data embedded.
- Clear mobile sticky CTA where it doesn't obscure text or gallery controls.

**Acceptance:** Every informative image has a meaningful alternative; purely decorative images use an empty alternative. Gallery has swipe and keyboard alternatives, preserves browser pinch zoom and supports designs with 1, 3 or 10 photos. Deep-linked URLs and WhatsApp messages work without analytics.

### 4.5 About and contact (priority P0)

**About:** Short founder story, values, workshop/process imagery, not stock brand claims. Authenticity beats verbosity. Include journey back to designs and contact.

**Contact:** WhatsApp first, a visible email alternative, then Instagram. Keep the form disabled for initial MVP unless P1 is explicitly enabled. Optional form fields are name, contact, enquiry and selected design. Collect only necessary personal data; add the privacy notice, retention rule and spam controls before enabling it. Confirm success only after validated persistence and retain user input on recoverable failure. Do not promise a response-time SLA unless the boutique can support it.

**Privacy and terms:** Privacy copy is CMS-managed and published before public analytics or enquiry collection is enabled. Terms remain optional; omit their navigation and sitemap entry while disabled. Founder approves accurate business details and the chosen retention/analytics disclosures.

### 4.6 Mobile UX and navigation

- One-thumb primary navigation with a compact, high-contrast menu trigger.
- Menu overlay must trap focus, close on Escape, restore focus, and respect reduced motion.
- Fixed controls must not overlap content, cookie controls or phone browser chrome.
- Minimum comfortable touch target approximately 44 × 44 CSS pixels for primary taps.
- Design detail WhatsApp CTA accessible without aggressive intrusive floating widgets.
- All content must work in narrow layouts, low bandwidth and portrait orientation.
- Verify text at 200% zoom and reflow at 400% zoom/320 CSS pixels. Focused controls must remain visible above sticky CTAs; a pointer gesture must have a simple keyboard/tap alternative.

## 5. Motion and interaction specification

**Motion budget:** No animation is allowed to delay content visibility or input response. Use CSS for simple hover/focus; Motion for React for genuinely stateful transitions. No GSAP dependency by default; introduce it only if a prototype demonstrates a specific unmet need.

Use the pinned `motion` package, `motion/react` imports and `LazyMotion`/`m` where they reduce the initial bundle. Set the user reduced-motion preference centrally and verify equivalent non-animated behavior. React Compiler and other optional optimisations need measured benefit and the M2 regression checks before adoption.

| Pattern | Intended behaviour | Performance and accessibility guardrail |
|---|---|---|
| Hero entrance | One tasteful title/image reveal after content is ready | No blocking intro loader; no hidden content if JS fails |
| Scroll reveals | Fade/translate sections once, with mild staggering | Only opacity and transform; reduced-motion bypass |
| Image hover | 1.02–1.05 scale and title emphasis | Pointer-only enhancement; touch shows controls without hover |
| Category transition | Cross-fade or lightweight layout transition | Avoid expensive multi-item reflow animation on large grids |
| Lightbox | Smooth open/close and thumbnail transitions | Focus trap, ESC, previous/next, image dimensions reserved |
| Menu | Restrained slide/fade of navigation overlay | Focus handling, body scroll lock and reduced motion |
| Page changes | Lightweight exit/enter only if navigation remains fast | Do not block route transitions or use forced scrolling |
| Cursor treatment | Optional editorial micro-interaction for fine pointers only | Never custom-hide native cursor; remove on touch |
| Parallax | One very subtle desktop-only feature, if justified | No scroll hijack, low motion intensity, off on mobile/reduced-motion |

**Default timing tokens (test with prototypes):** micro 120–180ms; controls 180–260ms; overlays 220–360ms; editorial reveals 450–700ms. Revisit after device testing rather than treating numbers as immutable.

**Motion QA:** `prefers-reduced-motion`, tab/shift-tab flow, 60Hz low-end Android, browser Back/Forward, slow 4G, and content readable with animations disabled.

## 6. Payload CMS information model

### 6.1 Collections / globals

| Schema | Key fields | Behaviour |
|---|---|---|
| `users` | email, name, role | Admin/editor; no public registration; role changes admin-only |
| `media` | file, alt, title, credits, usageNotes, consentConfirmed, processingState, publicationApproval | Private upload collection; Payload supplies file metadata, sizes and focal coordinates; no anonymous original-file access |
| `publicMedia` | sourceMediaId, revision, defaultAlt, variants, approvedAt, publicAllowed | System-managed delivery manifest containing only approved public derivative URLs/dimensions/types/bytes; no originals, signed URLs or private notes |
| `categories` | name, slug, summary, coverMedia, sortOrder, active | Public reads active labels; deletion/deactivation guards protect referenced designs |
| `portfolioItems` | title, slug, excerpt, heroMedia, heroAlt, gallery, category, techniqueTags, craftStory, materialNotes, featured, relatedItems, sortOrder, meta | Canonical field names; drafts/autosave/versions; stable unique slug |
| `testimonials` | quote, displayName, permissionGranted, status, sortOrder | Optional; publish only with consent |
| `enquiries` | name, contact, message, itemReference, source, status, createdAt | P1; admin-only CRUD; validated public form route creates records through a narrow server operation |
| `homepage` (global) | hero, intro, selectedFeatures, storyBlocks, cta, meta | Stable curated blocks; drafts/autosave/versions |
| `aboutPage` (global) | founderIntro, founderMedia, values, processBlocks, cta, meta | About page content; drafts/autosave/versions |
| `contactPage` (global) | introduction, serviceArea, processExpectations, formEnabled, meta | Contact copy; contact destinations come from siteSettings; form disabled by default |
| `legalPages` (global) | privacyBody, privacyUpdatedAt, termsEnabled, termsBody, termsUpdatedAt | Versioned policy copy; admin publishes; privacy required at launch |
| `siteSettings` (global) | whatsappNumber, email, socialLinks, navigation, logoMedia, footer, defaultMeta | Admin-only editing; public DTO exposes safe display fields; canonical origin comes from environment |

Portfolio items and all five editorial globals use drafts/autosave/versions. They also have server-managed `publicationRevision`, `publishedMediaRefs` and `deliveryState` fields. Increment the revision on a published change or retirement, not on autosave. `publishedMediaRefs` captures approved manifest revisions for every image use, including SEO/share images and logos, so a later private crop/upload cannot silently replace a live image. `deliveryState` is idle/pending/ready/failed and includes a safe diagnostic code; ordinary API users cannot write these fields directly. Internal delivery-state updates must not trigger recursive publication jobs.

### 6.2 Portfolio item detailed field contract

- `title` (required, human-readable); `slug` (required, unique, stable after publishing); `category` (required relation); `excerpt` (recommended, max ~160 characters).
- `heroMedia` (required image relation to private media); `heroAlt` (optional contextual override); `gallery` (0–11 additional photos, ordered rows with `media`, optional `altOverride` and `caption`). One hero alone is valid; maximum 12 photos in total. Use Payload's focal point/crop metadata rather than a competing custom crop system.
- `craftStory` (optional Lexical rich text with a restricted feature/block set), `materialNotes` (optional), `techniqueTags` (optional string list), `featured` (boolean), `sortOrder` (integer).
- `_status` via Payload drafts; `publishedAt` records first publication and remains stable; `updatedAt` records subsequent changes. The SEO plugin's `meta` group contains title, description and share image. `relatedItems` excludes self and deduplicates relations.
- Allow incomplete drafts. At publication, require title, unique slug, active category, usable hero and valid media references. Every informative image use must resolve a non-empty alternative from its contextual override or approved default; decorative uses outside the product gallery explicitly use an empty alternative.
- Publishing for public release or gated media-publication preparation requires approved, processed public media manifests. The private-review path is allowed only while both release/media switches are false; it uses authenticated private media. Ordinary preview deployments never promote business files to the Internet.
- Warn on missing meta description; generate a safe title/description/share-image fallback from published data. Public related-item/category queries filter independently for publication/active state.
- Public collection queries enforce the published filter and access controls in section 6.5. Preview authenticates an admin/editor and is never served from the public cache.

### 6.3 CMS editor journeys

**Publish a design:** Sign in → Portfolio → New design → Title/category → Upload selected photos privately → Reorder/crop/describe → Write short story → Preview both viewports → Confirm permission for public photos → Publish → Verify public URL and media delivery. In private testing this remains behind the preview gate.

**Update a design:** Find item → Edit → Preview → Publish revision → Trigger cache invalidation → Check canonical URL is unchanged.

**Retire a design:** Unpublish → expire affected public caches → remove from listings, related items and sitemap → return an intentional 404. Use a permanent redirect only when there is a relevant replacement. Do not redirect every retired design to the generic portfolio.

**Editorial safeguards:** Plain-language admin labels and descriptions; restrict field types; content preview; version history; no unsafe free-form HTML; admin login restricted; protect admin from indexing.

### 6.4 Role and operation matrix

| Resource / operation | Anonymous visitor | Editor | Administrator |
|---|---|---|---|
| Portfolio read | Published records only | Drafts and published | Drafts and published |
| Portfolio create/edit/publish/unpublish | Denied | Allowed; publication validation applies | Allowed; publication validation applies |
| Hard-delete portfolio or change a published slug | Denied | Denied | Allowed only through reference/redirect safeguards |
| Categories | Read active categories | Create/edit; cannot break live references | Manage/archive/delete through guards |
| Private media and original-file downloads | Denied | Upload/read/crop; approve licensed media for publication | Same plus explicit withdrawal/archive/delete |
| Public media manifest | Read publicAllowed entries and public variants only | Inspect; cannot edit system delivery fields | Inspect; use lifecycle operations for changes |
| Homepage/about/contact editorial globals | Public DTO only | Edit/preview/publish | Edit/preview/publish |
| Legal pages and site settings | Public DTO only | Read for preview | Edit/publish |
| Users | Denied | Read/update own permitted profile fields | Manage accounts/roles |
| Versions and preview | Denied | Allowed for editable content | Allowed |
| Enquiries, if enabled | Validated form route only; no direct collection writes or reads | Denied | Read/manage/delete |
| Testimonials, if enabled | Approved quotes only | Edit; consent required before publication | Edit/publish/archive |

Set collection, global, field and `readVersions` access explicitly. The `role` field is admin-write-only; editors cannot elevate themselves through REST, GraphQL or Local API updates. Bootstrap the first administrator using a deployment-controlled seed, then keep public account creation disabled. Internal manifest writes, migrations and form persistence are narrow server operations, not permissions granted to visitors.

### 6.5 Public query and authenticated preview contract

- All public reads go through server-only functions in `lib/cms`. Collection reads explicitly set `overrideAccess: false`, `draft: false`, bounded `depth`/`limit`, selected fields and the published/active filter. Cache only their allowlisted DTOs, not Payload requests, principals or raw admin documents.
- Private media is never made readable just to populate a public relationship. Resolve public media IDs to the safe `publicMedia` manifest; its opaque source identifier is not an access credential. Public payloads must not include original filenames/URLs, storage credentials, signed preview URLs or private usage notes.
- Anonymous REST/GraphQL requests for drafts, versions, private uploads and user data are denied. Explicitly test a published record with newer draft edits, not only never-published drafts.
- Draftable globals expose public data through the server DTO layer. Deny anonymous direct global API reads. The server may use an internal published-read context with `overrideAccess: false`, `draft: false` and a published-status check; that context must never be accepted from HTTP input. Missing/unpublished content yields an intentional fallback or 404, never draft data. Required page globals cannot be unpublished after launch without a published replacement.
- Preview entry verifies the Payload session and admin/editor role server-side, verifies the preview request token and resolves an allowlisted local collection/global path. Reject external/protocol-relative redirect targets. Enable Draft Mode only after those checks.
- A Draft Mode cookie alone is insufficient authority: authenticate each preview read, pass the authenticated principal with `overrideAccess: false`, and enforce resource permissions. A logged-out or expired session cannot continue reading drafts.
- Preview pages, preview metadata and authenticated media use private/no-store responses, noindex and no shared CDN caching. Provide an exit-preview route that clears Draft Mode. Test iframe cookies and CSP with mobile/desktop Live Preview.
- Use 50 retained versions per portfolio item/editorial global initially; autosave must not trigger public promotion or cache invalidation. Respect document locks on user-driven Local API writes.

### 6.6 References, URLs and destructive content changes

- Check live documents, globals and retained versions before hard deletion of media, categories or designs. Archive is the normal operation; cleanup requires no retained reference and at least a 30-day recovery window.
- Prevent category deletion/deactivation while published designs depend on it; reassign them or explicitly retire them first.
- Keep a published slug stable. An admin correction creates an exact old-to-new permanent redirect and invalidates both paths, related links and sitemap. Reject collisions, cycles and external redirect targets.
- Resolve redirects in the frontend; the plugin stores rules but does not install HTTP routing automatically. A retired item with no replacement returns a real 404 and is removed from discovery surfaces.
- Media approval is separate from design publication. Previously approved public photographs may remain public after a design is retired; unpublishing a design cannot make already downloaded images private. An explicit media withdrawal removes public derivatives, purges controlled CDN caches and invalidates all referring pages.

## 7. Architecture and repository design

### 7.1 Logical architecture

```text
Visitor browser
    |
CDN / TLS (Cloudflare DNS & caching as appropriate)
    |
Next.js App Router + Payload (single application)
    |      |                   |
    |      +-- PostgreSQL     +-- R2 (private sources / approved public variants)
    |
Request-rendered public pages + cached published DTOs

Private phase: Vercel hosts the Next.js + Payload app.
Public phase: Self-hosted Docker / Node.js hosts the same app.
```

### 7.2 Repository layout (proposed)

```text
src/
  app/(site)/              # public pages/layouts
  app/(payload)/           # Payload admin/routes
  collections/             # typed content schemas
  globals/                 # homepage, about, contact, legal, settings
  blocks/                  # limited editorial content blocks
  components/ui/           # accessible UI primitives
  components/editorial/    # premium page components
  design-system/           # tokens, theme, motion, recipes
  lib/cms/                 # typed content queries, DTOs
  lib/media/               # image sources, loaders, transforms
  jobs/                    # durable publication, invalidation and cleanup tasks
  migrations/              # committed schema/data migrations
  lib/seo/                 # metadata, schema, sitemap
  lib/analytics/           # privacy-conscious events
  lib/security/            # validation, rate limiting
  hooks/                   # UI hooks; CMS hooks stay beside their schemas
  payload.config.ts
public/                     # only non-changing static assets
scripts/                    # backup, smoke, migration and QA
infrastructure/             # Docker, reverse proxy, deploy docs
docs/                       # plan, implementation checklist, decisions, evidence
```

### 7.3 Architecture rules

- Prefer Server Components and the protected public-query/preview functions in section 6.5; small client islands for gallery/filter/navigation/animation.
- Use Node.js-compatible dependencies only; no Vercel-only DB, auth, file storage, KV or image processing requirements.
- Use environment variables / secret store for endpoints, secrets, database URLs and R2 credentials. No secrets in `NEXT_PUBLIC_*` or repository.
- Use `@payloadcms/db-postgres` consistently; commit and test database migrations; never rely on automatic schema pushes in production.
- Use `@payloadcms/storage-s3` for private uploads from both Vercel and self-hosted Node.js. Configure R2 `region: 'auto'` and `forcePathStyle: true`. Retain Payload file access controls on the private collection; a separate publication service copies only approved derivatives to the public bucket.
- Separate local/preview/production databases, private buckets and credentials. Preview credentials cannot write production buckets. Never give an untrusted branch deployment production secrets.
- Persist publication/invalidation work through Payload's PostgreSQL-backed Jobs queue. Run committed work with retries and revision-based idempotency; never rely on a fire-and-forget promise after a serverless response.
- A CMS hook may invalidate directly when it has a valid committed request context. A separate runner calls the app's authenticated revalidation route; do not invalidate only a worker process's local cache. Log resource IDs/revisions and retry failures without logging tokens or personal data.
- Analytics and the contact form are optional. A tested CMS password-recovery route and the selected job runner are P0 dependencies; keep their providers replaceable.
- Start self-hosting with one web replica and one bounded job runner from the same source release. Adding web replicas requires shared cache/tag coordination and deployment-version checks first.

### 7.4 Required environment configuration (illustrative names)

| Name | Scope | Notes |
|---|---|---|
| `DATABASE_URL` | server | Pooled application connection; TLS verified; never exposed to client |
| `DATABASE_MIGRATION_URL` | release job | Direct or migration-compatible connection; separate migration privilege |
| `PAYLOAD_SECRET` | server | High-entropy and environment-specific; keep stable within the environment |
| `SITE_URL` | server | Canonical public origin, validated at startup; no preview/deployment hostname fallback |
| `APP_URL` | server | Actual environment origin for same-origin admin/preview callbacks |
| `PUBLIC_RELEASE` | server | Defaults false; public access/indexing release switch; private gate remains until launch |
| `MEDIA_PUBLICATION_ENABLED` | publication service | Defaults false; separately allows approved derivative promotion for a prepared production release or disposable public fixture test |
| `PREVIEW_SECRET` | server | Authenticated preview entry/token validation; never logged or emitted in public DTOs |
| `R2_PRIVATE_BUCKET` | server | Private originals and draft derivatives; public domain and r2.dev disabled |
| `R2_PUBLIC_BUCKET` | publication service | Approved production derivatives only |
| `R2_ENDPOINT` | server | Cloudflare R2 S3 endpoint, not public URL |
| `R2_ACCESS_KEY_ID` / `R2_SECRET_ACCESS_KEY` | server | Scoped to intended environment/bucket operations; browser receives only short-lived upload authorisation |
| `R2_PUBLIC_URL` | server; approved URLs appear in DTOs | Production media custom domain; never used for private originals |
| `REVALIDATION_SECRET` | server/runner | Authenticates runner-to-app invalidation; validate timestamp/signature and reject replay |
| `JOBS_SECRET` | server/cron | Authenticates bounded job-runner requests; no public queue-management access |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASSWORD` / `EMAIL_FROM` | server | Production-capable CMS recovery adapter; use local mail capture in development |
| `ANALYTICS_ENABLED` | deploy | False for private testing and until provider/privacy settings are complete |

Contact destinations are maintained in `siteSettings`; environment variables do not provide a competing source of truth for the public WhatsApp number.

**Build/runtime contract:** Do not use `NEXT_PUBLIC_SITE_URL`. Generate canonical URLs and client-safe contact/media configuration on the server, and pass them as props/DTOs. Runtime settings must not be captured during static generation. Any future `NEXT_PUBLIC_*` value is a build-time constant and requires rebuilding for a new value. Scope cache keys to environment, release/media mode and canonical origin.

The media and public-release switches are independent: a gated production environment may prepare explicitly approved public photographs before DNS cutover while pages remain private and noindex. Ordinary preview deployments keep both false. A disposable promotion test may enable media publication for rights-cleared fixtures only; its credentials cannot access production.

**Upload caveat:** Use Payload S3 `clientUploads` into private storage to avoid the serverless upload-body limit. Allow only the intended admin origins and necessary CORS `PUT`/read methods, `Content-Type` and `If-None-Match` headers. Direct upload does not prove that subsequent validation, Sharp processing, memory use or retries fit the runtime: the complete flow is an M2 gate.

### 7.5 Cache, invalidation and publication visibility

The initial implementation caches public DTO query results through a single `lib/cms` adapter using tagged `unstable_cache`, as used by the Payload 3 website template. Set a 60-second revalidation interval as a backstop. Keep Cache Components disabled initially; replacing the adapter with `use cache` requires a recorded compatibility check of all admin and preview routes.

Serve public pages through request-time rendering initially. A small uncached publication/visibility check must exclude retired records and withdrawn media before cached DTOs are rendered or used for metadata. Reconcile cached lists against current allowed IDs; bypass stale data when its publication revision is incompatible. Request-local memoisation can deduplicate these checks. This protects withdrawal even when an invalidation job is delayed.

| Change | Data tags / affected surfaces | Required behavior |
|---|---|---|
| Design publish/edit | `portfolio`, `item:<id>`, `slug:<slug>`, `homepage`, `related`, `sitemap` | Delivery target ≤120 seconds under normal operation, including runner cadence; private drafts do not invalidate |
| Design unpublish/delete | Same tags plus previous slug/category references | Next request excludes the record through the visibility check; expire cached entries with `revalidateTag(tag, { expire: 0 })` |
| Category label/order/active change | `categories`, `portfolio`, `homepage`, `related` | Update labels, filters, counts and referring pages; enforce reference guards first |
| Homepage/about/contact/legal global publish | `global:<slug>`, affected route metadata and `sitemap` | Refresh published content only |
| Site settings publish | `settings`, shared navigation/footer/contact and metadata consumers | Refresh every consumer of the changed public fields |
| Media approval/replace/withdrawal | `media:<id>` and all referring item/global tags | Immutable new URLs on replacement; withdrawal also deletes/purges controlled public copies |
| Slug/redirect change | `redirects`, old/new slug tags and `sitemap` | Exact redirect resolves; old cached page cannot remain canonical |

- Dispatch durable invalidation work after the content transaction commits. Queue jobs with the same transaction/request where supported and verify a runner on a separate connection cannot consume uncommitted work. An old retry must not restore an older published revision.
- Use blocking expiry for removal/withdrawal, not stale-while-revalidate. `updateTag` is Server Actions-only; use the current `revalidateTag` signature in hooks/Route Handlers. Direct invalidation and retry must follow the same tag map.
- Show editors processing/pending/failed delivery status when publication work is outstanding. Do not report successful delivery just because a database write succeeded. A failed replacement preserves the last valid public revision.
- Enable an authenticated Vercel cron runner at one-minute cadence for the private phase; use an equivalent single scheduled runner/worker on self-hosting. Bound work per run, alert on terminal failures or queue age above five minutes, and include retry/restart in the M2 proof.
- Exclude HTML, RSC responses, API/admin, preview and authenticated downloads from shared Cloudflare caching initially. Cache only approved immutable media/static assets. Do not apply a catch-all cache rule to the Next.js app.
- Persist the single web instance's Next.js data cache on an appropriate writable volume, scoped to release/environment. Multi-instance hosting needs coordinated caches and invalidation before enabling another web replica.

### 7.6 PostgreSQL connection and migration contract

- Use a managed PostgreSQL service independent of the application host for both phases initially. Keep PostgreSQL 18 as the common major; an older supported provider major needs an explicit compatibility decision before provisioning.
- Choose database/app regions together and measure round-trip latency and page TTFB before moving the web host; a portable connection string does not eliminate network latency.
- Reuse Payload initialisation within each process. Start with an application pool maximum of three connections per process and size total concurrency against the provider's actual limit, including the runner, migrations and headroom. Record measured connection peaks and cap deployment concurrency accordingly.
- Verify TLS certificates. Use pooled app connections and the provider-supported migration connection; do not assume every transaction pool supports schema migration or session features identically.
- Generate and commit migrations. Verify both a fresh database and an upgrade of a previous-release fixture. Run migrations once in a controlled release job before traffic is sent to the new application; application replicas must not race to migrate.
- Build against a disposable, schema-correct build database when prerendering or Payload initialisation requires one. CI build jobs do not mutate production. Bundle the migration CLI/files and job runner in a tested release image/stage rather than assuming the minimal standalone web image contains them.
- Prefer additive changes compatible with the previous image. Back up before destructive migrations, test data preservation and record whether application-only rollback remains possible.

## 8. Media pipeline and image quality

### 8.1 Workflow

1. An authenticated editor uploads a selected photograph into the environment's private R2 bucket using an authorised, bounded client-direct upload. Keep public domain/r2.dev access disabled on that bucket.
2. Validate actual file bytes, allowed type, dimensions, size and decoded pixel limits. Reject invalid content, clean up incomplete uploads and use opaque safe storage names.
3. Generate private responsive derivatives with Payload 3 `upload.imageSizes` and Sharp. Track `processingState` as queued/processing/ready/failed; bound processing concurrency and support idempotent retry. R2 stores files; it does not resize or transcode them by itself.
4. Store private source/size metadata in `media`. Serve editor/preview requests only after Payload authentication, with private/no-store responses or short-lived authorised downloads. Keep signed URLs out of logs, public metadata and cached DTOs.
5. The editor confirms rights/consent and approves a specific media revision for public use. Approval explicitly authorises public photograph exposure, independently of whether a related design is still a draft. Explain this in the admin control.
6. Only when `MEDIA_PUBLICATION_ENABLED=true`, publish approved processed derivatives into the separate public R2 bucket under immutable content-hashed keys. Verify variants before marking the `publicMedia` manifest ready. Never copy the source original or private notes. Ordinary private review records approval without promotion; the only preview promotion test uses explicitly approved disposable fixtures.
7. When either public release or media publication is enabled, publish a design only when its required manifests are ready and capture their revisions in `publishedMediaRefs`. Only when both switches are false may publishing use authenticated private review. A processing/promotion failure blocks new public publication and preserves any previous valid public revision.
8. Public DTOs resolve approved derivative URLs from `publicMedia`; private review resolves protected media instead. Serve production derivatives through `media.<domain>` with correct MIME types/dimensions and immutable URLs.
9. Replacing or recropping an image creates a new revision and new URLs. Keep earlier referenced revisions available for version restore. Explicit withdrawal changes manifest visibility, removes controlled public objects, purges CDN copies and invalidates referring pages; it cannot recall images already downloaded by visitors.

The private upload collection retains Payload's file access controls. Do not apply `disablePayloadAccessControl: true` to it. Public access is through approved delivery manifests and derivative storage, not through its original-file route. No confidential source file may enter a public bucket, including during failed publication.

### 8.2 Content standards

- Shoot a coherent set: front garment view, craftsmanship macro, full silhouette, close-up of stitching and optional process shot.
- Crop intentionally; no distorted scaling. Keep textile colour accurate. Avoid aggressive compression or filters that misrepresent garments.
- Hero can be a carefully selected static image; video is optional and should not start with audio.
- Keep public video disabled for the initial image-led release. If enabled later, use short compressed clips with poster images, an explicit byte/duration budget, controls and caption/transcript treatment where applicable; verify the same approval/storage lifecycle.
- Establish a media rights checklist and avoid publishing customer photos without consent.

### 8.3 Media release acceptance

- Approved public assets return 200 with correct content types, cache headers and dimensions; private originals and unapproved assets remain inaccessible anonymously.
- Image gallery does not shift layout or fetch originals for grid thumbnails.
- In CMS, uploading, cropping/reordering, approval, replacement, withdrawal and version restoration behave predictably.
- Broken/missing image handling is graceful; mobile on slow connection remains usable.
- A file above 4.5 MB completes upload, server validation, image sizing and authenticated preview on Vercel and Docker. Test interrupted upload, invalid file bytes, processing failure, promotion failure and retry without duplicate public revisions.
- Confirm direct private-file URL requests and anonymous REST/GraphQL media requests fail even when a published design references the photograph.

### 8.4 Formats, budgets and asset recovery

| Area | Initial contract |
|---|---|
| Accepted photo input | JPEG, PNG and WebP; maximum 20 MB, 40 megapixels and 9,000 pixels on either axis; validate server-side |
| HEIC/HEIF, RAW, animated images and uploaded SVG | Reject clearly in MVP with instructions to export JPEG/PNG; approved brand SVGs remain reviewed repository assets |
| Output | sRGB-oriented WebP plus JPEG/PNG fallback as appropriate; retain accurate garment colour; remove EXIF/GPS and personal filenames from public derivatives |
| Derivative widths | 480, 768, 1280, 1920 and 2400 pixels without enlarging a smaller source; publish only useful sizes |
| Transfer targets | Thumbnail ≤80 KB; card ≤150 KB; mobile hero ≤250 KB; desktop hero ≤450 KB; lightbox frame ≤800 KB |
| Initial route budgets | Public route JavaScript ≤180 KB gzip excluding CMS; first-viewport image transfer ≤500 KB on mobile; investigate any exception against the LCP target |
| Loading | Explicit responsive sizes/aspect ratios; lazy below fold; load the chosen LCP image eagerly/high priority or selectively preload it; no deprecated `priority` prop |
| Image component | Restrict `remotePatterns` to the intended public media host/path; use a loader/srcset that selects prepared sizes and avoids redundant image transforms |
| Public cache | Immutable revisioned URLs; browser max-age one day and CDN cache up to one year with tested purge on withdrawal |
| Incomplete upload cleanup | Private unreferenced upload objects older than 24 hours may be removed after checking no active upload/job owns them |
| Referenced asset retention | Archive instead of overwriting/deleting; retain while any live document/retained version references it and for at least 30 days after its last reference |

Byte/bundle budgets are initial engineering targets to verify in M1/M2 and on real content; document any measured adjustment without sacrificing textile colour or resolution blindly. Processing limits are hard input bounds. Test high-detail cloth, transparent logos, orientation metadata and the smallest supported source.

Back up originals and the manifest/approval state independently of the public CDN. Rebuild derivatives from private originals if necessary, and restore visibility only after checking current approvals/withdrawals. A database version rollback cannot recreate a permanently deleted original.

## 9. Deployment plan: private Vercel → self-hosted public

### 9.1 Phase A — private Vercel testing

1. Create private Git repository and CI (lint/typecheck/unit/build/e2e smoke).
2. Create an independent managed PostgreSQL database and a private R2 bucket with non-production credentials. Do not give the private deployment a production public-bucket writer.
3. Deploy Next.js + Payload to Vercel using the same Node.js-compatible adapter packages intended for self-hosting.
4. Protect every testing URL, including production-style Vercel aliases and branch deployments. Default to Vercel Authentication for the founder/developer and verify access on the selected commercial plan. A share link is a bearer credential and must be revocable. Founder signs into Payload for protected draft/media review. Do **not** rely on `robots.txt` or `noindex` as security controls.
5. Add `noindex` response metadata/headers for private test pages; protect `/admin` separately through Payload authentication.
6. Define budgets and alerts. **Vercel Hobby is restricted to personal/non-commercial usage**, so select an appropriate account tier for a boutique business project.
7. Run a Docker build locally/in CI throughout the private phase to prevent Vercel-only assumptions.
8. Set `PUBLIC_RELEASE=false`, `MEDIA_PUBLICATION_ENABLED=false` and analytics off for ordinary review. Configure the authenticated one-minute job runner, CMS recovery email and environment-specific origins. Verify no private bucket has public domain or r2.dev access; use a separate approved-fixture setup for the M2 public-promotion test.

### 9.2 Phase B — prepare self-hosting (before public launch)

**Selected baseline:** Linux VPS, pinned Node 26 LTS image, Docker Compose, HTTPS reverse proxy, independent managed PostgreSQL 18, a single web replica, a bounded Payload job runner, scheduled off-server backups and monitoring. Keep the database managed through the first app-host cutover; moving it onto the VPS is a separate future decision. Size the server using measured image-processing memory and page load tests.

- Create production secrets, storage bucket/media domain and database instance.
- Build a production `standalone` Next.js web image and a tested release/runner image or stage from the same commit. Include `public` and `.next/static`, native Sharp and required migrations/jobs assets. Run as a non-root user and provide only the necessary writable cache paths.
- Configure health endpoint, graceful shutdown, restart policy, resource limits, log rotation and structured request logs.
- Restrict firewall ports; expose 80/443 only externally where possible; database private network only.
- Configure and test a transactional email adapter for CMS password recovery before founder onboarding. Verify sender DNS and reset-link origin, expired/used-token behavior and account recovery even when the optional contact form is disabled.
- Validate deployment scripts, restores and rollback on an isolated staging domain.
- Run a fresh/upgrade migration rehearsal, boot both web and runner, verify job auth and exercise publication/invalidation from the runner into the web process.
- Build images without production database writes. Use a controlled migration release job, then deploy the application only after migration success and readiness checks; preserve previous-image schema compatibility where possible.

### 9.3 Cutover runbook (do not skip)

| Order | Action | Verification |
|---|---|---|
| 1 | Freeze content changes during cutover window | Founder knows editing pause and time |
| 2 | Back up PostgreSQL and private media; verify isolated restore and approved content inventory | Records, users, versions, hashes and media references reconciled; restored environment remains private |
| 3 | Prepare production database/storage credentials and buckets; export the approved content/source inventory with both release/media switches false | Record approved published revisions and source hashes; originals stay private; preview credentials have no production access |
| 4 | Build the reviewed commit and load production data in schema-compatible order: fresh DB migrates before import; restored DB applies pending migrations after restore; then boot web/runner privately | Migrations run once; imported references reconcile; health, job auth, CMS login/recovery pass; database major unchanged |
| 5 | Keep production app gated with `PUBLIC_RELEASE=false`; enable `MEDIA_PUBLICATION_ENABLED`, materialise approved variants and run publish/update/unpublish/job/redirect/access checks | Every live image has a verified manifest from its published revision, not newer draft edits; originals stay private; withdrawal/invalidation/retry pass |
| 6 | Set canonical origin, policy copy, sitemap, robots, headers and analytics settings; rehearse the release switch privately | Canonicals never use preview URLs; private index protection remains active until launch |
| 7 | Switch DNS and deliberately enable `PUBLIC_RELEASE` with the release gate | HTTPS, approved media, enquiry, admin and intended indexability pass; remove only the public site access gate |
| 8 | Monitor logs, Web Vitals, 5xx and DB connections | No critical errors or regressions |
| 9 | Retire/lock down Vercel private build after validation | No stale duplicate publicly crawlable |

**Rollback:** Preserve the previous DB backup, Docker image and deployment configuration. If writes occur after cutover, do **not** blindly revert the DB: assess data divergence first. Prefer rollback of application image only where schema compatibility is guaranteed.

### 9.4 Database placement decision

**Selected first-launch default:** PostgreSQL is an independent managed service from day one and stays managed while the web application moves. Keep preview/production databases and credentials separate. Promote only approved content through a tested import/restore mapping; do not copy temporary preview users, tokens or form data into production blindly.

If migrating database hosts later, rehearse `pg_dump`/`pg_restore`, restore required extensions/users, verify server/client versions, compare record counts and reconcile media/URL mappings. Do not bind the content model to a vendor-specific database API.

### 9.5 Backup, recovery and operational ownership

- Developer operates deployment, weekly dependency review, monitoring and restores; founder owns content correctness, public-media rights and business contact details. Record the actual recovery contact before launch.
- Initial internal targets are recovery point ≤24 hours and recovery time ≤4 hours for a complete app/database/media restore. These are engineering targets to demonstrate, not a promised customer SLA.
- Take daily encrypted off-server database backups with 30-day retention. Keep at least one independent backup of private originals and approved manifest/withdrawal records on the same schedule; public R2 storage alone is not a backup.
- Record backup success, age, object counts and checksums. Alert when backups are older than 24 hours. Test recovery during M2/M5 and monthly after launch, including a missing/deleted photograph and a version that references an older revision.
- Restore into a private environment first. Reconcile publication approvals and withdrawal records before enabling public delivery; a restore must not republish withdrawn media or expose old drafts.
- Preserve previous release images/configuration and migration compatibility notes. Application-only rollback is preferred; a database rollback needs an explicit divergence review if new writes exist.
- Monitor uptime, 5xx/errors, queue age/failures, DB pool usage, backup age, storage growth and memory during image processing. Redact credentials, contact-form content and preview/download tokens from logs.

## 10. SEO, discoverability, analytics and trust

- Site-wide SEO defaults plus the SEO plugin's page-level `meta` fields; Open Graph images and canonical metadata use published DTOs only.
- Generate `sitemap.xml`, `robots.txt`, and appropriate `noindex` for private builds; make public launch indexable deliberately.
- Structured data only for facts the business can substantiate (e.g., business details); don't invent ratings, reviews, pricing or location claims.
- Use context-appropriate alternatives for every informative image and empty alternatives for decorative images; avoid stuffed keywords and duplicate captions.
- Basic discoverability: brand name consistency across website/Instagram/WhatsApp; Coimbatore/service-area language only where accurate.
- Track privacy-respecting page views, portfolio visits, category changes and outbound enquiry intent. Analytics is off in private testing and until the provider/disclosures are selected; the public launch gate includes that decision.
- Publish the privacy notice before enabling public analytics or the form. If the P1 form is enabled, delete closed/spam enquiries after 90 days initially unless a separately approved business process requires them; keep personal data out of analytics.
- Build a useful 404 and error state consistent with the visual system.

### 10.1 URL, sitemap and analytics contract

- `SITE_URL` is the only canonical-origin source. Preview hostnames and request `Host` headers cannot become canonical URLs or WhatsApp design links.
- Sitemap includes published designs and enabled published pages only; exclude admin, API, preview, filtered query variants and disabled terms. Set a documented canonical for portfolio filters; do not create crawlable duplicate category combinations.
- Give every published page a title/description/share-image fallback and validate structured data against real business facts. A retired page returns a real 404 unless an exact relevant replacement redirect exists.
- Events are `page_view`, `portfolio_view`, `category_filter_changed`, `whatsapp_enquiry_intent` and, only if enabled, `contact_form_submitted`. Allowlisted properties are item ID, category slug and CTA placement; exclude form text, email, phone, names, preview tokens and signed URLs.
- Fire WhatsApp intent without delaying navigation. Fire form submission only after a persisted record exists, deduplicate retries and treat notification email delivery separately.
- Choose the analytics provider and any consent behavior in ADR-11 before public enablement; use links rather than third-party social embeds initially. Record retention/access/deletion settings in the privacy copy.

## 11. Security, compliance and operational quality

### 11.1 Controls

- Strong CMS credentials, HTTPS, secure cookies, explicit collection/global/field/version access and protected private-file routes. Keep direct anonymous writes disabled; the optional form uses a bounded validated server endpoint.
- Validate and sanitize rich text, file types, uploads, form fields and URLs; add anti-abuse rate limiting and bot mitigation.
- Keep private originals, credentials and draft endpoints inaccessible anonymously. Short-lived preview/download tokens remain private and are redacted from logs; an authorisation token is not a substitute for the role check.
- Separate environment secrets, DBs and media assets; disallow production use of local or preview credentials.
- Apply security headers and a restrictive CSP for the actual media/font/analytics origins. Permit same-origin Live Preview framing; a global frame-deny rule must not break the editor's preview.
- Follow the database/media backup, retention, withdrawal and restore policy in section 9.5.
- Observability: structured server logs, health checks, uptime, errors and real-user performance.

### 11.2 Quality testing matrix

| Area | Minimum test scenarios |
|---|---|
| Responsive | 320px, 375px, tablet, laptop and wide display; orientation changes |
| Browsers | Chrome, Safari and Firefox recent versions; Android and iOS actual devices |
| Accessibility | Keyboard, visible/unobscured focus, screen reader landmarks/status, contrast, per-image alternatives, 200% text zoom, 400% reflow, reduced motion |
| Media | >4.5 MB direct upload, byte/type/pixel bounds, private original rejection, crop/variants, interrupted processing/promotion, 1/3/10-photo gallery, withdrawal and old-revision restore |
| CMS | Bootstrap/login/reset, every global/page, incomplete draft/autosave/preview/publish/unpublish, expired preview session, role escalation rejection and document locks |
| Routing | Deep links, no-JS filter/pagination, Back/Forward, real 404, relevant redirects without cycles, canonical origins and published-only sitemap |
| Contact | WhatsApp prefill encoding, phone format, form invalid/success/error, spam mitigation |
| Hosting | Protected Vercel aliases and cron, single-instance Docker web/runner, fresh/upgrade migration, DB pool peak, runtime origin change, complete backup/restore and rollback |
| Performance | Repeatable launch lab runs and byte budgets; low-end device interaction/jank; postlaunch real-user collection tested without claiming unavailable field results |
| Security | Anonymous/user/editor/admin matrix, published record with newer draft, global/version/REST/GraphQL/file paths, preview/CDN isolation, file validation, rate limiting and dependency/secret checks |
| Cache/jobs | Publish/edit/unpublish/delete/global/media/redirect tag map, post-commit ordering, runner restart, retry idempotency, stale cached record rejection and failed delivery status |

### 11.3 Manual accessibility and optional form acceptance

- Test skip navigation, semantic headings/landmarks, labelled controls, visible/unobscured focus, menu/lightbox focus return, Escape and previous/next controls.
- Test 200% text zoom and 400% reflow without losing controls or ordinary content. Preserve browser pinch zoom; provide alternatives to swipe, drag and hover.
- Check normal text contrast at 4.5:1, large text at 3:1 and meaningful non-text controls at 3:1. Keep the 44 CSS pixel primary touch target design goal.
- Use manual VoiceOver/TalkBack checks for navigation, category result announcements and gallery controls. Automated accessibility checks complement these flows; a Lighthouse score is not a conformance result.
- Permit password managers and paste in CMS authentication. Verify clear field errors and programmatically announced submission success/failure.
- If enabling the form, cap body/field lengths, validate contact/reference data, apply shared rate limiting and bot mitigation, and persist before returning success. Notification recipients are fixed server-side; user input must not create an email relay. Record who can read/delete enquiries and test the 90-day cleanup rule.

## 12. Delivery roadmap and work packages

**Execution approach:** Follow the ordered packages in the [implementation checklist](implementation-checklist.md). Freeze the product flows and visual direction before frontend implementation. Work vertically, screen by screen; complete each package's evidence and exit checks before starting its dependent package. A written specification is not implementation evidence.

### Ownership, effort and cost controls

| Milestone | Accountable owner | Planning effort | Dependency |
|---|---|---|---|
| M0 discovery | Founder for inputs/brand; developer for technical/cost record | 2–3 developer days plus founder input | None |
| M1 prototype | Developer/designer; founder reviews business/brand fit | 3–5 days | M0 |
| M2 foundation and integration proof | Developer | 6–9 days | M1 |
| M3 public screens | Developer; founder reviews real copy/images | 8–12 days | M2 gate passed |
| M4 content and quality | Founder for content; developer for verification | 3–5 days | M3 |
| M5 release and handover | Developer operates; founder owns launch/content decision | 2–3 days plus monitoring window | M4 |

These are initial effort estimates for one developer, not delivery commitments or vendor quotes. Re-estimate after M2; content delivery, account access and external review time are additional dependencies.

Before paid resources are provisioned, founder records numeric monthly caps and currency for (a) private testing and (b) public operation, including any overlapping staging period. Developer records current vendor quotes, cancellation/retention terms and the combined app, database, media, backup, email, domain and monitoring cost in ADR-12. Configure budget notifications at 70% and 90% where supported and record any service without an enforceable spending limit. No price is assumed from this document.

### Milestone M0 — Discovery and scope freeze

- [ ] Audit approved V4 brand assets, actual fonts/licences and copy tone.
- [ ] Inventory available real product photographs and founder imagery.
- [ ] Collect 12–15 annotated visual references and 2–3 art directions.
- [ ] Agree sitemap, must-have sections, CMS owner journey and acceptance criteria.
- [ ] Record the selected technical defaults and collect remaining business inputs from section 16: contact details, domain/sender identity, photo rights, reviewer accounts and numeric phase budgets.
- [ ] Record actual vendor costs and owners before provisioning resources; keep provider choice separate from the fixed portable interfaces.

**Gate:** Brand/assets inventory, moodboard, IA, named content/recovery owners, business contact inputs and cost/hosting decision record complete. Missing assets or budget inputs remain visible dependencies, not invented values.

### Milestone M1 — Design foundation and clickable prototype

- [ ] Create semantic colour/type/spacing/motion tokens from V4.
- [ ] Create mobile/desktop wireframes for all MVP pages and core empty states.
- [ ] Build interactive prototype for homepage scroll story, portfolio filters, detail gallery, menu and WhatsApp CTA.
- [ ] Review usability with founder: add a design, discover a design, enquire about it.
- [ ] Test motion fallback, keyboard navigation and basic contrast early.
- [ ] Record responsive image crops, initial transfer budgets, text alternatives and native/no-JavaScript navigation behavior.

**Gate:** Design freeze for MVP screens and signature interactions; documented responsive specs.

### Milestone M2 — CMS and infrastructure foundation

- [ ] Install the compatible pinned baseline, Biome configuration, lockfile, type generation and CI; build the same source as Docker web/release images.
- [ ] Implement all canonical collections/globals, field-level role controls, incomplete drafts, autosave, retained versions, account recovery and authenticated Live Preview.
- [ ] Implement public DTOs, published/global/version/file access controls and a tested anonymous/editor/admin matrix.
- [ ] Complete private direct upload, validation, responsive processing, approval, public derivative promotion and manifest delivery using approved test fixtures.
- [ ] Implement the publication visibility check, invalidation map, durable jobs/runner, failure status, retry and old-revision protection.
- [ ] Verify runtime canonical-origin configuration, database pools and fresh/upgrade migrations with separate build/release privileges.
- [ ] Protect Vercel aliases and cron, set private release defaults, log safely and rehearse database/media restore.

**Gate:** On protected Vercel and Docker, demonstrate upload above 4.5 MB → crop/derivatives → authenticated mobile/desktop preview → approved test-media promotion → publish → next public-view refresh → edit/draft isolation → unpublish/withdrawal. Test anonymous original-file/draft/version rejection, expired preview, failed processing/job retry, password reset and database/media restore. Use a disposable public fixture bucket for the promotion proof; private business images stay private. Attach source commit, versions and evidence before M3 starts.

### Milestone M3 — Crafted frontend implementation

- [ ] Build site shell, responsive navigation/footer, SEO and accessibility foundations.
- [ ] Implement homepage and about visual modules using their dedicated editorial globals.
- [ ] Implement portfolio responsive gallery/filter and design detail/lightbox.
- [ ] Implement contact and legal pages, visible email fallback, native metadata/redirect resolution, and WhatsApp intent tracking.
- [ ] Add motion only after layouts/media are stable, verify reduced-motion.

**Gate:** End-to-end visitor flow passes mobile usability review.

### Milestone M4 — Content and quality

- [ ] Publish 8–12 production-ready designs with accurate copy and alt text.
- [ ] Recheck the M2 media/cache contracts with production-sized content; do not defer their initial implementation to this milestone.
- [ ] Test performance, keyboard/screen reader, browsers, mobile devices, errors.
- [ ] Verify privacy/policies, analytics intent/submission semantics and retention; keep the optional form/video disabled unless their own acceptance checks pass.
- [ ] Conduct founder CMS usability session without developer assistance.

**Gate:** Launch acceptance checklist signed off.

### Milestone M5 — Self-host migration and public launch

- [ ] Rehearse Docker web/runner deployment, release migrations and complete database/media restore in staging.
- [ ] Run migration/cutover procedure with a reversible release plan.
- [ ] Configure real domain, HTTPS, DNS, SEO indexing and monitoring.
- [ ] Run public smoke suite immediately after DNS cutover.
- [ ] Review early behaviour and prioritise only evidence-driven refinements.
- [ ] Monitor the first 24 hours operationally and schedule the first available 28-day real-user performance review.

**Gate:** Public site stable; CMS editable; backups and operational runbook verified.

## 13. Release acceptance checklist

### Visitor experience

- [ ] Brand and first action are recognisable in recorded prelaunch mobile usability/lab checks; laboratory performance meets section 2.3 and measured media budgets. Field p75 validation is tracked after launch.
- [ ] All MVP pages work on mobile and desktop with no horizontal overflow.
- [ ] Portfolio supports direct linking, filter navigation and meaningful details.
- [ ] Motion has a purpose, remains smooth, and disables cleanly for reduced motion.
- [ ] WhatsApp enquiry contains the correct design context and works on phone and desktop fallback.
- [ ] Forms, if enabled, provide clear success/failure messages and never leak personal data.
- [ ] Email fallback, Privacy and enabled Terms content are correct; every informative image has an alternative, and zoom/reflow/unobscured-focus/manual screen-reader checks pass.
- [ ] No-JavaScript navigation/filtering, intentional 404s, relevant redirects and published-only canonical/sitemap data pass.

### Founder/editor experience

- [ ] Founder can add, edit, reorder, preview and publish portfolio items independently.
- [ ] Image upload works for real files, including sizes above typical serverless proxy limits.
- [ ] Published edits revalidate every affected surface; unpublishing excludes cached records on the next request and invalidation/retry runs after commit.
- [ ] Drafts, newer draft revisions, versions, private original-file URLs and protected globals remain inaccessible anonymously through every public surface.
- [ ] Homepage, About, Contact, legal copy and site settings are editable through the intended roles, with preview/autosave/restore behavior verified.
- [ ] Editors cannot change their role, manage enquiries or bypass publication/deletion safeguards; CMS password recovery succeeds.
- [ ] Processing/promotion failure preserves the valid public revision and presents a recoverable delivery status.

### Operations

- [ ] PostgreSQL and private-media backup restore, record/reference counts, checksums and internal recovery targets validated.
- [ ] Only approved R2 derivatives are public through the intended custom domain; originals, private notes and download/preview secrets are absent from public responses.
- [ ] Docker self-hosted deployment is reproducible from tagged source commit.
- [ ] SEO indexability is deliberately enabled only at public launch.
- [ ] Monitoring, logs, TLS, rollback decision and security checks pass.
- [ ] Fresh/upgrade migrations, runner restart/retry, pool limits and runtime origin changes pass without production writes from build jobs.
- [ ] Named operational owner, numeric phase cost caps, budget notifications, verified recovery contact and restore schedule are recorded.

## 14. Product backlog with priorities

| ID | Priority | Feature | MVP acceptance summary |
|---|---|---|---|
| NAV-01 | P0 | Brand tokens and responsive shell | V4 identity consistent across layouts |
| NAV-02 | P0 | Homepage editorial story | Hero, featured, craftsmanship, founder, CTA complete |
| NAV-03 | P0 | Portfolio listing | Category filtering and responsive reserved images |
| NAV-04 | P0 | Portfolio detail/gallery | Accessible lightbox, media, story, WhatsApp deep link |
| NAV-05 | P0 | About/contact/legal | CMS-backed story, email/WhatsApp routes and published privacy copy |
| NAV-06 | P0 | Payload CMS and roles | Editor can preview and publish; drafts protected |
| NAV-07 | P0 | Private/public R2 media lifecycle | Private direct uploads, processing/approval, public derivatives, retry/withdrawal/restore |
| NAV-08 | P0 | SEO and analytics | Published-only canonical/sitemap data, accurate enquiry intents and privacy settings |
| NAV-09 | P0 | Private Vercel preview | Auth-gated, noindex, independent non-prod data |
| NAV-10 | P0 | Self-host production release | Docker staging, migration, HTTPS, backups and smoke suite |
| NAV-11 | P1 | Testimonials | Consent-aware editorial quotes |
| NAV-12 | P1 | Optional contact form | Validated private storage, anti-spam, user feedback |
| NAV-13 | P1 | Collection landing pages | Curated category stories with stable routes |
| NAV-14 | P2 | Journal and process stories | Searchable, SEO-aware written features |
| NAV-15 | P2 | Boutique operations integration | Distinct app boundary and explicit API contracts |
| NAV-16 | P0 | Reproducible stack and tooling | Exact compatible pins, Biome, type generation, lockfile and CI |
| NAV-17 | P0 | Public-query and preview isolation | Access controls cover Local/REST/GraphQL/global/version/media paths and expired sessions |
| NAV-18 | P0 | Complete editorial globals | Homepage/about/contact/legal/settings contracts and role-specific publishing |
| NAV-19 | P0 | Cache and durable publication jobs | Post-commit invalidation, live visibility check, bounded runner, revision-safe retries |
| NAV-20 | P0 | Recovery and release pipeline | CMS reset, fresh/upgrade migration, DB/media restore and tested rollback |
| NAV-21 | P0 | Reference and URL lifecycle | Safe archive/delete, relevant redirect resolution, no broken retained media versions |
| NAV-22 | P0 | Operational and cost handover | Named owners, numeric budgets, alerts, recovery contact and measured evidence |

## 15. Risks, choices and trade-offs

| Risk | Impact | Mitigation |
|---|---|---|
| Overdesigned scroll animation | Performance and accessibility regression | Motion budget, device QA, reduced-motion, cut low-value effects |
| Founder's CMS is too complex | Low content publishing adoption | Curated fields, limited blocks, task-based usability testing |
| Vercel-specific services creep in | Harder self-host migration | Portable adapters; Docker build in CI from milestone M2 |
| Images are slow or huge | Mobile exits and poor Web Vitals | M2 processing proof, responsive variants, measured byte budgets and eager LCP image |
| Private previews are exposed | Premature indexing / data leak | Real auth gate, environment separation, noindex as secondary |
| Database migration loses content | Broken portfolio | Rehearsed backup/restore, freeze, record count and media checks |
| Content is insufficient at launch | Beautiful but untrustworthy site | Real photography and copy readiness milestone |
| CMS or cache exposes drafts/private media | Private work leakage | Explicit Local API options, private originals, safe DTOs, publication visibility check and access-matrix tests |
| WhatsApp is only channel | Lost enquiries for non-WhatsApp users | Alternate email/contact method; optional basic form |
| Latest package or unversioned example is incompatible | Broken install/build or wrong access defaults | Dated pin matrix, GraphQL 16 exception and Payload v3.93-specific source/type checks |
| Publication work is lost or retried out of order | Stale pages or an older revision replacing current work | Durable queue, post-commit processing, revision guards and failed-delivery status |
| Versions survive but referenced media was deleted | Restore produces broken images | Reference-aware archive, retained originals and database/media restore drill |
| Builds or migrations target the wrong environment | Unexpected production changes | Disposable build DB, controlled release migration job and environment-specific credentials |
| Operating costs grow unnoticed | Budget overruns | Combined phase cap, storage/queue monitoring and named cost owner |

## 16. Decision register and remaining inputs

Technical defaults marked selected can be implemented under this plan; they do not require repeated permission requests. A selected design is still subject to its integration gate. Pending business/account values are concrete dependencies to collect by the listed milestone; do not invent them or treat missing input as approval.

| ID | Decision / input | Selected default or remaining action | Owner | Due / status |
|---|---|---|---|---|
| ADR-01 | Original V4 identity | Locate approved assets; extract exact values and licences | Founder + developer | M0; input pending |
| ADR-02 | Testing PostgreSQL | Independent managed PostgreSQL 18.6; choose provider/region within recorded cap | Developer + founder | Default selected; provider M0/M2 |
| ADR-03 | Launch database placement | Keep production PostgreSQL managed through first web-host cutover | Developer | Selected; verify M2/M5 |
| ADR-04 | Private review access | Vercel Authentication plus Payload login for protected content/media; verify reviewer account/plan and cron access | Founder + developer | Default selected; access proof M2 |
| ADR-05 | Enquiry flow | WhatsApp + visible email; form P1 disabled initially | Founder | Selected; actual contact values M0 |
| ADR-06 | Language | English initially; prepare copy accordingly | Founder | Selected baseline; confirm copy M0 |
| ADR-07 | Media processing/privacy | Private originals/derivatives, Sharp imageSizes, explicit approval and separate public manifests/bucket | Developer | Selected; technical proof M2 |
| ADR-08 | Video | Defer public video; still-image MVP | Founder + developer | Selected |
| ADR-09 | Real photography/copy | Supply rights-cleared founder imagery and ≥8–12 designs | Founder | Inventory M0; content complete M4 |
| ADR-10 | Domain and sender identity | Choose canonical domain, contact email, media subdomain and verified email sender | Founder + developer | M0 inputs; recovery verified M2, public DNS M5 |
| ADR-11 | Analytics/privacy settings | Choose provider, retention and consent/disclosure behavior; keep off until configured | Founder + developer | M3 before public analytics enablement |
| ADR-12 | Cost caps and operation owner | Record numeric currency/caps for private/public phases, quotes, alerts and actual recovery contact | Founder (cap) + developer (cost/operations) | M0 before paid provisioning |
| ADR-13 | Cache and runner | Tagged public DTO cache, current visibility gate, PostgreSQL-backed jobs, one web replica and bounded runner | Developer | Selected; prove M2 |
| ADR-14 | Recovery email | SMTP-compatible transactional adapter; choose provider using the verified sender and cap | Developer + founder | M2 before founder onboarding |

Record implementation evidence and any replacement decision under `docs/decisions/` when that work starts. An ADR records why, owner, date, chosen values, alternatives that matter, costs and verification. Do not mark a pending input resolved until the value exists.

## 17. Instructions for implementation agents

**Goal:** Build a branded, high-performance portfolio site, not a generic starter template.

1. Treat this plan and approved Navodhai V4 brand assets as the source of truth. Never silently replace the brand with a new palette or logo.
2. Before coding each screen, provide a concise interaction spec: visual hierarchy, responsive behaviour, CMS data, states, animation, accessibility and test cases.
3. Implement small vertical slices. A slice is complete only when real Payload data, mobile layout, media performance and end-to-end interaction work.
4. Use accessible UI primitives for menus, dialogs and filters, then apply a bespoke visual layer. Do not reproduce default shadcn styling.
5. Avoid speculative abstractions, additional services and vendor lock-in. Explain any dependency that increases bundle weight or hosting complexity.
6. Run the checks appropriate to the slice: infrastructure/query work needs contract/integration evidence; UI work also needs browser interaction, manual accessibility and visual comparison against the approved prototype.
7. Document decisions as ADRs, including trade-offs. Update this plan when contracts/scope change and the implementation checklist when progress/evidence changes; keep those responsibilities distinct.
8. Keep the customer-facing site robust with empty data, failed images, reduced motion, slow connections and disabled JavaScript where feasible.
9. Follow the canonical field names, access matrix, private/public media lifecycle and cache tag map. Do not make private media readable or enable access bypass to work around a broken public query.
10. Resolve current documentation using Context7 as required by AGENTS.md, then verify against the selected package/tag and installed types. Keep exact pins, Biome ownership and the lockfile; document justified version changes.
11. Work through WP-01 onward in order. A package becomes complete only when its exit checks and evidence are recorded; do not infer permission for a paid purchase, business assertion or public launch from a technical default.
12. Treat M2 as a stop gate for frontend expansion: demonstrate the real media/auth/publish/cache/recovery flow on both target hosts before M3.

**Definition of done per feature:** Its public/CMS/operational contracts pass the relevant checks, UI is responsive/accessible and matches the approved prototype where applicable, performance evidence is recorded, and the checklist links to the implementing source and verification.

## 18. Source notes and official references

This is a reviewed product/implementation specification, not completed implementation evidence or a vendor price quote. Versions were checked on 11 November 2026 using Context7, official documentation, release metadata and tagged Payload source. Recheck when installing; retain the compatibility exceptions and record changes. Some unversioned Payload material describes the v4 prerelease, so the tagged 3.x source/types take precedence for this baseline.

### Release and compatibility evidence

- [Node.js releases](https://nodejs.org/en/about/previous-releases) and [exact release index](https://nodejs.org/dist/index.json).
- [Next.js npm metadata](https://registry.npmjs.org/next/latest), [React DOM metadata](https://registry.npmjs.org/react-dom/latest) and [TypeScript metadata](https://registry.npmjs.org/typescript/latest).
- [Payload 3.93.0 release](https://github.com/payloadcms/payload/releases/tag/v3.93.0), [core peer/runtime requirements](https://github.com/payloadcms/payload/blob/v3.93.0/packages/payload/package.json) and [Next adapter peer/runtime requirements](https://github.com/payloadcms/payload/blob/v3.93.0/packages/next/package.json).
- [GraphQL 16.15.0 metadata](https://registry.npmjs.org/graphql/16.15.0) and [PostgreSQL supported versions](https://www.postgresql.org/support/versioning/).
- [Motion metadata](https://registry.npmjs.org/motion/latest), [Sharp metadata](https://registry.npmjs.org/sharp/latest), [Biome metadata](https://registry.npmjs.org/@biomejs%2Fbiome/latest) and [pnpm metadata](https://registry.npmjs.org/pnpm/latest).
- [Publication S3 client metadata](https://registry.npmjs.org/@aws-sdk%2Fclient-s3/latest) and [Payload email adapter metadata](https://registry.npmjs.org/@payloadcms%2Femail-nodemailer/latest).
- [Playwright metadata](https://registry.npmjs.org/@playwright%2Ftest/latest) and [Vitest metadata](https://registry.npmjs.org/vitest/latest).

### Versioned Payload implementation references

- [Payload 3 Local API/access options](https://github.com/payloadcms/payload/blob/v3.93.0/docs/local-api/overview.mdx), [global access](https://github.com/payloadcms/payload/blob/v3.93.0/docs/access-control/globals.mdx) and [drafts](https://github.com/payloadcms/payload/blob/v3.93.0/docs/versions/drafts.mdx).
- [Payload 3 storage adapters/direct uploads](https://github.com/payloadcms/payload/blob/v3.93.0/docs/upload/storage-adapters.mdx) and [imageSizes/crop/focal point](https://github.com/payloadcms/payload/blob/v3.93.0/docs/upload/overview.mdx).
- [Payload 3 cache integration example](https://github.com/payloadcms/payload/blob/v3.93.0/templates/website/src/utilities/getGlobals.ts). Use its cache integration as a reference; implement this plan's explicit access/DTO policy rather than copying its access defaults.
- [Payload 3 Jobs queue](https://github.com/payloadcms/payload/blob/v3.93.0/docs/jobs-queue/overview.mdx), [runners](https://github.com/payloadcms/payload/blob/v3.93.0/docs/jobs-queue/queues.mdx) and [migrations](https://github.com/payloadcms/payload/blob/v3.93.0/docs/database/migrations.mdx).
- [Live Preview](https://payloadcms.com/docs/live-preview/overview), [autosave](https://payloadcms.com/docs/versions/autosave), [SEO plugin](https://payloadcms.com/docs/plugins/seo), [redirects plugin](https://payloadcms.com/docs/plugins/redirects) and [production deployment](https://payloadcms.com/docs/production/deployment); check API details against the installed 3.93.0 types/tag.

### Platform, browser and quality references

- [Next.js 16 APIs](https://nextjs.org/docs/app/guides/upgrading/version-16), [TypeScript 7 support](https://nextjs.org/docs/app/api-reference/config/typescript), [image loading/remote patterns](https://nextjs.org/docs/app/api-reference/components/image), [revalidateTag](https://nextjs.org/docs/app/api-reference/functions/revalidateTag) and [self-hosting/runtime configuration](https://nextjs.org/docs/app/guides/self-hosting).
- [Vercel Node.js policy](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions), [Hobby/commercial restrictions](https://vercel.com/docs/plans/hobby) and [deployment protection](https://vercel.com/docs/deployment-protection).
- [R2 public bucket exposure](https://developers.cloudflare.com/r2/buckets/public-buckets/) and [CORS](https://developers.cloudflare.com/r2/buckets/cors/).
- [Motion LazyMotion](https://motion.dev/docs/react-lazy-motion), [Core Web Vitals](https://web.dev/articles/vitals) and [WCAG 2.2](https://www.w3.org/TR/WCAG22/).

## 19. Review resolution and document maintenance

The review findings below are addressed in the specification. Their implementation remains pending until the linked work package records passing evidence.

| Review finding | Contract added or corrected | Verification package |
|---|---|---|
| No pinned compatible baseline | Section 1.2 exact versions, GraphQL 16 exception and tagged documentation rule | WP-03 |
| Tooling/upgrade policy absent | Section 1.4 Biome, lockfile, strict types, CI and grouped updates | WP-03 |
| Local API can bypass access | Sections 6.4–6.5 access matrix, explicit options and safe DTOs | WP-04 |
| Preview could leak through cookies/caches/globals | Sections 6.5 and 7.5 authenticated reads, private responses and API denial | WP-04, WP-06 |
| Public R2 could expose originals/drafts | Sections 6.1, 7.4 and 8 separate private storage and approved manifests | WP-05 |
| Missing/inconsistent CMS page fields | Section 6 canonical portfolio names and About/Contact/legal globals | WP-04 |
| Processing/caching postponed to M4 | Section 12 mandatory complete M2 flow on Vercel and Docker | WP-05, WP-06 |
| Undefined invalidation/removal behavior | Section 7.5 visibility check, full tag map, post-commit jobs and retries | WP-06 |
| Build/runtime origin and release ambiguity | Sections 7.4, 7.6 and 9 runtime config, controlled migrations and web/runner images | WP-03, WP-06, WP-12 |
| Alt text and accessibility acceptance incomplete | Sections 4, 6.2 and 11.3 per-use alternatives, zoom/reflow and manual checks | WP-02, WP-09, WP-11 |
| Deleted assets can break version restore | Sections 6.6, 8.4 and 9.5 references, retention and full restore | WP-05, WP-11, WP-12 |
| WhatsApp clicks and launch field data overstated | Sections 2.3 and 10.1 intent events and separate pre/postlaunch evidence | WP-10, WP-11 |
| Recovery, ownership and costs underdefined | Sections 9.5, 12 and 16 named roles, recovery targets and numeric-budget input gate | WP-01, WP-04, WP-12 |
| Implementation order unclear | Companion checklist with dependencies, owners and package exit evidence | WP-01 through WP-12 |

Keep the plan authoritative for product/technical contracts and the companion checklist authoritative for execution status. Update both when a verified decision changes scope; never turn a proposed version or unchecked acceptance item into a claim of completed work.

**Revision history:** v1.0 established the product baseline on 10 November 2026. v1.1 incorporates the technical review, selects compatible versions/defaults, completes the content and operational contracts, and introduces ordered implementation packages on 11 November 2026.

