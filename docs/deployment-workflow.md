# Git and deployment workflow

Repository: https://github.com/mnishanth02/navadhai-website (private).

Develop on `development`, or create a short feature branch from it. Open a PR into `main` and require the `validate` GitHub Actions check before merging where the account plan supports branch protection. Prefer merge commits. Vercel's Git integration builds previews for development and PR pushes and production deployments for merges into `main`.

The Vercel build runs formatting, lint, type checks, unit/build tests and static resource checks. Full Chromium smoke tests run in GitHub Actions. Production target does not imply public launch: the site's default indexing policy remains internal and Vercel Authentication is configured for **all deployments**, including custom domains.

The `sync-development` job runs only after validation succeeds for a push to `main`. It merges main into development and pushes without force. Existing development changes are preserved. A conflict fails the job for a manual resolution instead of overwriting changes. Before starting more work, run `git switch development` then `git pull --ff-only`.

## Custom domain

Vercel project: `mnishanth02s-projects/navodhai-landing`. Both `navodhai.in` and `www.navodhai.in` are assigned; www redirects permanently (308) to the apex domain. DNS remains hosted at Cloudflare, with existing nameservers retained.

Vercel's project-specific recommendations on 15 November 2026:

| Type | Name | Target | Cloudflare proxy |
| --- | --- | --- | --- |
| CNAME | @ | 0e44cd2a22220128.vercel-dns-017.com | DNS only |
| CNAME | www | 0e44cd2a22220128.vercel-dns-017.com | DNS only |

Cloudflare supports CNAME flattening at the apex. Apply only these web records, preserving mail/TXT/other DNS records. Vercel's ownership verification has passed; DNS routing remains pending. Re-run `vercel domains verify navodhai.in --scope mnishanth02s-projects` and the corresponding www command after DNS changes, then verify HTTPS and the redirect. Vercel issues the certificate after routing validates.

Keep all-deployment authentication enabled and `SITE_VISIBILITY` internal for testing. Before a public commercial launch, use a commercially eligible hosting plan, explicitly enable public visibility, rebuild and verify indexing/metadata on the domain.
