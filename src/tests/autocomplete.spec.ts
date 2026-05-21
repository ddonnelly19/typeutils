import { describe, it, expectTypeOf } from "vitest";
import { createInputFieldHelper, createPrefixedFieldHelper } from "../autocomplete.js";


describe("⌨️ IDE Autocomplete Identity Engine Asserts", () => {
	type DemoFields = "id" | "title" | "status";
	const selectFields = createInputFieldHelper<DemoFields>();

	it("should match valid literal structures and array configurations perfectly", () => {
		const checkString = selectFields("title");
		expectTypeOf(checkString).toEqualTypeOf<"title">();

		const checkArray = selectFields(["id", "status"] as const);
		expectTypeOf(checkArray).toEqualTypeOf<readonly ["id", "status"]>();

		const checkCommaString = selectFields("id, title, status");
		expectTypeOf(checkCommaString).toEqualTypeOf<"id, title, status">();
	});

	it("should programmatically block typos and unmapped properties from compiling", () => {
		// Assert that passing an invalid property fails to match the parameters of the identity function
		expectTypeOf<Parameters<typeof selectFields>>().not.toMatchTypeOf<"invalid_field">();

		// Assert that a comma-delimited string containing a typo is rejected
		expectTypeOf<Parameters<typeof selectFields>>().not.toMatchTypeOf<"id, titllle">();

		// Assert that arrays containing unmapped parameters break the type checking gate
		expectTypeOf<Parameters<typeof selectFields>>().not.toMatchTypeOf<["status", "malicious_payload"]>();
	});
});

describe("🛡️ Prefix-Enforced Autocomplete Type Engine Asserts", () => {
	type NodeFields = "id" | "status" | "ip";
	const selectNodeFields = createPrefixedFieldHelper<NodeFields, "node.">();

	it("should compile perfectly when fields match the pattern and have correct prefixes", () => {
		const validStr = selectNodeFields("node.ip");
		expectTypeOf(validStr).toEqualTypeOf<"node.ip">();

		const validCommaStr = selectNodeFields("node.id, node.status");
		expectTypeOf(validCommaStr).toEqualTypeOf<"node.id, node.status">();

		const validArray = selectNodeFields(["node.id", "node.ip"] as const);
		expectTypeOf(validArray).toEqualTypeOf<readonly ["node.id", "node.ip"]>();
	});

	it("should programmatically block valid fields that lack the mandatory prefix", () => {
		// Fails because the required prefix "node." is missing entirely
		expectTypeOf<Parameters<typeof selectNodeFields>>().not.toMatchTypeOf<"ip">();
		expectTypeOf<Parameters<typeof selectNodeFields>>().not.toMatchTypeOf<["id", "status"]>();
	});

	it("should reject mixed lists where any entry misses the prefix", () => {
		// Fails because the second element in the comma list is missing "node."
		expectTypeOf<Parameters<typeof selectNodeFields>>().not.toMatchTypeOf<"node.id, status">();
	});
});
