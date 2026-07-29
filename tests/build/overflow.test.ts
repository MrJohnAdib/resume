import assert from "node:assert/strict";
import test from "node:test";
import { findOverflow } from "../../src/layout/overflow.ts";

test("reports the first item that exceeds the compact page", () => {
	const page = { top: 0, right: 794, bottom: 1118, left: 0 };
	const items = [
		{ id: "fits", top: 100, right: 700, bottom: 900, left: 10 },
		{ id: "too-long", top: 900, right: 700, bottom: 1140, left: 10 },
	];

	assert.equal(findOverflow(page, items)?.id, "too-long");
});
