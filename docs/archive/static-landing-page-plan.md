---
title: "Navodhai | Static Landing Page Plan"
version: "1.1"
date: "2026-11-14"
status: "Reviewed scope; local implementation authorised; publication inputs pending"
---

> **Archived historical record.** Component names, paths, measurements and release instructions below describe earlier versions. See the [archive index](README.md) for preserved snapshots, working reproduction commands and current guidance.

# Navodhai static landing page

> **Current stack:** The user subsequently required React, Vite+, Tailwind CSS and motion libraries. See [the implemented React version](../react-implementation.md) and root README for active commands. `src/` is current source and `dist/` is deployable output. Buildless instructions below are historical; static delivery and business scope remain current.

> **Visual/interaction direction superseded:** The user rejected the implemented design on 14 November 2026. The [boutique redesign plan](boutique-redesign-plan.md) proposes its replacement. This document still records business facts, single-page scope and deployment boundaries; its zero-JavaScript, provisional-style and original content-layout choices are not constraints on the redesign.

## 1. Goal and scope

Create one fast, mobile-friendly page that explains what Navodhai is, what it can help customers with, how customisation works, and how to get in touch.

This replaces the website/CMS plan and its implementation checklist for the current release. Those documents remain historical references only. Their framework versions, infrastructure requirements, portfolio content requirements, design workshops and delivery gates do not apply to this release.

**Visitor outcome:** Understand the business and start an enquiry without browsing a product catalogue.

**Confirmed business focus:** Navodhai is a handcrafted boutique focused on blouse and dress making, confirmed by the user on 14 November 2026. The landing page should explain these services and invite customers to discuss customisation. Specific customisation options still need verification. Use the existing project spelling, Navodhai, until the public-facing name is confirmed.

**Included:** One homepage, brand introduction, concise service descriptions, customisation guidance, direct contact links, basic business details, mobile layout and search/share metadata.

**Deferred:** Product photography requirements, product catalogue, portfolio, galleries, product detail pages, prices, shopping, accounts, booking, CMS/admin, database, upload pipeline, backend APIs, contact form and analytics. Nothing in this list is a prerequisite for launching the landing page.

## 2. One-page structure

| Section | Content and purpose |
|---|---|
| Header | Existing logo/name; simple About, Services and Contact anchor links. Keep navigation short enough to work on mobile without a complex menu. |
| Introduction | One clear sentence explaining the business, one supporting sentence about personalisation, and a prominent WhatsApp enquiry link. No product showcase. |
| About Navodhai | A short, factual introduction: who the business is, its approach and whom it helps. Founder details only if supplied and wanted. |
| What we can help with | Concise descriptions of blouse making and dress making, with an invitation to discuss customisation. Confirm specific options before publication. |
| Making it personal | A short explanation of what customers can discuss and a simple sequence: share your idea, discuss the available options, agree the next steps. Specific fabric, fit, design or embellishment options must reflect real capabilities. |
| Contact and footer | WhatsApp, visible email, optional phone, verified service area/address and business hours if relevant. Social links only when real accounts are supplied. |

Keep copy brief: approximately 350–500 words for the whole page, adjusted for the actual service information. About and Contact are sections of the homepage, not separate routes.

When verified contact details exist, use one consistent primary action, “Enquire on WhatsApp”, near the introduction and contact section. Format the destination as `https://wa.me/<international-digits>?text=<URL-encoded-message>` with no plus sign, spaces or punctuation in the phone path. Its prefilled message should be general, for example “Hi, I'd like to discuss a custom outfit.” Offer a visible, copyable email address with a `mailto:` link as an alternative. Keep links in the current tab unless there is a specific reason otherwise. Contact links open the relevant external application; the website itself does not accept or store enquiries.

**Missing-input behavior:** Build a local, non-public draft without waiting for all business inputs. Until verified contact details arrive, use “Contact us” links to the real `#contact` section, show a short honest message that contact details are coming soon, and omit unavailable WhatsApp/email/phone/social links. Do not render disabled enquiry controls, fake details, empty links or `href="#"`. The draft is not ready for public release until WhatsApp and email work with verified destinations.

Do not publish placeholder contact details, invented testimonials, customer counts, awards, turnaround promises or unsupported quality claims.

## 3. Visual approach

Preserve the earlier plan's existing V4 brand commitment if its assets are available: approved logo, plum/gold/rose colour family and approved typography. Exact values and font rights still need the original assets; do not substitute a new identity silently.

**Local draft fallback:** With no assets available, use a plain Navodhai text wordmark and system fonts. Provisional plum, gold, rose and light background tokens may establish the layout, but must be labelled provisional in developer documentation. Do not invent a floral monogram or replacement logo. Approved assets/colour values are a publication gate, not a blocker to implementing the page.

Use a calm, uncluttered composition with readable typography, generous spacing, short text blocks and a clear contact action. The brand and writing should carry the page. Product imagery is unnecessary; an optional, approved craft/detail image can be added only if it improves the explanation and fits the performance budget.

On desktop, use a compact introduction followed by readable service and contact sections. On mobile, use one natural reading column and clearly separated contact links. Avoid decorative card grids, carousels, video backgrounds, parallax and scroll-reveal dependencies.

This is a scope/layout proposal, not a new visual identity or an approved design comp. Final styling should follow the actual brand assets during implementation.

## 4. Recommended implementation

**Plain static HTML and CSS, with a small JavaScript file only if an actual interaction needs it.** Proceed with this approach under the user's request to review the plan and start implementation. No runtime dependency or package installation is required.

- Serve prebuilt files directly from static hosting over HTTPS, with caching and compression configured on the host.
- Keep the main content, navigation and contact actions functional with JavaScript disabled.
- Use local assets and system fonts or a small, licensed, self-hosted font subset. Avoid external font requests and embedded social feeds/maps.
- Keep content in the source files. Text or service changes require a small source update and redeployment; there is no editor dashboard in this release.
- Keep the output portable so the same files can be served by a static host or an existing web server. Choose the actual host before deployment; do not provision services as part of planning.
- Add a descriptive page title, description and text-based social sharing metadata. Keep the local draft marked `noindex, nofollow` and disallow crawling in its robots file. These are indexing controls, not access protection; keep the unready draft local. Omit canonical URLs, `og:url`, social images, a branded favicon and the sitemap until the real domain/approved assets exist. Do not use sample domains or invent an icon. For release, populate the real URLs and assets, create a one-page sitemap, remove the noindex directive and allow crawling in one deliberate change.

Deployable directory (source and output are the same; there is no build step):

```text
site/
  index.html
  styles.css
  robots.txt
  assets/        # only when approved assets are supplied
  favicon.svg    # only when an approved icon is supplied
  sitemap.xml    # only when the real public domain is known
```

Add `site/script.js` only if needed. Deploy only the contents of `site/`, never the workspace root. Keep plans, screenshots and verification scripts outside that directory. No application server, database, CMS, media service or runtime content fetching is required. Document local preview, edit and release instructions in a root README.

### Performance budgets

These are project targets to validate on the finished page, not measured results or loading-time guarantees.

| Item | Initial target |
|---|---|
| First-load transfer | At most 350 KB compressed across HTML, styles, fonts, scripts and any initial image |
| First-party JavaScript | Prefer zero; at most 10 KB compressed if required |
| Fonts | System fonts preferred; otherwise at most 100 KB transferred in total |
| Optional initial image | At most 150 KB, sized for its actual display use |
| Main-content loading | Aim for Largest Contentful Paint (LCP) within 2 seconds in the recorded cold-cache mobile test below |
| Layout | Reserve media dimensions and avoid visible movement as assets load |

Do not delay launch for imagery. Avoid third-party scripts in the initial release. Real delivery speed also depends on hosting, caching, the visitor's device and connection.

**Verification profile:** Test the actual `site/` files at 390 × 844 CSS pixels in Chromium, cold browser cache, with a recorded browser version, 4× CPU slowdown, 1.6 Mbps download, 750 Kbps upload and 150 ms latency. Record LCP, CLS and resource sizes; local timings are diagnostics only. The public-host test is the delivery-speed acceptance check. Separately check layout at 320, 390, 768 and 1440 pixels, keyboard navigation, 200% text/zoom and reduced motion. Local structure and raw/gzip byte checks do not prove the deployed server enables compression, caching or HTTPS; verify those against the selected host before release. If a tool cannot apply this profile, record the limitation rather than claiming the target was verified.

## 5. Small delivery sequence

1. **Confirm content:** Public-facing name, business summary, actual services/customisation options, contact details, service area and available brand assets. Draft concise copy from those facts.
2. **Build the page:** Implement the responsive static page, contact links, approved branding and metadata. Keep optional imagery out until there is a suitable real asset.
3. **Verify and prepare release:** Check mobile/desktop layouts, keyboard navigation, contrast, zoom/reflow, link destinations and performance using the actual production files. Prepare the chosen hosting setup and a reviewable page before public deployment.

No CMS integration milestone, product inventory, database setup or portfolio content population is part of this sequence. Public deployment and any paid hosting choice remain separate from this planning request.

## 6. Inputs still needed before publication

- Confirm the public-facing brand spelling. The handcrafted boutique, blouse making and dress making focus is already confirmed.
- Supply approved logo variants and any available brand/font files. The earlier documents reference V4 assets, but this workspace currently contains only planning documents.
- Confirm the short business introduction and exact services/customisation options; do not assume all possible tailoring services are offered.
- Confirmed by the user: WhatsApp/contact number **+91 78459 52592**, email **manjulajayanthi1@gmail.com**, service area **Coimbatore, Tamil Nadu**. WhatsApp phone path: `917845952592`. Use these actual values in the initial implementation.
- Social account URLs, street address and business hours are not supplied; omit them. Confirm the final domain/hosting destination before publication.

These inputs affect the final copy and contact destinations. They do not require expanding the scope into a CMS or product website.

## 7. Completion checklist

- [ ] Approved business facts and branding replace all placeholders.
- [x] User-supplied WhatsApp and email links are present; there are no placeholder contact channels or coming-soon controls.
- [x] A visitor can understand the business and find contact details on one page.
- [x] WhatsApp and email links target the user-supplied destinations; no message/delivery test was performed.
- [x] Layout works on narrow mobile screens and desktop without horizontal scrolling in local Chromium checks.
- [x] Keyboard focus, heading order, automated contrast checks and 200% text resizing are checked; no content imagery is used.
- [x] Content, section links and contact actions use native HTML; no runtime JavaScript is shipped.
- [ ] Actual transfer size and mobile loading behavior meet the agreed budgets or have a documented reason for adjustment.
- [ ] Final domain, HTTPS, metadata, sitemap and caching are checked before public release.
- [ ] Domain-dependent metadata uses only the actual domain; draft noindex/crawl blocking is removed only for public release.
- [ ] Deploy only `site/` contents; source documentation and verification artifacts are excluded from the deployment directory.
- [x] The source and static deployment instructions are documented in the root README.

Local implementation and verification evidence are recorded in [implementation-verification.md](implementation-verification.md). Public release checks remain open; no public deployment has occurred.

## 8. Review resolution (14 November 2026)

An independent subagent reviewed v1.0 before implementation. All four plan findings were addressed in v1.1:

| Finding | Resolution |
|---|---|
| Missing-input behavior undefined | Local text wordmark, documented provisional tokens, honest unavailable-contact state and explicit publication gates |
| Draft indexing/domain metadata undefined | Local noindex/crawl blocking; domain-dependent metadata deferred until the real domain exists |
| Deployment directory ambiguous | Buildless `site/` directory is the only deployment root; docs and checks stay outside it |
| Speed target not reproducible | Named LCP metric, cold-cache mobile profile and separate local/hosted evidence requirements |
