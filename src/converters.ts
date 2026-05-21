import { StrictIPv4, StrictDateTime } from "./primitives.js";

type Unpad<S extends string> = S extends `0${infer Rest}` ? Rest : S;
type CastNumber<S extends string> = S extends `${infer N extends number}` ? N : never;

export type UnwrapIP<T extends string> = T extends `${infer O1}.${infer O2}.${infer O3}.${infer O4}`
	? [CastNumber<Unpad<O1>>, CastNumber<Unpad<O2>>, CastNumber<Unpad<O3>>, CastNumber<Unpad<O4>>] : never;

export type UnwrapDateTime<T extends string> = T extends `${infer Y}-${infer M}-${infer D} ${infer H}:${infer Min}:${infer S}`
	? { year: CastNumber<Unpad<Y>>; month: CastNumber<Unpad<M>>; day: CastNumber<Unpad<D>>; hour: CastNumber<Unpad<H>>; minute: CastNumber<Unpad<Min>>; second: CastNumber<Unpad<S>> } : never;

export function isStrictIP(val: string): val is StrictIPv4<typeof val> {
	const octets = val.split(".");
	if (octets.length !== 4) return false;
	return octets.every(o => { const n = Number(o); return Number.isInteger(n) && n >= 0 && n <= 255 && String(n) === o; });
}

export function isStrictDateTime(val: string): val is StrictDateTime<typeof val> {
  // 1. Structural Validation (YYYY-MM-DD HH:mm:ss)
  const structuralRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2]\d|3[0-1]) (0\d|1\d|2[0-3]):[0-5]\d:[0-5]\d$/;
  if (!structuralRegex.test(val)) return false;

  // 💡 FIX: Cast the result array through string[] so the compiler restores standard runtime string methods
  const [datePart, timePart] = (val.split(" ") as unknown as string[]);
  
  // These split calls are now completely unblocked!
  const [year, month, day] = (datePart!.split("-").map(Number));
  const [hour, minute, second] = (timePart!.split(":").map(Number));

  // 2. Logical Calendar Validation (Blocks things like February 30th)
  const parsedDate = new Date(year!, month! - 1, day!, hour!, minute!, second!);

  return (
    parsedDate.getFullYear() === year &&
    parsedDate.getMonth() === month! - 1 &&
    parsedDate.getDate() === day
  );
}