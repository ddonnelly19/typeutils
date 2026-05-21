type Digit = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
type MonthTens = '0' | '1';
type DayTens   = '0' | '1' | '2' | '3';
type HourTens  = '0' | '1' | '2';
type MinSecTens = '0' | '1' | '2' | '3' | '4' | '5';

export type IsYear<S extends string> = S extends `${Digit}${Digit}${Digit}${Digit}` ? true : false;
export type IsMonth<S extends string> = S extends `${infer T}${infer O}`
  ? T extends MonthTens ? O extends Digit ? `${T}${O}` extends '00' | '13' | '14' | '15' | '16' | '17' | '18' | '19' ? false : true : false : false : false;
export type IsDay<S extends string> = S extends `${infer T}${infer O}`
  ? T extends DayTens ? O extends Digit ? `${T}${O}` extends '00' | '32' | '33' | '34' | '35' | '36' | '37' | '38' | '39' ? false : true : false : false : false;
type IsHour<S extends string> = S extends `${infer T}${infer O}`
  ? T extends HourTens ? O extends Digit ? `${T}${O}` extends '24' | '25' | '26' | '27' | '28' | '29' ? false : true : false : false : false;
type IsMinSec<S extends string> = S extends `${infer T}${infer O}` ? T extends MinSecTens ? O extends Digit ? true : false : false : false;

type IsValidIntStr<S extends string> = S extends '' ? false : S extends `-${infer Abs}` ? IsValidIntStr<Abs> : S extends `${Digit}${infer Rest}` ? Rest extends '' ? true : IsValidIntStr<Rest> : false;

type IsValidOctet<S extends string> = S extends `${Digit}` ? true : S extends `${Exclude<Digit, '0'>}${Digit}` ? true : S extends `1${Digit}${Digit}` ? true : S extends `2${'0' | '1' | '2' | '3' | '4'}${Digit}` ? true : S extends `25${'0' | '1' | '2' | '3' | '4' | '5'}` ? true : false;

// --- Exported Layout Primitives ---
export type StrictDate<T extends string> = T extends `${infer Y}-${infer M}-${infer D}` ? IsYear<Y> extends true ? IsMonth<M> extends true ? IsDay<D> extends true ? T : never : never : never : never;
export type StrictTime<T extends string> = T extends `${infer H}:${infer Min}:${infer S}` ? IsHour<H> extends true ? IsMinSec<Min> extends true ? IsMinSec<S> extends true ? T : never : never : never : never;
export type StrictDateTime<T extends string> = T extends `${infer DStr} ${infer TStr}` ? StrictDate<DStr> extends never ? never : StrictTime<TStr> extends never ? never : T : never;
export type StrictIntegerStr<T extends string> = IsValidIntStr<T> extends true ? T : never;
export type StrictIPv4<T extends string> = T extends `${infer O1}.${infer O2}.${infer O3}.${infer O4}` ? IsValidOctet<O1> extends true ? IsValidOctet<O2> extends true ? IsValidOctet<O3> extends true ? IsValidOctet<O4> extends true ? T : never : never : never : never : never;

// --- Clean Variable Assertions ---
export function assertDate<T extends string>(val: T & StrictDate<T>): T { return val; }
export function assertTime<T extends string>(val: T & StrictTime<T>): T { return val; }
export function assertDateTime<T extends string>(val: T & StrictDateTime<T>): T { return val; }
export function assertIntegerStr<T extends string>(val: T & StrictIntegerStr<T>): T { return val; }
export function assertIP<T extends string>(val: T & StrictIPv4<T>): T { return val; }
