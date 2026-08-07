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

export const LayoutSourceSchema = z.object({
	sections: z
		.array(z.object({ type: SectionType, column: z.enum(["left", "right"]) }))
		.min(1)
		.refine(
			(items) => unique(items.map(({ type }) => type)),
			"Section order must not contain duplicates",
		),
	order: z.object({
		experience: Order,
		skills: Order,
		awards: Order,
		education: Order,
		volunteering: Order,
	}),
});

export type Layout = z.infer<typeof LayoutSourceSchema>;
