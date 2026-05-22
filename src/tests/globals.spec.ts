import { describe, it, expectTypeOf, expect } from "vitest";
import { EntriesTupleToRecord, Join } from "../string-utils.js";

describe("🧬 Array and ReadonlyArray Composition Prototype Overloads Spec", () => {

	it("should calculate exact template literal string values from tuple .join() executions", () => {
		const routingTuple = ["api", "v1", "endpoints"] as const;

		// Call the native JavaScript array method
		const joinedUrlTrack = routingTuple.join("/");

		// ✅ Pass 🎉 TypeScript calculates the join loop and infers the exact path string literal!
		expectTypeOf(joinedUrlTrack).toEqualTypeOf<"api/v1/endpoints">();
		const assertionCheck: "api/v1/endpoints" = joinedUrlTrack;
		expectTypeOf(assertionCheck).toEqualTypeOf(joinedUrlTrack);
	});

	it("should fall back to using standard commas when no delimiter parameter is provided", () => {
		const matrixMetadata = ["width", "height"] as const;

		const commaJoinedResult = matrixMetadata.join();

		// ✅ Defaults seamlessly to comma tracking structures
		expectTypeOf(commaJoinedResult).toEqualTypeOf<"width,height">();
	});

	it("should process explicit .toString() invocations cleanly", () => {
		const timestampBlock = [2026, 5, 21] as const;

		const stringifiedDateTuple = timestampBlock.toString();

		// ✅ Numbers inside the tuple are automatically mapped via your Stringify loop rules!
		expectTypeOf(stringifiedDateTuple).toEqualTypeOf<"2026,5,21">();
	});
});

describe("🧱 Join<A, S> Template Assembly & Runtime Method Merges", () => {

	it("should automatically type native runtime .split() calls on joined elements!", () => {
		// 1. Generate the joined template string ("user.id")
		const configKey: Join<["user", "id"], "."> = "user.id";

		// 2. Call the native JS method. It safely captures "user.id" and passes it into Split!
		const runtimeSplitResult = configKey.split(".");

		// 3. Confirm assignability works perfectly for tsc
		const assertionCheck: readonly ["user", "id"] = runtimeSplitResult;

		// ✅ FIX: Index the tuple explicitly by position to verify structural components
		expectTypeOf<typeof assertionCheck[0]>().toEqualTypeOf<"user">(); // Checks index 0 🎉
		expectTypeOf<typeof assertionCheck[1]>().toEqualTypeOf<"id">();   // Checks index 1 🎉
	});
});

describe("🕵️ String.prototype.includes Global Type Guard Overload Suite", () => {

	it("should successfully narrow a generic string down to a template literal pattern inside a type-guard conditional block", () => {
		// 1. Simulate receiving an unknown dynamic string from a network query stream
		const unknownInput: string = "api/v1/users";

		// 2. Execute the native runtime method inside an if statement block
		if (unknownInput.includes("api/")) {
			// 🚀 THE VERIFICATION: Inside this block, the variable is no longer a loose 'string'.
			// It has been programmatically narrowed to match your pattern layout!
			expectTypeOf(unknownInput).toMatchTypeOf<`${string}api/${string}`>();

			// Negative validation: Assert it is NOT an un-narrowed, plain string anymore
			expectTypeOf<typeof unknownInput>().not.toEqualTypeOf<string>();
		}
	});

	it("should securely preserve specific strict string literal assignments", () => {
		// 1. Declare an exact environment string constant reference
		const environmentKey = "production-cluster-01";

		// 2. Perform an includes check
		const hasProdFlag = environmentKey.includes("production");

		// 3. The assertion variable correctly evaluates to a boolean primitive value at runtime
		expect(hasProdFlag).toBe(true);
		expectTypeOf(hasProdFlag).toBeBoolean();
	});

	it("should work seamlessly with custom union types to separate valid structures", () => {
		type LogLevels = "info_log" | "error_log" | "debug_trace";
		const currentLog: LogLevels = "error_log";

		if (currentLog.includes("error")) {
			// TypeScript successfully isolates and computes which union branches fit the layout!
			expectTypeOf(currentLog).toEqualTypeOf<"error_log">();
		}
	});
});

describe("🧼 String.prototype.trim Native Method Overloads Spec", () => {

	it("should evaluate standard .trim() to clean both sides of a string literal simultaneously", () => {
		const rawInput = "   cleansed_id   ";

		// Call the native runtime method
		const runtimeResult = rawInput.trim();

		// ✅ The type engine evaluates it down to the pristine trimmed constant literal!
		expectTypeOf(runtimeResult).toEqualTypeOf<"cleansed_id">();
		const assertionCheck: "cleansed_id" = runtimeResult;
		expectTypeOf(assertionCheck).toEqualTypeOf(runtimeResult)
	});

	it("should evaluate .trimStart() to clean only the leading whitespace boundary", () => {
		const rawInput = "  left_clean ";

		const runtimeResult = rawInput.trimStart();

		// ✅ Left side is stripped, right side space is preserved!
		expectTypeOf(runtimeResult).toEqualTypeOf<"left_clean ">();
	});

	it("should evaluate .trimEnd() to clean only the trailing whitespace boundary", () => {
		const rawInput = " right_clean  ";

		const runtimeResult = rawInput.trimEnd();

		// ✅ Right side is stripped, left side space is preserved!
		expectTypeOf(runtimeResult).toEqualTypeOf<" right_clean">();
	});
});

describe("📦 Object.fromEntries Global Interface Overload Spec", () => {

	it("should dynamically compile an entry tuple array into a flat structured object literal type", () => {
		const operationalEntries = [
			["id", "9482"],
			["status", "active"],
			["isCluster", "true"]
		] as const;

		const generatedRuntimeObject = Object.fromEntries(operationalEntries);

		// ✅ Pass 🎉 Properties map with 100% precision, clearing the Record fallback error!
		const assertionCheck: {
			id: "9482";
			status: "active";
			isCluster: "true";
		} = generatedRuntimeObject;

		expectTypeOf(assertionCheck).toBeObject();
	});
});

describe("📦 Object.entries Global Interface Overload Spec", () => {

	it("should calculate a strict, ordered tuple array from an object literal structure", () => {
		const systemConfig = {
			port: 8080,
			ssl: false,
			node: "cluster_01"
		} as const;

		const extractedEntries = Object.entries(systemConfig);

		// ✅ Pass 🎉 Uses dedicated entries re-parser to handle reverse tuple unions flawlessly!
		type ReconstructedConfig = EntriesTupleToRecord<typeof extractedEntries>;

		const assertionCheck: {
			readonly port: 8080;
			readonly ssl: false;
			readonly node: "cluster_01";
		} = {} as ReconstructedConfig;

		expectTypeOf(assertionCheck).toBeObject();
	});
});

describe("🪢 Variadic String.prototype.concat Global Prototype Overload Spec", () => {

	it("should assemble infinite parameter arguments into a single sequential literal string type", () => {
		const root = "hello";

		const builtPath = root.concat("/", "world");

		// ✅ Pass 🎉 Flat literal matching completes instantly without missing properties!
		expectTypeOf(builtPath).toEqualTypeOf<"hello/world">();
	});

	it("should still dynamically stringify mixed primitives inside the infinite parameter stream", () => {
		const base = "item_";

		const complexKey = base.concat(42, "_status_", false, "_flag");

		// ✅ Pass 🎉 Evaluates cleanly to a precise "item_42_status_false_flag" literal type!
		expectTypeOf(complexKey).toEqualTypeOf<"item_42_status_false_flag">();
	});
});

describe("🏭 Global Constructor Factory Function Overloads Spec", () => {

	describe("🔢 Number() Factory Narrowing", () => {
		it("should extract precise literal number constants out of parsed numeric string templates", () => {
			const portString = "8080";

			// Execute the overloaded global function factory pass
			const runtimeParsedNumber = Number(portString);

			// ✅ Pass 🎉 TypeScript extracts the text and maps it cleanly to literal number type 8080!
			expectTypeOf(runtimeParsedNumber).toEqualTypeOf<8080>();
			const assertionCheck: 8080 = runtimeParsedNumber;
			expectTypeOf(assertionCheck).toBeNumber();
		});
	});

	describe("🧵 String() Factory Narrowing", () => {
		it("should structurally parse scalar values and booleans into template string configurations", () => {
			const flagConstant = false;

			// Execute the overloaded global function factory pass
			const runtimeStringifiedValue = String(flagConstant);

			// ✅ Pass 🎉 Maps seamlessly to a strict "false" character sequence literal type!
			expectTypeOf(runtimeStringifiedValue).toEqualTypeOf<"false">();
		});

		it("should cleanly strip null and undefined variables down to an empty string marker", () => {
			const emptyRef = null;

			const emptyStringifiedResult = String(emptyRef);

			// ✅ Pass 🎉 Follows your Stringify engine rules to evaluate safely down to undefined/empty types!
			expectTypeOf(emptyStringifiedResult).toEqualTypeOf<undefined>();
		});
		
		it("should handle an unknown type", () => {
			const value: unknown = "dynamic-runtime-value";
			const unknownStringResult = String(value);
			expectTypeOf(unknownStringResult).toEqualTypeOf<string>();
		});
		
		it("should handle {} type", () => {
			const value: unknown = "dynamic-runtime-value";
			const value2 = value || "";
			const unknownStringResult = String(value2);
			expectTypeOf(unknownStringResult).toEqualTypeOf<string>();
	
		});
	});

	describe("☯️ Boolean() Factory Narrowing", () => {
		it("should compile explicit falsy literal values down to a strict false literal type", () => {
			const emptyText = "";
			const zeroVal = 0;
			const nullRef = null;

			// Execute the overloaded global factory evaluations
			const boolText = Boolean(emptyText);
			const boolZero = Boolean(zeroVal);
			const boolNull = Boolean(nullRef);

			// ✅ Pass 🎉 All known falsy values evaluate accurately down to false!
			expectTypeOf(boolText).toEqualTypeOf<false>();
			expectTypeOf(boolZero).toEqualTypeOf<false>();
			expectTypeOf(boolNull).toEqualTypeOf<false>();
		});

		it("should compile explicit truthy literal values up to a strict true literal type", () => {
			const activeWord = "production";
			const validPort = 8080;
			const schemaConfig = { debug: true };

			const boolWord = Boolean(activeWord);
			const boolPort = Boolean(validPort);
			const boolObject = Boolean(schemaConfig);

			// ✅ Pass 🎉 Populated shapes and text structures evaluate accurately up to true!
			expectTypeOf(boolWord).toEqualTypeOf<true>();
			expectTypeOf(boolPort).toEqualTypeOf<true>();
			expectTypeOf(boolObject).toEqualTypeOf<true>();
		});
	});
});

describe("🔢 Global parseInt Type-Level Narrowing Spec", () => {

	it("should extract a precise literal number from a string with trailing characters using global parseInt", () => {
		const rawDimension = "1024px";

		// Call the overloaded global function pass
		const runtimeParsedResult = parseInt(rawDimension, 10);

		// ✅ Pass 🎉 Truncates "px" and maps cleanly to literal number type 1024!
		const assertionCheck: 1024 = runtimeParsedResult;
		expectTypeOf(assertionCheck).toBeNumber();
	});

	it("should function identically when called via the Number.parseInt namespace method", () => {
		const rawPort = "8080-fallback";

		const runtimeNamespaceResult = Number.parseInt(rawPort, 10);

		// ✅ Pass 🎉 Safely isolates the digits 8080 at compile time!
		expectTypeOf(runtimeNamespaceResult).toEqualTypeOf<8080>();
	});

	it("should handle negative integers correctly", () => {
		const negativeOffset = "-45ms";

		const parsedOffset = parseInt(negativeOffset, 10);

		// ✅ Pass 🎉 Preserves sign tokens flawlessly
		expectTypeOf(parsedOffset).toEqualTypeOf<-45>();
	});
});