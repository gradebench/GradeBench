// Import Vitest globals

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

// Import testing-library utilities
import { cleanup } from "@testing-library/react";
import { afterEach, expect, vi } from "vitest";

import "@testing-library/jest-dom/vitest";

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

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
	writable: true,
	value: vi.fn().mockImplementation(query => ({
		matches: false,
		media: query,
		onchange: null,
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
		addListener: vi.fn(), // deprecated
		removeListener: vi.fn(), // deprecated
		dispatchEvent: vi.fn(),
	})),
});

// Clean up after each test
afterEach(() => {
	cleanup();
	vi.clearAllMocks();
});

// This file is referenced in vitest.config.mts and will be automatically loaded by Vitest
// It extends the expect object with methods from jest-dom
