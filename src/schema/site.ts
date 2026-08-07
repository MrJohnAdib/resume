import { z } from "zod";

const Url = z.string().url();
export const MetadataSourceSchema = z.object({
	language: z.string().min(2),
	direction: z.enum(["ltr", "rtl"]),
	title: z.string().min(1),
	description: z.string().min(1),
	keywords: z.array(z.string().min(1)).min(1),
	author: z.string().min(1),
	authorUrl: Url,
	url: Url,
	image: Url,
	socialTitle: z.string().min(1),
	socialDescription: z.string().min(1),
	twitterCard: z.string().min(1),
});

export const ReleaseSourceSchema = z.object({
	date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
	version: z.string().min(1),
	latestVersion: z.string().min(1),
});

export const AnalyticsSourceSchema = z.object({
	measurementId: z.string().min(1),
});

export const BannerSourceSchema = z.object({
	messageBefore: z.string().min(1),
	technology: z.string().min(1),
	messageAfter: z.string().min(1),
	linkLabel: z.string().min(1),
	linkUrl: Url,
});

const Asset = z.string().min(1);
export const SiteSchema = z.object({
	metadata: MetadataSourceSchema.omit({ keywords: true }).extend({
		keywords: z.string(),
		date: ReleaseSourceSchema.shape.date,
	}),
	assets: z.object({
		favicon: Asset,
		fontStylesheet: Asset,
		resumeStylesheet: Asset,
		themeStylesheet: Asset,
		runtimeScript: Asset,
		detailedStylesheet: Asset.optional(),
		icons: z.object({
			email: Asset,
			telephone: Asset,
			location: Asset,
			badge: Asset,
		}),
	}),
	pdf: z.object({
		version: z.string(),
		latestVersion: z.string(),
		folder: z.string(),
		filePrefix: z.string(),
		buttonLabel: z.string(),
		localAction: z.literal("print"),
	}),
	analytics: AnalyticsSourceSchema.extend({
		enabled: z.literal(true),
		provider: z.literal("google"),
	}),
	banner: BannerSourceSchema.extend({ enabled: z.literal(true) }),
});
