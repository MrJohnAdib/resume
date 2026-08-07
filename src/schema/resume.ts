import { z } from "zod";
import { LayoutSourceSchema } from "./layout.ts";
import { PersonSchema } from "./person.ts";
import { SectionsSchema } from "./sections.ts";
import { SiteSchema } from "./site.ts";

export const ResumeSchema = z.object({
	site: SiteSchema,
	person: PersonSchema,
	sections: SectionsSchema,
	layout: LayoutSourceSchema,
});

export type Resume = z.infer<typeof ResumeSchema>;
