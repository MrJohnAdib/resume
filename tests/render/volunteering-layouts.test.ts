import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";
import { load } from "cheerio";
import { loadResumeConfig } from "../../src/config/load.ts";
import { renderCompactResume } from "../../src/render/compact.ts";
import { renderCvResume } from "../../src/render/cv.ts";
import { validateResume } from "../../src/schema/validate.ts";

async function volunteering(layout: "compact" | "detailed") {
	const resume = validateResume(
		await loadResumeConfig(
			path.resolve("resume.config.json"),
			`layouts/${layout}.json`,
		),
	);
	const html =
		layout === "compact" ? renderCompactResume(resume) : renderCvResume(resume);
	return load(html)('[data-section-id="volunteering"]');
}

test("compact volunteering uses a short heading and the charity CTO role", async () => {
	const section = await volunteering("compact");
	assert.equal(section.find("h2").text(), "Volunteering");
	assert.equal(section.find('[data-item-id="2017-khadije-charity"]').length, 1);
	assert.equal(section.find('[data-item-id="2026-worldskills-uk"]').length, 0);
});

test("detailed engagements retain the full heading and WorldSkills UK", async () => {
	const section = await volunteering("detailed");
	assert.equal(
		section.find("h2").text(),
		"Volunteering & Professional Engagements",
	);
	assert.equal(section.find('[data-item-id="2026-worldskills-uk"]').length, 1);
	assert.equal(section.find('[data-item-id="2017-khadije-charity"]').length, 1);
});
