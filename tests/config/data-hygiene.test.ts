import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

async function jsonFiles(root: string): Promise<string[]> {
	const entries = await readdir(root, { withFileTypes: true });
	const nested = await Promise.all(
		entries.map((entry) => {
			const file = path.join(root, entry.name);
			return entry.isDirectory()
				? jsonFiles(file)
				: Promise.resolve(entry.name.endsWith(".json") ? [file] : []);
		}),
	);
	return nested.flat();
}

function emptyValue(value: unknown, location = "$"): string | undefined {
	if (value === "") return location;
	if (Array.isArray(value)) {
		if (value.length === 0) return location;
		for (const [index, item] of value.entries()) {
			const found = emptyValue(item, `${location}[${index}]`);
			if (found) return found;
		}
		return;
	}
	if (!value || typeof value !== "object") return;
	for (const [key, item] of Object.entries(value)) {
		const found = emptyValue(item, `${location}.${key}`);
		if (found) return found;
	}
}

function hiddenStrings(value: unknown, hidden = false): string[] {
	if (typeof value === "string") return hidden ? [value] : [];
	if (Array.isArray(value)) {
		return value.flatMap((item) => hiddenStrings(item, hidden));
	}
	if (!value || typeof value !== "object") return [];
	const record = value as Record<string, unknown>;
	return Object.values(record).flatMap((item) =>
		hiddenStrings(item, hidden || record.hidden === true),
	);
}

test("uses non-empty editable JSON files below 100 lines", async () => {
	const dataFiles = await jsonFiles(path.resolve("data"));
	const layoutFiles = await jsonFiles(path.resolve("layouts"));

	assert.ok(dataFiles.length > 0);
	assert.equal(layoutFiles.length, 4);
	for (const file of dataFiles) {
		const source = await readFile(file, "utf8");
		const value = JSON.parse(source);
		assert.equal(emptyValue(value), undefined, file);
		assert.ok(source.split("\n").length - 1 < 100, file);
		const scrubbed = source.replaceAll("University of Tehran", "");
		assert.doesNotMatch(scrubbed, /Tehran|Mashhad|Yazd|Nour, IR|Javad/, file);
	}
});

test("keeps meaningful legacy alternatives beside related data", async () => {
	const files = await jsonFiles(path.resolve("data"));
	const values = (
		await Promise.all(
			files.map(async (file) =>
				hiddenStrings(JSON.parse(await readFile(file, "utf8"))),
			),
		)
	).flat();
	const expected = [
		"PHP",
		"C++",
		"Protobuf",
		"Nuxt.js",
		"Alpine.js",
		"Semantic UI",
		"PHPUnit",
		"Digital Ocean",
		"Doctrine",
		"Eloquent",
		"Docker Compose",
		"Datadog",
		"Scrumban",
		"YAGNI",
		"KISS",
		"RDBMS",
		"XHTML",
		"Composer",
		"LEMP",
		"LAMP",
		"Secret Manager",
		"Single-Page Application",
	];
	for (const value of expected) assert.ok(values.includes(value), value);
});
