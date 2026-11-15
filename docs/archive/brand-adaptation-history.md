> **Archived historical record.** Component names, paths, measurements and release instructions below describe earlier versions. See the [archive index](README.md) for preserved snapshots, working reproduction commands and current guidance.

# Canva V4 brand adaptation

## Stable refresh with illustration motion retained

The brand/heading session entrance has been removed following the user's refresh-flicker report. The full garment-choice layout and theme icon now appear in prerendered HTML at their final dimensions, with controls enabled in place after hydration. Both local fonts are preloaded from the head, reducing fallback-font swapping without blocking readable text. The existing illustration pose/seam motion, explicit theme transition, dark default and saved appearance remain.

`pnpm validate` passes formatting, lint, TypeScript, all 13 interaction/theme/prerender tests, both builds and resource budgets. The prerender test now verifies visible, initially disabled controls and the default Blouse selection. In the actual static build, desktop dark and 390px mobile light comparisons between script-free HTML and the hydrated page found 0px position/size changes for the header identity, theme control, heading, introduction, enquiry area/action and next section. The desktop refresh recorded no layout-shift entries; both fonts were loaded from their preloads, text had no entrance animations, and mobile light preference survived reload. No horizontal overflow was found. Resource estimate: 428,381 bytes; JavaScript: 104,376 gzip bytes, assuming host text compression.

The development server remains on 5173. A local production preview is available on 4173 for reviewing the actual prerendered static delivery rather than the development server's client boot process.

## Dark default, entrance motion and scrollbar

First visits now open in dark mode before painting, independent of the device setting. Saved light or dark choices still take precedence; HTML/CSS also use dark without JavaScript. The existing borderless appearance control and reduced-motion-aware theme crossfade remain.

The already-visible header identity and hero heading get one gentle 360ms entrance per browser session: 65% to full opacity, a 4px upward movement and 60ms stagger. The native Web Animations API adds no dependency; reduced motion suppresses it and later refreshes do not replay it. Other sections remain readable without scroll-triggered reveals. The thin native scrollbar uses Antique Gold on dark canvas and muted Plum on Ivory, with a rounded WebKit fallback.

`pnpm validate` passes formatting, lint, TypeScript, all 13 interaction/theme/prerender tests, both builds, prerendering and resource budgets. Fresh incognito review confirmed dark with no saved preference, the completed entrance, and a saved light choice surviving reload. Desktop dark and 390px mobile light checks found no horizontal overflow; the mobile light Axe WCAG A/AA check reported zero violations. Estimated resources: 428,515 bytes; JavaScript: 104,588 gzip bytes, assuming host text compression. The local server remains on port 5173.

## Clear hero choices and default enquiry

The hero now starts with **Blouse** selected, including a matching WhatsApp destination in prerendered HTML. Its group label is **Choose your piece.** Full borders, 6px corners, hover states and a contrasting selected fill make the choices recognisable as controls. Checks remain visible on mobile; all three choices fit one row at the narrow phone width with 48px target heights. The footer's general enquiry remains independent. No new services, assets or dependencies were introduced.

The existing header proportions were reviewed and retained: 64px monogram frame with 32px companion text on desktop; 48px with responsive 20–24px text on phones. Rendered group centring differed from the page centre by under 0.2px in desktop and narrow-phone checks, with no overlap or overflow. Browser checks confirmed default Blouse, a correct change to Dress, and zero Axe WCAG A/AA violations in the checked mobile dark state. `pnpm validate` passes all 13 updated tests, formatting, lint, TypeScript, builds, prerendering and resource budgets. Resource estimate: 428,354 bytes; JavaScript: 104,470 gzip bytes, assuming host text compression.

## Restrained monogram shadow

The monogram already has a transparent background. A soft alpha-following CSS drop shadow now gives it a little depth without a rectangular background, badge or glow. Light mode uses a 2px downward offset, 3px blur and 18% Royal Plum; dark mode uses the same offset/blur at 32% black. The smaller footer mark uses a 1px/2px shadow at 30% black. Source pixels, colours, framing and alignment are unchanged. No bitmap edits or new assets were needed.

`pnpm validate` passes all 13 tests, formatting, lint, TypeScript, builds, prerendering and resource budgets. Desktop dark and mobile light review confirmed the intended shadows, no console errors and no mobile overflow. Estimated resources total 428,266 bytes; JavaScript is 104,491 gzip bytes, assuming host text compression.

## Full-colour identity and optical alignment

The original gold/rose monogram is now used in both themes, replacing the charcoal header variant on light surfaces. The name stays Royal Plum on Ivory and Ivory on dark surfaces. Original PNG pixels and colours are unchanged; no logo generation, recolouring, filters or new bitmap assets were introduced.

The 200px source image has nontransparent bounds at x=33…167, y=47…159. A native SVG viewport `33 47 135 113` frames that existing PNG, preventing its invisible padding from skewing layout and making the actual artwork more prominent. Header frames are 64px on desktop and 48px on phones; the footer frame remains 44px. A small `0.04em` optical adjustment aligns the companion lettering's visible cap height to the monogram. Rendered desktop measurements placed the group centre within 0.2px of the page centre and the visible artwork/text vertical centres within 0.7px. Narrow/mobile checks found no control overlap or overflow. Adaptive single-ink favicons remain unchanged.

`pnpm validate` passes formatting, lint, TypeScript, all 13 tests, builds, prerendering and resource budgets. Shared Chromium review confirmed the full-colour mark in both themes and zero Axe WCAG A/AA violations in the checked mobile light state. Resource estimate: 428,215 bytes; JavaScript: 104,491 gzip bytes, assuming host text compression. The development server remains available on port 5173.

## Static header and animated appearance switch

The user rejected the floating strip over the hero. Its fixed positioning, compact state, frame, blur, scroll/resize listeners and entrance animation are removed. The larger centred monogram/name lockup stays in normal page flow. The sun/moon button is now a bare 22px glyph within the same 44px touch target, without a permanent border or background. Keyboard focus remains visible.

Explicit appearance changes rotate/fade the overlaid sun/moon icons and use a 220ms whole-page crossfade through `document.startViewTransition` where available. Unsupported browsers still update appearance and animate the icon; reduced motion applies the new theme immediately without either effect. No transition runs on initial appearance restoration. The latest choice wins if requests interrupt each other, and saved preference, favicons and browser theme colour remain synchronised. Native transition behaviour was checked through Context7 against [MDN's ViewTransition reference](https://developer.mozilla.org/en-US/docs/Web/API/ViewTransition).

`pnpm validate` passes all 13 tests, formatting, lint, TypeScript, builds, prerendering and resource budgets. The former docking test now checks interrupted theme requests; reduced-motion coverage verifies that no page transition starts. Shared Chromium checks confirmed the 180/260ms icon and 220ms page animations, zero permanent theme-button border, no overlay after scrolling, no control overlap or overflow, and zero Axe WCAG A/AA violations in desktop dark and mobile light states. Resource estimate: 428,340 bytes; JavaScript: 104,535 gzip bytes, assuming host text compression. The server remains local on port 5173.

## Expanded identity and floating header

The opening identity is now horizontal and larger: 80px monogram with 32px GFS Didot companion name on desktop, or a 64px mark and responsive 20–24px name on phones. The name remains companion text rather than a reconstruction of the logo's source lettering. After the header's original position leaves view, the same header docks into a 64px floating bar with a 40px mark and 20px name on the left and the single existing theme control on the right. The bar is lightly tinted, uses bounded backdrop blur with an opaque fallback, and has a short 220ms entrance suppressed for reduced motion. Scrolling back restores the expanded identity. No new assets or dependencies were added.

`pnpm validate` passes all 13 tests, formatting, lint, TypeScript, builds, prerendering and resource checks. The added regression test covers docking/return, a single theme button, preserved appearance and stable switching around the threshold. Shared Chromium checks confirmed readable expanded/floating states, no overflow or control overlap at narrow widths, and zero Axe WCAG A/AA violations in desktop light and mobile dark states. A mobile CSS layer conflict was corrected so the compact state remains 40px/20px and 64px tall. Native top navigation returns to scroll position zero and restores the expanded lockup. The resource estimate is 428,255 bytes; JavaScript is 104,479 gzip bytes, assuming host text compression. The development server remains on port 5173.

## Compact contact/footer closing

The preparation/FAQ section is removed. Contact and footer are now one semantic footer: a large Didot **Let’s talk.** heading and direct WhatsApp text action above a slim identity/contact row. The existing gold monogram is displayed at 44px on the plum surface in both themes, beside Navodhai and the confirmed Coimbatore service area. Phone and email remain visible native links. A 48px floating up-arrow replaces the old text link and appears after scrolling; it follows a native `#top` anchor. No new bitmap assets or business claims were added.

`pnpm validate` passes formatting, lint, TypeScript, all 12 interaction/theme/prerender tests, builds and resource budgets. The former disclosure test now covers scroll-dependent top navigation; prerender checks verify a single contact/footer with no disclosures. Shared Chromium review measured approximately 267px desktop and 299px mobile closing heights, with zero Axe WCAG A/AA violations in desktop dark and mobile light states. Narrow-phone checks found no overflow or contact links covered by the floating control, and clicking the icon returned to the top. Total resource estimate: 427,732 bytes; JavaScript: 104,342 gzip bytes. These assume host text compression. The development server remains on port 5173.

## Miniature editorial illustrations

The second section now includes three small transparent studio-object illustrations: an ivory pattern piece, a stitched dusty-rose swatch, and a reference sketch with a plum pencil. They use the existing palette, remain static, and display at 88px on desktop or 56px beside mobile headings. The three 192px WebPs total 23,054 bytes and are lazy-loaded with decorative empty alternative text. Original generated PNGs and the exact built-in image_gen prompt set are preserved in [the artwork record](../branding/idea-illustrations/README.md).

All 12 tests, formatting, lint, TypeScript, builds, prerendering and resource checks pass. Browser checks confirmed all assets loaded, no overflow down to the narrow phone layout, and zero Axe WCAG A/AA violations in desktop light and mobile dark states. The full resource estimate is now 428,176 bytes, including all assets; JavaScript is 104,522 gzip bytes. These estimates assume host text compression. The server remains local on port 5173.

## Editorial second section

The approved **Made around your idea** redesign replaces the second enquiry widget. Its spacious two-column layout places the introduction beside three notes about the overall look, details and the visitor's starting point. Fine rules separate the notes; adaptive surface colour differentiates the section from the hero. It stacks at 760px and contains no selector, message preview, enquiry button or additional artwork. The overlapping starting-point FAQ has been removed, leaving the reference and date disclosures. Hero appearance and behaviour are unchanged.

The removed widget, garment-study component, service prompts and associated styles are no longer shipped. `pnpm validate` passes all 12 updated interaction/theme/prerender tests, formatting, lint, TypeScript, production builds and resource checks. The new section is present in prerendered HTML and works without JavaScript. Shared Chromium checks found no overflow or Axe WCAG A/AA violations in desktop light and mobile dark states. Estimated compressed transfer is 404,858 bytes; JavaScript is 104,428 gzip bytes. These remain file-size estimates assuming host compression, not hosted timing measurements.

## Hero simplification after visual feedback

The user's latest feedback supersedes the appearance control and visible artwork-disclosure choices below. Light surfaces now use the supplied charcoal monogram, while dark surfaces retain gold/rose; the footer uses the same adaptive component. A 44px sun/moon icon button replaces the dropdown, names its next action accessibly, and preserves the device default until the visitor makes a saved manual choice.

The hero's action now reads **Enquire** with the WhatsApp brand glyph, while its accessible name remains **Enquire on WhatsApp** and the destination still follows the garment selection. The glyph is shared by the other WhatsApp actions, using the [Simple Icons WhatsApp path](https://github.com/simple-icons/simple-icons/blob/develop/icons/whatsapp.svg), distributed under CC0. The visible illustration caption and tips below the hero action have been removed as requested. Alternative text still identifies the artwork as conceptual. The introduction is shorter, the signature is centred across the grid, and garment selection uses immediate colour states to avoid transient contrast loss.

`pnpm validate` passes with 12 tests and no formatting, lint or type warnings. The final transfer estimate is 406,893 bytes including all deployed logo variants; JavaScript is 105,286 gzip bytes. The agent-browser headless Chromium check found zero WCAG A/AA violations in light desktop and dark mobile states, confirmed the matching WhatsApp message behind the stable action label, and found no overflow at 320px. The shared T3 browser stopped producing frames when its desktop window was hidden, so its incomplete visual capture was not used as evidence. The development server remains available on port 5173.

## Current opening and adaptive appearance

Completed the interrupted header/hero redesign on 14 November 2026. The original adaptation record below describes the preceding version; this section supersedes its header, artwork, appearance and verification details.

- The separate navigation header and horizontal logo strip have been replaced by an integrated opening: small standalone monogram and business name, centred heading, transparent textile study, concise introduction and garment choices. Hero choices and the service radios share selection and update both actual WhatsApp destinations. The desktop composition becomes a two-column tablet layout and a single-column phone layout.
- The user supplied the [brand source folder](https://www.canva.com/folder/FAHZ1jv9jcs) and [final export pack](https://www.canva.com/folder/FAHZ1n3aFV4). The connector confirmed `FAHZ319vb24`, **Exports — 01 Logos & Monograms**, with gold/rose asset `MAHZ2eogwKw`, charcoal asset `MAHZ2XNbw5Q` and white asset `MAHZ2awQRFE`. Local deployed copies are `src/assets/brand/monogram-{gold,charcoal,white}-export.png`, each 200×200. The gold mark is displayed at 64px, or 56px on phones; charcoal and white are adaptive favicons. These are supplied artwork, not reconstructed logos. Canva originals were not edited.
- The transparent artwork is `src/assets/textile-study-cutout.webp`, 1448×1086 and 183,060 bytes, with a real alpha channel. The generated source is `docs/branding/textile-study-cutout-source.png`. It remains visibly captioned as conceptual tailoring artwork.
- Auto follows the device's colour preference and live changes. Manual Light/Dark choices persist in browser storage. The head script applies the preference before rendering; CSS supports device dark mode without JavaScript. Favicons and browser theme colour track appearance. The dark interface uses `#261A24` canvas, `#392732` supporting surface, Ivory text and actions, `#DBC4C4` muted text, `#806373` rules and Antique Gold focus. The contact close stays Royal Plum in both themes.

Verification: `pnpm validate` passes formatting, lint, TypeScript, **12 tests**, production builds, HTML prerendering and resource budgets. The added regression test exercises live device-theme changes, manual override and return to Auto. Existing tests cover saved appearance, linked garment choices, keyboard radios, reduced motion, native disclosures and usable prerendered contact links.

The production build was checked in the shared Chromium preview at desktop, tablet and phone widths, including a 320px narrow layout. No horizontal overflow was found. Settled light desktop and dark mobile states returned zero Axe WCAG A/AA and best-practice violations. One scan during the 180ms selected-button colour transition reported transient contrast; a scan after the transition completed returned zero violations. Browser interactions confirmed that selecting Dress produces matching hero/service messages, and that Auto follows the device's dark setting. No application console errors were observed. This is a bounded Chromium review, not a cross-browser or public-host performance audit.

The resource estimate is **405,869 bytes**, counting HTML, CSS, all deployed logo variants, both fonts, artwork and compressed JavaScript. JavaScript is **104,803 gzip bytes**. Both remain within the 450,000-byte total and 120,000-byte JavaScript budgets. These are file-size estimates assuming host compression, not hosted timing measurements. The site remains local and noindex.

## Initial adaptation record

Applied locally on 14 November 2026 from the user's [Navodhai Digital Brand & Website Guidelines 1.0 — V4 Companion](https://www.canva.com/design/DAHaQEXgEaY/fDaqct8s6JiPj700SnSebA/edit), design `DAHaQEXgEaY`. The Canva connector retrieved all ten pages, rich text and embedded image metadata. A draft transaction was opened only to inspect embedded asset IDs, then cancelled without edits. The Canva source remains unchanged.

## Verified identity

| Source | Website use |
|---|---|
| Pages 3–4: fixed primary, horizontal and monogram artwork | Horizontal lockup in the header; transparent monogram in the footer and favicon |
| Page 5: Royal Plum `#47162F` | Opening, masthead, contact, actions and light-surface focus |
| Page 5: Ivory `#F9F0E3` | Light page surfaces and readable inverse text |
| Page 5: Antique Gold `#BE9A63` | Decorative thread, focus on plum and inverse-action hover fill |
| Page 5: Dusty Rose `#C88B96` | Textile illustration and decorative SVG garment study |
| Page 5: Charcoal `#302830` | Body text |
| Page 6: GFS Didot 400 / Inter | Self-hosted display / supporting type; synthetic bold and italic disabled |
| Pages 7 and 9: logo space, native controls, 120–360ms useful motion | Protected logo proportions/space, 44px+ targets, reduced motion and shorter transitions |

Muted text `#6A505D`, surface `#F2E3D9` and rule `#DAC7B9` are derived interface neutrals. They are documented as supporting values rather than extracted identity colours. The guideline's Noto Sans Tamil recommendation is reserved for future Tamil content; the current page remains English.

## Assets and provenance

- Header: Canva asset `MAHZ3Nz3aOM`, originally labelled `Navodhai_V4_Horizontal_Logo_Dark_2400x826.png`. Local file: `src/assets/brand/navodhai-v4-horizontal.png`.
- Footer/favicon: Canva asset `MAHZ3L3wTpU`, originally labelled `Navodhai_V4_Transparent_Gold_Rose_Monogram.png`. Local file: `src/assets/brand/navodhai-v4-monogram.png`.
- The connector exposes 200px preview PNGs, not original-resolution downloads. Larger derivative requests were unavailable; the provided preview pixels are retained intact. The horizontal image is displayed at no more than its 200px source width, and at 152px on phones; the transparent symbol is displayed at 64px. These are real embedded V4 artwork, not reconstructed lettering or AI-upscaled substitutes. Original exports would improve high-density display quality and can replace the files without redesigning the page.
- Fonts come from the official Google Fonts [GFS Didot](https://fonts.google.com/specimen/GFS+Didot) and [Inter](https://fonts.google.com/specimen/Inter) distribution. Local Latin WOFF2 files total 62,796 bytes. OFL notices are in `public/licenses/`; CSS source responses are retained in `docs/branding/font-source/`. Inter was requested explicitly as a 400–600 variable range.
- The existing conceptual textile composition was edited with the built-in imagegen tool using the Canva palette page as reference. The result preserves the pattern layout while replacing orchid/lavender and bright yellow with plum, ivory, dusty rose and antique gold. The original is `docs/branding/textile-study-v4-source.png`, the 149,032-byte WebP is `src/assets/textile-study-v4.webp`, and the exact prompt is in `docs/branding/illustration-prompt.txt`. Logo artwork was not passed through imagegen.
- `docs/branding/canva-reference/` contains the retrieved guideline previews. These, source PNGs and documentation are not deployed.

## Scope and implementation

The opening is Royal Plum and the supporting page is Ivory, with the guideline's display/body pairing. The original enquiry flow, confirmed contacts, three services, preparation disclosures and static prerendering remain. The guideline's gallery/R2/real-garment examples do not reintroduce the cancelled product/CMS scope. Artwork remains visibly labelled **Conceptual tailoring illustration.** No real portfolio, stock, prices, turnaround or additional services were invented.

Motion timings are now 320ms for a single opening movement, 180ms for action feedback, 200ms for enquiry changes, 360ms for seam drawing and 240ms for native disclosure enhancement. No looping animation or essential hidden content was added. The header's logo and tagline are fixed artwork; GFS Didot is companion page typography, not an attempted match to the logo's unknown source font.

## Verification

`pnpm validate` passed: formatting, lint, TypeScript, all eight existing interaction/prerender tests, production client/server-entry builds, HTML prerendering and resource checks. The output check now requires both V4 assets and counts PNG bytes in the resource budget.

Estimated initial compressed transfer is **359,461 bytes**, including both PNG logos, both fonts, artwork, HTML, CSS and JavaScript. JavaScript is **103,691 gzip bytes**. Both are within the 450,000-byte total and 120,000-byte JavaScript budgets. These are file-size estimates assuming host text compression, not hosted timing measurements.

Computed palette contrast: Ivory/Plum **13.07:1**, Charcoal/Ivory **12.64:1**, muted/Ivory **6.37:1**, muted/supporting surface **5.74:1**, and Plum/Gold hover **5.61:1**. Gold/Ivory is only **2.33:1**, so gold stays decorative on light surfaces. These are colour calculations, not a fresh rendered accessibility audit.

The Impeccable source detector was run once. It flagged the intentionally required Inter face and the old design document's font/size declarations. The design document and sidecar were then updated to the supplied V4 identity and actual type ramp; Inter is retained because it is explicitly required by the brand guide. No browser screenshots, device review or new Axe scan were run for this branding turn; earlier migration captures/audits describe the earlier styling. Source/build checks pass, and final visual approval remains with the user in the running local app.

The app remains local and noindex. No public deployment, message, email or call was made. Run `pnpm dev` for port 5173; build with `pnpm build` and deploy only `dist/` when publication is requested.
