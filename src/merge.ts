/**
 * Safe Object Classifier
 * Ensures we only recursively traverse true dictionary objects (and skip arrays/functions)
 */
type IsObject<T> = T extends any
	? T extends RegExp | Date | any[] | Function
	? false
	: T extends Record<string, any>
	? true
	: false
	: false;

/**
 * Recursive Configuration Deep Merger
 * Merges object trees; properties in U cleanly overwrite properties in T on primitive collisions
 */
export type DeepMerge<T, U> = IsObject<T> extends true
	? IsObject<U> extends true
	? {
		[K in keyof T | keyof U]: K extends keyof T
		? K extends keyof U
		? DeepMerge<T[K], U[K]> // Both are objects -> merge recursively
		: T[K] // Only in T
		: K extends keyof U
		? U[K] // Only in U
		: never;
	}
	: U // U is primitive -> overwrite T entirely
	: U; // T is primitive -> overwrite with U

/**
 * 🛠️ Runtime Deep Merge Functional Helper
 * Combines two configuration objects together using recursive copying
 */
export function deepMerge<T, U>(target: T, source: U): DeepMerge<T, U> {
	const isObject = (item: any) => item && typeof item === "object" && !Array.isArray(item);

	if (!isObject(target) || !isObject(source)) {
		return source as any;
	}

	const output = { ...target } as any;

	for (const key of Object.keys(source as any)) {
		if (isObject((source as any)[key]) && isObject(output[key])) {
			output[key] = deepMerge(output[key], (source as any)[key]);
		} else {
			output[key] = (source as any)[key];
		}
	}

	return output as DeepMerge<T, U>;
}
