> **Archived historical record.** Component names, paths, measurements and release instructions below describe earlier versions. See the [archive index](README.md) for preserved snapshots, working reproduction commands and current guidance.

# High-fidelity redesign and local implementation

> Historical static redesign review. The user subsequently requested React/Vite+, Tailwind CSS and animation libraries. Current source is `src/`, output is `dist/`, and active validation is `pnpm validate`. See [the React implementation record](../react-implementation.md). References to `site/` as canonical and the static Python commands below describe the earlier snapshot only.

Prepared 14 November 2026 after the user accepted the replacement plan. The source in `design-preview/` records the reviewed design; the same HTML/CSS/JS is now applied to `site/`, which is the canonical implementation. Their hashes were checked for equality. Both are buildless HTML/CSS with one small progressive enhancement script. The rejected version and its original checker/design notes are preserved in `docs/rejected-static-draft/`.

## What changed

- An original, clearly captioned conceptual textile illustration replaces the empty hero. The image represents pattern/fabric pieces, not Navodhai's actual garments or premises.
- Bricolage Grotesque and Instrument Sans are hosted locally with their OFL notices. The proposed white/aubergine/orchid system replaces the rejected cream/Georgia treatment. The text wordmark is not a newly approved logo.
- Native topic radios update the visible enquiry preview and the actual encoded WhatsApp URL. The helper is optional; direct WhatsApp, email and phone remain available. Without the application script, three topic links and their descriptions remain visible.
- Native preparation disclosures replace repeated about/process paragraphs. No additional products, services, stock, prices or turnaround promises are asserted.

The full illustration is preserved on phones rather than cropped through meaningful pattern edges. Topic selection changes useful preparation copy and the real enquiry text; it does not simulate a garment configurator or tint a flattened illustration. The optional fixed mobile action was omitted to keep the small page unobstructed at enlarged text sizes.

## Independent visual critique

A fresh GPT-6 Astra review inspected full desktop/mobile captures, the source and the redesign plan. It supported the direction and requested two corrections before passing the local prototype for user review:

1. Replace the poetic artwork caption with the visible **“Conceptual tailoring illustration.”**
2. Remove repeated helper invitations and provide practical preparation prompts.

Both corrections are implemented. The optional narrower desktop message measure was also applied. These small fixes were handled directly; no redundant review agent was started. The critique is a local design judgment, not public-host or brand-owner approval.

## Verification

- Rendered at 1440px, 390px and 320px. The real application code was executed in the review renderer. All three choices changed the preview and WhatsApp query to the expected matching message.
- Native disclosure markup, internal anchors, font loading and enhanced/fallback visibility assertions passed. At all three tested widths, document measurements showed no horizontal overflow, including a temporary 200% root text size.
- A separate 390px rendering omitting the application script confirmed the visible service fallback. JavaScript was available to the test assertions; this is a script-absent rendering, not a claim of manually disabling the entire browser engine.
- `node --check` verifies the enhancement script syntax. The dependency-free source checker verifies actual contacts, local assets, artwork caption, static fallback and initial resource budgets.
- No actual messages, calls or emails were sent. Keyboard and contrast remain explicit source/design checks here; this renderer is not a complete screen-reader/device audit or a hosted-performance test.

The artwork WebP is 166,682 bytes. The two font subsets total 70,108 bytes. Initial requested resources total 256,819 raw bytes, with an estimated compressed transfer of **242,622 bytes**, below the 450,000-byte budget. The enhancement script is 1,928 raw bytes / 860 estimated gzip bytes. Exact per-file results are printed by `python scripts/check_redesign.py` (also available through `check_site.py`); server compression is still a host configuration requirement. The page remains local and noindex. Domain, canonical URL, sitemap, HTTPS and real-host caching/performance remain release work.

Full-page captures: `.impeccable/review/redesign/desktop.png` and `mobile.png`; a script-absent capture is `fallback.png`. The in-conversation review offers real desktop and phone viewports, with the actual working page inside each. Generated image provenance and exact prompt are in `docs/redesign-artwork/`.

## Run or reproduce

Serve the main local implementation:

```powershell
python -m http.server 4173 --bind 127.0.0.1 --directory site
```

For the preserved review snapshot, change `site` to `design-preview`. Only `site/` contents belong in a future deployment; never deploy the original PNG, prompts, plans, scripts or review captures. Keep nonfingerprinted HTML/CSS/JS on short/revalidated caching until a versioned asset policy is chosen.
