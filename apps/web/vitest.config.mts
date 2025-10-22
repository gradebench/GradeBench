import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [tsconfigPaths(), react()],
	test: {
		globals: true,
		environment: "jsdom",
		include: [
			"./src/**/*.{test,spec}.{ts,tsx}",
			"./__tests__/**/*.{test,spec}.{ts,tsx}",
		],
		setupFiles: ["./vitest.setup.ts"],
		coverage: {
			provider: "v8",
			thresholds: {
				branches: 30,
				functions: 30,
				lines: 30,
				statements: 30,
			},
		},
	},
	resolve: {
		alias: {
			"@": resolve(__dirname, "./src"),
		},
	},
});
