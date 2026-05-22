import { Stringify } from "./stringify.js";

export type TrimLeft<S extends string> = S extends ` ${infer R}` ? TrimLeft<R> : S;
export type TrimRight<S extends string> = S extends `${infer R} ` ? TrimRight<R> : S;
export type Trim<S extends string> = TrimLeft<TrimRight<S>>;

type CleanString<T> = T extends `${infer S}` ? S : never;

type ComputeTuple<T extends readonly any[]> =
	{ [K in keyof T]: T[K] } extends infer R extends readonly any[] ? R : T;

/** 🪢 Splits a string-like value into an array/tuple using separator S. */
export type Split<A, S extends string = ","> =
	A extends null | undefined | never ? readonly [] :
	A extends `${infer A1}${S}${infer A2}` ? ComputeTuple<readonly [Stringify<Trim<A1>>, ...Split<A2, S>]> :
	A extends `${infer A1}` ? readonly [Stringify<Trim<A1>>] :
	// 💡 Match array mutability exactly! Changed from 'readonly Stringify<T>[]' to 'Stringify<T>[]'
	A extends ArrayString<infer T, S> ? Stringify<T>[] :
	ReadonlyArray<Stringify<A>>;


// ... Keep your existing Trim, Split, Join, and SplitOnce types exactly as they are ...

type SplitOnce<A extends string, S extends string = "="> = A extends `${infer A1}${S}${infer A2}`
	? readonly [Trim<A1>, Trim<A2>]
	: readonly [Stringify<Trim<A>>, null];

export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

export type Compute<T> = T extends Function
	? T
	: T extends Record<string, any>
	? { [K in keyof T]: Compute<T[K]> }
	: T;

/** 
* 🪢 Converts a two-item tuple into a single-property record.
*/
export type ArrayToRecord<T extends readonly [string, any]> = {
	[K in T[0] & string]: T[1]
};

/** 
 * 💡 Safe Object Converter
 * Turns an isolated two-item tuple into a single-property record with correct value tracking
 */
type SingleTupleToRecord<T extends readonly [string, any]> = {
	[K in T[0]]: T[1]
};

/** 
 * 📥 Recursive Tuple-to-Record Loop
 * Walks your strict split tuple position-by-position to preserve explicit value bindings
 */
export type TupleToRecordLoop<T extends readonly any[], S2 extends string> =
	T extends readonly [infer First extends string, ...infer Rest]
	? SingleTupleToRecord<SplitOnce<First, S2>> & TupleToRecordLoop<Rest, S2>
	: unknown;

/** 📥 Converts a delimited key-value string into a record type. */
export type StringToRecord<T extends string, S1 extends string = ",", S2 extends string = "="> =
	Compute<
		UnionToIntersection<
			TupleToRecordLoop<Split<T, S1>, S2>
		>
	>;

export type RecordToEntriesTuple<TRecord, KeysTuple extends readonly any[]> =
	KeysTuple extends readonly [infer Head extends string & keyof TRecord, ...infer Tail]
	? readonly [readonly [Head, TRecord[Head]], ...RecordToEntriesTuple<TRecord, Tail>]
	: readonly [];

/**
 * 🏷️ A branded template literal string type that carries design-time metadata 
 * about an underlying array element type and its specific formatting separator.
 */
export type ArrayString<T, S extends string = ","> = string & {
	readonly __array_element_brand: Stringify<T>;
	readonly __array_separator_brand: S;
};

/** 💡 Helper: Identifies if an array is an un-narrowed open generic array list instead of a strict constant tuple */
/*type IsWideArray<T extends readonly any[]> =
	number extends T["length"] ? true : false;*/

/** 💡 Helper: Identifies if an array is a strict constant tuple configuration */
//type IsStrictTuple<T> = T extends readonly [any, ...any[]] ? true : false;

/** 
 * 📥 1. Query-String Engine: Maps flat string delimiter arrays safely 
 * 💡 Fix: Destructures the entry array elements to completely prevent key corruption!
 */
export type TupleEntriesToRecordLoop<T extends readonly [string, any][] | readonly any[]> =
	readonly any[] extends T
	? Record<string, any>
	: {
		[K in T[number]as K extends readonly [infer Key extends string, any] ? Key : K extends [infer Key2 extends string, any] ? Key2 : never]:
		K extends readonly [any, infer Val] ? Val : K extends [any, infer Val2] ? Val2 : never
	};

type AllowedScalar = string | number | boolean | object | bigint | null | undefined;

/** 
 * 📥 FromEntries Engine: Maps flat input key-value tuple arrays safely.
 * 💡 Upgrade: Replacing 'readonly any[]' with an explicit allowed-scalar union matrix
 * prevents internal element boundaries from losing context during advanced cascading maps!
 */
export type FromEntriesTupleToRecord<T extends readonly [string, AllowedScalar]> =
	[T] extends [never]
	? Record<string, any>
	: {
		[K in T as K extends readonly [infer Key extends string, any] ? Key : never]:
		K extends readonly [any, infer Val] ? Val : never;
	};

/** 📥 3. Entries Engine: Safely handles reverse mutable tuple pairs from Object.entries */
export type EntriesTupleToRecord<T extends readonly any[]> =
	readonly any[] extends T
	? Record<string, any>
	: {
		[K in T[number]as K extends [infer Key extends string, any] ? Key : K extends readonly [infer Key2 extends string, any] ? Key2 : never]:
		K extends [any, infer Val] ? Val : K extends readonly [any, infer Val2] ? Val2 : never;
	};


/** 
 * Helper loop to assemble pure template literal text strings 
 * 💡 Fix: Safely subtracts tuple elements by piping 'A2' into the recursive step!
 */
type JoinTextCore<A, S extends string> =
	A extends [infer A1] | readonly [infer A1]
	? Stringify<A1>
	: A extends [infer A1, ...infer A2] | readonly [infer A1, ...infer A2]
	? `${Stringify<A1>}${S}${JoinTextCore<A2, S>}`
	: A extends readonly any[]
	? string
	: "";

/** 🪢 Joins tuple/array elements into a separator-delimited string type. */
export type Join<A, S extends string = ","> =
	A extends [infer A1] | readonly [infer A1]
	? CleanString<Stringify<A1>>
	: A extends [any, ...any[]] | readonly [any, ...any[]]
	? CleanString<JoinTextCore<A, S>>
	: A extends readonly any[]
	? ArrayString<A[number], S> // 💡 Generates the clean branded metadata token for loose open arrays!
	: "";

type StringifyProperty<T> = T extends undefined
	? "undefined"
	: T extends null
	? "null"
	: T extends string | number | boolean | bigint
	? `${T}`
	: Stringify<T>;

/** Helper: Intersects functions to safely convert an object's keys into an ordered tuple array stream */
export type KeysToTuple<T, Acc extends readonly any[] = readonly []> =
	UnionToIntersection<
		T extends any ? (key: T) => void : never
	> extends (key: infer Last) => void
	? KeysToTuple<Exclude<T, Last>, readonly [Last, ...Acc]>
	: Acc;

/** Helper: Sequentially maps over an extracted tuple of keys to build explicit delimited string rows */
type MapPropertiesToTuple<TRecord, KeysTuple extends readonly any[], D extends string> =
	KeysTuple extends readonly [infer Head extends string & keyof TRecord, ...infer Tail]
	? readonly [`${Head}${D}${StringifyProperty<TRecord[Head]>}`, ...MapPropertiesToTuple<TRecord, Tail, D>]
	: readonly [];

/** 📤 Converts a record type into a delimited key-value string type. */
export type RecordToString<TRecord, D extends string = "=", S extends string = ","> =
	Join<
		MapPropertiesToTuple<
			TRecord,
			KeysToTuple<keyof TRecord & string>,
			D
		>,
		S
	>;

/** 
 * 🪢 Recursive Concat Tuple Loop
 * 💡 Fix: Explicitly walks your rest tuple parameters step-by-step to compute 
 * a flat string literal without triggering any wide open array fallback guards!
 */
export type ConcatTuple<A extends readonly any[]> =
	A extends readonly [infer Head, ...infer Tail]
	? `${Stringify<Head>}${ConcatTuple<Tail>}`
	: "";

type NarrowablePayload = string | number | boolean | bigint | object | null | undefined;

type ObjectToStringLiteral<T> = T extends string
	? string extends T
	? string
	: T
	: T extends number | boolean | bigint | null | undefined
	? Stringify<T>
	: string;

/**
 * 🏷️ Smart Branded String Primitive Wrapper.
 * 💡 Fix: Consolidates signature layout to a unified intersection (V & I) 
 * to prevent method-splitting union cascades across global overloads!
 */
export type StringType<
	T extends NarrowablePayload,
	V extends string = Extract<ObjectToStringLiteral<T>, string>,
	I = IStringType<T, V>
> = V & I; // Unified single branch intersection 🎯

/** 🔌 Internal metadata brand interface supporting native JavaScript stringification hooks */
export interface IStringType<T, V extends string = Extract<ObjectToStringLiteral<T>, string>> extends String {
	readonly _type: T;
	[Symbol.toPrimitive](hint: "string" | "number" | "default"): V;
	toString(): V;
}


/**
 * 🕵️ Type-level truthiness engine mirroring JavaScript's native runtime evaluation rules.
 * Collapses known falsy literals to false, while computing all other valid structures as true.
 */
export type IsTruthy<T> = T extends false | 0 | -0 | 0n | "" | null | undefined
	? false
	: true;

/** Helper: Scans left-to-right and discards everything as soon as a non-digit character hits */
type ConsumeDigits<S extends string, Acc extends string = ""> =
	S extends `${infer Head}${infer Tail}`
	? Head extends "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"
	? ConsumeDigits<Tail, `${Acc}${Head}`>
	: Acc // 💡 Fix: Stop scanning immediately and return what we have so far!
	: Acc;

/** Helper: Isolates optional leading signs before handing the block to the digit consumer */
type ParseIntCore<S extends string> =
	S extends `+${infer Rest}`
	? ConsumeDigits<Rest>
	: S extends `-${infer Rest}`
	? `-${ConsumeDigits<Rest>}`
	: ConsumeDigits<S>;

/** 
 * 🔢 Type-level parseInt engine.
 * Strips trailing units (like "px" or "-fallback") and converts the isolated string into a literal number type.
 */
export type ParseInt<S extends string> =
	ParseIntCore<S> extends ""
	? never
	: ParseIntCore<S> extends "-"
	? never
	: ParseIntCore<S> extends `${infer N extends number}` ? N : never;
	
/** 
 * 🔂 Lookahead-free split resolver gateway.
 * Extracts underlying string primitives from branded nominal instances without tracing global prototypes.
 */
export type ResolveSplit<T, S extends string> = 
  T extends IStringType<any, infer V extends string>
    ? Split<V, S>
    : T extends string
      ? Split<T, S>
      : readonly string[];