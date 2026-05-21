import { defineConfig } from "vitest/config";


export default defineConfig({
	test: {
		// 1. Standard runtime testing configurations
		include: ["**/*.{test,spec}.ts"],
		environment: "node",

		// 2. Add this typecheck block to tell Vitest where to look for type assertions
		typecheck: {
			enabled: true,
			include: ["**/*.spec.ts"], // Targets your regex-types.spec.ts file,
			tsconfig: "./tsconfig.json"
		},
	},
});