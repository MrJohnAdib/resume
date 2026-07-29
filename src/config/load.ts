import path from "node:path";
import { ResumeConfigSchema } from "../schema/config.ts";
import { LayoutSourceSchema } from "../schema/layout.ts";
import { PersonSourceSchema, SummarySourceSchema } from "../schema/person.ts";
import { ResumeSchema } from "../schema/resume.ts";
import { AwardsSourceSchema } from "../schema/section-awards.ts";
import { EducationSourceSchema } from "../schema/section-education.ts";
import { SkillsSourceSchema } from "../schema/section-skills.ts";
import { SiteSourceSchema } from "../schema/site.ts";
import { loadRoles } from "./load-roles.ts";
import { normalizePerson } from "./normalize-person.ts";
import {
	normalizeAwards,
	normalizeEducation,
	normalizeSkills,
} from "./normalize-sections.ts";
import { normalizeSite } from "./normalize-site.ts";
import { readValidated } from "./read-json.ts";

export async function loadResumeConfig(entryFile: string) {
	const entry = await readValidated(entryFile, ResumeConfigSchema);
	const root = path.dirname(entryFile);
	const resolve = (source: string) => path.resolve(root, source);
	const layout = await readValidated(resolve(entry.layout), LayoutSourceSchema);
	const [site, person, summary, skills, awards, education] = await Promise.all([
		readValidated(resolve(entry.site), SiteSourceSchema),
		readValidated(resolve(entry.person), PersonSourceSchema),
		readValidated(resolve(entry.summary), SummarySourceSchema),
		readValidated(resolve(entry.sections.skills), SkillsSourceSchema),
		readValidated(resolve(entry.sections.awards), AwardsSourceSchema),
		readValidated(resolve(entry.sections.education), EducationSourceSchema),
	]);
	const [experience, volunteering] = await Promise.all([
		loadRoles(
			resolve(entry.sections.experience.directory),
			layout.roles.experience,
		),
		loadRoles(
			resolve(entry.sections.volunteering.directory),
			layout.roles.volunteering,
		),
	]);
	return ResumeSchema.parse({
		site: normalizeSite(site),
		person: normalizePerson(person, summary),
		sections: {
			experience: { title: entry.sections.experience.title, items: experience },
			skills: normalizeSkills(skills),
			awards: normalizeAwards(awards),
			education: normalizeEducation(education),
			volunteering: {
				title: entry.sections.volunteering.title,
				items: volunteering,
			},
		},
		layout,
	});
}
