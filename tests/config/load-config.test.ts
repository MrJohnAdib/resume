import assert from "node:assert/strict";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { loadResumeConfig } from "../../src/config/load.ts";

test("loads the complete modular repository configuration", async () => {
	const result = (await loadResumeConfig(
		path.resolve("resume.config.json"),
	)) as {
		site: { metadata: { title: string } };
		person: { identity: { name: string } };
		sections: { experience: { items: Array<{ id: string }> } };
		layout: { sections: Array<{ column: string }> };
	};

	assert.equal(
		result.site.metadata.title,
		"John Adib - Engineering Leader & Mentor - Resume",
	);
	assert.equal(result.person.identity.name, "John Adib");
	assert.equal(
		result.sections.experience.items[0]?.id,
		"engineering-manager-promoted-from-senior",
	);
	assert.equal(result.layout.sections[0]?.column, "left");
});

test("reports the source file and JSON path for entry errors", async () => {
	const root = await mkdtemp(path.join(tmpdir(), "resume-config-"));
	const file = path.join(root, "resume.config.json");
	await writeFile(file, JSON.stringify({}));

	await assert.rejects(
		() => loadResumeConfig(file),
		new RegExp(`${file.replaceAll("/", "\\/")} at \\$\\.site`),
	);
});
