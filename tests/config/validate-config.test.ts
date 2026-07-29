import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";
import { loadResumeConfig } from "../../src/config/load.ts";
import type { Resume } from "../../src/schema/resume.ts";
import { validateResume } from "../../src/schema/validate.ts";

async function loadRepositoryResume() {
	return (await loadResumeConfig(path.resolve("resume.config.json"))) as Resume;
}

test("rejects duplicate stable IDs within a section", async () => {
	const resume = await loadRepositoryResume();
	const first = resume.sections.experience.items[0];
	assert.ok(first);
	resume.sections.experience.items.push({ ...first });

	assert.throws(
		() => validateResume(resume),
		/Duplicate ID "engineering-manager-promoted-from-senior"/,
	);
});

test("rejects layout references to missing item IDs", async () => {
	const resume = await loadRepositoryResume();
	const selected = resume.layout.sections.experience.items[0];
	assert.ok(selected);
	selected.id = "missing";

	assert.throws(
		() => validateResume(resume),
		/Unknown item ID "missing" in "experience" layout/,
	);
});

test("reports nested failures with their source file and JSON path", async () => {
	const resume = await loadRepositoryResume();
	const selected = resume.layout.sections.experience.items[0];
	assert.ok(selected);
	selected.bullets = ["missing"];

	assert.throws(
		() => validateResume(resume),
		/layouts\/compact\/sections\/experience\/engineering-manager-promoted-from-senior\.json at \$\.bullets\[0\]/,
	);
});

test("rejects duplicate person links and invalid dates", async () => {
	const resume = await loadRepositoryResume();
	const firstLink = resume.person.links.items[0];
	assert.ok(firstLink);
	resume.person.links.items.push({ ...firstLink });
	assert.throws(() => validateResume(resume), /Duplicate ID "website"/);

	const datedResume = await loadRepositoryResume();
	const datedItem = datedResume.sections.experience.items[0];
	assert.ok(datedItem);
	datedItem.dates.start.datetime = "2024-99";
	assert.throws(
		() => validateResume(datedResume, "resume.config.json"),
		/resume\.config\.json at \$\.sections\.experience\.items\[0\]\.dates\.start\.datetime/,
	);
});

test("rejects duplicate section, item, and nested layout selections", async () => {
	const sectionResume = await loadRepositoryResume();
	const placement = sectionResume.layout.sectionOrder[0];
	assert.ok(placement);
	sectionResume.layout.sectionOrder.push(placement);
	assert.throws(
		() => validateResume(sectionResume),
		/Duplicate ID "experience" in layout section order/,
	);

	const itemResume = await loadRepositoryResume();
	const selection = itemResume.layout.sections.experience.items[0];
	assert.ok(selection);
	itemResume.layout.sections.experience.items.push(selection);
	assert.throws(
		() => validateResume(itemResume),
		/Duplicate ID "engineering-manager-promoted-from-senior"/,
	);
});

test("validates the repository compact resume", async () => {
	const resume = validateResume(await loadRepositoryResume());

	assert.equal(resume.person.identity.name, "John Adib");
	assert.equal(resume.sections.experience.items.length, 11);
	assert.equal(resume.layout.sections.skills.items.length, 16);
});
