# Navodhai

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

React and TypeScript, scaffolded with Vite+, styled with Tailwind CSS, animated with Motion, and using Lucide icons. The user explicitly requested this stack after the reviewed static redesign. Build-time prerendering produces readable static HTML; React enables the hero's garment choices and appearance toggle. Current source is `src/`, deployment output is `dist/`. Earlier implementations and plans are preserved in [the historical archive](docs/archive/README.md).

## Users

Prospective customers who want to understand the boutique's services and contact it about blouse making, dress making or customisation.

## Product Purpose

Introduce Navodhai and make it straightforward to start an enquiry from one fast page.

## Capabilities and Constraints

- Handcrafted boutique focused on blouse and dress making, explicitly confirmed by the user.
- Explain services and invite a discussion of customisation. Specific capabilities, materials, turnaround and prices are not supplied. Service area is confirmed below.
- One homepage: the hero/garment choices, confirmed services, a short online-ordering explanation, and one combined contact/footer. Public hosting is on Cloudflare Workers Static Assets, using the static output and canonical www domain.
- No product display, portfolio, commerce, CMS, database, contact form or analytics.
- The owner authorised a public, indexable launch on Cloudflare Free. Canonical domain: www.navodhai.in. Visits are optional and arranged when needed; enquiries begin online.
- Confirmed WhatsApp/contact number: +91 78459 52592; email: manjulajayanthi1@gmail.com; service area: Coimbatore, Tamil Nadu. The user supplied these during implementation on 14 November 2026.
- The owner-confirmed domain is navodhai.in. Street address, opening hours and social profiles are not supplied; never invent them. The user has now supplied the Canva V4 companion guidelines and embedded logo artwork.

## Brand Commitments

On 15 November 2026 the user requested a complete UI/design refinement using Stageshow and selected “Keep the brand and make the whole site feel more polished and boutique.” Preserve the confirmed identity and business content while improving composition, hierarchy, spacing and responsive layouts. This is a functional boutique page; Stageshow's framing and restraint principles guide the refinement without introducing a fictional app demonstration.

The confirmed brand tagline is **Be a princess.**, supplied by the user on 15 November 2026. The user approved editorial option A: tagline at the left, textile illustration in the centre, and garment choices at the right. **Blouse & dress making.** is the supporting service description. The two-line tagline has a subtle, finite entrance with a static reduced-motion alternative.

Use Navodhai, the name in the project and user confirmation. The user supplied Canva design `DAHaQEXgEaY`, Digital Brand & Website Guidelines 1.0 — V4 Companion, and asked to apply it. It is now the visual authority: Royal Plum #47162F, Ivory #F9F0E3, Antique Gold #BE9A63, Dusty Rose #C88B96 and Charcoal #302830; GFS Didot 400 headings and Inter supporting type. Use supplied V4 artwork for the monogram, never redraw it. The user subsequently requested a complete header/hero redesign, a transparent illustration and adaptive light/dark modes, supplying the source and export folders `FAHZ1jv9jcs` and `FAHZ1n3aFV4`. The current opening uses a small standalone monogram, plain business-name text, central textile cutout and linked garment choices; no separate navigation header or horizontal logo strip. Appearance defaults to dark on a first visit with a persistent manual light/dark choice. `DESIGN.md` records the implemented system and `docs/branding/canva-brand-adaptation.md` records provenance and limits.

## Evidence on Hand

Current implementation and validation are documented in [the React implementation guide](docs/react-implementation.md). Earlier scope, design decisions and verification records are preserved in [the historical archive](docs/archive/README.md) and are not current requirements. The ten-page Canva guide and embedded V4 logo previews were retrieved through the Canva connector. Local companion fonts, OFL notices and conceptual artwork are present. Real product photography, address and hours remain absent. See [the brand adaptation record](docs/branding/canva-brand-adaptation.md) for current brand evidence.

## Product Principles

- Fast, readable and functional without JavaScript.
- Both themes use the original full-colour gold/rose monogram, with its transparent padding excluded from the layout viewport for optical alignment. The name uses Royal Plum on Ivory and Ivory on dark surfaces. A sun/moon button replaces the appearance dropdown. The hero action reads Enquire with a WhatsApp glyph, without the former caption or helper tips.
- Keep the larger centred monogram/name lockup in normal page flow; the floating strip was rejected because it obscured the content. Use a borderless sun/moon control with subtle icon and page-colour transitions, while preserving the dark first-visit default, saved appearance and reduced-motion behaviour. Keep branding, body text and controls steady on refresh. The approved hero tagline may make one small settling movement while remaining readable; preserve the illustration motion. Preload the local fonts and use a slim scrollbar in the active palette.
- The header and hero share the approved soft background light following the actual mouse pointer, with visible but gentle movement. Foreground content remains steady; touch, reduced motion and forced colours keep a plain canvas.
- Brief, factual copy; no unsupported offers or claims.
- Give each section a distinct purpose: the hero starts an enquiry, Made around your idea presents the three confirmed services, Start with a conversation explains online ordering/optional visits, and one compact contact/footer closing provides direct channels. The preparation/FAQ section is removed. The closing integrates a small gold monogram and uses a floating up-arrow instead of a separate footer navigation row.
- Direct contact channels rather than a form or backend.
- Blouse is the default hero choice, with clear button boundaries and a selected check. Changes update the prepared enquiry; the footer keeps a separate general contact route.
- Missing business inputs must be visible in development documentation and never disguised with fake destinations.
