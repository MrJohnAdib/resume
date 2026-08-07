import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { loadResumeConfig } from "../../src/config/load.ts";

function hasKey(value: unknown, key: string): boolean {
	if (Array.isArray(value)) return value.some((item) => hasKey(item, key));
	if (!value || typeof value !== "object") return false;
	const object = value as Record<string, unknown>;
	return (
		key in object || Object.values(object).some((item) => hasKey(item, key))
	);
}

test("loads generated keys and automatic presentation behavior", async () => {
	const resume = await loadResumeConfig(path.resolve("resume.config.json"));

	assert.equal(
		resume.sections.experience.items[0]?.id,
		"2024-zapp-engineering-manager",
	);
	assert.equal(
		resume.sections.experience.items.find(
			({ id }) => id === "2026-zapp-consumer-engineering-manager",
		)?.hidden,
		true,
	);
	assert.equal(resume.person.identity.avatar?.alt, resume.person.identity.name);
	assert.equal(resume.person.contact.phone.href, "tel:+447393633145");
	assert.equal(resume.sections.awards.href, "https://mradib.com/awards");
	assert.equal(
		resume.sections.experience.items.find(({ id }) => id === "2015-sarshomar")
			?.dates?.end.label,
		"09/2017",
	);
	assert.equal(hasKey(resume, "status"), false);
});

test("keeps editable data concise and free of repeated metadata", async () => {
	const roleFile = path.resolve(
		"data/experience/2024-zapp-engineering-manager.json",
	);
	const role = JSON.parse(await readFile(roleFile, "utf8"));

	assert.equal(hasKey(role, "id"), false);
	assert.equal(hasKey(role, "status"), false);
	assert.equal(hasKey(role, "duration"), false);
	assert.equal(
		role.bullets.some((bullet: unknown) => typeof bullet === "string"),
		true,
	);
	assert.equal(
		role.bullets.some((bullet: { hidden?: boolean }) => bullet.hidden === true),
		true,
	);
});
