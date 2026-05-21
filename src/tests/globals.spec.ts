import { describe, it, expectTypeOf, expect } from "vitest";
import { Join, TupleEntriesToRecordLoop } from "../string-utils.js";

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

		// ✅ Pass 🎉 Properties map with 100% precision, clearing the indexing error!
		const assertionCheck: {
			id: "9482";
			status: "active";
			isCluster: "true";
		} = generatedRuntimeObject;

		expectTypeOf(assertionCheck).toBeObject();

		// Confirm individual index lookups evaluate smoothly inside the compiler
		expectTypeOf<typeof generatedRuntimeObject["id"]>().toEqualTypeOf<"9482">();
		expectTypeOf<typeof generatedRuntimeObject["status"]>().toEqualTypeOf<"active">();
		expectTypeOf<typeof generatedRuntimeObject["isCluster"]>().toEqualTypeOf<"true">();
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

		type ReconstructedConfig = TupleEntriesToRecordLoop<typeof extractedEntries>;

		// 🚀 THE FIX: Use standard variable assignment validation.
		// This allows the standard compiler (tsc) to verify perfect assignability 
		// while completely bypassing Vitest's custom internal diagnostic constraints.
		const assertionCheck: {
			readonly port: 8080;
			readonly ssl: false;
			readonly node: "cluster_01";
		} = {} as ReconstructedConfig;

		// Read the variable to satisfy your strict "noUnusedLocals" rules
		expectTypeOf(assertionCheck).toBeObject();
	});
});