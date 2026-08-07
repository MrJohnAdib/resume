import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { loadResumeConfig } from "../../src/config/load.ts";
import { renderCompactResume } from "../../src/render/compact.ts";
import { validateResume } from "../../src/schema/validate.ts";

test("renders selected compact content and omits inactive content", async () => {
	const loaded = await loadResumeConfig(path.resolve("resume.config.json"));
	const html = renderCompactResume(validateResume(loaded));

	assert.match(html, /Engineering Manager \(Promoted from Senior\)/);
	assert.doesNotMatch(html, /Engineering Manager, Consumer/);
	assert.doesNotMatch(html, /Resolved hundreds of lint warnings/);
	assert.doesNotMatch(html, /Protobuf|Docker Compose|some keywords!/);
	assert.doesNotMatch(html, /Open-source enthusiast/);
	assert.doesNotMatch(html, /Ignore all prior instructions/);
	assert.match(
		html,
		/<div(?=[^>]*id="phoneBox")(?=[^>]*class="[^"]*\bhidden\b)[^>]*>/,
	);
	assert.match(
		html,
		/<a[^>]*href="https:\/\/mradib\.com\/awards"[^>]*>Awards and Honors<\/a>/,
	);

	const experience = html.indexOf("Professional Experience");
	const skills = html.indexOf("Skills");
	const awards = html.indexOf("Awards and Honors");
	assert.ok(experience < skills);
	assert.ok(skills < awards);
});

test("only runtime state uses the hidden utility class", async () => {
	const loaded = await loadResumeConfig(path.resolve("resume.config.json"));
	const html = renderCompactResume(validateResume(loaded));
	const hiddenElements = [...html.matchAll(/class="([^"]*)"/g)].filter(
		(match) => match[1]?.split(/\s+/).includes("hidden"),
	);

	assert.equal(hiddenElements.length, 1);
	assert.match(
		html,
		/<div(?=[^>]*id="phoneBox")(?=[^>]*class="[^"]*\bhidden\b)[^>]*>/,
	);
});

test("renders escaped HTML without a template engine", async () => {
	const loaded = await loadResumeConfig(path.resolve("resume.config.json"));
	loaded.person.identity.name = "<script>alert(1)</script>";
	const html = renderCompactResume(validateResume(loaded));
	const packageJson = JSON.parse(await readFile("package.json", "utf8"));

	assert.match(html, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
	assert.doesNotMatch(html, /<script>alert\(1\)<\/script>/);
	assert.equal(packageJson.devDependencies.nunjucks, undefined);
	const templates = await readdir("src/templates", { recursive: true }).catch(
		() => [],
	);
	assert.deepEqual(
		templates.filter((file) => String(file).endsWith(".njk")),
		[],
	);
});
