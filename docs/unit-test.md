# Frontend Unit Test Document

This document outlines the strategy, tools, and best practices for writing unit tests for the Next.js frontend, based on the established testing strategy.

---

## Framework and Tools

Our unit testing setup is built upon a modern, fast, and effective toolchain.

- **Test Runner & Assertion Library**: **Vitest** is used for its speed, modern ESM support, and Jest-compatible API.
- **Component Utilities**: **`@testing-library/react`** provides utilities to test React components in a user-centric way.
- **DOM Matchers**: **`@testing-library/jest-dom`** adds custom Jest matchers for asserting on DOM nodes.

---

## Basic Setup in a Turborepo

To ensure consistency and leverage monorepo efficiencies, follow this setup guide for each frontend package.

1.  **Install Dependencies**: Add `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, and other necessary testing packages to the `devDependencies` of your package.
2.  **Add Test Script**: In the `package.json` of each frontend workspace, add a `test` script:
    ```json
    "scripts": {
      "test": "vitest run --reporter=dot --coverage"
    }
    ```
3.  **Run Tests**: To execute tests for only the packages that have changed, run the following command from the monorepo root. Turborepo will automatically figure out the dependency graph and cache results.
    ```bash
    turbo run test
    ```

---

## Key Test Actions and Checks

Unit tests should focus on testing the smallest parts of the application—like functions, hooks, or modules—in complete isolation. Below is a granular checklist of actions to perform.

### **Pure Functions and Utilities**

- **Correct Output**: Assert that the function returns the expected value for a given valid input.
- **Edge Cases**: Test with boundary values, such as empty strings, `null`, `undefined`, zero, or negative numbers, to ensure they are handled correctly.
- **Error Handling**: Verify that the function throws the correct type of error when provided with invalid input.

### **React Custom Hooks (`useMyHook`)**

- **Initial State**: Use the `renderHook` utility from Testing Library to check the hook's initial return values.
- **State Updates**: Trigger functions returned by the hook and assert that the state updates as expected.
- **Side Effects**: Test `useEffect` blocks by mocking their dependencies and asserting that they are called correctly.
- **Asynchronous Logic**: For hooks that perform data fetching, mock the API calls and test the loading, success, and error states.
- **Cleanup**: Ensure any cleanup logic within `useEffect` (e.g., removing event listeners) is executed when the component unmounts.

### **Mocking External Dependencies**

- **API Calls (`fetch`)**: Use Vitest's mocking capabilities (`vi.mock`) to provide controlled, fake responses for network requests, preventing real API calls during tests.
- **Browser APIs**: Mock browser-specific objects that don't exist in a Node.js environment, such as `localStorage`, `sessionStorage`, or `matchMedia`.
- **Third-Party Libraries**: Isolate your component or hook by mocking imported modules (e.g., analytics services, utility libraries) to ensure the test focuses only on your code.
- **Date and Time**: Mock `Date` to test logic that is sensitive to time, ensuring predictable and repeatable test outcomes.

---

## CI/CD Pipeline Fine-Tuning (GitHub Actions)

The CI/CD pipeline is optimized to run unit tests quickly and efficiently on every pull request.

- **Caching**: The pipeline aggressively caches dependencies. It uses `actions/cache` for the global npm cache (`~/.npm`) and Turborepo's remote cache (`.turbo`) to speed up subsequent runs.
- **Parallelization**: To get faster feedback, tests are run in parallel. This is achieved either by using Turborepo's built-in concurrency (`turbo run test --concurrency 5`) or by using a GitHub Actions matrix to run tests for each package as a separate job.
- **Fail Fast**: Unit tests run early in the CI pipeline, immediately after linting and type-checking, to provide rapid feedback and prevent wasting resources on longer-running jobs like E2E tests if the basics are broken.
- **Artifacts and Reporting**: On completion, test reports (JUnit XML) and coverage reports are uploaded as build artifacts. This allows for easy inspection of test failures and tracking coverage metrics over time.
