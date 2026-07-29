import { z } from "zod";
import { DateLabelSchema, RichTextSchema, StableItemSchema } from "./common.ts";

export const AwardItemSchema = StableItemSchema.extend({
	title: z.string().min(1),
	location: z.string(),
	description: RichTextSchema,
	date: DateLabelSchema,
	datePlacement: z.enum(["before-container", "inside-container"]),
});
