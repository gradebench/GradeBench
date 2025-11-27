<!-- GradeBench: guidance for AI coding agents -->

This file gives focused, actionable guidance to an AI coding assistant working in the GradeBench monorepo (TurboRepo + Next.js frontend).

High level
- Monorepo: root uses turbo for orchestration. Top-level scripts (see `package.json`) delegate to `turbo run`.
- Main frontend: `apps/web` is a Next.js (app router) site using TypeScript, Tailwind, shadcn/ui and local UI package `@gb/ui`.

Quick commands (run from repo root)
- Install & run dev for all affected apps: npm ci; npm run dev (root) => runs `turbo run dev`.
- Frontend dev only: cd apps/web && npm run dev (uses `next dev --turbopack --port 3000`).
- Build: npm run build (root) or cd apps/web && npm run build.
- Tests: npm run test (root runs `turbo run test`). Per-app: cd apps/web && npm run test (runs vitest).
- Lint / biome: npm run lint (root uses Biome). Type checks: npm run check-types.

Conventions & patterns
- Component library: shared UI lives in `packages/ui` (consumed as `@gb/ui`). Prefer using shared UI primitives: `@gb/ui/src/components/ui/*` (Button, Card, Typography) instead of creating new visual primitives.
- File layout: Next.js App Router under `apps/web/src/app`. Page-level route files are in folders (e.g. `src/app/(quick)/quick/page.tsx`). Keep route-level metadata in `src/app/manifest.ts`, `sitemap.ts`, `robots.ts`.
- Styling: Tailwind CSS v4 utilities and `prettier-plugin-tailwindcss` are used. Use the existing spacing/utility scale and class patterns within `ui/styles/globals.css`.
- Animations & icons: lucide-react is used for icons; motion library is used for animations. Reuse `components/anim/GradeBench*` animations when present.

Testing and CI hints
- Unit tests: Vitest configured in `apps/web` (script: `vitest run --coverage`). Use `@testing-library/react` and `jsdom` environment.
- E2E: Playwright is configured at `apps/web/playwright.config.ts` and e2e tests live in `apps/web/e2e`. Use `npx playwright install` before running tests in CI. Playwright expects test server or staging environment; CI workflows in `.github/workflows` show examples.
- Turborepo CI: Use `npx turbo run <task>` with filters to limit work to affected packages (see `docs/test.md` for sample CI steps: `npx turbo run test --concurrency 6`).

Integration points & external deps
- Backend APIs: repo mentions Hono.js backend patterns in docs (tests assume in-memory Hono server). When adding front-end fetches, look for `libs/tanstack/client.ts` and `ReactQueryProvider.tsx` for existing query client usage.
- Shared packages: `packages/*` and `elements/*` are local workspaces. Import paths often use `@gb/...` aliases; respect TS path aliases configured in workspace configs.

What to change and what not to change
- Safe edits: UI components, page content, static configs, and tests remain safe to change in PRs.
- Risky areas: build & CI workflows, TypeScript config files under `packages/typescript-config`, and shared package public APIs. If you modify those, update tests and run `npm run build` locally.

Examples (explicit references)
- Reuse shared Button: import { Button } from "@gb/ui/src/components/ui/button" (see `apps/web/src/features/site/components/templetes.tsx`).
- Follow site content docs in `docs/site.md` and `docs/ui-prompt.md` for copy and component expectations when editing hero/feature pages (see `apps/web/src/features/site/*`).
- Tests: see `docs/test.md` for Vitest + Playwright guidance and the recommended CI flow.

If uncertain, ask for these specifics
- Which packages are allowed to change public API (packages that can be refactored without breaking others)?
- Which CI workflows do you want me to update or add (unit, e2e, nightly performance)?

End of file.
