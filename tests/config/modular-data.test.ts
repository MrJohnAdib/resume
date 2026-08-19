import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

async function jsonFiles(directory: string): Promise<string[]> {
	const entries = await readdir(directory, { withFileTypes: true });
	const nested = await Promise.all(
		entries.map((entry) => {
			const file = path.join(directory, entry.name);
			return entry.isDirectory()
				? jsonFiles(file)
				: Promise.resolve(file.endsWith(".json") ? [file] : []);
		}),
	);
	return nested.flat();
}

async function json(file: string) {
	return JSON.parse(await readFile(file, "utf8")) as Record<string, unknown>;
}

test("uses focused profile, site, skill, award, and education files", async () => {
	const rootFiles = (await readdir("data"))
		.filter((file) => file.endsWith(".json"))
		.sort();

	assert.deepEqual(rootFiles, ["profile.json", "summary.json"]);
	assert.equal((await jsonFiles("data/site")).length, 5);
	assert.ok((await jsonFiles("data/skills")).length > 10);
	assert.ok((await jsonFiles("data/awards")).length > 1);
	assert.ok((await jsonFiles("data/education")).length > 1);

	const metadata = await json("data/site/metadata.json");
	assert.ok(Array.isArray(metadata.keywords));
});

test("uses year-first record filenames and derives role durations", async () => {
	for (const directory of ["data/experience", "data/volunteering"]) {
		const files = await jsonFiles(directory);
		for (const file of files) {
			assert.match(path.basename(file), /^\d{4}-[a-z0-9-]+\.json$/);
			const role = await json(file);
			const dates = role.dates as {
				start: string | { value: string };
			};
			const start =
				typeof dates.start === "string" ? dates.start : dates.start.value;
			assert.equal(path.basename(file).slice(0, 4), start.slice(0, 4));
			assert.equal("duration" in role, false, file);
			assert.doesNotMatch(String(role.location ?? ""), /\bIR\b/, file);
		}
	}
});

test("prefixes award filenames with their award year", async () => {
	for (const file of await jsonFiles("data/awards")) {
		const award = await json(file);
		const date = award.date as { datetime: string };
		assert.equal(path.basename(file).slice(0, 4), date.datetime.slice(0, 4));
	}
});
