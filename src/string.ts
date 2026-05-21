import { Trim } from "./string-utils.js";

// Map and distribute Trim over array items explicitly
export type ToStringUnion<T, S extends string = ","> =
	T extends readonly string[]
	? { [K in keyof T]: T[K] extends string ? Trim<T[K]> : never }[number]
	: T extends `${infer First}${S}${infer Rest}`
	? Trim<First> | ToStringUnion<Rest, S>
	: T extends string
	? Trim<T>
	: never; // fallback to never for invalid structures instead of broad string

export type ArrayValues<T, S extends string = ","> =
	T extends readonly any[]
	? T[number] extends string ? Trim<T[number]> : T[number]
	: ToStringUnion<T, S>;

// Accept an input parameter U, and enforce that its values extend allowed fields T
export type LikeArray<U, T extends string, S extends string = ","> =
	ArrayValues<U, S> extends T ? U : never;

/** 
 * 🪓 Replaces all occurrences of S in T with D at the type level.
 * Utilizes a recursive structural accumulator to optimize compiler lookup passes.
 */
export type Replace<
	T extends string,
	S extends string,
	D extends string,
	A extends string = ""
> = T extends `${infer L}${S}${infer R}`
	? Replace<R, S, D, `${A}${L}${D}`>
	: `${A}${T}`;

export type ReplaceFirst<T extends string, S extends string, D extends string> =
	T extends `${infer L}${S}${infer R}` ? `${L}${D}${R}` : T;