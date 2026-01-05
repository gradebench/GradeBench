import { resolve } from "node:path";
import { loadEnv } from "vite";
import { defineConfig, mergeConfig } from "vitest/config";

/**
 * Default Vitest configuration for GradeBench Services.
 * Provides comprehensive test configuration with sensible defaults.
 *
 * @param {Object} options - Configuration options
 * @param {string} [options.setupFile] - Path to setup file (default: "./vitest.setup.ts")
 * @param {string[]} [options.setupFiles] - Multiple setup files
 * @param {number} [options.testTimeout] - Test timeout in ms (default: 10000)
 * @param {Object} [options.coverage] - Coverage configuration overrides
 * @param {Object} [options.alias] - Additional path aliases
 * @param {Object} [options.env] - Environment variables for tests
 * @param {boolean} [options.isolate] - Run tests in isolation (default: true)
 * @param {number} [options.poolOptions] - Thread pool options
 * @returns {import('vitest/config').UserConfig}
 */
export const vitestConfig = (options = {}) => {
  const {
    setupFile = "./vitest.setup.ts",
    setupFiles,
    testTimeout = 10_000,
    coverage = {},
    alias = {},
    isolate = true,
    poolOptions = {},
  } = options;

  const defaultConfig = defineConfig({
    test: {
      // Only discover tests from the standard `tests/` locations.
      // This enforces repo convention: unit tests in `tests/unit`, integration in `tests/integration`.
      include: ["**/tests/**/*.test.{js,ts}", "**/tests/**/*.spec.{js,ts}"],
      globals: true,
      environment: "node",
      setupFiles: setupFiles || [setupFile],
      testTimeout,
      env: loadEnv("test", process.cwd(), ""),
      isolate,
      poolOptions: {
        threads: {
          singleThread: false,
          ...poolOptions.threads,
        },
      },
      coverage: {
        enabled: false,
        provider: "v8",
        all: false,
        reporter: ["text", "json", "html", "lcov"],
        include: ["**/src/**/*.ts"],
        exclude: [
          "node_modules/**",
          "dist/**",
          "build/**",
          "coverage/**",
          "**/*.config.ts",
          "**/*.config.js",
          "**/*.d.ts",
          "**/index.ts",
          "**/*.test.ts",
          "**/*.spec.ts",
          "**/tests/**",
          "**/examples/**",
          "**/docs/**",
          "**/*.schema.ts",
          "**/migrations/**",
          "**/types/**",
        ],
        thresholds: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
          ...coverage.thresholds,
        },
        ...coverage,
      },
    },
    resolve: {
      alias: {
        "@": resolve("./src"),
        ...alias,
      },
    },
  });

  return defaultConfig;
};

/**
 * Create a custom Vitest config by merging with the default.
 * Use this when you need to add specific configurations.
 *
 * @param {import('vitest/config').ViteUserConfig} customConfig - Custom configuration to merge
 * @param {Object} options - Base configuration options
 * @returns {import('vitest/config').ViteUserConfig}
 */
export const createVitestConfig = (customConfig = {}, options = {}) => {
  return mergeConfig(vitestConfig(options), customConfig);
};
