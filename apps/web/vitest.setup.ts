// Import Vitest globals
import { afterEach, expect } from "vitest";

// Import testing-library utilities
import { cleanup } from "@testing-library/react";

// Import individual matchers directly
import {
  toBeChecked,
  toBeDisabled,
  toBeEnabled,
  toBeInTheDocument,
  toBeVisible,
  toHaveAttribute,
  toHaveClass,
  toHaveFocus,
  toHaveTextContent,
  toHaveValue,
} from "@testing-library/jest-dom/matchers";

// Explicitly extend Vitest's expect with individual matchers
expect.extend({
  toBeInTheDocument,
  toBeVisible,
  toHaveAttribute,
  toHaveClass,
  toHaveTextContent,
  toHaveValue,
  toBeDisabled,
  toBeEnabled,
  toBeChecked,
  toHaveFocus,
});

// Clean up after each test
afterEach(() => {
  cleanup();
});

// This file is referenced in vitest.config.mts and will be automatically loaded by Vitest
// It extends the expect object with methods from jest-dom
