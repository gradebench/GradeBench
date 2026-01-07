# GitHub Copilot Instructions - GradeBench Web

> **Reference**: This document provides practical HOW guidance for code generation. For principles (WHAT) and rationale (WHY), see [`.specify/memory/constitution.md`](../.specify/memory/constitution.md).

## Architecture Overview

### Monorepo Structure

GradeBench is a **Turborepo monorepo** with strict hierarchical organization:

- **`apps/`**: Next.js 15+ applications (App Router only, Pages Router forbidden)
  - `web/` - Marketing site (port 3000)
  - `app/` - Platform app with auth (port 3001)
- **`packages/`**: Shared libraries with `@gb/` prefix (low-level, reusable)
  - `@gb/design-system` - UI components (Base UI + shadcn/ui + Tailwind)
  - `@gb/auth` - Authentication (better-auth)
  - `@gb/query` - React Query wrapper
  - `@gb/typescript-config` - Shared TS configs
  - `@gb/vitest-config` - Test configs
- **`kits/`**: High-level composites with `@gb/kit-` prefix (planned)

**Dependency flow**: apps → kits → packages (never reverse). Apps NEVER import UI libraries directly; use `@gb/design-system` exclusively.

### Developer Workflows

**Setup & Development:**
```bash
npm install                    # Install all dependencies
npm run dev                    # Start all apps in dev mode (Turborepo TUI)
npm run dev --workspace=web    # Start only web app
npm run dev --workspace=app    # Start only app (with auth)
```

**Quality Checks:**
```bash
npm run lint                   # Biome lint (ultracite config)
npm run format                 # Biome format with auto-fix
npm run check-types            # TypeScript type checking (all packages)
npm run test                   # Vitest tests with coverage (80% minimum)
npm run test --workspace=web   # Test specific package
```

**Building:**
```bash
npm run build                  # Build all apps/packages
npm run build --workspace=web  # Build specific app
```

**Config Locations:**
- `turbo.json` - Turborepo tasks & caching (root only)
- `biome.json` - Linting/formatting (root only, extends ultracite presets)
- `package.json` - Root scripts mirror turbo tasks
- `.env.example` - Example env vars (commit this)
- `.env.local` - Actual secrets (git-ignored, NEVER commit)

### Environment Variables (Critical)

**NEVER access `process.env` directly.** Use validated `env` config:

```tsx
// apps/web/src/configs/env.config.ts
import z from "zod";

const serverSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  BASE_DOMAIN: z.string().min(1, "BASE_DOMAIN is required"),
});

const clientSchema = z.object({});

const parsedServerEnv = serverSchema.safeParse(process.env);
const parsedClientEnv = clientSchema.safeParse(process.env);

if (!(parsedServerEnv.success && parsedClientEnv.success)) {
  console.error("Invalid or missing environment variables", {
    server: parsedServerEnv.error?.flatten().fieldErrors,
    client: parsedClientEnv.error?.flatten().fieldErrors,
  });
  process.exit(1);
}

export const env = Object.freeze({
  client: parsedClientEnv.data,
  server: parsedServerEnv.data,
});
```

**Usage:**
```tsx
import { env } from "@/configs/env.config";

const domain = env.server.BASE_DOMAIN; // Type-safe, validated
```

**Client-side variables** MUST use `NEXT_PUBLIC_` prefix and go in `clientSchema`.

### TypeScript Path Aliases

All packages define paths in `tsconfig.json`:
```jsonc
{
  "extends": "@gb/typescript-config/nextjs.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],  // Package-specific imports
      "@gb/design-system/*": ["../../packages/design-system/src/*"],
      "@gb/query/*": ["../../packages/query/src/*"]
    }
  }
}
```

**Import pattern:**
```tsx
// ✅ Correct
import { Button } from "@gb/design-system/components/button";
import { useQuery } from "@gb/query/client";
import { MyComponent } from "@/components/my-component";

// ❌ Wrong
import { Button } from "@radix-ui/react-button";  // FORBIDDEN in apps
import { MyComponent } from "../components/my-component";  // Use @ alias
```

### Package Exports Pattern

Packages use barrel exports with sub-path support:
```json
// packages/design-system/package.json
{
  "exports": {
    "./components/*": "./src/components/ui/*",
    "./hooks/*": "./src/hooks/*",
    "./lib/*": "./src/lib/*",
    "./providers/*": "./src/providers/*",
    "./globals.css": "./src/styles/globals.css"
  }
}
```

### Error Handling (Go-Style)

**NEVER use `try/catch` for business logic.** Use tuple returns:

```tsx
// packages/shared/src/utils/safe.util.ts (create if missing)
export async function safeExecute<T>(
  fn: () => Promise<T>
): Promise<[T, null] | [null, Error]> {
  try {
    const result = await fn();
    return [result, null];
  } catch (error) {
    return [null, error instanceof Error ? error : new Error(String(error))];
  }
}

// Usage
const [data, error] = await safeExecute(() => fetchUser(userId));
if (error) {
  toast.error(`Failed: ${error.message}`);
  return;
}
// data is guaranteed non-null here
processUser(data);
```

---

## Quick Reference: Code Generation Rules

### 🚫 NEVER Generate

- `"use client"` by default (Principle 9, 10) - only when hooks/events needed
- Inline `style={{ }}` except for dynamic values (Principle 12)
- Raw hex colors like `#000000`, `#3b82f6` (Principle 12)
- Arbitrary Tailwind values like `w-[327px]`, `p-[13px]` (Principle 12)
- Direct `process.env` access (Principle 5)
- `try/catch` for business logic (Principle 7)
- `outline-none` or `ring-0` without focus replacement (Principle 17)
- Type `any` except for untyped third-party libs (Principle 9)
- Direct UI library imports in apps (Radix, shadcn - use `@gb/design-system`) (Principle 11)

### ✅ ALWAYS Generate

- Server Components by default (Principle 10)
- Semantic color tokens: `bg-background`, `text-foreground`, `border-border` (Principle 12)
- `lucide-react` icons with `strokeWidth={1.5}` (Principle 11)
- `<Label>` for form inputs or `aria-label` (Principle 17)
- Focus indicators: `focus-visible:ring-2 focus-visible:ring-ring` (Principle 17)
- Loading states with `<Skeleton>` from `@gb/design-system` (Principle 14)
- Empty states with icon + text + action button (Principle 14)
- Micro-animations: `hover:bg-muted/50`, `active:scale-95`, `transition-all duration-200` (Principle 14)
- Mobile-first Tailwind (base classes for mobile, `md:`, `lg:` for desktop) (Principle 14)
- Container wrapper: `<div className="container mx-auto px-4 py-6">` (Principle 14)
- Touch targets: `min-h-11` (44px) for buttons/interactive elements (Principle 14, 17)

---

## 1. Component Structure (Principles 9-11)

### Server Component (Default)

```tsx
// apps/web/src/components/user-profile.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@gb/design-system/card";
import { Avatar, AvatarFallback, AvatarImage } from "@gb/design-system/avatar";
import { Badge } from "@gb/design-system/badge";

interface UserProfileProps {
  userId: string;
}

export async function UserProfile({ userId }: UserProfileProps) {
  // ✅ Server-side data fetching
  const user = await fetchUser(userId);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{user.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center gap-4">
        <Avatar>
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback>{user.initials}</AvatarFallback>
        </Avatar>
        <Badge variant="secondary">{user.role}</Badge>
      </CardContent>
    </Card>
  );
}
```

### Client Component (Only When Needed)

```tsx
// apps/web/src/components/theme-toggle.tsx
"use client"; // ✅ Only when using hooks/events

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@gb/design-system/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
      className="focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" strokeWidth={1.5} />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" strokeWidth={1.5} />
    </Button>
  );
}
```

---

## 2. Styling Patterns (Principle 12)

### ✅ Correct: Semantic Tokens

```tsx
<div className="bg-background text-foreground border border-border rounded-lg p-4">
  <h2 className="text-2xl font-bold text-primary">Title</h2>
  <p className="text-sm text-muted-foreground">Subtitle</p>
  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
    Action
  </Button>
</div>
```

### 🚫 Incorrect: Raw Colors/Arbitrary Values

```tsx
// ❌ NEVER do this
<div className="bg-[#ffffff] text-[#000000] border-[#e5e7eb] rounded-[12px] p-[16px]">
  <h2 className="text-[28px] font-bold text-blue-600">Title</h2>
  <p className="text-[14px] text-gray-500">Subtitle</p>
  <Button style={{ backgroundColor: "#3b82f6" }}>Action</Button>
</div>
```

### Dynamic Values (Exception)

```tsx
// ✅ Inline styles OK for runtime-calculated values
<div
  style={{
    transform: `translateX(${position}px)`,
    top: `${coordinates.y}px`,
  }}
  className="absolute transition-transform duration-200"
>
  {content}
</div>
```

---

## 3. Data Fetching (Principle 13)

### React Query Pattern

```tsx
// apps/web/src/queries/use-users.ts
import { useQuery } from "@tanstack/react-query";

export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await fetch("/api/users");
      if (!response.ok) throw new Error("Failed to fetch users");
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
```

```tsx
// apps/web/src/mutations/use-create-user.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (user: NewUser) => {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });
      if (!response.ok) throw new Error("Failed to create user");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User created successfully");
    },
    onError: (error) => {
      toast.error(`Failed to create user: ${error.message}`);
    },
  });
}
```

---

## 4. Loading & Empty States (Principle 14)

### Loading State with Skeleton

```tsx
// apps/web/src/components/user-list.tsx
"use client";

import { Skeleton } from "@gb/design-system/skeleton";
import { useUsers } from "@/queries/use-users";

export function UserList() {
  const { data: users, isLoading } = useUsers();

  // ✅ NEVER show blank screen
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ✅ ALWAYS handle empty state
  if (!users?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Users className="mb-4 h-12 w-12 text-muted-foreground" strokeWidth={1.5} />
        <h3 className="text-lg font-semibold">No users yet</h3>
        <p className="mb-4 text-sm text-muted-foreground">
          Get started by creating your first user
        </p>
        <Button onClick={() => navigate("/users/new")}>
          <Plus className="mr-2 h-4 w-4" strokeWidth={1.5} />
          Create User
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {users.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
}
```

---

## 5. Forms & Accessibility (Principle 17)

### Accessible Form Pattern

```tsx
// apps/web/src/components/create-user-form.tsx
"use client";

import { Label } from "@gb/design-system/label";
import { Input } from "@gb/design-system/input";
import { Button } from "@gb/design-system/button";
import { useCreateUser } from "@/mutations/use-create-user";
import { useState } from "react";

export function CreateUserForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const createUser = useCreateUser();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!name) newErrors.name = "Name is required";
    if (!email) newErrors.email = "Email is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    createUser.mutate({ name, email });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* ✅ Label + Input association */}
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
          className="focus-visible:ring-2 focus-visible:ring-ring"
        />
        {errors.name && (
          <p id="name-error" className="text-sm text-destructive" aria-live="polite">
            {errors.name}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : "email-hint"}
          className="focus-visible:ring-2 focus-visible:ring-ring"
        />
        <p id="email-hint" className="text-sm text-muted-foreground">
          We'll never share your email
        </p>
        {errors.email && (
          <p id="email-error" className="text-sm text-destructive" aria-live="polite">
            {errors.email}
          </p>
        )}
      </div>

      {/* ✅ Touch target minimum 44px */}
      <Button
        type="submit"
        disabled={createUser.isPending}
        className="min-h-11 w-full transition-all duration-200 hover:bg-primary/90 active:scale-95"
      >
        {createUser.isPending ? "Creating..." : "Create User"}
      </Button>
    </form>
  );
}
```

---

## 6. Responsive Design (Principle 14)

### Mobile-First Pattern

```tsx
// ✅ Default classes for mobile, breakpoints for larger screens
<div className="container mx-auto px-4 py-6">
  {/* Single column on mobile, 2 cols on tablet, 3 cols on desktop */}
  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
    {items.map((item) => (
      <Card key={item.id} className="transition-all duration-200 hover:shadow-md">
        <CardContent className="p-4 md:p-6">
          {/* Stack on mobile, side-by-side on desktop */}
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
            <Avatar className="h-12 w-12 md:h-16 md:w-16">
              <AvatarImage src={item.avatar} alt={item.name} />
            </Avatar>
            <div>
              <h3 className="text-base font-semibold md:text-lg">{item.name}</h3>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
</div>
```

---

## 7. Error Handling (Principle 7)

### Go-Style Tuple Returns

```tsx
// packages/shared/src/utils/safe.util.ts
export async function safeExecute<T>(
  fn: () => Promise<T>
): Promise<[T, null] | [null, Error]> {
  try {
    const result = await fn();
    return [result, null];
  } catch (error) {
    return [null, error instanceof Error ? error : new Error(String(error))];
  }
}

export function safeExecuteSync<T>(
  fn: () => T
): [T, null] | [null, Error] {
  try {
    const result = fn();
    return [result, null];
  } catch (error) {
    return [null, error instanceof Error ? error : new Error(String(error))];
  }
}
```

```tsx
// ✅ Usage in components
import { safeExecute } from "@/utils/safe.util";

async function handleAction() {
  const [data, error] = await safeExecute(() => fetchData());
  
  if (error) {
    toast.error(`Failed to fetch data: ${error.message}`);
    return;
  }

  // data is guaranteed to be non-null here
  processData(data);
}
```

---

## 8. Metadata & SEO (Principle 15)

### Static Metadata

```tsx
// apps/web/src/app/about/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | GradeBench",
  description: "Learn how GradeBench revolutionizes automated grading with AI-powered evaluation and personalized feedback for educational institutions.",
  openGraph: {
    title: "About GradeBench",
    description: "AI-powered automated grading platform",
    images: ["/images/og-about.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About GradeBench",
    description: "AI-powered automated grading platform",
    images: ["/images/twitter-about.png"],
  },
};

export default function AboutPage() {
  return (
    <article className="container mx-auto px-4 py-12">
      <h1 className="mb-6 text-4xl font-bold">About GradeBench</h1>
      <section className="prose dark:prose-invert">
        {/* Content */}
      </section>
    </article>
  );
}
```

### Dynamic Metadata

```tsx
// apps/web/src/app/blog/[slug]/page.tsx
import type { Metadata } from "next";

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = await fetchPost(params.slug);

  return {
    title: `${post.title} | GradeBench Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author.name],
    },
  };
}
```

---

## 9. Icons & Micro-animations (Principle 11, 14)

### Icon Standards

```tsx
import { CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react";

// ✅ Consistent stroke width
<Button>
  <CheckCircle className="mr-2 h-4 w-4" strokeWidth={1.5} />
  Confirm
</Button>

// ✅ Status indicators with animation
<div className="flex items-center gap-2">
  {status === "success" && (
    <CheckCircle className="h-5 w-5 text-green-600" strokeWidth={1.5} />
  )}
  {status === "error" && (
    <XCircle className="h-5 w-5 text-destructive" strokeWidth={1.5} />
  )}
  {status === "loading" && (
    <Loader2 className="h-5 w-5 animate-spin text-primary" strokeWidth={1.5} />
  )}
</div>
```

### Micro-animations

```tsx
// ✅ Button with full interaction feedback
<Button
  className="
    min-h-11
    transition-all duration-200 ease-in-out
    hover:bg-primary/90 hover:shadow-md
    active:scale-95
    focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
  "
>
  Click Me
</Button>

// ✅ Card with hover effect
<Card
  className="
    transition-all duration-200
    hover:shadow-lg hover:-translate-y-1
    cursor-pointer
  "
>
  <CardContent>Content</CardContent>
</Card>

// ✅ Respect reduced motion preference
<div className="transition-all duration-200 motion-reduce:transition-none">
  Animated content
</div>
```

---

## 10. Environment Variables (Principle 5)

### Configuration File

```tsx
// apps/web/src/configs/env.config.ts
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  API_KEY: z.string().min(1),
  NEXT_PUBLIC_API_URL: z.string().url(),
  NODE_ENV: z.enum(["development", "production", "test"]),
});

export const env = envSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
  API_KEY: process.env.API_KEY,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NODE_ENV: process.env.NODE_ENV,
});

// ✅ Type-safe and validated
export type Env = z.infer<typeof envSchema>;
```

```tsx
// apps/web/src/utils/env.util.ts
import { env } from "@/configs/env.config";

export function isProduction(): boolean {
  return env.NODE_ENV === "production";
}

export function isDevelopment(): boolean {
  return env.NODE_ENV === "development";
}

export function isTest(): boolean {
  return env.NODE_ENV === "test";
}
```

```tsx
// ✅ Usage
import { env } from "@/configs/env.config";
import { isProduction } from "@/utils/env.util";

const apiUrl = env.NEXT_PUBLIC_API_URL; // Type-safe
if (isProduction()) {
  // Production-specific logic
}
```

---

## 11. Package Organization (Principle 2)

### Import Patterns

```tsx
// ✅ Import from design system
import { Button } from "@gb/design-system/button";
import { Card } from "@gb/design-system/card";
import { useQuery } from "@gb/query";

// ❌ NEVER import UI libraries directly in apps
import { Button } from "@radix-ui/react-button"; // FORBIDDEN
import * as Dialog from "@radix-ui/react-dialog"; // FORBIDDEN
```

### Creating Shared Packages

```json
// packages/new-package/package.json
{
  "name": "@gb/new-package",
  "version": "0.1.0",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts",
    "./utils": "./src/utils/index.ts"
  }
}
```

```tsx
// packages/new-package/src/index.ts
// ✅ Barrel export pattern
export * from "./components";
export * from "./hooks";
export * from "./utils";
```

---

## 12. Testing Patterns (Principle 6)

### Component Test

```tsx
// apps/web/src/components/__tests__/user-card.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { UserCard } from "../user-card";

describe("UserCard", () => {
  it("renders user information correctly", () => {
    const user = {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      role: "admin",
    };

    render(<UserCard user={user} />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByText("admin")).toBeInTheDocument();
  });

  it("handles missing avatar gracefully", () => {
    const user = {
      id: "1",
      name: "Jane Doe",
      email: "jane@example.com",
      role: "user",
    };

    render(<UserCard user={user} />);

    // Check fallback initials
    expect(screen.getByText("JD")).toBeInTheDocument();
  });
});
```

---

## 13. Page Layout Pattern (Principle 14)

### Complete Page Example

```tsx
// apps/web/src/app/dashboard/page.tsx
import { Suspense } from "react";
import { UserList } from "@/components/user-list";
import { StatsCards } from "@/components/stats-cards";
import { Skeleton } from "@gb/design-system/skeleton";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | GradeBench",
  description: "View your grading analytics and student performance metrics",
};

export default function DashboardPage() {
  return (
    // ✅ Container pattern
    <div className="container mx-auto px-4 py-6">
      {/* ✅ Mobile-first responsive heading */}
      <h1 className="mb-6 text-2xl font-bold md:text-3xl lg:text-4xl">
        Dashboard
      </h1>

      {/* ✅ Responsive grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Suspense fallback={<UserListSkeleton />}>
            <UserList />
          </Suspense>
        </div>
        
        <div className="space-y-6">
          <Suspense fallback={<StatsSkeleton />}>
            <StatsCards />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

function UserListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-20 w-full" />
      ))}
    </div>
  );
}

function StatsSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  );
}
```

---

## Checklist for Code Review

Before submitting code, verify:

- [ ] **Server Components**: Default to server components; `"use client"` only when necessary
- [ ] **Semantic Colors**: No hex codes; use `bg-background`, `text-foreground`, etc.
- [ ] **Spacing**: Standard Tailwind scale; no arbitrary values
- [ ] **Icons**: `lucide-react` with `strokeWidth={1.5}`
- [ ] **Focus**: Visible focus indicators on all interactive elements
- [ ] **Labels**: All form inputs have `<Label>` or `aria-label`
- [ ] **Loading**: `<Skeleton>` components, never blank screens
- [ ] **Empty States**: Icon + text + action button
- [ ] **Animations**: Hover, active, transition effects present
- [ ] **Mobile-First**: Base classes for mobile, breakpoints for desktop
- [ ] **Container**: Page content wrapped in responsive container
- [ ] **Touch Targets**: `min-h-11` for buttons and interactive elements
- [ ] **Metadata**: Every page has title, description, OG tags
- [ ] **Imports**: UI components from `@gb/design-system`, not direct libraries
- [ ] **Error Handling**: Use `safeExecute` instead of try/catch
- [ ] **Tests**: 80% coverage for critical paths

---

## Common Patterns Quick Reference

### Button Variants
```tsx
<Button variant="default">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Delete</Button>
<Button variant="link">Link</Button>
```

### Card Composition
```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content</CardContent>
  <CardFooter>Footer</CardFooter>
</Card>
```

### Dialog Pattern
```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button>Open</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
      <DialogDescription>Description</DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button variant="outline" onClick={onClose}>Cancel</Button>
      <Button onClick={onConfirm}>Confirm</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

**Version**: 1.1.0 (aligned with Constitution 0.3.0)  
**Last Updated**: 2026-01-07  
**Changelog**: Added architecture overview, developer workflows, environment variable patterns, and error handling guidance.
