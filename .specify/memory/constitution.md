# <!--

# SYNC IMPACT REPORT

Version Change: 0.2.0 → 0.3.0
Amendment Type: MINOR (Materially expanded UI/UX & Frontend Design Rules guidance)
Date: 2026-01-07

Principles Modified:

- Principle 12: Styling & Theming Standards - Materially expanded with strict Tailwind usage rules, explicit color palette requirements, spacing conventions, and border radius standards
- Principle 14: UI/UX Excellence - Materially expanded with prescriptive visual consistency, interaction feedback, loading/empty states, and micro-animation requirements
- Principle 17: Accessibility (a11y) Standards - Materially expanded with detailed form accessibility, focus management, ARIA usage, and contrast requirements

Principles Enhanced:

- Added explicit guidance on strict Tailwind CSS usage (no inline styles except dynamic values)
- Added color palette enforcement (semantic colors from globals.css, NEVER raw hex codes)
- Added spacing standardization (Tailwind scale, no arbitrary values)
- Added border radius consistency requirements
- Added Shadcn/UI composition over inheritance pattern
- Added component file organization (@gb/design-system as single source of truth)
- Added lucide-react icon requirements with stroke width standards
- Added mobile-first responsive design requirements with breakpoint strategy
- Added container pattern requirements for page layouts
- Added touch target minimum size requirements (44px)
- Added mandatory loading states using Skeleton components
- Added mandatory empty state handling with visual components
- Added micro-animation requirements (hover, active, transitions)
- Added toast/feedback requirements for async operations
- Added form accessibility requirements (labels, aria-label)
- Added focus indicator requirements (ring-offset-background, focus-visible:ring-2)
- Added contrast ratio requirements (WCAG compliance)

Template Consistency Status:
✅ plan-template.md - Aligned (supports UI/UX principles, component architecture)
✅ spec-template.md - Aligned (can capture UI/UX requirements, accessibility scenarios)
✅ tasks-template.md - Aligned (supports component development, UI polish tasks)
⚠️ commands/\*.md - Directory does not exist yet, no updates required

Deferred Items:

- None. All required placeholders filled.

Follow-up TODOs:

- Update .github/copilot-instructions.md to reflect expanded UI/UX principles
- Create UI/UX checklist workflow incorporating new prescriptive rules
- Consider creating linting rules for Tailwind usage enforcement
- Consider adding automated accessibility testing requirements
  -->

# GradeBench Web Constitution

## Core Principles

### 1. Monorepo Structure & Tooling

The repository MUST be a Turborepo monorepo. `turbo` and `@biomejs/biome` MUST be installed as dev dependencies at the root only.

Configuration files `turbo.json`, `biome.json`, `.gitignore`, and `.dockerignore` MUST reside at the root directory only and NEVER at the package level.

Root `package.json` scripts MUST coincide with `turbo.json` tasks (e.g., build, dev, lint, format, test variants).

**Rationale**: Centralized tooling configuration ensures consistency across all packages, reduces configuration drift, and simplifies maintenance. Turborepo's caching and task orchestration capabilities are maximized when configuration is unified at the root level.

### 2. Package Hierarchy & Naming

Web applications MUST reside in `apps/`. Shared low-level libraries MUST reside in `packages/` and use the `@gb/` prefix. High-level composite libraries MUST reside in `kits/` and use the `@gb/kit-` prefix.

All internal shared packages (`packages/` and `kits/`) MUST use the barrel export pattern (`index.ts`) and are exceptionally allowed sub-directory exports.

**Rationale**: Clear hierarchical organization prevents circular dependencies and establishes a dependency graph where apps consume kits, kits consume packages, and packages are self-contained. The naming convention immediately identifies the scope and purpose of each package.

### 3. Runtime & Ecosystem

The project MUST use the Node.js runtime environment. The project MUST use NPM as the package manager. The project MUST exclusively use the ESM module system.

**Rationale**: Node.js provides a stable, well-supported runtime for JavaScript/TypeScript applications. NPM is the standard package manager with excellent Turborepo integration. ESM is the modern JavaScript module standard and ensures forward compatibility.

### 4. Configuration Inheritance

All packages MUST extend TypeScript configuration from `@gb/typescript-config` (`base.json` or `nextjs.json`).

All packages MUST extend Vitest configuration from `@gb/vitest-config`.

TypeScript path aliases for `src/` MUST be defined as `<PACKAGE_NAME>/*`.

**Rationale**: Configuration inheritance eliminates duplication, ensures type-checking consistency across packages, and reduces the cognitive load when switching between packages. Path aliases improve import readability and decouple code from physical file structure.

### 5. Environment Variable Safety

Packages accessing environment variables MUST use a local `.env.local` file (git-ignored) and commit a corresponding `.env.example`.

Environment variables MUST be loaded and validated via `zod` in `src/configs/env.config.ts`.

Direct access via `process.env` is FORBIDDEN; use the validated config or `NEXT_PUBLIC_` prefixed variables for frontend exposure.

`NODE_ENV` checks MUST use utility functions (`isProduction`, `isDevelopment`) from `src/utils/env.util.ts`.

**Rationale**: Unvalidated environment variables are a common source of runtime failures and security vulnerabilities. Zod validation ensures type safety and fails fast with clear error messages. Centralized env utilities prevent scattered `process.env` checks and improve testability.

### 6. Testing & Quality Assurance

All major packages MUST include a `vitest.config.ts` at the package root.

Packages with tests MUST enforce a minimum of 80% code coverage.

Test environments requiring variables MUST use `vitest.setup.ts` to load from `.env.test`.

**Rationale**: Consistent test configuration and coverage requirements ensure code reliability and prevent regressions. The 80% threshold balances thoroughness with pragmatism, focusing effort on critical paths while avoiding diminishing returns from testing trivial code.

### 7. Error Handling & Documentation

Direct `try/catch` blocks are DISCOURAGED for business logic.

Async and sync errors MUST be handled using `safeExecute` and `safeExecuteSync` utilities (Go-style tuple returns) located in `src/utils/safe.util.ts`.

Every package MUST have a `README.md` documenting purpose, usage, and contribution steps.

**Rationale**: Go-style error handling makes error flows explicit and forces developers to consider error cases at each step, reducing uncaught exceptions. Mandatory README documentation ensures packages remain understandable and maintainable as teams grow.

### 8. Developer Heuristics

Code changes MUST be validated against: Simplicity, Necessity, Readability, Testability, Safety, Security, and Observability.

**Rationale**: These seven heuristics form a mental checklist that prevents over-engineering, ensures code quality, and maintains long-term maintainability. Each heuristic addresses a distinct dimension of code quality:

- **Simplicity**: Favor the simplest solution that meets requirements
- **Necessity**: Avoid premature abstraction and YAGNI violations
- **Readability**: Code is read far more than written; optimize for comprehension
- **Testability**: Code should be easy to test in isolation
- **Safety**: Type safety, null safety, and error handling prevent runtime failures
- **Security**: Consider attack vectors, input validation, and data exposure
- **Observability**: Ensure code behavior can be monitored and debugged in production

### 9. Next.js & React Architecture

All web applications MUST use Next.js 15+ with the App Router architecture. Pages Router is FORBIDDEN.

React Server Components (RSC) MUST be the default. Components MUST be Server Components unless client-side interactivity is required (use `"use client"` directive explicitly).

File-based routing conventions MUST be followed: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`.

Route handlers MUST use `route.ts` for API endpoints. Middleware MUST be defined in `middleware.ts` at the app root or specific route segments.

TypeScript MUST be used for all components, pages, and utilities. Type any FORBIDDEN except when interfacing with untyped third-party libraries.

**Rationale**: Next.js 15 App Router provides superior performance through RSC, improved routing, and built-in optimizations. Server Components reduce client bundle size and improve initial page load. TypeScript prevents runtime errors and improves developer experience through autocomplete and type checking.

### 10. Server-First Rendering Strategy

Components MUST default to Server Components. Client Components (`"use client"`) MUST be used ONLY when:

- Using React hooks (useState, useEffect, Context, etc.)
- Adding event listeners (onClick, onChange, etc.)
- Using browser-only APIs (localStorage, window, navigator)
- Using state management or real-time features

Client Components MUST be pushed as far down the component tree as possible (leaf components preferred).

Data fetching MUST happen on the server using async Server Components or Server Actions. Client-side data fetching is allowed only for dynamic user interactions.

**Rationale**: Server-first architecture reduces JavaScript bundle size, improves Time to First Byte (TTFB), and enhances SEO by delivering fully-rendered HTML. Minimizing client components reduces hydration cost and improves Core Web Vitals.

### 11. Design System & Component Library

#### Component Architecture

**Composition over Inheritance**: Build complex UIs by composing smaller Shadcn/UI primitives (Card, Button, Badge, Dialog, etc.). Avoid creating monolithic components; prefer composable building blocks.

**File Organization**: All accessible, reusable UI components MUST reside in `@gb/design-system` which internally uses Base UI, Shadcn UI, and Tailwind CSS. Direct installation of UI libraries (e.g., `@shadcn/ui`, `@radix-ui/*`) in apps is FORBIDDEN.

**Icons**: All icons MUST use `lucide-react` from the design system. Set distinct stroke widths (typically `strokeWidth={1.5}` or use `stroke-[1.5px]` class) for a refined, modern appearance. Never mix icon libraries (no Font Awesome, Heroicons, or custom SVGs unless absolutely necessary for brand assets).

#### Component Standards

The design system MUST be the single source of truth for all UI primitives (buttons, inputs, cards, dialogs, etc.).

Custom components MUST extend or compose design system components rather than reimplementing from scratch.

Component variants MUST use `class-variance-authority` (CVA) for type-safe styling.

**Rationale**: Centralized design system ensures visual consistency, reduces duplication, and simplifies maintenance. All shadcn/ui components are managed in one location with shared configuration. CVA provides type-safe variant composition and prevents CSS class conflicts. Composition patterns improve reusability and testability. Consistent icon usage with standardized stroke widths creates a cohesive visual language.

### 12. Styling & Theming Standards

#### Visual Consistency & Styling

**Strict Tailwind Usage**: All styling MUST use Tailwind CSS utility classes from `@gb/design-system/globals.css`. Inline `style={{ ... }}` attributes are FORBIDDEN except when calculating dynamic values (e.g., coordinates, transforms based on runtime data).

**Color Palette**: All colors MUST use semantic color tokens defined in `globals.css` (e.g., `bg-background`, `text-foreground`, `border-border`, `bg-primary`, `text-muted-foreground`). Raw hex codes (e.g., `#000000`, `#3b82f6`) are EXPLICITLY FORBIDDEN in component code.

**Spacing & Layout**: All spacing MUST use Tailwind's standard spacing scale (`p-4`, `m-6`, `gap-2`, etc.). Arbitrary values like `w-[327px]` or `p-[13px]` are FORBIDDEN unless justified by external design system constraints (e.g., exact pixel matching for third-party integration).

**Border Radius**: Border radius MUST use consistent Tailwind utilities: `rounded-md` or `rounded-lg` for cards and containers, `rounded-full` for avatars/badges. Do NOT mix radius styles within the same component family.

#### Theming Standards

CSS custom properties MUST follow the existing design token schema: `--background`, `--foreground`, `--primary`, `--secondary`, `--muted`, `--accent`, `--destructive`, `--border`, `--input`, `--ring`.

Color values MUST use OKLCH color space as defined in the design tokens. RGB/HEX colors are FORBIDDEN except when interfacing with third-party libraries that don't support OKLCH.

Border radius MUST use the predefined radius scale: `--radius-sm` through `--radius-4xl` based on `--radius: 0.625rem` (10px).

Typography MUST use the Geist Sans font family (`--font-geist-sans`) for body text and Geist Mono (`--font-geist-mono`) for code.

Dark mode MUST be supported using the `.dark` class convention from `next-themes`. All colors MUST be defined for both light and dark modes.

Component-specific CSS MUST use Tailwind `@layer components` or CSS modules if absolutely necessary. Never use inline styles or component-scoped `<style>` tags.

**Rationale**: Standardized design tokens ensure visual consistency and simplify theme customization. OKLCH provides perceptually uniform colors and better browser support than older color spaces. Strict Tailwind enforcement prevents CSS sprawl and maintains composability. Prohibiting raw hex codes ensures theme compliance and prevents accidental visual inconsistencies. Consistent spacing and radius values create a cohesive visual language.

### 13. State Management & Data Fetching

ALL data fetching and mutations MUST use TanStack React Query from `@gb/query`.

React Query MUST be configured via `QueryClientProvider` from `@gb/query/provider`.

API calls MUST be organized in `src/queries/` (GET operations) and `src/mutations/` (POST/PUT/DELETE operations).

Client-side state MUST use React hooks (useState, useReducer) for local component state. Global state MUST use React Context or React Query's cache.

Avoid prop drilling beyond 2 levels; use Context or composition patterns instead.

Form state MUST use controlled components with React Hook Form where complex validation is required.

**Rationale**: React Query provides powerful caching, background refetching, optimistic updates, and error handling out of the box. Centralizing data fetching in `@gb/query` ensures consistent patterns and simplifies testing. Avoiding unnecessary state management libraries reduces bundle size and complexity.

### 14. UI/UX Excellence

#### Responsive & Adaptive Design

**Mobile-First Strategy**: Write default Tailwind classes for mobile viewports (0px+). Use responsive breakpoints (`sm:`, `md:`, `lg:`, `xl:`, `2xl:`) to progressively enhance for larger screens.

**Container Pattern**: ALWAYS wrap page content in a responsive container using: `<div className="container mx-auto px-4 py-6">` or equivalent. This ensures consistent horizontal padding and maximum width constraints.

**Touch Targets**: ALL interactive elements (buttons, links, inputs) MUST have a minimum touch target size of 44×44px on mobile devices. Use `min-h-11` (44px) and appropriate padding to meet this requirement.

#### Visual Excellence

User interfaces MUST prioritize premium aesthetics and modern design patterns:

- Use curated color palettes from design tokens (avoid generic colors like pure `red-500`, `blue-500`)
- Implement smooth micro-animations and transitions for enhanced user engagement
- Apply modern typography with proper hierarchy and spacing (use `text-sm`, `text-base`, `text-lg`, `text-xl` consistently)
- Use subtle shadows (`shadow-sm`, `shadow-md`), gradients, and glassmorphism where appropriate

#### Interaction & Feedback (VITAL)

**Loading States**: NEVER show blank screens during data fetching. Use `Skeleton` components from `@gb/design-system` that mirror the shape and layout of the content being loaded.

**Empty States**: ALWAYS handle empty arrays/data with a visual "Empty State" component that includes:

- An appropriate icon (from `lucide-react`)
- Clear, helpful text explaining why it's empty
- An actionable next step (e.g., "Create your first item" button)

**Micro-animations**: ALL interactive elements MUST include feedback animations:

- **Hover**: `hover:bg-muted/50` or `hover:text-primary` for visual feedback
- **Active/Click**: `active:scale-95` for buttons to indicate press
- **Transitions**: `transition-all duration-200 ease-in-out` for smooth state changes

**Async Feedback**: Use `sonner` toast notifications (from `@gb/design-system`) for success/error messages after async operations (form submissions, API calls, etc.).

#### Image & Icon Standards

Images MUST use Next.js `<Image>` component with proper sizing, lazy loading, and blur placeholders.

Icons MUST use `lucide-react` from the design system for consistency.

Spacing MUST follow a consistent scale (4px base grid: 0.5, 1, 2, 3, 4, 6, 8, 12, 16...).

**Rationale**: Mobile-first ensures the best experience on the most constrained devices. Touch targets meet accessibility standards and improve usability. Premium UX differentiates products and increases user engagement. Loading skeletons prevent perceived slowness and reduce bounce rates. Empty states guide users and prevent confusion. Micro-animations provide vital feedback that makes interfaces feel responsive and alive. Consistent interaction patterns reduce cognitive load and improve learnability.

### 15. SEO & Metadata Standards

Every page MUST define metadata using Next.js 15 Metadata API:

- Static metadata via exported `metadata` object
- Dynamic metadata via `generateMetadata` function

Required metadata fields for all pages:

- `title` (unique, descriptive, under 60 characters)
- `description` (unique, compelling, 120-160 characters)
- `openGraph` (OG image, title, description, type)
- `twitter` (card type, images)

Semantic HTML MUST be used: proper heading hierarchy (single h1), semantic elements (`<article>`, `<section>`, `<nav>`, `<aside>`).

Structured data (JSON-LD) MUST be included for key content types (articles, products, FAQs, breadcrumbs).

Links MUST use descriptive anchor text; avoid "click here" patterns.

Images MUST include descriptive `alt` attributes for accessibility and SEO.

`robots.txt` and `sitemap.xml` MUST be configured for production environments.

**Rationale**: Proper metadata improves search engine rankings and social media sharing. Semantic HTML helps search engines understand content structure. Structured data enables rich snippets in search results.

### 16. Performance & Core Web Vitals

The application MUST meet Core Web Vitals thresholds:

- Largest Contentful Paint (LCP) < 2.5s
- First Input Delay (FID) < 100ms
- Cumulative Layout Shift (CLS) < 0.1

Performance optimizations REQUIRED:

- Route-level code splitting (automatic with App Router)
- Dynamic imports for heavy components using `next/dynamic`
- Image optimization using `next/image` with appropriate sizes
- Font optimization using `next/font`
- Lazy loading for below-the-fold content

Bundle size MUST be monitored; avoid importing entire libraries when tree-shaking is possible.

API responses MUST be optimized: use pagination, field selection, and compression.

React Query caching MUST be configured with appropriate stale times to reduce unnecessary requests.

**Rationale**: Performance directly impacts user experience, SEO rankings, and conversion rates. Core Web Vitals are Google ranking factors. Next.js built-in optimizations should be leveraged wherever possible.

### 17. Accessibility (a11y) Standards

#### Keyboard & Focus Management

ALL interactive elements MUST be keyboard accessible using standard navigation keys (Tab, Enter, Escape, Arrow keys for lists/menus).

Focus management MUST be implemented for modals, dialogs, and navigation changes. When a modal opens, focus MUST move to the first focusable element inside it. When closed, focus MUST return to the trigger element.

**Focus Indicators**: NEVER use `outline-none` or `ring-0` without replacement. ALL focusable elements MUST have visible focus indicators using `ring-offset-background focus-visible:ring-2 focus-visible:ring-ring` or equivalent.

#### Forms & Input Accessibility

**Label Association**: ALL form inputs MUST have associated `<Label>` components from `@gb/design-system`. If a visual label is not appropriate, use `aria-label` or `aria-labelledby`.

**Error Handling**: Form validation errors MUST be:

- Announced to screen readers using `aria-live="polite"` or `aria-live="assertive"` for critical errors
- Associated with form fields using `aria-invalid="true"` and `aria-errormessage`
- Displayed with clear, actionable messaging

**Field Hints**: Use `aria-describedby` to associate hint text with form fields (e.g., password requirements, character limits).

#### ARIA Attributes & Semantic HTML

Use ARIA attributes ONLY where native HTML semantics are insufficient:

- `aria-label` for icon-only buttons (e.g., `<Button aria-label="Close dialog">`)
- `aria-describedby` for additional context (form hints, tooltips)
- `aria-live="polite"` or `aria-live="assertive"` for dynamic content updates (notifications, live search results)
- `role` attributes for custom interactive elements (e.g., `role="tablist"`, `role="tab"`)

Prefer semantic HTML over ARIA when possible (use `<button>` instead of `<div role="button">`).

#### Color Contrast & Visual Accessibility

Color contrast MUST meet WCAG AA standards:

- **Normal text**: Minimum 4.5:1 contrast ratio against background
- **Large text** (18px+ or 14px+ bold): Minimum 3:1 contrast ratio

Use `text-muted-foreground` carefully; verify it meets contrast requirements in both light and dark modes.

Never rely on color alone to convey information (e.g., use icons + text for status, not just colored backgrounds).

#### Additional Requirements

Skip links MUST be provided for keyboard users to bypass repetitive navigation (e.g., "Skip to main content" link at the top of pages).

Interactive elements MUST have minimum touch target size of 44×44px (see Principle 14).

Motion and animations MUST respect `prefers-reduced-motion` user preference using `@media (prefers-reduced-motion: reduce)` or Tailwind's `motion-reduce:` variant.

**Rationale**: Accessibility is a legal requirement in many jurisdictions and expands market reach to users with disabilities. Proper a11y improves usability for ALL users, not just those using assistive technology. Many a11y patterns (semantic HTML, clear labels, skip links) also improve SEO and keyboard-only navigation. Focus indicators prevent users from getting lost when navigating without a mouse. ARIA attributes fill gaps where native HTML is insufficient, but should not replace proper semantic markup.

## Governance

This constitution supersedes all other development practices and guidelines within the GradeBench Web project. All code contributions, architectural decisions, and refactoring efforts MUST comply with the principles outlined above.

### Amendment Process

Amendments to this constitution require:

1. Documented justification explaining why the change is needed
2. Impact analysis on existing code and development workflows
3. Approval from project maintainers
4. A migration plan if existing code violates new principles
5. Version increment following semantic versioning rules

### Versioning Policy

- **MAJOR**: Backward incompatible governance/principle removals or redefinitions
- **MINOR**: New principle/section added or materially expanded guidance
- **PATCH**: Clarifications, wording, typo fixes, non-semantic refinements

### Compliance Review

All pull requests MUST be reviewed for constitutional compliance. Reviewers should verify:

**Architecture & Patterns:**

- Server Components used by default; Client Components justified and pushed to leaf nodes
- Components imported from `@gb/design-system` (no direct UI library installations in apps)
- Data fetching uses `@gb/query` (React Query)

**Styling & Visual Consistency:**

- Styling uses ONLY Tailwind utilities and design tokens (no inline styles except dynamic values)
- Colors use semantic tokens from `globals.css` (NO raw hex codes like `#000000`)
- Spacing uses Tailwind scale (NO arbitrary values like `w-[327px]`)
- Border radius is consistent (`rounded-md`, `rounded-lg`, `rounded-full`)
- Icons use `lucide-react` with consistent stroke widths

**UI/UX Excellence:**

- Mobile-first responsive design with container patterns
- Loading states use `Skeleton` components (NEVER blank screens)
- Empty states include icon + text + actionable next step
- Micro-animations present (hover, active, transitions)
- Toast notifications for async feedback

**Accessibility:**

- All form inputs have `<Label>` or `aria-label`
- Focus indicators present (NO `outline-none` without replacement)
- Color contrast meets WCAG AA (4.5:1 for normal text)
- Touch targets meet 44×44px minimum
- Motion respects `prefers-reduced-motion`

**SEO & Performance:**

- Metadata defined for all pages
- Performance budgets respected
- Test coverage meets minimum thresholds (80%)

Complexity and violations MUST be justified explicitly. When constitutional principles conflict with practical constraints, document the trade-off and seek maintainer guidance.

**Version**: 0.3.0 | **Ratified**: 2026-01-07 | **Last Amended**: 2026-01-07
