type DigitStr = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
type AlphaLower = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j' | 'k' | 'l' | 'm' | 'n' | 'o' | 'p' | 'q' | 'r' | 's' | 't' | 'u' | 'v' | 'w' | 'x' | 'y' | 'z';
type AlphaUpper = Uppercase<AlphaLower>;
type WordChar = DigitStr | AlphaLower | AlphaUpper | '_';

// Splits choice blocks: "png|jpg" -> "png" | "jpg"
type SplitAlternation<S extends string> = S extends `${infer Choice}|${infer Rest}`
	? Choice | SplitAlternation<Rest>
	: S;

// 🔄 PRE-PARSER: Expands "prefix(A|B)suffix" into "prefixAsuffix" | "prefixBsuffix"
type ExpandAlternations<P extends string> = P extends `${infer Before}(${infer Choices})${infer After}`
	? SplitAlternation<Choices> extends infer Choice
	? Choice extends string
	? ExpandAlternations<`${Before}${Choice}${After}`>
	: never
	: never
	: P;

type ToCharUnion<S extends string> = S extends `${infer Char}${infer Rest}` ? Char | ToCharUnion<Rest> : never;

type MatchToken<Char extends string, Token extends string> =
	Token extends '\\d' ? (Char extends DigitStr ? true : false) :
	Token extends '\\w' ? (Char extends WordChar ? true : false) :
	Token extends '\\s' ? (Char extends ' ' ? true : false) :
	Token extends `[${infer Set}]` ? (Char extends ToCharUnion<Set> ? true : false) :
	Char extends Token ? true : false;

type ParseInt<S extends string, Acc extends unknown[] = []> = `${Acc['length']}` extends S
	? Acc['length']
	: Acc['length'] extends 50 ? number : ParseInt<S, [...Acc, unknown]>;

type MatchQuantifier<
	Str extends string, Token extends string, Count extends number, PatternRest extends string, CurrentCount extends unknown[] = []
> = CurrentCount['length'] extends Count
	? MatchRegexCore<Str, PatternRest>
	: Str extends `${infer Char}${infer Rest}`
	? MatchToken<Char, Token> extends true ? MatchQuantifier<Rest, Token, Count, PatternRest, [...CurrentCount, unknown]> : false
	: false;

// Core single-path character matching loop
type MatchRegexCore<Str extends string, Pattern extends string> =
	Pattern extends ''
	? (Str extends '' ? true : false)
	: Pattern extends `\\${infer TokenChar}{${infer Count}}${infer PatternRest}`
	? MatchQuantifier<Str, `\\${TokenChar}`, ParseInt<Count>, PatternRest>
	: Pattern extends `[${infer Set}]{${infer Count}}${infer PatternRest}`
	? MatchQuantifier<Str, `[${Set}]`, ParseInt<Count>, PatternRest>
	: Pattern extends `\\${infer TokenChar}${infer PatternRest}`
	? (Str extends `${infer Char}${infer Rest}` ? MatchToken<Char, `\\${TokenChar}`> extends true ? MatchRegexCore<Rest, PatternRest> : false : false)
	: Pattern extends `[${infer Set}]${infer PatternRest}`
	? (Str extends `${infer Char}${infer Rest}` ? MatchToken<Char, `[${Set}]`> extends true ? MatchRegexCore<Rest, PatternRest> : false : false)
	: Pattern extends `${infer PatChar}${infer PatternRest}`
	? (Str extends `${infer Char}${infer Rest}` ? Char extends PatChar ? MatchRegexCore<Rest, PatternRest> : false : false)
	: false;

// Loops through the expanded union of flat patterns
export type MatchRegexFlattened<Str extends string, FlattenedPatterns extends string> =
	FlattenedPatterns extends any
	? MatchRegexCore<Str, FlattenedPatterns> extends true ? true : never
	: never;

// Enforces exact string lengths
type EnforceLength<Str extends string, Target extends number, CountArray extends unknown[] = []> =
	CountArray['length'] extends Target
	? Str extends '' ? true : false
	: Str extends `${string}${infer Rest}`
	? EnforceLength<Rest, Target, [...CountArray, unknown]>
	: false;

// ─── FINAL ENTRYPOINT ───
export type RegexAndLength<Str extends string, Pattern extends string, Length extends number> =
	true extends MatchRegexFlattened<Str, ExpandAlternations<Pattern>>
	? EnforceLength<Str, Length> extends true ? Str : never
	: never;

export function assertSecureString<P extends string, L extends number>(
	_pattern: P, // 💡 Added underscore to silence the unused runtime parameter warning
	exactLength: L
) {
	return <S extends string>(value: S & RegexAndLength<S, P, L>): S => {
		// Optional: We can also run a quick length validation at runtime for dual safety
		if (value.length !== exactLength) {
			throw new Error(`String length mismatch. Expected exactly ${exactLength} characters.`);
		}
		return value;
	};
}
