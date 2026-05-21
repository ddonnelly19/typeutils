

/**
 * Safe Contextual Key Extractor
 * 💡 Safely maps numeric array strings ("0", "1") back into native index markers for tuple configurations
 */
type GetContextKey<Context, K> = Context extends readonly any[]
	? K extends `${infer N extends number}`
	? N extends keyof Context
	? Context[N]
	: unknown
	: K extends keyof Context
	? Context[K]
	: unknown
	: Context extends Record<string, any>
	? K extends keyof Context
	? Context[K]
	: unknown
	: unknown;

/**
 * Core Type-Level Reversal Parser
 */
type UnstringifyPrimitive<S extends string, OriginalContext = unknown> =
	S extends "true" ? true :
	S extends "false" ? false :
	S extends "null" ? null :
	S extends "undefined" ? undefined :
	[OriginalContext] extends [bigint]
	? S extends `${infer B extends bigint}` ? B : never
	: S extends `${infer N extends number}` ? N : S;

/**
 * Recursive Object Structure Un-Stringifier
 */
export type DeepUnstringify<T, OriginalContext = unknown> = T extends undefined
	? undefined
	: T extends null
	? null
	: T extends readonly any[]
	? { [K in keyof T]: DeepUnstringify<T[K], GetContextKey<OriginalContext, K>> }
	: T extends Record<string, any>
	? { [K in keyof T]: DeepUnstringify<T[K], GetContextKey<OriginalContext, K>> }
	: T extends string
	? UnstringifyPrimitive<T, OriginalContext>
	: T;