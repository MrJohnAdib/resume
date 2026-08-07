import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

test("uses Zod without checked-in generated JSON Schema", async () => {
	await assert.rejects(() => access(path.resolve("schema/resume.schema.json")));
	await assert.rejects(() =>
		access(path.resolve("scripts/generate-schema.ts")),
	);
	const packageJson = JSON.parse(await readFile("package.json", "utf8"));
	assert.equal(packageJson.scripts.schema, undefined);
});

test("VS Code does not reference generated schema definitions", async () => {
	const settings = await readFile(
		path.resolve(".vscode/settings.json"),
		"utf8",
	);

	assert.doesNotMatch(settings, /resume\.schema\.json|json\.schemas/);
});
