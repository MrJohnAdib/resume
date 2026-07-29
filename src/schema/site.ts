import { z } from "zod";

const Url = z.string().url();
const Asset = z.string().min(1);
const Color = z.string().regex(/^#[0-9a-f]{6}$/i);
export const SiteSourceSchema = z.object({
	metadata: z.object({
		language: z.string().min(2),
		direction: z.enum(["ltr", "rtl"]),
		title: z.string().min(1),
		description: z.string().min(1),
		keywords: z.string().min(1),
		date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
		author: z.string().min(1),
		authorUrl: Url,
		url: Url,
		image: Url,
		socialTitle: z.string().min(1),
		socialDescription: z.string().min(1),
		twitterCard: z.string().min(1),
		alternatives: z
			.array(
				z.object({
					keywords: z.string().min(1),
					hidden: z.literal(true),
				}),
			)
			.min(1)
			.optional(),
	}),
	analytics: z.object({ measurementId: z.string().min(1) }).optional(),
	assets: z.object({
		favicon: Asset,
		fontStylesheet: Asset,
		resumeStylesheet: Asset,
		themeStylesheet: Asset,
		runtimeScript: Asset,
		icons: z.object({
			email: Asset,
			telephone: Asset,
			location: Asset,
			badge: Asset,
		}),
	}),
	pdf: z.object({
		version: z.string().min(1),
		latestVersion: z.string().min(1),
		folder: z.string().min(1),
		filePrefix: z.string().min(1),
		buttonLabel: z.string().min(1),
		localAction: z.enum(["print", "hide"]).optional(),
	}),
	banner: z
		.object({
			messageBefore: z.string().min(1),
			technology: z.string().min(1),
			messageAfter: z.string().min(1),
			linkLabel: z.string().min(1),
			linkUrl: Url,
			gradientFrom: Color,
			gradientTo: Color,
			clipPath: z.string().min(1),
		})
		.optional(),
	console: z
		.object({
			messages: z.array(z.string().min(1)).min(1),
			art: z.string().min(1),
		})
		.optional(),
});
export const SiteSchema = z.object({
	metadata: SiteSourceSchema.shape.metadata,
	assets: SiteSourceSchema.shape.assets,
	pdf: SiteSourceSchema.shape.pdf.extend({
		localAction: z.enum(["print", "hide"]),
	}),
	analytics: z.object({
		enabled: z.boolean(),
		provider: z.literal("google"),
		measurementId: z.string(),
	}),
	banner: SiteSourceSchema.shape.banner.unwrap().extend({
		enabled: z.literal(true),
	}),
	console: z.object({
		enabled: z.literal(true),
		messages: z.array(z.string()),
		art: z.array(z.string()),
	}),
});
