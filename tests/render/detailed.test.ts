import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";
import { loadResumeConfig } from "../../src/config/load.ts";
import { renderDetailedResume } from "../../src/render/detailed.ts";
import { validateResume } from "../../src/schema/validate.ts";

async function renderDetailed() {
	const loaded = await loadResumeConfig(
		path.resolve("resume.config.json"),
		"layouts/detailed.json",
	);
	return renderDetailedResume(validateResume(loaded));
}

test("renders three pages with the header only on page one", async () => {
	const html = await renderDetailed();
	const pages = [...html.matchAll(/data-page="(\d)"/g)].map(([, n]) => n);

	assert.deepEqual(pages, ["1", "2", "3"]);
	assert.equal(html.match(/schema\.org\/Person/g)?.length, 1);
	assert.ok(html.indexOf("schema.org/Person") < html.indexOf('data-page="2"'));
});

test("assigns sections and records to their configured pages", async () => {
	const html = await renderDetailed();
	const page2 = html.indexOf('data-page="2"');
	const page3 = html.indexOf('data-page="3"');

	const consumer = html.indexOf(
		'data-item-id="2026-zapp-consumer-engineering-manager"',
	);
	assert.ok(consumer > 0 && consumer < page2);
	assert.ok(html.indexOf('data-item-id="2017-tejarak"') < page2);
	const teacher = html.indexOf('data-item-id="2006-teacher"');
	assert.ok(teacher > page2 && teacher < page3);
	for (const id of ["skills", "awards"]) {
		const section = html.indexOf(`data-section-id="${id}"`);
		assert.ok(section > page2 && section < page3, id);
	}
	for (const id of ["education", "volunteering"]) {
		assert.ok(html.indexOf(`data-section-id="${id}"`) > page3, id);
	}
});

test("shows detailed-only content and keeps hidden records hidden", async () => {
	const html = await renderDetailed();

	assert.match(html, /Relevant Coursework/);
	assert.doesNotMatch(html, /Tehran|Nour|Yazd|Mashhad/);
	assert.match(html, /data-item-id="2006-teacher"/);
	assert.match(html, /data-item-id="2010-worldskills"/);
	assert.match(html, /data-item-id="2024-zapp-senior-software-engineer"/);
	assert.match(html, /data-item-id="2026-zapp-consumer-engineering-manager"/);
	assert.match(html, /data-item-id="2010-worldskills-silver-medal"/);
	assert.doesNotMatch(html, /data-item-id="2024-zapp-engineering-manager"/);
	assert.doesNotMatch(
		html,
		/data-item-id="2024-worlds-most-influential-mentor"/,
	);
});

test("links assets and metadata for the /cv/ route", async () => {
	const html = await renderDetailed();

	assert.match(html, /href="\.\.\/style\/style\.min\.css\?v=19"/);
	assert.match(html, /href="\.\.\/style\/detailed\.css\?v=4"/);
	assert.match(html, /src="\.\.\/script\/resume\.js\?v=7"/);
	assert.match(
		html,
		/property="og:url" content="https:\/\/resume\.MrAdib\.com\/cv\/"/,
	);
	assert.match(html, /Detailed CV/);
});
