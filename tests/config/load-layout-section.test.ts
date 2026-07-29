import assert from "node:assert/strict";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { loadLayoutSection } from "../../src/config/load-layout-section.ts";

async function writeJson(file: string, value: unknown) {
	await mkdir(path.dirname(file), { recursive: true });
	await writeFile(file, JSON.stringify(value));
}

test("loads layout selections from multiple ordered files", async () => {
	const root = await mkdtemp(path.join(tmpdir(), "resume-layout-"));
	const manifest = path.join(root, "index.json");
	await writeJson(manifest, { items: ["second.json", "first.json"] });
	await writeJson(path.join(root, "first.json"), { id: "first", fields: [] });
	await writeJson(path.join(root, "second.json"), { id: "second", fields: [] });

	const result = await loadLayoutSection(manifest);
	const items = result.items as Array<{ id: string }>;

	assert.deepEqual(
		items.map(({ id }) => id),
		["second", "first"],
	);
});
