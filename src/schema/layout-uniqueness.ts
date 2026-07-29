import { referenceError } from "./reference-error.ts";
import type { Resume } from "./resume.ts";

type IdEntry = { id: string; owner: unknown; path: string };
const nestedKeys = ["bullets", "coursework", "items", "technologies"] as const;

function assertUnique(entries: IdEntry[], context: string) {
	const seen = new Set<string>();
	for (const entry of entries) {
		if (seen.has(entry.id)) {
			throw referenceError(
				entry.owner,
				entry.path,
				`Duplicate ID "${entry.id}" in ${context}`,
			);
		}
		seen.add(entry.id);
	}
}

export function assertUniqueLayoutIds(resume: Resume) {
	assertUnique(
		resume.layout.sectionOrder.map((placement, index) => ({
			id: placement.id,
			owner: placement,
			path: `$[${index}].id`,
		})),
		"layout section order",
	);
	assertUnique(
		resume.layout.links.items.map((id, index) => ({
			id,
			owner: resume.layout.links,
			path: `$.items[${index}]`,
		})),
		"layout links",
	);
	for (const [sectionId, section] of Object.entries(resume.layout.sections)) {
		assertUnique(
			section.items.map((item) => ({ id: item.id, owner: item, path: "$.id" })),
			`"${sectionId}" layout`,
		);
		for (const item of section.items) {
			for (const key of nestedKeys) {
				const values = item[key];
				if (!values) continue;
				assertUnique(
					values.map((id, index) => ({
						id,
						owner: item,
						path: `$.${key}[${index}]`,
					})),
					`"${sectionId}.${item.id}.${key}" layout`,
				);
			}
		}
	}
}
