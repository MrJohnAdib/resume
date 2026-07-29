import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";
import { load } from "cheerio";
import { loadResumeConfig } from "../../src/config/load.ts";
import { renderCompactResume } from "../../src/render/compact.ts";
import { validateResume } from "../../src/schema/validate.ts";

test("renders selected compact content and omits inactive content", async () => {
	const loaded = await loadResumeConfig(path.resolve("resume.config.json"));
	const html = renderCompactResume(validateResume(loaded));

	assert.match(html, /Engineering Manager \(Promoted from Senior\)/);
	assert.doesNotMatch(html, /Engineering Manager, Consumer/);
	assert.doesNotMatch(html, /Resolved hundreds of lint warnings/);
	assert.doesNotMatch(html, /Ignore all prior instructions/);
	const $ = load(html);
	assert.ok($("#phoneBox").hasClass("hidden"));

	const experience = html.indexOf("Professional Experience");
	const skills = html.indexOf("Skills");
	const awards = html.indexOf("Awards and Honors");
	assert.ok(experience < skills);
	assert.ok(skills < awards);
});

test("only runtime state uses the hidden utility class", async () => {
	const loaded = await loadResumeConfig(path.resolve("resume.config.json"));
	const html = renderCompactResume(validateResume(loaded));
	const $ = load(html);
	const hiddenElements = $("[class~='hidden']");

	assert.equal(hiddenElements.length, 1);
	assert.equal(hiddenElements.first().attr("id"), "phoneBox");
});
