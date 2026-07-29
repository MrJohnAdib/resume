import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";
import { extractLegacySections } from "../../src/migration/extract-sections.ts";

test("extracts every legacy section item and its compact selection", async () => {
	const result = await extractLegacySections(
		path.resolve("tests/fixtures/legacy-index.html"),
	);

	assert.equal(result.content.experience.length, 11);
	assert.equal(result.content.skills.length, 30);
	assert.equal(result.content.awards.length, 10);
	assert.equal(result.content.education.length, 2);
	assert.equal(result.content.volunteering.length, 4);
	assert.equal(result.layout.experience.items.length, 8);
	assert.equal(result.layout.skills.items.length, 16);
	assert.equal(result.layout.awards.items.length, 4);
	assert.equal(result.layout.volunteering.items.length, 3);

	const zapp = result.content.experience[0];
	assert.equal(zapp.id, "engineering-manager-promoted-from-senior");
	assert.equal(zapp.status, "current");
	assert.equal(zapp.bullets.length, 8);
	assert.equal(result.content.experience[1].status, "alternate");
	assert.equal(zapp.organization.name, "Zapp");
	assert.equal(zapp.dates.end.datetime, "present");

	const masters = result.content.education[0];
	assert.equal(masters.employmentType, "Part-time");
	assert.equal(
		masters.thesis?.text,
		"Critical success factors in SME e-business - FinTech case study",
	);
	assert.equal(masters.thesis?.status, "alternate");
	assert.deepEqual(
		masters.coursework.slice(0, 2).map(({ status }) => status),
		["current", "alternate"],
	);

	const tourism = result.content.awards.find(
		({ id }) => id === "the-best-corporate-tourism-website",
	);
	assert.ok(tourism);
	assert.deepEqual(tourism.description, [
		{ type: "text", value: "5" },
		{ type: "sup", value: "th" },
		{ type: "text", value: " IR Web Festival" },
	]);
});
