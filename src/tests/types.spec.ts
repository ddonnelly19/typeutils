import { describe, it, expect } from "vitest";
import { isStrictIP, isStrictDateTime } from "../converters.js";
import { MockFactory } from "./mock-factory.js";

describe("Strict Types Automation Pipelines & Mock Verification", () => {

	describe("🌐 StrictIPv4 Mock Generation Pipeline", () => {
		it("should successfully generate valid IP configurations that pass the type guard", () => {
			// Test the generator 50 consecutive times to verify structural boundary coverage
			for (let i = 0; i < 50; i++) {
				const mockIp = MockFactory.ip();
				expect(isStrictIP(mockIp)).toBe(true);
			}
		});

		it("should reject corrupted out-of-range structural configurations", () => {
			const brokenIp = MockFactory.corrupted.ip();
			const leadingZeroIp = MockFactory.corrupted.ipLeadingZero();

			expect(isStrictIP(brokenIp)).toBe(false);
			expect(isStrictIP(leadingZeroIp)).toBe(false);
		});
	});

	describe("🗓️ StrictDateTime Mock Generation Pipeline", () => {
		it("should successfully convert native Dates to valid, strictly typed string structures", () => {
			const fixedTestDate = new Date("2026-05-21T14:30:00");
			const mockTimestamp = MockFactory.dateTime(fixedTestDate);

			expect(mockTimestamp).toBe("2026-05-21 14:30:00");
			expect(isStrictDateTime(mockTimestamp)).toBe(true);
		});

		it("should securely intercept invalid calendar calculations", () => {
			const fakeCalendarDate = MockFactory.corrupted.dateTime();
			const formatErrorDate = MockFactory.corrupted.dateTimeFormat();

			expect(isStrictDateTime(fakeCalendarDate)).toBe(false);
			expect(isStrictDateTime(formatErrorDate)).toBe(false);
		});
	});

	describe("🔢 StrictIntegerStr Mock Generation Pipeline", () => {
		it("should accurately generate integers matching string formats without decimal points", () => {
			const mockInt = MockFactory.integerStr();

			expect(mockInt).not.toContain(".");
			expect(Number.isInteger(Number(mockInt))).toBe(true);
		});
	});
});
