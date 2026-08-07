import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";
import { loadResumeConfig } from "../../src/config/load.ts";
import { renderCvResume } from "../../src/render/cv.ts";
import { validateResume } from "../../src/schema/validate.ts";

async function renderOne() {
	const loaded = await loadResumeConfig(
		path.resolve("resume.config.json"),
		"layouts/one.json",
	);
	return renderCvResume(validateResume(loaded));
}

test("renders a single page with header and selected sections", async () => {
	const html = await renderOne();
	const pages = [...html.matchAll(/data-page="(\d)"/g)].map(([, n]) => n);

	assert.deepEqual(pages, ["1"]);
	assert.equal(html.match(/schema\.org\/Person/g)?.length, 1);
	for (const id of ["experience", "skills", "education"]) {
		assert.match(html, new RegExp(`data-section-id="${id}"`), id);
	}
	assert.doesNotMatch(html, /data-section-id="awards"/);
	assert.doesNotMatch(html, /data-section-id="volunteering"/);
});

test("selects only the records the layout lists", async () => {
	const html = await renderOne();

	for (const id of [
		"2024-zapp-engineering-manager",
		"2022-loopla",
		"ai-llm",
		"masters",
	]) {
		assert.match(html, new RegExp(`data-item-id="${id}"`), id);
	}
	for (const id of [
		"2019-jibres",
		"2018-ermile",
		"2026-zapp-consumer-engineering-manager",
		"2006-teacher",
		"css-framework",
	]) {
		assert.doesNotMatch(html, new RegExp(`data-item-id="${id}"`), id);
	}
});

test("links assets and metadata for the /one/ route", async () => {
	const html = await renderOne();

	assert.match(html, /href="\.\.\/style\/cv\.css\?v=1"/);
	assert.match(
		html,
		/property="og:url" content="https:\/\/resume\.MrAdib\.com\/one\/"/,
	);
	assert.match(html, /One-Page CV/);
});
