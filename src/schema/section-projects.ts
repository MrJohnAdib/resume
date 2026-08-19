import { z } from "zod";
import {
	BulletSchema,
	BulletSourceSchema,
	HiddenFields,
	LayoutFields,
	StableItemSchema,
} from "./common.ts";

export const ProjectSourceSchema = z.object({
	title: z.string().min(1).optional(),
	bullets: z.array(BulletSourceSchema).min(1),
	technologies: z.array(z.string().min(1)).min(1).optional(),
	...HiddenFields,
	...LayoutFields,
});

export const ProjectItemSchema = StableItemSchema.extend({
	title: z.string().min(1).optional(),
	bullets: z.array(BulletSchema),
	technologies: z.array(StableItemSchema.extend({ label: z.string().min(1) })),
});
