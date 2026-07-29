import assert from "node:assert/strict";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { checkCssAssets, checkHtmlAssets } from "../../src/build/assets.ts";

test("checks local asset references and ignores remote links", async () => {
	const root = await mkdtemp(path.join(os.tmpdir(), "resume-assets-"));
	await mkdir(path.join(root, "style"));
	await writeFile(path.join(root, "style/main.css"), "");
	const html = [
		'<link href="./style/main.css?v=1">',
		'<a href="https://example.com">remote</a>',
		'<a href="#contact">anchor</a>',
	].join("");

	await assert.doesNotReject(() => checkHtmlAssets(html, root, "index.html"));
});

test("reports the source document and missing asset", async () => {
	const root = await mkdtemp(path.join(os.tmpdir(), "resume-assets-"));
	const html = '<img src="./img/missing.png">';

	await assert.rejects(
		() => checkHtmlAssets(html, root, "index.html"),
		/index\.html references missing asset img\/missing\.png/,
	);
});

test("checks assets referenced from generated stylesheets", async () => {
	const root = await mkdtemp(path.join(os.tmpdir(), "resume-assets-"));
	const css = '@font-face { src: url("../fonts/missing.woff2") }';

	await assert.rejects(
		() => checkCssAssets(css, root, "style/main.css"),
		/style\/main\.css references missing asset fonts\/missing\.woff2/,
	);
});

test("rejects references that escape the deployable artifact", async () => {
	const root = await mkdtemp(path.join(os.tmpdir(), "resume-assets-"));

	await assert.rejects(
		() => checkHtmlAssets('<a href="../outside.html">', root, "index.html"),
		/index\.html references asset outside build root/,
	);
});
