import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";
import { loadResumeConfig } from "../../src/config/load.ts";
import { renderCompactResume } from "../../src/render/compact.ts";
import { validateResume } from "../../src/schema/validate.ts";

test("section and repeated-item order come entirely from the layout", async () => {
	const loaded = await loadResumeConfig(path.resolve("resume.config.json"));
	const resume = validateResume(loaded);
	const sections = resume.layout.sections;
	assert.ok(sections?.experience);
	const experience = sections.experience.items;
	resume.layout.sectionOrder = [
		{ id: "awards", column: "left" },
		{ id: "experience", column: "left" },
	];
	sections.experience.items = [...experience].reverse();

	const html = renderCompactResume(resume);
	assert.ok(
		html.indexOf("Awards and Honors") < html.indexOf("Professional Experience"),
	);
	assert.ok(html.indexOf("CodeYourFuture") < html.indexOf("Zapp"));
});
