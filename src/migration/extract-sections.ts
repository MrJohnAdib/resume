import { readFile } from "node:fs/promises";
import { load } from "cheerio";
import { extractAwards } from "./extract-awards.ts";
import { extractEducation } from "./extract-education.ts";
import { extractExperience } from "./extract-experience.ts";
import { extractSkills } from "./extract-skills.ts";
import { extractVolunteering } from "./extract-volunteering.ts";

type ExtractedItem = {
	id: string;
	status: string;
	bullets?: Array<{ id: string; status?: string }>;
	items?: Array<{ id: string }>;
	technologies?: Array<{ id: string }>;
};

const fields: Record<string, string[]> = {
	experience: ["title", "organization", "employmentType", "duration", "dates"],
	skills: ["title", "items"],
	awards: ["title", "description", "date"],
	education: ["degree", "institution"],
	volunteering: ["title", "organization", "duration", "dates"],
};

function compactItems(sectionId: string, items: ExtractedItem[]) {
	return items
		.filter(({ status }) => status === "current")
		.map((item) => ({
			id: item.id,
			fields: fields[sectionId],
			bullets: item.bullets
				?.filter(({ status }) => status !== "alternate")
				.map(({ id }) => id),
			items: item.items?.map(({ id }) => id),
			technologies: item.technologies ? [] : undefined,
		}));
}

export async function extractLegacySections(file: string) {
	const $ = load(await readFile(file, "utf8"));
	const content = {
		experience: extractExperience($),
		skills: extractSkills($),
		awards: extractAwards($),
		education: extractEducation($),
		volunteering: extractVolunteering($),
	};
	return {
		content,
		layout: Object.fromEntries(
			Object.entries(content).map(([id, items]) => [
				id,
				{ items: compactItems(id, items) },
			]),
		),
	};
}
