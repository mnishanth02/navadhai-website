# Git and deployment workflow

Repository: https://github.com/mnishanth02/navadhai-website (public, approved by the owner).

Vercel's Git connection is active with production branch `main`. The local working branch is `development`. Main branch protection is enabled: pull requests and the `validate` check are required, branches must be up to date, and the rule applies to administrators. Force pushes and deletion are disabled. The owner approved making the repository public so these protections are available without a plan upgrade. Publishing source does not disable Vercel Authentication or enable site indexing.

Develop on `development`, or create a short feature branch from it. Open a PR into `main` and require the `validate` GitHub Actions check before merging where the account plan supports branch protection. Prefer merge commits. Vercel's Git integration builds previews for development and PR pushes and production deployments for merges into `main`.

The Vercel build runs formatting, lint, type checks, unit/build tests and static resource checks. Full Chromium smoke tests run in GitHub Actions. Production target does not imply public launch: the site's default indexing policy remains internal and Vercel Authentication is configured for **all deployments**, including custom domains.

The `sync-development` job runs only after validation succeeds for a push to `main`. It merges main into development and pushes without force. Existing development changes are preserved. A conflict fails the job for a manual resolution instead of overwriting changes. Before starting more work, run `git switch development` then `git pull --ff-only`.

## Custom domain

Vercel project: `mnishanth02s-projects/navodhai-landing`. The primary domain is `www.navodhai.in`; `navodhai.in` redirects permanently (308) to www. DNS remains hosted at Cloudflare, with existing nameservers retained. Both domains passed Vercel's DNS verification on 15 November 2026 and are assigned to the production deployment from `main`.

Verified DNS configuration on 15 November 2026:

| Type | Name | Target | Cloudflare proxy |
| --- | --- | --- | --- |
| A | @ | 64.29.17.1 | DNS only |
| A | @ | 216.198.79.1 | DNS only |
| CNAME | www | 0e44cd2a22220128.vercel-dns-017.com | DNS only |

Preserve mail/TXT/other DNS records when updating web records. HTTPS, the apex-to-www redirect and the authenticated homepage were verified. `SITE_URL=https://www.navodhai.in` is configured in Vercel for Production and Preview so canonical and share URLs match the primary domain. Vercel CLI 65.16.0 is installed globally and authenticated; use `vercel domains verify navodhai.in --scope mnishanth02s-projects` and the corresponding www command when rechecking DNS.

Keep all-deployment authentication enabled and `SITE_VISIBILITY` internal for testing. Before a public commercial launch, use a commercially eligible hosting plan, explicitly enable public visibility, rebuild and verify indexing/metadata on the domain.
