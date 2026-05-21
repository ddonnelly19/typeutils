// ─── UTILITY SET 1: DOT-NOTATION AUTOCOMPLETE PATH GENERATOR ───

/**
 * 🎯 StrictPaths Type Engine
 * Recursively scans an object tree and yields a union of all possible dot-notation paths.
 */
export type StrictPaths<T> = T extends RegExp | Date | any[] | Function
	? never
	: T extends Record<string, any>
	? {
		[K in keyof T & string]: T[K] extends Record<string, any>
		? K | `${K}.${StrictPaths<T[K]>}`
		: K;
	}[keyof T & string]
	: never;


// ─── UTILITY SET 2: RECURSIVE PROPERTY ERASURE ENGINE ───

// Helper to determine if a string path is currently targeting a specific key
type IsMatchingPath<P extends string, K extends string> = P extends K
	? true
	: P extends `${K}.${string}`
	? true
	: false;

// Extracts the trailing path slice for keys that match the current routing parameter
type FilterPaths<Paths extends string, Key extends string> = Paths extends `${Key}.${infer Rest}`
	? Rest
	: never;

// Recursively flattens intersections back into standard object literals
type Compute<T> = T extends Function
	? T
	: T extends Record<string, any>
	? { [K in keyof T]: Compute<T[K]> }
	: T;

/**
 * 🎯 DeepOmit Type Engine
 * Accepts an object T and a union of dot-notation path strings to explicitly drop.
 */
export type DeepOmit<T, Paths extends string> = Compute<{
	// 1. Keep only keys that are either not being targeted at all, or only partially targeted down a sub-tier
	[K in keyof T as IsMatchingPath<Paths, K & string> extends true
	? FilterPaths<Paths, K & string> extends never
	? never // Full absolute path match -> erase the key entirely
	: K     // Partial match -> keep the key shell so we can recurse into it
	: K       // No match -> preserve the field as-is
	]: FilterPaths<Paths, K & string> extends infer Rest extends string
	? [Rest] extends [never]
	? T[K] // No sub-paths targeting this key -> pass value through
	: DeepOmit<T[K], Rest> // Sub-paths found -> step down recursively to strip target fields
	: T[K];
}>;

/**
 * 🛠️ Runtime Deep Omit Functional Helper
 */
export function deepOmit<T extends Record<string, any>, P extends string>(
	obj: T,
	paths: P[]
): DeepOmit<T, P> {
	// 💡 Cast the stringified type signature to a raw primitive string
	const serialized = JSON.stringify(obj) as unknown as string;
	const output = JSON.parse(serialized);

	for (const path of paths) {
		const parts = path.split(".");
		let current = output;

		for (let i = 0; i < parts.length; i++) {
			const part = parts[i]!;
			if (!current || !(part in current)) break;

			if (i === parts.length - 1) {
				delete current[part];
			} else {
				current = current[part];
			}
		}
	}

	return output as DeepOmit<T, P>;
}
