// Helper to split a path string into a token and its tail, returning an empty string for the end of the line
type SplitPath<Path extends string> = Path extends `${infer Key}.${infer Rest}`
	? [Key, Rest]
	: [Path, ""];

/**
 * Core lookahead loop evaluating explicit path parameters against the object schema
 */
type PickPath<T, Path extends string> = SplitPath<Path> extends [infer Key extends string, infer Rest extends string]
	? Key extends keyof T
	? {
		[K in Key]: Rest extends ""
		? T[Key] // Reached the leaf node! Grab the absolute property type directly
		: PickPath<T[Key], Rest>; // More dots remaining, step deeper recursively
	}
	: never
	: never;

type Intersect<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

// Recursively flattens nested intersections back into standard, un-nested object literals
type Compute<T> = T extends Function
	? T
	: T extends Record<string, any>
	? { [K in keyof T]: Compute<T[K]> }
	: T;

/**
 * 🎯 Recursive Deep Picking Type Engine
 */
export type DeepPick<T, Paths extends string> = Compute<
	Intersect<
		Paths extends any ? PickPath<T, Paths> : never
	>
>;

// --- Keep the functional deepPick implementation exactly the same ---
export function deepPick<T extends Record<string, any>, P extends string>(
	obj: T,
	paths: P[]
): DeepPick<T, P> {
	const result = {} as any;
	for (const path of paths) {
		const parts = path.split(".");
		let currentSource = obj;
		let currentTarget = result;
		for (let i = 0; i < parts.length; i++) {
			const part = parts[i]!;
			if (!(part in currentSource)) break;
			if (i === parts.length - 1) {
				currentTarget[part] = currentSource[part];
			} else {
				currentTarget[part] = currentTarget[part] || {};
				currentSource = currentSource[part];
				currentTarget = currentTarget[part];
			}
		}
	}
	return result as DeepPick<T, P>;
}
