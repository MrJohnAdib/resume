import { z } from "zod";
import {
	DateLabelSchema,
	HiddenFields,
	RichTextSchema,
	StableItemSchema,
} from "./common.ts";

const CourseSourceSchema = z.union([
	z.string().min(1),
	z.object({ label: z.string().min(1), ...HiddenFields }),
]);

export const EducationSourceSchema = z.object({
	degree: z.string().min(1),
	institution: z.string().min(1),
	employmentType: z.string().min(1).optional(),
	location: z.string().min(1).optional(),
	dates: z.array(DateLabelSchema).min(1).optional(),
	thesis: z.object({ text: RichTextSchema, ...HiddenFields }).optional(),
	coursework: z.array(CourseSourceSchema).min(1).optional(),
	...HiddenFields,
});

export const EducationItemSchema = StableItemSchema.extend({
	degree: z.string().min(1),
	institution: z.string().min(1),
	employmentType: z.string().optional(),
	location: z.string().optional(),
	dates: z.array(DateLabelSchema),
	thesis: StableItemSchema.extend({ text: RichTextSchema }).optional(),
	coursework: z.array(StableItemSchema.extend({ label: z.string().min(1) })),
});
