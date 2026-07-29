import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";
import { ResumeConfigSchema } from "../src/schema/config.ts";
import { LayoutSourceSchema } from "../src/schema/layout.ts";
import {
	PersonSourceSchema,
	SummarySourceSchema,
} from "../src/schema/person.ts";
import { RoleSourceSchema } from "../src/schema/role.ts";
import { AwardsSourceSchema } from "../src/schema/section-awards.ts";
import { EducationSourceSchema } from "../src/schema/section-education.ts";
import { SkillsSourceSchema } from "../src/schema/section-skills.ts";
import { SiteSourceSchema } from "../src/schema/site.ts";

const options = { target: "draft-2020-12" as const, io: "input" as const };

function definition(schema: z.ZodType) {
	const generated = z.toJSONSchema(schema, options) as Record<string, unknown>;
	generated.$schema = undefined;
	return generated;
}

async function main() {
	const output = path.resolve("schema/resume.schema.json");
	const schema = z.toJSONSchema(ResumeConfigSchema, options) as Record<
		string,
		unknown
	>;
	schema.$defs = {
		site: definition(SiteSourceSchema),
		person: definition(PersonSourceSchema),
		summary: definition(SummarySourceSchema),
		skills: definition(SkillsSourceSchema),
		awards: definition(AwardsSourceSchema),
		education: definition(EducationSourceSchema),
		role: definition(RoleSourceSchema),
		layout: definition(LayoutSourceSchema),
	};
	await mkdir(path.dirname(output), { recursive: true });
	await writeFile(output, `${JSON.stringify(schema, null, "\t")}\n`);
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
