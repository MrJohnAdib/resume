import { z } from "zod";
import { LayoutSchema } from "./layout.ts";
import { PersonSchema } from "./person.ts";
import { SectionsSchema } from "./sections.ts";
import { SiteSchema } from "./site.ts";

export const ResumeSchema = z.object({
	schemaVersion: z.literal("1.0.0"),
	site: SiteSchema,
	person: PersonSchema,
	sections: SectionsSchema,
	layout: LayoutSchema,
});

export type Resume = z.infer<typeof ResumeSchema>;
