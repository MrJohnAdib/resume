import assert from "node:assert/strict";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { loadRoles } from "../../src/config/load-roles.ts";

const role = {
	title: "Engineer",
	organization: { name: "Example" },
	duration: "(1 year)",
	dates: { start: "2024-01", end: "2024-12" },
};

async function roleDirectory() {
	const directory = await mkdtemp(path.join(tmpdir(), "resume-roles-"));
	await Promise.all(
		["first", "second"].map((name) =>
			writeFile(
				path.join(directory, `${name}.json`),
				JSON.stringify({ ...role, title: name }),
			),
		),
	);
	return directory;
}

test("role filenames generate keys and layout order is authoritative", async () => {
	const directory = await roleDirectory();
	const roles = await loadRoles(directory, ["second", "first"]);

	assert.deepEqual(
		roles.map(({ id }) => id),
		["second", "first"],
	);
});

test("reports missing and unordered role files", async () => {
	const directory = await roleDirectory();

	await assert.rejects(
		() => loadRoles(directory, ["missing"]),
		/Missing role "missing"/,
	);
	await assert.rejects(
		() => loadRoles(directory, ["first"]),
		/Role "second" is not ordered/,
	);
});
