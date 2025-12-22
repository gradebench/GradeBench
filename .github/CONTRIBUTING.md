# Contributing Guide

Welcome to the team. This document outlines the standards and workflows required to contribute to this repository.

## 1. Getting Started

### Prerequisites

- **Node.js** (LTS version)
- **NPM** (Package Manager)

### Setup

1. Clone the repository:

   ```bash
   git clone <repo-url>
   cd <repo-name>
   ```

2. Install dependencies:
   ```bash
   npm ci
   ```
3. Configure Environment:
   ```bash
   cp .env.example .env
   # Ask in Technical Team if you need specific secrets
   ```

## 2. Development Workflow

### Branching Strategy (GitHub Flow)

We use **GitHub Flow**. All work happens on feature branches and merges directly into `main`.

1.  Create a branch from `main`: `git checkout -b feature/my-new-feature`
2.  Commit changes.
3.  Open a Pull Request (PR) to `main`.

### Code Quality Tools

We use **Biome** for linting/formatting and **Vitest** for testing.

- **Lint & Format:**
  ```bash
  npm run lint  # Runs Biome check
  ```
- **Testing:**
  ```bash
  npm run test  # Runs Vitest
  ```

### Database Schema Changes

**Critical:** If you modify the database schema, you must generate the corresponding migration files.

- CI includes a **Schema Consistency Check** that will fail if the schema definition and migration files are out of sync.
- Ensure you commit both the schema change and the generated migration SQL.

## 3. Commit Guidelines

We strictly follow [Conventional Commits](https://www.conventionalcommits.org/).

**Format:** `<type>(<scope>): <description>`

**Allowed Types:**

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools

**Example:**

> `feat(auth): add google oauth provider`

## 4. Pull Request (PR) Protocol

### Before opening a PR:

1. Ensure `mpm run lint` passes locally.
1. Ensure `npm run build` passes locally.
1. Ensure `npm run test` passes locally.
1. Self-review your code.

### Review Process:

- **Required:** 1 Approval from a peer.
- **CI Gates:**
  - Build verification.
  - Dependency security audits.
  - Database schema consistency check.
