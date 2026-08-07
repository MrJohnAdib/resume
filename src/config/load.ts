import path from "node:path";
import { ResumeConfigSchema } from "../schema/config.ts";
import { ProfileSourceSchema, SummarySourceSchema } from "../schema/person.ts";
import { ResumeSchema } from "../schema/resume.ts";
import { AwardSourceSchema } from "../schema/section-awards.ts";
import { EducationSourceSchema } from "../schema/section-education.ts";
import { SkillGroupSourceSchema } from "../schema/section-skills.ts";
import {
	AnalyticsSourceSchema,
	BannerSourceSchema,
	MetadataSourceSchema,
	ReleaseSourceSchema,
} from "../schema/site.ts";
import { loadItems } from "./load-items.ts";
import { loadLayout } from "./load-layout.ts";
import { loadRoles } from "./load-roles.ts";
import { normalizePerson } from "./normalize-person.ts";
import {
	normalizeAward,
	normalizeEducation,
	normalizeSkill,
} from "./normalize-sections.ts";
import { normalizeSite } from "./normalize-site.ts";
import { readValidated } from "./read-json.ts";
import { layoutBase } from "./site-defaults.ts";

export async function loadResumeConfig(entryFile: string, layoutFile?: string) {
	const entry = await readValidated(entryFile, ResumeConfigSchema);
	const root = path.dirname(entryFile);
	const resolve = (source: string) => path.resolve(root, source);
	const layout = await loadLayout(resolve(layoutFile ?? entry.layouts[0]));
	const section = entry.sections;
	const [
		metadata,
		release,
		analytics,
		banner,
		profile,
		summary,
		experience,
		volunteering,
		skills,
		awards,
		education,
	] = await Promise.all([
		readValidated(
			resolve(layout.metadata ?? entry.site.metadata),
			MetadataSourceSchema,
		),
		readValidated(resolve(entry.site.release), ReleaseSourceSchema),
		readValidated(resolve(entry.site.analytics), AnalyticsSourceSchema),
		readValidated(resolve(entry.site.banner), BannerSourceSchema),
		readValidated(resolve(entry.profile), ProfileSourceSchema),
		readValidated(resolve(entry.summary), SummarySourceSchema),
		loadRoles(resolve(section.experience.directory), layout.order.experience),
		loadRoles(
			resolve(section.volunteering.directory),
			layout.order.volunteering,
		),
		loadItems(
			resolve(section.skills.directory),
			layout.order.skills,
			SkillGroupSourceSchema,
			normalizeSkill,
		),
		loadItems(
			resolve(section.awards.directory),
			layout.order.awards,
			AwardSourceSchema,
			normalizeAward,
		),
		loadItems(
			resolve(section.education.directory),
			layout.order.education,
			EducationSourceSchema,
			normalizeEducation,
		),
	]);
	return ResumeSchema.parse({
		site: normalizeSite({ metadata, release, analytics, banner }, layout.name),
		person: normalizePerson(profile, summary, layoutBase(layout.name)),
		sections: {
			experience: { title: section.experience.title, items: experience },
			skills: { title: section.skills.title, items: skills },
			awards: {
				title: section.awards.title,
				href: section.awards.href,
				items: awards,
			},
			education: { title: section.education.title, items: education },
			volunteering: { title: section.volunteering.title, items: volunteering },
		},
		layout,
	});
}
