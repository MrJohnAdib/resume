import assert from "node:assert/strict";
import test from "node:test";
import { generatedKeys } from "../../src/config/keys.ts";
import { LayoutSourceSchema } from "../../src/schema/layout.ts";

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

test("rejects repeated sections and items in a layout", () => {
	const source = {
		sections: [
			{ type: "experience", column: "left" },
			{ type: "experience", column: "right" },
		],
		order: {
			experience: ["first", "first"],
			skills: ["skills"],
			awards: ["award"],
			education: ["education"],
			volunteering: ["volunteer"],
		},
	};

	assert.equal(LayoutSourceSchema.safeParse(source).success, false);
});
