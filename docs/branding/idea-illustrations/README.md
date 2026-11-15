# Miniature tailoring illustrations

Created with the built-in **image_gen** tool on 14 November 2026 for the three notes in Made around your idea. The [complete prompt set](prompts.json) records the exact generation prompts. These are conceptual studio objects, not photographs of Navodhai's work. No brand logo was generated or edited.

| Note | Deployed artwork | Preserved generated source | WebP bytes |
|---|---|---|---:|
| The overall look | [pattern.webp](../../../src/assets/idea-illustrations/pattern.webp) | [pattern-source.png](pattern-source.png) | 5,360 |
| The details | [seam.webp](../../../src/assets/idea-illustrations/seam.webp) | [seam-source.png](seam-source.png) | 9,210 |
| Your starting point | [reference.webp](../../../src/assets/idea-illustrations/reference.webp) | [reference-source.png](reference-source.png) | 8,484 |

The generated PNGs were downscaled and encoded with FFmpeg as 192×192 WebP, quality 82, compression level 6, preserving alpha. No compositing, background replacement or artistic editing was performed. Web assets total **23,054 bytes**. Original PNGs and prompts remain outside the deployment output.

Illustrations display at 88px beside each note on desktop, and 56px beside the headings below 760px. They are static, lazy-loaded and decorative with empty alternative text; the notes remain understandable independently. The illustrations retain their original colours in both themes.

`pnpm validate` passes all 12 tests, formatting, lint, TypeScript, builds, prerendering and resource budgets. Shared Chromium review found all three assets loaded, no horizontal overflow at desktop/mobile/narrow widths, and no Axe WCAG A/AA violations in desktop light and mobile dark states. The complete deployment resource estimate is **428,176 bytes** with host text compression assumed; JavaScript is **104,522 gzip bytes**.
