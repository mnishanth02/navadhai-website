> **Archived historical record.** Component names, paths, measurements and release instructions below describe earlier versions. See the [archive index](README.md) for preserved snapshots, working reproduction commands and current guidance.

# Static landing page verification

> **Historical initial-draft evidence.** The user rejected that page's visual design. Current redesign evidence is in [redesign-preview.md](redesign-preview.md); do not apply the old zero-script or file-size claims to the new page.

Date: 14 November 2026. Scope: local draft of `site/`, not a public deployment.

## Implemented

- One page: introduction, about, blouse/dress making services, customisation conversation, contact and footer.
- Real WhatsApp number `917845952592` with a URL-encoded general enquiry message; matching introduction/contact actions.
- Visible, copyable email `manjulajayanthi1@gmail.com`, telephone link `+917845952592` and service area Coimbatore, Tamil Nadu, all supplied by the user.
- Native links, system fonts, inline decorative arrow icons, no runtime JavaScript, no external font/image requests, no form or analytics.
- Draft `noindex, nofollow` and crawling disabled. No invented domain, canonical URL, address, hours, social links or branded icon. An empty data favicon prevents an unnecessary automatic missing-icon request.

## Checks and evidence

Browser: agent-browser using HeadlessChrome 156.0.0.0 on Windows. Local HTTP server: Python 3.13, bound to `127.0.0.1:4173`, serving only `site/`. Browser device scale factor: 1. No network or CPU throttling applied.

| Check | Result |
|---|---|
| `python scripts/check_site.py` | Passed: contacts, matching enquiry actions, encoded message, local links/anchors, draft metadata, file set and byte budget |
| Widths 320, 390, 768, 1440 CSS pixels | No horizontal overflow in document/element measurements |
| Text enlarged to 200% at 320 and 390 pixels | Initially exposed overflowing grid children/long display words; fixed with minimum-width reset and word wrapping. Final measurements show no horizontal overflow |
| Keyboard skip link | First Tab reveals visible focus; Enter moves focus to `main` and updates fragment to `#main` |
| Contact navigation | Native link reaches `#contact`, with the section top approximately 32 pixels below the viewport top |
| Reduced motion | `prefers-reduced-motion` emulation produces a computed 0-second button transition |
| Automated accessibility, axe-core 4.12.1 | Final mobile scan: 35 passing rules, 0 violations, 0 incomplete; initial desktop scan also reported 0 violations |
| Runtime requests | Only the local HTML and stylesheet are needed; the initial implicit missing-favicon request was eliminated |
| Full-page visual inspection | Desktop and mobile captures inspected; text, services and contact are present and readable |

Final deployable files:

| File | Raw bytes | Estimated gzip bytes |
|---|---:|---:|
| `index.html` | 6,976 | 2,079 |
| `styles.css` | 8,260 | 2,171 |
| `robots.txt` | 26 | 46 |
| **Total** | **15,262** | **4,296** |

The page loads only HTML/CSS; robots.txt is not a first-page rendering dependency. Gzip sizes are offline estimates, not evidence of a server's compression behavior.

Captures from the final confirmation pass are `.impeccable/review/desktop.png` and `.impeccable/review/mobile.png`. The first implementation inspection and one final confirmation were performed; no ongoing visual-polish loop is required.

## Mechanical detector

Impeccable's detector ran once over the HTML/CSS. It returned three warnings:

- `cramped-padding` on the outer process/contact sections: their backgrounds belong to the full-width section, while the inner `.page-width.section-space` wrappers provide horizontal gutters and 64–112px vertical inset. The inspected screenshots show the inset; no additional outer padding is necessary.
- `cream-palette`: the light background and plum/rose family carry forward the existing plan's restrained brand direction. Exact V4 tokens remain provisional. This is a deliberate brief constraint, not a new generic palette choice.

## Limits and release dependencies

- A local, unthrottled diagnostic reported LCP 40 ms and CLS 0; cache state was not controlled. These numbers do **not** establish the plan's cold-cache, throttled mobile acceptance target or public-host performance.
- Real-host HTTPS, compression, caching, correct metadata/domain, sitemap and indexing release changes remain unverified because no host/domain has been selected and nothing has been publicly deployed.
- WhatsApp/email/phone URLs are checked against user-supplied values. No message, email or call was sent, and recipient delivery was not tested.
- Automated accessibility and layout measurements are useful checks, not full accessibility certification. Screen-reader and mobile-device testing were not performed. Enlarged root text was tested; native browser zoom was not separately exercised.
- Copy is limited to the confirmed service categories; specific customisation capabilities need business review. Approved V4 assets/values and public-facing brand spelling remain release inputs.

## Independent finish review

A fresh-context subagent reviewed the source, active plan, direction and both final screenshots. It returned **ship — LOCAL DRAFT scope**, with no material actionable findings. It confirmed the detector warnings were resolved by the actual inner layout/intentional palette. The reviewer did not independently replay browser checks and did not approve or verify public deployment.
