import assert from "node:assert/strict";
import { mkdtemp, writeFile } from "node:fs/promises";
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

	await assert.rejects(
		() => checkLayout(output),
		/section "experience" near item "oversized"/,
	);
});
