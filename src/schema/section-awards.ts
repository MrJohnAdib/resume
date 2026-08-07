import { z } from "zod";
import {
	DateLabelSchema,
	HiddenFields,
	LayoutFields,
	RichTextSchema,
	StableItemSchema,
} from "./common.ts";

export const AwardSourceSchema = z.object({
	title: z.string().min(1),
	location: z.string().min(1).optional(),
	description: RichTextSchema,
	date: DateLabelSchema,
	datePlacement: z.literal("before").optional(),
	...HiddenFields,
	...LayoutFields,
});

export const AwardItemSchema = StableItemSchema.extend({
	title: z.string().min(1),
	location: z.string().min(1).optional(),
	description: RichTextSchema,
	date: DateLabelSchema,
	datePlacement: z.enum(["before-container", "inside-container"]),
});
