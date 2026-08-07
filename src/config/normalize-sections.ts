import type { z } from "zod";
import type { AwardSourceSchema } from "../schema/section-awards.ts";
import type { EducationSourceSchema } from "../schema/section-education.ts";
import type { SkillGroupSourceSchema } from "../schema/section-skills.ts";
import { generatedKeys } from "./keys.ts";

type Award = z.infer<typeof AwardSourceSchema>;
type Education = z.infer<typeof EducationSourceSchema>;
type SkillGroup = z.infer<typeof SkillGroupSourceSchema>;

export function normalizeSkill(id: string, group: SkillGroup) {
	const lastVisible = group.items
		.map((item) => typeof item === "string" || !item.hidden)
		.lastIndexOf(true);
	return {
		id,
		title: group.title,
		items: generatedKeys(group.items, (item) =>
			typeof item === "string" ? item : item.label,
		).map(([itemId, item], index) => ({
			id: itemId,
			label: typeof item === "string" ? item : item.label,
			...(typeof item === "string" || !item.title ? {} : { title: item.title }),
			separatorAfter:
				typeof item === "string" || !item.separatorAfter
					? index === lastVisible
						? "."
						: ", "
					: item.separatorAfter,
			...(typeof item !== "string" && item.hidden
				? { hidden: true as const }
				: {}),
			...(typeof item !== "string" && item.layouts
				? { layouts: item.layouts }
				: {}),
		})),
		...(group.hidden ? { hidden: true as const } : {}),
		...(group.layouts ? { layouts: group.layouts } : {}),
	};
}

export function normalizeAward(id: string, item: Award) {
	return {
		id,
		...item,
		datePlacement:
			item.datePlacement === "before"
				? ("before-container" as const)
				: ("inside-container" as const),
	};
}

export function normalizeEducation(id: string, item: Education) {
	return {
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
	};
}
