import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

test("single generated schema describes every editable contract", async () => {
	const schema = JSON.parse(
		await readFile(path.resolve("schema/resume.schema.json"), "utf8"),
	) as { $defs?: Record<string, unknown> };

	assert.deepEqual(Object.keys(schema.$defs ?? {}).sort(), [
		"awards",
		"education",
		"layout",
		"person",
		"role",
		"site",
		"skills",
		"summary",
	]);
});

test("VS Code associates editable JSON files with schema definitions", async () => {
	const settings = await readFile(
		path.resolve(".vscode/settings.json"),
		"utf8",
	);

	for (const name of [
		"site",
		"person",
		"summary",
		"skills",
		"awards",
		"education",
		"role",
		"layout",
	]) {
		assert.match(
			settings,
			new RegExp(`resume\\.schema\\.json#\\/\\$defs\\/${name}`),
		);
	}
});
