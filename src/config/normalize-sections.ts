import type { z } from "zod";
import type { AwardsSourceSchema } from "../schema/section-awards.ts";
import type { EducationSourceSchema } from "../schema/section-education.ts";
import type { SkillsSourceSchema } from "../schema/section-skills.ts";
import { generatedKeys } from "./keys.ts";

type Awards = z.infer<typeof AwardsSourceSchema>;
type Education = z.infer<typeof EducationSourceSchema>;
type Skills = z.infer<typeof SkillsSourceSchema>;

export function normalizeSkills(section: Skills) {
	const items = generatedKeys(section.groups, ({ title }) => title).map(
		([id, group]) => {
			const sourceItems = group.items ?? [];
			const lastVisible = sourceItems
				.map((item) => typeof item === "string" || !item.hidden)
				.lastIndexOf(true);
			return {
				id,
				title: group.title,
				items: generatedKeys(sourceItems, (item) =>
					typeof item === "string" ? item : item.label,
				).map(([itemId, item], index) => ({
					id: itemId,
					label: typeof item === "string" ? item : item.label,
					...(typeof item === "string" || !item.title
						? {}
						: { title: item.title }),
					separatorAfter:
						typeof item === "string" || !item.separatorAfter
							? index === lastVisible
								? "."
								: ", "
							: item.separatorAfter,
					...(typeof item !== "string" && item.hidden
						? { hidden: true as const }
						: {}),
				})),
				...(group.hidden ? { hidden: true as const } : {}),
			};
		},
	);
	return { title: section.title, items };
}

export function normalizeAwards(section: Awards) {
	const items = generatedKeys(
		section.items,
		({ title, date }) => `${title}-${date.datetime}`,
	).map(([id, item]) => ({
		id,
		...item,
		datePlacement:
			item.datePlacement === "before"
				? ("before-container" as const)
				: ("inside-container" as const),
	}));
	return { title: section.title, href: section.href, items };
}

export function normalizeEducation(section: Education) {
	const items = generatedKeys(section.items, ({ degree }) => degree).map(
		([id, item]) => ({
			id,
			...item,
			dates: item.dates ?? [],
			thesis: item.thesis ? { id: "thesis", ...item.thesis } : undefined,
			coursework: generatedKeys(item.coursework ?? [], (course) =>
				typeof course === "string" ? course : course.label,
			).map(([courseId, course]) => ({
				id: courseId,
				label: typeof course === "string" ? course : course.label,
				...(typeof course === "string" ? {} : course),
			})),
		}),
	);
	return { title: section.title, items };
}
