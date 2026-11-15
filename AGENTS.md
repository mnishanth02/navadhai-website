# Repository workflow

- Develop on `development` or a feature branch created from it. Keep `main` for reviewed pull request merges.
- Run `pnpm validate` before requesting a merge. Keep the existing Vite+ formatting, linting and test tooling.
- Open pull requests into `main`. Prefer merge commits so development history stays connected.
- Vercel deploys `main` to the production target and other branches to previews. Production is still authenticated and unindexed during internal testing.
- After validation succeeds on `main`, GitHub Actions merges it into `development` without rewriting branch history. If that merge conflicts, resolve it on `development`; never force push either shared branch.
- Keep `.env*`, `.vercel/`, dependencies and generated output out of commits. `.env.example` is safe configuration documentation.
- Do not enable public indexing or disable authentication as part of ordinary feature work.
