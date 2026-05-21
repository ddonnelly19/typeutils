import { describe, it, expectTypeOf, expect } from "vitest";
import { deepOmit, DeepOmit, StrictPaths } from "../omit-paths.js";


describe("🛡️ Configuration Sanitization and Mapping Engine Spec", () => {

	// Define a standard database connection schema configuration payload
	type DbConfig = {
		clusterName: string;
		auth: {
			user: string;
			tokenSecret: string; // Target for strict erasure
			roles: string[];
		};
		network: {
			ip: string;
			tls: { enabled: boolean; certId: string }; // certId is a target for erasure
		};
	};

	describe("⌨️ StrictPaths<T> Autocomplete Generator", () => {
		it("should compute a complete flat string union of all available object tracks", () => {
			type ComputedPaths = StrictPaths<DbConfig>;

			// ✅ Asserts that all variations are completely generated for IDE prompting
			expectTypeOf<ComputedPaths>().toEqualTypeOf<

				| "clusterName"
				| "auth"
				| "auth.user"

				| "auth.tokenSecret"
				| "auth.roles"
				| "network"

				| "network.ip"
				| "network.tls"
				| "network.tls.enabled"

				| "network.tls.certId"
			>();
		});
	});

	describe("❌ DeepOmit<T, Paths> Property Erasure Engine", () => {
		it("should strip deep fields while leaving surrounding dictionary tracks intact", () => {
			// 1. Declare the sensitive configuration keys we want to purge
			type SanitizeTargets = "auth.tokenSecret" | "network.tls.certId";

			// 2. Compute the safe runtime object type schema signature
			type SanitizedSchema = DeepOmit<DbConfig, SanitizeTargets>;

			// 3. Verify the layout contains no secrets, but leaves sibling metrics unharmed
			expectTypeOf<SanitizedSchema>().toEqualTypeOf<{
				clusterName: string;
				auth: {
					user: string;
					roles: string[];
				};
				network: {
					ip: string;
					tls: {
						enabled: boolean;
					};
				};
			}>();
		});

		it("should execute accurate runtime erasure matching the type-level signatures", () => {
			const liveConfig = {
				clusterName: "east-prod-01",
				auth: { user: "admin", tokenSecret: "super-secret-pass" },
				network: { ip: "10.0.0.5", tls: { enabled: true, certId: "cert-9923" } }
			};

			// Sanitize the raw live data block dynamically
			const cleanResult = deepOmit(liveConfig, ["auth.tokenSecret", "network.tls.certId"]);

			// Verify the keys are fully deleted from the runtime object memory tree
			expect(cleanResult).toEqual({
				clusterName: "east-prod-01",
				auth: { user: "admin" },
				network: { ip: "10.0.0.5", tls: { enabled: true } }
			});

			// Verify the type signature matches our flat expectations
			expectTypeOf(cleanResult).toEqualTypeOf<{
				clusterName: string;
				auth: { user: string };
				network: { ip: string; tls: { enabled: boolean } };
			}>();
		});
	});
});
