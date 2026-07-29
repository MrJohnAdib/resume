import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { type ZodType, z } from "zod";
import { ResumeConfigSchema } from "../src/schema/config.ts";
import {
	LayoutSelectionSchema,
	PageSchema,
	SectionOrderSchema,
	ThemeSchema,
	TypographySchema,
} from "../src/schema/layout.ts";
import {
	ContactSchema,
	IdentitySchema,
	LinksSchema,
	SummarySchema,
} from "../src/schema/person.ts";
import { ResumeSchema } from "../src/schema/resume.ts";
import { AwardItemSchema } from "../src/schema/section-awards.ts";
import { EducationItemSchema } from "../src/schema/section-education.ts";
import {
	ExperienceBulletsSchema,
	ExperienceItemSchema,
	ExperienceProfileSchema,
	ExperienceTechnologiesSchema,
} from "../src/schema/section-experience.ts";
import { SkillGroupSchema } from "../src/schema/section-skills.ts";
import { VolunteeringItemSchema } from "../src/schema/section-volunteering.ts";
import {
	AnalyticsSchema,
	AssetsSchema,
	BannerSchema,
	ConsoleSchema,
	MetadataSchema,
	PdfSchema,
} from "../src/schema/site.ts";

const schemas: Record<string, ZodType> = {
	"resume-config": ResumeConfigSchema,
	"composed-resume": ResumeSchema,
	"site-metadata": MetadataSchema,
	"site-analytics": AnalyticsSchema,
	"site-assets": AssetsSchema,
	"site-pdf": PdfSchema,
	"site-banner": BannerSchema,
	"site-console": ConsoleSchema,
	"person-identity": IdentitySchema,
	"person-contact": ContactSchema,
	"person-links": LinksSchema,
	"person-summary": SummarySchema,
	"layout-page": PageSchema,
	"layout-theme": ThemeSchema,
	"layout-typography": TypographySchema,
	"layout-section-order": SectionOrderSchema,
	"layout-selection": LayoutSelectionSchema,
	"section-experience": ExperienceItemSchema,
	"experience-profile": ExperienceProfileSchema,
	"experience-bullets": ExperienceBulletsSchema,
	"experience-technologies": ExperienceTechnologiesSchema,
	"section-skills": SkillGroupSchema,
	"section-awards": AwardItemSchema,
	"section-education": EducationItemSchema,
	"section-volunteering": VolunteeringItemSchema,
};

async function main() {
	const root = path.resolve("schema");
	await mkdir(root, { recursive: true });
	await Promise.all(
		Object.entries(schemas).map(([name, schema]) =>
			writeFile(
				path.join(root, `${name}.schema.json`),
				`${JSON.stringify(z.toJSONSchema(schema), null, "\t")}\n`,
			),
		),
	);
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
