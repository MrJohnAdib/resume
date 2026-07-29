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

export const ContentStatusSchema = z.enum(["current", "alternate", "archived"]);

export const InlineNodeSchema = z.discriminatedUnion("type", [
	z.object({ type: z.literal("text"), value: z.string() }),
	z.object({ type: z.literal("abbr"), value: z.string(), title: z.string() }),
	z.object({ type: z.literal("sup"), value: z.string() }),
]);

export const RichTextSchema = z.union([z.string(), z.array(InlineNodeSchema)]);

export const DateLabelSchema = z.object({
	datetime: z
		.string()
		.regex(
			/^(?:\d{4}(?:-(?:0[1-9]|1[0-2])(?:-(?:0[1-9]|[12]\d|3[01]))?)?|present)$/,
		)
		.refine(validCalendarDate, "Invalid calendar date"),
	label: z.string(),
});

export const DateRangeSchema = z.object({
	start: DateLabelSchema,
	end: DateLabelSchema,
});

export const OrganizationSchema = z
	.object({
		name: z.string().min(1),
		url: z.string(),
		linkEnabled: z.boolean().optional(),
	})
	.loose();

export const StableItemSchema = z
	.object({
		id: z
			.string()
			.min(1)
			.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
		status: ContentStatusSchema.optional(),
	})
	.loose();

export const BulletSchema = StableItemSchema.extend({
	text: RichTextSchema,
	annotations: z.array(InlineNodeSchema).optional(),
});

export const TechnologySchema = z.object({
	id: z.string().min(1),
	label: z.string().min(1),
});

export type RichText = z.infer<typeof RichTextSchema>;
export type InlineNode = z.infer<typeof InlineNodeSchema>;
