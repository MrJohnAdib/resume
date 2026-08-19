import type { z } from "zod";
import type { ResumeConfigSchema } from "../schema/config.ts";
import type { LayoutSourceSchema } from "../schema/layout.ts";
import { AwardSourceSchema } from "../schema/section-awards.ts";
import { EducationSourceSchema } from "../schema/section-education.ts";
import { ProjectSourceSchema } from "../schema/section-projects.ts";
import { SkillGroupSourceSchema } from "../schema/section-skills.ts";
import { loadItems } from "./load-items.ts";
import { loadRoles } from "./load-roles.ts";
import { normalizeProject } from "./normalize-project.ts";
import {
	normalizeAward,
	normalizeEducation,
	normalizeSkill,
} from "./normalize-sections.ts";

type SectionConfig = z.infer<typeof ResumeConfigSchema>["sections"];
type Order = z.infer<typeof LayoutSourceSchema>["order"];

export async function loadSections(
	resolve: (source: string) => string,
	section: SectionConfig,
	order: Order,
) {
	const roles = (directory: string, keys: string[]) =>
		loadRoles(resolve(directory), keys);
	const awardLike = (directory: string, keys: string[]) =>
		loadItems(resolve(directory), keys, AwardSourceSchema, normalizeAward);
	const [experience, volunteering, projects, skills, awards, talks, education] =
		await Promise.all([
			roles(section.experience.directory, order.experience),
			roles(section.volunteering.directory, order.volunteering),
			loadItems(
				resolve(section.projects.directory),
				order.projects,
				ProjectSourceSchema,
				normalizeProject,
			),
			loadItems(
				resolve(section.skills.directory),
				order.skills,
				SkillGroupSourceSchema,
				normalizeSkill,
			),
			awardLike(section.awards.directory, order.awards),
			awardLike(section.talks.directory, order.talks),
			loadItems(
				resolve(section.education.directory),
				order.education,
				EducationSourceSchema,
				normalizeEducation,
			),
		]);
	return {
		experience: { ...section.experience, items: experience },
		projects: { ...section.projects, items: projects },
		skills: { ...section.skills, items: skills },
		awards: { ...section.awards, items: awards },
		talks: { ...section.talks, items: talks },
		education: { ...section.education, items: education },
		volunteering: { ...section.volunteering, items: volunteering },
	};
}
