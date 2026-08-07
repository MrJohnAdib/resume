import { z } from "zod";
import {
	BulletSchema,
	BulletSourceSchema,
	DateLabelSchema,
	DateValueSchema,
	HiddenFields,
	LayoutFields,
	StableItemSchema,
} from "./common.ts";

const DateSourceSchema = z.union([
	DateValueSchema,
	z.object({ value: DateValueSchema, label: z.string().min(1) }),
]);

const OrganizationSourceSchema = z.object({
	name: z.string().min(1),
	url: z.string().url().optional(),
	website: z
		.object({ href: z.string().url(), hidden: z.literal(true) })
		.optional(),
});

export const RoleSourceSchema = z.object({
	title: z.string().min(1),
	organization: OrganizationSourceSchema,
	employmentType: z.string().min(1).optional(),
	location: z.string().min(1).optional(),
	dates: z.object({ start: DateSourceSchema, end: DateSourceSchema }),
	bullets: z.array(BulletSourceSchema).min(1).optional(),
	technologies: z.array(z.string().min(1)).min(1).optional(),
	...HiddenFields,
	...LayoutFields,
});

export const RoleSchema = StableItemSchema.extend({
	title: z.string().min(1),
	organization: z.object({
		name: z.string().min(1),
		url: z.string().url().optional(),
		linkEnabled: z.boolean().optional(),
	}),
	employmentType: z.string().min(1).optional(),
	location: z.string().min(1).optional(),
	duration: z.string().min(1),
	dynamicDuration: z.boolean(),
	dates: z.object({ start: DateLabelSchema, end: DateLabelSchema }),
	bullets: z.array(BulletSchema),
	technologies: z.array(StableItemSchema.extend({ label: z.string().min(1) })),
});
