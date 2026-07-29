import { z } from "zod";

const CssLengthSchema = z.string().regex(/^\d+(?:\.\d+)?(?:mm|px|rem|%)$/);
const ColorSchema = z.string().regex(/^#[0-9a-f]{6}$/i);

export const PageSchema = z.object({
	id: z.string().regex(/^[a-z0-9-]+$/),
	label: z.string().min(1),
	size: z.string().min(1),
	width: CssLengthSchema,
	height: CssLengthSchema,
	screenPadding: CssLengthSchema,
	outerMargin: CssLengthSchema,
	columnGap: CssLengthSchema,
	leftColumn: CssLengthSchema,
	rightColumn: CssLengthSchema,
	overflowPolicy: z.literal("error"),
});

export const ThemeSchema = z.object({
	primary: ColorSchema,
	primaryHover: ColorSchema,
	primaryFocus: ColorSchema,
	pageBackground: ColorSchema,
	headerBackground: ColorSchema,
	contactBackground: ColorSchema,
	screenBackground: ColorSchema,
	screenBackgroundDark: ColorSchema,
	text: ColorSchema,
	heading: ColorSchema,
	muted: ColorSchema,
});

export const TypographySchema = z.object({
	bodyFont: z.string().min(1),
	rtlFont: z.string().min(1),
	nameSize: CssLengthSchema,
	titleSize: CssLengthSchema,
	bodySize: CssLengthSchema,
	detailSize: CssLengthSchema,
	bodyLineHeight: z.string().regex(/^\d+(?:\.\d+)?$/),
});

export const LayoutSelectionSchema = z.object({
	id: z.string().min(1),
	fields: z.array(z.string().min(1)),
	bullets: z.array(z.string().min(1)).optional(),
	coursework: z.array(z.string().min(1)).optional(),
	items: z.array(z.string().min(1)).optional(),
	technologies: z.array(z.string().min(1)).optional(),
});

export const LayoutSectionSchema = z.object({
	items: z.array(LayoutSelectionSchema),
});

export const SectionOrderSchema = z.array(
	z.object({
		id: z.string().min(1),
		column: z.enum(["left", "right"]),
	}),
);

export const LayoutLinksSchema = z.object({
	items: z.array(z.string().min(1)),
});

export const LayoutSchema = z.object({
	page: PageSchema,
	theme: ThemeSchema,
	typography: TypographySchema,
	sectionOrder: SectionOrderSchema,
	links: LayoutLinksSchema,
	sections: z.record(z.string(), LayoutSectionSchema),
});
