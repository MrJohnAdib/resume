import assert from "node:assert/strict";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { checkLayout } from "../../scripts/check-layout.ts";

test("browser layout check reports the overflowing section and item", async () => {
	const output = await mkdtemp(path.join(os.tmpdir(), "resume-layout-"));
	await writeFile(
		path.join(output, "index.html"),
		[
			'<div id="printArea" data-overflow-policy="error"',
			' data-page-width="210mm" data-page-height="296mm">',
			'<main><article data-section-id="experience">',
			'<div data-item-id="oversized" style="height:400mm"></div>',
			"</article></main></div>",
		].join(""),
	);
	const baseline = path.join(output, "legacy.html");
	await writeFile(
		baseline,
		'<div id="printArea"><main style="height:100mm"></main></div>',
	);

	await assert.rejects(
		() => checkLayout(output, baseline),
		/section "experience" near item "oversized"/,
	);
});

test("allows the same platform-specific overflow as the legacy page", async () => {
	const root = await mkdtemp(path.join(os.tmpdir(), "resume-baseline-"));
	const output = path.join(root, "dist");
	await mkdir(output);
	const html = [
		'<div id="printArea" data-overflow-policy="error"',
		' data-page-width="210mm" data-page-height="296mm">',
		'<main><div style="height:300mm"></div></main></div>',
	].join("");
	await writeFile(path.join(output, "index.html"), html);
	const baseline = path.join(root, "legacy.html");
	await writeFile(baseline, html);

	await checkLayout(output, baseline);
});

test("rejects a baseline with missing local resources", async () => {
	const root = await mkdtemp(path.join(os.tmpdir(), "resume-assets-"));
	const output = path.join(root, "dist");
	await mkdir(output);
	const html = '<div id="printArea"><main></main></div>';
	await writeFile(path.join(output, "index.html"), html);
	const baseline = path.join(root, "legacy.html");
	await writeFile(
		baseline,
		`<link rel="stylesheet" href="./missing.css">${html}`,
	);

	await assert.rejects(
		() => checkLayout(output, baseline),
		/baseline layout.*missing\.css/,
	);
});
