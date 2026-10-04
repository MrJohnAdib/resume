import assert from "node:assert/strict";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { checkCvLayout } from "../../scripts/check-cv-layout.ts";

async function fixture(contentHeight: string) {
	const output = await mkdtemp(path.join(os.tmpdir(), "resume-cv-layout-"));
	await mkdir(path.join(output, "cv"));
	await writeFile(
		path.join(output, "cv/index.html"),
		[
			'<div id="printArea" data-page-width="210mm" data-page-height="296mm">',
			'<div class="page" style="height:296mm">',
			`<main style="height:${contentHeight}"></main>`,
			"</div></div>",
		].join(""),
	);
	return output;
}

test("CV layout accepts content within its configured page height", async () => {
	await checkCvLayout(await fixture("295mm"), [{ route: "cv/", pages: 1 }]);
});

test("CV layout rejects content beyond its configured page height", async () => {
	const output = await fixture("297mm");
	await assert.rejects(
		() => checkCvLayout(output, [{ route: "cv/", pages: 1 }]),
		/cv\/ overflow on page 1.*main/,
	);
});
