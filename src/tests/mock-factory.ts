import { IPAddressv4String, DateTimeString, DateString, TimeString, IntegerString } from "../primitives.js";

export const MockFactory = {
	/**
	 * Generates a structurally valid random IPv4 Address
	 */
	ip(): IPAddressv4String<string> {
		const r = () => Math.floor(Math.random() * 256);
		return `${r()}.${r()}.${r()}.${r()}` as IPAddressv4String<string>;
	},

	/**
	 * Generates a valid formatted DateTime string based on a Date object
	 */
	dateTime(baseDate = new Date()): DateTimeString<string> {
		const pad = (n: number) => String(n).padStart(2, "0");
		const yyyy = baseDate.getFullYear();
		const MM = pad(baseDate.getMonth() + 1);
		const dd = pad(baseDate.getDate());
		const hh = pad(baseDate.getHours());
		const mm = pad(baseDate.getMinutes());
		const ss = pad(baseDate.getSeconds());
		return `${yyyy}-${MM}-${dd} ${hh}:${mm}:${ss}` as DateTimeString<string>;
	},

	/**
   * Generates a valid isolated Date string
   */
	date(baseDate = new Date()): DateString<string> {
		// Cast to string first so TypeScript allows standard runtime string methods
		const dateTimeStr = MockFactory.dateTime(baseDate) as string;
		return dateTimeStr.split(" ")[0] as DateString<string>;
	},

	/**
	 * Generates a valid isolated Time string
	 */
	time(baseDate = new Date()): TimeString<string> {
		// Cast to string first so TypeScript allows standard runtime string methods
		const dateTimeStr = MockFactory.dateTime(baseDate) as string;
		return dateTimeStr.split(" ")[1] as TimeString<string>;
	},

	/**
	 * Generates a valid whole number string up to 5 digits
	 */
	integerStr(min = -9999, max = 99999): IntegerString<string> {
		const val = Math.floor(Math.random() * (max - min + 1)) + min;
		return String(val) as IntegerString<string>;
	},

	/**
	 * Malformed values to intentionally trigger failure responses in tests
	 */
	corrupted: {
		ip: () => "192.168.1.999",       // Out of range octet
		ipLeadingZero: () => "10.0.0.01", // Invalid leading zero
		dateTime: () => "2026-02-31 12:00:00", // Non-existent date (Feb 31)
		dateTimeFormat: () => "2026/05/21 12:00", // Bad format dividers
		integer: () => "42.5",            // Float decimal
	}
};
