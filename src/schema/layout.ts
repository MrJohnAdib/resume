import { z } from "zod";
import { SlugSchema } from "./common.ts";

const CssLength = z.string().regex(/^\d+(?:\.\d+)?(?:mm|px|rem|%)$/);
const Color = z.string().regex(/^#[0-9a-f]{6}$/i);
const SectionType = z.enum([
	"experience",
	"skills",
	"awards",
	"education",
	"volunteering",
]);
const unique = <T>(items: T[]) => new Set(items).size === items.length;
const RoleOrder = z
	.array(SlugSchema)
	.min(1)
	.refine(unique, "Role order must not contain duplicates");

export const LayoutSourceSchema = z.object({
	page: z.object({
		label: z.string().min(1),
		size: z.string().min(1),
		width: CssLength,
		height: CssLength,
		screenPadding: CssLength,
		outerMargin: CssLength,
		columnGap: CssLength,
		leftColumn: CssLength,
		rightColumn: CssLength,
	}),
	theme: z.object({
		primary: Color,
		primaryHover: Color,
		primaryFocus: Color,
		pageBackground: Color,
		headerBackground: Color,
		contactBackground: Color,
		screenBackground: Color,
		screenBackgroundDark: Color,
		text: Color,
		heading: Color,
		muted: Color,
	}),
	typography: z.object({
		bodyFont: z.string().min(1),
		rtlFont: z.string().min(1),
		nameSize: CssLength,
		titleSize: CssLength,
		bodySize: CssLength,
		detailSize: CssLength,
		bodyLineHeight: z.string().regex(/^\d+(?:\.\d+)?$/),
	}),
	sections: z
		.array(z.object({ type: SectionType, column: z.enum(["left", "right"]) }))
		.min(1)
		.refine(
			(items) => unique(items.map(({ type }) => type)),
			"Section order must not contain duplicates",
		),
	roles: z.object({
		experience: RoleOrder,
		volunteering: RoleOrder,
	}),
});

export type Layout = z.infer<typeof LayoutSourceSchema>;
