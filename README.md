# GradeBench

> Grade in Seconds. Teach for Hours.

GradeBench is an AI-powered evaluation platform that automates grading and delivers instant, personalized feedback to educational institutions. Built to scale from UPSC coaching institutes to K-12 schools and universities.

## 🚀 Features

- **AI-Powered Automated Grading**: Grade handwritten or typed answer sheets in 30 seconds
- **Personalized Feedback**: Generate detailed, actionable feedback for every student
- **Human-Like Annotations**: Digital annotations with the personal touch of an experienced educator
- **Performance Analytics**: Comprehensive dashboards to track student and cohort performance
- **Bias-Free Evaluation**: Standardized, consistent grading across all submissions
- **Multilingual Support**: Support for Hindi, Marathi, Kannada, and more (coming soon)

## 📦 Monorepo Structure

This repository is organized as a [Turborepo](https://turbo.build/repo) monorepo with the following structure:

```
GradeBench/
├── apps/
│   └── web/              # Next.js web application
├── packages/
│   ├── auth/             # Authentication utilities
│   ├── ui/               # Shared UI components (shadcn/ui)
│   └── typescript-config/ # Shared TypeScript configurations
├── elements/
│   └── quicks/           # Quick UI elements and components
├── kits/                 # Development kits (planned)
└── docs/                 # Documentation files
```

### Apps

- **web**: Main Next.js application serving the GradeBench platform

### Packages

- **@gb/auth**: Authentication library built with better-auth
- **@gb/ui**: Shared UI component library built with React, Tailwind CSS, and Radix UI
- **@gb/typescript-config**: Shared TypeScript configuration presets

### Elements

- **@gb-element/quicks**: Quick reusable UI elements and patterns

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with React 19
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Animations**: [Motion](https://motion.dev/)
- **State Management**: [TanStack Query](https://tanstack.com/query)
- **Build Tool**: [Turborepo](https://turbo.build/repo)
- **Linting & Formatting**: [Biome](https://biomejs.dev/)
- **Testing**: [Vitest](https://vitest.dev/) + [Playwright](https://playwright.dev/)

## 🚦 Getting Started

### Prerequisites

- Node.js >= 18
- npm 11.4.2 or higher

### Installation

1. Clone the repository:

```bash
git clone https://github.com/gradebench/GradeBench.git
cd GradeBench
```

2. Install dependencies:

```bash
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

The web app will be available at [http://localhost:3000](http://localhost:3000).

### Building

Build all apps and packages:

```bash
npm run build
```

### Testing

Run tests across all packages:

```bash
npm run test
```

### Linting & Formatting

Lint and auto-fix code:

```bash
npm run lint
```

Type checking:

```bash
npm run check-types
```

## 📚 Documentation

Additional documentation can be found in the `/docs` directory:

- [Engineering Constitution](./.specify/memory/constitution.md) - Core principles and governance (v0.1.0, 8 principles)
- [Site Content](./docs/site.md) - Marketing website content and copy
- [UI Guidelines](./docs/ui-prompt.md) - UI/UX design system and guidelines
- [Testing Guide](./docs/test.md) - Testing strategies and examples
- [Unit Testing](./docs/unit-test.md) - Unit testing best practices

## 🤝 Contributing

We welcome contributions! Please ensure:

1. All code follows our Biome linting rules
2. Tests pass before submitting PRs
3. Type checking passes (`npm run check-types`)
4. Commit messages are clear and descriptive

## 📄 License

Copyright © 2024 GradeBench. All rights reserved.

## 🌐 Links

- **Website**: [www.gradebench.com](https://www.gradebench.com)
- **Email**: info@gradebench.com

## 💡 About

GradeBench is transforming education evaluation by automating grading workflows, reducing costs by 70%, and enabling educators to focus on what matters most—teaching. Currently serving leading UPSC coaching institutes including Samkalp IAS (Delhi) and Primus IAS (Bengaluru).

---

Built with ❤️ by the GradeBench team