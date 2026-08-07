import type { Resume } from "../schema/resume.ts";
import {
	type SectionId,
	type ViewSection,
	selectSection,
	visible,
} from "./select.ts";

const detailedFields: Record<SectionId, string[]> = {
	experience: [
		"title",
		"organization",
		"employmentType",
		"location",
		"duration",
		"dates",
	],
	skills: ["title", "items"],
	awards: ["title", "description", "date"],
	education: [
		"degree",
		"institution",
		"employmentType",
		"location",
		"dates",
		"thesis",
		"coursework",
	],
	volunteering: ["title", "organization", "duration", "dates"],
};

function paginate(resume: Resume) {
	const pages = new Map<number, ViewSection[]>();
	for (const { type, page } of resume.layout.sections) {
		const section = { ...selectSection(resume, type, detailedFields) };
		if (type === "experience") {
			section.items = section.items.map((item, index) =>
				index < 3 ? item : { ...item, technologies: [] },
			);
		}
		const breaks = resume.layout.pageBreaks?.[type] ?? {};
		const buckets = new Map<number, typeof section.items>();
		let current = page ?? 1;
		for (const item of section.items) {
			current = breaks[(item as unknown as { id: string }).id] ?? current;
			buckets.set(current, [...(buckets.get(current) ?? []), item]);
		}
		for (const [number, items] of buckets) {
			const sections = pages.get(number) ?? [];
			sections.push({ ...section, items, column: undefined } as ViewSection);
			pages.set(number, sections);
		}
	}
	return [...pages.entries()]
		.sort(([a], [b]) => a - b)
		.map(([number, sections]) => ({ number, sections }));
}

export function createCvView(resume: Resume) {
	const links = visible(resume.person.links.items, resume.layout.name);
	const summary = visible(resume.person.summary.items, resume.layout.name).map(
		({ text }) => text,
	);
	return {
		...resume,
		person: {
			...resume.person,
			links: { items: links },
			summary: { items: summary },
		},
		runtimeConfig: {
			pdf: resume.site.pdf,
		},
		pages: paginate(resume),
	};
}

export type CvView = ReturnType<typeof createCvView>;
