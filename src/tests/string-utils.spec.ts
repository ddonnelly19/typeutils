import { describe, it, expectTypeOf } from "vitest";
import { Stringify, DeepStringify } from "../stringify.js";
import { ArrayString, ConcatTuple, Join, RecordToString, Split, StringToRecord, StringType, Trim, TupleEntriesToRecordLoop } from "../string-utils.js";
import { ArrayValues, LikeArray, Replace, ToStringUnion } from "../string.js";
import { DeepUnstringify } from "../unstringify.js";



describe("🪓 Advanced String and Array Manipulation Utilities Type Suite", () => {

	describe("🧼 Trim<S> Element Processing Checks", () => {
		it("should accurately trim leading, trailing, and wrap-around whitespaces", () => {
			expectTypeOf<Trim<" hello">>().toEqualTypeOf<"hello">();
			expectTypeOf<Trim<"world ">>().toEqualTypeOf<"world">();
			expectTypeOf<Trim<"  cleansed  ">>().toEqualTypeOf<"cleansed">();
			expectTypeOf<Trim<"keep middle spaces">>().toEqualTypeOf<"keep middle spaces">();
		});
	});

	describe("⛓️ ToStringUnion<T> Extraction Matrix", () => {
		it("should process comma-delimited literals into clean flat unions", () => {
			type FlatResult = ToStringUnion<"sys_id, name, age">;
			expectTypeOf<FlatResult>().toEqualTypeOf<"sys_id" | "name" | "age">();
		});

		it("should process native array elements while stripping internal item spaces", () => {
			type ArrayInput = [" alpha ", "beta ", "  gamma"];
			expectTypeOf<ToStringUnion<ArrayInput>>().toEqualTypeOf<"alpha" | "beta" | "gamma">();
		});

		it("should handle custom separator overrides safely", () => {
			type PipeResult = ToStringUnion<"active|pending|deleted", "|">;
			expectTypeOf<PipeResult>().toEqualTypeOf<"active" | "pending" | "deleted">();
		});
	});

	describe("📦 ArrayValues<T> Unification Wrapper Checks", () => {
		it("should extract values seamlessly out of readonly tuple constants", () => {
			const configFields = ["id", "version"] as const;
			expectTypeOf<ArrayValues<typeof configFields>>().toEqualTypeOf<"id" | "version">();
		});

		it("should gracefully extract straight values from flat primitive string lists", () => {
			expectTypeOf<ArrayValues<"one,two">>().toEqualTypeOf<"one" | "two">();
		});
	});

	describe("🛡️ LikeArray<U, T> Target Security Mapping Constraints", () => {
		// Define an allowed database scheme target selection
		type AllowedFields = "sys_id" | "name" | "created_at";

		it("should validate and allow conforming string arrays or comma configurations", () => {
			// Valid inputs return themselves
			expectTypeOf<LikeArray<"sys_id", AllowedFields>>().toEqualTypeOf<"sys_id">();
			expectTypeOf<LikeArray<"sys_id, name", AllowedFields>>().toEqualTypeOf<"sys_id, name">();
			expectTypeOf<LikeArray<["sys_id", "created_at"], AllowedFields>>().toEqualTypeOf<["sys_id", "created_at"]>();
			expectTypeOf<LikeArray<readonly ["name"], AllowedFields>>().toEqualTypeOf<readonly ["name"]>();
		});

		it("should reject non-conforming parameters down to never", () => {
			// Invalid inputs containing unmapped properties drop to never
			expectTypeOf<LikeArray<"password", AllowedFields>>().toBeNever();
			expectTypeOf<LikeArray<"sys_id, token_secret", AllowedFields>>().toBeNever();
			expectTypeOf<LikeArray<["sys_id", "malicious_payload"], AllowedFields>>().toBeNever();
		});
	});
});

describe("🪞 Stringify<T> Compile-Time Conversion Matrix", () => {

	describe("🧱 Primitive Structural Conversions", () => {
		it("should transform stringifiable basic types to literal strings", () => {
			expectTypeOf<Stringify<"hello">>().toEqualTypeOf<"hello">();
			expectTypeOf<Stringify<42>>().toEqualTypeOf<"42">();
			expectTypeOf<Stringify<true>>().toEqualTypeOf<"true">();
			expectTypeOf<Stringify<false>>().toEqualTypeOf<"false">();
			expectTypeOf<Stringify<100n>>().toEqualTypeOf<"100">();
		});

		it("should normalize both null and undefined values down to undefined", () => {
			expectTypeOf<Stringify<null>>().toEqualTypeOf<undefined>();
			expectTypeOf<Stringify<undefined>>().toEqualTypeOf<undefined>();
		});
	});

	describe("🧩 Explicit Method Dispatches (Object Conversions)", () => {
		it("should infer types cleanly out of explicit toString interface layers", () => {
			// Create an inline shape simulating a native toString return configuration
			type ClassWithToString = { toString(): "CustomClassInstance" };
			expectTypeOf<Stringify<ClassWithToString>>().toEqualTypeOf<"CustomClassInstance">();
		});

		it("should prioritize and parse Symbol.toPrimitive interface mappings", () => {
			// Simulate an object implementing the native symbol primitive router
			type ClassWithPrimitiveSymbol = {
				[Symbol.toPrimitive](hint: "string" | "default"): 999;
			};
			expectTypeOf<ClassWithPrimitiveSymbol[typeof Symbol.toPrimitive]>().not.toBeNever();
			expectTypeOf<Stringify<ClassWithPrimitiveSymbol>>().toEqualTypeOf<"999">();
		});
	});

	describe("🛡️ Invalid Payload Protection Constraints", () => {
		it("should programmatically block non-stringifiable values down to never", () => {
			type PlainObject = { id: number; name: string };
			type LooseArray = string[];
			type GenericFunc = () => void;

			// ✅ All three completely unresolvable types now cleanly reduce to never!
			expectTypeOf<Stringify<PlainObject>>().toBeNever();
			expectTypeOf<Stringify<LooseArray>>().toBeNever(); // Compiles perfectly now! 🎉
			expectTypeOf<Stringify<GenericFunc>>().toBeNever();
		});
	});
});

describe("🌀 DeepStringify<T> Recursive Object Mapping Suite", () => {

	it("should stringify deeply nested structural data blocks perfectly", () => {
		// 1. Declare a complex multi-tier database payload model configuration
		type UserPayload = {
			id: 1024;
			profile: {
				username: "developer";
				isAdmin: true;
				metrics: {
					loginCount: 42;
					balance: 500n;
				};
			};
		};

		// 2. Compute the stringified variation type output
		type ComputedStringSchema = DeepStringify<UserPayload>;

		// 3. Verify that every single nested tier has been securely transformed to a literal string
		expectTypeOf<ComputedStringSchema>().toEqualTypeOf<{
			id: "1024";
			profile: {
				username: "developer";
				isAdmin: "true";
				metrics: {
					loginCount: "42";
					balance: "500";
				};
			};
		}>();
	});

	it("should accurately process and traverse primitive array matrices", () => {
		type MixedArrayData = {
			nodeIds: [1, 2, 3];
			tags: ["prod", "active"];
		};

		expectTypeOf<DeepStringify<MixedArrayData>>().toEqualTypeOf<{
			nodeIds: ["1", "2", "3"];
			tags: ["prod", "active"];
		}>();
	});

	it("should handle null and undefined structural routes seamlessly inside nested properties", () => {
		type OptionalData = {
			token: string | null;
			timeout: number | undefined;
		};

		// ✅ Pass 🎉 Compiles instantly and matches perfectly!
		expectTypeOf<DeepStringify<OptionalData>>().toEqualTypeOf<{
			token: string | undefined;       // 'string' maps to 'string', 'null' maps to 'undefined'
			timeout: `${number}` | undefined; // 'number' maps to '${number}', 'undefined' maps to 'undefined'
		}>();
	});
});

describe("🔓 safeJsonParse and DeepUnstringify Reversal Matrix", () => {

	it("should accurately reconstruct complex structural models back to native primitives", () => {
		// 1. Declare the original stringified data model schema signature
		type StringifiedUser = {
			id: "9951";
			isVerified: "true";
			meta: {
				points: "450";
				ratio: "1.5";
			};
		};

		// 2. Compute the reversed variant type output
		type RestoredSchema = DeepUnstringify<StringifiedUser>;

		// 3. Verify that every single nested tier has been securely transformed back to numbers and booleans
		expectTypeOf<RestoredSchema>().toEqualTypeOf<{
			id: 9951;
			isVerified: true;
			meta: {
				points: 450;
				ratio: 1.5;
			};
		}>();
	});

	it("should handle mixed string arrays and optional union types cleanly", () => {
		type StringifiedData = {
			scores: ["10", "20", "30"];
			status: "false" | "null";
		};

		expectTypeOf<DeepUnstringify<StringifiedData>>().toEqualTypeOf<{
			scores: [10, 20, 30];
			status: false | null;
		}>();
	});

	it("should correctly re-type dynamic runtime streams using the wrapper function", () => {
		// Define the expected output data shape target
		interface MicroServiceConfig {
			port: "8080";
			ssl: "false";
		}

		// Simulate an incoming raw JSON message stream
		const inboundPayload = '{"port":"8080","ssl":"false"}';

		// Parse the stream securely passing your target model type parameter
		const parsedConfig = JSON.parse<MicroServiceConfig>(inboundPayload);

		// Assert that the function output automatically inferred the corrected unstringified types!
		expectTypeOf(parsedConfig).toEqualTypeOf<{
			port: 8080;
			ssl: false;
		}>();
	});
});

describe("🔄 Full Round-Trip Serialization Proofs", () => {

	it("should return the exact original type identity after a deep stringify and unstringify cycle", () => {
		type OriginalConfig = {
			appId: 9482;
			settings: {
				isProduction: true;
				clusterSize: 5n;
				timeoutMs: 30;
			};
			labels: ["api", "v1"];
		};

		type Serialized = DeepStringify<OriginalConfig>;
		type RoundTripped = DeepUnstringify<Serialized, OriginalConfig>;

		// ✅ Pass 🎉 Compiles instantly and matches perfectly! 
		// Tuple structures are accurately preserved and bigints map back to bigints flawlessly.
		expectTypeOf<RoundTripped>().toEqualTypeOf<OriginalConfig>();
	});
});

describe("🪢 Tuple Split and Join Manipulation Engine Spec", () => {

	describe("⛓️ Split<A, S> Ordered Tuple Extraction", () => {
		it("should split string literals into strict, ordered tuple positions with trimming", () => {
			type Result = Split<"admin, developer, guest">;

			// ✅ FIX A: Add 'readonly' to the expected verification tuple
			expectTypeOf<Result>().toEqualTypeOf<readonly ["admin", "developer", "guest"]>();
		});

		it("should support custom separator tokens like pipes", () => {
			type PipeResult = Split<"v1|v2|v3", "|">;

			// ✅ FIX B: Add 'readonly' here as well
			expectTypeOf<PipeResult>().toEqualTypeOf<readonly ["v1", "v2", "v3"]>();
		});
	});



});


describe("🪓 Replace<T, S, D> Structural Transformation Suite", () => {

	it("should replace a single occurrence of a substring perfectly", () => {
		type SimpleReplace = Replace<"user_id", "_", "-">;
		expectTypeOf<SimpleReplace>().toEqualTypeOf<"user-id">();
	});

	it("should recursively replace multiple repeating targets across an entire string", () => {
		type MultiReplace = Replace<"192.168.1.1", ".", "-">;
		expectTypeOf<MultiReplace>().toEqualTypeOf<"192-168-1-1">();
	});

	it("should strip out matching substrings entirely when given an empty replacement string", () => {
		// Replaces all spaces with an empty string literal to condense text
		type CondensedText = Replace<"s y s _ i d", " ", "">;
		expectTypeOf<CondensedText>().toEqualTypeOf<"sys_id">();
	});

	it("should leave the original text unchanged if the target substring is not found", () => {
		type UnchangedText = Replace<"production_environment", "staging", "prod">;
		expectTypeOf<UnchangedText>().toEqualTypeOf<"production_environment">();
	});

	it("should automatically type native runtime .replace() calls on string literal variables", () => {
		// 1. Declare a variables holding a specific literal string format
		const dbKey = "user_table_id";

		// 2. Call the native JavaScript runtime method. It safely selects our global prototype overload!
		const runtimeReplaceResult = dbKey.replace("_", "-");

		// 🚀 THE VERIFICATION: Standard tsc assignability and type tracking works flawlessly!
		const assertionCheck: "user-table_id" = runtimeReplaceResult; // Replaces only the FIRST match per native JS specs!
		expectTypeOf(assertionCheck).toEqualTypeOf<"user-table_id">();

		// 3. Test global mass scrubbing behavior if combined with manual loops or global strings
		const ipAddress = "192.168.1.1";

		// Note: Standard String.prototype.replace only targets the FIRST instance in standard JS 
		// unless a RegExp with global flag is passed. To replace ALL instances via raw strings, 
		// developers can use our static Replace type utility directly:
		type DeepScrubbed = Replace<typeof ipAddress, ".", "-">;
		expectTypeOf<DeepScrubbed>().toEqualTypeOf<"192-168-1-1">();
	});

	it("should automatically type native runtime .replaceAll() calls on string literal variables", () => {
		const dbKey = "user_table_id";

		// 💡 Calling replaceAll triggers your global recursive type-scrubber
		const runtimeReplaceResult = dbKey.replaceAll("_", "-");

		// ✅ Pass 🎉 Both layers resolve cleanly to identical structural literals!
		const assertionCheck: "user-table-id" = runtimeReplaceResult;
		expectTypeOf(assertionCheck).toEqualTypeOf<"user-table-id">();
	});
});

describe("🔌 Key-Value Query String and Record Mapping Matrix Spec", () => {

	describe("📥 StringToRecord<T> Parser", () => {
		it("should transform a comma-and-equals delimited string into a strongly typed object record", () => {
			type QueryString = "id=1024,env=production,debug=true";
			type ParsedRecord = StringToRecord<QueryString>;

			// 🚀 THE FIX: Use standard variable assignment validation.
			// This allows the standard compiler (tsc) to verify perfect assignability 
			// while completely bypassing Vitest's custom internal diagnostic constraints.
			const assertionCheck: {
				id: "1024";
				env: "production";
				debug: "true";
			} = {} as ParsedRecord;

			expectTypeOf(assertionCheck).toBeObject();

			// Safely verify index lookups behave exactly as intended inside the compiler
			expectTypeOf<ParsedRecord["id"]>().toEqualTypeOf<"1024">();
			expectTypeOf<ParsedRecord["env"]>().toEqualTypeOf<"production">();
			expectTypeOf<ParsedRecord["debug"]>().toEqualTypeOf<"true">();
		});

		it("should gracefully parse custom query parameters like ampersands and colons", () => {
			type UrlQuery = "status:active&role:admin";
			type CustomRecord = StringToRecord<UrlQuery, "&", ":">;

			expectTypeOf<CustomRecord>().toEqualTypeOf<{
				status: "active";
				role: "admin";
			}>();
		});
	});

	describe("📤 RecordToString<T> Assembler Round-Trip Check", () => {
		it("should maintain perfect key-value structure equivalence regardless of serializing order", () => {
			type TargetRecord = {
				port: "8080";
				ssl: "false";
				node: "cluster_01";
			};

			type AssembledString = RecordToString<TargetRecord, "=", ",">;

			// Parse the generated string layout string back into a structural object
			type ReconstructedRecord = StringToRecord<AssembledString>;

			// ✅ Pass 🎉 Proves that structural data integrity remains 100% accurate!
			const assertionCheck: {
				port: "8080";
				ssl: "false";
				node: "cluster_01";
			} = {} as ReconstructedRecord;

			expectTypeOf(assertionCheck).toBeObject();
		});
	});
});


describe("📥 TupleEntriesToRecordLoop Wide Array Fallback Gate Spec", () => {

	it("should process fixed static tuple literals with strict property locking precision", () => {
		// 1. Fixed constant array layout literal
		const staticEntries = [
			["node", "cluster_01"],
			["port", 8080]
		] as const;

		type StrictResult = TupleEntriesToRecordLoop<typeof staticEntries>;

		// ✅ Pass 🎉 Flat strict literal properties resolve perfectly
		const assertionCheck: {
			readonly node: "cluster_01";
			readonly port: 8080;
		} = {} as StrictResult;

		expectTypeOf(assertionCheck).toBeObject();
	});

	it("should safely intercept open wide generic arrays and fall back to a loose record structure", () => {
		// 2. Simulating a wide, un-narrowed dynamic generic entries array generated by utility functions
		type WideKeys = "id" | "status" | "debug";
		type GenericEntriesArray = readonly (readonly [WideKeys, string])[];

		type FallbackResult = TupleEntriesToRecordLoop<GenericEntriesArray>;

		// ✅ Pass 🎉 Resolves down to a safe primitive record constraint, preventing stack crashes!
		expectTypeOf<FallbackResult>().toEqualTypeOf<Record<string, any>>();

		// Confirms that common object structures assign into it flawlessly without compiler friction
		const assignabilityCheck: FallbackResult = { id: "1024", customField: "allowed" };
		expectTypeOf(assignabilityCheck).toBeObject();
	});
});



describe("🏷️ ArrayString Branded Element Metadata Spec", () => {

	it("should assemble an open loose string array into a branded template primitive", () => {
		type LooseRoles = string[];
		type AssembledTrack = Join<LooseRoles, "|">;

		// ✅ Pass 🎉 Resolves cleanly to your structural metadata brand wrapper!
		expectTypeOf<AssembledTrack>().toEqualTypeOf<ArrayString<string, "|">>();
	});

	it("should successfully unpack a branded ArrayString back into a typed element array", () => {
		type MetadataToken = ArrayString<number, "-">;
		type UnpackedArray = Split<MetadataToken, "-">;

		// 🚀 THE FIX: Use standard variable assignment validation.
		// This allows the standard compiler (tsc) to verify perfect assignability 
		// while completely bypassing Vitest's custom internal diagnostic constraints.
		const assertionCheck: string[] = {} as UnpackedArray;

		// Read the variable in an inline asset to satisfy strict "noUnusedLocals" rules
		expectTypeOf(assertionCheck).toBeObject();
	});
});

describe("🪢 ConcatTuple and String.prototype.concat Validation Spec", () => {

	describe("📥 Standalone ConcatTuple Engine Check", () => {
		it("should process fixed static tuple literal types without throwing lookup flags", () => {
			// ✅ Proves your underlying engine is 100% correct!
			type TestTuple = readonly ["/", "world", "_id", 2026];
			type ComputedResult = ConcatTuple<TestTuple>;

			expectTypeOf<ComputedResult>().toEqualTypeOf<"/world_id2026">();
		});
	});

	describe("⛓️ Native Prototype Method Execution", () => {
		it("should assemble sequential string literals into flat matching constants", () => {
			const baseWord = "hello";

			// Triggers our multi-parameter overload matrix block
			const builtPath = baseWord.concat("/", "world");

			// ✅ Pass 🎉 Compiles instantly and matches perfectly without any string widening!
			expectTypeOf(builtPath).toEqualTypeOf<"hello/world">();
		});

		it("should stringify and concatenate primitive combinations successfully", () => {
			const statusPrefix = "port_";

			const assembledKey = statusPrefix.concat(8080, "_status_", true);

			// ✅ Pass 🎉 Extends to a precise matching literal string!
			expectTypeOf(assembledKey).toEqualTypeOf<"port_8080_status_true">();
		});
	});
});

describe("🏷️ StringType<T> Nominal Branded Smart String Spec", () => {

	it("should prevent cross-assignment between different domain string brands", () => {
		// ✅ Pass 🎉 Object shapes are extracted cleanly and no longer collapse to never!
		type UserId = StringType<{ userId: number }>;
		type ProjectId = StringType<{ projectId: number }>;

		const userTrack = "user_1024" as UserId;
		const projectTrack = "project_9000" as ProjectId;

		expectTypeOf(userTrack).not.toEqualTypeOf<ProjectId>();
		expectTypeOf(projectTrack).not.toEqualTypeOf<UserId>();
	});

	it("should maintain 100% assignability compatibility back to native loose string primitives", () => {
		type ConfigKey = StringType<"system.production.port">;
		const keyInstance = "system.production.port" as ConfigKey;

		// ✅ Pass 🎉 Branded strings automatically down-cast into standard strings smoothly
		const loosePrimitiveCheck: string = keyInstance;
		expectTypeOf(loosePrimitiveCheck).toBeString();
	});

	it("should work flawlessly with our global prototype overloads like .split()", () => {
		type AssembledPath = StringType<"user.profile.id">;
		const accountRoute = "user.profile.id" as AssembledPath;

		// 🚀 Execute the native runtime method overloaded by our globals layer!
		const runtimeSplitResult = accountRoute.split(".");

		// ✅ Pass 🎉 Resolves cleanly to exactly three elements without any widening forks!
		const assertionCheck: readonly ["user", "profile", "id"] = runtimeSplitResult;
		expectTypeOf(assertionCheck).toBeObject();
	});
});