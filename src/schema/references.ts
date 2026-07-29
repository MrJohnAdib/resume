import { referenceError } from "./reference-error.ts";
import type { Resume } from "./resume.ts";

type Item = Record<string, unknown> & { id: string };
const nestedKeys = ["bullets", "coursework", "items", "technologies"] as const;

function nestedItems(item: Item, key: (typeof nestedKeys)[number]) {
	const values = item[key];
	if (!Array.isArray(values)) return [];
	return values.filter(
		(value): value is Item =>
			typeof value === "object" &&
			value !== null &&
			typeof (value as Item).id === "string",
	);
}

function sectionMap(resume: Resume) {
	return resume.sections as unknown as Record<string, { items: Item[] }>;
}

export function assertLayoutReferences(resume: Resume) {
	const sections = sectionMap(resume);
	const links = resume.person.links as { items: Item[] };
	const linkIds = new Set(links.items.map(({ id }) => id));
	for (const [index, id] of resume.layout.links.items.entries()) {
		if (!linkIds.has(id)) {
			throw referenceError(
				resume.layout.links,
				`$.items[${index}]`,
				`Unknown link ID "${id}" in layout links`,
			);
		}
	}
	for (const [index, placement] of resume.layout.sectionOrder.entries()) {
		if (!sections[placement.id]) {
			throw referenceError(
				placement,
				`$[${index}].id`,
				`Unknown section ID "${placement.id}" in section order`,
			);
		}
	}
	for (const [sectionId, selection] of Object.entries(
		resume.layout.sections ?? {},
	)) {
		const sectionItems = sections[sectionId]?.items;
		const ids = new Set(sectionItems?.map(({ id }) => id));
		if (!ids.size) {
			throw referenceError(
				selection,
				"$.items",
				`Unknown layout section "${sectionId}"`,
			);
		}
		const contentById = new Map(sectionItems?.map((item) => [item.id, item]));
		for (const selected of selection.items as Item[]) {
			if (!ids.has(selected.id)) {
				throw referenceError(
					selected,
					"$.id",
					`Unknown item ID "${selected.id}" in "${sectionId}" layout`,
				);
			}
			const content = contentById.get(selected.id);
			if (!content) continue;
			for (const [index, field] of (selected.fields as string[]).entries()) {
				if (!(field in content)) {
					throw referenceError(
						selected,
						`$.fields[${index}]`,
						`Unknown field ID "${field}" in "${sectionId}.${selected.id}" layout`,
					);
				}
			}
			for (const key of nestedKeys) {
				const requested = selected[key];
				if (!Array.isArray(requested)) continue;
				const available = new Set(
					nestedItems(content, key).map(({ id }) => id),
				);
				for (const [index, id] of requested.entries()) {
					if (typeof id === "string" && !available.has(id)) {
						throw referenceError(
							selected,
							`$.${key}[${index}]`,
							`Unknown ${key} ID "${id}" in "${sectionId}.${selected.id}" layout`,
						);
					}
				}
			}
		}
	}
}
