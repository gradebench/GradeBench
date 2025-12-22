<!-- GradeBench: HOW-TO guidance for AI coding agents -->

This file provides **prescriptive, actionable guidance** on **HOW** to implement features in the GradeBench Web monorepo. For the **WHAT** and **WHY**, see the [Engineering Constitution v0.1.0](../.specify/memory/constitution.md).

---

## Quick Reference Commands

Run from repository root:

```bash
# Install dependencies
npm ci

# Development (all apps)
npm run dev                    # Runs turbo run dev

# Development (single app)
cd apps/web && npm run dev     # Uses next dev --turbopack --port 3000

# Build
npm run build                  # Builds all apps and packages
cd apps/web && npm run build   # Build single app

# Testing
npm run test                   # Runs turbo run test (all workspaces)
cd apps/web && npm run test    # Vitest for single app
cd apps/web && npx playwright test  # E2E tests

# Linting & Formatting
npm run lint                   # Biome (root only)
npm run check-types            # TypeScript checks (all workspaces)
```

---

## HOW TO: Create a New Internal Package

### Step 1: Choose Package Type

**JIT (Just-In-Time) Package** - For UI components, utilities, hooks:
- ✅ Fast development (no build step)
- ✅ Hot module replacement
- ❌ Requires consuming app to compile TypeScript

**Compiled Package** - For shared configs, complex libraries:
- ✅ Type-safe distribution
- ✅ Independent versioning
- ❌ Slower iteration (requires build)

### Step 2: Create Package Structure

```bash
# For low-level packages
mkdir -p packages/my-package/src

# For high-level kits/SDKs
mkdir -p kits/my-kit/src
```

### Step 3: Configure `package.json`

**JIT Package Example** (`packages/ui/package.json`):

```json
{
  "name": "@gb/ui",
  "version": "0.0.0",
  "private": true,
  "exports": {
    "./button": "./src/components/ui/button.tsx",
    "./card": "./src/components/ui/card.tsx",
    "./styles": "./src/styles/globals.css"
  },
  "imports": {
    "#*": "./src/*"
  },
  "scripts": {
    "lint": "biome check .",
    "check-types": "tsc --noEmit"
  },
  "devDependencies": {
    "@gb/typescript-config": "*",
    "typescript": "^5.7.2"
  }
}
```

**Compiled Package Example** (`packages/typescript-config/package.json`):

```json
{
  "name": "@gb/typescript-config",
  "version": "0.0.0",
  "private": true,
  "exports": {
    "./base": {
      "types": "./dist/base.d.ts",
      "default": "./dist/base.js"
    },
    "./nextjs": {
      "types": "./dist/nextjs.d.ts",
      "default": "./dist/nextjs.js"
    }
  },
  "imports": {
    "#*": "./dist/*"
  },
  "scripts": {
    "build": "tsc",
    "lint": "biome check .",
    "check-types": "tsc --noEmit"
  },
  "devDependencies": {
    "typescript": "^5.7.2"
  }
}
```

### Step 4: Configure TypeScript

Create `tsconfig.json` extending base config:

```json
{
  "extends": "@gb/typescript-config/base.json",
  "compilerOptions": {
    "outDir": "./dist",  // Only for Compiled packages
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### Step 5: Add to Consuming Package

In `apps/web/package.json`:

```json
{
  "dependencies": {
    "@gb/ui": "*",              // ✅ Wildcard version
    "@gb/typescript-config": "*" // ✅ Wildcard version
  }
}
```

---

## HOW TO: Create a New Next.js App

### Step 1: Initialize App

```bash
cd apps
npx create-next-app@latest my-app --typescript --tailwind --app --src-dir --import-alias "@/*"
```

### Step 2: Configure `next.config.ts`

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,  // ✅ MANDATORY
  transpilePackages: ["@gb/ui"], // ✅ For JIT packages
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.gradebench.com",
      },
    ],
  },
  experimental: {
    optimizePackageImports: ["@gb/ui"],
  },
};

export default nextConfig;
```

### Step 3: Configure Fonts in `layout.tsx`

```typescript
import { Geist, Geist_Mono } from "next/font/google";
import type { ReactNode } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
```

### Step 4: Configure Metadata

```typescript
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GradeBench - Grade in Seconds",
  description: "AI-powered evaluation platform",
  keywords: ["grading", "AI", "education"],
  openGraph: {
    title: "GradeBench",
    description: "Grade in Seconds. Teach for Hours.",
    url: "https://www.gradebench.com",
    siteName: "GradeBench",
    locale: "en_US",
    type: "website",
  },
};
```

### Step 5: Add `sitemap.ts`

```typescript
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://www.gradebench.com",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: "https://www.gradebench.com/about",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
```

### Step 6: Add `robots.ts`

```typescript
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin/"],
    },
    sitemap: "https://www.gradebench.com/sitemap.xml",
  };
}
```

### Step 7: Configure Playwright

Create `playwright.config.ts`:

```typescript
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
});
```

---

## HOW TO: Implement Data Fetching

### Server-Side Prefetching (Recommended)

```typescript
// app/dashboard/page.tsx
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { DashboardClient } from "./dashboard-client";

async function prefetchDashboardData() {
  const queryClient = new QueryClient();
  
  await queryClient.prefetchQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: async () => {
      const res = await fetch("https://api.gradebench.com/stats");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  return dehydrate(queryClient);
}

export default async function DashboardPage() {
  const dehydratedState = await prefetchDashboardData();

  return (
    <HydrationBoundary state={dehydratedState}>
      <DashboardClient />
    </HydrationBoundary>
  );
}
```

### Client-Side Fetching

```typescript
// components/dashboard-client.tsx
"use client";

import { useQuery } from "@tanstack/react-query";

export function DashboardClient() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: async () => {
      const res = await fetch("https://api.gradebench.com/stats");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>{JSON.stringify(data)}</div>;
}
```

---

## HOW TO: Implement State Management with Zustand

```typescript
// stores/ui-store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UIState {
  sidebarOpen: boolean;
  theme: "light" | "dark";
  toggleSidebar: () => void;
  setTheme: (theme: "light" | "dark") => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      theme: "light",
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: "ui-storage",
    }
  )
);
```

Usage:

```typescript
"use client";

import { useUIStore } from "@/stores/ui-store";

export function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useUIStore();

  return (
    <aside className={sidebarOpen ? "block" : "hidden"}>
      <button onClick={toggleSidebar}>Toggle</button>
    </aside>
  );
}
```

---

## HOW TO: Implement Error Reporting

```typescript
// lib/error-reporter.ts
"use client";

import { useState } from "react";

export function useErrorReporter() {
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);

  const reportError = async (error: unknown, context: string) => {
    setIsReportDialogOpen(true);

    // POST to backend
    await fetch("https://api.gradebench.com/error-reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        error: error instanceof Error ? error.message : String(error),
        context,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
      }),
    });
  };

  return { reportError, isReportDialogOpen, setIsReportDialogOpen };
}
```

---

## HOW TO: Use Shared UI Components

```typescript
// ✅ Correct - Import from @gb/ui
import { Button } from "@gb/ui/button";
import { Card } from "@gb/ui/card";

// ❌ Wrong - Don't create duplicate components
// import { Button } from "@/components/ui/button";

export function MyComponent() {
  return (
    <Card>
      <Button variant="default">Click me</Button>
    </Card>
  );
}
```

---

## HOW TO: Write Tests

### Vitest (Unit/Integration)

```typescript
// __tests__/button.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "@gb/ui/button";

describe("Button", () => {
  it("renders with text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });
});
```

### Playwright (E2E)

```typescript
// e2e/homepage.spec.ts
import { expect, test } from "@playwright/test";

test("homepage loads", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toContainText("GradeBench");
});
```

---

## HOW TO: Deploy to AWS Amplify

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to AWS Amplify

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: "npm"
      
      - run: npm ci
      - run: npm run build
      
      - name: Deploy to Amplify
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      
      - run: |
          aws amplify start-deployment \
            --app-id ${{ secrets.AMPLIFY_APP_ID }} \
            --branch-name main
```

---

## File Structure Best Practices

```
apps/web/src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Route group for auth pages
│   ├── (dashboard)/       # Route group for dashboard
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   ├── sitemap.ts         # Sitemap
│   └── robots.ts          # Robots.txt
├── components/            # Shared components
│   ├── ui/                # UI primitives (import from @gb/ui instead)
│   └── features/          # Feature-specific components
├── lib/                   # Utilities
│   ├── api-client.ts      # API client setup
│   └── utils.ts           # Helper functions
├── stores/                # Zustand stores
│   └── ui-store.ts
└── types/                 # TypeScript types
    └── api.ts
```

---

## Common Pitfalls to Avoid

❌ **Don't** install `turbo` or `@biomejs/biome` in workspace packages  
✅ **Do** keep them at the root only

❌ **Don't** use hardcoded versions for internal packages (`"@gb/ui": "0.0.1"`)  
✅ **Do** use wildcard versions (`"@gb/ui": "*"`)

❌ **Don't** create backend services in this repo  
✅ **Do** consume the external API at `https://api.gradebench.com`

❌ **Don't** use `<img/>` tags  
✅ **Do** use `<Image/>` from `next/image`

❌ **Don't** use Client Components by default  
✅ **Do** use Server Components and add `"use client"` only when needed

❌ **Don't** forget to export metadata from pages  
✅ **Do** export `metadata` or `generateMetadata` from every page

---

## Questions to Ask Before Implementation

1. **Package Type**: Is this a JIT or Compiled package?
2. **Component Location**: Should this be in `@gb/ui` or app-specific?
3. **Server vs Client**: Can this be a Server Component?
4. **State Management**: Is this server state (React Query) or client state (Zustand)?
5. **Testing**: What level of testing is needed (unit/integration/E2E)?

---

**End of file.**
