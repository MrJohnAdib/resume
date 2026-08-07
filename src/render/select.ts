import type { Resume } from "../schema/resume.ts";

type RecordValue = Record<string, unknown>;
export type SectionId = keyof Resume["sections"];

const fields: Record<SectionId, string[]> = {
	experience: ["title", "organization", "employmentType", "duration", "dates"],
	skills: ["title", "items"],
	awards: ["title", "description", "date"],
	education: ["degree", "institution"],
	volunteering: ["title", "organization", "duration", "dates"],
};

type Selectable = { hidden?: true; layouts?: string[] };

export function visible<T extends Selectable>(items: T[], layout: string) {
	return items.filter(
		({ hidden, layouts }) => !hidden && (!layouts || layouts.includes(layout)),
	);
}

export function selectSection(
	resume: Resume,
	id: SectionId,
	fieldMap = fields,
) {
	const layout = resume.layout.name;
	const section = resume.sections[id] as {
		title: string;
		href?: string;
		items: RecordValue[];
	};
	const chosen = resume.layout.records?.[id];
	const items = visible(
		section.items as Array<RecordValue & Selectable & { id: string }>,
		layout,
	)
		.filter((item) => !chosen || chosen.includes(item.id))
		.map((item) => ({
			...item,
			fields: fieldMap[id],
			bullets: visible(
				(item.bullets ?? []) as Array<RecordValue & Selectable>,
				layout,
			),
			coursework: visible(
				(item.coursework ?? []) as Array<RecordValue & Selectable>,
				layout,
			),
			items: visible(
				(item.items ?? []) as Array<RecordValue & Selectable>,
				layout,
			),
			thesis: visible(
				(item.thesis ? [item.thesis] : []) as Array<RecordValue & Selectable>,
				layout,
			)[0],
			technologies: item.technologies ?? [],
		}));
	return { id, title: section.title, href: section.href, items };
}

export function createCompactView(resume: Resume) {
	const sections = resume.layout.sections.map(({ type, column }) => ({
		...selectSection(resume, type),
		column,
	}));
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
		leftSections: sections.filter(({ column }) => column === "left"),
		rightSections: sections.filter(({ column }) => column === "right"),
	};
}

export type CompactView = ReturnType<typeof createCompactView>;
export type ViewSection = CompactView["leftSections"][number];
