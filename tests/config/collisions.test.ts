import assert from "node:assert/strict";
import test from "node:test";
import { generatedKeys } from "../../src/config/keys.ts";
import { LayoutSourceSchema } from "../../src/schema/layout.ts";

const page = {
	label: "Compact",
	size: "A4",
	width: "210mm",
	height: "296mm",
	screenPadding: "24px",
	outerMargin: "1rem",
	columnGap: "1rem",
	leftColumn: "50%",
	rightColumn: "50%",
};
const theme = {
	primary: "#000000",
	primaryHover: "#000000",
	primaryFocus: "#000000",
	pageBackground: "#ffffff",
	headerBackground: "#ffffff",
	contactBackground: "#ffffff",
	screenBackground: "#ffffff",
	screenBackgroundDark: "#000000",
	text: "#000000",
	heading: "#000000",
	muted: "#000000",
};
const typography = {
	bodyFont: "sans-serif",
	rtlFont: "sans-serif",
	nameSize: "1rem",
	titleSize: "1rem",
	bodySize: "1rem",
	detailSize: "1rem",
	bodyLineHeight: "1",
};

test("rejects colliding generated keys", () => {
	assert.throws(
		() => generatedKeys(["Same", "Same"], (value) => value),
		/Duplicate generated key "same"/,
	);
	assert.deepEqual(
		generatedKeys(["C", "C++", "C#"], (value) => value).map(([key]) => key),
		["c", "c-plus-plus", "c-sharp"],
	);
});

test("rejects repeated sections and roles in a layout", () => {
	const source = {
		page,
		theme,
		typography,
		sections: [
			{ type: "experience", column: "left" },
			{ type: "experience", column: "right" },
		],
		roles: {
			experience: ["first", "first"],
			volunteering: ["volunteer"],
		},
	};

	assert.equal(LayoutSourceSchema.safeParse(source).success, false);
});
