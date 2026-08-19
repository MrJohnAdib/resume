import path from "node:path";
import { ResumeConfigSchema } from "../schema/config.ts";
import { ProfileSourceSchema, SummarySourceSchema } from "../schema/person.ts";
import { ResumeSchema } from "../schema/resume.ts";
import {
	AnalyticsSourceSchema,
	BannerSourceSchema,
	MetadataSourceSchema,
	ReleaseSourceSchema,
} from "../schema/site.ts";
import { loadLayout } from "./load-layout.ts";
import { loadSections } from "./load-sections.ts";
import { normalizePerson } from "./normalize-person.ts";
import { normalizeSite } from "./normalize-site.ts";
import { readValidated } from "./read-json.ts";
import { layoutBase } from "./site-defaults.ts";

export async function loadResumeConfig(entryFile: string, layoutFile?: string) {
	const entry = await readValidated(entryFile, ResumeConfigSchema);
	const root = path.dirname(entryFile);
	const resolve = (source: string) => path.resolve(root, source);
	const layout = await loadLayout(resolve(layoutFile ?? entry.layouts[0]));
	const [metadata, release, analytics, banner, profile, summary, sections] =
		await Promise.all([
			readValidated(
				resolve(layout.metadata ?? entry.site.metadata),
				MetadataSourceSchema,
			),
			readValidated(resolve(entry.site.release), ReleaseSourceSchema),
			readValidated(resolve(entry.site.analytics), AnalyticsSourceSchema),
			readValidated(resolve(entry.site.banner), BannerSourceSchema),
			readValidated(resolve(entry.profile), ProfileSourceSchema),
			readValidated(resolve(entry.summary), SummarySourceSchema),
			loadSections(resolve, entry.sections, layout.order),
		]);
	return ResumeSchema.parse({
		site: normalizeSite({ metadata, release, analytics, banner }, layout.name),
		person: normalizePerson(profile, summary, layoutBase(layout.name)),
		sections,
		layout,
	});
}
