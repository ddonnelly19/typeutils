import { describe, it, expectTypeOf, expect } from "vitest";
import { deepPick, DeepPick } from "../pick.js";

describe("🎯 DeepPick<T, Paths> Structural Extraction Engine Spec", () => {

	// Define a comprehensive multi-tier configuration payload model
	type AppConfig = {
		appName: string;
		version: string;
		server: {
			host: string;
			port: number;
			metrics: {
				enabled: boolean;
				interval: number;
			};
		};
		database: {
			url: string;
			timeout: number;
		};
	};

	it("should extract precise deep fields while perfectly preserving object structure wrappers", () => {
		// 1. Declare the dot-notation paths we want to isolate
		type TargetedPaths = "version" | "server.host" | "server.metrics.interval";

		// 2. Compute the picked type schema output
		type PickedSchema = DeepPick<AppConfig, TargetedPaths>;

		// 3. Verify that only the chosen properties exist, matching their original nested keys
		expectTypeOf<PickedSchema>().toEqualTypeOf<{
			version: string;
			server: {
				host: string;
				metrics: {
					interval: number;
				};
			};
		}>();
	});

	it("should execute accurate runtime picking that mirrors the compile-time signatures", () => {
		const rawConfig = {
			appName: "TypeUtilsService",
			version: "1.0.0",
			server: {
				host: "0.0.0.0",
				port: 8080,
				metrics: { enabled: true, interval: 30 },
			},
		};

		// Run the runtime picking extraction helper
		const pickedRuntimeResult = deepPick(rawConfig, ["appName", "server.metrics.enabled"]);

		// Verify the runtime object contains only the mapped key paths
		expect(pickedRuntimeResult).toEqual({
			appName: "TypeUtilsService",
			server: {
				metrics: { enabled: true },
			},
		});

		// Verify the compile-time type signature is narrowed automatically
		expectTypeOf(pickedRuntimeResult).toEqualTypeOf<{
			appName: string;
			server: {
				metrics: {
					enabled: boolean;
				};
			};
		}>();
	});

	it("should gracefully reduce invalid path entries down to never", () => {
		// Attempting to pick paths that do not exist inside the target object structural layout
		type BrokenPick = DeepPick<AppConfig, "server.invalid_property" | "database.pool.size">;

		expectTypeOf<BrokenPick>().toEqualTypeOf<{
			server: never;
			database: never;
		}>();
	});
});
