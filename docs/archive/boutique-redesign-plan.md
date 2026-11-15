---
title: "Navodhai | Boutique Redesign Plan"
date: "2026-11-14"
status: "Accepted visual direction implemented in React/Vite+; local validation complete"
---

> **Archived historical record.** Component names, paths, measurements and release instructions below describe earlier versions. See the [archive index](README.md) for preserved snapshots, working reproduction commands and current guidance.

# Navodhai boutique redesign

> **Brand authority updated:** The user has supplied the existing Canva V4 companion and requested its application. Its fixed logo artwork, Royal Plum/Ivory/Gold/Rose/Charcoal palette and GFS Didot/Inter typography supersede this plan's provisional visual tokens and font preferences. The one-page scope and useful enquiry behavior remain. See `branding/canva-brand-adaptation.md` and current `DESIGN.md`.

## Decision

Replace the visual composition, typography, artwork, copy and enquiry experience. Keep the business facts, single static homepage, speed and direct contact scope. The existing page is a rejected draft; its technical review is not evidence that its design succeeded.

**Recommended direction: a contemporary cutting-table composition.** Large, carefully composed tailoring artwork gives the page its identity. Compact, expressive sans-serif typography and an optional topic-based enquiry help a visitor understand the business and begin a useful WhatsApp conversation.

The user accepted this plan and authorised proceeding. The high-fidelity version was independently reviewed, corrected and first implemented in `site/`. That static snapshot and its [review record](redesign-preview.md) remain historical. The user subsequently required React, Vite+, Tailwind CSS and motion libraries. The current implementation is `src/`, builds to `dist/`, and is documented in [the React implementation record](../react-implementation.md). This explicit stack change supersedes the earlier buildless/15 KB JavaScript constraints; business scope and visual rejection criteria remain active.

## 1. What failed

Independent GPT-6 Astra and Gemini 4 Argon reviews inspected the actual desktop/mobile screenshots and source. Their findings align:

- No artwork, materials or visual reference to garment making. Changing the business nouns would make the same page plausible for almost any service.
- Cream background, oversized Georgia headings, plum type, horizontal rules and arrow buttons repeat familiar generated-page conventions.
- Almost every section repeats a heading-left/body-right composition; mobile becomes a long stack of repetitive prose.
- Copy repeatedly talks about ideas and conversations without helping someone understand or prepare an enquiry.
- Hover colours and anchor links work, but no interaction helps a visitor choose a relevant enquiry topic.

The earlier acceptance process checked technical correctness and accepted the visual result too easily. The replacement needs a separate visual rejection gate.

## 2. Direction and compact design system

### Visual character

A contemporary boutique studio rather than a cream editorial document. Use a white ground, concentrated orchid and aubergine artwork, and one controlled thread-colour accent. No paper texture overlay, faux handwritten labels, dashed-page frames, sewing-tool confetti or generic luxury gradients.

| Token | Proposed value | Role |
|---|---|---|
| Chalk | `#FFFFFF` | Main canvas and inverse text |
| Aubergine | `#3C1745` | Main text, primary actions and strongest artwork plane |
| Orchid | `#DCCAF2` | Large illustration stage and supporting surface |
| Deep iris | `#654080` | Artwork depth and secondary brand emphasis |
| Marigold | `#E7AD35` | A single thread/detail accent; not small text on white |
| Seam grey | `#665E6A` | Supporting text on light surfaces |

These are proposed design tokens, not recovered or approved V4 brand values. They keep a connection to the earlier purple family while replacing its cream/serif treatment. Any supplied approved logo must be reconciled before final token sign-off; do not invent one.

**Typography:** Bricolage Grotesque 600 for short display headings, Instrument Sans 400/500/600 for body and controls. Both are available in the official [Bricolage Grotesque](https://fonts.google.com/specimen/Bricolage+Grotesque) and [Instrument Sans](https://fonts.google.com/specimen/Instrument+Sans) font listings. Verify font files/licences and self-host only the required WOFF2 subsets at implementation; fallback stacks preserve function when fonts fail. No Georgia-led brand voice, script accent or single italic/coloured hero word.

**Layout:** Desktop uses an asymmetric illustrated opening, a compact service/enquiry area, short preparation disclosures and a direct contact close. Use different structures for different jobs. On mobile, art-direct the illustration crop and keep the opening short enough to show the category, locality, artwork and action without several screens of copy.

**Token coverage beyond colour:** Document display/body/label type styles, a 4/8px spacing scale, content width/gutters, compact control radii, button variants, selected/hover/pressed/focus states, text/link states, motion durations and reduced-motion rules. A design system is an implemented set of reusable decisions; a long token document alone does not satisfy this requirement.

## 3. Page composition

1. **Small header:** provisional text wordmark without the gold full stop; Services and Contact links. Keep the real primary enquiry route obvious.
2. **Illustrated opening:** explicit heading such as “Blouse & dress making. Made personal.” One sentence identifies Navodhai and Coimbatore. A large tailoring illustration occupies roughly half the desktop opening. A direct WhatsApp action remains available without using the enquiry helper.
3. **Choose what to discuss:** blouse making, dress making or customisation. The chosen topic reveals one useful, concise description and a matching WhatsApp message preview. This replaces the static service table and redundant about passage. Include one factual boutique introduction here or in the opening, not another full section.
4. **Prepare your enquiry:** three short disclosures: “Have a reference?”, “Have a date in mind?” and “Not sure where to start?” Offer practical prompts. A date is something to discuss, not a delivery commitment. Do not invent prices, turnaround, material stock or detailed tailoring capabilities.
5. **Contact close:** WhatsApp, selectable phone/email and Coimbatore, Tamil Nadu. No invented address, hours, social accounts, testimonials or counters.

Target approximately 220–320 words of public copy, excluding the generated enquiry preview. Every block must add a fact, choice or useful preparation prompt. Remove the slogan strip and repeated conversation language.

Desktop structure:

```text
Navodhai                          Services   Contact

Short, explicit headline          Original tailoring artwork
Coimbatore + concise introduction (large composed pattern/fabric study)
Direct WhatsApp action

Choose a topic                    Related service explanation
Blouse / Dress / Customisation    Message preview + WhatsApp action

Useful preparation disclosures   Short factual boutique introduction

Contact details + direct actions
```

Mobile is deliberately recomposed: compact heading/locality, substantial cropped artwork, direct action, full-width topic choices, inline preview, disclosures and contact. Do not merely stack desktop's large paddings.

## 4. Original artwork, not placeholder decoration

Produce **one signature tailoring illustration** with its own desktop and mobile crops: overlapping pattern/fabric shapes, a recognisable sleeve/bodice construction reference and one controlled marigold thread or seam. The attached concept study uses a geometric pattern diagram to test this composition; it is not the finished textile artwork or a usable sewing pattern.

Final asset production must add the drawing/material quality the initial page lacked. Use a deliberately art-directed vector composition or a commissioned/generated illustration with a recorded source/prompt and usage rights, depending on the chosen finish. No traced competitor asset, random stock sewing icon, invented boutique interior or synthetic finished garment presented as Navodhai's work.

The illustration represents the subject/process, not inventory, an actual commission or a promise that a particular cut is offered. Mark it as an illustration in its text alternative. If the art does not read clearly as garment making without the headline, revise the art before coding the rest of the page.

## 5. Interaction specification

### Optional enquiry topic helper

- Three native radio choices: **Blouse making / Dress making / Customisation**. No required multi-step questionnaire, measurements, fabric selector or quote calculator.
- The selection updates a short description and the exact text shown in a visible WhatsApp message preview. Highlight the related area of the artwork without implying that the diagram is a garment configurator.
- Example: “Hi Navodhai, I'd like to enquire about blouse making. Can we discuss my requirements?”
- The action uses `https://wa.me/917845952592?text=` followed by the URL-encoded message. Choosing a topic never sends a message; the user reviews and sends it in WhatsApp.
- A direct general enquiry route remains available for visitors who want to skip the helper. Email and phone remain independent alternatives.
- Mobile uses clearly labelled full-width or naturally wrapping choices with at least 44px touch targets. No swipe-only control or horizontal chip overflow.
- Native arrow-key/Space behavior, visible focus, selected state expressed through checked input and text, and a polite preview announcement on changes.
- Only show enhanced controls once their JavaScript is ready. Without JavaScript, render three direct topic-specific enquiry links and the full service descriptions. A failed script must not leave apparently interactive controls doing nothing.
- One short 160–220ms state transition; reduced motion changes state instantly. No mouse-following artwork, auto-playing gallery or continuous animation.

### Preparation disclosures

Use native `details`/`summary`, operable by keyboard and touch with all essential information still available without scripts. The answer appears next to its question. Do not make an animation or a hidden illustration hotspot necessary to understand it.

### Mobile contact access

A small bottom enquiry action can appear once the opening action is out of view. It must respect safe-area insets, reserve page space, remain usable at enlarged text sizes and hide when the contact action is visible. Omit this enhancement if its obstruction cost exceeds its value. Normal in-page actions work regardless of observer/script support.

## 6. Performance and implementation

Use React/TypeScript scaffolded with Vite+, Tailwind CSS, Motion for interface and SVG animation, and Lucide icons. Build-time React rendering keeps the output deployable as static files with no runtime Node server. This replaces the earlier buildless implementation at the user's request.

- Compressed initial-transfer budget: **450,000 bytes**, including artwork and fonts. The revised React/Motion JavaScript budget is **120,000 gzip bytes**. Measure the build rather than retaining the obsolete 15 KB limit. Avoid redundant timeline libraries and animation runtimes.
- One optimised initial artwork, with an appropriate mobile crop and reserved dimensions. Load opening art intentionally; lazy-load only imagery below the fold. Limit total font transfer to 120 KB and use `font-display: swap` with a compatible fallback.
- Use normal text/HTML for essential copy and controls. Avoid a full-page canvas or text baked into an image.
- Retain the plan's recorded mobile test profile and public-host LCP target. The previous 15 KB footprint is not the design goal; verify actual loading and interaction stability.
- Preserve confirmed contacts and local noindex state. Deploy only `dist/`; `src/` is canonical source and `site/` is historical. Canonical URLs, sitemap, public indexing and host settings still wait for an actual domain/host.
- Replace or extend the old checks that enforce zero scripts/only HTML-CSS files. New checks must cover the no-JS fallback, asset references and budget, topic-to-message correctness, contact destinations and script-failure state. Do not make the redesigned implementation fit obsolete draft assertions.
- Update DESIGN.md and its sidecar from the approved replacement components once they exist; do not preserve the rejected layout as the future design authority.

## 7. Delivery order and acceptance gates

**A. Art and composition first:** Produce a high-fidelity desktop opening and a separately composed mobile opening, including real type choices, meaningful artwork and actual contacts. Review these before full implementation. The concept study illustrates the proposed structure and one interaction; it does not discharge this high-fidelity gate.

**B. One working slice:** Implement the approved opening, service helper and real WhatsApp handoff. Verify keyboard, touch, disabled-JavaScript, script-failure and reduced-motion behavior before expanding the page.

**C. Complete the page and tokens:** Add preparation/contact content, finish the artwork, responsive spacing and component states. Derive the documented design system from those actual components.

**D. Separate visual review from technical review:** Inspect 1440px desktop and 390px mobile, plus narrow/enlarged-text cases. A passing technical scan cannot override a failed visual review. Use independent fresh-context critique and record the specific visual evidence.

Reject the redesign if any of these remain:

- Changing garment nouns to “consulting” still makes the page visually plausible.
- The first phone screen cannot identify blouse/dress making, Coimbatore, an enquiry action and substantial tailoring artwork.
- The artwork is a small corner icon, a generic gradient shape or a placeholder passed off as the finished illustration.
- The page repeats the old cream/Georgia/hairline-table composition or three consecutive identical split sections.
- Topic selection only changes a colour; it must change useful copy and the actual encoded message.
- Required content depends on hover, drag, motion or working JavaScript.
- Public copy adds unverified services or repeats filler in place of useful detail.
- The page misses contrast/focus/reflow requirements, shifts layout as assets load, or exceeds the agreed budgets without a reasoned revision.

The high-fidelity desktop/phone review was shown before applying the reviewed version to the earlier `site/` snapshot. The React implementation preserves that direction and adds topic-linked SVG motion. The rejected original is archived under `docs/rejected-static-draft/`. Current evidence and run commands are in `docs/react-implementation.md`.

## 8. Review synthesis and choices rejected

- **GPT-6 Astra:** proposed the illustrated cutting-table composition, compact expressive sans typography, simpler topic helper, and explicit visual rejection criteria. These form the recommended direction.
- **Gemini 4 Argon:** independently identified the template palette/type, repetitive layout/copy and generic handoff. Its visible-message-preview and no-JS suggestions are retained. Its cream/vermilion/serif alternative is rejected because it risks recreating the rejected visual family; its kurta/alteration and detailed construction options are excluded because those services are unconfirmed.
- **UI/UX Pro Max:** the fashion query returned a pink/gold minimal hero-features-CTA pattern with stagger effects. This is a category recommendation, not a distinctive Navodhai identity; do not adopt its layout, palette or animation preset. Use its accessibility and responsive-control guidance instead.

Official reference research examined the content structures of [Raw Mango](https://rawmango.com/) (campaign and craft sections) and [Bodice](https://bodice.co.in/) (collection and designer-note sections). The lesson is to give the subject its own authored visual material and distinct sections. Their commerce structure, brand language, assets and specific craft claims do not transfer to Navodhai. This was source/content research, not a browser-based visual audit of those sites.

## 9. Inputs and boundaries

Business focus, contacts and service area are already confirmed. No need to ask for them again. Approved V4 logo/brand files remain absent, so show the proposed typography/palette honestly rather than claiming brand approval. Real studio/process photography may replace illustration later if wanted and supplied; it is not required for this illustration-led approach. Public domain/hosting and actual service-specific capabilities remain separate publication/content inputs.
