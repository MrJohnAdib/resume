import type { Resume } from "../schema/resume.ts";

type RecordValue = Record<string, unknown>;
type SectionId = keyof Resume["sections"];

const fields: Record<SectionId, string[]> = {
	experience: ["title", "organization", "employmentType", "duration", "dates"],
	skills: ["title", "items"],
	awards: ["title", "description", "date"],
	education: ["degree", "institution"],
	volunteering: ["title", "organization", "duration", "dates"],
};

function visible<T extends { hidden?: true }>(items: T[]) {
	return items.filter(({ hidden }) => !hidden);
}

function selectSection(resume: Resume, id: SectionId) {
	const section = resume.sections[id] as {
		title: string;
		href?: string;
		items: RecordValue[];
	};
	const items = visible(
		section.items as Array<RecordValue & { hidden?: true }>,
	).map((item) => ({
		...item,
		fields: fields[id],
		bullets: visible(
			(item.bullets ?? []) as Array<RecordValue & { hidden?: true }>,
		),
		coursework: visible(
			(item.coursework ?? []) as Array<RecordValue & { hidden?: true }>,
		),
		items: visible(
			(item.items ?? []) as Array<RecordValue & { hidden?: true }>,
		),
		technologies: item.technologies ?? [],
	}));
	return { id, title: section.title, href: section.href, items };
}

export function createCompactView(resume: Resume) {
	const sections = resume.layout.sections.map(({ type, column }) => ({
		...selectSection(resume, type),
		column,
	}));
	const links = visible(resume.person.links.items);
	const summary = visible(resume.person.summary.items).map(({ text }) => text);
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
		leftSections: sections.filter(({ column }) => column === "left"),
		rightSections: sections.filter(({ column }) => column === "right"),
	};
}

export type CompactView = ReturnType<typeof createCompactView>;
export type ViewSection = CompactView["leftSections"][number];
