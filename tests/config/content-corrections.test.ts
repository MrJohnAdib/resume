import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function readJson<T>(file: string): Promise<T> {
	return JSON.parse(await readFile(file, "utf8")) as T;
}

test("keeps the CEO machine date consistent with its visible date", async () => {
	const role = await readJson<{
		dates: { end: { value: string; label: string } };
	}>("data/experience/co-founder-ceo.json");

	assert.deepEqual(role.dates.end, {
		value: "2017-09-07",
		label: "09/2017",
	});
});

test("uses current, descriptive resume metadata", async () => {
	const site = await readJson<{
		metadata: Record<string, string>;
	}>("data/site.json");
	const { metadata } = site;

	assert.equal(
		metadata.title,
		"John Adib - Engineering Leader & Mentor - Resume",
	);
	assert.equal(metadata.socialTitle, metadata.title);
	assert.match(metadata.description, /Engineering Leader & Mentor/);
	assert.match(metadata.description, /leading software teams/);
	assert.equal(metadata.socialDescription, metadata.description);
	assert.match(metadata.keywords, /Engineering Leader/);
	assert.match(metadata.keywords, /Software Engineering Mentor/);
	assert.doesNotMatch(
		Object.values(metadata).join(" "),
		/Enginner|Senior Solution Architect/,
	);
});

test("uses the correct XSS and SSG expansions", async () => {
	const skills = await readJson<{
		groups: {
			items: (string | { label: string; title?: string })[];
		}[];
	}>("data/skills.json");
	const items = skills.groups.flatMap((group) => group.items);
	const titled = items.filter(
		(item): item is { label: string; title?: string } =>
			typeof item !== "string",
	);

	assert.equal(
		titled.find((item) => item.label === "XSS")?.title,
		"Cross-Site Scripting",
	);
	assert.equal(
		titled.find((item) => item.label === "SSG")?.title,
		"Static Site Generation",
	);
});

test("keeps hidden summary alternatives grammatically correct", async () => {
	const summary =
		await readJson<(string | { text: string })[]>("data/summary.json");
	const text = summary
		.filter((item): item is { text: string } => typeof item !== "string")
		.map((item) => item.text)
		.join(" ");

	assert.match(text, /in a team-oriented environment to gain/);
	assert.doesNotMatch(text, /a team-oriented environments/);
});
