---
name: "Navodhai - local draft"
description: "Historical tokens of the rejected local draft; not authority for the redesign."
colors:
  paper: "#fbf8f5"
  plum: "#462238"
  plum-deep: "#35182a"
  muted: "#6b5662"
  rose: "#f2e5e8"
  gold: "#9a7135"
  rule: "#d8c9ce"
  contact-muted: "#ddcbd5"
  contact-rule-mobile: "#886579"
typography:
  display:
    fontFamily: 'Georgia, "Times New Roman", serif'
    fontSize: "clamp(3.2rem, 6.5vw, 5.9rem)"
    fontWeight: 400
    lineHeight: 1.06
    letterSpacing: "-0.035em"
  display-mobile:
    fontFamily: 'Georgia, "Times New Roman", serif'
    fontSize: "clamp(2.8rem, 9.5vw, 4.5rem)"
    fontWeight: 400
    lineHeight: 1.06
    letterSpacing: "-0.035em"
  headline:
    fontFamily: 'Georgia, "Times New Roman", serif'
    fontSize: "clamp(2.2rem, 4vw, 3.5rem)"
    fontWeight: 400
    lineHeight: 1.14
    letterSpacing: "-0.025em"
  title:
    fontFamily: 'Georgia, "Times New Roman", serif'
    fontSize: "clamp(1.8rem, 3vw, 2.25rem)"
    fontWeight: 400
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  body:
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.7
  intro:
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    fontSize: "1.2rem"
    fontWeight: 400
    lineHeight: 1.6
  process-title:
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    fontSize: "1.0625rem"
    fontWeight: 600
    lineHeight: 1.5
  label:
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    fontSize: "0.9375rem"
    fontWeight: 500
    lineHeight: 1.5
  small:
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.7
  wordmark:
    fontFamily: 'Georgia, "Times New Roman", serif'
    fontSize: "2.3rem"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "-0.03em"
rounded:
  button: "3px"
spacing:
  page-gutter: "clamp(1.25rem, 6vw, 6rem)"
  section-block: "clamp(4rem, 7.5vw, 7rem)"
  column-gap: "10%"
  stack: "2rem"
  paragraph: "1.1rem"
  button-padding: "0.8rem 1.4rem"
components:
  button-primary:
    backgroundColor: "{colors.plum}"
    textColor: "{colors.paper}"
    typography: "{typography.label}"
    rounded: "{rounded.button}"
    padding: "{spacing.button-padding}"
  button-primary-hover:
    backgroundColor: "{colors.plum-deep}"
  button-light:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.plum}"
    typography: "{typography.label}"
    rounded: "{rounded.button}"
    padding: "{spacing.button-padding}"
  button-light-hover:
    backgroundColor: "{colors.rose}"
  navigation:
    textColor: "{colors.plum}"
    typography: "{typography.body}"
  service-row:
    textColor: "{colors.muted}"
    padding: "2rem 0"
---

> **Archived historical record.** Component names, paths, measurements and release instructions below describe earlier versions. See the [archive index](../README.md) for preserved snapshots, working reproduction commands and current guidance.

# Design System: Navodhai

> **Rejected visual direction, 14 November 2026.** This file records the current draft's actual implementation, which the user rejected. Do not extend or preserve its aesthetics for new work. Use the [replacement redesign plan](../boutique-redesign-plan.md) for the proposed direction; document the replacement system after it is selected and implemented.

## Overview

**Creative North Star: "A personal conversation"** (provisional description of the implemented page).

Quiet serif headings, readable system sans-serif copy, open rows and generous space give this small boutique page a personal, restrained character. Paper is the base; rose and plum create flat section changes.

This records the actual [static page](index.html) and [stylesheet](styles.css), following the settled [direction contract](../landing-page-direction.md). It is a **LOCAL DRAFT**, not an approved V4 brand specification. Earlier V4 assets and exact values were not supplied. The palette, plain text wordmark and local system fonts are deliberate temporary decisions. The finish review returned "ship — LOCAL DRAFT scope"; no public deployment is represented here.

**Key Characteristics:**

- Serif display type paired with system sans-serif body copy.
- Restrained asymmetric columns that become one reading column on phones.
- Flat color bands, fine rules and direct contact links.

## Colors

The frontmatter holds the exact current values, including the mobile-only contact divider.

- **Primary:** Plum carries headings, body emphasis, the primary action and contact background. Deep plum is the primary action's hover state.
- **Secondary:** Antique gold is used for the wordmark dot and the skip-link focus outline.
- **Neutral:** Paper is the page background and inverse text/action surface; rose is the process band and inverse-action hover. Muted plum supports secondary copy; the pale rule separates open rows. Contact-muted lightens supporting copy on plum. Contact-rule-mobile separates the stacked contact details.

These values preserve the earlier plan's color families provisionally. They are not extracted or approved V4 values.

Sidecar tonal ramps are synthesized preview aids, not additional implementation tokens.

## Typography

Display uses the Georgia stack; body and controls use the native system sans-serif stack. There are no downloaded fonts, images or replacement logo assets.

- **Display:** The hero uses the display token, limited to 13ch; at the mobile breakpoint it uses display-mobile and 15ch.
- **Headline:** Section headings use the headline token and a 17ch maximum width.
- **Title:** Service names use the title token; process titles use the smaller, semibold sans-serif process-title token.
- **Body:** Main copy uses body. Hero supporting copy and contact details are slightly larger (1.0625rem); the hero's opening sentence uses intro. About and service copy cap at 54ch on desktop.
- **Labels:** Actions use label. Location, contact labels and footer use small; the decorative hero-bottom captions use 0.8125rem.
- **Wordmark:** The header uses wordmark, shrinking to 2rem on narrow phones. The footer wordmark is 1.6rem with inherited body line-height and normal letter-spacing.

Headings balance their lines and allow long words to wrap; paragraphs use pretty wrapping. The system is fluid rather than a fixed-ratio type scale.

## Layout

The centered content width is `min(100% - 2 * var(--page-gutter), 80rem)`. Shared vertical section padding uses section-block. The hero has a 1.45fr / 1fr grid, a 6% column gap, a 3rem row gap and fluid top padding (`clamp(3.5rem, 6.5vw, 6rem)`). About, process and contact use equal columns with the column-gap token and a 3rem row gap; service rows use equal columns with the same column gap. Services start with only 0.75rem top padding after the about section.

At **760px and below**, these grids become one column. Main stacked sections use a 2rem gap; service rows retain their 0.75rem row gap and reduce vertical padding to 1.6rem. The section-heading introduction stacks; the second decorative hero caption disappears. About and service copy allow 65ch. Contact details gain 2rem top padding and a fine contact-rule-mobile border.

At **400px and below**, the header wraps with 1.25rem vertical padding, navigation uses a 1.5rem gap, and the footer becomes a column. Navigation always wraps naturally. Grid children have `min-width: 0`; email addresses wrap anywhere. There are no fixed-height content sections.

## Elevation & Depth

No shadows, gradients, overlays or floating cards are used. Depth comes from paper, rose and plum section backgrounds, whitespace and single-pixel rules.

## Shapes

The page is predominantly square and open. Action links alone have subtly softened corners using the button radius token. Separators are 1px strokes. The wordmark is plain text with a gold dot; the action arrow is an inline 18px SVG.

## Components

- **Primary action:** Inline-flex link with a 1rem text/arrow gap, at least 52px high, maximum width 100%, and a 1px transparent border. Its padding, type, radius and colors are in the frontmatter. Hover changes to deep plum.
- **Inverse action:** The same geometry on the plum contact band; paper changes to rose on hover. It has a 2rem top margin.
- **Navigation:** Plain inline links, each at least 44px high; no underline at rest, underline on hover. No overlay menu or selected-state treatment.
- **Text/contact links:** Inherit contextual color, with a 1px underline and 0.3em underline offset; hover thickens the underline to 2px. The stronger text link uses weight 500 and 0.5rem vertical padding. Contact destinations are the confirmed phone, email and WhatsApp links in the source.
- **Open service rows:** Fine top borders, plus a final bottom border; display-serif names beside muted descriptions. No card backgrounds.
- **Process list:** Native ordered markers in display serif (1.25rem), a 2rem item gap and sans-serif titles; the list sits directly on rose.
- **Keyboard focus:** A 2px outline offset by 6px, plum on light sections and paper inside contact. The offscreen skip link appears on focus, uses a gold outline, and targets the main landmark. Anchor scroll padding is 2rem.
- **Motion and selection:** Only action background changes transition (120ms ease-out), removed for reduced motion. Selection is plum/paper, inverted to rose/plum in contact. Forced-colors mode gives action borders the system ButtonText color.

This page uses ordinary anchor navigation and direct contact links, with no JavaScript, imagery, inputs, forms, chips or card library.

## Do's and Don'ts

### Do:

- Do preserve the documented provisional palette and font stacks when extending this local draft.
- Do keep open rows, readable line lengths, wrapping contact details and visible keyboard focus.
- Do update these extracted tokens and the sidecar together when the implementation changes.

### Don't:

- Don't describe this draft as approved V4 branding or a public release.
- Don't invent a logo, brand font or imagery to fill the missing approved assets.
- Don't add card, input or animation patterns to this reference unless they exist in the page.

