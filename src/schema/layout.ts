import { z } from "zod";
import { SlugSchema } from "./common.ts";

const SectionType = z.enum([
	"experience",
	"skills",
	"awards",
	"education",
	"volunteering",
]);
const unique = <T>(items: T[]) => new Set(items).size === items.length;
const Order = z
	.array(SlugSchema)
	.min(1)
	.refine(unique, "Order must not contain duplicates");
const PageMap = z.record(SlugSchema, z.number().int().min(1));

const SectionEntry = z.object({
	type: SectionType,
	column: z.enum(["left", "right"]).optional(),
	page: z.number().int().min(1).optional(),
});

const Sections = z
	.array(SectionEntry)
	.min(1)
	.refine(
		(items) => unique(items.map(({ type }) => type)),
		"Section order must not contain duplicates",
	)
	.refine(
		(items) =>
			items.every(
				(item) => (item.column === undefined) !== (item.page === undefined),
			),
		"Each section needs exactly one of column or page",
	)
	.refine(
		(items) =>
			items.every(
				(item) =>
					(item.column === undefined) === (items[0]?.column === undefined),
			),
		"Sections must all use columns or all use pages",
	);

export const LayoutSourceSchema = z.object({
	sections: Sections,
	order: z.object({
		experience: Order,
		skills: Order,
		awards: Order,
		education: Order,
		volunteering: Order,
	}),
	pageBreaks: z
		.object({
			experience: PageMap,
			skills: PageMap,
			awards: PageMap,
			education: PageMap,
			volunteering: PageMap,
		})
		.partial()
		.optional(),
	metadata: z.string().min(1).optional(),
});

export const LayoutSchema = LayoutSourceSchema.extend({ name: SlugSchema });

export type Layout = z.infer<typeof LayoutSchema>;
