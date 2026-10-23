import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

// Vitest + Testing Library. `pnpm test` corre con TZ=UTC (package.json). El gate de 100% de
// branch vale solo para funciones puras (domain/). Server Components async no se testean aquí:
// lo que tienen de lógica va a domain/, y el flujo entre páginas va a Playwright.
export default defineConfig({
	plugins: [react()],
	resolve: { tsconfigPaths: true }, // alias @/ del tsconfig.json
	test: {
		environment: "jsdom",
		setupFiles: ["./vitest.setup.ts"],
		include: ["src/**/*.test.{ts,tsx}"],
		coverage: {
			provider: "v8",
			include: ["src/features/*/domain/**/*.ts"],
			exclude: ["**/*.test.ts", "**/*.mock.ts"],
			thresholds: { branches: 100 },
		},
	},
});
