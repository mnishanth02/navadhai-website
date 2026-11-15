---
title: "Navodhai | Ordered Implementation Checklist"
version: "1.0"
date: "2026-11-11"
status: "Historical checklist; superseded for the current release on 2026-11-14"
---

> **Archived historical record.** Component names, paths, measurements and release instructions below describe earlier versions. See the [archive index](README.md) for preserved snapshots, working reproduction commands and current guidance.

# Navodhai implementation checklist

> **Historical checklist, superseded on 14 November 2026.** Use the [static landing page plan and its completion checklist](static-landing-page-plan.md) instead. Do not start the packages below for the current release.

Use this tracker with the [website and CMS plan v1.1](navodhai-website-plan.md). The plan defines the contracts; this file records order, status and evidence. All packages start uncompleted. Updating documentation does not complete an implementation gate.

Work through one package at a time. Start a package when its dependencies and required inputs exist. Complete it only after its exit checks pass, then record source commit, evidence, actual versions where relevant and any remaining limitation. Business values, paid account access and public launch are separate decisions from the selected technical defaults.

## Package order and status

| Package | Milestone | Deliverable | Owner | Depends on | Status |
|---|---|---|---|---|---|
| WP-01 | M0 | Discovery, real inputs and decision record | Founder + developer | None | Not started |
| WP-02 | M1 | Design foundation and approved prototype | Developer/designer + founder | WP-01 | Not started |
| WP-03 | M2 | Reproducible project, tooling and database foundation | Developer | WP-02 | Not started |
| WP-04 | M2 | CMS contracts, permissions, preview and recovery | Developer | WP-03 | Not started |
| WP-05 | M2 | Private/public media lifecycle | Developer | WP-04 | Not started |
| WP-06 | M2 | Cache/jobs and complete integration proof | Developer | WP-05 | Not started |
| WP-07 | M3 | Responsive site shell and navigation | Developer | WP-06 | Not started |
| WP-08 | M3 | Homepage and About vertical slices | Developer + founder | WP-07 | Not started |
| WP-09 | M3 | Portfolio discovery and design-detail slices | Developer | WP-08 | Not started |
| WP-10 | M3 | Contact, policies, SEO and analytics | Developer + founder | WP-09 | Not started |
| WP-11 | M4 | Production content and launch quality evidence | Founder + developer | WP-10 | Not started |
| WP-12 | M5 | Production release, restore and handover | Developer + founder | WP-11 | Not started |

## WP-01 — Discovery, inputs and decisions

**First package to start.** Plan sections 3, 12 and 16 define its inputs and gate.

- [ ] Locate and inventory approved V4 logo variants, exact colours, fonts and font licences; record missing assets without inventing replacements.
- [ ] Inventory real photography, usage/consent rights, founder imagery and copy for at least 8–12 eventual designs.
- [ ] Collect 12–15 annotated references, choose the art direction, confirm sitemap and founder publishing/enquiry journeys.
- [ ] Record the actual WhatsApp number, visible contact email, service area, language, domain/sender identity and authorised reviewer/recovery contacts.
- [ ] Create the decision/cost record: selected portable defaults, provider/region choices, current quotes, numeric monthly caps/currency for private and public phases, alert thresholds and operational owner.

**Exit:** Founder/business inputs and approved identity are recorded; the developer has enough information and account/budget decisions to prepare the selected infrastructure. Track any pending input with an owner and due point before dependent work starts.

## WP-02 — Design foundation and prototype

Plan sections 3–5 and 11.3 define the visual and accessibility requirements.

- [ ] Derive brand tokens and responsive type/spacing/motion specimens from the approved identity.
- [ ] Produce mobile/desktop layouts for home, portfolio, detail, About, Contact, Privacy, optional Terms and core error/empty states.
- [ ] Prototype filters, gallery/lightbox, menu, sticky CTA and the editor's private-media approval/preview journey.
- [ ] Define image crops, alternatives, DOM reading order, no-JavaScript navigation, touch/keyboard controls and reduced-motion behavior.
- [ ] Record founder feedback and approve the visual direction; verify early contrast, focus, zoom/reflow and transfer budgets.

**Exit:** Screens and interactions have a reviewable approved specification. Framework features are still subject to the M2 integration gate.

## WP-03 — Reproducible project and tooling

Use the exact baseline and update rules in plan sections 1.2–1.4 and 7.6.

- [ ] Initialise the private source repository and scaffold Next.js/Payload/PostgreSQL without ignored peer dependency errors.
- [ ] Commit exact direct pins, the package-manager/Node pins, lockfile, Biome configuration, strict TypeScript settings and generated Payload types/import map.
- [ ] Add validated server environment configuration and a secret-free example file; distinguish runtime canonical/app origins from build-time public variables.
- [ ] Add local PostgreSQL 18 and isolated schema/seed fixtures, initial migrations, controlled build/release database access and connection-pool bounds.
- [ ] Build Linux web and release/runner images from the same source; verify Sharp, static assets, non-root runtime and required writable cache paths.
- [ ] Add CI formatting/lint/type/generation checks, targeted test jobs, production build and browser smoke setup.
- [ ] Create the initial protected Vercel deployment with isolated data, private release/media defaults and a working health check; keep media upload disabled until private storage is configured.

**Exit:** Fresh checkout plus documented non-secret setup installs reproducibly, static checks/build pass, and both image roles start with isolated data. Record actual resolved versions and Node build/runtime versions.

## WP-04 — CMS, permissions, preview and recovery

Plan section 6 is the canonical schema/access contract. Use the pinned release's types and tagged docs.

- [ ] Implement users, private media, safe public manifests, categories, portfolio and all homepage/about/contact/legal/settings globals with consistent field names.
- [ ] Bootstrap the admin privately, configure editor permissions and field-level role restrictions, and keep anonymous registration/direct writes disabled.
- [ ] Enable incomplete drafts, autosave, 50 retained versions, document locks, publication validation and protected publication/delivery metadata.
- [ ] Implement server-only public DTO queries, protected global reads, explicit Local API access options, and independent published/active filters.
- [ ] Add authenticated Draft Mode/Live Preview with mobile/desktop breakpoints, allowed local redirect targets and exit-preview.
- [ ] Configure transactional CMS recovery email; test login/reset, token expiry/reuse, sender identity and actual app origin.
- [ ] Exercise anonymous/editor/admin access across Local API, REST, GraphQL, globals, versions and original-file routes, including a live item with newer draft changes.

**Exit:** Founder can save/preview content and recover access; expired/absent sessions cannot read drafts; an editor cannot elevate privileges. Private original-file access remains denied anonymously. Image delivery itself is completed in WP-05.

## WP-05 — Private/public media lifecycle

Plan sections 6.6 and 8 define the lifecycle. Use approved disposable fixtures for public-delivery testing.

- [ ] Configure private source storage, separate approved derivative storage, scoped credentials and intended-origin CORS; disable public access on originals.
- [ ] Complete client-direct upload above 4.5 MB, byte/type/pixel validation, Sharp resizing/cropping, colour/orientation handling and useful input rejection.
- [ ] Implement processing/approval status, explicit public-photo permission, safe manifests, pinned published-media revisions and immutable derivative URLs; ordinary private deployments do not promote business images.
- [ ] Verify approved fixture promotion with `MEDIA_PUBLICATION_ENABLED=true` in an isolated test setup while `PUBLIC_RELEASE=false`; original-file privacy and page/indexing protection remain active.
- [ ] Exercise interruption, processing/promotion failure and idempotent retry; a failed replacement preserves the previous usable revision.
- [ ] Implement reference-aware archive/delete, explicit withdrawal, CDN purge and retention of old referenced originals/derivatives.
- [ ] Restore an older content revision and its photographs; verify the backup/rebuild process can recover a missing media object.

**Exit:** Large upload → private processing → authenticated preview → explicit approval → public derivatives works in Vercel and Docker. No anonymous private-file access, unintended public originals or broken retained-version references.

## WP-06 — Cache/jobs and M2 integration gate

Plan sections 7.5, 9 and 12 define this stop gate.

- [ ] Implement tagged public DTO caching, request-time publication/visibility checks and the complete event-to-tag invalidation map.
- [ ] Configure durable publication/invalidation jobs, bounded authenticated runners, post-commit ordering, revision checks and recoverable failed-delivery status.
- [ ] Verify the Vercel cron can run through deployment protection without exposing bypass credentials; verify the self-hosted runner can invalidate the web process.
- [ ] Prevent shared HTML/RSC/admin/preview caching and check that a preview cookie cannot contaminate an anonymous response.
- [ ] Run the full M2 proof on protected Vercel and Docker: large upload, crop, both preview viewports, approved fixture promotion, publish/edit/unpublish/withdrawal, draft/version/file denial, job failure/restart/retry and CMS reset.
- [ ] Rehearse fresh/upgrade migrations and a private database/media restore; measure pool peaks, image-processing memory and publication latency.
- [ ] Record commit, actual versions, environment, test output and any technical decision changes. Re-estimate remaining effort using this evidence.

**Exit:** Every M2 acceptance scenario passes on both target hosts. Do not begin WP-07 while a draft/media leak, failed publication path, broken restore or incompatible dependency remains unresolved.

## WP-07 — Responsive shell

- [ ] Implement approved fonts/tokens, public layout, navigation, footer, contact affordances, skip link and consistent error/empty states.
- [ ] Connect navigation/logo/contact data through safe published settings DTOs.
- [ ] Verify menu focus/Escape/return, sticky-control clearance, 320px layout, zoom/reflow, no-JavaScript navigation and reduced motion.

**Exit:** Shared shell meets the prototype, accessibility and loading budgets on phone and desktop; no speculative animation or duplicate client data-fetching layer.

## WP-08 — Homepage and About

- [ ] Build homepage story beats and the founder/craft narrative using their dedicated globals and real permitted media.
- [ ] Support sparse/empty optional sections, failed images and published-content updates.
- [ ] Add the agreed limited motion after the static layout/media are stable.
- [ ] Verify edit → preview → publish on both pages, mobile/desktop visuals, meaningful image alternatives and LCP behavior.

**Exit:** Both page slices match the approved direction and remain readable without animation. Founder can update their content without developer help.

## WP-09 — Portfolio index and detail

- [ ] Implement URL-based category filters, result counts, bounded pagination and a logical editorial grid with native navigation fallbacks.
- [ ] Implement detail/gallery/lightbox, related-item filtering, shareable URLs and contextual WhatsApp links.
- [ ] Test 1/3/10-photo layouts, keyboard/swipe alternatives, focus return, browser zoom, Back/Forward and narrow/slow-device behavior.
- [ ] Verify published-only metadata, retired-item 404s, exact relevant redirects, category/media reference guards and immediate exclusion of unpublished cached records.

**Exit:** A visitor can find a design, inspect its craft and open the correct enquiry intent on mobile and desktop; unpublished/private material stays absent from every surface.

## WP-10 — Contact, policies, SEO and analytics

- [ ] Connect Contact, visible email, WhatsApp destinations and approved Privacy/optional Terms copy to their globals.
- [ ] Add native metadata, accurate business structured data, safe canonical origins, published-only sitemap/robots and frontend redirect resolution.
- [ ] Configure the selected privacy/analytics settings; implement non-blocking intent events with the allowlisted properties only.
- [ ] Keep the optional form disabled, or complete its validation, abuse controls, persisted-success semantics, private administration and 90-day retention before enabling it.
- [ ] Verify WhatsApp encoding/phone format, canonical design URLs, email fallback and analytics failure without lost navigation.

**Exit:** Correct policy/contact information and SEO are published, analytics measures intent accurately, and no unimplemented form is exposed.

## WP-11 — Content and launch quality

- [ ] Founder supplies and reviews 8–12 complete designs with accurate copy, required alternatives, media rights, categories and useful related items.
- [ ] Run the section 11 test matrix against production-sized content; record browser/device, screen-reader, keyboard, zoom/reflow and reduced-motion evidence.
- [ ] Measure route/image budgets and repeatable prelaunch mobile performance; profile low-end interaction and fix material regressions.
- [ ] Founder completes add/edit/crop/preview/publish/unpublish/restore and recovery tasks without developer assistance.
- [ ] Recheck reference retention, privacy settings, failed-delivery recovery and current source/dependency evidence.

**Exit:** Section 13's applicable visitor/editor criteria pass. Field p75 results are explicitly a postlaunch follow-up, not fabricated prelaunch evidence.

## WP-12 — Production release and handover

- [ ] Prepare the recorded production infrastructure within the numeric cap; keep PostgreSQL managed for the first app-host cutover.
- [ ] Verify complete private database/media restore against the recovery targets, fresh/upgrade migration, previous-image compatibility and named recovery contact.
- [ ] Rehearse the section 9.3 cutover with approved data, runtime canonical origins, media readiness, job auth and public release/indexing switches.
- [ ] Execute the content freeze, backup, controlled release migration and gated deployment. Enable approved media publication first, verify manifests against published content, then change DNS/public release/indexability after the media gate passes.
- [ ] Run immediate visitor/admin/recovery/withdrawal smoke checks; monitor 5xx, memory, pools, queues, budgets and backups through the first 24 hours.
- [ ] Record the release commit, operating instructions, alerts, restore schedule and rollback procedure; lock down/retire stale private deployments.
- [ ] Arrange the first available 28-day real-user performance review and ongoing dependency/restore checks.

**Exit:** Public pages and CMS operate correctly; approved media is available; backups/restore/runner/alerts/cost controls and ownership are evidenced. Mark release complete only after this gate.

## Evidence record

For each completed package, append a short record here or link to the durable evidence in the repository:

| Field | Required value |
|---|---|
| Package / completion date | Actual package ID and date |
| Source | Implementing commit or immutable source revision |
| Environment | Local, protected Vercel, Docker staging and/or production |
| Verification | Relevant check commands/results, device/browser observations and artifact links |
| Versions | Actual installed/runtime versions when the package changes them |
| Decisions / limits | ADR links and any remaining accepted limitation with owner |
| Status | Complete only after all applicable exit checks pass |

No implementation evidence has been recorded yet.
