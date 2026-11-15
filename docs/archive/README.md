# Historical implementation archive

These files preserve earlier Navodhai plans, design reviews and implementations. They are historical evidence, not current requirements or release instructions. Current guidance lives in the [root README](../../README.md), [product scope](../../PRODUCT.md), [design system](../../DESIGN.md), [React implementation guide](../react-implementation.md) and [brand adaptation record](../branding/canva-brand-adaptation.md).

## Contents

| Record | Purpose |
| --- | --- |
| [Website and CMS plan](navodhai-website-plan.md), [implementation checklist](implementation-checklist.md) | Cancelled CMS, portfolio, database and infrastructure scope |
| [Static landing-page plan](static-landing-page-plan.md), [rejected direction](landing-page-direction.md), [initial verification](implementation-verification.md) | Original buildless page and its rejected visual direction |
| [Boutique redesign plan](boutique-redesign-plan.md), [redesign review](redesign-preview.md), [concept mockup](navodhai-redesign-concept.html) | Intermediate design using the superseded Bricolage/Instrument palette and fonts |
| [Static site](static-site/index.html) | One complete historical redesign snapshot, including robots policy, artwork, fonts and their licences |
| [Rejected static draft](rejected-static-draft/index.html) | Earlier rejected page, original checker and design notes |
| [Original React migration](react-implementation.md) | Original migration decisions and verification; describes components that have since been removed |
| [Brand adaptation history](brand-adaptation-history.md) | Preserved sequence of V4 changes, including superseded theme, header and enquiry behavior |
| [Initial V4 design metadata](design-metadata-initial-v4.json) | Historical design sidecar before it was aligned with the current components |
| [Review tooling](tooling/) | Static snapshot checks, font preparation, review-document generators and the rejected draft's browser inspection snippet |

During cleanup on 14 November 2026, all eight files from the former `design-preview/` were verified byte-identical to their counterparts in `site/`. Both are represented by the single `static-site/` snapshot; its robots policy came from `site/`. Historical mentions of those old paths describe the layout at the time. The commands below use the archive's current paths.

## Reproduce the static redesign checks

Run these optional historical checks from the repository root:

```powershell
python -B docs/archive/tooling/check_redesign.py
python -B docs/archive/tooling/render_redesign_review.py --qa
python -B docs/archive/tooling/render_redesign_review.py --presentation
python -B docs/archive/tooling/build_redesign_viewer.py
```

The check defaults to `docs/archive/static-site/`. Review generators read that snapshot and write disposable files under `.impeccable/review/redesign/`. The old `check_site.py` name remains a compatibility wrapper for the same static check. The optional font downloader writes only into the archive and needs network access; the preserved font files and licences are already present. The browser inspection snippet targets the rejected draft's `.button` class and does not apply to the React app.

The rejected draft has its own independent checker:

```powershell
python -B docs/archive/rejected-static-draft/check_site.py
```

Historical test counts, resource measurements, browser captures and claimed server availability describe their original sessions. Use `pnpm validate` for the current app. Deploy only the freshly built root `dist/`; archive files, original artwork and review captures stay outside the deployment output.
