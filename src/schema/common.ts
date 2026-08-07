import { z } from "zod";

function validCalendarDate(value: string) {
	if (value === "present") return true;
	const [year, month, day] = value.split("-").map(Number);
	if (!month || !day) return true;
	const date = new Date(Date.UTC(year, month - 1, day));
	return (
		date.getUTCFullYear() === year &&
		date.getUTCMonth() === month - 1 &&
		date.getUTCDate() === day
	);
}

export const HiddenFields = { hidden: z.literal(true).optional() };
export const SlugSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
export const LayoutFields = {
	layouts: z.array(SlugSchema).min(1).optional(),
};
export const DateValueSchema = z
	.string()
	.regex(
		/^(?:\d{4}(?:-(?:0[1-9]|1[0-2])(?:-(?:0[1-9]|[12]\d|3[01]))?)?|present)$/,
	)
	.refine(validCalendarDate, "Invalid calendar date");

export const InlineNodeSchema = z.discriminatedUnion("type", [
	z.object({ type: z.literal("text"), value: z.string() }),
	z.object({ type: z.literal("abbr"), value: z.string(), title: z.string() }),
	z.object({ type: z.literal("sup"), value: z.string() }),
]);

export const RichTextSchema = z.union([
	z.string().min(1),
	z.array(InlineNodeSchema).min(1),
]);

export const DateLabelSchema = z.object({
	datetime: DateValueSchema,
	label: z.string().min(1),
});

export const StableItemSchema = z.object({
	id: SlugSchema,
	...HiddenFields,
	...LayoutFields,
});

export const BulletSourceSchema = z.union([
	z.string().min(1),
	z.object({
		text: z.string().min(1),
		annotations: z.array(InlineNodeSchema).min(1).optional(),
		...HiddenFields,
		...LayoutFields,
	}),
]);

export const BulletSchema = StableItemSchema.extend({
	text: RichTextSchema,
	annotations: z.array(InlineNodeSchema).min(1).optional(),
});

export type RichText = z.infer<typeof RichTextSchema>;
export type InlineNode = z.infer<typeof InlineNodeSchema>;
