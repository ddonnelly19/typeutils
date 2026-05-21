import { describe, it, expectTypeOf, expect } from "vitest";
import { DeepMerge, deepMerge } from "../merge.js";


describe("🧬 DeepMerge<T, U> Structural Merger Engine Spec", () => {

	it("should recursively combine multi-tier configuration systems perfectly", () => {
		// 1. Base default app configurations
		type BaseConfig = {
			environment: "production" | "development";
			server: {
				host: string;
				port: 8080;
				metrics: { enabled: true; interval: number };
			};
		};

		// 2. Specific local developer override configuration blocks
		type LocalConfig = {
			environment: "development";
			server: {
				port: 3000;
				metrics: { interval: 5000 };
			};
		};

		// 3. Compute the merged result layout type
		type UnifiedConfig = DeepMerge<BaseConfig, LocalConfig>;

		// 4. Verify the type tree: unique fields are preserved, colliders are overwritten recursively
		expectTypeOf<UnifiedConfig>().toEqualTypeOf<{
			environment: "development"; // Overwritten cleanly
			server: {
				host: string; // Preserved from BaseConfig
				port: 3000;   // Overwritten cleanly
				metrics: {
					enabled: true;    // Preserved from BaseConfig
					interval: 5000;   // Overwritten cleanly
				};
			};
		}>();
	});

	it("should execute accurate runtime merging that mirrors the type-level assertions", () => {
		const defaultConfig = {
			db: { url: "localhost", pool: 10 },
			debug: false,
		};

		const productionOverrides = {
			db: { url: "production-cluster" },
			debug: true,
		};

		// Process the runtime merge execution
		const mergedRuntimeResult = deepMerge(defaultConfig, productionOverrides);

		// Verify runtime object evaluation values match
		expect(mergedRuntimeResult).toEqual({
			db: { url: "production-cluster", pool: 10 },
			debug: true,
		});

		// Verify compile-time signatures are linked accurately
		expectTypeOf(mergedRuntimeResult).toEqualTypeOf<{
			db: { url: string; pool: number };
			debug: boolean;
		}>();
	});
});
