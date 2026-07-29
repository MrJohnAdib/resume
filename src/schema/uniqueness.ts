import { referenceError } from "./reference-error.ts";
import type { Resume } from "./resume.ts";

type Item = Record<string, unknown> & { id: string };
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

function objectEntries(values: unknown, path: string): IdEntry[] {
	if (!Array.isArray(values)) return [];
	return values.flatMap((value, index) =>
		typeof value === "object" &&
		value !== null &&
		typeof (value as Item).id === "string"
			? [{ id: (value as Item).id, owner: value, path: `${path}[${index}].id` }]
			: [],
	);
}

export function assertUniqueIds(resume: Resume) {
	const sections = resume.sections as unknown as Record<
		string,
		{ items: Item[] }
	>;
	for (const [sectionId, section] of Object.entries(sections)) {
		assertUnique(
			section.items.map((item) => ({
				id: item.id,
				owner: item,
				path: "$.id",
			})),
			`section "${sectionId}"`,
		);
		for (const item of section.items) {
			for (const key of nestedKeys) {
				assertUnique(
					objectEntries(item[key], "$"),
					`"${sectionId}.${item.id}.${key}"`,
				);
			}
		}
	}
	const links = resume.person.links as { items: Item[] };
	assertUnique(objectEntries(links.items, "$.items"), "person links");
}
