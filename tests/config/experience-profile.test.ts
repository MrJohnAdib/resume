import assert from "node:assert/strict";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { loadItem } from "../../src/config/load-item.ts";
import {
	ExperienceItemSchema,
	ExperienceProfileSchema,
} from "../../src/schema/section-experience.ts";

async function writeJson(file: string, value: unknown) {
	await mkdir(path.dirname(file), { recursive: true });
	await writeFile(file, JSON.stringify(value));
}

const profile = {
	title: "Example role",
	organization: { name: "Example", url: "" },
	employmentType: "Full-time",
	location: "GB",
	duration: "(1 year)",
	dynamicDuration: false,
	dates: {
		start: { datetime: "2024-01", label: "01/2024" },
		end: { datetime: "present", label: "Present" },
	},
};

async function fixture(profileValue: unknown) {
	const root = await mkdtemp(path.join(tmpdir(), "resume-profile-"));
	const manifest = path.join(root, "index.json");
	await writeJson(manifest, {
		id: "manifest-id",
		status: "current",
		files: {
			profile: "profile.json",
			bullets: "bullets.json",
			technologies: "technologies.json",
		},
	});
	await writeJson(path.join(root, "profile.json"), profileValue);
	await writeJson(path.join(root, "bullets.json"), []);
	await writeJson(path.join(root, "technologies.json"), []);
	return manifest;
}

test("experience manifest owns the stable ID and status", async () => {
	const manifest = await fixture(profile);
	const item = (await loadItem(manifest, ExperienceItemSchema, {
		profile: ExperienceProfileSchema,
	})) as { id: string; status: string };
	assert.deepEqual(
		{ id: item.id, status: item.status },
		{ id: "manifest-id", status: "current" },
	);
});

test("experience profiles reject a second stable ID", async () => {
	const manifest = await fixture({ ...profile, id: "profile-id" });
	await assert.rejects(
		loadItem(manifest, ExperienceItemSchema, {
			profile: ExperienceProfileSchema,
		}),
		/profile\.json.*Unrecognized key/s,
	);
});
