import { z } from "zod";
import { HiddenFields, StableItemSchema } from "./common.ts";

const SkillSourceSchema = z.union([
	z.string().min(1),
	z.object({
		label: z.string().min(1),
		title: z.string().min(1).optional(),
		separatorAfter: z.string().min(1).optional(),
		...HiddenFields,
	}),
]);

export const SkillGroupSourceSchema = z.object({
	title: z.string().min(1),
	items: z.array(SkillSourceSchema).min(1),
	...HiddenFields,
});

export const SkillGroupSchema = StableItemSchema.extend({
	title: z.string().min(1),
	items: z.array(
		StableItemSchema.extend({
			label: z.string().min(1),
			title: z.string().optional(),
			separatorAfter: z.string(),
		}),
	),
});
