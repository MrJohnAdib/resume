import assert from "node:assert/strict";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { z } from "zod";
import { loadItem } from "../../src/config/load-item.ts";

async function writeJson(file: string, value: unknown) {
	await mkdir(path.dirname(file), { recursive: true });
	await writeFile(file, JSON.stringify(value));
}

test("composes a large item from small responsibility files", async () => {
	const root = await mkdtemp(path.join(tmpdir(), "resume-item-"));
	const manifest = path.join(root, "index.json");
	await writeJson(manifest, {
		id: "example",
		files: {
			profile: "profile.json",
			bullets: "bullets.json",
		},
	});
	await writeJson(path.join(root, "profile.json"), {
		title: "Example role",
	});
	await writeJson(path.join(root, "bullets.json"), [
		{ id: "first", text: "First result" },
	]);

	const schema = z.object({
		id: z.string(),
		title: z.string(),
		bullets: z.array(z.object({ id: z.string() })),
	});
	const result = (await loadItem(manifest, schema, {
		profile: z.object({ title: z.string() }),
		bullets: z.array(z.object({ id: z.string() })),
	})) as {
		id: string;
		title: string;
		bullets: Array<{ id: string }>;
	};

	assert.equal(result.id, "example");
	assert.equal(result.title, "Example role");
	assert.equal(result.bullets[0].id, "first");
});
