---
name: "Navodhai V4 boutique"
description: "Canva Digital Brand & Website Guidelines 1.0 applied to the React landing page."
colors:
  royal-plum: "#47162f"
  ivory: "#f9f0e3"
  antique-gold: "#be9a63"
  dusty-rose: "#c88b96"
  charcoal: "#302830"
  muted: "#6a505d"
  surface: "#f2e3d9"
  rule: "#dac7b9"
  hero-light-core-light: "rgb(200 139 150 / 18%)"
  hero-light-edge-light: "rgb(190 154 99 / 7%)"
  hero-light-core-dark: "rgb(190 154 99 / 15%)"
  hero-light-edge-dark: "rgb(200 139 150 / 6%)"
typography:
  header-name:
    fontFamily: "GFS Didot, Georgia, serif"
    fontSize: "2rem"
    fontWeight: 400
    lineHeight: 1.1
  header-name-mobile:
    fontFamily: "GFS Didot, Georgia, serif"
    fontSize: "clamp(1.25rem, 6vw, 1.5rem)"
    fontWeight: 400
    lineHeight: 1.1
  hero-tagline:
    fontFamily: "GFS Didot, Georgia, serif"
    fontSize: "clamp(3.5rem, 6.2cqi, 5.75rem)"
    fontWeight: 400
    lineHeight: 1.02
    letterSpacing: "-0.025em"
  hero-tagline-mobile:
    fontFamily: "GFS Didot, Georgia, serif"
    fontSize: "clamp(1.875rem, 16cqi, 4.5rem)"
    fontWeight: 400
    lineHeight: 1.02
    letterSpacing: "-0.025em"
  hero-service:
    fontFamily: "Inter, Arial, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.6
  hero-service-mobile:
    fontFamily: "Inter, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  display-base:
    fontFamily: "GFS Didot, Georgia, serif"
    fontSize: "clamp(2.5rem, 4.7vw, 4.25rem)"
    fontWeight: 400
    lineHeight: 1.14
  heading:
    fontFamily: "GFS Didot, Georgia, serif"
    fontSize: "clamp(1.85rem, 3.1vw, 2.65rem)"
    fontWeight: 400
    lineHeight: 1.15
    letterSpacing: "-0.012em"
  editorial-heading:
    fontFamily: "GFS Didot, Georgia, serif"
    fontSize: "clamp(2.5rem, 4.2vw, 3.75rem)"
    fontWeight: 400
    lineHeight: 1.1
  editorial-note:
    fontFamily: "GFS Didot, Georgia, serif"
    fontSize: "clamp(1.625rem, 2.25vw, 2rem)"
    fontWeight: 400
    lineHeight: 1.2
  contact-heading:
    fontFamily: "GFS Didot, Georgia, serif"
    fontSize: "clamp(3.5rem, 7vw, 6rem)"
    fontWeight: 400
    lineHeight: 1.05
  body:
    fontFamily: "Inter, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.65
  body-large:
    fontFamily: "Inter, Arial, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.65
  contact-link:
    fontFamily: "Inter, Arial, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 500
    lineHeight: 1.65
  caption:
    fontFamily: "Inter, Arial, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.65
rounded:
  control: "6px"
  scrollbar-thumb: "10px"
  top-link: "50%"
spacing:
  step: "8px"
  gutter: "clamp(1.25rem, 5vw, 5rem)"
  section: "clamp(3.5rem, 7vw, 6.5rem)"
components:
  hero-pointer-light:
    width: "clamp(20rem, 52cqi, 46rem)"
  action:
    backgroundColor: "{colors.royal-plum}"
    textColor: "{colors.ivory}"
    rounded: "{rounded.control}"
    padding: "0.85rem 1.35rem"
  idea-surface:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.charcoal}"
---

# Navodhai V4 design system

## Overview

The visual authority is the user's Canva **Digital Brand & Website Guidelines 1.0 — V4 Companion**, design `DAHaQEXgEaY`. Its ten pages were read on 14 November 2026. See `docs/branding/canva-brand-adaptation.md` for source pages and asset provenance. This supersedes the provisional white/aubergine/orchid system; the requested brand takes precedence over earlier anti-template palette/font preferences. Current source is `src/`, built through Vite+ into static `dist/`.

## Colors

Use the five exact V4 colours above. Muted, surface and rule are derived interface neutrals, not additional identity colours. The light opening and page use Ivory with Plum headings, Charcoal body text and Plum actions. The dark page uses canvas `#261A24`, surface `#392732`, Ivory text, muted text `#DBC4C4`, rules `#806373` and Ivory actions with Plum text. The contact close stays Royal Plum with Ivory content in both appearances. Dusty Rose belongs to the textile material. Antique Gold is a controlled detail and focus colour on dark surfaces, never body text or a focus boundary on ivory.

The opening and footer use the supplied original gold/rose monogram in both themes. The name uses Royal Plum on Ivory and Ivory on dark surfaces. Preserve the PNG's pixels, proportions and colours without recolouring. A soft CSS drop shadow follows the mark's alpha: 2px down with 3px blur at 18% Plum on light surfaces or 32% black on dark surfaces; the smaller footer mark uses a 1px/2px shadow at 30% black. Keep its background transparent, without a badge, frame or glow. The shared monogram component uses an SVG viewport `33 47 135 113` around the source PNG's nontransparent bounds, excluding invisible padding from its visible framing without redrawing the artwork. Header frames are 64px on desktop and 48px on phones, with 32px GFS Didot companion text or responsive 20–24px text on phones. A `0.04em` optical adjustment aligns the Didot lettering's visible cap height with the mark. The complete group is centred in a grid with balanced side columns. The compact closing frame remains 44px beside the business name and service area. The header name uses companion type, not a recreation of the logo's unknown source lettering. Favicons use tightly cropped 96px single-ink marks: Charcoal on Ivory for light appearance and white on Royal Plum for dark/default appearance. A 16/32/48px ICO provides the browser fallback. Apple and Android home-screen icons use the original full-colour monogram on Ivory; the maskable variant reserves the central safe zone. The static 1200?630 share card carries the approved tagline, services, locality and conceptual textile study. Current local PNGs are 200px connector previews, sufficient for these display sizes. The rejected horizontal logo strip is no longer rendered.

## Typography

GFS Didot 400 is the companion display face; it is not claimed to be the logo's unknown source font. Inter 400–600 carries body and controls. Both are self-hosted Latin WOFF2 subsets with OFL notices and `font-display: swap`; head preloads start both downloads before CSS discovery to reduce text swapping. Disable synthetic bold/italic. Text is 16–18px at the normal root size; captions are at least 14px. The site remains English; Noto Sans Tamil is the guideline's future Tamil face, not a reason to add unrequested translated copy or another font download.

## Layout

The centred brand lockup sits above the hero, with one borderless sun/moon icon button on the right. When the header container is at most 16rem wide, including when the visitor enlarges text, the identity gets the full first row and the theme control sits at the right of a second row. The monogram and name can also wrap within their link if needed. This header stays in normal page flow and scrolls away. The floating bar, compact identity state, frame, blur and docking listeners were removed after the user rejected the strip over the content. There is no replacement overlay. The separate floating back-to-top icon remains at the lower edge of the page.

The hero retains the approved editorial option A: the two-line **Be a princess.** headline at the left, the transparent textile illustration in the centre, and garment choices with a WhatsApp action at the right. The service description **Blouse & dress making.** and confirmed locality sit beneath the tagline. Content is capped at 1248px. Larger display type, more vertical space and a slightly wider artwork composition give the textile the leading role. The centred header remains in normal flow, with a fine bottom rule separating the identity from the hero.

At an opening container width of 72rem or less, the headline and illustration share two columns, with the enquiry controls in a full-width row beneath. That row aligns the garment choices with the action and is separated from the composition by a fine rule. At 42rem or less, the reading order becomes centred tagline/service/locality, illustration, then enquiry. The phone headline uses container-relative type with a 1.875rem minimum so its two lines remain intact at 320px with 200% root text. These rem-based thresholds also adapt to enlarged text rather than squeezing columns. Tablet/phone garment choices wrap when enlarged labels need room. The artwork stays fully visible at 4:3, without a rectangular background.

Made around your idea follows as a supporting-surface band. A two-column introduction sits above three open service columns, each with a fine top rule, a 112px conceptual studio-object illustration, a Didot title and a short description. There are no enclosing cards or shadows. At 760px the introduction and services become single-column; the illustrations sit beside their titles at 72px, reducing to 64px with 24px titles below 540px. The next canvas section, Start with a conversation, retains a two-column composition and explains three online-enquiry steps in a semantic ordered list. Didot list markers and fine separators clarify the sequence. It stacks at 760px. Visits in Coimbatore are optional and arranged as needed. These sections have no duplicate selector, message preview or enquiry button. The removed preparation/FAQ is not restored. Conceptual illustrations never stand in for real work photographs.

The single plum contact/footer closes the page after the services and ordering sections. A Didot **Let’s talk.** heading, sized from 56px to 96px, shares a baseline with an underlined WhatsApp text action. More space separates the invitation from the compact identity/contact row: 44px gold monogram, Navodhai, confirmed service area, phone and email. The row stacks at 760px; phone/email stack at 540px. Bottom padding reserves room for the fixed back-to-top control so it does not cover the final contact row at page end. No separate footer strip, repeated tagline or extra picture is added. The fixed 48px circular up-arrow appears after scrolling beyond the smaller of 480px or 60% of viewport height. It is a native top link with an accessible name and a two-colour focus ring for visibility over both page and footer surfaces.

## Components

- The hero action and closing WhatsApp link are at least 52px tall; identity/contact links have at least 44px targets and the floating top link is 48px. Footer text is Ivory on Plum with Gold hover/focus states. No appended arrow glyphs.
- Hero garment buttons sit under **Choose your piece.** and use full rectangular boundaries, 6px corners, hover feedback and immediate pressed states. Blouse is selected by default with a subtle surface fill, stronger border and visible check, leaving the solid WhatsApp action as the strongest control. The check remains visible on mobile and a system-colour inset outline preserves selection in forced colours. At normal text sizes the three choices fit one phone row with 48px minimum heights and compact 14px labels; enlarged labels wrap into additional rows. Selection updates the opening's actual WhatsApp destination and decorative seam marks. The initial hero destination is a blouse enquiry, including in prerendered HTML; the footer retains an independent general enquiry. The visible action stays **Enquire**, with the WhatsApp brand glyph and accessible name **Enquire on WhatsApp**. No helper paragraph appears below it. The glyph is reused for the contact action.
- Appearance uses a borderless 44px sun/moon icon button labelled with its next action, **Switch to light mode** or **Switch to dark mode**. It has a transparent background and no permanent outline; keyboard focus retains the shared visible focus style. Dark is the first-visit default regardless of the device setting; manual light/dark choices persist in local storage and take precedence. Explicit changes rotate/fade the two overlaid icons and use a short native page crossfade where supported. Interrupted requests preserve the latest choice. A head script sets the saved theme before painting, while the HTML and CSS retain the dark default without JavaScript. Favicons and browser theme colour track the active appearance.
- Build-time React rendering includes the static brand header, complete page, static editorial section and contact/footer with direct general/contact links. The theme and garment controls are visible at their final size before hydration, with buttons disabled until ready. Hydration enables them in place and activates the scroll-dependent top icon. Missing application JavaScript leaves the identity, readable content and working contact routes, including the footer monogram's native top link.
- Focus is a 3px outline with 5px offset: plum on light surfaces and gold on dark surfaces. Text selection and caret use the same palette. The native scrollbar is thin, with Antique Gold on the dark canvas or muted Plum on Ivory; older WebKit engines receive a 10px track and rounded inset thumb. Forced-colour boundaries are retained. Long words and labels wrap at enlarged text sizes.

## Motion and assets

The header and hero share one decorative pointer-following light behind their content. One canvas spans the page top through the bottom of the hero, preserving the banner and main landmarks. A broad ellipse tracks the actual mouse position continuously across both areas, with a damped spring (stiffness 170, damping 30, mass 0.6); opacity uses stiffness 250, damping 35, mass 0.5. Entry places it directly at the pointer before fading in; movement then follows with a soft lag. This replaces the research study's barely visible 24px centre offset, making the tracking apparent. The wash is clamp(20rem, 52cqi, 46rem) wide at a 3:2 ratio. Its gradient uses core colour at 0%, edge colour at 38%, and transparency by 72%. Light appearance uses 18% Rose / 7% Gold; dark appearance uses 15% Gold / 6% Rose. These are alpha treatments of the existing palette, not extra brand colours. Text, artwork and controls stay in their normal positions; only the clipped, noninteractive background layer moves. It uses Motion spring values rather than React state per pointer event. There is no idle animation loop or permanent will-change. The light fades when the pointer leaves the combined header/hero area or on native scrolling, and resets on resize, blur, page hiding, offscreen exit and input/preference changes. Touch/coarse input, reduced motion, forced colours, missing JavaScript and the prerendered state retain the plain canvas. It never captures clicks, changes the native cursor or intercepts scrolling.

Explicit appearance changes use a 220ms whole-page crossfade through the native View Transition API where available, with 180ms opacity and 260ms rotation/scale transitions for the sun/moon icon. The initial theme applies directly before painting. Reduced motion skips the native transition and disables the icon transitions. Browsers without the API still switch correctly with local icon feedback. The user approved a subtle entrance specifically for the hero tagline: its two intact lines settle upward by 4px, from 94% to full opacity over 650ms, with a 90ms offset on the second line and a decelerating cubic-bezier(0.16, 1, 0.3, 1). CSS starts it once per page load without a hydration trigger; the words remain readable throughout. It does not loop or replay when garment/theme state changes, and reduced motion leaves the tagline fully static. The brand header, body, enquiry layout and theme icon remain visible and steady from the initial HTML. Content never waits for scrolling to become visible. Hero motion retains the 320ms small artwork rotation/translation, 180ms button feedback and 360ms seam drawing. The editorial illustrations are static, lazy-loaded 192px WebP assets with preserved alpha; their sources and exact built-in image_gen prompts are in `docs/branding/idea-illustrations/`. Nothing loops or hides essential copy. Reduced-motion preferences suppress these movements and smooth scrolling; native scrolling and all contact links remain usable.

The illustration is a brand-colour adaptation of the earlier conceptual textile study. Its alternative text identifies it as a conceptual study; the visible caption was removed at the user's request. It is never a representation of actual finished work. Its source and original palette-edit prompt are retained outside `dist/`. Logos were downloaded separately from Canva and were not passed through image generation. Controls and content surfaces remain flat. The hero may use the approved soft pointer light; material depth otherwise comes from the illustration and original logo artwork. Background threads, cursor trails and study-only amplification controls are not part of the application.
