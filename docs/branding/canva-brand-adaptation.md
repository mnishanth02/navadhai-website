# Current Canva V4 brand adaptation

This record describes the assets and behavior used by the current React app. The [preserved adaptation history](../archive/brand-adaptation-history.md) contains the earlier iterations and their original verification; it is not current implementation guidance. Current tokens and layout are recorded in [DESIGN.md](../../DESIGN.md).

## Authority and provenance

The user supplied the Navodhai Digital Brand & Website Guidelines 1.0 - V4 Companion, Canva design `DAHaQEXgEaY`, and requested its application. The supplied source folder is `FAHZ1jv9jcs`; the export pack is `FAHZ1n3aFV4`. The previous connector inspection recorded export subfolder `FAHZ319vb24` and these supplied asset IDs:

| Asset | Canva ID | Current local file and role |
| --- | --- | --- |
| Original gold/rose monogram | `MAHZ2eogwKw` | [monogram-gold-export.png](../../src/assets/brand/monogram-gold-export.png), header and footer in both themes |
| Charcoal monogram | `MAHZ2XNbw5Q` | [monogram-charcoal-export.png](../../src/assets/brand/monogram-charcoal-export.png), light-theme favicon |
| White monogram | `MAHZ2awQRFE` | [monogram-white-export.png](../../src/assets/brand/monogram-white-export.png), dark-theme favicon |

The local PNGs are 200x200 connector previews, not original-resolution exports. The app preserves their pixels and proportions. The shared monogram component uses SVG viewport `33 47 135 113` to exclude transparent padding without redrawing the logo. Its header frame is 64px on desktop and 48px on phones; its footer frame is 44px. A restrained CSS shadow follows its transparency. The name is GFS Didot companion text, not a reconstruction of the logo's unknown lettering.

Source previews remain in [opening-source](opening-source/), [canva-assets](canva-assets/) and [canva-reference](canva-reference/). The former horizontal-logo runtime copy and duplicate monogram runtime copy were removed; the original downloaded references remain available here.

## Palette, type and appearance

The identity uses Royal Plum `#47162F`, Ivory `#F9F0E3`, Antique Gold `#BE9A63`, Dusty Rose `#C88B96` and Charcoal `#302830`. GFS Didot 400 is the display face; Inter 400-600 is the body/control face. The local Latin WOFF2 subsets total 62,796 bytes. Their [GFS Didot](../../public/licenses/GFS-Didot-OFL.txt) and [Inter](../../public/licenses/Inter-OFL.txt) licence notices ship with the current fonts. Original font CSS responses remain in [font-source](font-source/).

Dark is the first-visit and no-JavaScript default. Saved light/dark choices are restored before paint; the borderless sun/moon button toggles and persists the opposite appearance. Device-following Auto mode is historical. Charcoal and white favicons follow the selected appearance; the displayed header/footer monogram remains gold/rose in both themes. The contact/footer stays Royal Plum with Ivory content. Gold is decorative on light surfaces and is used for focus on dark surfaces.

The header stays in normal page flow. Its identity, heading and copy remain static on load and refresh. Appearance changes use a 220ms page crossfade where supported, with 180ms icon opacity and 260ms rotation/scale transitions. Reduced motion suppresses those effects. Hero selection retains its small 320ms artwork movement and 360ms seam drawing. There is no floating header, session entrance animation, duplicate enquiry widget, message preview or preparation/FAQ section.

## Artwork

| Current artwork | Preserved source |
| --- | --- |
| [Transparent textile study](../../src/assets/textile-study-cutout.webp), 1448x1086, 183,060 bytes | [textile-study-cutout-source.png](textile-study-cutout-source.png) |
| [Three decorative editorial studies](idea-illustrations/README.md), 192x192 each, 23,054 bytes combined | Source PNGs and exact generation prompts are linked in the artwork record |

The images are conceptual illustrations, not photographs of Navodhai's work. Hero alternative text identifies the conceptual study; the visible caption was removed at the user's request. Editorial images are static, lazy-loaded and decorative. Logos were downloaded separately and were not passed through image generation.

The earlier [original textile study and prompt](../redesign-artwork/provenance.md), [palette-edit source](textile-study-v4-source.png) and [palette-edit prompt](illustration-prompt.txt) remain for provenance. The unused original and palette-edit WebP runtime copies were removed. The original WebP is still preserved with the [archived static site](../archive/static-site/assets/textile-study.webp). Historical Bricolage/Instrument fonts and their licences remain only beside that static snapshot.

## Verification and release boundary

Use `pnpm validate` for current formatting, lint, type, 13-test, build, prerender and resource checks; see the [implementation guide](../react-implementation.md). Previous browser measurements and accessibility observations remain in the adaptation history. This cleanup does not claim a fresh browser or public-host audit.

The app remains a local draft with noindex/robots restrictions. Public deployment has not been performed. Review real domain metadata, host compression/caching, indexing and performance when preparing a launch. Deploy only the freshly built `dist/`.
