import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";
import { load } from "cheerio";
import { loadResumeConfig } from "../../src/config/load.ts";
import { renderCompactResume } from "../../src/render/compact.ts";
import { validateResume } from "../../src/schema/validate.ts";

test("layout fields and technology IDs are authoritative", async () => {
	const resume = validateResume(
		await loadResumeConfig(path.resolve("resume.config.json")),
	);
	const selected = resume.layout.sections.experience.items[0];
	assert.ok(selected);
	selected.fields = selected.fields.filter((field) => field !== "duration");
	selected.fields.push("technologies");
	selected.technologies = ["typescript"];

	const $ = load(renderCompactResume(resume));
	const role = $('[data-item-id="engineering-manager-promoted-from-senior"]');
	assert.doesNotMatch(role.text(), /\(1 year 8 months\)/);
	assert.match(role.text(), /Tech Stack/);
	assert.match(role.text(), /TypeScript/);
});

test("content status never overrides explicit layout link selection", async () => {
	const resume = validateResume(
		await loadResumeConfig(path.resolve("resume.config.json")),
	);
	const website = resume.person.links.items.find(({ id }) => id === "website");
	assert.ok(website);
	website.status = "archived";

	const $ = load(renderCompactResume(resume));
	assert.equal($('nav a[title="MrAdib.com"]').length, 1);
	assert.equal($('nav a[title="@MrAdib"]').length, 1);
	assert.equal($('nav a[href*="twitter"]').length, 0);
});
