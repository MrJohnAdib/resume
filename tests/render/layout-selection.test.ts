import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";
import { loadResumeConfig } from "../../src/config/load.ts";
import { renderCompactResume } from "../../src/render/compact.ts";
import { renderDetailedResume } from "../../src/render/detailed.ts";
import { validateResume } from "../../src/schema/validate.ts";

async function loadResume(layout?: string) {
	const loaded = await loadResumeConfig(
		path.resolve("resume.config.json"),
		layout,
	);
	return validateResume(loaded);
}

test("derives the layout name from the layout filename", async () => {
	assert.equal((await loadResume()).layout.name, "compact");
	assert.equal(
		(await loadResume("layouts/detailed.json")).layout.name,
		"detailed",
	);
});

test("omits layout-scoped bullets from other layouts", async () => {
	const html = renderCompactResume(await loadResume());
	assert.doesNotMatch(
		html,
		/Established E2E tests covering 100% sensitive flows/,
	);
	assert.doesNotMatch(html, /Automated deployment process with CI\/CD/);
	assert.doesNotMatch(html, /data-item-id="2006-teacher"/);
	assert.doesNotMatch(html, /data-item-id="2010-worldskills"/);
});

test("selects layout-scoped bullets when their layout is active", async () => {
	const resume = await loadResume("layouts/detailed.json");
	const html = renderDetailedResume(resume);
	assert.match(html, /Established E2E tests covering 100% sensitive flows/);
	assert.match(html, /Automated deployment process with CI\/CD/);
	assert.match(html, /Improved platform performance/);
	assert.doesNotMatch(html, /Spearheaded a 15-member cross-functional/);
});
