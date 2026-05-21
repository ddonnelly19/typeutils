import { Join, KeysToTuple, Split, Trim, TrimLeft, TrimRight, TupleEntriesToRecordLoop } from './string-utils.js';
import { ReplaceFirst, Replace } from './string.js';
import { DeepStringify } from './stringify.js';
import { DeepUnstringify } from './unstringify.js';

export * from './autocomplete.js';
export * from './converters.js';
export * from './merge.js';
export * from './omit-paths.js';
export * from './pick.js';
export * from './primitives.js';
export * from './regex-engine.js';
export * from './string.js';
export * from './string-utils.js';
export * from './stringify.js'
export * from './unstringify.js'


type RecordToEntriesTuple<TRecord, KeysTuple extends readonly any[]> =
	KeysTuple extends readonly [infer Head extends string & keyof TRecord, ...infer Tail]
	? readonly [readonly [Head, TRecord[Head]], ...RecordToEntriesTuple<TRecord, Tail>]
	: readonly [];

// 🔌 Global declarations live natively at the entrypoint for seamless rollup matching
declare global {
	interface JSON {
		parse<TargetSchema = any>(
			text: string,
			reviver?: (this: any, key: string, value: any) => any
		): DeepUnstringify<TargetSchema, TargetSchema>;

		stringify<T>(
			value: T,
			replacer?: (this: any, key: string, value: any) => any,
			space?: string | number
		): DeepStringify<T>;
	}

	/* 🚀 OVERLOAD METHOD PRIORITIZATION GATEWAYS */
	interface String {
		/**
		 * Overloaded runtime split compiler checker.
		 * 💡 Uses polymorphic 'this' tracking to capture the exact template literal value!
		 */
		split<T extends string, S extends string>(this: T, separator: S): Split<T, S>;

		/**
	* 🪓 Overloaded runtime replace compiler checker.
	* Captures string literal types and dynamically infers the exact replaced output string type!
	*/
		replace<T extends string, S extends string, D extends string>(
			this: T,
			searchValue: S,
			replaceValue: D
		): ReplaceFirst<T, S, D>;

		/**
   * 🪓 Overloaded runtime replaceAll compiler checker.
   * Recursively sweeps the entire literal string sequence and swaps ALL matches!
   */
		replaceAll<T extends string, S extends string, D extends string>(
			this: T,
			searchValue: S,
			replaceValue: D
		): Split<T, S> extends infer Parts extends readonly string[]
			? Join<Parts, D>
			: Replace<T, S, D>; // Safe fallback loop

		includes<T extends string, T2 extends string>(this: T, searchString: T2): this is `${string}${T2}${string}`;

		toLowerCase<T extends string>(this: T): Lowercase<T>;
		/** Converts all the alphabetic characters in a string to uppercase. */
		toUpperCase<T extends string>(this: T): Uppercase<T>;
		/** Removes the leading and trailing white space and line terminator characters from a string. */
		trim<T extends string>(this: T): Trim<T>;
		trimStart<T extends string>(this: T): TrimLeft<T>;
		trimEnd<T extends string>(this: T): TrimRight<T>;
	}

	interface ReadonlyArray<T> {
		/** Intercepts implicit object-to-primitive conversions on readonly tuple constants. */
		[Symbol.toPrimitive]<This extends ReadonlyArray<T>>(this: This, hint: "string" | "default"): Join<This, ",">;

		/** Computes the exact delimiter-joined template string literal of a tuple at compile time. */
		join<This extends ReadonlyArray<T>, S extends string = ",">(this: This, separator?: S): Join<This, S>;

		/** Intercepts implicit or explicit array stringifications on readonly tuple constants. */
		toString<This extends ReadonlyArray<T>>(this: This): Join<This, ",">;
	}

	interface Array<T> {
		/** Fallback string representation tracking open, mutable arrays. */
		[Symbol.toPrimitive](hint: "string" | "default"): string;

		/** Computes the exact delimiter-joined template string literal of a mutable tuple array at compile time. */
		join<This extends Array<T>, S extends string = ",">(this: This, separator?: S): Join<This, S>;

		/** Intercepts array stringifications on mutable tuple configurations. */
		toString<This extends Array<T>>(this: This): Join<This, ",">;
	}

	interface ObjectConstructor {
		/**
		 * Strongly typed Object.fromEntries overload.
		 * Maps an iterable stream of literal key-value tuples into a flat, structured interface record type.
		 */
		fromEntries<T extends readonly [string, any]>(
			entries: readonly T[] | T[]
		): TupleEntriesToRecordLoop<readonly T[]>;

		/** Fallback configuration to process standard open stream iterables */
		fromEntries<K extends string, V>(entries: Iterable<[K, V]>): Record<K, V>;

		/**
		* 📦 Strongly typed Object.entries overload.
		* Extracts an object literal configuration tree and transforms it into a strict, ordered tuple of entries.
		*/
		entries<T extends Record<string, any>>(
			o: T
		): RecordToEntriesTuple<
			T,
			KeysToTuple<keyof T & string>
		>;
	}
}
