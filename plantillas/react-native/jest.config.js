// Tests con jest-expo + Testing Library. `pnpm test` corre con TZ=UTC (package.json).
// El gate de 100% de branch vale solo para funciones puras (domain/): ahí no hay excusa.
/** @type {import('jest').Config} */
module.exports = {
	preset: "jest-expo",
	setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
	moduleNameMapper: {
		"\\.svg$": "<rootDir>/jest.svg-mock.js",
		"^@/assets/(.*)$": "<rootDir>/assets/$1",
		"^@/(.*)$": "<rootDir>/src/$1",
	},
	// Con pnpm los paquetes viven en node_modules/.pnpm/<pkg>/node_modules/<pkg>: el patrón lo
	// contempla. Si un paquete ESM falla con "Unexpected token 'export'", agrégalo a la lista.
	transformIgnorePatterns: [
		"node_modules/(?!(?:\\.pnpm/[^/]+/node_modules/)?((jest-)?react-native|@react-native(-community)?|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|uniwind|lucide-react-native|zod))",
	],
	collectCoverageFrom: ["src/features/*/domain/**/*.ts", "!**/*.test.ts", "!**/*.mock.ts"],
	coverageThreshold: { global: { branches: 100 } },
};
