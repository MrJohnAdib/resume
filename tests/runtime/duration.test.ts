import assert from "node:assert/strict";
import test from "node:test";
import { formatDuration } from "../../src/runtime/duration.js";

test("formats ongoing roles using inclusive calendar months", () => {
	const result = formatDuration(
		new Date("2024-12-16T00:00:00Z"),
		new Date("2026-07-29T00:00:00Z"),
	);

	assert.equal(result, "(1 year 8 months)");
});
