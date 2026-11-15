# Git and Cloudflare deployment workflow

Repository: https://github.com/mnishanth02/navadhai-website (public, approved by the owner).

Cloudflare publishes reviewed `main` through GitHub Actions. Main protection requires PRs and an up-to-date passing `validate` check, including for administrators. Force pushes and deletion are disabled. The owner approved making the repository public and subsequently approved a public, indexable website launch.

Develop on `development`, or create a short feature branch from it. Open a PR into `main` and use merge commits. Feature builds default to noindex and do not deploy over the production domains.

The validation job runs formatting, lint, types, unit/build tests, resource checks and Chromium tests against the actual local Cloudflare runtime. Main builds set SITE_ENV=production and SITE_VISIBILITY=public. The deploy job runs only after successful validation and publishes the website before its apex redirect. Install/build steps do not receive the deployment credential; only the deploy step receives the scoped CLOUDFLARE_API_TOKEN GitHub Actions secret.

The `sync-development` job runs only after validation succeeds for a push to `main`. It merges main into development and pushes without force. Existing development changes are preserved. A conflict fails the job for a manual resolution instead of overwriting changes. Before starting more work, run `git switch development` then `git pull --ff-only`.

## Custom domain

Cloudflare account: 68876249314ab88c8b5bdb86ba5fd8c8. The asset-only Worker `navodhai-website` serves `www.navodhai.in`. The asset-only Worker `navodhai-apex` supplies permanent 308 redirects from the apex and HTTP www routes, preserving paths and queries. Neither has a custom server script, database or paid binding. Cloudflare retains the domain's existing nameservers and manages DNS/certificates for the Worker custom domains.

Target routing after the migration:

| Type                 | Host / pattern           | Target           |
| -------------------- | ------------------------ | ---------------- |
| Worker custom domain | www.navodhai.in          | navodhai-website |
| Worker custom domain | navodhai.in              | navodhai-apex    |
| Worker route         | http://www.navodhai.in/* | navodhai-apex    |

Replace only the retired Vercel web records; preserve unrelated mail/TXT/other DNS records. The canonical origin is https://www.navodhai.in/. Wrangler 4.162.0 is pinned in the project. Local OAuth credentials use the Windows keyring. The Actions token is scoped to this account and zone, with Workers Scripts Edit, Workers Routes Edit, Zone Read and DNS Edit permissions. Tokens must never be committed or logged.

Run `pnpm validate` before a PR. For a release, set SITE_ENV=production, SITE_VISIBILITY=public and SITE_URL=https://www.navodhai.in, then validate and run `pnpm deploy`. The deploy command refuses internal builds or an unexpected production canonical origin. To test deployed domains, set SMOKE_BASE_URL=https://www.navodhai.in and SMOKE_APEX_URL=https://navodhai.in, then run `pnpm test:smoke`.

For rollback, select the preceding Cloudflare deployment version and revert the source change through a PR. No service upgrade or paid binding is part of this static setup.

The static response policy uses `no-transform` to prevent Cloudflare's automatic analytics injection from changing CSP-hashed HTML. Analytics is outside this launch's scope. HTML revalidates, while fingerprinted assets have a single one-year immutable cache policy. The browser checks verify both policies and reject injected analytics scripts.

## Retired Vercel hosting

On 15 November 2026, the owner requested removal before migration. The `navodhai-landing` project, deployments and Vercel ownership of navodhai.in were deleted. API checks confirmed project 404 and an empty team domain list. Local linkage/OIDC files and source deployment adapters were removed. Unrelated projects and global account access were preserved.
