type Something = string | number | boolean | object | bigint | null | undefined;

// 🔌 Global declarations live natively at the entrypoint for seamless rollup matching
declare global {
	interface JSON {
		parse<TargetSchema = any>(
			text: string,
			reviver?: (this: any, key: string, value: any) => any
		): import("typeutils").DeepUnstringify<TargetSchema, TargetSchema>;

		stringify<T extends Something>(
			value: T,
			replacer?: (this: any, key: string, value: any) => any,
			space?: string | number
		): Extract<import("typeutils").DeepStringify<T>, string>;
	}

	/* 🚀 OVERLOAD METHOD PRIORITIZATION GATEWAYS */
	interface String {
		/**
		 * Overloaded runtime split compiler checker.
		 * 💡 Fix: Delegates signature evaluations directly to ResolveSplit 
		 * to eliminate prototype extraction races and clear out circular reference loops!
		 */
		split<
			T extends string | import("typeutils").IStringType<any, any>,
			S extends string
		>(
			this: T,
			separator: S
		): import("typeutils").ResolveSplit<T, S>;
		

		/**
		* 🪓 Overloaded runtime replace compiler checker.
		* Captures string literal types and dynamically infers the exact replaced output string type!
		*/
		replace<T extends string, S extends string, D extends string>(
			this: T,
			searchValue: S,
			replaceValue: D
		): import("typeutils").ReplaceFirst<T, S, D>;

		/**
		 * 🪓 Overloaded runtime replaceAll compiler checker.
		 * Recursively sweeps the entire literal string sequence and swaps ALL matches!
		 */
		replaceAll<T extends string, S extends string, D extends string>(
			this: T,
			searchValue: S,
			replaceValue: D
		): import("typeutils").Split<T, S> extends infer Parts extends readonly string[]
			? import("typeutils").Join<Parts, D>
			: import("typeutils").Replace<T, S, D>; // Safe fallback loop

		includes<T extends string, T2 extends string>(this: T, searchString: T2): this is `${string}${T2}${string}`;

		toLowerCase<T extends string>(this: T): Lowercase<T>;
		/** Converts all the alphabetic characters in a string to uppercase. */
		toUpperCase<T extends string>(this: T): Uppercase<T>;
		/** Removes the leading and trailing white space and line terminator characters from a string. */
		trim<T extends string>(this: T): import("typeutils").Trim<T>;
		trimStart<T extends string>(this: T): import("typeutils").TrimLeft<T>;
		trimEnd<T extends string>(this: T): import("typeutils").TrimRight<T>;

		/** 🪢 Strongly typed String.prototype.concat overload matrix */
		concat<T extends string, T1 extends readonly Something[]>(this: T, ...obj: T1): `${T}${import("typeutils").ConcatTuple<T1>}`;
	}

	interface ReadonlyArray<T> {
		/** Intercepts implicit object-to-primitive conversions on readonly tuple constants. */
		[Symbol.toPrimitive]<This extends ReadonlyArray<T>>(this: This, hint: "string" | "default"): import("typeutils").Join<This, ",">;

		/** Computes the exact delimiter-joined template string literal of a tuple at compile time. */
		join<This extends ReadonlyArray<T>, S extends string = ",">(this: This, separator?: S): import("typeutils").Join<This, S>;

		/** Intercepts implicit or explicit array stringifications on readonly tuple constants. */
		toString<This extends ReadonlyArray<T>>(this: This): import("typeutils").Join<This, ",">;
	}

	interface Array<T> {
		/** Fallback string representation tracking open, mutable arrays. */
		[Symbol.toPrimitive]<This extends Array<T>>(this: This, hint: "string" | "default"): import("typeutils").Join<This, ",">;

		/** Computes the exact delimiter-joined template string literal of a mutable tuple array at compile time. */
		join<This extends Array<T>, S extends string = ",">(this: This, separator?: S): import("typeutils").Join<This, S>;

		/** Intercepts array stringifications on mutable tuple configurations. */
		toString<This extends Array<T>>(this: This): import("typeutils").Join<This, ",">;
	}

	interface ObjectConstructor {
		/**
		 * Strongly typed Object.fromEntries overload.
		 * Maps an iterable stream of literal key-value tuples into a flat, structured interface record type.
		 */
		fromEntries<T extends readonly [string, any]>(
			entries: readonly T[] | T[]
		): import("typeutils").Compute<import("typeutils").FromEntriesTupleToRecord<T>>;

		/** Fallback configuration to process standard open stream iterables */
		fromEntries<K extends string, V>(entries: Iterable<[K, V]>): Record<K, V>;

		/**
		* 📦 Strongly typed Object.entries overload.
		* Extracts an object literal configuration tree and transforms it into a strict, ordered tuple of entries.
		*/
		entries<T extends Record<string, any>>(
			o: T
		): import("typeutils").RecordToEntriesTuple<
			T,
			import("typeutils").KeysToTuple<keyof T & string>
		>;

		keys<T extends Record<string, any>>(o: T): Extract<keyof T, string>[]
	}

	interface NumberConstructor {
		/**
		 * Strongly typed Number() constructor factory overload.
		 * 💡 Parses stringified numeric template literals and infers the narrow number type constraint!
		 */
		<T extends number>(value?: `${T}`): T;
		/** Strongly typed Number.parseInt overload matching the global behavior. */
		parseInt<S extends string>(string: S, radix?: number): import("typeutils").ParseInt<S>;
	}

	interface StringConstructor {
		/**
		 * Strongly typed String() constructor factory overload.
		 * 💡 Uses contextual literal narrowing to turn any primitive payload or object shape into its strict string type!
		 */
		<T extends string | number | boolean | object | bigint | null | undefined>(
			value?: T
		): import("typeutils").Stringify<T>;
	}

	interface BooleanConstructor {
		/**
		 * Strongly typed Boolean() constructor factory overload.
		 * 💡 Evaluates the exact design-time truthiness of a scalar literal matching JS runtime rules!
		 */
		<T extends string | number | boolean | object | bigint | null | undefined>(
			value?: T
		): import("typeutils").IsTruthy<T>;
	}

	/**
   * Strongly typed global parseInt overload.
   * 💡 Automatically extracts narrow literal number constants out of strings with trailing units!
   */
	function parseInt<S extends string>(string: S, radix?: number): import("typeutils").ParseInt<S>;

}

export { }; 