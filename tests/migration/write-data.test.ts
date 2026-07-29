import assert from "node:assert/strict";
import { mkdtemp, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { loadItem } from "../../src/config/load-item.ts";
import { writeSection } from "../../src/migration/write-data.ts";
import {
	ExperienceItemSchema,
	ExperienceProfileSchema,
} from "../../src/schema/section-experience.ts";

test("generated experience files round-trip through production schemas", async () => {
	const root = await mkdtemp(path.join(tmpdir(), "resume-migration-"));
	const item = {
		id: "alternate-role",
		status: "alternate",
		title: "Alternate role",
		organization: { name: "Example", url: "", linkEnabled: false },
		employmentType: "Full-time",
		location: "GB",
		duration: "(1 year)",
		dynamicDuration: false,
		dates: {
			start: { datetime: "2024-01", label: "01/2024" },
			end: { datetime: "2024-12", label: "12/2024" },
		},
		bullets: [],
		technologies: [],
	};
	await writeSection(root, "experience", [item]);

	const manifest = path.join(root, "experience/alternate-role/index.json");
	const loaded = (await loadItem(manifest, ExperienceItemSchema, {
		profile: ExperienceProfileSchema,
	})) as typeof item;
	assert.equal(loaded.id, "alternate-role");
	assert.equal(loaded.status, "alternate");

	const profile = JSON.parse(
		await readFile(
			path.join(root, "experience/alternate-role/profile.json"),
			"utf8",
		),
	);
	assert.equal("id" in profile, false);
	assert.equal("status" in profile, false);
});
