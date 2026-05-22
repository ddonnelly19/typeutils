type StringifiablePrimitive = string | number | boolean | bigint;

type IsExactly<A, B> = [A] extends [B] ? ([B] extends [A] ? true : false) : false;

/** Core logic evaluating an absolute, isolated single type tier */
type StringifyCore<T> = T extends undefined
	? undefined
	: T extends null
	? undefined
	: IsExactly<T, string> extends true
	? string
	: IsExactly<T, number> extends true
	? `${number}`
	: any[] extends T
	? never
	: T extends StringifiablePrimitive
	? `${T}`
	: T extends { [Symbol.toPrimitive](hint: "string" | "default"): infer R extends StringifiablePrimitive; }
	? `${R}`
	: T extends readonly any[]
	? never
	: T extends Record<string, any>
	? T extends { toString(): infer R extends string }
	? string extends R ? never : R
	: never
	: T extends { toString(): infer R extends string }
	? string extends R ? never : R
	: never;

/** 💡 Isolated Union Distributor: Safe from breaking object schema hierarchies */
type DistributeUnion<T> = T extends any ? StringifyCore<T> : never;

/**
 * 🪞 Converts `T` to its template-literal string representation.
 * Targets primitive unions safely without distributing top-level object shapes.
 */
export type Stringify<T> = IsExactly<T, string> extends true ? string
	: IsExactly<T, number> extends true ? `${number}`
	: IsExactly<T, boolean> extends true ? `${boolean}`
	: [T] extends [StringifiablePrimitive | null | undefined]
	? DistributeUnion<T> // Safely distribute primitive-only value states
	: StringifyCore<T>;  // Preserve intact schemas and objects

/**
 * Recursive Deep Stringifier Type Engine
 */
export type DeepStringify<T> = T extends undefined
	? undefined
	: T extends null
	? undefined
	: T extends readonly any[]
	? { [K in keyof T]: DeepStringify<T[K]> }
	: T extends Record<string, any>
	? Stringify<T> extends never
	? { [K in keyof T]: DeepStringify<T[K]> }
	: Stringify<T>
	: Stringify<T>;