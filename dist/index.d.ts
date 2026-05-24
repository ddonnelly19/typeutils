declare type AllowedScalar = string | number | boolean | object | bigint | null | undefined;

declare type AlphaLower = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j' | 'k' | 'l' | 'm' | 'n' | 'o' | 'p' | 'q' | 'r' | 's' | 't' | 'u' | 'v' | 'w' | 'x' | 'y' | 'z';

declare type AlphaUpper = Uppercase<AlphaLower>;

/**
 * 🏷️ A branded template literal string type that carries design-time metadata
 * about an underlying array element type and its specific formatting separator.
 */
export declare type ArrayString<T, S extends string = ","> = string & {
	readonly __array_element_brand: Stringify<T>;
	readonly __array_separator_brand: S;
};

/**
 * 🪢 Converts a two-item tuple into a single-property record.
 */
export declare type ArrayToRecord<T extends readonly [string, any]> = {
	[K in T[0] & string]: T[1];
};

export declare type ArrayValues<T, S extends string = ","> = T extends readonly any[] ? T[number] extends string ? Trim<T[number]> : T[number] : ToStringUnion<T, S>;

export declare function assertDate<T extends string>(val: T & DateString<T>): T;

export declare function assertDateTime<T extends string>(val: T & DateTimeString<T>): T;

export declare function assertIntegerStr<T extends string>(val: T & IntegerString<T>): T;

export declare function assertIP<T extends string>(val: T & IPAddressv4String<T>): T;

export declare function assertSecureString<P extends string, L extends number>(_pattern: P, // 💡 Added underscore to silence the unused runtime parameter warning
	exactLength: L): <S extends string>(value: S & RegexAndLength<S, P, L>) => S;

export declare function assertTime<T extends string>(val: T & TimeString<T>): T;

/**
 * 🪢 Variadic type-safe path assembly utility.
 * Guarantees every single argument passed into the function maps to its exact literal constant.
 */
export declare function buildPath<T extends readonly (string | number | boolean | object)[]>(...segments: T): ConcatTuple<T>;

declare type CastNumber<S extends string> = S extends `${infer N extends number}` ? N : never;

declare type CleanString<T> = T extends `${infer S}` ? S : never;

export declare type Compute<T> = T extends Function ? T : T extends Record<string, any> ? {
	[K in keyof T]: Compute<T[K]>;
} : T;

declare type Compute_2<T> = T extends Function ? T : T extends Record<string, any> ? {
	[K in keyof T]: Compute_2<T[K]>;
} : T;

declare type Compute_3<T> = T extends Function ? T : T extends Record<string, any> ? {
	[K in keyof T]: Compute_3<T[K]>;
} : T;

declare type ComputeTuple<T extends readonly any[]> = {
	[K in keyof T]: T[K];
} extends infer R extends readonly any[] ? R : T;

/**
 * 🪢 Recursive Concat Tuple Loop
 * 💡 Fix: Explicitly walks your rest tuple parameters step-by-step to compute
 * a flat string literal without triggering any wide open array fallback guards!
 */
export declare type ConcatTuple<A extends readonly any[]> = A extends readonly [infer Head, ...infer Tail] ? `${Stringify<Head>}${ConcatTuple<Tail>}` : "";

/** Helper: Scans left-to-right and discards everything as soon as a non-digit character hits */
declare type ConsumeDigits<S extends string, Acc extends string = ""> = S extends `${infer Head}${infer Tail}` ? Head extends "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" ? ConsumeDigits<Tail, `${Acc}${Head}`> : Acc : Acc;

/**
 * Strict structural parameter block helper
 */
export declare function createInputFieldHelper<AllowedFields extends string>(): <U extends string | readonly string[], V extends ArrayValues<U>>(input: U & (V extends AllowedFields ? U : never), _options?: U extends string ? SuggestFields<U, AllowedFields> : never) => U;

/**
 * Prefix Enforcement Structural Factory Block
 */
export declare function createPrefixedFieldHelper<AllowedFields extends string, Prefix extends string>(): <U extends string | readonly string[], V extends ArrayValues<U>>(input: U & (V extends `${Prefix}${AllowedFields}` ? U : never), _options?: U extends string ? SuggestFieldsWithPrefix<U, `${Prefix}${AllowedFields}`> : never) => U;

export declare type DateString<T extends string = string> = T extends `${infer Y}-${infer M}-${infer D}` ? IsYear<Y> extends true ? IsMonth<M> extends true ? IsDay<D> extends true ? T : never : never : never : never;

export declare type DateTimeString<T extends string = string> = T extends `${infer DStr} ${infer TStr}` ? DateString<DStr> extends never ? never : TimeString<TStr> extends never ? never : T : never;

declare type DayTens = '0' | '1' | '2' | '3';

/**
 * Recursive Configuration Deep Merger
 * Merges object trees; properties in U cleanly overwrite properties in T on primitive collisions
 */
export declare type DeepMerge<T, U> = IsObject<T> extends true ? IsObject<U> extends true ? {
	[K in keyof T | keyof U]: K extends keyof T ? K extends keyof U ? DeepMerge<T[K], U[K]> : T[K] : K extends keyof U ? U[K] : never;
} : U : U;

/**
 * 🛠️ Runtime Deep Merge Functional Helper
 * Combines two configuration objects together using recursive copying
 */
export declare function deepMerge<T, U>(target: T, source: U): DeepMerge<T, U>;

/**
 * 🎯 DeepOmit Type Engine
 * Accepts an object T and a union of dot-notation path strings to explicitly drop.
 */
export declare type DeepOmit<T, Paths extends string> = Compute_2<{
	[K in keyof T as IsMatchingPath<Paths, K & string> extends true ? FilterPaths<Paths, K & string> extends never ? never : K : K]: FilterPaths<Paths, K & string> extends infer Rest extends string ? [Rest] extends [never] ? T[K] : DeepOmit<T[K], Rest> : T[K];
}>;

/**
 * 🛠️ Runtime Deep Omit Functional Helper
 */
export declare function deepOmit<T extends Record<string, any>, P extends string>(obj: T, paths: P[]): DeepOmit<T, P>;

/**
 * 🎯 Recursive Deep Picking Type Engine
 */
export declare type DeepPick<T, Paths extends string> = Compute_3<Intersect<Paths extends any ? PickPath<T, Paths> : never>>;

export declare function deepPick<T extends Record<string, any>, P extends string>(obj: T, paths: P[]): DeepPick<T, P>;

/**
 * Recursive Deep Stringifier Type Engine
 */
export declare type DeepStringify<T> = T extends undefined ? undefined : T extends null ? undefined : T extends readonly any[] ? {
	[K in keyof T]: DeepStringify<T[K]>;
} : T extends Record<string, any> ? Stringify<T> extends never ? {
	[K in keyof T]: DeepStringify<T[K]>;
} : Stringify<T> : Stringify<T>;

/**
 * Recursive Object Structure Un-Stringifier
 */
export declare type DeepUnstringify<T, OriginalContext = unknown> = T extends undefined ? undefined : T extends null ? null : T extends readonly any[] ? {
	[K in keyof T]: DeepUnstringify<T[K], GetContextKey<OriginalContext, K>>;
} : T extends Record<string, any> ? {
	[K in keyof T]: DeepUnstringify<T[K], GetContextKey<OriginalContext, K>>;
} : T extends string ? UnstringifyPrimitive<T, OriginalContext> : T;

declare type Digit = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';

declare type DigitStr = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';

/** 💡 Isolated Union Distributor: Safe from breaking object schema hierarchies */
declare type DistributeUnion<T> = T extends any ? StringifyCore<T> : never;

declare type EnforceLength<Str extends string, Target extends number, CountArray extends unknown[] = []> = CountArray['length'] extends Target ? Str extends '' ? true : false : Str extends `${string}${infer Rest}` ? EnforceLength<Rest, Target, [...CountArray, unknown]> : false;

/** 📥 3. Entries Engine: Safely handles reverse mutable tuple pairs from Object.entries */
export declare type EntriesTupleToRecord<T extends readonly any[]> = readonly any[] extends T ? Record<string, any> : {
	[K in T[number]as K extends [infer Key extends string, any] ? Key : K extends readonly [infer Key2 extends string, any] ? Key2 : never]: K extends [any, infer Val] ? Val : K extends readonly [any, infer Val2] ? Val2 : never;
};

declare type ExpandAlternations<P extends string> = P extends `${infer Before}(${infer Choices})${infer After}` ? SplitAlternation<Choices> extends infer Choice ? Choice extends string ? ExpandAlternations<`${Before}${Choice}${After}`> : never : never : P;

declare type FilterPaths<Paths extends string, Key extends string> = Paths extends `${Key}.${infer Rest}` ? Rest : never;

/**
 * 📥 FromEntries Engine: Maps flat input key-value tuple arrays safely.
 * 💡 Upgrade: Replacing 'readonly any[]' with an explicit allowed-scalar union matrix
 * prevents internal element boundaries from losing context during advanced cascading maps!
 */
export declare type FromEntriesTupleToRecord<T extends readonly [string, AllowedScalar]> = [
	T
] extends [never] ? Record<string, any> : {
		[K in T as K extends readonly [infer Key extends string, any] ? Key : never]: K extends readonly [any, infer Val] ? Val : never;
	};

/**
 * Safe Contextual Key Extractor
 * 💡 Safely maps numeric array strings ("0", "1") back into native index markers for tuple configurations
 */
declare type GetContextKey<Context, K> = Context extends readonly any[] ? K extends `${infer N extends number}` ? N extends keyof Context ? Context[N] : unknown : K extends keyof Context ? Context[K] : unknown : Context extends Record<string, any> ? K extends keyof Context ? Context[K] : unknown : unknown;

declare type HourTens = '0' | '1' | '2';

export declare type IntegerString<T extends string = string> = IsValidIntStr<T> extends true ? T : never;

declare type Intersect<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

export declare type IPAddressv4String<T extends string = string> = T extends `${infer O1}.${infer O2}.${infer O3}.${infer O4}` ? IsValidOctet<O1> extends true ? IsValidOctet<O2> extends true ? IsValidOctet<O3> extends true ? IsValidOctet<O4> extends true ? T : never : never : never : never : never;

declare type IsDay<S extends string> = S extends `${infer T}${infer O}` ? T extends DayTens ? O extends Digit ? `${T}${O}` extends '00' | '32' | '33' | '34' | '35' | '36' | '37' | '38' | '39' ? false : true : false : false : false;

declare type IsExactly<A, B> = [A] extends [B] ? ([B] extends [A] ? true : false) : false;

declare type IsHour<S extends string> = S extends `${infer T}${infer O}` ? T extends HourTens ? O extends Digit ? `${T}${O}` extends '24' | '25' | '26' | '27' | '28' | '29' ? false : true : false : false : false;

declare type IsMatchingPath<P extends string, K extends string> = P extends K ? true : P extends `${K}.${string}` ? true : false;

declare type IsMinSec<S extends string> = S extends `${infer T}${infer O}` ? T extends MinSecTens ? O extends Digit ? true : false : false : false;

declare type IsMonth<S extends string> = S extends `${infer T}${infer O}` ? T extends MonthTens ? O extends Digit ? `${T}${O}` extends '00' | '13' | '14' | '15' | '16' | '17' | '18' | '19' ? false : true : false : false : false;

/**
 * Safe Object Classifier
 * Ensures we only recursively traverse true dictionary objects (and skip arrays/functions)
 */
declare type IsObject<T> = T extends any ? T extends RegExp | Date | any[] | Function ? false : T extends Record<string, any> ? true : false : false;

export declare function isStrictDateTime(val: string): val is DateTimeString<typeof val>;

export declare function isStrictIP(val: string): val is IPAddressv4String<typeof val>;

/** 🔌 Internal metadata brand interface supporting native JavaScript stringification hooks */
export declare interface IStringType<T, V extends string = Extract<ObjectToStringLiteral<T>, string>> extends String {
	readonly _type: T;
	[Symbol.toPrimitive](hint: "string" | "number" | "default"): V;
	toString(): V;
}

/**
 * 🕵️ Type-level truthiness engine mirroring JavaScript's native runtime evaluation rules.
 * Collapses known falsy literals to false, while computing all other valid structures as true.
 */
export declare type IsTruthy<T> = T extends false | 0 | -0 | 0n | "" | null | undefined ? false : true;

declare type IsValidIntStr<S extends string> = S extends '' ? false : S extends `-${infer Abs}` ? IsValidIntStr<Abs> : S extends `${Digit}${infer Rest}` ? Rest extends '' ? true : IsValidIntStr<Rest> : false;

declare type IsValidOctet<S extends string> = S extends `${Digit}` ? true : S extends `${Exclude<Digit, '0'>}${Digit}` ? true : S extends `1${Digit}${Digit}` ? true : S extends `2${'0' | '1' | '2' | '3' | '4'}${Digit}` ? true : S extends `25${'0' | '1' | '2' | '3' | '4' | '5'}` ? true : false;

declare type IsYear<S extends string> = S extends `${Digit}${Digit}${Digit}${Digit}` ? true : false;

/** 🪢 Joins tuple/array elements into a separator-delimited string type. */
export declare type Join<A, S extends string = ","> = A extends [infer A1] | readonly [infer A1] ? CleanString<Stringify<A1>> : A extends [any, ...any[]] | readonly [any, ...any[]] ? CleanString<JoinTextCore<A, S>> : A extends readonly any[] ? ArrayString<A[number], S> : "";

/**
 * Helper loop to assemble pure template literal text strings
 * 💡 Fix: Safely subtracts tuple elements by piping 'A2' into the recursive step!
 */
declare type JoinTextCore<A, S extends string> = A extends [infer A1] | readonly [infer A1] ? Stringify<A1> : A extends [infer A1, ...infer A2] | readonly [infer A1, ...infer A2] ? `${Stringify<A1>}${S}${JoinTextCore<A2, S>}` : A extends readonly any[] ? string : "";

/** Helper: Intersects functions to safely convert an object's keys into an ordered tuple array stream */
export declare type KeysToTuple<T, Acc extends readonly any[] = readonly []> = UnionToIntersection<T extends any ? (key: T) => void : never> extends (key: infer Last) => void ? KeysToTuple<Exclude<T, Last>, readonly [Last, ...Acc]> : Acc;

export declare type LikeArray<U, T extends string, S extends string = ","> = ArrayValues<U, S> extends T ? U : never;

/** Helper: Sequentially maps over an extracted tuple of keys to build explicit delimited string rows */
declare type MapPropertiesToTuple<TRecord, KeysTuple extends readonly any[], D extends string> = KeysTuple extends readonly [infer Head extends string & keyof TRecord, ...infer Tail] ? readonly [`${Head}${D}${StringifyProperty<TRecord[Head]>}`, ...MapPropertiesToTuple<TRecord, Tail, D>] : readonly [];

declare type MatchQuantifier<Str extends string, Token extends string, Count extends number, PatternRest extends string, CurrentCount extends unknown[] = []> = CurrentCount['length'] extends Count ? MatchRegexCore<Str, PatternRest> : Str extends `${infer Char}${infer Rest}` ? MatchToken<Char, Token> extends true ? MatchQuantifier<Rest, Token, Count, PatternRest, [...CurrentCount, unknown]> : false : false;

declare type MatchRegexCore<Str extends string, Pattern extends string> = Pattern extends '' ? (Str extends '' ? true : false) : Pattern extends `\\${infer TokenChar}{${infer Count}}${infer PatternRest}` ? MatchQuantifier<Str, `\\${TokenChar}`, ParseInt_2<Count>, PatternRest> : Pattern extends `[${infer Set}]{${infer Count}}${infer PatternRest}` ? MatchQuantifier<Str, `[${Set}]`, ParseInt_2<Count>, PatternRest> : Pattern extends `\\${infer TokenChar}${infer PatternRest}` ? (Str extends `${infer Char}${infer Rest}` ? MatchToken<Char, `\\${TokenChar}`> extends true ? MatchRegexCore<Rest, PatternRest> : false : false) : Pattern extends `[${infer Set}]${infer PatternRest}` ? (Str extends `${infer Char}${infer Rest}` ? MatchToken<Char, `[${Set}]`> extends true ? MatchRegexCore<Rest, PatternRest> : false : false) : Pattern extends `${infer PatChar}${infer PatternRest}` ? (Str extends `${infer Char}${infer Rest}` ? Char extends PatChar ? MatchRegexCore<Rest, PatternRest> : false : false) : false;

export declare type MatchRegexFlattened<Str extends string, FlattenedPatterns extends string> = FlattenedPatterns extends any ? MatchRegexCore<Str, FlattenedPatterns> extends true ? true : never : never;

declare type MatchToken<Char extends string, Token extends string> = Token extends '\\d' ? (Char extends DigitStr ? true : false) : Token extends '\\w' ? (Char extends WordChar ? true : false) : Token extends '\\s' ? (Char extends ' ' ? true : false) : Token extends `[${infer Set}]` ? (Char extends ToCharUnion<Set> ? true : false) : Char extends Token ? true : false;

declare type MinSecTens = '0' | '1' | '2' | '3' | '4' | '5';

declare type MonthTens = '0' | '1';

declare type NarrowablePayload = string | number | boolean | bigint | object | null | undefined;

declare type ObjectToStringLiteral<T> = T extends string ? string extends T ? string : T : T extends number | boolean | bigint | null | undefined ? Stringify<T> : string;

/**
 * 🔢 Type-level parseInt engine.
 * Strips trailing units (like "px" or "-fallback") and converts the isolated string into a literal number type.
 */
export declare type ParseInt<S extends string> = ParseIntCore<S> extends "" ? never : ParseIntCore<S> extends "-" ? never : ParseIntCore<S> extends `${infer N extends number}` ? N : never;

declare type ParseInt_2<S extends string, Acc extends unknown[] = []> = `${Acc['length']}` extends S ? Acc['length'] : Acc['length'] extends 50 ? number : ParseInt_2<S, [...Acc, unknown]>;

/** Helper: Isolates optional leading signs before handing the block to the digit consumer */
declare type ParseIntCore<S extends string> = S extends `+${infer Rest}` ? ConsumeDigits<Rest> : S extends `-${infer Rest}` ? `-${ConsumeDigits<Rest>}` : ConsumeDigits<S>;

/**
 * Core lookahead loop evaluating explicit path parameters against the object schema
 */
declare type PickPath<T, Path extends string> = SplitPath<Path> extends [infer Key extends string, infer Rest extends string] ? Key extends keyof T ? {
	[K in Key]: Rest extends "" ? T[Key] : PickPath<T[Key], Rest>;
} : never : never;

export declare type RecordToEntriesTuple<TRecord, KeysTuple extends readonly any[]> = KeysTuple extends readonly [infer Head extends string & keyof TRecord, ...infer Tail] ? readonly [readonly [Head, TRecord[Head]], ...RecordToEntriesTuple<TRecord, Tail>] : readonly [];

/** 📤 Converts a record type into a delimited key-value string type. */
export declare type RecordToString<TRecord, D extends string = "=", S extends string = ","> = Join<MapPropertiesToTuple<TRecord, KeysToTuple<keyof TRecord & string>, D>, S>;

export declare type RegexAndLength<Str extends string, Pattern extends string, Length extends number> = true extends MatchRegexFlattened<Str, ExpandAlternations<Pattern>> ? EnforceLength<Str, Length> extends true ? Str : never : never;

/**
 * 🪓 Replaces all occurrences of S in T with D at the type level.
 * Utilizes a recursive structural accumulator to optimize compiler lookup passes.
 */
export declare type Replace<T extends string, S extends string, D extends string, A extends string = ""> = T extends `${infer L}${S}${infer R}` ? Replace<R, S, D, `${A}${L}${D}`> : `${A}${T}`;

export declare type ReplaceFirst<T extends string, S extends string, D extends string> = T extends `${infer L}${S}${infer R}` ? `${L}${D}${R}` : T;

/**
 * 🔂 Lookahead-free split resolver gateway.
 * Extracts underlying string primitives from branded nominal instances without tracing global prototypes.
 */
export declare type ResolveSplit<T, S extends string> = T extends IStringType<any, infer V extends string> ? Split<V, S> : T extends string ? Split<T, S> : readonly string[];

/**
 * 💡 Safe Object Converter
 * Turns an isolated two-item tuple into a single-property record with correct value tracking
 */
declare type SingleTupleToRecord<T extends readonly [string, any]> = {
	[K in T[0]]: T[1];
};

/** 🪢 Splits a string-like value into an array/tuple using separator S. */
export declare type Split<A, S extends string = ","> = A extends null | undefined | never ? readonly [] : A extends `${infer A1}${S}${infer A2}` ? ComputeTuple<readonly [Stringify<Trim<A1>>, ...Split<A2, S>]> : A extends `${infer A1}` ? readonly [Stringify<Trim<A1>>] : A extends ArrayString<infer T, S> ? Stringify<T>[] : ReadonlyArray<Stringify<A>>;

declare type SplitAlternation<S extends string> = S extends `${infer Choice}|${infer Rest}` ? Choice | SplitAlternation<Rest> : S;

declare type SplitOnce<A extends string, S extends string = "="> = A extends `${infer A1}${S}${infer A2}` ? readonly [Trim<A1>, Trim<A2>] : readonly [Stringify<Trim<A>>, null];

declare type SplitPath<Path extends string> = Path extends `${infer Key}.${infer Rest}` ? [Key, Rest] : [Path, ""];

/**
 * 🎯 StrictPaths Type Engine
 * Recursively scans an object tree and yields a union of all possible dot-notation paths.
 */
export declare type StrictPaths<T> = T extends RegExp | Date | any[] | Function ? never : T extends Record<string, any> ? {
	[K in keyof T & string]: T[K] extends Record<string, any> ? K | `${K}.${StrictPaths<T[K]>}` : K;
}[keyof T & string] : never;

declare type StringifiablePrimitive = string | number | boolean | bigint;

/**
 * 🪞 Converts `T` to its template-literal string representation.
 * Targets primitive unions safely without distributing top-level object shapes.
 */
export declare type Stringify<T> = T extends string | number | boolean | object | bigint | null | undefined ? IsExactly<T, string> extends true ? string : IsExactly<T, number> extends true ? `${number}` : IsExactly<T, boolean> extends true ? `${boolean}` : [T] extends [StringifiablePrimitive | null | undefined] ? DistributeUnion<T> : StringifyCore<T> : (T & string);

/** Core logic evaluating an absolute, isolated single type tier */
declare type StringifyCore<T> = T extends undefined ? undefined : T extends null ? undefined : IsExactly<T, string> extends true ? string : IsExactly<T, number> extends true ? `${number}` : any[] extends T ? never : T extends StringifiablePrimitive ? `${T}` : T extends {
	[Symbol.toPrimitive](hint: "string" | "default"): infer R extends StringifiablePrimitive;
} ? `${R}` : T extends readonly any[] ? never : T extends Record<string, any> ? T extends {
	toString(): infer R extends string;
} ? string extends R ? never : R : never : T extends {
	toString(): infer R extends string;
} ? string extends R ? never : R : never;

declare type StringifyProperty<T> = T extends undefined ? "undefined" : T extends null ? "null" : T extends string | number | boolean | bigint ? `${T}` : Stringify<T>;

/** 📥 Converts a delimited key-value string into a record type. */
export declare type StringToRecord<T extends string, S1 extends string = ",", S2 extends string = "="> = Compute<UnionToIntersection<TupleToRecordLoop<Split<T, S1>, S2>>>;

/**
 * 🏷️ Smart Branded String Primitive Wrapper.
 * 💡 Fix: Consolidates signature layout to a unified intersection (V & I)
 * to prevent method-splitting union cascades across global overloads!
 */
export declare type StringType<T extends NarrowablePayload, V extends string = Extract<ObjectToStringLiteral<T>, string>, I = IStringType<T, V>> = V & I;

/**
 * Advanced Dynamic Autocomplete Suggester Engine
 * Loops through standard lists and computes subsequent selection combinations
 */
declare type SuggestFields<U extends string, AllowedFields extends string> = U extends `${infer Before},${infer Rest}` ? `${Before},${SuggestFields<Rest, AllowedFields>}` : U extends `${infer Before} ` ? `${Before} ${AllowedFields}` : AllowedFields;

/**
 * Advanced Dynamic Autocomplete Suggester Engine with Prefix Support
 */
declare type SuggestFieldsWithPrefix<U extends string, PrefixedFields extends string> = U extends `${infer Before},${infer Rest}` ? `${Before},${SuggestFieldsWithPrefix<Rest, PrefixedFields>}` : U extends `${infer Before} ` ? `${Before} ${PrefixedFields}` : PrefixedFields;

export declare type TimeString<T extends string = string> = T extends `${infer H}:${infer Min}:${infer S}` ? IsHour<H> extends true ? IsMinSec<Min> extends true ? IsMinSec<S> extends true ? T : never : never : never : never;

declare type ToCharUnion<S extends string> = S extends `${infer Char}${infer Rest}` ? Char | ToCharUnion<Rest> : never;

export declare type ToStringUnion<T, S extends string = ","> = T extends readonly string[] ? {
	[K in keyof T]: T[K] extends string ? Trim<T[K]> : never;
}[number] : T extends `${infer First}${S}${infer Rest}` ? Trim<First> | ToStringUnion<Rest, S> : T extends string ? Trim<T> : never;

export declare type Trim<S extends string> = TrimLeft<TrimRight<S>>;

export declare type TrimLeft<S extends string> = S extends ` ${infer R}` ? TrimLeft<R> : S;

export declare type TrimRight<S extends string> = S extends `${infer R} ` ? TrimRight<R> : S;

/** 💡 Helper: Identifies if an array is an un-narrowed open generic array list instead of a strict constant tuple */
/** 💡 Helper: Identifies if an array is a strict constant tuple configuration */
/**
 * 📥 1. Query-String Engine: Maps flat string delimiter arrays safely
 * 💡 Fix: Destructures the entry array elements to completely prevent key corruption!
 */
export declare type TupleEntriesToRecordLoop<T extends readonly [string, any][] | readonly any[]> = readonly any[] extends T ? Record<string, any> : {
	[K in T[number]as K extends readonly [infer Key extends string, any] ? Key : K extends [infer Key2 extends string, any] ? Key2 : never]: K extends readonly [any, infer Val] ? Val : K extends [any, infer Val2] ? Val2 : never;
};

/**
 * 📥 Recursive Tuple-to-Record Loop
 * Walks your strict split tuple position-by-position to preserve explicit value bindings
 */
export declare type TupleToRecordLoop<T extends readonly any[], S2 extends string> = T extends readonly [infer First extends string, ...infer Rest] ? SingleTupleToRecord<SplitOnce<First, S2>> & TupleToRecordLoop<Rest, S2> : unknown;

export declare type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

declare type Unpad<S extends string> = S extends `0${infer Rest}` ? Rest : S;

/**
 * Core Type-Level Reversal Parser
 */
declare type UnstringifyPrimitive<S extends string, OriginalContext = unknown> = S extends "true" ? true : S extends "false" ? false : S extends "null" ? null : S extends "undefined" ? undefined : [
	OriginalContext
] extends [bigint] ? S extends `${infer B extends bigint}` ? B : never : S extends `${infer N extends number}` ? N : S;

export declare type UnwrapDateTime<T extends string> = T extends `${infer Y}-${infer M}-${infer D} ${infer H}:${infer Min}:${infer S}` ? {
	year: CastNumber<Unpad<Y>>;
	month: CastNumber<Unpad<M>>;
	day: CastNumber<Unpad<D>>;
	hour: CastNumber<Unpad<H>>;
	minute: CastNumber<Unpad<Min>>;
	second: CastNumber<Unpad<S>>;
} : never;

export declare type UnwrapIP<T extends string> = T extends `${infer O1}.${infer O2}.${infer O3}.${infer O4}` ? [CastNumber<Unpad<O1>>, CastNumber<Unpad<O2>>, CastNumber<Unpad<O3>>, CastNumber<Unpad<O4>>] : never;

declare type WordChar = DigitStr | AlphaLower | AlphaUpper | '_';

export { }
