import { z } from "zod";

const WebUrlSchema = z.string().url();
const AssetPathSchema = z.string().min(1);

export const MetadataSchema = z.object({
	language: z.string().min(2),
	direction: z.enum(["ltr", "rtl"]),
	title: z.string().min(1),
	description: z.string(),
	keywords: z.string(),
	date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
	author: z.string().min(1),
	authorUrl: WebUrlSchema,
	url: WebUrlSchema,
	image: WebUrlSchema,
	socialTitle: z.string(),
	socialDescription: z.string(),
	twitterCard: z.string().min(1),
});

export const AnalyticsSchema = z.object({
	enabled: z.boolean(),
	provider: z.string().min(1),
	measurementId: z.string().regex(/^[A-Z0-9-]+$/),
});

export const AssetsSchema = z.object({
	favicon: AssetPathSchema,
	fontStylesheet: AssetPathSchema,
	resumeStylesheet: AssetPathSchema,
	themeStylesheet: AssetPathSchema,
	runtimeScript: AssetPathSchema,
	icons: z.object({
		email: AssetPathSchema,
		telephone: AssetPathSchema,
		location: AssetPathSchema,
		badge: AssetPathSchema,
	}),
});

export const PdfSchema = z.object({
	version: z.string().regex(/^v\d+(?:\.\d+)+$/),
	latestVersion: z.string().regex(/^v\d+(?:\.\d+)+$/),
	folder: z.string().regex(/^(?:\.\/)?[a-zA-Z0-9_./-]+\/$/),
	filePrefix: z.string().regex(/^[a-zA-Z0-9_-]+$/),
	buttonLabel: z.string().min(1),
	localAction: z.enum(["print", "hide"]),
});

export const BannerSchema = z.object({
	enabled: z.boolean(),
	messageBefore: z.string(),
	technology: z.string(),
	messageAfter: z.string(),
	linkLabel: z.string(),
	linkUrl: WebUrlSchema,
	gradientFrom: z.string().regex(/^#[0-9a-f]{6}$/i),
	gradientTo: z.string().regex(/^#[0-9a-f]{6}$/i),
	clipPath: z.string().min(1),
});

export const ConsoleSchema = z.object({
	enabled: z.boolean(),
	messages: z.array(z.string()),
	art: z.array(z.string()),
});

export const SiteSchema = z.object({
	metadata: MetadataSchema,
	analytics: AnalyticsSchema,
	assets: AssetsSchema,
	pdf: PdfSchema,
	banner: BannerSchema,
	console: ConsoleSchema,
});
