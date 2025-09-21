import react from "@vitejs/plugin-react";
import { resolve } from "path";
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
				branches: 40,
				functions: 40,
				lines: 40,
				statements: 40,
			},
		},
	},
	resolve: {
		alias: {
			"@": resolve(__dirname, "./src"),
		},
	},
});
