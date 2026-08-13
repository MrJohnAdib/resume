import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";
import { loadResumeConfig } from "../../src/config/load.ts";
import { renderCvResume } from "../../src/render/cv.ts";
import { validateResume } from "../../src/schema/validate.ts";

async function renderLayout(layout: string) {
	const loaded = await loadResumeConfig(
		path.resolve("resume.config.json"),
		layout,
	);
	return renderCvResume(validateResume(loaded));
}

test("ic-detailed renders three pages with the IC title", async () => {
	const html = await renderLayout("layouts/ic-detailed.json");
	const pages = [...html.matchAll(/data-page="(\d)"/g)].map(([, n]) => n);

	assert.deepEqual(pages, ["1", "2", "3"]);
	assert.match(html, /Software Engineer &amp; Tech Lead/);
	assert.match(html, /Hands-on engineer who ships fast/);
	assert.doesNotMatch(html, /Leads teams that ship fast/);
	assert.match(html, /Authored the levelling and pay bands/);
	assert.match(html, /data-section-id="talks"/);
	assert.match(html, /data-item-id="2025-ai-coding-summit"/);
	assert.match(
		html,
		/property="og:url" content="https:\/\/resume\.MrAdib\.com\/ic\/"|property="og:url" content="https:\/\/resume\.MrAdib\.com\/ic-cv\/"/,
	);
});

test("ic-one renders one page with IC records and title", async () => {
	const html = await renderLayout("layouts/ic-one.json");
	const pages = [...html.matchAll(/data-page="(\d)"/g)].map(([, n]) => n);

	assert.deepEqual(pages, ["1"]);
	assert.match(html, /Software Engineer &amp; Tech Lead/);
	for (const id of [
		"2024-zapp-engineering-manager",
		"2022-loopla",
		"2019-jibres",
		"2015-sarshomar",
	]) {
		assert.match(html, new RegExp(`data-item-id="${id}"`), id);
	}
	assert.doesNotMatch(html, /data-item-id="leadership"/);
	assert.doesNotMatch(html, /data-section-id="talks"/);
});

test("detailed and one keep the Engineering Manager title", async () => {
	for (const layout of ["layouts/detailed.json", "layouts/one.json"]) {
		const html = await renderLayout(layout);
		assert.match(html, /itemprop="jobTitle">Engineering Manager</, layout);
	}
});
