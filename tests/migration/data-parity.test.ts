import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { loadResumeConfig } from "../../src/config/load.ts";
import { readJson } from "../../src/config/read-json.ts";
import { extractLegacySections } from "../../src/migration/extract-sections.ts";
import { inventoryLegacyResume } from "../../src/migration/inventory.ts";

test("modular section data exactly matches the legacy extraction", async () => {
	const fixture = path.resolve("tests/fixtures/legacy-index.html");
	const extracted = await extractLegacySections(fixture);
	const loaded = (await loadResumeConfig(
		path.resolve("resume.config.json"),
	)) as {
		sections: Record<string, { items: unknown[] }>;
	};

	for (const id of Object.keys(extracted.content) as Array<
		keyof typeof extracted.content
	>) {
		assert.deepEqual(loaded.sections[id]?.items, extracted.content[id]);
	}
});

test("archives every legacy comment and the intentionally hidden footer", async () => {
	const fixture = path.resolve("tests/fixtures/legacy-index.html");
	const html = await readFile(fixture, "utf8");
	const inventory = await inventoryLegacyResume(fixture);
	const legacy = await readJson<{ comments: string[] }>(
		path.resolve("data/archive/legacy-values.json"),
	);
	const footer = await readJson<{ title: string; text: string }>(
		path.resolve("data/archive/hidden-footer.json"),
	);

	assert.deepEqual(legacy.comments, inventory.commentText);
	assert.ok(html.includes(footer.title));
	assert.ok(inventory.hiddenText.some((value) => value.includes(footer.text)));
});

test("preserves independently known hidden education and rich-text values", async () => {
	const masters = await readJson<{
		employmentType: string;
		thesis: { status: string; text: string };
	}>(
		path.resolve(
			"data/sections/education/m-s-in-information-technology-management.json",
		),
	);
	const award = await readJson<{ description: unknown }>(
		path.resolve(
			"data/sections/awards/the-best-corporate-tourism-website.json",
		),
	);

	assert.equal(masters.employmentType, "Part-time");
	assert.deepEqual(masters.thesis, {
		id: "thesis",
		status: "alternate",
		text: "Critical success factors in SME e-business - FinTech case study",
	});
	assert.deepEqual(award.description, [
		{ type: "text", value: "5" },
		{ type: "sup", value: "th" },
		{ type: "text", value: " IR Web Festival" },
	]);
});
