<!--
================================================================================
SYNC IMPACT REPORT
================================================================================
Version Change: INITIAL → 0.1.0
Constitution Type: Initial Ratification

Modified Principles:
- NEW: Principle 1 - Strict Monorepo Topology
- NEW: Principle 2 - Dependency & Package Management
- NEW: Principle 3 - Frontend-Only Architecture
- NEW: Principle 4 - Next.js Application Standards
- NEW: Principle 5 - Data Fetching & State Management
- NEW: Principle 6 - Shared Internal Standards
- NEW: Principle 7 - Quality Assurance & Observability
- NEW: Principle 8 - Deployment & Accessibility

Added Sections:
- Core Principles (8 principles total)
- Governance

Templates Requiring Updates:
✅ plan-template.md - Constitution Check section aligns with new principles
✅ spec-template.md - Requirements structure compatible with frontend-only architecture
✅ tasks-template.md - Task categorization supports monorepo structure
✅ README.md - Updated to reflect constitution version and principle count

Follow-up TODOs:
- None - all placeholders filled

Notes:
- This is the initial ratification of the GradeBench Web constitution
- All 8 principles are frontend-focused and monorepo-specific
- Strict enforcement of Turborepo + NPM + Node.js stack
- External backend API consumption model established
- Better-Auth, TanStack Query, and Zustand mandated for their respective domains
================================================================================
-->

# GradeBench Web Constitution

## Core Principles

### 1. Strict Monorepo Topology

The repository MUST be a Turborepo monorepo using NPM as the sole package manager and Node.js as the runtime.

**Non-Negotiable Rules:**

- `turbo` and `@biomejs/biome` (Linting/Formatting) MUST be installed/configured only at the root.
- `.gitignore` MUST only exist at the root.
- Workspace structure MUST be strictly enforced:
  - `apps/*`: Next.js frontend applications.
  - `packages/*`: Low-level shared internal packages (prefixed `@gb/`).
  - `kits/*`: High-level abstractions/internal SDKs (prefixed `@gb-kits/`).

**Rationale:** Centralized tooling configuration ensures consistency across all workspaces. The three-tier workspace structure (`apps`, `packages`, `kits`) provides clear separation of concerns: applications consume functionality, packages provide low-level utilities, and kits offer high-level abstractions. This topology prevents circular dependencies and enables efficient caching via Turborepo.

---

### 2. Dependency & Package Management

All internal package dependencies within consuming `package.json` files MUST use the wildcard version `"*"` to delegate linking to the monorepo manager.

**Non-Negotiable Rules:**

- **Wildcard Dependencies:** All internal package dependencies MUST use `"*"` (e.g., `"@gb/ui": "*"`).
- **Internal Package Strategy:** Internal packages MUST follow one of two patterns:
  - **Just-In-Time (JIT) Packages:**
    - MUST export TypeScript/source files directly via `"exports"` (e.g., `"./button": "./src/button.tsx"`).
    - MUST NOT have a build script.
    - `package.json` imports MUST target source (`"./src/*"`).
  - **Compiled Packages:**
    - MUST export built artifacts via `"exports"` (e.g., `"default": "./dist/button.js"`).
    - MUST include a build script (e.g., `"build": "tsc"`).
    - `package.json` imports MUST target distribution (`"./dist/*"`).

**Rationale:** Wildcard versioning eliminates version mismatch issues in monorepos and delegates resolution to the workspace manager. The JIT vs. Compiled distinction optimizes for development speed (JIT) versus production stability (Compiled). JIT packages enable hot module replacement and faster iteration, while Compiled packages ensure type safety and compatibility for shared infrastructure.

---

### 3. Frontend-Only Architecture

This repository MUST contain only frontend client artifacts. No standalone backend services or databases are permitted.

**Non-Negotiable Rules:**

- All Next.js applications MUST act as consumers of the external, pre-deployed backend API.
- `proxy.ts` (middleware) SHOULD be used to handle request/response transformations before completion.
- No database connections, ORM configurations, or backend service logic are permitted in this repository.

**Rationale:** Clear separation of frontend and backend concerns enables independent deployment, scaling, and team autonomy. The external backend API contract serves as the integration boundary. Middleware-based proxying allows for request enrichment (e.g., adding auth headers) and response transformation without coupling frontend code to backend implementation details.

---

### 4. Next.js Application Standards

All apps MUST use Next.js App Router (`src/app`) with `next.config.ts` configured to industry gold standards.

**Non-Negotiable Rules:**

- `next.config.ts` MUST include `reactCompiler: true` to enable React 19 compiler optimizations.
- Server Components MUST be the default; Client Components (`use client`) are permitted only when interactivity is required.
- Image optimization MUST use `<Image/>` from `next/image`.
- Font optimization MUST use `next/font` with Geist font family.
- Metadata MUST be exported per page (or `generateMetadata` for dynamic routes).
- `sitemap.ts` and `robots.ts` MUST be configured for SEO.

**Rationale:** App Router is the future of Next.js and provides superior performance via React Server Components. The React Compiler eliminates manual memoization and optimizes re-renders automatically. Server Components reduce JavaScript bundle size and improve Time to Interactive (TTI). Standardized metadata, sitemaps, and robots.txt ensure search engine discoverability and compliance with web standards.

---

### 5. Data Fetching & State Management

TanStack React Query MUST be used for all API calls and data fetching. Zustand MUST be used for all client-side global state management.

**Non-Negotiable Rules:**

- TanStack React Query MUST be used for all server state (API calls, data fetching).
- Critical data MUST be pre-fetched on the server using React Server Components or `prefetchQuery`.
- Zustand MUST be used for all client-side global state (UI state, user preferences, transient data).
- Authentication/Authorization MUST be implemented using Better-Auth client utilities consuming the external backend.

**Rationale:** TanStack Query provides automatic caching, background refetching, and optimistic updates, eliminating boilerplate and race conditions. Server-side prefetching improves perceived performance and SEO. Zustand offers a minimal, type-safe API for client state without the complexity of Redux. Better-Auth integrates seamlessly with external backends and provides session management, CSRF protection, and secure token handling out of the box.

---

### 6. Shared Internal Standards

A base configuration package `@gb/typescript-config` MUST exist. All workspaces MUST extend `tsconfig.json` from this base.

**Non-Negotiable Rules:**

- **TypeScript:** A base configuration package `@gb/typescript-config` MUST exist. All workspaces MUST extend from this base.
- **UI System:** A shared `@gb/ui` package MUST provide all Shadcn UI components, Tailwind CSS configuration, and the Theme Provider.
- **Testing Config:** A shared `@gb/vitest-config` package MUST provide base Vitest settings. All apps MUST extend this and utilize `vitest.setup.ts` for environment/frontend setup.

**Rationale:** Centralized TypeScript configuration ensures consistent compiler settings, path aliases, and type-checking rules across all workspaces. A shared UI package prevents component duplication and enforces design system consistency. Shared testing configuration reduces setup overhead and ensures uniform test execution environments, coverage thresholds, and reporter formats.

---

### 7. Quality Assurance & Observability

Comprehensive testing is MANDATORY: Vitest for unit/integration tests and Playwright for E2E tests.

**Non-Negotiable Rules:**

- Vitest MUST be used for unit and integration tests.
- Playwright MUST be configured at the root of each app for E2E tests.
- **Error Reporting:** A robust mechanism MUST intercept data parsing failures. It MUST display a user report dialog and POST the report payload to the external backend.
- All critical user journeys MUST have corresponding E2E test coverage.

**Rationale:** Vitest provides fast, ESM-native testing with built-in TypeScript support. Playwright enables cross-browser E2E testing with automatic waiting and network interception. Structured error reporting transforms silent failures into actionable bug reports, improving product quality and user trust. Mandatory E2E coverage for critical paths prevents regressions in production.

---

### 8. Deployment & Accessibility

All applications MUST be deployed to AWS Amplify with custom domains via automated GitHub Actions workflows.

**Non-Negotiable Rules:**

- All applications MUST be deployed to AWS Amplify.
- Custom domains MUST be configured for production deployments.
- Deployment MUST be automated via GitHub Actions workflows (located in `.github/workflows/*`).
- Public pages MUST be SEO optimized (meta tags, structured data, sitemaps).
- Dashboard pages MUST have Progressive Web App (PWA) features enabled (service workers, offline support, installability).

**Rationale:** AWS Amplify provides seamless Next.js integration with automatic preview deployments, CDN distribution, and serverless SSR. GitHub Actions automation ensures consistent, repeatable deployments and prevents manual errors. SEO optimization maximizes organic discoverability. PWA features improve user engagement and enable offline-first experiences for dashboard users.

---

## Governance

**Amendment Procedure:**

- All amendments to this constitution MUST be documented in a Sync Impact Report.
- Version increments MUST follow semantic versioning:
  - **MAJOR**: Backward-incompatible governance/principle removals or redefinitions.
  - **MINOR**: New principle/section added or materially expanded guidance.
  - **PATCH**: Clarifications, wording, typo fixes, non-semantic refinements.
- All dependent templates (`plan-template.md`, `spec-template.md`, `tasks-template.md`) MUST be reviewed and updated to reflect constitutional changes.

**Compliance Review:**

- All pull requests MUST verify compliance with constitutional principles.
- Violations MUST be justified in the `Complexity Tracking` section of `plan.md`.
- Unjustified complexity or principle violations MUST be rejected.

**Versioning Policy:**

- This constitution is versioned independently from application code.
- The version line below reflects the current constitutional version, not the application version.

---

**Version**: 0.1.0 | **Ratified**: 2025-12-10 | **Last Amended**: 2025-12-10
