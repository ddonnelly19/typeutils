import { Stringify } from "./stringify.js";


export type TrimLeft<S extends string> = S extends ` ${infer R}` ? TrimLeft<R> : S;
export type TrimRight<S extends string> = S extends `${infer R} ` ? TrimRight<R> : S;
export type Trim<S extends string> = TrimLeft<TrimRight<S>>;

type CleanString<T> = T extends `${infer S}` ? S : never;

type ComputeTuple<T extends readonly any[]> =
	{ [K in keyof T]: T[K] } extends infer R extends readonly any[] ? R : T;

/** Splits a string-like value into an immutable readonly tuple using separator S. */
export type Split<A, S extends string = ","> =
	A extends null | undefined | never ? readonly [] :
	A extends `${infer A1}${S}${infer A2}` ? ComputeTuple<readonly [Stringify<Trim<A1>>, ...Split<A2, S>]> :
	A extends `${infer A1}` ? readonly [Stringify<Trim<A1>>] :
	A extends readonly any[] ? readonly Stringify<A[number]>[] :
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

/** 
 * 📥 Recursive Entry-Tuple to Record Loop
 * 💡 Fix: Uses a direct indexed map to build a flat object literal instantly,
 * completely avoiding complex intersection trees and empty object literal bugs!
 */
export type TupleEntriesToRecordLoop<T extends readonly [string, any][] | readonly any[]> = 
  { [K in T[number] as K[0]]: K[1] };

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
	? string
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
