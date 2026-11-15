# Repository workflow

- Develop on `development` or a feature branch created from it. Keep `main` for reviewed pull request merges.
- Run `pnpm validate` before requesting a merge. Keep the existing Vite+ formatting, linting and test tooling.
- Open pull requests into `main`. Prefer merge commits so development history stays connected.
- GitHub Actions deploys reviewed `main` to Cloudflare after validation. Production is public and indexable; feature/PR builds remain unindexed and are not published to the production domains.
- After validation succeeds on `main`, GitHub Actions merges it into `development` without rewriting branch history. If that merge conflicts, resolve it on `development`; never force push either shared branch.
- Keep `.env*`, `.wrangler/`, dependencies and generated output out of commits. `.env.example` is safe configuration documentation. Cloudflare credentials belong in the OS keyring and GitHub Actions secrets.
- Public indexing requires both SITE_ENV=production and SITE_VISIBILITY=public. Do not publish a feature build over production or add paid Cloudflare services as part of ordinary feature work.
