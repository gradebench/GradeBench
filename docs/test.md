# Frontend (Next.js) Testing Strategy

## Unit Testing

| **Recommended Tool/Library**                                        |                                                                                                                                                                                                                                                                             **Key Test Actions & Checks** | **CI/CD & Turborepo Notes**                                                                                                                                                                                                                                                                                                                                                                |
| ------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Vitest** + `@testing-library/react` + `@testing-library/jest-dom` | - Import component/module and test pure functions and hooks in isolation. <br>- Assert return values, edge cases, thrown errors. <br>- Test React hooks with `renderHook` (from testing-library or `@testing-library/react-hooks`). <br>- Mock external modules (fetch, localStorage) using Vitest mocks. | - Add `test` script in each package: `vitest run --reporter=dot --coverage`. <br>- In monorepo root: `turbo run test` (ensures dependency graph ordering). <br>- Use `actions/cache` for `~/.npm` and `.turbo` cache; cache `node_modules` per workspace if needed. <br>- Parallelize by running `turbo run test --concurrency 5` or use GitHub Actions matrix by package for faster runs. |

## Component Testing (Isolated UI)

| **Recommended Tool/Library**                                                                  |                                                                                                                                                                                                                                **Key Test Actions & Checks** | **CI/CD & Turborepo Notes**                                                                                                                                                                                                                                                                          |
| --------------------------------------------------------------------------------------------- | -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **React Testing Library** + **Vitest**; optional **Storybook** + **@storybook/testing-react** | - Render component with props and children. <br>- Assert DOM semantics, accessibility roles, user interactions (clicks, typing). <br>- Snapshot DOM when appropriate (keep snapshots small). <br>- Validate side-effects (callbacks invoked, state changes). | - Run component tests as part of `vitest` suite. <br>- If using Storybook, run `storybook test` or use Storybook's test-runner for interaction tests. <br>- Use Turborepo caching; mark storybook build step as cacheable. <br>- Consider running Storybook checks only on PRs touching UI packages. |

## Integration Testing (frontend modules + mock backend)

| **Recommended Tool/Library**               |                                                                                                                                                                                                                                        **Key Test Actions & Checks** | **CI/CD & Turborepo Notes**                                                                                                                                                                                                        |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Vitest** + **MSW (Mock Service Worker)** | - Test page-level behavior that involves data fetching and component composition. <br>- Use MSW to mock API responses; test error states, loading states, edge-case payloads. <br>- Assert routing behavior (Next.js router mocks), component lifecycle integration. | - Start MSW in node test environment: `setupServer(...)` in test setup. <br>- Run as part of `turbo run test` so only affected packages run in CI. <br>- Cache compiled test artifacts; split tests to run in parallel by package. |

## End-to-End (E2E) Testing

| **Recommended Tool/Library**                |                                                                                                                                                                                                                                                             **Key Test Actions & Checks** | **CI/CD & Turborepo Notes**                                                                                                                                                                                                                                                                                                                                                                                                           |
| ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Playwright** (recommended) or **Cypress** | - Full flows: login, sign-up, critical user journeys, payment flows, error/retry flows. <br>- Assertions: element visibility, navigation, backend integration, cookie/localStorage state. <br>- Test on multiple viewports/resolutions and multiple browsers (Chromium, WebKit, Firefox). | - Use Playwright’s `github` action: `npx playwright install --with-deps` then `npx playwright test`. <br>- Spin up test staging environment (hosted or via docker-compose). In CI, use a job that brings up `apps` via `docker-compose` or `turbo dev` on ephemeral ports. <br>- Parallelize Playwright tests across workers (`--workers`); record traces/videos for failures. <br>- Use artifacts: upload traces/videos/screenshots. |

## Accessibility (a11y) Testing

| **Recommended Tool/Library**                                                         |                                                                                                                                                                                                              **Key Test Actions & Checks** | **CI/CD & Turborepo Notes**                                                                                                                                                                                                                                                            |
| ------------------------------------------------------------------------------------ | -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **axe-core** (`jest-axe` or `@axe-core/react`) + **Playwright accessibility checks** | - Run automated checks for contrast, roles, missing alt text, ARIA misuse. <br>- Assert landmark presence, keyboard navigation for critical flows. <br>- Use unit/component tests to assert `axe` violations are zero for core components. | - Integrate `axe` checks into unit/component test suites via Vitest hooks. <br>- Run end-to-end keyboard-navigation and accessibility snapshots in Playwright. <br>- Fail CI on new high/critical axe issues. <br>- Run full a11y suite less frequently (nightly) to reduce flakiness. |

## Performance & Lighthouse / RUM Testing

| **Recommended Tool/Library**                                                             |                                                                                                                                                                    **Key Test Actions & Checks** | **CI/CD & Turborepo Notes**                                                                                                                                                                                                                                                                    |
| ---------------------------------------------------------------------------------------- | -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Lighthouse CI** (or **Google Lighthouse via Playwright**) + **Web Vitals (local RUM)** | - Measure Time to First Byte, FCP, LCP, CLS, TTFB. <br>- Track bundle sizes, tree-shaking regressions, critical path. <br>- Test worst-case network throttling (3G) and compute-limited devices. | - Use Lighthouse CI in GitHub Actions for PRs to `main` or release tags (sample job). <br>- Cache Lighthouse artifacts and persist in storage or as GitHub artifacts. <br>- For bundle-size guards, use `webpack-bundle-analyzer` or Next.js `next build` size report and fail if > threshold. |

## Visual Regression Testing

| **Recommended Tool/Library**                   |                                                                                                                                                           **Key Test Actions & Checks** | **CI/CD & Turborepo Notes**                                                                                                                                                                                             |
| ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Playwright visual comparisons** or **Percy** | - Take screenshots of key pages/components and compare with baseline. <br>- Tolerances for minor diffs; fail on major UI regressions. <br>- Run for main flows and critical components. | - Keep baseline images in artifact storage or external service. <br>- Run visual checks only on UI-touching PRs to conserve resources. <br>- Use Playwright’s snapshot capabilities in CI and store diffs as artifacts. |

## Snapshot Testing (small, purposeful)

| **Recommended Tool/Library**                                        |                                                                                                   **Key Test Actions & Checks** | **CI/CD & Turborepo Notes**                                                                                                                                        |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Vitest snapshots** (`toMatchInlineSnapshot` / external snapshots) | - Snapshot small, stable outputs (serialised props, tiny markup). <br>- Avoid large DOM snapshots — prefer targeted assertions. | - Store snapshots in repo. <br>- Make snapshot updates a deliberate PR action. <br>- Run snapshots in unit test step; keep snapshot tests minimal to reduce noise. |

## Dependency & Security Scanning (frontend)

| **Recommended Tool/Library**            |                                                                                         **Key Test Actions & Checks** | **CI/CD & Turborepo Notes**                                                                                                                        |
| --------------------------------------- | --------------------------------------------------------------------------------------------------------------------: | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| **npm audit**, **Snyk**, **Dependabot** | - Detect vulnerable packages and license issues. <br>- Fail on high/critical vulnerabilities for production branches. | - Enable Dependabot for auto PRs. <br>- Run `npm audit` in CI (weekly/daily) and alert team. <br>- Use separate workflow with limited concurrency. |

---

# Backend (Hono.js) Testing Strategy

## Unit Testing

| **Recommended Tool/Library**                            |                                                                                                                                                                        **Key Test Actions & Checks** | **CI/CD & Turborepo Notes**                                                                                                                                                                                                                    |
| ------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Vitest** (or Jest) + `sinon`/Vitest mocking utilities | - Test pure business logic functions, utility modules, validation logic. <br>- Test Hono middleware isolated by mocking `Context` object. <br>- Assert edge-cases, thrown errors, and return values. | - Add `test` script: `vitest run --coverage`. <br>- Use `turbo run test` to execute only affected backend packages. <br>- Cache `.turbo` and `node_modules`. <br>- Parallelize across service packages using `turbo` or GitHub Actions matrix. |

## Integration Testing (DB & external services)

| **Recommended Tool/Library**                                                       |                                                                                                                                                                                                                                     **Key Test Actions & Checks** | **CI/CD & Turborepo Notes**                                                                                                                                                                                                                       |
| ---------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Vitest** + **Testcontainers** (or Docker Compose) + **Drizzle ORM / pg** test DB | - Bring up ephemeral Postgres/Redis using Testcontainers or docker-compose. <br>- Run migrations, seed small fixture data. <br>- Execute repository/DAO tests to validate queries, constraints, transactions. <br>- Assert rollback behaviour and data integrity. | - In CI, use a job that starts Postgres container or use hosted DB test instance. <br>- Use `--runInBand` or limit concurrency for tests that rely on shared DB. <br>- Tear down containers after tests. <br>- Cache Docker layers and Turborepo. |

## API / Route Testing (HTTP handlers)

| **Recommended Tool/Library**                                       |                                                                                                                                                                                                 **Key Test Actions & Checks** | **CI/CD & Turborepo Notes**                                                                                                                                                                                                        |
| ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Supertest** (or Playwright HTTP) + **MSW** for external services | - Start Hono app in test mode (in-memory), call endpoints via Supertest. <br>- Assert status codes, headers, response schemas, pagination, error responses. <br>- Validate authentication, authorization, rate limit headers. | - Use lightweight in-memory server in tests (no network binding necessary). <br>- Run `node -r` test setup to initialize env vars and test DB mocks. <br>- Integrate test results as JUnit XML for CI (`vitest --reporter=junit`). |

## Contract Testing (consumer-provider / API contracts)

| **Recommended Tool/Library**                                           |                                                                                                                                  **Key Test Actions & Checks** | **CI/CD & Turborepo Notes**                                                                                                                                                                                                                              |
| ---------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------: | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Pact** or **OpenAPI Contract Tests** + **swagger/openapi-validator** | - Generate consumer contracts from frontend expectations and verify provider implements them. <br>- Validate request/response schemas, required fields, types. | - Run contract verification in CI after provider build. <br>- Store contract artifacts (Pact files) in artifact store; fail provider build if verification fails. <br>- Automate publishing consumer contracts (on PR merges) and provider verification. |

## End-to-End (Full-stack) Backend Scenarios

| **Recommended Tool/Library**                            |                                                                                                                          **Key Test Actions & Checks** | **CI/CD & Turborepo Notes**                                                                                                                                                                                                                                                 |
| ------------------------------------------------------- | -----------------------------------------------------------------------------------------------------------------------------------------------------: | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Playwright (API + UI)** or **Supertest + e2e runner** | - Full scenario: UI -> API -> DB flows. <br>- Validate transactional flows, background jobs, webhooks. <br>- Test failure/retry paths and idempotency. | - Use a dedicated `e2e` job that boots full system (services + DB) typically in docker-compose or ephemeral infra. <br>- Use `turbo` to build only affected services before spinning them up. <br>- Keep E2E runs to staging branches or scheduled runs to save CI minutes. |

## Performance & Load Testing

| **Recommended Tool/Library**                    |                                                                                                                                                                                                       **Key Test Actions & Checks** | **CI/CD & Turborepo Notes**                                                                                                                                                                                                  |
| ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **k6** (recommended), **Artillery**, or **wrk** | - Stress endpoints with realistic traffic patterns and payloads. <br>- Measure latency p95/p99, error rates, resource consumption, DB connection saturation. <br>- Identify memory leaks, CPU hotspots, and connection pool issues. | - Run performance tests in a separate pipeline (nightly or before major releases). <br>- Use cloud agents or self-hosted runners with sufficient capacity. <br>- Capture results as artifacts and push to a dashboard or S3. |

## Security & Fuzzing / Penetration Tests

| **Recommended Tool/Library**            |                                                                                                                              **Key Test Actions & Checks** | **CI/CD & Turborepo Notes**                                                                                                     |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------: | ------------------------------------------------------------------------------------------------------------------------------- |
| **OWASP ZAP**, **node-fuzz**, **Snxyk** | - Run automated scans for common vulnerabilities (injection, XSS, auth bypass). <br>- Fuzz input endpoints and assert proper validation and rate-limiting. | - Run deep scans in scheduled pipeline (not on every PR). <br>- Fail builds for severe findings on `main` or release pipelines. |

## Mutation Testing (test quality)

| **Recommended Tool/Library** |                                                                   **Key Test Actions & Checks** | **CI/CD & Turborepo Notes**                                                                                                                   |
| ---------------------------- | ----------------------------------------------------------------------------------------------: | --------------------------------------------------------------------------------------------------------------------------------------------- |
| **Stryker Mutator**          | - Mutate code to check tests detect injected faults. <br>- Identify weak or missing assertions. | - Run mutation tests locally or nightly (they are expensive). <br>- Use results to guide writing stronger assertions; do not run on every PR. |

## Observability / Test Reporting

| **Recommended Tool/Library**                                           |                                                                                                  **Key Test Actions & Checks** | **CI/CD & Turborepo Notes**                                                                                                                                                                                                 |
| ---------------------------------------------------------------------- | -----------------------------------------------------------------------------------------------------------------------------: | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Vitest/Jest reporters (JUnit)** + **Coverage (c8/nyc)** + **Allure** | - Produce JUnit XML, coverage reports, and human-friendly test reports. <br>- Fail pipeline if coverage drops below threshold. | - Collect JUnit & coverage artifacts in GitHub Actions via `actions/upload-artifact`. <br>- Use `paths-filter` or `turbo` to run tests only for changed packages, but still enforce coverage gates at repo-level on `main`. |

## DB Migration & Data Migration Testing

| **Recommended Tool/Library**                                    |                                                                                                **Key Test Actions & Checks** | **CI/CD & Turborepo Notes**                                                                                                                                                    |
| --------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **drizzle-kit (migrations)** + ephemeral DBs via Testcontainers | - Test migrations forward/backwards; assert data preservation. <br>- Seed and validate migration scripts on CI ephemeral DB. | - Run migration validation job in CI before deploy; block deploy if migration fails. <br>- Maintain migration tests that run against the same engine/version as production DB. |

---

# Cross-cutting Best Practices (short checklist)

- **Test scripts & package layout**: each package should have `scripts.test` and consistent `vitest` config; keep shared test-setup in `/packages/testing` and import from packages.
- **Turbo + caching**: `turbo run test` is your friend — Turbo will only run tests for changed packages (incremental). Cache `.turbo` and node modules in CI. Use `turbo prune --docker` for docker builds.
- **Parallelization**: split tests by package using GitHub Actions matrix or rely on `turbo` concurrency to run multiple test tasks. Use `playwright` workers for E2E.
- **Fail fast & gates**: run lint/typecheck first; fail early. Run unit tests on PR, run integration/E2E on staging branch or scheduled triggers.
- **Artifacts & diagnostics**: always upload test artifacts on CI failures (screenshots, traces, logs, coverage reports).
- **Flaky tests**: track flaky tests separately; have a quarantine mechanism. Use retries sparingly (E2E flaky network retries).
- **Enforce coverage thresholds**: set realistic thresholds per package and a repo-level minimum.
- **Secrets & envs**: provide test credentials through GitHub Actions secrets; never hardcode. For DB in CI, use ephemeral postgres or dedicated test DB credentials.
- **Dev DX**: provide `pnpm`/`npm` aliases like `npm run test:web` or `npm run test:api` and a root `npm run test` that calls `turbo`.

---

# Example GitHub Actions snippets (high level)

- **Unit tests (fast)** — run on every PR:
  - `actions/checkout`
  - `actions/setup-node@v4` (node version)
  - Cache `~/.npm` + `.turbo`
  - `npm ci`
  - `npx turbo run test --concurrency 6`
  - Upload JUnit & coverage artifacts

- **E2E (slow, infra)** — run on `staging` branch or scheduled:
  - Build affected apps `npx turbo run build --workspace=...`
  - Spin up docker-compose / ephemeral infra (DB, redis)
  - `npx playwright install` + `npx playwright test --workers=4`
  - Collect traces/screenshots

- **Performance / Security** — scheduled nightly or before major release:
  - Run `k6` scripts / OWASP ZAP and publish reports.

---

If you'd like, I can now:

- generate a ready-to-drop-in `vitest.config.ts` and `playwright.config.ts` tuned for Turborepo + Next.js + Hono.js; **or**
- produce a sample GitHub Actions workflow file (unit + e2e + caching + artifacts) that uses `turbo run` and Playwright, tailored to your repo layout.

Which of those would help you most next?
