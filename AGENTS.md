# Repository Guidelines

## Project Structure & Module Organization

Astro handles routing from `src/pages`, with shared layout primitives in `src/layouts` and global styles in `src/styles`. Domain logic is grouped under `src/modules` (e.g. `events`, `meetups`, `organizations`) while cross-cutting utilities live in `src/modules/shared`. Database schemas, content migrations, and seeds live in `db/`, and static assets are split between `public/` for runtime delivery and `docs/` for marketing collateral.

## Build, Test, and Development Commands

Install dependencies with `pnpm install --frozen-lockfile` to stay aligned with CI. Use `pnpm dev` for hot-reload development, `pnpm build` for production bundles, and `pnpm preview` to inspect the compiled output. Run `pnpm astro check` whenever you touch Astro collections or TypeScript types to catch regressions early.

## Coding Style & Naming Conventions

Prettier enforces two-space indentation, single quotes, trailing commas, and no semicolons; format large sets of changes with `pnpm exec prettier --write .`. Tailwind utility order is normalized by `prettier-plugin-tailwindcss`, so keep class lists descriptive rather than rearranging manually. Use `PascalCase` for React components, `camelCase` for hooks and utilities, and kebab-case filenames for route-level `.astro` files to match Astro expectations.

## Testing Guidelines

An automated suite is not in place yet; add coverage alongside the feature you touch (e.g. `src/modules/events/__tests__/event-form.spec.ts`) and keep fixtures small. At minimum, exercise critical flows (creating events, joining meetups, auth) against `pnpm dev` before requesting a review. When altering database tables or seeds, run the relevant script in `db/` and document the dataset or migration steps in your PR.

## Commit & Pull Request Guidelines

This repo uses `@commitlint/config-conventional`, so follow `type(scope): subject` (`feat(events): add recurring schedules`) and keep subjects under 72 characters. Enable the local hooks with `pnpm exec simple-git-hooks`; the `pre-commit` hook runs `pretty-quick` to enforce formatting prior to linting. PRs should describe the problem, the approach, any manual testing, and include screenshots for UI work; call out new `.env` keys or config changes so reviewers can reproduce.
