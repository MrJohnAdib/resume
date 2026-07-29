import type { Resume } from "../schema/resume.ts";

type RecordValue = Record<string, unknown>;

function selectNested(
	item: RecordValue,
	selection: RecordValue,
	key: "bullets" | "coursework" | "items" | "technologies",
) {
	const selectedIds = selection[key] as string[] | undefined;
	const values = item[key] as RecordValue[] | undefined;
	if (!selectedIds || !values) return [];
	const byId = new Map(values.map((value) => [value.id, value]));
	return selectedIds.flatMap((id) => {
		const value = byId.get(id);
		return value ? [value] : [];
	});
}

function selectSection(resume: Resume, id: string) {
	const section = resume.sections[id] as RecordValue;
	const layout = resume.layout.sections?.[id] as RecordValue | undefined;
	const byId = new Map(
		(section.items as RecordValue[]).map((item) => [item.id, item]),
	);
	const selections = (layout?.items ?? []) as RecordValue[];
	const items = selections.map((selection) => {
		const item = byId.get(selection.id) as RecordValue;
		return {
			...item,
			...selection,
			bullets: selectNested(item, selection, "bullets"),
			coursework: selectNested(item, selection, "coursework"),
			items: selectNested(item, selection, "items"),
			technologies: selectNested(item, selection, "technologies"),
		};
	});
	return { id, title: section.title, items };
}

export function createCompactView(resume: Resume) {
	const sections = resume.layout.sectionOrder.map(({ id, column }) => ({
		...selectSection(resume, id),
		column,
	}));
	const person = resume.person as RecordValue;
	const personLinks = person.links as RecordValue;
	const linksById = new Map(
		(personLinks.items as RecordValue[]).map((link) => [link.id, link]),
	);
	const links = resume.layout.links.items.map((id) => linksById.get(id));
	return {
		...resume,
		person: { ...person, links: { items: links } },
		runtimeConfig: {
			pdf: resume.site.pdf,
			phone: resume.person.contact.phone,
			console: resume.site.console,
		},
		leftSections: sections.filter(({ column }) => column === "left"),
		rightSections: sections.filter(({ column }) => column === "right"),
	};
}
