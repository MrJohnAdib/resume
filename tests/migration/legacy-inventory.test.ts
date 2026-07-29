import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";
import { inventoryLegacyResume } from "../../src/migration/inventory.ts";

test("inventories visible, hidden, and commented legacy content", async () => {
	const file = path.resolve("tests/fixtures/legacy-index.html");
	const inventory = await inventoryLegacyResume(file);

	assert.deepEqual(inventory.sectionItems, {
		experience: 11,
		skills: 30,
		awards: 10,
		education: 2,
		volunteering: 4,
	});
	assert.equal(inventory.hiddenElements, 100);
	assert.equal(inventory.comments, 69);
	assert.ok(
		inventory.hiddenText.some((text) =>
			text.includes("Engineering Manager, Consumer"),
		),
	);
	assert.ok(inventory.commentText.some((text) => text.includes("Open-source")));
});
