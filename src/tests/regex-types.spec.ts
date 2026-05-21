import { describe, it, expectTypeOf } from "vitest";
import { UnwrapIP, UnwrapDateTime } from "../converters.js";
import { RegexAndLength, assertSecureString } from "../regex-engine.js";



describe("⚙️ Compile-Time Regex Type System Enforcements", () => {

	it("should match valid literal structures within exact length boundaries", () => {
		// 1. Declare the operational boundary (Pattern: id followed by 3 digits. Length: exactly 6)
		type BadgeCode<T extends string> = RegexAndLength<T, "id-\\d{3}", 6>;

		// 2. Validate that correct string literal keys map perfectly to themselves
		expectTypeOf<BadgeCode<"id-402">>().toEqualTypeOf<"id-402">();
		expectTypeOf<BadgeCode<"id-000">>().toEqualTypeOf<"id-000">();

		// 3. Verify that incorrect lengths or malformed structures yield the 'never' fallback type
		expectTypeOf<BadgeCode<"id-4029">>().toEqualTypeOf<never>(); // Too long
		expectTypeOf<BadgeCode<"id-40">>().toEqualTypeOf<never>();   // Too short
		expectTypeOf<BadgeCode<"id-abc">>().toEqualTypeOf<never>();  // Characters instead of numbers
	});

	it("should securely evaluate advanced string alternations", () => {
		// Pattern: 3 letters, a literal dot, and EITHER png OR jpg. Length: exactly 7
		type ImageAsset<T extends string> = RegexAndLength<T, "[abcdefghijklmnopqrstuvwxyz]{3}.(png|jpg)", 7>;

		// Valid branches pass compile checks
		expectTypeOf<ImageAsset<"img.png">>().toEqualTypeOf<"img.png">();
		expectTypeOf<ImageAsset<"pic.jpg">>().toEqualTypeOf<"pic.jpg">();

		// Invalid alternatives or structure fail to never
		expectTypeOf<ImageAsset<"img.gif">>().toEqualTypeOf<never>();  // Unregistered extension
		expectTypeOf<ImageAsset<"photo.jpg">>().toEqualTypeOf<never>(); // Length mismatch (8 chars)
		expectTypeOf<ImageAsset<"123.png">>().toEqualTypeOf<never>();  // Digits instead of lower alpha
	});

	it("should enforce runtime protection boundaries with identity constructors", () => {
		const assetCheck = assertSecureString("[abcdefghijklmnopqrstuvwxyz]{3}.(png|jpg)", 7);

		// This compiles perfectly!
		const validReference = assetCheck("img.png");
		expectTypeOf(validReference).toEqualTypeOf<"img.png">();

		// 1. Assert that an invalid extension string literal cannot match the valid return type
		expectTypeOf<Parameters<typeof assetCheck>[0]>().not.toMatchTypeOf<"img.gif">();

		// 2. Assert that an invalid length string literal cannot match the valid return type
		expectTypeOf<Parameters<typeof assetCheck>[0]>().not.toMatchTypeOf<"photo.jpg">();

		// 3. Assert that digits cannot match the lower alphabet restriction class
		expectTypeOf<Parameters<typeof assetCheck>[0]>().not.toMatchTypeOf<"123.png">();
	});
});

describe("🔄 Compile-Time Unwrapping and Conversion Utilities", () => {

	it("should successfully extract a tuple array of literal numbers from an IP string", () => {
		type IPNumbers = UnwrapIP<"192.168.1.254">;

		// Assert that the extracted type matches the exact numeric tuple array structure
		expectTypeOf<IPNumbers>().toEqualTypeOf<[192, 168, 1, 254]>();
	});

	it("should successfully extract an object schema of literal numbers from a DateTime string", () => {
		type DateNumbers = UnwrapDateTime<"2026-05-21 14:30:05">;

		// Assert that the extracted type matches the mapped time metadata structure
		expectTypeOf<DateNumbers>().toEqualTypeOf<{
			year: 2026;
			month: 5;
			day: 21;
			hour: 14;
			minute: 30;
			second: 5;
		}>();
	});
});
