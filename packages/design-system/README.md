# @gb/design-system

A comprehensive React component library for GradeBench, built with Tailwind CSS and shadcn/ui primitives.

## Overview

This package provides a collection of reusable UI components used across the GradeBench monorepo. It's built on top of:

- **shadcn/ui** - Base UI primitives
- **Tailwind CSS v4** - Utility-first styling
- **Radix UI / Base UI** - Accessible component primitives
- **class-variance-authority** - Type-safe variant management
- **Lucide React** - Icon library

## Components

The design system includes 50+ components organized in `src/components/ui/`:

### Layout & Structure

- Card, Separator, Sidebar, Resizable, Scroll Area

### Forms & Inputs

- Input, Textarea, Select, Checkbox, Radio Group, Switch, Slider
- Input Group, Input OTP, Native Select, Combobox, Calendar

### Navigation

- Button, Button Group, Navigation Menu, Menubar, Breadcrumb, Pagination, Tabs

### Feedback & Overlays

- Dialog, Sheet, Drawer, Popover, Tooltip, Hover Card
- Alert, Alert Dialog, Toast (Sonner), Progress, Skeleton, Spinner

### Data Display

- Table, Badge, Avatar, Typography, Chart, Empty State, Kbd

### Interactive

- Accordion, Collapsible, Carousel, Command, Context Menu, Dropdown Menu, Toggle

## Usage

### Internal Usage (within design-system package)

```tsx
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
```

### External Usage (from other packages)

```tsx
import { Button } from "@gb/design-system/src/components/ui/button";
import { cn } from "@gb/design-system/src/lib/utils";
```

## Styling

### Global Styles

Global CSS variables and theme configuration are in `src/styles/global.css`.

### Tailwind Configuration

Tailwind CSS v4 is configured via `postcss.config.mjs` with:

- Custom color scheme (light/dark mode support)
- Custom radius values
- Container queries support
- Animation utilities from `tw-animate-css`

### Theme Tokens

CSS custom properties for theming:

- Color tokens: `--primary`, `--secondary`, `--muted`, `--accent`, `--destructive`
- Radius tokens: `--radius-sm` through `--radius-4xl`
- Sidebar tokens: `--sidebar`, `--sidebar-accent`, etc.

## Utilities

### `cn()` Helper

Type-safe className merging utility combining `clsx` and `tailwind-merge`:

```tsx
import { cn } from "@/lib/utils";

<div className={cn("base-class", condition && "conditional-class")} />;
```

### `useIsMobile()` Hook

React hook for responsive breakpoint detection:

```tsx
import { useIsMobile } from "@/hooks/use-mobile";

const isMobile = useIsMobile(); // true if width < 768px
```

## Development

This package is part of the GradeBench TurboRepo monorepo.

### TypeScript

Extends `@gb/typescript-config/react-library.json` with custom path aliases configured in `tsconfig.json`.

### Dependencies

All component dependencies are listed in `package.json`. Key dependencies include React 19, Next.js 16, and various Radix/Base UI primitives.

## Notes

⚠️ This is an internal package (`"private": true`) and is not published to npm.
