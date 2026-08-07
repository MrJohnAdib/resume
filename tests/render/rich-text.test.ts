import assert from "node:assert/strict";
import test from "node:test";
import { richText } from "../../src/render/rich-text.ts";

test("renders structured superscript and abbreviation nodes", () => {
	const result = richText([
		{ type: "text", value: "Ranked 5" },
		{ type: "sup", value: "th" },
		{ type: "text", value: " with " },
		{ type: "abbr", value: "AI", title: "Artificial Intelligence" },
	]);

	assert.equal(
		result.toString(),
		'Ranked 5<sup>th</sup> with <abbr title="Artificial Intelligence">AI</abbr>',
	);
});

test("escapes all structured rich-text values", () => {
	const result = richText([
		{ type: "text", value: "<script>alert(1)</script>" },
		{ type: "abbr", value: "<AI>", title: '" onmouseover="alert(1)' },
	]);

	assert.doesNotMatch(result.toString(), /<script>|onmouseover="/);
	assert.match(result.toString(), /&lt;script&gt;/);
});
