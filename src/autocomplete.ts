import { ArrayValues } from "./string.js";

/**
 * Advanced Dynamic Autocomplete Suggester Engine
 * Loops through standard lists and computes subsequent selection combinations
 */
type SuggestFields<U extends string, AllowedFields extends string> =
	U extends `${infer Before},${infer Rest}`
	? `${Before},${SuggestFields<Rest, AllowedFields>}`
	: U extends `${infer Before} ` // Safely handle trailing space inputs
	? `${Before} ${AllowedFields}`
	: AllowedFields;

/**
 * Strict structural parameter block helper
 */
export function createInputFieldHelper<AllowedFields extends string>() {
	return <
		// U represents the literal string sequence typed by the engineer
		U extends string | readonly string[],
		// Enforce value constraints using our previous ArrayValues validator setup
		V extends ArrayValues<U>
	>(
		input: U & (V extends AllowedFields ? U : never),
		// Secondary dynamic validation fallback layer providing inline suggestions
		_options?: U extends string ? SuggestFields<U, AllowedFields> : never
	): U => input;
}

/**
 * Advanced Dynamic Autocomplete Suggester Engine with Prefix Support
 */
type SuggestFieldsWithPrefix<U extends string, PrefixedFields extends string> =
	U extends `${infer Before},${infer Rest}`
	? `${Before},${SuggestFieldsWithPrefix<Rest, PrefixedFields>}`
	: U extends `${infer Before} `
	? `${Before} ${PrefixedFields}`
	: PrefixedFields;

/**
 * Prefix Enforcement Structural Factory Block
 */
export function createPrefixedFieldHelper<
	AllowedFields extends string,
	Prefix extends string
>() {
	// 1. Generate the strictly prefixed field type union at compile-time
	type PrefixedFields = `${Prefix}${AllowedFields}`;

	return <
		U extends string | readonly string[],
		V extends ArrayValues<U>
	>(
		input: U & (V extends PrefixedFields ? U : never),
		_options?: U extends string ? SuggestFieldsWithPrefix<U, PrefixedFields> : never
	): U => input;
}


/** examples
 *  
// Define your database schema layout target fields
type UserFields = "sys_id" | "name" | "created_at" | "email" | "is_active";

// Initialize the autocomplete helper bound to your schema keys
export const selectUserFields = createInputFieldHelper<UserFields>();

// --- UI / Developer Experience (DX) Testing ---

// ✅ 1. Single Literal Input Autocomplete
// Typing selectUserFields("") will pop up: "sys_id" | "name" | "created_at" | "email" | "is_active"
const field1 = selectUserFields("email"); 

// ✅ 2. Readonly Array Tuple Input Autocomplete
// Every index spot inside the array automatically triggers autocomplete options
const field2 = selectUserFields(["sys_id", "name"] as const);

// ✅ 3. Comma-Separated Combination Autocomplete
// Typing selectUserFields("sys_id, ") will automatically append autocomplete options for the NEXT item!
const field3 = selectUserFields("sys_id, name, is_active");
 */