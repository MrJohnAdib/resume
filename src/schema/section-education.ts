import { z } from "zod";
import { DateLabelSchema, RichTextSchema, StableItemSchema } from "./common.ts";

export const EducationItemSchema = StableItemSchema.extend({
	degree: z.string().min(1),
	institution: z.string().min(1),
	employmentType: z.string(),
	location: z.string(),
	dates: z.array(DateLabelSchema),
	thesis: StableItemSchema.extend({ text: RichTextSchema }).optional(),
	coursework: z.array(StableItemSchema.extend({ label: z.string().min(1) })),
});
