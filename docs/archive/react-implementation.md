> **Archived historical record.** Component names, paths, measurements and release instructions below describe earlier versions. See the [archive index](README.md) for preserved snapshots, working reproduction commands and current guidance.

# Navodhai React implementation

> This records the original React migration and its checks. The subsequent Canva V4 brand adaptation replaces the provisional typography, colours, logo and motion timings described below. See [the current brand adaptation record](../branding/canva-brand-adaptation.md) and root `DESIGN.md` for active values and latest verification.

Implemented and validated locally on 14 November 2026. This follows the user's explicit request for React, Vite+, Tailwind CSS and researched animation tools. The accepted illustrated boutique direction and confirmed business facts are retained. The previous `site/` and `design-preview/` versions are historical snapshots.

## Stack and library decisions

| Tool | Installed version | Role and reason |
|---|---|---|
| Vite+ | 1.6.0 | Actual scaffolding, development, production builds, formatting, lint, type checks and test commands |
| React / React DOM | 19.3.1 | Typed components, state and hydration |
| Tailwind CSS / Vite plugin | 4.3.5 | Theme tokens, utility styles and component styling through the first-party plugin |
| Motion | 14.14.0 | React interaction feedback and authored SVG motion graphics, using `LazyMotion`, `domAnimation` and `m` components |
| Lucide React | 1.73.0 | Consistent imported contact/disclosure icons |
| Original assets | Local | Conceptual textile illustration and original garment-pattern SVG paths; no fabricated portfolio or products |

The application was scaffolded with Vite+'s `vp create` workflow, using pnpm for the Windows template handoff. The initial npm template handoff failed with a Windows command-quoting error; switching the scaffolder to pnpm completed successfully. React and the Tailwind plugin were then integrated into the generated Vite+ project. Node 24.20.0 and pnpm 12.18.0 were used for validation. The lockfile is retained with the source for reproducible installs; no Git commit or publication was performed in this session.

The decisions follow the official [Vite+ create guide](https://viteplus.dev/guide/create), [Tailwind Vite integration](https://tailwindcss.com/docs/installation/using-vite), [Motion bundle guidance](https://motion.dev/docs/react-lazy-motion), [Motion SVG animation API](https://motion.dev/docs/react-svg-animation) and [Lucide React guide](https://lucide.dev/guide/react).

Motion covers both animation needs here: UI feedback and SVG seam drawing. [GSAP's React integration](https://gsap.com/resources/React/) was evaluated for complex timelines, but the current page does not need a second timeline engine. [dotLottie Web](https://github.com/LottieFiles/dotlottie-web) was evaluated for authored Lottie playback; there is no Lottie asset to justify a separate player/runtime. Lucide supplies icons, not the signature illustration. Original SVG keeps the small garment study directly connected to the chosen enquiry topic.

## Implementation

- `src/content.ts` owns confirmed business facts and topic/message definitions. No address, hours, prices, stock, unconfirmed services or delivery promises were added.
- `src/App.tsx` contains the page, direct enquiry actions, conceptual-art caption, native preparation disclosures and independent contact channels.
- `src/components/Enquiry.tsx` uses native radios. Selection updates the service prompt, live message preview, exact encoded WhatsApp destination and SVG study together. Selecting a topic sends nothing.
- `src/components/SeamStudy.tsx` draws an original blouse/dress/customisation study with a 750ms seam animation. It is decorative, not a sewing pattern or a promised garment configurator.
- Motion adds a single 900ms/6px opening-art movement, 2px action hover feedback, press feedback and a 200ms message transition. No animation loops. Reduced motion makes state changes immediate. Disclosures use native HTML with a progressive 240ms CSS expansion where supported.
- Fonts and artwork are local and fingerprinted by the build. Original image provenance remains in `docs/redesign-artwork/`; font OFL notices ship in `dist/licenses/`.

## Static output and fallback

`pnpm build` builds the client, builds a temporary SSR entry, then runs `scripts/prerender.mjs` to render the complete React page into `dist/index.html`. The browser uses `hydrateRoot` on that markup. This follows React's [server rendering](https://react.dev/reference/react-dom/server/renderToString) and [hydration](https://react.dev/reference/react-dom/client/hydrateRoot) APIs. Rendering happens at build time; only static hosting is needed in production.

The prerendered page includes real text, artwork, native disclosures, general/contact links and three topic-specific enquiry links. The enhanced helper starts hidden and appears after hydration. If the application script is missing, the direct topic links remain usable. Essential content never starts transparent or waits for scroll animation.

Deploy only `dist/`. The `.prerender/` directory is build tooling/evidence and must not be deployed. Vite's dev source HTML is not the production artifact and is not expected to work without JavaScript; validate fallback against the production preview.

## Validation evidence

Commands completed successfully:

```powershell
pnpm install --frozen-lockfile
pnpm validate
```

- Formatting passed for 15 files; lint and type checks passed for 11 source/config files.
- Eight tests passed: three topic handoffs, arrow-key selection, independent contact links, native disclosures, reduced-motion behavior and prerendered fallback content.
- Production client build, build-time server entry and HTML prerender all passed.
- Browser checks on production port 4173 confirmed hydration, loaded fonts/artwork, mouse and arrow-key topic selection, the changed message/destination/SVG, and disclosure opening. No app request failures or console errors were observed.
- Axe 4.14.0 on the final production page reported **zero violations and zero incomplete rules**. The audit library was loaded locally for the check; it is a dev dependency and is not shipped in the application bundle.
- Desktop 1440px and mobile 390px layouts were inspected. A requested 320px viewport rendered as 321px in the shared browser, with 306px usable document width. At 200% root text size, the final page had no document or visible-content overflow. The visually hidden accessibility legend was excluded from inner-scroll measurements. Wrapping fixes cover actions, message labels, garment annotations and disclosure questions.
- A production rendering with application script elements removed showed the complete headline and three correct direct topic links, with the helper hidden. This tests absent application JavaScript; browser JavaScript remained available for assertions. Reduced motion was exercised through a mocked media query in component tests and the CSS preference rules were inspected; this is not a physical-device or screen-reader audit.

Estimated initial compressed transfer is **348,777 bytes**, including HTML, CSS, JavaScript, both fonts and artwork. JavaScript is **103,524 gzip bytes**. Both pass the revised 450,000-byte total and 120,000-byte JavaScript limits. The original 15 KB JavaScript limit was superseded by the user's React/Motion requirement. Details are generated in `.prerender/build-report.json` by `scripts/check-build.mjs`. These are file-size estimates assuming host compression, not hosted timing or LCP measurements.

Review viewport captures are under `.impeccable/review/react/`. The old `.impeccable/review/redesign/` captures describe the earlier static page. No messages, emails or calls were sent, and no public deployment was performed. Draft noindex/robots policy remains in place until a real domain and hosting release are prepared.
